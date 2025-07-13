<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::prefix('v1')->group(function () {
    // Authentication routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Public content routes
    Route::get('/content/public', [ContentController::class, 'public']);
    Route::get('/content/{key}', [ContentController::class, 'getByKey']);
    
    // Public services routes
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{service}', [ServiceController::class, 'show']);
    
    // Public inquiry submission
    Route::post('/inquiries', [InquiryController::class, 'store']);
});

// Protected routes
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);
    
    // User inquiries
    Route::get('/my-inquiries', function(Request $request) {
        return app(InquiryController::class)->index(
            $request->merge(['user_id' => auth()->id()])
        );
    });
});

// Admin routes
Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/quick-stats', [DashboardController::class, 'quickStats']);
    Route::get('/dashboard/system-health', [DashboardController::class, 'systemHealth']);
    
    // Services management
    Route::apiResource('services', ServiceController::class);
    Route::post('/services/{service}/toggle-active', [ServiceController::class, 'toggleActive']);
    Route::post('/services/update-order', [ServiceController::class, 'updateOrder']);
    
    // Inquiries management
    Route::apiResource('inquiries', InquiryController::class);
    Route::get('/inquiries-statistics', [InquiryController::class, 'statistics']);
    Route::post('/inquiries/bulk-update', [InquiryController::class, 'bulkUpdate']);
    
    // Content management
    Route::apiResource('content', ContentController::class);
    Route::put('/content/key/{key}', [ContentController::class, 'updateByKey']);
    Route::post('/content/bulk-update', [ContentController::class, 'bulkUpdate']);
    
    // Users management (basic)
    Route::get('/users', function() {
        return response()->json([
            'success' => true,
            'data' => \App\Models\User::paginate(15)
        ]);
    });
});

// Fallback route
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'API endpoint not found'
    ], 404);
});