const axios = require('axios');

// Test admin contact functionality
async function testAdminContact() {
  console.log('🧪 Testing Admin Contact Functionality...\n');
  
  const API_BASE_URL = 'http://localhost:5001/api';
  
  try {
    // Test 1: Submit a contact form (public endpoint)
    console.log('📧 Test 1: Submitting contact form...');
    const contactData = {
      name: 'Admin Test User',
      email: 'admin.test@example.com',
      phone: '9876543210',
      subject: 'Admin Test Message',
      message: 'This is a test message to verify admin panel functionality.',
      type: 'contact'
    };
    
    const submitResponse = await axios.post(`${API_BASE_URL}/contact`, contactData);
    
    if (submitResponse.data.success) {
      console.log('✅ Contact form submitted successfully!');
      console.log('📋 Contact ID:', submitResponse.data.data.id);
      
      // Test 2: Try to get contacts without authentication (should fail)
      console.log('\n🔒 Test 2: Testing admin endpoint without authentication...');
      try {
        const contactsResponse = await axios.get(`${API_BASE_URL}/contact`);
        console.log('❌ Admin endpoint should be protected but returned data:', contactsResponse.data);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('✅ Admin endpoint properly protected (401 Unauthorized)');
        } else {
          console.log('❌ Unexpected error:', error.response?.data || error.message);
        }
      }
      
      // Test 3: Try to get contact stats without authentication (should fail)
      console.log('\n📊 Test 3: Testing stats endpoint without authentication...');
      try {
        const statsResponse = await axios.get(`${API_BASE_URL}/contact/stats`);
        console.log('❌ Stats endpoint should be protected but returned data:', statsResponse.data);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('✅ Stats endpoint properly protected (401 Unauthorized)');
        } else {
          console.log('❌ Unexpected error:', error.response?.data || error.message);
        }
      }
      
    } else {
      console.log('❌ Contact form submission failed:', submitResponse.data.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your backend server is running on http://localhost:5001');
      console.log('   Run: cd backend && npm run dev');
    }
  }
  
  console.log('\n🎉 Admin contact testing completed!');
  console.log('\n📝 Next steps:');
  console.log('   1. Make sure backend server is running: cd backend && npm run dev');
  console.log('   2. Make sure frontend server is running: cd frontend && npm run dev');
  console.log('   3. Login to admin panel: http://localhost:5173/adminlogin');
  console.log('   4. Go to Contact Management page');
  console.log('   5. Check browser console for debug messages');
  console.log('   6. If you see 401 errors, you need to login to admin panel first');
}

// Run the test
testAdminContact();
