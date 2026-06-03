<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\KasirController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\TransaksiController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome')->name('home');

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
    });

    Route::middleware(['role:kasir'])->group(function () {
        Route::inertia('kasir/dashboard', 'kasir/Dashboard')->name('kasir.dashboard');
        Route::get('kasir/transaksi', [KasirController::class, 'transaksi'])->name('kasir.transaksi');
        Route::post('kasir/transaksi', [KasirController::class, 'store'])->name('kasir.transaksi.store');
        Route::get('kasir/riwayat', [KasirController::class, 'riwayat'])->name('kasir.riwayat');
    });
});

require __DIR__.'/settings.php';
