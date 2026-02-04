<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserAction;
use Inertia\Inertia;
use App\Models\User;

class UsersActivityController extends Controller
{
    public function fetchUsersActivities(Request $request)
    {
        $query = UserAction::select('users.name', 'users.avatar', 'user_actions.action', 'user_actions.created_at')->query();
        if (request()->filled('from') && request()->filled('to')) {
            $query->whereBetween('created_at', [request()->from, request()->to]);
        }
        if (request()->filled('user')) {
            $query->where('user_id', request()->user);
        }
        return $query->join('users', 'user_actions.user_id', '=', 'users.id')->orderBy('created_at', 'desc')->get();
    }
    
    public function viewActivities(Request $request)
    {
        $user = [];
        if (in_array($request->user()->role, ['superadmin', 'admin'])) {
            $user = User::where('is_active', 1)->where('role', '!=', 'superadmin')->orderBy('name', 'asc')->get();
        }
        return Inertia::render('Backend/UsersActivity', [
            'users' => $user
        ]);
    }
}
