const axios = require('axios');

const API_BASE_URL = 'https://api.pg.gradezy.in/api';

async function testPaymentStatus() {
  console.log('🔍 Testing Current Payment Status\n');

  try {
    // Get payment history
    const response = await axios.get(`${API_BASE_URL}/pg-payment/history`);
    
    if (response.data.success) {
      const payments = response.data.data;
      
      console.log(`📊 Total Payments: ${payments.length}`);
      
      // Count by status
      const statusCounts = payments.reduce((acc, payment) => {
        acc[payment.paymentStatus] = (acc[payment.paymentStatus] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📈 Status Breakdown:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`   ${status}: ${count}`);
      });
      
      // Show recent payments
      console.log('\n📋 Recent Payments:');
      payments.slice(0, 3).forEach((payment, index) => {
        console.log(`   ${index + 1}. ${payment.paymentId} - ${payment.userName} - ${payment.paymentStatus} - ₹${payment.amount}`);
        if (payment.paidAt) {
          console.log(`      Paid at: ${new Date(payment.paidAt).toLocaleString()}`);
        }
      });
      
    } else {
      console.log('❌ Failed to get payment history');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPaymentStatus();
