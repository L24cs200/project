// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- Make sure Link is imported

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
      
      {/* === THIS SECTION IS UPDATED === */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link to="/summarizer" className="btn" style={{ textDecoration: 'none', background: '#28a745' }}>
          Go to PDF Summarizer
        </Link>
        <button onClick={handleLogout} className="btn" style={{ background: '#dc3545' }}>
          Logout
        </button>
      </div>
      {/* === END OF UPDATE === */}
    </div>
  );
};

export default Dashboard;
