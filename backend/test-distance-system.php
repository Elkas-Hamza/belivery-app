<?php
/**
 * Test script for the new database-driven distance calculation system
 */

require_once 'vendor/autoload.php';

use App\Services\PriceCalculator;
use App\Models\CityDistance;
use App\Models\CountryDistance;

// Test domestic (Moroccan) city distances
echo "=== Testing Domestic Distance Calculations ===\n";

$priceCalculator = new PriceCalculator();

// Test 1: Database distance lookup
echo "Test 1: Casablanca to Rabat\n";
$distance = CityDistance::getDistance('Casablanca', 'Rabat', 'Morocco', 'Morocco');
echo "Database distance: " . ($distance ?? 'Not found') . " km\n";

$calcResult = $priceCalculator->calculatePriceFromAddresses(
    'Casablanca, Morocco',
    'Rabat, Morocco',
    2.5,
    'domestic'
);
echo "Calculated price: {$calcResult['price']} MAD\n";
echo "Distance used: {$calcResult['distance']} km\n\n";

// Test 2: International distance lookup
echo "=== Testing International Distance Calculations ===\n";

echo "Test 2: Morocco to France (Air)\n";
$intlDistance = CountryDistance::getDistance('Morocco', 'France', 'air');
echo "Database distance: " . ($intlDistance ?? 'Not found') . " km\n";

$intlResult = $priceCalculator->calculatePriceFromAddresses(
    'Casablanca, Morocco',
    'Paris, France',
    2.5,
    'air'
);
echo "Calculated price: {$intlResult['price']} MAD\n";
echo "Distance used: {$intlResult['distance']} km\n";
echo "Shipping method: {$intlResult['breakdown']['shipping_method']}\n";
echo "Shipping multiplier: {$intlResult['breakdown']['shipping_multiplier']}\n\n";

// Test 3: Sea freight
echo "Test 3: Morocco to Spain (Sea)\n";
$seaDistance = CountryDistance::getDistance('Morocco', 'Spain', 'sea');
echo "Database distance: " . ($seaDistance ?? 'Not found') . " km\n";

$seaResult = $priceCalculator->calculatePriceFromAddresses(
    'Casablanca, Morocco',
    'Madrid, Spain',
    2.5,
    'sea'
);
echo "Calculated price: {$seaResult['price']} MAD\n";
echo "Distance used: {$seaResult['distance']} km\n";
echo "Shipping method: {$seaResult['breakdown']['shipping_method']}\n";
echo "Shipping multiplier: {$seaResult['breakdown']['shipping_multiplier']}\n\n";

// Test 4: Shipping details
echo "=== Testing Shipping Details ===\n";
$shippingDetails = CountryDistance::getShippingDetails('Morocco', 'United States', 'air');
if ($shippingDetails) {
    echo "Morocco to USA (Air):\n";
    echo "Distance: {$shippingDetails['distance_km']} km\n";
    echo "Delivery time: {$shippingDetails['estimated_days_min']}-{$shippingDetails['estimated_days_max']} days\n";
    echo "Method: {$shippingDetails['shipping_method']}\n\n";
}

echo "=== All tests completed ===\n";
