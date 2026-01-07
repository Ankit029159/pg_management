const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/servicesController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Public routes
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// Protected routes (Admin only) with file upload
router.post('/', auth, upload.single('photo'), createService);
router.put('/:id', auth, upload.single('photo'), updateService);
router.delete('/:id', auth, deleteService);

module.exports = router;
