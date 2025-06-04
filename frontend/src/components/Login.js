import React, { useState } from 'react';
import api from '../services/api';
import './Login.css';

import { FiUser, FiLock, FiMail, FiTruck } from 'react-icons/fi';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Login with token-based authentication
      const response = await api.post('/login', formData);
      
      if (response.data.token && response.data.user) {
        // Store the token in localStorage
        localStorage.setItem('auth_token', response.data.token);
        
        // Set the token as default Authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Call the login success callback with the user data
        onLoginSuccess(response.data.user);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.errors?.email?.[0] || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left-panel">
        <div className="auth-logo-container">
          <FiTruck className="auth-logo-icon" />
          <h1>DeliveryApp</h1>
        </div>
        <div className="auth-left-content">
          <h2>Welcome Back!</h2>
          <p>Track your deliveries in real-time and manage your shipping preferences with our powerful delivery platform.</p>
          <div className="auth-features">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">📦</div>
              <div className="auth-feature-text">Real-time tracking</div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🔔</div>
              <div className="auth-feature-text">Smart notifications</div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🚚</div>
              <div className="auth-feature-text">Reliable delivery</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="auth-right-panel">
        <div className="auth-form-container">
          <h2>Sign In</h2>
          <p className="auth-subtitle">Welcome back! Please enter your details.</p>
          
          {error && <div className="auth-error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <div className="auth-input-icon">
                <FiMail />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email address"
                className="auth-input"
              />
            </div>
            
            <div className="auth-input-group">
              <div className="auth-input-icon">
                <FiLock />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="auth-input"
              />
            </div>
            
            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" name="remember" />
                Remember me
              </label>
              <a href="#forgot-password" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="auth-switch">
              Don't have an account?{' '}
              <a href="#register" className="switch-link">
                Sign up
              </a>
            </p>

            <div className="auth-divider">
              <span>Or continue with</span>
            </div>
            
            <div className="auth-test-accounts">
              <h4>Test Accounts</h4>
              <div className="auth-account-buttons">
                <button 
                  type="button" 
                  className="auth-account-button admin-button"
                  onClick={() => {
                    setFormData({
                      email: 'admin@deliveryapp.com',
                      password: 'admin123'
                    });
                  }}
                >
                  <FiUser /> Admin
                </button>
                <button 
                  type="button" 
                  className="auth-account-button user-button"
                  onClick={() => {
                    setFormData({
                      email: 'user@deliveryapp.com',
                      password: 'user123'
                    });
                  }}
                >
                  <FiUser /> User
                </button>
              </div>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
