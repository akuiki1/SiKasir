<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaksi extends Model
{
    protected $primaryKey = 'id_transaksi';

    protected $fillable = [
        'id_user',
        'total_harga',
        'metode_pembayaran',
        'bayar',
        'kembalian',
    ];

    protected $casts = [
        'total_harga' => 'integer',
        'bayar' => 'integer',
        'kembalian' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function detailTransaksis(): HasMany
    {
        return $this->hasMany(DetailTransaksi::class, 'id_transaksi', 'id_transaksi');
    }
}
