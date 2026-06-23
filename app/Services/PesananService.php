<?php

namespace App\Services;

use App\Models\Pelanggan;
use App\Models\Pesanan;
use App\Models\PesananItem;
use App\Models\Produk;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Logika terpusat pesanan online: buat + reserve stok, edit (rekonsiliasi stok
 * per produk), dan kembalikan stok saat batal/kedaluwarsa. Dipakai bersama oleh
 * storefront publik, kasir (cart-as-pesanan), halaman kelola pesanan, dan command
 * auto-expire agar perilaku stok konsisten di semua jalur.
 */
class PesananService
{
    /** Status pesanan yang masih bisa diubah/diproses/dibatalkan. */
    public const STATUS_AKTIF = ['pending', 'disiapkan'];

    /**
     * Buat pesanan baru (pending) + reserve stok dalam satu transaksi.
     *
     * @param  array{nama: string, telp: string, catatan?: ?string, sumber?: string, items: array<int, array{id_produk: int|string, jumlah: int}>}  $data
     *
     * @throws ValidationException bila produk bukan satuan atau stok kurang.
     */
    public function buat(array $data, ?int $userId = null): Pesanan
    {
        $telp = self::normalizeTelp($data['telp']);
        $pelanggan = $this->cocokkanPelanggan($telp);
        $isReseller = $pelanggan?->tipe === 'reseller';

        return DB::transaction(function () use ($data, $telp, $pelanggan, $isReseller, $userId): Pesanan {
            $pesanan = Pesanan::create([
                'id_pelanggan' => $pelanggan?->id_pelanggan,
                'nama_pelanggan' => $data['nama'],
                'telp' => $telp,
                'tipe_pelanggan' => $isReseller ? 'reseller' : 'umum',
                'status' => 'pending',
                'total' => 0,
                'catatan' => $data['catatan'] ?? null,
                'sumber' => $data['sumber'] ?? 'web',
            ]);

            $total = 0;

            foreach ($data['items'] as $item) {
                $produk = Produk::lockForUpdate()->findOrFail($item['id_produk']);
                $this->assertSatuan($produk);

                $jumlah = (int) $item['jumlah'];
                $this->assertStok($produk, $jumlah);

                $harga = $this->hargaEfektif($produk, $isReseller);
                $subtotal = $harga * $jumlah;
                $total += $subtotal;

                $this->tulisItem($pesanan, $produk, $jumlah, $harga, $subtotal);
                $this->geserStok($produk, -$jumlah, $pesanan, $userId, 'Reserve pesanan '.$pesanan->kode);
            }

            $pesanan->update(['total' => $total]);

            return $pesanan->load('items');
        });
    }

    /**
     * Perbarui isi pesanan (tambah/kurangi/hapus produk) dengan rekonsiliasi stok
     * per produk: hanya selisih (delta) yang di-reserve / dikembalikan.
     *
     * @param  array<int, array{id_produk: int|string, jumlah: int}>  $items
     *
     * @throws ValidationException
     */
    public function perbaruiItems(Pesanan $pesanan, array $items, ?int $userId = null): Pesanan
    {
        return DB::transaction(function () use ($pesanan, $items, $userId): Pesanan {
            $pesanan = Pesanan::with('items')->lockForUpdate()->findOrFail($pesanan->id_pesanan);

            if (! in_array($pesanan->status, self::STATUS_AKTIF, true)) {
                throw ValidationException::withMessages(['status' => 'Pesanan ini sudah selesai/dibatalkan, tidak bisa diubah.']);
            }

            $isReseller = $pesanan->tipe_pelanggan === 'reseller';

            // Kuantitas lama & baru per produk (gabungkan baris duplikat).
            $lama = $pesanan->items->groupBy('id_produk')->map(fn ($g) => (int) $g->sum('jumlah'));
            $baru = collect($items)
                ->groupBy('id_produk')
                ->map(fn ($g) => (int) $g->sum(fn ($i) => (int) $i['jumlah']))
                ->filter(fn ($q) => $q > 0);

            if ($baru->isEmpty()) {
                throw ValidationException::withMessages(['items' => 'Pesanan harus berisi minimal 1 produk.']);
            }

            // Rekonsiliasi stok berdasar selisih tiap produk.
            $semuaId = $lama->keys()->merge($baru->keys())->unique();

            foreach ($semuaId as $idProduk) {
                $delta = (int) ($baru[$idProduk] ?? 0) - (int) ($lama[$idProduk] ?? 0);

                if ($delta === 0) {
                    continue;
                }

                $produk = Produk::lockForUpdate()->findOrFail($idProduk);
                $this->assertSatuan($produk);

                if ($delta > 0) {
                    $this->assertStok($produk, $delta);
                }

                $this->geserStok($produk, -$delta, $pesanan, $userId, 'Edit pesanan '.$pesanan->kode);
            }

            // Tulis ulang baris item dengan harga efektif terkini.
            $pesanan->items()->delete();
            $total = 0;

            foreach ($baru as $idProduk => $jumlah) {
                $produk = Produk::findOrFail($idProduk);
                $harga = $this->hargaEfektif($produk, $isReseller);
                $subtotal = $harga * $jumlah;
                $total += $subtotal;

                $this->tulisItem($pesanan, $produk, $jumlah, $harga, $subtotal);
            }

            $pesanan->update(['total' => $total]);

            return $pesanan->load('items');
        });
    }

    /**
     * Kembalikan stok yang sempat di-reserve (untuk batal manual / auto-expire).
     * Panggil di dalam transaksi pemanggil; pesanan harus punya relasi items.
     */
    public function kembalikanStok(Pesanan $pesanan, ?int $userId, string $keterangan): void
    {
        $pesanan->loadMissing('items');

        foreach ($pesanan->items as $item) {
            $produk = Produk::lockForUpdate()->find($item->id_produk);

            if (! $produk) {
                continue;
            }

            $produk->terapkanMutasiStok(
                (float) $item->jumlah,
                'pesanan_batal',
                [
                    'keterangan' => $keterangan,
                    'ref_tipe' => 'Pesanan',
                    'id_referensi' => $pesanan->id_pesanan,
                    'id_user' => $userId,
                ]
            );
        }
    }

    /** Cocokkan nomor WA (9 digit terakhir) ke pelanggan terdaftar; reseller diprioritaskan. */
    public function cocokkanPelanggan(string $telpNormalized): ?Pelanggan
    {
        $last9 = substr($telpNormalized, -9);

        if ($last9 === '') {
            return null;
        }

        $kandidat = Pelanggan::whereNotNull('telp')->get()
            ->filter(fn (Pelanggan $p) => str_contains(preg_replace('/\D/', '', (string) $p->telp), $last9));

        return $kandidat->firstWhere('tipe', 'reseller') ?? $kandidat->first();
    }

    /** Normalisasi nomor HP Indonesia ke format 62xxxxxxxxxx (untuk wa.me & pencocokan). */
    public static function normalizeTelp(string $telp): string
    {
        $digits = preg_replace('/\D/', '', $telp);

        if (str_starts_with($digits, '0')) {
            $digits = '62'.substr($digits, 1);
        } elseif (str_starts_with($digits, '8')) {
            $digits = '62'.$digits;
        }

        return $digits;
    }

    private function hargaEfektif(Produk $produk, bool $isReseller): int
    {
        return $isReseller
            ? max(0, $produk->harga_jual - $produk->potongan_reseller)
            : $produk->harga_jual;
    }

    private function assertSatuan(Produk $produk): void
    {
        if ($produk->tipe_jual !== 'satuan') {
            throw ValidationException::withMessages([
                'items' => "Produk {$produk->nama} tidak bisa dipesan (hanya produk satuan).",
            ]);
        }
    }

    private function assertStok(Produk $produk, int $butuh): void
    {
        if ($produk->stok < $butuh) {
            throw ValidationException::withMessages([
                'items' => "Stok {$produk->nama} tidak mencukupi (tersisa {$produk->stok}).",
            ]);
        }
    }

    private function tulisItem(Pesanan $pesanan, Produk $produk, int $jumlah, int $harga, int $subtotal): void
    {
        PesananItem::create([
            'id_pesanan' => $pesanan->id_pesanan,
            'id_produk' => $produk->id_produk,
            'nama_produk' => $produk->nama,
            'harga' => $harga,
            'jumlah' => $jumlah,
            'subtotal' => $subtotal,
        ]);
    }

    /** Geser stok (delta bertanda) untuk reserve (delta<0) atau kembalikan (delta>0). */
    private function geserStok(Produk $produk, int $delta, Pesanan $pesanan, ?int $userId, string $keterangan): void
    {
        $produk->terapkanMutasiStok(
            (float) $delta,
            $delta < 0 ? 'pesanan' : 'pesanan_batal',
            [
                'keterangan' => $keterangan,
                'ref_tipe' => 'Pesanan',
                'id_referensi' => $pesanan->id_pesanan,
                'id_user' => $userId,
            ]
        );
    }
}
