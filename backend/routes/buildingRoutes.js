const express = require('express');
const router = express.Router();
const {
  addBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding
} = require('../controllers/buildingController');

// Building routes
router.post('/add', addBuilding);
router.get('/all', getAllBuildings);
router.get('/:id', getBuildingById);
router.put('/:id', updateBuilding);
router.delete('/:id', deleteBuilding);

module.exports = router;

