<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailTransaksi;
use App\Models\Pengeluaran;
use App\Models\Produksi;
use App\Models\Transaksi;
use App\Services\LaporanFinansialService;
use App\Services\LaporanPelangganService;
use App\Services\LaporanStokService;
use DateInterval;
use DatePeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    public function __construct(
        private readonly LaporanFinansialService $finansial,
        private readonly LaporanStokService $stok,
        private readonly LaporanPelangganService $pelangganService,
    ) {}

    /**
     * Laporan Keuangan: Laba Rugi, Arus Kas, dan Rekonsiliasi Pembayaran.
     */
    public function keuangan(Request $request): Response
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);

        // Default: bulan berjalan (laporan keuangan biasanya dilihat per bulan).
        $startDate = isset($validated['start_date'])
            ? Carbon::parse($validated['start_date'])->startOfDay()
            : Carbon::today()->startOfMonth();

        $endDate = isset($validated['end_date'])
            ? Carbon::parse($validated['end_date'])->endOfDay()
            : Carbon::today()->endOfDay();

        if ($startDate->gt($endDate)) {
            $startDate = $endDate->copy()->startOfMonth();
        }

        $periodDays = (int) $startDate->diffInDays($endDate) + 1;

        // ---------------------------------------------------------------
        // 1. LABA RUGI (PROFIT & LOSS)
        // ---------------------------------------------------------------
        $summary = $this->finansial->periodSummary($startDate, $endDate);
        $totalRevenue = $summary['revenue'];
        $totalCogs = $summary['cogs'];
        $grossProfit = $summary['gross_profit'];
        $operationalExpenses = $summary['expenses'];
        $netProfit = $summary['net_profit'];
        $margin = $totalRevenue > 0 ? ($netProfit / $totalRevenue) * 100 : 0.0;

        // Pendapatan jasa (fee) dipisah dari penjualan barang. Sisa omzet = penjualan barang.
        $jasaRevenue = (int) DetailTransaksi::whereHas('produk', fn ($q) => $q->where('tipe_jual', 'jasa'))
            ->whereHas('transaksi', fn ($q) => $q->whereBetween('created_at', [$startDate, $endDate]))
            ->sum('subtotal');
        $jasaRevenue = min($jasaRevenue, $totalRevenue);
        $productRevenue = max(0, $totalRevenue - $jasaRevenue);

        // Total diskon yang diberikan (memo — omzet sudah bersih dari diskon).
        $totalDiskon = (int) Transaksi::whereBetween('created_at', [$startDate, $endDate])->sum('diskon');

        // Rincian biaya operasional per kategori (untuk waterfall & tabel laba rugi).
        $expenseBreakdown = $this->finansial->expenseBreakdown($startDate, $endDate);

        $waterfall = $this->finansial->buildWaterfall($totalRevenue, $totalCogs, $grossProfit, $expenseBreakdown, $netProfit);

        // Perbandingan dengan periode setara sebelumnya (durasi sama, tepat sebelum periode aktif).
        $previousEnd = $startDate->copy()->subDay()->endOfDay();
        $previousStart = $previousEnd->copy()->subDays($periodDays - 1)->startOfDay();
        $previous = $this->finansial->periodSummary($previousStart, $previousEnd);

        $comparison = [
            $this->finansial->comparisonCard('Omzet', $totalRevenue, $previous['revenue'], true),
            $this->finansial->comparisonCard('Laba Kotor', $grossProfit, $previous['gross_profit'], true),
            $this->finansial->comparisonCard('Biaya Operasional', $operationalExpenses, $previous['expenses'], false),
            $this->finansial->comparisonCard('Laba Bersih', $netProfit, $previous['net_profit'], true),
        ];

        $monthlyCostWarning = $periodDays < 28 && Pengeluaran::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('tipe', ['gaji', 'sewa', 'pajak'])
            ->exists();

        $insight = $this->finansial->buildInsight(
            $totalRevenue,
            $totalCogs,
            $grossProfit,
            $operationalExpenses,
            $netProfit,
            $margin,
            $expenseBreakdown->first(),
            $previous,
        );

        // Tren omzet harian untuk grafik ringkasan di atas.
        $transactions = Transaksi::whereBetween('created_at', [$startDate, $endDate])
            ->get(['id_transaksi', 'total_harga', 'metode_pembayaran', 'created_at']);
        $dailyRevenue = $transactions->groupBy(fn (Transaksi $trx) => $trx->created_at->format('Y-m-d'));
        $period = new DatePeriod($startDate, new DateInterval('P1D'), $endDate->copy()->addDay());
        $revenueChart = collect(iterator_to_array($period))
            ->map(fn (\DateTimeInterface $date) => [
                'label' => Carbon::parse($date)->format('d M'),
                'value' => (int) $dailyRevenue->get(Carbon::parse($date)->format('Y-m-d'), collect([]))->sum('total_harga'),
            ])
            ->values();

        // ---------------------------------------------------------------
        // 2. ARUS KAS (CASH FLOW) — basis kas dari data yang tercatat.
        // ---------------------------------------------------------------
        // Kas keluar untuk modal barang: biaya batch produksi + pembelian bahan/kemasan.
        $biayaProduksi = (int) Produksi::whereBetween('created_at', [$startDate, $endDate])->sum('total_biaya');
        $belanjaBahan = (int) Pengeluaran::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('tipe', LaporanFinansialService::COGS_EXPENSE_TYPES)
            ->sum('nominal');
        $pembelianProduksi = $biayaProduksi + $belanjaBahan;

        $kasMasuk = $totalRevenue;
        $kasKeluar = $pembelianProduksi + $operationalExpenses;
        $netCash = $kasMasuk - $kasKeluar;

        // Titipan jasa (transfer/tarik): masuk lalu keluar lagi, net nol — hanya memo.
        $jasaPassThrough = (int) DetailTransaksi::whereNotNull('nominal')
            ->whereHas('transaksi', fn ($q) => $q->whereBetween('created_at', [$startDate, $endDate]))
            ->sum('nominal');

        $cashflow = [
            'kas_masuk' => $kasMasuk,
            'pembelian_produksi' => $pembelianProduksi,
            'biaya_produksi' => $biayaProduksi,
            'belanja_bahan' => $belanjaBahan,
            'biaya_operasional' => $operationalExpenses,
            'kas_keluar' => $kasKeluar,
            'net_cash' => $netCash,
            'jasa_pass_through' => $jasaPassThrough,
        ];

        // ---------------------------------------------------------------
        // 3. REKONSILIASI PEMBAYARAN
        // ---------------------------------------------------------------
        $paymentAgg = $transactions
            ->groupBy('metode_pembayaran')
            ->map(fn ($group) => [
                'total' => (int) $group->sum('total_harga'),
                'jumlah' => $group->count(),
            ]);

        $methods = collect(array_keys(LaporanFinansialService::PAYMENT_LABELS))->map(fn (string $metode) => [
            'metode' => $metode,
            'label' => LaporanFinansialService::PAYMENT_LABELS[$metode],
            'total' => (int) ($paymentAgg[$metode]['total'] ?? 0),
            'jumlah' => (int) ($paymentAgg[$metode]['jumlah'] ?? 0),
        ])->values();

        return Inertia::render('admin/laporan/Keuangan', [
            'date_range' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
            'period_days' => $periodDays,
            'pnl' => [
                'product_revenue' => $productRevenue,
                'jasa_revenue' => $jasaRevenue,
                'total_revenue' => $totalRevenue,
                'total_diskon' => $totalDiskon,
                'hpp' => $totalCogs,
                'gross_profit' => $grossProfit,
                'expense_breakdown' => $expenseBreakdown,
                'operational_expenses' => $operationalExpenses,
                'net_profit' => $netProfit,
                'margin' => round($margin, 2),
            ],
            'waterfall' => $waterfall,
            'comparison' => $comparison,
            'insight' => $insight,
            'monthly_cost_warning' => $monthlyCostWarning,
            'revenue_chart' => $revenueChart,
            'cashflow' => $cashflow,
            'reconciliation' => [
                'methods' => $methods,
                'total' => $totalRevenue,
            ],
        ]);
    }

    /**
     * Analisis Penjualan & Performa: waktu sibuk, tren penjualan, dan performa kasir.
     */
    public function penjualan(Request $request): Response
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);

        // Default: bulan berjalan (selaras dengan Laporan Keuangan).
        $startDate = isset($validated['start_date'])
            ? Carbon::parse($validated['start_date'])->startOfDay()
            : Carbon::today()->startOfMonth();

        $endDate = isset($validated['end_date'])
            ? Carbon::parse($validated['end_date'])->endOfDay()
            : Carbon::today()->endOfDay();

        if ($startDate->gt($endDate)) {
            $startDate = $endDate->copy()->startOfMonth();
        }

        $periodDays = (int) $startDate->diffInDays($endDate) + 1;

        // Transaksi periode aktif — sekali ambil, dipakai untuk semua agregasi.
        $transactions = Transaksi::with('user:id,name')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get(['id_transaksi', 'id_user', 'total_harga', 'diskon', 'created_at']);

        $totalRevenue = (int) $transactions->sum('total_harga');
        $totalTransactions = $transactions->count();
        $avgTransaction = $totalTransactions > 0 ? intdiv($totalRevenue, $totalTransactions) : 0;
        $totalDiskon = (int) $transactions->sum('diskon');
        $diskonCount = $transactions->where('diskon', '>', 0)->count();

        $hourly = $this->finansial->hourlyDistribution($transactions);
        $weekday = $this->finansial->weekdayDistribution($transactions);
        $cashiers = $this->finansial->cashierPerformance($transactions);

        // Tren omzet & jumlah transaksi harian (mengikuti filter periode).
        $byDate = $transactions->groupBy(fn (Transaksi $trx) => $trx->created_at->format('Y-m-d'));
        $period = new DatePeriod($startDate, new DateInterval('P1D'), $endDate->copy()->addDay());
        $revenueChart = collect(iterator_to_array($period))
            ->map(function (\DateTimeInterface $date) use ($byDate) {
                $group = $byDate->get(Carbon::parse($date)->format('Y-m-d'));

                return [
                    'label' => Carbon::parse($date)->format('d M'),
                    'value' => $group ? (int) $group->sum('total_harga') : 0,
                    'count' => $group ? $group->count() : 0,
                ];
            })
            ->values();

        // Tren pertumbuhan: periode berjalan (s/d sekarang) vs periode setara sebelumnya.
        // Sengaja tidak terpengaruh filter — indikator kesehatan bisnis "saat ini".
        $now = Carbon::now();
        $weekStart = $now->copy()->startOfWeek();
        $monthStart = $now->copy()->startOfMonth();

        $trend = [
            'this_week' => $this->windowStats($weekStart, $now),
            'last_week' => $this->windowStats($weekStart->copy()->subWeek(), $now->copy()->subWeek()),
            'this_month' => $this->windowStats($monthStart, $now),
            'last_month' => $this->windowStats($monthStart->copy()->subMonthNoOverflow(), $now->copy()->subMonthNoOverflow()),
        ];

        return Inertia::render('admin/laporan/Penjualan', [
            'date_range' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
            'period_days' => $periodDays,
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_transactions' => $totalTransactions,
                'avg_transaction' => $avgTransaction,
                'total_diskon' => $totalDiskon,
                'diskon_count' => $diskonCount,
            ],
            'hourly' => $hourly,
            'weekday' => $weekday,
            'cashiers' => $cashiers,
            'trend' => $trend,
            'revenue_chart' => $revenueChart,
        ]);
    }

    /**
     * Omzet & jumlah transaksi untuk satu jendela waktu (untuk kartu tren WoW/MoM).
     *
     * @return array{revenue: int, count: int}
     */
    private function windowStats(Carbon $start, Carbon $end): array
    {
        return [
            'revenue' => (int) Transaksi::whereBetween('created_at', [$start, $end])->sum('total_harga'),
            'count' => (int) Transaksi::whereBetween('created_at', [$start, $end])->count(),
        ];
    }

    /**
     * Manajemen Stok & Inventaris: Analisis ABC (perputaran stok) — produk
     * dikelompokkan Fast-moving / Slow-moving / Dead-stock berdasarkan periode.
     */
    public function inventaris(Request $request): Response
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);

        // Default: tahun berjalan (kalender) — selaras filter periode seragam.
        $startDate = isset($validated['start_date'])
            ? Carbon::parse($validated['start_date'])->startOfDay()
            : Carbon::today()->startOfYear();

        $endDate = isset($validated['end_date'])
            ? Carbon::parse($validated['end_date'])->endOfDay()
            : Carbon::today()->endOfYear();

        if ($startDate->gt($endDate)) {
            $startDate = $endDate->copy()->startOfYear();
        }

        $analysis = $this->stok->abcAnalysis($startDate, $endDate);

        return Inertia::render('admin/laporan/Inventaris', [
            'date_range' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
            'period_days' => $analysis['period_days'],
            'summary' => $analysis['summary'],
            'totals' => $analysis['totals'],
            'products' => $analysis['products'],
        ]);
    }

    /**
     * Wawasan Pelanggan: pelanggan terloyal, rata-rata keranjang & bundling,
     * serta retensi (pelanggan baru vs lama yang kembali).
     */
    public function pelanggan(Request $request): Response
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);

        // Default: tahun berjalan (kalender) — selaras filter periode seragam.
        $startDate = isset($validated['start_date'])
            ? Carbon::parse($validated['start_date'])->startOfDay()
            : Carbon::today()->startOfYear();

        $endDate = isset($validated['end_date'])
            ? Carbon::parse($validated['end_date'])->endOfDay()
            : Carbon::today()->endOfYear();

        if ($startDate->gt($endDate)) {
            $startDate = $endDate->copy()->startOfYear();
        }

        $insights = $this->pelangganService->insights($startDate, $endDate);

        return Inertia::render('admin/laporan/Pelanggan', [
            'date_range' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
            'period_days' => $insights['period_days'],
            'summary' => $insights['summary'],
            'composition' => $insights['composition'],
            'top_customers' => $insights['top_customers'],
            'retention' => $insights['retention'],
            'bundles' => $insights['bundles'],
        ]);
    }
}
