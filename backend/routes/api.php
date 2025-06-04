<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\TestController;
use App\Http\Controllers\API\DeliveryController;
use App\Http\Controllers\API\PriceController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\TestOrdersController;
use App\Http\Controllers\API\DevController;

// Public routes
Route::get('/track/{trackingCode}', [DeliveryController::class, 'track']);
Route::get('/test', [TestController::class, 'test']);
Route::get('/test-orders', [TestOrdersController::class, 'testOrders']);
Route::post('/calculate-price', [PriceController::class, 'calculate']);
Route::post('/calculate-price-cities', [PriceController::class, 'calculateFromCities']);

// City routes
Route::get('/cities', [\App\Http\Controllers\API\CityController::class, 'getCities']);
Route::get('/cities/postal-codes', [\App\Http\Controllers\API\CityController::class, 'getCitiesWithPostalCodes']);
Route::post('/cities/distance', [\App\Http\Controllers\API\CityController::class, 'getDistance']);
Route::post('/shipping/details', [\App\Http\Controllers\API\CityController::class, 'getShippingDetails']);

// Development routes (public access for testing)
Route::get('/dev/users', [DevController::class, 'getUsers']);
Route::get('/dev/deliveries', [DevController::class, 'getDeliveries']);
Route::get('/dev/deliveries/{deliveryId}', [DevController::class, 'getDeliveryDetails']);
Route::get('/dev/orders', [DevController::class, 'getOrders']);
Route::get('/dev/orders/{orderId}', [DevController::class, 'getOrderDetails']);
Route::get('/dev/stats', [DevController::class, 'getStats']);
Route::get('/dev/users/{userId}/orders', [DevController::class, 'getUserOrders']);

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Password reset routes
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// User routes (authenticated users)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [ProfileController::class, 'update']);
    Route::post('/user/profile/image', [ProfileController::class, 'uploadImage']);

    // Notification preferences routes
    Route::get('/user/notification-preferences', [ProfileController::class, 'getNotificationPreferences']);
    Route::put('/user/notification-preferences', [ProfileController::class, 'updateNotificationPreferences']);

    // User delivery routes
    Route::get('/user/deliveries', [DeliveryController::class, 'userDeliveries']);
    Route::get('/user/deliveries/{id}', [DeliveryController::class, 'userDelivery']);
    Route::post('/deliveries', [DeliveryController::class, 'store']);
    Route::put('/deliveries/{delivery}', [DeliveryController::class, 'update']);
    Route::patch('/user/deliveries/{delivery}/cancel', [DeliveryController::class, 'cancelUserDelivery']);

    // Dashboard routes
    Route::get('/user/dashboard-stats', [DeliveryController::class, 'getDashboardStats']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Admin delivery routes
    Route::get('/deliveries', [DeliveryController::class, 'index']);
    Route::get('/deliveries/{delivery}', [DeliveryController::class, 'show']);
    Route::patch('deliveries/{delivery}/status', [DeliveryController::class, 'updateStatus']);
    Route::delete('/deliveries/{delivery}', [DeliveryController::class, 'destroy']);

    // Admin users management
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::patch('/users/{userId}/role', [AdminController::class, 'updateUserRole']);

    // Admin orders management
    Route::get('/orders', [AdminController::class, 'getOrders']);
    Route::patch('/orders/{orderId}/status', [AdminController::class, 'updateOrderStatus']);

    // Admin dashboard stats
    Route::get('/admin/stats', [AdminController::class, 'getStats']);
});
