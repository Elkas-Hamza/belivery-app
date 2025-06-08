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
  const [availableCities, setAvailableCities] = useState([]);  // Parse existing address value on component mount
  useEffect(() => {
    if (value && value.includes(",")) {
      const parts = value.split(",").map((part) => part.trim());
      if (parts.length >= 3) {
        const [streetPart, cityPart, countryPart] = parts;
        
        // Check if the country exists in our location data (case insensitive)
        const countries = getCountries();
        const matchedCountry = countries.find(country => 
          country.toLowerCase() === countryPart.toLowerCase()
        );
        
        // Set country first
        const countryToSet = matchedCountry || countryPart;
        setSelectedCountry(countryToSet);
        
        // Get cities for the country
        const cities = matchedCountry ? getCitiesByCountry(matchedCountry) : [];
        setAvailableCities(cities);
        
        // Set city
        const matchedCity = cities.find(city => 
          city.toLowerCase() === cityPart.toLowerCase()
        );
        const cityToSet = matchedCity || cityPart;
        setSelectedCity(cityToSet);
        
        // Set street
        setStreet(streetPart);
      }
    } else if (!value) {
      // Clear all fields if value is empty
      setSelectedCountry("");
      setSelectedCity("");
      setStreet("");
      setAvailableCities([]);
    }
  }, [value]);
  // Update available cities when country changes
  useEffect(() => {
    if (selectedCountry) {
      const countries = getCountries();
      const isKnownCountry = countries.includes(selectedCountry);
      
      if (isKnownCountry) {
        const cities = getCitiesByCountry(selectedCountry);
        setAvailableCities(cities);
        // Only reset city if it's not valid for the new country and we have a predefined list
        if (selectedCity && !cities.includes(selectedCity)) {
          // Don't reset if it's a custom city, just add it to available cities
          setAvailableCities([...cities]);
        }
      } else {
        // For custom countries, keep any existing city
        setAvailableCities([]);
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
          </label>          <select
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
            {/* Show the selected country even if it's not in our predefined list */}
            {selectedCountry && !countries.includes(selectedCountry) && (
              <option key={selectedCountry} value={selectedCountry}>
                {selectedCountry} (Custom)
              </option>
            )}
          </select>
        </div>

        {/* City Selection */}
        <div className="address-field">
          <label htmlFor={`city-${label}`} className="field-label">
            <FaMapMarkerAlt /> City
          </label>          <select
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
            {/* Show the selected city even if it's not in our predefined list */}
            {selectedCity && !availableCities.includes(selectedCity) && (
              <option key={selectedCity} value={selectedCity}>
                {selectedCity} (Custom)
              </option>
            )}
          </select>
        </div>

        {/* Street Input */}
        <div className="address-field">
          <label htmlFor={`street-${label}`} className="field-label">
            <FaRoad /> Street Address
          </label>          <input
            type="text"
            id={`street-${label}`}
            value={street}
            onChange={handleStreetChange}
            placeholder="Enter street address"
            className="address-input"
            disabled={!selectedCountry || !selectedCity}
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
