<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TarifJasa extends Model
{
    use HasFactory;

    protected $table = 'tarif_jasas';

    protected $primaryKey = 'id_tarif_jasa';

    protected $fillable = [
        'id_produk',
        'min_nominal',
        'fee',
    ];

    protected $casts = [
        'min_nominal' => 'integer',
        'fee' => 'integer',
    ];

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'id_produk', 'id_produk');
    }
}
