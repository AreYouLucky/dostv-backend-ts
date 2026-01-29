<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramSeason extends Model
{
    protected $table = 'program_seasons';
    protected $fillable = [
        'program', 'title', 'description', 'thumbnail'
    ];
}
