<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backend\PostController;

Route::middleware('auth')->group(function () {
    Route::get('/view-posts', [PostController::class,'viewPostPage']);

    Route::resource('/posts', PostController::class)->only(['index', 'store', 'destroy', 'edit','create']);
    Route::post('/update-post/{id}',[PostController::class,'update']);
    Route::post('/update-post-status',[PostController::class,'updatePostStatus']);

    Route::post('/toggle-post-featured/{id}',[PostController::class,'togglePostFeatured']);
});
