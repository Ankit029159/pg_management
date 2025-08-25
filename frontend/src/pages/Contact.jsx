import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

function Contact() {
  // State to manage the form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Handle input changes and update the state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend API
    console.log('Form Submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    // Reset form fields after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="bg-gray-50">
      {/* Page Header */}
      <div className="text-center py-16 sm:py-24 bg-white">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Contact Us</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          We'd love to hear from you! Whether you have a question about our facilities or anything else, our team is ready to answer all your questions.
        </p>
      </div>

      {/* Main Content: Form and Info */}
      <div className="container mx-auto py-16 sm:py-24 px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Column 1: Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea name="message" id="message" rows="4" value={formData.message} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Column 2: Contact Info & Map */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Information</h2>
              <div className="space-y-4 text-lg">
                <div className="flex items-start">
                  <FiMapPin className="flex-shrink-0 h-6 w-6 text-blue-600 mt-1 mr-3" />
                  <span className="text-gray-700">123 PG Lane, Knowledge Park, Pune, Maharashtra - 411001</span>
                </div>
                <div className="flex items-center">
                  <FiPhone className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3" />
                  <a href="tel:+919876543210" className="text-gray-700 hover:text-blue-600">+91 987 654 3210</a>
                </div>
                <div className="flex items-center">
                  <FiMail className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3" />
                  <a href="mailto:contact@deshmukhpg.com" className="text-gray-700 hover:text-blue-600">contact@deshmukhpg.com</a>
                </div>
              </div>
            </div>
            <div className="w-full h-80 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
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
  );
}

export default Contact;