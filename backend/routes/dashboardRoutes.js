const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPGDetails
} = require('../controllers/dashboardController');

// Dashboard Routes
router.get('/stats', getDashboardStats);           // Get overall dashboard statistics
router.get('/pg/:buildingId', getPGDetails);       // Get specific PG details

module.exports = router;

