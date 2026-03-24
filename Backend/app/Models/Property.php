<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    protected $fillable = [
        'user_id', 'name', 'address', 'phone', 'description', 'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    public function tenants(): HasMany
    {
        return $this->hasMany(Tenant::class);
    }

    // Accessors
    public function getTotalRoomsAttribute(): int
    {
        return $this->rooms()->count();
    }

    public function getAvailableRoomsAttribute(): int
    {
        return $this->rooms()->where('status', 'available')->count();
    }

    public function getOccupancyRateAttribute(): float
    {
        $total = $this->total_rooms;
        if ($total === 0) return 0;
        return round((($total - $this->available_rooms) / $total) * 100, 1);
    }
}
