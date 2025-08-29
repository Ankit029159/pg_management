import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const API_BASE_URL = 'http://localhost:5001/api';
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (bookingId) {
      checkPaymentStatus();
    }
  }, [bookingId]);

  const checkPaymentStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/bookings/${bookingId}`);
      
      if (response.data.success) {
        setBooking(response.data.data);
        
        if (response.data.data.paymentStatus === 'Paid') {
          setMessage('Payment successful! Your booking is confirmed.');
          // Auto-download receipt
          await downloadReceipt(bookingId);
        } else if (response.data.data.paymentStatus === 'Failed') {
          setMessage('Payment failed. Please try again.');
        } else {
          setMessage('Payment is pending. Please wait for confirmation.');
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setMessage('Error checking payment status');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            {booking?.paymentStatus === 'Paid' ? (
              <div className="text-green-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="text-yellow-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {booking?.paymentStatus === 'Paid' ? 'Payment Successful!' : 'Payment Processing'}
            </h1>
            <p className="text-gray-600">{message}</p>
          </div>

          {booking && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="font-medium">{booking.bookingId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                    booking.paymentStatus === 'Failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.paymentStatus}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-medium">{booking.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium">₹{booking.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Building</p>
                  <p className="font-medium">{booking.buildingName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bed ID</p>
                  <p className="font-medium">{booking.bedId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-in Date</p>
                  <p className="font-medium">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-out Date</p>
                  <p className="font-medium">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            {booking?.paymentStatus === 'Paid' && (
              <button
                onClick={() => downloadReceipt(bookingId)}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                📄 Download Receipt
              </button>
            )}
            
            <Link
              to="/bookingpg"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
            >
              Book Another Room
            </Link>
            
            <Link
              to="/"
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium text-center"
            >
              Go to Home
            </Link>
          </div>

          {booking?.paymentStatus === 'Pending' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Your payment is being processed. You will receive a confirmation email once the payment is completed. 
                You can also check the payment status by clicking the "Check Payment Status" button.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
