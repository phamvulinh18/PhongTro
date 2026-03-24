<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('room_id')->nullable()->constrained()->nullOnDelete();
            $table->string('full_name');
            $table->string('phone');
            $table->string('id_card')->nullable()->comment('CCCD');
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->string('emergency_contact')->nullable();
            $table->date('move_in_date')->nullable();
            $table->date('move_out_date')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
