const axios = require('axios');

// Test dashboard revenue calculation
async function testDashboardRevenue() {
  console.log('🧪 Testing Dashboard Revenue Calculation...\n');
  
  const API_BASE_URL = 'http://localhost:5001/api';
  
  try {
    // Test 1: Check dashboard stats endpoint
    console.log('📊 Test 1: Fetching dashboard statistics...');
    const response = await axios.get(`${API_BASE_URL}/dashboard/stats`);
    
    if (response.data.success) {
      const data = response.data.data;
      console.log('✅ Dashboard data fetched successfully!');
      console.log('📈 Overall Statistics:');
      console.log('   - Total PGs:', data.overall.totalPGs);
      console.log('   - Total Floors:', data.overall.totalFloors);
      console.log('   - Total Rooms:', data.overall.totalRooms);
      console.log('   - Total Beds:', data.overall.totalBeds);
      console.log('   - Occupied Beds:', data.overall.totalOccupiedBeds);
      console.log('   - Available Beds:', data.overall.totalAvailableBeds);
      console.log('   - 💰 Total Revenue: ₹', data.overall.totalRevenue);
      console.log('   - Average Occupancy:', data.overall.averageOccupancy + '%');
      
      console.log('\n🏢 PG Properties:');
      data.pgs.forEach((pg, index) => {
        console.log(`   ${index + 1}. ${pg.buildingName} (${pg.address})`);
        console.log(`      - Revenue: ₹${pg.totalRevenue}`);
        console.log(`      - Occupancy: ${pg.occupancyPercentage}%`);
        console.log(`      - Beds: ${pg.occupiedBeds}/${pg.totalBeds} occupied`);
      });
      
    } else {
      console.log('❌ Dashboard data fetch failed:', response.data.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your backend server is running on http://localhost:5001');
      console.log('   Run: cd backend && npm run dev');
    }
  }
  
  console.log('\n🎉 Dashboard revenue testing completed!');
  console.log('\n📝 Next steps:');
  console.log('   1. Make sure backend server is running: cd backend && npm run dev');
  console.log('   2. Make sure frontend server is running: cd frontend && npm run dev');
  console.log('   3. Login to admin panel: http://localhost:5173/adminlogin');
  console.log('   4. Go to Dashboard page');
  console.log('   5. Check if Total Revenue shows the correct amount');
  console.log('   6. Check browser console for debug messages');
}

// Run the test
testDashboardRevenue();
