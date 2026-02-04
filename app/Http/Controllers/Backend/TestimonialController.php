<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Testimonial;
use App\Models\User;
use Inertia\Inertia;
use App\Services\ContentFunctions;
use App\Services\UserActions;
use Illuminate\Support\Facades\Auth;

class TestimonialController extends Controller
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
        return Testimonial::where('is_active', 1)->orderBy('title', 'desc')->get();
    }
    public function create()
    {
        return Inertia::render('cms/testimonial/partials/testimonial-form');
    }

    public function store(Request $request, ContentFunctions $content, UserActions $userActions)
    {
        $request->validate([
            'title' => ['required', 'string', 'unique:testimonials,title'],
            'description' => ['required', 'string'],
            'thumbnail_image' => ['nullable', 'mimes:jpeg,png,jpg,gif,mp4,avi', 'max:25240'],
            'excerpt' => ['required', 'string'],
            'guest' => ['required', 'string'],
            'date_published' => ['required', 'string'],
        ]);

        if($request->hasFile('thumbnail_image')){
            $thumbnail = $this->uploadFile('/images/testimonials', $request, 'thumbnail_image');
        }
        $testimonial = Testimonial::create([
            'title' => $request->title,
            'description' => $content->convertToPlainHtml($request->description),
            'thumbnail' => $thumbnail ?? '',
            'excerpt' => $request->excerpt,
            'guest' => $request->guest,
            'date_published' => $request->date_published
        ]);
        $userActions->logUserActions($request->user()->user_id, 'Created a testimonial entitled ' . $request->title);

        return response()->json([
            'status' => 'Testimonial Successfully Created!',
            'testimonial' => $testimonial
        ]);
    }

    public function edit(string $id)
    {
        $testimonial = Testimonial::find($id);
        return Inertia::render('cms/testimonial/partials/testimonial-form', [
            'testimonial' => $testimonial
        ]);
    }

    public function update(Request $request, string $id, UserActions $userActions)
    {
        $request->validate([
            'title' => ['required', 'string', 'unique:testimonials,title,' . $id . ',testimonial_id'],
            'description' => ['required', 'string'],
            'thumbnail_image' => ['nullable', 'mimes:jpeg,png,jpg,gif,mp4,avi', 'max:25240'],
            'excerpt' => ['required', 'string'],
            'guest' => ['required', 'string'],
            'date_published' => ['required', 'string'],
        ]);
        $testimonial = Testimonial::find($id);
        if ($request->hasFile('thumbnail_image')) {
            $testimonial->thumbnail  = $this->uploadFile('/images/testimonials', $request, 'thumbnail_image');
        }
        $testimonial->title = $request->title;
        $testimonial->description = $request->description;
        $testimonial->excerpt = $request->excerpt;
        $testimonial->guest = $request->guest;
        $testimonial->date_published = $request->date_published;
        $testimonial->save();

        $userActions->logUserActions($request->user()->user_id, 'Updated a testimonial entitled ' . $request->title);
        return response()->json([
            'status' => 'Testimonial Successfully Updated!',
            'testimonial' => $testimonial
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {

        Testimonial::where('testimonial_id', $id)->update(['is_active'=>0]);
        return response()->json([
            'status' => 'Testimonial Successfully Deleted!'
        ]);
    }

    public function toggleTestimonialVisibility(String $id, UserActions $userActions){
        $user = Auth::user();
        $testimonial = Testimonial::where('testimonial_id', $id)->first();
        $testimonial->is_banner = !$testimonial->is_banner;
        $testimonial->save();
        $userActions->logUserActions($user->user_id, 'Updated a testimonial status entitled ' . $testimonial->title);
        return response()->json([
            'status' => 'Testimonial Status Successfully Updated!'
        ]);
    }
}
