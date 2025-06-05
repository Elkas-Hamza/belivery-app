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

const ModifyDeliveryModal = ({ delivery, onClose, onDeliveryUpdated }) => {  const [formData, setFormData] = useState({
    pickup_address: delivery?.pickup_address || "",
    delivery_address: delivery?.delivery_address || "",
    contact_number: delivery?.contact_number || "",
    weight: delivery?.weight || "",
    price: delivery?.price || "",
    notes: delivery?.notes || "",
    arrival_date: delivery?.arrival_date ? delivery.arrival_date.split('T')[0] : "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [pickupCountry, setPickupCountry] = useState("");
  const [deliveryCountry, setDeliveryCountry] = useState("");
  const [shippingMethod, setShippingMethod] = useState("domestic");
  const [priceData, setPriceData] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState(null);
  const [calculationTimeout, setCalculationTimeout] = useState(null);

  // Extract country from address string
  const extractCountryFromAddress = (address) => {
    if (!address || !address.includes(",")) return "";
    const parts = address.split(",").map((part) => part.trim());
    return parts[parts.length - 1] || "";
  };

  // Initialize countries and shipping method based on existing addresses
  useEffect(() => {
    if (delivery) {
      const pickupCountryFromAddress = extractCountryFromAddress(
        delivery.pickup_address
      );
      const deliveryCountryFromAddress = extractCountryFromAddress(
        delivery.delivery_address
      );

      setPickupCountry(pickupCountryFromAddress);
      setDeliveryCountry(deliveryCountryFromAddress);

      // Determine shipping method
      if (
        pickupCountryFromAddress &&
        deliveryCountryFromAddress &&
        pickupCountryFromAddress !== deliveryCountryFromAddress
      ) {
        setShippingMethod("air"); // Default to air for international
      } else {
        setShippingMethod("domestic");
      }
    }
  }, [delivery]);

  // Calculate price when form data changes
  useEffect(() => {
    if (
      formData.pickup_address &&
      formData.delivery_address &&
      formData.weight
    ) {
      // Clear existing timeout
      if (calculationTimeout) {
        clearTimeout(calculationTimeout);
      }

      // Set new timeout for debounced calculation
      const timeout = setTimeout(() => {
        calculatePrice();
      }, 500);

      setCalculationTimeout(timeout);

      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }
  }, [
    formData.pickup_address,
    formData.delivery_address,
    formData.weight,
    shippingMethod,
  ]);

  const calculatePrice = async () => {
    try {
      setPriceLoading(true);
      setPriceError(null);      const result = await priceCalculationService.calculateFromAddresses(
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
        price: result.total,
        arrival_date: arrivalDate || prev.arrival_date, // Keep existing if calculation fails
      }));
    } catch (error) {
      console.error("Error calculating price:", error);
      setPriceError("Failed to calculate price");
    } finally {
      setPriceLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAddressChange = (type, address) => {
    setFormData((prev) => ({
      ...prev,
      [type]: address,
    }));

    // Update country when address changes
    if (type === "pickup_address") {
      setPickupCountry(extractCountryFromAddress(address));
    } else if (type === "delivery_address") {
      setDeliveryCountry(extractCountryFromAddress(address));
    }

    // Clear errors
    if (errors[type]) {
      setErrors((prev) => ({
        ...prev,
        [type]: "",
      }));
    }
  };

  const handleShippingMethodChange = (method) => {
    setShippingMethod(method);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pickup_address.trim()) {
      newErrors.pickup_address = "Pickup address is required";
    }

    if (!formData.delivery_address.trim()) {
      newErrors.delivery_address = "Delivery address is required";
    }

    if (!formData.contact_number.trim()) {
      newErrors.contact_number = "Contact number is required";
    }

    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = "Weight must be greater than 0";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.put(`/deliveries/${delivery.id}`, {
        pickup_address: formData.pickup_address,
        delivery_address: formData.delivery_address,
        contact_number: formData.contact_number,
        weight: parseFloat(formData.weight),
        price: parseFloat(formData.price),
        notes: formData.notes || null,
      });

      onDeliveryUpdated(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating delivery:", error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(
          "An error occurred while updating the delivery. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const showInternationalShipping =
    pickupCountry && deliveryCountry && pickupCountry !== deliveryCountry;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delivery-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Modify Delivery #{delivery?.id}</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="delivery-form">
          <div className="form-row">
            <div className="form-group">
              <label>
                <FaMapMarkerAlt /> Pickup Address *
              </label>
              <AddressSelector
                value={formData.pickup_address}
                onChange={(address) =>
                  handleAddressChange("pickup_address", address)
                }
                placeholder="Select pickup address"
                error={errors.pickup_address}
              />
            </div>

            <div className="form-group">
              <label>
                <FaMapMarkerAlt /> Delivery Address *
              </label>
              <AddressSelector
                value={formData.delivery_address}
                onChange={(address) =>
                  handleAddressChange("delivery_address", address)
                }
                placeholder="Select delivery address"
                error={errors.delivery_address}
              />
            </div>
          </div>

          {showInternationalShipping && (
            <div className="shipping-method-row">
              <ShippingMethodSelector
                selectedMethod={shippingMethod}
                onMethodChange={handleShippingMethodChange}
                fromCountry={pickupCountry}
                toCountry={deliveryCountry}
              />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>
                <FaPhoneAlt /> Contact Number *
              </label>
              <input
                type="tel"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleInputChange}
                placeholder="Enter contact number"
                className={errors.contact_number ? "error" : ""}
              />
              {errors.contact_number && (
                <span className="error-message">{errors.contact_number}</span>
              )}
            </div>

            <div className="form-group">
              <label>
                <FaWeightHanging /> Weight (kg) *
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Enter weight in kg"
                min="0"
                step="0.1"
                className={errors.weight ? "error" : ""}
              />
              {errors.weight && (
                <span className="error-message">{errors.weight}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>
              <FaCoins /> Calculated Price (DH) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price will be calculated automatically"
              min="0"
              step="0.01"
              className={errors.price ? "error" : ""}
              readOnly
            />
            {errors.price && (
              <span className="error-message">{errors.price}</span>
            )}
          </div>

          {(priceData || priceLoading || priceError) && (
            <PriceDisplay
              price={priceData?.total}
              breakdown={priceData?.breakdown}
              distance={priceData?.distance}
              loading={priceLoading}
              error={priceError}
            />          )}          <div className="form-group">
            <label>Date d'Arrivée Prévue</label>
            <input
              type="date"
              name="arrival_date"
              value={formData.arrival_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className={formData.arrival_date ? "calculated" : ""}
            />
            <small className="help-text">
              {formData.arrival_date 
                ? `Recalculé automatiquement basé sur la distance et méthode d'expédition. ${priceData?.distance ? `Distance: ${priceData.distance.toFixed(0)}km, Estimation: ${ArrivalDateService.getTransitTimeEstimate(priceData.distance, shippingMethod)}` : ''}`
                : "Sera recalculé automatiquement lors de la modification des adresses"
              }
            </small>
          </div>

          <div className="form-group">
            <label>
              <FaTruck /> Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Enter any additional notes or special instructions"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Delivery"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyDeliveryModal;
