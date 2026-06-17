<?php

use App\Models\Produk;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Produk jasa (transfer / tarik tunai) — fee = omzet, nominal = pass-through.
|--------------------------------------------------------------------------
*/

test('selling a jasa records only the fee as revenue and stores nominal as pass-through', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $transfer = Produk::factory()->create([
        'tipe_jual' => 'jasa',
        'satuan' => 'transaksi',
        'harga_jual' => 0,
        'harga_modal' => 0,
        'stok' => 0,
    ]);

    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 5000,
        'items' => [
            ['id_produk' => $transfer->id_produk, 'jumlah' => 1, 'nominal' => 500000, 'fee' => 5000],
        ],
    ])->assertRedirect(route('kasir.riwayat'));

    // Omzet = fee saja (5.000), BUKAN 505.000.
    $this->assertDatabaseHas('transaksis', [
        'total_harga' => 5000,
        'kembalian' => 0,
    ]);
    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $transfer->id_produk,
        'jumlah' => 1,
        'harga' => 5000,
        'subtotal' => 5000,
        'modal' => 0,
        'nominal' => 500000, // pass-through, hanya catatan
    ]);

    // Jasa tidak menyentuh stok maupun kartu stok.
    expect((float) $transfer->fresh()->stok)->toBe(0.0);
    $this->assertDatabaseMissing('stok_mutasis', ['id_produk' => $transfer->id_produk]);
});

test('a jasa sale without a fee is rejected', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $transfer = Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0]);

    $this->actingAs($kasir)
        ->from(route('kasir.transaksi'))
        ->post(route('kasir.transaksi.store'), [
            'metode_pembayaran' => 'cash',
            'bayar' => 5000,
            'items' => [
                ['id_produk' => $transfer->id_produk, 'jumlah' => 1, 'nominal' => 500000],
            ],
        ])
        ->assertSessionHasErrors('items');

    $this->assertDatabaseCount('transaksis', 0);
});

test('a jasa sale without a nominal is rejected', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $transfer = Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0]);

    $this->actingAs($kasir)
        ->from(route('kasir.transaksi'))
        ->post(route('kasir.transaksi.store'), [
            'metode_pembayaran' => 'cash',
            'bayar' => 5000,
            'items' => [
                ['id_produk' => $transfer->id_produk, 'jumlah' => 1, 'fee' => 5000],
            ],
        ])
        ->assertSessionHasErrors('items');

    $this->assertDatabaseCount('transaksis', 0);
});

test('a mixed cart (product + jasa) totals product subtotal plus fee only', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10]);
    $transfer = Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0]);

    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 25000,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2], // 20.000
            ['id_produk' => $transfer->id_produk, 'jumlah' => 1, 'nominal' => 1000000, 'fee' => 4000],
        ],
    ])->assertRedirect(route('kasir.riwayat'));

    // total = 20.000 (produk) + 4.000 (fee) = 24.000 ; nominal 1.000.000 TIDAK dihitung.
    $this->assertDatabaseHas('transaksis', [
        'total_harga' => 24000,
        'kembalian' => 1000,
    ]);

    // Stok produk biasa tetap berkurang; jasa tidak.
    expect((float) $produk->fresh()->stok)->toBe(8.0);
});

test('the dedicated kasir layanan page lists jasa products', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    Produk::factory()->create(['tipe_jual' => 'satuan']);
    Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0]);

    $this->actingAs($kasir)->get(route('kasir.layanan'))->assertInertia(
        fn ($page) => $page
            ->component('kasir/Layanan')
            ->has('layanan', 1) // hanya produk jasa
    );
});

test('the kasir transaksi page no longer carries the jasa layanan list', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0]);

    $this->actingAs($kasir)->get(route('kasir.transaksi'))->assertInertia(
        fn ($page) => $page->component('kasir/Transaksi')->missing('layanan')
    );
});
