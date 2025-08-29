const Booking = require('../models/bookingModel');
const Bed = require('../models/bedModel');
const Room = require('../models/roomModel');
const Building = require('../models/buildingModel');

// Create Booking
const createBooking = async (req, res) => {
  try {
    const { 
      userId, 
      userName, 
      userMobile,
      userEmail,
      userWhatsapp,
      bedId, 
      roomId, 
      buildingId, 
      buildingName, 
      checkInDate, 
      checkOutDate, 
      amount 
    } = req.body;

    // Check if bed is available
    const bed = await Bed.findOne({ bedId });
    if (!bed || bed.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: 'Bed is not available'
      });
    }

    // Create booking
    const booking = new Booking({
      userId,
      userName,
      userMobile,
      userEmail,
      userWhatsapp,
      bedId,
      roomId,
      buildingId,
      buildingName,
      checkInDate,
      checkOutDate,
      amount
    });

    await booking.save();

    // Update bed status
    bed.status = 'Occupied';
    bed.userId = userId;
    bed.userName = userName;
    await bed.save();

    // Update room available beds count
    const room = await Room.findById(bed.roomId);
    if (room) {
      room.availableBeds = await Bed.countDocuments({ roomId: bed.roomId, status: 'Available' });
      await room.save();
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Get All Bookings (Admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get User Bookings
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user bookings',
      error: error.message
    });
  }
};

// Get Booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// Update Booking Status
const updateBookingStatus = async (req, res) => {
  try {
    const { status, adminAction } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status || booking.status;
    booking.adminAction = adminAction || booking.adminAction;

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
};

// Update Payment Status
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentProof } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.paymentStatus = paymentStatus || booking.paymentStatus;
    booking.paymentProof = paymentProof || booking.paymentProof;

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};

// Cancel Booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    booking.status = 'Cancelled';

    // Release the bed
    const bed = await Bed.findOne({ bedId: booking.bedId });
    if (bed) {
      bed.status = 'Available';
      bed.userId = null;
      bed.userName = null;
      await bed.save();

      // Update room available beds count
      const room = await Room.findById(bed.roomId);
      if (room) {
        room.availableBeds = await Bed.countDocuments({ roomId: bed.roomId, status: 'Available' });
        await room.save();
      }
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

// Extend Booking
const extendBooking = async (req, res) => {
  try {
    const { checkOutDate } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'Only active bookings can be extended'
      });
    }

    booking.checkOutDate = checkOutDate;

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking extended successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error extending booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error extending booking',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
  cancelBooking,
  extendBooking
};

