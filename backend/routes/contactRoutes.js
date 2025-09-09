const express = require('express');
const { body } = require('express-validator');
const {
  submitContactForm,
  getAllContactMessages,
  getContactMessage,
  updateContactMessage,
  deleteContactMessage,
  getContactStats
} = require('../controllers/contactController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Validation middleware for contact form
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .optional()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  body('type')
    .optional()
    .isIn(['contact', 'enquiry'])
    .withMessage('Type must be either contact or enquiry')
];

// Public routes (no authentication required)
router.post('/', contactValidation, submitContactForm);

// Temporary public routes for testing (remove in production)
router.get('/public', getAllContactMessages);
router.get('/public/stats', getContactStats);

// Protected routes (admin authentication required)
router.get('/', auth, getAllContactMessages);
router.get('/stats', auth, getContactStats);
router.get('/:id', auth, getContactMessage);
router.put('/:id', auth, updateContactMessage);
router.delete('/:id', auth, deleteContactMessage);

module.exports = router;
