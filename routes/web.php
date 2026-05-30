<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        if (auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('kasir.dashboard');
    })->name('dashboard');

    Route::middleware(['role:admin'])->group(function () {
        Route::inertia('admin/dashboard', 'admin/Dashboard')->name('admin.dashboard');
        Route::inertia('admin/users', 'admin/Users')->name('admin.users');
        Route::inertia('admin/kategori', 'admin/Kategori')->name('admin.kategori');
        Route::inertia('admin/products', 'admin/Products')->name('admin.products');
        Route::inertia('admin/transactions', 'admin/Transactions')->name('admin.transactions');
    });

    Route::middleware(['role:kasir'])->group(function () {
        Route::inertia('kasir/dashboard', 'kasir/Dashboard')->name('kasir.dashboard');
        Route::inertia('kasir/transaksi', 'kasir/Transaksi')->name('kasir.transaksi');
        Route::inertia('kasir/riwayat', 'kasir/Riwayat')->name('kasir.riwayat');
    });
});

require __DIR__.'/settings.php';
