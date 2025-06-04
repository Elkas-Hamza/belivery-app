<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$calc = new App\Services\PriceCalculator();

echo "=== UPDATED PRICING SYSTEM TEST ===\n\n";

echo "=== DOMESTIC DELIVERY TEST ===\n";
$domesticResult = $calc->calculatePriceFromAddresses('Casablanca, Morocco', 'Rabat, Morocco', 5.0, 'domestic');
echo "Distance: " . $domesticResult['distance'] . " km\n";
echo "Price: " . $domesticResult['price'] . " MAD\n";
echo "Breakdown:\n";
foreach ($domesticResult['breakdown'] as $key => $value) {
    echo "  $key: $value\n";
}

echo "\n=== INTERNATIONAL AIR DELIVERY TEST ===\n";
$airResult = $calc->calculatePriceFromAddresses('Casablanca, Morocco', 'Paris, France', 5.0, 'air');
echo "Distance: " . $airResult['distance'] . " km\n";
echo "Price: " . $airResult['price'] . " MAD\n";
echo "Breakdown:\n";
foreach ($airResult['breakdown'] as $key => $value) {
    echo "  $key: $value\n";
}

echo "\n=== INTERNATIONAL SEA DELIVERY TEST ===\n";
$seaResult = $calc->calculatePriceFromAddresses('Casablanca, Morocco', 'Paris, France', 5.0, 'sea');
echo "Distance: " . $seaResult['distance'] . " km\n";
echo "Price: " . $seaResult['price'] . " MAD\n";
echo "Breakdown:\n";
foreach ($seaResult['breakdown'] as $key => $value) {
    echo "  $key: $value\n";
}

echo "\n=== INTERNATIONAL TRUCK DELIVERY TEST ===\n";
$truckResult = $calc->calculatePriceFromAddresses('Casablanca, Morocco', 'Paris, France', 5.0, 'truck');
echo "Distance: " . $truckResult['distance'] . " km\n";
echo "Price: " . $truckResult['price'] . " MAD\n";
echo "Breakdown:\n";
foreach ($truckResult['breakdown'] as $key => $value) {
    echo "  $key: $value\n";
}

echo "\n=== PRICING COMPARISON ===\n";
echo "Domestic (5kg): " . $domesticResult['price'] . " MAD\n";
echo "International Air (5kg): " . $airResult['price'] . " MAD\n";
echo "International Sea (5kg): " . $seaResult['price'] . " MAD\n";
echo "International Truck (5kg): " . $truckResult['price'] . " MAD\n";

echo "\n=== RATE CHANGES SUMMARY ===\n";
echo "=== DOMESTIC RATES ===\n";
echo "Base Price: 5.00 MAD\n";
echo "Weight Rate: 2.00 MAD/kg\n";
echo "Distance Rate: 0.50 MAD/km\n";
echo "\n=== INTERNATIONAL RATES ===\n";
echo "Base Price: 50.00 MAD\n";
echo "Weight Rate: 30.00 MAD/kg\n";
echo "Distance Rate: 0.10 MAD/km\n";
echo "\n=== SHIPPING METHOD MULTIPLIERS ===\n";
echo "Domestic: 1.0x (no extra fee)\n";
echo "Truck: 1.5x (50% extra fee)\n";
echo "Sea: 1.2x (20% extra fee)\n";
echo "Air: 2.5x (150% extra fee)\n";
