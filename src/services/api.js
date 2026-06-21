// src/services/api.js
import axios from 'axios';

// ✅ Make sure API_BASE includes /api
const API_BASE = import.meta.env.VITE_API_URL || 'https://ems.bishwasghimire.com.np/api';

console.log('🚀 API Base URL:', API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 API Request:', config.method.toUpperCase(), config.url);
  } catch (e) {
    // ignore
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    } else if (error.request) {
      console.error('❌ No Response from Server');
    }
    return Promise.reject(error);
  }
);

function unwrapError(err) {
  if (err?.response?.data) return err.response.data;
  return { message: err.message || 'Unknown error' };
}

export const auth = {
  signIn: async (credentials) => {
    try {
      console.log('📤 Sign in request for:', credentials.email);
      // ✅ This will call: https://ems.bishwasghimire.com.np/api/authentication/sign-in
      const res = await api.post('/authentication/sign-in', credentials);
      console.log('📥 Sign in response:', res.data);
      
      const token = res.data.accessToken || res.data.access_token || res.data.token;
      if (token) {
        localStorage.setItem('access_token', token);
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      }
      return res.data;
    } catch (err) {
      console.error('Sign in error:', err);
      throw unwrapError(err);
    }
  },

  signUp: async (userData) => {
    try {
      const res = await api.post('/authentication/sign-up', userData);
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/authentication/logout', { refreshToken });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  },

  getProfile: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw { message: 'No access token' };
      
      // Decode JWT to get user info
      const payload = decodeJwt(token);
      return payload;
    } catch (err) {
      throw unwrapError(err);
    }
  },
};

// JWT decode helper
function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

export default api;