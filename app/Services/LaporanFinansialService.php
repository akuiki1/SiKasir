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

    /** Ambang kenaikan biaya yang dianggap "tajam" dan perlu disorot di laporan cetak (persen). */
    public const OPEX_SPIKE_THRESHOLD_PCT = 15.0;

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

    /**
     * Klasifikasi kesehatan bisnis untuk laporan cetak: "kritis" (rugi bersih),
     * "perhatian" (untung tapi margin tipis di bawah 5%), atau "sehat".
     */
    public function healthStatus(int $netProfit, float $margin): string
    {
        if ($netProfit < 0) {
            return 'kritis';
        }

        return $margin < 5.0 ? 'perhatian' : 'sehat';
    }

    /**
     * Gabungkan rincian biaya operasional periode ini dengan periode sebelumnya
     * agar tiap item punya delta% — dipakai laporan cetak untuk menyorot biaya
     * yang naik tajam (>= self::OPEX_SPIKE_THRESHOLD_PCT) di bagian "Ke mana biaya pergi".
     *
     * @param  Collection<int, array{tipe: string, label: string, nominal: int}>  $current
     * @param  Collection<int, array{tipe: string, label: string, nominal: int}>  $previous
     * @return list<array{tipe: string, label: string, nominal: int, delta_pct: float|null, is_new: bool, flagged: bool}>
     */
    public function expenseDeltas(Collection $current, Collection $previous): array
    {
        $prevByType = $previous->keyBy('tipe');

        return $current->map(function (array $row) use ($prevByType) {
            $prevNominal = (int) ($prevByType[$row['tipe']]['nominal'] ?? 0);
            $isNew = $prevNominal === 0 && $row['nominal'] > 0;
            $deltaPct = $prevNominal > 0 ? (($row['nominal'] - $prevNominal) / $prevNominal) * 100 : null;

            return [
                ...$row,
                'delta_pct' => $deltaPct,
                'is_new' => $isNew,
                'flagged' => $isNew || ($deltaPct !== null && $deltaPct >= self::OPEX_SPIKE_THRESHOLD_PCT),
            ];
        })->values()->all();
    }

    /**
     * Ringkasan "5 detik" untuk laporan cetak — satu-dua kalimat yang langsung
     * menjawab "bagaimana kondisi bisnis?" sesuai status kesehatannya.
     */
    public function buildVerdict(string $status, int $netProfit, int $prevNetProfit, float $revenueDeltaPct, float $margin, int $netCash): string
    {
        $arah = fn (float $pct) => $pct >= 0 ? 'naik' : 'turun';
        $pct = fn (float $pct) => number_format(abs($pct), 0);

        if ($status === 'kritis') {
            $message = 'Kondisi kritis. Bisnis rugi '.$this->rupiah(abs($netProfit)).' pada periode ini';
            $message .= $prevNetProfit >= 0 ? ', berbalik dari untung periode sebelumnya' : '';
            $message .= ', omzet '.$arah($revenueDeltaPct).' '.$pct($revenueDeltaPct).'% dibanding periode sebelumnya.';

            if ($netCash < 0) {
                $message .= ' Arus kas defisit '.$this->rupiah(abs($netCash)).' — perlu tindakan segera.';
            }

            return $message;
        }

        if ($status === 'perhatian') {
            return 'Bisnis perlu perhatian. Margin laba tipis ('.number_format($margin, 1, ',', '.').'%) dengan laba bersih '
                .$this->rupiah($netProfit).'. Omzet '.$arah($revenueDeltaPct).' '.$pct($revenueDeltaPct).'% dibanding periode sebelumnya.';
        }

        return 'Bisnis Anda sehat. Laba bersih '.$this->rupiah($netProfit).' (margin '.number_format($margin, 1, ',', '.').'%), omzet '
            .$arah($revenueDeltaPct).' '.$pct($revenueDeltaPct).'% dibanding periode sebelumnya.';
    }

    /**
     * 2–3 insight kontekstual untuk laporan cetak: omzet (digabung rugi bila ada),
     * lalu satu dari [kas defisit, biaya melonjak, tren margin] berdasar prioritas —
     * kas defisit paling mendesak, disusul biaya yang naik tajam, dan tren margin
     * 3 periode sebagai sorotan yang selalu tersedia.
     *
     * @param  list<array{tipe: string, label: string, nominal: int, delta_pct: float|null, is_new: bool, flagged: bool}>  $opexDeltas
     * @param  array{name: string, revenue: int}|null  $topCategory
     * @return list<array{icon: string, tone: string, text: string}>
     */
    public function buildStoryInsights(int $revenue, int $prevRevenue, int $netProfit, int $netCash, array $opexDeltas, float $margin, float $prevMargin, float $prev2Margin, ?array $topCategory): array
    {
        $revenueDeltaPct = $prevRevenue > 0 ? (($revenue - $prevRevenue) / $prevRevenue) * 100 : 0.0;
        $revenueUp = $revenueDeltaPct >= 0;
        $revenueDeltaAbs = abs($revenue - $prevRevenue);
        $sign = $revenueUp ? '+' : '−';

        $insights = [];

        if ($netProfit < 0) {
            $insights[] = [
                'icon' => '▼', 'tone' => 'bad',
                'text' => 'Rugi '.$this->rupiah(abs($netProfit)).' pada periode ini. Omzet '.($revenueUp ? 'naik' : 'turun').' '
                    .number_format(abs($revenueDeltaPct), 0).'% ('.$sign.$this->rupiah($revenueDeltaAbs).') dibanding periode sebelumnya.',
            ];
        } else {
            $categoryNote = ($revenueUp && $topCategory !== null) ? ' — terutama dari kategori '.$topCategory['name'].'.' : '.';
            $insights[] = [
                'icon' => $revenueUp ? '▲' : '▼', 'tone' => $revenueUp ? 'good' : 'bad',
                'text' => 'Omzet '.($revenueUp ? 'naik' : 'turun').' '.number_format(abs($revenueDeltaPct), 0).'% ('.$sign.$this->rupiah($revenueDeltaAbs).')'.$categoryNote,
            ];
        }

        $flaggedOpex = collect($opexDeltas)->first(fn (array $o) => $o['flagged']);

        if ($netCash < 0) {
            $insights[] = [
                'icon' => '▼', 'tone' => 'bad',
                'text' => 'Arus kas defisit '.$this->rupiah(abs($netCash)).': uang untuk restok & biaya operasional lebih besar dari yang masuk.',
            ];
        } elseif ($flaggedOpex !== null) {
            $deltaText = $flaggedOpex['is_new'] ? 'baru muncul' : ('naik '.number_format($flaggedOpex['delta_pct'], 0).'%');
            $insights[] = [
                'icon' => '!', 'tone' => 'warn',
                'text' => 'Biaya '.$flaggedOpex['label'].' '.$deltaText.' ('.$this->rupiah($flaggedOpex['nominal']).'), jadi salah satu penekan margin terbesar.',
            ];
        }

        if (count($insights) < 3) {
            if ($margin > $prevMargin && $prevMargin > $prev2Margin) {
                $insights[] = [
                    'icon' => '✓', 'tone' => 'good',
                    'text' => 'Margin laba membaik 2 periode berturut-turut: '.number_format($prev2Margin, 1, ',', '.').'% → '
                        .number_format($prevMargin, 1, ',', '.').'% → '.number_format($margin, 1, ',', '.').'%.',
                ];
            } elseif ($margin < $prevMargin && $prevMargin < $prev2Margin) {
                $insights[] = [
                    'icon' => '!', 'tone' => 'warn',
                    'text' => 'Margin turun 2 periode beruntun: '.number_format($prev2Margin, 1, ',', '.').'% → '
                        .number_format($prevMargin, 1, ',', '.').'% → '.number_format($margin, 1, ',', '.').'%. Rem biaya sebelum makin tipis.',
                ];
            } else {
                $insights[] = [
                    'icon' => '•', 'tone' => 'neutral',
                    'text' => 'Margin periode ini '.number_format($margin, 1, ',', '.').'%, dibanding periode sebelumnya '.number_format($prevMargin, 1, ',', '.').'%.',
                ];
            }
        }

        return $insights;
    }

    private function rupiah(int $value): string
    {
        return ($value < 0 ? '−' : '').'Rp'.number_format(abs($value), 0, ',', '.');
    }
}
