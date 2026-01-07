const Hero = require('../models/heroModel');

// @desc    Get all active hero slides
// @route   GET /api/hero
// @access  Public
const getHeroSlides = async (req, res) => {
  try {
    const heroes = await Hero.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: heroes.length,
      data: heroes
    });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hero slides',
      error: error.message
    });
  }
};

// @desc    Create hero slide
// @route   POST /api/hero
// @access  Private (Admin only)
const createHeroSlide = async (req, res) => {
  try {
    const { title, description, order } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description'
      });
    }
    
    // Check if photo was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Photo is required'
      });
    }
    
    const hero = await Hero.create({
      title,
      description,
      photo: req.file.filename,
      order: order || 0
    });
    
    res.status(201).json({
      success: true,
      message: 'Hero slide created successfully',
      data: hero
    });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    
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
      message: 'Server error while creating hero slide',
      error: error.message
    });
  }
};

// @desc    Update hero slide
// @route   PUT /api/hero/:id
// @access  Private (Admin only)
const updateHeroSlide = async (req, res) => {
  try {
    const { title, description, order, isActive } = req.body;
    
    let hero = await Hero.findById(req.params.id);
    
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }
    
    // Update fields
    if (title !== undefined) hero.title = title;
    if (description !== undefined) hero.description = description;
    if (order !== undefined) hero.order = order;
    if (isActive !== undefined) hero.isActive = isActive;
    
    // Update photo if new file is uploaded
    if (req.file) {
      // Delete old photo file if exists
      const fs = require('fs');
      const path = require('path');
      const oldPhotoPath = path.join(__dirname, '../uploads/hero', hero.photo);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
      hero.photo = req.file.filename;
    }
    
    const updatedHero = await hero.save();
    
    res.status(200).json({
      success: true,
      message: 'Hero slide updated successfully',
      data: updatedHero
    });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    
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
      message: 'Server error while updating hero slide',
      error: error.message
    });
  }
};

// @desc    Delete hero slide
// @route   DELETE /api/hero/:id
// @access  Private (Admin only)
const deleteHeroSlide = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }
    
    // Delete photo file
    const fs = require('fs');
    const path = require('path');
    const photoPath = path.join(__dirname, '../uploads/hero', hero.photo);
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }
    
    await hero.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Hero slide deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting hero slide',
      error: error.message
    });
  }
};

// @desc    Get all hero slides (for admin management)
// @route   GET /api/hero/all
// @access  Private (Admin only)
const getAllHeroSlides = async (req, res) => {
  try {
    const heroes = await Hero.find({}).sort({ order: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: heroes.length,
      data: heroes
    });
  } catch (error) {
    console.error('Error fetching all hero slides:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hero slides',
      error: error.message
    });
  }
};

module.exports = {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  getAllHeroSlides
};
