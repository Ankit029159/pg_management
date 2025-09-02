const axios = require('axios');

const API_BASE_URL = 'https://api.pg.gradezy.in/api';

async function testDashboard() {
  console.log('🧪 Testing Dashboard Functionality\n');

  try {
    // 1. Test dashboard stats
    console.log('1️⃣ Testing dashboard statistics...');
    const statsResponse = await axios.get(`${API_BASE_URL}/dashboard/stats`);
    
    if (statsResponse.data.success) {
      const data = statsResponse.data.data;
      console.log('✅ Dashboard stats loaded successfully');
      console.log('');
      
      // Overall stats
      console.log('📊 Overall Statistics:');
      console.log(`   Total PGs: ${data.overall.totalPGs}`);
      console.log(`   Total Floors: ${data.overall.totalFloors}`);
      console.log(`   Total Rooms: ${data.overall.totalRooms}`);
      console.log(`   Total Beds: ${data.overall.totalBeds}`);
      console.log(`   Occupied Beds: ${data.overall.totalOccupiedBeds}`);
      console.log(`   Available Beds: ${data.overall.totalAvailableBeds}`);
      console.log(`   Total Revenue: ₹${data.overall.totalRevenue}`);
      console.log(`   Average Occupancy: ${data.overall.averageOccupancy}%`);
      console.log('');
      
      // PG details
      console.log('🏢 PG Properties:');
      data.pgs.forEach((pg, index) => {
        console.log(`   ${index + 1}. ${pg.buildingName} (${pg.buildingId})`);
        console.log(`      Address: ${pg.address}`);
        console.log(`      Floors: ${pg.totalFloors}, Rooms: ${pg.totalRooms}, Beds: ${pg.totalBeds}`);
        console.log(`      Occupied: ${pg.occupiedBeds}, Available: ${pg.availableBeds}`);
        console.log(`      Occupancy: ${pg.occupancyPercentage}%, Revenue: ₹${pg.totalRevenue}`);
        console.log('');
      });
      
      // 2. Test individual PG details
      if (data.pgs.length > 0) {
        const firstPG = data.pgs[0];
        console.log('2️⃣ Testing individual PG details...');
        const pgDetailsResponse = await axios.get(`${API_BASE_URL}/dashboard/pg/${firstPG.buildingId}`);
        
        if (pgDetailsResponse.data.success) {
          const pgDetails = pgDetailsResponse.data.data;
          console.log('✅ PG details loaded successfully');
          console.log(`   Building: ${pgDetails.buildingName}`);
          console.log(`   Total Floors: ${pgDetails.totalFloors}`);
          console.log(`   Total Rooms: ${pgDetails.totalRooms}`);
          console.log(`   Total Beds: ${pgDetails.totalBeds}`);
          console.log(`   Occupancy: ${pgDetails.occupancyPercentage}%`);
          console.log('');
          
          // Floor details
          console.log('🏢 Floor Details:');
          pgDetails.floorDetails.forEach(floor => {
            console.log(`   Floor ${floor.floorNumber}: ${floor.totalRooms} rooms, ${floor.totalBeds} beds`);
            console.log(`      Occupied: ${floor.occupiedBeds}, Available: ${floor.availableBeds}`);
            console.log(`      Occupancy: ${floor.occupancyPercentage}%`);
          });
          console.log('');
          
          // Room details
          console.log('🚪 Room Details:');
          pgDetails.roomDetails.forEach(room => {
            console.log(`   ${room.roomNumber} (${room.roomType}): ${room.totalBeds} beds`);
            console.log(`      Occupied: ${room.occupiedBeds}, Available: ${room.availableBeds}`);
            console.log(`      Rate: ₹${room.rate} (${room.rateType})`);
            console.log(`      Occupancy: ${room.occupancyPercentage}%`);
          });
          
        } else {
          console.log('❌ Failed to load PG details:', pgDetailsResponse.data.message);
        }
      }
      
    } else {
      console.log('❌ Failed to load dashboard stats:', statsResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }

  console.log('\n🎯 Dashboard test completed!');
  console.log('\nNext steps:');
  console.log('1. Open the admin dashboard in your browser');
  console.log('2. Verify all statistics are displayed correctly');
  console.log('3. Test clicking on PG properties to see details');
  console.log('4. Test navigation to floors, rooms, and beds management');
}

// Run the test
testDashboard();

