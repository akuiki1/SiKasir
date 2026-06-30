<?php

use App\Models\Kategori;
use App\Models\Produk;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Produk jasa (transfer / tarik tunai) — fee = omzet, nominal = pass-through.
|--------------------------------------------------------------------------
*/

test('selling a jasa records only the fee as revenue and stores nominal as pass-through', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $transfer = Produk::factory()->create([
        'tipe_jual' => 'jasa',
        'satuan' => 'transaksi',
        'harga_jual' => 0,
        'harga_modal' => 0,
        'stok' => 0,
    ]);

    // Pelanggan membayar tunai nominal + fee = 505.000 (titipan ikut dibayar tunai).
    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 505000,
        'items' => [
            ['id_produk' => $transfer->id_produk, 'jumlah' => 1, 'nominal' => 500000, 'fee' => 5000],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    // Omzet (total_harga) = fee saja (5.000), BUKAN 505.000. Kembalian = 505.000 - 505.000 = 0.
    $this->assertDatabaseHas('transaksis', [
        'total_harga' => 5000,
        'kembalian' => 0,
    ]);
    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $transfer->id_produk,
        'jumlah' => 1,
        'harga' => 5000,
        'subtotal' => 5000,
        'modal' => 0,
        'nominal' => 500000, // pass-through, hanya catatan
    ]);

    // Jasa tidak menyentuh stok maupun kartu stok.
    expect((float) $transfer->fresh()->stok)->toBe(0.0);
    $this->assertDatabaseMissing('stok_mutasis', ['id_produk' => $transfer->id_produk]);
});

test('a jasa sale without a fee is rejected', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $transfer = Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0]);

    $this->actingAs($kasir)
        ->from(route('kasir.transaksi'))
        ->post(route('kasir.transaksi.store'), [
            'metode_pembayaran' => 'cash',
            'bayar' => 5000,
            'items' => [
                ['id_produk' => $transfer->id_produk, 'jumlah' => 1, 'nominal' => 500000],
            ],
        ])
        ->assertSessionHasErrors('items');

    $this->assertDatabaseCount('transaksis', 0);
});

test('a jasa sale without a nominal is rejected', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $transfer = Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0]);

    $this->actingAs($kasir)
        ->from(route('kasir.transaksi'))
        ->post(route('kasir.transaksi.store'), [
            'metode_pembayaran' => 'cash',
            'bayar' => 5000,
            'items' => [
                ['id_produk' => $transfer->id_produk, 'jumlah' => 1, 'fee' => 5000],
            ],
        ])
        ->assertSessionHasErrors('items');

    $this->assertDatabaseCount('transaksis', 0);
});

test('a mixed cart (product + jasa) totals product subtotal plus fee only', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10]);
    $transfer = Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0]);

    // Tagihan tunai = omzet 24.000 + titipan 1.000.000 = 1.024.000. Bayar 1.025.000 → kembalian 1.000.
    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 1025000,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2], // 20.000
            ['id_produk' => $transfer->id_produk, 'jumlah' => 1, 'nominal' => 1000000, 'fee' => 4000],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    // omzet (total_harga) = 20.000 (produk) + 4.000 (fee) = 24.000 ; nominal 1.000.000 TIDAK dihitung.
    $this->assertDatabaseHas('transaksis', [
        'total_harga' => 24000,
        'kembalian' => 1000,
    ]);

    // Stok produk biasa tetap berkurang; jasa tidak.
    expect((float) $produk->fresh()->stok)->toBe(8.0);
});

test('the kasir transaksi page also carries the jasa layanan list for the unified cart', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    Produk::factory()->create(['tipe_jual' => 'satuan']);
    Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0]);

    // Jasa kini bisa ditambahkan ke keranjang produk yang sama (1 transaksi campuran).
    $this->actingAs($kasir)->get(route('kasir.transaksi'))->assertInertia(
        fn ($page) => $page->component('kasir/Transaksi')->has('layanan', 1)
    );
});

test('a single transaction can mix a regular product and a jasa fee', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create([
        'tipe_jual' => 'satuan',
        'harga_jual' => 10000,
        'harga_modal' => 6000,
        'stok' => 20,
    ]);
    $transfer = Produk::factory()->create([
        'tipe_jual' => 'jasa',
        'harga_jual' => 0,
        'harga_modal' => 0,
        'stok' => 0,
    ]);

    // Omzet = subtotal produk (2×10.000) + fee jasa (5.000) = 25.000. Nominal 500.000 diabaikan dari omzet.
    // Tagihan tunai = 25.000 + 500.000 (titipan) = 525.000. Bayar 530.000 → kembalian 5.000.
    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 530000,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2],
            ['id_produk' => $transfer->id_produk, 'jumlah' => 1, 'nominal' => 500000, 'fee' => 5000],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    $this->assertDatabaseCount('transaksis', 1);
    $this->assertDatabaseHas('transaksis', [
        'total_harga' => 25000, // omzet (nominal titipan tidak termasuk)
        'kembalian' => 5000,
    ]);

    // Baris produk: HPP ke-snapshot, stok berkurang.
    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $produk->id_produk,
        'jumlah' => 2,
        'subtotal' => 20000,
        'modal' => 6000,
    ]);
    expect((float) $produk->fresh()->stok)->toBe(18.0);

    // Baris jasa: fee saja yang omzet, nominal pass-through, tanpa stok/kartu stok.
    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $transfer->id_produk,
        'jumlah' => 1,
        'harga' => 5000,
        'subtotal' => 5000,
        'modal' => 0,
        'nominal' => 500000,
    ]);
    expect((float) $transfer->fresh()->stok)->toBe(0.0);
    $this->assertDatabaseMissing('stok_mutasis', ['id_produk' => $transfer->id_produk]);
});

test('jasa change is computed from nominal plus fee, not the fee alone', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $transfer = Produk::factory()->create(['tipe_jual' => 'jasa', 'harga_jual' => 0, 'harga_modal' => 0, 'stok' => 0]);

    // Nominal 65.000 + fee 3.000 = tagihan 68.000. Bayar 70.000 → kembalian 2.000.
    $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 70000,
        'items' => [
            ['id_produk' => $transfer->id_produk, 'jumlah' => 1, 'nominal' => 65000, 'fee' => 3000],
        ],
    ])->assertRedirect(route('kasir.transaksi'));

    $this->assertDatabaseHas('transaksis', [
        'total_harga' => 3000, // omzet = fee saja
        'bayar' => 70000,
        'kembalian' => 2000, // 70.000 - (65.000 + 3.000)
    ]);
});

test('a jasa sale is rejected when bayar only covers the fee, not the nominal', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $transfer = Produk::factory()->create(['tipe_jual' => 'jasa', 'harga_jual' => 0, 'harga_modal' => 0, 'stok' => 0]);

    // Bayar 3.000 hanya menutup fee, padahal tagihan = 65.000 + 3.000 = 68.000.
    $this->actingAs($kasir)
        ->from(route('kasir.transaksi'))
        ->post(route('kasir.transaksi.store'), [
            'metode_pembayaran' => 'cash',
            'bayar' => 3000,
            'items' => [
                ['id_produk' => $transfer->id_produk, 'jumlah' => 1, 'nominal' => 65000, 'fee' => 3000],
            ],
        ])
        ->assertSessionHasErrors('bayar');

    $this->assertDatabaseCount('transaksis', 0);
});

test('creating a jasa product forces harga_modal and jenis regardless of form input', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kategori = Kategori::factory()->create();

    // Form sengaja mengirim jenis=produksi, harga_jual & harga_modal > 0; semuanya
    // harus diabaikan karena fee jasa diatur via tarif / diketik kasir.
    $this->actingAs($admin)->post(route('admin.products.store'), [
        'id_kategori' => $kategori->id_kategori,
        'nama' => 'Tarik Tunai',
        'tipe_jual' => 'jasa',
        'jenis' => 'produksi',
        'harga_jual' => 12345,
        'harga_modal' => 99999,
        'stok' => 0,
    ])->assertRedirect(route('admin.products'));

    $produk = Produk::where('nama', 'Tarik Tunai')->firstOrFail();
    expect($produk->jenis)->toBe('beli');
    expect((int) $produk->harga_jual)->toBe(0);
    expect((int) $produk->harga_modal)->toBe(0);
    expect((float) $produk->stok)->toBe(0.0);
});

test('switching a product to jasa clears its harga_modal', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create([
        'tipe_jual' => 'satuan',
        'jenis' => 'beli',
        'harga_jual' => 8000,
        'harga_modal' => 5000,
        'stok' => 10,
    ]);

    $this->actingAs($admin)->put(route('admin.products.update', $produk->id_produk), [
        'id_kategori' => $produk->id_kategori,
        'nama' => $produk->nama,
        'tipe_jual' => 'jasa',
        'harga_jual' => 7777,
        'harga_modal' => 7000,
        'stok' => 0,
    ])->assertRedirect(route('admin.products'));

    $fresh = $produk->fresh();
    expect($fresh->jenis)->toBe('beli');
    expect((int) $fresh->harga_jual)->toBe(0);
    expect((int) $fresh->harga_modal)->toBe(0);
    expect((float) $fresh->stok)->toBe(0.0);
});
