import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

// Using react-icons for a professional look. You can replace these with your own SVGs.
import { 
  FiGrid, FiSettings, FiUsers, FiFileText, FiMessageSquare, 
  FiCreditCard, FiDollarSign, FiCamera, FiLogOut, FiMenu, FiX, FiUser,
  FiHome, FiImage, FiShield, FiTrendingUp, FiBell, FiChevronDown
} from 'react-icons/fi';

const navItems = [
  { path: 'dashboard', icon: <FiGrid size={20} />, name: 'Dashboard', color: 'from-blue-500 to-blue-600' },
  { path: 'setupbuilding', icon: <FiHome size={20} />, name: 'Setup Building', color: 'from-green-500 to-green-600' },
  { path: 'managerooms', icon: <FiUsers size={20} />, name: 'Manage Rooms', color: 'from-purple-500 to-purple-600' },
  { path: 'bookingdetails', icon: <FiCreditCard size={20} />, name: 'Booking Details', color: 'from-orange-500 to-orange-600' },
  { path: 'paymenthistory', icon: <FiDollarSign size={20} />, name: 'Payment History', color: 'from-emerald-500 to-emerald-600' },
  { path: 'homemanagement', icon: <FiHome size={20} />, name: 'Home Management', color: 'from-indigo-500 to-indigo-600' },
  { path: 'contactmanagement', icon: <FiMessageSquare size={20} />, name: 'Contact Queries', color: 'from-teal-500 to-teal-600' },
];

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [notifications] = useState(3); // Mock notification count
  const [isHomeManagementOpen, setIsHomeManagementOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Load admin data on component mount
  useEffect(() => {
    const storedAdminData = localStorage.getItem('adminData');
    if (storedAdminData) {
      try {
        setAdminData(JSON.parse(storedAdminData));
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('adminData');
        navigate('/adminlogin');
      }
    }
  }, [navigate]);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isHomeManagementOpen && !event.target.closest('.home-management-dropdown')) {
        setIsHomeManagementOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHomeManagementOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Find the current page name to display in the header
  const currentPage = navItems.find(item => `/admin/${item.path}` === location.pathname)?.name || 'Dashboard';

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        // Call logout API
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      navigate('/adminlogin');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* Custom CSS for scrollbar */}
      <style>
        {`
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          .scrollbar-thin {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
          }
        `}
      </style>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 ease-in-out md:translate-x-0 md:fixed border-r border-gray-200`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FiShield size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-xs text-blue-100">Management Dashboard</p>
            </div>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="md:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-colors duration-200"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Admin Info */}
        {adminData && (
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                  {adminData.adminName?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {adminData.adminName}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {adminData.pgName}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {navItems.map((item) => {
              if (item.path === 'homemanagement') {
                return (
                  <div key={item.path} className="relative home-management-dropdown">
                    <button
                      onClick={() => setIsHomeManagementOpen(!isHomeManagementOpen)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
                        location.pathname.includes('/admin/aboutaddmanage') || 
                        location.pathname.includes('/admin/herosectionaddmanage') || 
                        location.pathname.includes('/admin/servicesaddmanage') || 
                        location.pathname.includes('/admin/galleryaddandmanage') || 
                        location.pathname.includes('/admin/footeraddandmanage')
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${
                          location.pathname.includes('/admin/aboutaddmanage') || 
                          location.pathname.includes('/admin/herosectionaddmanage') || 
                          location.pathname.includes('/admin/servicesaddmanage') || 
                          location.pathname.includes('/admin/galleryaddandmanage') || 
                          location.pathname.includes('/admin/footeraddandmanage')
                            ? 'bg-white/20' 
                            : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                          {item.icon}
                        </div>
                        <span className="ml-3 font-medium truncate">{item.name}</span>
                      </div>
                      <FiChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${
                          isHomeManagementOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isHomeManagementOpen && (
                      <div className="ml-4 mt-2 space-y-1">
                        <NavLink
                          to="aboutaddmanage"
                          className={({ isActive }) =>
                            `flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                              isActive
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                          }
                          onClick={() => setIsHomeManagementOpen(false)}
                        >
                          <FiFileText size={16} className="mr-3" />
                          About Page
                        </NavLink>
                        <NavLink
                          to="herosectionaddmanage"
                          className={({ isActive }) =>
                            `flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                              isActive
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                          }
                          onClick={() => setIsHomeManagementOpen(false)}
                        >
                          <FiImage size={16} className="mr-3" />
                          Hero Section
                        </NavLink>
                        <NavLink
                          to="servicesaddmanage"
                          className={({ isActive }) =>
                            `flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                              isActive
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                          }
                          onClick={() => setIsHomeManagementOpen(false)}
                        >
                          <FiSettings size={16} className="mr-3" />
                          Services Page
                        </NavLink>
                        <NavLink
                          to="galleryaddandmanage"
                          className={({ isActive }) =>
                            `flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                              isActive
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                          }
                          onClick={() => setIsHomeManagementOpen(false)}
                        >
                          <FiCamera size={16} className="mr-3" />
                          Gallery
                        </NavLink>
                        <NavLink
                          to="footeraddandmanage"
                          className={({ isActive }) =>
                            `flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                              isActive
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                          }
                          onClick={() => setIsHomeManagementOpen(false)}
                        >
                          <FiFileText size={16} className="mr-3" />
                          Footer Management
                        </NavLink>
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <div className={`p-2 rounded-lg ${location.pathname === `/admin/${item.path}` ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                    {item.icon}
                  </div>
                  <span className="ml-3 font-medium truncate">{item.name}</span>
                  {location.pathname === `/admin/${item.path}` && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
          >
            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100">
              <FiLogOut size={20} />
            </div>
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        ></div>
      )}

      {/* Main Content */}
      <div className="transition-all duration-300 ease-in-out md:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-4 lg:p-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleSidebar} 
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <FiMenu size={24} />
              </button>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{currentPage}</h2>
                <p className="text-sm text-gray-600 hidden sm:block">Manage your PG operations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200">
                <FiBell size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Admin Profile */}
              {adminData && (
                <div className="flex items-center space-x-3">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold text-gray-900">{adminData.adminName}</p>
                    <p className="text-xs text-gray-500">{adminData.pgName}</p>
                  </div>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
                      {adminData.adminName?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[calc(100vh-200px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;