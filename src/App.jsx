// src/App.jsx
import React, { useState, useEffect } from 'react';
import "./beuti.css";
import Signout from "./Signout.jsx";
import apiService from './services/api';

function App() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      fetchProfile();
    }
    console.log('🚀 App Connected to:', 'https://ems.bishwasghimire.com.np/api');
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiService.getProfile();
      setUserData(res.data);
    } catch (err) {
      console.error('Profile fetch failed:', err);
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
      const res = await apiService.login({
        username: formData.username,
        password: formData.password,
      });

      if (res.data.token) {
        localStorage.setItem('authToken', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setIsLoggedIn(true);
        setUserData(res.data.user);
        setSuccess('✅ Login successful!');
        setFormData({ username: '', password: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
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
            <h1>Welcome, {userData?.username || 'User'}!</h1>
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
                  <p><strong>Username:</strong> {userData.username}</p>
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