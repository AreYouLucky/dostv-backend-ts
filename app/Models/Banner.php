<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $table = 'banners';
    protected $primaryKey = 'banner_id';
    protected $fillable = [
        'title',
        'img',
        'code',
        'highlight_text',
        'url',
        'type'
    ];
}
