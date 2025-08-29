const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
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
  floorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Floor',
    required: true
  },
  floorNumber: {
    type: Number,
    required: true
  },
  roomType: {
    type: String,
    enum: ['Hall', 'Bedroom'],
    required: true
  },
  totalBeds: {
    type: Number,
    required: true,
    min: 1
  },
  availableBeds: {
    type: Number,
    required: true,
    min: 0
  },
  rate: {
    type: Number,
    required: true,
    min: 0
  },
  rateType: {
    type: String,
    enum: ['per_bed', 'per_room'],
    default: 'per_bed'
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

roomSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Auto-generate room ID
roomSchema.pre('save', function(next) {
  if (!this.roomId) {
    this.roomId = `R${this.floorNumber}${String(this._id).slice(-2).padStart(2, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Room', roomSchema);

