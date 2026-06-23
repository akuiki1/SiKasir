<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use App\Models\Pesanan;
use App\Models\PesananItem;
use App\Models\Produk;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PesananPublikController extends Controller
{
    /**
     * Nomor WhatsApp toko (tujuan pesan konfirmasi pesanan dari pelanggan).
     * Selaras dengan WHATSAPP_NUMBER di resources/js/pages/Welcome.vue.
     */
    private const WHATSAPP_TOKO = '6281254744177';

    /**
     * Simpan pesanan online (pending) dari storefront + reserve stok.
     *
     * Endpoint publik (tanpa auth) yang dipanggil via fetch dari Welcome.vue.
     * Mengembalikan JSON berisi kode pesanan + tautan wa.me ke toko agar
     * pelanggan bisa mengonfirmasi. Pesanan sudah tersimpan walau WA tidak dikirim.
     */
    public function store(Request $request): JsonResponse
    {
        // Endpoint JSON publik. Karena app hanya merender JSON otomatis untuk
        // path api/* (lihat bootstrap/app.php), error validasi ditangkap manual
        // dan dikembalikan sebagai JSON 422 agar fetch storefront bisa membacanya.
        try {
            $validated = $request->validate([
                'nama' => ['required', 'string', 'max:100'],
                'telp' => ['required', 'string', 'max:30', 'regex:/^[0-9+\-\s()]{6,}$/'],
                'catatan' => ['nullable', 'string', 'max:500'],
                'items' => ['required', 'array', 'min:1', 'max:100'],
                'items.*.id_produk' => ['required', 'exists:produks,id_produk'],
                'items.*.jumlah' => ['required', 'integer', 'min:1'],
            ], [
                'telp.regex' => 'Nomor WhatsApp tidak valid.',
            ]);

            $pesanan = $this->buatPesanan($validated);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->validator->errors()->first() ?: 'Pesanan gagal dibuat.',
                'errors' => $e->errors(),
            ], 422);
        }

        return response()->json([
            'kode' => $pesanan->kode,
            'total' => $pesanan->total,
            'wa_url' => $this->waKonfirmasiUrl($pesanan),
        ]);
    }

    /**
     * Buat pesanan + reserve stok dalam satu transaksi.
     *
     * @param  array{nama: string, telp: string, catatan?: ?string, items: array<int, array{id_produk: int, jumlah: int}>}  $validated
     *
     * @throws ValidationException bila produk bukan satuan atau stok kurang.
     */
    private function buatPesanan(array $validated): Pesanan
    {
        $telp = $this->normalizeTelp($validated['telp']);

        // Cocokkan ke pelanggan terdaftar via nomor WA → tentukan harga reseller.
        // Pencocokan di PHP (tabel pelanggan kecil/fokus reseller) agar portabel
        // lintas database & toleran terhadap beragam format nomor tersimpan.
        $last9 = substr($telp, -9);
        $kandidat = Pelanggan::whereNotNull('telp')->get()
            ->filter(fn (Pelanggan $p) => $last9 !== ''
                && str_contains(preg_replace('/\D/', '', (string) $p->telp), $last9));
        $pelanggan = $kandidat->firstWhere('tipe', 'reseller') ?? $kandidat->first();

        $isReseller = $pelanggan?->tipe === 'reseller';

        return DB::transaction(function () use ($validated, $telp, $pelanggan, $isReseller): Pesanan {
            $pesanan = Pesanan::create([
                'id_pelanggan' => $pelanggan?->id_pelanggan,
                'nama_pelanggan' => $validated['nama'],
                'telp' => $telp,
                'tipe_pelanggan' => $isReseller ? 'reseller' : 'umum',
                'status' => 'pending',
                'total' => 0,
                'catatan' => $validated['catatan'] ?? null,
                'sumber' => 'web',
            ]);

            $total = 0;

            foreach ($validated['items'] as $item) {
                $produk = Produk::lockForUpdate()->findOrFail($item['id_produk']);

                if ($produk->tipe_jual !== 'satuan') {
                    throw ValidationException::withMessages([
                        'items' => "Produk {$produk->nama} tidak bisa dipesan online.",
                    ]);
                }

                $jumlah = (int) $item['jumlah'];

                if ($produk->stok < $jumlah) {
                    throw ValidationException::withMessages([
                        'items' => "Stok {$produk->nama} tidak mencukupi (tersisa {$produk->stok}).",
                    ]);
                }

                $harga = $isReseller
                    ? max(0, $produk->harga_jual - $produk->potongan_reseller)
                    : $produk->harga_jual;
                $subtotal = $harga * $jumlah;
                $total += $subtotal;

                PesananItem::create([
                    'id_pesanan' => $pesanan->id_pesanan,
                    'id_produk' => $produk->id_produk,
                    'nama_produk' => $produk->nama,
                    'harga' => $harga,
                    'jumlah' => $jumlah,
                    'subtotal' => $subtotal,
                ]);

                // Reserve stok: pesanan menahan stok agar tidak oversold.
                // Mutasi 'pesanan' inilah stock-out untuk penjualan ini —
                // saat diproses (dibayar) stok TIDAK dikurangi lagi.
                $produk->terapkanMutasiStok(
                    -(float) $jumlah,
                    'pesanan',
                    [
                        'keterangan' => 'Reserve pesanan PSN-'.$pesanan->id_pesanan,
                        'ref_tipe' => 'Pesanan',
                        'id_referensi' => $pesanan->id_pesanan,
                        'id_user' => null,
                    ]
                );
            }

            $pesanan->update(['total' => $total]);

            return $pesanan;
        });
    }

    /** Bangun tautan wa.me ke toko berisi ringkasan pesanan (pesan konfirmasi pelanggan). */
    private function waKonfirmasiUrl(Pesanan $pesanan): string
    {
        $pesanan->load('items');

        $baris = $pesanan->items
            ->map(fn (PesananItem $item, int $i) => ($i + 1).'. '.$item->nama_produk
                .' ('.$item->jumlah.'x) = Rp'.number_format($item->subtotal, 0, ',', '.'))
            ->implode("\n");

        $teks = "Halo Cemilan Mba Tutut! 👋\n"
            ."Saya sudah membuat pesanan *{$pesanan->kode}* lewat web:\n\n"
            ."{$baris}\n\n"
            .'*Total: Rp'.number_format($pesanan->total, 0, ',', '.')."*\n\n"
            ."Atas nama: {$pesanan->nama_pelanggan}\n"
            .'Mohon disiapkan ya, nanti saya ambil. Terima kasih! 🙏';

        return 'https://wa.me/'.self::WHATSAPP_TOKO.'?text='.rawurlencode($teks);
    }

    /**
     * Normalisasi nomor HP Indonesia ke format 62xxxxxxxxxx (untuk wa.me & pencocokan).
     */
    private function normalizeTelp(string $telp): string
    {
        $digits = preg_replace('/\D/', '', $telp);

        if (str_starts_with($digits, '0')) {
            $digits = '62'.substr($digits, 1);
        } elseif (str_starts_with($digits, '8')) {
            $digits = '62'.$digits;
        }

        return $digits;
    }
}
