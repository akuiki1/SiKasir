<?php

namespace App\Http\Controllers;

use App\Models\DetailTransaksi;
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

class KasirController extends Controller
{
    public function transaksi(): Response
    {
        $produks = Produk::query()
            ->orderBy('nama')
            ->get()
            ->map(fn (Produk $produk) => [
                'id_produk' => $produk->id_produk,
                'nama' => $produk->nama,
                'kategori' => $produk->kategori?->nama_kategori,
                'harga_jual' => $produk->harga_jual,
                'stok' => $produk->stok,
                'barcode' => $produk->barcode,
            ]);

        return Inertia::render('kasir/Transaksi', [
            'produks' => $produks,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'metode_pembayaran' => ['required', Rule::in(['cash', 'qris', 'transfer'])],
            'bayar' => ['required', 'integer', 'min:0'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id_produk' => ['required', 'exists:produks,id_produk'],
            'items.*.jumlah' => ['required', 'integer', 'min:1'],
        ]);

        DB::transaction(function () use ($validated): void {
            $totalHarga = 0;
            $details = [];

            foreach ($validated['items'] as $item) {
                $produk = Produk::lockForUpdate()->findOrFail($item['id_produk']);

                if ($produk->stok < $item['jumlah']) {
                    throw ValidationException::withMessages([
                        'items' => "Stok {$produk->nama} tidak mencukupi (tersedia: {$produk->stok}).",
                    ]);
                }

                $harga = $produk->harga_jual;
                $subtotal = $harga * $item['jumlah'];
                $totalHarga += $subtotal;

                $details[] = [
                    'produk' => $produk,
                    'jumlah' => $item['jumlah'],
                    'harga' => $harga,
                    'subtotal' => $subtotal,
                ];
            }

            if ($validated['bayar'] < $totalHarga) {
                throw ValidationException::withMessages([
                    'bayar' => 'Jumlah bayar kurang dari total harga.',
                ]);
            }

            $transaksi = Transaksi::create([
                'id_user' => Auth::id(),
                'total_harga' => $totalHarga,
                'metode_pembayaran' => $validated['metode_pembayaran'],
                'bayar' => $validated['bayar'],
                'kembalian' => $validated['bayar'] - $totalHarga,
            ]);

            foreach ($details as $detail) {
                DetailTransaksi::create([
                    'id_transaksi' => $transaksi->id_transaksi,
                    'id_produk' => $detail['produk']->id_produk,
                    'jumlah' => $detail['jumlah'],
                    'harga' => $detail['harga'],
                    'subtotal' => $detail['subtotal'],
                ]);

                $detail['produk']->decrement('stok', $detail['jumlah']);
            }
        });

        return redirect()->route('kasir.riwayat')->with('success', 'Transaksi berhasil disimpan.');
    }

    public function riwayat(): Response
    {
        $transaksis = Transaksi::with(['detailTransaksis.produk'])
            ->where('id_user', Auth::id())
            ->latest()
            ->get()
            ->map(fn (Transaksi $transaksi) => [
                'id_transaksi' => $transaksi->id_transaksi,
                'kode' => 'TRX-'.$transaksi->id_transaksi,
                'jumlah_item' => $transaksi->detailTransaksis->sum('jumlah'),
                'total_harga' => $transaksi->total_harga,
                'metode_pembayaran' => $transaksi->metode_pembayaran,
                'bayar' => $transaksi->bayar,
                'kembalian' => $transaksi->kembalian,
                'created_at' => $transaksi->created_at,
                'waktu' => Carbon::parse($transaksi->created_at)->translatedFormat('H:i \W\I\B'),
                'tanggal' => Carbon::parse($transaksi->created_at)->translatedFormat('d M Y'),
                'details' => $transaksi->detailTransaksis->map(fn ($detail) => [
                    'nama_produk' => $detail->produk?->nama ?? '- ',
                    'jumlah' => $detail->jumlah,
                    'harga' => $detail->harga,
                    'subtotal' => $detail->subtotal,
                ])->values(),
            ]);

        $totalPenjualan = $transaksis->sum('total_harga');
        $totalTransaksi = $transaksis->count();

        return Inertia::render('kasir/Riwayat', [
            'transaksis' => $transaksis,
            'stats' => [
                'total_penjualan' => $totalPenjualan,
                'total_transaksi' => $totalTransaksi,
                'total_struk' => $totalTransaksi,
            ],
        ]);
    }
}
