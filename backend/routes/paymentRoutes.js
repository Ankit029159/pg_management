const express = require('express');
const router = express.Router();
const {
  createPayment,
  paymentCallback,
  generateReceipt,
  getPaymentStatus
} = require('../controllers/paymentController');

// Create PhonePe payment
router.post('/create', createPayment);

// Payment callback from PhonePe
router.post('/callback', paymentCallback);

// Generate PDF receipt
router.get('/receipt/:bookingId', generateReceipt);

// Get payment status
router.get('/status/:transactionId', getPaymentStatus);

module.exports = router;
