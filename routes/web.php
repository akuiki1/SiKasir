<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LaporanController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\KasirController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\PengeluaranController;
use App\Http\Controllers\PesananController;
use App\Http\Controllers\PesananPublikController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\ProduksiController;
use App\Http\Controllers\PromoController;
use App\Http\Controllers\StokController;
use App\Http\Controllers\TransaksiController;
use App\Models\Produk;
use App\Models\Promo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $now = now();

    // Promo aktif yang masih berlaku & spesifik per produk (bukan promo global "Semua Produk").
    $activePromos = Promo::where('aktif', true)
        ->whereNotNull('id_produk')
        ->where('tanggal_mulai', '<=', $now)
        ->where('tanggal_selesai', '>=', $now)
        ->orderBy('tanggal_selesai')
        ->get()
        ->groupBy('id_produk');

    // Bentuk keterangan promo (jenis diskon + harga akhir + sisa berlaku) untuk sebuah produk.
    // Harga promo dihitung di server agar konsisten dengan klien (hindari hydration mismatch).
    $promoFor = function (int $idProduk, $hargaJual = null) use ($activePromos, $now): ?array {
        $promo = $activePromos->get($idProduk)?->first();

        if (! $promo) {
            return null;
        }

        $sisaHari = (int) ceil(($promo->tanggal_selesai->getTimestamp() - $now->getTimestamp()) / 86400);

        $label = $promo->tipe === 'persen'
            ? 'Diskon '.rtrim(rtrim(number_format($promo->nilai, 2, ',', '.'), '0'), ',').'%'
            : 'Diskon Rp'.number_format($promo->nilai, 0, ',', '.');

        // Harga akhir setelah diskon (untuk tampilan harga coret).
        $hargaPromo = null;

        if ($hargaJual !== null) {
            $harga = (float) $hargaJual;
            $potongan = $promo->tipe === 'persen'
                ? $harga * ((float) $promo->nilai / 100)
                : (float) $promo->nilai;
            $hargaPromo = (int) round(max(0, $harga - $potongan));
        }

        return [
            'nama' => $promo->nama,
            'label' => $label,
            'tipe' => $promo->tipe,
            'nilai' => (float) $promo->nilai,
            'harga_promo' => $hargaPromo,
            'sisa_hari' => max(0, $sisaHari),
            // Sertakan jam akhir hari agar hitung mundur di klien presisi sampai detik.
            'tanggal_selesai' => $promo->tanggal_selesai->format('Y-m-d'),
            'berakhir_pada' => $promo->tanggal_selesai->copy()->endOfDay()->toIso8601String(),
        ];
    };

    $bestSellers = Produk::select(
        'produks.id_produk',
        'produks.nama',
        'produks.harga_jual',
        'produks.stok',
        'produks.foto'
    )
        ->selectRaw('COALESCE(SUM(detail_transaksis.jumlah), 0) as total_terjual')
        ->leftJoin('detail_transaksis', 'produks.id_produk', '=', 'detail_transaksis.id_produk')
        // Storefront berbasis qty: hanya produk satuan yang bisa dipesan/dibeli online.
        ->where('produks.tipe_jual', 'satuan')
        ->groupBy('produks.id_produk', 'produks.nama', 'produks.harga_jual', 'produks.stok', 'produks.foto')
        ->orderByDesc('total_terjual')
        // Ambil kandidat lebih banyak dari yang ditampilkan supaya produk
        // berfoto bisa "naik" ke etalase walau peringkat penjualannya sedikit
        // di bawah — tapi tetap dibatasi ke 10 terlaris agar kartu yang tampil
        // selalu produk yang benar-benar laku (badge "Best seller" tak nyasar).
        ->take(10)
        ->get()
        // Kurasi etalase: di antara 10 terlaris, produk berfoto tampil lebih
        // dulu (tetap urut penjualan dalam tiap grup), lalu ambil 5 teratas.
        // Tujuannya carousel landing tampil maksimal sekaligus jadi insentif
        // owner mengunggah foto produk unggulannya.
        ->sortByDesc(fn ($p) => [$p->foto ? 1 : 0, (int) $p->total_terjual])
        ->take(5)
        ->values()
        ->map(fn ($p) => [
            'id_produk' => $p->id_produk,
            'nama' => $p->nama,
            'harga_jual' => $p->harga_jual,
            'stok' => (int) $p->stok,
            'foto_url' => Produk::fotoUrl($p->foto),
            'total_terjual' => (int) $p->total_terjual,
            'promo' => $promoFor($p->id_produk, $p->harga_jual),
        ]);

    $allProducts = Produk::with('kategori')
        ->where('tipe_jual', 'satuan')
        ->orderBy('nama')
        ->get()
        ->map(fn (Produk $p) => [
            'id_produk' => $p->id_produk,
            'nama' => $p->nama,
            'kategori' => $p->kategori?->nama_kategori,
            'harga_jual' => $p->harga_jual,
            'stok' => $p->stok,
            'foto_url' => Produk::fotoUrl($p->foto),
            'promo' => $promoFor($p->id_produk, $p->harga_jual),
        ])
        // Produk berfoto tampil paling atas, lalu yang sedang promo; urutan nama
        // tetap dalam tiap grup (sort PHP 8 stabil). Konsisten dengan etalase
        // best seller: produk berfoto selalu lebih dulu muncul di landing.
        ->sortBy(fn ($p) => [
            $p['foto_url'] === null ? 1 : 0,
            $p['promo'] === null ? 1 : 0,
        ])
        ->values();

    return Inertia::render('Welcome', [
        'bestSellers' => $bestSellers,
        'allProducts' => $allProducts,
    ]);
})->name('home');

// Pesanan online dari storefront (publik). Throttle untuk cegah penyalahgunaan.
Route::post('pesan', [PesananPublikController::class, 'store'])
    ->middleware('throttle:15,1')
    ->name('pesan.store');

// Lacak pesanan publik berdasarkan nomor WhatsApp (pelanggan cek status sendiri).
Route::post('lacak-pesanan', [PesananPublikController::class, 'lacak'])
    ->middleware('throttle:30,1')
    ->name('pesan.lacak');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        if (Auth::user()?->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('kasir.dashboard');
    })->name('dashboard');

    Route::middleware(['role:admin'])->group(function () {
        Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
        // Users
        Route::get('admin/users', [UserController::class, 'index'])->name('admin.users');
        Route::post('admin/users', [UserController::class, 'store'])->name('admin.users.store');
        Route::put('admin/users/{user}', [UserController::class, 'update'])->name('admin.users.update');
        Route::delete('admin/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');

        // Kategori
        Route::get('admin/kategori', [KategoriController::class, 'index'])->name('admin.kategori');
        Route::post('admin/kategori', [KategoriController::class, 'store'])->name('admin.kategori.store');
        Route::put('admin/kategori/{kategori}', [KategoriController::class, 'update'])->name('admin.kategori.update');
        Route::delete('admin/kategori/{kategori}', [KategoriController::class, 'destroy'])->name('admin.kategori.destroy');

        // Pelanggan (umum & reseller)
        Route::get('admin/pelanggan', [PelangganController::class, 'index'])->name('admin.pelanggan');
        Route::post('admin/pelanggan', [PelangganController::class, 'store'])->name('admin.pelanggan.store');
        Route::put('admin/pelanggan/{pelanggan}', [PelangganController::class, 'update'])->name('admin.pelanggan.update');
        Route::delete('admin/pelanggan/{pelanggan}', [PelangganController::class, 'destroy'])->name('admin.pelanggan.destroy');

        // Produk
        Route::get('admin/products', [ProdukController::class, 'index'])->name('admin.products');
        Route::post('admin/products', [ProdukController::class, 'store'])->name('admin.products.store');
        Route::post('admin/products/generate-all-barcodes', [ProdukController::class, 'generateAllBarcodes'])->name('admin.products.generate-all');
        Route::post('admin/products/{produk}/restore', [ProdukController::class, 'restore'])->name('admin.products.restore');
        Route::delete('admin/products/{produk}/force', [ProdukController::class, 'hapusPermanen'])->name('admin.products.force-delete');
        Route::put('admin/products/{produk}', [ProdukController::class, 'update'])->name('admin.products.update');
        Route::delete('admin/products/{produk}', [ProdukController::class, 'destroy'])->name('admin.products.destroy');

        // Transaksi
        Route::get('admin/transactions', [TransaksiController::class, 'index'])->name('admin.transactions');
        Route::post('admin/transactions', [TransaksiController::class, 'store'])->name('admin.transactions.store');
        Route::put('admin/transactions/{transaksi}', [TransaksiController::class, 'update'])->name('admin.transactions.update');
        Route::delete('admin/transactions/{transaksi}', [TransaksiController::class, 'destroy'])->name('admin.transactions.destroy');

        // Pengeluaran
        Route::get('admin/pengeluarans', [PengeluaranController::class, 'index'])->name('admin.pengeluarans');
        Route::post('admin/pengeluarans', [PengeluaranController::class, 'store'])->name('admin.pengeluarans.store');
        Route::put('admin/pengeluarans/{pengeluaran}', [PengeluaranController::class, 'update'])->name('admin.pengeluarans.update');
        Route::delete('admin/pengeluarans/{pengeluaran}', [PengeluaranController::class, 'destroy'])->name('admin.pengeluarans.destroy');

        // Manajemen Stok (kartu stok, stok masuk/keluar, opname)
        Route::get('admin/stok', [StokController::class, 'index'])->name('admin.stok');
        Route::post('admin/stok/masuk', [StokController::class, 'masuk'])->name('admin.stok.masuk');
        Route::post('admin/stok/keluar', [StokController::class, 'keluar'])->name('admin.stok.keluar');
        Route::post('admin/stok/penyesuaian', [StokController::class, 'penyesuaian'])->name('admin.stok.penyesuaian');

        // Produksi (batch costing produk buatan sendiri)
        Route::get('admin/produksi', [ProduksiController::class, 'index'])->name('admin.produksi');
        Route::post('admin/produksi', [ProduksiController::class, 'store'])->name('admin.produksi.store');
        Route::delete('admin/produksi/{produksi}', [ProduksiController::class, 'destroy'])->name('admin.produksi.destroy');

        // Laporan / Analisis
        Route::get('admin/laporan/keuangan', [LaporanController::class, 'keuangan'])->name('admin.laporan.keuangan');
        Route::get('admin/laporan/penjualan', [LaporanController::class, 'penjualan'])->name('admin.laporan.penjualan');
        Route::get('admin/laporan/inventaris', [LaporanController::class, 'inventaris'])->name('admin.laporan.inventaris');
        Route::get('admin/laporan/pelanggan', [LaporanController::class, 'pelanggan'])->name('admin.laporan.pelanggan');

        // Promo
        Route::get('admin/promos', [PromoController::class, 'index'])->name('admin.promos');
        Route::post('admin/promos', [PromoController::class, 'store'])->name('admin.promos.store');
        Route::put('admin/promos/{promo}', [PromoController::class, 'update'])->name('admin.promos.update');
        Route::delete('admin/promos/{promo}', [PromoController::class, 'destroy'])->name('admin.promos.destroy');

        // Pesanan online (kelola dari sisi admin — komponen sama dengan kasir)
        Route::get('admin/pesanan', [PesananController::class, 'index'])->name('admin.pesanan');
        Route::post('admin/pesanan/{pesanan}/siap', [PesananController::class, 'siap'])->name('admin.pesanan.siap');
        Route::post('admin/pesanan/{pesanan}/edit', [PesananController::class, 'edit'])->name('admin.pesanan.edit');
        Route::post('admin/pesanan/{pesanan}/proses', [PesananController::class, 'proses'])->name('admin.pesanan.proses');
        Route::post('admin/pesanan/{pesanan}/batal', [PesananController::class, 'batal'])->name('admin.pesanan.batal');
    });

    Route::middleware(['role:kasir'])->group(function () {
        Route::get('kasir/dashboard', [KasirController::class, 'dashboard'])->name('kasir.dashboard');
        Route::get('kasir/transaksi', [KasirController::class, 'transaksi'])->name('kasir.transaksi');
        Route::get('kasir/pelanggan/cari', [KasirController::class, 'cariPelanggan'])->name('kasir.pelanggan.cari');
        Route::post('kasir/transaksi', [KasirController::class, 'store'])->name('kasir.transaksi.store');
        Route::get('kasir/riwayat', [KasirController::class, 'riwayat'])->name('kasir.riwayat');
        Route::get('kasir/riwayat/cetak', [KasirController::class, 'riwayatCetak'])->name('kasir.riwayat.cetak');

        // Pesanan online (pending) — proses pembayaran saat pelanggan ambil barang.
        Route::get('kasir/pesanan', [PesananController::class, 'index'])->name('kasir.pesanan');
        Route::post('kasir/pesanan/{pesanan}/siap', [PesananController::class, 'siap'])->name('kasir.pesanan.siap');
        Route::post('kasir/pesanan/{pesanan}/edit', [PesananController::class, 'edit'])->name('kasir.pesanan.edit');
        Route::post('kasir/pesanan/{pesanan}/proses', [PesananController::class, 'proses'])->name('kasir.pesanan.proses');
        Route::post('kasir/pesanan/{pesanan}/batal', [PesananController::class, 'batal'])->name('kasir.pesanan.batal');
    });
});

require __DIR__.'/settings.php';
