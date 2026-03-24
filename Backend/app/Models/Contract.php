<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contract extends Model
{
    protected $fillable = [
        'code', 'tenant_id', 'room_id',
        'start_date', 'end_date', 'deposit', 'rent_amount',
        'terms', 'status',
    ];

    protected $casts = [
        'start_date'  => 'date',
        'end_date'    => 'date',
        'deposit'     => 'decimal:0',
        'rent_amount' => 'decimal:0',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
