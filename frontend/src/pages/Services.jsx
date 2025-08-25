import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- MOCK DATA: This is what your API would send ---
// In a real app, you would fetch this from your backend.
const mockServicesFromAPI = [
  {
    _id: '1',
    title: 'High-Speed Wi-Fi',
    description: 'Unlimited high-speed internet access is provided for work, study, or entertainment purposes, with 24x7 connectivity across the premises.',
    imageUrl: 'https://via.placeholder.com/400x250/EBF8FF/3B82F6?text=Wi-Fi', // Replace with your actual image URL
  },
  {
    _id: '2',
    title: 'Furnished Rooms',
    description: 'Each room is well-furnished with a bed, study table, chair, wardrobe, and fan. Some rooms also include air conditioning and private balconies.',
    imageUrl: 'https://via.placeholder.com/400x250/FEF2F2/EF4444?text=Room', // Replace with your actual image URL
  },
  {
    _id: '3',
    title: '24/7 Security',
    description: 'Continuous surveillance with CCTV cameras and on-site security personnel to ensure residents\' safety around the clock.',
    imageUrl: 'https://via.placeholder.com/400x250/ECFDF5/10B981?text=Security', // Replace with your actual image URL
  },
  {
    _id: '4',
    title: 'Purified Drinking Water',
    description: 'Clean and safe RO-purified drinking water is available 24/7 for all residents. Regular maintenance ensures the highest hygiene standards.',
    imageUrl: 'https://via.placeholder.com/400x250/EFF6FF/60A5FA?text=Water', // Replace with your actual image URL
  },
  {
    _id: '5',
    title: 'Attached Bathrooms with Geyser',
    description: 'Rooms come with attached private bathrooms equipped with western-style toilets, geysers, and regular water supply.',
    imageUrl: 'https://via.placeholder.com/400x250/F3F4F6/6B7280?text=Bathroom', // Replace with your actual image URL
  },
  {
    _id: '6',
    title: 'Laundry & Housekeeping',
    description: 'Regular housekeeping and laundry services ensure clean rooms and fresh clothes without hassle.',
    imageUrl: 'https://via.placeholder.com/400x250/F5F3FF/8B5CF6?text=Laundry', // Replace with your actual image URL
  },
];

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // This useEffect hook simulates fetching data from your backend API
  useEffect(() => {
    // Simulate a network delay
    const timer = setTimeout(() => {
      // In a real application, you would make an API call here, e.g.:
      // axios.get('/api/services').then(response => {
      //   setServices(response.data);
      //   setLoading(false);
      // });
      
      setServices(mockServicesFromAPI);
      setLoading(false);
    }, 1000); // 1-second delay to show the loading state

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // The empty array [] ensures this effect runs only once

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading Services...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto text-center py-16 px-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Our Services & Facilities
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-500">
            We are committed to providing a seamless and comfortable living experience with top-tier amenities.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <img
                className="w-full h-56 object-cover"
                src={service.imageUrl}
                alt={service.title}
              />
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action (CTA) Section */}
      <div className="bg-blue-600">
          <div className="container mx-auto py-16 px-4 sm:py-20 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Find Your Perfect Room Today
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-100">
              Join our community and enjoy a hassle-free stay with all the amenities you need.
            </p>
            <Link
              to="/bookingpg"
              className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-md text-base font-medium text-blue-600 bg-white hover:bg-blue-50 sm:w-auto transition-transform transform hover:scale-105"
            >
              Book Now
            </Link>
          </div>
        </div>
    </div>
  );
}

export default Services;