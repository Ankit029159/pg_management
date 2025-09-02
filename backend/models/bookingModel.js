const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true // Now required since we generate it explicitly in controller
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
    enum: ['Pending', 'Paid', 'Failed', 'Processing'],
    default: 'Pending'
  },
  amount: {
    type: Number,
    required: true
  },
  amountInPaise: {
    type: Number,
    required: false // Will be auto-calculated in pre-save hook
  },
  transactionId: {
    type: String,
    default: null
  },
  phonepeTransactionId: {
    type: String,
    default: null
  },
  paymentDetails: {
    phonepeTransactionId: String,
    amount: Number,
    amountInPaise: Number,
    paymentMethod: {
      type: String,
      default: 'PhonePe'
    },
    paymentGateway: {
      type: String,
      default: 'PhonePe'
    },
    paidAt: Date,
    gatewayResponse: mongoose.Schema.Types.Mixed
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
  // Payment integration fields
  paymentInitiated: {
    type: Boolean,
    default: false
  },
  paymentInitiatedAt: {
    type: Date
  },
  redirectUrl: {
    type: String
  },
  callbackUrl: {
    type: String
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
  
  // Auto-calculate amount in paise if amount is set
  if (this.amount && !this.amountInPaise) {
    this.amountInPaise = Math.round(this.amount * 100);
  }
  
  // Note: bookingId is now generated in the controller before saving
  // This ensures uniqueness and proper generation
  
  next();
});



// Index for better query performance
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);

