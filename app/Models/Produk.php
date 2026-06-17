<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;

class Produk extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_produk';

    protected $fillable = [
        'id_kategori',
        'jenis',
        'tipe_jual',
        'satuan',
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
        // Stok bisa pecahan untuk produk curah (liter/kg). Rupiah tetap integer.
        'stok' => 'float',
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

    public function stokMutasis(): HasMany
    {
        return $this->hasMany(StokMutasi::class, 'id_produk', 'id_produk');
    }

    public function getStatusStokAttribute(): string
    {
        $stok = (float) $this->stok;

        if ($stok <= 0) {
            return 'out-of-stock';
        }

        if ($stok <= 5) {
            return 'low-stock';
        }

        return 'in-stock';
    }

    /**
     * Terapkan perubahan stok (delta bertanda) lalu catat ke kartu stok.
     * Panggil di dalam DB::transaction setelah lockForUpdate agar aman dari race.
     *
     * @param  array{keterangan?: string, ref_tipe?: string, id_referensi?: int, id_user?: int}  $opts
     */
    public function terapkanMutasiStok(float $delta, string $tipe, array $opts = []): StokMutasi
    {
        $sebelum = (float) ($this->stok ?? 0);
        $sesudah = $sebelum + $delta;

        $this->stok = $sesudah;
        $this->save();

        return $this->catatMutasiStok($sebelum, $sesudah, $delta, $tipe, $opts);
    }

    /**
     * Catat satu baris kartu stok TANPA mengubah stok (untuk saldo awal /
     * penyesuaian yang nilainya sudah ditulis langsung ke kolom stok).
     *
     * @param  array{keterangan?: string, ref_tipe?: string, id_referensi?: int, id_user?: int}  $opts
     */
    public function catatMutasiStok(float $sebelum, float $sesudah, float $delta, string $tipe, array $opts = []): StokMutasi
    {
        return StokMutasi::create([
            'id_produk' => $this->id_produk,
            'tipe' => $tipe,
            'jumlah' => $delta,
            'stok_sebelum' => $sebelum,
            'stok_sesudah' => $sesudah,
            'keterangan' => $opts['keterangan'] ?? null,
            'ref_tipe' => $opts['ref_tipe'] ?? null,
            'id_referensi' => $opts['id_referensi'] ?? null,
            'id_user' => $opts['id_user'] ?? Auth::id(),
        ]);
    }
}
