// src/SignUp.jsx
import React, { useState } from 'react';
import { auth } from './services/api';

function SignUp({ onSwitchToLogin }) {
  const [step, setStep] = useState('signup'); // 'signup' | 'otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '', // ✅ Add confirmPassword
  });
  const [otp, setOtp] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // ✅ Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // ✅ Validate password length
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      // ✅ Send only the fields your backend expects
      const signUpData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        // confirmPassword is only for frontend validation
      };

      const response = await auth.signUp(signUpData);
      
      if (response.otpRequired && response.challengeId) {
        setChallengeId(response.challengeId);
        setStep('otp');
        setSuccess('✅ OTP sent to your email. Please check your inbox.');
      } else {
        setSuccess('✅ Sign up successful! Please login.');
        setTimeout(() => {
          if (onSwitchToLogin) onSwitchToLogin();
        }, 2000);
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await auth.verifySignUpOtp({
        challengeId: challengeId,
        otp: otp,
      });

      setSuccess('✅ Email verified! Account created successfully.');
      
      if (response.accessToken) {
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await auth.signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      if (response.challengeId) {
        setChallengeId(response.challengeId);
        setSuccess('✅ New OTP sent to your email.');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Verification Step
  if (step === 'otp') {
    return (
      <div className="signup-container">
        <div className="signup-box">
          <h2>Verify Your Email</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            We sent a verification code to <strong>{formData.email}</strong>
          </p>

          {error && (
            <div className="error-msg" style={{
              background: '#fee',
              color: '#c33',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="success-msg" style={{
              background: '#efe',
              color: '#3a3',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleVerifyOtp}>
            <label>Enter OTP</label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              required
              style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
            />

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <button
              onClick={resendOtp}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                color: '#4b006e',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Resend OTP
            </button>
          </div>

          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <button
              onClick={() => setStep('signup')}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer'
              }}
            >
              ← Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sign Up Form
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Account</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Sign up to get started with Event Management
        </p>

        {error && (
          <div className="error-msg" style={{
            background: '#fee',
            color: '#c33',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="success-msg" style={{
            background: '#efe',
            color: '#3a3',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password (min 8 characters)"
            value={formData.password}
            onChange={handleChange}
            minLength="8"
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength="8"
            required
          />

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: '#4b006e',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;