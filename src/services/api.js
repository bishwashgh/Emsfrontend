// src/services/api.js
import axios from 'axios';

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
  signUp: async (userData) => {
    try {
      console.log('📤 Sign up request for:', userData.email);
      // Log without sensitive data
      console.log('📤 Sign up data:', {
        name: userData.name,
        email: userData.email,
        password: '***',
        confirmPassword: '***'
      });
      
      const res = await api.post('/authentication/sign-up', userData);
      console.log('📥 Sign up response:', res.data);
      return res.data;
    } catch (err) {
      console.error('Sign up error:', err);
      throw unwrapError(err);
    }
  },

  // ✅ Verify OTP - Step 2: Complete Sign Up
  verifySignUpOtp: async (otpData) => {
    try {
      console.log('📤 OTP verification for challenge:', otpData.challengeId);
      const res = await api.post('/authentication/sign-up/verify', otpData);
      console.log('📥 OTP verification response:', res.data);
      
      // Store tokens after successful verification
      const token = res.data.accessToken || res.data.access_token;
      if (token) {
        localStorage.setItem('access_token', token);
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      }
      return res.data;
    } catch (err) {
      console.error('OTP verification error:', err);
      throw unwrapError(err);
    }
  },

  // ✅ Sign In
  signIn: async (credentials) => {
    try {
      console.log('📤 Sign in request for:', credentials.email);
      const res = await api.post('/authentication/sign-in', credentials);
      console.log('📥 Sign in response:', res.data);
      
      const token = res.data.accessToken || res.data.access_token;
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

  // ✅ Refresh Tokens
  refreshTokens: async (refreshTokenDto) => {
    try {
      const res = await api.post('/authentication/refresh-tokens', refreshTokenDto);
      const token = res.data.accessToken || res.data.access_token;
      if (token) {
        localStorage.setItem('access_token', token);
      }
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },

  // ✅ 2FA QR Code Generation
  twoFactor: async () => {
    try {
      const res = await api.post('/authentication/twofactor');
      return res.data;
    } catch (err) {
      throw unwrapError(err);
    }
  },

  // ✅ Logout from current device
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

  // ✅ Logout from all devices
  logoutAll: async () => {
    try {
      await api.post('/authentication/logout-all');
    } catch (err) {
      console.error('Logout all error:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  },

  getToken: () => localStorage.getItem('access_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  
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

export default api;