// src/App.jsx
import React, { useState, useEffect } from 'react';
import "./beuti.css";
import Signout from "./Signout.jsx";
import SignUp from "./SignUp.jsx";
import { auth } from './services/api';

function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
      fetchProfile();
    }
    console.log('🚀 App Connected to:', import.meta.env.VITE_API_URL || 'https://ems.bishwasghimire.com.np/api');
  }, []);

  const fetchProfile = async () => {
    try {
      const user = await auth.getProfile();
      setUserData(user);
    } catch (err) {
      console.error('Profile fetch failed:', err);
      auth.logout();
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await auth.signIn({
        email: formData.email,
        password: formData.password,
      });

      console.log('✅ Sign in response:', res);

      if (res.accessToken || res.access_token) {
        setIsLoggedIn(true);
        setSuccess('✅ Login successful!');
        setFormData({ email: '', password: '' });
        await fetchProfile();
      } else if (res.otpRequired) {
        // Handle 2FA if required
        setError('2FA code required. Please enter your authenticator code.');
      } else {
        setError('Login failed: unexpected response from server.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.logout();
    setIsLoggedIn(false);
    setUserData(null);
    setSuccess(null);
    setError(null);
  };

  // Show Sign Up page
  if (showSignUp) {
    return <SignUp onSwitchToLogin={() => setShowSignUp(false)} />;
  }

  // Logged-in dashboard
  if (isLoggedIn) {
    return (
      <div className="container">
        <div className="card">
          <div className="left">
            <div className="logo"></div>
            <h1>Welcome, {userData?.email || userData?.sub || 'User'}!</h1>
            <div className="line"></div>
            <p>You are logged in to the Event Management System.</p>
            <button className="learn-btn">Dashboard</button>
            <Signout onLogout={handleLogout} />
          </div>

          <div className="right">
            <div className="login-box">
              <h2>Profile</h2>
              {userData ? (
                <div style={{ textAlign: 'left', padding: '10px' }}>
                  <p><strong>Email:</strong> {userData.email || userData.sub || 'N/A'}</p>
                  <p><strong>Role:</strong> {userData.role || 'User'}</p>
                </div>
              ) : (
                <p>Loading profile...</p>
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

            <form onSubmit={handleSignIn}>
              <h2>Login</h2>

              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
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

            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <p style={{ color: '#666' }}>
                Don't have an account?{' '}
                <button
                  onClick={() => setShowSignUp(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4b006e',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Sign Up
                </button>
              </p>
            </div>

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