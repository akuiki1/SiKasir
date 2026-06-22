<?php

namespace App\Services;

use App\Models\Pelanggan;
use App\Models\Transaksi;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Wawasan Pelanggan (Customer Insights) untuk Laporan admin.
 *
 * Tiga sudut pandang strategi pemasaran & loyalitas:
 *  - Pelanggan Terloyal: siapa yang paling sering datang / paling besar belanjanya.
 *  - Rata-rata Keranjang (basket): rata-rata belanja per transaksi + produk yang
 *    sering dibeli bersamaan (bundling insight) untuk menaikkan nilai keranjang.
 *  - Retensi: berapa banyak pelanggan lama yang kembali dibanding pelanggan baru.
 *
 * Catatan model data: `transaksis.id_pelanggan` nullable — transaksi tanpa pelanggan
 * terdaftar dianggap "Umum" (walk-in). Loyalitas & retensi HANYA bisa dihitung untuk
 * pelanggan terdaftar (mayoritas reseller); rata-rata keranjang & bundling memakai
 * SEMUA transaksi (identitas tak diperlukan untuk per-transaksi). Omzet selalu
 * `total_harga` (sudah bersih diskon; fee untuk jasa, nominal titipan dikecualikan).
 */
class LaporanPelangganService
{
    /** Maksimum pelanggan teratas yang ditampilkan. */
    public const MAX_TOP_CUSTOMERS = 15;

    /** Maksimum pasangan produk (bundling) yang ditampilkan. */
    public const MAX_BUNDLES = 8;

    /**
     * @return array{
     *     period_days: int,
     *     summary: array<string, mixed>,
     *     composition: array{registered: array{transactions: int, revenue: int}, guest: array{transactions: int, revenue: int}},
     *     top_customers: list<array<string, mixed>>,
     *     retention: array<string, mixed>,
     *     bundles: list<array<string, mixed>>
     * }
     */
    public function insights(Carbon $start, Carbon $end): array
    {
        $periodDays = (int) $start->diffInDays($end) + 1;

        // Semua transaksi periode — sekali ambil, dipakai untuk basket & komposisi.
        $transactions = Transaksi::whereBetween('created_at', [$start, $end])
            ->get(['id_transaksi', 'id_pelanggan', 'total_harga', 'created_at']);

        $totalTransactions = $transactions->count();
        $totalRevenue = (int) $transactions->sum('total_harga');
        $avgBasket = $totalTransactions > 0 ? intdiv($totalRevenue, $totalTransactions) : 0;

        // Terdaftar (punya id_pelanggan) vs Umum (walk-in).
        $registered = $transactions->whereNotNull('id_pelanggan');
        $guest = $transactions->whereNull('id_pelanggan');

        $composition = [
            'registered' => [
                'transactions' => $registered->count(),
                'revenue' => (int) $registered->sum('total_harga'),
            ],
            'guest' => [
                'transactions' => $guest->count(),
                'revenue' => (int) $guest->sum('total_harga'),
            ],
        ];

        // Tanggal transaksi pertama (sepanjang waktu) tiap pelanggan terdaftar yang
        // aktif pada periode — untuk membedakan pelanggan baru vs lama (returning).
        $activeIds = $registered->pluck('id_pelanggan')->unique()->values();
        $firstVisit = $this->firstVisitMap($activeIds);

        $topCustomers = $this->topCustomers($registered, $firstVisit, $start);
        $retention = $this->retention($registered, $firstVisit, $start);
        $basket = $this->basketAnalysis($start, $end);

        $summary = [
            'total_transactions' => $totalTransactions,
            'total_revenue' => $totalRevenue,
            'avg_basket' => $avgBasket,
            'avg_items' => $basket['avg_items'],
            'multi_item_rate' => $basket['multi_item_rate'],
            'active_customers' => $retention['active'],
            'new_customers' => $retention['new'],
            'returning_customers' => $retention['returning'],
            'repeat_rate' => $retention['repeat_rate'],
            'registered_share' => $totalTransactions > 0
                ? round($composition['registered']['transactions'] / $totalTransactions * 100, 1)
                : 0.0,
        ];

        return [
            'period_days' => $periodDays,
            'summary' => $summary,
            'composition' => $composition,
            'top_customers' => $topCustomers,
            'retention' => $retention,
            'bundles' => $basket['bundles'],
        ];
    }

    /**
     * Map id_pelanggan => tanggal transaksi pertamanya (sepanjang waktu, bukan periode).
     *
     * @param  Collection<int, int>  $ids
     * @return Collection<int, string>
     */
    private function firstVisitMap(Collection $ids): Collection
    {
        if ($ids->isEmpty()) {
            return collect();
        }

        return Transaksi::whereIn('id_pelanggan', $ids->all())
            ->selectRaw('id_pelanggan, MIN(created_at) as first_at')
            ->groupBy('id_pelanggan')
            ->pluck('first_at', 'id_pelanggan');
    }

    /**
     * Pelanggan terdaftar paling loyal: diurutkan dari total belanja terbesar.
     *
     * @param  Collection<int, Transaksi>  $registered
     * @param  Collection<int, string>  $firstVisit
     * @return list<array<string, mixed>>
     */
    private function topCustomers(Collection $registered, Collection $firstVisit, Carbon $start): array
    {
        if ($registered->isEmpty()) {
            return [];
        }

        $ids = $registered->pluck('id_pelanggan')->unique()->values();
        $pelanggans = Pelanggan::whereIn('id_pelanggan', $ids->all())->get()->keyBy('id_pelanggan');

        return $registered->groupBy('id_pelanggan')
            ->map(function (Collection $group, $idPelanggan) use ($pelanggans, $firstVisit, $start) {
                $pelanggan = $pelanggans->get($idPelanggan);
                $count = $group->count();
                $revenue = (int) $group->sum('total_harga');
                $firstAt = $firstVisit->get($idPelanggan);

                return [
                    'id_pelanggan' => (int) $idPelanggan,
                    'nama' => $pelanggan->nama ?? 'Pelanggan Terhapus',
                    'tipe' => $pelanggan->tipe ?? 'umum',
                    'telp' => $pelanggan->telp ?? null,
                    'transactions' => $count,
                    'revenue' => $revenue,
                    'avg' => $count > 0 ? intdiv($revenue, $count) : 0,
                    'last_visit' => optional($group->max('created_at'))->toDateString(),
                    'is_returning' => $firstAt !== null && Carbon::parse($firstAt)->lt($start),
                ];
            })
            ->sortByDesc('revenue')
            ->take(self::MAX_TOP_CUSTOMERS)
            ->values()
            ->all();
    }

    /**
     * Retensi: pelanggan baru (transaksi pertama jatuh dalam periode) vs lama/kembali
     * (sudah pernah bertransaksi sebelum periode lalu datang lagi di periode ini).
     *
     * @param  Collection<int, Transaksi>  $registered
     * @param  Collection<int, string>  $firstVisit
     * @return array{active: int, new: int, returning: int, repeat_rate: float, one_timers: int, repeaters: int}
     */
    private function retention(Collection $registered, Collection $firstVisit, Carbon $start): array
    {
        $byCustomer = $registered->groupBy('id_pelanggan');
        $active = $byCustomer->count();

        if ($active === 0) {
            return [
                'active' => 0,
                'new' => 0,
                'returning' => 0,
                'repeat_rate' => 0.0,
                'one_timers' => 0,
                'repeaters' => 0,
            ];
        }

        $new = 0;
        $returning = 0;
        $oneTimers = 0;
        $repeaters = 0;

        foreach ($byCustomer as $idPelanggan => $group) {
            $firstAt = $firstVisit->get($idPelanggan);

            if ($firstAt !== null && Carbon::parse($firstAt)->lt($start)) {
                $returning++;
            } else {
                $new++;
            }

            // Frekuensi DALAM periode: sekali datang vs datang berulang.
            if ($group->count() >= 2) {
                $repeaters++;
            } else {
                $oneTimers++;
            }
        }

        return [
            'active' => $active,
            'new' => $new,
            'returning' => $returning,
            // Repeat Order Rate: pelanggan lama yang kembali dibanding total aktif.
            'repeat_rate' => round($returning / $active * 100, 1),
            'one_timers' => $oneTimers,
            'repeaters' => $repeaters,
        ];
    }

    /**
     * Analisis keranjang: rata-rata jenis produk per transaksi, persentase transaksi
     * multi-item, dan pasangan produk yang paling sering dibeli bersamaan (bundling).
     * Hanya menghitung baris produk (jasa transfer/tarik tunai dikecualikan).
     *
     * @return array{avg_items: float, multi_item_rate: float, bundles: list<array<string, mixed>>}
     */
    private function basketAnalysis(Carbon $start, Carbon $end): array
    {
        $rows = DB::table('detail_transaksis as d')
            ->join('transaksis as t', 't.id_transaksi', '=', 'd.id_transaksi')
            ->join('produks as p', 'p.id_produk', '=', 'd.id_produk')
            ->where('p.tipe_jual', '!=', 'jasa')
            ->whereBetween('t.created_at', [$start, $end])
            ->select('d.id_transaksi', 'd.id_produk', 'p.nama')
            ->get();

        // Produk unik per transaksi (curah/satuan yang sama tak dihitung ganda).
        $perTrx = $rows->groupBy('id_transaksi')
            ->map(fn (Collection $group) => $group->pluck('id_produk')->unique()->values());

        $productTrx = $perTrx->count();
        $avgItems = $productTrx > 0 ? round($perTrx->sum(fn (Collection $ids) => $ids->count()) / $productTrx, 2) : 0.0;
        $multiItem = $perTrx->filter(fn (Collection $ids) => $ids->count() >= 2)->count();
        $multiItemRate = $productTrx > 0 ? round($multiItem / $productTrx * 100, 1) : 0.0;

        $names = $rows->pluck('nama', 'id_produk');

        // Hitung ko-okurensi pasangan produk di transaksi yang sama.
        $pairCounts = [];
        foreach ($perTrx as $ids) {
            $list = $ids->sort()->values()->all();
            $n = count($list);

            if ($n < 2) {
                continue;
            }

            for ($i = 0; $i < $n; $i++) {
                for ($j = $i + 1; $j < $n; $j++) {
                    $key = $list[$i].'-'.$list[$j];
                    $pairCounts[$key] = ($pairCounts[$key] ?? 0) + 1;
                }
            }
        }

        arsort($pairCounts);

        $bundles = [];
        foreach ($pairCounts as $key => $count) {
            // Pasangan harus muncul minimal 2x agar dianggap pola, bukan kebetulan.
            if ($count < 2) {
                continue;
            }

            [$a, $b] = explode('-', $key);
            $bundles[] = [
                'a' => $names[(int) $a] ?? 'Produk',
                'b' => $names[(int) $b] ?? 'Produk',
                'count' => $count,
                'pct' => $multiItem > 0 ? round($count / $multiItem * 100, 1) : 0.0,
            ];

            if (count($bundles) >= self::MAX_BUNDLES) {
                break;
            }
        }

        return [
            'avg_items' => $avgItems,
            'multi_item_rate' => $multiItemRate,
            'bundles' => $bundles,
        ];
    }
}
