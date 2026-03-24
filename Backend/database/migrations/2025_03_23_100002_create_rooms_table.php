<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->string('code');
            $table->decimal('price', 12, 0)->default(0);
            $table->decimal('area', 8, 2)->nullable();
            $table->integer('floor')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['available', 'occupied', 'maintenance'])->default('available');
            $table->timestamps();

            $table->unique(['property_id', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
