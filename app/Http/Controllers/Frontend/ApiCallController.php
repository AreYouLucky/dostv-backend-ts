<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Banner;
use App\Models\Program;

class ApiCallController extends Controller
{
    public function loadBanners(){
       return Banner::where('is_active', 1)->orderBy('order', 'desc')->get();
    }

    public function loadPrograms(){
        return Program::select('code', 'title', 'description', 'image', 'program_type')
        ->where('is_active', 1)
        ->where('is_banner', 1)
        ->orderBy('order', 'desc')
        ->get();
    }
}
