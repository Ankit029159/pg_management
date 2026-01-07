const Footer = require('../models/footerModel');

// @desc    Get footer data
// @route   GET /api/footer
// @access  Public
const getFooterData = async (req, res) => {
  try {
    // Since footer is typically a single configuration, get the first one
    const footer = await Footer.findOne({}).sort({ createdAt: -1 });
    
    if (!footer) {
      return res.status(404).json({
        success: false,
        message: 'Footer data not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: footer
    });
  } catch (error) {
    console.error('Error fetching footer data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching footer data',
      error: error.message
    });
  }
};

// @desc    Create footer data
// @route   POST /api/footer
// @access  Private (Admin only)
const createFooterData = async (req, res) => {
  try {
    const { callNumber, whatsappNumber, email, address, pgFacilities, visitHours } = req.body;
    
    // Validate required fields
    if (!callNumber || !whatsappNumber || !email || !address || !visitHours) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: callNumber, whatsappNumber, email, address, visitHours'
      });
    }
    
    // Validate pgFacilities is an array (optional since we're getting from services)
    if (pgFacilities && !Array.isArray(pgFacilities)) {
      return res.status(400).json({
        success: false,
        message: 'pgFacilities must be an array'
      });
    }
    
    const footer = await Footer.create({
      callNumber,
      whatsappNumber,
      email,
      address,
      pgFacilities: pgFacilities || [],
      visitHours
    });
    
    res.status(201).json({
      success: true,
      message: 'Footer data created successfully',
      data: footer
    });
  } catch (error) {
    console.error('Error creating footer data:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating footer data',
      error: error.message
    });
  }
};

// @desc    Update footer data
// @route   PUT /api/footer/:id
// @access  Private (Admin only)
const updateFooterData = async (req, res) => {
  try {
    const { callNumber, whatsappNumber, email, address, pgFacilities, visitHours } = req.body;
    
    let footer = await Footer.findById(req.params.id);
    
    if (!footer) {
      return res.status(404).json({
        success: false,
        message: 'Footer data not found'
      });
    }
    
    // Update fields
    if (callNumber) footer.callNumber = callNumber;
    if (whatsappNumber) footer.whatsappNumber = whatsappNumber;
    if (email) footer.email = email;
    if (address) footer.address = address;
    if (pgFacilities && Array.isArray(pgFacilities)) footer.pgFacilities = pgFacilities;
    if (visitHours) footer.visitHours = visitHours;
    
    const updatedFooter = await footer.save();
    
    res.status(200).json({
      success: true,
      message: 'Footer data updated successfully',
      data: updatedFooter
    });
  } catch (error) {
    console.error('Error updating footer data:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating footer data',
      error: error.message
    });
  }
};

// @desc    Delete footer data
// @route   DELETE /api/footer/:id
// @access  Private (Admin only)
const deleteFooterData = async (req, res) => {
  try {
    const footer = await Footer.findById(req.params.id);
    
    if (!footer) {
      return res.status(404).json({
        success: false,
        message: 'Footer data not found'
      });
    }
    
    await footer.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Footer data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting footer data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting footer data',
      error: error.message
    });
  }
};

// @desc    Get all footer data (for admin management)
// @route   GET /api/footer/all
// @access  Private (Admin only)
const getAllFooterData = async (req, res) => {
  try {
    const footers = await Footer.find({}).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: footers.length,
      data: footers
    });
  } catch (error) {
    console.error('Error fetching all footer data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching footer data',
      error: error.message
    });
  }
};

module.exports = {
  getFooterData,
  createFooterData,
  updateFooterData,
  deleteFooterData,
  getAllFooterData
};
