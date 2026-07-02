<?php

namespace App\Http\Controllers;

use App\Models\DetailTransaksi;
use App\Models\Pelanggan;
use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\Promo;
use App\Models\TarifJasa;
use App\Models\Transaksi;
use App\Services\PesananService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class KasirController extends Controller
{
    /**
     * Target omzet harian per kasir (rupiah).
     * Dipakai untuk progress bar di dashboard kasir; sesuaikan dengan kebutuhan toko.
     */
    private const TARGET_HARIAN = 300000;

    /** Ambang stok menipis (selaras dengan Produk::getStatusStokAttribute()). */
    private const AMBANG_STOK = 5;

    public function dashboard(Request $request): Response
    {
        $userId = Auth::id();
        $today = Carbon::today();

        $defaultEnd = $today->toDateString();
        $oldestCreatedAt = Transaksi::where('id_user', $userId)->min('created_at');
        $defaultStart = $oldestCreatedAt ? Carbon::parse($oldestCreatedAt)->toDateString() : $today->toDateString();

        $startDate = $request->query('start_date', $defaultStart);
        $endDate = $request->query('end_date', $defaultEnd);

        $from = Carbon::parse($startDate)->startOfDay();
        $to = Carbon::parse($endDate)->endOfDay();

        if ($from->greaterThan($to)) {
            $to = $from->copy()->endOfDay();
        }

        // --- Penjualan hari ini (kartu + ringkasan sesi) ---
        // Rentang datetime mentah (bukan whereDate) agar index (id_user, created_at) terpakai.
        $todayBase = Transaksi::where('id_user', $userId)
            ->whereBetween('created_at', [$today->copy()->startOfDay(), $today->copy()->endOfDay()]);
        $todayRevenue = (int) (clone $todayBase)->sum('total_harga');
        $todayCount = (clone $todayBase)->count();
        $todayItems = (int) DetailTransaksi::whereIn(
            'id_transaksi',
            (clone $todayBase)->pluck('id_transaksi')
        )->sum('jumlah');

        // --- Penjualan per rentang filter ---
        $rangeQuery = Transaksi::where('id_user', $userId);

        if ($request->filled('start_date')) {
            $rangeQuery->where('created_at', '>=', $from);
        }

        if ($request->filled('end_date')) {
            $rangeQuery->where('created_at', '<=', $to);
        }

        $rangeRevenue = (int) (clone $rangeQuery)->sum('total_harga');
        $rangeCount = (clone $rangeQuery)->count();

        $dateRangeLabel = $request->filled('start_date') || $request->filled('end_date')
            ? sprintf('%s sampai %s', $startDate, $endDate)
            : 'Semua Waktu';

        // --- Transaksi terakhir saya ---
        $recentTransactions = Transaksi::where('id_user', $userId)
            ->with('detailTransaksis:id_transaksi,jumlah')
            ->latest('created_at')
            ->limit(5)
            ->get()
            ->map(fn (Transaksi $transaksi) => [
                'id_transaksi' => $transaksi->id_transaksi,
                'kode' => 'TRX-'.$transaksi->id_transaksi,
                'waktu' => Carbon::parse($transaksi->created_at)->translatedFormat('H:i'),
                'items' => $transaksi->detailTransaksis->sum('jumlah'),
                'total_harga' => $transaksi->total_harga,
                'status' => 'Selesai',
            ]);

        // --- Rekap metode pembayaran hari ini (bantu tutup laci) ---
        $paymentAgg = (clone $todayBase)
            ->selectRaw('metode_pembayaran, COUNT(*) as jumlah, SUM(total_harga) as total')
            ->groupBy('metode_pembayaran')
            ->get()
            ->keyBy('metode_pembayaran');

        $paymentBreakdown = collect(['cash', 'qris', 'transfer'])->map(fn (string $metode) => [
            'metode' => $metode,
            'total' => (int) ($paymentAgg[$metode]->total ?? 0),
            'jumlah' => (int) ($paymentAgg[$metode]->jumlah ?? 0),
        ])->values();

        // --- Stok menipis / habis (produk jasa tidak punya stok, dikecualikan) ---
        $lowStock = Produk::where('tipe_jual', '!=', 'jasa')
            ->where('stok', '<=', self::AMBANG_STOK)
            ->orderBy('stok')
            ->orderBy('nama')
            ->limit(8)
            ->get()
            ->map(fn (Produk $produk) => [
                'id_produk' => $produk->id_produk,
                'nama' => $produk->nama,
                'stok' => $produk->stok,
                'status' => $produk->status_stok,
                'foto_url' => Produk::fotoUrl($produk->foto),
            ]);
        $lowStockCount = Produk::where('tipe_jual', '!=', 'jasa')
            ->where('stok', '<=', self::AMBANG_STOK)
            ->count();

        // --- Promo aktif sekarang ---
        $now = now();
        $activePromos = Promo::with('produk')
            ->where('aktif', true)
            ->where('tanggal_mulai', '<=', $now)
            ->where('tanggal_selesai', '>=', $now)
            ->orderByRaw('DATE(tanggal_selesai) = ? DESC', [$today->toDateString()])
            ->orderBy('tanggal_selesai')
            ->limit(6)
            ->get()
            ->map(function (Promo $promo) use ($now) {
                $sisaHari = (int) ceil(($promo->tanggal_selesai->getTimestamp() - $now->getTimestamp()) / 86400);

                $label = match ($promo->tipe) {
                    'persen' => 'Diskon '.rtrim(rtrim(number_format($promo->nilai, 2, ',', '.'), '0'), ',').'%',
                    'bundling' => 'Beli '.$promo->beli_qty.' Gratis '.$promo->gratis_qty,
                    default => 'Diskon Rp'.number_format($promo->nilai, 0, ',', '.'),
                };

                return [
                    'id_promo' => $promo->id_promo,
                    'nama' => $promo->nama,
                    'deskripsi' => $promo->deskripsi,
                    'label' => $label,
                    'tipe' => $promo->tipe,
                    'target' => $promo->id_produk ? $promo->produk->nama : 'Semua Produk',
                    'is_global' => $promo->id_produk === null,
                    'minimal_belanja' => $promo->minimal_belanja ? (int) $promo->minimal_belanja : null,
                    'sisa_hari' => max(0, $sisaHari),
                    'berakhir_hari_ini' => $promo->tanggal_selesai->isToday(),
                    'mulai_hari_ini' => $promo->tanggal_mulai->isToday(),
                    'periode' => $promo->tanggal_mulai->translatedFormat('d M').' – '.$promo->tanggal_selesai->translatedFormat('d M Y'),
                ];
            });

        // --- Produk terlaris (oleh kasir ini, dalam rentang filter) ---
        $bestSellers = DetailTransaksi::query()
            ->join('transaksis', 'detail_transaksis.id_transaksi', '=', 'transaksis.id_transaksi')
            ->join('produks', 'detail_transaksis.id_produk', '=', 'produks.id_produk')
            ->where('transaksis.id_user', $userId)
            ->when($request->filled('start_date'), fn ($q) => $q->where('transaksis.created_at', '>=', $from))
            ->when($request->filled('end_date'), fn ($q) => $q->where('transaksis.created_at', '<=', $to))
            ->groupBy('produks.id_produk', 'produks.nama', 'produks.foto')
            ->selectRaw('produks.id_produk, produks.nama, produks.foto, SUM(detail_transaksis.jumlah) as total_terjual')
            ->orderByDesc('total_terjual')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'id_produk' => $row->id_produk,
                'nama' => $row->nama,
                'total_terjual' => (int) $row->total_terjual,
                'foto_url' => Produk::fotoUrl($row->foto),
            ]);

        // --- Pesanan online menunggu (shop-wide, bukan per kasir) ---
        $pendingPesananCount = Pesanan::whereIn('status', ['pending', 'disiapkan'])->count();

        // --- Target omzet harian ---
        $targetHarian = self::TARGET_HARIAN;
        $targetPersen = $targetHarian > 0
            ? min(100, (int) round($todayRevenue / $targetHarian * 100))
            : 0;

        return Inertia::render('kasir/Dashboard', [
            'today_sales' => [
                'total_revenue' => $todayRevenue,
                'total_transactions' => $todayCount,
                'total_items' => $todayItems,
            ],
            'range_sales' => [
                'total_revenue' => $rangeRevenue,
                'total_transactions' => $rangeCount,
            ],
            'date_range' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'label' => $dateRangeLabel,
            ],
            'recent_transactions' => $recentTransactions,
            'payment_breakdown' => $paymentBreakdown,
            'low_stock' => $lowStock,
            'low_stock_count' => $lowStockCount,
            'active_promos' => $activePromos,
            'best_sellers' => $bestSellers,
            'pending_pesanan_count' => $pendingPesananCount,
            'target' => [
                'harian' => $targetHarian,
                'tercapai' => $todayRevenue,
                'persen' => $targetPersen,
            ],
        ]);
    }

    public function transaksi(): Response
    {
        $produks = Produk::query()
            ->with('kategori:id_kategori,nama_kategori')
            // Produk jasa (transfer/tarik tunai) punya alur sendiri (Fase 2), bukan grid biasa.
            ->where('tipe_jual', '!=', 'jasa')
            ->orderBy('nama')
            ->get()
            ->map(fn (Produk $produk) => [
                'id_produk' => $produk->id_produk,
                'nama' => $produk->nama,
                'kategori' => $produk->kategori?->nama_kategori,
                'harga_jual' => $produk->harga_jual,
                'potongan_reseller' => $produk->potongan_reseller,
                'stok' => $produk->stok,
                'tipe_jual' => $produk->tipe_jual,
                'satuan' => $produk->satuan,
                'barcode' => $produk->barcode,
                'foto' => $produk->foto,
                'foto_url' => Produk::fotoUrl($produk->foto),
            ]);

        // Produk "sering dibeli" untuk quick-pick (barang kecil tanpa barcode, mis. permen).
        // Top seller 30 hari terakhir, masih berstok & bukan jasa.
        $favoriteIds = DetailTransaksi::query()
            ->join('transaksis', 'detail_transaksis.id_transaksi', '=', 'transaksis.id_transaksi')
            ->join('produks', 'detail_transaksis.id_produk', '=', 'produks.id_produk')
            ->where('produks.tipe_jual', '!=', 'jasa')
            ->where('produks.stok', '>', 0)
            ->where('transaksis.created_at', '>=', now()->subDays(30))
            ->groupBy('detail_transaksis.id_produk')
            ->orderByRaw('SUM(detail_transaksis.jumlah) DESC')
            ->limit(8)
            ->pluck('detail_transaksis.id_produk')
            ->map(fn ($id) => (int) $id)
            ->all();

        // Saran awal pelanggan untuk pemilih di keranjang (default "Umum"); reseller dapat
        // potongan harga. Daftar penuh tidak di-preload — kasir mencari via endpoint
        // cariPelanggan() (server-side) agar tetap ringan walau pelanggan banyak.
        $pelanggans = $this->pelangganSuggestions();

        $now = now();
        $promos = Promo::with('produk')
            ->where('aktif', true)
            ->where('tanggal_mulai', '<=', $now)
            ->where('tanggal_selesai', '>=', $now)
            ->get()
            ->map(fn (Promo $promo) => [
                'id_promo' => $promo->id_promo,
                'nama' => $promo->nama,
                'deskripsi' => $promo->deskripsi,
                'tipe' => $promo->tipe,
                'nilai' => (float) $promo->nilai,
                'beli_qty' => $promo->beli_qty,
                'gratis_qty' => $promo->gratis_qty,
                'id_produk' => $promo->id_produk,
                'minimal_belanja' => $promo->minimal_belanja ? (float) $promo->minimal_belanja : null,
            ]);

        return Inertia::render('kasir/Transaksi', [
            'produks' => $produks,
            'favorite_ids' => $favoriteIds,
            'pelanggans' => $pelanggans,
            'promos' => $promos,
            // Produk jasa bisa ditambahkan ke keranjang yang sama (1 transaksi campuran).
            'layanan' => $this->jasaLayanan(),
        ]);
    }

    /**
     * Pencarian pelanggan server-side untuk pemilih di keranjang (live search).
     * Dipanggil via fetch dari halaman transaksi; query kosong → saran awal.
     */
    public function cariPelanggan(Request $request): JsonResponse
    {
        $query = trim((string) $request->query('q', ''));

        return response()->json([
            'pelanggans' => $this->pelangganSuggestions($query),
        ]);
    }

    /**
     * Daftar pelanggan untuk pemilih kasir. Tanpa kata kunci → 8 teratas (alfabet)
     * sebagai saran awal; dengan kata kunci → maksimal 20 yang cocok pada nama.
     */
    private function pelangganSuggestions(string $query = ''): Collection
    {
        return Pelanggan::query()
            ->when($query !== '', fn (Builder $builder) => $builder->where('nama', 'like', "%{$query}%"))
            ->orderBy('nama')
            ->limit($query === '' ? 8 : 20)
            ->get()
            ->map(fn (Pelanggan $pelanggan) => [
                'id_pelanggan' => $pelanggan->id_pelanggan,
                'nama' => $pelanggan->nama,
                'tipe' => $pelanggan->tipe,
            ]);
    }

    /** Daftar produk jasa + tarif fee bertingkat untuk pemilih layanan di kasir. */
    private function jasaLayanan(): Collection
    {
        return Produk::query()
            ->where('tipe_jual', 'jasa')
            ->with(['tarifJasas' => fn ($q) => $q->orderBy('min_nominal')])
            ->orderBy('nama')
            ->get()
            ->map(fn (Produk $produk) => [
                'id_produk' => $produk->id_produk,
                'nama' => $produk->nama,
                'satuan' => $produk->satuan,
                // Tarif fee bertingkat (kosong = fee diketik manual seperti sebelumnya).
                'tarifs' => $produk->tarifJasas
                    ->map(fn (TarifJasa $tarif) => [
                        'min_nominal' => (int) $tarif->min_nominal,
                        'fee' => (int) $tarif->fee,
                    ])
                    ->values(),
            ]);
    }

    public function store(Request $request, PesananService $pesananService): RedirectResponse
    {
        // Kasir bisa memilih menyimpan keranjang sebagai PESANAN (pending) alih-alih
        // langsung diproses — mis. pelanggan walk-in yang belum bayar. Default 'proses'.
        if ($request->input('mode') === 'pesanan') {
            return $this->simpanSebagaiPesanan($request, $pesananService);
        }

        $validated = $request->validate([
            'metode_pembayaran' => ['required', Rule::in(['cash', 'qris', 'transfer'])],
            'bayar' => ['required', 'integer', 'min:0'],
            'id_pelanggan' => ['nullable', 'exists:pelanggans,id_pelanggan'],
            // Promo keranjang tidak lagi dipilih manual — diterapkan otomatis di bawah.
            'items' => ['required', 'array', 'min:1'],
            'items.*.id_produk' => ['required', 'exists:produks,id_produk'],
            // numeric (bukan integer) agar produk curah bisa dijual pecahan (mis. 1.429 liter).
            'items.*.jumlah' => ['required', 'numeric', 'gt:0'],
            // Untuk produk curah: nominal rupiah yang dibayar (qty dihitung dari sini).
            // Untuk produk jasa: nominal = uang transfer/tarik (pass-through).
            'items.*.nominal' => ['nullable', 'integer', 'min:1'],
            // Untuk produk jasa: fee/biaya admin (satu-satunya pendapatan dari jasa).
            'items.*.fee' => ['nullable', 'integer', 'min:0'],
        ]);

        $transaksi = DB::transaction(function () use ($validated): Transaksi {
            $subtotal = 0;
            $totalNominalJasa = 0; // titipan transfer/tarik tunai: bukan omzet, tapi dibayar tunai
            $details = [];
            $now = now();

            $activePromos = Promo::where('aktif', true)
                ->where('tanggal_mulai', '<=', $now)
                ->where('tanggal_selesai', '>=', $now)
                ->get();

            // Reseller dapat potongan harga rupiah per produk.
            $pelanggan = ! empty($validated['id_pelanggan'])
                ? Pelanggan::find($validated['id_pelanggan'])
                : null;
            $isReseller = $pelanggan?->tipe === 'reseller';

            foreach ($validated['items'] as $item) {
                $produk = Produk::lockForUpdate()->findOrFail($item['id_produk']);
                // Harga efektif: reseller dipotong per produk; jasa pakai fee (di-override di bawah).
                $harga = $isReseller
                    ? max(0, $produk->harga_jual - $produk->potongan_reseller)
                    : $produk->harga_jual;
                $nominalRef = null; // diisi hanya untuk jasa (pass-through)

                if ($produk->tipe_jual === 'jasa') {
                    // Jasa (transfer/tarik tunai): TANPA stok. Omzet = fee saja.
                    // Nominal pokok hanya pass-through (titipan), TIDAK masuk omzet.
                    $nominalRef = (int) ($item['nominal'] ?? 0);

                    if ($nominalRef <= 0) {
                        throw ValidationException::withMessages([
                            'items' => "Masukkan nominal transfer/tarik untuk {$produk->nama}.",
                        ]);
                    }

                    // Bila layanan punya tarif bertingkat, fee DIHITUNG ULANG dari tabel
                    // berdasarkan nominal (anti salah ketik/manipulasi — fee = omzet toko).
                    // Tanpa tarif, fee tetap diketik manual seperti sebelumnya.
                    $tarifFee = $produk->resolveFeeJasa($nominalRef);

                    if ($tarifFee !== null) {
                        $fee = $tarifFee;
                    } else {
                        $fee = (int) ($item['fee'] ?? 0);

                        if ($fee <= 0) {
                            throw ValidationException::withMessages([
                                'items' => "Masukkan biaya admin (fee) untuk {$produk->nama}.",
                            ]);
                        }
                    }

                    $qty = 1;
                    $harga = $fee;
                    $itemSubtotal = $fee;

                    $subtotal += $itemSubtotal; // hanya fee yang masuk omzet
                    $totalNominalJasa += $nominalRef; // titipan dibayar tunai oleh pelanggan

                    $details[] = [
                        'produk' => $produk,
                        'jumlah' => $qty,
                        'harga' => $harga,
                        'modal' => 0, // jasa tidak punya HPP
                        'subtotal_after_promo' => $itemSubtotal,
                        'item_diskon' => 0, // promo tidak berlaku untuk fee jasa
                        'nominal' => $nominalRef,
                        'is_jasa' => true,
                    ];

                    continue;
                }

                if ($produk->tipe_jual === 'curah') {
                    // Curah (bensin/bawang): kasir input NOMINAL rupiah → qty = nominal ÷ harga/satuan.
                    // subtotal = nominal persis; qty (3 desimal) dipakai untuk potong stok & HPP.
                    $nominal = (int) ($item['nominal'] ?? 0);

                    if ($nominal <= 0) {
                        throw ValidationException::withMessages([
                            'items' => "Masukkan nominal pembelian untuk {$produk->nama}.",
                        ]);
                    }

                    if ($harga <= 0) {
                        throw ValidationException::withMessages([
                            'items' => "Harga per {$produk->satuan} untuk {$produk->nama} belum diatur.",
                        ]);
                    }

                    $qty = round($nominal / $harga, 3);
                    $itemSubtotal = $nominal;
                } else {
                    $qty = (float) $item['jumlah'];
                    $itemSubtotal = (int) round($harga * $qty);
                }

                if ($produk->stok < $qty) {
                    throw ValidationException::withMessages([
                        'items' => "Stok {$produk->nama} tidak mencukupi (tersedia: {$produk->stok} {$produk->satuan}).",
                    ]);
                }

                $subtotal += $itemSubtotal;

                // Cari promo spesifik produk
                $prodPromo = $activePromos->where('id_produk', $produk->id_produk)->first();
                $itemDiskon = 0;
                if ($prodPromo) {
                    if ($prodPromo->tipe === 'persen') {
                        // Diskon persen tidak lagi dibuat dari form, tapi promo lama
                        // tetap dihormati agar data historis konsisten.
                        $itemDiskon = (int) ($itemSubtotal * ($prodPromo->nilai / 100));
                    } elseif ($prodPromo->tipe === 'bundling') {
                        // Beli X gratis Y — hanya untuk produk satuan (qty bilangan bulat).
                        $grup = (int) $prodPromo->beli_qty + (int) $prodPromo->gratis_qty;

                        if ($produk->tipe_jual === 'satuan' && $grup > 0 && $prodPromo->gratis_qty > 0) {
                            $gratis = intdiv((int) floor($qty), $grup) * (int) $prodPromo->gratis_qty;
                            $itemDiskon = (int) ($gratis * $harga);
                        }
                    } else {
                        // nominal
                        $itemDiskon = (int) ($prodPromo->nilai * $qty);
                    }
                }

                $details[] = [
                    'produk' => $produk,
                    'jumlah' => $qty,
                    'harga' => $harga,
                    'modal' => $produk->harga_modal, // snapshot HPP/unit saat terjual
                    'subtotal_after_promo' => max(0, $itemSubtotal - $itemDiskon),
                    'item_diskon' => $itemDiskon,
                ];
            }

            // Promo keranjang (global, id_produk null) diterapkan OTOMATIS: dari promo
            // aktif yang syarat minimal belanjanya terpenuhi, pilih yang diskonnya
            // paling besar untuk pelanggan. Kasir tidak perlu memilih manual.
            $globalDiskon = 0;
            $appliedPromoId = null;

            foreach ($activePromos->whereNull('id_produk') as $globalPromo) {
                if ($globalPromo->minimal_belanja && $subtotal < $globalPromo->minimal_belanja) {
                    continue;
                }

                $diskon = $globalPromo->tipe === 'persen'
                    ? (int) ($subtotal * ($globalPromo->nilai / 100))
                    : (int) $globalPromo->nilai;

                if ($diskon > $globalDiskon) {
                    $globalDiskon = $diskon;
                    $appliedPromoId = $globalPromo->id_promo;
                }
            }

            $totalDiskon = $globalDiskon + collect($details)->sum('item_diskon');
            $totalHarga = max(0, $subtotal - $totalDiskon); // omzet (produk + fee jasa), TANPA nominal titipan

            // Tagihan tunai = omzet + nominal titipan jasa. Pelanggan membayar nominal
            // transfer/tarik tunai secara tunai juga, jadi kembalian dihitung dari tagihan
            // ini (bukan dari omzet). Nominal tetap BUKAN omzet — hanya lapisan kas.
            $totalTagihan = $totalHarga + $totalNominalJasa;

            if ($validated['bayar'] < $totalTagihan) {
                throw ValidationException::withMessages([
                    'bayar' => 'Jumlah bayar kurang dari total tagihan.',
                ]);
            }

            $transaksi = Transaksi::create([
                'id_user' => Auth::id(),
                'id_pelanggan' => $pelanggan?->id_pelanggan,
                'id_promo' => $appliedPromoId,
                'total_harga' => $totalHarga,
                'diskon' => $totalDiskon,
                'metode_pembayaran' => $validated['metode_pembayaran'],
                'bayar' => $validated['bayar'],
                'kembalian' => $validated['bayar'] - $totalTagihan,
            ]);

            foreach ($details as $detail) {
                DetailTransaksi::create([
                    'id_transaksi' => $transaksi->id_transaksi,
                    'id_produk' => $detail['produk']->id_produk,
                    'jumlah' => $detail['jumlah'],
                    'harga' => $detail['harga'],
                    'modal' => $detail['modal'],
                    'subtotal' => $detail['subtotal_after_promo'],
                    'nominal' => $detail['nominal'] ?? null,
                ]);

                // Jasa tidak menyentuh stok (tanpa kartu stok).
                if (! empty($detail['is_jasa'])) {
                    continue;
                }

                // Kurangi stok + catat ke kartu stok (produk masih terkunci dari loop validasi).
                $detail['produk']->terapkanMutasiStok(
                    -(float) $detail['jumlah'],
                    'jual',
                    [
                        'keterangan' => 'Penjualan TRX-'.$transaksi->id_transaksi,
                        'ref_tipe' => 'Transaksi',
                        'id_referensi' => $transaksi->id_transaksi,
                        'id_user' => Auth::id(),
                    ]
                );
            }

            return $transaksi;
        });

        // Kirim data struk transaksi yang baru ke halaman kasir agar muncul modal
        // "Transaksi Selesai" (opsi cetak struk / selesai). Kasir tetap di halaman
        // kasir, siap melayani transaksi berikutnya.
        $transaksi->load(['detailTransaksis.produk', 'promo']);
        Inertia::flash('struk', $this->mapRiwayat($transaksi));

        return redirect()->route('kasir.transaksi')->with('success', 'Transaksi berhasil disimpan.');
    }

    /**
     * Simpan keranjang kasir sebagai PESANAN pending (reserve stok) — untuk
     * pelanggan walk-in yang belum bayar. Hanya produk satuan yang didukung.
     */
    private function simpanSebagaiPesanan(Request $request, PesananService $service): RedirectResponse
    {
        $validated = $request->validate([
            'nama_pelanggan' => ['required', 'string', 'max:100'],
            'telp' => ['required', 'string', 'max:30', 'regex:/^[0-9+\-\s()]{6,}$/'],
            'catatan' => ['nullable', 'string', 'max:500'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id_produk' => ['required', 'exists:produks,id_produk'],
            'items.*.jumlah' => ['required', 'integer', 'min:1'],
        ], [
            'telp.regex' => 'Nomor WhatsApp tidak valid.',
            'nama_pelanggan.required' => 'Nama pemesan wajib diisi untuk pesanan.',
        ]);

        try {
            $pesanan = $service->buat([
                'nama' => $validated['nama_pelanggan'],
                'telp' => $validated['telp'],
                'catatan' => $validated['catatan'] ?? null,
                'sumber' => 'kasir',
                'items' => $validated['items'],
            ], Auth::id());
        } catch (ValidationException $e) {
            Inertia::flash('toast', ['type' => 'error', 'message' => $e->validator->errors()->first()]);

            return back();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => "Pesanan {$pesanan->kode} tersimpan & stok di-reserve."]);

        return redirect()->route('kasir.pesanan');
    }

    /** Opsi jumlah baris per halaman pada riwayat transaksi kasir. */
    private const RIWAYAT_PER_PAGE = [5, 10, 25, 50, 100];

    public function riwayat(Request $request): Response
    {
        $perPage = (int) $request->query('per_page', 10);

        if (! in_array($perPage, self::RIWAYAT_PER_PAGE, true)) {
            $perPage = 10;
        }

        // Stats dihitung agregat di DB atas seluruh rentang tanggal (lintas halaman),
        // bukan dari data halaman aktif — agar kartu ringkasan tetap akurat saat dipaginasi.
        $totalPenjualan = $this->riwayatBaseQuery($request)->sum('total_harga');
        $totalTransaksi = $this->riwayatBaseQuery($request)->count();

        $transaksis = $this->applyRiwayatSearch(
            $this->riwayatBaseQuery($request)->with(['detailTransaksis.produk', 'promo']),
            $request->query('search'),
        )
            ->latest()
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (Transaksi $transaksi) => $this->mapRiwayat($transaksi));

        return Inertia::render('kasir/Riwayat', [
            'transaksis' => $transaksis,
            'stats' => [
                'total_penjualan' => $totalPenjualan,
                'total_transaksi' => $totalTransaksi,
                'total_struk' => $totalTransaksi,
            ],
            'filters' => [
                'start_date' => $request->query('start_date', ''),
                'end_date' => $request->query('end_date', ''),
                'search' => $request->query('search', ''),
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Data lengkap riwayat (tanpa paginasi) untuk "Cetak Laporan Sesi".
     * Hanya dipanggil saat kasir menekan tombol cetak, mengikuti filter aktif.
     */
    public function riwayatCetak(Request $request): JsonResponse
    {
        $transaksis = $this->applyRiwayatSearch(
            $this->riwayatBaseQuery($request)->with(['detailTransaksis.produk', 'promo']),
            $request->query('search'),
        )
            ->latest()
            ->get()
            ->map(fn (Transaksi $transaksi) => $this->mapRiwayat($transaksi))
            ->values();

        return response()->json(['transaksis' => $transaksis]);
    }

    /** Query dasar riwayat milik kasir aktif dengan filter rentang tanggal. */
    private function riwayatBaseQuery(Request $request): Builder
    {
        $query = Transaksi::query()->where('id_user', Auth::id());

        if ($request->filled('start_date')) {
            $query->where('created_at', '>=', Carbon::parse($request->query('start_date'))->startOfDay());
        }

        if ($request->filled('end_date')) {
            $query->where('created_at', '<=', Carbon::parse($request->query('end_date'))->endOfDay());
        }

        return $query;
    }

    /** Filter pencarian: kode transaksi (TRX-{id}) atau metode pembayaran. */
    private function applyRiwayatSearch(Builder $query, ?string $search): Builder
    {
        $search = trim((string) $search);

        if ($search === '') {
            return $query;
        }

        $digits = preg_replace('/\D/', '', $search);

        return $query->where(function (Builder $q) use ($search, $digits) {
            $q->where('metode_pembayaran', 'like', "%{$search}%");

            if ($digits !== '') {
                $q->orWhere('id_transaksi', (int) $digits);
            }
        });
    }

    /** Bentuk payload satu transaksi untuk tabel & struk riwayat. */
    private function mapRiwayat(Transaksi $transaksi): array
    {
        return [
            'id_transaksi' => $transaksi->id_transaksi,
            'kode' => 'TRX-'.$transaksi->id_transaksi,
            'jumlah_item' => $transaksi->detailTransaksis->sum('jumlah'),
            'total_harga' => $transaksi->total_harga,
            'diskon' => $transaksi->diskon,
            'promo_nama' => $transaksi->promo?->nama,
            'metode_pembayaran' => $transaksi->metode_pembayaran,
            'bayar' => $transaksi->bayar,
            'kembalian' => $transaksi->kembalian,
            'created_at' => $transaksi->created_at,
            'waktu' => Carbon::parse($transaksi->created_at)->translatedFormat('H:i \W\I\T\A'),
            'tanggal' => Carbon::parse($transaksi->created_at)->translatedFormat('d M Y'),
            'details' => $transaksi->detailTransaksis->map(fn ($detail) => [
                'nama_produk' => $detail->produk?->nama ?? '- ',
                'jumlah' => $detail->jumlah,
                'harga' => $detail->harga,
                'subtotal' => $detail->subtotal,
                'nominal' => $detail->nominal, // pass-through jasa (null bila bukan jasa)
                'foto' => $detail->produk?->foto ?? null,
                'foto_url' => Produk::fotoUrl($detail->produk?->foto),
            ])->values(),
        ];
    }
}
