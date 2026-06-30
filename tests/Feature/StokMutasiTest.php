<?php

use App\Models\Kategori;
use App\Models\Produk;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Kartu stok (stok_mutasis) — setiap perubahan stok harus tercatat.
|--------------------------------------------------------------------------
*/

test('a sale records a stok mutasi row with before/after on the kartu stok', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10]);

    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 20000,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    $this->assertDatabaseHas('stok_mutasis', [
        'id_produk' => $produk->id_produk,
        'tipe' => 'jual',
        'jumlah' => -2,
        'stok_sebelum' => 10,
        'stok_sesudah' => 8,
        'ref_tipe' => 'Transaksi',
        'id_user' => $kasir->id,
    ]);
});

test('creating a product with initial stock logs an awal mutation and stores tipe_jual/satuan', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kategori = Kategori::factory()->create();

    $this->actingAs($admin)->post(route('admin.products.store'), [
        'id_kategori' => $kategori->id_kategori,
        'nama' => 'Bawang Merah',
        'tipe_jual' => 'curah',
        'satuan' => 'kg',
        'harga_jual' => 40000,
        'harga_modal' => 35000,
        'stok' => 12.5,
    ])->assertRedirect(route('admin.products'));

    $produk = Produk::where('nama', 'Bawang Merah')->firstOrFail();

    expect($produk->tipe_jual)->toBe('curah');
    expect($produk->satuan)->toBe('kg');
    expect((float) $produk->stok)->toBe(12.5);

    $this->assertDatabaseHas('stok_mutasis', [
        'id_produk' => $produk->id_produk,
        'tipe' => 'awal',
        'stok_sebelum' => 0,
        'stok_sesudah' => 12.5,
    ]);
});

test('a jasa product is forced to zero stock', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kategori = Kategori::factory()->create();

    $this->actingAs($admin)->post(route('admin.products.store'), [
        'id_kategori' => $kategori->id_kategori,
        'nama' => 'Transfer Bank',
        'tipe_jual' => 'jasa',
        'satuan' => 'transaksi',
        'harga_jual' => 5000,
        'stok' => 999, // diabaikan untuk jasa
    ])->assertRedirect(route('admin.products'));

    $produk = Produk::where('nama', 'Transfer Bank')->firstOrFail();

    expect((float) $produk->stok)->toBe(0.0);
    $this->assertDatabaseMissing('stok_mutasis', [
        'id_produk' => $produk->id_produk,
    ]);
});

test('manually editing product stock logs a penyesuaian mutation', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['stok' => 5, 'jenis' => 'beli']);

    $this->actingAs($admin)->put(route('admin.products.update', $produk->id_produk), [
        'id_kategori' => $produk->id_kategori,
        'nama' => $produk->nama,
        'harga_jual' => $produk->harga_jual,
        'harga_modal' => $produk->harga_modal,
        'stok' => 8,
    ])->assertRedirect(route('admin.products'));

    expect($produk->fresh()->stok)->toBe(8.0);
    $this->assertDatabaseHas('stok_mutasis', [
        'id_produk' => $produk->id_produk,
        'tipe' => 'penyesuaian',
        'jumlah' => 3,
        'stok_sebelum' => 5,
        'stok_sesudah' => 8,
    ]);
});

test('recording a production batch logs a produksi mutation', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['jenis' => 'produksi', 'stok' => 0]);

    $this->actingAs($admin)->post(route('admin.produksi.store'), [
        'id_produk' => $produk->id_produk,
        'jumlah' => 50,
        'biayas' => [
            ['nama' => 'Bahan', 'nominal' => 100000],
        ],
    ])->assertRedirect(route('admin.produksi'));

    $this->assertDatabaseHas('stok_mutasis', [
        'id_produk' => $produk->id_produk,
        'tipe' => 'produksi',
        'jumlah' => 50,
        'stok_sebelum' => 0,
        'stok_sesudah' => 50,
        'ref_tipe' => 'Produksi',
    ]);
});
