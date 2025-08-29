import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookingDetails() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const API_BASE_URL = 'http://localhost:5001/api';

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/bookings/all`);
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setMessage('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      setLoading(true);
      await axios.put(`${API_BASE_URL}/bookings/${bookingId}/status`, { status });
      setMessage('Booking status updated successfully!');
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      setMessage('Error updating booking status');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        setLoading(true);
        await axios.put(`${API_BASE_URL}/bookings/${bookingId}/cancel`);
        setMessage('Booking cancelled successfully!');
        fetchBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        setMessage('Error cancelling booking');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExtendBooking = async (bookingId, newCheckOutDate) => {
    try {
      setLoading(true);
      await axios.put(`${API_BASE_URL}/bookings/${bookingId}/extend`, {
        checkOutDate: newCheckOutDate
      });
      setMessage('Booking extended successfully!');
      setShowModal(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      console.error('Error extending booking:', error);
      setMessage('Error extending booking');
    } finally {
      setLoading(false);
    }
  };

  const openExtendModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const openDetailsModal = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDetailsModal(false);
    setSelectedBooking(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-GB');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Booking Management</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">View All Bookings</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading bookings...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bed ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Building
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.bookingId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{booking.userMobile}</div>
                        <div className="text-xs text-gray-500">{booking.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.bedId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.buildingName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{booking.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(booking.checkInDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(booking.checkOutDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openDetailsModal(booking)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        {booking.status === 'Active' && (
                          <>
                            <button
                              onClick={() => openExtendModal(booking)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Extend
                            </button>
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(booking._id, 'Active')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-gray-900">
                  Booking Details - {selectedBooking.bookingId}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">👤 User Information</h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Name:</span> {selectedBooking.userName}</div>
                    <div><span className="font-medium">Mobile:</span> {selectedBooking.userMobile}</div>
                    <div><span className="font-medium">Email:</span> {selectedBooking.userEmail}</div>
                    {selectedBooking.userWhatsapp && (
                      <div><span className="font-medium">WhatsApp:</span> {selectedBooking.userWhatsapp}</div>
                    )}
                    <div><span className="font-medium">User ID:</span> {selectedBooking.userId}</div>
                  </div>
                </div>

                {/* Booking Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">🏠 Booking Information</h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Bed ID:</span> {selectedBooking.bedId}</div>
                    <div><span className="font-medium">Building:</span> {selectedBooking.buildingName}</div>
                    <div><span className="font-medium">Check-in:</span> {formatDate(selectedBooking.checkInDate)}</div>
                    <div><span className="font-medium">Check-out:</span> {formatDate(selectedBooking.checkOutDate)}</div>
                    <div><span className="font-medium">Amount:</span> ₹{selectedBooking.amount}</div>
                    <div><span className="font-medium">Created:</span> {formatDateTime(selectedBooking.createdAt)}</div>
                  </div>
                </div>

                {/* Status Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">📊 Status Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Booking Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Payment Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                        {selectedBooking.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Admin Action:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedBooking.adminAction === 'Accepted' ? 'bg-green-100 text-green-800' :
                        selectedBooking.adminAction === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedBooking.adminAction}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">💳 Payment Information</h4>
                  <div className="space-y-2">
                    {selectedBooking.transactionId && (
                      <div><span className="font-medium">Transaction ID:</span> {selectedBooking.transactionId}</div>
                    )}
                    {selectedBooking.paymentDetails && (
                      <>
                        <div><span className="font-medium">PhonePe Transaction:</span> {selectedBooking.paymentDetails.phonepeTransactionId || 'N/A'}</div>
                        <div><span className="font-medium">Payment Method:</span> {selectedBooking.paymentDetails.paymentMethod || 'N/A'}</div>
                        {selectedBooking.paymentDetails.paidAt && (
                          <div><span className="font-medium">Paid At:</span> {formatDateTime(selectedBooking.paymentDetails.paidAt)}</div>
                        )}
                      </>
                    )}
                    {!selectedBooking.transactionId && (
                      <div className="text-gray-500">No payment information available</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extend Booking Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Extend Booking
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Current checkout date: {formatDate(selectedBooking.checkOutDate)}
              </p>
              <form onSubmit={(e) => {
                e.preventDefault();
                const newDate = e.target.checkOutDate.value;
                handleExtendBooking(selectedBooking._id, newDate);
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Check-Out Date
                  </label>
                  <input
                    type="date"
                    name="checkOutDate"
                    min={formatDate(selectedBooking.checkOutDate)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {loading ? 'Extending...' : 'Extend Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingDetails;
