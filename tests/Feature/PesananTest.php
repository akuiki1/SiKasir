<?php

use App\Models\Pelanggan;
use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Pesanan online (pending) → proses pembayaran di kasir.
|--------------------------------------------------------------------------
*/

test('a web order is saved as pending and reserves stock', function () {
    $produk = Produk::factory()->create([
        'harga_jual' => 10000,
        'stok' => 10,
        'tipe_jual' => 'satuan',
    ]);

    $this->postJson(route('pesan.store'), [
        'nama' => 'Budi',
        'telp' => '081298765432',
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2],
        ],
    ])->assertOk()->assertJsonStructure(['kode', 'total', 'wa_url']);

    $this->assertDatabaseHas('pesanans', [
        'nama_pelanggan' => 'Budi',
        'tipe_pelanggan' => 'umum',
        'status' => 'pending',
        'total' => 20000,
        'id_pelanggan' => null,
    ]);
    $this->assertDatabaseHas('pesanan_items', [
        'id_produk' => $produk->id_produk,
        'jumlah' => 2,
        'harga' => 10000,
        'subtotal' => 20000,
    ]);

    // Stok di-reserve (berkurang) + tercatat di kartu stok sebagai 'pesanan'.
    expect((float) $produk->fresh()->stok)->toBe(8.0);
    $this->assertDatabaseHas('stok_mutasis', [
        'id_produk' => $produk->id_produk,
        'tipe' => 'pesanan',
    ]);
});

test('a web order is rejected when stock is insufficient', function () {
    $produk = Produk::factory()->create(['stok' => 1, 'tipe_jual' => 'satuan']);

    $this->postJson(route('pesan.store'), [
        'nama' => 'Budi',
        'telp' => '081298765432',
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 5],
        ],
    ])->assertStatus(422);

    // Transaksi pesanan di-rollback → stok utuh, tidak ada pesanan tersimpan.
    expect((float) $produk->fresh()->stok)->toBe(1.0);
    $this->assertDatabaseCount('pesanans', 0);
});

test('a web order matches a registered reseller by WA number and applies reseller price', function () {
    $reseller = Pelanggan::create([
        'nama' => 'Toko Budi',
        'telp' => '081254744177',
        'tipe' => 'reseller',
    ]);
    $produk = Produk::factory()->create([
        'harga_jual' => 10000,
        'potongan_reseller' => 2000,
        'stok' => 10,
        'tipe_jual' => 'satuan',
    ]);

    $this->postJson(route('pesan.store'), [
        'nama' => 'Budi',
        'telp' => '0812-5474-4177',
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2],
        ],
    ])->assertOk();

    $this->assertDatabaseHas('pesanans', [
        'id_pelanggan' => $reseller->id_pelanggan,
        'tipe_pelanggan' => 'reseller',
        'total' => 16000, // (10.000 - 2.000) x 2
    ]);
    $this->assertDatabaseHas('pesanan_items', [
        'id_produk' => $produk->id_produk,
        'harga' => 8000,
        'subtotal' => 16000,
    ]);
});

test('a web order rejects non-satuan products', function () {
    $jasa = Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0]);

    $this->postJson(route('pesan.store'), [
        'nama' => 'Budi',
        'telp' => '081298765432',
        'items' => [
            ['id_produk' => $jasa->id_produk, 'jumlah' => 1],
        ],
    ])->assertStatus(422);

    $this->assertDatabaseCount('pesanans', 0);
});

test('a kasir can mark an order as ready', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $pesanan = buatPesanan();

    $this->actingAs($kasir)
        ->from(route('kasir.pesanan'))
        ->post(route('kasir.pesanan.siap', $pesanan))
        ->assertRedirect(route('kasir.pesanan'));

    $pesanan->refresh();
    expect($pesanan->status)->toBe('disiapkan');
    expect($pesanan->disiapkan_at)->not->toBeNull();
});

test('processing an order creates a transaction without double-deducting stock', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create([
        'harga_jual' => 10000,
        'harga_modal' => 6000,
        'stok' => 10,
        'tipe_jual' => 'satuan',
    ]);

    // Pesan via storefront → reserve stok (10 → 8).
    $this->postJson(route('pesan.store'), [
        'nama' => 'Budi',
        'telp' => '081298765432',
        'items' => [['id_produk' => $produk->id_produk, 'jumlah' => 2]],
    ])->assertOk();

    $pesanan = Pesanan::first();
    expect((float) $produk->fresh()->stok)->toBe(8.0);

    $this->actingAs($kasir)
        ->from(route('kasir.pesanan'))
        ->post(route('kasir.pesanan.proses', $pesanan), [
            'metode_pembayaran' => 'cash',
            'bayar' => 20000,
        ])->assertRedirect(route('kasir.pesanan'));

    $this->assertDatabaseHas('transaksis', [
        'total_harga' => 20000,
        'kembalian' => 0,
        'id_pelanggan' => null,
    ]);
    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $produk->id_produk,
        'jumlah' => 2,
        'harga' => 10000,
        'subtotal' => 20000,
        'modal' => 6000,
    ]);

    $pesanan->refresh();
    expect($pesanan->status)->toBe('selesai');
    expect($pesanan->id_transaksi)->not->toBeNull();

    // Stok TIDAK dikurangi lagi (reservasi = stock-out); tidak ada mutasi 'jual'.
    expect((float) $produk->fresh()->stok)->toBe(8.0);
    $this->assertDatabaseMissing('stok_mutasis', [
        'id_produk' => $produk->id_produk,
        'tipe' => 'jual',
    ]);
});

test('processing is rejected when bayar is less than the order total', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $pesanan = buatPesanan(20000);

    $this->actingAs($kasir)
        ->from(route('kasir.pesanan'))
        ->post(route('kasir.pesanan.proses', $pesanan), [
            'metode_pembayaran' => 'cash',
            'bayar' => 10000,
        ])->assertSessionHasErrors('bayar');

    $this->assertDatabaseCount('transaksis', 0);
    expect($pesanan->fresh()->status)->toBe('pending');
});

test('cancelling an order returns the reserved stock', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10, 'tipe_jual' => 'satuan']);

    $this->postJson(route('pesan.store'), [
        'nama' => 'Budi',
        'telp' => '081298765432',
        'items' => [['id_produk' => $produk->id_produk, 'jumlah' => 3]],
    ])->assertOk();

    $pesanan = Pesanan::first();
    expect((float) $produk->fresh()->stok)->toBe(7.0);

    $this->actingAs($kasir)
        ->from(route('kasir.pesanan'))
        ->post(route('kasir.pesanan.batal', $pesanan))
        ->assertRedirect(route('kasir.pesanan'));

    expect($pesanan->fresh()->status)->toBe('batal');
    expect((float) $produk->fresh()->stok)->toBe(10.0);
    $this->assertDatabaseHas('stok_mutasis', [
        'id_produk' => $produk->id_produk,
        'tipe' => 'pesanan_batal',
    ]);
});

test('the kasir pesanan page lists active orders', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    buatPesanan();

    $this->actingAs($kasir)->get(route('kasir.pesanan'))->assertInertia(
        fn ($page) => $page->component('kasir/Pesanan')->has('pesanans_aktif', 1)
    );
});

test('a guest cannot access the kasir pesanan page', function () {
    $this->get(route('kasir.pesanan'))->assertRedirect(route('login'));
});

/** Helper: buat satu pesanan pending lengkap dengan item (reserve stok manual). */
function buatPesanan(int $total = 20000): Pesanan
{
    $produk = Produk::factory()->create([
        'harga_jual' => 10000,
        'stok' => 10,
        'tipe_jual' => 'satuan',
    ]);

    $pesanan = Pesanan::create([
        'nama_pelanggan' => 'Budi',
        'telp' => '6281298765432',
        'tipe_pelanggan' => 'umum',
        'status' => 'pending',
        'total' => $total,
        'sumber' => 'web',
    ]);

    $pesanan->items()->create([
        'id_produk' => $produk->id_produk,
        'nama_produk' => $produk->nama,
        'harga' => 10000,
        'jumlah' => max(1, (int) ($total / 10000)),
        'subtotal' => $total,
    ]);

    return $pesanan;
}
