const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedId: {
    type: String,
    required: true,
    unique: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Maintenance'],
    default: 'Available'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  userId: {
    type: String,
    default: null
  },
  userName: {
    type: String,
    default: null
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

bedSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Bed', bedSchema);
