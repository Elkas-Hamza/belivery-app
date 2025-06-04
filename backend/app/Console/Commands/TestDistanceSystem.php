<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PriceCalculator;
use App\Models\CityDistance;
use App\Models\CountryDistance;

class TestDistanceSystem extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:distance-system';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the new database-driven distance calculation system';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $priceCalculator = new PriceCalculator();

        $this->info('=== Testing Domestic Distance Calculations ===');

        // Test 1: Database distance lookup
        $this->info('Test 1: Casablanca to Rabat');
        $distance = CityDistance::getDistance('Casablanca', 'Rabat', 'Morocco', 'Morocco');
        $this->line('Database distance: ' . ($distance ?? 'Not found') . ' km');

        $calcResult = $priceCalculator->calculatePriceFromAddresses(
            'Casablanca, Morocco',
            'Rabat, Morocco',
            2.5,
            'domestic'
        );
        $this->line('Calculated price: ' . $calcResult['price'] . ' MAD');
        $this->line('Distance used: ' . $calcResult['distance'] . ' km');
        $this->line('');

        // Test 2: International distance lookup
        $this->info('=== Testing International Distance Calculations ===');

        $this->info('Test 2: Morocco to France (Air)');
        $intlDistance = CountryDistance::getDistance('Morocco', 'France', 'air');
        $this->line('Database distance: ' . ($intlDistance ?? 'Not found') . ' km');

        $intlResult = $priceCalculator->calculatePriceFromAddresses(
            'Casablanca, Morocco',
            'Paris, France',
            2.5,
            'air'
        );
        $this->line('Calculated price: ' . $intlResult['price'] . ' MAD');
        $this->line('Distance used: ' . $intlResult['distance'] . ' km');
        $this->line('Shipping method: ' . $intlResult['breakdown']['shipping_method']);
        $this->line('Shipping multiplier: ' . $intlResult['breakdown']['shipping_multiplier']);
        $this->line('');

        // Test 3: Sea freight
        $this->info('Test 3: Morocco to Spain (Sea)');
        $seaDistance = CountryDistance::getDistance('Morocco', 'Spain', 'sea');
        $this->line('Database distance: ' . ($seaDistance ?? 'Not found') . ' km');

        $seaResult = $priceCalculator->calculatePriceFromAddresses(
            'Casablanca, Morocco',
            'Madrid, Spain',
            2.5,
            'sea'
        );
        $this->line('Calculated price: ' . $seaResult['price'] . ' MAD');
        $this->line('Distance used: ' . $seaResult['distance'] . ' km');
        $this->line('Shipping method: ' . $seaResult['breakdown']['shipping_method']);
        $this->line('Shipping multiplier: ' . $seaResult['breakdown']['shipping_multiplier']);
        $this->line('');

        // Test 4: Shipping details
        $this->info('=== Testing Shipping Details ===');
        $shippingDetails = CountryDistance::getShippingDetails('Morocco', 'United States', 'air');
        if ($shippingDetails) {
            $this->line('Morocco to USA (Air):');
            $this->line('Distance: ' . $shippingDetails['distance_km'] . ' km');
            $this->line('Delivery time: ' . $shippingDetails['estimated_days_min'] . '-' . $shippingDetails['estimated_days_max'] . ' days');
            $this->line('Method: ' . $shippingDetails['shipping_method']);
            $this->line('');
        }

        // Test 5: City-based calculation (backward compatibility)
        $this->info('=== Testing City-Based Calculations (Backward Compatibility) ===');
        $cityDistance = $priceCalculator->calculateDistanceBetweenCities('Casablanca', 'Marrakech');
        $this->line('Casablanca to Marrakech: ' . $cityDistance . ' km');

        $this->info('=== All tests completed successfully! ===');
    }
}
