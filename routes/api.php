<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Frontend\ApiCallController;


Route::middleware('api.token')->group(function () {
    Route::get('/load-banners', [ApiCallController::class, 'loadBanners']); 
    Route::get('/load-programs', [ApiCallController::class, 'loadPrograms']);
});

Route::get('/ping', function () {
    return 'pong';
});