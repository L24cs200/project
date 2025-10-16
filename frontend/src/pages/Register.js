// src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('/api/auth/register', formData);
      setMessage(res.data.msg);
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response.data.msg || 'Something went wrong');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Register</h2>
        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}
        <form onSubmit={onSubmit}>
          <FormInput
            label="Name"
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="Enter your name"
          />
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
          <button type="submit" className="btn">Register</button>
        </form>
        <p className="auth-switch-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;