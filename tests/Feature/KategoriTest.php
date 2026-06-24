<?php

use App\Models\Kategori;
use App\Models\Produk;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

// ─── Kategori ────────────────────────────────────────────────────────────────

test('admin can view kategori page with data', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Kategori::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.kategori'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('admin/Kategori')
            ->has('kategoris.data', 3)
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

test('admin can delete a kategori with products and preserve existing history', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kategori = Kategori::factory()->create();
    $produk = Produk::factory()->create(['id_kategori' => $kategori->id_kategori]);

    $response = $this->actingAs($admin)->delete(
        route('admin.kategori.destroy', $kategori->id_kategori)
    );

    $response->assertRedirect(route('admin.kategori'));
    $response->assertSessionHas('success');
    $this->assertDatabaseMissing('kategoris', ['id_kategori' => $kategori->id_kategori]);
    $this->assertDatabaseHas('produks', ['id_produk' => $produk->id_produk, 'id_kategori' => null]);
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
            ->has('produks.data', 3)
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

        'harga_jual' => 18000,
        'stok' => 50,
        'barcode' => '1234567890123',
        'sku' => 'SKU-001',
        'foto' => '/images/produk/kopi-susu.jpg',
    ]);

    $response->assertRedirect(route('admin.products'));
    $this->assertDatabaseHas('produks', [
        'nama' => 'Kopi Susu',
        'foto' => '/images/produk/kopi-susu.jpg',
    ]);
});

test('admin can upload produk foto file', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);
    $kategori = Kategori::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'id_kategori' => $kategori->id_kategori,
        'nama' => 'Kopi Latte',

        'harga_jual' => 20000,
        'stok' => 20,
        'barcode' => '9876543210987',
        'sku' => 'SKU-002',
        'foto_upload' => UploadedFile::fake()->image('kopi-latte.jpg'),
    ]);

    $response->assertRedirect(route('admin.products'));

    $produk = Produk::where('nama', 'Kopi Latte')->first();

    expect($produk)->not->toBeNull();
    expect($produk->foto)->not->toBeNull();
    Storage::disk('public')->assertExists($produk->foto);
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
            ->has('kasirs')
            ->has('produks')
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
    $this->actingAs($kasir)->get(route('admin.users'))->assertForbidden();
});

test('guests are redirected from admin pages', function () {
    $this->get(route('admin.kategori'))->assertRedirect(route('login'));
    $this->get(route('admin.products'))->assertRedirect(route('login'));
    $this->get(route('admin.transactions'))->assertRedirect(route('login'));
});
