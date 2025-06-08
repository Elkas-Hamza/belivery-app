import React from "react";
import { FaMapMarkerAlt, FaWeight, FaTruck } from "react-icons/fa";
import "./PrintStyles.css";

const PrintableLabel = ({ delivery, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAddress = (address) => {
    // Simple address formatter - in a real app, you would parse the address properly
    const parts = address.split(",");
    if (parts.length > 1) {
      return (
        <>
          <p>{parts[0].trim()}</p>
          <p>{parts.slice(1).join(",").trim()}</p>
        </>
      );
    }
    return <p>{address}</p>;
  };

  return (
    <div className="print-overlay" onClick={onClose}>
      <div className="print-container" onClick={(e) => e.stopPropagation()}>
        <div className="print-header no-print">
          <h2>Delivery Label</h2>
          <div className="print-actions">
            <button
              className="primary-btn"
              onClick={() => {
                // Set up print environment
                document.title = `Delivery Label #${delivery.id}`;
                window.print();
              }}
            >
              Print Now
            </button>
            <button className="secondary-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <div className="delivery-label">
          <div className="label-header">
            <div className="company-logo">
              <FaTruck /> FastDelivery
            </div>
            <div className="tracking-info">
              <div className="tracking-number">
                <strong>Tracking #:</strong>{" "}
                {delivery.tracking_code ||
                  `FD${delivery.id}${Math.floor(Math.random() * 10000)}`}
              </div>
              <div className="barcode">
                *
                {delivery.tracking_code ||
                  `FD${delivery.id}${Math.floor(Math.random() * 10000)}`}
                *
              </div>
            </div>
          </div>

          <div className="label-body">
            <div className="label-section">
              <h3>Ship From</h3>
              <div className="address-block">
                <p className="name">FastDelivery Warehouse</p>
                {formatAddress(delivery.pickup_address)}
              </div>

              <h3>Ship To</h3>
              <div className="address-block">
                <p className="name">{delivery.user_name}</p>
                {formatAddress(delivery.delivery_address)}
                <p>
                  <strong>Contact:</strong> {delivery.contact_number}
                </p>
              </div>
            </div>

            <div className="label-section">
              <h3>Shipment Information</h3>
              <div className="status-badge-print status-badge-print-{delivery.status}">
                {delivery.status.replace("_", " ")}
              </div>

              <div className="label-details">
                <div className="detail-item">
                  <h4>Weight</h4>
                  <p>{delivery.weight} kg</p>
                </div>

                <div className="detail-item">
                  <h4>Shipping Cost</h4>
                  <p>
                    $
                    {typeof delivery.price === "number"
                      ? delivery.price.toFixed(2)
                      : parseFloat(delivery.price || 0).toFixed(2)}
                  </p>
                </div>

                <div className="detail-item">
                  <h4>Ship Date</h4>
                  <p>{formatDate(delivery.created_at)}</p>
                </div>
              </div>

              <div className="qr-code">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${
                    delivery.tracking_code || `FD${delivery.id}`
                  }`}
                  alt="QR Code"
                />
              </div>

              {delivery.notes && (
                <>
                  <h3>Special Instructions</h3>
                  <p>{delivery.notes}</p>
                </>
              )}
            </div>
          </div>

          <div className="label-footer">
            <p>
              Thank you for shipping with FastDelivery! For customer service,
              please call +1-800-FAST-DEL
            </p>
            <p>
              Order #: {delivery.id} • Processed on{" "}
              {formatDate(delivery.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableLabel;
