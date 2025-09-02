const axios = require('axios');

const API_BASE_URL = 'https://api.pg.gradezy.in/api';

async function testAutoApproval() {
  console.log('🧪 Testing Auto-Approval Functionality\n');

  try {
    // 1. Test backend connectivity
    console.log('1️⃣ Testing backend connectivity...');
    const backendTest = await axios.get(`${API_BASE_URL}/test`);
    console.log('✅ Backend is running:', backendTest.data.message);
    console.log('');

    // 2. Check current payment history
    console.log('2️⃣ Checking current payment history...');
    const historyResponse = await axios.get(`${API_BASE_URL}/pg-payment/history`);
    
    if (historyResponse.data.success) {
      const payments = historyResponse.data.data;
      const pendingPayments = payments.filter(p => p.paymentStatus === 'PENDING');
      const successfulPayments = payments.filter(p => p.paymentStatus === 'SUCCESS');
      
      console.log('✅ Payment history loaded');
      console.log('   Total payments:', payments.length);
      console.log('   Pending payments:', pendingPayments.length);
      console.log('   Successful payments:', successfulPayments.length);
      console.log('');
      
      if (pendingPayments.length === 0) {
        console.log('⚠️  No pending payments found to approve');
        console.log('   You can create a new payment to test the auto-approval feature');
        return;
      }
      
      // 3. Test auto-approve functionality
      console.log('3️⃣ Testing auto-approve functionality...');
      console.log(`   Found ${pendingPayments.length} pending payments to approve`);
      
      const autoApproveResponse = await axios.post(`${API_BASE_URL}/pg-payment/auto-approve-pending`);
      
      if (autoApproveResponse.data.success) {
        console.log('✅ Auto-approval successful!');
        console.log('   Message:', autoApproveResponse.data.message);
        console.log('   Approved count:', autoApproveResponse.data.approvedCount);
        console.log('   Total pending:', autoApproveResponse.data.totalPending);
        console.log('');
        
        // 4. Verify the changes
        console.log('4️⃣ Verifying changes...');
        const updatedHistoryResponse = await axios.get(`${API_BASE_URL}/pg-payment/history`);
        
        if (updatedHistoryResponse.data.success) {
          const updatedPayments = updatedHistoryResponse.data.data;
          const updatedPendingPayments = updatedPayments.filter(p => p.paymentStatus === 'PENDING');
          const updatedSuccessfulPayments = updatedPayments.filter(p => p.paymentStatus === 'SUCCESS');
          
          console.log('✅ Payment status updated successfully');
          console.log('   Updated pending payments:', updatedPendingPayments.length);
          console.log('   Updated successful payments:', updatedSuccessfulPayments.length);
          console.log('');
          
          // Show some approved payments
          if (updatedSuccessfulPayments.length > 0) {
            console.log('📋 Recently approved payments:');
            updatedSuccessfulPayments.slice(0, 3).forEach((payment, index) => {
              console.log(`   ${index + 1}. ${payment.paymentId} - ${payment.userName} - ₹${payment.amount}`);
            });
          }
        }
        
      } else {
        console.log('❌ Auto-approval failed:', autoApproveResponse.data.message);
      }
      
    } else {
      console.log('❌ Failed to load payment history:', historyResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }

  console.log('\n🎯 Auto-approval test completed!');
  console.log('\nNext steps:');
  console.log('1. Check the admin payment history page');
  console.log('2. Verify that pending payments are now approved');
  console.log('3. Test the "Check Status" button on the payment success page');
}

// Run the test
testAutoApproval();

