
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('pg_users') || '[]');
    const user = users.find(u => u.email === form.email && u.password === form.password);
    if (!user) {
      setMsg('Invalid credentials. Please register if you do not have an account.');
      return;
    }
    localStorage.setItem('pg_current_user', JSON.stringify(user));
    setMsg('Login successful. Redirecting...');
    setTimeout(() => navigate('/dashboard'), 800);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {msg && <div className="mb-3 text-sm">{msg}</div>}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded mb-3" required />
        <label className="block mb-2">Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
        <button className="w-full py-2 px-4 bg-blue-600 text-white rounded">Login</button>
      </form>
    </div>
  );
}

export default UserLogin;
