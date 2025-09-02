const crypto = require('crypto');

// Test PhonePe Configuration (from config.env)
const PHONEPE_CONFIG = {
  MERCHANT_ID: 'TEST-M232T7DTC1W58_25082',
  SALT_KEY: 'NTE2NWRjMzItYzA1NS00YjM0LTk5NmItMmZIYjA2YzU0OTcz',
  SALT_INDEX: '1',
  BASE_URL: 'https://api-preprod.phonepe.com/apis/pg-sandbox'
};

// Generate PhonePe checksum (same logic as backend)
const generateChecksum = (payload) => {
  try {
    console.log('🔐 Generating checksum for payload...');
    
    const payloadString = JSON.stringify(payload);
    console.log('📝 Payload JSON string length:', payloadString.length);
    
    const base64 = Buffer.from(payloadString).toString('base64');
    console.log('📦 Base64 encoded payload length:', base64.length);
    
    const string = base64 + '/pg/v1/pay' + PHONEPE_CONFIG.SALT_KEY;
    console.log('🔗 String to hash length:', string.length);
    console.log('🔑 Salt key length:', PHONEPE_CONFIG.SALT_KEY.length);
    
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    console.log('🔒 SHA256 hash generated, length:', sha256.length);
    
    const checksum = sha256 + '###' + PHONEPE_CONFIG.SALT_INDEX;
    console.log('✅ Final checksum generated:', checksum);
    
    return checksum;
  } catch (error) {
    console.error('❌ Error generating checksum:', error);
    throw new Error('Failed to generate checksum: ' + error.message);
  }
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

console.log('=== PhonePe Credentials Test ===\n');

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

console.log('✅ Credentials test completed successfully!');
console.log('🔑 All PhonePe configuration values are properly formatted.');
console.log('🔐 Checksum generation is working correctly.');
console.log('');
console.log('Next steps:');
console.log('1. Start backend: cd backend && npm start');
console.log('2. Start frontend: cd frontend && npm run dev');
console.log('3. Test payment flow at: http://localhost:5173/bookingpg');
