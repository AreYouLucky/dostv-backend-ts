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
        Schema::create('advertisements', function (Blueprint $table) {
            $table->id('advertisment_id');
            $table->string('title');
            $table->string('thumbnail')->nullable();
            $table->string('url')->nullable();
            $table->string('slug')->nullable();
            $table->text('description')->nullable();
            $table->text('excerpt')->nullable();
            $table->integer('is_redirect');
            $table->integer('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advertisements');
    }
};
