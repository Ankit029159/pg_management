const express = require('express');
const router = express.Router();
const {
  addFloor,
  getAllFloors,
  getFloorsByBuilding,
  updateFloor,
  deleteFloor
} = require('../controllers/floorController');

// Floor routes
router.post('/add', addFloor);
router.get('/all', getAllFloors);
router.get('/building/:buildingId', getFloorsByBuilding);
router.put('/:id', updateFloor);
router.delete('/:id', deleteFloor);

module.exports = router;
