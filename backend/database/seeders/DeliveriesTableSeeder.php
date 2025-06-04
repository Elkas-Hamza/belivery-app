<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Delivery;
use App\Models\User;

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

        // Sample pickup and delivery addresses
        $pickupAddresses = [
            '123 Casablanca Blvd, Casablanca',
            '456 Rabat Avenue, Rabat',
            '789 Marrakech Road, Marrakech',
            '101 Fes Street, Fes',
            '202 Tangier Lane, Tangier'
        ];

        $deliveryAddresses = [
            '303 Agadir Drive, Agadir',
            '404 Oujda Plaza, Oujda',
            '505 Meknes Court, Meknes',
            '606 Tetouan Highway, Tetouan',
            '707 Essaouira Beach, Essaouira'
        ];

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
            $price = $weight * 10 + rand(1000, 5000) / 100; // Base price calculation

            // Generate random arrival date (some deliveries might not have one)
            $arrivalDate = null;
            if (rand(0, 1)) { // 50% chance of having an arrival date
                $arrivalDate = now()->addDays(rand(1, 14))->format('Y-m-d'); // 1-14 days from now
            }

            Delivery::create([
                'user_id' => $user->id,
                'tracking_code' => 'TRK' . strtoupper(substr(md5(uniqid()), 0, 8)),
                'pickup_address' => $pickupAddresses[array_rand($pickupAddresses)],
                'delivery_address' => $deliveryAddresses[array_rand($deliveryAddresses)],
                'contact_number' => '+212 6' . rand(10, 99) . ' ' . rand(100000, 999999),
                'weight' => $weight,
                'price' => $price,
                'status' => $statuses[array_rand($statuses)],
                'notes' => $notes[array_rand($notes)],
                'arrival_date' => $arrivalDate,
                'created_at' => now()->subDays(rand(0, 30))->subHours(rand(1, 24)),
            ]);
        }

        $this->command->info('Deliveries seeded successfully!');
    }
}
