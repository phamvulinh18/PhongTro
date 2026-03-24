<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Room extends Model
{
    protected $fillable = [
        'property_id', 'code', 'price', 'area', 'floor', 'description', 'status',
    ];

    protected $casts = [
        'price' => 'decimal:0',
        'area'  => 'decimal:2',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function tenant(): HasOne
    {
        return $this->hasOne(Tenant::class)->where('status', 'active');
    }

    public function tenants(): HasMany
    {
        return $this->hasMany(Tenant::class);
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
