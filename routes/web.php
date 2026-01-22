<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\YoutubeController;


Route::get('/youtube/top-videos/{year}', [YoutubeController::class, 'topVideos']);

require __DIR__.'/settings.php';
require __DIR__.'/authentication/authentication.php';
require __DIR__.'/backend/categories.php';
require __DIR__.'/backend/programs.php';
require __DIR__.'/backend/banners.php';
require __DIR__.'/backend/posts.php';
require __DIR__.'/backend/advertisements.php';
require __DIR__.'/backend/testimonials.php';
require __DIR__.'/backend/dashboard.php';


