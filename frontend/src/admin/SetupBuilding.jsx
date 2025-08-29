import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SetupBuilding() {
  const [activeTab, setActiveTab] = useState('add');
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [buildingForm, setBuildingForm] = useState({
    name: '',
    address: '',
    floors: ''
  });

  const [floorForm, setFloorForm] = useState({
    buildingId: '',
    floorNumber: '',
    totalRooms: ''
  });

  const [editingBuilding, setEditingBuilding] = useState(null);
  const [editingFloor, setEditingFloor] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const API_BASE_URL = 'http://localhost:5001/api';

  useEffect(() => {
    fetchBuildings();
    fetchFloors();
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/buildings/all`);
      setBuildings(response.data.data);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      setMessage('Error fetching buildings');
    } finally {
      setLoading(false);
    }
  };

  const fetchFloors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/floors/all`);
      setFloors(response.data.data);
    } catch (error) {
      console.error('Error fetching floors:', error);
    }
  };

  const handleBuildingSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/buildings/add`, buildingForm);
      setMessage('Building added successfully!');
      setBuildingForm({ name: '', address: '', floors: '' });
      fetchBuildings();
      fetchFloors();
    } catch (error) {
      console.error('Error adding building:', error);
      setMessage('Error adding building');
    } finally {
      setLoading(false);
    }
  };

  const handleFloorSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validate required fields
      if (!floorForm.buildingId) {
        setMessage('Please select a building');
        return;
      }
      if (!floorForm.floorNumber) {
        setMessage('Please select a floor number');
        return;
      }
      if (!floorForm.totalRooms || parseInt(floorForm.totalRooms) <= 0) {
        setMessage('Please enter a valid number of rooms');
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/floors/add`, floorForm);
      setMessage('Floor added successfully!');
      setFloorForm({ buildingId: '', floorNumber: '', totalRooms: '' });
      setSelectedBuilding(null);
      fetchFloors();
    } catch (error) {
      console.error('Error adding floor:', error);
      setMessage('Error adding floor: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditBuilding = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`${API_BASE_URL}/buildings/${editingBuilding._id}`, buildingForm);
      setMessage('Building updated successfully!');
      setEditingBuilding(null);
      setBuildingForm({ name: '', address: '', floors: '' });
      fetchBuildings();
    } catch (error) {
      console.error('Error updating building:', error);
      setMessage('Error updating building');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFloor = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`${API_BASE_URL}/floors/${editingFloor._id}`, floorForm);
      setMessage('Floor updated successfully!');
      setEditingFloor(null);
      setFloorForm({ buildingId: '', floorNumber: '', totalRooms: '' });
      setSelectedBuilding(null);
      fetchFloors();
    } catch (error) {
      console.error('Error updating floor:', error);
      setMessage('Error updating floor');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBuilding = async (buildingId) => {
    if (window.confirm('Are you sure you want to delete this building?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/buildings/${buildingId}`);
        setMessage('Building deleted successfully!');
        fetchBuildings();
        fetchFloors();
      } catch (error) {
        console.error('Error deleting building:', error);
        setMessage('Error deleting building');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteFloor = async (floorId) => {
    if (window.confirm('Are you sure you want to delete this floor?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/floors/${floorId}`);
        setMessage('Floor deleted successfully!');
        fetchFloors();
      } catch (error) {
        console.error('Error deleting floor:', error);
        setMessage('Error deleting floor: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const startEdit = (building) => {
    setEditingBuilding(building);
    setBuildingForm({
      name: building.name,
      address: building.address,
      floors: building.floors
    });
    setActiveTab('add');
  };

  const startEditFloor = (floor) => {
    setEditingFloor(floor);
    setFloorForm({
      buildingId: floor.buildingId,
      floorNumber: floor.floorNumber,
      totalRooms: floor.totalRooms
    });
    setSelectedBuilding(buildings.find(b => b._id === floor.buildingId));
    setActiveTab('floors');
  };

  const cancelEdit = () => {
    setEditingBuilding(null);
    setBuildingForm({ name: '', address: '', floors: '' });
  };

  const cancelEditFloor = () => {
    setEditingFloor(null);
    setFloorForm({ buildingId: '', floorNumber: '', totalRooms: '' });
    setSelectedBuilding(null);
  };

  const handleBuildingChange = (buildingId) => {
    setFloorForm({ ...floorForm, buildingId, floorNumber: '' });
    setSelectedBuilding(buildings.find(b => b._id === buildingId));
  };

  // Generate floor number options based on building floors
  const getFloorNumberOptions = () => {
    if (!selectedBuilding) return [];
    
    const existingFloorNumbers = floors
      .filter(f => f.buildingId === selectedBuilding._id && f._id !== editingFloor?._id)
      .map(f => f.floorNumber);
    
    const options = [];
    for (let i = 1; i <= selectedBuilding.floors; i++) {
      if (!existingFloorNumbers.includes(i)) {
        options.push(i);
      }
    }
    return options;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Building Setup</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'add' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('add')}
        >
          Add Building
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'manage' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Buildings
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'floors' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('floors')}
        >
          Add Floor
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'manageFloors' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('manageFloors')}
        >
          Manage Floors
        </button>
      </div>

      {/* Add Building Tab */}
      {activeTab === 'add' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingBuilding ? 'Edit Building' : 'Add New Building'}
          </h2>
          <form onSubmit={editingBuilding ? handleEditBuilding : handleBuildingSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building Name
                </label>
                <input
                  type="text"
                  value={buildingForm.name}
                  onChange={(e) => setBuildingForm({...buildingForm, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Floors
                </label>
                <input
                  type="number"
                  value={buildingForm.floors}
                  onChange={(e) => setBuildingForm({...buildingForm, floors: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={buildingForm.address}
                onChange={(e) => setBuildingForm({...buildingForm, address: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>
            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingBuilding ? 'Update Building' : 'Add Building')}
              </button>
              {editingBuilding && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Manage Buildings Tab */}
      {activeTab === 'manage' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Manage Buildings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Building ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {buildings.map((building) => (
                  <tr key={building._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {building.buildingId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {building.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {building.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {building.floors}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => startEdit(building)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBuilding(building._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Floor Tab */}
      {activeTab === 'floors' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingFloor ? 'Edit Floor' : 'Add New Floor'}
          </h2>
          <form onSubmit={editingFloor ? handleEditFloor : handleFloorSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Building
                </label>
                <select
                  value={floorForm.buildingId}
                  onChange={(e) => handleBuildingChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Building</option>
                  {buildings.map((building) => (
                    <option key={building._id} value={building._id}>
                      {building.name} ({building.floors} floors)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor Number
                </label>
                <select
                  value={floorForm.floorNumber}
                  onChange={(e) => setFloorForm({...floorForm, floorNumber: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!selectedBuilding}
                >
                  <option value="">Select Floor Number</option>
                  {getFloorNumberOptions().map((floorNum) => (
                    <option key={floorNum} value={floorNum}>
                      Floor {floorNum}
                    </option>
                  ))}
                </select>
                {selectedBuilding && getFloorNumberOptions().length === 0 && (
                  <p className="text-sm text-red-600 mt-1">All floors for this building have been created</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Rooms
                </label>
                <input
                  type="number"
                  value={floorForm.totalRooms}
                  onChange={(e) => setFloorForm({...floorForm, totalRooms: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                disabled={loading || !selectedBuilding || getFloorNumberOptions().length === 0}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingFloor ? 'Update Floor' : 'Add Floor')}
              </button>
              {editingFloor && (
                <button
                  type="button"
                  onClick={cancelEditFloor}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Manage Floors Tab */}
      {activeTab === 'manageFloors' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Manage Floors</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floor No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Building Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. of Rooms
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {floors.map((floor) => (
                  <tr key={floor._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {floor.floorNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {floor.buildingName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {floor.totalRooms}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => startEditFloor(floor)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFloor(floor._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default SetupBuilding;
