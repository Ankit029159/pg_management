import React, { useState, useEffect } from 'react';
import axios from 'axios';

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.pg.gradezy.in/api';
  const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'https://api.pg.gradezy.in';

  // Helper function to construct image URL
  const getImageUrl = (photoPath) => {
    if (!photoPath) return '';
    if (photoPath.startsWith('http')) return photoPath;
    if (photoPath.startsWith('/uploads')) return `${BASE_URL}${photoPath}`;
    return `${BASE_URL}/uploads/about/${photoPath}`;
  };

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/about`);
        console.log('About API Response:', response.data);
        setAboutData(response.data.data);
      } catch (error) {
        console.error('Error fetching about data:', error);
        // Use default data if API fails
        setAboutData({
          title: 'About Deshmukh PG',
          subtitle: 'Your Home Away From Home',
          story: 'Welcome to Deshmukh PG, where comfort meets affordability. Our journey began with a simple vision: to provide students and working professionals with a safe, comfortable, and welcoming place to stay.\n\nWe understand the challenges of finding the perfect accommodation in a new city. That\'s why we\'ve created a space that feels like home, with modern amenities, 24/7 security, and a supportive community.\n\nOur commitment to quality service and affordable pricing has made us a trusted choice for accommodation seekers. We take pride in maintaining high standards of cleanliness, safety, and hospitality.',
          mission: 'To provide affordable, comfortable, and safe accommodation solutions for students and working professionals, creating a home-like environment that supports their growth and success.',
          vision: 'To become the most trusted and preferred accommodation provider, known for our commitment to quality, affordability, and exceptional service.',
          photo: 'default-about.jpg'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, [API_URL, BASE_URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {aboutData?.title || 'About Deshmukh PG'}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100">
            {aboutData?.subtitle || 'Your Home Away From Home'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl transform rotate-3"></div>
              <img
                src={aboutData?.photo ? getImageUrl(aboutData.photo) : 'https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=About+Us'}
                alt="About Deshmukh PG"
                className="relative rounded-2xl shadow-2xl w-full h-96 object-cover"
                onError={(e) => {
                  console.log('About Image failed to load:', e.target.src);
                  e.target.src = 'https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=About+Us';
                }}
                onLoad={() => {
                  console.log('About Image loaded successfully:', getImageUrl(aboutData?.photo));
                }}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg text-gray-600">
              <p className="whitespace-pre-line leading-relaxed">
                {aboutData?.story || 'Welcome to Deshmukh PG, where comfort meets affordability. Our journey began with a simple vision: to provide students and working professionals with a safe, comfortable, and welcoming place to stay.\n\nWe understand the challenges of finding the perfect accommodation in a new city. That\'s why we\'ve created a space that feels like home, with modern amenities, 24/7 security, and a supportive community.\n\nOur commitment to quality service and affordable pricing has made us a trusted choice for accommodation seekers. We take pride in maintaining high standards of cleanliness, safety, and hospitality.'}
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="mt-20 grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {aboutData?.mission || 'To provide affordable, comfortable, and safe accommodation solutions for students and working professionals, creating a home-like environment that supports their growth and success.'}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {aboutData?.vision || 'To become the most trusted and preferred accommodation provider, known for our commitment to quality, affordability, and exceptional service.'}
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Deshmukh PG?</h2>
            <p className="text-xl text-gray-600">Experience the difference with our exceptional services</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-600">24/7 security with CCTV surveillance and secure access</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comfortable Living</h3>
              <p className="text-gray-600">Well-furnished rooms with modern amenities and facilities</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Affordable Pricing</h3>
              <p className="text-gray-600">Competitive rates with no hidden charges or extra fees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;