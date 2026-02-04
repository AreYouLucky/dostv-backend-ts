<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;
use App\Services\UserActions;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return User::select('name', 'email', 'user_id', 'avatar', 'role')
            ->where('role', '!=', 'superadmin')
            ->where('is_active', '1')
            ->orderBy('name', 'asc')
            ->get();
    }
    public function store(Request $request, UserActions $userActions)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:users,name,NULL,id,is_active,1',],
            'email' => ['required', 'string', 'email', 'max:255',  'unique:users,email,NULL,id,is_active,1'],
            'password' => ['required', 'string', 'min:8', 'confirmed', Password::default()],
            'avatar' => ['nullable', 'image', 'mimes:jpg,png,jpeg']
        ]);

        if ($request->hasFile("avatar")) {
            $file = $request->file("avatar");
            $filename = $request->name . '.' . $file->getClientOriginalExtension();
            $storagePath = $file->storeAs('images/users', $filename, 'public');
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'avatar' => $storagePath ?? null,
            'role' => 'encoder'
        ]);
        $userActions->logUserActions($request->user()->user_id, 'Created a new account named ' . $request->name);

        return response()->json([
            'status' => 'Profile Successfully Created!'
        ]);
    }

    public function update(Request $request, string $id, UserActions $userActions)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:users,name,' . $id . ',user_id,is_active,1',],
            'email' => ['required', 'string', 'email', 'max:255',  'unique:users,email,' . $id . ',user_id,is_active,1',],
            'avatar' => ['nullable', 'image', 'mimes:jpg,png,jpeg']
        ]);
        $user = User::find($id);
        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->hasFile("avatar")) {
            $file = $request->file("avatar");
            $filename = $request->name . '.' . $file->getClientOriginalExtension();
            $user->avatar = $file->storeAs('images/users', $filename, 'public');
        }

        $user->save();

        $userActions->logUserActions($request->user()->user_id, 'Updated an account named ' . $request->name);

        return response()->json([
            'status' => 'Profile Successfully Updated!'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, UserActions $userActions)
    {
        $user = Auth::user();
        $u = User::where('user_id', $id)->update(['is_active'=>0]);
        $userActions->logUserActions($user->user_id, 'Deleted an account named ' . $u->name);
        return response()->json([
            'status' => 'Profile Successfully Deleted!'
        ]);
    }

    public function changePassword(Request $request, string $id, UserActions $userActions)
    {
        $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed', Password::default()],
        ]);
        $user = User::find($id);
        $user->password = Hash::make($request->password);
        $user->save();
        $userActions->logUserActions($request->user()->user_id, 'Updated the password of an account named ' . $user->name);
        return response()->json([
            'status' => 'Password Successfully Updated!'
        ]);
    }
}
