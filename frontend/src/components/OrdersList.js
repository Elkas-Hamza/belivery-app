import React, { useState, useEffect } from 'react';
import api from '../services/api';
import OrderDetailsModal from './OrderDetailsModal';
import PrintableInvoice from './PrintableInvoice';
import './AdminDashboard.css';
import './PrintStyles.css';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [printOrderId, setPrintOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Wait a moment before making the request to ensure backend changes are applied
      setTimeout(async () => {
        try {
          const response = await api.get('/dev/orders');
          setOrders(response.data);
          setError(null);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching orders:', error);
          setError('Failed to load orders. Please try again later.');
          
          // Fallback to mock data if API fails
          setOrders([
            {
              id: 1001,
              user_id: 1,
              user_name: 'Mohammed Alami',
              delivery_id: 2001,
              amount: 75.50,
              status: 'completed',
              payment_method: 'card',
              created_at: '2025-05-15T14:30:00'
            },
            {
              id: 1002,
              user_id: 2,
              user_name: 'Fatima Benali',
              delivery_id: 2002,
              amount: 42.25,
              status: 'processing',
              payment_method: 'cash',
              created_at: '2025-05-20T09:45:00'
            },
            {
              id: 1003,
              user_id: 1,
              user_name: 'Mohammed Alami',
              delivery_id: 2003,
              amount: 128.75,
              status: 'pending',
              payment_method: 'card',
              created_at: '2025-05-28T16:15:00'
            }
          ]);
          setLoading(false);
        }
      }, 1000); // Add a 1-second delay to allow backend changes to apply
    } catch (error) {
      console.error('Error in fetch operation:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="admin-section">
        <h2>Order Tracking</h2>
        <p>Loading order data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-section">
        <h2>Order Tracking</h2>
        <p className="error-message">{error}</p>
        <button onClick={fetchOrders} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <h2>Order Tracking</h2>
      <p>Monitor and manage customer orders</p>
      
      <div className="orders-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Delivery ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user_name}</td>
                <td>#{order.delivery_id}</td>
                <td>${order.amount.toFixed(2)}</td>
                <td>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`status-select ${order.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{order.payment_method}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="view-btn" 
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      View
                    </button>
                    <button 
                      className="print-btn" 
                      onClick={() => {
                        setSelectedOrder(order);
                        setPrintOrderId(order.id);
                      }}
                    >
                      Print
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrderId && (
        <OrderDetailsModal 
          orderId={selectedOrderId} 
          onClose={() => setSelectedOrderId(null)} 
        />
      )}

      {/* Print Invoice Modal */}
      {printOrderId && selectedOrder && (
        <PrintableInvoice 
          order={selectedOrder} 
          onClose={() => {
            setPrintOrderId(null);
            setSelectedOrder(null);
          }} 
        />
      )}
    </div>
  );
};

export default OrdersList;
