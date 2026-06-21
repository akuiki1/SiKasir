<?php

namespace App\Services;

use App\Models\DetailTransaksi;
use App\Models\Pengeluaran;
use App\Models\Transaksi;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Logika finansial bersama untuk Dashboard admin & Laporan Keuangan.
 * Menjadi satu sumber kebenaran agar perubahan rumus laba/HPP/biaya
 * berlaku konsisten di seluruh laporan (mencegah copy-paste yang menyimpang).
 */
class LaporanFinansialService
{
    /** Label ramah untuk tiap tipe pengeluaran. */
    public const EXPENSE_LABELS = [
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
    public const COGS_EXPENSE_TYPES = ['bahan_baku', 'kemasan'];

    public const PAYMENT_LABELS = [
        'cash' => 'Tunai',
        'qris' => 'QRIS',
        'transfer' => 'Transfer Bank',
    ];

    /**
     * Ringkasan finansial inti (omzet, HPP, laba, biaya) untuk satu rentang tanggal.
     *
     * @return array{revenue: int, cogs: int, gross_profit: int, expenses: int, net_profit: int}
     */
    public function periodSummary(Carbon $start, Carbon $end): array
    {
        $revenue = (int) Transaksi::whereBetween('created_at', [$start, $end])->sum('total_harga');
        $cogs = $this->cogs($start, $end);
        $expenses = $this->operationalExpenses($start, $end);
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
     * HPP (COGS) dari snapshot modal per item terjual, diagregasi langsung di DB
     * (SUM(modal * jumlah)) agar tidak memuat seluruh baris detail ke memori.
     */
    public function cogs(Carbon $start, Carbon $end): int
    {
        return (int) DetailTransaksi::whereHas('transaksi', fn ($q) => $q->whereBetween('created_at', [$start, $end]))
            ->sum(DB::raw('modal * jumlah'));
    }

    /** Total biaya operasional (mengecualikan modal barang: bahan_baku & kemasan). */
    public function operationalExpenses(Carbon $start, Carbon $end): int
    {
        return (int) Pengeluaran::whereBetween('created_at', [$start, $end])
            ->whereNotIn('tipe', self::COGS_EXPENSE_TYPES)
            ->sum('nominal');
    }

    /**
     * Rincian biaya operasional per kategori (untuk waterfall & tabel laba rugi).
     *
     * @return Collection<int, array{tipe: string, label: string, nominal: int}>
     */
    public function expenseBreakdown(Carbon $start, Carbon $end): Collection
    {
        return Pengeluaran::whereBetween('created_at', [$start, $end])
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
    }

    /**
     * Performa penjualan per produk dari sekumpulan transaksi (beserta detail & produk).
     *
     * - Produk jasa (transfer/tarik tunai) dikecualikan: bukan penjualan barang.
     * - Omzet per produk sudah dikurangi diskon global, dialokasikan proporsional
     *   terhadap subtotal tiap baris, sehingga total omzet produk rekonsiliasi
     *   dengan total_harga transaksi.
     *
     * @param  Collection<int, Transaksi>  $transactions
     * @return Collection<int, array{id_produk: int, nama: string, qty: float, revenue: int, cogs: int, profit: int, transactions: int}>
     */
    public function productPerformance(Collection $transactions): Collection
    {
        $rows = collect();

        foreach ($transactions as $trx) {
            $details = $trx->detailTransaksis;
            $sumSubtotal = (int) $details->sum('subtotal');
            // Diskon global = selisih subtotal baris (sudah bersih promo item) dengan omzet transaksi.
            $globalDiskon = max(0, $sumSubtotal - (int) $trx->total_harga);

            foreach ($details as $detail) {
                if ($detail->produk?->tipe_jual === 'jasa') {
                    continue;
                }

                $share = $sumSubtotal > 0 ? $detail->subtotal / $sumSubtotal : 0;
                $netRevenue = (int) round($detail->subtotal - ($globalDiskon * $share));

                $rows->push([
                    'id_produk' => (int) $detail->id_produk,
                    'nama' => $detail->produk?->nama ?? 'Produk Terhapus',
                    'qty' => (float) $detail->jumlah,
                    'revenue' => max(0, $netRevenue),
                    'cogs' => (int) ($detail->modal * $detail->jumlah),
                    'id_transaksi' => $detail->id_transaksi,
                ]);
            }
        }

        return $rows
            ->groupBy('id_produk')
            ->map(fn (Collection $group) => [
                'id_produk' => $group->first()['id_produk'],
                'nama' => $group->first()['nama'],
                'qty' => $group->sum('qty'),
                'revenue' => (int) $group->sum('revenue'),
                'cogs' => (int) $group->sum('cogs'),
                'profit' => (int) ($group->sum('revenue') - $group->sum('cogs')),
                'transactions' => $group->pluck('id_transaksi')->unique()->count(),
            ])
            ->values();
    }

    /**
     * Rantai laba untuk grafik waterfall: Omzet → −HPP → Laba Kotor → −biaya per kategori → Laba Bersih.
     *
     * @param  iterable<array{label: string, nominal: int}>  $expenseBreakdown
     * @return list<array{label: string, type: string, amount: int, start: int, end: int}>
     */
    public function buildWaterfall(int $totalRevenue, int $totalCogs, int $grossProfit, iterable $expenseBreakdown, int $netProfit): array
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
    public function comparisonCard(string $label, int $current, int $previous, bool $higherIsBetter): array
    {
        return [
            'label' => $label,
            'current' => $current,
            'previous' => $previous,
            'delta_pct' => $previous !== 0 ? (($current - $previous) / abs($previous)) * 100 : null,
            'higher_is_better' => $higherIsBetter,
        ];
    }

    /**
     * Kesimpulan otomatis: di titik mana laba bocor + apa yang berubah dari periode sebelumnya.
     *
     * @param  array{label: string, nominal: int}|null  $topExpense
     * @param  array{revenue: int, cogs: int, gross_profit: int, expenses: int, net_profit: int}  $previous
     * @return array{tone: string, message: string}
     */
    public function buildInsight(int $revenue, int $cogs, int $grossProfit, int $expenses, int $netProfit, float $margin, ?array $topExpense, array $previous): array
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

    private function rupiah(int $value): string
    {
        return ($value < 0 ? '−' : '').'Rp'.number_format(abs($value), 0, ',', '.');
    }
}
