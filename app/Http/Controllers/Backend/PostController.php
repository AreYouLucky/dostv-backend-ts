<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\PostCategory;
use Inertia\Inertia;
use App\Models\Program;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
    protected function stripHtml(string $html)
    {
        $text = html_entity_decode($html, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace('/<(script|style)\b[^>]*>(.*?)<\/\1>/is', '', $text);
        $text = strip_tags($text);
        $text = preg_replace('/\s+/', ' ', $text);
        return trim($text);
    }

    public function index()
    {
        return Post::orderBy('date_published', 'desc')->paginate(10);
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
        $categories  =  Category::select('category_id', 'title', 'description')->where('is_active', 1)->orderBy('title', 'asc')->get();
        $programs = Program::select('program_id', 'code', 'program_type', 'title', 'description', 'agency', 'image')->where('is_active', 1)->orderBy('title', 'asc')->get();
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
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'program' => 'required|string|max:50',
            'content' => 'required|string|numeric',
            'featured_guest' => 'nullable|string|max:255',
            'date_published' => 'required|string|max:50',
            'excerpt' => 'required|string|max:500',
            'episode' => 'nullable|string|max:50',
            'platform' => 'nullable|string|max:50',
            'url' => 'nullable|url|max:255',
            'banner_image' => 'nullable|image|mimes:image/jpg,image/png|max:10240',
            'thumbnail_image' => 'nullable|image|mimes:image/png,image/jpeg|max:10240',
            'agency' => 'required|string|max:100',
            'tags' => 'nullable|string|max:255',
            'trailer' => 'nullable|mimes:mp4,avi|max:30400',
        ]);

        try {
            DB::beginTransaction();
            if ($request->hasFile('banner_image')) {
                $file = $request->file('banner_image');
                $extension = strtolower($file->getClientOriginalExtension());
                $safeTitle = preg_replace('/[^A-Za-z0-9]/', '_', $request->title);
                $banner_image_filename =  $safeTitle . '.' . $extension;
                $file->storeAs('/images/post_images/banners', $banner_image_filename, 'public');
            }

            if ($request->hasFile('thumbnail_image')) {
                $file = $request->file('thumbnail_image');
                $extension = strtolower($file->getClientOriginalExtension());
                $safeTitle = preg_replace('/[^A-Za-z0-9]/', '_', $request->title);
                $thumbnail_image_filename =  $safeTitle . '.' . $extension;
                $file->storeAs('/images/post_images/thumbnails', $thumbnail_image_filename, 'public');
            }

            if ($request->hasFile('trailer')) {
                $file = $request->file('trailer');
                $extension = strtolower($file->getClientOriginalExtension());
                $safeTitle = preg_replace('/[^A-Za-z0-9]/', '_', $request->title);
                $video_trailer_filename =  $safeTitle . '.' . $extension;
                $file->storeAs('/videos/post_videos/trailers', $video_trailer_filename, 'public');
            }

            $post = Post::create([
                'slug' => Str::slug($request->title),
                'title' => $request->title,
                'type' => $request->type,
                'program' => $request->program,
                'content' => $request->content,
                'featured_guest' => $request->featured_guest,
                'date_published' => $request->date_published,
                'excerpt' => $request->excerpt,
                'episode' => $request->episode,
                'platform' => $request->platform,
                'url' => $request->url,
                'trailer' => $video_trailer_filename ?? null,
                'thumbnail' => $thumbnail_image_filename ?? null,
                'banner_image' => $banner_image_filename ?? null,
                'agency' => $request->agency,
                'tags' => $request->tags,
                'description' => $this->stripHtml($request->content),
                'status'   => 'published',
            ]);

            $categories = json_decode($request->categories, true);

            foreach ($categories as $category_id) {
                PostCategory::create([
                    'post_id' => $post->post_id,
                    'category' => $category_id,
                ]);
            }
            

            DB::commit();

            return response()->json([
                'status' => 'Post Successfully Added!'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        Post::where('post_id', $id)->with('categories')->first();
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
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'program' => 'required|string|max:50',
            'content' => 'required|string|numeric',
            'featured_guest' => 'nullable|string|max:255',
            'date_published' => 'required|string|max:50',
            'excerpt' => 'required|string|max:500',
            'episode' => 'nullable|string|max:50',
            'platform' => 'nullable|string|max:50',
            'url' => 'nullable|url|max:255',
            'banner_image' => 'nullable|image|mimes:image/jpg,image/png|max:10240',
            'thumbnail_image' => 'nullable|image|mimes:image/png,image/jpeg|max:10240',
            'agency' => 'required|string|max:100',
            'tags' => 'nullable|string|max:255',
            'trailer' => 'nullable|mimes:mp4,avi|max:30400',
        ]);

        try {
            DB::beginTransaction();
            if ($request->hasFile('banner_image')) {
                $file = $request->file('banner_image');
                $extension = strtolower($file->getClientOriginalExtension());
                $safeTitle = preg_replace('/[^A-Za-z0-9]/', '_', $request->title);
                $banner_image_filename =  $safeTitle . '.' . $extension;
                $file->storeAs('/images/post_images/banners', $banner_image_filename, 'public');
            }

            if ($request->hasFile('thumbnail_image')) {
                $file = $request->file('thumbnail_image');
                $extension = strtolower($file->getClientOriginalExtension());
                $safeTitle = preg_replace('/[^A-Za-z0-9]/', '_', $request->title);
                $thumbnail_image_filename =  $safeTitle . '.' . $extension;
                $file->storeAs('/images/post_images/thumbnails', $thumbnail_image_filename, 'public');
            }

            if ($request->hasFile('trailer')) {
                $file = $request->file('trailer');
                $extension = strtolower($file->getClientOriginalExtension());
                $safeTitle = preg_replace('/[^A-Za-z0-9]/', '_', $request->title);
                $video_trailer_filename =  $safeTitle . '.' . $extension;
                $file->storeAs('/videos/post_videos/trailers', $video_trailer_filename, 'public');
            }

            $post = Post::where('post_id', $id)->update([
                'slug' => Str::slug($request->title),
                'title' => $request->title,
                'type' => $request->type,
                'program' => $request->program,
                'content' => $request->content,
                'featured_guest' => $request->featured_guest,
                'date_published' => $request->date_published,
                'excerpt' => $request->excerpt,
                'episode' => $request->episode,
                'platform' => $request->platform,
                'url' => $request->url,
                'trailer' => $video_trailer_filename ?? null,
                'thumbnail' => $thumbnail_image_filename ?? null,
                'banner_image' => $banner_image_filename ?? null,
                'agency' => $request->agency,
                'tags' => $request->tags,
                'description' => $this->stripHtml($request->content),
                'status'   => 'published',
            ]);
            $categories = json_decode($request->categories, true);
            PostCategory::where('post_id', $id)->delete();
            foreach ($categories as $category_id) {
                PostCategory::create([
                    'post_id' => $post->post_id,
                    'category' => $category_id,
                ]);
            }
            DB::commit();
            return response()->json([
                'status' => 'Post Successfully Added!'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
