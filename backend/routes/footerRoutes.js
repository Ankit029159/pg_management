const express = require('express');
const router = express.Router();
const {
  getFooterData,
  createFooterData,
  updateFooterData,
  deleteFooterData,
  getAllFooterData
} = require('../controllers/footerController');
const auth = require('../middlewares/auth');

// Public routes
router.get('/', getFooterData);

// Protected routes (Admin only)
router.get('/all', auth, getAllFooterData);
router.post('/', auth, createFooterData);
router.put('/:id', auth, updateFooterData);
router.delete('/:id', auth, deleteFooterData);

module.exports = router;
