<?php

namespace App\Services;
use App\Models\UserAction;

class UserActions
{
    /**
     * Create a new class instance.
     */
    public function logUserActions(String $id, String $actions)
    {
        UserAction::create([
            'user_id' => $id,
            'action' => $actions
        ]);
    }
}
