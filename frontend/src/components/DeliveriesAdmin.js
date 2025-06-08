import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaMapMarkerAlt } from "react-icons/fa";
import api from "../services/api";
import DeliveryDetailsModal from "./DeliveryDetailsModal";
import "./AdminDashboard.css";

const DeliveriesAdmin = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const response = await api.get("/dev/deliveries");
      setDeliveries(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setError("Failed to load deliveries. Please try again later.");

      // Fallback to mock data if API fails
      setDeliveries([
        {
          id: 1,
          user_id: 1,
          user_name: "Mohammed Alami",
          pickup_address: "123 Casablanca Blvd, Casablanca",
          delivery_address: "456 Marrakech Ave, Marrakech",
          contact_number: "+212 612 345 678",
          weight: 5.2,
          price: 75.5,
          status: "pending",
          shipping_method: "truck",
          notes: "Handle with care",
          created_at: "2025-05-20T09:30:00",
          estimated_arrival_date: "2025-05-22T14:00:00",
          actual_arrival_date: null,
        },
        {
          id: 2,
          user_id: 2,
          user_name: "Fatima Benali",
          pickup_address: "789 Rabat Street, Rabat",
          delivery_address: "101 Fes Road, Fes",
          contact_number: "+212 623 456 789",
          weight: 3.5,
          price: 42.25,
          status: "in_progress",
          shipping_method: "domestic",
          notes: "Call before delivery",
          created_at: "2025-05-25T14:15:00",
          estimated_arrival_date: "2025-05-26T10:30:00",
          actual_arrival_date: null,
        },
        {
          id: 3,
          user_id: 1,
          user_name: "Mohammed Alami",
          pickup_address: "222 Tangier Lane, Tangier",
          delivery_address: "333 Agadir Drive, Agadir",
          contact_number: "+212 634 567 890",
          weight: 12.0,
          price: 128.75,
          status: "delivered",
          shipping_method: "air",
          notes: "",
          created_at: "2025-05-15T11:45:00",
          estimated_arrival_date: "2025-05-16T09:00:00",
          actual_arrival_date: "2025-05-16T08:45:00",
        },
        {
          id: 4,
          user_id: 3,
          user_name: "Ahmed Bouazizi",
          pickup_address: "444 Meknes Court, Meknes",
          delivery_address: "555 Oujda Street, Oujda",
          contact_number: "+212 645 678 901",
          weight: 7.8,
          price: 89.99,
          status: "cancelled",
          shipping_method: "sea",
          notes: "Customer cancelled",
          created_at: "2025-05-12T16:20:00",
          estimated_arrival_date: "2025-05-18T16:00:00",
          actual_arrival_date: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDelivery = async (deliveryId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this delivery? This action cannot be undone."
      )
    ) {
      try {
        // In a real application, you would call your API to delete the delivery
        // await api.delete(`/deliveries/${deliveryId}`);

        // For now, we'll just update the UI to remove the deleted delivery
        setDeliveries((prevDeliveries) =>
          prevDeliveries.filter((delivery) => delivery.id !== deliveryId)
        );

        alert("Delivery deleted successfully");
      } catch (error) {
        console.error("Error deleting delivery:", error);
        alert("Failed to delete delivery. Please try again.");
      }
    }
  };

  const handleStatusChange = async (deliveryId, newStatus) => {
    try {
      // Use development endpoint for status updates
      await api.patch(`/dev/deliveries/${deliveryId}/status`, {
        status: newStatus,
      });

      // Update local state to reflect the change
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery.id === deliveryId
            ? { ...delivery, status: newStatus }
            : delivery
        )
      );

      console.log(`Delivery ${deliveryId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating delivery status:", error);
      alert("Failed to update delivery status. Please try again.");
    }
  };

  // Filter deliveries based on search term and status filter
  const filteredDeliveries = deliveries.filter((delivery) => {
    // Apply status filter
    if (statusFilter !== "all" && delivery.status !== statusFilter) {
      return false;
    }

    // Apply search filter (search in multiple fields)
    const searchLower = searchTerm.toLowerCase();
    return (
      delivery.id.toString().includes(searchLower) ||
      delivery.user_name.toLowerCase().includes(searchLower) ||
      delivery.pickup_address.toLowerCase().includes(searchLower) ||
      delivery.delivery_address.toLowerCase().includes(searchLower) ||
      delivery.contact_number.includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="admin-section">
        <h2>Delivery Management</h2>
        <p>Loading delivery data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-section">
        <h2>Delivery Management</h2>
        <p className="error-message">{error}</p>
        <button onClick={fetchDeliveries} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <h2>Delivery Management</h2>
      <p>Track and manage all customer deliveries</p>

      <div className="filter-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search deliveries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <FaFilter className="filter-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="deliveries-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Pickup</th>
              <th>Delivery</th>
              <th>Weight</th>
              <th>Shipping Method</th>
              <th>Price</th>
              <th>Status</th>
              <th>Created</th>
              <th>Est. Arrival</th>
              <th>Actual Arrival</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.length === 0 ? (
              <tr>
                <td colSpan="12" className="no-results">
                  No deliveries found. Try adjusting your search or filter.
                </td>
              </tr>
            ) : (
              filteredDeliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td>#{delivery.id}</td>
                  <td>{delivery.user_name}</td>
                  <td>
                    <div
                      className="address-cell"
                      title={delivery.pickup_address}
                    >
                      <FaMapMarkerAlt className="location-icon" />
                      {delivery.pickup_address.substring(0, 15)}...
                    </div>
                  </td>
                  <td>
                    <div
                      className="address-cell"
                      title={delivery.delivery_address}
                    >
                      <FaMapMarkerAlt className="location-icon" />
                      {delivery.delivery_address.substring(0, 15)}...
                    </div>
                  </td>
                  <td>{delivery.weight} kg</td>
                  <td>
                    <span className="shipping-method-badge">
                      {delivery.shipping_method || "domestic"}
                    </span>
                  </td>
                  <td>
                    $
                    {typeof delivery.price === "number"
                      ? delivery.price.toFixed(2)
                      : parseFloat(delivery.price || 0).toFixed(2)}
                  </td>
                  <td>
                    <select
                      value={delivery.status}
                      onChange={(e) =>
                        handleStatusChange(delivery.id, e.target.value)
                      }
                      className={`status-select ${delivery.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(delivery.created_at).toLocaleDateString()}</td>
                  <td>{formatDate(delivery.estimated_arrival_date)}</td>
                  <td>
                    {delivery.actual_arrival_date ? (
                      <span className="actual-arrival-date">
                        {formatDate(delivery.actual_arrival_date)}
                      </span>
                    ) : delivery.status === "delivered" ? (
                      <span className="missing-actual-date">Not recorded</span>
                    ) : (
                      <span className="pending-arrival">Pending</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => setSelectedDelivery(delivery.id)}
                      >
                        Details
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteDelivery(delivery.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedDelivery && (
        <DeliveryDetailsModal
          deliveryId={selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
        />
      )}
    </div>
  );
};

export default DeliveriesAdmin;
