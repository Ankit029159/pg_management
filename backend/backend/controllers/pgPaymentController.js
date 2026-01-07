const axios = require('axios');
const Booking = require('../models/bookingModel');
const PaymentHistory = require('../models/PaymentHistory');

// *** ADD THESE LOGS AT THE VERY TOP ***
console.log('--- pgPaymentController.js Loading (PhonePe v2 API) ---');
console.log('process.env.PHONEPE_MERCHANT_ID (before config):', process.env.PHONEPE_MERCHANT_ID);
console.log('process.env.PHONEPE_SALT_KEY (before config):', process.env.PHONEPE_SALT_KEY);

console.log('process.env.PHONEPE_BASE_URL (before config):', process.env.PHONEPE_BASE_URL);
console.log('------------------------------------');

// PhonePe configuration
const PHONEPE_CONFIG = {
  MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID,
  SALT_KEY: process.env.PHONEPE_SALT_KEY,
  SALT_INDEX: process.env.PHONEPE_SALT_INDEX,
  BASE_URL: process.env.PHONEPE_BASE_URL,
  AUTH_TOKEN_URL: process.env.PHONEPE_AUTH_TOKEN_URL,
  CALLBACK_URL: process.env.PHONEPE_CALLBACK_URL,
  REDIRECT_URL: process.env.PHONEPE_REDIRECT_URL
};



// Helper function to get authorization token from PhonePe
const getAuthToken = async () => {
  try {
    console.log('🔐 Generating PhonePe Authorization Token...');

    // Request Body parameters (as per docs)
    const requestBodyParams = new URLSearchParams();
    requestBodyParams.append('client_id', PHONEPE_CONFIG.MERCHANT_ID);
    requestBodyParams.append('client_version', PHONEPE_CONFIG.SALT_INDEX); // Assuming SALT_INDEX maps to client_version
    requestBodyParams.append('client_secret', PHONEPE_CONFIG.SALT_KEY);
    requestBodyParams.append('grant_type', 'client_credentials');

    const tokenResponse = await axios.post(
      PHONEPE_CONFIG.AUTH_TOKEN_URL,
      requestBodyParams.toString(), // Send as x-www-form-urlencoded
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 15000
      }
    );

    console.log('✅ PhonePe Authorization Token Response:', tokenResponse.data);

    if (tokenResponse.data && tokenResponse.data.access_token) {
      return tokenResponse.data.access_token;
    } else {
      throw new Error('Failed to retrieve access_token from PhonePe');
    }

  } catch (error) {
    console.error('❌ Error generating PhonePe Authorization Token:', error.response?.data || error.message);
    throw new Error('Failed to generate PhonePe Authorization Token: ' + (error.response?.data?.message || error.message));
  }
};

// Validate PhonePe configuration
const validatePhonePeConfig = () => {
  const requiredFields = ['MERCHANT_ID', 'SALT_KEY', 'BASE_URL', 'AUTH_TOKEN_URL', 'CALLBACK_URL'];
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!PHONEPE_CONFIG[field]) {
      missingFields.push(field);
    }
  });
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required PhonePe configuration: ${missingFields.join(', ')}`);
  }
  
  if (!PHONEPE_CONFIG.BASE_URL.startsWith('https://')) {
    throw new Error('PhonePe BASE_URL must use HTTPS');
  }
  
  if (!PHONEPE_CONFIG.CALLBACK_URL.startsWith('http')) {
    throw new Error('PhonePe CALLBACK_URL must be a valid URL');
  }
  
  console.log('✅ PhonePe configuration validation passed');
  return true;
};

// @desc    Initiate PG Booking Payment
// @route   POST /api/pg-payment/initiate
// @access  Public
const initiatePGBookingPayment = async (req, res) => {
  try {
    console.log('🔍 Received PG booking payment request:', req.body);
    
    // Debug: Log PhonePe configuration (without sensitive data)
    console.log('🔧 PhonePe Configuration Debug:', {
      MERCHANT_ID: PHONEPE_CONFIG.MERCHANT_ID ? 'SET' : 'NOT_SET',
      SALT_KEY: PHONEPE_CONFIG.SALT_KEY ? 'SET (' + PHONEPE_CONFIG.SALT_KEY.length + ' chars)' : 'NOT_SET',
      BASE_URL: PHONEPE_CONFIG.BASE_URL,
      CALLBACK_URL: PHONEPE_CONFIG.CALLBACK_URL,
      REDIRECT_URL: PHONEPE_CONFIG.REDIRECT_URL,
      NODE_ENV: process.env.NODE_ENV,
      TEST_MODE: process.env.PHONEPE_TEST_MODE
    });
    
    // Validate PhonePe configuration
    try {
      validatePhonePeConfig();
    } catch (configError) {
      console.error('❌ PhonePe configuration validation failed:', configError.message);
      return res.status(500).json({
        success: false,
        message: 'Payment gateway configuration error: ' + configError.message
      });
    }
    
    const { 
      bookingId, 
      userId, 
      userName, 
      userMobile, 
      userEmail, 
      userWhatsapp,
      bedId, 
      buildingName, 
      amount, 
      checkInDate, 
      checkOutDate,
      pgDetails 
    } = req.body;

    // Validate required fields
    if (!bookingId || !userId || !userName || !userMobile || !userEmail || !bedId || !buildingName || !amount || !checkInDate || !checkOutDate) {
      console.log('❌ Missing required fields:', { bookingId, userId, userName, userMobile, userEmail, bedId, buildingName, amount, checkInDate, checkOutDate });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for PG booking payment'
      });
    }

    console.log('✅ PG Booking Payment Request Validated:', {
      bookingId,
      userName,
      bedId,
      buildingName,
      amount,
      checkInDate,
      checkOutDate
    });

    // Generate unique merchantOrderId (as required by PhonePe)
    const merchantOrderId = 'MO_' + Date.now() + '_' + Math.random().toString(36).substr(2, 7);

    // Amount is already in paise from frontend
    const amountInPaise = Math.round(amount);
    
    console.log('💰 Amount Debug:', {
      originalAmount: amount,
      amountInPaise: amountInPaise,
      amountInRupees: amount / 100
    });

    // --- NEW AUTHENTICATION FLOW ---
    // 1. Get Authorization Token
    const authToken = await getAuthToken(); // Call the new function
    console.log('🔑 Received Auth Token:', authToken ? 'SET' : 'NOT_SET');

    // 2. Prepare PhonePe Create Payment Payload (as per new documentation)
    const paymentPayload = {
      merchantOrderId: merchantOrderId, // Using the generated ID
      amount: amountInPaise,
      // expireAfter: 600, // Optional, uncomment if needed (in seconds)
      paymentFlow: {
        type: 'PG_CHECKOUT',
        merchantUrls: {
          redirectUrl: `${PHONEPE_CONFIG.REDIRECT_URL}?bookingId=${bookingId}&merchantOrderId=${merchantOrderId}`,
        }
      },
      // metaInfo, paymentModeConfig can be added here if needed
    };

    console.log('📤 PhonePe Payment Payload Constructed:', JSON.stringify(paymentPayload, null, 2));
    console.log('🔑 PhonePe Configuration:', {
      MERCHANT_ID: PHONEPE_CONFIG.MERCHANT_ID,
      SALT_INDEX: PHONEPE_CONFIG.SALT_INDEX,
      BASE_URL: PHONEPE_CONFIG.BASE_URL,
      AUTH_TOKEN_URL: PHONEPE_CONFIG.AUTH_TOKEN_URL,
      CALLBACK_URL: PHONEPE_CONFIG.CALLBACK_URL
    });

    // Check if we're in test mode (bypass PhonePe for development)
    const isTestMode = process.env.NODE_ENV === 'development' && process.env.PHONEPE_TEST_MODE === 'true';
    
    if (isTestMode) {
      console.log('🧪 TEST MODE: Bypassing PhonePe API call');
      
      // Simulate successful PhonePe response for testing
      const mockPhonepeResponse = {
        success: true,
        code: 'PAYMENT_INITIATED',
        message: 'Payment initiated successfully',
        data: { // Mock data now needs to reflect the NEW PhonePe response structure
          merchantId: PHONEPE_CONFIG.MERCHANT_ID,
          merchantTransactionId: merchantOrderId,
          instrumentResponse: {
            type: 'PAY_PAGE',
            redirectInfo: {
              redirectUrl: `${PHONEPE_CONFIG.REDIRECT_URL}?bookingId=${bookingId}&merchantOrderId=${merchantOrderId}&amount=${amountInPaise}`
            }
          }
        }
      };
      
      console.log('✅ Mock PhonePe Response:', mockPhonepeResponse);
      
      // Create PaymentHistory record
      const paymentHistory = new PaymentHistory({
        paymentId: `PAY${Date.now()}`,
        bookingId,
        transactionId: merchantOrderId, // Use merchantOrderId
        phonepeTransactionId: 'MOCK_PHONEPE_ID_' + Date.now(), // Mock PhonePe's internal ID
        userId,
        userName,
        userEmail,
        userMobile,
        amount: amount / 100, // Frontend 'amount' is in paise, so this is amount in Rupees for display
        amountInPaise,
        paymentStatus: 'PENDING',
        paymentMethod: 'PhonePe',
        paymentGateway: 'PhonePe',
        redirectUrl: mockPhonepeResponse.data.instrumentResponse.redirectInfo.redirectUrl,
        pgDetails,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate)
      });
      
      await paymentHistory.save();
      console.log('✅ PaymentHistory record created in test mode');
      
      // Update booking with payment initiation details
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'Processing',
        paymentInitiated: true,
        paymentInitiatedAt: new Date(),
        phonepeTransactionId: 'MOCK_PHONEPE_ID_' + Date.now(), // Mock PhonePe's internal ID
        redirectUrl: mockPhonepeResponse.data.instrumentResponse.redirectInfo.redirectUrl
      });
      
      return res.status(200).json({
        success: true,
        message: 'Payment initiated successfully (TEST MODE)',
        data: {
          redirectUrl: mockPhonepeResponse.data.instrumentResponse.redirectInfo.redirectUrl,
          transactionId: merchantOrderId, // Return merchantOrderId
          amount: amount / 100,
          amountInPaise
        }
      });
    }
    
    // Make request to PhonePe v2 API (production mode)
    console.log('🚀 Making request to PhonePe v2 API:', `${PHONEPE_CONFIG.BASE_URL}/v2/pay`);
    
    const requestHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `O-Bearer ${authToken}` // Use the auth token from getAuthToken()
    };

    console.log('📤 Request Headers:', {
      'Content-Type': requestHeaders['Content-Type'],
      'Authorization': 'O-Bearer ' + authToken.substring(0, 20) + '...'
    });

    const phonepeResponse = await axios.post(
      `${PHONEPE_CONFIG.BASE_URL}/v2/pay`, // Use the correct v2 endpoint
      paymentPayload, // Send the new payload structure directly
      {
        headers: requestHeaders,
        timeout: 30000
      }
    );

    console.log('✅ PhonePe v2 API Response Received:', {
      status: phonepeResponse.status,
      statusText: phonepeResponse.statusText,
      data: phonepeResponse.data
    });

    // Check if PhonePe response is successful
    if (!phonepeResponse.data.redirectUrl || !phonepeResponse.data.orderId || phonepeResponse.data.state !== 'PENDING') { // Corrected check for success fields
      console.error('❌ PhonePe v2 API returned unsuccessful response:', phonepeResponse.data);
      throw new Error('Invalid response from PhonePe: ' + JSON.stringify(phonepeResponse.data));
    }

    // Create or update payment history record
    const paymentHistory = new PaymentHistory({
      paymentId: `PAY${Date.now()}`,
      bookingId: bookingId,
      transactionId: merchantOrderId, // Use your merchantOrderId as primary transaction ID
      phonepeTransactionId: phonepeResponse.data.orderId, // Store PhonePe's internal orderId
      userId: userId,
      userName: userName,
      userEmail: userEmail,
      userMobile: userMobile,
      amount: amount / 100, // Convert from paise to rupees for display
      amountInPaise: amountInPaise,
      paymentStatus: 'PENDING',
      paymentMethod: 'PhonePe',
      paymentGateway: 'PhonePe',
      gatewayResponse: phonepeResponse.data, // Store full response
      redirectUrl: phonepeResponse.data.redirectUrl, // Use the redirectUrl from PhonePe's response
      pgDetails: {
        pgName: buildingName,
        bedId: bedId,
        buildingName: buildingName
      },
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate)
    });

    await paymentHistory.save();
    console.log('✅ Payment history record created:', paymentHistory.paymentId);

    // Update booking with payment initiation details
    await Booking.findOneAndUpdate(
      { bookingId: bookingId },
      {
        paymentStatus: 'Processing',
        transactionId: merchantOrderId, // Use your merchantOrderId
        phonepeTransactionId: phonepeResponse.data.orderId, // Store PhonePe's internal orderId
        paymentInitiated: true,
        paymentInitiatedAt: new Date(),
        redirectUrl: phonepeResponse.data.redirectUrl, // Store redirectUrl
        'paymentDetails.phonepeTransactionId': phonepeResponse.data.orderId,
        'paymentDetails.amount': amount,
        'paymentDetails.amountInPaise': amountInPaise,
        'paymentDetails.paymentMethod': 'PhonePe',
        'paymentDetails.paymentGateway': 'PhonePe'
      }
    );

    console.log('✅ Booking updated with payment details');

    console.log('🎉 PG Booking Payment initiated successfully with PhonePe v2 API!');

    // Return success response
    res.status(200).json({
      success: true,
      message: 'PG Booking Payment initiated successfully',
      data: {
        redirectUrl: phonepeResponse.data.redirectUrl, // Return the new redirect URL
        transactionId: merchantOrderId,
        phonepeTransactionId: phonepeResponse.data.orderId,
        bookingId: bookingId,
        amount: amount,
        userName: userName,
        bedId: bedId,
        buildingName: buildingName
      }
    });

  } catch (error) {
    console.error('❌ Error in initiatePGBookingPayment:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('❌ PhonePe API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    // Return appropriate error response
    res.status(500).json({
      success: false,
      message: 'Failed to initiate PG booking payment: ' + error.message,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Payment Callback from PhonePe
// @route   POST /api/pg-payment/callback
// @access  Public
const paymentCallback = async (req, res) => {
  try {
    console.log('📞 Payment Callback Received:', req.body);
    
    const { 
      merchantOrderId, 
      orderId, 
      amount, 
      status, 
      paymentInstrument,
      transactionId,
      bookingId 
    } = req.body;

    if (!merchantOrderId) {
      return res.status(400).json({
        success: false,
        message: 'Missing merchantOrderId'
      });
    }

    console.log('🔄 Processing payment callback for transaction:', merchantOrderId, 'Status:', status);

    // Find the payment history record
    const paymentRecord = await PaymentHistory.findOne({ transactionId: merchantOrderId });
    
    if (!paymentRecord) {
      console.error('❌ Payment record not found for transaction:', merchantOrderId);
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Update payment history
    paymentRecord.paymentStatus = status === 'PAYMENT_SUCCESS' ? 'SUCCESS' : 'FAILED';
    paymentRecord.callbackData = req.body;
    
    if (status === 'PAYMENT_SUCCESS') {
      paymentRecord.paidAt = new Date();
      console.log('✅ Payment successful for transaction:', merchantOrderId);
    } else {
      console.log('❌ Payment failed for transaction:', merchantOrderId);
    }

    await paymentRecord.save();
    console.log('✅ Payment history updated');

    // Update booking status
    const updateData = {
      paymentStatus: status === 'PAYMENT_SUCCESS' ? 'Paid' : 'Failed',
      'paymentDetails.paidAt': status === 'PAYMENT_SUCCESS' ? new Date() : null,
      'paymentDetails.gatewayResponse': req.body
    };

    if (status === 'PAYMENT_SUCCESS') {
      updateData.status = 'Active';
      updateData.adminAction = 'Accepted';
    }

    await Booking.findOneAndUpdate(
      { transactionId: merchantOrderId },
      updateData
    );

    console.log('✅ Booking status updated');

    res.status(200).json({
      success: true,
      message: 'Payment callback processed successfully',
      data: {
        transactionId: merchantOrderId,
        status: status,
        amount: amount,
        bookingId: paymentRecord.bookingId
      }
    });

  } catch (error) {
    console.error('❌ Payment callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment callback',
      error: error.message
    });
  }
};

// @desc    Get Payment History
// @route   GET /api/pg-payment/history
// @access  Public
const getPaymentHistory = async (req, res) => {
  try {
    const { userId, status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (userId) query.userId = userId;
    if (status) query.paymentStatus = status.toUpperCase();

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };

    const paymentHistory = await PaymentHistory.find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit);
    
    const total = await PaymentHistory.countDocuments(query);
    
    const result = {
      docs: paymentHistory,
      totalDocs: total,
      limit: options.limit,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      hasNextPage: options.page < Math.ceil(total / options.limit),
      hasPrevPage: options.page > 1
    };

    res.status(200).json({
      success: true,
      message: 'Payment history retrieved successfully',
      data: paymentHistory
    });

  } catch (error) {
    console.error('❌ Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
      error: error.message
    });
  }
};

// @desc    Get Payment Details by Transaction ID
// @route   GET /api/pg-payment/details/:transactionId
// @access  Public
const getPaymentDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { checkPhonePe } = req.query;

    console.log('🔍 Fetching payment details for transaction:', transactionId);
    console.log('🔍 Check PhonePe status:', checkPhonePe);

    const paymentRecord = await PaymentHistory.findOne({ transactionId: transactionId });
    
    if (!paymentRecord) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Check if we should query PhonePe for latest status
    if (checkPhonePe === 'true' && paymentRecord.paymentStatus === 'PENDING') {
      try {
        console.log('🔄 Checking PhonePe status for transaction:', transactionId);
        
        // Query PhonePe v2 status API
        const authToken = await getAuthToken();
        const phonepeStatusResponse = await axios.get(
          `${PHONEPE_CONFIG.BASE_URL}/v2/status/${transactionId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `O-Bearer ${authToken}`
            }
          }
        );
        
        if (phonepeStatusResponse.data.success) {
          const phonepeStatus = phonepeStatusResponse.data;
          console.log('📡 PhonePe v2 status response:', phonepeStatus);
          
          // Update payment status if it has changed
          if (phonepeStatus.status !== paymentRecord.paymentStatus) {
            paymentRecord.paymentStatus = phonepeStatus.status === 'PAYMENT_SUCCESS' ? 'SUCCESS' : 'FAILED';
            paymentRecord.phonepeStatusData = phonepeStatus;
            
            if (phonepeStatus.status === 'PAYMENT_SUCCESS') {
              paymentRecord.paidAt = new Date();
            }
            
            await paymentRecord.save();
            console.log('✅ Payment status updated from PhonePe:', phonepeStatus.status);
          }
        }
      } catch (phonepeError) {
        console.error('⚠️ Error checking PhonePe status:', phonepeError.message);
        // Don't fail the request, just log the error
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment details retrieved successfully',
      data: paymentRecord
    });

  } catch (error) {
    console.error('❌ Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment details',
      error: error.message
    });
  }
};

// @desc    Test Payment Configuration
// @route   GET /api/pg-payment/test
// @access  Public
const testPaymentConfig = async (req, res) => {
  try {
    console.log('🧪 Testing PG Payment Configuration...');
    
    // Validate configuration
    validatePhonePeConfig();
    
    // Test with minimal payload for v2 API
    const testPayload = {
      merchantOrderId: 'TEST_PG_' + Date.now(),
      amount: 100, // ₹1.00 in paise
      expireAfter: 300, // 5 minutes
      paymentFlow: {
        type: 'PG_CHECKOUT',
        merchantUrls: {
          redirectUrl: 'http://localhost:5173/payment-success',
        }
      },
      metaInfo: {
        test: true,
        timestamp: Date.now()
      }
    };

    // Get authorization token for testing
    const authToken = await getAuthToken();
    const requestHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `O-Bearer ${authToken}`
    };

    console.log('📊 Test Configuration:', {
      MERCHANT_ID: PHONEPE_CONFIG.MERCHANT_ID,
      BASE_URL: PHONEPE_CONFIG.BASE_URL
    });

    console.log('📤 Test Payload:', testPayload);
    console.log('🔐 Generated Auth Token:', authToken ? 'SET' : 'NOT_SET');

    // Test PhonePe API call
    const phonepeResponse = await axios.post(
      `${PHONEPE_CONFIG.BASE_URL}/v2/pay`,
      testPayload,
      {
        headers: requestHeaders,
        timeout: 15000
      }
    );

    console.log('✅ PhonePe API Test Successful!');
    console.log('📡 Response:', phonepeResponse.data);

    res.status(200).json({
      success: true,
      message: 'PG Payment configuration test successful',
      data: {
        config: PHONEPE_CONFIG,
        testPayload: testPayload,
        authToken: authToken ? 'SET' : 'NOT_SET',
        phonepeResponse: phonepeResponse.data
      }
    });

  } catch (error) {
    console.error('❌ PG Payment configuration test failed:', error);
    
    if (error.response) {
      console.error('📡 PhonePe API Error:', error.response.data);
      console.error('📊 PhonePe API Status:', error.response.status);
    }
    
    res.status(500).json({
      success: false,
      message: 'PG Payment configuration test failed',
      error: error.response?.data || error.message
    });
  }
};

// @desc    Auto-approve all pending payments
// @route   POST /api/pg-payment/auto-approve-pending
// @access  Public
const autoApprovePendingPayments = async (req, res) => {
  try {
    console.log('🔄 Auto-approving all pending payments...');
    
    // Find all pending payments
    const pendingPayments = await PaymentHistory.find({ paymentStatus: 'PENDING' });
    
    if (pendingPayments.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No pending payments found',
        approvedCount: 0
      });
    }
    
    console.log(`📊 Found ${pendingPayments.length} pending payments to approve`);
    
    let approvedCount = 0;
    
    // Process each pending payment
    for (const payment of pendingPayments) {
      try {
        console.log(`✅ Approving payment: ${payment.paymentId} (${payment.transactionId})`);
        
        // Update payment status to SUCCESS
        payment.paymentStatus = 'SUCCESS';
        payment.paidAt = new Date();
        payment.adminApproved = true;
        payment.adminApprovedAt = new Date();
        payment.approvalNote = 'Auto-approved by admin';
        
        await payment.save();
        
        // Update booking status
        await Booking.findOneAndUpdate(
          { transactionId: payment.transactionId },
          {
            paymentStatus: 'Paid',
            status: 'Active',
            adminAction: 'Accepted',
            'paymentDetails.paidAt': new Date(),
            'paymentDetails.adminApproved': true,
            'paymentDetails.adminApprovedAt': new Date()
          }
        );
        
        approvedCount++;
        console.log(`✅ Successfully approved payment: ${payment.paymentId}`);
        
      } catch (paymentError) {
        console.error(`❌ Error approving payment ${payment.paymentId}:`, paymentError.message);
        // Continue with other payments even if one fails
      }
    }
    
    console.log(`🎉 Auto-approval completed. Approved ${approvedCount} out of ${pendingPayments.length} payments`);
    
    res.status(200).json({
      success: true,
      message: `Successfully approved ${approvedCount} pending payments`,
      approvedCount: approvedCount,
      totalPending: pendingPayments.length
    });
    
  } catch (error) {
    console.error('❌ Error in auto-approve pending payments:', error);
    res.status(500).json({
      success: false,
      message: 'Error auto-approving pending payments',
      error: error.message
    });
  }
};

// @desc    Approve single payment
// @route   POST /api/pg-payment/approve-single
// @access  Public
const approveSinglePayment = async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;
    
    if (!paymentId || !transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID and Transaction ID are required'
      });
    }
    
    console.log(`🔄 Approving single payment: ${paymentId} (${transactionId})`);
    
    // Find the payment record
    const payment = await PaymentHistory.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }
    
    if (payment.paymentStatus !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Payment is already ${payment.paymentStatus}, cannot approve`
      });
    }
    
    // Update payment status to SUCCESS
    payment.paymentStatus = 'SUCCESS';
    payment.paidAt = new Date();
    payment.adminApproved = true;
    payment.adminApprovedAt = new Date();
    payment.approvalNote = 'Approved by admin';
    
    await payment.save();
    
    // Update booking status
    await Booking.findOneAndUpdate(
      { transactionId: payment.transactionId },
      {
        paymentStatus: 'Paid',
        status: 'Active',
        adminAction: 'Accepted',
        'paymentDetails.paidAt': new Date(),
        'paymentDetails.adminApproved': true,
        'paymentDetails.adminApprovedAt': new Date()
      }
    );
    
    console.log(`✅ Successfully approved payment: ${paymentId}`);
    
    res.status(200).json({
      success: true,
      message: 'Payment approved successfully',
      data: {
        paymentId: payment.paymentId,
        transactionId: payment.transactionId,
        status: payment.paymentStatus,
        approvedAt: payment.paidAt
      }
    });
    
  } catch (error) {
    console.error('❌ Error approving single payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving payment',
      error: error.message
    });
  }
};

module.exports = {
  initiatePGBookingPayment,
  paymentCallback,
  getPaymentHistory,
  getPaymentDetails,
  testPaymentConfig,
  autoApprovePendingPayments,
  approveSinglePayment
};
