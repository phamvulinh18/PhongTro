<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('room_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('period')->comment('VD: 03/2025');
            $table->decimal('room_charge', 12, 0)->default(0);

            // Điện
            $table->integer('electricity_old')->default(0);
            $table->integer('electricity_new')->default(0);
            $table->decimal('electricity_price', 10, 0)->default(0)->comment('Đơn giá/kWh');
            $table->decimal('electricity_amount', 12, 0)->default(0);

            // Nước
            $table->integer('water_old')->default(0);
            $table->integer('water_new')->default(0);
            $table->decimal('water_price', 10, 0)->default(0)->comment('Đơn giá/m3');
            $table->decimal('water_amount', 12, 0)->default(0);

            // Phí khác
            $table->decimal('other_fees', 12, 0)->default(0);
            $table->text('other_fees_note')->nullable();

            $table->decimal('total_amount', 12, 0)->default(0);
            $table->enum('status', ['paid', 'unpaid', 'overdue', 'partial'])->default('unpaid');
            $table->date('due_date');
            $table->date('paid_date')->nullable();
            $table->decimal('paid_amount', 12, 0)->default(0);
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
