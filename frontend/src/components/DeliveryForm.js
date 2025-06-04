import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './DeliveryForm.css';
import { FiMapPin, FiTruck, FiLoader, FiInfo } from 'react-icons/fi';
import { useTranslation } from '../contexts/TranslationContext';

const DeliveryForm = ({ onDeliveryCreated }) => {
  // Get translations and currency formatter
  const { t, formatCurrency } = useTranslation();
  const [formData, setFormData] = useState({
    pickup_address: '',
    pickup_city: '',
    pickup_zip: '',
    delivery_address: '',
    delivery_city: '',
    delivery_zip: '',
    contact_number: '',
    weight: '',
    price: '',
    notes: ''
  });
  const [priceInfo, setPriceInfo] = useState({
    distance: null,
    price: null,
    breakdown: null
  });
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [cities, setCities] = useState([]);
  const [postalCodes, setPostalCodes] = useState({});
  const [error, setError] = useState(null);
  
  // Fetch cities and postal codes when component mounts
  useEffect(() => {
    fetchCities();
    fetchPostalCodes();
  }, []);
  
  const fetchCities = async () => {
    try {
      const response = await api.get('/cities');
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setError('Unable to load city data. Please try again later.');
    }
  };
  
  const fetchPostalCodes = async () => {
    try {
      const response = await api.get('/cities/postal-codes');
      setPostalCodes(response.data);
    } catch (error) {
      console.error('Error fetching postal codes:', error);
    }
  };

  // Helper for formatting Moroccan phone numbers
  const formatMoroccanPhoneNumber = (input) => {
    // Allow + and digits only
    let cleaned = input.replace(/[^\d+]/g, '');
    
    // Handle different input formats
    if (cleaned.startsWith('+212')) {
      // Already has the country code with +
      return cleaned;
    } else if (cleaned.startsWith('212')) {
      // Has country code without +
      return '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      // Starts with 0 (Moroccan format)
      return '+212' + cleaned.substring(1);
    } else if (cleaned.length > 0) {
      // Assume it's the number without country code or leading 0
      return '+212' + cleaned;
    }
    
    return cleaned;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number if the field is contact_number
    if (name === 'contact_number') {
      // Allow direct typing but format when focus leaves the field
      const formattedNumber = value.startsWith('+212') ? value : value;
      setFormData(prev => ({
        ...prev,
        [name]: formattedNumber
      }));
    } else {
      // Set the updated form data
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Auto-fill postal code when city is selected
      if (name === 'pickup_city' && postalCodes[value]) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          pickup_zip: postalCodes[value]
        }));
      } else if (name === 'delivery_city' && postalCodes[value]) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          delivery_zip: postalCodes[value]
        }));
      }
    }

    // Calculate price when pickup city, delivery city and weight are filled
    if (['pickup_city', 'delivery_city', 'weight'].includes(name)) {
      const updatedData = { ...formData, [name]: value };
      if (updatedData.pickup_city && updatedData.delivery_city && updatedData.weight) {
        calculatePrice(updatedData);
      }
    }
  };

  const calculatePrice = async (data = formData) => {
    if (!data.pickup_city || !data.delivery_city || !data.weight) {
      return;
    }
    
    setCalculating(true);
    try {
      const response = await api.post('/calculate-price', {
        pickup_city: data.pickup_city,
        delivery_city: data.delivery_city,
        weight: data.weight
      });
      
      setPriceInfo(response.data);
      setFormData(prev => ({
        ...prev,
        price: response.data.price
      }));
    } catch (error) {
      console.error('Error calculating price:', error);
      setError('Unable to calculate price. Please try again.');
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/deliveries', formData);
      onDeliveryCreated(response.data);
      setFormData({
        pickup_address: '',
        pickup_city: '',
        pickup_zip: '',
        delivery_address: '',
        delivery_city: '',
        delivery_zip: '',
        contact_number: '',
        weight: '',
        price: '',
        notes: ''
      });
      setPriceInfo({
        distance: null,
        price: null,
        breakdown: null
      });
    } catch (error) {
      console.error('Error creating delivery:', error);
      setError('Error creating delivery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delivery-form-container">
      <h2>{t.deliveryForm.title}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="delivery-form">
        <h3>{t.deliveryForm.pickup.title}</h3>
        <div className="address-fields">
          <div className="form-group">
            <label htmlFor="pickup_address">{t.deliveryForm.pickup.address}</label>
            <input
              type="text"
              id="pickup_address"
              name="pickup_address"
              placeholder={t.deliveryForm.pickup.addressPlaceholder}
              value={formData.pickup_address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pickup_city">{t.deliveryForm.pickup.city}</label>
              <div className="select-wrapper">
                <select
                  id="pickup_city"
                  name="pickup_city"
                  value={formData.pickup_city || ''}
                  onChange={handleChange}
                  required
                  className={formData.pickup_city ? 'has-value' : ''}
                >
                  <option value="">{t.deliveryForm.pickup.cityPlaceholder}</option>
                  {cities.map(city => (
                    <option key={`pickup-${city}`} value={city}>{city}</option>
                  ))}
                </select>
                <FiMapPin className="select-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="pickup_zip">{t.deliveryForm.pickup.postalCode}</label>
              <input
                type="text"
                id="pickup_zip"
                name="pickup_zip"
                placeholder={t.deliveryForm.pickup.postalCodePlaceholder}
                value={formData.pickup_zip}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <h3>{t.deliveryForm.delivery.title}</h3>
        <div className="address-fields">
          <div className="form-group">
            <label htmlFor="delivery_address">{t.deliveryForm.delivery.address}</label>
            <input
              type="text"
              id="delivery_address"
              name="delivery_address"
              placeholder={t.deliveryForm.delivery.addressPlaceholder}
              value={formData.delivery_address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="delivery_city">{t.deliveryForm.delivery.city}</label>
              <div className="select-wrapper">
                <select
                  id="delivery_city"
                  name="delivery_city"
                  value={formData.delivery_city || ''}
                  onChange={handleChange}
                  required
                  className={formData.delivery_city ? 'has-value' : ''}
                >
                  <option value="">{t.deliveryForm.delivery.cityPlaceholder}</option>
                  {cities.map(city => (
                    <option key={`delivery-${city}`} value={city}>{city}</option>
                  ))}
                </select>
                <FiMapPin className="select-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="delivery_zip">{t.deliveryForm.delivery.postalCode}</label>
              <input
                type="text"
                id="delivery_zip"
                name="delivery_zip"
                placeholder={t.deliveryForm.delivery.postalCodePlaceholder}
                value={formData.delivery_zip}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        
        <h3>{t.deliveryForm.package.title}</h3>
        
        <div className="form-group">
          <label htmlFor="contact_number">{t.deliveryForm.contact.number}</label>
          <input
            type="tel"
            id="contact_number"
            name="contact_number"
            placeholder={t.deliveryForm.contact.numberPlaceholder}
            pattern="(\+212|0)[5-7][0-9]{8}"
            title="Veuillez entrer un numéro de téléphone marocain valide (format : +212 6XX XX XX XX ou 06XX XX XX XX)"
            value={formData.contact_number}
            onChange={handleChange}
            onBlur={(e) => {
              const formattedNumber = formatMoroccanPhoneNumber(e.target.value);
              setFormData(prev => ({
                ...prev,
                contact_number: formattedNumber
              }));
            }}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight">{t.deliveryForm.package.weight}</label>
          <input
            type="number"
            id="weight"
            name="weight"
            placeholder={t.deliveryForm.package.weightPlaceholder}
            value={formData.weight}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">{t.deliveryForm.package.notes}</label>
          <textarea
            id="notes"
            name="notes"
            placeholder={t.deliveryForm.package.notesPlaceholder}
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        {formData.pickup_city && formData.delivery_city && (
          <div className="distance-indicator">
            <FiTruck className="distance-icon" />
            <span>
              {t.deliveryForm.price.distance} <strong>{formData.pickup_city}</strong> {t.deliveryForm.price.to} <strong>{formData.delivery_city}</strong>
              {priceInfo.distance && <span>: <strong>{priceInfo.distance.toFixed(0)} km</strong></span>}
              {calculating && (
                <span className="calculating-badge">
                  <FiLoader className="calculating-spinner" /> {t.deliveryForm.price.calculating}
                </span>
              )}
            </span>
          </div>
        )}

        {priceInfo.price && (
          <div className="price-breakdown">
            <h3>{t.deliveryForm.price.breakdown}</h3>
            <p>{t.deliveryForm.price.basePrice}: {formatCurrency(priceInfo.breakdown.base_price)}</p>
            <p>{t.deliveryForm.price.weightPrice}: {formatCurrency(priceInfo.breakdown.weight_price)} ({formData.weight} kg)</p>
            <p>{t.deliveryForm.price.distancePrice}: {formatCurrency(priceInfo.breakdown.distance_price)} ({priceInfo.distance.toFixed(0)} km)</p>
            <h4>{t.deliveryForm.price.totalPrice}: {formatCurrency(priceInfo.price)}</h4>
            
            <div className="delivery-estimate">
              <FiInfo className="info-icon" />
              <p>{t.deliveryForm.price.estimatedTime}: {Math.ceil(priceInfo.distance / 300 * 24)} {t.deliveryForm.price.hours}</p>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? t.deliveryForm.price.calculating : t.deliveryForm.submit}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryForm;
