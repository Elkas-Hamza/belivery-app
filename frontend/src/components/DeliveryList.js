import React, { useState, useEffect } from "react";
import { FaAlignCenter, FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import api from "../services/api";
import DeliveryFormModal from "./DeliveryFormModal";
import ModifyDeliveryModal from "./ModifyDeliveryModal";
import "./DeliveryList.css";

const DeliveryList = ({ onViewDetails }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await api.get("/user");
        setIsAdmin(response.data.role === "admin");
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    };

    checkUserRole();
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const endpoint = isAdmin ? "/deliveries" : "/user/deliveries";
      const response = await api.get(endpoint);
      setDeliveries(response.data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (deliveryId, newStatus) => {
    try {
      await api.patch(`/deliveries/${deliveryId}/status`, {
        status: newStatus,
      });
      fetchDeliveries();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCancelDelivery = async (deliveryId) => {
    if (window.confirm("Are you sure you want to cancel this delivery?")) {
      try {
        const endpoint = isAdmin
          ? `/deliveries/${deliveryId}/status`
          : `/user/deliveries/${deliveryId}/cancel`;

        if (isAdmin) {
          await api.patch(endpoint, {
            status: "cancelled",
          });
        } else {
          await api.patch(endpoint);
        }

        fetchDeliveries();
      } catch (error) {
        console.error("Error cancelling delivery:", error);

        // Show user-friendly error message
        if (error.response?.status === 403) {
          alert("You don't have permission to cancel this delivery.");
        } else if (error.response?.status === 422) {
          alert(
            error.response.data.message || "This delivery cannot be cancelled."
          );
        } else {
          alert(
            "An error occurred while cancelling the delivery. Please try again."
          );
        }
      }
    }
  };

  const handleModifyDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowModifyModal(true);
  };

  const handleAddNewDelivery = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowModifyModal(false);
    setSelectedDelivery(null);
  };

  const handleDeliveryCreated = (newDelivery) => {
    // Refresh the deliveries list
    fetchDeliveries();
  };

  const handleDeliveryUpdated = (updatedDelivery) => {
    // Refresh the deliveries list
    fetchDeliveries();
  };

  if (loading) {
    return (
      <div className="delivery-list-container">
        <h2>{isAdmin ? "All Deliveries" : "My Deliveries"}</h2>
        <p>Loading...</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="delivery-list-container">
      <div className="delivery-list-header">
        <div className="header-left">
          <h2>{isAdmin ? "All Deliveries" : "My Deliveries"}</h2>
          <div className="delivery-count">
            {deliveries.length}{" "}
            {deliveries.length === 1 ? "delivery" : "deliveries"} found
          </div>
        </div>
        <button
          className="add-delivery-btn"
          onClick={handleAddNewDelivery}
          title="Add new delivery"
        >
          <FaPlus />
          Add Delivery
        </button>
      </div>

      {deliveries.length === 0 ? (
        <div className="no-deliveries">
          <p>No deliveries found. Create a new delivery to get started!</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="deliveries-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Pickup Address</th>
                <th>Delivery Address</th>
                <th>Contact</th>
                <th>Weight (kg)</th>
                <th>Price</th>
                <th>Created</th>
                <th>Date d'Arrivée</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr
                  key={delivery.id}
                  className={`delivery-row status-${delivery.status}`}
                >
                  <td data-label="ID">{delivery.id}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${delivery.status}`}>
                      {delivery.status.replace("_", " ")}
                    </span>
                  </td>
                  <td
                    className="truncate"
                    data-label="Pickup Address"
                    title={delivery.pickup_address}
                  >
                    {delivery.pickup_address}
                  </td>
                  <td
                    className="truncate"
                    data-label="Delivery Address"
                    title={delivery.delivery_address}
                  >
                    {delivery.delivery_address}
                  </td>
                  <td className="contact" data-label="Contact">
                    {delivery.contact_number}
                  </td>
                  <td className="weight" data-label="Weight">
                    {delivery.weight} kg
                  </td>
                  <td className="price" data-label="Price">
                    {delivery.price} DH
                  </td>
                  <td className="date" data-label="Created">
                    {formatDate(delivery.created_at)}
                  </td>
                  <td className="date" data-label="Date d'Arrivée">
                    {delivery.arrival_date
                      ? formatDate(delivery.arrival_date)
                      : "Non définie"}
                  </td>
                  <td
                    className="actions-cell"
                    style={{ alignContent: "center" }}
                    data-label="Actions"
                  >
                    <div className="table-actions">
                      {isAdmin && (
                        <select
                          value={delivery.status}
                          onChange={(e) =>
                            handleStatusChange(delivery.id, e.target.value)
                          }
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                      <div className="action-buttons">
                        <button
                          className="action-btn modify-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleModifyDelivery(delivery);
                          }}
                          title="Modify delivery"
                          disabled={
                            delivery.status === "cancelled" ||
                            delivery.status === "delivered"
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="action-btn cancel-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelDelivery(delivery.id);
                          }}
                          title="Delete delivery"
                          disabled={
                            delivery.status === "cancelled" ||
                            delivery.status === "delivered"
                          }
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <DeliveryFormModal
          onClose={handleCloseModal}
          onDeliveryCreated={handleDeliveryCreated}
        />
      )}

      {showModifyModal && selectedDelivery && (
        <ModifyDeliveryModal
          delivery={selectedDelivery}
          onClose={handleCloseModal}
          onDeliveryUpdated={handleDeliveryUpdated}
        />
      )}
    </div>
  );
};

export default DeliveryList;
