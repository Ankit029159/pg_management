// src/components/layout/Footer.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiClock, FiShield, FiWifi, FiUsers, FiHome, FiInfo, FiMessageSquare } from 'react-icons/fi';
import { FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import axios from 'axios';

function Footer() {
  const [services, setServices] = useState([]);
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  // Fetch services and footer data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch services for facilities
        const servicesResponse = await axios.get(`${API_URL}/services`);
        setServices(servicesResponse.data.data);
        
        // Fetch footer data for contact details
        try {
          const footerResponse = await axios.get(`${API_URL}/footer`);
          setFooterData(footerResponse.data.data);
        } catch (footerError) {
          console.log('No footer data found, using defaults');
          // Use default footer data if none exists
          setFooterData({
            callNumber: '+91 7820883105',
            whatsappNumber: '+91 7820883105',
            email: 'info@deshmukhpg.com',
            address: '123 Main Street, City, State 12345',
            visitHours: 'Monday - Sunday\n9:00 AM - 8:00 PM'
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  // Quick contact links
  const quickContact = footerData ? [
    { icon: <FiPhone size={18} />, text: footerData.callNumber, href: `tel:${footerData.callNumber}` },
    { icon: <FaWhatsapp size={18} />, text: 'WhatsApp', href: `https://wa.me/${footerData.whatsappNumber.replace(/\D/g, '')}` },
    { icon: <FiMail size={18} />, text: footerData.email, href: `mailto:${footerData.email}` },
  ] : [];

  // Quick links
  const quickLinks = [
    { name: 'Home', path: '/', icon: <FiHome size={16} /> },
    { name: 'About', path: '/about', icon: <FiInfo size={16} /> },
    { name: 'Services', path: '/services', icon: <FiShield size={16} /> },
    { name: 'Contact', path: '/contact', icon: <FiMessageSquare size={16} /> },
  ];

  // Social media links
  const socialLinks = [
    { icon: <FaFacebook size={18} />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <FaInstagram size={18} />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <FaTwitter size={18} />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <FaWhatsapp size={18} />, href: `https://wa.me/${footerData?.whatsappNumber?.replace(/\D/g, '') || '917820883105'}`, label: 'WhatsApp' },
  ];

  if (loading) {
    return (
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                DP
              </div>
              <div>
                <h3 className="text-xl font-bold">Deshmukh PG</h3>
                <p className="text-sm text-gray-300">Your Home Away From Home</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              Experience comfortable and affordable accommodation with modern amenities and a welcoming environment.
            </p>
            
            <div className="space-y-3">
              {quickContact.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors duration-200 group"
                >
                  <span className="text-gray-500 group-hover:text-blue-400 transition-colors duration-200">
                    {contact.icon}
                  </span>
                  <span className="text-sm">{contact.text}</span>
                </a>
              ))}
            </div>
          </div>

          {/* PG Facilities (from Services) */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Our Facilities</h4>
            <ul className="space-y-3">
              {services.length > 0 ? (
                services.map((service, index) => (
                  <li key={service._id}>
                    <div className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-200 group">
                      <span className="text-gray-500 group-hover:text-blue-400 transition-colors duration-200">
                        <FiShield size={16} />
                      </span>
                      <span className="text-sm">{service.title}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">No facilities available</li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-200 group"
                  >
                    <span className="text-gray-500 group-hover:text-blue-400 transition-colors duration-200">
                      {link.icon}
                    </span>
                    <span className="text-sm">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Visit Hours */}
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                <FiClock className="mr-2" />
                Visit Hours
              </h4>
              <p className="text-xs text-gray-400 whitespace-pre-line">
                {footerData?.visitHours || 'Monday - Sunday\n9:00 AM - 8:00 PM'}
              </p>
            </div>
          </div>

          {/* Connect With Us */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
            <p className="text-gray-300 text-sm">
              Follow us on social media for updates, offers, and a glimpse into life at Deshmukh PG.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 transform hover:scale-110"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-white mb-3">Stay Updated</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-r-lg transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Deshmukh PG. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;