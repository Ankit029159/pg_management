const express = require('express');
const router = express.Router();
const {
  getAboutData,
  createAboutData,
  updateAboutData,
  deleteAboutData,
  getAllAboutData
} = require('../controllers/aboutController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/uploadAbout');

// Public routes
router.get('/', getAboutData);

// Protected routes (Admin only)
router.get('/all', auth, getAllAboutData);
router.post('/', auth, upload.single('photo'), createAboutData);
router.put('/:id', auth, upload.single('photo'), updateAboutData);
router.delete('/:id', auth, deleteAboutData);

module.exports = router;
