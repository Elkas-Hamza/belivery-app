<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CountryDistance;

class CountryDistancesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data
        CountryDistance::truncate();

        // International shipping distances and times
        $internationalRoutes = [
            // From Morocco to other countries
            // Europe
            ['Morocco', 'France', 1500, 'air', 2, 5],
            ['Morocco', 'France', 2000, 'sea', 7, 14],
            ['Morocco', 'Spain', 800, 'air', 1, 3],
            ['Morocco', 'Spain', 1200, 'sea', 3, 7],
            ['Morocco', 'Germany', 2200, 'air', 3, 6],
            ['Morocco', 'Germany', 2800, 'sea', 10, 18],
            ['Morocco', 'Italy', 1800, 'air', 2, 5],
            ['Morocco', 'Italy', 2400, 'sea', 8, 15],
            ['Morocco', 'United Kingdom', 2000, 'air', 3, 6],
            ['Morocco', 'United Kingdom', 2600, 'sea', 12, 20],
            ['Morocco', 'Netherlands', 2100, 'air', 3, 6],
            ['Morocco', 'Netherlands', 2700, 'sea', 10, 18],
            ['Morocco', 'Belgium', 2000, 'air', 3, 6],
            ['Morocco', 'Belgium', 2600, 'sea', 10, 18],
            ['Morocco', 'Portugal', 600, 'air', 1, 3],
            ['Morocco', 'Portugal', 1000, 'sea', 2, 5],

            // North America
            ['Morocco', 'United States', 6800, 'air', 8, 15],
            ['Morocco', 'United States', 8500, 'sea', 20, 35],
            ['Morocco', 'Canada', 7200, 'air', 8, 15],
            ['Morocco', 'Canada', 9000, 'sea', 22, 38],
            ['Morocco', 'Mexico', 8000, 'air', 10, 18],
            ['Morocco', 'Mexico', 10000, 'sea', 25, 40],

            // Asia
            ['Morocco', 'China', 9000, 'air', 12, 20],
            ['Morocco', 'China', 12000, 'sea', 30, 50],
            ['Morocco', 'Japan', 11000, 'air', 15, 25],
            ['Morocco', 'Japan', 14000, 'sea', 35, 55],
            ['Morocco', 'India', 6500, 'air', 10, 18],
            ['Morocco', 'India', 8500, 'sea', 25, 40],
            ['Morocco', 'United Arab Emirates', 4500, 'air', 6, 12],
            ['Morocco', 'United Arab Emirates', 6000, 'sea', 18, 30],
            ['Morocco', 'Saudi Arabia', 4000, 'air', 6, 12],
            ['Morocco', 'Saudi Arabia', 5500, 'sea', 16, 28],
            ['Morocco', 'Turkey', 3500, 'air', 5, 10],
            ['Morocco', 'Turkey', 4500, 'sea', 12, 22],

            // Africa
            ['Morocco', 'Egypt', 3500, 'air', 4, 8],
            ['Morocco', 'Egypt', 4500, 'sea', 10, 20],
            ['Morocco', 'South Africa', 8000, 'air', 12, 20],
            ['Morocco', 'South Africa', 10000, 'sea', 25, 40],
            ['Morocco', 'Nigeria', 3000, 'air', 5, 10],
            ['Morocco', 'Nigeria', 4000, 'sea', 15, 25],
            ['Morocco', 'Kenya', 5500, 'air', 8, 15],
            ['Morocco', 'Kenya', 7000, 'sea', 20, 35],
            ['Morocco', 'Algeria', 800, 'air', 1, 2],
            ['Morocco', 'Algeria', 1200, 'sea', 2, 4],
            ['Morocco', 'Tunisia', 1200, 'air', 2, 4],
            ['Morocco', 'Tunisia', 1600, 'sea', 3, 6],

            // South America
            ['Morocco', 'Brazil', 6500, 'air', 10, 18],
            ['Morocco', 'Brazil', 8500, 'sea', 20, 35],
            ['Morocco', 'Argentina', 8000, 'air', 12, 20],
            ['Morocco', 'Argentina', 10000, 'sea', 25, 40],

            // Oceania
            ['Morocco', 'Australia', 15000, 'air', 18, 30],
            ['Morocco', 'Australia', 18000, 'sea', 40, 60],
            ['Morocco', 'New Zealand', 16000, 'air', 20, 32],
            ['Morocco', 'New Zealand', 19000, 'sea', 42, 65],

            // Truck delivery routes (land-based shipping for neighboring/accessible countries)
            // Europe - via Spain and France
            ['Morocco', 'Spain', 1000, 'truck', 3, 5],
            ['Morocco', 'France', 1800, 'truck', 5, 8],
            ['Morocco', 'Portugal', 900, 'truck', 3, 5],
            ['Morocco', 'Germany', 2500, 'truck', 8, 12],
            ['Morocco', 'Italy', 2200, 'truck', 7, 10],
            ['Morocco', 'Netherlands', 2300, 'truck', 8, 12],
            ['Morocco', 'Belgium', 2200, 'truck', 7, 11],
            ['Morocco', 'United Kingdom', 2400, 'truck', 8, 12], // via ferry

            // Africa - land routes
            ['Morocco', 'Algeria', 600, 'truck', 2, 4],
            ['Morocco', 'Tunisia', 1100, 'truck', 4, 7],
            ['Morocco', 'Egypt', 3200, 'truck', 10, 15],
            ['Morocco', 'Nigeria', 2800, 'truck', 12, 18],

            // Middle East - via North Africa
            ['Morocco', 'Turkey', 3800, 'truck', 12, 18],
            ['Morocco', 'United Arab Emirates', 4800, 'truck', 15, 22],
            ['Morocco', 'Saudi Arabia', 4200, 'truck', 14, 20],
        ];

        // Insert all international routes
        foreach ($internationalRoutes as $route) {
            CountryDistance::storeBidirectional(
                $route[0], // from_country
                $route[1], // to_country
                $route[2], // distance_km
                $route[3], // shipping_method
                $route[4], // estimated_days_min
                $route[5]  // estimated_days_max
            );
        }

        $this->command->info('Country distances seeded successfully!');
    }
}
