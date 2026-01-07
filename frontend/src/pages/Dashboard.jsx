
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.pg.gradezy.in/api';

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('pg_current_user') || 'null');
    setUser(u);
    if (u) fetchBookings(u.userId);
  }, []);

  const fetchBookings = async (userId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/bookings/user/${userId}`);
      if (res.data && res.data.data) setBookings(res.data.data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('pg_current_user');
    setUser(null);
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded shadow">
        <h3 className="text-xl font-semibold">Not logged in</h3>
        <p className="mt-2">Please login or register to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome, {user.name}</h2>
        <div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
        </div>
      </div>

      <section className="mb-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><strong>Name:</strong> {user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>User ID:</strong> {user.userId}</div>
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Booking History</h3>
        {loading ? <div>Loading bookings...</div> : (
          bookings.length === 0 ? <div>No bookings found.</div> :
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b._id || b.bookingId} className="p-3 border rounded">
                <div><strong>Building:</strong> {b.buildingName || b.buildingName}</div>
                <div><strong>Room:</strong> {b.roomId?.roomType || b.roomType || '-'}</div>
                <div><strong>Bed:</strong> {b.bedId || '-'}</div>
                <div><strong>Check-in:</strong> {new Date(b.checkInDate).toLocaleDateString()}</div>
                <div><strong>Check-out:</strong> {new Date(b.checkOutDate).toLocaleDateString()}</div>
                <div><strong>Amount:</strong> ₹{b.amount}</div>
                <div><strong>Status:</strong> {b.status} / {b.paymentStatus}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
