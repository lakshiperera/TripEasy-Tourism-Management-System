import axios from 'axios';

/**
 * Axios instance configured for TripEasy API
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tripeasy_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem('tripeasy_token');
    // Preserve hardcoded offline admin session even if API is unreachable or fails
    if (token === 'tripeasy_hardcoded_admin_jwt_token') {
      return Promise.reject(error);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('tripeasy_token');
      localStorage.removeItem('tripeasy_admin');
      // Redirect to login if on admin page
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
