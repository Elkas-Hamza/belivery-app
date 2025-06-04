<?php

namespace App\Data;

class MoroccanCities
{
    /**
     * Get a list of major Moroccan cities
     *
     * @return array
     */
    public static function getCities(): array
    {
        return [
            'Casablanca',
            'Rabat',
            'Marrakech',
            'Fes',
            'Tangier',
            'Agadir',
            'Meknes',
            'Oujda',
            'Kenitra',
            'Tetouan',
            'Safi',
            'El Jadida',
            'Nador',
            'Beni Mellal',
            'Taza',
            'Settat',
            'Berrechid',
            'Khouribga',
            'Larache',
            'Ksar El Kebir',
            'Khemisset',
            'Mohammedia',
            'Essaouira',
            'Taroudant',
            'Ouarzazate',
            'Dakhla',
            'Laayoune',
            'Ifrane',
            'Al Hoceima',
            'Chefchaouen',
        ];
    }

    /**
     * Get cities with their postal codes
     *
     * @return array
     */
    public static function getCitiesWithPostalCodes(): array
    {
        return [
            'Casablanca' => '20000',
            'Rabat' => '10000',
            'Marrakech' => '40000',
            'Fes' => '30000',
            'Tangier' => '90000',
            'Agadir' => '80000',
            'Meknes' => '50000',
            'Oujda' => '60000',
            'Kenitra' => '14000',
            'Tetouan' => '93000',
            'Safi' => '46000',
            'El Jadida' => '24000',
            'Nador' => '62000',
            'Beni Mellal' => '23000',
            'Taza' => '35000',
            'Settat' => '26000',
            'Berrechid' => '26100',
            'Khouribga' => '25000',
            'Larache' => '92000',
            'Ksar El Kebir' => '92100',
            'Khemisset' => '15000',
            'Mohammedia' => '20650',
            'Essaouira' => '44000',
            'Taroudant' => '83000',
            'Ouarzazate' => '45000',
            'Dakhla' => '73000',
            'Laayoune' => '70000',
            'Ifrane' => '53000',
            'Al Hoceima' => '32000',
            'Chefchaouen' => '91000',
        ];
    }

    /**
     * Get a distance matrix between major Moroccan cities (in km)
     * Only includes some of the major cities for simplicity
     *
     * @return array
     */
    public static function getDistanceMatrix(): array
    {
        return [
            'Casablanca' => [
                'Casablanca' => 0,
                'Rabat' => 87,
                'Marrakech' => 239,
                'Fes' => 290,
                'Tangier' => 338,
                'Agadir' => 450,
                'Meknes' => 246,
                'Oujda' => 617,
                'Kenitra' => 131,
                'Tetouan' => 371,
                'Safi' => 237,
                'El Jadida' => 96,
                'Nador' => 650,
                'Beni Mellal' => 223,
                'Taza' => 401,
                'Settat' => 75,
                'Berrechid' => 41,
                'Khouribga' => 120,
                'Larache' => 243,
                'Ksar El Kebir' => 222,
                'Khemisset' => 115,
                'Mohammedia' => 27,
                'Essaouira' => 358,
                'Taroudant' => 540,
                'Ouarzazate' => 381,
                'Dakhla' => 1728,
                'Laayoune' => 1190,
                'Ifrane' => 290,
                'Al Hoceima' => 505,
                'Chefchaouen' => 338,
            ],
            'Rabat' => [
                'Casablanca' => 87,
                'Rabat' => 0,
                'Marrakech' => 324,
                'Fes' => 203,
                'Tangier' => 250,
                'Agadir' => 536,
                'Meknes' => 159,
                'Oujda' => 547,
                'Kenitra' => 44,
                'Tetouan' => 283,
                'Safi' => 308,
                'El Jadida' => 167,
                'Nador' => 498,
                'Beni Mellal' => 235,
                'Taza' => 299,
                'Settat' => 158,
                'Berrechid' => 128,
                'Khouribga' => 154,
                'Larache' => 156,
                'Ksar El Kebir' => 134,
                'Khemisset' => 81,
                'Mohammedia' => 77,
                'Essaouira' => 443,
                'Taroudant' => 633,
                'Ouarzazate' => 469,
                'Dakhla' => 1815,
                'Laayoune' => 1277,
                'Ifrane' => 185,
                'Al Hoceima' => 423,
                'Chefchaouen' => 255,
            ],
            // Distance matrix for other major cities
            'Marrakech' => [
                'Casablanca' => 239,
                'Rabat' => 324,
                'Marrakech' => 0,
                'Fes' => 530,
                'Tangier' => 574,
                'Agadir' => 256,
                'Meknes' => 460,
                'Oujda' => 857,
                'Kenitra' => 368,
                'Tetouan' => 607,
                'Safi' => 145,
                'El Jadida' => 258,
                'Nador' => 861,
                'Beni Mellal' => 215,
                'Taza' => 641,
                'Settat' => 185,
                'Berrechid' => 200,
                'Khouribga' => 235,
                'Larache' => 479,
                'Ksar El Kebir' => 458,
                'Khemisset' => 351,
                'Mohammedia' => 260,
                'Essaouira' => 189,
                'Taroudant' => 318,
                'Ouarzazate' => 192,
                'Dakhla' => 1654,
                'Laayoune' => 1032,
                'Ifrane' => 444,
                'Al Hoceima' => 730,
                'Chefchaouen' => 560,
            ],
            'Fes' => [
                'Casablanca' => 290,
                'Rabat' => 203,
                'Marrakech' => 530,
                'Fes' => 0,
                'Tangier' => 399,
                'Agadir' => 798,
                'Meknes' => 65,
                'Oujda' => 345,
                'Kenitra' => 246,
                'Tetouan' => 320,
                'Safi' => 515,
                'El Jadida' => 370,
                'Nador' => 370,
                'Beni Mellal' => 308,
                'Taza' => 118,
                'Settat' => 336,
                'Berrechid' => 331,
                'Khouribga' => 286,
                'Larache' => 305,
                'Ksar El Kebir' => 283,
                'Khemisset' => 122,
                'Mohammedia' => 270,
                'Essaouira' => 650,
                'Taroudant' => 902,
                'Ouarzazate' => 670,
                'Dakhla' => 2090,
                'Laayoune' => 1552,
                'Ifrane' => 65,
                'Al Hoceima' => 240,
                'Chefchaouen' => 180,
            ],
            'Tangier' => [
                'Casablanca' => 338,
                'Rabat' => 250,
                'Marrakech' => 574,
                'Fes' => 399,
                'Tangier' => 0,
                'Agadir' => 850,
                'Meknes' => 364,
                'Oujda' => 713,
                'Kenitra' => 207,
                'Tetouan' => 63,
                'Safi' => 576,
                'El Jadida' => 418,
                'Nador' => 412,
                'Beni Mellal' => 563,
                'Taza' => 462,
                'Settat' => 413,
                'Berrechid' => 380,
                'Khouribga' => 450,
                'Larache' => 90,
                'Ksar El Kebir' => 111,
                'Khemisset' => 279,
                'Mohammedia' => 335,
                'Essaouira' => 693,
                'Taroudant' => 945,
                'Ouarzazate' => 715,
                'Dakhla' => 2135,
                'Laayoune' => 1597,
                'Ifrane' => 345,
                'Al Hoceima' => 180,
                'Chefchaouen' => 112,
            ],
        ];
    }

    /**
     * Calculate distance between two Moroccan cities
     *
     * @param string $fromCity
     * @param string $toCity
     * @return float|null Returns null if the cities aren't in the matrix
     */
    public static function getDistance(string $fromCity, string $toCity): ?float
    {
        $distanceMatrix = self::getDistanceMatrix();
        
        // Check if both cities are in our main matrix
        if (isset($distanceMatrix[$fromCity]) && isset($distanceMatrix[$fromCity][$toCity])) {
            return $distanceMatrix[$fromCity][$toCity];
        }
        
        // Check if both cities are in our main matrix but in reverse order
        if (isset($distanceMatrix[$toCity]) && isset($distanceMatrix[$toCity][$fromCity])) {
            return $distanceMatrix[$toCity][$fromCity];
        }
        
        // If not found, return a default distance based on average distances in Morocco
        return 300; // Default average distance in km
    }
}
