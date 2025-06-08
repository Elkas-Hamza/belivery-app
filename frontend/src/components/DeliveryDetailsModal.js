import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaBox,
  FaMapMarkedAlt,
  FaPhone,
  FaWeight,
  FaMoneyBillWave,
  FaClipboardList,
  FaUser,
  FaCalendarAlt,
  FaBarcode,
  FaPrint,
  FaTruck,
} from "react-icons/fa";
import api from "../services/api";
import PrintableLabel from "./PrintableLabel";
import "./AdminDashboard.css";
import "./PrintStyles.css";

const DeliveryDetailsModal = ({ deliveryId, onClose }) => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPrintLabel, setShowPrintLabel] = useState(false);

  useEffect(() => {
    fetchDeliveryDetails();
  }, [deliveryId]);

  const fetchDeliveryDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // First, get the current user's role
      const userResponse = await api.get("/user");
      const isAdmin = userResponse.data.role === "admin";

      // Log which endpoint we're trying to access
      const endpoint = isAdmin
        ? `/deliveries/${deliveryId}`
        : `/user/deliveries/${deliveryId}`;

      console.log(`Fetching delivery details from: ${endpoint}`);

      const response = await api.get(endpoint);

      if (response.data) {
        setDelivery(response.data);
      } else {
        throw new Error("No data received from server");
      }
    } catch (error) {
      console.error("Error in fetchDeliveryDetails:", error);

      // Provide more detailed error message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error status:", error.response.status);

        // Handle specific status codes
        if (error.response.status === 401) {
          setError("Please log in to view delivery details.");
        } else if (error.response.status === 403) {
          setError("You do not have permission to view this delivery.");
        } else if (error.response.status === 404) {
          setError(
            "Delivery not found. It may have been deleted or you may not have permission to view it."
          );
        } else if (error.response.status === 500) {
          setError(
            "Server error. Please try again later or contact support if the problem persists."
          );
        } else if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError(
            `Error ${error.response.status}: Could not load delivery information`
          );
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        setError(
          "No response from server. Please check your internet connection and try again."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ff9800";
      case "in_progress":
        return "#2196f3";
      case "delivered":
        return "#4caf50";
      case "cancelled":
        return "#f44336";
      default:
        return "#666";
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Delivery Details</h2>
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-content loading">
            <p>Loading delivery details...</p>
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
            <h2>Delivery Details</h2>
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-content error">
            <p className="error-message">{error}</p>
            <button onClick={fetchDeliveryDetails} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!delivery) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container delivery-details"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Delivery #{delivery.id}</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">
          <div className="delivery-status-header">
            <div
              className="delivery-status-indicator"
              style={{ backgroundColor: getStatusColor(delivery.status) }}
            >
              <span>{delivery.status.replace("_", " ")}</span>
            </div>

            <div className="delivery-meta">
              <div className="meta-item">
                <FaCalendarAlt />
                <span>Created: {formatDate(delivery.created_at)}</span>
              </div>
              {delivery.tracking_code && (
                <div className="meta-item">
                  <FaBarcode />
                  <span>Tracking: {delivery.tracking_code}</span>
                </div>
              )}
              <div className="meta-item">
                <FaUser />
                <span>Customer: {delivery.user_name}</span>
              </div>
            </div>
          </div>

          <div className="delivery-details-grid">
            <div className="detail-card">
              <div className="detail-icon">
                <FaMapMarkedAlt />
              </div>
              <div className="detail-content">
                <h4>Pickup Address</h4>
                <p>{delivery.pickup_address}</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <FaMapMarkedAlt />
              </div>
              <div className="detail-content">
                <h4>Delivery Address</h4>
                <p>{delivery.delivery_address}</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <FaPhone />
              </div>
              <div className="detail-content">
                <h4>Contact Number</h4>
                <p>{delivery.contact_number}</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <FaWeight />
              </div>
              <div className="detail-content">
                <h4>Weight</h4>
                <p>{delivery.weight} kg</p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <FaMoneyBillWave />
              </div>
              <div className="detail-content">
                <h4>Price</h4>
                <p>
                  $
                  {typeof delivery.price === "number"
                    ? delivery.price.toFixed(2)
                    : parseFloat(delivery.price || 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <FaTruck />
              </div>
              <div className="detail-content">
                <h4>Shipping Method</h4>
                <p>
                  <span
                    className={`shipping-method-badge ${
                      delivery.shipping_method || "domestic"
                    }`}
                  >
                    {delivery.shipping_method === "air"
                      ? "Air Freight"
                      : delivery.shipping_method === "sea"
                      ? "Sea Freight"
                      : delivery.shipping_method === "truck"
                      ? "Truck Freight"
                      : "Domestic Delivery"}
                  </span>
                </p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <FaCalendarAlt />
              </div>
              <div className="detail-content">
                <h4>Estimated Arrival Date</h4>
                <p>
                  {delivery.estimated_arrival_date
                    ? formatDate(delivery.estimated_arrival_date)
                    : "Not set"}
                </p>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <FaCalendarAlt />
              </div>
              <div className="detail-content">
                <h4>Actual Arrival Date</h4>
                <p>
                  {delivery.actual_arrival_date ? (
                    <span className="actual-arrival-date">
                      {formatDate(delivery.actual_arrival_date)}
                    </span>
                  ) : delivery.status === "delivered" ? (
                    <span className="missing-actual-date">Not recorded</span>
                  ) : (
                    <span className="pending-arrival">Pending delivery</span>
                  )}
                </p>
              </div>
            </div>

            {delivery.notes && (
              <div className="detail-card notes">
                <div className="detail-icon">
                  <FaClipboardList />
                </div>
                <div className="detail-content">
                  <h4>Notes</h4>
                  <p>{delivery.notes}</p>
                </div>
              </div>
            )}
          </div>

          <div className="delivery-timeline">
            <h3>Delivery Timeline</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-icon completed"></div>
                <div className="timeline-content">
                  <p className="timeline-time">
                    {formatDate(delivery.created_at)}
                  </p>
                  <p className="timeline-text">Delivery created</p>
                </div>
              </div>

              {delivery.status === "in_progress" ||
              delivery.status === "delivered" ? (
                <div className="timeline-item">
                  <div className="timeline-icon completed"></div>
                  <div className="timeline-content">
                    <p className="timeline-time">
                      {formatDate(
                        new Date(
                          new Date(delivery.created_at).getTime() +
                            60 * 60 * 1000
                        )
                      )}
                    </p>
                    <p className="timeline-text">Package picked up</p>
                  </div>
                </div>
              ) : (
                <div className="timeline-item">
                  <div className="timeline-icon pending"></div>
                  <div className="timeline-content">
                    <p className="timeline-time">Pending</p>
                    <p className="timeline-text">Package pickup</p>
                  </div>
                </div>
              )}

              {delivery.status === "delivered" ? (
                <div className="timeline-item">
                  <div className="timeline-icon completed"></div>
                  <div className="timeline-content">
                    <p className="timeline-time">
                      {formatDate(
                        new Date(
                          new Date(delivery.created_at).getTime() +
                            3 * 60 * 60 * 1000
                        )
                      )}
                    </p>
                    <p className="timeline-text">Package delivered</p>
                  </div>
                </div>
              ) : delivery.status === "cancelled" ? (
                <div className="timeline-item">
                  <div className="timeline-icon cancelled"></div>
                  <div className="timeline-content">
                    <p className="timeline-time">
                      {formatDate(
                        new Date(
                          new Date(delivery.created_at).getTime() +
                            30 * 60 * 1000
                        )
                      )}
                    </p>
                    <p className="timeline-text">Delivery cancelled</p>
                  </div>
                </div>
              ) : (
                <div className="timeline-item">
                  <div className="timeline-icon pending"></div>
                  <div className="timeline-content">
                    <p className="timeline-time">
                      Estimated:{" "}
                      {formatDate(
                        new Date(
                          new Date(delivery.created_at).getTime() +
                            3 * 60 * 60 * 1000
                        )
                      )}
                    </p>
                    <p className="timeline-text">Package delivery</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button className="primary-btn">Update Status</button>
            <button
              className="secondary-btn"
              onClick={() => setShowPrintLabel(true)}
            >
              <FaPrint style={{ marginRight: "8px" }} /> Print Label
            </button>
          </div>

          {showPrintLabel && (
            <PrintableLabel
              delivery={delivery}
              onClose={() => setShowPrintLabel(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetailsModal;
