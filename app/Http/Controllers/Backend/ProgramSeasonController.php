<?php

namespace App\Http\Controllers\Backend;

use App\Models\ProgramSeason;
use App\Models\Program;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProgramSeasonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function edit(string $id)
    {
        $program = Program::where('program_id', $id)->first();
        $seasons = ProgramSeason::where('program_id', $id)->orderBy('season', 'asc')->get();
        return Inertia::render('cms/program/program-seasons', [
            'program_details' => $program,
            'program_seasons' => $seasons
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        $request->validate([
            'seasons' => ['required', 'array', 'min:1'],
            'seasons.*.title' => ['required', 'string', 'max:255'],
            'seasons.*.season' => [
                'required',
                'string',
                'max:50'
            ],
            'seasons.*.description' => ['required', 'string'],
            'seasons.*.thumbnail' => ['nullable', 'image', 'max:4800'],
        ], [
            'seasons.*.title.required' => 'The title field is required.',
            'seasons.*.season.required' => 'The season field is required.',
            'seasons.*.description.required' => 'The description field is required.',
            'seasons.*.thumbnail.max' => 'The image must not be greater than 5MB.',
        ]);
        $program = Program::where('program_id', $id)->firstOrFail();
        $requestSeasons = collect($request->seasons)->pluck('season')->toArray();

        foreach ($request->seasons as $index => $seasonData) {
            $season = ProgramSeason::where('program_id', $program->program_id)
                ->where('season', $seasonData['season'])
                ->first();

            $filename = $season?->thumbnail ?? null;

            if ($request->hasFile("seasons.$index.thumbnail")) {
                if ($filename && Storage::disk('public')->exists('images/program_images/seasons/' . $filename)) {
                    Storage::disk('public')->delete('images/program_images/seasons/' . $filename);
                }

                $file = $request->file("seasons.$index.thumbnail");
                $filename = $file->hashName();
                $file->storeAs('images/program_images/seasons', $filename, 'public');
            }
            if ($season) {
                $season->update([
                    'title' => $seasonData['title'],
                    'description' => $seasonData['description'],
                    'thumbnail' => $filename,
                ]);
            } else {
                ProgramSeason::create([
                    'program_id' => $program->program_id,
                    'season' => $seasonData['season'],
                    'title' => $seasonData['title'],
                    'description' => $seasonData['description'],
                    'thumbnail' => $filename,
                ]);
            }
        }
        $seasonsToDelete = ProgramSeason::where('program_id', $program->program_id)
            ->whereNotIn('season', $requestSeasons)
            ->get();

        foreach ($seasonsToDelete as $season) {
            if ($season->thumbnail && Storage::disk('public')->exists('images/program_images/seasons/' . $season->thumbnail)) {
                Storage::disk('public')->delete('images/program_images/seasons/' . $season->thumbnail);
            }
            $season->delete();
        }

        return response()->json(['status' => 'Seasons Successfully Updated!']);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
