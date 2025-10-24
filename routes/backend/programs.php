<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backend\ProgramsController;

Route::middleware('auth')->group(function () {
    Route::get('/view-programs', function () {
        return Inertia::render('cms/program/program-page');
    });
});