<?php

namespace App\Services;

use App\Models\Produk;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Analisis perputaran stok (ABC / Fast-Slow-Dead) untuk Laporan Inventaris.
 *
 * Tujuan menu ini: mengukur efisiensi modal yang tertanam di barang dagangan.
 * Produk dikelompokkan berdasarkan seberapa laku ia pada periode terpilih:
 *  - fast: paling laku — penyumbang ~80% volume penjualan (jaga stok jangan sampai habis).
 *  - slow: kurang laku — sisa volume penjualan (rem pembelian agar modal tak menumpuk).
 *  - dead: tidak terjual sama sekali pada periode (kandidat diskon / cuci gudang).
 */
class LaporanStokService
{
    /** Ambang Pareto: produk yang menyumbang kumulatif <80% volume = fast-moving. */
    public const FAST_THRESHOLD = 0.8;

    /**
     * Klasifikasikan seluruh produk berstok (non-jasa) berdasarkan perputaran pada periode.
     *
     * @return array{
     *     period_days: int,
     *     summary: array<string, array{count: int, stock_value: int, revenue: int, qty: float}>,
     *     totals: array{products: int, stock_value: int, revenue: int, qty: float},
     *     products: list<array<string, mixed>>
     * }
     */
    public function abcAnalysis(Carbon $start, Carbon $end): array
    {
        // Laju penjualan (velocity) & "estimasi habis" harus dibagi hari yang
        // BENAR-BENAR sudah berjalan, bukan seluruh rentang filter. Filter "Tahun
        // Ini" berakhir 31 Des, padahal penjualan baru ada sampai hari ini —
        // memakai ~365 hari akan mengencerkan laju ~2x & melebih-lebihkan estimasi
        // habis. Batasi ujung periode pada waktu sekarang bila rentang menembus
        // masa depan; rentang yang seluruhnya di masa lalu tetap utuh.
        $now = Carbon::now();
        $effectiveEnd = $end->greaterThan($now) ? $now : $end;
        $periodDays = max(1, (int) $start->diffInDays($effectiveEnd) + 1);

        // Penjualan per produk pada periode: kuantitas, omzet (subtotal baris), frekuensi transaksi.
        $sales = DB::table('detail_transaksis as d')
            ->join('transaksis as t', 't.id_transaksi', '=', 'd.id_transaksi')
            ->whereBetween('t.created_at', [$start, $end])
            ->groupBy('d.id_produk')
            ->selectRaw('d.id_produk, SUM(d.jumlah) as qty, SUM(d.subtotal) as revenue, COUNT(DISTINCT d.id_transaksi) as trx')
            ->get()
            ->keyBy('id_produk');

        // Tanggal terjual terakhir (sepanjang waktu) — untuk konteks dead-stock.
        $lastSold = DB::table('detail_transaksis as d')
            ->join('transaksis as t', 't.id_transaksi', '=', 'd.id_transaksi')
            ->groupBy('d.id_produk')
            ->selectRaw('d.id_produk, MAX(t.created_at) as last_sold')
            ->pluck('last_sold', 'id_produk');

        // Hanya produk yang mengelola stok (jasa tidak punya barang/modal mengendap).
        $rows = Produk::with('kategori')
            ->where('tipe_jual', '!=', 'jasa')
            ->get(['id_produk', 'nama', 'satuan', 'stok', 'harga_modal', 'id_kategori'])
            ->map(function (Produk $p) use ($sales, $lastSold, $periodDays) {
                $sale = $sales->get($p->id_produk);
                $qty = (float) ($sale->qty ?? 0);
                $stok = (float) $p->stok;
                $velocity = $periodDays > 0 ? $qty / $periodDays : 0.0;

                return [
                    'id_produk' => (int) $p->id_produk,
                    'nama' => $p->nama,
                    'kategori' => $p->kategori->nama_kategori,
                    'satuan' => $p->satuan,
                    'qty' => $qty,
                    'revenue' => (int) ($sale->revenue ?? 0),
                    'trx' => (int) ($sale->trx ?? 0),
                    'stok' => $stok,
                    'harga_modal' => (int) $p->harga_modal,
                    'stock_value' => (int) round($stok * $p->harga_modal),
                    'velocity' => round($velocity, 3),
                    // Perkiraan berapa hari lagi stok habis pada laju penjualan saat ini.
                    'days_of_supply' => $velocity > 0 ? (int) ceil($stok / $velocity) : null,
                    'last_sold' => $lastSold[$p->id_produk] ?? null,
                ];
            });

        // Produk yang bergerak (terjual) → dibelah Fast vs Slow lewat kumulatif Pareto volume.
        $movers = $rows->filter(fn (array $r) => $r['qty'] > 0)->sortByDesc('qty')->values();
        $totalQty = (float) $movers->sum('qty');

        $cumulative = 0.0;
        $movers = $movers->map(function (array $r) use (&$cumulative, $totalQty) {
            $shareBefore = $totalQty > 0 ? $cumulative / $totalQty : 0.0;
            $r['kelas'] = $shareBefore < self::FAST_THRESHOLD ? 'fast' : 'slow';
            $cumulative += $r['qty'];

            return $r;
        });

        // Tidak terjual pada periode = dead-stock — TAPI hanya yang masih berstok
        // (>0), karena dead-stock berarti modal yang mengendap di gudang. Produk
        // tak terjual & stok 0 bukan modal mengendap (mis. produk lama yang sudah
        // habis), jadi tidak ditampilkan agar daftar tidak penuh noise.
        $dead = $rows
            ->filter(fn (array $r) => $r['qty'] <= 0 && $r['stok'] > 0)
            ->map(function (array $r) {
                $r['kelas'] = 'dead';

                return $r;
            });

        $products = $movers->concat($dead)->values();

        return [
            'period_days' => $periodDays,
            'summary' => $this->summarize($products),
            'totals' => [
                'products' => $products->count(),
                'stock_value' => (int) $products->sum('stock_value'),
                'revenue' => (int) $products->sum('revenue'),
                'qty' => (float) $products->sum('qty'),
            ],
            'products' => $products->all(),
        ];
    }

    /**
     * Ringkasan agregat per kelas (selalu memuat ketiga kelas walau kosong).
     *
     * @param  Collection<int, array<string, mixed>>  $products
     * @return array<string, array{count: int, stock_value: int, revenue: int, qty: float}>
     */
    private function summarize(Collection $products): array
    {
        $byClass = $products->groupBy('kelas');

        return collect(['fast', 'slow', 'dead'])
            ->mapWithKeys(function (string $kelas) use ($byClass) {
                $group = $byClass->get($kelas, collect());

                return [$kelas => [
                    'count' => $group->count(),
                    'stock_value' => (int) $group->sum('stock_value'),
                    'revenue' => (int) $group->sum('revenue'),
                    'qty' => (float) $group->sum('qty'),
                ]];
            })
            ->all();
    }
}
