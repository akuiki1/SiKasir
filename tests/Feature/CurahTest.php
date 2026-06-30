<?php

use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Produk curah (bensin/bawang) — input rupiah, subtotal = nominal persis.
|--------------------------------------------------------------------------
*/

test('selling a curah product by nominal charges the exact nominal and drops stock by computed qty', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $bensin = Produk::factory()->create([
        'tipe_jual' => 'curah',
        'satuan' => 'liter',
        'harga_jual' => 14000,
        'harga_modal' => 13000,
        'stok' => 100,
    ]);

    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 20000,
        'items' => [
            // Kasir input nominal 20.000; qty (client) hanya referensi, server hitung ulang.
            ['id_produk' => $bensin->id_produk, 'jumlah' => 1.429, 'nominal' => 20000],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    // subtotal/total = nominal persis (bukan qty × harga yang bisa meleset recehan).
    $this->assertDatabaseHas('transaksis', [
        'total_harga' => 20000,
        'kembalian' => 0,
    ]);
    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $bensin->id_produk,
        'subtotal' => 20000,
        'modal' => 13000, // HPP/liter di-snapshot
    ]);

    // qty = round(20000 / 14000, 3) = 1.429 ; stok = 100 - 1.429 = 98.571
    $detail = DetailTransaksi::first();
    expect((float) $detail->jumlah)->toEqualWithDelta(1.429, 0.0001);
    expect((float) $bensin->fresh()->stok)->toEqualWithDelta(98.571, 0.0001);

    // Kartu stok mencatat mutasi penjualan curah.
    $this->assertDatabaseHas('stok_mutasis', [
        'id_produk' => $bensin->id_produk,
        'tipe' => 'jual',
    ]);
});

test('selling a curah product without a nominal is rejected', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $bensin = Produk::factory()->create([
        'tipe_jual' => 'curah',
        'satuan' => 'liter',
        'harga_jual' => 14000,
        'stok' => 100,
    ]);

    $this->actingAs($kasir)
        ->from(route('kasir.transaksi'))
        ->post(route('kasir.transaksi.store'), [
            'metode_pembayaran' => 'cash',
            'bayar' => 20000,
            'items' => [
                ['id_produk' => $bensin->id_produk, 'jumlah' => 1],
            ],
        ])
        ->assertSessionHasErrors('items');

    $this->assertDatabaseCount('transaksis', 0);
    expect((float) $bensin->fresh()->stok)->toBe(100.0);
});

test('curah sale is rejected when computed qty exceeds stock', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $bensin = Produk::factory()->create([
        'tipe_jual' => 'curah',
        'satuan' => 'liter',
        'harga_jual' => 14000,
        'stok' => 1, // hanya 1 liter
    ]);

    // nominal 20.000 → qty ~1.429 liter > stok 1 liter
    $this->actingAs($kasir)
        ->from(route('kasir.transaksi'))
        ->post(route('kasir.transaksi.store'), [
            'metode_pembayaran' => 'cash',
            'bayar' => 20000,
            'items' => [
                ['id_produk' => $bensin->id_produk, 'jumlah' => 1.429, 'nominal' => 20000],
            ],
        ])
        ->assertSessionHasErrors('items');

    $this->assertDatabaseCount('transaksis', 0);
    expect((float) $bensin->fresh()->stok)->toBe(1.0);
});

test('the kasir transaksi page excludes jasa products from the grid', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    Produk::factory()->create(['tipe_jual' => 'satuan']);
    Produk::factory()->create(['tipe_jual' => 'curah', 'satuan' => 'kg']);
    Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0]);

    $this->actingAs($kasir)->get(route('kasir.transaksi'))->assertInertia(
        fn ($page) => $page
            ->component('kasir/Transaksi')
            ->has('produks', 2) // jasa tidak tampil
    );
});
