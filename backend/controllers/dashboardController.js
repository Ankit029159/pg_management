const Building = require('../models/buildingModel');
const Floor = require('../models/floorModel');
const Room = require('../models/roomModel');
const Bed = require('../models/bedModel');
const Booking = require('../models/bookingModel');
const PaymentHistory = require('../models/PaymentHistory');

// @desc    Get Dashboard Statistics
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    console.log('📊 Fetching dashboard statistics...');

    // Get all buildings (PGs)
    const buildings = await Building.find();
    
    const dashboardStats = {
      totalPGs: buildings.length,
      pgs: []
    };

    // Process each building/PG
    for (const building of buildings) {
      console.log(`🏢 Processing building: ${building.name}`);

      // Get floors for this building
      const floors = await Floor.find({ buildingId: building._id });
      
      // Get rooms for this building
      const rooms = await Room.find({ buildingId: building._id });
      
      // Get beds for this building
      const beds = await Bed.find({
        roomId: { $in: rooms.map(room => room._id) }
      });
      
      // Get active bookings for this building
      const activeBookings = await Booking.find({
        buildingId: building._id,
        status: 'Active',
        paymentStatus: 'Paid'
      });

      // Calculate statistics
      const totalFloors = floors.length;
      const totalRooms = rooms.length;
      const totalBeds = beds.length;
      const occupiedBeds = beds.filter(bed => bed.status === 'Occupied').length;
      const availableBeds = beds.filter(bed => bed.status === 'Available').length;
      const maintenanceBeds = beds.filter(bed => bed.status === 'Maintenance').length;
      
      // Calculate occupancy percentage
      const occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
      
      // Calculate revenue from all successful payments for this building
      const successfulPayments = await PaymentHistory.find({
        paymentStatus: 'SUCCESS',
        'pgDetails.buildingName': building.name
      });
      const totalRevenue = successfulPayments.reduce((sum, payment) => sum + payment.amount, 0);

      // Get floor-wise breakdown
      const floorStats = floors.map(floor => {
        const floorRooms = rooms.filter(room => room.floorNumber === floor.floorNumber);
        const floorBeds = beds.filter(bed => 
          floorRooms.some(room => room._id.toString() === bed.roomId.toString())
        );
        
        return {
          floorNumber: floor.floorNumber,
          totalRooms: floorRooms.length,
          totalBeds: floorBeds.length,
          occupiedBeds: floorBeds.filter(bed => bed.status === 'Occupied').length,
          availableBeds: floorBeds.filter(bed => bed.status === 'Available').length
        };
      });

      // Get room-wise breakdown
      const roomStats = rooms.map(room => {
        const roomBeds = beds.filter(bed => bed.roomId.toString() === room._id.toString());
        
        return {
          roomId: room.roomId,
          roomType: room.roomType,
          floorNumber: room.floorNumber,
          totalBeds: roomBeds.length,
          occupiedBeds: roomBeds.filter(bed => bed.status === 'Occupied').length,
          availableBeds: roomBeds.filter(bed => bed.status === 'Available').length,
          rate: room.rate,
          rateType: room.rateType
        };
      });

      const pgStats = {
        buildingId: building.buildingId,
        buildingName: building.name,
        address: building.address,
        totalFloors,
        totalRooms,
        totalBeds,
        occupiedBeds,
        availableBeds,
        maintenanceBeds,
        occupancyPercentage,
        totalRevenue,
        activeBookings: activeBookings.length,
        floorStats,
        roomStats,
        createdAt: building.createdAt
      };

      dashboardStats.pgs.push(pgStats);
    }

    // Calculate overall statistics
    // Get total revenue from all successful payments across all buildings
    const allSuccessfulPayments = await PaymentHistory.find({
      paymentStatus: 'SUCCESS'
    });
    const totalRevenueFromPayments = allSuccessfulPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    const overallStats = {
      totalPGs: dashboardStats.totalPGs,
      totalFloors: dashboardStats.pgs.reduce((sum, pg) => sum + pg.totalFloors, 0),
      totalRooms: dashboardStats.pgs.reduce((sum, pg) => sum + pg.totalRooms, 0),
      totalBeds: dashboardStats.pgs.reduce((sum, pg) => sum + pg.totalBeds, 0),
      totalOccupiedBeds: dashboardStats.pgs.reduce((sum, pg) => sum + pg.occupiedBeds, 0),
      totalAvailableBeds: dashboardStats.pgs.reduce((sum, pg) => sum + pg.availableBeds, 0),
      totalRevenue: totalRevenueFromPayments, // Use actual payment history
      averageOccupancy: dashboardStats.pgs.length > 0 
        ? Math.round(dashboardStats.pgs.reduce((sum, pg) => sum + pg.occupancyPercentage, 0) / dashboardStats.pgs.length)
        : 0
    };

    console.log('✅ Dashboard statistics fetched successfully');

    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        overall: overallStats,
        pgs: dashboardStats.pgs
      }
    });

  } catch (error) {
    console.error('❌ Error fetching dashboard statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get PG Details by Building ID
// @route   GET /api/dashboard/pg/:buildingId
// @access  Private (Admin)
const getPGDetails = async (req, res) => {
  try {
    const { buildingId } = req.params;
    
    console.log(`🏢 Fetching details for building: ${buildingId}`);

    const building = await Building.findOne({ buildingId });
    if (!building) {
      return res.status(404).json({
        success: false,
        message: 'Building not found'
      });
    }

    // Get floors for this building
    const floors = await Floor.find({ buildingId: building._id });
    
    // Get rooms for this building
    const rooms = await Room.find({ buildingId: building._id });
    
    // Get beds for this building
    const beds = await Bed.find({
      roomId: { $in: rooms.map(room => room._id) }
    });
    
    // Get active bookings for this building
    const activeBookings = await Booking.find({
      buildingId: building._id,
      status: 'Active',
      paymentStatus: 'Paid'
    });

    // Calculate statistics
    const totalFloors = floors.length;
    const totalRooms = rooms.length;
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter(bed => bed.status === 'Occupied').length;
    const availableBeds = beds.filter(bed => bed.status === 'Available').length;
    const maintenanceBeds = beds.filter(bed => bed.status === 'Maintenance').length;
    
    const occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
    
    // Calculate revenue from all successful payments for this building
    const successfulPayments = await PaymentHistory.find({
      paymentStatus: 'SUCCESS',
      'pgDetails.buildingName': building.name
    });
    const totalRevenue = successfulPayments.reduce((sum, payment) => sum + payment.amount, 0);

    // Get detailed floor breakdown
    const floorDetails = floors.map(floor => {
      const floorRooms = rooms.filter(room => room.floorNumber === floor.floorNumber);
      const floorBeds = beds.filter(bed => 
        floorRooms.some(room => room._id.toString() === bed.roomId.toString())
      );
      
      return {
        floorId: floor._id,
        floorNumber: floor.floorNumber,
        totalRooms: floorRooms.length,
        totalBeds: floorBeds.length,
        occupiedBeds: floorBeds.filter(bed => bed.status === 'Occupied').length,
        availableBeds: floorBeds.filter(bed => bed.status === 'Available').length,
        maintenanceBeds: floorBeds.filter(bed => bed.status === 'Maintenance').length,
        occupancyPercentage: floorBeds.length > 0 
          ? Math.round((floorBeds.filter(bed => bed.status === 'Occupied').length / floorBeds.length) * 100)
          : 0
      };
    });

    // Get detailed room breakdown
    const roomDetails = rooms.map(room => {
      const roomBeds = beds.filter(bed => bed.roomId.toString() === room._id.toString());
      
      return {
        roomId: room._id,
        roomNumber: room.roomId,
        roomType: room.roomType,
        floorNumber: room.floorNumber,
        totalBeds: roomBeds.length,
        occupiedBeds: roomBeds.filter(bed => bed.status === 'Occupied').length,
        availableBeds: roomBeds.filter(bed => bed.status === 'Available').length,
        maintenanceBeds: roomBeds.filter(bed => bed.status === 'Maintenance').length,
        rate: room.rate,
        rateType: room.rateType,
        occupancyPercentage: roomBeds.length > 0 
          ? Math.round((roomBeds.filter(bed => bed.status === 'Occupied').length / roomBeds.length) * 100)
          : 0
      };
    });

    const pgDetails = {
      buildingId: building.buildingId,
      buildingName: building.name,
      address: building.address,
      totalFloors,
      totalRooms,
      totalBeds,
      occupiedBeds,
      availableBeds,
      maintenanceBeds,
      occupancyPercentage,
      totalRevenue,
      activeBookings: activeBookings.length,
      floorDetails,
      roomDetails,
      createdAt: building.createdAt
    };

    console.log('✅ PG details fetched successfully');

    res.status(200).json({
      success: true,
      message: 'PG details retrieved successfully',
      data: pgDetails
    });

  } catch (error) {
    console.error('❌ Error fetching PG details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching PG details',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getPGDetails
};

