import React from "react";
import { FaPlane, FaShip, FaTruck, FaClock, FaDollarSign } from "react-icons/fa";
import "./ShippingMethodSelector.css";

const ShippingMethodSelector = ({
  selectedMethod,
  onMethodChange,
  pickupCountry,
  deliveryCountry,
  visible = false,
}) => {
  if (!visible || pickupCountry === deliveryCountry) {
    return null;
  }
  const shippingMethods = [
    {
      id: "air",
      name: "Air Freight",
      icon: FaPlane,
      description: "Fast delivery by air",
      estimatedTime: "3-7 days",
      priceMultiplier: 2.5,
      features: ["Fastest option", "Tracked shipment", "Insurance included"],
    },
    {
      id: "sea",
      name: "Sea Freight",
      icon: FaShip,
      description: "Economical delivery by sea",
      estimatedTime: "15-30 days",
      priceMultiplier: 1.2,
      features: ["Most economical", "Large capacity", "Eco-friendly"],
    },
    {
      id: "truck",
      name: "Truck Freight",
      icon: FaTruck,
      description: "Land-based delivery by truck",
      estimatedTime: "5-14 days",
      priceMultiplier: 1.5,
      features: ["Door-to-door", "Land routes", "Moderate cost"],
    },
  ];

  return (
    <div className="shipping-method-selector">
      <div className="shipping-header">
        <h3>International Shipping Method</h3>
        <p>
          Choose your preferred shipping method for delivery from{" "}
          <strong>{pickupCountry}</strong> to <strong>{deliveryCountry}</strong>
        </p>
      </div>

      <div className="shipping-methods">
        {shippingMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <div
              key={method.id}
              className={`shipping-method ${
                selectedMethod === method.id ? "selected" : ""
              }`}
              onClick={() => onMethodChange(method.id)}
            >
              <div className="method-header">
                <div className="method-icon">
                  <IconComponent />
                </div>
                <div className="method-info">
                  <h4>{method.name}</h4>
                  <p>{method.description}</p>
                </div>
                <div className="method-details">
                  <div className="time-estimate">
                    <FaClock />
                    <span>{method.estimatedTime}</span>
                  </div>
                  <div className="price-info">
                    <FaDollarSign />
                    <span>
                      +{((method.priceMultiplier - 1) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="method-features">
                {method.features.map((feature, index) => (
                  <span key={index} className="feature-tag">
                    {feature}
                  </span>
                ))}
              </div>

              <div className="selection-indicator">
                <div className="radio-button">
                  {selectedMethod === method.id && (
                    <div className="radio-checked"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShippingMethodSelector;
