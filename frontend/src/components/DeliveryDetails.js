import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DeliveryTracking from './DeliveryTracking';
import './DeliveryDetails.css';

const DeliveryDetails = ({ deliveryId, onBack }) => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (deliveryId) {
      fetchDeliveryDetails();
    }
  }, [deliveryId]);

  const fetchDeliveryDetails = async () => {
    try {
      const response = await api.get(`/deliveries/${deliveryId}`);
      setDelivery(response.data);
    } catch (error) {
      console.error('Error fetching delivery details:', error);
      setError('Could not load delivery information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading delivery details...</div>;
  }

  if (error) {
    return (
      <div className="delivery-details-container">
        <div className="error-message">{error}</div>
        <button className="back-button" onClick={onBack}>
          Go Back
        </button>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="delivery-details-container">
        <div className="not-found">Delivery not found</div>
        <button className="back-button" onClick={onBack}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="delivery-details-container">
      <div className="delivery-details-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Deliveries
        </button>
        <h2>Delivery #{delivery.id}</h2>
      </div>
      
      <DeliveryTracking deliveryId={delivery.id} />
      
      <div className="contact-section">
        <h3>Need Help?</h3>
        <p>If you have any questions about your delivery, contact our support team:</p>
        <div className="contact-methods">
          <div className="contact-method">
            <i className="icon-phone">📞</i>
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="contact-method">
            <i className="icon-email">✉️</i>
            <span>support@deliveryapp.com</span>
          </div>
        </div>
      </div>
      
      <div className="delivery-actions">
        {delivery.status !== 'delivered' && delivery.status !== 'cancelled' && (
          <button className="cancel-delivery-btn" onClick={() => {}}>
            Cancel Delivery
          </button>
        )}
        <button className="contact-driver-btn" onClick={() => {}}>
          Contact Driver
        </button>
      </div>
    </div>
  );
};

export default DeliveryDetails;
