// src/services/api.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

function unwrapError(err) {
  if (err?.response?.data) return err.response.data;
  return { message: err.message || 'Unknown error' };
}

// minimal JWT decode (no dependency) to read payload
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
  login: async (credentials) => {
    try {
      const path = import.meta.env.VITE_AUTH_LOGIN_PATH || '/auth/login';
      const res = await api.post(path, credentials);
      const token = res.data.access_token || res.data.token || res.data.accessToken;
      if (token) localStorage.setItem('access_token', token);
      // if backend returns user object, return it
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },
  logout: () => {
    localStorage.removeItem('access_token');
  },
  getToken: () => localStorage.getItem('access_token'),

  // new helper: decode token and fetch user from backend
  getProfile: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw { message: 'No access token' };
      const payload = decodeJwt(token);
      const userId = payload?.sub || payload?.id;
      if (!userId) throw { message: 'Invalid token payload' };
      const res = await api.get(`/users/${userId}`);
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },
};

// bookings, venues, users unchanged
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