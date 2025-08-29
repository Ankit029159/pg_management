const Bed = require('../models/bedModel');
const Room = require('../models/roomModel');

// Add Bed (Manual)
const addBed = async (req, res) => {
  try {
    const { roomId, bedId, status, price, userName } = req.body;

    // Get room details
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if bed ID already exists
    const existingBed = await Bed.findOne({ bedId });
    if (existingBed) {
      return res.status(400).json({
        success: false,
        message: 'Bed ID already exists'
      });
    }

    const bed = new Bed({
      roomId,
      roomNumber: room.roomId,
      bedId,
      status: status || 'Available',
      price: price || room.rate,
      userName: status === 'Occupied' ? userName : null
    });

    await bed.save();

    // Update room's available beds count
    room.availableBeds = await Bed.countDocuments({ roomId, status: 'Available' });
    await room.save();

    res.status(201).json({
      success: true,
      message: 'Bed added successfully',
      data: bed
    });
  } catch (error) {
    console.error('Error adding bed:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding bed',
      error: error.message
    });
  }
};

// Get All Beds
const getAllBeds = async (req, res) => {
  try {
    const beds = await Bed.find()
      .populate('roomId', 'roomId roomType buildingName floorNumber buildingId')
      .sort({ roomId: 1, bedId: 1 });
    
    res.status(200).json({
      success: true,
      data: beds
    });
  } catch (error) {
    console.error('Error fetching beds:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching beds',
      error: error.message
    });
  }
};

// Get Beds by Room
const getBedsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const beds = await Bed.find({ roomId })
      .populate('roomId', 'roomId roomType buildingName floorNumber buildingId')
      .sort({ bedId: 1 });
    
    res.status(200).json({
      success: true,
      data: beds
    });
  } catch (error) {
    console.error('Error fetching beds:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching beds',
      error: error.message
    });
  }
};

// Get Available Beds
const getAvailableBeds = async (req, res) => {
  try {
    const beds = await Bed.find({ status: 'Available' })
      .populate('roomId', 'roomId roomType buildingName floorNumber')
      .sort({ roomId: 1, bedId: 1 });
    
    res.status(200).json({
      success: true,
      data: beds
    });
  } catch (error) {
    console.error('Error fetching available beds:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available beds',
      error: error.message
    });
  }
};

// Update Bed
const updateBed = async (req, res) => {
  try {
    const { roomId, bedId, status, price, userName } = req.body;
    
    const bed = await Bed.findById(req.params.id);
    
    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Bed not found'
      });
    }

    // Check if new bed ID already exists (excluding current bed)
    if (bedId && bedId !== bed.bedId) {
      const existingBed = await Bed.findOne({ 
        bedId,
        _id: { $ne: bed._id }
      });
      
      if (existingBed) {
        return res.status(400).json({
          success: false,
          message: 'Bed ID already exists'
        });
      }
    }

    // Update bed fields
    if (roomId) {
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }
      bed.roomId = roomId;
      bed.roomNumber = room.roomId;
    }

    bed.bedId = bedId || bed.bedId;
    bed.status = status || bed.status;
    bed.price = price || bed.price;
    
    // Only set userName if status is Occupied
    if (status === 'Occupied') {
      bed.userName = userName || bed.userName;
    } else {
      bed.userName = null;
    }

    await bed.save();

    // Update room's available beds count
    if (bed.roomId) {
      const room = await Room.findById(bed.roomId);
      if (room) {
        room.availableBeds = await Bed.countDocuments({ roomId: bed.roomId, status: 'Available' });
        await room.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Bed updated successfully',
      data: bed
    });
  } catch (error) {
    console.error('Error updating bed:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bed',
      error: error.message
    });
  }
};

// Delete Bed
const deleteBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);
    
    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Bed not found'
      });
    }

    // Check if bed is occupied
    if (bed.status === 'Occupied') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete occupied bed'
      });
    }

    await Bed.findByIdAndDelete(req.params.id);

    // Update room's available beds count
    if (bed.roomId) {
      const room = await Room.findById(bed.roomId);
      if (room) {
        room.availableBeds = await Bed.countDocuments({ roomId: bed.roomId, status: 'Available' });
        await room.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Bed deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting bed:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting bed',
      error: error.message
    });
  }
};

// Assign Bed
const assignBed = async (req, res) => {
  try {
    const { userName } = req.body;
    
    const bed = await Bed.findById(req.params.id);
    
    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Bed not found'
      });
    }

    if (bed.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: 'Bed is not available for assignment'
      });
    }

    bed.status = 'Occupied';
    bed.userName = userName;
    await bed.save();

    // Update room's available beds count
    if (bed.roomId) {
      const room = await Room.findById(bed.roomId);
      if (room) {
        room.availableBeds = await Bed.countDocuments({ roomId: bed.roomId, status: 'Available' });
        await room.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Bed assigned successfully',
      data: bed
    });
  } catch (error) {
    console.error('Error assigning bed:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning bed',
      error: error.message
    });
  }
};

// Release Bed
const releaseBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);
    
    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Bed not found'
      });
    }

    if (bed.status !== 'Occupied') {
      return res.status(400).json({
        success: false,
        message: 'Bed is not occupied'
      });
    }

    bed.status = 'Available';
    bed.userName = null;
    await bed.save();

    // Update room's available beds count
    if (bed.roomId) {
      const room = await Room.findById(bed.roomId);
      if (room) {
        room.availableBeds = await Bed.countDocuments({ roomId: bed.roomId, status: 'Available' });
        await room.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Bed released successfully',
      data: bed
    });
  } catch (error) {
    console.error('Error releasing bed:', error);
    res.status(500).json({
      success: false,
      message: 'Error releasing bed',
      error: error.message
    });
  }
};

module.exports = {
  addBed,
  getAllBeds,
  getBedsByRoom,
  getAvailableBeds,
  updateBed,
  deleteBed,
  assignBed,
  releaseBed
};
