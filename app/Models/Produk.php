<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class Produk extends Model
{
    // SoftDeletes: "Arsipkan" produk (sembunyikan dari katalog/kasir/stok/laporan
    // tapi pertahankan riwayat). deleted_at = waktu diarsipkan.
    use HasFactory, SoftDeletes;

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
        'potongan_reseller',
        'stok',
        'barcode',
        'sku',
    ];

    protected $casts = [
        'harga_jual' => 'integer',
        'harga_modal' => 'integer',
        'potongan_reseller' => 'integer',
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

    public function tarifJasas(): HasMany
    {
        return $this->hasMany(TarifJasa::class, 'id_produk', 'id_produk');
    }

    /**
     * Tentukan fee jasa untuk sebuah nominal berdasarkan tarif bertingkat.
     *
     * Tarif berlaku = baris dengan `min_nominal` terbesar yang masih <= nominal.
     * Bila nominal di bawah tarif terendah, dipakai tarif terendah. Mengembalikan
     * null bila produk belum punya tarif bertingkat (artinya fee diketik manual).
     *
     * @param  \Illuminate\Support\Collection<int, TarifJasa>|null  $tarifs  daftar
     *         tarif yang sudah dimuat (opsional) — untuk menghindari query ulang.
     */
    public function resolveFeeJasa(int $nominal, $tarifs = null): ?int
    {
        $tarifs = ($tarifs ?? $this->tarifJasas)->sortBy('min_nominal')->values();

        if ($tarifs->isEmpty()) {
            return null;
        }

        $match = $tarifs->last(fn (TarifJasa $tarif) => $nominal >= $tarif->min_nominal)
            ?? $tarifs->first();

        return (int) $match->fee;
    }

    /**
     * URL foto produk yang siap ditampilkan. Nilai `foto` bisa berupa dua bentuk:
     * path relatif hasil upload (mis. "produk/abc.jpg" → dilayani lewat symlink
     * storage) ATAU URL lengkap yang ditempel manual (mis. "https://.../x.jpg").
     * Untuk URL lengkap, kembalikan apa adanya; jangan diprefiks "storage/".
     */
    public static function fotoUrl(?string $foto): ?string
    {
        if (! $foto) {
            return null;
        }

        if (Str::startsWith($foto, ['http://', 'https://'])) {
            return $foto;
        }

        return asset('storage/'.$foto);
    }

    /**
     * Buat barcode EAN-13 unik untuk penomoran internal toko.
     * Prefix "2" memakai rentang in-store/restricted distribution GS1 (aman dipakai
     * sendiri, tidak bentrok barcode pabrikan), diikuti 11 digit acak lalu satu
     * check digit EAN-13 agar tetap valid saat discan.
     */
    public static function generateUniqueBarcode(): string
    {
        do {
            $base = '2';
            for ($i = 0; $i < 11; $i++) {
                $base .= random_int(0, 9);
            }
            $barcode = $base.static::ean13CheckDigit($base);
        } while (static::where('barcode', $barcode)->exists());

        return $barcode;
    }

    /**
     * Hitung check digit (digit ke-13) dari 12 digit awal sesuai standar EAN-13.
     */
    public static function ean13CheckDigit(string $base12): string
    {
        $sum = 0;
        foreach (str_split($base12) as $i => $digit) {
            $sum += (int) $digit * ($i % 2 === 0 ? 1 : 3);
        }

        return (string) ((10 - ($sum % 10)) % 10);
    }

    /**
     * Turunkan SKU unik dari sebuah barcode. Pola "SKU-<12 digit>" selaras dengan
     * generator SKU di form produk (resources/js/pages/admin/Products.vue); bila
     * bentrok dengan SKU lama, ditambah sufiks angka agar tetap unik.
     */
    public static function generateUniqueSku(string $barcode): string
    {
        $normalized = substr(strtoupper((string) preg_replace('/[^A-Za-z0-9]/', '', $barcode)), 0, 12);
        $base = $normalized !== '' ? "SKU-{$normalized}" : 'SKU-'.strtoupper(Str::random(8));

        $sku = $base;
        $suffix = 1;
        while (static::where('sku', $sku)->exists()) {
            $sku = $base.'-'.$suffix;
            $suffix++;
        }

        return $sku;
    }

    public function getStatusStokAttribute(): string
    {
        // Produk jasa tidak mengelola stok, jadi tidak pernah dianggap habis/menipis.
        if ($this->tipe_jual === 'jasa') {
            return 'in-stock';
        }

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
