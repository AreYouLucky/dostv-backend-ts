<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Banner;
use App\Models\Program;
use Illuminate\Support\Facades\Cache;
use App\Models\Category;
use Illuminate\Support\Facades\Http;
use App\Models\Advertisement;

class InitialAPIController extends Controller
{
    public function loadBanners()
    {
        return Banner::where('is_active', 1)->where('is_banner',1)->orderBy('order', 'desc')->get();
    }

    public function loadPrograms()
    {
        return Program::select('code', 'title', 'description', 'image', 'program_type',)
            ->where('is_active', 1)
            ->where('is_banner', 1)
            ->orderBy('order', 'desc')
            ->get();
    }

    public function loadCategories(){
        return Category::select('category_id', 'title', 'description')->where('is_active', 1)->orderBy('title', 'asc')->get();
    }

    public function getBannerCategories(){
        return Category::select('category_id', 'title', 'description')->where('is_banner', 1)->orderBy('title', 'asc')->get();
    }

    public function loadAdvertisements()
    {
        return Advertisement::select('title', 'excerpt', 'thumbnail', 'url')->where('is_active', 1)->orderBy('order', 'desc')->get();
    }
}
