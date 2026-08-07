<?php

use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\Produksi;
use App\Models\Promo;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

/**
 * Arsip produk: pulihkan, hapus permanen, dan penjaganya.
 *
 * Menghapus produk di aplikasi ini berarti mengarsipkan (soft delete) supaya
 * laporan dan struk lama tidak rusak. Hapus permanen disediakan hanya untuk
 * produk salah input atau duplikat yang belum pernah dipakai, dan dijaga oleh
 * ProdukController::produkPunyaRiwayat() yang memeriksa transaksi, produksi,
 * dan pesanan.
 *
 * Penjaga itu yang paling penting di berkas ini: kalau jebol, produk yang sudah
 * pernah terjual bisa terhapus permanen dan riwayat keuangannya ikut rusak.
 * Sebelumnya seluruh alur ini tidak punya satu pun test.
 */
beforeEach(function () {
    Storage::fake('public');

    $this->admin = User::factory()->create(['role' => 'admin']);
});

/** Produk yang sudah diarsipkan, siap diuji pemulihan/penghapusannya. */
function produkTerarsip(array $atribut = []): Produk
{
    $produk = Produk::factory()->create($atribut);
    $produk->delete();

    return $produk;
}

// ─── Pulihkan ────────────────────────────────────────────────────────────────

test('admin can restore an archived produk', function () {
    $produk = produkTerarsip();

    $response = $this->actingAs($this->admin)->post(
        route('admin.products.restore', $produk->id_produk)
    );

    $response->assertRedirect(route('admin.products', ['view' => 'arsip']));
    expect(Produk::find($produk->id_produk))->not->toBeNull();
    $this->assertNotSoftDeleted('produks', ['id_produk' => $produk->id_produk]);
});

test('restoring a produk that is not archived returns 404', function () {
    $produk = Produk::factory()->create();

    $this->actingAs($this->admin)
        ->post(route('admin.products.restore', $produk->id_produk))
        ->assertNotFound();
});

// ─── Hapus permanen: yang diizinkan ──────────────────────────────────────────

test('admin can permanently delete an archived produk without history', function () {
    $produk = produkTerarsip();

    $response = $this->actingAs($this->admin)->delete(
        route('admin.products.force-delete', $produk->id_produk)
    );

    $response->assertRedirect(route('admin.products', ['view' => 'arsip']));
    // Benar-benar hilang, bukan sekadar terarsip.
    expect(Produk::withTrashed()->find($produk->id_produk))->toBeNull();
});

/**
 * Promo dan kartu stok tidak memblokir penghapusan, tapi kalau ditinggalkan
 * akan jadi baris yatim yang menunjuk produk yang sudah tidak ada.
 */
test('permanently deleting a produk also removes its promo', function () {
    $produk = produkTerarsip();
    $promo = Promo::factory()->create(['id_produk' => $produk->id_produk]);

    $this->actingAs($this->admin)->delete(
        route('admin.products.force-delete', $produk->id_produk)
    );

    $this->assertDatabaseMissing('promos', ['id_promo' => $promo->id_promo]);
});

// ─── Hapus permanen: yang ditolak penjaga ────────────────────────────────────

test('cannot permanently delete an archived produk with transaction history', function () {
    $produk = produkTerarsip();
    $transaksi = Transaksi::factory()->create();
    DetailTransaksi::factory()->create([
        'id_transaksi' => $transaksi->id_transaksi,
        'id_produk' => $produk->id_produk,
        'jumlah' => 1,
        'harga' => $produk->harga_jual,
        'subtotal' => $produk->harga_jual,
    ]);

    $this->actingAs($this->admin)
        ->from(route('admin.products', ['view' => 'arsip']))
        ->delete(route('admin.products.force-delete', $produk->id_produk))
        ->assertRedirect(route('admin.products', ['view' => 'arsip']));

    // Tetap ada dan tetap terarsip — riwayat penjualannya terlindungi.
    expect(Produk::onlyTrashed()->find($produk->id_produk))->not->toBeNull();
    $this->assertDatabaseHas('detail_transaksis', ['id_produk' => $produk->id_produk]);
});

/**
 * Penjaganya memeriksa tiga sumber riwayat. Transaksi diuji di atas; produksi
 * diuji di sini supaya cabang keduanya tidak diam-diam hilang saat direfaktor.
 */
test('cannot permanently delete an archived produk with produksi history', function () {
    $produk = produkTerarsip(['jenis' => 'produksi']);
    Produksi::factory()->create(['id_produk' => $produk->id_produk]);

    $this->actingAs($this->admin)
        ->from(route('admin.products', ['view' => 'arsip']))
        ->delete(route('admin.products.force-delete', $produk->id_produk));

    expect(Produk::onlyTrashed()->find($produk->id_produk))->not->toBeNull();
});

test('cannot permanently delete a produk that is still active', function () {
    $produk = Produk::factory()->create();

    $this->actingAs($this->admin)
        ->delete(route('admin.products.force-delete', $produk->id_produk))
        ->assertNotFound();

    expect(Produk::find($produk->id_produk))->not->toBeNull();
});

// ─── Daftar arsip ────────────────────────────────────────────────────────────

test('archive view lists only archived produk', function () {
    Produk::factory()->create(['nama' => 'Masih Dijual']);
    produkTerarsip(['nama' => 'Sudah Diarsipkan']);

    $this->actingAs($this->admin)
        ->get(route('admin.products', ['view' => 'arsip']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/Products')
            ->where('produks.data', fn ($data) => collect($data)->pluck('nama')->all() === ['Sudah Diarsipkan'])
        );
});

/**
 * Tombol "hapus permanen" di antarmuka mengikuti penanda ini. Kalau penandanya
 * salah, kasir ditawari tombol yang pasti gagal — atau lebih buruk, tidak
 * ditawari padahal boleh.
 */
test('archive list flags which produk can be permanently deleted', function () {
    produkTerarsip(['nama' => 'Duplikat Salah Input']);

    $terpakai = produkTerarsip(['nama' => 'Sudah Pernah Terjual']);
    $transaksi = Transaksi::factory()->create();
    DetailTransaksi::factory()->create([
        'id_transaksi' => $transaksi->id_transaksi,
        'id_produk' => $terpakai->id_produk,
        'jumlah' => 1,
        'harga' => $terpakai->harga_jual,
        'subtotal' => $terpakai->harga_jual,
    ]);

    $this->actingAs($this->admin)
        ->get(route('admin.products', ['view' => 'arsip']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/Products')
            ->where('produks.data', fn ($data) => collect($data)->firstWhere('nama', 'Duplikat Salah Input')['bisa_hapus'] === true
                && collect($data)->firstWhere('nama', 'Sudah Pernah Terjual')['bisa_hapus'] === false
            )
        );
});
