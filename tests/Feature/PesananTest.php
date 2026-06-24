<?php

use App\Models\Pelanggan;
use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Pesanan online (pending) → proses pembayaran di kasir.
|--------------------------------------------------------------------------
*/

test('a web order is saved as pending and reserves stock', function () {
    $produk = Produk::factory()->create([
        'harga_jual' => 10000,
        'stok' => 10,
        'tipe_jual' => 'satuan',
    ]);

    $this->postJson(route('pesan.store'), [
        'nama' => 'Budi',
        'telp' => '081298765432',
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2],
        ],
    ])->assertOk()->assertJsonStructure(['kode', 'total', 'wa_url']);

    $this->assertDatabaseHas('pesanans', [
        'nama_pelanggan' => 'Budi',
        'tipe_pelanggan' => 'umum',
        'status' => 'pending',
        'total' => 20000,
        'id_pelanggan' => null,
    ]);
    $this->assertDatabaseHas('pesanan_items', [
        'id_produk' => $produk->id_produk,
        'jumlah' => 2,
        'harga' => 10000,
        'subtotal' => 20000,
    ]);

    // Stok di-reserve (berkurang) + tercatat di kartu stok sebagai 'pesanan'.
    expect((float) $produk->fresh()->stok)->toBe(8.0);
    $this->assertDatabaseHas('stok_mutasis', [
        'id_produk' => $produk->id_produk,
        'tipe' => 'pesanan',
    ]);
});

test('a web order is rejected when stock is insufficient', function () {
    $produk = Produk::factory()->create(['stok' => 1, 'tipe_jual' => 'satuan']);

    $this->postJson(route('pesan.store'), [
        'nama' => 'Budi',
        'telp' => '081298765432',
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 5],
        ],
    ])->assertStatus(422);

    // Transaksi pesanan di-rollback → stok utuh, tidak ada pesanan tersimpan.
    expect((float) $produk->fresh()->stok)->toBe(1.0);
    $this->assertDatabaseCount('pesanans', 0);
});

test('a web order matches a registered reseller by WA number and applies reseller price', function () {
    $reseller = Pelanggan::create([
        'nama' => 'Toko Budi',
        'telp' => '081254744177',
        'tipe' => 'reseller',
    ]);
    $produk = Produk::factory()->create([
        'harga_jual' => 10000,
        'potongan_reseller' => 2000,
        'stok' => 10,
        'tipe_jual' => 'satuan',
    ]);

    $this->postJson(route('pesan.store'), [
        'nama' => 'Budi',
        'telp' => '0812-5474-4177',
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2],
        ],
    ])->assertOk();

    $this->assertDatabaseHas('pesanans', [
        'id_pelanggan' => $reseller->id_pelanggan,
        'tipe_pelanggan' => 'reseller',
        'total' => 16000, // (10.000 - 2.000) x 2
    ]);
    $this->assertDatabaseHas('pesanan_items', [
        'id_produk' => $produk->id_produk,
        'harga' => 8000,
        'subtotal' => 16000,
    ]);
});

test('a web order rejects non-satuan products', function () {
    $jasa = Produk::factory()->create(['tipe_jual' => 'jasa', 'stok' => 0]);

    $this->postJson(route('pesan.store'), [
        'nama' => 'Budi',
        'telp' => '081298765432',
        'items' => [
            ['id_produk' => $jasa->id_produk, 'jumlah' => 1],
        ],
    ])->assertStatus(422);

    $this->assertDatabaseCount('pesanans', 0);
});

test('a kasir can mark an order as ready', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $pesanan = buatPesanan();

    $this->actingAs($kasir)
        ->from(route('kasir.pesanan'))
        ->post(route('kasir.pesanan.siap', $pesanan))
        ->assertRedirect(route('kasir.pesanan'));

    $pesanan->refresh();
    expect($pesanan->status)->toBe('disiapkan');
    expect($pesanan->disiapkan_at)->not->toBeNull();
});

test('processing an order creates a transaction without double-deducting stock', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create([
        'harga_jual' => 10000,
        'harga_modal' => 6000,
        'stok' => 10,
        'tipe_jual' => 'satuan',
    ]);

    // Pesan via storefront → reserve stok (10 → 8).
    $this->postJson(route('pesan.store'), [
        'nama' => 'Budi',
        'telp' => '081298765432',
        'items' => [['id_produk' => $produk->id_produk, 'jumlah' => 2]],
    ])->assertOk();

    $pesanan = Pesanan::first();
    expect((float) $produk->fresh()->stok)->toBe(8.0);

    $this->actingAs($kasir)
        ->from(route('kasir.pesanan'))
        ->post(route('kasir.pesanan.proses', $pesanan), [
            'metode_pembayaran' => 'cash',
            'bayar' => 20000,
        ])->assertRedirect(route('kasir.pesanan'));

    $this->assertDatabaseHas('transaksis', [
        'total_harga' => 20000,
        'kembalian' => 0,
        'id_pelanggan' => null,
    ]);
    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $produk->id_produk,
        'jumlah' => 2,
        'harga' => 10000,
        'subtotal' => 20000,
        'modal' => 6000,
    ]);

    $pesanan->refresh();
    expect($pesanan->status)->toBe('selesai');
    expect($pesanan->id_transaksi)->not->toBeNull();

    // Stok TIDAK dikurangi lagi (reservasi = stock-out); tidak ada mutasi 'jual'.
    expect((float) $produk->fresh()->stok)->toBe(8.0);
    $this->assertDatabaseMissing('stok_mutasis', [
        'id_produk' => $produk->id_produk,
        'tipe' => 'jual',
    ]);
});

test('processing is rejected when bayar is less than the order total', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $pesanan = buatPesanan(20000);

    $this->actingAs($kasir)
        ->from(route('kasir.pesanan'))
        ->post(route('kasir.pesanan.proses', $pesanan), [
            'metode_pembayaran' => 'cash',
            'bayar' => 10000,
        ])->assertSessionHasErrors('bayar');

    $this->assertDatabaseCount('transaksis', 0);
    expect($pesanan->fresh()->status)->toBe('pending');
});

test('cancelling an order returns the reserved stock', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10, 'tipe_jual' => 'satuan']);

    $this->postJson(route('pesan.store'), [
        'nama' => 'Budi',
        'telp' => '081298765432',
        'items' => [['id_produk' => $produk->id_produk, 'jumlah' => 3]],
    ])->assertOk();

    $pesanan = Pesanan::first();
    expect((float) $produk->fresh()->stok)->toBe(7.0);

    $this->actingAs($kasir)
        ->from(route('kasir.pesanan'))
        ->post(route('kasir.pesanan.batal', $pesanan))
        ->assertRedirect(route('kasir.pesanan'));

    expect($pesanan->fresh()->status)->toBe('batal');
    expect((float) $produk->fresh()->stok)->toBe(10.0);
    $this->assertDatabaseHas('stok_mutasis', [
        'id_produk' => $produk->id_produk,
        'tipe' => 'pesanan_batal',
    ]);
});

test('the kasir pesanan page lists active orders', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    buatPesanan();

    $this->actingAs($kasir)->get(route('kasir.pesanan'))->assertInertia(
        fn ($page) => $page->component('pesanan/Index')->has('pesanans_aktif', 1)->has('produks')
    );
});

test('a guest cannot access the kasir pesanan page', function () {
    $this->get(route('kasir.pesanan'))->assertRedirect(route('login'));
});

test('an admin can access the admin pesanan page', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    buatPesanan();

    $this->actingAs($admin)->get(route('admin.pesanan'))->assertInertia(
        fn ($page) => $page->component('pesanan/Index')
            ->has('pesanans_aktif', 1)
            ->where('base_url', '/admin/pesanan')
    );
});

test('orders can be searched by customer name', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);

    $p1 = buatPesanan();
    $p1->update(['nama_pelanggan' => 'Andi Wijaya']);
    $p2 = buatPesanan();
    $p2->update(['nama_pelanggan' => 'Budi Santoso']);

    $this->actingAs($kasir)->get(route('kasir.pesanan', ['search' => 'Andi']))->assertInertia(
        fn ($page) => $page->component('pesanan/Index')
            ->has('pesanans_aktif', 1)
            ->where('pesanans_aktif.0.nama_pelanggan', 'Andi Wijaya')
    );
});

test('editing an order reconciles reserved stock per product', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10, 'tipe_jual' => 'satuan']);
    $lain = Produk::factory()->create(['harga_jual' => 5000, 'stok' => 8, 'tipe_jual' => 'satuan']);

    // Pesan 2 unit produk → stok 10 → 8.
    $this->postJson(route('pesan.store'), [
        'nama' => 'Budi',
        'telp' => '081298765432',
        'items' => [['id_produk' => $produk->id_produk, 'jumlah' => 2]],
    ])->assertOk();

    $pesanan = Pesanan::first();
    expect((float) $produk->fresh()->stok)->toBe(8.0);

    // Edit: produk jadi 3 unit (delta +1 → stok 7) + tambah produk lain 2 unit (stok 8 → 6).
    $this->actingAs($kasir)
        ->from(route('kasir.pesanan'))
        ->post(route('kasir.pesanan.edit', $pesanan), [
            'items' => [
                ['id_produk' => $produk->id_produk, 'jumlah' => 3],
                ['id_produk' => $lain->id_produk, 'jumlah' => 2],
            ],
        ])->assertRedirect(route('kasir.pesanan'));

    expect((float) $produk->fresh()->stok)->toBe(7.0);
    expect((float) $lain->fresh()->stok)->toBe(6.0);

    $pesanan->refresh();
    expect($pesanan->total)->toBe(3 * 10000 + 2 * 5000);
    expect($pesanan->items()->count())->toBe(2);
});

test('removing all items via edit is rejected', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $pesanan = buatPesanan();

    $this->actingAs($kasir)
        ->from(route('kasir.pesanan'))
        ->post(route('kasir.pesanan.edit', $pesanan), ['items' => []])
        ->assertSessionHasErrors('items');
});

test('a kasir can save the cart as a pending order instead of processing', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 12000, 'stok' => 10, 'tipe_jual' => 'satuan']);

    $this->actingAs($kasir)
        ->from(route('kasir.transaksi'))
        ->post(route('kasir.transaksi.store'), [
            'mode' => 'pesanan',
            'nama_pelanggan' => 'Walk-in Ardi',
            'telp' => '081211112222',
            'items' => [['id_produk' => $produk->id_produk, 'jumlah' => 2]],
        ])->assertRedirect(route('kasir.pesanan'));

    $this->assertDatabaseHas('pesanans', [
        'nama_pelanggan' => 'Walk-in Ardi',
        'status' => 'pending',
        'sumber' => 'kasir',
        'total' => 24000,
    ]);
    // Stok ter-reserve (10 → 8); belum jadi transaksi.
    expect((float) $produk->fresh()->stok)->toBe(8.0);
    $this->assertDatabaseCount('transaksis', 0);
});

test('the public lookup returns orders for a WA number', function () {
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10, 'tipe_jual' => 'satuan']);

    $this->postJson(route('pesan.store'), [
        'nama' => 'Citra',
        'telp' => '081333344455',
        'items' => [['id_produk' => $produk->id_produk, 'jumlah' => 1]],
    ])->assertOk();

    $this->postJson(route('pesan.lacak'), ['telp' => '0813-3334-4455'])
        ->assertOk()
        ->assertJsonPath('pesanans.0.nama_pelanggan', 'Citra')
        ->assertJsonPath('pesanans.0.status', 'pending');
});

test('the public lookup matches the exact number, not just shared trailing digits', function () {
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10, 'tipe_jual' => 'satuan']);

    // Dua nomor BERBEDA yang berbagi 9 digit terakhir (…333344455).
    $this->postJson(route('pesan.store'), [
        'nama' => 'Citra',
        'telp' => '081333344455',
        'items' => [['id_produk' => $produk->id_produk, 'jumlah' => 1]],
    ])->assertOk();

    $this->postJson(route('pesan.store'), [
        'nama' => 'Dewi',
        'telp' => '089333344455',
        'items' => [['id_produk' => $produk->id_produk, 'jumlah' => 1]],
    ])->assertOk();

    // Melacak nomor Citra TIDAK boleh memunculkan pesanan Dewi (anti-substring).
    $this->postJson(route('pesan.lacak'), ['telp' => '081333344455'])
        ->assertOk()
        ->assertJsonCount(1, 'pesanans')
        ->assertJsonPath('pesanans.0.nama_pelanggan', 'Citra');
});

test('abandoned orders are auto-expired and stock is returned', function () {
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10, 'tipe_jual' => 'satuan']);

    $this->postJson(route('pesan.store'), [
        'nama' => 'Lama',
        'telp' => '081298765432',
        'items' => [['id_produk' => $produk->id_produk, 'jumlah' => 3]],
    ])->assertOk();

    $pesanan = Pesanan::first();
    expect((float) $produk->fresh()->stok)->toBe(7.0);

    // Majukan umur pesanan melewati 14 hari.
    $pesanan->forceFill(['created_at' => now()->subDays(15)])->save();

    $this->artisan('pesanan:expire')->assertExitCode(0);

    expect($pesanan->fresh()->status)->toBe('batal');
    expect((float) $produk->fresh()->stok)->toBe(10.0);
    $this->assertDatabaseHas('stok_mutasis', [
        'id_produk' => $produk->id_produk,
        'tipe' => 'pesanan_batal',
    ]);
});

/** Helper: buat satu pesanan pending lengkap dengan item (reserve stok manual). */
function buatPesanan(int $total = 20000): Pesanan
{
    $produk = Produk::factory()->create([
        'harga_jual' => 10000,
        'stok' => 10,
        'tipe_jual' => 'satuan',
    ]);

    $pesanan = Pesanan::create([
        'nama_pelanggan' => 'Budi',
        'telp' => '6281298765432',
        'tipe_pelanggan' => 'umum',
        'status' => 'pending',
        'total' => $total,
        'sumber' => 'web',
    ]);

    $pesanan->items()->create([
        'id_produk' => $produk->id_produk,
        'nama_produk' => $produk->nama,
        'harga' => 10000,
        'jumlah' => max(1, (int) ($total / 10000)),
        'subtotal' => $total,
    ]);

    return $pesanan;
}
