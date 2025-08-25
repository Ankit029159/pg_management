// src/components/layout/Header.jsx

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi'; // Icons for hamburger menu

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { title: 'Home', path: '/home' },
    { title: 'About', path: '/about' },
    { title: 'Services', path: '/services' },
    { title: 'Contact', path: '/contact' },
  ];

  // Style for active NavLink
  const activeLinkStyle = {
    color: '#2563EB', // A blue color, you can change this
    fontWeight: '600',
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Name */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              Deshmukh PG
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.title}
                to={link.path}
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {link.title}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <NavLink
              to="/bookingpg"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm"
            >
              Book Now
            </NavLink>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.title}
                to={link.path}
                onClick={() => setIsMenuOpen(false)} // Close menu on click
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                {link.title}
              </NavLink>
            ))}
            <div className="pt-4 pb-2 px-2">
              <NavLink
                to="/bookingpg"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center px-5 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-all duration-300"
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