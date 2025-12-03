<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backend\BannersController;

Route::middleware('auth')->group(function () {
    Route::get('/view-banners', function () {
        return Inertia::render('cms/banner/banners-page');
    });

    Route::resource('/banners', BannersController::class)->only(['index','store','update', 'destroy', 'edit']);;
});
