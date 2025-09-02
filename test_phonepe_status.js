const axios = require('axios');

const API_BASE_URL = 'https://api.pg.gradezy.in/api';

async function testPhonePeStatus() {
  console.log('🧪 Testing PhonePe Status Checking\n');

  try {
    // 1. Test backend connectivity
    console.log('1️⃣ Testing backend connectivity...');
    const backendTest = await axios.get(`${API_BASE_URL}/test`);
    console.log('✅ Backend is running:', backendTest.data.message);
    console.log('');

    // 2. Test PhonePe configuration
    console.log('2️⃣ Testing PhonePe configuration...');
    const phonepeTest = await axios.get(`${API_BASE_URL}/test-phonepe`);
    console.log('✅ PhonePe configuration loaded');
    console.log('   Test Mode:', phonepeTest.data.phonepeConfig.testMode);
    console.log('');

    // 3. Test payment details with PhonePe status check
    console.log('3️⃣ Testing payment details with PhonePe status check...');
    
    // Use the transaction ID from your current payment
    const transactionId = 'TXN_1756746878545_075dvyaly';
    
    console.log('   Transaction ID:', transactionId);
    
    const statusResponse = await axios.get(`${API_BASE_URL}/pg-payment/details/${transactionId}?checkPhonePe=true`);
    
    if (statusResponse.data.success) {
      const paymentData = statusResponse.data.data;
      console.log('✅ Payment details retrieved successfully');
      console.log('   Payment ID:', paymentData.paymentId);
      console.log('   Status:', paymentData.paymentStatus);
      console.log('   Amount:', paymentData.amount, 'INR');
      console.log('   PhonePe Transaction ID:', paymentData.phonepeTransactionId);
      
      if (paymentData.phonepeStatusData) {
        console.log('   PhonePe Status Data:', paymentData.phonepeStatusData);
      }
    } else {
      console.log('❌ Failed to get payment details:', statusResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }

  console.log('\n🎯 PhonePe status test completed!');
  console.log('\nNext steps:');
  console.log('1. Check if PhonePe status API is working');
  console.log('2. Verify the payment status is being updated');
  console.log('3. Check backend logs for any PhonePe API errors');
}

// Run the test
testPhonePeStatus();

