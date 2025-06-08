<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;
use App\Data\MoroccanCities;
use App\Models\CityDistance;
use App\Models\CountryDistance;

class PriceCalculator
{
    public const BASE_PRICE_DOMESTIC = 0.00; // No base price for domestic delivery
    public const BASE_PRICE_INTERNATIONAL = 50.00; // Base price for international delivery in MAD

    // Domestic rates
    public const WEIGHT_RATE_DOMESTIC = 2.00; // Price per kg for domestic
    public const DISTANCE_RATE_DOMESTIC = 0.50; // Price per km for domestic

    // International rates
    public const WEIGHT_RATE_INTERNATIONAL = 30.00; // Price per kg for international
    public const DISTANCE_RATE_INTERNATIONAL = 0.10; // Price per km for international

    // International shipping multipliers
    public const SHIPPING_MULTIPLIERS = [
        'air' => 2.5,
        'sea' => 1.2,
        'truck' => 1.5,
        'domestic' => 1.0
    ];

    public function calculatePrice(float $weight, float $distance, string $shippingMethod = 'domestic'): float
    {
        // Determine base price and rates based on shipping method
        if ($shippingMethod === 'domestic') {
            $basePrice = self::BASE_PRICE_DOMESTIC;
            $weightRate = self::WEIGHT_RATE_DOMESTIC;
            $distanceRate = self::DISTANCE_RATE_DOMESTIC;
        } else {
            $basePrice = self::BASE_PRICE_INTERNATIONAL;
            $weightRate = self::WEIGHT_RATE_INTERNATIONAL;
            $distanceRate = self::DISTANCE_RATE_INTERNATIONAL;
        }

        // Calculate weight-based price
        $weightPrice = $weight * $weightRate;

        // Calculate distance-based price
        $distancePrice = $distance * $distanceRate;

        // Calculate base total
        $baseTotal = $basePrice + $weightPrice + $distancePrice;

        // Apply shipping method multiplier
        $multiplier = self::SHIPPING_MULTIPLIERS[$shippingMethod] ?? self::SHIPPING_MULTIPLIERS['domestic'];
        $totalPrice = $baseTotal * $multiplier;

        // Round to 2 decimal places
        return round($totalPrice, 2);
    }

    public function calculatePriceFromAddresses(string $pickupAddress, string $deliveryAddress, float $weight, string $shippingMethod = 'domestic'): array
    {
        // Extract location information to determine optimal shipping method
        $fromInfo = $this->extractLocationInfo($pickupAddress);
        $toInfo = $this->extractLocationInfo($deliveryAddress);

        // Auto-determine shipping method for same-country deliveries
        if ($fromInfo['country'] === $toInfo['country'] && $shippingMethod === 'domestic') {
            $shippingMethod = 'truck'; // Use truck for local deliveries
        }

        $distance = $this->calculateDistance($pickupAddress, $deliveryAddress, $shippingMethod);
        $price = $this->calculatePrice($weight, $distance, $shippingMethod);

        return [
            'price' => $price,
            'distance' => $distance,
            'breakdown' => $this->getPriceBreakdown($weight, $distance, $shippingMethod)
        ];
    }

    public function getPriceBreakdown(float $weight, float $distance, string $shippingMethod = 'domestic'): array
    {
        // Determine base price and rates based on shipping method
        if ($shippingMethod === 'domestic') {
            $basePrice = self::BASE_PRICE_DOMESTIC;
            $weightRate = self::WEIGHT_RATE_DOMESTIC;
            $distanceRate = self::DISTANCE_RATE_DOMESTIC;
        } else {
            $basePrice = self::BASE_PRICE_INTERNATIONAL;
            $weightRate = self::WEIGHT_RATE_INTERNATIONAL;
            $distanceRate = self::DISTANCE_RATE_INTERNATIONAL;
        }

        $weightPrice = $weight * $weightRate;
        $distancePrice = $distance * $distanceRate;
        $subtotal = $basePrice + $weightPrice + $distancePrice;

        $multiplier = self::SHIPPING_MULTIPLIERS[$shippingMethod] ?? self::SHIPPING_MULTIPLIERS['domestic'];
        $shippingFee = $subtotal * ($multiplier - 1);
        $total = $subtotal + $shippingFee;

        return [
            'base_price' => round($basePrice, 2),
            'weight_fee' => round($weightPrice, 2),
            'distance_fee' => round($distancePrice, 2),
            'subtotal' => round($subtotal, 2),
            'shipping_method' => $shippingMethod,
            'shipping_multiplier' => $multiplier,
            'shipping_fee' => round($shippingFee, 2),
            'total' => round($total, 2)
        ];
    }

    public function calculateDistance(string $pickupAddress, string $deliveryAddress, string $shippingMethod = 'domestic'): float
    {
        // Extract city and country information from addresses
        $fromInfo = $this->extractLocationInfo($pickupAddress);
        $toInfo = $this->extractLocationInfo($deliveryAddress);

        // If both locations are in the same country (domestic shipping)
        if ($fromInfo['country'] === $toInfo['country'] && $fromInfo['country'] === 'Morocco') {
            $distance = CityDistance::getDistance(
                $fromInfo['city'],
                $toInfo['city'],
                $fromInfo['country'],
                $toInfo['country']
            );

            if ($distance !== null) {
                return $distance;
            }

            // Fallback to static matrix for Moroccan cities if not in database
            $staticDistance = MoroccanCities::getDistance($fromInfo['city'], $toInfo['city']);
            if ($staticDistance !== null) {
                return $staticDistance;
            }
        }

        // For international shipping, use country-to-country distances
        if ($fromInfo['country'] !== $toInfo['country']) {
            $distance = CountryDistance::getDistance(
                $fromInfo['country'],
                $toInfo['country'],
                $shippingMethod
            );

            if ($distance !== null) {
                return $distance;
            }
        }

        // Default fallback distance
        return $fromInfo['country'] !== $toInfo['country'] ? 5000.0 : 300.0;
    }

    /**
     * Calculate distance between two city names (for backward compatibility)
     *
     * @param string $fromCity
     * @param string $toCity
     * @param string $shippingMethod
     * @return float
     */
    public function calculateDistanceBetweenCities(string $fromCity, string $toCity, string $shippingMethod = 'domestic'): float
    {
        // Try to get distance from database first
        $distance = CityDistance::getDistance($fromCity, $toCity, 'Morocco', 'Morocco');

        if ($distance !== null) {
            return $distance;
        }

        // Fallback to static matrix for Moroccan cities
        $staticDistance = MoroccanCities::getDistance($fromCity, $toCity);
        if ($staticDistance !== null) {
            return $staticDistance;
        }

        // Default fallback
        return 300.0;
    }

    /**
     * Extract location information (city and country) from an address string
     *
     * @param string $address
     * @return array ['city' => string, 'country' => string]
     */
    private function extractLocationInfo(string $address): array
    {
        // Split address by commas to get components
        $addressParts = array_map('trim', explode(',', $address));

        // If address has multiple parts, extract city and country
        if (count($addressParts) > 1) {
            $country = end($addressParts); // Last part is usually country
            $city = count($addressParts) > 2 ? $addressParts[count($addressParts) - 2] : $addressParts[0];

            // Normalize country names
            $country = $this->normalizeCountryName($country);

            // If the country is Morocco, try to match the city with known Moroccan cities
            if ($country === 'Morocco') {
                $normalizedCity = $this->findMoroccanCity($city);
                if ($normalizedCity) {
                    $city = $normalizedCity;
                }
            }

            return [
                'city' => $city,
                'country' => $country
            ];
        }

        // If single part, assume it's a Moroccan city
        $city = $this->findMoroccanCity($address);
        return [
            'city' => $city ?: $address,
            'country' => 'Morocco'
        ];
    }

    /**
     * Find matching Moroccan city from the known cities list
     *
     * @param string $cityInput
     * @return string|null
     */
    private function findMoroccanCity(string $cityInput): ?string
    {
        $moroccanCities = MoroccanCities::getCities();

        // Direct match
        if (in_array($cityInput, $moroccanCities)) {
            return $cityInput;
        }

        // Case-insensitive search
        foreach ($moroccanCities as $city) {
            if (strcasecmp($cityInput, $city) === 0) {
                return $city;
            }
        }

        // Partial match (city name contains input or input contains city name)
        foreach ($moroccanCities as $city) {
            if (stripos($cityInput, $city) !== false || stripos($city, $cityInput) !== false) {
                return $city;
            }
        }

        return null;
    }

    /**
     * Normalize country name variations
     *
     * @param string $country
     * @return string
     */
    private function normalizeCountryName(string $country): string
    {
        $country = trim($country);

        // Common variations mapping
        $countryMappings = [
            'maroc' => 'Morocco',
            'marruecos' => 'Morocco',
            'المغرب' => 'Morocco',
            'usa' => 'United States',
            'us' => 'United States',
            'america' => 'United States',
            'uk' => 'United Kingdom',
            'england' => 'United Kingdom',
            'britain' => 'United Kingdom',
            'great britain' => 'United Kingdom',
            'uae' => 'United Arab Emirates',
            'emirates' => 'United Arab Emirates',
        ];

        $lowerCountry = strtolower($country);
        if (isset($countryMappings[$lowerCountry])) {
            return $countryMappings[$lowerCountry];
        }

        // Default: capitalize first letter of each word
        return ucwords(strtolower($country));
    }
}
