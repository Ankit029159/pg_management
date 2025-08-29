import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.pg.gradezy.in/api';
  const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'https://api.pg.gradezy.in';

  // Helper function to construct image URL
  const getImageUrl = (photoPath) => {
    if (!photoPath) return '';
    // If the path already starts with http, return as is
    if (photoPath.startsWith('http')) return photoPath;
    // If the path starts with /uploads, prepend BASE_URL
    if (photoPath.startsWith('/uploads')) return `${BASE_URL}${photoPath}`;
    // Otherwise, assume it's a relative path and prepend BASE_URL/uploads/services/
    return `${BASE_URL}/uploads/services/${photoPath}`;
  };

  // Fetch services from backend API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/services`);
        console.log('Services API Response:', response.data);
        console.log('API_URL:', API_URL);
        console.log('BASE_URL:', BASE_URL);
        setServices(response.data.data);
        
        // Debug: Log photo paths
        response.data.data.forEach((service, index) => {
          console.log(`Service ${index + 1} photo path:`, service.photo);
          console.log(`Service ${index + 1} constructed URL:`, getImageUrl(service.photo));
        });
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading Services...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
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
        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No services available at the moment.</div>
            <p className="text-gray-400">Please check back later for updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <img
                  className="w-full h-56 object-cover"
                  src={getImageUrl(service.photo)}
                  alt={service.title}
                  onError={(e) => {
                    console.log('Image failed to load:', e.target.src);
                    e.target.src = 'https://via.placeholder.com/400x250/EBF8FF/3B82F6?text=Service+Image';
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', getImageUrl(service.photo));
                  }}
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
        )}
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