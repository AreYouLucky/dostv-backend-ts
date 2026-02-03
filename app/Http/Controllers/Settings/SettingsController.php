<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Validation\Rules\Password;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => $validated['password'],
        ]);

        return response()->json([
            'status' => 'Password successfully updated!'
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
        ]);

        $request->user()->update([
            'email' => $validated['email'],
            'name' => $validated['name'],
            'username' => $validated['name'],
        ]);

        return response()->json([
            'status' => 'Password successfully updated!'
        ]);
    }

    public function updateProfilePicture(Request $request)
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,png,jpeg'],
        ]);

        if ($request->hasFile("image")) {
                $file = $request->file("image");
                $filename = $request->user()->name . '.' . $file->getClientOriginalExtension();
                $storagePath = $file->storeAs('images/users', $filename, 'public');
            }

         $request->user()->update([
            'avatar' => $storagePath ?? null
        ]);

        return response()->json([
            'status' => 'Profile Picture successfully updated!'
        ]);
    }
}
