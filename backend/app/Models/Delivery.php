<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'tracking_code',
        'pickup_address',
        'delivery_address',
        'contact_number',
        'weight',
        'price',
        'status',
        'notes',
    ];

    /**
     * Get the user that owns the delivery.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the order associated with the delivery.
     */
    public function order()
    {
        return $this->hasOne(Order::class);
    }

    /**
     * Boot method to generate tracking code automatically.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($delivery) {
            if (empty($delivery->tracking_code)) {
                $delivery->tracking_code = static::generateTrackingCode();
            }
        });
    }

    /**
     * Generate a unique tracking code.
     */
    public static function generateTrackingCode()
    {
        do {
            $trackingCode = 'DL' . strtoupper(uniqid()) . rand(100, 999);
        } while (static::where('tracking_code', $trackingCode)->exists());

        return $trackingCode;
    }
}
