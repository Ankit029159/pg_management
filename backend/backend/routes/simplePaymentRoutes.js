const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  paymentCallback,
  testPaymentConfig
} = require('../controllers/simplePaymentController');

// Simple Payment Initiation (like Shankh Jewellers)
router.post('/initiate', initiatePayment);

// Payment Callback from PhonePe
router.post('/callback', paymentCallback);

// Test Payment Configuration
router.get('/test', testPaymentConfig);

module.exports = router;
