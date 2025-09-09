const axios = require('axios');

// Test contact form functionality
async function testContactForm() {
  console.log('🧪 Testing Contact Form Functionality...\n');
  
  const API_BASE_URL = 'http://localhost:5001/api';
  
  try {
    // Test 1: Submit a contact form
    console.log('📧 Test 1: Submitting contact form...');
    const contactData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '9876543210',
      subject: 'Test Contact Form Submission',
      message: 'This is a test message from the contact form. I would like to know more about your PG facilities.',
      type: 'contact'
    };
    
    const submitResponse = await axios.post(`${API_BASE_URL}/contact`, contactData);
    
    if (submitResponse.data.success) {
      console.log('✅ Contact form submitted successfully!');
      console.log('📋 Response:', submitResponse.data.data);
      const contactId = submitResponse.data.data.id;
      
      // Test 2: Get all contacts (admin endpoint - will fail without auth, but that's expected)
      console.log('\n📋 Test 2: Fetching all contacts (admin endpoint)...');
      try {
        const contactsResponse = await axios.get(`${API_BASE_URL}/contact`);
        console.log('✅ Contacts fetched successfully!');
        console.log('📊 Total contacts:', contactsResponse.data.data.length);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('✅ Admin endpoint properly protected (401 Unauthorized)');
        } else {
          console.log('❌ Unexpected error:', error.response?.data || error.message);
        }
      }
      
      // Test 3: Get contact statistics (admin endpoint)
      console.log('\n📊 Test 3: Fetching contact statistics...');
      try {
        const statsResponse = await axios.get(`${API_BASE_URL}/contact/stats`);
        console.log('✅ Statistics fetched successfully!');
        console.log('📈 Stats:', statsResponse.data.data);
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
  
  console.log('\n🎉 Contact form testing completed!');
  console.log('\n📝 Next steps:');
  console.log('   1. Start your backend server: cd backend && npm run dev');
  console.log('   2. Start your frontend server: cd frontend && npm run dev');
  console.log('   3. Visit http://localhost:5173/contact to test the form');
  console.log('   4. Login to admin panel to see the contact messages');
}

// Run the test
testContactForm();
