<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    protected $fillable = [
        'code', 'room_id', 'tenant_id', 'period',
        'room_charge',
        'electricity_old', 'electricity_new', 'electricity_price', 'electricity_amount',
        'water_old', 'water_new', 'water_price', 'water_amount',
        'other_fees', 'other_fees_note',
        'total_amount', 'status', 'due_date', 'paid_date', 'paid_amount', 'note',
    ];

    protected $casts = [
        'due_date'  => 'date',
        'paid_date' => 'date',
        'room_charge'        => 'decimal:0',
        'electricity_amount' => 'decimal:0',
        'water_amount'       => 'decimal:0',
        'other_fees'         => 'decimal:0',
        'total_amount'       => 'decimal:0',
        'paid_amount'        => 'decimal:0',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    // Auto-calculate electricity & water amounts
    public function calculateAmounts(): void
    {
        $this->electricity_amount = ($this->electricity_new - $this->electricity_old) * $this->electricity_price;
        $this->water_amount = ($this->water_new - $this->water_old) * $this->water_price;
        $this->total_amount = $this->room_charge + $this->electricity_amount + $this->water_amount + $this->other_fees;
    }
}
