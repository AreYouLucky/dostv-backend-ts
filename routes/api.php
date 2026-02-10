<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Frontend\InitialAPIController;
use App\Http\Controllers\Frontend\PostApiController;
use App\Http\Controllers\YoutubeController;


Route::middleware('api.token')->group(function () {
    Route::get('/load-banners', [InitialAPIController::class, 'loadBanners']); 
    Route::get('/load-programs', [InitialAPIController::class, 'loadPrograms']);
    Route::get('/youtube/top-videos/{year}', [YoutubeController::class, 'topVideos']);;
    Route::get('/load-advertisements', [InitialAPIController::class, 'loadAdvertisements']);
    Route::get('/get-initial-posts', [PostApiController::class, 'getInitialPosts']);
});

Route::get('/ping', function () {
    return 'pong';
});