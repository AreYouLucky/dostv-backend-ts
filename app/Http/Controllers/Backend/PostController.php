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
use Illuminate\Validation\Rule;
use App\Services\ContentFunctions;
use App\Models\ProgramSeason;
use App\Models\Agency;
use App\Models\Region;
use App\Models\PostAgency;
use App\Models\PostRegion;

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

    protected function uploadFile($folder, $request, $field)
    {
        $file = $request->file($field);
        $filename = preg_replace('/[^A-Za-z0-9]/', '_', $request->title) . '.' . strtolower($file->getClientOriginalExtension());
        $file->storeAs($folder, $filename, 'public');
        return $filename;
    }



    public function index(Request $request)
    {
        $query = Post::query();
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', '!=', 'trashed');
        }
        if ($request->filled('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }
        if ($request->filled('program')) {
            $query->where('program_id', $request->program);
        }
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        return $query
            ->with('post_program')
            ->with([
                'agencies' => function ($q) {
                    $q->join('agencies', 'post_agencies.agency_id', '=', 'agencies.id')
                        ->select(
                            'post_agencies.*',
                            'agencies.name as agency_name'
                        );
                },
            ])
            ->orderBy('date_published', 'desc')
            ->paginate(10);
    }



    public function create()
    {
        $categories  =  Category::select('category_id', 'title', 'description')->where('is_active', 1)->orderBy('title', 'asc')->get();
        $programs = Program::select('program_id', 'code', 'program_type', 'title', 'description', 'agency', 'image')->where('is_active', 1)->orderBy('title', 'asc')->get();
        $seasons = ProgramSeason::get();
        $agencies = Agency::orderBy('name', 'asc')->get();
        $regions = Region::orderBy('name', 'asc')->get();
        return Inertia::render('cms/post/partials/post-form', [
            'categories' => $categories,
            'programs' => $programs,
            'seasons' => $seasons,
            'agencies' => $agencies,
            'regions' => $regions
        ]);
    }

    public function store(Request $request, ContentFunctions $content)
    {
        $request->validate([
            'title' => 'required|string|max:255|unique:posts,title',
            'type' => 'required|string|max:50',
            'program' => 'required|number|max:50',
            'content' => 'required|string',
            'featured_guest' => 'nullable|string|max:255',
            'date_published' => 'required|string|max:50',
            'excerpt' => 'required|string|max:1000',
            'episode' => 'nullable|string|max:50',
            'platform' => 'nullable|string|max:50',
            'url' => 'nullable|url|max:255',
            'banner_image' => 'nullable|max:10240',
            'thumbnail_image' => 'required|max:10240',
            'tags' => 'nullable|string|max:255',
            'trailer_file' => 'nullable|max:50240',
        ]);

        try {
            DB::beginTransaction();
            if ($request->hasFile('banner_image')) {
                $banner_filename = $this->uploadFile('/images/post_images/banners', $request, 'banner_image');
            }
            if ($request->hasFile('thumbnail_image')) {
                $thumbnail_filename = $this->uploadFile('/images/post_images/thumbnails', $request, 'thumbnail_image');
            }
            if ($request->hasFile('trailer_file')) {
                $trailer_filename = $this->uploadFile('/videos/post_videos/trailers', $request, 'trailer_file');
            }

            $post = Post::create([
                'slug' => Str::slug($request->title),
                'title' => $request->title,
                'type' => $request->type,
                'program_id' => $request->program,
                'content' =>  $content->convertToPlainHtml($request->content),
                'guest' => $request->featured_guest,
                'date_published' => $request->date_published,
                'excerpt' => $request->excerpt,
                'episode' => $request->episode,
                'platform' => $request->platform,
                'url' => $request->url,
                'trailer' => $trailer_filename ?? null,
                'thumbnail' => $thumbnail_filename ?? null,
                'banner_image' => $banner_filename ?? null,
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

            $agencies = json_decode($request->agencies, true);
            foreach ($agencies as $agency_id) {
                PostAgency::create([
                    'post_id' => $post->post_id,
                    'agency_id' => $agency_id
                ]);
            }

            $regions = json_decode($request->regions, true);
            foreach ($regions as $region_id) {
                PostRegion::create([
                    'post_id' => $post->post_id,
                    'region_id' => $region_id
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'Post Successfully Updated!',
                'post' => $post
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'errors' => $e->errors(),
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $id)
    {
        Post::where('post_id', $id)->with('categories')->first();
    }

    public function edit(string $code)
    {
        $post  =  Post::where('slug', $code)->with('categories')->with('agencies')->with('regions')->first();
        $categories  =  Category::select('category_id', 'title', 'description')->where('is_active', 1)->orderBy('title', 'asc')->get();
        $programs = Program::select('program_id', 'code', 'program_type', 'title', 'description', 'agency', 'image')->where('is_active', 1)->orderBy('title', 'asc')->get();
        $seasons = ProgramSeason::get();
        $agencies = Agency::orderBy('name', 'asc')->get();
        $regions = Region::orderBy('name', 'asc')->get();
        return Inertia::render('cms/post/partials/post-form', [
            'categories' => $categories,
            'programs' => $programs,
            'post' => $post,
            'seasons' => $seasons,
            'agencies' => $agencies,
            'regions' => $regions
        ]);
    }

    public function update(Request $request, string $code, ContentFunctions $content)
    {
        $request->validate([
            'title' => "required|string|max:255|unique:posts,title," . $code . ",slug",
            'type' => 'required|string|max:50',
            'program' => 'required|string|max:50',
            'content' => 'required|string',
            'featured_guest' => 'nullable|string|max:255',
            'date_published' => 'required|string|max:50',
            'excerpt' => 'required|string|max:1000',
            'episode' => 'nullable|string|max:50',
            'platform' => 'nullable|string|max:50',
            'url' => 'nullable|url|max:255',
            'banner_image' => 'nullable|image|max:10240',
            'thumbnail_image' => 'nullable|image|max:10240',
            'tags' => 'nullable|string|max:255',
            'trailer_file' => 'nullable|mimes:mp4,avi|max:30400',
        ]);


        try {
            DB::beginTransaction();

            $post = Post::where('slug', $code)->first();

            if ($request->hasFile('banner_image')) {
                $post->banner = $this->uploadFile('/images/post_images/banners', $request, 'banner_image');
            }

            if ($request->hasFile('thumbnail_image')) {
                $post->thumbnail = $this->uploadFile('/images/post_images/thumbnails', $request, 'thumbnail_image');
            }

            if ($request->hasFile('trailer_file')) {
                $post->trailer = $this->uploadFile('/videos/post_videos/trailers', $request, 'trailer_file');
            }

            $post->slug = Str::slug($request->title);
            $post->title = $request->title;
            $post->type = $request->type;
            $post->program_id = $request->program;
            $post->content = $content->convertToPlainHtml($request->content);
            $post->guest = $request->featured_guest;
            $post->date_published = $request->date_published;
            $post->excerpt = $request->excerpt;
            $post->episode = $request->episode;
            $post->platform = $request->platform;
            $post->url = $request->url;
            $post->trailer = $post->trailer ?? null;
            $post->thumbnail = $post->thumbnail ?? null;
            $post->banner = $post->banner ?? null;
            $post->tags = $request->tags;
            $post->description = $this->stripHtml($request->content);
            $post->status = 'published';
            $post->save();


            $categories = json_decode($request->categories, true);
            PostCategory::where('post_id', $post->post_id)->delete();
            foreach ($categories as $category_id) {
                PostCategory::create([
                    'post_id' => $post->post_id,
                    'category' => $category_id,
                ]);
            }
            PostAgency::where('post_id', $post->post_id)->delete();
            $agencies = json_decode($request->agencies, true);
            foreach ($agencies as $agency_id) {
                PostAgency::create([
                    'post_id' => $post->post_id,
                    'agency_id' => $agency_id
                ]);
            }
            PostRegion::where('post_id', $post->post_id)->delete();
            $regions = json_decode($request->regions, true);
            foreach ($regions as $region_id) {
                PostRegion::create([
                    'post_id' => $post->post_id,
                    'region_id' => $region_id
                ]);
            }
            DB::commit();
            return response()->json([
                'status' => 'Post Successfully Updated!',
                'post' => $post
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'errors' => $e->errors(),
            ], 422);
        }
    }

    public function destroy(string $code)
    {
        Post::where('slug', $code)->update(['status' => 'trashed']);
        return response()->json([
            'status' => 'Post Successfully Deleted!'
        ]);
    }

    public function updatePostStatus(Request $req)
    {
        $req->validate([
            'code' => 'required|string',
            'status' => 'required|string'
        ]);
        Post::where('slug', $req->code)->update(['status' => $req->status]);
        return response()->json([
            'status' => 'Post Status Successfully Updated!'
        ]);
    }

    public function viewPostPage()
    {
        $programs = Program::select('program_id', 'code', 'program_type', 'title', 'description', 'agency', 'image')->where('is_active', 1)->orderBy('title', 'asc')->get();
        return Inertia::render('cms/post/posts-page', [
            'programs' => $programs,
        ]);
    }

    public function togglePostFeatured(String $post)
    {
        $post = Post::where('slug', $post)->first();
        Post::where('program_id', $post->program_id)->update(['is_featured' => 0]);
        $post->is_featured = !$post->is_featured;
        $post->save();
        return response()->json([
            'status' => 'Post Featured Status Successfully Updated!'
        ]);
    }

    public function restorePost(String $post)
    {
        Post::where('slug', $post)->update(['status' => 'drafted']);
        return response()->json([
            'status' => 'Post Successfully Restored!'
        ]);
    }
}
