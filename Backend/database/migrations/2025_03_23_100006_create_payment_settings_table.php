<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('electricity_price', 10, 0)->default(5000)->comment('VNĐ/kWh');
            $table->decimal('water_price', 10, 0)->default(10000)->comment('VNĐ/m3');
            $table->decimal('internet_price', 10, 0)->default(100000)->comment('VNĐ/tháng');
            $table->decimal('garbage_price', 10, 0)->default(30000)->comment('VNĐ/tháng');
            $table->integer('default_due_day')->default(10)->comment('Ngày hạn thanh toán');
            $table->string('bank_name')->nullable();
            $table->string('bank_account')->nullable();
            $table->string('bank_holder')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_settings');
    }
};
