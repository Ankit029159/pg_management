require('dotenv').config({ path: 'config.env' });
const crypto = require('crypto');
const axios = require('axios');

// PhonePe Configuration
const PHONEPE_CONFIG = {
  MERCHANT_ID: process.env.PHONEPE_CLIENT_ID,
  SALT_KEY: process.env.PHONEPE_CLIENT_SECRET,
  SALT_INDEX: process.env.PHONEPE_CLIENT_VERSION,
  BASE_URL: process.env.PHONEPE_BASE_URL,
  CALLBACK_URL: process.env.CALLBACK_URL
};

console.log('🔍 PhonePe Configuration:');
console.log('MERCHANT_ID:', PHONEPE_CONFIG.MERCHANT_ID);
console.log('SALT_KEY:', PHONEPE_CONFIG.SALT_KEY);
console.log('SALT_INDEX:', PHONEPE_CONFIG.SALT_INDEX);
console.log('BASE_URL:', PHONEPE_CONFIG.BASE_URL);
console.log('CALLBACK_URL:', PHONEPE_CONFIG.CALLBACK_URL);
console.log('');

// Generate checksum
const generateChecksum = (payload) => {
  const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const string = base64 + '/pg/v1/pay' + PHONEPE_CONFIG.SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  return sha256 + '###' + PHONEPE_CONFIG.SALT_INDEX;
};

// Test with minimal payload (exactly like your working project)
const testPayment = async () => {
  try {
    console.log('🧪 Testing PhonePe API with minimal payload...');
    
    const payload = {
      merchantId: PHONEPE_CONFIG.MERCHANT_ID,
      merchantTransactionId: 'TEST_' + Date.now(),
      merchantUserId: 'TEST_USER',
      amount: 100, // ₹1.00 in paise
      redirectUrl: 'http://localhost:5173/payment-success',
      redirectMode: 'POST',
      callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
      mobileNumber: '9999999999',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    console.log('📤 Payload:', JSON.stringify(payload, null, 2));
    
    const checksum = generateChecksum(payload);
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    
    console.log('🔐 Generated Checksum:', checksum);
    console.log('📦 Base64 Payload:', base64Payload);
    console.log('');

    // Make request to PhonePe
    console.log('🚀 Making request to PhonePe API...');
    const response = await axios.post(
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

    console.log('✅ PhonePe API Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ PhonePe API Error:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
  }
};

// Test with different payload formats
const testDifferentFormats = async () => {
  console.log('\n🔄 Testing different payload formats...');
  
  const testCases = [
    {
      name: 'Minimal UAT Format',
      payload: {
        merchantId: PHONEPE_CONFIG.MERCHANT_ID,
        merchantTransactionId: 'TEST_' + Date.now(),
        amount: 100,
        redirectUrl: 'http://localhost:5173/payment-success',
        redirectMode: 'POST',
        callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
        mobileNumber: '9999999999',
        paymentInstrument: { type: 'PAY_PAGE' }
      }
    },
    {
      name: 'With User Details',
      payload: {
        merchantId: PHONEPE_CONFIG.MERCHANT_ID,
        merchantTransactionId: 'TEST_' + Date.now(),
        merchantUserId: 'TEST_USER',
        amount: 100,
        redirectUrl: 'http://localhost:5173/payment-success',
        redirectMode: 'POST',
        callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
        mobileNumber: '9999999999',
        paymentInstrument: { type: 'PAY_PAGE' },
        userDetails: {
          name: 'Test User',
          email: 'test@example.com',
          mobileNumber: '9999999999'
        }
      }
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n📝 Testing: ${testCase.name}`);
      
      const checksum = generateChecksum(testCase.payload);
      const base64Payload = Buffer.from(JSON.stringify(testCase.payload)).toString('base64');
      
      const response = await axios.post(
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

      console.log(`✅ ${testCase.name} - SUCCESS`);
      console.log('Response:', response.data.code || response.data.message);

    } catch (error) {
      console.log(`❌ ${testCase.name} - FAILED`);
      if (error.response) {
        console.log('Error:', error.response.data.message || error.response.data.error);
      } else {
        console.log('Error:', error.message);
      }
    }
  }
};

// Run tests
const runTests = async () => {
  console.log('🚀 Starting PhonePe API Debug Tests...\n');
  
  await testPayment();
  await testDifferentFormats();
  
  console.log('\n🏁 Debug tests completed!');
};

runTests();
