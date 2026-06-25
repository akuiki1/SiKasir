<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StokMutasi extends Model
{
    use HasFactory;

    protected $table = 'stok_mutasis';

    protected $primaryKey = 'id_stok_mutasi';

    protected $fillable = [
        'id_produk',
        'tipe',
        'jumlah',
        'stok_sebelum',
        'stok_sesudah',
        'keterangan',
        'ref_tipe',
        'id_referensi',
        'id_user',
    ];

    protected $casts = [
        'jumlah' => 'float',
        'stok_sebelum' => 'float',
        'stok_sesudah' => 'float',
    ];

    public function produk(): BelongsTo
    {
        // withTrashed: produk yang diarsipkan tetap tampil namanya di kartu stok.
        return $this->belongsTo(Produk::class, 'id_produk', 'id_produk')->withTrashed()->withDefault([
            'nama' => 'Produk Terhapus',
        ]);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id')->withDefault([
            'name' => 'User Terhapus',
        ]);
    }
}
