const express = require('express');
const router = express.Router();
const {
  createPayment,
  paymentCallback,
  generateReceipt,
  getPaymentStatus,
  testPhonePeConfig
} = require('../controllers/paymentController');

// Create PhonePe payment
router.post('/create', createPayment);

// Payment callback from PhonePe
router.post('/callback', paymentCallback);

// Generate PDF receipt
router.get('/receipt/:bookingId', generateReceipt);

// Get payment status
router.get('/status/:transactionId', getPaymentStatus);

// Test PhonePe configuration
router.get('/test-config', testPhonePeConfig);

// Diagnostic endpoint to check PhonePe merchant status
router.get('/diagnose', async (req, res) => {
  try {
    const crypto = require('crypto');
    const axios = require('axios');
    
    // Import PhonePe configuration
    const PHONEPE_CONFIG = require('../config/phonepeConfig');

    console.log('PhonePe Diagnostic Information:');
    console.log('Merchant ID:', PHONEPE_CONFIG.MERCHANT_ID);
    console.log('Salt Key:', PHONEPE_CONFIG.SALT_KEY);
    console.log('Salt Index:', PHONEPE_CONFIG.SALT_INDEX);
    console.log('Base URL:', PHONEPE_CONFIG.BASE_URL);

    // Check if merchant ID looks valid
    const merchantIdValidation = {
      length: PHONEPE_CONFIG.MERCHANT_ID.length,
      startsWithM: PHONEPE_CONFIG.MERCHANT_ID.startsWith('M'),
      containsOnlyValidChars: /^[A-Z0-9]+$/.test(PHONEPE_CONFIG.MERCHANT_ID),
      expectedFormat: 'Should start with M and contain only uppercase letters and numbers'
    };

    // Test basic connectivity to PhonePe API
    let connectivityTest = null;
    try {
      const response = await axios.get(`${PHONEPE_CONFIG.BASE_URL}/health`, {
        timeout: 5000
      });
      connectivityTest = {
        status: 'success',
        response: response.status
      };
    } catch (error) {
      connectivityTest = {
        status: 'failed',
        error: error.message,
        statusCode: error.response?.status
      };
    }

    // Test different merchant ID formats
    const merchantIdVariations = [
      PHONEPE_CONFIG.MERCHANT_ID,
      PHONEPE_CONFIG.MERCHANT_ID.toLowerCase(),
      PHONEPE_CONFIG.MERCHANT_ID.replace('M', ''),
      'process.env.PHONEPE_MERCHANT_ID' // Test with known working test merchant ID
    ];

    const merchantIdTests = [];
    
    for (const merchantId of merchantIdVariations) {
      try {
        const testPayload = {
          merchantId: merchantId,
          merchantTransactionId: 'DIAG_' + Date.now(),
          merchantUserId: 'DIAG_USER',
          amount: 100,
          redirectUrl: 'https://pg.gradezy.in/payment-success',
          redirectMode: 'POST',
          callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
          mobileNumber: '9999999999',
          paymentInstrument: {
            type: 'PAY_PAGE'
          }
        };

        const base64 = Buffer.from(JSON.stringify(testPayload)).toString('base64');
        const string = base64 + '/pg/v1/pay' + PHONEPE_CONFIG.SALT_KEY;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + PHONEPE_CONFIG.SALT_INDEX;

        const response = await axios.post(
          `${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay`,
          { request: base64 },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-VERIFY': checksum,
              'X-MERCHANT-ID': merchantId
            },
            timeout: 10000
          }
        );

        merchantIdTests.push({
          merchantId: merchantId,
          status: 'success',
          response: response.data
        });

      } catch (error) {
        merchantIdTests.push({
          merchantId: merchantId,
          status: 'failed',
          error: error.response?.data || error.message,
          statusCode: error.response?.status
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'PhonePe diagnostic completed',
      data: {
        configuration: {
          merchantId: PHONEPE_CONFIG.MERCHANT_ID,
          saltKey: PHONEPE_CONFIG.SALT_KEY,
          saltIndex: PHONEPE_CONFIG.SALT_INDEX,
          baseUrl: PHONEPE_CONFIG.BASE_URL
        },
        merchantIdValidation: merchantIdValidation,
        connectivityTest: connectivityTest,
        merchantIdTests: merchantIdTests,
        recommendations: [
          'Check if your PhonePe merchant account is activated',
          'Verify the merchant ID format in your PhonePe Business dashboard',
          'Ensure your account has API access enabled',
          'Contact PhonePe support if all tests fail'
        ]
      }
    });

  } catch (error) {
    console.error('Diagnostic error:', error);
    res.status(500).json({
      success: false,
      message: 'Diagnostic failed',
      error: error.message
    });
  }
});

module.exports = router;
