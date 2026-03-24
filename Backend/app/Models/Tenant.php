<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    protected $fillable = [
        'property_id', 'room_id', 'full_name', 'phone', 'id_card',
        'email', 'address', 'emergency_contact',
        'move_in_date', 'move_out_date', 'status',
    ];

    protected $casts = [
        'move_in_date'  => 'date',
        'move_out_date' => 'date',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function getDebtAttribute(): float
    {
        return $this->invoices()
            ->whereIn('status', ['unpaid', 'overdue', 'partial'])
            ->sum('total_amount') - $this->invoices()
            ->whereIn('status', ['unpaid', 'overdue', 'partial'])
            ->sum('paid_amount');
    }
}
