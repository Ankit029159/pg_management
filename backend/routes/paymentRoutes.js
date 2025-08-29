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

// Diagnostic endpoint to check PhonePe merchant status
router.get('/diagnose', async (req, res) => {
  try {
    const crypto = require('crypto');
    const axios = require('axios');
    
    // PhonePe Configuration
    const PHONEPE_CONFIG = {
      MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID || 'M232T7DTC1W58',
      SALT_KEY: process.env.PHONEPE_SALT_KEY || '006c20b2-0a39-423a-9cd3-8e359879dd15',
      SALT_INDEX: process.env.PHONEPE_SALT_INDEX || '1',
      BASE_URL: process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/hermes',
      CALLBACK_URL: process.env.CALLBACK_URL || 'https://api.pg.gradezy.in/api/payment/callback'
    };

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
      'PGTESTPAYUAT' // Test with known working test merchant ID
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

// Test PhonePe configuration
router.get('/test-config', async (req, res) => {
  try {
    const crypto = require('crypto');
    const axios = require('axios');
    
    // PhonePe Configuration
    const PHONEPE_CONFIG = {
      MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID || 'M232T7DTC1W58',
      SALT_KEY: process.env.PHONEPE_SALT_KEY || '006c20b2-0a39-423a-9cd3-8e359879dd15',
      SALT_INDEX: process.env.PHONEPE_SALT_INDEX || '1',
      BASE_URL: process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/hermes',
      CALLBACK_URL: process.env.CALLBACK_URL || 'https://api.pg.gradezy.in/api/payment/callback'
    };

    console.log('Testing PhonePe configuration...');
    console.log('Merchant ID:', PHONEPE_CONFIG.MERCHANT_ID);
    console.log('Base URL:', PHONEPE_CONFIG.BASE_URL);

    // Generate checksum function
    const generateChecksum = (payload) => {
      const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
      const string = base64 + '/pg/v1/pay' + PHONEPE_CONFIG.SALT_KEY;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const checksum = sha256 + '###' + PHONEPE_CONFIG.SALT_INDEX;
      return checksum;
    };

    // Test payload
    const testPayload = {
      merchantId: PHONEPE_CONFIG.MERCHANT_ID,
      merchantTransactionId: 'TEST_' + Date.now(),
      merchantUserId: 'TEST_USER',
      amount: 100, // 1 rupee in paise
      redirectUrl: 'https://pg.gradezy.in/payment-success',
      redirectMode: 'POST',
      callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
      mobileNumber: '9999999999',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    console.log('Test PhonePe Payload:', testPayload);

    // Generate checksum
    const checksum = generateChecksum(testPayload);
    const base64Payload = Buffer.from(JSON.stringify(testPayload)).toString('base64');

    console.log('Test Checksum:', checksum);
    console.log('Test API URL:', `${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay`);

    // Make test request to PhonePe
    const phonepeResponse = await axios.post(
      `${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay`,
      {
        request: base64Payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        },
        timeout: 10000 // 10 second timeout for test
      }
    );

    console.log('Test PhonePe Response:', phonepeResponse.data);

    res.status(200).json({
      success: true,
      message: 'PhonePe configuration is working correctly',
      data: {
        config: {
          merchantId: PHONEPE_CONFIG.MERCHANT_ID,
          baseUrl: PHONEPE_CONFIG.BASE_URL,
          saltIndex: PHONEPE_CONFIG.SALT_INDEX
        },
        testResponse: phonepeResponse.data
      }
    });

  } catch (error) {
    console.error('PhonePe config test error:', error);
    
    let errorMessage = 'PhonePe configuration test failed: ';
    
    if (error.response) {
      console.error('PhonePe API Error:', error.response.data);
      console.error('PhonePe API Status:', error.response.status);
      
      if (error.response.status === 404) {
        errorMessage += 'Invalid merchant configuration or API endpoint. Please check PhonePe credentials.';
      } else if (error.response.status === 400) {
        errorMessage += 'Invalid request parameters. Please check the payment data.';
      } else if (error.response.status === 401) {
        errorMessage += 'Authentication failed. Please check PhonePe credentials.';
      } else {
        errorMessage += error.response.data.message || error.response.data.error || 'Unknown error';
      }
    } else {
      errorMessage += error.message;
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.response ? error.response.data : error.message
    });
  }
});

module.exports = router;
