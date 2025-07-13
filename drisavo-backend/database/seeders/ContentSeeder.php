<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Content;

class ContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contents = [
            [
                'key' => 'hero-title',
                'title' => 'Hero Section Title',
                'content' => 'Professional Driving Solutions You Can Trust',
                'type' => 'text',
                'is_active' => true,
            ],
            [
                'key' => 'hero-subtitle',
                'title' => 'Hero Section Subtitle',
                'content' => 'Experience premium driving services with our certified professionals. Safe, reliable, and always on time - that\'s the Drisavo promise.',
                'type' => 'text',
                'is_active' => true,
            ],
            [
                'key' => 'about-title',
                'title' => 'About Section Title',
                'content' => 'About Drisavo',
                'type' => 'text',
                'is_active' => true,
            ],
            [
                'key' => 'about-content',
                'title' => 'About Section Content',
                'content' => 'Founded in 2013, Drisavo has been at the forefront of professional driving services, providing safe, reliable, and premium transportation solutions to individuals and businesses.',
                'type' => 'text',
                'is_active' => true,
            ],
            [
                'key' => 'contact-phone',
                'title' => 'Contact Phone',
                'content' => '+1 (555) 123-4567',
                'type' => 'text',
                'is_active' => true,
            ],
            [
                'key' => 'contact-email',
                'title' => 'Contact Email',
                'content' => 'info@drisavo.com',
                'type' => 'text',
                'is_active' => true,
            ],
            [
                'key' => 'contact-address',
                'title' => 'Contact Address',
                'content' => '123 Business District, City, State 12345',
                'type' => 'text',
                'is_active' => true,
            ],
            [
                'key' => 'emergency-phone',
                'title' => 'Emergency Phone',
                'content' => '+1 (555) 911-HELP',
                'type' => 'text',
                'is_active' => true,
            ],
            [
                'key' => 'company-description',
                'title' => 'Company Description',
                'content' => 'Professional driving services you can trust. Safe, reliable, and always on time.',
                'type' => 'text',
                'is_active' => true,
            ],
        ];

        foreach ($contents as $content) {
            Content::create($content);
        }
    }
}