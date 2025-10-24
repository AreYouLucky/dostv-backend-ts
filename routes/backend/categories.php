<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Authentication\AuthController;
use App\Http\Controllers\Backend\CategoriesController;

Route::middleware('auth')->group(function () {
    Route::get('/view-categories', function () {
        return Inertia::render('cms/categories');
    });

    Route::resource('/categories', CategoriesController::class)->only(['index','store','update', 'destroy', 'edit']);
});
