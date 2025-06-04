<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CityDistance extends Model
{
    protected $fillable = [
        'from_city',
        'to_city',
        'from_country',
        'to_country',
        'distance_km',
    ];

    protected $casts = [
        'distance_km' => 'decimal:2',
    ];

    /**
     * Get distance between two cities
     */
    public static function getDistance(string $fromCity, string $toCity, string $fromCountry = 'Morocco', string $toCountry = 'Morocco'): ?float
    {
        // Try to find the exact route
        $distance = self::where([
            ['from_city', $fromCity],
            ['to_city', $toCity],
            ['from_country', $fromCountry],
            ['to_country', $toCountry],
        ])->first();

        if ($distance) {
            return (float) $distance->distance_km;
        }

        // Try reverse direction
        $distance = self::where([
            ['from_city', $toCity],
            ['to_city', $fromCity],
            ['from_country', $toCountry],
            ['to_country', $fromCountry],
        ])->first();

        if ($distance) {
            return (float) $distance->distance_km;
        }

        return null;
    }

    /**
     * Store distance in both directions for efficiency
     */
    public static function storeBidirectional(string $fromCity, string $toCity, float $distance, string $fromCountry = 'Morocco', string $toCountry = 'Morocco'): void
    {
        // Store from -> to
        self::updateOrCreate([
            'from_city' => $fromCity,
            'to_city' => $toCity,
            'from_country' => $fromCountry,
            'to_country' => $toCountry,
        ], [
            'distance_km' => $distance,
        ]);

        // Store to -> from (if not same city)
        if ($fromCity !== $toCity) {
            self::updateOrCreate([
                'from_city' => $toCity,
                'to_city' => $fromCity,
                'from_country' => $toCountry,
                'to_country' => $fromCountry,
            ], [
                'distance_km' => $distance,
            ]);
        }
    }
}
