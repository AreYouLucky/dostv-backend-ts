<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Frontend\InitialAPIController;
use App\Http\Controllers\Frontend\PostApiController;
use App\Http\Controllers\YoutubeController;
use App\Http\Controllers\Frontend\ProgramApiController;

Route::middleware('api.token')->group(function () {
    //Home & Mount Loaded
    Route::get('/load-banners', [InitialAPIController::class, 'loadBanners']);
    Route::get('/load-programs', [InitialAPIController::class, 'loadPrograms']);
    Route::get('/youtube/top-videos/{year}', [YoutubeController::class, 'topVideos']);;
    Route::get('/load-advertisements', [InitialAPIController::class, 'loadAdvertisements']);
    Route::get('/load-categories', [InitialAPIController::class, 'loadCategories']);
    Route::get('/get-banner-categories', [InitialAPIController::class, 'getBannerCategories']);
    Route::get('/get-dashboard-posts', [PostApiController::class, 'getDashboardPost']);

    //Posts
    Route::get('/recent-posts', [PostApiController::class, 'loadRecentPosts']);
    Route::get('/get-post/{slug}', [PostApiController::class, 'getPost']);

    //Program related post
    Route::get('/get-related-post-by-program/{program_id}', [ProgramApiController::class, 'getRelatedPostByProgram']);
    Route::get('/get-program-info/{code}', [ProgramApiController::class, 'getPRogramInfo']);
    Route::get('/program-recent-posts/{code}', [ProgramApiController::class, 'getProgramRecentPosts']);
    Route::get('/program-older-posts/{code}', [ProgramApiController::class, 'getProgramOlderPosts']);
});
