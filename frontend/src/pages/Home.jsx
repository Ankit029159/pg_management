import React from 'react';
import Herosection from './Herosection';
import Services from './Services';

// Import the icons needed for the contact section
import { FaWhatsapp } from 'react-icons/fa';
import { FiMail, FiPhone } from 'react-icons/fi';

// Data for the contact cards with new "fancy" styling properties
const contactMethods = [
  {
    icon: <FaWhatsapp size={32} />,
    title: 'WhatsApp',
    contact: '+91 7820883105',
    href: 'https://wa.me/917820883105',
    bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
    iconColor: 'text-green-600',
    hoverShadow: 'hover:shadow-green-200/80',
  },
  {
    icon: <FiMail size={32} />,
    title: 'Email',
    contact: 'contact@deshmukhpg.com',
    href: 'mailto:contact@deshmukhpg.com',
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
    iconColor: 'text-blue-600',
    hoverShadow: 'hover:shadow-blue-200/80',
  },
  {
    icon: <FiPhone size={32} />,
    title: 'Call Us',
    contact: '+91 7820883105',
    href: 'tel:+917820883105',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    iconColor: 'text-yellow-600',
    hoverShadow: 'hover:shadow-yellow-200/80',
  },
];

function Home() {
  return (
    <>
      <Herosection />
      <Services />

      {/* ================================== */}
      {/*      Get in Touch Section          */}
      {/* ================================== */}
      <div className="bg-gray-50 py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Get in Touch
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Feel free to reach out to us directly through WhatsApp, email, or phone!
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-8 text-center rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${method.bgColor} ${method.hoverShadow}`}
              >
                <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full bg-white mb-6 shadow-inner`}>
                  <span className={method.iconColor}>{method.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{method.title}</h3>
                <p className="mt-2 text-lg text-gray-700">{method.contact}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ================================== */}
      {/*         Location Section           */}
      {/* ================================== */}
      <div className="bg-white py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Visit Us
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Find us easily with the map below. We look forward to welcoming you.
            </p>
          </div>

          <div className="mt-12 w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 border-8 border-white">
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
    </>
  );
}

export default Home;