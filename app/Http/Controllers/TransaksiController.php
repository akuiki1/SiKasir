<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class TransaksiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $transaksis = Transaksi::with(['user', 'detailTransaksis'])
            ->latest()
            ->get()
            ->map(function (Transaksi $transaksi) {
                return [
                    'id_transaksi' => $transaksi->id_transaksi,
                    'kode' => 'TRX-'.$transaksi->id_transaksi,
                    'kasir' => $transaksi->user?->name ?? '-',
                    'jumlah_item' => $transaksi->detailTransaksis->sum('jumlah'),
                    'total_harga' => $transaksi->total_harga,
                    'metode_pembayaran' => $transaksi->metode_pembayaran,
                    'bayar' => $transaksi->bayar,
                    'kembalian' => $transaksi->kembalian,
                    'created_at' => $transaksi->created_at,
                    'waktu' => Carbon::parse($transaksi->created_at)->translatedFormat('H:i \W\I\B'),
                    'tanggal' => Carbon::parse($transaksi->created_at)->translatedFormat('d M Y'),
                ];
            });

        $today = Carbon::today();
        $transaksiHariIni = Transaksi::whereDate('created_at', $today)->get();

        $totalPenjualanHariIni = $transaksiHariIni->sum('total_harga');
        $totalTransaksiSukses = $transaksiHariIni->count();
        $rataRata = $totalTransaksiSukses > 0
            ? (int) ($totalPenjualanHariIni / $totalTransaksiSukses)
            : 0;

        return Inertia::render('admin/Transactions', [
            'transaksis' => $transaksis,
            'stats' => [
                'total_penjualan_hari_ini' => $totalPenjualanHariIni,
                'total_transaksi_sukses' => $totalTransaksiSukses,
                'rata_rata' => $rataRata,
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaksi $transaksi): Response
    {
        $transaksi->load(['user', 'detailTransaksis.produk.kategori']);

        return Inertia::render('admin/Transactions', [
            'transaksi' => $transaksi,
        ]);
    }
}
