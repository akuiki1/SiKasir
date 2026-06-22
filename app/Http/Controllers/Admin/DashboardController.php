<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\Promo;
use App\Models\Transaksi;
use App\Services\LaporanFinansialService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Dashboard admin: halaman "buka-pagi" yang ringkas — kondisi HARI INI, hal yang
 * butuh tindakan, tren singkat, dan pintasan. Analisis mendalam (laba rugi, performa,
 * ABC stok, wawasan pelanggan) sengaja dipindah ke menu Laporan agar dashboard tidak
 * menduplikasi laporan dan tetap cepat dibaca.
 */
class DashboardController extends Controller
{
    /** Ambang stok menipis — selaras dengan Produk::getStatusStokAttribute(). */
    private const LOW_STOCK_THRESHOLD = 5;

    /** Jendela hari untuk menilai produk berpotensi mati & pelanggan loyal yang menghilang. */
    private const DORMANT_DAYS = 30;

    /** Nama hari ringkas (ISO: 1 = Senin … 7 = Minggu) untuk grafik tren. */
    private const WEEKDAY_SHORT = [1 => 'Sen', 2 => 'Sel', 3 => 'Rab', 4 => 'Kam', 5 => 'Jum', 6 => 'Sab', 7 => 'Min'];

    public function __construct(private readonly LaporanFinansialService $finansial) {}

    public function index(Request $request): Response
    {
        $todayStart = Carbon::today()->startOfDay();
        $todayEnd = Carbon::today()->endOfDay();

        // --- Snapshot hari ini vs kemarin (untuk delta) ---
        $today = $this->dayStats($todayStart, $todayEnd);
        $yesterday = $this->dayStats(Carbon::yesterday()->startOfDay(), Carbon::yesterday()->endOfDay());

        $todayStats = [
            'revenue' => $today['revenue'],
            'transactions' => $today['transactions'],
            'gross_profit' => $today['gross_profit'],
            'items_sold' => $today['items_sold'],
            'avg_items' => $today['transactions'] > 0 ? round($today['items_sold'] / $today['transactions'], 1) : 0,
            'margin' => $today['revenue'] > 0 ? round($today['gross_profit'] / $today['revenue'] * 100, 1) : null,
            'revenue_delta' => $this->deltaPct($today['revenue'], $yesterday['revenue']),
            'transactions_delta' => $this->deltaPct($today['transactions'], $yesterday['transactions']),
            'gross_profit_delta' => $this->deltaPct($today['gross_profit'], $yesterday['gross_profit']),
        ];

        // Kasir yang sedang/terakhir bertugas hari ini (proksi "siapa yang jaga").
        $activeCashier = Transaksi::with('user:id,name')
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->latest('created_at')
            ->first()?->user?->name;

        return Inertia::render('admin/Dashboard', [
            'greeting' => $this->greeting(),
            'admin_name' => Auth::user()?->name ?? 'Admin',
            'today_label' => Carbon::now()->locale('id')->translatedFormat('l, d F Y'),
            'active_cashier' => $activeCashier,
            'today_stats' => $todayStats,
            'trend' => $this->trend7d(),
            'alerts' => $this->alerts($todayEnd),
            'recent_activity' => $this->recentActivity(),
        ]);
    }

    /**
     * Omzet, jumlah transaksi, item terjual & laba kotor untuk satu rentang hari.
     *
     * @return array{revenue: int, transactions: int, items_sold: float, gross_profit: int}
     */
    private function dayStats(Carbon $start, Carbon $end): array
    {
        $transactions = Transaksi::with('detailTransaksis:id_transaksi,jumlah')
            ->whereBetween('created_at', [$start, $end])
            ->get(['id_transaksi', 'total_harga', 'created_at']);

        $revenue = (int) $transactions->sum('total_harga');

        return [
            'revenue' => $revenue,
            'transactions' => $transactions->count(),
            'items_sold' => (float) $transactions->sum(fn (Transaksi $trx) => $trx->detailTransaksis->sum('jumlah')),
            'gross_profit' => $revenue - $this->finansial->cogs($start, $end),
        ];
    }

    /** Perubahan persen vs nilai sebelumnya; null bila pembanding 0 (tak terdefinisi). */
    private function deltaPct(float $current, float $previous): ?float
    {
        if ($previous == 0.0) {
            return null;
        }

        return round((($current - $previous) / abs($previous)) * 100, 1);
    }

    /** Sapaan menurut waktu lokal saat ini. */
    private function greeting(): string
    {
        $hour = (int) Carbon::now()->format('G');

        return match (true) {
            $hour < 11 => 'Selamat pagi',
            $hour < 15 => 'Selamat siang',
            $hour < 19 => 'Selamat sore',
            default => 'Selamat malam',
        };
    }

    /**
     * Tren omzet & jumlah transaksi 7 hari terakhir (termasuk hari ini).
     *
     * @return list<array{day: string, date: string, revenue: int, transactions: int}>
     */
    private function trend7d(): array
    {
        $start = Carbon::today()->subDays(6)->startOfDay();

        $byDate = Transaksi::whereBetween('created_at', [$start, Carbon::today()->endOfDay()])
            ->get(['total_harga', 'created_at'])
            ->groupBy(fn (Transaksi $trx) => $trx->created_at->format('Y-m-d'));

        $days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $group = $byDate->get($date->format('Y-m-d'), collect());

            $days[] = [
                'day' => self::WEEKDAY_SHORT[$date->isoWeekday()],
                'date' => $date->format('d/m'),
                'revenue' => (int) $group->sum('total_harga'),
                'transactions' => $group->count(),
            ];
        }

        return $days;
    }

    /**
     * Hal yang butuh perhatian admin — hanya yang jumlahnya > 0 yang dikembalikan.
     *
     * @return list<array{key: string, severity: string, count: int, label: string, cta_label: string, cta_href: string}>
     */
    private function alerts(Carbon $todayEnd): array
    {
        // 1. Stok menipis / habis (non-jasa, stok <= ambang termasuk 0).
        $lowStock = Produk::where('tipe_jual', '!=', 'jasa')
            ->where('stok', '<=', self::LOW_STOCK_THRESHOLD)
            ->count();

        // 2. Berpotensi dead-stock: masih berstok tapi 0 terjual dalam jendela & belum dipromo.
        $windowStart = $todayEnd->copy()->subDays(self::DORMANT_DAYS - 1)->startOfDay();
        $soldIds = DetailTransaksi::whereNotNull('id_produk')
            ->whereHas('transaksi', fn ($q) => $q->whereBetween('created_at', [$windowStart, $todayEnd]))
            ->distinct()
            ->pluck('id_produk')
            ->all();

        $now = Carbon::now();
        $promoIds = Promo::where('aktif', true)
            ->whereNotNull('id_produk')
            ->where('tanggal_mulai', '<=', $now)
            ->where('tanggal_selesai', '>=', $now)
            ->pluck('id_produk')
            ->all();

        $deadStock = Produk::where('tipe_jual', '!=', 'jasa')
            ->where('stok', '>', 0)
            ->whereNotIn('id_produk', $soldIds)
            ->whereNotIn('id_produk', $promoIds)
            ->count();

        // 3. Produk belum punya harga modal → laba/HPP terdistorsi (data keuangan perlu dilengkapi).
        $noCost = Produk::where('tipe_jual', '!=', 'jasa')
            ->where(fn ($q) => $q->whereNull('harga_modal')->orWhere('harga_modal', '<=', 0))
            ->count();

        // 4. Pelanggan loyal (≥2x transaksi) yang sudah lama tidak kembali.
        $dormantThreshold = Carbon::today()->subDays(self::DORMANT_DAYS)->startOfDay();
        $dormantCustomers = Transaksi::whereNotNull('id_pelanggan')
            ->selectRaw('id_pelanggan, MAX(created_at) as last_at, COUNT(*) as trx')
            ->groupBy('id_pelanggan')
            ->havingRaw('COUNT(*) >= 2')
            ->havingRaw('MAX(created_at) < ?', [$dormantThreshold])
            ->get()
            ->count();

        $alerts = [
            [
                'key' => 'low_stock',
                'severity' => 'danger',
                'count' => $lowStock,
                'label' => 'produk stok menipis / habis',
                'cta_label' => 'Lihat Stok',
                'cta_href' => route('admin.stok', ['status' => 'menipis'], false),
            ],
            [
                'key' => 'dead_stock',
                'severity' => 'warning',
                'count' => $deadStock,
                'label' => 'produk berpotensi dead stock',
                'cta_label' => 'Buat Promo',
                'cta_href' => route('admin.promos', absolute: false),
            ],
            [
                'key' => 'no_cost',
                'severity' => 'caution',
                'count' => $noCost,
                'label' => 'produk belum punya harga modal',
                'cta_label' => 'Lengkapi',
                'cta_href' => route('admin.products', absolute: false),
            ],
            [
                'key' => 'dormant',
                'severity' => 'info',
                'count' => $dormantCustomers,
                'label' => 'pelanggan loyal belum kembali',
                'cta_label' => 'Lihat Data',
                'cta_href' => route('admin.laporan.pelanggan', absolute: false),
            ],
        ];

        return array_values(array_filter($alerts, fn (array $alert) => $alert['count'] > 0));
    }

    /**
     * 5 transaksi terakhir untuk feed aktivitas.
     *
     * @return list<array{kode: string, total: int, kasir: string, tanggal: string, tanggal_iso: string, waktu: string}>
     */
    private function recentActivity(): array
    {
        return Transaksi::with('user:id,name')
            ->latest('created_at')
            ->take(5)
            ->get(['id_transaksi', 'id_user', 'total_harga', 'created_at'])
            ->map(fn (Transaksi $trx) => [
                'kode' => 'TRX-'.$trx->id_transaksi,
                'total' => (int) $trx->total_harga,
                'kasir' => $trx->user?->name ?? 'User Terhapus',
                'tanggal' => $trx->created_at->locale('id')->translatedFormat('d M Y'),
                // Dipakai untuk men-set rentang tanggal saat membuka Data Transaksi (defaultnya "hari ini").
                'tanggal_iso' => $trx->created_at->toDateString(),
                'waktu' => $trx->created_at->format('H:i'),
            ])
            ->all();
    }
}
