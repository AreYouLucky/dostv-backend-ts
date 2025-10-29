<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Program;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Services\ContentFunctions;

class ProgramsController extends Controller
{


    public function index()
    {
        return Program::where('is_active', 1)->orderBy('title', 'asc')->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request,  ContentFunctions $content)
    {

        $request->validate([
            'title'         => 'required|string|max:255|unique:programs,title',
            'program_type'  => 'required|string|max:100',
            'date_started'  => 'required|string',
            'agency'        => 'required|string|max:255',
            'description'   => 'required|string',
            'image'         => 'required|image|mimes:png,jpg,jpeg|max:2048',
            'trailer'       => 'nullable|mimes:mp4,avi|max:102400',
        ]);
        try {
            DB::beginTransaction();
            $image_filename = '';
            $trailer_filename = '';

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $extension = strtolower($file->getClientOriginalExtension());
                $safeTitle = preg_replace('/[^A-Za-z0-9]/', '_', $request->title);
                $image_filename =  $safeTitle . '.' . $extension;
                $file->storeAs('/images/program_images/thumbnails', $image_filename, 'public');
            }
            if ($request->hasFile('trailer')) {
                $file = $request->file('trailer');
                $extension = strtolower($file->getClientOriginalExtension());
                $safeTitle = preg_replace('/[^A-Za-z0-9]/', '_', $request->title);
                $trailer_filename =  $safeTitle . '.' . $extension;
                $file->storeAs('/videos/program_videos/trailer', $trailer_filename, 'public');
            }


            $program = Program::create([
                'code' => $content->createSlug($request->title),
                'title' => $request->title,
                'description' => $content->convertToPlainHtml($request->description),
                'agency' => $request->agency,
                'image' => $image_filename,
                'trailer' => $trailer_filename,
                'date_started' => $request->date_started,
                'is_active' => 1,
                'is_banner' => 1,
                'program_type' => $request->program_type,
                'order' =>  0
            ]);

            $program->order = $program->program_id;
            $program->save();

            DB::commit();

            return response()->json([
                'status' => 'Program Successfully Saved!',
                'program' => $program
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status'  => 'failed',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function update(Request $request, string $id,  ContentFunctions $content)
    {

        $request->validate([
            'title'         => ['required', 'string', 'unique:programs,title,'. $id. ',program_id'],
            'program_type'  => 'required|string|max:100',
            'date_started'  => 'required|string',
            'agency'        => 'required|string|max:255',
            'description'   => 'required|string',
            'image'         => 'nullable|image|mimes:png,jpg,jpeg|max:5048',
            'trailer'       => 'nullable|mimes:mp4,avi|max:102400',
        ]);
        try {
            DB::beginTransaction();
            $image_filename = '';
            $trailer_filename = '';

            $program = Program::find($id);

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $extension = strtolower($file->getClientOriginalExtension());
                $safeTitle = preg_replace('/[^A-Za-z0-9]/', '_', $request->title);
                $image_filename =  $safeTitle . '.' . $extension;
                $file->storeAs('/images/program_images/thumbnails', $image_filename, 'public');
                $program->image =  $image_filename;
            }
            if ($request->hasFile('trailer')) {
                $file = $request->file('trailer');
                $extension = strtolower($file->getClientOriginalExtension());
                $safeTitle = preg_replace('/[^A-Za-z0-9]/', '_', $request->title);
                $trailer_filename =  $safeTitle . '.' . $extension;
                $file->storeAs('/videos/program_videos/trailer', $trailer_filename, 'public');
                $program->trailer = $trailer_filename;
            }

            $program->title = $request->title;
            $program->description = $content->convertToPlainHtml($request->description);
            $program->agency = $request->agency;
            $program->date_started = $request->date_started;
            $program->program_type = $request->program_type;
            $program->save();
            DB::commit();

            return response()->json([
                'status' => 'Program Successfully Updated!',
                'program' => $program
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status'  => 'failed',
                'message' => $e->getMessage(),
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
