<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CountryDistance extends Model
{
    protected $fillable = [
        'from_country',
        'to_country',
        'distance_km',
        'shipping_method',
        'estimated_days_min',
        'estimated_days_max',
    ];

    protected $casts = [
        'distance_km' => 'decimal:2',
        'estimated_days_min' => 'integer',
        'estimated_days_max' => 'integer',
    ];

    /**
     * Get distance between two countries for a specific shipping method
     */
    public static function getDistance(string $fromCountry, string $toCountry, string $shippingMethod = 'air'): ?float
    {
        // Try to find the exact route
        $distance = self::where([
            ['from_country', $fromCountry],
            ['to_country', $toCountry],
            ['shipping_method', $shippingMethod],
        ])->first();

        if ($distance) {
            return (float) $distance->distance_km;
        }

        // Try reverse direction
        $distance = self::where([
            ['from_country', $toCountry],
            ['to_country', $fromCountry],
            ['shipping_method', $shippingMethod],
        ])->first();

        if ($distance) {
            return (float) $distance->distance_km;
        }

        return null;
    }

    /**
     * Get shipping details between countries
     */
    public static function getShippingDetails(string $fromCountry, string $toCountry, string $shippingMethod = 'air'): ?array
    {
        $route = self::where([
            ['from_country', $fromCountry],
            ['to_country', $toCountry],
            ['shipping_method', $shippingMethod],
        ])->first();

        if (!$route) {
            $route = self::where([
                ['from_country', $toCountry],
                ['to_country', $fromCountry],
                ['shipping_method', $shippingMethod],
            ])->first();
        }

        if ($route) {
            return [
                'distance_km' => (float) $route->distance_km,
                'shipping_method' => $route->shipping_method,
                'estimated_days_min' => $route->estimated_days_min,
                'estimated_days_max' => $route->estimated_days_max,
            ];
        }

        return null;
    }

    /**
     * Store distance in both directions for efficiency
     */
    public static function storeBidirectional(string $fromCountry, string $toCountry, float $distance, string $shippingMethod = 'air', int $daysMin = 1, int $daysMax = 7): void
    {
        // Store from -> to
        self::updateOrCreate([
            'from_country' => $fromCountry,
            'to_country' => $toCountry,
            'shipping_method' => $shippingMethod,
        ], [
            'distance_km' => $distance,
            'estimated_days_min' => $daysMin,
            'estimated_days_max' => $daysMax,
        ]);

        // Store to -> from (if not same country)
        if ($fromCountry !== $toCountry) {
            self::updateOrCreate([
                'from_country' => $toCountry,
                'to_country' => $fromCountry,
                'shipping_method' => $shippingMethod,
            ], [
                'distance_km' => $distance,
                'estimated_days_min' => $daysMin,
                'estimated_days_max' => $daysMax,
            ]);
        }
    }
}
