// src/pages/Herosection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// === CORRECTED IMPORT PATHS based on your folder structure ===
import heroImage1 from '../assets/hero1.jpeg';
import heroImage2 from '../assets/hero2.jpg';
import heroImage3 from '../assets/hero3.jpg';

// Use the imported images in the slides array
const slides = [
  {
    id: 1,
    imageUrl: heroImage1,
    alt: 'Clean and modern living room space',
  },
  {
    id: 2,
    imageUrl: heroImage2,
    alt: 'Comfortable armchair in a bright room',
  },
  {
    id: 3,
    imageUrl: heroImage3,
    alt: 'Modern dining and kitchen area',
  },
];

function Herosection() {
  return (
    <div className="relative w-full h-[60vh] md:h-[500px] lg:h-[600px]">
      {/* Custom CSS for Swiper */}
      <style>
        {`
          .swiper-pagination {
            position: absolute;
            bottom: 20px !important;
          }
          .swiper-pagination-bullet {
            width: 12px;
            height: 12px;
            background: rgba(255, 255, 255, 0.8);
            opacity: 0.6;
            margin: 0 8px !important;
          }
          .swiper-pagination-bullet-active {
            opacity: 1;
            background: #fff;
          }
          .swiper-button-prev,
          .swiper-button-next {
            color: white !important;
            opacity: 0.7;
            transition: opacity 0.3s ease;
          }
          .swiper-button-prev:hover,
          .swiper-button-next:hover {
            opacity: 1;
          }
          .swiper-button-prev:after,
          .swiper-button-next:after {
            font-size: 32px !important;
            font-weight: bold;
          }
          @media (max-width: 768px) {
            .swiper-button-prev,
            .swiper-button-next {
              display: none !important;
            }
          }
        `}
      </style>

      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: '.swiper-pagination' }}
        navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="w-full h-full relative">
              <img src={slide.imageUrl} alt={slide.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom elements for Swiper controls */}
      <div className="swiper-pagination z-20"></div>
      <div className="swiper-button-prev z-20"></div>
      <div className="swiper-button-next z-20"></div>

      {/* Hero content overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight drop-shadow-lg">
          Your New Home Awaits
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200 drop-shadow-md">
          Experience comfortable, secure, and affordable living at Deshmukh PG.
        </p>
        <Link
          to="/bookingpg"
          className="mt-8 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          Book Your Spot Now
        </Link>
      </div>
    </div>
  );
}

export default Herosection;