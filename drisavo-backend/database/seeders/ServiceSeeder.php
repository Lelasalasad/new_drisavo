<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'title' => 'Personal Driver',
                'description' => 'Professional personal driving services for daily commutes, appointments, and special occasions.',
                'price' => 'Starting at $25/hour',
                'features' => ['Licensed drivers', 'Flexible scheduling', 'Door-to-door service'],
                'icon' => 'car',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Commercial Transport',
                'description' => 'Reliable commercial driving solutions for businesses and freight transportation.',
                'price' => 'Custom pricing',
                'features' => ['Commercial licenses', 'Cargo insurance', 'Route optimization'],
                'icon' => 'truck',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Group Transportation',
                'description' => 'Safe and comfortable group transport for events, tours, and corporate functions.',
                'price' => 'Starting at $150/trip',
                'features' => ['Large vehicle fleet', 'Event coordination', 'Group discounts'],
                'icon' => 'users',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'Corporate Services',
                'description' => 'Professional driving services tailored for corporate clients and executives.',
                'price' => 'Monthly packages',
                'features' => ['Executive vehicles', '24/7 availability', 'Corporate billing'],
                'icon' => 'building',
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}