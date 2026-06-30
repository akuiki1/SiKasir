<?php

use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\User;

test('admin can permanently delete an archived product without history', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create();
    $produk->delete(); // arsipkan (soft delete)

    $response = $this->actingAs($admin)->delete(
        route('admin.products.force-delete', $produk->id_produk)
    );

    $response->assertRedirect(route('admin.products', ['view' => 'arsip']));
    // Benar-benar hilang dari DB (bukan sekadar soft delete).
    expect(Produk::withTrashed()->find($produk->id_produk))->toBeNull();
});

test('cannot permanently delete an archived product that has transaction history', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create();
    $transaksi = Transaksi::factory()->create();
    DetailTransaksi::factory()->create([
        'id_transaksi' => $transaksi->id_transaksi,
        'id_produk' => $produk->id_produk,
        'jumlah' => 1,
        'harga' => $produk->harga_jual,
        'subtotal' => $produk->harga_jual,
    ]);
    $produk->delete(); // arsipkan

    $this->actingAs($admin)->delete(
        route('admin.products.force-delete', $produk->id_produk)
    );

    // Produk tetap ada (masih terarsip), tidak terhapus — riwayat terlindungi.
    expect(Produk::onlyTrashed()->find($produk->id_produk))->not->toBeNull();
    $this->assertDatabaseHas('detail_transaksis', ['id_produk' => $produk->id_produk]);
});

test('archive list flags which products can be permanently deleted', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $bersih = Produk::factory()->create(['nama' => 'Duplikat Salah']);
    $bersih->delete();

    $terpakai = Produk::factory()->create(['nama' => 'Sudah Terjual']);
    $transaksi = Transaksi::factory()->create();
    DetailTransaksi::factory()->create([
        'id_transaksi' => $transaksi->id_transaksi,
        'id_produk' => $terpakai->id_produk,
        'jumlah' => 1,
        'harga' => $terpakai->harga_jual,
        'subtotal' => $terpakai->harga_jual,
    ]);
    $terpakai->delete();

    $response = $this->actingAs($admin)->get(route('admin.products', ['view' => 'arsip']));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/Products')
        ->where('produks.data', fn ($data) => collect($data)
            ->firstWhere('nama', 'Duplikat Salah')['bisa_hapus'] === true
            && collect($data)->firstWhere('nama', 'Sudah Terjual')['bisa_hapus'] === false
        )
    );
});
