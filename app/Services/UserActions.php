<?php

namespace App\Services;
use App\Models\UserAction;

class UserActions
{
    /**
     * Create a new class instance.
     */
    public function logUserActions(String $id, String $actions, String $action_type, String $content_type)
    {
        UserAction::create([
            'user_id' => $id,
            'action' => $actions,
            'action_type' => $action_type,
            'content_type' => $content_type
        ]);
    }
}
