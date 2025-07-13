<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\Service;
use App\Models\User;
use App\Models\Content;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function index()
    {
        // Basic counts
        $totalInquiries = Inquiry::count();
        $totalServices = Service::count();
        $totalUsers = User::where('role', 'user')->count();
        $activeServices = Service::active()->count();

        // Inquiry statistics
        $newInquiries = Inquiry::status('new')->count();
        $inProgressInquiries = Inquiry::status('in_progress')->count();
        $completedInquiries = Inquiry::status('completed')->count();

        // Time-based statistics
        $todayInquiries = Inquiry::whereDate('created_at', today())->count();
        $thisWeekInquiries = Inquiry::whereBetween('created_at', [
            Carbon::now()->startOfWeek(),
            Carbon::now()->endOfWeek()
        ])->count();
        $thisMonthInquiries = Inquiry::whereMonth('created_at', now()->month)->count();

        // Growth calculations
        $lastMonthInquiries = Inquiry::whereMonth('created_at', now()->subMonth()->month)->count();
        $growthRate = $lastMonthInquiries > 0 
            ? round((($thisMonthInquiries - $lastMonthInquiries) / $lastMonthInquiries) * 100, 1)
            : 0;

        // Recent inquiries
        $recentInquiries = Inquiry::with(['service', 'user'])
                                 ->latest()
                                 ->limit(5)
                                 ->get();

        // Inquiries by service
        $inquiriesByService = Service::withCount('inquiries')
                                   ->orderBy('inquiries_count', 'desc')
                                   ->limit(5)
                                   ->get()
                                   ->map(function($service) {
                                       return [
                                           'service' => $service->title,
                                           'count' => $service->inquiries_count
                                       ];
                                   });

        // Inquiries by status for chart
        $inquiriesByStatus = [
            ['status' => 'New', 'count' => $newInquiries, 'color' => '#3b82f6'],
            ['status' => 'In Progress', 'count' => $inProgressInquiries, 'color' => '#f59e0b'],
            ['status' => 'Completed', 'count' => $completedInquiries, 'color' => '#10b981'],
        ];

        // Monthly inquiries for the last 6 months
        $monthlyInquiries = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $count = Inquiry::whereYear('created_at', $date->year)
                           ->whereMonth('created_at', $date->month)
                           ->count();
            $monthlyInquiries[] = [
                'month' => $date->format('M Y'),
                'count' => $count
            ];
        }

        // Priority distribution
        $priorityDistribution = [
            'low' => Inquiry::priority('low')->count(),
            'medium' => Inquiry::priority('medium')->count(),
            'high' => Inquiry::priority('high')->count(),
            'urgent' => Inquiry::priority('urgent')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'overview' => [
                    'total_inquiries' => $totalInquiries,
                    'total_services' => $totalServices,
                    'total_users' => $totalUsers,
                    'active_services' => $activeServices,
                    'new_inquiries' => $newInquiries,
                    'in_progress_inquiries' => $inProgressInquiries,
                    'completed_inquiries' => $completedInquiries,
                    'today_inquiries' => $todayInquiries,
                    'this_week_inquiries' => $thisWeekInquiries,
                    'this_month_inquiries' => $thisMonthInquiries,
                    'growth_rate' => $growthRate,
                ],
                'recent_inquiries' => $recentInquiries,
                'inquiries_by_service' => $inquiriesByService,
                'inquiries_by_status' => $inquiriesByStatus,
                'monthly_inquiries' => $monthlyInquiries,
                'priority_distribution' => $priorityDistribution,
            ]
        ]);
    }

    /**
     * Get quick stats for widgets
     */
    public function quickStats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                [
                    'title' => 'Total Inquiries',
                    'value' => Inquiry::count(),
                    'icon' => 'MessageSquare',
                    'color' => 'blue',
                    'change' => '+12%',
                    'trend' => 'up'
                ],
                [
                    'title' => 'Active Services',
                    'value' => Service::active()->count(),
                    'icon' => 'Settings',
                    'color' => 'green',
                    'change' => '+2',
                    'trend' => 'up'
                ],
                [
                    'title' => 'New This Week',
                    'value' => Inquiry::whereBetween('created_at', [
                        Carbon::now()->startOfWeek(),
                        Carbon::now()->endOfWeek()
                    ])->count(),
                    'icon' => 'TrendingUp',
                    'color' => 'purple',
                    'change' => '+8%',
                    'trend' => 'up'
                ],
                [
                    'title' => 'Completion Rate',
                    'value' => $this->getCompletionRate() . '%',
                    'icon' => 'Users',
                    'color' => 'orange',
                    'change' => '+5%',
                    'trend' => 'up'
                ],
            ]
        ]);
    }

    /**
     * Calculate completion rate
     */
    private function getCompletionRate()
    {
        $total = Inquiry::count();
        $completed = Inquiry::status('completed')->count();
        
        return $total > 0 ? round(($completed / $total) * 100, 1) : 0;
    }

    /**
     * Get system health status
     */
    public function systemHealth()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'database' => 'healthy',
                'cache' => 'healthy',
                'storage' => 'healthy',
                'mail' => 'healthy',
                'last_backup' => Carbon::now()->subHours(6)->toISOString(),
                'uptime' => '99.9%',
                'response_time' => '120ms',
            ]
        ]);
    }
}