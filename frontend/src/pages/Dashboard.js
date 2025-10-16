// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    if (!token) {
      // If no token, redirect to login page
      navigate('/login');
    } else {
      setUserName(name);
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear localStorage and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Dashboard</h2>
      {userName && <h3>Welcome, {userName}!</h3>}
      <p>You have successfully logged in.</p>
      <button onClick={handleLogout} className="btn" style={{ maxWidth: '200px' }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;