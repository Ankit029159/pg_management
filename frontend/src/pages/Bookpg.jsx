

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Bookpg() {
  const [allBeds, setAllBeds] = useState([]);
  const [filteredBeds, setFilteredBeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedBed, setSelectedBed] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // User Information Form State
  const [userForm, setUserForm] = useState({
    fullName: '',
    mobileNumber: '',
    whatsappNumber: '',
    email: '',
    checkInDate: '',
    checkOutDate: '',
    sameAsMobile: false
  });

  // Filter State
  const [filters, setFilters] = useState({
    showOnlyAvailable: false,
    roomType: '',
    maxPrice: '',
    buildingName: ''
  });

  const API_BASE_URL = 'https://api.pg.gradezy.in/api';

  useEffect(() => {
    fetchAllBeds();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allBeds, filters]);

  const fetchAllBeds = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/beds/all`);
      setAllBeds(response.data.data);
    } catch (error) {
      console.error('Error fetching beds:', error);
      setMessage('Error loading bed availability');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allBeds];

    // Filter by availability
    if (filters.showOnlyAvailable) {
      filtered = filtered.filter(bed => bed.status === 'Available');
    }

    // Filter by room type
    if (filters.roomType) {
      filtered = filtered.filter(bed => bed.roomId?.roomType === filters.roomType);
    }

    // Filter by max price
    if (filters.maxPrice) {
      filtered = filtered.filter(bed => bed.price <= parseInt(filters.maxPrice));
    }

    // Filter by building name
    if (filters.buildingName) {
      filtered = filtered.filter(bed => 
        bed.roomId?.buildingName?.toLowerCase().includes(filters.buildingName.toLowerCase())
      );
    }

    setFilteredBeds(filtered);
  };

  const handleWhatsappChange = (e) => {
    if (userForm.sameAsMobile) {
      setUserForm({ ...userForm, whatsappNumber: userForm.mobileNumber });
    } else {
      setUserForm({ ...userForm, whatsappNumber: e.target.value });
    }
  };

  const handleSameAsMobileChange = (e) => {
    const sameAsMobile = e.target.checked;
    setUserForm({
      ...userForm,
      sameAsMobile,
      whatsappNumber: sameAsMobile ? userForm.mobileNumber : userForm.whatsappNumber
    });
  };

  const validateForm = () => {
    if (!userForm.fullName.trim()) {
      setMessage('Full Name is required');
      return false;
    }
    if (!userForm.mobileNumber || userForm.mobileNumber.length !== 10) {
      setMessage('Mobile Number must be 10 digits');
      return false;
    }
    if (!userForm.email || !userForm.email.includes('@')) {
      setMessage('Valid Email is required');
      return false;
    }
    if (!userForm.checkInDate) {
      setMessage('Check-in Date is required');
      return false;
    }
    if (!userForm.checkOutDate) {
      setMessage('Check-out Date is required');
      return false;
    }
    if (new Date(userForm.checkOutDate) <= new Date(userForm.checkInDate)) {
      setMessage('Check-out Date must be after Check-in Date');
      return false;
    }
    if (!selectedBed) {
      setMessage('Please select an available bed');
      return false;
    }
    return true;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setMessage('Creating booking...');

      const bookingData = {
        userId: `U${Date.now()}`,
        userName: userForm.fullName,
        userMobile: userForm.mobileNumber,
        userWhatsapp: userForm.whatsappNumber,
        userEmail: userForm.email,
        bedId: selectedBed.bedId,
        roomId: selectedBed.roomId._id,
        buildingId: selectedBed.roomId.buildingId,
        buildingName: selectedBed.roomId.buildingName,
        checkInDate: new Date(userForm.checkInDate).toISOString(),
        checkOutDate: new Date(userForm.checkOutDate).toISOString(),
        amount: selectedBed.price, // Send amount in rupees (required by model)
        amountInPaise: Math.round(selectedBed.price * 100), // Also send amountInPaise for consistency
        status: 'Pending',
        paymentStatus: 'Pending'
      };

      console.log('Booking data being sent:', bookingData);

      const response = await axios.post(`${API_BASE_URL}/bookings/create`, bookingData);
      
      console.log('Booking response:', response.data);
      
      if (response.data.success) {
        setCurrentBooking(response.data.data);
        setMessage('Booking created successfully! Proceeding to payment...');
        
        // Automatically initiate payment
        await initiatePayment(response.data.data._id);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      
      let errorMessage = 'Error creating booking: ';
      
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data);
        errorMessage += error.response.data.message || error.response.data.error || 'Server error';
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        errorMessage += 'No response from server. Please check your connection.';
      } else {
        // Something else happened
        console.error('Error setting up request:', error.message);
        errorMessage += error.message;
      }
      
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async (bookingId) => {
    try {
      setPaymentLoading(true);
      setMessage('Initiating payment...');
      
      // Prepare data for the new PG payment system
      const paymentData = {
        bookingId: bookingId,
        userId: userForm.email, // Using email as userId
        userName: userForm.fullName,
        userMobile: userForm.mobileNumber,
        userEmail: userForm.email,
        userWhatsapp: userForm.mobileNumber,
        bedId: selectedBed.bedId,
        buildingName: selectedBed.roomId?.buildingName || 'AshokPg',
        amount: Math.round(selectedBed.price * 100), // Send amount in paise for consistency
        checkInDate: userForm.checkInDate,
        checkOutDate: userForm.checkOutDate,
        pgDetails: {
          pgName: selectedBed.roomId?.buildingName || 'AshokPg',
          floor: selectedBed.roomId?.floorNumber || 'Floor 1',
          room: selectedBed.roomId?.roomNumber || 'Room 101',
          bedId: selectedBed.bedId,
          buildingName: selectedBed.roomId?.buildingName || 'AshokPg'
        }
      };

      console.log('PG Payment data being sent:', paymentData);

      // Use the new PG payment endpoint
      const response = await axios.post(`${API_BASE_URL}/pg-payment/initiate`, paymentData);
      
      console.log('PG Payment response:', response.data);
      
      if (response.data.success) {
        setMessage('Payment initiated successfully! Redirecting to PhonePe payment gateway...');
        // Redirect to PhonePe payment page
        window.location.href = response.data.data.redirectUrl;
      } else {
        setMessage('Payment initiation failed: ' + response.data.message);
      }
      
    } catch (error) {
      console.error('PG Payment initiation error:', error);
      
      let errorMessage = 'Payment initiation failed: ';
      
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data);
        errorMessage += error.response.data.message || error.response.data.error || 'Server error';
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        errorMessage += 'No response from server. Please check your connection.';
      } else {
        // Something else happened
        console.error('Error setting up request:', error.message);
        errorMessage += error.message;
      }
      
      setMessage(errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  const downloadReceipt = async (bookingId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payment/receipt/${bookingId}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Receipt download error:', error);
      setMessage('Error downloading receipt');
    }
  };

  const checkPaymentStatus = async (transactionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payment/status/${transactionId}`);
      
      if (response.data.success) {
        const { paymentStatus, bookingStatus } = response.data.data;
        
        if (paymentStatus === 'Paid') {
          setMessage('Payment successful! Your booking is confirmed.');
          // Auto-download receipt
          await downloadReceipt(response.data.data.bookingId);
        } else if (paymentStatus === 'Failed') {
          setMessage('Payment failed. Please try again.');
        } else {
          setMessage('Payment is pending. Please complete the payment.');
        }
      }
      
    } catch (error) {
      console.error('Payment status check error:', error);
    }
  };

  const getUniqueBuildings = () => {
    const buildings = allBeds.map(bed => bed.roomId?.buildingName).filter(Boolean);
    return [...new Set(buildings)];
  };

  const getUniqueRoomTypes = () => {
    const types = allBeds.map(bed => bed.roomId?.roomType).filter(Boolean);
    return [...new Set(types)];
  };

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Book Your PG</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Room & Bed Availability Table */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">🛏 Room & Bed Availability</h2>
          
          {/* Search/Filter Section */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={filters.showOnlyAvailable}
                onChange={(e) => setFilters({...filters, showOnlyAvailable: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">Show only Available Beds</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select
                  value={filters.roomType}
                  onChange={(e) => setFilters({...filters, roomType: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {getUniqueRoomTypes().map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="₹"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PG Name</label>
                <input
                  type="text"
                  value={filters.buildingName}
                  onChange={(e) => setFilters({...filters, buildingName: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search PG..."
                />
              </div>
            </div>
          </div>

          {/* Availability Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PG Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bed ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      Loading bed availability...
                    </td>
                  </tr>
                ) : filteredBeds.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No beds found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBeds.map((bed) => (
                    <tr key={bed._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bed.roomId?.buildingName || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bed.roomId?.floorNumber || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bed.roomId?.roomId || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bed.roomId?.roomType || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bed.bedId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          bed.status === 'Available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {bed.status === 'Available' ? '🟢 Available' : '🔴 Occupied'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        ₹{bed.price}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bed.status === 'Available' ? (
                          <input
                            type="radio"
                            name="selectedBed"
                            value={bed._id}
                            checked={selectedBed?._id === bed._id}
                            onChange={() => setSelectedBed(bed)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="text-gray-400">✖</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {selectedBed && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Selected Bed:</h3>
              <p className="text-blue-700">
                {selectedBed.roomId?.buildingName} - Floor {selectedBed.roomId?.floorNumber}, 
                Room {selectedBed.roomId?.roomId}, Bed {selectedBed.bedId} 
                (₹{selectedBed.price}/month)
              </p>
            </div>
          )}
        </div>
        {/* User Information Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">📝 User Information</h2>
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={userForm.fullName}
                onChange={(e) => setUserForm({...userForm, fullName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={userForm.mobileNumber}
                onChange={(e) => setUserForm({...userForm, mobileNumber: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10 digit mobile number"
                maxLength="10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={userForm.sameAsMobile}
                  onChange={handleSameAsMobileChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Same as Mobile</span>
              </div>
              <input
                type="tel"
                value={userForm.whatsappNumber}
                onChange={handleWhatsappChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="WhatsApp number (optional)"
                maxLength="10"
                disabled={userForm.sameAsMobile}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date *
                </label>
                <input
                  type="date"
                  value={userForm.checkInDate}
                  onChange={(e) => setUserForm({...userForm, checkInDate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date *
                </label>
                <input
                  type="date"
                  value={userForm.checkOutDate}
                  onChange={(e) => setUserForm({...userForm, checkOutDate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={userForm.checkInDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || paymentLoading || !selectedBed}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold transition-colors"
            >
              {loading ? 'Creating Booking...' : paymentLoading ? 'Initiating Payment...' : 'Book Now & Pay'}
            </button>

            {/* Payment Status and Receipt Download */}
            {currentBooking && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Booking Status</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Booking ID:</span> {currentBooking.bookingId}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Payment Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      currentBooking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                      currentBooking.paymentStatus === 'Failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {currentBooking.paymentStatus}
                    </span>
                  </p>
                  {currentBooking.transactionId && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Transaction ID:</span> {currentBooking.transactionId}
                    </p>
                  )}
                </div>
                
                {currentBooking.paymentStatus === 'Paid' && (
                  <div className="mt-4">
                    <button
                      onClick={() => downloadReceipt(currentBooking._id)}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      📄 Download Receipt
                    </button>
                  </div>
                )}
                
                {currentBooking.paymentStatus === 'Pending' && currentBooking.transactionId && (
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => checkPaymentStatus(currentBooking.transactionId)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      🔄 Check Payment Status
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                      If you've completed the payment, click above to check status and download receipt
                    </p>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        
      </div>
    </div>
  );
}

export default Bookpg;


