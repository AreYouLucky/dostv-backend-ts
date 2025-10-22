<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $table = 'programs';
    protected $primaryKey = 'program_id';
    protected $fillable = [
        'code',
        'title',
        'description',
        'agency',
        'image',
        'trailer',
        'date_started',
        'is_active',
        'order',
        'program_type'
    ];
}
