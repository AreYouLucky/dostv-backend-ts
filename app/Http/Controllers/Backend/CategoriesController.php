<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Services\UserActions;
use Illuminate\Support\Facades\Auth;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Category::orderBy('title', 'asc')->where('is_active',1)->get();
    }

    public function store(Request $request, UserActions $userActions)
    {
        $request->validate([
            'title' => ['required', 'string', 'unique:categories,title'],
            'description' => ['required', 'string'],
        ]);
        Category::create([
            'title' => $request->title,
            'description' => $request->description,
            'is_banner' => 0,
            'is_active' => 1
        ]);
        $userActions->logUserActions($request->user()->user_id, 'Created a category entitled ' . $request->title);
        return response()->json([
            'status' => 'Category Successfully Added!'
        ]);
    }


    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Category::select('category_id', 'title', 'description')->where('category_id', $id)->first();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id, UserActions $userActions)
    {
        $request->validate([
            'title' => ['required', 'string', 'unique:categories,title,'. $id. ',category_id'],
            'description' => ['required', 'string'],
        ]);
        Category::where('category_id', $id)->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);
        $userActions->logUserActions($request->user()->user_id, 'Updated a category entitled ' . $request->title);
        return response()->json([
            'status' => 'Category Successfully Updated!'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, UserActions $userActions)
    {
        $user = Auth::user();
        $cat = Category::where('category_id', $id)->first();
        $cat->update(['is_active'=>0]);
        $userActions->logUserActions($user->user_id, 'Deleted a category entitled ' . $cat->title);
        return response()->json([
            'status' => 'Category Successfully Deleted!'
        ]);
    }

    public function toggleCategory(Request $request)
    {
            $category = Category::where('category_id', $request->id)->first();
            $category->is_banner = $category->is_banner == 1 ? 0 :1;
            $category->save();
            return response()->json([
                'status' => 'Category Successfully Toggled!'
            ]);
    }
}
