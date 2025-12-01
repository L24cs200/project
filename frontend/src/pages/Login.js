import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.user.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid credentials. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:block relative w-1/2 bg-slate-800">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://placehold.co/1200x1200/1e293b/ffffff?text=.')" }}></div>
        <div className="relative flex flex-col items-center justify-center h-full text-white p-12 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome Back to RvrEdu</h1>
          <p className="text-xl text-slate-300">Unlock insights from your documents with the power of AI.</p>
          
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">Sign In</h2>
          <p className="text-slate-500 text-center mb-8">Enter your credentials to access your account.</p>
          
          {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">{error}</div>}
          
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all"
            >
              {isLoading ? <div className="spinner h-5 w-5 border-2 border-t-transparent rounded-full"></div> : <FiLogIn />}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account? <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
