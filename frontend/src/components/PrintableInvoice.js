import React from 'react';
import { FaTimes, FaReceipt } from 'react-icons/fa';
import './PrintStyles.css';

const PrintableInvoice = ({ order, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return amount.toFixed(2);
  };

  return (
    <div className="print-overlay" onClick={onClose}>
      <div className="print-container" onClick={(e) => e.stopPropagation()}>
        <div className="print-header no-print">
          <h2>Order Invoice</h2>
          <div className="print-actions">
            <button className="primary-btn" onClick={() => {
              // Set up print environment
              document.title = `Invoice #${order.id}`;
              window.print();
            }}>Print Invoice</button>
            <button className="secondary-btn" onClick={onClose}>Close</button>
          </div>
        </div>
        
        <div className="invoice">
          <div className="invoice-header">
            <div className="company-logo">
              <FaReceipt /> FastDelivery
            </div>
            <div className="invoice-title">
              <h1>INVOICE</h1>
              <p className="invoice-number">#{order.id}</p>
              <p className="invoice-date">Date: {formatDate(order.created_at)}</p>
            </div>
          </div>
          
          <div className="invoice-addresses">
            <div className="invoice-from">
              <h3>From</h3>
              <p>FastDelivery Inc.</p>
              <p>123 Logistics Avenue</p>
              <p>Shipping District, SD 12345</p>
              <p>Email: billing@fastdelivery.com</p>
              <p>Phone: +1-800-FAST-DEL</p>
            </div>
            
            <div className="invoice-to">
              <h3>To</h3>
              <p className="customer-name">{order.user_name}</p>
              {order.delivery && (
                <>
                  <p>{order.delivery.delivery_address}</p>
                  <p>Contact: {order.delivery.contact_number}</p>
                </>
              )}
            </div>
          </div>
          
          <div className="invoice-details">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    Delivery Service
                    {order.delivery && (
                      <div className="delivery-info">
                        <small>From: {order.delivery.pickup_address}</small>
                        <small>To: {order.delivery.delivery_address}</small>
                        {order.delivery.weight && <small>Weight: {order.delivery.weight} kg</small>}
                      </div>
                    )}
                  </td>
                  <td>1</td>
                  <td>${formatCurrency(order.amount)}</td>
                  <td>${formatCurrency(order.amount)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="total-label">Subtotal</td>
                  <td className="total-value">${formatCurrency(order.amount)}</td>
                </tr>
                <tr>
                  <td colSpan="4" className="total-label">Tax (0%)</td>
                  <td className="total-value">$0.00</td>
                </tr>
                <tr className="grand-total">
                  <td colSpan="4" className="total-label">Total</td>
                  <td className="total-value">${formatCurrency(order.amount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="invoice-payment">
            <h3>Payment Information</h3>
            <p><strong>Payment Method:</strong> {order.payment_method}</p>
            <p><strong>Status:</strong> <span className={`payment-status ${order.status}`}>{order.status}</span></p>
          </div>
          
          <div className="invoice-notes">
            <h3>Notes</h3>
            <p>Thank you for your business! For any questions regarding this invoice, please contact our customer service department.</p>
          </div>
          
          <div className="invoice-footer">
            <p>Invoice generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableInvoice;
