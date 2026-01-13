<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use Inertia\Inertia;
use App\Models\Program;
use App\Models\Category;
class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Post::orderBy('date_published', 'asc')->paginate(10);
    }

    public function searchPosts(Request $req)
    {
        if ($req->title !== "" && $req->program !== "") {
            Post::where('title', $req->title)->where('program', $req->program)->paginate(10);
        } else if ($req->title !== "") {
            Post::where('title', $req->title)->paginate(10);
        } else {
            Post::where('program', $req->program)->paginate(10);
        }
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories  =  Category::select('category_id', 'title', 'description')->where('is_active',1)->orderBy('title','asc')->get();
        $programs = Program::select('program_id','code','program_type','title', 'description','agency','image')->where('is_active',1)->orderBy('title','asc')->get();
        return Inertia::render('cms/post/partials/post-form', [
            'categories' => $categories,
            'programs' => $programs,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function editPost(string $code)
    {
        $post  =  Post::where('slug', $code)->with('categories')->first();
        return Inertia::render('cms/program/partials/programs-form', [
            'post' => $post
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
