<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\API\TestController;

Route::get('/', function () {
    return view('welcome');
});

// Sanctum adds the CSRF cookie route automatically
// No need to manually define it

// Public routes
Route::get('/test', [TestController::class, 'test']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
