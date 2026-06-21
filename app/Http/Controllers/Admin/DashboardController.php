<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailTransaksi;
use App\Models\Pengeluaran;
use App\Models\Produk;
use App\Models\Promo;
use App\Models\Transaksi;
use App\Services\LaporanFinansialService;
use DateInterval;
use DatePeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private readonly LaporanFinansialService $finansial) {}

    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);

        $startDate = isset($validated['start_date'])
            ? Carbon::parse($validated['start_date'])->startOfDay()
            : Carbon::today()->startOfDay();

        $endDate = isset($validated['end_date'])
            ? Carbon::parse($validated['end_date'])->endOfDay()
            : Carbon::today()->endOfDay();

        if ($startDate->gt($endDate)) {
            $startDate = $endDate->copy()->subDays(29)->startOfDay();
        }

        $periodDays = $startDate->diffInDays($endDate) + 1;

        $transactions = Transaksi::with(['user', 'detailTransaksis.produk'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $dailyGroups = $transactions->groupBy(fn (Transaksi $trx) => $trx->created_at->format('Y-m-d'));

        $period = new DatePeriod($startDate, new DateInterval('P1D'), $endDate->copy()->addDay());

        $revenueChart = collect(iterator_to_array($period))
            ->map(fn (\DateTimeInterface $date) => [
                'label' => Carbon::parse($date)->format('d M'),
                'value' => $dailyGroups->get(Carbon::parse($date)->format('Y-m-d'), collect([]))->sum('total_harga'),
            ])
            ->values();

        $salesTrend = collect(iterator_to_array($period))
            ->map(fn (\DateTimeInterface $date) => [
                'label' => Carbon::parse($date)->format('d M'),
                'value' => $dailyGroups->get(Carbon::parse($date)->format('Y-m-d'), collect([]))->count(),
            ])
            ->values();

        // Performa penjualan per produk (jasa dikecualikan; omzet sudah bersih diskon global).
        $productPerformance = $this->finansial->productPerformance($transactions);

        $bestSellingProducts = $productPerformance
            ->sortByDesc(fn ($item) => $item['qty'])
            ->values()
            ->take(5);

        $bestProfitProducts = $productPerformance
            ->sortByDesc(fn ($item) => $item['profit'])
            ->values()
            ->take(5);

        // Produk paling sedikit laku pada periode — sertakan produk berstok yang 0 terjual
        // (jasa dikecualikan) agar "paling tidak laku" tidak menyesatkan dengan hanya
        // memperhitungkan produk yang kebetulan pernah terjual.
        $soldById = $productPerformance->keyBy('id_produk');
        $worstSellingProducts = Produk::where('tipe_jual', '!=', 'jasa')
            ->get(['id_produk', 'nama'])
            ->map(fn (Produk $produk) => $soldById->get($produk->id_produk) ?? [
                'id_produk' => $produk->id_produk,
                'nama' => $produk->nama,
                'qty' => 0.0,
                'revenue' => 0,
                'cogs' => 0,
                'profit' => 0,
                'transactions' => 0,
            ])
            ->sortBy([['qty', 'asc'], ['nama', 'asc']])
            ->values()
            ->take(5);

        $topSalesDates = $dailyGroups
            ->map(fn ($group, $date) => [
                'label' => Carbon::parse($date)->format('d M Y'),
                'value' => $group->count(),
            ])
            ->sortByDesc(fn ($item) => $item['value'])
            ->values()
            ->take(5);

        $topSalesHours = $transactions
            ->groupBy(fn (Transaksi $trx) => $trx->created_at->format('H:00'))
            ->map(fn ($group, $hour) => [
                'label' => $hour,
                'value' => $group->count(),
            ])
            ->sortByDesc(fn ($item) => $item['value'])
            ->values()
            ->take(8);

        $cashierGroups = $transactions
            ->groupBy(fn (Transaksi $trx) => $trx->user?->name ?? 'User Terhapus')
            ->map(fn ($group, $name) => [
                'nama' => $name,
                'transactions' => $group->count(),
                'revenue' => $group->sum('total_harga'),
            ])
            ->values();

        $topCashiersByTransactions = $cashierGroups
            ->sortByDesc(fn ($item) => $item['transactions'])
            ->values()
            ->take(5);

        $topCashiersByRevenue = $cashierGroups
            ->sortByDesc(fn ($item) => $item['revenue'])
            ->values()
            ->take(5);

        $cashierAchievements = $cashierGroups
            ->sortByDesc(fn ($item) => $item['transactions'])
            ->values()
            ->take(8);

        $totalRevenue = (int) $transactions->sum('total_harga');
        $totalTransactions = $transactions->count();
        $totalItemsSold = $transactions->sum(fn (Transaksi $trx) => $trx->detailTransaksis->sum('jumlah'));
        $averageOrderValue = $totalTransactions > 0 ? (int) floor($totalRevenue / $totalTransactions) : 0;

        // Harga Pokok Penjualan (HPP/COGS) dari snapshot modal per item terjual (SUM di DB).
        $totalCogs = $this->finansial->cogs($startDate, $endDate);
        $grossProfit = $totalRevenue - $totalCogs;

        // Biaya operasional saja. Tipe 'bahan_baku' & 'kemasan' dikecualikan karena modal
        // produk buatan sendiri sudah dihitung lewat batch produksi (mencegah double-count).
        $operationalExpenses = $this->finansial->operationalExpenses($startDate, $endDate);

        $netProfit = $grossProfit - $operationalExpenses;
        $salesMargin = $totalRevenue > 0 ? ($netProfit / $totalRevenue) * 100 : 0;

        // Rincian biaya operasional per kategori (untuk batang waterfall & kesimpulan).
        $expenseBreakdown = $this->finansial->expenseBreakdown($startDate, $endDate);

        // Rantai laba untuk grafik waterfall: Omzet → −HPP → Laba Kotor → −biaya per kategori → Laba Bersih.
        $waterfall = $this->finansial->buildWaterfall($totalRevenue, $totalCogs, $grossProfit, $expenseBreakdown, $netProfit);

        // Perbandingan dengan periode setara sebelumnya (durasi sama persis, tepat sebelum periode aktif).
        $previousEnd = $startDate->copy()->subDay()->endOfDay();
        $previousStart = $previousEnd->copy()->subDays($periodDays - 1)->startOfDay();
        $previous = $this->finansial->periodSummary($previousStart, $previousEnd);

        $comparison = [
            $this->finansial->comparisonCard('Omzet', $totalRevenue, $previous['revenue'], true),
            $this->finansial->comparisonCard('Laba Kotor', $grossProfit, $previous['gross_profit'], true),
            $this->finansial->comparisonCard('Biaya Operasional', $operationalExpenses, $previous['expenses'], false),
            $this->finansial->comparisonCard('Laba Bersih', $netProfit, $previous['net_profit'], true),
        ];

        // Peringatan "rugi semu": rentang pendek tapi memuat biaya yang biasanya dicatat bulanan.
        $monthlyCostWarning = $periodDays < 28 && Pengeluaran::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('tipe', ['gaji', 'sewa', 'pajak'])
            ->exists();

        // Kesimpulan otomatis: di titik mana laba bocor + apa yang berubah dari periode sebelumnya.
        $insight = $this->finansial->buildInsight(
            $totalRevenue,
            $totalCogs,
            $grossProfit,
            $operationalExpenses,
            $netProfit,
            $salesMargin,
            $expenseBreakdown->first(),
            $previous,
        );

        // --- Produk jarang laku (slow-mover) + saran promo ---
        // Jendela tetap 30 hari terakhir agar bermakna, terlepas dari filter periode di atas.
        $slowDays = 30;
        $slowStart = Carbon::today()->subDays($slowDays - 1)->startOfDay();
        $slowEnd = Carbon::today()->endOfDay();

        $soldQtyWindow = DetailTransaksi::whereNotNull('id_produk')
            ->whereHas('transaksi', function ($query) use ($slowStart, $slowEnd): void {
                $query->whereBetween('created_at', [$slowStart, $slowEnd]);
            })
            ->selectRaw('id_produk, SUM(jumlah) as qty')
            ->groupBy('id_produk')
            ->pluck('qty', 'id_produk');

        $now = now();
        $activePromoProdukIds = Promo::where('aktif', true)
            ->whereNotNull('id_produk')
            ->where('tanggal_mulai', '<=', $now)
            ->where('tanggal_selesai', '>=', $now)
            ->pluck('id_produk')
            ->all();

        // Hanya produk berstok & bukan jasa; sertakan yang 0 terjual. Urut paling sedikit laku.
        $slowMovers = Produk::query()
            ->where('tipe_jual', '!=', 'jasa')
            ->where('stok', '>', 0)
            ->get()
            ->map(fn (Produk $produk) => [
                'id_produk' => $produk->id_produk,
                'nama' => $produk->nama,
                'stok' => (float) $produk->stok,
                'satuan' => $produk->satuan,
                'harga_jual' => $produk->harga_jual,
                'terjual' => (float) ($soldQtyWindow[$produk->id_produk] ?? 0),
                'sudah_promo' => in_array($produk->id_produk, $activePromoProdukIds, true),
                'foto_url' => $produk->foto ? asset("storage/{$produk->foto}") : null,
            ])
            ->sortBy([['terjual', 'asc'], ['nama', 'asc']])
            ->values()
            ->take(8);

        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'total_revenue' => $totalRevenue,
                'total_transactions' => $totalTransactions,
                'average_order_value' => $averageOrderValue,
                'total_items_sold' => $totalItemsSold,
                'total_cogs' => $totalCogs,
                'gross_profit' => $grossProfit,
                'total_expenses' => $operationalExpenses,
                'sales_margin' => $salesMargin,
                'net_profit' => $netProfit,
            ],
            'revenue_chart' => $revenueChart,
            'sales_trend' => $salesTrend,
            'best_selling_products' => $bestSellingProducts,
            'worst_selling_products' => $worstSellingProducts,
            'slow_movers' => $slowMovers,
            'slow_mover_days' => $slowDays,
            'best_profit_products' => $bestProfitProducts,
            'top_sales_dates' => $topSalesDates,
            'top_sales_hours' => $topSalesHours,
            'cashier_achievements' => $cashierAchievements,
            'top_cashiers_by_transactions' => $topCashiersByTransactions,
            'top_cashiers_by_revenue' => $topCashiersByRevenue,
            'waterfall' => $waterfall,
            'comparison' => $comparison,
            'insight' => $insight,
            'monthly_cost_warning' => $monthlyCostWarning,
            'period_days' => $periodDays,
            'date_range' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
        ]);
    }
}
