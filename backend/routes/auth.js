const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');
const { validateAdminRegistration, validateAdminLogin } = require('../middlewares/validation');

// Public routes
router.post('/register', validateAdminRegistration, authController.registerAdmin);
router.post('/login', validateAdminLogin, authController.loginAdmin);

// Protected routes
router.get('/profile', auth, authController.getAdminProfile);
router.post('/logout', auth, authController.logoutAdmin);

module.exports = router;
