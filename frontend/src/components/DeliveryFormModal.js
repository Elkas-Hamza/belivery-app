import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWeightHanging,
  FaCoins,
  FaTruck,
} from "react-icons/fa";
import api from "../services/api";
import AddressSelector from "./AddressSelector";
import ShippingMethodSelector from "./ShippingMethodSelector";
import PriceDisplay from "./PriceDisplay";
import priceCalculationService from "../services/priceCalculationService";
import ArrivalDateService from "../services/arrivalDateService";
import "./DeliveryFormModal.css";

const DeliveryFormModal = ({ onClose, onDeliveryCreated }) => {  const [formData, setFormData] = useState({
    pickup_address: "",
    delivery_address: "",
    contact_number: "",
    weight: "",
    price: "",
    notes: "",
    shipping_method: "air", // Default to air freight for international
    arrival_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pickupCountry, setPickupCountry] = useState("");
  const [deliveryCountry, setDeliveryCountry] = useState("");

  // Price calculation states
  const [priceData, setPriceData] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState(null);

  // Extract country from address string
  const extractCountryFromAddress = (address) => {
    if (!address || !address.includes(",")) return "";
    const parts = address.split(",").map((part) => part.trim());
    return parts[parts.length - 1] || "";
  };

  // Check if international shipping is needed
  const isInternationalShipping =
    pickupCountry && deliveryCountry && pickupCountry !== deliveryCountry;

  // Calculate price automatically when relevant data changes
  useEffect(() => {
    const calculatePrice = async () => {
      if (
        !formData.pickup_address ||
        !formData.delivery_address ||
        !formData.weight
      ) {
        setPriceData(null);
        setFormData((prev) => ({ ...prev, price: "" }));
        return;
      }

      if (parseFloat(formData.weight) <= 0) return;

      setPriceLoading(true);
      setPriceError(null);

      try {
        const shippingMethod = priceCalculationService.determineShippingMethod(
          pickupCountry,
          deliveryCountry,
          formData.shipping_method
        );        const result = await priceCalculationService.calculateFromAddresses(
          formData.pickup_address,
          formData.delivery_address,
          formData.weight,
          shippingMethod
        );

        // Calculate arrival date based on distance and shipping method
        const arrivalDate = ArrivalDateService.calculateArrivalDate(
          result.distance,
          shippingMethod
        );

        setPriceData(result);
        setFormData((prev) => ({ 
          ...prev, 
          price: result.price.toString(),
          arrival_date: arrivalDate || ""
        }));
      } catch (error) {
        console.error("Price calculation failed:", error);
        setPriceError(
          "Unable to calculate price automatically. Please enter manually."
        );
        setPriceData(null);
      } finally {
        setPriceLoading(false);
      }
    };

    // Debounce the calculation to avoid too many API calls
    const timeoutId = setTimeout(calculatePrice, 500);
    return () => clearTimeout(timeoutId);
  }, [
    formData.pickup_address,
    formData.delivery_address,
    formData.weight,
    formData.shipping_method,
    pickupCountry,
    deliveryCountry,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.pickup_address.trim()) {
      errors.pickup_address = "Pickup address is required";
    }

    if (!formData.delivery_address.trim()) {
      errors.delivery_address = "Delivery address is required";
    }

    if (!formData.contact_number.trim()) {
      errors.contact_number = "Contact number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.contact_number)) {
      errors.contact_number = "Please enter a valid phone number";
    }
    if (!formData.weight || formData.weight <= 0) {
      errors.weight = "Weight must be greater than 0";
    }

    // Check if price has been calculated
    if (!formData.price || formData.price <= 0) {
      errors.price =
        "Price calculation is required. Please ensure all fields are filled correctly.";
    }

    // Validate shipping method for international deliveries
    if (isInternationalShipping && !formData.shipping_method) {
      errors.shipping_method =
        "Please select a shipping method for international delivery";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
      return;
    }

    setLoading(true);
    setError(null);

    try {      const response = await api.post("/deliveries", {
        ...formData,
        weight: parseFloat(formData.weight),
        price: parseFloat(formData.price),
        arrival_date: formData.arrival_date || null,
      });

      if (onDeliveryCreated) {
        onDeliveryCreated(response.data);
      }
      onClose();
    } catch (error) {
      console.error("Error creating delivery:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create delivery. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="delivery-form-modal">
        <div className="modal-header">
          <h2>Create New Delivery</h2>
          <button className="close-button" onClick={onClose} type="button">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="delivery-form">
          {error && <div className="error-message">{error}</div>}{" "}
          <div className="form-row address-row">
            <div className="form-group address-group">
              <AddressSelector
                label="Pickup Address"
                value={formData.pickup_address}
                onChange={(address) => {
                  setFormData((prev) => ({ ...prev, pickup_address: address }));
                  setPickupCountry(extractCountryFromAddress(address));
                }}
                required={true}
                icon={FaTruck}
              />
            </div>

            <div className="form-group address-group">
              <AddressSelector
                label="Delivery Address"
                value={formData.delivery_address}
                onChange={(address) => {
                  setFormData((prev) => ({
                    ...prev,
                    delivery_address: address,
                  }));
                  setDeliveryCountry(extractCountryFromAddress(address));
                }}
                required={true}
                icon={FaMapMarkerAlt}
              />
            </div>
          </div>
          {/* Shipping Method Selector for International Deliveries */}
          <ShippingMethodSelector
            selectedMethod={formData.shipping_method}
            onMethodChange={(method) =>
              setFormData((prev) => ({ ...prev, shipping_method: method }))
            }
            pickupCountry={pickupCountry}
            deliveryCountry={deliveryCountry}
            visible={isInternationalShipping}
          />
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact_number">
                <FaPhoneAlt /> Contact Number *
              </label>
              <input
                type="tel"
                id="contact_number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleInputChange}
                placeholder="Enter contact number"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">
                <FaWeightHanging /> Weight (kg) *
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Enter weight in kg"
                min="0.1"
                step="0.1"
                required
              />
            </div>{" "}
          </div>
          {/* Price Display and Calculation */}
          <PriceDisplay
            price={priceData?.price}
            breakdown={priceData?.breakdown}
            distance={priceData?.distance}
            loading={priceLoading}
            error={priceError}
            className="modal-price-display"
          />
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">
                <FaCoins /> Calculated Price (DH) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                readOnly
                placeholder="Price will be calculated automatically"
                className="price-input-readonly"
                required
              />
              <small className="price-help-text">
                Price is calculated automatically based on weight, distance, and
                shipping method
              </small>
            </div>          </div>{" "}
          <div className="form-row">            <div className="form-group">
              <label htmlFor="arrival_date">Date d'Arrivée Prévue</label>
              <input
                type="date"
                id="arrival_date"
                name="arrival_date"
                value={formData.arrival_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={formData.arrival_date ? "calculated" : ""}
              />
              <small className="help-text">
                {formData.arrival_date 
                  ? `Calculé automatiquement basé sur la distance et méthode d'expédition. ${priceData?.distance ? `Distance: ${priceData.distance.toFixed(0)}km, Estimation: ${ArrivalDateService.getTransitTimeEstimate(priceData.distance, formData.shipping_method)}` : ''}`
                  : "Sera calculé automatiquement une fois les adresses et la méthode d'expédition sélectionnées"
                }
              </small>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Description (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes or description"
              rows="3"
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Delivery"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryFormModal;
