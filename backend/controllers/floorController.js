const Floor = require('../models/floorModel');
const Building = require('../models/buildingModel');

// Add Floor (Manual)
const addFloor = async (req, res) => {
  try {
    const { buildingId, floorNumber, totalRooms } = req.body;

    // Get building details
    const building = await Building.findById(buildingId);
    if (!building) {
      return res.status(404).json({
        success: false,
        message: 'Building not found'
      });
    }

    // Check if floor number already exists for this building
    const existingFloor = await Floor.findOne({ 
      buildingId, 
      floorNumber: parseInt(floorNumber) 
    });
    
    if (existingFloor) {
      return res.status(400).json({
        success: false,
        message: 'Floor number already exists for this building'
      });
    }

    // Check if floor number is within building's total floors
    if (parseInt(floorNumber) > building.floors) {
      return res.status(400).json({
        success: false,
        message: `Floor number cannot exceed building's total floors (${building.floors})`
      });
    }

    const floor = new Floor({
      buildingId,
      buildingName: building.name,
      floorNumber: parseInt(floorNumber),
      totalRooms: parseInt(totalRooms) || 0
    });

    await floor.save();

    res.status(201).json({
      success: true,
      message: 'Floor added successfully',
      data: floor
    });
  } catch (error) {
    console.error('Error adding floor:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding floor',
      error: error.message
    });
  }
};

// Get All Floors
const getAllFloors = async (req, res) => {
  try {
    const floors = await Floor.find()
      .populate('buildingId', 'name buildingId')
      .sort({ buildingId: 1, floorNumber: 1 });
    
    res.status(200).json({
      success: true,
      data: floors
    });
  } catch (error) {
    console.error('Error fetching floors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching floors',
      error: error.message
    });
  }
};

// Get Floors by Building
const getFloorsByBuilding = async (req, res) => {
  try {
    const { buildingId } = req.params;
    
    const floors = await Floor.find({ buildingId })
      .populate('buildingId', 'name buildingId')
      .sort({ floorNumber: 1 });
    
    res.status(200).json({
      success: true,
      data: floors
    });
  } catch (error) {
    console.error('Error fetching floors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching floors',
      error: error.message
    });
  }
};

// Update Floor
const updateFloor = async (req, res) => {
  try {
    const { floorNumber, totalRooms } = req.body;
    
    const floor = await Floor.findById(req.params.id);
    
    if (!floor) {
      return res.status(404).json({
        success: false,
        message: 'Floor not found'
      });
    }

    // Check if new floor number already exists (excluding current floor)
    if (floorNumber && parseInt(floorNumber) !== floor.floorNumber) {
      const existingFloor = await Floor.findOne({ 
        buildingId: floor.buildingId, 
        floorNumber: parseInt(floorNumber),
        _id: { $ne: floor._id }
      });
      
      if (existingFloor) {
        return res.status(400).json({
          success: false,
          message: 'Floor number already exists for this building'
        });
      }
    }

    // Check if floor number is within building's total floors
    if (floorNumber) {
      const building = await Building.findById(floor.buildingId);
      if (building && parseInt(floorNumber) > building.floors) {
        return res.status(400).json({
          success: false,
          message: `Floor number cannot exceed building's total floors (${building.floors})`
        });
      }
    }

    floor.floorNumber = floorNumber ? parseInt(floorNumber) : floor.floorNumber;
    floor.totalRooms = totalRooms ? parseInt(totalRooms) : floor.totalRooms;

    await floor.save();

    res.status(200).json({
      success: true,
      message: 'Floor updated successfully',
      data: floor
    });
  } catch (error) {
    console.error('Error updating floor:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating floor',
      error: error.message
    });
  }
};

// Delete Floor
const deleteFloor = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id);
    
    if (!floor) {
      return res.status(404).json({
        success: false,
        message: 'Floor not found'
      });
    }

    // Check if floor has any rooms
    const Room = require('../models/roomModel');
    const roomsInFloor = await Room.find({ floorId: floor._id });
    
    if (roomsInFloor.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete floor with existing rooms'
      });
    }

    await Floor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Floor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting floor:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting floor',
      error: error.message
    });
  }
};

module.exports = {
  addFloor,
  getAllFloors,
  getFloorsByBuilding,
  updateFloor,
  deleteFloor
};
