// src/services/api.js
import axios from 'axios';

// ✅ FIX: Add /api to the base URL
const API_BASE = import.meta.env.VITE_API_URL || 'https://ems.bishwasghimire.com.np/api';

console.log('🚀 API Base URL:', API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS
});

// Request interceptor - Attach token
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

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('access_token');
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

export const auth = {
  // ✅ FIX: Use /auth/login instead of /authentication/sign-in
  login: async (credentials) => {
    try {
      const path = import.meta.env.VITE_AUTH_LOGIN_PATH || '/auth/login';
      console.log('📤 Login request to:', `${API_BASE}${path}`);
      
      const res = await api.post(path, credentials);
      console.log('📥 Login response:', res.data);
      
      const token = res.data.accessToken || res.data.access_token || res.data.token;
      if (token) {
        localStorage.setItem('access_token', token);
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      }
      return res.data;
    } catch (err) {
      console.error('Login error:', err);
      throw unwrapError(err);
    }
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },
  
  getToken: () => localStorage.getItem('access_token'),

  getProfile: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw { message: 'No access token' };
      
      // Try to get profile from /auth/profile first
      try {
        const res = await api.get('/auth/profile');
        return res.data;
      } catch (profileError) {
        // Fallback: decode token and get user by ID
        const payload = decodeJwt(token);
        const userId = payload?.sub || payload?.id;
        if (userId) {
          const res = await api.get(`/users/${userId}`);
          return res.data;
        }
        throw { message: 'Invalid token payload' };
      }
    } catch (err) {
      throw unwrapError(err);
    }
  },
};

export const bookings = {
  create: async (payload) => {
    try {
      const res = await api.post('/bookings', payload);
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },
  get: async (id) => {
    try {
      const res = await api.get(`/bookings/${id}`);
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },
};

export const venues = {
  list: async () => {
    try {
      const res = await api.get('/venue');
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },
  get: async (id) => {
    try {
      const res = await api.get(`/venue/${id}`);
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },
};

export const users = {
  list: async () => {
    try {
      const res = await api.get('/users');
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },
  get: async (id) => {
    try {
      const res = await api.get(`/users/${id}`);
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },
  update: async (id, payload) => {
    try {
      const res = await api.patch(`/users/${id}`, payload);
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },
  remove: async (id) => {
    try {
      const res = await api.delete(`/users/${id}`);
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },
};

export default api;