const axios = require('axios');
const crypto = require('crypto');

// Test PhonePe Configuration
const PHONEPE_CONFIG = {
  MERCHANT_ID: 'TEST-M232T7DTC1W58_25082',
  SALT_KEY: 'NTE2NWRjMzItYzA1NS00YjM0LTk5NmItMmZIYjA2YzU0OTcz',
  SALT_INDEX: '1',
  BASE_URL: 'https://api-preprod.phonepe.com/apis/pg-sandbox'
};

// Generate PhonePe checksum (same logic as backend)
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
  redirectUrl: 'http://localhost:5173/payment-success',
  redirectMode: 'POST',
  callbackUrl: 'process.env.PHONEPE_CALLBACK_URL',
  mobileNumber: '9999999999',
  paymentInstrument: {
    type: 'PAY_PAGE'
  }
};

console.log('=== PhonePe Integration Test ===\n');

console.log('Configuration:');
console.log('Merchant ID:', PHONEPE_CONFIG.MERCHANT_ID);
console.log('Salt Key:', PHONEPE_CONFIG.SALT_KEY);
console.log('Salt Index:', PHONEPE_CONFIG.SALT_INDEX);
console.log('Base URL:', PHONEPE_CONFIG.BASE_URL);
console.log('');

console.log('Test Payload:');
console.log(JSON.stringify(testPayload, null, 2));
console.log('');

// Generate checksum
const checksum = generateChecksum(testPayload);
const base64Payload = Buffer.from(JSON.stringify(testPayload)).toString('base64');

console.log('Generated Checksum:', checksum);
console.log('Base64 Payload:', base64Payload);
console.log('');

// Test API call
async function testPhonePeAPI() {
  try {
    console.log('Testing PhonePe API...');
    
    const response = await axios.post(
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

    console.log('✅ PhonePe API Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.data?.instrumentResponse?.redirectInfo?.url) {
      console.log('\n🎉 SUCCESS! Payment gateway is working.');
      console.log('Redirect URL:', response.data.data.instrumentResponse.redirectInfo.url);
    } else {
      console.log('\n⚠️  API responded but with unexpected data structure.');
    }

  } catch (error) {
    console.log('❌ PhonePe API Error:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 404) {
        console.log('\n🔍 Issue: Invalid merchant configuration or API endpoint');
      } else if (error.response.status === 400) {
        console.log('\n🔍 Issue: Invalid request parameters');
      } else if (error.response.status === 401) {
        console.log('\n🔍 Issue: Authentication failed');
      }
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Run the test
testPhonePeAPI();

console.log('\n=== Test Complete ===');
console.log('\nTo test the full integration:');
console.log('1. Start backend: cd backend && npm start');
console.log('2. Start frontend: cd frontend && npm run dev');
console.log('3. Visit: http://localhost:5173/bookingpg');
console.log('4. Fill form and click "Book Now & Pay"');
console.log('5. Check backend logs for detailed information');
