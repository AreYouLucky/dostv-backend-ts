<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backend\AdvertisementController;

Route::middleware('auth')->group(function () {
    Route::get('/view-advertisements', function () {
        return Inertia::render('cms/advertisement/advertisements-page');
    });
    Route::resource('/advertisements', AdvertisementController::class)->only(['index','store','update', 'destroy', 'edit', 'create']);
    Route::post('/update-advertisement/{id}',[AdvertisementController::class,'update']);
    Route::post('/move-advertisement',[AdvertisementController::class,'moveAdvertisement']);
    Route::post('/toggle-advertisement-visibility/{id}',[AdvertisementController::class,'toggleAdvertisementVisibility']);
});