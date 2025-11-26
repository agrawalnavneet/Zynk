import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import './Auth.css';

const ForgotPassword = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', {
        email: email,
      });
      
      setOtpSent(true);
      showToast('Password reset code sent to your email. Please check your inbox.', 'success');
    } catch (error) {
      console.error('Forgot password error:', error);
      let errorMessage = 'Failed to send reset code. Please try again.';
      
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

  if (otpSent) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <h1>Check Your Email</h1>
          <p className="auth-subtitle">
            We've sent a password reset code to <strong>{email}</strong>
          </p>
          <p className="auth-subtitle" style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            Please check your inbox and follow the instructions to reset your password.
          </p>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link
              to={`/reset-password?email=${encodeURIComponent(email)}`}
              style={{
                display: 'inline-block',
                width: '100%',
                background: '#10b981',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '1.125rem',
                fontWeight: 600,
                transition: 'background 0.3s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#059669';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#10b981';
              }}
            >
              Enter Reset Code
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setEmail('');
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.9rem',
              }}
            >
              ← Use Different Email
            </button>
          </div>

          <p className="auth-footer">
            Remember your password? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Forgot Password</h1>
        <p className="auth-subtitle">
          Enter your email address and we'll send you a code to reset your password.
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Sending Reset Code...' : 'Send Reset Code'}
          </button>
        </form>

        <p className="auth-footer">
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
