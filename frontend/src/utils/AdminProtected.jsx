import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminProtected = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('adminData');

      if (!token || !adminData) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/adminlogin" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtected;
