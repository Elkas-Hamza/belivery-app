import React from 'react';
import './Welcome.css';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome to Delivery App</h1>
        <p className="welcome-description">
          Your one-stop solution for efficient and reliable delivery services
        </p>
        
        <div className="features-grid">
          <div className="feature-card">
            <h3>Fast Delivery</h3>
            <p>Quick and reliable delivery service</p>
          </div>
          
          <div className="feature-card">
            <h3>Real-time Tracking</h3>
            <p>Track your package in real-time</p>
          </div>
          
          <div className="feature-card">
            <h3>Secure Payments</h3>
            <p>Safe and secure payment processing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
