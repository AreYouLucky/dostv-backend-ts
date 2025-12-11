<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backend\BannersController;

Route::middleware('auth')->group(function () {
    Route::get('/view-advertisements', function () {
        return Inertia::render('cms/advertisements/advertisements-page');
    });

    Route::resource('/banners', BannersController::class)->only(['index','store','update', 'destroy', 'edit']);;
});