const axios = require('axios');

const API_BASE_URL = 'https://api.pg.gradezy.in/api';

async function testIntegration() {
  console.log('🚀 Testing PhonePe Integration Flow\n');

  try {
    // 1. Test backend connectivity
    console.log('1️⃣ Testing backend connectivity...');
    const backendTest = await axios.get(`${API_BASE_URL}/test`);
    console.log('✅ Backend is running:', backendTest.data.message);
    console.log('   Port:', backendTest.data.environment.port);
    console.log('   Environment:', backendTest.data.environment.nodeEnv);
    console.log('');

    // 2. Test PhonePe configuration
    console.log('2️⃣ Testing PhonePe configuration...');
    const phonepeTest = await axios.get(`${API_BASE_URL}/test-phonepe`);
    console.log('✅ PhonePe configuration loaded:');
    console.log('   Merchant ID:', phonepeTest.data.phonepeConfig.merchantId);
    console.log('   Salt Key:', phonepeTest.data.phonepeConfig.saltKey);
    console.log('   Salt Index:', phonepeTest.data.phonepeConfig.saltIndex);
    console.log('   Base URL:', phonepeTest.data.phonepeConfig.baseUrl);
    console.log('   Callback URL:', phonepeTest.data.phonepeConfig.callbackUrl);
    console.log('   Redirect URL:', phonepeTest.data.phonepeConfig.redirectUrl);
    console.log('   Test Mode:', phonepeTest.data.phonepeConfig.testMode);
    console.log('');

    // 3. Test PG payment endpoint
    console.log('3️⃣ Testing PG payment endpoint...');
    const testPaymentData = {
      bookingId: 'TEST_BOOKING_' + Date.now(),
      userId: 'test@example.com',
      userName: 'Test User',
      userMobile: '9999999999',
      userEmail: 'test@example.com',
      userWhatsapp: '9999999999',
      bedId: 'TEST_BED_001',
      buildingName: 'Test PG',
      amount: 100, // 1 rupee in paise
      checkInDate: '2024-12-01',
      checkOutDate: '2024-12-31',
      pgDetails: {
        pgName: 'Test PG',
        floor: 'Floor 1',
        room: 'Room 101',
        bedId: 'TEST_BED_001',
        buildingName: 'Test PG'
      }
    };

    console.log('📤 Sending test payment data...');
    const paymentResponse = await axios.post(`${API_BASE_URL}/pg-payment/initiate`, testPaymentData);
    
    if (paymentResponse.data.success) {
      console.log('✅ Payment initiation successful!');
      console.log('   Transaction ID:', paymentResponse.data.data.transactionId);
      console.log('   Redirect URL:', paymentResponse.data.data.redirectUrl);
      console.log('   Amount:', paymentResponse.data.data.amount);
    } else {
      console.log('❌ Payment initiation failed:', paymentResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }

  console.log('\n🎯 Integration test completed!');
  console.log('\nNext steps:');
  console.log('1. Frontend should be accessible at: http://localhost:5173');
  console.log('2. Test the complete flow at: http://localhost:5173/bookingpg');
  console.log('3. Check backend logs for detailed debugging information');
}

// Run the test
testIntegration();
