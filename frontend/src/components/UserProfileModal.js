import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaShoppingCart,
  FaTruck,
} from "react-icons/fa";
import api from "../services/api";
import "./AdminDashboard.css";

const UserProfileModal = ({ userId, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/dev/users/${userId}/orders`);
      setUserData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>User Profile</h2>
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-content loading">
            <p>Loading user data...</p>
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
            <h2>User Profile</h2>
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-content error">
            <p className="error-message">{error}</p>
            <button onClick={fetchUserData} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  const { user, orders, deliveries } = userData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>User Profile</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">
          <div className="user-profile-header">
            <div className="user-avatar large">
              {user.profile_image && !imageError ? (
                <img
                  src={user.profile_image}
                  alt={user.name}
                  onError={() => setImageError(true)}
                  onLoad={() => setImageError(false)}
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p className="user-meta">
                <FaEnvelope /> {user.email}
              </p>
              <p className="user-meta">
                <FaUser />{" "}
                {user.role === "admin" ? "Administrator" : "Regular User"}
              </p>
              <p className="user-meta">
                <FaCalendarAlt /> Member since {formatDate(user.created_at)}
              </p>
            </div>
          </div>

          <div className="profile-tabs">
            <button
              className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <FaShoppingCart /> Orders ({orders.length})
            </button>
            <button
              className={`tab-button ${
                activeTab === "deliveries" ? "active" : ""
              }`}
              onClick={() => setActiveTab("deliveries")}
            >
              <FaTruck /> Deliveries ({deliveries.length})
            </button>
          </div>

          {activeTab === "orders" && (
            <div className="user-orders">
              <h4>Orders History</h4>
              {orders.length === 0 ? (
                <p className="no-data">No orders found for this user.</p>
              ) : (
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                       
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>
                            $
                            {typeof order.amount === "number"
                              ? order.amount.toFixed(2)
                              : parseFloat(order.amount || 0).toFixed(2)}
                          </td>
                          <td>
                            <span className={`status-badge ${order.status}`}>
                              {order.status.replace("_", " ")}
                            </span>
                          </td>
                          <td>{formatDate(order.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "deliveries" && (
            <div className="user-deliveries">
              <h4>Deliveries History</h4>
              {deliveries.length === 0 ? (
                <p className="no-data">No deliveries found for this user.</p>
              ) : (
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tracking</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveries.map((delivery) => (
                        <tr key={delivery.id}>
                          <td>#{delivery.id}</td>
                          <td>{delivery.tracking_code || "N/A"}</td>
                          <td title={delivery.pickup_address}>
                            {delivery.pickup_address.substring(0, 15)}...
                          </td>
                          <td title={delivery.delivery_address}>
                            {delivery.delivery_address.substring(0, 15)}...
                          </td>
                          <td>
                            $
                            {typeof delivery.price === "number"
                              ? delivery.price.toFixed(2)
                              : parseFloat(delivery.price || 0).toFixed(2)}
                          </td>
                          <td>
                            <span className={`status-badge ${delivery.status}`}>
                              {delivery.status.replace("_", " ")}
                            </span>
                          </td>
                          <td>{formatDate(delivery.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
