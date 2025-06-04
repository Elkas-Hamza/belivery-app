<?php

namespace App\Http\Controllers\API;

use App\Services\PriceCalculator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PriceController extends Controller
{
    protected $priceCalculator;

    public function __construct(PriceCalculator $priceCalculator)
    {
        $this->priceCalculator = $priceCalculator;
    }

    public function calculate(Request $request)
    {
        $validated = $request->validate([
            'pickup_address' => 'required|string',
            'delivery_address' => 'required|string',
            'weight' => 'required|numeric|min:0',
            'shipping_method' => 'nullable|string|in:air,sea,truck,domestic'
        ]);

        $shippingMethod = $validated['shipping_method'] ?? 'domestic';

        // Calculate price from full addresses
        $result = $this->priceCalculator->calculatePriceFromAddresses(
            $validated['pickup_address'],
            $validated['delivery_address'],
            $validated['weight'],
            $shippingMethod
        );

        return response()->json($result);
    }

    public function calculateFromCities(Request $request)
    {
        $validated = $request->validate([
            'pickup_city' => 'required|string',
            'delivery_city' => 'required|string',
            'weight' => 'required|numeric|min:0',
            'shipping_method' => 'nullable|string|in:air,sea,truck,domestic'
        ]);

        $shippingMethod = $validated['shipping_method'] ?? 'domestic';

        // Calculate distance between the cities
        $distance = $this->priceCalculator->calculateDistanceBetweenCities(
            $validated['pickup_city'],
            $validated['delivery_city'],
            $shippingMethod
        );

        // Calculate price based on weight and distance
        $price = $this->priceCalculator->calculatePrice(
            $validated['weight'],
            $distance,
            $shippingMethod
        );

        $breakdown = $this->priceCalculator->getPriceBreakdown(
            $validated['weight'],
            $distance,
            $shippingMethod
        );

        return response()->json([
            'distance' => $distance,
            'price' => $price,
            'breakdown' => $breakdown
        ]);
    }
}
