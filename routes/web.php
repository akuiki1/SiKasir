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
    });

    Route::middleware(['role:kasir'])->group(function () {
        Route::inertia('kasir/dashboard', 'kasir/Dashboard')->name('kasir.dashboard');
    });
});

require __DIR__.'/settings.php';
