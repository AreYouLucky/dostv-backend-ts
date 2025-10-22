<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table =  'posts';
    protected $primaryKey = 'post_id';
    protected $fillable = [
        'title',
        'type',
        'program',
        'description',
        'excerpt',
        'episode',
        'content',
        'platform',
        'url',
        'trailer',
        'banner',
        'thumbnail',
        'guest',
        'agency',
        'tags',
        'date_published',
        'is_featured',
        'status',
        'slug',
        'is_converted'
    ];
}
