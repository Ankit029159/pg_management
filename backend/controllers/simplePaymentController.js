const crypto = require('crypto');
const axios = require('axios');

// Simple PhonePe configuration
const PHONEPE_CONFIG = {
  MERCHANT_ID: process.env.PHONEPE_CLIENT_ID,
  SALT_KEY: process.env.PHONEPE_CLIENT_SECRET,
  SALT_INDEX: process.env.PHONEPE_CLIENT_VERSION,
  BASE_URL: process.env.PHONEPE_BASE_URL,
  CALLBACK_URL: process.env.CALLBACK_URL
};

// Generate PhonePe checksum
const generateChecksum = (payload) => {
  try {
    console.log('🔐 Generating checksum for payload...');
    
    // Convert payload to JSON string
    const payloadString = JSON.stringify(payload);
    console.log('📝 Payload JSON string length:', payloadString.length);
    
    // Convert to base64
    const base64 = Buffer.from(payloadString).toString('base64');
    console.log('📦 Base64 encoded payload length:', base64.length);
    
    // Construct the string for hashing
    const string = base64 + '/pg/v1/pay' + PHONEPE_CONFIG.SALT_KEY;
    console.log('🔗 String to hash length:', string.length);
    console.log('🔑 Salt key length:', PHONEPE_CONFIG.SALT_KEY.length);
    
    // Generate SHA256 hash
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    console.log('🔒 SHA256 hash generated, length:', sha256.length);
    
    // Final checksum with salt index
    const checksum = sha256 + '###' + PHONEPE_CONFIG.SALT_INDEX;
    console.log('✅ Final checksum generated:', checksum);
    
    return checksum;
  } catch (error) {
    console.error('❌ Error generating checksum:', error);
    throw new Error('Failed to generate checksum: ' + error.message);
  }
};

// Validate PhonePe configuration
const validatePhonePeConfig = () => {
  const requiredFields = ['MERCHANT_ID', 'SALT_KEY', 'SALT_INDEX', 'BASE_URL', 'CALLBACK_URL'];
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!PHONEPE_CONFIG[field]) {
      missingFields.push(field);
    }
  });
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required PhonePe configuration: ${missingFields.join(', ')}`);
  }
  
  // Validate specific field formats
  if (!PHONEPE_CONFIG.BASE_URL.startsWith('https://')) {
    throw new Error('PhonePe BASE_URL must use HTTPS');
  }
  
  if (!PHONEPE_CONFIG.CALLBACK_URL.startsWith('http')) {
    throw new Error('PhonePe CALLBACK_URL must be a valid URL');
  }
  
  console.log('✅ PhonePe configuration validation passed');
  return true;
};

// @desc    Simple Payment Initiation (like Shankh Jewellers)
// @route   POST /api/simple-payment/initiate
// @access  Public
const initiatePayment = async (req, res) => {
  try {
    console.log('🔍 Received payment initiation request from frontend:', req.body);
    
    // Validate PhonePe configuration first
    try {
      validatePhonePeConfig();
    } catch (configError) {
      console.error('❌ PhonePe configuration validation failed:', configError.message);
      return res.status(500).json({
        success: false,
        message: 'Payment gateway configuration error: ' + configError.message
      });
    }
    
    const { amount, userId, orderId, customerDetails, products } = req.body;

    // Validate required fields
    if (!amount || !userId || !orderId || !customerDetails) {
      console.log('❌ Missing required fields:', { amount, userId, orderId, customerDetails });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, userId, orderId, customerDetails'
      });
    }

    console.log('Payment Initiation Request:', {
      amount,
      userId,
      orderId,
      customerName: customerDetails.name
    });

    // Generate unique transaction ID
    const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Prepare PhonePe payload (simplified)
    const payload = {
      merchantId: PHONEPE_CONFIG.MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: Math.round(amount * 100), // Convert to paise
      redirectUrl: `http://localhost:5173/payment-success?orderId=${orderId}`,
      redirectMode: 'POST',
      callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
      mobileNumber: customerDetails.phone || '9999999999',
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
      { request: base64Payload },
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

    // Check if PhonePe response is successful
    if (!phonepeResponse.data.success || !phonepeResponse.data.data) {
      throw new Error('Invalid response from PhonePe: ' + JSON.stringify(phonepeResponse.data));
    }

    // Return success response (like Shankh Jewellers)
    res.status(200).json({
      success: true,
      message: 'Payment initiated successfully',
      data: {
        redirectUrl: phonepeResponse.data.data.instrumentResponse.redirectInfo.url,
        transactionId: transactionId,
        orderId: orderId,
        amount: amount,
        customerName: customerDetails.name
      }
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    
    // Handle PhonePe specific errors
    if (error.response) {
      console.error('PhonePe API Error:', error.response.data);
      console.error('PhonePe API Status:', error.response.status);
      
      return res.status(500).json({
        success: false,
        message: 'Payment gateway error: ' + (error.response.data.message || 'Unknown error'),
        error: error.response.data
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Payment initiation failed: ' + error.message
    });
  }
};

// @desc    Payment Callback from PhonePe
// @route   POST /api/payment/callback
// @access  Public
const paymentCallback = async (req, res) => {
  try {
    console.log('Payment Callback Received:', req.body);
    
    const { merchantTransactionId, transactionId, amount, status, paymentInstrument } = req.body;

    if (!merchantTransactionId) {
      return res.status(400).json({
        success: false,
        message: 'Missing merchantTransactionId'
      });
    }

    console.log('Processing payment callback for transaction:', merchantTransactionId, 'Status:', status);

    // Here you would typically update your database with payment status
    // For now, we'll just log it
    if (status === 'PAYMENT_SUCCESS') {
      console.log('✅ Payment successful for transaction:', merchantTransactionId);
    } else {
      console.log('❌ Payment failed for transaction:', merchantTransactionId);
    }

    res.status(200).json({
      success: true,
      message: 'Payment callback processed successfully',
      data: {
        transactionId: merchantTransactionId,
        status: status,
        amount: amount
      }
    });

  } catch (error) {
    console.error('Payment callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment callback',
      error: error.message
    });
  }
};

// @desc    Test Payment Configuration
// @route   GET /api/payment/test
// @access  Public
const testPaymentConfig = async (req, res) => {
  try {
    console.log('Testing Payment Configuration...');
    
    // Test with minimal payload
    const testPayload = {
      merchantId: PHONEPE_CONFIG.MERCHANT_ID,
      merchantTransactionId: 'TEST_' + Date.now(),
      merchantUserId: 'TEST_USER',
      amount: 100, // ₹1.00
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

    console.log('Test Configuration:', {
      MERCHANT_ID: PHONEPE_CONFIG.MERCHANT_ID,
      BASE_URL: PHONEPE_CONFIG.BASE_URL,
      SALT_INDEX: PHONEPE_CONFIG.SALT_INDEX
    });

    console.log('Test Payload:', testPayload);
    console.log('Generated Checksum:', checksum);

    // Test PhonePe API call
    const phonepeResponse = await axios.post(
      `${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay`,
      { request: base64Payload },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': PHONEPE_CONFIG.MERCHANT_ID
        },
        timeout: 15000
      }
    );

    console.log('✅ PhonePe API Test Successful!');
    console.log('Response:', phonepeResponse.data);

    res.status(200).json({
      success: true,
      message: 'Payment configuration test successful',
      data: {
        config: PHONEPE_CONFIG,
        testPayload: testPayload,
        checksum: checksum,
        phonepeResponse: phonepeResponse.data
      }
    });

  } catch (error) {
    console.error('❌ Payment configuration test failed:', error);
    
    if (error.response) {
      console.error('PhonePe API Error:', error.response.data);
      console.error('PhonePe API Status:', error.response.status);
    }
    
    res.status(500).json({
      success: false,
      message: 'Payment configuration test failed',
      error: error.response?.data || error.message
    });
  }
};

module.exports = {
  initiatePayment,
  paymentCallback,
  testPaymentConfig
};
