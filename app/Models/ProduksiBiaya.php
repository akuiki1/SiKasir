<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProduksiBiaya extends Model
{
    use HasFactory;

    protected $table = 'produksi_biayas';

    protected $primaryKey = 'id_produksi_biaya';

    protected $fillable = [
        'id_produksi',
        'nama',
        'nominal',
    ];

    protected $casts = [
        'nominal' => 'integer',
    ];

    public function produksi(): BelongsTo
    {
        return $this->belongsTo(Produksi::class, 'id_produksi', 'id_produksi');
    }
}
