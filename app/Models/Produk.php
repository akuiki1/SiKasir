<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produk extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_produk';

    protected $fillable = [
        'id_kategori',
        'jenis',
        'nama',
        'foto',
        'harga_jual',
        'harga_modal',
        'stok',
        'barcode',
        'sku',
    ];

    protected $casts = [
        'harga_jual' => 'integer',
        'harga_modal' => 'integer',
        'stok' => 'integer',
    ];

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class, 'id_kategori', 'id_kategori')->withDefault([
            'nama_kategori' => 'Kategori Terhapus',
        ]);
    }

    public function detailTransaksis(): HasMany
    {
        return $this->hasMany(DetailTransaksi::class, 'id_produk', 'id_produk');
    }

    public function produksis(): HasMany
    {
        return $this->hasMany(Produksi::class, 'id_produk', 'id_produk');
    }

    public function getStatusStokAttribute(): string
    {
        if ($this->stok === 0) {
            return 'out-of-stock';
        }

        if ($this->stok <= 5) {
            return 'low-stock';
        }

        return 'in-stock';
    }
}
