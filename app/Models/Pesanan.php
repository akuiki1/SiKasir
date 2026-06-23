<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pesanan extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_pesanan';

    protected $fillable = [
        'id_pelanggan',
        'nama_pelanggan',
        'telp',
        'tipe_pelanggan',
        'status',
        'total',
        'catatan',
        'sumber',
        'id_transaksi',
        'disiapkan_at',
        'selesai_at',
    ];

    protected $casts = [
        'total' => 'integer',
        'disiapkan_at' => 'datetime',
        'selesai_at' => 'datetime',
    ];

    /** Kode tampilan, selaras konvensi TRX-{id} pada transaksi. */
    public function getKodeAttribute(): string
    {
        return 'PSN-'.$this->id_pesanan;
    }

    public function items(): HasMany
    {
        return $this->hasMany(PesananItem::class, 'id_pesanan', 'id_pesanan');
    }

    public function pelanggan(): BelongsTo
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan', 'id_pelanggan')->withDefault([
            'nama' => 'Umum',
        ]);
    }

    public function transaksi(): BelongsTo
    {
        return $this->belongsTo(Transaksi::class, 'id_transaksi', 'id_transaksi');
    }
}
