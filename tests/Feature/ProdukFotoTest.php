<?php

use App\Models\Kategori;
use App\Models\Produk;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('upload foto saat store tersimpan ke disk public', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin']);
    $kategori = Kategori::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'id_kategori' => $kategori->id_kategori,
        'nama' => 'Keripik Pedas',
        'harga_jual' => 15000,
        'stok' => 10,
        'foto_upload' => UploadedFile::fake()->image('foto.jpg', 800, 600),
    ]);

    $response->assertRedirect(route('admin.products'));
    $produk = Produk::first();
    expect($produk->foto)->not->toBeNull();
    Storage::disk('public')->assertExists($produk->foto);
});

test('mengganti foto saat update menghapus file lama (tidak menyisakan yatim)', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin']);
    $kategori = Kategori::factory()->create();

    // Buat produk dengan foto awal.
    $fotoLama = UploadedFile::fake()->image('lama.jpg', 800, 600)->store('produk', 'public');
    $produk = Produk::factory()->create(['id_kategori' => $kategori->id_kategori, 'foto' => $fotoLama]);
    Storage::disk('public')->assertExists($fotoLama);

    // Update dengan foto baru.
    $this->actingAs($admin)->put(route('admin.products.update', $produk->id_produk), [
        'id_kategori' => $kategori->id_kategori,
        'nama' => $produk->nama,
        'harga_jual' => $produk->harga_jual,
        'stok' => $produk->stok,
        'foto_upload' => UploadedFile::fake()->image('baru.jpg', 800, 600),
    ]);

    $produk->refresh();
    Storage::disk('public')->assertExists($produk->foto);        // foto baru ada
    Storage::disk('public')->assertMissing($fotoLama);           // foto lama TIDAK menumpuk
});

test('foto URL eksternal tidak ikut dihapus saat update', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin']);
    $kategori = Kategori::factory()->create();
    $produk = Produk::factory()->create([
        'id_kategori' => $kategori->id_kategori,
        'foto' => 'https://contoh.com/gambar.jpg',
    ]);

    // Update tanpa mengganti foto (kirim ulang URL eksternal) — tidak boleh error.
    $this->actingAs($admin)->put(route('admin.products.update', $produk->id_produk), [
        'id_kategori' => $kategori->id_kategori,
        'nama' => 'Nama Baru',
        'harga_jual' => $produk->harga_jual,
        'stok' => $produk->stok,
        'foto' => 'https://contoh.com/gambar.jpg',
    ]);

    expect($produk->fresh()->foto)->toBe('https://contoh.com/gambar.jpg');
});
