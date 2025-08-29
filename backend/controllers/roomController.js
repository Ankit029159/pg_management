const Room = require('../models/roomModel');
const Bed = require('../models/bedModel');
const Building = require('../models/buildingModel');
const Floor = require('../models/floorModel');

// Add Room
const addRoom = async (req, res) => {
  try {
    const { buildingId, floorId, roomId, roomType, totalBeds, rate, rateType } = req.body;

    // Get building and floor details
    const building = await Building.findById(buildingId);
    const floor = await Floor.findById(floorId);

    if (!building || !floor) {
      return res.status(404).json({
        success: false,
        message: 'Building or Floor not found'
      });
    }

    // Auto-generate roomId if not provided
    const finalRoomId = roomId || `R${floor.floorNumber}${String(Date.now()).slice(-2)}`;

    // Check if room ID already exists
    const existingRoom = await Room.findOne({ roomId: finalRoomId });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: 'Room ID already exists'
      });
    }

    // Create room
    const room = new Room({
      roomId: finalRoomId,
      buildingId,
      buildingName: building.name,
      floorId,
      floorNumber: floor.floorNumber,
      roomType,
      totalBeds,
      availableBeds: totalBeds,
      rate,
      rateType
    });

    await room.save();

    // Auto-generate beds with proper bed IDs based on room type
    const bedPromises = [];
    for (let i = 1; i <= totalBeds; i++) {
      // Generate bed ID based on room type: B1, B2 for bedroom, H1, H2 for hall
      const bedSuffix = roomType === 'Bedroom' ? `B${i}` : `H${i}`;
      const bedId = `${room.roomId}-${bedSuffix}`;
      
      const bed = new Bed({
        roomId: room._id,
        roomNumber: room.roomId,
        bedId: bedId,
        price: rate
      });
      bedPromises.push(bed.save());
    }

    await Promise.all(bedPromises);

    // Update floor total rooms
    floor.totalRooms += 1;
    await floor.save();

    res.status(201).json({
      success: true,
      message: 'Room added successfully',
      data: room
    });
  } catch (error) {
    console.error('Error adding room:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding room',
      error: error.message
    });
  }
};

// Get All Rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('buildingId', 'name buildingId')
      .populate('floorId', 'floorNumber')
      .sort({ buildingId: 1, floorNumber: 1 });
    
    res.status(200).json({
      success: true,
      data: rooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rooms',
      error: error.message
    });
  }
};

// Get Rooms by Building and Floor
const getRoomsByBuildingAndFloor = async (req, res) => {
  try {
    const { buildingId, floorId } = req.params;
    
    const rooms = await Room.find({ buildingId, floorId })
      .populate('buildingId', 'name buildingId')
      .populate('floorId', 'floorNumber');
    
    res.status(200).json({
      success: true,
      data: rooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rooms',
      error: error.message
    });
  }
};

// Update Room
const updateRoom = async (req, res) => {
  try {
    const { roomType, totalBeds, rate, rateType } = req.body;
    
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    room.roomType = roomType || room.roomType;
    room.rate = rate || room.rate;
    room.rateType = rateType || room.rateType;

    // If total beds changed, update beds
    if (totalBeds && totalBeds !== room.totalBeds) {
      const currentBeds = await Bed.find({ roomId: room._id });
      
      if (totalBeds > room.totalBeds) {
        // Add more beds
        for (let i = room.totalBeds + 1; i <= totalBeds; i++) {
          const bedSuffix = room.roomType === 'Bedroom' ? `B${i}` : `H${i}`;
          const bedId = `${room.roomId}-${bedSuffix}`;
          
          const bed = new Bed({
            roomId: room._id,
            roomNumber: room.roomId,
            bedId: bedId,
            price: room.rate
          });
          await bed.save();
        }
      } else if (totalBeds < room.totalBeds) {
        // Remove extra beds (only if they're available)
        const bedsToRemove = currentBeds.slice(totalBeds);
        for (const bed of bedsToRemove) {
          if (bed.status === 'Available') {
            await Bed.findByIdAndDelete(bed._id);
          }
        }
      }
      
      room.totalBeds = totalBeds;
      room.availableBeds = await Bed.countDocuments({ roomId: room._id, status: 'Available' });
    }

    await room.save();

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating room',
      error: error.message
    });
  }
};

// Delete Room
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if any beds are occupied
    const occupiedBeds = await Bed.find({ roomId: room._id, status: 'Occupied' });
    if (occupiedBeds.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with occupied beds'
      });
    }

    // Delete all beds in the room
    await Bed.deleteMany({ roomId: room._id });

    // Update floor total rooms
    const floor = await Floor.findById(room.floorId);
    if (floor) {
      floor.totalRooms = Math.max(0, floor.totalRooms - 1);
      await floor.save();
    }

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting room',
      error: error.message
    });
  }
};

module.exports = {
  addRoom,
  getAllRooms,
  getRoomsByBuildingAndFloor,
  updateRoom,
  deleteRoom
};
