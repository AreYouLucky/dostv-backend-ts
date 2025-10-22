<?php 

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Authentication\AuthController;

Route::middleware('auth')->group(function () {
    Route::get('/categories', function () {
        return Inertia::render('cms/categories');
    });
});