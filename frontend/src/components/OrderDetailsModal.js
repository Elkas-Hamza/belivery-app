import React, { useState, useEffect } from 'react';
import { FaTimes, FaShoppingCart, FaTruck, FaUser, FaCalendarAlt, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import api from '../services/api';
import PrintableInvoice from './PrintableInvoice';
import './AdminDashboard.css';
import './PrintStyles.css';

const OrderDetailsModal = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPrintInvoice, setShowPrintInvoice] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/dev/orders/${orderId}`);
      setOrder(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'processing':
        return '#2196f3';
      case 'completed':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Order Details</h2>
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-content loading">
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Order Details</h2>
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-content error">
            <p className="error-message">{error}</p>
            <button onClick={fetchOrderDetails} className="retry-btn">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container order-details" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order #{order.id}</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="order-status-header">
            <div 
              className="order-status-indicator" 
              style={{ backgroundColor: getStatusColor(order.status) }}
            >
              <span>{order.status.replace('_', ' ')}</span>
            </div>
            
            <div className="order-meta">
              <div className="meta-item">
                <FaCalendarAlt />
                <span>Ordered: {formatDate(order.created_at)}</span>
              </div>
              <div className="meta-item">
                <FaUser />
                <span>Customer: {order.user_name}</span>
              </div>
              <div className="meta-item">
                <FaCreditCard />
                <span>Payment: {order.payment_method}</span>
              </div>
            </div>
          </div>
          
          <div className="order-details-grid">
            <div className="detail-card">
              <div className="detail-icon">
                <FaShoppingCart />
              </div>
              <div className="detail-content">
                <h4>Order Number</h4>
                <p>#{order.id}</p>
              </div>
            </div>
            
            <div className="detail-card">
              <div className="detail-icon">
                <FaTruck />
              </div>
              <div className="detail-content">
                <h4>Delivery ID</h4>
                <p>#{order.delivery_id}</p>
              </div>
            </div>
            
            <div className="detail-card">
              <div className="detail-icon">
                <FaMoneyBillWave />
              </div>
              <div className="detail-content">
                <h4>Total Amount</h4>
                <p>${order.amount.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="detail-card">
              <div className="detail-icon">
                <FaCreditCard />
              </div>
              <div className="detail-content">
                <h4>Payment Method</h4>
                <p>{order.payment_method}</p>
              </div>
            </div>
          </div>
          
          {order.delivery && (
            <div className="order-delivery-details">
              <h3>Delivery Information</h3>
              <div className="delivery-card">
                <div className="delivery-header">
                  <div className="delivery-number">Delivery #{order.delivery.id}</div>
                  <div className={`status-badge ${order.delivery.status}`}>
                    {order.delivery.status.replace('_', ' ')}
                  </div>
                </div>
                
                <div className="delivery-addresses">
                  <div className="address">
                    <h4>From</h4>
                    <p>{order.delivery.pickup_address}</p>
                  </div>
                  <div className="address-arrow">→</div>
                  <div className="address">
                    <h4>To</h4>
                    <p>{order.delivery.delivery_address}</p>
                  </div>
                </div>
                
                <div className="delivery-details">
                  <div className="detail">
                    <span>Weight:</span>
                    <span>{order.delivery.weight} kg</span>
                  </div>
                  <div className="detail">
                    <span>Price:</span>
                    <span>${order.delivery.price.toFixed(2)}</span>
                  </div>
                  {order.delivery.tracking_code && (
                    <div className="detail">
                      <span>Tracking:</span>
                      <span>{order.delivery.tracking_code}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="modal-actions">
            <button className="primary-btn" onClick={() => setShowPrintInvoice(true)}>
              <FaMoneyBillWave style={{ marginRight: '8px' }} /> Print Invoice
            </button>
          </div>
          
          {showPrintInvoice && (
            <PrintableInvoice 
              order={order}
              onClose={() => setShowPrintInvoice(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
