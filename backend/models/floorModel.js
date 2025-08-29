const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  floorNumber: {
    type: Number,
    required: true
  },
  buildingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true
  },
  buildingName: {
    type: String,
    required: true
  },
  totalRooms: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

floorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compound index to ensure unique floor per building
floorSchema.index({ buildingId: 1, floorNumber: 1 }, { unique: true });

module.exports = mongoose.model('Floor', floorSchema);

