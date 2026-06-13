<?php

namespace App\Http\Controllers;

use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\Promo;
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
    public function dashboard(Request $request): Response
    {
        $userId = Auth::id();
        $today = Carbon::today();

        $defaultEnd = $today->toDateString();
        $oldestCreatedAt = Transaksi::where('id_user', $userId)->min('created_at');
        $defaultStart = $oldestCreatedAt ? Carbon::parse($oldestCreatedAt)->toDateString() : $today->toDateString();

        $startDate = $request->query('start_date', $defaultStart);
        $endDate = $request->query('end_date', $defaultEnd);

        $from = Carbon::parse($startDate)->startOfDay();
        $to = Carbon::parse($endDate)->endOfDay();

        if ($from->greaterThan($to)) {
            $to = $from->endOfDay();
        }

        $todaySales = Transaksi::where('id_user', $userId)
            ->whereDate('created_at', $today->toDateString());

        $rangeQuery = Transaksi::where('id_user', $userId);

        if ($request->filled('start_date')) {
            $rangeQuery->where('created_at', '>=', $from);
        }

        if ($request->filled('end_date')) {
            $rangeQuery->where('created_at', '<=', $to);
        }

        $dateRangeLabel = $request->filled('start_date') || $request->filled('end_date')
            ? sprintf('%s sampai %s', $startDate, $endDate)
            : 'Semua Waktu';

        $recentTransactions = Transaksi::where('id_user', $userId)
            ->latest('created_at')
            ->limit(5)
            ->get()
            ->map(fn (Transaksi $transaksi) => [
                'id_transaksi' => $transaksi->id_transaksi,
                'kode' => 'TRX-'.$transaksi->id_transaksi,
                'waktu' => Carbon::parse($transaksi->created_at)->translatedFormat('H:i'),
                'items' => $transaksi->detailTransaksis->sum('jumlah'),
                'total_harga' => $transaksi->total_harga,
                'status' => 'Selesai',
            ]);

        return Inertia::render('kasir/Dashboard', [
            'today_sales' => [
                'total_revenue' => $todaySales->sum('total_harga'),
                'total_transactions' => $todaySales->count(),
            ],
            'range_sales' => [
                'total_revenue' => $rangeQuery->sum('total_harga'),
                'total_transactions' => $rangeQuery->count(),
            ],
            'date_range' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'label' => $dateRangeLabel,
            ],
            'recent_transactions' => $recentTransactions,
        ]);
    }

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
                'foto' => $produk->foto,
                'foto_url' => $produk->foto ? asset("storage/{$produk->foto}") : null,
            ]);

        $now = now();
        $promos = Promo::with('produk')
            ->where('aktif', true)
            ->where('tanggal_mulai', '<=', $now)
            ->where('tanggal_selesai', '>=', $now)
            ->get()
            ->map(fn (Promo $promo) => [
                'id_promo' => $promo->id_promo,
                'nama' => $promo->nama,
                'deskripsi' => $promo->deskripsi,
                'tipe' => $promo->tipe,
                'nilai' => (float) $promo->nilai,
                'id_produk' => $promo->id_produk,
                'minimal_belanja' => $promo->minimal_belanja ? (float) $promo->minimal_belanja : null,
            ]);

        return Inertia::render('kasir/Transaksi', [
            'produks' => $produks,
            'promos' => $promos,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'metode_pembayaran' => ['required', Rule::in(['cash', 'qris', 'transfer'])],
            'bayar' => ['required', 'integer', 'min:0'],
            'id_promo' => ['nullable', 'exists:promos,id_promo'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id_produk' => ['required', 'exists:produks,id_produk'],
            'items.*.jumlah' => ['required', 'integer', 'min:1'],
        ]);

        DB::transaction(function () use ($validated): void {
            $subtotal = 0;
            $details = [];
            $now = now();

            $activePromos = Promo::where('aktif', true)
                ->where('tanggal_mulai', '<=', $now)
                ->where('tanggal_selesai', '>=', $now)
                ->get();

            foreach ($validated['items'] as $item) {
                $produk = Produk::lockForUpdate()->findOrFail($item['id_produk']);

                if ($produk->stok < $item['jumlah']) {
                    throw ValidationException::withMessages([
                        'items' => "Stok {$produk->nama} tidak mencukupi (tersedia: {$produk->stok}).",
                    ]);
                }

                $harga = $produk->harga_jual;
                $itemSubtotal = $harga * $item['jumlah'];
                $subtotal += $itemSubtotal;

                // Cari promo spesifik produk
                $prodPromo = $activePromos->where('id_produk', $produk->id_produk)->first();
                $itemDiskon = 0;
                if ($prodPromo) {
                    if ($prodPromo->tipe === 'persen') {
                        $itemDiskon = (int) ($itemSubtotal * ($prodPromo->nilai / 100));
                    } else {
                        $itemDiskon = (int) ($prodPromo->nilai * $item['jumlah']);
                    }
                }

                $details[] = [
                    'produk' => $produk,
                    'jumlah' => $item['jumlah'],
                    'harga' => $harga,
                    'subtotal_after_promo' => max(0, $itemSubtotal - $itemDiskon),
                    'item_diskon' => $itemDiskon,
                ];
            }

            $globalDiskon = 0;
            $appliedPromoId = null;

            if (! empty($validated['id_promo'])) {
                $globalPromo = Promo::where('id_promo', $validated['id_promo'])
                    ->where('aktif', true)
                    ->whereNull('id_produk')
                    ->where('tanggal_mulai', '<=', $now)
                    ->where('tanggal_selesai', '>=', $now)
                    ->first();

                if ($globalPromo) {
                    if (! $globalPromo->minimal_belanja || $subtotal >= $globalPromo->minimal_belanja) {
                        $appliedPromoId = $globalPromo->id_promo;
                        if ($globalPromo->tipe === 'persen') {
                            $globalDiskon = (int) ($subtotal * ($globalPromo->nilai / 100));
                        } else {
                            $globalDiskon = (int) $globalPromo->nilai;
                        }
                    }
                }
            }

            $totalDiskon = $globalDiskon + collect($details)->sum('item_diskon');
            $totalHarga = max(0, $subtotal - $totalDiskon);

            if ($validated['bayar'] < $totalHarga) {
                throw ValidationException::withMessages([
                    'bayar' => 'Jumlah bayar kurang dari total harga.',
                ]);
            }

            $transaksi = Transaksi::create([
                'id_user' => Auth::id(),
                'id_promo' => $appliedPromoId,
                'total_harga' => $totalHarga,
                'diskon' => $totalDiskon,
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
                    'subtotal' => $detail['subtotal_after_promo'],
                ]);

                $detail['produk']->decrement('stok', $detail['jumlah']);
            }
        });

        return redirect()->route('kasir.riwayat')->with('success', 'Transaksi berhasil disimpan.');
    }

    public function riwayat(Request $request): Response
    {
        $query = Transaksi::with(['detailTransaksis.produk', 'promo'])
            ->where('id_user', Auth::id());

        if ($request->filled('start_date')) {
            $query->where('created_at', '>=', Carbon::parse($request->query('start_date'))->startOfDay());
        }

        if ($request->filled('end_date')) {
            $query->where('created_at', '<=', Carbon::parse($request->query('end_date'))->endOfDay());
        }

        $transaksis = $query
            ->latest()
            ->get()
            ->map(fn (Transaksi $transaksi) => [
                'id_transaksi' => $transaksi->id_transaksi,
                'kode' => 'TRX-'.$transaksi->id_transaksi,
                'jumlah_item' => $transaksi->detailTransaksis->sum('jumlah'),
                'total_harga' => $transaksi->total_harga,
                'diskon' => $transaksi->diskon,
                'promo_nama' => $transaksi->promo?->nama,
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
                    'foto' => $detail->produk?->foto ?? null,
                    'foto_url' => $detail->produk?->foto ? asset('storage/'.$detail->produk->foto) : null,
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
            'filters' => [
                'start_date' => $request->query('start_date', ''),
                'end_date' => $request->query('end_date', ''),
            ],
        ]);
    }
}
