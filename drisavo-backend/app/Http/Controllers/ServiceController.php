<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    /**
     * Display a listing of services
     */
    public function index(Request $request)
    {
        $query = Service::query();

        // Filter by active status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        // Search by title or description
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $services = $query->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $services
        ]);
    }

    /**
     * Store a newly created service
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|string|max:100',
            'features' => 'required|array',
            'features.*' => 'string|max:255',
            'icon' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $service = Service::create([
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'features' => $request->features,
            'icon' => $request->icon ?? 'car',
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $request->sort_order ?? Service::max('sort_order') + 1,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Service created successfully',
            'data' => $service
        ], 201);
    }

    /**
     * Display the specified service
     */
    public function show(Service $service)
    {
        return response()->json([
            'success' => true,
            'data' => $service
        ]);
    }

    /**
     * Update the specified service
     */
    public function update(Request $request, Service $service)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|string|max:100',
            'features' => 'required|array',
            'features.*' => 'string|max:255',
            'icon' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $service->update([
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'features' => $request->features,
            'icon' => $request->icon ?? $service->icon,
            'is_active' => $request->boolean('is_active'),
            'sort_order' => $request->sort_order ?? $service->sort_order,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Service updated successfully',
            'data' => $service
        ]);
    }

    /**
     * Remove the specified service
     */
    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully'
        ]);
    }

    /**
     * Toggle service active status
     */
    public function toggleActive(Service $service)
    {
        $service->update(['is_active' => !$service->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'Service status updated successfully',
            'data' => $service
        ]);
    }

    /**
     * Update services order
     */
    public function updateOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'services' => 'required|array',
            'services.*.id' => 'required|exists:services,id',
            'services.*.sort_order' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        foreach ($request->services as $serviceData) {
            Service::where('id', $serviceData['id'])
                   ->update(['sort_order' => $serviceData['sort_order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Services order updated successfully'
        ]);
    }
}