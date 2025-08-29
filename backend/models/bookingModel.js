const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userMobile: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userWhatsapp: {
    type: String,
    default: null
  },
  bedId: {
    type: String,
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
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
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    default: null
  },
  paymentDetails: {
    phonepeTransactionId: String,
    amount: Number,
    paymentMethod: String,
    paidAt: Date
  },
  paymentProof: {
    type: String,
    default: null
  },
  adminAction: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
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

bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Auto-generate booking ID
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = `BK${String(this._id).slice(-3).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);

