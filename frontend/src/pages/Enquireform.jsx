import React, { useState } from 'react';
import { FiMessageSquare, FiX } from 'react-icons/fi';

function EnquireNow() {
  // State to manage if the modal is open or closed. It's all handled inside this component!
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'PG Enquiry', // Default subject
    message: '',
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enquiry Submitted:', formData);
    alert('Thank you for your enquiry! We will get back to you soon.');
    handleCloseModal(); // Close the form after submission
  };

  return (
    <>
      {/* 1. THE FLOATING BUTTON */}
      <button
        onClick={handleOpenModal}
        className="fixed bottom-8 right-8 z-40 flex items-center justify-center w-auto h-14 px-5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
      >
        <FiMessageSquare size={22} className="mr-2" />
        <span className="font-semibold">Enquire Now</span>
      </button>

      {/* 2. THE MODAL (POP-UP FORM) */}
      {isModalOpen && (
        // Modal Overlay
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal} // Close modal if overlay is clicked
        >
          {/* Modal Content */}
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the form
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
            >
              <FiX size={24} />
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Enquire Now</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="enquiry-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" name="name" id="enquiry-name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="enquiry-email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" name="email" id="enquiry-email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label htmlFor="enquiry-phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" name="phone" id="enquiry-phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="enquiry-message" className="block text-sm font-medium text-gray-700">Your Message</label>
                <textarea name="message" id="enquiry-message" rows="4" value={formData.message} onChange={handleChange} required placeholder="I would like to know about..." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">
                  Submit Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default EnquireNow;