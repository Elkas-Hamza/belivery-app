import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./DeliveryTracking.css";

const DeliveryTracking = ({ deliveryId }) => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      console.error("Error fetching delivery details:", error);
      setError("Could not load delivery information");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case "pending":
        return 1;
      case "in_progress":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
        return 0;
      default:
        return 0;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="loading">Loading delivery information...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!delivery) {
    return <div className="not-found">Delivery not found</div>;
  }

  const statusStep = getStatusStep(delivery.status);

  return (
    <div className="tracking-container">
      <div className="tracking-header">
        <h2>Delivery Tracking</h2>
        <div className="delivery-id">Order #{delivery.id}</div>
      </div>

      <div className="tracking-details">
        <div className="detail-row">
          <div className="detail-label">Status:</div>
          <div className={`detail-value status-badge ${delivery.status}`}>
            {delivery.status.replace("_", " ")}
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Created:</div>
          <div className="detail-value">{formatDate(delivery.created_at)}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Updated:</div>
          <div className="detail-value">{formatDate(delivery.updated_at)}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Pickup Address:</div>
          <div className="detail-value">{delivery.pickup_address}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Delivery Address:</div>
          <div className="detail-value">{delivery.delivery_address}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Contact:</div>
          <div className="detail-value">{delivery.contact_number}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Weight:</div>
          <div className="detail-value">{delivery.weight} kg</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Price:</div>
          <div className="detail-value">${delivery.price}</div>
        </div>

        {delivery.notes && (
          <div className="detail-row">
            <div className="detail-label">Notes:</div>
            <div className="detail-value">{delivery.notes}</div>
          </div>
        )}

        <div className="detail-row">
          <div className="detail-label">Estimated Arrival:</div>
          <div className="detail-value">
            {delivery.estimated_arrival_date
              ? formatDate(delivery.estimated_arrival_date)
              : "Not set"}
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Actual Arrival:</div>
          <div className="detail-value">
            {delivery.actual_arrival_date ? (
              <span className="actual-arrival-date">
                {formatDate(delivery.actual_arrival_date)}
              </span>
            ) : delivery.status === "delivered" ? (
              <span className="missing-actual-date">Not recorded</span>
            ) : (
              <span className="pending-arrival">Pending delivery</span>
            )}
          </div>
        </div>
      </div>

      <div className="tracking-progress">
        <div className="progress-steps">
          <div
            className={`progress-step ${statusStep >= 1 ? "active" : ""} ${
              delivery.status === "cancelled" ? "cancelled" : ""
            }`}
          >
            <div className="step-icon">1</div>
            <div className="step-label">Order Placed</div>
          </div>
          <div className="progress-line"></div>
          <div
            className={`progress-step ${statusStep >= 2 ? "active" : ""} ${
              delivery.status === "cancelled" ? "cancelled" : ""
            }`}
          >
            <div className="step-icon">2</div>
            <div className="step-label">In Transit</div>
          </div>
          <div className="progress-line"></div>
          <div
            className={`progress-step ${statusStep >= 3 ? "active" : ""} ${
              delivery.status === "cancelled" ? "cancelled" : ""
            }`}
          >
            <div className="step-icon">3</div>
            <div className="step-label">Delivered</div>
          </div>
        </div>

        {delivery.status === "cancelled" && (
          <div className="cancelled-notice">
            This delivery has been cancelled.
          </div>
        )}
      </div>

      <div className="estimated-delivery">
        <div className="estimate-label">Estimated Delivery Time:</div>
        <div className="estimate-value">
          {delivery.status === "delivered"
            ? "Delivered"
            : delivery.status === "cancelled"
            ? "Cancelled"
            : "30-45 minutes"}
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracking;
