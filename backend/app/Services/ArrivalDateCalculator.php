<?php

namespace App\Services;

use Carbon\Carbon;

class ArrivalDateCalculator
{
    // Base transit times in days for different shipping methods
    const TRANSIT_TIMES = [
        'domestic' => [
            'base' => 1,
            'per_km' => 0.001
        ],
        'air' => [
            'base' => 3,
            'per_km' => 0.002
        ],
        'sea' => [
            'base' => 14,
            'per_km' => 0.01
        ],
        'truck' => [
            'base' => 5,
            'per_km' => 0.005
        ]
    ];

    /**
     * Calculate estimated arrival date based on distance and shipping method
     *
     * @param float $distance Distance in kilometers
     * @param string $shippingMethod Shipping method (domestic, air, sea, truck)
     * @param Carbon|null $startDate Start date (default: today)
     * @return Carbon|null
     */
    public static function calculateArrivalDate($distance, $shippingMethod = 'domestic', $startDate = null)
    {
        if (!$distance || $distance <= 0) {
            return null;
        }

        $startDate = $startDate ?: Carbon::now();
        $method = strtolower($shippingMethod);
        $transitConfig = self::TRANSIT_TIMES[$method] ?? self::TRANSIT_TIMES['domestic'];

        // Calculate base transit time + distance-based addition
        $transitDays = $transitConfig['base'] + ($distance * $transitConfig['per_km']);

        // Add some randomness for realism (±20%)
        $variance = $transitDays * 0.2;
        $transitDays = $transitDays + (rand(-100, 100) / 100 * $variance);

        // Round to nearest day and ensure minimum of 1 day
        $transitDays = max(1, round($transitDays));

        // Calculate arrival date
        $arrivalDate = $startDate->copy()->addDays($transitDays);

        // Skip weekends for business deliveries (move to next Monday if weekend)
        if (in_array($method, ['domestic', 'truck'])) {
            while ($arrivalDate->isWeekend()) {
                $arrivalDate->addDay();
            }
        }

        return $arrivalDate;
    }

    /**
     * Get human-readable transit time estimate
     *
     * @param float $distance Distance in kilometers
     * @param string $shippingMethod Shipping method
     * @return string
     */
    public static function getTransitTimeEstimate($distance, $shippingMethod = 'domestic')
    {
        if (!$distance || $distance <= 0) {
            return 'Unknown';
        }

        $method = strtolower($shippingMethod);
        $transitConfig = self::TRANSIT_TIMES[$method] ?? self::TRANSIT_TIMES['domestic'];

        $minDays = max(1, floor($transitConfig['base'] + ($distance * $transitConfig['per_km'] * 0.8)));
        $maxDays = max($minDays + 1, ceil($transitConfig['base'] + ($distance * $transitConfig['per_km'] * 1.2)));

        if ($minDays === $maxDays) {
            return $minDays . ' day' . ($minDays > 1 ? 's' : '');
        }

        return $minDays . '-' . $maxDays . ' days';
    }

    /**
     * Determine shipping method based on countries
     *
     * @param string $pickupCountry
     * @param string $deliveryCountry
     * @param string $preferredMethod
     * @return string
     */
    public static function determineShippingMethod($pickupCountry, $deliveryCountry, $preferredMethod = 'air')
    {
        if (!$pickupCountry || !$deliveryCountry) {
            return 'truck';
        }

        // Same country = truck for local deliveries
        if (strtolower($pickupCountry) === strtolower($deliveryCountry)) {
            return 'truck';
        }

        // Different countries = international, use preferred method
        return $preferredMethod ?: 'air';
    }
}
