<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Advertisement;
use App\Services\ContentFunctions;
use Inertia\Inertia;

class AdvertisementController extends Controller
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
        return Advertisement::where('is_active', 1)->orderBy('order', 'desc')->get();
    }

    public function create()
    {
        return Inertia::render('cms/advertisement/partials/advertisement-form');
    }

    public function store(Request $request, ContentFunctions $content)
    {
        $request->validate([
            'title' => ['required', 'string', 'unique:advertisements,title'],
            'description' => ['nullable', 'string'],
            'url' => ['nullable', 'string'],
            'excerpt' => ['nullable', 'string'],
            'thumbnail_image' => ['required', 'mimes:jpeg,png,jpg,gif,mp4,avi', 'max:25240'],
            'is_redirect' => ['required', 'string'],
        ]);

        if ($request->hasFile('thumbnail_image')) {
            $thumbnail_filename = $this->uploadFile('/images/advertisements', $request, 'thumbnail_image');
        }

        $advertisement = Advertisement::create([
            'title' => $request->title,
            'description' => $request->description ? $content->convertToPlainHtml($request->description) : null,
            'url' => $request->url,
            'excerpt' => $request->excerpt,
            'thumbnail' => $thumbnail_filename ?? '',
            'is_redirect' => $request->is_redirect
        ]);
        $advertisement->order = $advertisement->advertisement_id;
        $advertisement->save();

        return response()->json([
            'advertisement' => $advertisement,
            'status' => 'Advertisement Successfully Updated!',
        ], 200);
    }

    public function edit(string $id)
    {
        $advertisement = Advertisement::find($id);
        return Inertia::render('cms/advertisement/partials/advertisement-form', [
            'advertisement' => $advertisement
        ]);
    }
    public function update(Request $request, string $id, ContentFunctions $content)
    {
        $request->validate([
            'title' => ['required', 'string', 'unique:advertisements,title,' . $id . ',advertisement_id'],
            'description' => ['nullable', 'string'],
            'url' => ['nullable', 'string'],
            'excerpt' => ['nullable', 'string'],
            'thumbnail_image' => ['nullable', 'mimes:jpeg,png,jpg,gif,mp4,avi', 'max:25240'],
            'is_redirect' => ['required', 'string'],
        ]);
        $advertisement = Advertisement::find($id);

        if ($request->hasFile('thumbnail_image')) {
            $advertisement->thumbnail  = $this->uploadFile('/images/advertisements', $request, 'thumbnail_image');
        }
        $advertisement->title = $request->title;
        $advertisement->description = $request->description ? $content->convertToPlainHtml($request->description) : null;
        $advertisement->url = $request->url;
        $advertisement->excerpt = $request->excerpt;
        $advertisement->is_redirect = $request->is_redirect;
        $advertisement->save();

        return response()->json([
            'status' => 'Advertisement Successfully Updated!',
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Advertisement::where('advertisement_id', $id)->update(['is_active'=>0]);
        return response()->json([
            'status' => 'Advertisement Successfully Deleted!'
        ]);
    }

    public function moveAdvertisement(Request $req)
    {
        $req->validate([
            'id' => 'required|integer',
            'type' => 'required|integer'
        ]);

        $first = Advertisement::where('advertisement_id', $req->id)->first();

        if (!$first) {
            return response()->json([
                'status' => 'error',
                'message' => 'Advertisement not found'
            ], 404);
        }

        if ($req->type == 1) {
            $second = Advertisement::where('order', '>', $first->order)
                ->orderBy('order', 'asc')
                ->first();
        } else {
            $second = Advertisement::where('order', '<', $first->order)
                ->orderBy('order', 'desc')
                ->first();
        }

        if (!$second) {
            return response()->json([
                'status' => 'error',
                'message' => 'Undefined order'
            ], 400);
        }
        [$first->order, $second->order] = [$second->order, $first->order];

        $first->save();
        $second->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Order successfully toggled'
        ]);
    }

    public function toggleAdvertisementVisibility(String $id){
        $advertisement = Advertisement::find($id);
        $advertisement->is_banner = !$advertisement->is_banner;
        $advertisement->save();
        return response()->json([
            'status' => 'success',
            'message' => 'Advertisement visibility successfully toggled'
        ]);
    }
}
