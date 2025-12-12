import axios from 'axios';
import BASE_URL from '../config';

// Create a centralized Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Automatically add the Token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Checks if user is logged in
    if (token) {
      config.headers['x-auth-token'] = token; // Attaches token to header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;