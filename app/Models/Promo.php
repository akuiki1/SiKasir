<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Promo extends Model
{
    use HasFactory;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id_promo';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama',
        'deskripsi',
        'tipe',
        'nilai',
        'beli_qty',
        'gratis_qty',
        'id_produk',
        'minimal_belanja',
        'tanggal_mulai',
        'tanggal_selesai',
        'aktif',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'nilai' => 'float',
        'beli_qty' => 'integer',
        'gratis_qty' => 'integer',
        'minimal_belanja' => 'float',
        'tanggal_mulai' => 'datetime',
        'tanggal_selesai' => 'datetime',
        'aktif' => 'boolean',
    ];

    /**
     * Get the product associated with the promo.
     */
    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'id_produk', 'id_produk')->withDefault([
            'nama' => 'Semua Produk',
        ]);
    }
}
