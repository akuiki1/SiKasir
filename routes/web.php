<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\KasirController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\PengeluaranController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\PromoController;
use App\Http\Controllers\TransaksiController;
use App\Models\Produk;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $bestSellers = Produk::select(
        'produks.id_produk',
        'produks.nama',
        'produks.harga_jual',
        'produks.foto'
    )
        ->selectRaw('COALESCE(SUM(detail_transaksis.jumlah), 0) as total_terjual')
        ->leftJoin('detail_transaksis', 'produks.id_produk', '=', 'detail_transaksis.id_produk')
        ->groupBy('produks.id_produk', 'produks.nama', 'produks.harga_jual', 'produks.foto')
        ->orderByDesc('total_terjual')
        ->take(5)
        ->get()
        ->map(fn ($p) => [
            'id_produk'     => $p->id_produk,
            'nama'          => $p->nama,
            'harga_jual'    => $p->harga_jual,
            'foto_url'      => $p->foto ? asset("storage/{$p->foto}") : null,
            'total_terjual' => (int) $p->total_terjual,
        ]);

    $allProducts = Produk::with('kategori')
        ->orderBy('nama')
        ->get()
        ->map(fn (Produk $p) => [
            'id_produk'  => $p->id_produk,
            'nama'       => $p->nama,
            'kategori'   => $p->kategori?->nama_kategori,
            'harga_jual' => $p->harga_jual,
            'stok'       => $p->stok,
            'foto_url'   => $p->foto ? asset("storage/{$p->foto}") : null,
        ]);

    return Inertia::render('Welcome', [
        'bestSellers' => $bestSellers,
        'allProducts' => $allProducts,
    ]);
})->name('home');

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

        // Produk
        Route::get('admin/products', [ProdukController::class, 'index'])->name('admin.products');
        Route::post('admin/products', [ProdukController::class, 'store'])->name('admin.products.store');
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

        // Promo
        Route::get('admin/promos', [PromoController::class, 'index'])->name('admin.promos');
        Route::post('admin/promos', [PromoController::class, 'store'])->name('admin.promos.store');
        Route::put('admin/promos/{promo}', [PromoController::class, 'update'])->name('admin.promos.update');
        Route::delete('admin/promos/{promo}', [PromoController::class, 'destroy'])->name('admin.promos.destroy');
    });

    Route::middleware(['role:kasir'])->group(function () {
        Route::get('kasir/dashboard', [KasirController::class, 'dashboard'])->name('kasir.dashboard');
        Route::get('kasir/transaksi', [KasirController::class, 'transaksi'])->name('kasir.transaksi');
        Route::post('kasir/transaksi', [KasirController::class, 'store'])->name('kasir.transaksi.store');
        Route::get('kasir/riwayat', [KasirController::class, 'riwayat'])->name('kasir.riwayat');
    });
});

require __DIR__.'/settings.php';
