<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kategori extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_kategori';

    protected $fillable = [
        'nama_kategori',
    ];

    public function produks(): HasMany
    {
        return $this->hasMany(Produk::class, 'id_kategori', 'id_kategori');
    }
}
