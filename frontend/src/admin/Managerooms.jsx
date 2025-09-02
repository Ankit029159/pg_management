import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Managerooms() {
  const [activeTab, setActiveTab] = useState('add');
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [roomForm, setRoomForm] = useState({
    buildingId: '',
    floorId: '',
    roomNumber: '',
    roomId: '',
    roomType: 'Bedroom',
    bedroomBeds: '',
    hallBeds: '',
    bedroomRate: '',
    hallRate: ''
  });

  const [bedForm, setBedForm] = useState({
    roomId: '',
    bedId: '',
    status: 'Available',
    price: '',
    userName: ''
  });

  const [editingRoom, setEditingRoom] = useState(null);
  const [editingBed, setEditingBed] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [bedBuildingFilter, setBedBuildingFilter] = useState('');

  const API_BASE_URL = 'https://api.pg.gradezy.in/api';

  useEffect(() => {
    fetchRooms();
    fetchBeds();
    fetchBuildings();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/rooms/all`);
      setRooms(response.data.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setMessage('Error fetching rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchBeds = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/beds/all`);
      setBeds(response.data.data);
    } catch (error) {
      console.error('Error fetching beds:', error);
    }
  };

  const fetchBuildings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/buildings/all`);
      setBuildings(response.data.data);
    } catch (error) {
      console.error('Error fetching buildings:', error);
    }
  };

  const fetchFloorsByBuilding = async (buildingId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/floors/building/${buildingId}`);
      setFloors(response.data.data);
    } catch (error) {
      console.error('Error fetching floors:', error);
    }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validate required fields
      if (!roomForm.buildingId || !roomForm.floorId) {
        setMessage('Please select building and floor');
        return;
      }

      const totalBeds = roomForm.roomType === 'Bedroom' ? parseInt(roomForm.bedroomBeds) : parseInt(roomForm.hallBeds);
      const rate = roomForm.roomType === 'Bedroom' ? parseInt(roomForm.bedroomRate) : parseInt(roomForm.hallRate);

      if (!totalBeds || totalBeds <= 0) {
        setMessage(`Please enter number of beds for ${roomForm.roomType}`);
        return;
      }

      if (!rate || rate <= 0) {
        setMessage(`Please enter rate for ${roomForm.roomType}`);
        return;
      }
      
      // Prepare room data based on type
      const roomData = {
        buildingId: roomForm.buildingId,
        floorId: roomForm.floorId,
        roomType: roomForm.roomType,
        totalBeds: totalBeds,
        rate: rate,
        rateType: 'per_bed'
      };

      // Only send roomId if it's a custom ID (not the same as roomNumber)
      if (roomForm.roomId && roomForm.roomId !== roomForm.roomNumber) {
        roomData.roomId = roomForm.roomId;
      }

      console.log('Sending room data:', roomData); // Debug log

      const response = await axios.post(`${API_BASE_URL}/rooms/add`, roomData);
      setMessage('Room added successfully!');
      setRoomForm({
        buildingId: '',
        floorId: '',
        roomNumber: '',
        roomId: '',
        roomType: 'Bedroom',
        bedroomBeds: '',
        hallBeds: '',
        bedroomRate: '',
        hallRate: ''
      });
      setSelectedBuilding(null);
      setSelectedFloor(null);
      fetchRooms();
      fetchBeds();
    } catch (error) {
      console.error('Error adding room:', error);
      setMessage('Error adding room: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validate required fields
      if (!roomForm.buildingId || !roomForm.floorId) {
        setMessage('Please select building and floor');
        return;
      }

      const totalBeds = roomForm.roomType === 'Bedroom' ? parseInt(roomForm.bedroomBeds) : parseInt(roomForm.hallBeds);
      const rate = roomForm.roomType === 'Bedroom' ? parseInt(roomForm.bedroomRate) : parseInt(roomForm.hallRate);

      if (!totalBeds || totalBeds <= 0) {
        setMessage(`Please enter number of beds for ${roomForm.roomType}`);
        return;
      }

      if (!rate || rate <= 0) {
        setMessage(`Please enter rate for ${roomForm.roomType}`);
        return;
      }
      
      const roomData = {
        buildingId: roomForm.buildingId,
        floorId: roomForm.floorId,
        roomType: roomForm.roomType,
        totalBeds: totalBeds,
        rate: rate,
        rateType: 'per_bed'
      };

      // Only send roomId if it's a custom ID (not the same as roomNumber)
      if (roomForm.roomId && roomForm.roomId !== roomForm.roomNumber) {
        roomData.roomId = roomForm.roomId;
      }

      await axios.put(`${API_BASE_URL}/rooms/${editingRoom._id}`, roomData);
      setMessage('Room updated successfully!');
      setEditingRoom(null);
      setRoomForm({
        buildingId: '',
        floorId: '',
        roomNumber: '',
        roomId: '',
        roomType: 'Bedroom',
        bedroomBeds: '',
        hallBeds: '',
        bedroomRate: '',
        hallRate: ''
      });
      setSelectedBuilding(null);
      setSelectedFloor(null);
      fetchRooms();
      fetchBeds();
    } catch (error) {
      console.error('Error updating room:', error);
      setMessage('Error updating room');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBed = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Check if bed ID already exists (excluding current bed)
      const existingBed = beds.find(b => 
        b.bedId === bedForm.bedId && 
        b._id !== editingBed._id
      );
      if (existingBed) {
        setMessage('Bed ID already exists');
        return;
      }

      // Prepare bed data - keep the original roomId from the bed
      const bedData = {
        bedId: bedForm.bedId,
        status: bedForm.status,
        price: bedForm.price,
        userName: bedForm.status === 'Occupied' ? bedForm.userName : null
      };

      await axios.put(`${API_BASE_URL}/beds/${editingBed._id}`, bedData);
      setMessage('Bed updated successfully!');
      setEditingBed(null);
      setBedForm({
        roomId: '',
        bedId: '',
        status: 'Available',
        price: '',
        userName: ''
      });
      fetchBeds();
    } catch (error) {
      console.error('Error updating bed:', error);
      setMessage('Error updating bed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/rooms/${roomId}`);
        setMessage('Room deleted successfully!');
        fetchRooms();
        fetchBeds();
      } catch (error) {
        console.error('Error deleting room:', error);
        setMessage('Error deleting room');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteBed = async (bedId) => {
    if (window.confirm('Are you sure you want to delete this bed?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/beds/${bedId}`);
        setMessage('Bed deleted successfully!');
        fetchBeds();
      } catch (error) {
        console.error('Error deleting bed:', error);
        setMessage('Error deleting bed');
      } finally {
        setLoading(false);
      }
    }
  };

  const startEdit = (room) => {
    setEditingRoom(room);
    setRoomForm({
      buildingId: room.buildingId,
      floorId: room.floorId,
      roomNumber: room.roomId,
      roomId: room.roomId,
      roomType: room.roomType,
      bedroomBeds: room.roomType === 'Bedroom' ? room.totalBeds : '',
      hallBeds: room.roomType === 'Hall' ? room.totalBeds : '',
      bedroomRate: room.roomType === 'Bedroom' ? room.rate : '',
      hallRate: room.roomType === 'Hall' ? room.rate : ''
    });
    setSelectedBuilding(buildings.find(b => b._id === room.buildingId));
    fetchFloorsByBuilding(room.buildingId);
    setSelectedFloor(floors.find(f => f._id === room.floorId));
    setActiveTab('add');
  };

  const startEditBed = (bed) => {
    setEditingBed(bed);
    setBedForm({
      roomId: bed.roomNumber, // Use roomNumber instead of roomId for display
      bedId: bed.bedId,
      status: bed.status,
      price: bed.price,
      userName: bed.userName || ''
    });
    setActiveTab('manageBeds');
  };

  const cancelEdit = () => {
    setEditingRoom(null);
    setRoomForm({
      buildingId: '',
      floorId: '',
      roomNumber: '',
      roomId: '',
      roomType: 'Bedroom',
      bedroomBeds: '',
      hallBeds: '',
      bedroomRate: '',
      hallRate: ''
    });
    setSelectedBuilding(null);
    setSelectedFloor(null);
  };

  const cancelEditBed = () => {
    setEditingBed(null);
    setBedForm({
      roomId: '',
      bedId: '',
      status: 'Available',
      price: '',
      userName: ''
    });
  };

  const handleBuildingChange = (buildingId) => {
    setRoomForm({ 
      ...roomForm, 
      buildingId, 
      floorId: '', 
      roomNumber: '',
      roomId: '' 
    });
    setSelectedBuilding(buildings.find(b => b._id === buildingId));
    setSelectedFloor(null);
    if (buildingId) {
      fetchFloorsByBuilding(buildingId);
    } else {
      setFloors([]);
    }
  };

  const handleFloorChange = (floorId) => {
    setRoomForm({ 
      ...roomForm, 
      floorId, 
      roomNumber: '',
      roomId: '' 
    });
    setSelectedFloor(floors.find(f => f._id === floorId));
  };

  const handleRoomNumberChange = (roomNumber) => {
    setRoomForm({ 
      ...roomForm, 
      roomNumber
      // Don't automatically set roomId to roomNumber - let user set custom ID if needed
    });
  };

  // Generate room number options based on floor total rooms
  const getRoomNumberOptions = () => {
    if (!selectedFloor) return [];
    
    const existingRoomNumbers = rooms
      .filter(r => r.floorId === selectedFloor._id)
      .map(r => r.roomId);
    
    const options = [];
    for (let i = 1; i <= selectedFloor.totalRooms; i++) {
      const roomNum = `${selectedFloor.floorNumber}${String(i).padStart(2, '0')}`;
      if (!existingRoomNumbers.includes(roomNum)) {
        options.push(roomNum);
      }
    }
    return options;
  };

  // Filter beds by building
  const getFilteredBeds = () => {
    if (!bedBuildingFilter) return beds;
    return beds.filter(bed => 
      bed.roomId?.buildingName === bedBuildingFilter
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Room Management</h1>
      
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
          Add Room
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'manage' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Rooms
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'manageBeds' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('manageBeds')}
        >
          Manage Beds
        </button>
      </div>

      {/* Add Room Tab */}
      {activeTab === 'add' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingRoom ? 'Edit Room' : 'Add New Room'}
          </h2>
          <form onSubmit={editingRoom ? handleEditRoom : handleRoomSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Building
                </label>
                <select
                  value={roomForm.buildingId}
                  onChange={(e) => handleBuildingChange(e.target.value)}
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
                  Select Floor
                </label>
                <select
                  value={roomForm.floorId}
                  onChange={(e) => handleFloorChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!roomForm.buildingId}
                >
                  <option value="">Select Floor</option>
                  {floors.map((floor) => (
                    <option key={floor._id} value={floor._id}>
                      Floor {floor.floorNumber} ({floor.totalRooms} rooms)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Number
                </label>
                <select
                  value={roomForm.roomNumber}
                  onChange={(e) => handleRoomNumberChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!selectedFloor}
                >
                  <option value="">Select Room Number</option>
                  {getRoomNumberOptions().map((roomNum) => (
                    <option key={roomNum} value={roomNum}>
                      {roomNum}
                    </option>
                  ))}
                </select>
                {selectedFloor && getRoomNumberOptions().length === 0 && (
                  <p className="text-sm text-red-600 mt-1">All rooms for this floor have been created</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Room ID (Optional)
                </label>
                <input
                  type="text"
                  value={roomForm.roomId}
                  onChange={(e) => setRoomForm({...roomForm, roomId: e.target.value})}
                  placeholder="e.g., 101, 102, A1, B2"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use room number as ID</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type
                </label>
                <select
                  value={roomForm.roomType}
                  onChange={(e) => setRoomForm({...roomForm, roomType: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Bedroom">Bedroom</option>
                  <option value="Hall">Hall</option>
                </select>
              </div>
              {roomForm.roomType === 'Bedroom' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Beds (Bedroom)
                    </label>
                    <input
                      type="number"
                      value={roomForm.bedroomBeds}
                      onChange={(e) => setRoomForm({...roomForm, bedroomBeds: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate per Bed (Bedroom)
                    </label>
                    <input
                      type="number"
                      value={roomForm.bedroomRate}
                      onChange={(e) => setRoomForm({...roomForm, bedroomRate: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Beds (Hall)
                    </label>
                    <input
                      type="number"
                      value={roomForm.hallBeds}
                      onChange={(e) => setRoomForm({...roomForm, hallBeds: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate per Bed (Hall)
                    </label>
                    <input
                      type="number"
                      value={roomForm.hallRate}
                      onChange={(e) => setRoomForm({...roomForm, hallRate: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      required
                    />
                  </div>
                </>
              )}
            </div>
            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                disabled={loading || !selectedFloor || getRoomNumberOptions().length === 0}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingRoom ? 'Update Room' : 'Add Room')}
              </button>
              {editingRoom && (
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

      {/* Manage Rooms Tab */}
      {activeTab === 'manage' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Manage Rooms</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Building
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Beds
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available Beds
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {room.roomId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {room.buildingName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {room.floorNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {room.roomType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {room.totalBeds}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{room.rate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {room.availableBeds}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => startEdit(room)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
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

      {/* Manage Beds Tab */}
      {activeTab === 'manageBeds' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Beds</h2>
              
              {/* Building Filter */}
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">Filter by Building:</label>
                <select
                  value={bedBuildingFilter}
                  onChange={(e) => setBedBuildingFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Buildings</option>
                  {buildings.map((building) => (
                    <option key={building._id} value={building.name}>
                      {building.name}
                    </option>
                  ))}
                </select>
                {bedBuildingFilter && (
                  <button
                    onClick={() => setBedBuildingFilter('')}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
            
            {/* Filter Summary */}
            <div className="px-6 py-3 border-b border-gray-200">
              {bedBuildingFilter ? (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-700">
                    Showing {getFilteredBeds().length} bed(s) from <span className="font-semibold">{bedBuildingFilter}</span> building
                    <span className="ml-2 text-blue-600">({beds.length} total beds)</span>
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <p className="text-sm text-gray-700">
                    Showing all <span className="font-semibold">{beds.length}</span> bed(s) from all buildings
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Edit Bed Form */}
          {editingBed && (
            <div className="p-6 border-b bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Edit Bed</h3>
              <form onSubmit={handleEditBed}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room ID
                    </label>
                    <input
                      type="text"
                      value={bedForm.roomId}
                      onChange={(e) => setBedForm({...bedForm, roomId: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bed ID
                    </label>
                    <input
                      type="text"
                      value={bedForm.bedId}
                      onChange={(e) => setBedForm({...bedForm, bedId: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={bedForm.status}
                      onChange={(e) => setBedForm({...bedForm, status: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      value={bedForm.price}
                      onChange={(e) => setBedForm({...bedForm, price: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Name
                    </label>
                    <input
                      type="text"
                      value={bedForm.userName}
                      onChange={(e) => setBedForm({...bedForm, userName: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., John Doe"
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Bed'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditBed}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bed ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Building Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredBeds().length > 0 ? (
                    getFilteredBeds().map((bed) => (
                      <tr key={bed._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {bed.bedId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {bed.roomId?.buildingName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                          {bed.roomId?.floorNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bed.roomNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            bed.status === 'Available' ? 'bg-green-100 text-green-800' :
                            bed.status === 'Occupied' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {bed.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{bed.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bed.userName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => startEditBed(bed)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBed(bed._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        {bedBuildingFilter ? (
                          <div>
                            <p className="text-lg font-medium text-gray-700 mb-2">No beds found</p>
                            <p className="text-sm text-gray-500">
                              No beds found in <span className="font-semibold">{bedBuildingFilter}</span> building
                            </p>
                            <button
                              onClick={() => setBedBuildingFilter('')}
                              className="mt-3 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              View All Beds
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-lg font-medium text-gray-700 mb-2">No beds available</p>
                            <p className="text-sm text-gray-500">No beds have been added yet</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}

              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Managerooms;
