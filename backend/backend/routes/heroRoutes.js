const express = require('express');
const router = express.Router();
const {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  getAllHeroSlides
} = require('../controllers/heroController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/uploadHero');

// Public routes
router.get('/', getHeroSlides);

// Protected routes (Admin only)
router.get('/all', auth, getAllHeroSlides);
router.post('/', auth, upload.single('photo'), createHeroSlide);
router.put('/:id', auth, upload.single('photo'), updateHeroSlide);
router.delete('/:id', auth, deleteHeroSlide);

module.exports = router;
