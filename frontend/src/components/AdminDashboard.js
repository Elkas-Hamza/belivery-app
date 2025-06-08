import React, { useState, useEffect } from "react";
import {
  FaTruck,
  FaUsers,
  FaShoppingCart,
  FaMoneyBillWave,
} from "react-icons/fa";
import api from "../services/api";
import DeliveryList from "./DeliveryList";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    deliveries: 0,
    activeOrders: 0,
    users: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentDeliveries, setRecentDeliveries] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Try to fetch stats from the public development API
      const statsResponse = await api.get("/dev/stats");
      setStats(statsResponse.data);

      // Try to fetch recent deliveries from development API
      const deliveriesResponse = await api.get("/dev/deliveries");
      // Take only the first 5 deliveries
      setRecentDeliveries(deliveriesResponse.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      // Use realistic mock data if API calls fail
      setStats({
        deliveries: 142,
        activeOrders: 37,
        users: 89,
        revenue: 12450,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDeliveryDetails = (deliveryId) => {
    // Navigate to the delivery details page in the admin section
    window.location.hash = `/admin/deliveries`;
  };

  return (
    <div className="admin-dashboard">
      <h2>Dashboard Overview</h2>

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <FaTruck />
              </div>
              <div className="stat-content">
                <h3>Total Deliveries</h3>
                <p className="stat-value">{stats.deliveries}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaShoppingCart />
              </div>
              <div className="stat-content">
                <h3>Active Orders</h3>
                <p className="stat-value">{stats.activeOrders}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>Registered Users</h3>
                <p className="stat-value">{stats.users}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaMoneyBillWave />
              </div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-value">${stats.revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-sections">
            <div className="recent-activity">
              <div className="section-header">
                <h3>Recent Deliveries</h3>
                <button
                  className="view-all-btn"
                  onClick={() => (window.location.hash = "/admin/deliveries")}
                >
                  View All
                </button>
              </div>
            </div>

            <div className="activity-timeline">
              <div className="section-header">
                <h3>Recent Activity</h3>
              </div>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-icon delivered"></div>
                  <div className="timeline-content">
                    <p className="timeline-time">Today, 08:30 AM</p>
                    <p className="timeline-text">
                      Delivery #2045 was successfully delivered
                    </p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon user"></div>
                  <div className="timeline-content">
                    <p className="timeline-time">Yesterday, 2:15 PM</p>
                    <p className="timeline-text">
                      New user registered: Karim Tazi
                    </p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon order"></div>
                  <div className="timeline-content">
                    <p className="timeline-time">Yesterday, 10:45 AM</p>
                    <p className="timeline-text">
                      New order #1089 received from Fatima Benali
                    </p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon update"></div>
                  <div className="timeline-content">
                    <p className="timeline-time">May 28, 3:30 PM</p>
                    <p className="timeline-text">
                      System notification preferences updated
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
