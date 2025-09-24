import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiLock, FiHome } from 'react-icons/fi';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pgName: '',
    mobileNumber: '',
    email: '',
    address: '',
    adminName: '',
    aadharCard: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Real-time password matching validation
    if (name === 'password' || name === 'confirmPassword') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (confirmPassword && password && confirmPassword !== password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else if (confirmPassword && password && confirmPassword === password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pgName.trim()) {
      newErrors.pgName = 'PG Name is required';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.adminName.trim()) {
      newErrors.adminName = 'Admin name is required';
    }

    if (!formData.aadharCard.trim()) {
      newErrors.aadharCard = 'Aadhar Card number is required';
    } else if (!/^\d{12}$/.test(formData.aadharCard)) {
      newErrors.aadharCard = 'Please enter a valid 12-digit Aadhar Card number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    // Clear any previous errors
    setErrors({});

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pgName: formData.pgName,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
          address: formData.address,
          adminName: formData.adminName,
          aadharCard: formData.aadharCard,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and admin data
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminData', JSON.stringify(data.data.admin));
        
        alert('Registration successful! Please login.');
        navigate('/adminlogin');
      } else {
        // Handle validation errors from backend
        if (data.errors && Array.isArray(data.errors)) {
          const backendErrors = {};
          data.errors.forEach(error => {
            // Map backend field names to frontend field names
            const fieldName = error.path;
            backendErrors[fieldName] = error.msg;
          });
          setErrors(backendErrors);
        } else {
          // Handle general error message
          setErrors({ general: data.message || 'Registration failed' });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
            <FiUser className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your admin account to manage your PG
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* General Error Display */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {/* PG Name */}
            <div>
              <label htmlFor="pgName" className="block text-sm font-medium text-gray-700">
                PG Name
              </label>
              <div className="mt-1 relative">
                <FiHome className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="pgName"
                  name="pgName"
                  type="text"
                  required
                  className={`appearance-none relative block w-full px-10 py-3 border ${
                    errors.pgName ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter PG Name"
                  value={formData.pgName}
                  onChange={handleChange}
                />
              </div>
              {errors.pgName && <p className="mt-1 text-sm text-red-600">{errors.pgName}</p>}
            </div>

            {/* Admin Name */}
            <div>
              <label htmlFor="adminName" className="block text-sm font-medium text-gray-700">
                Admin Name
              </label>
              <div className="mt-1 relative">
                <FiUser className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="adminName"
                  name="adminName"
                  type="text"
                  required
                  className={`appearance-none relative block w-full px-10 py-3 border ${
                    errors.adminName ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter Admin Name"
                  value={formData.adminName}
                  onChange={handleChange}
                />
              </div>
              {errors.adminName && <p className="mt-1 text-sm text-red-600">{errors.adminName}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <div className="mt-1 relative">
                <FiPhone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  required
                  className={`appearance-none relative block w-full px-10 py-3 border ${
                    errors.mobileNumber ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />
              </div>
              {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <FiMail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`appearance-none relative block w-full px-10 py-3 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1 relative">
                <FiMapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  id="address"
                  name="address"
                  required
                  rows="3"
                  className={`appearance-none relative block w-full px-10 py-3 border ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter Complete Address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            {/* Aadhar Card */}
            <div>
              <label htmlFor="aadharCard" className="block text-sm font-medium text-gray-700">
                Aadhar Card Number
              </label>
              <div className="mt-1 relative">
                <FiCreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="aadharCard"
                  name="aadharCard"
                  type="text"
                  required
                  maxLength="12"
                  className={`appearance-none relative block w-full px-10 py-3 border ${
                    errors.aadharCard ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter 12-digit Aadhar Number"
                  value={formData.aadharCard}
                  onChange={handleChange}
                />
              </div>
              {errors.aadharCard && <p className="mt-1 text-sm text-red-600">{errors.aadharCard}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <FiLock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`appearance-none relative block w-full px-10 py-3 pr-10 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5 text-gray-400" /> : <FiEye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <FiLock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className={`appearance-none relative block w-full px-10 py-3 pr-10 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff className="h-5 w-5 text-gray-400" /> : <FiEye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/adminlogin" className="font-medium text-indigo-600 hover:text-indigo-500">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
