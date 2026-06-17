<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailTransaksi;
use App\Models\Pengeluaran;
use App\Models\Produk;
use App\Models\Promo;
use App\Models\Transaksi;
use DateInterval;
use DatePeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    private const EXPENSE_LABELS = [
        'operasional' => 'Operasional',
        'transportasi' => 'Transportasi',
        'gaji' => 'Gaji',
        'peralatan' => 'Peralatan',
        'sewa' => 'Sewa',
        'listrik_air' => 'Listrik & Air',
        'promosi' => 'Promosi',
        'pajak' => 'Pajak',
        'lainnya' => 'Lainnya',
    ];

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

        $details = DetailTransaksi::with('produk')
            ->whereHas('transaksi', function ($query) use ($startDate, $endDate): void {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->get();

        $productGroups = $details
            ->groupBy(fn (DetailTransaksi $detail) => $detail->produk?->nama ?? 'Produk Terhapus')
            ->map(fn ($group, $name) => [
                'nama' => $name,
                'qty' => $group->sum('jumlah'),
                'revenue' => $group->sum('subtotal'),
                'cogs' => $group->sum(fn (DetailTransaksi $detail) => $detail->modal * $detail->jumlah),
                'profit' => $group->sum(fn (DetailTransaksi $detail) => $detail->subtotal - ($detail->modal * $detail->jumlah)),
                'transactions' => $group->pluck('id_transaksi')->unique()->count(),
            ]);

        $bestSellingProducts = $productGroups
            ->sortByDesc(fn ($item) => $item['qty'])
            ->values()
            ->take(5);

        $worstSellingProducts = $productGroups
            ->sortBy(fn ($item) => $item['qty'])
            ->values()
            ->take(5);

        $bestProfitProducts = $productGroups
            ->sortByDesc(fn ($item) => $item['profit'])
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

        $totalRevenue = $transactions->sum('total_harga');
        $totalTransactions = $transactions->count();
        $totalItemsSold = $details->sum('jumlah');
        $averageOrderValue = $totalTransactions > 0 ? (int) floor($totalRevenue / $totalTransactions) : 0;

        // Harga Pokok Penjualan (HPP/COGS) dari snapshot modal per item terjual.
        $totalCogs = $details->sum(fn (DetailTransaksi $detail) => $detail->modal * $detail->jumlah);
        $grossProfit = $totalRevenue - $totalCogs;

        // Biaya operasional saja. Tipe 'bahan_baku' & 'kemasan' dikecualikan karena modal
        // produk buatan sendiri sudah dihitung lewat batch produksi (mencegah double-count).
        $operationalExpenses = Pengeluaran::whereBetween('created_at', [$startDate, $endDate])
            ->whereNotIn('tipe', ['bahan_baku', 'kemasan'])
            ->sum('nominal');

        $netProfit = $grossProfit - $operationalExpenses;
        $salesMargin = $totalRevenue > 0 ? ($netProfit / $totalRevenue) * 100 : 0;

        // Rincian biaya operasional per kategori (untuk batang waterfall & kesimpulan).
        $expenseBreakdown = Pengeluaran::whereBetween('created_at', [$startDate, $endDate])
            ->whereNotIn('tipe', ['bahan_baku', 'kemasan'])
            ->selectRaw('tipe, SUM(nominal) as total')
            ->groupBy('tipe')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row) => [
                'tipe' => $row->tipe,
                'label' => self::EXPENSE_LABELS[$row->tipe] ?? ucfirst($row->tipe),
                'nominal' => (int) $row->total,
            ])
            ->values();

        // Rantai laba untuk grafik waterfall: Omzet → −HPP → Laba Kotor → −biaya per kategori → Laba Bersih.
        $waterfall = [];
        $waterfall[] = ['label' => 'Omzet', 'type' => 'income', 'amount' => $totalRevenue, 'start' => 0, 'end' => $totalRevenue];
        $running = $totalRevenue;
        $waterfall[] = ['label' => 'HPP', 'type' => 'deduction', 'amount' => -$totalCogs, 'start' => $running, 'end' => $running - $totalCogs];
        $running -= $totalCogs;
        $waterfall[] = ['label' => 'Laba Kotor', 'type' => 'subtotal', 'amount' => $grossProfit, 'start' => 0, 'end' => $grossProfit];
        foreach ($expenseBreakdown as $expense) {
            $waterfall[] = [
                'label' => $expense['label'],
                'type' => 'deduction',
                'amount' => -$expense['nominal'],
                'start' => $running,
                'end' => $running - $expense['nominal'],
            ];
            $running -= $expense['nominal'];
        }
        $waterfall[] = ['label' => 'Laba Bersih', 'type' => 'result', 'amount' => $netProfit, 'start' => 0, 'end' => $netProfit];

        // Perbandingan dengan periode setara sebelumnya (durasi sama persis, tepat sebelum periode aktif).
        $previousEnd = $startDate->copy()->subDay()->endOfDay();
        $previousStart = $previousEnd->copy()->subDays($periodDays - 1)->startOfDay();
        $previous = $this->periodSummary($previousStart, $previousEnd);

        $comparison = [
            $this->comparisonCard('Omzet', $totalRevenue, $previous['revenue'], true),
            $this->comparisonCard('Laba Kotor', $grossProfit, $previous['gross_profit'], true),
            $this->comparisonCard('Biaya Operasional', $operationalExpenses, $previous['expenses'], false),
            $this->comparisonCard('Laba Bersih', $netProfit, $previous['net_profit'], true),
        ];

        // Peringatan "rugi semu": rentang pendek tapi memuat biaya yang biasanya dicatat bulanan.
        $monthlyCostWarning = $periodDays < 28 && Pengeluaran::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('tipe', ['gaji', 'sewa', 'pajak'])
            ->exists();

        // Kesimpulan otomatis: di titik mana laba bocor + apa yang berubah dari periode sebelumnya.
        $insight = $this->buildInsight(
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

    /**
     * Ringkasan finansial inti (omzet, HPP, laba) untuk satu rentang tanggal.
     * Dipakai untuk menghitung periode pembanding.
     *
     * @return array{revenue: int, cogs: int, gross_profit: int, expenses: int, net_profit: int}
     */
    private function periodSummary(Carbon $start, Carbon $end): array
    {
        $revenue = (int) Transaksi::whereBetween('created_at', [$start, $end])->sum('total_harga');

        $cogs = (int) DetailTransaksi::whereHas('transaksi', function ($query) use ($start, $end): void {
            $query->whereBetween('created_at', [$start, $end]);
        })
            ->get(['modal', 'jumlah'])
            ->sum(fn (DetailTransaksi $detail) => $detail->modal * $detail->jumlah);

        $expenses = (int) Pengeluaran::whereBetween('created_at', [$start, $end])
            ->whereNotIn('tipe', ['bahan_baku', 'kemasan'])
            ->sum('nominal');

        $grossProfit = $revenue - $cogs;

        return [
            'revenue' => $revenue,
            'cogs' => $cogs,
            'gross_profit' => $grossProfit,
            'expenses' => $expenses,
            'net_profit' => $grossProfit - $expenses,
        ];
    }

    /**
     * @return array{label: string, current: int, previous: int, delta_pct: float|null, higher_is_better: bool}
     */
    private function comparisonCard(string $label, int $current, int $previous, bool $higherIsBetter): array
    {
        return [
            'label' => $label,
            'current' => $current,
            'previous' => $previous,
            'delta_pct' => $previous !== 0 ? (($current - $previous) / abs($previous)) * 100 : null,
            'higher_is_better' => $higherIsBetter,
        ];
    }

    private function rupiah(int $value): string
    {
        return ($value < 0 ? '−' : '').'Rp'.number_format(abs($value), 0, ',', '.');
    }

    /**
     * @param  array{label: string, nominal: int}|null  $topExpense
     * @param  array{revenue: int, cogs: int, gross_profit: int, expenses: int, net_profit: int}  $previous
     * @return array{tone: string, message: string}
     */
    private function buildInsight(int $revenue, int $cogs, int $grossProfit, int $expenses, int $netProfit, float $margin, ?array $topExpense, array $previous): array
    {
        if ($netProfit >= 0) {
            $tone = 'success';
            $message = 'Bisnis untung '.$this->rupiah($netProfit).' (margin '.number_format($margin, 1, ',', '.').'%) pada periode ini.';
        } elseif ($grossProfit < 0) {
            $tone = 'danger';
            $message = 'HPP ('.$this->rupiah($cogs).') melebihi omzet ('.$this->rupiah($revenue).') — ada produk terjual di bawah modal. Bisnis rugi '.$this->rupiah(abs($netProfit)).'.';
        } else {
            $tone = 'danger';
            $topText = $topExpense !== null
                ? ' — terutama '.$topExpense['label'].' ('.$this->rupiah($topExpense['nominal']).')'
                : '';
            $message = 'Laba kotor masih positif ('.$this->rupiah($grossProfit).'), tapi biaya operasional '.$this->rupiah($expenses).$topText.' melebihinya, jadi bisnis rugi '.$this->rupiah(abs($netProfit)).'.';
        }

        $changes = [];
        if ($previous['revenue'] > 0) {
            $revenuePct = (($revenue - $previous['revenue']) / $previous['revenue']) * 100;
            $changes[] = 'omzet '.($revenuePct >= 0 ? 'naik' : 'turun').' '.number_format(abs($revenuePct), 0).'%';
        }
        if ($previous['expenses'] > 0) {
            $expensePct = (($expenses - $previous['expenses']) / $previous['expenses']) * 100;
            $changes[] = 'biaya operasional '.($expensePct >= 0 ? 'naik' : 'turun').' '.number_format(abs($expensePct), 0).'%';
        }
        if ($changes !== []) {
            $message .= ' Dibanding periode sebelumnya: '.implode(' & ', $changes).'.';
        }

        return ['tone' => $tone, 'message' => $message];
    }
}
