<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id('post_id');
            $table->string('slug');
            $table->string('title');
            $table->string('type');
            $table->string('program');
            $table->text('description')->nullable();
            $table->text('excerpt')->nullable();
            $table->integer('episode')->nullable();
            $table->text('content')->nullable();
            $table->string('platform')->nullable();
            $table->string('url')->nullable();
            $table->string('trailer')->nullable();
            $table->string('banner')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('guest')->nullable();
            $table->string('agency')->nullable();
            $table->string('tags')->nullable();
            $table->date('date_published');
            $table->string('is_featured')->default(0);
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
