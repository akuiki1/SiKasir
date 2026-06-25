<?php

namespace App\Models;

use Database\Factories\DetailTransaksiFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailTransaksi extends Model
{
    /** @use HasFactory<DetailTransaksiFactory> */
    use HasFactory;

    protected $primaryKey = 'id_detail_transaksi';

    protected $fillable = [
        'id_transaksi',
        'id_produk',
        'jumlah',
        'harga',
        'modal',
        'subtotal',
        'nominal',
    ];

    protected $casts = [
        // Bisa pecahan untuk produk curah (mis. 1.429 liter). Rupiah tetap integer.
        'jumlah' => 'float',
        'harga' => 'integer',
        'modal' => 'integer',
        'subtotal' => 'integer',
        // Pass-through jasa (uang transfer/tarik). null untuk baris non-jasa.
        'nominal' => 'integer',
    ];

    public function transaksi(): BelongsTo
    {
        return $this->belongsTo(Transaksi::class, 'id_transaksi', 'id_transaksi');
    }

    public function produk(): BelongsTo
    {
        // withTrashed: produk yang diarsipkan tetap tampil namanya di riwayat transaksi.
        return $this->belongsTo(Produk::class, 'id_produk', 'id_produk')->withTrashed()->withDefault([
            'nama' => 'Produk Terhapus',
        ]);
    }
}
