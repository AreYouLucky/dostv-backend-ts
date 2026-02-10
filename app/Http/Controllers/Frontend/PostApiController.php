<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Program;
use App\Models\Post;

class PostApiController extends Controller
{
    public function getInitialPosts()
    {
        return Program::select('title','program_id','code')->with(['episodes' => function ($query) {
            $query->where('status', 'published')
                ->orderBy('date_published', 'desc')
                ->take(10);
        }])
            ->where('is_banner', 1)
            ->where('is_active', 1)
            ->orderBy('order', 'desc')
            ->get();
    }

    public function getPosts(String $code){

        $post = Post::where('code', $code)->first();
        $related = Post::where('cat.category_id', $post->cat->category_id)
        ->join('post_categories as cat', 'cat.post_id', '=', 'posts.post_id')
        ->where('posts.post_id', '!=', $post->post_id)->take(20)->get();

        return response()->json([
            'post' =>$post, 
            'related' => $related
        ]);
    }

    public function searchPost(Request $request){
        $query = Post::where('is_active', 1);
        if($request->filled('title')){
            $query->where('title', 'like', '%' . $request->title . '%');
        }
        if($request->filled('program_id')){
            $query->where('program_id', $request->program_id);
        }
        if($request->filled('category')){
            $query->where('category_id', $request->category_id);
        }
        return $query->take(20)->get();
    }
}
