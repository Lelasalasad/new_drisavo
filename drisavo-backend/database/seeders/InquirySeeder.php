<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inquiry;
use App\Models\Service;
use App\Models\User;

class InquirySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = Service::all();
        $users = User::where('role', 'user')->get();
        $admin = User::where('role', 'admin')->first();

        $inquiries = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '+1 (555) 123-4567',
                'service_id' => $services->first()->id,
                'message' => 'I need a driver for daily commute to work.',
                'status' => 'new',
                'priority' => 'medium',
                'user_id' => $users->first()->id ?? null,
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'phone' => '+1 (555) 987-6543',
                'service_id' => $services->skip(1)->first()->id,
                'message' => 'Looking for corporate transportation solutions.',
                'status' => 'in_progress',
                'priority' => 'high',
                'assigned_to' => $admin->id,
                'user_id' => $users->skip(1)->first()->id ?? null,
            ],
            [
                'name' => 'Mike Johnson',
                'email' => 'mike@example.com',
                'phone' => '+1 (555) 456-7890',
                'service_id' => $services->skip(2)->first()->id,
                'message' => 'Need transportation for a wedding party of 20 people.',
                'status' => 'completed',
                'priority' => 'medium',
                'assigned_to' => $admin->id,
            ],
            [
                'name' => 'Sarah Wilson',
                'email' => 'sarah@example.com',
                'phone' => '+1 (555) 321-0987',
                'service_id' => $services->first()->id,
                'message' => 'Urgent: Need a driver for medical appointment tomorrow.',
                'status' => 'new',
                'priority' => 'urgent',
            ],
            [
                'name' => 'David Brown',
                'email' => 'david@example.com',
                'phone' => '+1 (555) 654-3210',
                'service_id' => $services->skip(3)->first()->id,
                'message' => 'Interested in monthly corporate package for executives.',
                'status' => 'in_progress',
                'priority' => 'high',
                'assigned_to' => $admin->id,
            ],
        ];

        foreach ($inquiries as $inquiry) {
            Inquiry::create($inquiry);
        }
    }
}