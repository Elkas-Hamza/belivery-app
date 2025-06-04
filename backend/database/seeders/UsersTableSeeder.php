<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User (only if it doesn't exist)
        if (!User::where('email', 'admin@deliveryapp.com')->exists()) {
            User::create([
                'name' => 'Admin User',
                'email' => 'admin@deliveryapp.com',
                'password' => Hash::make('admin123'),
                'phone_number' => '123-456-7890',
                'address' => '123 Admin Street, Admin City, AC 12345',
                'role' => 'admin',
                'notification_preferences' => json_encode([
                    'email_notifications' => true,
                    'push_notifications' => true,
                    'delivery_updates' => true,
                    'promotions' => true,
                    'account_updates' => true,
                ]),
                'email_verified_at' => now(),
            ]);
        }

        // Create Normal User (only if it doesn't exist)
        if (!User::where('email', 'user@deliveryapp.com')->exists()) {
            User::create([
                'name' => 'Normal User',
                'email' => 'user@deliveryapp.com',
                'password' => Hash::make('user123'),
                'phone_number' => '987-654-3210',
                'address' => '456 User Avenue, User Town, UT 54321',
                'role' => 'user',
                'notification_preferences' => json_encode([
                    'email_notifications' => true,
                    'push_notifications' => true,
                    'delivery_updates' => true,
                    'promotions' => false,
                    'account_updates' => true,
                ]),
                'email_verified_at' => now(),
            ]);
        }

        // Create additional test users if needed (only if it doesn't exist)
        if (!User::where('email', 'jane@example.com')->exists()) {
            User::create([
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password'),
                'phone_number' => '555-123-4567',
                'address' => '789 Customer Road, Customer City, CC 67890',
                'role' => 'user',
                'notification_preferences' => json_encode([
                    'email_notifications' => true,
                    'push_notifications' => false,
                    'delivery_updates' => true,
                    'promotions' => false,
                    'account_updates' => true,
                ]),
                'email_verified_at' => now(),
            ]);
        }
    }
}
