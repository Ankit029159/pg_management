import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiImage, FiUpload, FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';

const Herosectionaddmanage = () => {
  const [heroSlides, setHeroSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.pg.gradezy.in/api';
  const BASE_URL = 'https://api.pg.gradezy.in'; // Fixed base URL

  // Helper function to construct image URL
  const getImageUrl = (photoPath) => {
    if (!photoPath) return '';
    
    // If it's already a full URL, return as is
    if (photoPath.startsWith('http')) return photoPath;
    
    // If it starts with /uploads, it's already a relative path
    if (photoPath.startsWith('/uploads')) {
      return `${BASE_URL}${photoPath}`;
    }
    
    // If it's just a filename, construct the full path
    return `${BASE_URL}/uploads/hero/${photoPath}`;
  };

  // Fetch hero slides on component mount
  useEffect(() => {
    fetchHeroSlides();
  }, []);

  const fetchHeroSlides = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/hero/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setHeroSlides(response.data.data);
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      setError('Failed to fetch hero slides');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!editingSlide && !selectedFile) errors.photo = 'Please select an image';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({ ...prev, photo: 'Please select a valid image file' }));
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, photo: 'File size must be less than 10MB' }));
        return;
      }

      setSelectedFile(file);
      setFormErrors(prev => ({ ...prev, photo: '' }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setUploading(true);
      const token = localStorage.getItem('adminToken');
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('order', formData.order);
      
      if (selectedFile) {
        formDataToSend.append('photo', selectedFile);
      }

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editingSlide) {
        // Update existing slide
        await axios.put(`${API_URL}/hero/${editingSlide._id}`, formDataToSend, config);
      } else {
        // Create new slide
        await axios.post(`${API_URL}/hero`, formDataToSend, config);
      }

      // Reset form and refresh data
      resetForm();
      fetchHeroSlides();
    } catch (error) {
      console.error('Error saving hero slide:', error);
      
      // Handle specific error types
      if (error.response?.status === 413) {
        setError('File too large. Please upload a smaller image (max 10MB).');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else if (error.message === 'Network Error') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to save hero slide. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || '',
      description: slide.description || '',
      order: slide.order || 0
    });
    setSelectedFile(null);
    setPreviewUrl(slide.photo ? getImageUrl(slide.photo) : '');
    setIsFormOpen(true);
  };

  const handleDelete = async (slideId) => {
    if (!window.confirm('Are you sure you want to delete this hero slide?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/hero/${slideId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHeroSlides();
    } catch (error) {
      console.error('Error deleting hero slide:', error);
      setError('Failed to delete hero slide');
    }
  };

  const toggleSlideStatus = async (slide) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${API_URL}/hero/${slide._id}`, {
        isActive: !slide.isActive
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHeroSlides();
    } catch (error) {
      console.error('Error toggling slide status:', error);
      setError('Failed to update slide status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      order: 0
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setFormErrors({});
    setEditingSlide(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Hero Section Management</h1>
          <p className="text-gray-600">Manage your hero section slides and content</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Add Hero Slide
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Hero Slides List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {heroSlides.map((slide) => (
          <div key={slide._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-100 relative">
              <img
                src={getImageUrl(slide.photo)}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log('Hero Image failed to load:', e.target.src);
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
                onLoad={() => {
                  console.log('Hero Image loaded successfully:', getImageUrl(slide.photo));
                }}
              />
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => toggleSlideStatus(slide)}
                  className={`p-2 rounded-full ${
                    slide.isActive 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}
                  title={slide.isActive ? 'Active' : 'Inactive'}
                >
                  {slide.isActive ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{slide.title}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Order: {slide.order}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{slide.description}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(slide)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <FiEdit className="mr-1" size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(slide._id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                >
                  <FiTrash2 className="mr-1" size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {heroSlides.length === 0 && !loading && (
        <div className="text-center py-12">
          <FiImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hero slides yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first hero slide</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Hero Slide
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
                  {editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter slide title"
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter slide description"
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter display order (0, 1, 2...)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hero Image {!editingSlide && '*'}
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      {previewUrl ? (
                        <div className="mb-4">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="mx-auto h-32 w-auto object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="photo"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileSelect}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                  {formErrors.photo && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.photo}</p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <FiSave className="mr-2" />
                    )}
                    {uploading ? 'Uploading...' : (editingSlide ? 'Update' : 'Save')}
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

export default Herosectionaddmanage;
