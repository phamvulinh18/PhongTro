<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentSetting extends Model
{
    protected $fillable = [
        'user_id', 'electricity_price', 'water_price',
        'internet_price', 'garbage_price', 'default_due_day',
        'bank_name', 'bank_account', 'bank_holder',
    ];

    protected $casts = [
        'electricity_price' => 'decimal:0',
        'water_price'       => 'decimal:0',
        'internet_price'    => 'decimal:0',
        'garbage_price'     => 'decimal:0',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
