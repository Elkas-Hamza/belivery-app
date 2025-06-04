<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call the seeders to populate the database
        $this->call([
            UsersTableSeeder::class,
            CityDistancesSeeder::class,
            CountryDistancesSeeder::class,
            DeliveriesTableSeeder::class,
            OrdersTableSeeder::class,
        ]);
    }
}
