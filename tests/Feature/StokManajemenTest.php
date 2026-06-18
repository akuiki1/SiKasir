<?php

use App\Models\Produk;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Menu Manajemen Stok — stok masuk, stok keluar, penyesuaian/opname.
|--------------------------------------------------------------------------
*/

test('admin can open the stok management page', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Produk::factory()->create(['stok' => 10]);

    $this->actingAs($admin)
        ->get(route('admin.stok'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/Stok')
            ->has('produks')
            ->has('mutasis')
            ->has('stats'));
});

test('a kasir cannot access the stok management page', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);

    $this->actingAs($kasir)
        ->get(route('admin.stok'))
        ->assertForbidden();
});

test('stok masuk adds stock and logs a masuk mutation', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['stok' => 10, 'jenis' => 'beli']);

    $this->actingAs($admin)->post(route('admin.stok.masuk'), [
        'id_produk' => $produk->id_produk,
        'jumlah' => 25,
        'keterangan' => 'Kiriman supplier',
    ])->assertRedirect(route('admin.stok'));

    expect($produk->fresh()->stok)->toBe(35.0);

    $this->assertDatabaseHas('stok_mutasis', [
        'id_produk' => $produk->id_produk,
        'tipe' => 'masuk',
        'jumlah' => 25,
        'stok_sebelum' => 10,
        'stok_sesudah' => 35,
        'id_user' => $admin->id,
    ]);
});

test('stok masuk with harga beli updates modal for a beli product', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['stok' => 0, 'jenis' => 'beli', 'harga_modal' => 5000]);

    $this->actingAs($admin)->post(route('admin.stok.masuk'), [
        'id_produk' => $produk->id_produk,
        'jumlah' => 10,
        'harga_beli' => 7500,
    ])->assertRedirect(route('admin.stok'));

    expect($produk->fresh()->harga_modal)->toBe(7500);
});

test('stok masuk does not touch modal for a produksi product', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['stok' => 0, 'jenis' => 'produksi', 'harga_modal' => 4000]);

    $this->actingAs($admin)->post(route('admin.stok.masuk'), [
        'id_produk' => $produk->id_produk,
        'jumlah' => 5,
        'harga_beli' => 9999, // harus diabaikan untuk produk produksi
    ])->assertRedirect(route('admin.stok'));

    expect($produk->fresh()->harga_modal)->toBe(4000);
});

test('a jasa product cannot receive stok masuk', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0]);

    $this->actingAs($admin)->post(route('admin.stok.masuk'), [
        'id_produk' => $produk->id_produk,
        'jumlah' => 5,
    ])->assertSessionHasErrors('id_produk');
});

test('stok keluar reduces stock and logs a keluar mutation', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['stok' => 20]);

    $this->actingAs($admin)->post(route('admin.stok.keluar'), [
        'id_produk' => $produk->id_produk,
        'jumlah' => 3,
        'alasan' => 'rusak',
        'keterangan' => 'jatuh',
    ])->assertRedirect(route('admin.stok'));

    expect($produk->fresh()->stok)->toBe(17.0);

    $this->assertDatabaseHas('stok_mutasis', [
        'id_produk' => $produk->id_produk,
        'tipe' => 'keluar',
        'jumlah' => -3,
        'stok_sebelum' => 20,
        'stok_sesudah' => 17,
        'keterangan' => 'Rusak — jatuh',
    ]);
});

test('stok keluar cannot exceed available stock', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['stok' => 2]);

    $this->actingAs($admin)->post(route('admin.stok.keluar'), [
        'id_produk' => $produk->id_produk,
        'jumlah' => 5,
        'alasan' => 'hilang',
    ])->assertSessionHasErrors('jumlah');

    expect($produk->fresh()->stok)->toBe(2.0);
});

test('penyesuaian sets stock to physical count and logs the delta', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['stok' => 50]);

    $this->actingAs($admin)->post(route('admin.stok.penyesuaian'), [
        'id_produk' => $produk->id_produk,
        'stok_fisik' => 47,
        'keterangan' => 'Opname akhir bulan',
    ])->assertRedirect(route('admin.stok'));

    expect($produk->fresh()->stok)->toBe(47.0);

    $this->assertDatabaseHas('stok_mutasis', [
        'id_produk' => $produk->id_produk,
        'tipe' => 'penyesuaian',
        'jumlah' => -3,
        'stok_sebelum' => 50,
        'stok_sesudah' => 47,
        'keterangan' => 'Opname akhir bulan',
    ]);
});

test('penyesuaian with no change is rejected', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['stok' => 8]);

    $this->actingAs($admin)->post(route('admin.stok.penyesuaian'), [
        'id_produk' => $produk->id_produk,
        'stok_fisik' => 8,
    ])->assertSessionHasErrors('stok_fisik');
});
