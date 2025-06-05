// Arrival Date Calculation Service
class ArrivalDateService {
  // Base transit times in days for different shipping methods
  static TRANSIT_TIMES = {
    domestic: {
      base: 1, // 1-3 days for domestic
      perKm: 0.001, // Additional time per km
    },
    air: {
      base: 3, // 3-7 days for air freight
      perKm: 0.002,
    },
    sea: {
      base: 14, // 14-30 days for sea freight
      perKm: 0.01,
    },
    truck: {
      base: 5, // 5-10 days for truck
      perKm: 0.005,
    },
  };

  /**
   * Calculate estimated arrival date based on distance and shipping method
   * @param {number} distance - Distance in kilometers
   * @param {string} shippingMethod - Shipping method (domestic, air, sea, truck)
   * @param {Date} startDate - Start date (default: today)
   * @returns {string} - ISO date string (YYYY-MM-DD)
   */
  static calculateArrivalDate(
    distance,
    shippingMethod = "domestic",
    startDate = new Date()
  ) {
    if (!distance || distance <= 0) {
      return null;
    }

    const method = shippingMethod.toLowerCase();
    const transitConfig =
      this.TRANSIT_TIMES[method] || this.TRANSIT_TIMES.domestic;

    // Calculate base transit time + distance-based addition
    let transitDays = transitConfig.base + distance * transitConfig.perKm;

    // Add some randomness for realism (±20%)
    const variance = transitDays * 0.2;
    transitDays = transitDays + (Math.random() * variance * 2 - variance);

    // Round to nearest day and ensure minimum of 1 day
    transitDays = Math.max(1, Math.round(transitDays));

    // Calculate arrival date
    const arrivalDate = new Date(startDate);
    arrivalDate.setDate(arrivalDate.getDate() + transitDays);

    // Skip weekends for business deliveries (move to next Monday if weekend)
    if (method === "domestic" || method === "truck") {
      while (arrivalDate.getDay() === 0 || arrivalDate.getDay() === 6) {
        arrivalDate.setDate(arrivalDate.getDate() + 1);
      }
    }

    return arrivalDate.toISOString().split("T")[0];
  }

  /**
   * Get human-readable transit time estimate
   * @param {number} distance - Distance in kilometers
   * @param {string} shippingMethod - Shipping method
   * @returns {string} - Human-readable estimate
   */
  static getTransitTimeEstimate(distance, shippingMethod = "domestic") {
    if (!distance || distance <= 0) {
      return "Unknown";
    }

    const method = shippingMethod.toLowerCase();
    const transitConfig =
      this.TRANSIT_TIMES[method] || this.TRANSIT_TIMES.domestic;

    const minDays = Math.max(
      1,
      Math.floor(transitConfig.base + distance * transitConfig.perKm * 0.8)
    );
    const maxDays = Math.max(
      minDays + 1,
      Math.ceil(transitConfig.base + distance * transitConfig.perKm * 1.2)
    );

    if (minDays === maxDays) {
      return `${minDays} day${minDays > 1 ? "s" : ""}`;
    }

    return `${minDays}-${maxDays} days`;
  }

  /**
   * Determine shipping method based on countries
   * @param {string} pickupCountry
   * @param {string} deliveryCountry
   * @param {string} preferredMethod
   * @returns {string}
   */
  static determineShippingMethod(
    pickupCountry,
    deliveryCountry,
    preferredMethod = "air"
  ) {
    if (!pickupCountry || !deliveryCountry) {
      return "domestic";
    }

    // Same country = domestic
    if (pickupCountry.toLowerCase() === deliveryCountry.toLowerCase()) {
      return "domestic";
    }

    // Different countries = international, use preferred method
    return preferredMethod || "air";
  }
}

export default ArrivalDateService;
