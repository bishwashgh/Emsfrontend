// src/SignUp.jsx
import React, { useState } from 'react';
import { auth } from './services/api';

function SignUp({ onSwitchToLogin }) {
  const [step, setStep] = useState('signup'); // 'signup' | 'otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // ✅ Validate name (min 2 characters)
    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      setLoading(false);
      return;
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // ✅ Validate password strength (matches backend requirements)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 10 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number');
      setLoading(false);
      return;
    }

    // ✅ Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // ✅ Send exactly what the backend DTO expects
      const signUpData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword, // Required by backend
      };

      console.log('📤 Sending sign up data:', { ...signUpData, password: '***', confirmPassword: '***' });

      const response = await auth.signUp(signUpData);
      
      console.log('📥 Sign up response:', response);
      
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
      // Handle different error formats
      let errorMsg = 'Sign up failed. Please try again.';
      if (err.message) {
        errorMsg = Array.isArray(err.message) ? err.message.join(', ') : err.message;
      } else if (err.error) {
        errorMsg = err.error;
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      setError(errorMsg);
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
      let errorMsg = 'OTP verification failed. Please try again.';
      if (err.message) {
        errorMsg = Array.isArray(err.message) ? err.message.join(', ') : err.message;
      } else if (err.error) {
        errorMsg = err.error;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await auth.signUp({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
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

  // Password strength indicator
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#ff4444', '#ffaa44', '#44ff44', '#44aa44'];

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
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
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
            placeholder="Enter your full name (min 2 characters)"
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
            placeholder="Min 10 chars with uppercase, lowercase & number"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          {/* Password strength indicator */}
          {formData.password && (
            <div style={{ marginTop: '-10px', marginBottom: '15px' }}>
              <div style={{
                display: 'flex',
                gap: '5px',
                marginBottom: '4px'
              }}>
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    style={{
                      flex: 1,
                      height: '4px',
                      background: level <= passwordStrength ? strengthColors[passwordStrength] : '#ddd',
                      borderRadius: '2px',
                      transition: 'background 0.3s'
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '12px', color: strengthColors[passwordStrength] || '#666' }}>
                {passwordStrength > 0 ? `Strength: ${strengthLabels[passwordStrength]}` : 'Enter a strong password'}
              </span>
            </div>
          )}

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* Password match indicator */}
          {formData.confirmPassword && (
            <div style={{ 
              marginTop: '-10px', 
              marginBottom: '15px',
              fontSize: '14px',
              color: formData.password === formData.confirmPassword ? '#3a3' : '#c33'
            }}>
              {formData.password === formData.confirmPassword ? 
                '✅ Passwords match' : 
                '❌ Passwords do not match'
              }
            </div>
          )}

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