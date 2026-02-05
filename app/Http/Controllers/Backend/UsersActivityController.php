<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserAction;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Carbon;

class UsersActivityController extends Controller
{
    public function fetchUsersActivities(Request $request)
    {
        $query = UserAction::join('users', 'user_actions.user_id', '=', 'users.user_id')
            ->select(
                'users.name',
                'users.avatar',
                'user_actions.action',
                'user_actions.created_at'
            );

        if ($request->filled('from') && $request->filled('to')) {
            $query->whereBetween('user_actions.created_at', [
                Carbon::parse($request->from)->startOfDay(),
                Carbon::parse($request->to)->endOfDay(),
            ]);
        }

        if ($request->filled('user') && $request->user != 0 && $request->user()->role !== 'encoder') {
            $query->where('user_actions.user_id', $request->user);
        }
        
        if( $request->user()->role == 'encoder'){
            $query->where('user_actions.user_id', $request->user()->user_id);
        }

        return $query
            ->orderBy('user_actions.created_at', 'desc')
            ->get();
    }


    public function viewActivities(Request $request)
    {
        $user = [];
        if (in_array($request->user()->role, ['superadmin', 'admin'])) {
            $user = User::where('is_active', 1)->where('role', '!=', 'superadmin')->orderBy('name', 'asc')->get();
        }
        return Inertia::render('user-management/activities/activities-page', [
            'users' => $user
        ]);
    }
}
