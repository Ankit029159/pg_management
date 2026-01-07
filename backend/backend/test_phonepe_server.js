const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// PhonePe Configuration
const PHONEPE_CONFIG = {
  MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID || 'TEST-M232T7DTC1W58_25082',
  SALT_KEY: process.env.PHONEPE_SALT_KEY || 'NTE2NWRjMzItYzA1NS00YjM0LTk5NmltMmZİYjA2YzU0OTcz',
  SALT_INDEX: process.env.PHONEPE_SALT_INDEX || '1',
  BASE_URL: process.env.PHONEPE_BASE_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox',
  CALLBACK_URL: process.env.CALLBACK_URL || 'process.env.PHONEPE_CALLBACK_URL'
};

// Generate PhonePe checksum
const generateChecksum = (payload) => {
  const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const string = base64 + '/pg/v1/pay' + PHONEPE_CONFIG.SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + '###' + PHONEPE_CONFIG.SALT_INDEX;
  return checksum;
};

// Test PhonePe configuration
app.get('/api/payment/test-config', async (req, res) => {
  try {
    console.log('Testing PhonePe configuration...');
    console.log('Environment variables:', {
      MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID,
      SALT_KEY: process.env.PHONEPE_SALT_KEY,
      SALT_INDEX: process.env.PHONEPE_SALT_INDEX,
      BASE_URL: process.env.PHONEPE_BASE_URL
    });

    console.log('Resolved configuration:', PHONEPE_CONFIG);

    // Test checksum generation
    const testPayload = {
      merchantId: PHONEPE_CONFIG.MERCHANT_ID,
      merchantTransactionId: 'TEST_' + Date.now(),
      merchantUserId: 'TEST_USER',
      amount: 100,
      redirectUrl: 'http://localhost:5173/payment-success',
      redirectMode: 'POST',
      callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
      mobileNumber: '9999999999',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const checksum = generateChecksum(testPayload);
    const base64Payload = Buffer.from(JSON.stringify(testPayload)).toString('base64');

    console.log('Test payload:', testPayload);
    console.log('Generated checksum:', checksum);
    console.log('Base64 payload:', base64Payload);

    // Test PhonePe API call
    try {
      console.log('Testing PhonePe API connection...');
      const phonepeResponse = await axios.post(
        `${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay`,
        {
          request: base64Payload
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': PHONEPE_CONFIG.MERCHANT_ID
          },
          timeout: 10000
        }
      );

      console.log('PhonePe API Response:', phonepeResponse.data);

      res.status(200).json({
        success: true,
        message: 'PhonePe configuration test completed successfully',
        data: {
          config: PHONEPE_CONFIG,
          testPayload: testPayload,
          checksum: checksum,
          base64Payload: base64Payload,
          phonepeResponse: phonepeResponse.data
        }
      });

    } catch (phonepeError) {
      console.error('PhonePe API Error:', phonepeError.response?.data || phonepeError.message);
      
      res.status(200).json({
        success: true,
        message: 'PhonePe configuration test completed with API error',
        data: {
          config: PHONEPE_CONFIG,
          testPayload: testPayload,
          checksum: checksum,
          base64Payload: base64Payload,
          phonepeError: {
            status: phonepeError.response?.status,
            message: phonepeError.response?.data || phonepeError.message
          }
        }
      });
    }

  } catch (error) {
    console.error('Configuration test error:', error);
    res.status(500).json({
      success: false,
      message: 'Configuration test failed',
      error: error.message
    });
  }
});

// Test payment creation (without database)
app.post('/api/payment/create', async (req, res) => {
  try {
    console.log('Payment creation request:', req.body);
    
    const { bookingId, amount, userMobile, userEmail, userName } = req.body;

    // Validate required fields
    if (!bookingId || !amount || !userMobile || !userEmail || !userName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bookingId, amount, userMobile, userEmail, userName'
      });
    }

    // Generate unique transaction ID
    const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Prepare PhonePe payload
    const payload = {
      merchantId: PHONEPE_CONFIG.MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: 'USER_' + Date.now(),
      amount: Math.round(amount * 100), // Convert to paise
      redirectUrl: `http://localhost:5173/payment-success?bookingId=${bookingId}`,
      redirectMode: 'POST',
      callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
      mobileNumber: userMobile,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    console.log('PhonePe Payload:', payload);

    // Generate checksum
    const checksum = generateChecksum(payload);
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

    console.log('Generated Checksum:', checksum);

    // Make request to PhonePe
    const phonepeResponse = await axios.post(
      `${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay`,
      {
        request: base64Payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': PHONEPE_CONFIG.MERCHANT_ID
        },
        timeout: 30000
      }
    );

    console.log('PhonePe Response:', phonepeResponse.data);

    // Validate PhonePe response
    if (!phonepeResponse.data.success || !phonepeResponse.data.data) {
      throw new Error('Invalid response from PhonePe: ' + JSON.stringify(phonepeResponse.data));
    }

    res.status(200).json({
      success: true,
      message: 'Payment initiated successfully',
      data: {
        redirectUrl: phonepeResponse.data.data.instrumentResponse.redirectInfo.url,
        transactionId: transactionId,
        bookingId: bookingId
      }
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    
    if (error.response) {
      console.error('PhonePe API Error:', error.response.data);
      console.error('PhonePe API Status:', error.response.status);
      
      let errorMessage = 'Payment gateway error: ';
      
      if (error.response.status === 404) {
        errorMessage += 'Invalid merchant configuration or API endpoint. Please check PhonePe credentials.';
      } else if (error.response.status === 400) {
        errorMessage += 'Invalid request parameters. Please check the payment data.';
      } else if (error.response.status === 401) {
        errorMessage += 'Authentication failed. Please check PhonePe credentials.';
      } else {
        errorMessage += error.response.data.message || error.response.data.error || 'Unknown error';
      }
      
      return res.status(500).json({
        success: false,
        message: errorMessage,
        error: error.response.data
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating payment: ' + error.message,
      error: error.message
    });
  }
});

// Simple test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PhonePe Test Server is running',
    endpoints: {
      testConfig: '/api/payment/test-config',
      createPayment: '/api/payment/create'
    }
  });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`PhonePe Test Server running on port ${PORT}`);
  console.log('Environment variables loaded:', {
    MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID,
    BASE_URL: process.env.PHONEPE_BASE_URL,
    SALT_INDEX: process.env.PHONEPE_SALT_INDEX
  });
});
