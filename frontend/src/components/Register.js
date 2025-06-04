import React, { useState } from 'react';
import api from '../services/api';
import './Login.css'; // Using the same styles as Login
import { FiUser, FiLock, FiMail, FiPhone, FiHome, FiTruck } from 'react-icons/fi';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    password: '',
    password_confirmation: '',
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
      // Register with token-based authentication
      const response = await api.post('/register', formData);
      
      if (response.data.token && response.data.user) {
        // Store the token in localStorage
        localStorage.setItem('auth_token', response.data.token);
        
        // Set the token as default Authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Call the register success callback with the user data
        onRegisterSuccess(response.data.user);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.errors?.email?.[0] || 
        'Registration failed. Please check your information.'
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
          <h2>Start Your Journey</h2>
          <p>Create an account to access our delivery platform and ship packages anywhere with ease and reliability.</p>
          <div className="auth-features">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🚚</div>
              <div className="auth-feature-text">Fast delivery service</div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">💰</div>
              <div className="auth-feature-text">Competitive pricing</div>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🔒</div>
              <div className="auth-feature-text">Secure package handling</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="auth-right-panel">
        <div className="auth-form-container">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Please fill in your information to get started.</p>
          
          {error && <div className="auth-error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <div className="auth-input-icon">
                <FiUser />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Full name"
                className="auth-input"
              />
            </div>
            
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
                <FiPhone />
              </div>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                placeholder="Phone number"
                className="auth-input"
              />
            </div>
            
            <div className="auth-input-group">
              <div className="auth-input-icon">
                <FiHome />
              </div>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Address"
                rows="3"
                className="auth-input"
                style={{ paddingLeft: '2.5rem', paddingTop: '0.75rem' }}
              ></textarea>
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
                placeholder="Password (min. 8 characters)"
                minLength="8"
                className="auth-input"
              />
            </div>
            
            <div className="auth-input-group">
              <div className="auth-input-icon">
                <FiLock />
              </div>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                placeholder="Confirm password"
                className="auth-input"
              />
            </div>
            
            <button
              type="submit"
              className="auth-button auth-primary-button"
              disabled={loading}
              style={{ marginTop: '1rem' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Already have an account? <a href="#/login" className="auth-link">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
