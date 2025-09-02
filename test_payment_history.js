const axios = require('axios');

const API_BASE_URL = 'https://api.pg.gradezy.in/api';

async function testPaymentHistory() {
  console.log('🧪 Testing Payment History API\n');

  try {
    // 1. Test basic connectivity
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

    // 3. Test payment history endpoint
    console.log('3️⃣ Testing payment history endpoint...');
    const historyResponse = await axios.get(`${API_BASE_URL}/pg-payment/history`);
    
    if (historyResponse.data.success) {
      console.log('✅ Payment history endpoint working');
      console.log('   Total payments:', historyResponse.data.data.length);
      
      if (historyResponse.data.data.length > 0) {
        console.log('   Sample payment:', {
          paymentId: historyResponse.data.data[0].paymentId,
          status: historyResponse.data.data[0].paymentStatus,
          amount: historyResponse.data.data[0].amountInPaise,
          user: historyResponse.data.data[0].userName
        });
      } else {
        console.log('   ⚠️  No payment records found');
      }
    } else {
      console.log('❌ Payment history endpoint failed:', historyResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }

  console.log('\n🎯 Payment history test completed!');
  console.log('\nNext steps:');
  console.log('1. Check if any payment records exist in the database');
  console.log('2. Verify the payment initiation is creating PaymentHistory records');
  console.log('3. Check backend logs for any errors');
}

// Run the test
testPaymentHistory();
