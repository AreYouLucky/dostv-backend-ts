<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAction extends Model
{
    protected $table = 'user_actions';
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'action'
    ];
}
