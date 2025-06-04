<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Data\MoroccanCities;
use App\Models\CityDistance;
use App\Models\CountryDistance;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CityController extends Controller
{
    /**
     * Get a list of all Moroccan cities.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCities(): JsonResponse
    {
        return response()->json(MoroccanCities::getCities());
    }

    /**
     * Get cities with postal codes.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCitiesWithPostalCodes(): JsonResponse
    {
        return response()->json(MoroccanCities::getCitiesWithPostalCodes());
    }

    /**
     * Calculate distance between two cities.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDistance(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'from_city' => 'required|string',
            'to_city' => 'required|string',
            'from_country' => 'nullable|string',
            'to_country' => 'nullable|string',
        ]);

        $fromCountry = $validated['from_country'] ?? 'Morocco';
        $toCountry = $validated['to_country'] ?? 'Morocco';

        // Try to get distance from database first
        $distance = CityDistance::getDistance(
            $validated['from_city'],
            $validated['to_city'],
            $fromCountry,
            $toCountry
        );

        // Fallback to static matrix for Moroccan cities if not in database
        if ($distance === null && $fromCountry === 'Morocco' && $toCountry === 'Morocco') {
            $distance = MoroccanCities::getDistance(
                $validated['from_city'],
                $validated['to_city']
            );
        }

        return response()->json(['distance' => $distance]);
    }

    /**
     * Get shipping details between countries.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getShippingDetails(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'from_country' => 'required|string',
            'to_country' => 'required|string',
            'shipping_method' => 'nullable|string|in:air,sea,truck',
        ]);

        $shippingMethod = $validated['shipping_method'] ?? 'air';

        $shippingDetails = CountryDistance::getShippingDetails(
            $validated['from_country'],
            $validated['to_country'],
            $shippingMethod
        );

        return response()->json($shippingDetails);
    }
}
