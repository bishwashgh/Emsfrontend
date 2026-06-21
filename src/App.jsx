// src/App.jsx
import React, { useState, useEffect } from 'react';
import "./beuti.css";
import Signout from "./Signout.jsx";
import { auth } from './services/api';

function App() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
      fetchProfile();
    }
    console.log('🚀 App Connected to:', import.meta.env.VITE_API_URL || 'http://localhost:3000');
  }, []);

  const fetchProfile = async () => {
    try {
      const user = await auth.getProfile();
      setUserData(user);
    } catch (err) {
      console.error('Profile fetch failed:', err);
      // if token invalid, clear it
      auth.logout();
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await auth.login({
        username: formData.username,
        password: formData.password,
      });

      // Many backends return { access_token, user } or { token, user }
      const token = res.access_token || res.token || res.accessToken;
      const user = res.user || null;

      if (token) {
        // token already stored by auth.login
        setIsLoggedIn(true);
        if (user) {
          setUserData(user);
        } else {
          await fetchProfile(); // try to fetch from backend using token
        }
        setSuccess('✅ Login successful!');
        setFormData({ username: '', password: '' });
        return;
      }

      // if backend returned response wrapped in res.data (older code path)
      if (res?.data?.token) {
        localStorage.setItem('access_token', res.data.token);
        setIsLoggedIn(true);
        setUserData(res.data.user || null);
        setSuccess('✅ Login successful!');
        setFormData({ username: '', password: '' });
      } else {
        setError('Login failed: unexpected response');
      }
    } catch (err) {
      setError(err.message || err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    setIsLoggedIn(false);
    setUserData(null);
    setSuccess(null);
    setError(null);
  };

  // Dashboard view when logged in
  if (isLoggedIn) {
    return (
      <div className="container">
        <div className="card">
          <div className="left">
            <div className="logo"></div>
            <h1>Welcome, {userData?.username || userData?.name || 'User'}!</h1>
            <div className="line"></div>
            <p>You are logged in to the Event Management System.</p>
            <button className="learn-btn">Dashboard</button>
            <Signout onLogout={handleLogout} />
          </div>
          <div className="right">
            <div className="login-box">
              <h2>Profile</h2>
              {userData && (
                <div style={{ textAlign: 'left', padding: '10px' }}>
                  <p><strong>Username:</strong> {userData.username || userData.name}</p>
                  <p><strong>Email:</strong> {userData.email || 'N/A'}</p>
                  <p><strong>Role:</strong> {userData.role || 'User'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login view
  return (
    <div className="container">
      <div className="card">
        <div className="left">
          <div className="logo"></div>
          <h1>Welcome!</h1>
          <div className="line"></div>
          <p>
            We provide professional event management services for weddings,
            parties, corporate events, and special occasions.
          </p>
          <button className="learn-btn">Learn More</button>
          <Signout onLogout={handleLogout} />
        </div>

        <div className="right">
          <div className="login-box">
            {error && (
              <div className="error-msg" style={{ background: '#fee', color: '#c33', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                ❌ {error}
              </div>
            )}
            {success && (
              <div className="success-msg" style={{ background: '#efe', color: '#3a3', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <h2>Login</h2>

              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <p className="forgot-password">
                <a href="#">Forgot Password?</a>
              </p>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Submit'}
              </button>
            </form>

            <div className="socials">
              <span>f</span>
              <span>📷</span>
              <span>p</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;