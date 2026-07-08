<?php

use App\Models\Produk;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('mengganti foto produk menghapus berkas foto lama dari disk', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);

    Storage::disk('public')->put('produk/lama.jpg', 'isi-lama');
    $produk = Produk::factory()->create(['foto' => 'produk/lama.jpg']);

    $this->actingAs($admin)->put(
        route('admin.products.update', $produk->id_produk),
        [
            'id_kategori' => $produk->id_kategori,
            'nama' => $produk->nama,
            'harga_jual' => 10000,
            'stok' => 5,
            'foto_upload' => UploadedFile::fake()->image('baru.jpg'),
        ]
    )->assertRedirect(route('admin.products'));

    // Foto lama terhapus, foto baru tersimpan.
    Storage::disk('public')->assertMissing('produk/lama.jpg');

    $produk->refresh();
    expect($produk->foto)->not->toBe('produk/lama.jpg');
    Storage::disk('public')->assertExists($produk->foto);
});

test('mengganti foto lokal ke URL internet menghapus berkas lama', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);

    Storage::disk('public')->put('produk/lama.jpg', 'isi-lama');
    $produk = Produk::factory()->create(['foto' => 'produk/lama.jpg']);

    $this->actingAs($admin)->put(
        route('admin.products.update', $produk->id_produk),
        [
            'id_kategori' => $produk->id_kategori,
            'nama' => $produk->nama,
            'harga_jual' => 10000,
            'stok' => 5,
            'foto' => 'https://contoh.test/gambar.jpg',
        ]
    )->assertRedirect(route('admin.products'));

    Storage::disk('public')->assertMissing('produk/lama.jpg');
    expect($produk->refresh()->foto)->toBe('https://contoh.test/gambar.jpg');
});

test('foto berupa URL internet tidak dianggap berkas lokal saat diganti', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);

    // Foto lama = URL eksternal (tak ada berkas di disk). Menggantinya tidak boleh
    // error karena helper hapus foto menjaga URL agar tak diperlakukan sebagai path.
    $produk = Produk::factory()->create(['foto' => 'https://contoh.test/lama.jpg']);

    $this->actingAs($admin)->put(
        route('admin.products.update', $produk->id_produk),
        [
            'id_kategori' => $produk->id_kategori,
            'nama' => $produk->nama,
            'harga_jual' => 10000,
            'stok' => 5,
            'foto_upload' => UploadedFile::fake()->image('baru.jpg'),
        ]
    )->assertRedirect(route('admin.products'));

    $produk->refresh();
    Storage::disk('public')->assertExists($produk->foto);
});

test('hapus permanen produk menghapus berkas fotonya dari disk', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);

    Storage::disk('public')->put('produk/hapus.jpg', 'isi');
    $produk = Produk::factory()->create(['foto' => 'produk/hapus.jpg']);
    $produk->delete(); // arsipkan (soft delete) dulu

    $this->actingAs($admin)->delete(
        route('admin.products.force-delete', $produk->id_produk)
    )->assertRedirect(route('admin.products', ['view' => 'arsip']));

    Storage::disk('public')->assertMissing('produk/hapus.jpg');
    expect(Produk::withTrashed()->find($produk->id_produk))->toBeNull();
});
