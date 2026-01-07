const express = require('express');
const router = express.Router();
const {
  initiatePGBookingPayment,
  paymentCallback,
  getPaymentHistory,
  getPaymentDetails,
  testPaymentConfig,
  autoApprovePendingPayments,
  approveSinglePayment
} = require('../controllers/pgPaymentController');

// PG Booking Payment Routes
router.post('/initiate', initiatePGBookingPayment);           // Initiate payment for PG booking
router.post('/callback', paymentCallback);                    // PhonePe payment callback
router.get('/history', getPaymentHistory);                    // Get payment history
router.get('/details/:transactionId', getPaymentDetails);     // Get specific payment details
router.get('/test', testPaymentConfig);                       // Test payment configuration

// Admin Approval Routes
router.post('/auto-approve-pending', autoApprovePendingPayments);  // Auto-approve all pending payments
router.post('/approve-single', approveSinglePayment);              // Approve single payment

module.exports = router;
