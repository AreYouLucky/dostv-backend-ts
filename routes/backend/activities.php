<?php 
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backend\UsersActivityController;

Route::middleware('auth')->group(function () {
    Route::get('/view-activities', [UsersActivityController::class, 'viewActivities']);
    Route::get('/user-activities', [UsersActivityController::class, 'fetchUsersActivities']);
});