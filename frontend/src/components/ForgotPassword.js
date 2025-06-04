import React, { useState } from 'react';
import api from '../services/api';
import './ForgotPassword.css';

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/forgot-password', { email });
      setSuccess('Password reset link sent to your email address.');
      setStatus('sent');
    } catch (err) {
      console.error('Error sending reset link:', err);
      setError(err.response?.data?.message || 'Could not send password reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Reset Password</h2>
        <p className="forgot-password-subtitle">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {status !== 'sent' ? (
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              className="reset-button"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="reset-instructions">
            <p>Check your email for the password reset link.</p>
            <p>If you don't receive it within a few minutes, check your spam folder.</p>
          </div>
        )}

        <div className="forgot-password-footer">
          <button onClick={onBack} className="back-to-login">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
