<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backend\TestimonialController;

Route::middleware('auth')->group(function () {
    Route::get('/view-testimonials', function () {
        return Inertia::render('cms/testimonial/testimonials-page');
    });
    Route::resource('/testimonials', TestimonialController::class)->only(['index','store','update', 'destroy', 'edit', 'create']);
    Route::post('/update-testimonial/{id}',[TestimonialController::class,'update']);
    Route::post('/toggle-testimonial-visibility/{id}',[TestimonialController::class,'toggleTestimonialVisibility']);

});
