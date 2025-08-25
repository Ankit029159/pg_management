const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  callNumber: {
    type: String,
    required: [true, 'Call number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  whatsappNumber: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid WhatsApp number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  pgFacilities: [{
    type: String,
    required: [true, 'PG facility is required'],
    trim: true,
    maxlength: [50, 'Facility name cannot exceed 50 characters']
  }],
  visitHours: {
    type: String,
    required: [true, 'Visit hours are required'],
    trim: true,
    maxlength: [200, 'Visit hours cannot exceed 200 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
footerSchema.index({ email: 1 });

module.exports = mongoose.model('Footer', footerSchema);
