import React, { useState, useEffect } from "react";
import { FaGlobe, FaMapMarkerAlt, FaRoad } from "react-icons/fa";
import {
  getCountries,
  getCitiesByCountry,
  formatAddress,
} from "../services/locationService";
import "./AddressSelector.css";

const AddressSelector = ({
  label,
  value = "",
  onChange,
  required = false,
  placeholder = "Select address",
  icon: Icon = FaMapMarkerAlt,
}) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [street, setStreet] = useState("");
  const [availableCities, setAvailableCities] = useState([]);

  // Parse existing address value on component mount
  useEffect(() => {
    if (value && value.includes(",")) {
      const parts = value.split(",").map((part) => part.trim());
      if (parts.length >= 3) {
        const [streetPart, cityPart, countryPart] = parts;
        setStreet(streetPart);
        setSelectedCity(cityPart);
        setSelectedCountry(countryPart);
        setAvailableCities(getCitiesByCountry(countryPart));
      }
    }
  }, [value]);

  // Update available cities when country changes
  useEffect(() => {
    if (selectedCountry) {
      const cities = getCitiesByCountry(selectedCountry);
      setAvailableCities(cities);
      // Reset city if it's not available in the new country
      if (selectedCity && !cities.includes(selectedCity)) {
        setSelectedCity("");
      }
    } else {
      setAvailableCities([]);
      setSelectedCity("");
    }
  }, [selectedCountry]);

  // Update parent component when address changes
  useEffect(() => {
    if (selectedCountry && selectedCity && street) {
      const fullAddress = formatAddress(selectedCountry, selectedCity, street);
      onChange(fullAddress);
    } else if (!selectedCountry && !selectedCity && !street) {
      onChange("");
    }
  }, [selectedCountry, selectedCity, street, onChange]);

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleStreetChange = (e) => {
    setStreet(e.target.value);
  };

  const countries = getCountries();

  return (
    <div className="address-selector">
      <label className="address-label">
        <Icon /> {label} {required && <span className="required">*</span>}
      </label>

      <div className="address-inputs">
        {/* Country Selection */}
        <div className="address-field">
          <label htmlFor={`country-${label}`} className="field-label">
            <FaGlobe /> Country
          </label>
          <select
            id={`country-${label}`}
            value={selectedCountry}
            onChange={handleCountryChange}
            className="address-select"
            required={required}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* City Selection */}
        <div className="address-field">
          <label htmlFor={`city-${label}`} className="field-label">
            <FaMapMarkerAlt /> City
          </label>
          <select
            id={`city-${label}`}
            value={selectedCity}
            onChange={handleCityChange}
            className="address-select"
            disabled={!selectedCountry}
            required={required}
          >
            <option value="">Select City</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Street Input */}
        <div className="address-field">
          <label htmlFor={`street-${label}`} className="field-label">
            <FaRoad /> Street Address
          </label>
          <input
            type="text"
            id={`street-${label}`}
            value={street}
            onChange={handleStreetChange}
            placeholder="Enter street address"
            className="address-input"
            disabled={!selectedCity}
            required={required}
          />
        </div>
      </div>

      {/* Full Address Preview */}
      {selectedCountry && selectedCity && street && (
        <div className="address-preview">
          <strong>Full Address:</strong>{" "}
          {formatAddress(selectedCountry, selectedCity, street)}
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
