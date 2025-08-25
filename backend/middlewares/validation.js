const { body } = require('express-validator');

// Validation for admin registration
const validateAdminRegistration = [
  body('pgName')
    .trim()
    .notEmpty()
    .withMessage('PG Name is required')
    .isLength({ max: 100 })
    .withMessage('PG Name cannot exceed 100 characters'),
  
  body('mobileNumber')
    .trim()
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid 10-digit mobile number'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 500 })
    .withMessage('Address cannot exceed 500 characters'),
  
  body('adminName')
    .trim()
    .notEmpty()
    .withMessage('Admin name is required')
    .isLength({ max: 100 })
    .withMessage('Admin name cannot exceed 100 characters'),
  
  body('aadharCard')
    .trim()
    .notEmpty()
    .withMessage('Aadhar Card number is required')
    .matches(/^\d{12}$/)
    .withMessage('Please enter a valid 12-digit Aadhar Card number'),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Validation for admin login
const validateAdminLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
];

module.exports = {
  validateAdminRegistration,
  validateAdminLogin
};
