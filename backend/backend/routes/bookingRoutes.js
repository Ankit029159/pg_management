const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
  cancelBooking,
  extendBooking
} = require('../controllers/bookingController');

// Booking routes
router.post('/create', createBooking);
router.get('/all', getAllBookings);
router.get('/user/:userId', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatus);
router.put('/:id/payment', updatePaymentStatus);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/extend', extendBooking);

module.exports = router;

