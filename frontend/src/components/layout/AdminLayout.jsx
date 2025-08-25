import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

// Using react-icons for a professional look. You can replace these with your own SVGs.
import { 
  FiGrid, FiSettings, FiUsers, FiFileText, FiMessageSquare, 
  FiCreditCard, FiDollarSign, FiCamera, FiLogOut, FiMenu, FiX 
} from 'react-icons/fi';

const navItems = [
  { path: 'dashboard', icon: <FiGrid size={20} />, name: 'Dashboard' },
  { path: 'setupbuilding', icon: <FiSettings size={20} />, name: 'Setup Building' },
  { path: 'managerooms', icon: <FiUsers size={20} />, name: 'Manage Rooms' },
  { path: 'aboutaddmanage', icon: <FiFileText size={20} />, name: 'About Page' },
   { path: 'herosectionaddmanage', icon: <FiFileText size={20} />, name: 'Add & Manage Hero section' },

  { path: 'servicesaddmanage', icon: <FiFileText size={20} />, name: 'Services Page' },
  { path: 'Galleryaddmanage', icon: <FiCamera size={20} />, name: 'Gallery' },
  { path: 'contactmanage', icon: <FiMessageSquare size={20} />, name: 'Contact Queries' },
  { path: 'bookingdetails', icon: <FiCreditCard size={20} />, name: 'Booking Details' },
  { path: 'paymenthistory', icon: <FiDollarSign size={20} />, name: 'Payment History' },
  // Add other links here
];

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Find the current page name to display in the header
  const currentPage = navItems.find(item => `/admin/${item.path}` === location.pathname)?.name || 'Dashboard';

  return (
    <div className="relative min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:fixed`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button onClick={toggleSidebar} className="md:hidden text-white">
            <FiX size={24} />
          </button>
        </div>
        <nav className="mt-4 flex-grow">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 mx-2 my-1 rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="ml-4">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
            <NavLink to="/adminlogin" className="flex items-center px-4 py-3 mx-2 my-1 rounded-md text-gray-300 hover:bg-red-600 hover:text-white">
                <FiLogOut size={20} />
                <span className="ml-4">Logout</span>
            </NavLink>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
        ></div>
      )}

      {/* Main Content */}
      <div className="transition-all duration-300 ease-in-out md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between bg-white shadow-md p-4">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="text-gray-600 md:hidden">
              <FiMenu size={24} />
            </button>
            <h2 className="ml-4 text-xl font-semibold text-gray-800">{currentPage}</h2>
          </div>
          <div className="flex items-center">
            {/* You can add user profile, notifications here */}
            <img
              src="https://via.placeholder.com/40" // Replace with actual user image
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet /> {/* This will render the specific admin page component */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;