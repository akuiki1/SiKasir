<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailTransaksi;
use App\Models\Pengeluaran;
use App\Models\Produksi;
use App\Models\Transaksi;
use DateInterval;
use DatePeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    /** Label ramah untuk tiap tipe pengeluaran. */
    private const EXPENSE_LABELS = [
        'bahan_baku' => 'Bahan Baku',
        'kemasan' => 'Kemasan',
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

    /** Tipe pengeluaran yang merupakan modal barang (dikecualikan dari biaya operasional). */
    private const COGS_EXPENSE_TYPES = ['bahan_baku', 'kemasan'];

    private const PAYMENT_LABELS = [
        'cash' => 'Tunai',
        'qris' => 'QRIS',
        'transfer' => 'Transfer Bank',
    ];

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
        $summary = $this->periodSummary($startDate, $endDate);
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
        $expenseBreakdown = Pengeluaran::whereBetween('created_at', [$startDate, $endDate])
            ->whereNotIn('tipe', self::COGS_EXPENSE_TYPES)
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

        $waterfall = $this->buildWaterfall($totalRevenue, $totalCogs, $grossProfit, $expenseBreakdown, $netProfit);

        // Perbandingan dengan periode setara sebelumnya (durasi sama, tepat sebelum periode aktif).
        $previousEnd = $startDate->copy()->subDay()->endOfDay();
        $previousStart = $previousEnd->copy()->subDays($periodDays - 1)->startOfDay();
        $previous = $this->periodSummary($previousStart, $previousEnd);

        $comparison = [
            $this->comparisonCard('Omzet', $totalRevenue, $previous['revenue'], true),
            $this->comparisonCard('Laba Kotor', $grossProfit, $previous['gross_profit'], true),
            $this->comparisonCard('Biaya Operasional', $operationalExpenses, $previous['expenses'], false),
            $this->comparisonCard('Laba Bersih', $netProfit, $previous['net_profit'], true),
        ];

        $monthlyCostWarning = $periodDays < 28 && Pengeluaran::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('tipe', ['gaji', 'sewa', 'pajak'])
            ->exists();

        $insight = $this->buildInsight(
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
            ->whereIn('tipe', self::COGS_EXPENSE_TYPES)
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

        $methods = collect(array_keys(self::PAYMENT_LABELS))->map(fn (string $metode) => [
            'metode' => $metode,
            'label' => self::PAYMENT_LABELS[$metode],
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

    public function penjualan(): Response
    {
        return Inertia::render('admin/laporan/Penjualan');
    }

    public function pelanggan(): Response
    {
        return Inertia::render('admin/laporan/Pelanggan');
    }

    /**
     * Ringkasan finansial inti (omzet, HPP, laba, biaya) untuk satu rentang tanggal.
     *
     * @return array{revenue: int, cogs: int, gross_profit: int, expenses: int, net_profit: int}
     */
    private function periodSummary(Carbon $start, Carbon $end): array
    {
        $revenue = (int) Transaksi::whereBetween('created_at', [$start, $end])->sum('total_harga');

        $cogs = (int) DetailTransaksi::whereHas('transaksi', fn ($q) => $q->whereBetween('created_at', [$start, $end]))
            ->get(['modal', 'jumlah'])
            ->sum(fn (DetailTransaksi $detail) => $detail->modal * $detail->jumlah);

        $expenses = (int) Pengeluaran::whereBetween('created_at', [$start, $end])
            ->whereNotIn('tipe', self::COGS_EXPENSE_TYPES)
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
     * @param  \Illuminate\Support\Collection<int, array{tipe: string, label: string, nominal: int}>  $expenseBreakdown
     * @return list<array{label: string, type: string, amount: int, start: int, end: int}>
     */
    private function buildWaterfall(int $totalRevenue, int $totalCogs, int $grossProfit, $expenseBreakdown, int $netProfit): array
    {
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

        return $waterfall;
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
