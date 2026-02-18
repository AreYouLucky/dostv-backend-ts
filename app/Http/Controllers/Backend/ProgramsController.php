<?php

namespace App\Http\Controllers\Backend;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Program;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Services\ContentFunctions;
use Inertia\Inertia;
use App\Services\UserActions;
use Illuminate\Support\Facades\Auth;

class ProgramsController extends Controller
{


    public function index()
    {
        return Program::where('is_active', 1)->orderBy('order', 'desc')->get();
    }

    public function editProgram(String $code)
    {
        $program = Program::where('code', $code)->first();
        return Inertia::render('cms/program/partials/programs-form', [
            'program' => $program
        ]);
    }


    public function store(Request $request, ContentFunctions $content, UserActions $userActions)
    {

        $request->validate([
            'title'         => 'required|string|max:255|unique:programs,title',
            'program_type'  => 'required|string|max:100',
            'date_started'  => 'required|string',
            'agency'        => 'required|string|max:255',
            'description'   => 'required|string',
            'image'         => 'required|image|mimes:png,jpg,jpeg|max:2048',
            'trailer'       => 'nullable|mimes:mp4,avi|max:30400',
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

            $userActions->logUserActions($request->user()->user_id, 'Created a program entitled ' . $request->title);

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

    public function update(Request $request, string $id,  ContentFunctions $content, UserActions $userActions)
    {

        $request->validate([
            'title'         => ['required', 'string', 'unique:programs,title,' . $id . ',program_id'],
            'program_type'  => 'required|string|max:100',
            'date_started'  => 'required|string',
            'agency'        => 'required|string|max:255',
            'description'   => 'required|string',
            'image'         => 'nullable|image|mimes:png,jpg,jpeg|max:5048',
            'trailer'       => 'nullable|mimes:mp4,avi|max:30400',
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
            $userActions->logUserActions($request->user()->user_id, 'Created a program entitled ' . $request->title);


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
    public function destroy(String $id, UserActions $userActions)
    {
        $user = Auth::user();
        $program = Program::where('program_id', $id)->first();
        $program->is_active = $program->is_active == 1 ? 0 : 1;
        $program->save();
        $userActions->logUserActions($user->user_id, 'Deleted a program entitled ' . $program->title);
        return response()->json([
            'status' => 'Program Successfully Deleted!'
        ]);
    }

    public function moveProgram(Request $req){
        $req->validate([
            'id' => 'required|string',
            'type' => 'required|string'
        ]);

        $first = Program::where('program_id', $req->id)->first();
        if($req->type == 1){
            $second =  Program::where('order', '>', $first->order)->orderBy('order','asc')->first();
        }
        else{
            $second = Program::where('order', '<', $first->order)->orderBy('order','desc')->first();
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

    public function toggleProgramVisibility(String $id, UserActions $userActions){
        $user = Auth::user();
        $program = Program::where('program_id', $id)->first();
        $program->is_banner = $program->is_banner == 1 ? 0 : 1;
        $program->save();
        $userActions->logUserActions($user->user_id, 'Toggled a program visibility entitled ' . $program->title);
        return response()->json([
            'status' => 'Program Visibility Successfully Toggled!'
        ]);

    }
}
