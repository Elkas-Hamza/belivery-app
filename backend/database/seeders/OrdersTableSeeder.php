<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\User;
use App\Models\Delivery;

class OrdersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users and deliveries
        $users = User::all();
        $deliveries = Delivery::all();

        // If there are no users or deliveries, we can't create orders
        if ($users->isEmpty() || $deliveries->isEmpty()) {
            $this->command->info('No users or deliveries found. Skipping orders seeding.');
            return;
        }

        // Create sample orders
        $statuses = ['pending', 'processing', 'completed', 'cancelled'];

        // Clear existing orders
        Order::truncate();

        // Create 20 sample orders
        for ($i = 0; $i < 20; $i++) {
            $user = $users->random();
            $delivery = $deliveries->random();

            Order::create([
                'user_id' => $user->id,
                'delivery_id' => $delivery->id,
                'amount' => $delivery->price ?: rand(2000, 15000) / 100, // Use delivery price or random amount
                'status' => $statuses[array_rand($statuses)],
                'created_at' => now()->subDays(rand(0, 30))->subHours(rand(1, 24)),
            ]);
        }

        $this->command->info('Orders seeded successfully!');
    }
}
