const express = require('express');
const router = express.Router();
const {
  addRoom,
  getAllRooms,
  getRoomsByBuildingAndFloor,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');

// Room routes
router.post('/add', addRoom);
router.get('/all', getAllRooms);
router.get('/building/:buildingId/floor/:floorId', getRoomsByBuildingAndFloor);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;

