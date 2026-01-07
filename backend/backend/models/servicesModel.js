const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  photo: {
    type: String,
    required: [true, 'Service photo is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
servicesSchema.index({ title: 1 });

module.exports = mongoose.model('Service', servicesSchema);
