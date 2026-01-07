// src/components/layout/Header.jsx

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiInfo, FiSettings, FiMail, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'Home', path: '/home', icon: <FiHome size={18} /> },
    { title: 'About', path: '/about', icon: <FiInfo size={18} /> },
    { title: 'Services', path: '/services', icon: <FiSettings size={18} /> },
    { title: 'Contact', path: '/contact', icon: <FiMail size={18} /> },
  ];

  // Style for active NavLink
  const activeLinkStyle = {
    color: '#2563EB',
    fontWeight: '600',
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white shadow-sm'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand Name */}
          <div className="flex-shrink-0">
            <NavLink 
              to="/" 
              className="flex items-center space-x-2 text-xl sm:text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm sm:text-base font-bold">
                DP
              </div>
              <span className="hidden sm:block">Deshmukh PG</span>
              <span className="sm:hidden">DP</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.title}
                to={link.path}
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
              >
                <span className="hidden lg:block">{link.icon}</span>
                {link.title}
              </NavLink>
            ))}
          
            {/* User Auth Links */}
            {(() => {
              const user = JSON.parse(localStorage.getItem('pg_current_user') || 'null');
              if (user) {
                return (
                  <>
                    <NavLink to="/dashboard" className="px-3 py-2 rounded hover:bg-gray-100">Dashboard</NavLink>
                    <button onClick={() => { localStorage.removeItem('pg_current_user'); window.location.reload(); }} className="px-3 py-2 rounded bg-red-500 text-white">Logout</button>
                  </>
                )
              }
              return (
                <>
                  <NavLink to="/login" className="px-3 py-2 rounded hover:bg-gray-100">Login</NavLink>
                  <NavLink to="/register" className="px-3 py-2 rounded bg-blue-600 text-white">Register</NavLink>
                </>
              )
            })()}

</nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            <a
              href="tel:+917820883105"
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <FiPhone size={18} />
              <span className="hidden lg:block">Call</span>
            </a>
            <a
              href="https://wa.me/917820883105"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
            >
              <FaWhatsapp size={18} />
              <span className="hidden lg:block">WhatsApp</span>
            </a>
            <NavLink
              to="/bookingpg"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Book Now
            </NavLink>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center space-x-2">
            <a
              href="tel:+917820883105"
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <FiPhone size={20} />
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.title}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                {link.icon}
                <span>{link.title}</span>
              </NavLink>
            ))}
            
            {/* Mobile Contact Options */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <a
                href="tel:+917820883105"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                <FiPhone size={18} />
                <span>Call Us</span>
              </a>
              <a
                href="https://wa.me/917820883105"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200"
              >
                <FaWhatsapp size={18} />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Mobile CTA Button */}
            <div className="pt-4">
              <NavLink
                to="/bookingpg"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg"
              >
                Book Now
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;