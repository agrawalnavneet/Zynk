import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    countryCode: '+91',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        phone: digitsOnly,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/send-otp', {
        email: formData.email,
        name: formData.name,
      });
      
      setOtpSent(true);
      showToast('OTP sent to your email. Please check your inbox.', 'success');
      
      // Start resend timer (60 seconds)
      setResendTimer(60);
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Send OTP error:', error);
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setOtpError('');
    setOtpLoading(true);

    try {
      await api.post('/auth/send-otp', {
        email: formData.email,
        name: formData.name,
      });
      
      showToast('OTP resent to your email.', 'success');
      setResendTimer(60);
      
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Resend OTP error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
      setOtpError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP and Register
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setOtpError('');

    if (otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setOtpLoading(true);

    try {
      const fullPhone = formData.countryCode + formData.phone;
      const response = await api.post('/auth/verify-otp-and-register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: fullPhone,
        otp: otp,
      });

      // Store token and user data
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      showToast('Email verified! Account created successfully!', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error('Verify OTP error:', error);
      let errorMessage = 'OTP verification failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setOtpError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setOtpLoading(false);
    }
  };

  // OTP Verification Step
  if (otpSent) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <h1>Verify Your Email</h1>
          <p className="auth-subtitle">
            We've sent a 6-digit OTP to <strong>{formData.email}</strong>
          </p>
          <p className="auth-subtitle" style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            Please check your inbox and enter the OTP below to complete registration.
          </p>

          {otpError && <div className="error-message">{otpError}</div>}

          <form onSubmit={handleVerifyOTP} className="auth-form">
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                  setOtpError('');
                }}
                placeholder="000000"
                maxLength={6}
                required
                className="otp-input"
                style={{
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  letterSpacing: '0.5rem',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            <button type="submit" className="auth-btn" disabled={otpLoading || otp.length !== 6}>
              {otpLoading ? 'Verifying...' : 'Verify & Create Account'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Didn't receive the OTP?{' '}
                {resendTimer > 0 ? (
                  <span style={{ color: '#9ca3af' }}>
                    Resend in {resendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={otpLoading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#10b981',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: '0.9rem',
                    }}
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp('');
                setOtpError('');
                setResendTimer(0);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.9rem',
                marginTop: '1rem',
              }}
            >
              ← Change Email
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Registration Form Step
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Sign Up</h1>
        <p className="auth-subtitle">Create an account to book cleaning services.</p>
        <p className="auth-subtitle" style={{ fontSize: '0.9rem', color: '#6b7280' }}>
          We'll send a verification code to your email to verify your account.
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSendOTP} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <div className="phone-input-group">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="country-code-select"
              >
                <option value="+91">🇮🇳 +91 (India)</option>
                <option value="+1">🇺🇸 +1 (USA)</option>
                <option value="+44">🇬🇧 +44 (UK)</option>
                <option value="+61">🇦🇺 +61 (Australia)</option>
                <option value="+86">🇨🇳 +86 (China)</option>
                <option value="+971">🇦🇪 +971 (UAE)</option>
                <option value="+65">🇸🇬 +65 (Singapore)</option>
              </select>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="phone-number-input"
                inputMode="numeric"
                pattern="[0-9]{7,10}"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send Verification Code'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

