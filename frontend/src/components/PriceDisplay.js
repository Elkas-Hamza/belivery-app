import React from "react";
import {
  FaWeightHanging,
  FaRoute,
  FaCalculator,
  FaShip,
  FaPlane,
  FaCoins,
} from "react-icons/fa";
import "./PriceDisplay.css";

const PriceDisplay = ({
  price,
  breakdown,
  distance,
  loading = false,
  error = null,
  className = "",
}) => {
  if (loading) {
    return (
      <div className={`price-display loading ${className}`}>
        <div className="price-loading">
          <FaCalculator className="loading-icon" />
          <span>Calculating price...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`price-display error ${className}`}>
        <div className="price-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!price || !breakdown) {
    return (
      <div className={`price-display empty ${className}`}>
        <div className="price-empty">
          <FaCalculator />
          <span>Enter details to see price calculation</span>
        </div>
      </div>
    );
  }

  const getShippingIcon = (method) => {
    switch (method) {
      case "air":
        return <FaPlane />;
      case "sea":
        return <FaShip />;
      default:
        return <FaRoute />;
    }
  };

  const getShippingLabel = (method) => {
    switch (method) {
      case "air":
        return "Air Freight";
      case "sea":
        return "Sea Freight";
      default:
        return "Domestic Delivery";
    }
  };
  return (
    <div className={`price-display ${className}`}>
      <div className="price-header">
        <div className="total-price">
          <FaCoins />
          <span className="price-amount">{price} DH</span>
        </div>
        {distance && (
          <div className="distance-info">
            <FaRoute />
            <span>{distance} km</span>
          </div>
        )}
      </div>      <div className="price-breakdown">
        <h4>Price Breakdown</h4>{" "}
        {breakdown.base_price > 0 && (
          <div className="breakdown-item">
            <span className="item-label">
              <FaCalculator /> Base Price
            </span>
            <span className="item-value">{breakdown.base_price} DH</span>
          </div>
        )}
        <div className="breakdown-item">
          <span className="item-label">
            <FaWeightHanging /> Weight Fee
          </span>
          <span className="item-value">{breakdown.weight_fee} DH</span>
        </div>
        <div className="breakdown-item">
          <span className="item-label">
            <FaRoute /> Distance Fee
          </span>
          <span className="item-value">{breakdown.distance_fee} DH</span>
        </div>
        <div className="breakdown-subtotal">
          <span className="item-label">Subtotal</span>
          <span className="item-value">{breakdown.subtotal} DH</span>
        </div>
        {breakdown.shipping_method !== "domestic" && (
          <>
            {" "}
            <div className="breakdown-item shipping">
              <span className="item-label">
                {getShippingIcon(breakdown.shipping_method)}
                {getShippingLabel(breakdown.shipping_method)}
              </span>
              <span className="item-value">
                +{breakdown.shipping_fee} DH
                <small>
                  ({Math.round((breakdown.shipping_multiplier - 1) * 100)}%)
                </small>
              </span>
            </div>
          </>
        )}{" "}
        <div className="breakdown-total">
          <span className="item-label">
            <FaCoins /> Total Price
          </span>
          <span className="item-value">{breakdown.total} DH</span>
        </div>
      </div>
    </div>
  );
};

export default PriceDisplay;
