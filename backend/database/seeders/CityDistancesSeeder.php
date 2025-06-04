<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CityDistance;

class CityDistancesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data
        CityDistance::truncate();

        // Moroccan cities distance matrix (expanded from MoroccanCities.php)
        $moroccanDistances = [
            // Major cities with comprehensive distance matrix
            ['Casablanca', 'Rabat', 87],
            ['Casablanca', 'Marrakech', 239],
            ['Casablanca', 'Fes', 299],
            ['Casablanca', 'Tangier', 335],
            ['Casablanca', 'Agadir', 486],
            ['Casablanca', 'Meknes', 242],
            ['Casablanca', 'Oujda', 698],
            ['Casablanca', 'Kenitra', 141],
            ['Casablanca', 'Tetouan', 384],
            ['Casablanca', 'Safi', 236],
            ['Casablanca', 'El Jadida', 99],
            ['Casablanca', 'Nador', 636],
            ['Casablanca', 'Beni Mellal', 203],
            ['Casablanca', 'Taza', 368],
            ['Casablanca', 'Settat', 60],
            ['Casablanca', 'Berrechid', 38],
            ['Casablanca', 'Khouribga', 154],
            ['Casablanca', 'Larache', 156],
            ['Casablanca', 'Ksar El Kebir', 134],
            ['Casablanca', 'Khemisset', 81],
            ['Casablanca', 'Mohammedia', 77],
            ['Casablanca', 'Essaouira', 443],
            ['Casablanca', 'Taroudant', 633],
            ['Casablanca', 'Ouarzazate', 469],
            ['Casablanca', 'Dakhla', 1815],
            ['Casablanca', 'Laayoune', 1277],
            ['Casablanca', 'Ifrane', 185],
            ['Casablanca', 'Al Hoceima', 423],
            ['Casablanca', 'Chefchaouen', 255],

            // Rabat distances
            ['Rabat', 'Marrakech', 324],
            ['Rabat', 'Fes', 214],
            ['Rabat', 'Tangier', 248],
            ['Rabat', 'Agadir', 573],
            ['Rabat', 'Meknes', 155],
            ['Rabat', 'Oujda', 611],
            ['Rabat', 'Kenitra', 54],
            ['Rabat', 'Tetouan', 297],
            ['Rabat', 'Safi', 323],
            ['Rabat', 'El Jadida', 186],
            ['Rabat', 'Nador', 549],
            ['Rabat', 'Beni Mellal', 290],
            ['Rabat', 'Taza', 283],
            ['Rabat', 'Settat', 147],
            ['Rabat', 'Berrechid', 125],
            ['Rabat', 'Khouribga', 241],
            ['Rabat', 'Larache', 92],
            ['Rabat', 'Ksar El Kebir', 70],
            ['Rabat', 'Khemisset', 58],
            ['Rabat', 'Mohammedia', 68],
            ['Rabat', 'Essaouira', 530],
            ['Rabat', 'Taroudant', 720],
            ['Rabat', 'Ouarzazate', 556],
            ['Rabat', 'Dakhla', 1902],
            ['Rabat', 'Laayoune', 1364],
            ['Rabat', 'Ifrane', 98],
            ['Rabat', 'Al Hoceima', 336],
            ['Rabat', 'Chefchaouen', 168],

            // Marrakech distances
            ['Marrakech', 'Fes', 530],
            ['Marrakech', 'Tangier', 574],
            ['Marrakech', 'Agadir', 256],
            ['Marrakech', 'Meknes', 460],
            ['Marrakech', 'Oujda', 857],
            ['Marrakech', 'Kenitra', 378],
            ['Marrakech', 'Tetouan', 623],
            ['Marrakech', 'Safi', 160],
            ['Marrakech', 'El Jadida', 338],
            ['Marrakech', 'Nador', 795],
            ['Marrakech', 'Beni Mellal', 205],
            ['Marrakech', 'Taza', 599],
            ['Marrakech', 'Settat', 179],
            ['Marrakech', 'Berrechid', 201],
            ['Marrakech', 'Khouribga', 267],
            ['Marrakech', 'Larache', 480],
            ['Marrakech', 'Ksar El Kebir', 458],
            ['Marrakech', 'Khemisset', 366],
            ['Marrakech', 'Mohammedia', 316],
            ['Marrakech', 'Essaouira', 187],
            ['Marrakech', 'Taroudant', 394],
            ['Marrakech', 'Ouarzazate', 230],
            ['Marrakech', 'Dakhla', 1576],
            ['Marrakech', 'Laayoune', 1038],
            ['Marrakech', 'Ifrane', 423],
            ['Marrakech', 'Al Hoceima', 662],
            ['Marrakech', 'Chefchaouen', 494],

            // Fes distances
            ['Fes', 'Tangier', 200],
            ['Fes', 'Agadir', 787],
            ['Fes', 'Meknes', 59],
            ['Fes', 'Oujda', 397],
            ['Fes', 'Kenitra', 168],
            ['Fes', 'Tetouan', 249],
            ['Fes', 'Safi', 537],
            ['Fes', 'El Jadida', 400],
            ['Fes', 'Nador', 335],
            ['Fes', 'Beni Mellal', 504],
            ['Fes', 'Taza', 69],
            ['Fes', 'Settat', 361],
            ['Fes', 'Berrechid', 339],
            ['Fes', 'Khouribga', 455],
            ['Fes', 'Larache', 122],
            ['Fes', 'Ksar El Kebir', 144],
            ['Fes', 'Khemisset', 156],
            ['Fes', 'Mohammedia', 282],
            ['Fes', 'Essaouira', 744],
            ['Fes', 'Taroudant', 934],
            ['Fes', 'Ouarzazate', 770],
            ['Fes', 'Dakhla', 2116],
            ['Fes', 'Laayoune', 1578],
            ['Fes', 'Ifrane', 116],
            ['Fes', 'Al Hoceima', 288],
            ['Fes', 'Chefchaouen', 120],

            // Tangier distances
            ['Tangier', 'Agadir', 822],
            ['Tangier', 'Meknes', 241],
            ['Tangier', 'Oujda', 597],
            ['Tangier', 'Kenitra', 194],
            ['Tangier', 'Tetouan', 49],
            ['Tangier', 'Safi', 572],
            ['Tangier', 'El Jadida', 434],
            ['Tangier', 'Nador', 535],
            ['Tangier', 'Beni Mellal', 539],
            ['Tangier', 'Taza', 269],
            ['Tangier', 'Settat', 395],
            ['Tangier', 'Berrechid', 373],
            ['Tangier', 'Khouribga', 489],
            ['Tangier', 'Larache', 78],
            ['Tangier', 'Ksar El Kebir', 56],
            ['Tangier', 'Khemisset', 190],
            ['Tangier', 'Mohammedia', 316],
            ['Tangier', 'Essaouira', 779],
            ['Tangier', 'Taroudant', 969],
            ['Tangier', 'Ouarzazate', 805],
            ['Tangier', 'Dakhla', 2151],
            ['Tangier', 'Laayoune', 1613],
            ['Tangier', 'Ifrane', 316],
            ['Tangier', 'Al Hoceima', 148],
            ['Tangier', 'Chefchaouen', 80],

            // Additional distances for other major cities
            ['Agadir', 'Meknes', 716],
            ['Agadir', 'Oujda', 1083],
            ['Agadir', 'Kenitra', 632],
            ['Agadir', 'Tetouan', 871],
            ['Agadir', 'Safi', 326],
            ['Agadir', 'El Jadida', 585],
            ['Agadir', 'Essaouira', 169],
            ['Agadir', 'Taroudant', 138],
            ['Agadir', 'Ouarzazate', 484],
            ['Agadir', 'Laayoune', 782],
            ['Agadir', 'Dakhla', 1320],
        ];

        // Insert all distances
        foreach ($moroccanDistances as $distance) {
            CityDistance::storeBidirectional(
                $distance[0], // from_city
                $distance[1], // to_city
                $distance[2], // distance_km
                'Morocco',    // from_country
                'Morocco'     // to_country
            );
        }

        $this->command->info('City distances seeded successfully!');
    }
}
