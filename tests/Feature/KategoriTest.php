<?php

use App\Models\Kategori;
use App\Models\Produk;
use App\Models\User;

// ─── Kategori ────────────────────────────────────────────────────────────────

test('admin can view kategori page with data', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Kategori::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.kategori'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('admin/Kategori')
            ->has('kategoris', 3)
            ->has('stats.total_kategori')
            ->has('stats.total_produk')
    );
});

test('admin can create a new kategori', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.kategori.store'), [
        'nama_kategori' => 'Minuman Segar',
    ]);

    $response->assertRedirect(route('admin.kategori'));
    $this->assertDatabaseHas('kategoris', ['nama_kategori' => 'Minuman Segar']);
});

test('admin cannot create kategori with duplicate name', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Kategori::factory()->create(['nama_kategori' => 'Minuman']);

    $response = $this->actingAs($admin)->post(route('admin.kategori.store'), [
        'nama_kategori' => 'Minuman',
    ]);

    $response->assertSessionHasErrors('nama_kategori');
});

test('admin can update a kategori', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kategori = Kategori::factory()->create(['nama_kategori' => 'Lama']);

    $response = $this->actingAs($admin)->put(
        route('admin.kategori.update', $kategori->id_kategori),
        ['nama_kategori' => 'Baru']
    );

    $response->assertRedirect(route('admin.kategori'));
    $this->assertDatabaseHas('kategoris', ['nama_kategori' => 'Baru']);
    $this->assertDatabaseMissing('kategoris', ['nama_kategori' => 'Lama']);
});

test('admin can delete a kategori with no products', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kategori = Kategori::factory()->create();

    $response = $this->actingAs($admin)->delete(
        route('admin.kategori.destroy', $kategori->id_kategori)
    );

    $response->assertRedirect(route('admin.kategori'));
    $this->assertDatabaseMissing('kategoris', ['id_kategori' => $kategori->id_kategori]);
});

test('admin cannot delete a kategori that has products', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kategori = Kategori::factory()->create();
    Produk::factory()->create(['id_kategori' => $kategori->id_kategori]);

    $response = $this->actingAs($admin)->delete(
        route('admin.kategori.destroy', $kategori->id_kategori)
    );

    $response->assertRedirect(route('admin.kategori'));
    $response->assertSessionHas('error');
    $this->assertDatabaseHas('kategoris', ['id_kategori' => $kategori->id_kategori]);
});

// ─── Produk ──────────────────────────────────────────────────────────────────

test('admin can view produk page with data', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Produk::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.products'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('admin/Products')
            ->has('produks', 3)
            ->has('stats.total_produk')
            ->has('stats.total_kategori')
            ->has('stats.stok_bermasalah')
            ->has('kategoris')
    );
});

test('admin can create a new produk', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kategori = Kategori::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'id_kategori' => $kategori->id_kategori,
        'nama' => 'Kopi Susu',
        'harga_beli' => 10000,
        'harga_jual' => 18000,
        'stok' => 50,
        'barcode' => '1234567890123',
        'sku' => 'SKU-001',
    ]);

    $response->assertRedirect(route('admin.products'));
    $this->assertDatabaseHas('produks', ['nama' => 'Kopi Susu']);
});

test('admin can delete a produk', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create();

    $response = $this->actingAs($admin)->delete(
        route('admin.products.destroy', $produk->id_produk)
    );

    $response->assertRedirect(route('admin.products'));
    $this->assertDatabaseMissing('produks', ['id_produk' => $produk->id_produk]);
});

// ─── Transaksi ───────────────────────────────────────────────────────────────

test('admin can view transaksi page', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('admin.transactions'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('admin/Transactions')
            ->has('transaksis')
            ->has('stats.total_penjualan_hari_ini')
            ->has('stats.total_transaksi_sukses')
            ->has('stats.rata_rata')
    );
});

// ─── Authorization ───────────────────────────────────────────────────────────

test('kasir cannot access admin pages', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);

    $this->actingAs($kasir)->get(route('admin.kategori'))->assertForbidden();
    $this->actingAs($kasir)->get(route('admin.products'))->assertForbidden();
    $this->actingAs($kasir)->get(route('admin.transactions'))->assertForbidden();
});

test('guests are redirected from admin pages', function () {
    $this->get(route('admin.kategori'))->assertRedirect(route('login'));
    $this->get(route('admin.products'))->assertRedirect(route('login'));
    $this->get(route('admin.transactions'))->assertRedirect(route('login'));
});
