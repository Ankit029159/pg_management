const About = require('../models/aboutModel');

// @desc    Get about data
// @route   GET /api/about
// @access  Public
const getAboutData = async (req, res) => {
  try {
    // Since about is typically a single configuration, get the first one
    const about = await About.findOne({}).sort({ createdAt: -1 });
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About data not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: about
    });
  } catch (error) {
    console.error('Error fetching about data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching about data',
      error: error.message
    });
  }
};

// @desc    Create about data
// @route   POST /api/about
// @access  Private (Admin only)
const createAboutData = async (req, res) => {
  try {
    const { title, subtitle, story, mission, vision } = req.body;
    
    // Validate required fields
    if (!title || !subtitle || !story || !mission || !vision) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, subtitle, story, mission, vision'
      });
    }
    
    // Check if photo was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Photo is required'
      });
    }
    
    const about = await About.create({
      title,
      subtitle,
      story,
      photo: req.file.filename,
      mission,
      vision
    });
    
    res.status(201).json({
      success: true,
      message: 'About data created successfully',
      data: about
    });
  } catch (error) {
    console.error('Error creating about data:', error);
    
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
      message: 'Server error while creating about data',
      error: error.message
    });
  }
};

// @desc    Update about data
// @route   PUT /api/about/:id
// @access  Private (Admin only)
const updateAboutData = async (req, res) => {
  try {
    const { title, subtitle, story, mission, vision } = req.body;
    
    let about = await About.findById(req.params.id);
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About data not found'
      });
    }
    
    // Update fields
    if (title) about.title = title;
    if (subtitle) about.subtitle = subtitle;
    if (story) about.story = story;
    if (mission) about.mission = mission;
    if (vision) about.vision = vision;
    
    // Update photo if new file is uploaded
    if (req.file) {
      // Delete old photo file if exists
      const fs = require('fs');
      const path = require('path');
      const oldPhotoPath = path.join(__dirname, '../uploads/about', about.photo);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
      about.photo = req.file.filename;
    }
    
    const updatedAbout = await about.save();
    
    res.status(200).json({
      success: true,
      message: 'About data updated successfully',
      data: updatedAbout
    });
  } catch (error) {
    console.error('Error updating about data:', error);
    
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
      message: 'Server error while updating about data',
      error: error.message
    });
  }
};

// @desc    Delete about data
// @route   DELETE /api/about/:id
// @access  Private (Admin only)
const deleteAboutData = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About data not found'
      });
    }
    
    // Delete photo file
    const fs = require('fs');
    const path = require('path');
    const photoPath = path.join(__dirname, '../uploads/about', about.photo);
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }
    
    await about.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'About data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting about data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting about data',
      error: error.message
    });
  }
};

// @desc    Get all about data (for admin management)
// @route   GET /api/about/all
// @access  Private (Admin only)
const getAllAboutData = async (req, res) => {
  try {
    const abouts = await About.find({}).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: abouts.length,
      data: abouts
    });
  } catch (error) {
    console.error('Error fetching all about data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching about data',
      error: error.message
    });
  }
};

module.exports = {
  getAboutData,
  createAboutData,
  updateAboutData,
  deleteAboutData,
  getAllAboutData
};
