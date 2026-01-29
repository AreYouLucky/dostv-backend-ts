<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backend\ProgramsController;
use App\Http\Controllers\Backend\ProgramSeasonController;

Route::middleware('auth')->group(function () {
    Route::get('/view-programs', function () {
        return Inertia::render('cms/program/programs-page');
    });
    Route::get('/program-form', function () {
        return Inertia::render('cms/program/partials/programs-form');
    });
    Route::get('/program-form/{code}',[ProgramsController::class,'editProgram']);
    Route::post('/move-program',[ProgramsController::class,'moveProgram']);
    Route::resource('/programs', ProgramsController::class)->only(['index','store','destroy', 'edit']);
    Route::post('/update-program/{id}',[ProgramsController::class,'update']);


    //Program Seasons
    Route::resource('/program-seasons', ProgramSeasonController::class)->only(['store', 'edit']);
});