// src/components/layout/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
// Icons for social media and contact info
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

function Footer() {
  const pgFacilities = [
    { name: 'High-Speed Wi-Fi', path: '/services' },
    { name: 'Furnished Rooms', path: '/services' },
    { name: '24/7 Security', path: '/services' },
    { name: 'Purified Drinking Water', path: '/services' },
    { name: 'Attached Bathrooms with Geyser', path: '/services' },
  ];

  const usefulLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Our Services', path: '/services' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Book a Room', path: '/bookingpg' },
  ];

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-12 px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* === Contact Section (UPDATED) === */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">Deshmukh PG</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-start">
                <FiMapPin className="text-blue-400 mt-1 mr-3 flex-shrink-0" size={18} />
                <span className="text-gray-400">
                  123 PG Lane, Knowledge Park, Pune, Maharashtra - 411001
                </span>
              </div>
              <div className="flex items-center">
                <FiPhone className="text-blue-400 mr-3 flex-shrink-0" size={18} />
                <a href="tel:+919876543210" className="text-gray-400 hover:text-blue-400 transition-colors">
                  +91 987 654 3210
                </a>
              </div>
              <div className="flex items-center">
                <FiMail className="text-blue-400 mr-3 flex-shrink-0" size={18} />
                <a href="mailto:contact@deshmukhpg.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                  contact@deshmukhpg.com
                </a>
              </div>
            </div>
          </div>

          {/* PG Facilities Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">PG Facilities</h3>
            <ul className="space-y-2">
              {pgFacilities.map((facility) => (
                <li key={facility.name}>
                  <Link to={facility.path} className="text-gray-400 hover:text-blue-400 transition-colors">
                    {facility.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <p className="text-gray-400 mb-4">Stay connected with us on social media.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Deshmukh PG. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;