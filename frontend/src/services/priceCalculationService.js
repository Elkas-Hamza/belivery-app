import api from "./api";

export const priceCalculationService = {
  /**
   * Calculate price from full addresses
   */
  async calculateFromAddresses(
    pickupAddress,
    deliveryAddress,
    weight,
    shippingMethod = "domestic"
  ) {
    try {
      const response = await api.post("/calculate-price", {
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
        weight: parseFloat(weight),
        shipping_method: shippingMethod,
      });
      return response.data;
    } catch (error) {
      console.error("Error calculating price from addresses:", error);
      throw error;
    }
  },

  /**
   * Calculate price from city names (fallback method)
   */
  async calculateFromCities(
    pickupCity,
    deliveryCity,
    weight,
    shippingMethod = "domestic"
  ) {
    try {
      const response = await api.post("/calculate-price-cities", {
        pickup_city: pickupCity,
        delivery_city: deliveryCity,
        weight: parseFloat(weight),
        shipping_method: shippingMethod,
      });
      return response.data;
    } catch (error) {
      console.error("Error calculating price from cities:", error);
      throw error;
    }
  },

  /**
   * Extract country from address string
   */
  extractCountryFromAddress(address) {
    if (!address || !address.includes(",")) return "";
    const parts = address.split(",").map((part) => part.trim());
    return parts[parts.length - 1] || "";
  },

  /**
   * Extract city from address string
   */
  extractCityFromAddress(address) {
    if (!address || !address.includes(",")) return address;
    const parts = address.split(",").map((part) => part.trim());
    if (parts.length >= 2) {
      return parts[parts.length - 2]; // City is usually second-to-last
    }
    return address;
  },
  /**
   * Determine shipping method based on countries
   */
  determineShippingMethod(
    pickupCountry,
    deliveryCountry,
    selectedMethod = "air"
  ) {
    if (!pickupCountry || !deliveryCountry) return "truck";
    if (pickupCountry === deliveryCountry) return "truck"; // Use truck for local deliveries
    return selectedMethod; // Use selected method for international
  },
  /**
   * Format price breakdown for display
   */
  formatPriceBreakdown(breakdown) {
    if (!breakdown) return null;

    return {
      basePrice: `${breakdown.base_price} DH`,
      weightFee: `${breakdown.weight_fee} DH`,
      distanceFee: `${breakdown.distance_fee} DH`,
      subtotal: `${breakdown.subtotal} DH`,
      shippingMethod: breakdown.shipping_method,
      shippingMultiplier: breakdown.shipping_multiplier,
      shippingFee: `${breakdown.shipping_fee} DH`,
      total: `${breakdown.total} DH`,
    };
  },

  /**
   * Get shipping method details
   */
  getShippingMethodDetails() {
    return {
      air: {
        name: "Air Freight",
        multiplier: 2.5,
        description: "Fast delivery by air (3-7 days)",
        extraCost: "150%",
      },
      sea: {
        name: "Sea Freight",
        multiplier: 1.2,
        description: "Economical delivery by sea (15-30 days)",
        extraCost: "20%",
      },
      truck: {
        name: "Truck Freight",
        multiplier: 1.5,
        description: "Land-based delivery by truck (5-14 days)",
        extraCost: "50%",
      },
      domestic: {
        name: "Domestic Delivery",
        multiplier: 1.0,
        description: "Standard domestic delivery",
        extraCost: "0%",
      },
    };
  },
};

export default priceCalculationService;
