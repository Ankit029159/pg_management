const mongoose = require('mongoose');

const paymentHistorySchema = new mongoose.Schema({
  paymentId: {
    type: String,
    unique: true
  },
  bookingId: {
    type: String,
    required: true,
    ref: 'Booking'
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  phonepeTransactionId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userMobile: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  amountInPaise: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  paymentMethod: {
    type: String,
    default: 'PhonePe'
  },
  paymentGateway: {
    type: String,
    default: 'PhonePe'
  },
  gatewayResponse: {
    status: String,
    message: String,
    code: String,
    data: mongoose.Schema.Types.Mixed
  },
  redirectUrl: {
    type: String
  },
  callbackData: {
    type: mongoose.Schema.Types.Mixed
  },
  pgDetails: {
    pgName: String,
    floor: String,
    room: String,
    bedId: String,
    buildingName: String
  },
  checkInDate: {
    type: Date
  },
  checkOutDate: {
    type: Date
  },
  paidAt: {
    type: Date
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

paymentHistorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Auto-generate payment ID
paymentHistorySchema.pre('save', function(next) {
  if (!this.paymentId) {
    this.paymentId = `PAY${String(this._id).slice(-3).padStart(3, '0')}`;
  }
  next();
});

// Index for better query performance
paymentHistorySchema.index({ bookingId: 1 });
paymentHistorySchema.index({ transactionId: 1 });
paymentHistorySchema.index({ userId: 1 });
paymentHistorySchema.index({ paymentStatus: 1 });
paymentHistorySchema.index({ createdAt: -1 });

module.exports = mongoose.model('PaymentHistory', paymentHistorySchema);
