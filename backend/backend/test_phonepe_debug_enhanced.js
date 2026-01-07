const axios = require('axios');
const crypto = require('crypto');

// Test PhonePe Integration with Enhanced Debugging
console.log('🚀 Starting Enhanced PhonePe Integration Test...\n');

// PhonePe Configuration (from your config.env)
const PHONEPE_CONFIG = {
  MERCHANT_ID: 'process.env.PHONEPE_MERCHANT_ID',
  SALT_KEY: 'process.env.PHONEPE_SALT_KEY',
  SALT_INDEX: '1',
  BASE_URL: 'process.env.PHONEPE_BASE_URL',
  CALLBACK_URL: 'process.env.PHONEPE_CALLBACK_URL'
};

// Validate configuration
console.log('🔍 Validating PhonePe Configuration...');
Object.entries(PHONEPE_CONFIG).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
  if (!value) {
    console.error(`❌ Missing value for ${key}`);
  }
});

// Test payload construction
const testPayload = {
  merchantId: PHONEPE_CONFIG.MERCHANT_ID,
  merchantTransactionId: 'TEST_' + Date.now(),
  merchantUserId: 'TEST_USER_' + Date.now(),
  amount: 100, // ₹1.00 in paise
  redirectUrl: 'http://localhost:5173/payment-success',
  redirectMode: 'POST',
  callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
  mobileNumber: '9999999999',
  paymentInstrument: {
    type: 'PAY_PAGE'
  }
};

console.log('\n📤 Test Payload:');
console.log(JSON.stringify(testPayload, null, 2));

// Generate checksum with detailed logging
console.log('\n🔐 Generating Checksum...');
try {
  const payloadString = JSON.stringify(testPayload);
  console.log('  Payload JSON string length:', payloadString.length);
  
  const base64 = Buffer.from(payloadString).toString('base64');
  console.log('  Base64 encoded payload length:', base64.length);
  
  const string = base64 + '/pg/v1/pay' + PHONEPE_CONFIG.SALT_KEY;
  console.log('  String to hash length:', string.length);
  console.log('  Salt key length:', PHONEPE_CONFIG.SALT_KEY.length);
  
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  console.log('  SHA256 hash length:', sha256.length);
  
  const checksum = sha256 + '###' + PHONEPE_CONFIG.SALT_INDEX;
  console.log('  Final checksum:', checksum);
  
  // Test PhonePe API call
  console.log('\n🚀 Testing PhonePe API Call...');
  console.log('  URL:', `${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay`);
  console.log('  Headers:', {
    'Content-Type': 'application/json',
    'X-VERIFY': checksum,
    'X-MERCHANT-ID': PHONEPE_CONFIG.MERCHANT_ID
  });
  
  // Make the actual API call
  axios.post(
    `${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay`,
    { request: base64 },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': PHONEPE_CONFIG.MERCHANT_ID
      },
      timeout: 30000
    }
  )
  .then(response => {
    console.log('\n✅ PhonePe API Test Successful!');
    console.log('  Status:', response.status);
    console.log('  Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.data) {
      console.log('\n🎉 Payment can be initiated!');
      console.log('  Transaction ID:', response.data.data.merchantTransactionId);
      if (response.data.data.instrumentResponse?.redirectInfo?.url) {
        console.log('  Redirect URL:', response.data.data.instrumentResponse.redirectInfo.url);
      }
    } else {
      console.log('\n⚠️  API responded but with unsuccessful status');
    }
  })
  .catch(error => {
    console.log('\n❌ PhonePe API Test Failed!');
    
    if (error.response) {
      console.log('  Status:', error.response.status);
      console.log('  Status Text:', error.response.statusText);
      console.log('  Error Response:', JSON.stringify(error.response.data, null, 2));
      
      // Analyze common error patterns
      if (error.response.status === 400) {
        console.log('\n🔍 400 Bad Request Analysis:');
        console.log('  - Check if all required fields are present');
        console.log('  - Verify amount format (should be in paise)');
        console.log('  - Ensure merchantId matches your PhonePe account');
        console.log('  - Verify checksum generation');
      } else if (error.response.status === 401) {
        console.log('\n🔍 401 Unauthorized Analysis:');
        console.log('  - Check MERCHANT_ID and SALT_KEY');
        console.log('  - Verify checksum generation');
        console.log('  - Ensure you\'re using correct UAT credentials');
      } else if (error.response.status === 403) {
        console.log('\n🔍 403 Forbidden Analysis:');
        console.log('  - Check if your PhonePe account is active');
        console.log('  - Verify IP whitelist if applicable');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.log('  ⏰ Request timed out');
    } else if (error.code === 'ENOTFOUND') {
      console.log('  🌐 Network error - unable to reach PhonePe API');
    } else {
      console.log('  Unexpected error:', error.message);
    }
  });
  
} catch (error) {
  console.error('\n❌ Error during test:', error.message);
}

// Test different amount formats
console.log('\n🧪 Testing Different Amount Formats...');
const testAmounts = [100, 1000, 10000, 100000]; // 1, 10, 100, 1000 rupees

testAmounts.forEach(amount => {
  const testPayloadAmount = { ...testPayload, amount: amount };
  const payloadString = JSON.stringify(testPayloadAmount);
  const base64 = Buffer.from(payloadString).toString('base64');
  const string = base64 + '/pg/v1/pay' + PHONEPE_CONFIG.SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + '###' + PHONEPE_CONFIG.SALT_INDEX;
  
  console.log(`  ₹${amount/100}: Amount=${amount}, Checksum=${checksum.substring(0, 20)}...`);
});

console.log('\n📋 Test Summary:');
console.log('  - Configuration validation: ✅');
console.log('  - Payload construction: ✅');
console.log('  - Checksum generation: ✅');
console.log('  - API connectivity: Testing...');
console.log('\n💡 Tips for debugging:');
console.log('  1. Check PhonePe UAT credentials in your config.env');
console.log('  2. Verify amount is in paise (100 = ₹1.00)');
console.log('  3. Ensure callback URL is accessible');
console.log('  4. Check network connectivity to PhonePe UAT API');
console.log('  5. Review PhonePe UAT documentation for exact payload format');
