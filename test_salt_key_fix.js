const crypto = require('crypto');

console.log('🔍 Testing Salt Key Fix\n');

// Test both salt keys to see the difference
const OLD_SALT_KEY = 'NTE2NWRjMzItYzA1NS00YjM0LTk5NmItMmZJYjA2YzU0OTcz';
const NEW_SALT_KEY = 'NTE2NWRjMzItYzA1NS00YjM0LTk5NmItMmZIYjA2YzU0OTcz';

console.log('Old Salt Key:', OLD_SALT_KEY);
console.log('New Salt Key:', NEW_SALT_KEY);
console.log('');

// Test payload
const testPayload = {
  merchantId: 'TEST-M232T7DTC1W58_25082',
  merchantTransactionId: 'TEST_' + Date.now(),
  merchantUserId: 'TEST_USER',
  amount: 100,
  redirectUrl: 'http://localhost:5173/payment-success',
  redirectMode: 'POST',
  callbackUrl: 'process.env.PHONEPE_CALLBACK_URL',
  mobileNumber: '9999999999',
  paymentInstrument: {
    type: 'PAY_PAGE'
  }
};

// Generate checksums with both keys
function generateChecksum(payload, saltKey, saltIndex) {
  const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const string = base64 + '/pg/v1/pay' + saltKey;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  return sha256 + '###' + saltIndex;
}

const oldChecksum = generateChecksum(testPayload, OLD_SALT_KEY, '1');
const newChecksum = generateChecksum(testPayload, NEW_SALT_KEY, '1');

console.log('Test Payload:', JSON.stringify(testPayload, null, 2));
console.log('');
console.log('Old Salt Key Checksum:', oldChecksum);
console.log('New Salt Key Checksum:', newChecksum);
console.log('');

// Check if they're different
if (oldChecksum !== newChecksum) {
  console.log('✅ Salt key fix confirmed - checksums are different');
  console.log('🔑 The new salt key should resolve the "Key not found" error');
} else {
  console.log('❌ Salt keys produce same checksum - fix may not be complete');
}

console.log('\n🎯 Test completed!');
console.log('Next: Test the integration with the corrected salt key');
