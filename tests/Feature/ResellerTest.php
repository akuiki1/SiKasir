<?php

use App\Models\Pelanggan;
use App\Models\Produk;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Reseller & pelanggan — potongan rupiah per produk saat checkout.
|--------------------------------------------------------------------------
*/

test('a reseller customer gets the per-product rupiah discount', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $reseller = Pelanggan::create(['nama' => 'Toko Budi', 'tipe' => 'reseller']);
    $produk = Produk::factory()->create([
        'harga_jual' => 10000,
        'harga_modal' => 6000,
        'potongan_reseller' => 2000,
        'stok' => 10,
    ]);

    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 20000,
        'id_pelanggan' => $reseller->id_pelanggan,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    // harga reseller = 10.000 - 2.000 = 8.000 ; subtotal 2x = 16.000
    $this->assertDatabaseHas('transaksis', [
        'id_pelanggan' => $reseller->id_pelanggan,
        'total_harga' => 16000,
        'kembalian' => 4000,
    ]);
    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $produk->id_produk,
        'harga' => 8000,   // harga efektif di-snapshot
        'subtotal' => 16000,
        'modal' => 6000,   // HPP tetap → laba akurat
    ]);
});

test('an umum customer pays full price even when potongan_reseller is set', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $umum = Pelanggan::create(['nama' => 'Pak Andi', 'tipe' => 'umum']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'potongan_reseller' => 2000, 'stok' => 10]);

    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 20000,
        'id_pelanggan' => $umum->id_pelanggan,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    $this->assertDatabaseHas('transaksis', ['total_harga' => 20000]);
    $this->assertDatabaseHas('detail_transaksis', ['harga' => 10000, 'subtotal' => 20000]);
});

test('reseller price never goes below zero', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $reseller = Pelanggan::create(['nama' => 'Toko X', 'tipe' => 'reseller']);
    $produk = Produk::factory()->create(['harga_jual' => 5000, 'potongan_reseller' => 9000, 'stok' => 10]);

    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 0,
        'id_pelanggan' => $reseller->id_pelanggan,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 1],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    $this->assertDatabaseHas('detail_transaksis', ['harga' => 0, 'subtotal' => 0]);
});

test('admin can register a reseller', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)->post(route('admin.pelanggan.store'), [
        'nama' => 'Toko Maju Jaya',
        'telp' => '081234567890',
        'tipe' => 'reseller',
    ])->assertRedirect(route('admin.pelanggan'));

    $this->assertDatabaseHas('pelanggans', ['nama' => 'Toko Maju Jaya', 'tipe' => 'reseller']);
});

test('the kasir transaksi page exposes registered pelanggans', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    Pelanggan::create(['nama' => 'Reseller A', 'tipe' => 'reseller']);

    $this->actingAs($kasir)->get(route('kasir.transaksi'))->assertInertia(
        fn ($page) => $page->component('kasir/Transaksi')->has('pelanggans', 1)
    );
});

test('kasir cannot access the admin pelanggan page', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);

    $this->actingAs($kasir)->get(route('admin.pelanggan'))->assertForbidden();
});
