<?php

use App\Models\Produk;
use App\Models\Promo;
use App\Models\Transaksi;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Akses halaman & kontrol peran
|--------------------------------------------------------------------------
*/

test('kasir can view the transaksi page with products and active promos', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    Produk::factory()->count(3)->create();
    Promo::factory()->create([
        'aktif' => true,
        'tanggal_mulai' => now()->subDay(),
        'tanggal_selesai' => now()->addDay(),
    ]);

    $response = $this->actingAs($kasir)->get(route('kasir.transaksi'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('kasir/Transaksi')
            ->has('produks', 3)
            ->has('promos', 1)
    );
});

test('admin cannot access kasir transaksi routes', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)->get(route('kasir.transaksi'))->assertForbidden();
});

test('guests are redirected from kasir transaksi page', function () {
    $this->get(route('kasir.transaksi'))->assertRedirect(route('login'));
});

/*
|--------------------------------------------------------------------------
| Alur simpan transaksi (happy path)
|--------------------------------------------------------------------------
*/

test('kasir can store a transaction, decrement stock and compute change', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produkA = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10]);
    $produkB = Produk::factory()->create(['harga_jual' => 5000, 'stok' => 5]);

    $response = $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 30000,
        'items' => [
            ['id_produk' => $produkA->id_produk, 'jumlah' => 2],
            ['id_produk' => $produkB->id_produk, 'jumlah' => 1],
        ],
    ]);

    $response->assertRedirect(route('kasir.transaksi'));
    $response->assertSessionHas('success');

    // total = (10000 * 2) + (5000 * 1) = 25000, tanpa promo
    $this->assertDatabaseHas('transaksis', [
        'id_user' => $kasir->id,
        'id_promo' => null,
        'total_harga' => 25000,
        'diskon' => 0,
        'metode_pembayaran' => 'cash',
        'bayar' => 30000,
        'kembalian' => 5000,
    ]);

    $transaksi = Transaksi::first();
    $this->assertDatabaseCount('detail_transaksis', 2);
    $this->assertDatabaseHas('detail_transaksis', [
        'id_transaksi' => $transaksi->id_transaksi,
        'id_produk' => $produkA->id_produk,
        'jumlah' => 2,
        'harga' => 10000,
        'subtotal' => 20000,
    ]);

    // Stok berkurang sesuai jumlah terjual (stok kini bertipe desimal/float)
    expect($produkA->fresh()->stok)->toBe(8.0);
    expect($produkB->fresh()->stok)->toBe(4.0);
});

test('selling snapshots the product modal into the transaction detail', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'harga_modal' => 6500, 'stok' => 10]);

    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 20000,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    // modal/unit di-snapshot dari produk saat transaksi terjadi
    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $produk->id_produk,
        'jumlah' => 2,
        'modal' => 6500,
    ]);

    // Jika modal produk berubah setelahnya, snapshot lama tidak ikut berubah
    $produk->update(['harga_modal' => 9000]);
    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $produk->id_produk,
        'modal' => 6500,
    ]);
});

/*
|--------------------------------------------------------------------------
| Validasi stok & pembayaran (transaksi harus rollback)
|--------------------------------------------------------------------------
*/

test('transaction is rejected when stock is insufficient and nothing is persisted', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 1]);

    $response = $this->actingAs($kasir)
        ->from(route('kasir.transaksi'))
        ->post(route('kasir.transaksi.store'), [
            'metode_pembayaran' => 'cash',
            'bayar' => 50000,
            'items' => [
                ['id_produk' => $produk->id_produk, 'jumlah' => 5],
            ],
        ]);

    $response->assertSessionHasErrors('items');
    $this->assertDatabaseCount('transaksis', 0);
    $this->assertDatabaseCount('detail_transaksis', 0);
    expect($produk->fresh()->stok)->toBe(1.0); // stok tidak berubah (rollback)
});

test('transaction is rejected when payment is less than total', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10]);

    $response = $this->actingAs($kasir)
        ->from(route('kasir.transaksi'))
        ->post(route('kasir.transaksi.store'), [
            'metode_pembayaran' => 'cash',
            'bayar' => 15000,
            'items' => [
                ['id_produk' => $produk->id_produk, 'jumlah' => 2], // total 20000 > bayar 15000
            ],
        ]);

    $response->assertSessionHasErrors('bayar');
    $this->assertDatabaseCount('transaksis', 0);
    expect($produk->fresh()->stok)->toBe(10.0);
});

/*
|--------------------------------------------------------------------------
| Promo per-produk (otomatis tanpa input id_promo)
|--------------------------------------------------------------------------
*/

test('per-product percentage promo is applied automatically', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10]);
    Promo::factory()->create([
        'tipe' => 'persen',
        'nilai' => 10,
        'id_produk' => $produk->id_produk,
        'minimal_belanja' => null,
        'aktif' => true,
        'tanggal_mulai' => now()->subDay(),
        'tanggal_selesai' => now()->addDay(),
    ]);

    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 20000,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2], // subtotal 20000, diskon 10% = 2000
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    $this->assertDatabaseHas('transaksis', [
        'total_harga' => 18000,
        'diskon' => 2000,
        'kembalian' => 2000,
    ]);
    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $produk->id_produk,
        'subtotal' => 18000, // subtotal item setelah diskon
    ]);
});

test('per-product nominal promo is applied per item', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10]);
    Promo::factory()->create([
        'tipe' => 'nominal',
        'nilai' => 1500,
        'id_produk' => $produk->id_produk,
        'minimal_belanja' => null,
        'aktif' => true,
        'tanggal_mulai' => now()->subDay(),
        'tanggal_selesai' => now()->addDay(),
    ]);

    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 30000,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 3], // subtotal 30000, diskon 1500*3 = 4500
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    $this->assertDatabaseHas('transaksis', [
        'total_harga' => 25500,
        'diskon' => 4500,
    ]);
});

/*
|--------------------------------------------------------------------------
| Promo global (id_produk null) — diterapkan OTOMATIS tanpa input id_promo,
| tetap menghormati syarat minimal belanja.
|--------------------------------------------------------------------------
*/

test('global promo is applied automatically when minimal belanja is met', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10]);
    $promo = Promo::factory()->create([
        'tipe' => 'persen',
        'nilai' => 10,
        'id_produk' => null,
        'minimal_belanja' => 15000,
        'aktif' => true,
        'tanggal_mulai' => now()->subDay(),
        'tanggal_selesai' => now()->addDay(),
    ]);

    // Tanpa mengirim id_promo — promo global aktif diterapkan otomatis.
    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 20000,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2], // subtotal 20000 >= 15000
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    $this->assertDatabaseHas('transaksis', [
        'id_promo' => $promo->id_promo,
        'total_harga' => 18000,
        'diskon' => 2000,
    ]);
});

test('global promo is ignored when minimal belanja is not met', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10]);
    Promo::factory()->create([
        'tipe' => 'persen',
        'nilai' => 10,
        'id_produk' => null,
        'minimal_belanja' => 50000,
        'aktif' => true,
        'tanggal_mulai' => now()->subDay(),
        'tanggal_selesai' => now()->addDay(),
    ]);

    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 20000,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2], // subtotal 20000 < 50000
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    $this->assertDatabaseHas('transaksis', [
        'id_promo' => null,
        'total_harga' => 20000,
        'diskon' => 0,
    ]);
});

test('the best-value global promo is auto-applied when several are active', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10]);

    // Dua promo global aktif: nominal 1.500 vs persen 10% (2.000 dari subtotal 20.000).
    Promo::factory()->create([
        'tipe' => 'nominal',
        'nilai' => 1500,
        'id_produk' => null,
        'minimal_belanja' => null,
        'aktif' => true,
        'tanggal_mulai' => now()->subDay(),
        'tanggal_selesai' => now()->addDay(),
    ]);
    $persen = Promo::factory()->create([
        'tipe' => 'persen',
        'nilai' => 10,
        'id_produk' => null,
        'minimal_belanja' => null,
        'aktif' => true,
        'tanggal_mulai' => now()->subDay(),
        'tanggal_selesai' => now()->addDay(),
    ]);

    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 20000,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2], // subtotal 20000
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    $this->assertDatabaseHas('transaksis', [
        'id_promo' => $persen->id_promo, // 2.000 > 1.500 → persen menang
        'total_harga' => 18000,
        'diskon' => 2000,
    ]);
});

/*
|--------------------------------------------------------------------------
| Validasi input
|--------------------------------------------------------------------------
*/

test('transaction requires at least one item', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);

    $this->actingAs($kasir)
        ->from(route('kasir.transaksi'))
        ->post(route('kasir.transaksi.store'), [
            'metode_pembayaran' => 'cash',
            'bayar' => 10000,
            'items' => [],
        ])
        ->assertSessionHasErrors('items');

    $this->assertDatabaseCount('transaksis', 0);
});

test('transaction rejects an invalid payment method', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10]);

    $this->actingAs($kasir)
        ->from(route('kasir.transaksi'))
        ->post(route('kasir.transaksi.store'), [
            'metode_pembayaran' => 'gopay', // tidak termasuk cash/qris/transfer
            'bayar' => 20000,
            'items' => [
                ['id_produk' => $produk->id_produk, 'jumlah' => 2],
            ],
        ])
        ->assertSessionHasErrors('metode_pembayaran');

    $this->assertDatabaseCount('transaksis', 0);
});
