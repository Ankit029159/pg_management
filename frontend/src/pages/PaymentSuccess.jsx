import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.pg.gradezy.in/api';

  useEffect(() => {
    const processPayment = async () => {
      try {
        setLoading(true);
        
        // Get parameters from URL
        const bookingId = searchParams.get('bookingId');
        const transactionId = searchParams.get('merchantTransactionId');
        const status = searchParams.get('status');
        const amount = searchParams.get('amount');
        
        console.log('Payment callback parameters:', { bookingId, transactionId, status, amount });

        if (!bookingId) {
          setError('No booking ID found in payment response');
          setLoading(false);
          return;
        }

        // Check payment status
        if (status === 'PAYMENT_SUCCESS') {
          setPaymentStatus('success');
          
          // Fetch updated booking details
          try {
            const response = await axios.get(`${API_BASE_URL}/bookings/${bookingId}`);
            if (response.data.success) {
              setBookingDetails(response.data.data);
            }
          } catch (err) {
            console.error('Error fetching booking details:', err);
          }
        } else if (status === 'PAYMENT_ERROR' || status === 'PAYMENT_DECLINED') {
          setPaymentStatus('failed');
        } else {
          setPaymentStatus('pending');
        }

      } catch (err) {
        console.error('Error processing payment:', err);
        setError('Error processing payment response');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams]);

  const downloadReceipt = async () => {
    if (!bookingDetails?._id) return;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/payment/receipt/${bookingDetails._id}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${bookingDetails._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Receipt download error:', error);
      alert('Error downloading receipt');
    }
  };

  const checkPaymentStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get parameters from URL
      const bookingId = searchParams.get('bookingId');
      const transactionId = searchParams.get('transactionId');
      
      if (!bookingId) {
        setError('No booking ID found');
        return;
      }
      
      console.log('Checking payment status for booking:', bookingId);
      
      // Check payment status from backend with PhonePe status check
      const response = await axios.get(`${API_BASE_URL}/pg-payment/details/${transactionId}?checkPhonePe=true`);
      
      if (response.data.success) {
        const paymentRecord = response.data.data;
        console.log('Payment status updated:', paymentRecord.paymentStatus);
        
        // Update payment status based on backend response
        console.log('🔍 Payment status from backend:', paymentRecord.paymentStatus);
        console.log('🔍 Current frontend status:', paymentStatus);
        
        if (paymentRecord.paymentStatus === 'SUCCESS') {
          console.log('✅ Setting status to SUCCESS');
          setPaymentStatus('success');
          // Fetch updated booking details
          try {
            const bookingResponse = await axios.get(`${API_BASE_URL}/bookings/${bookingId}`);
            if (bookingResponse.data.success) {
              setBookingDetails(bookingResponse.data.data);
            }
          } catch (err) {
            console.error('Error fetching booking details:', err);
          }
        } else if (paymentRecord.paymentStatus === 'FAILED') {
          console.log('❌ Setting status to FAILED');
          setPaymentStatus('failed');
        } else if (paymentRecord.paymentStatus === 'PENDING') {
          console.log('⏳ Setting status to PENDING');
          setPaymentStatus('pending');
          // Show a message that payment is still pending
          alert('Payment is still pending. Please wait for PhonePe to process your payment or try again later.');
        }
        
        // Also update booking details if available
        if (paymentRecord.pgDetails) {
          setBookingDetails({
            _id: paymentRecord.bookingId,
            bookingId: paymentRecord.bookingId,
            amount: paymentRecord.amount,
            status: paymentRecord.paymentStatus,
            pgDetails: paymentRecord.pgDetails,
            checkInDate: paymentRecord.checkInDate,
            checkOutDate: paymentRecord.checkOutDate
          });
        }
        
      } else {
        setError('Failed to check payment status');
      }
      
    } catch (error) {
      console.error('Error checking payment status:', error);
      setError('Error checking payment status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToHome = () => {
    navigate('/');
  };

  const goToBookings = () => {
    navigate('/bookingpg');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={goToBookings}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={goToHome}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center">
          {paymentStatus === 'success' ? (
            <>
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">
                Your PG booking has been confirmed and payment has been processed successfully.
              </p>
              
              {bookingDetails && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                  <h3 className="font-semibold text-gray-800 mb-2">Booking Details:</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Booking ID:</span> {bookingDetails.bookingId || bookingDetails._id}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Amount:</span> ₹{bookingDetails.amount}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Status:</span> 
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {bookingDetails.status}
                    </span>
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={downloadReceipt}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                >
                  📄 Download Receipt
                </button>
                <button
                  onClick={goToHome}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Home
                </button>
              </div>
            </>
          ) : paymentStatus === 'failed' ? (
            <>
              <div className="text-red-500 text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Failed</h1>
              <p className="text-gray-600 mb-6">
                Unfortunately, your payment could not be processed. Please try again or contact support.
              </p>
              <div className="space-y-3">
                <button
                  onClick={goToBookings}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={goToHome}
                  className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go to Home
                </button>
              </div>
            </>
          ) : (
            <>
                             <div className="text-yellow-500 text-6xl mb-4">⏳</div>
               <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Pending</h1>
               <p className="text-gray-600 mb-6">
                 Your payment is being processed. Please wait or check your payment status later.
               </p>
               
               {/* Debug info - remove this in production */}
               <div className="bg-gray-100 p-3 rounded-lg mb-4 text-left text-sm">
                 <p className="font-medium text-gray-700">Debug Info:</p>
                 <p className="text-gray-600">Current Status: {paymentStatus}</p>
                 <p className="text-gray-600">Booking ID: {searchParams.get('bookingId')}</p>
                 <p className="text-gray-600">Transaction ID: {searchParams.get('transactionId')}</p>
               </div>
                             <div className="space-y-3">
                 <button
                   onClick={() => checkPaymentStatus()}
                   disabled={loading}
                   className={`w-full py-3 px-6 rounded-lg transition-colors ${
                     loading 
                       ? 'bg-gray-400 cursor-not-allowed' 
                       : 'bg-blue-600 hover:bg-blue-700 text-white'
                   }`}
                 >
                   {loading ? 'Checking Status...' : 'Check Status'}
                 </button>
                <button
                  onClick={goToHome}
                  className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go to Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
