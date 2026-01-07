
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple client-side "registration" stored in localStorage
    const users = JSON.parse(localStorage.getItem('pg_users') || '[]');
    if (users.find(u => u.email === form.email)) {
      setMsg('An account with this email already exists. Please login.');
      return;
    }
    const newUser = {
      userId: `U${Date.now()}`,
      name: form.name,
      email: form.email,
      password: form.password // NOTE: stored plain for demo only — in production use backend hashing
    };
    users.push(newUser);
    localStorage.setItem('pg_users', JSON.stringify(users));
    // Set current user session
    localStorage.setItem('pg_current_user', JSON.stringify(newUser));
    setMsg('Registered successfully. Redirecting to dashboard...');
    setTimeout(() => navigate('/dashboard'), 1000);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>
      {msg && <div className="mb-3 text-sm">{msg}</div>}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded mb-3" required />
        <label className="block mb-2">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded mb-3" required />
        <label className="block mb-2">Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
        <button className="w-full py-2 px-4 bg-blue-600 text-white rounded">Register</button>
      </form>
    </div>
  );
}

export default UserRegister;
