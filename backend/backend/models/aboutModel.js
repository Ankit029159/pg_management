const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  subtitle: {
    type: String,
    required: [true, 'Subtitle is required'],
    trim: true,
    maxlength: [200, 'Subtitle cannot exceed 200 characters']
  },
  story: {
    type: String,
    required: [true, 'Story content is required'],
    trim: true,
    maxlength: [2000, 'Story cannot exceed 2000 characters']
  },
  photo: {
    type: String,
    required: [true, 'Photo is required'],
    trim: true
  },
  mission: {
    type: String,
    required: [true, 'Mission is required'],
    trim: true,
    maxlength: [500, 'Mission cannot exceed 500 characters']
  },
  vision: {
    type: String,
    required: [true, 'Vision is required'],
    trim: true,
    maxlength: [500, 'Vision cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
aboutSchema.index({ title: 1 });

module.exports = mongoose.model('About', aboutSchema);
