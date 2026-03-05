<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Program;

class HomeApiController extends Controller
{
    public function loadBanners()
    {
        return Banner::where('is_active', 1)->where('is_banner', 1)->orderBy('order', 'asc')->get();
    }

    public function getRecentPosts()
    {
        return Post::with('post_program')->with('categories')
            ->where('status', 'published')->orderBy('date_published', 'desc')->where('banner', '!=', null)->take(15)->get();
    }

    public function getFeaturedPosts()
    {
        return Post::with('post_program')->with('categories')->where('status', 'published')->where('is_featured', 1)->orderBy('date_published', 'desc')->where('banner', '!=', null)->take(15)->get();
    }

    public function getFeaturedCategories()
    {
        return Category::select('category_id', 'title', 'description')->where('is_active', 1)->where('is_banner', 1)->orderBy('title', 'asc')->get();
    }

    public function loadHomePageMounts()
    {
        return [
            'banners' => $this->loadBanners(),
            'recent_posts' => $this->getRecentPosts(),
            'featured_posts' => $this->getFeaturedPosts(),
            'featured_categories' => $this->getFeaturedCategories()
        ];
    }

    public function getFeaturedPrograms()
    {
        return Program::select('program_id', 'code', 'program_type', 'title', 'description', 'agency', 'image')
            ->where('is_active', 1)
            ->where('is_banner', 1)
            ->with(['episodes' => function ($query) {
                    $query->select(
                        'post_id',
                        'program_id',
                        'title',
                        'slug',
                        'date_published',
                        'thumbnail',
                        'banner',
                        'trailer',
                        'type',
                        'excerpt'
                    )
                        ->where('status', 'published')
                        ->orderByDesc('date_published')
                        ->take(6);
                }
            ])
            ->orderBy('order', 'desc')
            ->get();
    }
}
