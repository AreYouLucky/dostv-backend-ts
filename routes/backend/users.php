<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\UsersController;
use Inertia\Inertia;

Route::middleware('admin')->group(function () {
    Route::get('/users-management', function () {
        return Inertia::render('user-management/users/users-page');
    });
    Route::resource('/users', UsersController::class)->only(['index','store', 'destroy', 'edit', 'create']);
    Route::post('/update-user/{id}',[UsersController::class,'update']);
    Route::post('/change-user-password/{id}',[UsersController::class,'changePassword']);
});