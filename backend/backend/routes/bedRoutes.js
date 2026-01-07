const express = require('express');
const router = express.Router();
const {
  addBed,
  getAllBeds,
  getBedsByRoom,
  getAvailableBeds,
  updateBed,
  deleteBed,
  assignBed,
  releaseBed
} = require('../controllers/bedController');

// Bed routes
router.post('/add', addBed);
router.get('/all', getAllBeds);
router.get('/room/:roomId', getBedsByRoom);
router.get('/available', getAvailableBeds);
router.put('/:id', updateBed);
router.delete('/:id', deleteBed);
router.put('/:id/assign', assignBed);
router.put('/:id/release', releaseBed);

module.exports = router;
