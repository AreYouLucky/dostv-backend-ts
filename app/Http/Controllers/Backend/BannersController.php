<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Banner;
use App\Models\Program;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Services\UserActions;
use Illuminate\Support\Facades\Auth;

class BannersController extends Controller
{
    protected function uploadFile($folder, $request, $field)
    {
        $file = $request->file($field);
        $filename = preg_replace('/[^A-Za-z0-9]/', '_', $request->title) . '.' . strtolower($file->getClientOriginalExtension());
        $file->storeAs($folder, $filename, 'public');
        return $filename;
    }
    public function index()
    {
        return Banner::where('is_active', 1)->orderBy('order', 'desc')->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $programs = Program::select('program_id', 'code', 'program_type', 'title', 'description', 'agency', 'image')
            ->where('is_active', 1)
            ->withCount(['episodes as episode_count'])
            ->orderBy('title', 'asc')
            ->get();
        return Inertia::render('cms/banner/partials/banner-form', [
            'programs' => $programs,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, UserActions $userActions)
    {
        $request->validate([
            'title' => ['required', 'string', 'unique:banners,title'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'string'],
            'media' => ['required', 'mimes:jpeg,png,jpg,gif,mp4,avi', 'max:25240'],
            'icon' => ['nullable', 'mimes:jpeg,png,jpg,gif,mp4,avi', 'max:25240'],
            'bg' => ['nullable', 'mimes:jpeg,png,jpg,gif,mp4,avi', 'max:25240'],
            'description' => ['nullable', 'string'],
            'code' => ['nullable', 'string'],
            'highlight_text' => ['nullable', 'string'],
            'episodes' => ['nullable', 'string'],
            'url' => ['nullable', 'string'],
            'duration' => ['required', 'string', 'numeric'],
        ]);

        if ($request->hasFile('media')) {
            if (in_array($request->type, [1, 2, 3])) {
                $banner_filename = $this->uploadFile('/images/banners', $request, 'media');
            } else {
                $banner_filename = $this->uploadFile('/videos/banners', $request, 'media');
            }
        }
        if ($request->hasFile('bg')) {
            $bg_filename = $this->uploadFile('/images/banners/bgs', $request, 'bg');
        }
        if ($request->hasFile('icon')) {
            $icon_filename = $this->uploadFile('/images/banners/icons', $request, 'icon');
        }
        $banner = Banner::create([
            'title' => $request->title,
            'description' => $request->description ?? '',
            'type' => $request->type ?? '',
            'code' => $request->code ?? '',
            'highlight_text' => $request->highlight_text ?? '',
            'episodes' => $request->episodes ?? '',
            'url' => $request->url ?? '',
            'media' => $banner_filename ?? '',
            'icon' => $icon_filename ?? '',
            'bg' => $bg_filename ?? '',
            'duration' => $request->duration ?? 0
        ]);
        $userActions->logUserActions($request->user()->user_id, 'Created a banner entitled ' . $request->title);
        return response()->json([
            'status' => 'Banner Successfully Added!',
            'banner' => $banner
        ]);
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
    public function edit(string $id)
    {
        $banner = Banner::where('banner_id', $id)->first();
        $programs = Program::select('program_id', 'code', 'program_type', 'title', 'description', 'agency', 'image')
            ->where('is_active', 1)
            ->withCount(['episodes as episode_count'])
            ->orderBy('title', 'asc')
            ->get();
        return Inertia::render('cms/banner/partials/banner-form', [
            'banner' => $banner,
            'programs' => $programs,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id, UserActions $userActions)
    {
        $request->validate([
            'title' => ['required', 'string', 'unique:banners,title,' . $id . ',banner_id'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'string'],
            'media' => ['nullable', 'mimes:jpeg,png,jpg,gif,mp4,avi', 'max:25240'],
            'icon' => ['nullable', 'mimes:jpeg,png,jpg,gif,mp4,avi', 'max:25240'],
            'bg' => ['nullable', 'mimes:jpeg,png,jpg,gif,mp4,avi', 'max:25240'],
            'description' => ['nullable', 'string'],
            'code' => ['nullable', 'string'],
            'highlight_text' => ['nullable', 'string'],
            'episodes' => ['nullable', 'string'],
            'url' => ['nullable', 'string'],
            'duration' => ['required', 'string', 'numeric'],
        ]);

        try {
            DB::beginTransaction();

            $banner = Banner::find($id);

            if ($request->hasFile('media')) {
                if (in_array($request->type, [1, 2, 3])) {
                    $banner_filename = $this->uploadFile('/images/banners', $request, 'media');
                } else {
                    $banner_filename = $this->uploadFile('/videos/banners', $request, 'media');
                }
                $banner->media = $banner_filename;
            }

            if ($request->hasFile('bg')) {
                $bg_filename = $this->uploadFile('/images/banners/bgs', $request, 'bg');
                $banner->bg = $bg_filename;
            }

            if ($request->hasFile('icon')) {
                $icon_filename = $this->uploadFile('/images/banners/icons', $request, 'icon');
                $banner->icon = $icon_filename;
            }

            $banner->title = $request->title;
            $banner->description = $request->description ?? '';
            $banner->type = $request->type ?? '';
            $banner->code = $request->code ?? '';
            $banner->highlight_text = $request->highlight_text ?? '';
            $banner->episodes = $request->episodes ?? '';
            $banner->url = $request->url ?? '';
            $banner->duration = $request->duration ?? 0;
            $banner->save();
            $userActions->logUserActions($request->user()->user_id, 'Updated a banner entitled ' . $request->title);
            DB::commit();
            return response()->json([
                'status' => 'Banner Successfully Updated!',
                'banner' => $banner
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => $e
            ], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, UserActions $userActions)
    {
        $user =  Auth::user();
        $banner = Banner::where('banner_id', $id)->first();
        $banner->update(['is_active' => 0]);
        $userActions->logUserActions($user->user_id, 'Deleted a banner entitled ' . $banner->title);
        return response()->json([
            'status' => 'Banner Successfully Deleted!'
        ]);
    }

    public function toggleBanner(String $id, UserActions $userActions)
    {
        $user =  Auth::user();
        $banner = Banner::where('banner_id', $id)->first();
        $banner->is_banner = !$banner->is_banner;
        $banner->save();
        $userActions->logUserActions($user->user_id, $banner->is_banner ? 'Unhide the banner entitled ' . $banner->title : 'Hide the banner entitled ' . $banner->title);
        return response()->json([
            'status' => 'Banner Status Successfully Updated!'
        ]);
    }

    public function moveBanner(Request $req)
    {
        $req->validate([
            'id' => 'required|string',
            'type' => 'required|string'
        ]);

        $first = Banner::where('banner_id', $req->id)->first();
        if ($req->type == 1) {
            $second =  Banner::where('order', '>', $first->order)->orderBy('order', 'asc')->first();
        } else {
            $second = Banner::where('order', '<', $first->order)->orderBy('order', 'desc')->first();
        }
        if (!isset($second)) {
            return response()->json([
                'status',
                'Undefined Order'
            ]);
        }


        $f_order = $second->order;
        $s_order = $first->order;

        $first->order = $f_order;
        $first->save();
        $second->order = $s_order;
        $second->save();
        return response()->json([
            'status' => 'Order Successfully Toggled'
        ]);
    }

    public function toggleBannerVisibility(String $id)
    {
        $banner = Banner::where('banner_id', $id)->first();
        $banner->is_banner = !$banner->is_banner;
        $banner->save();
        return response()->json([
            'status' => 'Banner Status Successfully Updated!'
        ]);
    }
}
