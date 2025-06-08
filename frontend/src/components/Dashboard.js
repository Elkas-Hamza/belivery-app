import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./Dashboard.css";
import {
  FiPackage,
  FiClock,
  FiTruck,
  FiCheck,
  FiX,
  FiPlus,
  FiRefreshCw,
  FiMapPin,
} from "react-icons/fi";
import DeliveryFormModal from "./DeliveryFormModal";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    pendingDeliveries: 0,
    inProgressDeliveries: 0,
    deliveredDeliveries: 0,
    cancelledDeliveries: 0,
    analytics: {
      totalSpent: 0,
      avgDeliveryTime: null,
      mostCommonDestination: null,
    },
    recentDeliveries: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get real dashboard statistics from the API
      const response = await api.get("/user/dashboard-stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");

      // Fallback to basic data if the dashboard endpoint fails
      try {
        const fallbackResponse = await api.get("/user/deliveries");
        const deliveries = fallbackResponse.data;

        // Calculate basic statistics
        const total = deliveries.length;
        const pending = deliveries.filter((d) => d.status === "pending").length;
        const inProgress = deliveries.filter(
          (d) => d.status === "in_progress"
        ).length;
        const delivered = deliveries.filter(
          (d) => d.status === "delivered"
        ).length;
        const cancelled = deliveries.filter(
          (d) => d.status === "cancelled"
        ).length;

        // Get 5 most recent deliveries
        const recent = [...deliveries]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);

        setStats({
          totalDeliveries: total,
          pendingDeliveries: pending,
          inProgressDeliveries: inProgress,
          deliveredDeliveries: delivered,
          cancelledDeliveries: cancelled,
          analytics: {
            totalSpent: 0,
            avgDeliveryTime: null,
            mostCommonDestination: null,
          },
          recentDeliveries: recent,
        });
      } catch (fallbackError) {
        console.error("Fallback data fetch failed:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDelivery = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleDeliveryCreated = (newDelivery) => {
    // Refresh dashboard data to show new delivery
    fetchDashboardData();
    setShowCreateModal(false);
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <FiX className="error-icon" />
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-button">
            <FiRefreshCw /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">
            Track and manage your deliveries in one place
          </p>
        </div>
        <div className="dashboard-actions">
          <button className="refresh-button" onClick={fetchDashboardData}>
            <FiRefreshCw /> Refresh
          </button>
          <button
            className="create-delivery-button"
            onClick={handleCreateDelivery}
          >
            <FiPlus /> New Delivery
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <FiPackage />
          </div>
          <div className="stat-details">
            <div className="stat-value">{stats.totalDeliveries}</div>
            <div className="stat-label">Total Deliveries</div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-details">
            <div className="stat-value">{stats.pendingDeliveries}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="stat-card in-progress">
          <div className="stat-icon">
            <FiTruck />
          </div>
          <div className="stat-details">
            <div className="stat-value">{stats.inProgressDeliveries}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>

        <div className="stat-card delivered">
          <div className="stat-icon">
            <FiCheck />
          </div>
          <div className="stat-details">
            <div className="stat-value">{stats.deliveredDeliveries}</div>
            <div className="stat-label">Delivered</div>
          </div>
        </div>

        <div className="stat-card cancelled">
          <div className="stat-icon">
            <FiX />
          </div>
          <div className="stat-details">
            <div className="stat-value">{stats.cancelledDeliveries}</div>
            <div className="stat-label">Cancelled</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Analytics Section */}
        <div className="dashboard-section analytics-section">
          <div className="section-header">
            <h2>Delivery Analytics</h2>
            <div className="analytics-timeframe">
              <span>Last 30 days</span>
            </div>
          </div>

          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="analytics-icon">
                <FiTruck className="analytics-icon-svg" />
              </div>
              <div className="analytics-content">
                <h3 className="analytics-title">Total Spent</h3>
                <div className="analytics-value">
                  $
                  {typeof stats.analytics.totalSpent === "number"
                    ? stats.analytics.totalSpent.toFixed(2)
                    : parseFloat(stats.analytics.totalSpent || 0).toFixed(2)}
                </div>
                <div className="analytics-description">
                  Total amount spent on deliveries
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-icon">
                <FiClock className="analytics-icon-svg" />
              </div>
              <div className="analytics-content">
                <h3 className="analytics-title">Average Delivery Time</h3>
                <div className="analytics-value">
                  {stats.analytics.avgDeliveryTime
                    ? `${stats.analytics.avgDeliveryTime} hours`
                    : "N/A"}
                </div>
                <div className="analytics-description">
                  Average time from order to delivery
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-icon">
                <FiMapPin className="analytics-icon-svg" />
              </div>
              <div className="analytics-content">
                <h3 className="analytics-title">Most Common Destination</h3>
                <div className="analytics-value">
                  {stats.analytics.mostCommonDestination ? (
                    <div className="address-truncate">
                      {stats.analytics.mostCommonDestination}
                    </div>
                  ) : (
                    "N/A"
                  )}
                </div>
                <div className="analytics-description">
                  Your most frequent delivery location
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Deliveries</h2>
            <a href="#/deliveries" className="view-all-link">
              View all
            </a>
          </div>

          {stats.recentDeliveries.length > 0 ? (
            <div className="recent-deliveries-list">
              {stats.recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="delivery-card">
                  <div className="delivery-card-header">
                    <div className="delivery-id">Delivery #{delivery.id}</div>
                    <div
                      className={`delivery-status status-${delivery.status}`}
                    >
                      {delivery.status.replace("_", " ")}
                    </div>
                  </div>

                  <div className="delivery-route">
                    <div className="route-point pickup">
                      <div className="point-marker"></div>
                      <div className="point-details">
                        <div className="point-label">Pickup</div>
                        <div className="point-address">
                          {delivery.pickup_address}
                        </div>
                      </div>
                    </div>

                    <div className="route-line"></div>

                    <div className="route-point delivery">
                      <div className="point-marker"></div>
                      <div className="point-details">
                        <div className="point-label">Delivery</div>
                        <div className="point-address">
                          {delivery.delivery_address}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="delivery-card-footer">
                    <div className="delivery-price">${delivery.price}</div>
                    <button className="track-button">Track Delivery</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FiPackage />
              </div>
              <h3>No deliveries yet</h3>
              <p>Create your first delivery request to get started!</p>
              <button
                className="create-delivery-button"
                onClick={handleCreateDelivery}
              >
                <FiPlus /> Create Delivery
              </button>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <DeliveryFormModal
          onClose={handleCloseModal}
          onDeliveryCreated={handleDeliveryCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;
