import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './NotificationPreferences.css';

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    push_notifications: true,
    delivery_updates: true,
    promotions: false,
    account_updates: true,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await api.get('/user/notification-preferences');
      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      setError('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await api.put('/user/notification-preferences', preferences);
      setSuccess('Notification preferences updated successfully');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      setError('Failed to update notification preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading preferences...</div>;
  }

  return (
    <div className="notification-preferences">
      <h2>Notification Preferences</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="preferences-section">
          <h3>Delivery Notifications</h3>
          <div className="preference-item">
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="delivery_updates"
                checked={preferences.delivery_updates}
                onChange={handleChange}
              />
              <span className="toggle-slider"></span>
            </label>
            <div className="preference-info">
              <div className="preference-title">Delivery Status Updates</div>
              <div className="preference-description">
                Get notified when your delivery status changes (in progress, delivered, etc.)
              </div>
            </div>
          </div>
        </div>

        <div className="preferences-section">
          <h3>Account Notifications</h3>
          <div className="preference-item">
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="account_updates"
                checked={preferences.account_updates}
                onChange={handleChange}
              />
              <span className="toggle-slider"></span>
            </label>
            <div className="preference-info">
              <div className="preference-title">Account Updates</div>
              <div className="preference-description">
                Receive notifications about your account security, privacy, and profile changes
              </div>
            </div>
          </div>
        </div>

        <div className="preferences-section">
          <h3>Marketing Notifications</h3>
          <div className="preference-item">
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="promotions"
                checked={preferences.promotions}
                onChange={handleChange}
              />
              <span className="toggle-slider"></span>
            </label>
            <div className="preference-info">
              <div className="preference-title">Promotions and Offers</div>
              <div className="preference-description">
                Get notified about special offers, discounts, and promotions
              </div>
            </div>
          </div>
        </div>

        <div className="preferences-section">
          <h3>Notification Channels</h3>
          <div className="preference-item">
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="email_notifications"
                checked={preferences.email_notifications}
                onChange={handleChange}
              />
              <span className="toggle-slider"></span>
            </label>
            <div className="preference-info">
              <div className="preference-title">Email Notifications</div>
              <div className="preference-description">
                Receive notifications via email
              </div>
            </div>
          </div>
          
          <div className="preference-item">
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="push_notifications"
                checked={preferences.push_notifications}
                onChange={handleChange}
              />
              <span className="toggle-slider"></span>
            </label>
            <div className="preference-info">
              <div className="preference-title">Push Notifications</div>
              <div className="preference-description">
                Receive notifications in the app
              </div>
            </div>
          </div>
        </div>

        <div className="preferences-actions">
          <button
            type="submit"
            className="save-preferences-btn"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationPreferences;
