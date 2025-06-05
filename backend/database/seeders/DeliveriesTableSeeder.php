<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Delivery;
use App\Models\User;
use App\Services\ArrivalDateCalculator;

class DeliveriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users
        $users = User::where('role', 'user')->get();

        // If there are no users, we can't create deliveries
        if ($users->isEmpty()) {
            $this->command->info('No users found. Skipping deliveries seeding.');
            return;
        }

        // Sample pickup and delivery addresses with city names for distance calculation
        $addressData = [
            'Casablanca' => ['address' => '123 Casablanca Blvd, Casablanca, Morocco', 'country' => 'Morocco'],
            'Rabat' => ['address' => '456 Rabat Avenue, Rabat, Morocco', 'country' => 'Morocco'],
            'Marrakech' => ['address' => '789 Marrakech Road, Marrakech, Morocco', 'country' => 'Morocco'],
            'Fes' => ['address' => '101 Fes Street, Fes, Morocco', 'country' => 'Morocco'],
            'Tangier' => ['address' => '202 Tangier Lane, Tangier, Morocco', 'country' => 'Morocco'],
            'Agadir' => ['address' => '303 Agadir Drive, Agadir, Morocco', 'country' => 'Morocco'],
            'Oujda' => ['address' => '404 Oujda Plaza, Oujda, Morocco', 'country' => 'Morocco'],
            'Meknes' => ['address' => '505 Meknes Court, Meknes, Morocco', 'country' => 'Morocco'],
            'Tetouan' => ['address' => '606 Tetouan Highway, Tetouan, Morocco', 'country' => 'Morocco'],
            'Essaouira' => ['address' => '707 Essaouira Beach, Essaouira, Morocco', 'country' => 'Morocco'],
        ];

        // Approximate distances between major Moroccan cities (in km)
        $cityDistances = [
            'Casablanca' => ['Rabat' => 87, 'Marrakech' => 241, 'Fes' => 298, 'Tangier' => 338, 'Agadir' => 486, 'Oujda' => 554, 'Meknes' => 245, 'Tetouan' => 344, 'Essaouira' => 374],
            'Rabat' => ['Casablanca' => 87, 'Marrakech' => 328, 'Fes' => 211, 'Tangier' => 251, 'Agadir' => 573, 'Oujda' => 467, 'Meknes' => 158, 'Tetouan' => 257, 'Essaouira' => 461],
            'Marrakech' => ['Casablanca' => 241, 'Rabat' => 328, 'Fes' => 469, 'Tangier' => 589, 'Agadir' => 245, 'Oujda' => 795, 'Meknes' => 416, 'Tetouan' => 595, 'Essaouira' => 173],
            'Fes' => ['Casablanca' => 298, 'Rabat' => 211, 'Marrakech' => 469, 'Tangier' => 298, 'Agadir' => 714, 'Oujda' => 256, 'Meknes' => 53, 'Tetouan' => 304, 'Essaouira' => 602],
            'Tangier' => ['Casablanca' => 338, 'Rabat' => 251, 'Marrakech' => 589, 'Fes' => 298, 'Agadir' => 834, 'Oujda' => 554, 'Meknes' => 245, 'Tetouan' => 64, 'Essaouira' => 722],
            'Agadir' => ['Casablanca' => 486, 'Rabat' => 573, 'Marrakech' => 245, 'Fes' => 714, 'Tangier' => 834, 'Oujda' => 1040, 'Meknes' => 661, 'Tetouan' => 840, 'Essaouira' => 418],
            'Oujda' => ['Casablanca' => 554, 'Rabat' => 467, 'Marrakech' => 795, 'Fes' => 256, 'Tangier' => 554, 'Agadir' => 1040, 'Meknes' => 203, 'Tetouan' => 560, 'Essaouira' => 928],
            'Meknes' => ['Casablanca' => 245, 'Rabat' => 158, 'Marrakech' => 416, 'Fes' => 53, 'Tangier' => 245, 'Agadir' => 661, 'Oujda' => 203, 'Tetouan' => 251, 'Essaouira' => 549],
            'Tetouan' => ['Casablanca' => 344, 'Rabat' => 257, 'Marrakech' => 595, 'Fes' => 304, 'Tangier' => 64, 'Agadir' => 840, 'Oujda' => 560, 'Meknes' => 251, 'Essaouira' => 728],
            'Essaouira' => ['Casablanca' => 374, 'Rabat' => 461, 'Marrakech' => 173, 'Fes' => 602, 'Tangier' => 722, 'Agadir' => 418, 'Oujda' => 928, 'Meknes' => 549, 'Tetouan' => 728],
        ];

        $cities = array_keys($addressData);

        // Sample statuses
        $statuses = ['pending', 'in_progress', 'delivered', 'cancelled'];

        // Sample notes
        $notes = [
            'Please handle with care',
            'Call before delivery',
            'Leave at the front door',
            'Signature required',
            ''  // Empty note option
        ];

        // Clear existing deliveries (handle foreign key constraints properly)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Truncate related tables first
        DB::table('orders')->truncate();

        // Now truncate deliveries
        Delivery::truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Create 15 sample deliveries
        for ($i = 0; $i < 15; $i++) {
            $user = $users->random();
            $weight = rand(100, 2000) / 100; // 1.00 to 20.00 kg

            // Select random pickup and delivery cities
            $pickupCity = $cities[array_rand($cities)];
            $deliveryCity = $cities[array_rand($cities)];

            // Ensure pickup and delivery are different cities
            while ($pickupCity === $deliveryCity) {
                $deliveryCity = $cities[array_rand($cities)];
            }

            $pickupAddress = $addressData[$pickupCity]['address'];
            $deliveryAddress = $addressData[$deliveryCity]['address'];

            // Get distance between cities
            $distance = $cityDistances[$pickupCity][$deliveryCity];

            // Determine shipping method (domestic for Morocco)
            $shippingMethod = 'domestic';

            // Calculate price based on distance and weight
            $basePrice = ($distance * 0.5) + ($weight * 10);
            $price = $basePrice + rand(500, 2000) / 100; // Add some variation

            // Calculate arrival date based on distance and shipping method
            $createdAt = now()->subDays(rand(0, 30))->subHours(rand(1, 24));
            $arrivalDate = ArrivalDateCalculator::calculateArrivalDate($distance, $shippingMethod, $createdAt);

            Delivery::create([
                'user_id' => $user->id,
                'tracking_code' => 'TRK' . strtoupper(substr(md5(uniqid()), 0, 8)),
                'pickup_address' => $pickupAddress,
                'delivery_address' => $deliveryAddress,
                'contact_number' => '+212 6' . rand(10, 99) . ' ' . rand(100000, 999999),
                'weight' => $weight,
                'price' => round($price, 2),
                'status' => $statuses[array_rand($statuses)],
                'notes' => $notes[array_rand($notes)],
                'arrival_date' => $arrivalDate ? $arrivalDate->format('Y-m-d') : null,
                'created_at' => $createdAt,
            ]);
        }

        $this->command->info('Deliveries seeded successfully!');
    }
}
