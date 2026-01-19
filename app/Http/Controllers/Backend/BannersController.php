<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Banner;
use App\Models\Program;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
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
    public function store(Request $request)
    {
        $request->validate([
            'title' => ['required', 'string', 'unique:banners,title'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'string'],
            'media' => ['required', 'mimes:jpeg,png,jpg,gif,mp4,avi', 'max:25240'],
            'description' => ['nullable', 'string'],
            'code' => ['nullable', 'string'],
            'highlight_text' => ['nullable', 'string'],
            'episodes' => ['nullable', 'string'],
            'url' => ['nullable', 'string'],
        ]);

        if ($request->hasFile('media')) {
            if (in_array($request->type, [1, 2, 3])) {
                $banner_filename = $this->uploadFile('/images/banners', $request, 'media');
            }else {
                $banner_filename = $this->uploadFile('/videos/banners', $request, 'media');
            }
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
        ]);
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
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title' => ['required', 'string', 'unique:banners,title,' . $id . ',banner_id'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'string'],
            'media' => ['nullable', 'mimes:jpeg,png,jpg,gif,mp4,avi', 'max:25240'],
            'description' => ['nullable', 'string'],
            'code' => ['nullable', 'string'],
            'highlight_text' => ['nullable', 'string'],
            'episodes' => ['nullable', 'string'],
            'url' => ['nullable', 'string'],
        ]);

        try {
            DB::beginTransaction();

            $banner = Banner::find($id);

            if ($request->hasFile('media')) {
                if ($request->type == [1, 2, 3]) {
                    $banner_filename = $this->uploadFile('/images/banners', $request, 'media');
                } else {
                    $banner_filename = $this->uploadFile('/videos/banners', $request, 'media');
                }
                $banner->media = $banner_filename;
            }

            $banner->title = $request->title;
            $banner->description = $request->description ?? '';
            $banner->type = $request->type ?? '';
            $banner->code = $request->code ?? '';
            $banner->highlight_text = $request->highlight_text ?? '';
            $banner->episodes = $request->episodes ?? '';
            $banner->url = $request->url ?? '';
            $banner->save();

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
    public function destroy(string $id)
    {
        Banner::where('banner_id', $id)->update(['is_active'=>0]);
        return response()->json([
            'status' => 'Banner Successfully Deleted!'
        ]);
    }

    public function toggleBanner(String $id){
        $banner = Banner::where('banner_id', $id)->first();
        $banner->is_banner = !$banner->is_banner;
        $banner->save();
        return response()->json([
            'status' => 'Banner Status Successfully Updated!'
        ]);
    }

    public function moveBanner(Request $req){
        $req->validate([
            'id' => 'required|string',
            'type' => 'required|string'
        ]);

        $first = Banner::where('banner_id', $req->id)->first();
        if($req->type == 1){
            $second =  Banner::where('order', '>', $first->order)->orderBy('order','asc')->first();
        }
        else{
            $second = Banner::where('order', '<', $first->order)->orderBy('order','desc')->first();
        }
        if(!isset($second)){
            return response()->json([
                'status', 'Undefined Order'
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

    public function toggleBannerVisibility(String $id){
        $banner = Banner::where('banner_id', $id)->first();
        $banner->is_banner = !$banner->is_banner;
        $banner->save();
        return response()->json([
            'status' => 'Banner Status Successfully Updated!'
        ]);
    }
}
