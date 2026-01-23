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
}
