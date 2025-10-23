<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Category::orderBy('title', 'desc')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required' | 'string',
            'description' => 'required' | 'string'
        ]);
        Category::create([
            'title' => $request->title,
            'description' => $request->description,
            'is_banner' => 0,
            'is_active' => 1
        ]);
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title' => 'required' | 'string',
            'description' => 'required' | 'string'
        ]);
        Category::where('id', $id)->update([
            'title' => $request->title,
            'description' => $request->description,
            'is_banner' => 0,
            'is_active' => 1
        ]);
        return response()->json([
            'status' => 'Category Successfully Updated!'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Category::destroy($id);
        return response()->json([
            'status' => 'Category Successfully Deleted!'
        ]);
    }
}
