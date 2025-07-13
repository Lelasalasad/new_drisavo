<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class InquiryController extends Controller
{
    /**
     * Display a listing of inquiries
     */
    public function index(Request $request)
    {
        $query = Inquiry::with(['service', 'user', 'assignedAdmin']);

        // Filter by status
        if ($request->has('status')) {
            $query->status($request->get('status'));
        }

        // Filter by priority
        if ($request->has('priority')) {
            $query->priority($request->get('priority'));
        }

        // Filter by service
        if ($request->has('service_id')) {
            $query->where('service_id', $request->get('service_id'));
        }

        // Search by name, email, or message
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        // Sort by date (newest first by default)
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 15);
        $inquiries = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $inquiries
        ]);
    }

    /**
     * Store a newly created inquiry
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'service_id' => 'nullable|exists:services,id',
            'message' => 'required|string|max:2000',
            'priority' => 'nullable|in:low,medium,high,urgent',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $inquiry = Inquiry::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'service_id' => $request->service_id,
            'message' => $request->message,
            'status' => 'new',
            'priority' => $request->priority ?? 'medium',
            'user_id' => auth()->id(),
        ]);

        // Load relationships
        $inquiry->load(['service', 'user']);

        // Send notification email to admin (optional)
        // Mail::to(config('mail.admin_email'))->send(new NewInquiryMail($inquiry));

        return response()->json([
            'success' => true,
            'message' => 'Inquiry submitted successfully',
            'data' => $inquiry
        ], 201);
    }

    /**
     * Display the specified inquiry
     */
    public function show(Inquiry $inquiry)
    {
        $inquiry->load(['service', 'user', 'assignedAdmin']);

        return response()->json([
            'success' => true,
            'data' => $inquiry
        ]);
    }

    /**
     * Update the specified inquiry
     */
    public function update(Request $request, Inquiry $inquiry)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:new,in_progress,completed,cancelled',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $inquiry->update([
            'status' => $request->status,
            'priority' => $request->priority ?? $inquiry->priority,
            'assigned_to' => $request->assigned_to,
            'notes' => $request->notes,
        ]);

        $inquiry->load(['service', 'user', 'assignedAdmin']);

        return response()->json([
            'success' => true,
            'message' => 'Inquiry updated successfully',
            'data' => $inquiry
        ]);
    }

    /**
     * Remove the specified inquiry
     */
    public function destroy(Inquiry $inquiry)
    {
        $inquiry->delete();

        return response()->json([
            'success' => true,
            'message' => 'Inquiry deleted successfully'
        ]);
    }

    /**
     * Get inquiry statistics
     */
    public function statistics()
    {
        $stats = [
            'total' => Inquiry::count(),
            'new' => Inquiry::status('new')->count(),
            'in_progress' => Inquiry::status('in_progress')->count(),
            'completed' => Inquiry::status('completed')->count(),
            'cancelled' => Inquiry::status('cancelled')->count(),
            'this_month' => Inquiry::whereMonth('created_at', now()->month)->count(),
            'this_week' => Inquiry::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'today' => Inquiry::whereDate('created_at', now()->toDateString())->count(),
        ];

        // Get inquiries by service
        $byService = Service::withCount('inquiries')->get()->map(function($service) {
            return [
                'service' => $service->title,
                'count' => $service->inquiries_count
            ];
        });

        // Get recent inquiries
        $recent = Inquiry::with(['service', 'user'])
                         ->latest()
                         ->limit(5)
                         ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'by_service' => $byService,
                'recent' => $recent
            ]
        ]);
    }

    /**
     * Bulk update inquiries
     */
    public function bulkUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'inquiry_ids' => 'required|array',
            'inquiry_ids.*' => 'exists:inquiries,id',
            'action' => 'required|in:update_status,assign,delete',
            'status' => 'required_if:action,update_status|in:new,in_progress,completed,cancelled',
            'assigned_to' => 'required_if:action,assign|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $inquiries = Inquiry::whereIn('id', $request->inquiry_ids);

        switch ($request->action) {
            case 'update_status':
                $inquiries->update(['status' => $request->status]);
                $message = 'Status updated successfully';
                break;
            
            case 'assign':
                $inquiries->update(['assigned_to' => $request->assigned_to]);
                $message = 'Inquiries assigned successfully';
                break;
            
            case 'delete':
                $inquiries->delete();
                $message = 'Inquiries deleted successfully';
                break;
        }

        return response()->json([
            'success' => true,
            'message' => $message
        ]);
    }
}