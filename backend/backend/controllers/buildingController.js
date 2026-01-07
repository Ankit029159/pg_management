const Building = require('../models/buildingModel');
const Floor = require('../models/floorModel');

// Add Building
const addBuilding = async (req, res) => {
  try {
    const { name, address, floors } = req.body;

    // Create building
    const building = new Building({
      name,
      address,
      floors
    });

    await building.save();

    // Auto-generate floors
    const floorPromises = [];
    for (let i = 1; i <= floors; i++) {
      const floor = new Floor({
        floorNumber: i,
        buildingId: building._id,
        buildingName: building.name
      });
      floorPromises.push(floor.save());
    }

    await Promise.all(floorPromises);

    res.status(201).json({
      success: true,
      message: 'Building added successfully',
      data: building
    });
  } catch (error) {
    console.error('Error adding building:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding building',
      error: error.message
    });
  }
};

// Get All Buildings
const getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: buildings
    });
  } catch (error) {
    console.error('Error fetching buildings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching buildings',
      error: error.message
    });
  }
};

// Get Building by ID
const getBuildingById = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    
    if (!building) {
      return res.status(404).json({
        success: false,
        message: 'Building not found'
      });
    }

    res.status(200).json({
      success: true,
      data: building
    });
  } catch (error) {
    console.error('Error fetching building:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching building',
      error: error.message
    });
  }
};

// Update Building
const updateBuilding = async (req, res) => {
  try {
    const { name, address, floors } = req.body;
    
    const building = await Building.findById(req.params.id);
    
    if (!building) {
      return res.status(404).json({
        success: false,
        message: 'Building not found'
      });
    }

    // Store old name to check if it changed
    const oldName = building.name;

    building.name = name || building.name;
    building.address = address || building.address;
    building.floors = floors || building.floors;

    await building.save();

    // If building name changed, update all associated floors
    if (name && name !== oldName) {
      await Floor.updateMany(
        { buildingId: building._id },
        { buildingName: name }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Building updated successfully',
      data: building
    });
  } catch (error) {
    console.error('Error updating building:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating building',
      error: error.message
    });
  }
};

// Delete Building
const deleteBuilding = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    
    if (!building) {
      return res.status(404).json({
        success: false,
        message: 'Building not found'
      });
    }

    // Delete associated floors
    await Floor.deleteMany({ buildingId: building._id });

    await Building.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Building deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting building:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting building',
      error: error.message
    });
  }
};

module.exports = {
  addBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding
};

