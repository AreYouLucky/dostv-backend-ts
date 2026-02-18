<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Program;
use App\Models\Post;
use Illuminate\Support\Facades\Cache;

class PostApiController extends Controller
{
    public function getDashboardPost(Request $request)
    {
        $categoryIds = $request->categories ?? [];
        $cacheKey = 'dashboard_posts_' . md5(json_encode($categoryIds));

        return Cache::remember($cacheKey, 60, function () use ($categoryIds) {
            return Program::query()
                ->select('program_id', 'title', 'code')
                ->where('is_banner', 1)
                ->where('is_active', 1)
                ->whereHas('episodes.categories', function ($q) use ($categoryIds) {
                    if (!empty($categoryIds)) {
                        $q->whereIn('category', $categoryIds);
                    }
                })
                ->with([
                    'episodes' => function ($query) use ($categoryIds) {
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
                            ->take(6)
                            ->whereHas('categories', function ($q) use ($categoryIds) {
                                if (!empty($categoryIds)) {
                                    $q->whereIn('category', $categoryIds);
                                }
                            })
                            ->with([
                                'categories' => function ($q) use ($categoryIds) {
                                    $q->select('post_id', 'category', 'category_name');

                                    if (!empty($categoryIds)) {
                                        $q->whereIn('category', $categoryIds);
                                    }
                                }
                            ]);
                    }
                ])
                ->orderByDesc('order')
                ->get();
        });
    }

    public function loadRecentPosts(Request $request)
    {
        return Post::where('status', 'published')
            ->where('status', 'published')
            ->with('post_program')
            ->orderByDesc('date_published')
            ->take(10)
            ->get();
    }



    public function getPosts(String $code)
    {

        $post = Post::where('code', $code)->first();
        $related = Post::where('cat.category', $post->cat->category)
            ->join('post_categories as cat', 'cat.post_id', '=', 'posts.post_id')
            ->where('posts.post_id', '!=', $post->post_id)->take(20)->get();

        return response()->json([
            'post' => $post,
            'related' => $related
        ]);
    }

    public function searchPost(Request $request)
    {
        $query = Post::where('is_active', 1);
        if ($request->filled('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }
        if ($request->filled('program_id')) {
            $query->where('program_id', $request->program_id);
        }
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        return $query->take(20)->get();
    }
}
