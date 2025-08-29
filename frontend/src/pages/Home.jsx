import React, { useState, useEffect } from 'react';
import Herosection from './Herosection';
import Services from './Services';
import axios from 'axios';

// Import the icons needed for the contact section
import { FaWhatsapp } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin, FiStar, FiUsers, FiShield, FiWifi, FiClock } from 'react-icons/fi';

function Home() {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.pg.gradezy.in/api';

  // Fetch footer data for contact information
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/footer`);
        console.log('Footer API Response:', response.data);
        
        if (response.data.success && response.data.data) {
          setFooterData(response.data.data);
        } else {
          console.log('No footer data found, using default values');
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
        // Use default values if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, [API_URL]);

  // Create contact methods array with dynamic data
  const contactMethods = [
    {
      icon: <FaWhatsapp size={32} />,
      title: 'WhatsApp',
      contact: footerData?.whatsappNumber || '+91 7820883105',
      href: footerData?.whatsappNumber ? `https://wa.me/${footerData.whatsappNumber.replace(/\D/g, '')}` : 'https://wa.me/917820883105',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      iconColor: 'text-green-600',
      hoverShadow: 'hover:shadow-green-200/80',
      description: 'Quick chat support'
    },
    {
      icon: <FiMail size={32} />,
      title: 'Email',
      contact: footerData?.email || 'contact@deshmukhpg.com',
      href: footerData?.email ? `mailto:${footerData.email}` : 'mailto:contact@deshmukhpg.com',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      hoverShadow: 'hover:shadow-blue-200/80',
      description: 'Detailed inquiries'
    },
    {
      icon: <FiPhone size={32} />,
      title: 'Call Us',
      contact: footerData?.callNumber || '+91 7820883105',
      href: footerData?.callNumber ? `tel:${footerData.callNumber}` : 'tel:+917820883105',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      iconColor: 'text-yellow-600',
      hoverShadow: 'hover:shadow-yellow-200/80',
      description: 'Direct conversation'
    },
  ];

  // Features data
  const features = [
    {
      icon: <FiShield size={24} />,
      title: '24/7 Security',
      description: 'Round-the-clock security with CCTV surveillance',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <FiWifi size={24} />,
      title: 'High-Speed WiFi',
      description: 'Free high-speed internet throughout the building',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <FiUsers size={24} />,
      title: 'Community Living',
      description: 'Friendly environment with like-minded people',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <FiStar size={24} />,
      title: 'Premium Amenities',
      description: 'Modern facilities for comfortable living',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <>
      <Herosection />
      <Services />

      {/* ================================== */}
      {/*         Features Section           */}
      {/* ================================== */}
      <div className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="gradient-text">Deshmukh PG</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the perfect blend of comfort, security, and community living
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover-lift"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================== */}
      {/*      Get in Touch Section          */}
      {/* ================================== */}
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Feel free to reach out to us directly through WhatsApp, email, or phone! We're here to help you find your perfect home.
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-8 text-center rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${method.bgColor} ${method.hoverShadow} border border-white/50`}
              >
                <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full bg-white mb-6 shadow-inner`}>
                  <span className={method.iconColor}>{method.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{method.title}</h3>
                <p className="text-lg text-gray-700 mb-2">{method.contact}</p>
                <p className="text-sm text-gray-600">{method.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ================================== */}
      {/*         Location Section           */}
      {/* ================================== */}
      <div className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Visit Us
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find us easily with the map below. We look forward to welcoming you to your new home.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Address Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <FiMapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Location</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {footerData?.address ? (
                        footerData.address.split('\n').map((line, index) => (
                          <span key={index}>
                            {line}
                            {index < footerData.address.split('\n').length - 1 && <br />}
                          </span>
                        ))
                      ) : (
                        <>
                          Deshmukh PG<br />
                          Pune, Maharashtra<br />
                          India
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white">
                    <FiClock size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Hours</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {footerData?.visitHours ? (
                        footerData.visitHours.split('\n').map((line, index) => (
                          <span key={index}>
                            {line}
                            {index < footerData.visitHours.split('\n').length - 1 && <br />}
                          </span>
                        ))
                      ) : (
                        <>
                          Monday - Sunday<br />
                          9:00 AM - 8:00 PM
                        </>
                      )}
                      <br />
                      <span className="text-sm text-green-600 font-medium">Open for visits</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <div className="w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 border-8 border-white">
                <iframe
                  title="Deshmukh PG Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121059.04360434442!2d73.79292693523493!3d18.52456488775268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1678888888888!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================== */}
      {/*         CTA Section                */}
      {/* ================================== */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Move In?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community and experience the best PG accommodation in Pune. Book your spot today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/bookingpg"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Book Now
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href={footerData?.whatsappNumber ? `https://wa.me/${footerData.whatsappNumber.replace(/\D/g, '')}` : 'https://wa.me/917820883105'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <FaWhatsapp className="mr-2" size={20} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;