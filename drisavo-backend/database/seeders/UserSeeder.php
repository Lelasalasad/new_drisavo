<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@drisavo.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'phone' => '+1 (555) 123-4567',
            'is_active' => true,
        ]);

        // Create demo users
        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => '+1 (555) 987-6543',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => '+1 (555) 456-7890',
            'is_active' => true,
        ]);
    }
}