<?php

use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\PropertyImageController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// Auth
Route::post('/login', [AuthController::class, 'login']);

// Public API (no auth for demo)
Route::prefix('v1')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('properties', PropertyController::class);
    Route::apiResource('rooms', RoomController::class);
    Route::apiResource('tenants', TenantController::class);
    Route::apiResource('contracts', ContractController::class);
    Route::apiResource('invoices', InvoiceController::class);

    // Property image management
    Route::prefix('properties/{property}/images')->group(function () {
        Route::post('/',                [PropertyImageController::class, 'store']);
        Route::post('/reorder',         [PropertyImageController::class, 'reorder']);
        Route::post('/{image}/set-main',[PropertyImageController::class, 'setMain']);
        Route::delete('/{image}',       [PropertyImageController::class, 'destroy']);
    });
});
