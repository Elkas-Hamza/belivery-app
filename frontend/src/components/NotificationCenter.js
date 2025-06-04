import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 60 seconds
    const interval = setInterval(() => {
      fetchNotifications(false);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Mock notifications data until backend endpoint is available
  const mockNotifications = [
    {
      id: 1,
      type: 'delivery_status',
      message: 'Your delivery #12345 has been picked up',
      created_at: '2025-05-29T08:30:00',
      read_at: null
    },
    {
      id: 2,
      type: 'delivery_status',
      message: 'Your delivery #12346 is out for delivery',
      created_at: '2025-05-29T07:15:00',
      read_at: null
    },
    {
      id: 3,
      type: 'account',
      message: 'Your profile information has been updated',
      created_at: '2025-05-28T14:20:00',
      read_at: '2025-05-28T14:25:00'
    }
  ];

  const fetchNotifications = async (setLoadingState = true) => {
    if (setLoadingState) {
      setLoading(true);
    }
    
    try {
      // Use mock data instead of API call until backend endpoint is available
      // Uncomment the line below when the backend endpoint is ready
      // const response = await api.get('/notifications');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setNotifications(mockNotifications);
      
      // Count unread notifications
      const unread = mockNotifications.filter(notification => !notification.read_at).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    } finally {
      if (setLoadingState) {
        setLoading(false);
      }
    }
  };

  const markAsRead = async (id) => {
    try {
      // Uncomment when backend is ready
      // await api.post(`/notifications/${id}/read`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Update the local notification list
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, read_at: new Date().toISOString() } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Uncomment when backend is ready
      // await api.post('/notifications/mark-all-read');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Update all notifications as read
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({
          ...notification, 
          read_at: notification.read_at || new Date().toISOString()
        }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    // If the notification is not read, mark it as read
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    if (notification.type === 'DeliveryStatusChanged') {
      // Navigate to delivery details
      // For now, we'll just close the notification center
      setShowNotifications(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  return (
    <div className="notification-center">
      <button 
        className="notification-toggle" 
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <i className="notification-icon">🔔</i>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read" 
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div className="notification-loading">Loading notifications...</div>
          ) : error ? (
            <div className="notification-error">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="no-notifications">
              You have no notifications
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read_at ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-content">
                    <div className="notification-message">{notification.data.message}</div>
                    <div className="notification-time">{formatTimeAgo(notification.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
