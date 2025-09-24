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
  const [currentStep, setCurrentStep] = useState(1); // 1: Select Room, 2: Fill Details, 3: Payment

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

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.pg.gradezy.in/api';

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

  // Calculate duration and total amount
  const calculateDurationAndAmount = () => {
    if (!userForm.checkInDate || !userForm.checkOutDate || !selectedBed) {
      return { days: 0, months: 0, totalAmount: 0 };
    }

    const checkIn = new Date(userForm.checkInDate);
    const checkOut = new Date(userForm.checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const months = Math.ceil(days / 30); // Assuming 30 days per month for calculation
    
    // Calculate total amount based on duration
    const totalAmount = months * selectedBed.price;
    
    return { days, months, totalAmount };
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

      // Calculate total amount based on duration
      const { days, months, totalAmount } = calculateDurationAndAmount();

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
        amount: totalAmount, // Use calculated total amount based on duration
        amountInPaise: Math.round(totalAmount * 100),
        status: 'Pending',
        paymentStatus: 'Pending',
        // Add duration information for reference
        duration: {
          days: days,
          months: months,
          monthlyRate: selectedBed.price
        }
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
        console.error('Server error response:', error.response.data);
        errorMessage += error.response.data.message || error.response.data.error || 'Server error';
      } else if (error.request) {
        console.error('No response received:', error.request);
        errorMessage += 'No response from server. Please check your connection.';
      } else {
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
      
      // Calculate total amount based on duration
      const { days, months, totalAmount } = calculateDurationAndAmount();
      
      const paymentData = {
        bookingId: bookingId,
        userId: userForm.email,
        userName: userForm.fullName,
        userMobile: userForm.mobileNumber,
        userEmail: userForm.email,
        userWhatsapp: userForm.mobileNumber,
        bedId: selectedBed.bedId,
        buildingName: selectedBed.roomId?.buildingName || 'AshokPg',
        amount: Math.round(totalAmount * 100), // Use calculated total amount
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

      const response = await axios.post(`${API_BASE_URL}/pg-payment/initiate`, paymentData);
      
      console.log('PG Payment response:', response.data);
      
      if (response.data.success) {
        setMessage('Payment initiated successfully! Redirecting to PhonePe payment gateway...');
        window.location.href = response.data.data.redirectUrl;
      } else {
        setMessage('Payment initiation failed: ' + response.data.message);
      }
      
    } catch (error) {
      console.error('PG Payment initiation error:', error);
      
      let errorMessage = 'Payment initiation failed: ';
      
      if (error.response) {
        console.error('Server error response:', error.response.data);
        errorMessage += error.response.data.message || error.response.data.error || 'Server error';
      } else if (error.request) {
        console.error('No response received:', error.request);
        errorMessage += 'No response from server. Please check your connection.';
      } else {
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

  const getAvailableBeds = () => {
    return filteredBeds.filter(bed => bed.status === 'Available');
  };

  const getOccupiedBeds = () => {
    return filteredBeds.filter(bed => bed.status === 'Occupied');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Your Perfect PG</h1>
            <p className="text-lg text-gray-600">Find and book your ideal accommodation in just a few steps</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
            }`}>
              <span className="text-sm font-semibold">1</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
            }`}>
              <span className="text-sm font-semibold">2</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= 3 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
            }`}>
              <span className="text-sm font-semibold">3</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-16 text-sm text-gray-600">
          <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>Select Room</span>
          <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>Your Details</span>
          <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>Payment</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {message && (
          <div className={`p-4 mb-6 rounded-lg ${
            message.includes('Error') ? 'bg-red-100 text-red-700 border border-red-200' : 
            'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* Step 1: Room Selection */}
        {currentStep === 1 && (
          <div className="space-y-8">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 p-2 rounded-lg mr-3">🔍</span>
                Find Your Perfect Room
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Building</label>
                  <select
                    value={filters.buildingName}
                    onChange={(e) => setFilters({...filters, buildingName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Buildings</option>
                    {getUniqueBuildings().map(building => (
                      <option key={building} value={building}>{building}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                  <select
                    value={filters.roomType}
                    onChange={(e) => setFilters({...filters, roomType: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    {getUniqueRoomTypes().map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="₹ Max price"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={filters.showOnlyAvailable}
                      onChange={(e) => setFilters({...filters, showOnlyAvailable: e.target.checked})}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Available Only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Room Cards */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="bg-green-100 p-2 rounded-lg mr-3">🏠</span>
                  Available Rooms
                </h2>
                <div className="text-sm text-gray-600">
                  {getAvailableBeds().length} available • {getOccupiedBeds().length} occupied
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading rooms...</p>
                </div>
              ) : getAvailableBeds().length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😔</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Available Rooms</h3>
                  <p className="text-gray-600">Try adjusting your filters or check back later</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getAvailableBeds().map((bed) => (
                    <div
                      key={bed._id}
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedBed?._id === bed._id
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedBed(bed)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{bed.roomId?.buildingName}</h3>
                          <p className="text-sm text-gray-600">Floor {bed.roomId?.floorNumber} • Room {bed.roomId?.roomId}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedBed?._id === bed._id ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                        }`}>
                          {selectedBed?._id === bed._id && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Bed ID:</span>
                          <span className="text-sm font-medium text-gray-900">{bed.bedId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Type:</span>
                          <span className="text-sm font-medium text-gray-900">{bed.roomId?.roomType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✅ Available
                          </span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-blue-600">₹{bed.price}</span>
                          <span className="text-sm text-gray-600">/month</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedBed && (
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                    <span className="mr-2">✅</span>
                    Selected Room
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-blue-800">
                        <span className="font-medium">{selectedBed.roomId?.buildingName}</span> - 
                        Floor {selectedBed.roomId?.floorNumber}, Room {selectedBed.roomId?.roomId}
                      </p>
                      <p className="text-blue-700 text-sm">Bed {selectedBed.bedId} • {selectedBed.roomId?.roomType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">₹{selectedBed.price}</p>
                      <p className="text-blue-700 text-sm">per month</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="mt-4 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Continue to Details →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: User Details */}
        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                  <span className="bg-blue-100 p-3 rounded-lg mr-3">👤</span>
                  Your Information
                </h2>
                <p className="text-gray-600">Please provide your details to complete the booking</p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={userForm.fullName}
                      onChange={(e) => setUserForm({...userForm, fullName: e.target.value})}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10 digit mobile number"
                      maxLength="10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number
                  </label>
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      checked={userForm.sameAsMobile}
                      onChange={handleSameAsMobileChange}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Same as Mobile Number</span>
                  </div>
                  <input
                    type="tel"
                    value={userForm.whatsappNumber}
                    onChange={handleWhatsappChange}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="WhatsApp number (optional)"
                    maxLength="10"
                    disabled={userForm.sameAsMobile}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Date *
                    </label>
                    <input
                      type="date"
                      value={userForm.checkInDate}
                      onChange={(e) => setUserForm({...userForm, checkInDate: e.target.value})}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={userForm.checkInDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                {/* Selected Room Summary */}
                {selectedBed && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Room</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{selectedBed.roomId?.buildingName}</p>
                        <p className="text-sm text-gray-600">Floor {selectedBed.roomId?.floorNumber} • Room {selectedBed.roomId?.roomId} • Bed {selectedBed.bedId}</p>
                        {userForm.checkInDate && userForm.checkOutDate && (
                          <div className="mt-2 text-sm text-gray-500">
                            {(() => {
                              const { days, months } = calculateDurationAndAmount();
                              return (
                                <span>
                                  Duration: {days} days ({months} month{months !== 1 ? 's' : ''})
                                </span>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {userForm.checkInDate && userForm.checkOutDate ? (
                          <>
                            <p className="text-xl font-bold text-blue-600">₹{calculateDurationAndAmount().totalAmount}</p>
                            <p className="text-sm text-gray-600">total amount</p>
                            <p className="text-xs text-gray-500">₹{selectedBed.price}/month</p>
                          </>
                        ) : (
                          <>
                            <p className="text-xl font-bold text-blue-600">₹{selectedBed.price}</p>
                            <p className="text-sm text-gray-600">per month</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-500 text-white py-4 px-6 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                  >
                    ← Back to Rooms
                  </button>
                  <button
                    type="submit"
                    disabled={loading || paymentLoading}
                    className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                  >
                    {loading ? 'Creating Booking...' : paymentLoading ? 'Initiating Payment...' : 'Proceed to Payment →'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Payment Status */}
        {currentStep === 3 && currentBooking && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">💳</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Processing</h2>
                <p className="text-gray-600">Complete your payment to confirm your booking</p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID:</span>
                      <span className="font-medium">{currentBooking.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room:</span>
                      <span className="font-medium">{selectedBed.roomId?.buildingName} - {selectedBed.bedId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-blue-600">₹{selectedBed.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentBooking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                        currentBooking.paymentStatus === 'Failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {currentBooking.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {currentBooking.paymentStatus === 'Paid' && (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h3>
                    <p className="text-gray-600 mb-6">Your booking has been confirmed</p>
                    <button
                      onClick={() => downloadReceipt(currentBooking._id)}
                      className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      📄 Download Receipt
                    </button>
                  </div>
                )}

                {currentBooking.paymentStatus === 'Pending' && currentBooking.transactionId && (
                  <div className="text-center">
                    <div className="text-6xl mb-4">⏳</div>
                    <h3 className="text-xl font-semibold text-yellow-600 mb-2">Payment Pending</h3>
                    <p className="text-gray-600 mb-6">Complete your payment to confirm the booking</p>
                    <button
                      onClick={() => checkPaymentStatus(currentBooking.transactionId)}
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      🔄 Check Payment Status
                    </button>
                  </div>
                )}

                {currentBooking.paymentStatus === 'Failed' && (
                  <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-semibold text-red-600 mb-2">Payment Failed</h3>
                    <p className="text-gray-600 mb-6">Please try again or contact support</p>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookpg;