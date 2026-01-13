<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backend\PostController;

Route::middleware('auth')->group(function () {
    Route::get('/view-posts', function () {
        return Inertia::render('cms/post/posts-page');
    });

    Route::resource('/posts', PostController::class)->only(['index', 'store', 'destroy', 'edit','create']);
    Route::get('/search/posts',[PostController::class, 'searchPost']);

    Route::get('/post-form', function () {
        return Inertia::render('cms/post/partials/post-form');
    });
});
