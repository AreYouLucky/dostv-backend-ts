<?php 

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Authentication\AuthController;

Route::middleware('guest')->group(function () {
    Route::get('/', function () {
        return Inertia::render('authentication/login-page');
    })->name('login');
    Route::post('/request-login',[AuthController::class, 'login']);
});
Route::get('/request-logout',[AuthController::class, 'logout'])->middleware('auth');
