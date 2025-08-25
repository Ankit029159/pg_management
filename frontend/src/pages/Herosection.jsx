// src/pages/Herosection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Herosection() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  const BASE_URL = 'http://localhost:5001'; // Backend server URL

  // Helper function to construct image URL
  const getImageUrl = (photoPath) => {
    console.log('getImageUrl called with:', photoPath);
    
    if (!photoPath) {
      console.log('No photo path provided, returning empty string');
      return '';
    }
    
    if (photoPath.startsWith('http')) {
      console.log('Photo path is already a full URL:', photoPath);
      return photoPath;
    }
    
    // For uploaded images, construct the full URL
    // The photoPath should be something like "photo-1756144241542-7880365.jpg"
    const fullUrl = `${BASE_URL}/uploads/hero/${photoPath}`;
    console.log('Constructed image URL:', fullUrl);
    return fullUrl;
  };

  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/hero`);
        console.log('Hero API Response:', response.data);
        console.log('API URL used:', `${API_URL}/hero`);
        
        if (response.data.success && response.data.data.length > 0) {
          console.log('Setting hero slides from API:', response.data.data);
          // Log each slide's photo path
          response.data.data.forEach((slide, index) => {
            console.log(`Slide ${index} photo path:`, slide.photo);
            console.log(`Slide ${index} constructed URL:`, getImageUrl(slide.photo));
          });
          setHeroSlides(response.data.data);
        } else {
          console.log('No API data, using default slides');
          // Use default slides if no data from API
          setHeroSlides([
            {
              title: 'Welcome to Deshmukh PG',
              description: 'Your perfect home away from home with modern amenities and comfortable living spaces.',
              photo: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop'
            },
            {
              title: 'Safe & Secure Accommodation',
              description: '24/7 security with CCTV surveillance ensuring your safety and peace of mind.',
              photo: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2070&auto=format&fit=crop'
            },
            {
              title: 'Affordable Living',
              description: 'Quality accommodation at competitive prices with no hidden charges.',
              photo: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error);
        // Use default slides if API fails
        setHeroSlides([
          {
            title: 'Welcome to Deshmukh PG',
            description: 'Your perfect home away from home with modern amenities and comfortable living spaces.',
            photo: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop'
          },
          {
            title: 'Safe & Secure Accommodation',
            description: '24/7 security with CCTV surveillance ensuring your safety and peace of mind.',
            photo: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2070&auto=format&fit=crop'
          },
          {
            title: 'Affordable Living',
            description: 'Quality accommodation at competitive prices with no hidden charges.',
            photo: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSlides();
  }, [API_URL]);

  // Auto-advance slides
  useEffect(() => {
    if (heroSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [heroSlides.length]);

  // Manual slide navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPreviousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Hero Carousel */}
      <div className="relative h-full">
        {heroSlides.map((slide, index) => {
          // Construct the image URL
          const imageUrl = slide.photo ? getImageUrl(slide.photo) : `https://images.unsplash.com/photo-${index === 0 ? '1560448204-e02f11c3d0e2' : index === 1 ? '1522771739844-6a9f6d5f14af' : '1554995207-c18c203602cb'}?q=80&w=2070&auto=format&fit=crop`;
          
          console.log(`Slide ${index} image URL:`, imageUrl);
          
          return (
            <div
              key={slide._id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={imageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Hero Image failed to load:', e.target.src);
                    // Fallback to Unsplash image
                    e.target.src = `https://images.unsplash.com/photo-${index === 0 ? '1560448204-e02f11c3d0e2' : index === 1 ? '1522771739844-6a9f6d5f14af' : '1554995207-c18c203602cb'}?q=80&w=2070&auto=format&fit=crop`;
                  }}
                  onLoad={() => {
                    console.log('Hero Image loaded successfully:', imageUrl);
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              </div>

              {/* Content Overlay */}
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-4xl mx-auto">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    {slide.title || 'Welcome to Deshmukh PG'}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
                    {slide.description || 'Your perfect home away from home with modern amenities and comfortable living spaces.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/bookingpg"
                      className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
                    >
                      Book Now
                    </Link>
                    <Link
                      to="/services"
                      className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-200 transform hover:scale-105"
                    >
                      View Facilities
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {heroSlides.length > 1 && (
        <>
          <button
            onClick={goToPreviousSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-200 z-10"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-200 z-10"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {heroSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Herosection;