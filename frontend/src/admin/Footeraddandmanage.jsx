import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import axios from 'axios';

const FooterAddAndManage = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFooter, setEditingFooter] = useState(null);
  const [formData, setFormData] = useState({
    callNumber: '',
    whatsappNumber: '',
    email: '',
    address: '',
    visitHours: 'Monday - Sunday\n9:00 AM - 8:00 PM'
  });
  const [formErrors, setFormErrors] = useState({});

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  // Fetch footer data on component mount
  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/footer`);
      setFooterData(response.data.data);
    } catch (error) {
      console.error('Error fetching footer data:', error);
      // If it's a 404 or the response indicates no data found, set footerData to null
      if (error.response?.status === 404 || 
          (error.response?.data?.success === false && error.response?.data?.message === 'Footer data not found')) {
        setFooterData(null);
        setError(''); // Clear any previous errors
      } else {
        setError('Failed to fetch footer data');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.callNumber.trim()) errors.callNumber = 'Call number is required';
    if (!formData.whatsappNumber.trim()) errors.whatsappNumber = 'WhatsApp number is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.visitHours.trim()) errors.visitHours = 'Visit hours are required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editingFooter) {
        // Update existing footer
        await axios.put(`${API_URL}/footer/${editingFooter._id}`, formData, config);
      } else {
        // Create new footer
        await axios.post(`${API_URL}/footer`, formData, config);
      }

      // Reset form and refresh data
      resetForm();
      fetchFooterData();
    } catch (error) {
      console.error('Error saving footer data:', error);
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        setError('Failed to save footer data');
      }
    }
  };

  const handleEdit = (footer) => {
    setEditingFooter(footer);
    setFormData({
      callNumber: footer.callNumber || '',
      whatsappNumber: footer.whatsappNumber || '',
      email: footer.email || '',
      address: footer.address || '',
      visitHours: footer.visitHours || 'Monday - Sunday\n9:00 AM - 8:00 PM'
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (footerId) => {
    if (!window.confirm('Are you sure you want to delete this footer data?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/footer/${footerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFooterData();
    } catch (error) {
      console.error('Error deleting footer data:', error);
      setError('Failed to delete footer data');
    }
  };

  const resetForm = () => {
    setFormData({
      callNumber: '',
      whatsappNumber: '',
      email: '',
      address: '',
      visitHours: 'Monday - Sunday\n9:00 AM - 8:00 PM'
    });
    setFormErrors({});
    setEditingFooter(null);
    setIsFormOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Footer Management</h1>
          <p className="text-gray-600">Manage your PG contact information and facilities</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          {footerData ? 'Edit Footer Data' : 'Add Footer Data'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Footer Data Display */}
      {footerData ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Call:</strong> {footerData.callNumber}</p>
                  <p><strong>WhatsApp:</strong> {footerData.whatsappNumber}</p>
                  <p><strong>Email:</strong> {footerData.email}</p>
                  <p><strong>Address:</strong> {footerData.address}</p>
                  <p><strong>Visit Hours:</strong></p>
                  <p className="whitespace-pre-line text-gray-600">{footerData.visitHours}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(footerData)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <FiEdit className="mr-1" size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(footerData._id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                >
                  <FiTrash2 className="mr-1" size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Empty State */}
      {!footerData && !loading && (
        <div className="text-center py-12">
          <FiMail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No footer data yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your PG contact information and visit hours</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Footer Data
          </button>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingFooter ? 'Edit Footer Data' : 'Add Footer Data'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Call Number *
                    </label>
                    <input
                      type="tel"
                      name="callNumber"
                      value={formData.callNumber}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.callNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter call number"
                    />
                    {formErrors.callNumber && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.callNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.whatsappNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter WhatsApp number"
                    />
                    {formErrors.whatsappNumber && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.whatsappNumber}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter PG address"
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visit Hours *
                  </label>
                  <textarea
                    name="visitHours"
                    value={formData.visitHours}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.visitHours ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter visit hours"
                  />
                  {formErrors.visitHours && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.visitHours}</p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">Note:</h4>
                  <p className="text-xs text-blue-700">
                    Facilities will be automatically populated from the Services you add in the Services Management section.
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <FiSave className="mr-2" />
                    {editingFooter ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterAddAndManage;
