<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Models\Program;
use App\Models\Testimonial;
use App\Models\Advertisement;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function contentCount()
    {
        $data = Cache::remember('dashboard_stats', now()->addMinutes(1), function () {
            $post = Post::selectRaw('
                COUNT(*) as total,
                SUM(status = "published") as published,
                SUM(status = "draft") as draft,
                SUM(status = "trashed") as trashed
            ')->first();

            $category = Category::where('is_active', 1)->selectRaw('
                COUNT(*) as total,
                SUM(is_banner = 1) as active,
                SUM(is_banner = 0) as inactive
            ')->first();

            $banner = Banner::where('is_active', 1)->selectRaw('
                COUNT(*) as total,
                SUM(is_banner = 1) as active,
                SUM(is_banner = 0) as inactive
            ')->first();

            $advertisement = Advertisement::where('is_active', 1)->selectRaw('
                COUNT(*) as total,
                SUM(is_banner = 1) as active,
                SUM(is_banner = 0) as inactive
            ')->first();

            $testimonial = Testimonial::where('is_active', 1)->selectRaw('
                COUNT(*) as total,
                SUM(is_banner = 1) as active,
                SUM(is_banner = 0) as inactive
            ')->first();

            return [
                'post' => $post,
                'category' => $category,
                'banner' => $banner,
                'advertisement' => $advertisement,
                'testimonial' => $testimonial,
            ];
        });

        return response()->json($data);
    }

    public function programCount()
    {
        $categories = Category::select('title')
            ->withCount('postCategories')
            ->where('is_active', 1)
            ->get();
        return response()->json($categories);
    }

    public function getRecentPost()
    {
        return Post::whereNot('status', 'trashed')->with('post_program')
            ->orderBy('date_published', 'desc')
            ->get()
            ->take(7);
    }
}
