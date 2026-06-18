<?php

use App\Models\Produk;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Generate barcode + SKU otomatis (EAN-13 internal toko) untuk produk massal.
|--------------------------------------------------------------------------
*/

test('admin can generate barcodes and skus for all products without a barcode', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $tanpaBarcode = Produk::factory()->create(['barcode' => null, 'sku' => null, 'tipe_jual' => 'satuan']);
    $sudahPunya = Produk::factory()->create(['barcode' => '1234567890123', 'sku' => 'SKU-LAMA', 'tipe_jual' => 'satuan']);

    $this->actingAs($admin)
        ->post(route('admin.products.generate-all'))
        ->assertRedirect(route('admin.products'));

    $tanpaBarcode->refresh();
    expect($tanpaBarcode->barcode)->toMatch('/^\d{13}$/');
    expect($tanpaBarcode->sku)->not->toBeNull();

    // Produk yang sudah punya barcode/SKU tidak boleh diubah.
    $sudahPunya->refresh();
    expect($sudahPunya->barcode)->toBe('1234567890123');
    expect($sudahPunya->sku)->toBe('SKU-LAMA');
});

test('generate all barcodes skips jasa products', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $jasa = Produk::factory()->create(['barcode' => null, 'tipe_jual' => 'jasa']);

    $this->actingAs($admin)->post(route('admin.products.generate-all'));

    expect($jasa->fresh()->barcode)->toBeNull();
});

test('generated barcode is a valid EAN-13 with correct check digit', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Produk::factory()->create(['barcode' => null, 'tipe_jual' => 'satuan']);

    $this->actingAs($admin)->post(route('admin.products.generate-all'));

    $barcode = Produk::value('barcode');
    $base12 = substr($barcode, 0, 12);

    expect($barcode)->toBe($base12.Produk::ean13CheckDigit($base12));
});

test('a kasir cannot generate barcodes for all products', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);

    $this->actingAs($kasir)
        ->post(route('admin.products.generate-all'))
        ->assertForbidden();
});
