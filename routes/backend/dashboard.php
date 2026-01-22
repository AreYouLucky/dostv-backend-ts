<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard/dashboard-page');
    });

    Route::get('/content-count', [DashboardController::class, 'contentCount']);
    Route::get('/program-count', [DashboardController::class, 'programCount']);
    Route::get('/get-recent-post', [DashboardController::class, 'getRecentPost']);

});