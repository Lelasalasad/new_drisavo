<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContentController extends Controller
{
    /**
     * Display a listing of content
     */
    public function index(Request $request)
    {
        $query = Content::query();

        // Filter by active status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->get('type'));
        }

        // Search by key or title
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('key', 'like', "%{$search}%")
                  ->orWhere('title', 'like', "%{$search}%");
            });
        }

        $content = $query->orderBy('key')->get();

        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }

    /**
     * Store a newly created content
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'key' => 'required|string|max:255|unique:contents,key',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:text,html,image,json',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $content = Content::create([
            'key' => $request->key,
            'title' => $request->title,
            'content' => $request->content,
            'type' => $request->type,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Content created successfully',
            'data' => $content
        ], 201);
    }

    /**
     * Display the specified content
     */
    public function show($key)
    {
        $content = Content::where('key', $key)->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }

    /**
     * Update the specified content
     */
    public function update(Request $request, Content $content)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:text,html,image,json',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $content->update([
            'title' => $request->title,
            'content' => $request->content,
            'type' => $request->type,
            'is_active' => $request->boolean('is_active'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Content updated successfully',
            'data' => $content
        ]);
    }

    /**
     * Remove the specified content
     */
    public function destroy(Content $content)
    {
        $content->delete();

        return response()->json([
            'success' => true,
            'message' => 'Content deleted successfully'
        ]);
    }

    /**
     * Get content by key for public use
     */
    public function getByKey($key)
    {
        $content = Content::getByKey($key);

        if (!$content) {
            return response()->json([
                'success' => false,
                'message' => 'Content not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }

    /**
     * Update content by key
     */
    public function updateByKey(Request $request, $key)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $content = Content::updateByKey($key, $request->content);

        return response()->json([
            'success' => true,
            'message' => 'Content updated successfully',
            'data' => $content
        ]);
    }

    /**
     * Get all public content (for frontend)
     */
    public function public()
    {
        $content = Content::active()->get()->keyBy('key');

        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }

    /**
     * Bulk update content
     */
    public function bulkUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'contents' => 'required|array',
            'contents.*.key' => 'required|string',
            'contents.*.content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        foreach ($request->contents as $contentData) {
            Content::updateByKey($contentData['key'], $contentData['content']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Content updated successfully'
        ]);
    }
}