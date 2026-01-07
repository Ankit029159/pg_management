const Contact = require('../models/contactModel');
const { validationResult } = require('express-validator');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    console.log('📧 Contact form submission received:', req.body);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, subject, message, type } = req.body;

    // Create new contact entry
    const contactEntry = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      type: type || 'contact',
      status: 'new'
    });

    await contactEntry.save();
    
    console.log('✅ Contact form saved successfully:', contactEntry._id);

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: contactEntry._id,
        name: contactEntry.name,
        email: contactEntry.email,
        subject: contactEntry.subject,
        status: contactEntry.status,
        submittedAt: contactEntry.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private (Admin)
const getAllContactMessages = async (req, res) => {
  try {
    console.log('📋 Fetching all contact messages...');
    
    const { status, type, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Contact.countDocuments(query);
    
    console.log(`✅ Found ${contacts.length} contact messages`);

    res.status(200).json({
      success: true,
      message: 'Contact messages retrieved successfully',
      data: contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get single contact message (Admin)
// @route   GET /api/contact/:id
// @access  Private (Admin)
const getContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📧 Fetching contact message:', id);
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    console.log('✅ Contact message retrieved:', contact._id);

    res.status(200).json({
      success: true,
      message: 'Contact message retrieved successfully',
      data: contact
    });

  } catch (error) {
    console.error('❌ Error fetching contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update contact message status (Admin)
// @route   PUT /api/contact/:id
// @access  Private (Admin)
const updateContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    console.log('📝 Updating contact message:', id, { status, adminNotes });
    
    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    console.log('✅ Contact message updated:', contact._id);

    res.status(200).json({
      success: true,
      message: 'Contact message updated successfully',
      data: contact
    });

  } catch (error) {
    console.error('❌ Error updating contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact message',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete contact message (Admin)
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting contact message:', id);
    
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    console.log('✅ Contact message deleted:', contact._id);

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully',
      data: { id: contact._id }
    });

  } catch (error) {
    console.error('❌ Error deleting contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact message',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get contact statistics (Admin)
// @route   GET /api/contact/stats
// @access  Private (Admin)
const getContactStats = async (req, res) => {
  try {
    console.log('📊 Fetching contact statistics...');
    
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new' });
    const readContacts = await Contact.countDocuments({ status: 'read' });
    const repliedContacts = await Contact.countDocuments({ status: 'replied' });
    const closedContacts = await Contact.countDocuments({ status: 'closed' });
    
    const contactStats = {
      total: totalContacts,
      new: newContacts,
      read: readContacts,
      replied: repliedContacts,
      closed: closedContacts,
      breakdown: stats
    };
    
    console.log('✅ Contact statistics retrieved:', contactStats);

    res.status(200).json({
      success: true,
      message: 'Contact statistics retrieved successfully',
      data: contactStats
    });

  } catch (error) {
    console.error('❌ Error fetching contact statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  submitContactForm,
  getAllContactMessages,
  getContactMessage,
  updateContactMessage,
  deleteContactMessage,
  getContactStats
};
