const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  buildingId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return 'B' + String(this._id).slice(-3).padStart(3, '0');
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  floors: {
    type: Number,
    required: true,
    min: 1
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

buildingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Building', buildingSchema);

