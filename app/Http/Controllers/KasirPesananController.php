<?php

namespace App\Http\Controllers;

use App\Models\DetailTransaksi;
use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\Transaksi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class KasirPesananController extends Controller
{
    /** Status yang masih bisa diproses/dibatalkan. */
    private const STATUS_AKTIF = ['pending', 'disiapkan'];

    public function index(): Response
    {
        // Pesanan aktif (perlu ditindak), terlama dulu agar antrian adil.
        $aktif = Pesanan::with(['items', 'pelanggan'])
            ->whereIn('status', self::STATUS_AKTIF)
            ->orderBy('created_at')
            ->get()
            ->map(fn (Pesanan $pesanan) => $this->mapPesanan($pesanan));

        // Riwayat ringkas (selesai/batal terbaru) — untuk kirim ulang struk dll.
        $riwayat = Pesanan::with(['items', 'transaksi'])
            ->whereIn('status', ['selesai', 'batal'])
            ->latest('updated_at')
            ->limit(20)
            ->get()
            ->map(fn (Pesanan $pesanan) => $this->mapPesanan($pesanan));

        return Inertia::render('kasir/Pesanan', [
            'pesanans_aktif' => $aktif,
            'pesanans_riwayat' => $riwayat,
        ]);
    }

    /** Tandai pesanan sudah disiapkan (siap diambil). */
    public function siap(Pesanan $pesanan): RedirectResponse
    {
        if ($pesanan->status !== 'pending') {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Pesanan tidak bisa ditandai siap.']);

            return back();
        }

        $pesanan->update([
            'status' => 'disiapkan',
            'disiapkan_at' => now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => "Pesanan {$pesanan->kode} ditandai siap diambil."]);

        return back();
    }

    /**
     * Proses pembayaran pesanan → buat transaksi nyata.
     * Stok TIDAK dikurangi lagi (sudah di-reserve saat pesanan masuk).
     */
    public function proses(Request $request, Pesanan $pesanan): RedirectResponse
    {
        $validated = $request->validate([
            'metode_pembayaran' => ['required', Rule::in(['cash', 'qris', 'transfer'])],
            'bayar' => ['required', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($validated, $pesanan): void {
            $pesanan = Pesanan::with('items')->lockForUpdate()->findOrFail($pesanan->id_pesanan);

            if (! in_array($pesanan->status, self::STATUS_AKTIF, true)) {
                throw ValidationException::withMessages([
                    'status' => 'Pesanan ini sudah diproses atau dibatalkan.',
                ]);
            }

            $total = (int) $pesanan->total;

            if ($validated['bayar'] < $total) {
                throw ValidationException::withMessages([
                    'bayar' => 'Jumlah bayar kurang dari total pesanan.',
                ]);
            }

            $transaksi = Transaksi::create([
                'id_user' => Auth::id(),
                'id_pelanggan' => $pesanan->id_pelanggan,
                'id_promo' => null,
                'total_harga' => $total,
                'diskon' => 0,
                'metode_pembayaran' => $validated['metode_pembayaran'],
                'bayar' => $validated['bayar'],
                'kembalian' => $validated['bayar'] - $total,
            ]);

            foreach ($pesanan->items as $item) {
                $produk = Produk::find($item->id_produk);

                DetailTransaksi::create([
                    'id_transaksi' => $transaksi->id_transaksi,
                    'id_produk' => $item->id_produk,
                    'jumlah' => $item->jumlah,
                    'harga' => $item->harga,
                    'modal' => $produk?->harga_modal ?? 0, // snapshot HPP/unit saat dibayar
                    'subtotal' => $item->subtotal,
                    'nominal' => null,
                ]);

                // Stok sengaja TIDAK disentuh: sudah berkurang saat reserve pesanan.
            }

            $pesanan->update([
                'status' => 'selesai',
                'selesai_at' => now(),
                'id_transaksi' => $transaksi->id_transaksi,
            ]);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => "Pembayaran pesanan {$pesanan->kode} berhasil diproses."]);

        return back();
    }

    /** Batalkan pesanan → kembalikan stok yang sempat di-reserve. */
    public function batal(Pesanan $pesanan): RedirectResponse
    {
        DB::transaction(function () use ($pesanan): void {
            $pesanan = Pesanan::with('items')->lockForUpdate()->findOrFail($pesanan->id_pesanan);

            if (! in_array($pesanan->status, self::STATUS_AKTIF, true)) {
                throw ValidationException::withMessages([
                    'status' => 'Pesanan ini tidak bisa dibatalkan.',
                ]);
            }

            foreach ($pesanan->items as $item) {
                $produk = Produk::lockForUpdate()->find($item->id_produk);

                if (! $produk) {
                    continue;
                }

                // Kembalikan stok yang di-reserve saat pesanan dibuat.
                $produk->terapkanMutasiStok(
                    (float) $item->jumlah,
                    'pesanan_batal',
                    [
                        'keterangan' => 'Batal pesanan '.$pesanan->kode,
                        'ref_tipe' => 'Pesanan',
                        'id_referensi' => $pesanan->id_pesanan,
                        'id_user' => Auth::id(),
                    ]
                );
            }

            $pesanan->update(['status' => 'batal']);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => "Pesanan {$pesanan->kode} dibatalkan, stok dikembalikan."]);

        return back();
    }

    /** Bentuk payload satu pesanan untuk halaman kasir. */
    private function mapPesanan(Pesanan $pesanan): array
    {
        return [
            'id_pesanan' => $pesanan->id_pesanan,
            'kode' => $pesanan->kode,
            'status' => $pesanan->status,
            'nama_pelanggan' => $pesanan->nama_pelanggan,
            'telp' => $pesanan->telp,
            'tipe_pelanggan' => $pesanan->tipe_pelanggan,
            'total' => (int) $pesanan->total,
            'catatan' => $pesanan->catatan,
            'sumber' => $pesanan->sumber,
            'waktu' => Carbon::parse($pesanan->created_at)->translatedFormat('d M Y · H:i'),
            'items' => $pesanan->items->map(fn ($item) => [
                'nama_produk' => $item->nama_produk,
                'jumlah' => (int) $item->jumlah,
                'harga' => (int) $item->harga,
                'subtotal' => (int) $item->subtotal,
            ])->values(),
            'transaksi' => $pesanan->relationLoaded('transaksi') && $pesanan->transaksi
                ? [
                    'kode' => 'TRX-'.$pesanan->transaksi->id_transaksi,
                    'metode_pembayaran' => $pesanan->transaksi->metode_pembayaran,
                    'bayar' => (int) $pesanan->transaksi->bayar,
                    'kembalian' => (int) $pesanan->transaksi->kembalian,
                ]
                : null,
        ];
    }
}
