import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPG, setSelectedPG] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.pg.gradezy.in/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Fetching dashboard data...');
      const response = await axios.get(`${API_BASE_URL}/dashboard/stats`);
      
      if (response.data.success) {
        setDashboardData(response.data.data);
        console.log('✅ Dashboard data loaded:', response.data.data);
        console.log('💰 Total Revenue:', response.data.data.overall?.totalRevenue);
        console.log('📊 Overall Stats:', response.data.data.overall);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handlePGClick = (pg) => {
    setSelectedPG(pg);
  };

  const handleFloorClick = (buildingId, floorNumber) => {
    // Navigate to SetupBuilding with floor management tab
    navigate(`/admin/setupbuilding?buildingId=${buildingId}&tab=floors&floorNumber=${floorNumber}`);
  };

  const handleRoomClick = (buildingId) => {
    // Navigate to ManageRooms
    navigate(`/admin/managerooms?buildingId=${buildingId}`);
  };

  const handleBedClick = (buildingId) => {
    // Navigate to ManageRooms (beds are managed within rooms)
    navigate(`/admin/managerooms?buildingId=${buildingId}&tab=beds`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 80) return 'text-red-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-red-100';
    if (percentage >= 60) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage and monitor all your PG properties</p>
        </div>

        {/* Overall Statistics */}
        {dashboardData && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total PGs</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.overall.totalPGs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Floors</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.overall.totalFloors}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.overall.totalRooms}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Beds</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.overall.totalBeds}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bed Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Occupied Beds</p>
                    <p className="text-2xl font-bold text-green-600">{dashboardData.overall.totalOccupiedBeds}</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Beds</p>
                    <p className="text-2xl font-bold text-blue-600">{dashboardData.overall.totalAvailableBeds}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(dashboardData.overall.totalRevenue)}</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PG Properties */}
        {dashboardData && dashboardData.pgs.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">PG Properties</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dashboardData.pgs.map((pg) => (
                <div
                  key={pg.buildingId}
                  className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedPG?.buildingId === pg.buildingId ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handlePGClick(pg)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{pg.buildingName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(pg.occupancyPercentage)} ${getStatusColor(pg.occupancyPercentage)}`}>
                      {pg.occupancyPercentage}% Occupied
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{pg.address}</p>

                  {/* PG Statistics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div
                      className="bg-blue-50 p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFloorClick(pg.buildingId, 1);
                      }}
                    >
                      <p className="text-sm font-medium text-blue-600">Floors</p>
                      <p className="text-xl font-bold text-blue-900">{pg.totalFloors}</p>
                      <p className="text-xs text-blue-500">Click to manage</p>
                    </div>

                    <div
                      className="bg-purple-50 p-3 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoomClick(pg.buildingId);
                      }}
                    >
                      <p className="text-sm font-medium text-purple-600">Rooms</p>
                      <p className="text-xl font-bold text-purple-900">{pg.totalRooms}</p>
                      <p className="text-xs text-purple-500">Click to manage</p>
                    </div>

                    <div
                      className="bg-yellow-50 p-3 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBedClick(pg.buildingId);
                      }}
                    >
                      <p className="text-sm font-medium text-yellow-600">Total Beds</p>
                      <p className="text-xl font-bold text-yellow-900">{pg.totalBeds}</p>
                      <p className="text-xs text-yellow-500">Click to manage</p>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-600">Available</p>
                      <p className="text-xl font-bold text-green-900">{pg.availableBeds}</p>
                      <p className="text-xs text-green-500">Ready to book</p>
                    </div>
                  </div>

                  {/* Bed Status */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Bed Status</span>
                      <span>{pg.occupiedBeds} occupied / {pg.totalBeds} total</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(pg.occupiedBeds / pg.totalBeds) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Revenue */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(pg.totalRevenue)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Active Bookings</p>
                      <p className="text-lg font-semibold text-blue-600">{pg.activeBookings}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No PGs Message */}
        {dashboardData && dashboardData.pgs.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No PG properties found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first PG property.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/admin/setupbuilding')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add PG Property
              </button>
            </div>
          </div>
        )}

        {/* Selected PG Details */}
        {selectedPG && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedPG.buildingName} - Detailed View
            </h2>
            
            {/* Floor Details */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Floor Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedPG.floorStats.map((floor) => (
                  <div
                    key={floor.floorNumber}
                    className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleFloorClick(selectedPG.buildingId, floor.floorNumber)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Floor {floor.floorNumber}</h4>
                      <span className="text-sm text-blue-600">Click to manage</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Rooms</p>
                        <p className="font-semibold text-gray-900">{floor.totalRooms}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Beds</p>
                        <p className="font-semibold text-gray-900">{floor.totalBeds}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Occupied</p>
                        <p className="font-semibold text-green-600">{floor.occupiedBeds}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Available</p>
                        <p className="font-semibold text-blue-600">{floor.availableBeds}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Floor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Beds
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedPG.roomStats.map((room) => (
                      <tr key={room.roomId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {room.roomId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {room.roomType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {room.floorNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {room.occupiedBeds}/{room.totalBeds}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{room.rate} ({room.rateType})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            room.availableBeds > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {room.availableBeds > 0 ? 'Available' : 'Full'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
