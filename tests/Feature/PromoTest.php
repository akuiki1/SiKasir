<?php

use App\Models\Produk;
use App\Models\Promo;
use App\Models\User;

test('admin can view promos page with data', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Promo::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.promos'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('admin/Promos')
            ->has('promos.data', 3)
            ->has('stats.total_promo')
            ->has('stats.total_aktif')
            ->has('stats.total_non_aktif')
            ->has('produks')
    );
});

test('admin can create a new nominal promo', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.promos.store'), [
        'nama' => 'Promo Weekend',
        'deskripsi' => 'Diskon akhir pekan',
        'tipe' => 'nominal',
        'nilai' => 15000,
        'id_produk' => $produk->id_produk,
        'minimal_belanja' => 50000,
        'tanggal_mulai' => now()->format('Y-m-d H:i'),
        'tanggal_selesai' => now()->addDays(2)->format('Y-m-d H:i'),
        'aktif' => true,
    ]);

    $response->assertRedirect(route('admin.promos'));
    $this->assertDatabaseHas('promos', [
        'nama' => 'Promo Weekend',
        'tipe' => 'nominal',
        'nilai' => 15000,
        'id_produk' => $produk->id_produk,
        'minimal_belanja' => 50000,
        'aktif' => true,
    ]);
});

test('admin can create a bundling promo', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['tipe_jual' => 'satuan']);

    $response = $this->actingAs($admin)->post(route('admin.promos.store'), [
        'nama' => 'Beli 5 Gratis 1',
        'deskripsi' => 'Paket bundling',
        'tipe' => 'bundling',
        'beli_qty' => 5,
        'gratis_qty' => 1,
        'id_produk' => $produk->id_produk,
        'tanggal_mulai' => now()->format('Y-m-d H:i'),
        'tanggal_selesai' => now()->addDays(2)->format('Y-m-d H:i'),
        'aktif' => true,
    ]);

    $response->assertRedirect(route('admin.promos'));
    $this->assertDatabaseHas('promos', [
        'nama' => 'Beli 5 Gratis 1',
        'tipe' => 'bundling',
        'beli_qty' => 5,
        'gratis_qty' => 1,
        'nilai' => 0,
        'id_produk' => $produk->id_produk,
    ]);
});

test('bundling promo requires a specific product', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)
        ->from(route('admin.promos'))
        ->post(route('admin.promos.store'), [
            'nama' => 'Bundling Tanpa Produk',
            'tipe' => 'bundling',
            'beli_qty' => 5,
            'gratis_qty' => 1,
            'id_produk' => null,
            'tanggal_mulai' => now()->format('Y-m-d H:i'),
            'tanggal_selesai' => now()->addDays(2)->format('Y-m-d H:i'),
            'aktif' => true,
        ]);

    $response->assertSessionHasErrors('id_produk');
});

test('percent promo can no longer be created', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)
        ->from(route('admin.promos'))
        ->post(route('admin.promos.store'), [
            'nama' => 'Promo Persen',
            'tipe' => 'persen',
            'nilai' => 15,
            'id_produk' => null,
            'tanggal_mulai' => now()->format('Y-m-d H:i'),
            'tanggal_selesai' => now()->addDays(2)->format('Y-m-d H:i'),
            'aktif' => true,
        ]);

    $response->assertSessionHasErrors('tipe');
});

test('admin can update a promo', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $promo = Promo::factory()->create(['nama' => 'Promo Lama', 'tipe' => 'nominal', 'nilai' => 10000]);

    $response = $this->actingAs($admin)->put(route('admin.promos.update', $promo->id_promo), [
        'nama' => 'Promo Baru',
        'deskripsi' => 'Diskon baru',
        'tipe' => 'nominal',
        'nilai' => 20000,
        'id_produk' => null,
        'minimal_belanja' => 100000,
        'tanggal_mulai' => now()->format('Y-m-d H:i'),
        'tanggal_selesai' => now()->addDays(2)->format('Y-m-d H:i'),
        'aktif' => false,
    ]);

    $response->assertRedirect(route('admin.promos'));
    $this->assertDatabaseHas('promos', [
        'id_promo' => $promo->id_promo,
        'nama' => 'Promo Baru',
        'tipe' => 'nominal',
        'nilai' => 20000,
        'aktif' => false,
    ]);
    $this->assertDatabaseMissing('promos', [
        'nama' => 'Promo Lama',
    ]);
});

test('admin can delete a promo', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $promo = Promo::factory()->create();

    $response = $this->actingAs($admin)->delete(route('admin.promos.destroy', $promo->id_promo));

    $response->assertRedirect(route('admin.promos'));
    $this->assertDatabaseMissing('promos', [
        'id_promo' => $promo->id_promo,
    ]);
});

test('kasir cannot access promo admin pages', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);

    $this->actingAs($kasir)->get(route('admin.promos'))->assertForbidden();
});

test('guests are redirected from promo admin pages', function () {
    $this->get(route('admin.promos'))->assertRedirect(route('login'));
});
