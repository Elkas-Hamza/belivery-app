import React, { useState, useEffect } from 'react';
import { FaTruck, FaUsers, FaCog, FaHome, FaChartLine, FaClipboardList, FaBell, FaSignOutAlt } from 'react-icons/fa';
import NotificationCenter from './NotificationCenter';
import './AdminLayout.css';

const AdminLayout = ({ children, user, setAdminView, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentPath, setCurrentPath] = useState(window.location.hash.substring(1) || '/admin/dashboard');
  
  // Listen for hash changes to update the current path
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.substring(1) || '/admin/dashboard');
    };
    
    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  // Function to handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    if (onLogout) {
      onLogout();
    } else {
      // Fallback in case onLogout is not provided
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
  };
  
  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement actual search functionality here
      alert(`Searching for: ${searchQuery}`);
    }
  };
  
  // Get page title based on current path
  const getPageTitle = () => {
    switch(currentPath) {
      case '/admin/dashboard':
        return 'Dashboard';
      case '/admin/deliveries':
        return 'Manage Deliveries';
      case '/admin/users':
        return 'User Management';
      case '/admin/orders':
        return 'Order Tracking';
      case '/admin/settings':
        return 'System Settings';
      default:
        return 'Admin Dashboard';
    }
  };
  
  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <h2>
          <FaChartLine style={{ marginRight: '10px' }} />
          Admin Dashboard
        </h2>
        <nav>
          <ul>
            <li>
              <a 
                href="#/admin/dashboard" 
                className={currentPath === '/admin/dashboard' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '/admin/dashboard';
                  setActiveSection('dashboard');
                  // Directly update the parent component's state
                  setAdminView('/admin/dashboard');
                }}
              >
                <FaHome style={{ marginRight: '10px', fontSize: '1.2rem' }} />
                Dashboard
              </a>
            </li>
            <li>
              <a 
                href="#/admin/deliveries" 
                className={currentPath === '/admin/deliveries' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '/admin/deliveries';
                  setActiveSection('deliveries');
                  // Directly update the parent component's state
                  setAdminView('/admin/deliveries');
                }}
              >
                <FaTruck style={{ marginRight: '10px', fontSize: '1.2rem' }} />
                Deliveries
              </a>
            </li>
            <li>
              <a 
                href="#/admin/users" 
                className={currentPath === '/admin/users' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '/admin/users';
                  setActiveSection('users');
                  // Directly update the parent component's state
                  setAdminView('/admin/users');
                }}
              >
                <FaUsers style={{ marginRight: '10px', fontSize: '1.2rem' }} />
                Users
              </a>
            </li>
            <li>
              <a 
                href="#/admin/orders" 
                className={currentPath === '/admin/orders' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '/admin/orders';
                  setActiveSection('orders');
                  // Directly update the parent component's state
                  setAdminView('/admin/orders');
                }}
              >
                <FaClipboardList style={{ marginRight: '10px', fontSize: '1.2rem' }} />
                Orders
              </a>
            </li>
            <li>
              <a 
                href="#/admin/settings" 
                className={currentPath === '/admin/settings' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '/admin/settings';
                  setActiveSection('settings');
                  // Directly update the parent component's state
                  setAdminView('/admin/settings');
                }}
              >
                <FaCog style={{ marginRight: '10px', fontSize: '1.2rem' }} />
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="admin-content">
        <div className="admin-header">
          <div className="admin-header-left">
            <h1>{getPageTitle()}</h1>
            <p className="admin-breadcrumb">
              <span>Home</span> / <span>{getPageTitle()}</span>
            </p>
          </div>
          <div className="admin-header-right">
            <form className="admin-search" onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </button>
            </form>
            <NotificationCenter />
            <div className="admin-user-profile">
              <div className="admin-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'A'}</div>
              <div className="admin-user-info">
                <span className="admin-user-name">{user?.name || 'Admin'}</span>
                <span className="admin-user-role">{user?.role === 'admin' ? 'Administrator' : 'Staff'}</span>
              </div>
            </div>
            <button className="admin-logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
        <div className="admin-main-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
