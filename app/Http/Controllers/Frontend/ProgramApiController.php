<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Program;

class ProgramApiController extends Controller
{
    public function getRelatedPostByProgram(String $code)
    {
        return Post::select('posts.*', 'programs.title as program_title')
            ->join('programs', 'posts.program_id', '=', 'programs.program_id')
            ->where('programs.code', $code)
            ->where('status', 'published')
            ->inRandomOrder()
            ->take(6)
            ->get();
    }

    public function getProgramInfo(string $program_slug)
    {
        $program = Program::where('code', $program_slug)->firstOrFail();
        $featured_post = Post::where('program_id', $program->program_id)
            ->where('is_featured', 1)
            ->where('status', '!=', 'trashed')
            ->where('status', 'published')
            ->latest('date_published')
            ->first();
        $total = Post::where('program_id', $program->program_id)
            ->where('status', 'published')
            ->count();
        return response()->json([
            'program' => $program,
            'featured_post' => $featured_post,
            'total' => $total
        ]);
    }

    public function getProgramRecentPosts(String $code)
    {
        return Post::select('posts.*', 'programs.title as program_title')
            ->join('programs', 'posts.program_id', '=', 'programs.program_id')
            ->where('programs.code', $code)
            ->where('status', 'published')
            ->take(6)
            ->get();
    }

    public function getProgramOlderPosts(String $code)
    {
        $recentIds = Post::join('programs', 'posts.program_id', '=', 'programs.program_id')
            ->where('programs.code', $code)
            ->orderBy('date_published', 'desc')
            ->take(6)
            ->pluck('posts.id');

        return Post::select('posts.*', 'programs.title as program_title')
            ->join('programs', 'posts.program_id', '=', 'programs.program_id')
            ->where('programs.code', $code)
            ->whereNotIn('posts.id', $recentIds)
            ->orderBy('date_published', 'desc')
            ->paginate(8);
    }

}
