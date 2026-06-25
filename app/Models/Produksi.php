<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produksi extends Model
{
    use HasFactory;

    protected $table = 'produksis';

    protected $primaryKey = 'id_produksi';

    protected $fillable = [
        'id_produk',
        'jumlah',
        'total_biaya',
        'modal_per_unit',
        'catatan',
    ];

    protected $casts = [
        'jumlah' => 'integer',
        'total_biaya' => 'integer',
        'modal_per_unit' => 'integer',
    ];

    public function produk(): BelongsTo
    {
        // withTrashed: produk yang diarsipkan tetap tampil namanya di riwayat produksi.
        return $this->belongsTo(Produk::class, 'id_produk', 'id_produk')->withTrashed()->withDefault([
            'nama' => 'Produk Terhapus',
        ]);
    }

    public function biayas(): HasMany
    {
        return $this->hasMany(ProduksiBiaya::class, 'id_produksi', 'id_produksi');
    }
}
