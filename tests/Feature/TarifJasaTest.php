<?php

use App\Models\Kategori;
use App\Models\Produk;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Tarif fee bertingkat untuk jasa — fee otomatis dari range nominal.
| Resolusi: tarif berlaku = min_nominal terbesar yang <= nominal; bila
| nominal di bawah tarif terendah, pakai tarif terendah. Fee dihitung ulang
| di backend (tidak percaya angka client) karena fee = omzet toko.
|--------------------------------------------------------------------------
*/

/**
 * Buat produk jasa dengan tiga tingkat tarif standar.
 */
function jasaBertarif(): Produk
{
    $jasa = Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0, 'harga_jual' => 0]);
    $jasa->tarifJasas()->createMany([
        ['min_nominal' => 0, 'fee' => 2000],
        ['min_nominal' => 50000, 'fee' => 3000],
        ['min_nominal' => 100000, 'fee' => 5000],
    ]);

    return $jasa;
}

test('fee jasa dihitung otomatis dari tarif sesuai nominal', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $jasa = jasaBertarif();

    // Nominal 75.000 jatuh di tingkat 50.000–99.999 → fee 3.000.
    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 78000, // nominal 75.000 + fee 3.000
        'items' => [
            ['id_produk' => $jasa->id_produk, 'jumlah' => 1, 'nominal' => 75000],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    $this->assertDatabaseHas('transaksis', ['total_harga' => 3000]);
    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $jasa->id_produk,
        'harga' => 3000,
        'subtotal' => 3000,
        'nominal' => 75000,
    ]);
});

test('fee dari client diabaikan, backend memakai tarif tabel', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $jasa = jasaBertarif();

    // Client mengirim fee palsu 999, tapi bayar sesuai fee asli (3.000) dari tarif.
    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 78000, // nominal 75.000 + fee 3.000
        'items' => [
            ['id_produk' => $jasa->id_produk, 'jumlah' => 1, 'nominal' => 75000, 'fee' => 999],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    // Fee tersimpan = 3.000 (tarif), BUKAN 999 (kiriman client).
    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $jasa->id_produk,
        'harga' => 3000,
        'subtotal' => 3000,
    ]);
    $this->assertDatabaseMissing('detail_transaksis', ['harga' => 999]);
});

test('nominal tepat di batas bawah masuk ke tingkat yang lebih tinggi', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $jasa = jasaBertarif();

    // 50.000 inclusive di tingkat 50.000 → fee 3.000 (bukan 2.000).
    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 53000, // nominal 50.000 + fee 3.000
        'items' => [
            ['id_produk' => $jasa->id_produk, 'jumlah' => 1, 'nominal' => 50000],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    $this->assertDatabaseHas('transaksis', ['total_harga' => 3000]);
});

test('nominal besar memakai tarif tingkat tertinggi', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $jasa = jasaBertarif();

    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 1005000, // nominal 1.000.000 + fee 5.000
        'items' => [
            ['id_produk' => $jasa->id_produk, 'jumlah' => 1, 'nominal' => 1000000],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    $this->assertDatabaseHas('transaksis', ['total_harga' => 5000]);
});

test('nominal di bawah tarif terendah memakai tarif terendah', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $jasa = Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0, 'harga_jual' => 0]);
    // Tarif terendah mulai dari 10.000 — nominal 5.000 ada di bawahnya.
    $jasa->tarifJasas()->createMany([
        ['min_nominal' => 10000, 'fee' => 1000],
        ['min_nominal' => 100000, 'fee' => 4000],
    ]);

    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 6000, // nominal 5.000 + fee 1.000
        'items' => [
            ['id_produk' => $jasa->id_produk, 'jumlah' => 1, 'nominal' => 5000],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    $this->assertDatabaseHas('transaksis', ['total_harga' => 1000]);
});

test('jasa tanpa tarif tetap memakai fee manual', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $jasa = Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0]);

    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 207000, // nominal 200.000 + fee 7.000
        'items' => [
            ['id_produk' => $jasa->id_produk, 'jumlah' => 1, 'nominal' => 200000, 'fee' => 7000],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $jasa->id_produk,
        'harga' => 7000,
        'subtotal' => 7000,
    ]);
});

test('halaman transaksi kasir mengirim tarif tiap jasa', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    jasaBertarif();

    $this->actingAs($kasir)->get(route('kasir.transaksi'))->assertInertia(
        fn ($page) => $page
            ->component('kasir/Transaksi')
            ->has('layanan', 1)
            ->has('layanan.0.tarifs', 3)
    );
});

test('admin dapat menyimpan tarif bertingkat saat membuat produk jasa', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kategori = Kategori::factory()->create();

    $this->actingAs($admin)->post(route('admin.products.store'), [
        'id_kategori' => $kategori->id_kategori,
        'nama' => 'Tarik Tunai',
        'tipe_jual' => 'jasa',
        'harga_jual' => 0,
        'stok' => 0,
        'tarifs' => [
            ['min_nominal' => 0, 'fee' => 2000],
            ['min_nominal' => 50000, 'fee' => 3000],
            ['min_nominal' => 100000, 'fee' => 5000],
        ],
    ])->assertRedirect(route('admin.products'));

    $produk = Produk::where('nama', 'Tarik Tunai')->firstOrFail();
    expect($produk->tarifJasas()->count())->toBe(3);
    $this->assertDatabaseHas('tarif_jasas', [
        'id_produk' => $produk->id_produk,
        'min_nominal' => 50000,
        'fee' => 3000,
    ]);
});

test('mengubah produk jasa ke tipe lain menghapus tarifnya', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kategori = Kategori::factory()->create();
    $jasa = jasaBertarif();

    $this->actingAs($admin)->put(route('admin.products.update', $jasa->id_produk), [
        'id_kategori' => $kategori->id_kategori,
        'nama' => 'Sekarang Barang',
        'tipe_jual' => 'satuan',
        'harga_jual' => 1000,
        'stok' => 5,
    ])->assertRedirect(route('admin.products'));

    expect($jasa->fresh()->tarifJasas()->count())->toBe(0);
});
