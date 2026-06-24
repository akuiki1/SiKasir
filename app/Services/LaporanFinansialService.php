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

    /** Hari dalam seminggu (ISO: 1 = Senin … 7 = Minggu). */
    public const WEEKDAY_LABELS = [
        1 => 'Senin',
        2 => 'Selasa',
        3 => 'Rabu',
        4 => 'Kamis',
        5 => 'Jumat',
        6 => 'Sabtu',
        7 => 'Minggu',
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
     * Distribusi transaksi & omzet per jam (0–23) — untuk analisis waktu sibuk.
     * Diagregasi di PHP (bukan SQL HOUR()) agar portabel lintas database & konsisten
     * dengan zona waktu aplikasi pada cast created_at.
     *
     * @param  Collection<int, Transaksi>  $transactions
     * @return list<array{hour: int, label: string, revenue: int, count: int}>
     */
    public function hourlyDistribution(Collection $transactions): array
    {
        $byHour = $transactions->groupBy(fn (Transaksi $trx) => (int) $trx->created_at->format('G'));

        $rows = [];
        for ($hour = 0; $hour < 24; $hour++) {
            $group = $byHour->get($hour);
            $rows[] = [
                'hour' => $hour,
                'label' => sprintf('%02d:00', $hour),
                'revenue' => $group ? (int) $group->sum('total_harga') : 0,
                'count' => $group ? $group->count() : 0,
            ];
        }

        return $rows;
    }

    /**
     * Distribusi transaksi & omzet per hari dalam seminggu (Senin–Minggu).
     *
     * @param  Collection<int, Transaksi>  $transactions
     * @return list<array{weekday: int, label: string, revenue: int, count: int}>
     */
    public function weekdayDistribution(Collection $transactions): array
    {
        $byDay = $transactions->groupBy(fn (Transaksi $trx) => $trx->created_at->isoWeekday());

        $rows = [];
        foreach (self::WEEKDAY_LABELS as $iso => $label) {
            $group = $byDay->get($iso);
            $rows[] = [
                'weekday' => $iso,
                'label' => $label,
                'revenue' => $group ? (int) $group->sum('total_harga') : 0,
                'count' => $group ? $group->count() : 0,
            ];
        }

        return $rows;
    }

    /**
     * Ringkasan performa per kasir: omzet, jumlah transaksi, rata-rata, dan diskon
     * yang diberikan (frekuensi & nominal) sebagai sinyal kontrol. Diurutkan dari
     * omzet tertinggi.
     *
     * Catatan: pembatalan (void) belum direkam di skema (transaksi dihapus permanen,
     * tanpa kolom status), jadi frekuensi void tidak tersedia di sini.
     *
     * @param  Collection<int, Transaksi>  $transactions  (eager-load relasi user)
     * @return Collection<int, array{id_user: int, nama: string, revenue: int, transactions: int, avg: int, diskon: int, diskon_count: int}>
     */
    public function cashierPerformance(Collection $transactions): Collection
    {
        return $transactions
            ->groupBy('id_user')
            ->map(function (Collection $group) {
                $count = $group->count();
                $revenue = (int) $group->sum('total_harga');
                $first = $group->first();

                return [
                    'id_user' => (int) $first->id_user,
                    'nama' => $first->user?->name ?? 'User Terhapus',
                    'revenue' => $revenue,
                    'transactions' => $count,
                    'avg' => $count > 0 ? intdiv($revenue, $count) : 0,
                    'diskon' => (int) $group->sum('diskon'),
                    'diskon_count' => $group->where('diskon', '>', 0)->count(),
                ];
            })
            ->sortByDesc('revenue')
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
