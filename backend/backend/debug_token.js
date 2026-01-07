const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });
const axios = require('axios');

// Load environment variables
const PHONEPE_CONFIG = {
  MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID,
  SALT_KEY: process.env.PHONEPE_SALT_KEY,
  SALT_INDEX: process.env.PHONEPE_SALT_INDEX,
  AUTH_TOKEN_URL: process.env.PHONEPE_AUTH_TOKEN_URL
};

console.log('🔧 PhonePe Configuration for Token Generation:', {
  MERCHANT_ID: PHONEPE_CONFIG.MERCHANT_ID,
  SALT_KEY: PHONEPE_CONFIG.SALT_KEY ? 'SET (' + PHONEPE_CONFIG.SALT_KEY.length + ' chars)' : 'NOT_SET',
  SALT_INDEX: PHONEPE_CONFIG.SALT_INDEX,
  AUTH_TOKEN_URL: PHONEPE_CONFIG.AUTH_TOKEN_URL
});

async function debugTokenGeneration() {
  try {
    console.log('\n🧪 Debugging PhonePe Token Generation...');
    
    // Test different request formats
    const testCases = [
      {
        name: 'URLSearchParams (x-www-form-urlencoded)',
        data: (() => {
          const params = new URLSearchParams();
          params.append('client_id', PHONEPE_CONFIG.MERCHANT_ID);
          params.append('client_version', PHONEPE_CONFIG.SALT_INDEX);
          params.append('client_secret', PHONEPE_CONFIG.SALT_KEY);
          params.append('grant_type', 'client_credentials');
          return params.toString();
        })(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      },
      {
        name: 'JSON payload',
        data: {
          client_id: PHONEPE_CONFIG.MERCHANT_ID,
          client_version: PHONEPE_CONFIG.SALT_INDEX,
          client_secret: PHONEPE_CONFIG.SALT_KEY,
          grant_type: 'client_credentials'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      },
      {
        name: 'Form data with different client_version',
        data: (() => {
          const params = new URLSearchParams();
          params.append('client_id', PHONEPE_CONFIG.MERCHANT_ID);
          params.append('client_version', '1'); // Try string version
          params.append('client_secret', PHONEPE_CONFIG.SALT_KEY);
          params.append('grant_type', 'client_credentials');
          return params.toString();
        })(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n🔐 Testing: ${testCase.name}`);
      console.log('📤 Data:', testCase.data);
      console.log('📤 Headers:', testCase.headers);
      console.log('🌐 URL:', PHONEPE_CONFIG.AUTH_TOKEN_URL);
      
      try {
        const response = await axios.post(
          PHONEPE_CONFIG.AUTH_TOKEN_URL,
          testCase.data,
          {
            headers: testCase.headers,
            timeout: 15000
          }
        );
        
        console.log('✅ SUCCESS! Response:', response.data);
        return;
        
      } catch (error) {
        if (error.response) {
          console.log('❌ FAILED:', error.response.status, error.response.data);
          console.log('📊 Response Headers:', error.response.headers);
        } else {
          console.log('❌ FAILED:', error.message);
        }
      }
    }

    console.log('\n❌ All token generation methods failed');
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

// Run the debug
debugTokenGeneration();
