<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backend\CategoriesController;

Route::middleware('auth')->group(function () {
    Route::get('/view-categories', function () {
        return Inertia::render('cms/category/categories-page');
    });

    Route::resource('/categories', CategoriesController::class)->only(['index','store','update', 'destroy', 'edit']);
    Route::post('/toggle-category', [CategoriesController::class,'toggleCategory']);

});
