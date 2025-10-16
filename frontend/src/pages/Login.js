// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', formData);
      // Save the token and user data to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.user.name);
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response.data.msg || 'Something went wrong');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        {error && <div className="message error">{error}</div>}
        <form onSubmit={onSubmit}>
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Enter your email"
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Enter your password"
          />
          <button type="submit" className="btn">Login</button>
        </form>
        <p className="auth-switch-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;