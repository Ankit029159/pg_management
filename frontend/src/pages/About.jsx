import React from 'react';
import { Link } from 'react-router-dom';

// Import icons for the values section
import { FiUsers, FiShield, FiHeart, FiStar } from 'react-icons/fi';

// Data for our core values - easy to update
const coreValues = [
  {
    icon: <FiShield size={28} />,
    title: 'Safety & Security',
    description: 'Your safety is our top priority, with 24/7 security and CCTV surveillance.',
  },
  {
    icon: <FiHeart size={28} />,
    title: 'Comfort & Care',
    description: 'We provide fully-furnished, comfortable rooms designed to feel like home.',
  },
  {
    icon: <FiUsers size={28} />,
    title: 'Community',
    description: 'We foster a welcoming environment where residents can connect and thrive together.',
  },
  {
    icon: <FiStar size={28} />,
    title: 'Cleanliness',
    description: 'Our professional housekeeping staff ensures a spotless and hygienic living space.',
  },
];

function About() {
  return (
    <div className="bg-white">
      {/* Section 1: Hero Introduction */}
      <div className="relative bg-gray-800">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
            alt="Comfortable living space"
          />
          <div className="absolute inset-0 bg-gray-700 mix-blend-multiply" aria-hidden="true" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">About Deshmukh PG</h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
            More than just a place to stay. We are a community dedicated to providing a secure, comfortable, and enriching living experience.
          </p>
        </div>
      </div>

      {/* Section 2: Our Story */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Story</h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Deshmukh PG was founded with a simple idea: to create a living space for students and professionals that truly feels like home. We noticed a need for accommodation that wasn't just about four walls and a roof, but about building a supportive and positive community.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                From day one, our focus has been on providing top-notch facilities, ensuring impeccable cleanliness, and prioritizing the safety and well-being of every resident. We believe that a comfortable living environment is the foundation for success, whether you're studying for exams or building your career.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                className="rounded-2xl shadow-xl w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2070&auto=format&fit=crop"
                alt="Well-lit modern room"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Our Core Values */}
      <div className="py-16 sm:py-24">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {coreValues.map((value) => (
              <div key={value.title} className="p-6 bg-gray-50 rounded-xl transition-transform transform hover:-translate-y-2 hover:shadow-lg">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Call to Action (CTA) */}
      <div className="bg-blue-600">
        <div className="container mx-auto py-16 px-4 sm:py-20 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Find Your Perfect Space?
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Explore our rooms and facilities, or contact us to book a tour today.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-md text-base font-medium text-blue-600 bg-white hover:bg-blue-50 transition"
            >
              View Our Facilities
            </Link>
            <Link
              to="/bookingpg"
              className="inline-flex items-center justify-center px-6 py-3 border border-blue-400 rounded-lg shadow-md text-base font-medium text-white bg-blue-600 hover:bg-blue-500 transition"
            >
              Book a Tour
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;