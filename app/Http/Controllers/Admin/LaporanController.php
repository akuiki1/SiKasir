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
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
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

        // Tren omzet untuk grafik di bawah — granularity adaptif sesuai rentang.
        $transactions = Transaksi::whereBetween('created_at', [$startDate, $endDate])
            ->get(['id_transaksi', 'total_harga', 'metode_pembayaran', 'created_at']);
        $revenueChart = $this->buildRevenueChart($transactions, $startDate, $endDate);

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
        // 3. RINGKASAN "CERITA" — status kesehatan, verdict, insight, top produk
        //    & kategori untuk laporan cetak (lebih mudah dibaca pemilik toko).
        // ---------------------------------------------------------------
        $previous2End = $previousStart->copy()->subDay()->endOfDay();
        $previous2Start = $previous2End->copy()->subDays($periodDays - 1)->startOfDay();
        $previous2 = $this->finansial->periodSummary($previous2Start, $previous2End);
        $prevMargin = $previous['revenue'] > 0 ? ($previous['net_profit'] / $previous['revenue']) * 100 : 0.0;
        $prev2Margin = $previous2['revenue'] > 0 ? ($previous2['net_profit'] / $previous2['revenue']) * 100 : 0.0;
        $previousTransactionCount = (int) Transaksi::whereBetween('created_at', [$previousStart, $previousEnd])->count();

        $previousExpenseBreakdown = $this->finansial->expenseBreakdown($previousStart, $previousEnd);
        $expenseBreakdownWithDelta = $this->finansial->expenseDeltas($expenseBreakdown, $previousExpenseBreakdown);

        $status = $this->finansial->healthStatus($netProfit, $margin);

        // Top 5 produk penyumbang omzet terbesar (nama + kategori, withTrashed via relasi produk()).
        $topProducts = DetailTransaksi::whereHas('transaksi', fn ($q) => $q->whereBetween('created_at', [$startDate, $endDate]))
            ->selectRaw('id_produk, SUM(subtotal) as omzet')
            ->groupBy('id_produk')
            ->orderByDesc('omzet')
            ->take(5)
            ->with('produk.kategori')
            ->get()
            ->map(fn ($row) => [
                'name' => $row->produk->nama,
                'kategori' => $row->produk->kategori->nama_kategori,
                'revenue' => (int) $row->omzet,
            ])
            ->values();

        // Omzet per kategori — top 4 + sisanya digabung "Lainnya" agar totalnya tetap 100%.
        $categoryTotals = DetailTransaksi::query()
            ->join('produks', 'detail_transaksis.id_produk', '=', 'produks.id_produk')
            ->leftJoin('kategoris', 'produks.id_kategori', '=', 'kategoris.id_kategori')
            ->join('transaksis', 'detail_transaksis.id_transaksi', '=', 'transaksis.id_transaksi')
            ->whereBetween('transaksis.created_at', [$startDate, $endDate])
            ->selectRaw("COALESCE(kategoris.nama_kategori, 'Kategori Terhapus') as nama_kategori, SUM(detail_transaksis.subtotal) as omzet")
            ->groupBy('nama_kategori')
            ->orderByDesc('omzet')
            ->get();

        $topCategoriesLimit = 4;
        $topCategories = $categoryTotals->take($topCategoriesLimit)->map(fn ($row) => [
            'name' => $row->nama_kategori,
            'revenue' => (int) $row->omzet,
        ])->values();

        if ($categoryTotals->count() > $topCategoriesLimit) {
            $topCategories->push([
                'name' => 'Lainnya',
                'revenue' => (int) $categoryTotals->slice($topCategoriesLimit)->sum('omzet'),
            ]);
        }

        $revenueDeltaPct = $previous['revenue'] > 0 ? (($totalRevenue - $previous['revenue']) / $previous['revenue']) * 100 : 0.0;

        $verdict = $this->finansial->buildVerdict($status, $netProfit, $previous['net_profit'], $revenueDeltaPct, $margin, $netCash);

        $storyInsights = $this->finansial->buildStoryInsights(
            $totalRevenue,
            $previous['revenue'],
            $netProfit,
            $netCash,
            $expenseBreakdownWithDelta,
            $margin,
            $prevMargin,
            $prev2Margin,
            $topCategories->first(),
        );

        // ---------------------------------------------------------------
        // 4. REKONSILIASI PEMBAYARAN
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
                'expense_breakdown' => $expenseBreakdownWithDelta,
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
            'story' => [
                'status' => $status,
                'verdict' => $verdict,
                'insights' => $storyInsights,
                'transaksi_count' => $transactions->count(),
                'top_products' => $topProducts,
                'top_categories' => $topCategories,
                'previous_period' => [
                    'start_date' => $previousStart->toDateString(),
                    'end_date' => $previousEnd->toDateString(),
                    'revenue' => $previous['revenue'],
                    'net_profit' => $previous['net_profit'],
                    'margin' => round($prevMargin, 2),
                    'opex' => $previous['expenses'],
                    'transaksi_count' => $previousTransactionCount,
                ],
                'previous2_period' => [
                    'start_date' => $previous2Start->toDateString(),
                    'end_date' => $previous2End->toDateString(),
                    'margin' => round($prev2Margin, 2),
                ],
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

        // Tren omzet & jumlah transaksi — granularity adaptif mengikuti rentang.
        $revenueChart = $this->buildRevenueChart($transactions, $startDate, $endDate);

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
     * Bangun data tren omzet dengan granularity adaptif agar jumlah titik tetap
     * terbaca: harian (≤62 hari), mingguan (≤182 hari), atau bulanan (>182 hari).
     * Setiap titik tetap berisi omzet + jumlah transaksi pada bucket-nya.
     *
     * @param  Collection<int, Transaksi>  $transactions
     * @return array{granularity: string, points: array<int, array{label: string, value: int, count: int}>}
     */
    private function buildRevenueChart(Collection $transactions, Carbon $startDate, Carbon $endDate): array
    {
        $periodDays = (int) $startDate->diffInDays($endDate) + 1;

        if ($periodDays <= 62) {
            $granularity = 'daily';
            $interval = new DateInterval('P1D');
            $cursor = $startDate->copy()->startOfDay();
            $bucketStart = fn (Carbon $d) => $d->copy()->startOfDay();
            $keyFormat = 'Y-m-d';
            $labelFor = fn (Carbon $d) => $d->format('d M');
        } elseif ($periodDays <= 182) {
            $granularity = 'weekly';
            $interval = new DateInterval('P1W');
            $cursor = $startDate->copy()->startOfWeek();
            $bucketStart = fn (Carbon $d) => $d->copy()->startOfWeek();
            $keyFormat = 'Y-m-d';
            $labelFor = fn (Carbon $d) => $d->format('d M');
        } else {
            $granularity = 'monthly';
            $interval = new DateInterval('P1M');
            $cursor = $startDate->copy()->startOfMonth();
            $bucketStart = fn (Carbon $d) => $d->copy()->startOfMonth();
            $keyFormat = 'Y-m';
            $labelFor = fn (Carbon $d) => $d->format('M Y');
        }

        $grouped = $transactions->groupBy(
            fn (Transaksi $trx) => $bucketStart(Carbon::parse($trx->created_at))->format($keyFormat),
        );

        $points = [];
        while ($cursor <= $endDate) {
            $group = $grouped->get($cursor->format($keyFormat));
            $points[] = [
                'label' => $labelFor($cursor),
                'value' => $group ? (int) $group->sum('total_harga') : 0,
                'count' => $group ? $group->count() : 0,
            ];
            $cursor = $cursor->add($interval);
        }

        return ['granularity' => $granularity, 'points' => $points];
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
