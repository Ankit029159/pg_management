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
  const [buildingNameFilter, setBuildingNameFilter] = useState('');
  const [buildingDropdownFilter, setBuildingDropdownFilter] = useState('');
  const [floorBuildingFilter, setFloorBuildingFilter] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.pg.gradezy.in/api';

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

  // Filter buildings by name and dropdown
  const getFilteredBuildings = () => {
    let filtered = buildings;
    
    // Apply text filter
    if (buildingNameFilter.trim()) {
      filtered = filtered.filter(building => 
        building.name.toLowerCase().includes(buildingNameFilter.toLowerCase())
      );
    }
    
    // Apply dropdown filter
    if (buildingDropdownFilter) {
      filtered = filtered.filter(building => 
        building._id === buildingDropdownFilter
      );
    }
    
    return filtered;
  };

  // Filter floors by building
  const getFilteredFloors = () => {
    let filtered = floors;
    
    // Apply building filter
    if (floorBuildingFilter) {
      filtered = filtered.filter(floor => 
        floor.buildingName === floorBuildingFilter
      );
    }
    
    return filtered;
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
      const errorMessage = error.response?.data?.message || 'Error adding building';
      setMessage(`Error: ${errorMessage}`);
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
      const errorMessage = error.response?.data?.message || 'Error updating building';
      setMessage(`Error: ${errorMessage}`);
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
        const errorMessage = error.response?.data?.message || 'Error deleting building';
        setMessage(`Error: ${errorMessage}`);
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
      const errorMessage = error.response?.data?.message || 'Error updating floor';
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
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

  const cancelEdit = () => {
    setEditingBuilding(null);
    setBuildingForm({ name: '', address: '', floors: '' });
  };

  const startEditFloor = (floor) => {
    console.log('Editing floor:', floor); // Debug log
    console.log('Available buildings:', buildings); // Debug log
    
    // Try to find the building by name first (since we have buildingName in the table)
    let selectedBuilding = buildings.find(b => b.name === floor.buildingName);
    
    // If found by name, use its ID
    const buildingId = selectedBuilding ? selectedBuilding._id : '';
    
    console.log('Found building by name:', selectedBuilding);
    console.log('Using buildingId:', buildingId);
    
    setEditingFloor(floor);
    setFloorForm({
      buildingId: buildingId,
      floorNumber: floor.floorNumber,
      totalRooms: floor.totalRooms
    });
    
    setSelectedBuilding(selectedBuilding);
    setActiveTab('manageFloors');
  };

  const cancelEditFloor = () => {
    setEditingFloor(null);
    setFloorForm({ buildingId: '', floorNumber: '', totalRooms: '' });
    setSelectedBuilding(null);
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
          
          {/* Filter Section */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Building Name (Text)
                </label>
                <input
                  type="text"
                  placeholder="Enter building name to filter..."
                  value={buildingNameFilter}
                  onChange={(e) => setBuildingNameFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Building (Dropdown)
                </label>
                <select
                  value={buildingDropdownFilter}
                  onChange={(e) => setBuildingDropdownFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Buildings</option>
                  {buildings.map((building) => (
                    <option key={building._id} value={building._id}>
                      {building.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setBuildingNameFilter('');
                  setBuildingDropdownFilter('');
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
            
            {/* Filter Summary */}
            {(buildingNameFilter.trim() || buildingDropdownFilter) && (
              <div className="mt-3 text-sm text-gray-600">
                Showing {getFilteredBuildings().length} of {buildings.length} buildings
                {buildingNameFilter.trim() && ` matching "${buildingNameFilter}"`}
                {buildingDropdownFilter && buildingNameFilter.trim() && ' and '}
                {buildingDropdownFilter && ` from selected building`}
              </div>
            )}
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
                {getFilteredBuildings().map((building) => (
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



      {/* Manage Floors Tab */}
      {activeTab === 'manageFloors' && (
        <div>

          {/* Floor Filter */}
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Building
                </label>
                <select
                  value={floorBuildingFilter}
                  onChange={(e) => setFloorBuildingFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Buildings</option>
                  {buildings.map((building) => (
                    <option key={building._id} value={building.name}>
                      {building.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFloorBuildingFilter('')}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          </div>

          {/* Floors Table */}
           <div className="bg-white rounded-lg shadow overflow-hidden">
             <div className="px-6 py-4 border-b">
               <div className="flex justify-between items-center">
                 <h2 className="text-xl font-semibold">Manage Floors</h2>
                 <div className="text-sm text-gray-600">
                   Showing {getFilteredFloors().length} of {floors.length} floors
                   {floorBuildingFilter && (
                     <span className="ml-2 text-blue-600">
                       (Filtered by: {floorBuildingFilter})
                     </span>
                   )}
                 </div>
               </div>
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
                   {getFilteredFloors().length === 0 ? (
                     <tr>
                       <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                         {floorBuildingFilter ? 
                           `No floors found for building "${floorBuildingFilter}"` : 
                           'No floors found'
                         }
                       </td>
                     </tr>
                   ) : (
                     getFilteredFloors().map((floor) => (
                     <React.Fragment key={floor._id}>
                       {/* Normal row */}
                       {editingFloor?._id !== floor._id && (
                         <tr>
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
                       )}
                       
                       {/* Edit row */}
                       {editingFloor?._id === floor._id && (
                         <tr className="bg-blue-50">
                           <td colSpan="4" className="px-6 py-4">
                             <div className="bg-white p-4 rounded-lg border border-blue-200">
                               <h4 className="text-lg font-semibold mb-4 text-blue-800">Edit Floor</h4>
                               <form onSubmit={handleEditFloor}>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                   <div>
                                     <label className="block text-sm font-medium text-gray-700 mb-2">
                                       Building
                                     </label>
                                     <select
                                       value={floorForm.buildingId || ''}
                                       onChange={(e) => {
                                         const buildingId = e.target.value;
                                         setFloorForm({ ...floorForm, buildingId });
                                         setSelectedBuilding(buildings.find(b => b._id === buildingId));
                                       }}
                                       className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       required
                                     >
                                       <option value="">Select Building</option>
                                       {buildings.map((building) => (
                                         <option key={building._id} value={building._id}>
                                           {building.name}
                                         </option>
                                       ))}
                                     </select>
                                   </div>
                                   <div>
                                     <label className="block text-sm font-medium text-gray-700 mb-2">
                                       Floor Number
                                     </label>
                                     <input
                                       type="number"
                                       value={floorForm.floorNumber}
                                       onChange={(e) => setFloorForm({...floorForm, floorNumber: e.target.value})}
                                       className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       min="1"
                                       required
                                     />
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
                                 <div className="mt-4 flex gap-4">
                                   <button
                                     type="submit"
                                     disabled={loading}
                                     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                                   >
                                     {loading ? 'Updating...' : 'Update Floor'}
                                   </button>
                                   <button
                                     type="button"
                                     onClick={() => {
                                       setEditingFloor(null);
                                       setFloorForm({ buildingId: '', floorNumber: '', totalRooms: '' });
                                       setSelectedBuilding(null);
                                     }}
                                     className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                   >
                                     Cancel
                                   </button>
                                 </div>
                               </form>
                             </div>
                           </td>
                         </tr>
                       )}
                     </React.Fragment>
                   ))
                   )}
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}

export default SetupBuilding;
