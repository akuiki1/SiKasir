<?php

use App\Models\Produk;
use App\Models\Produksi;
use App\Models\User;

test('admin can view the produksi page with batches and produksi-type products', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produkProduksi = Produk::factory()->create(['jenis' => 'produksi']);
    Produk::factory()->create(['jenis' => 'beli']); // tidak boleh muncul di daftar pilihan
    Produksi::factory()->create(['id_produk' => $produkProduksi->id_produk]);

    $response = $this->actingAs($admin)->get(route('admin.produksi'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('admin/Produksi')
            ->has('produksis')
            ->has('produks', 1) // hanya produk jenis 'produksi'
            ->has('stats.total_batch')
            ->has('stats.total_unit')
            ->has('stats.total_biaya')
    );
});

test('recording a production batch computes unit cost, adds stock and updates product modal', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['jenis' => 'produksi', 'stok' => 0, 'harga_modal' => 0]);

    $response = $this->actingAs($admin)->post(route('admin.produksi.store'), [
        'id_produk' => $produk->id_produk,
        'jumlah' => 100,
        'catatan' => 'Batch sambal pagi',
        'biayas' => [
            ['nama' => 'Kemasan 100 lembar', 'nominal' => 50000],
            ['nama' => 'Bawang merah ~2kg', 'nominal' => 200000],
        ],
    ]);

    $response->assertRedirect(route('admin.produksi'));
    $response->assertSessionHas('success');

    // total biaya 250.000 / 100 unit = 2.500 per unit
    $this->assertDatabaseHas('produksis', [
        'id_produk' => $produk->id_produk,
        'jumlah' => 100,
        'total_biaya' => 250000,
        'modal_per_unit' => 2500,
    ]);
    $this->assertDatabaseCount('produksi_biayas', 2);

    // Stok bertambah & modal produk diperbarui ke modal/unit batch
    expect($produk->fresh()->stok)->toBe(100.0);
    expect($produk->fresh()->harga_modal)->toBe(2500);
});

test('production batch is rejected for a non-produksi product', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['jenis' => 'beli']);

    $response = $this->actingAs($admin)
        ->from(route('admin.produksi'))
        ->post(route('admin.produksi.store'), [
            'id_produk' => $produk->id_produk,
            'jumlah' => 10,
            'biayas' => [
                ['nama' => 'Bahan', 'nominal' => 10000],
            ],
        ]);

    $response->assertSessionHasErrors('id_produk');
    $this->assertDatabaseCount('produksis', 0);
});

test('production batch requires a cost source (total or itemized)', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['jenis' => 'produksi']);

    // Tanpa total_biaya dan tanpa rincian biayas → ditolak.
    $this->actingAs($admin)
        ->from(route('admin.produksi'))
        ->post(route('admin.produksi.store'), [
            'id_produk' => $produk->id_produk,
            'jumlah' => 10,
        ])
        ->assertSessionHasErrors('total_biaya');

    $this->assertDatabaseCount('produksis', 0);
});

test('recording a production batch in simple mode uses total_biaya without cost lines', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['jenis' => 'produksi', 'stok' => 0, 'harga_modal' => 0]);

    $response = $this->actingAs($admin)->post(route('admin.produksi.store'), [
        'id_produk' => $produk->id_produk,
        'jumlah' => 50,
        'mode' => 'sederhana',
        'total_biaya' => 100000,
    ]);

    $response->assertRedirect(route('admin.produksi'));
    $response->assertSessionHas('success');

    // modal/unit = 100.000 / 50 = 2.000, tanpa baris rincian biaya
    $this->assertDatabaseHas('produksis', [
        'id_produk' => $produk->id_produk,
        'jumlah' => 50,
        'total_biaya' => 100000,
        'modal_per_unit' => 2000,
    ]);
    $this->assertDatabaseCount('produksi_biayas', 0);

    expect($produk->fresh()->stok)->toBe(50.0);
    expect($produk->fresh()->harga_modal)->toBe(2000);
});

test('production batch requires a positive output quantity', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['jenis' => 'produksi']);

    $this->actingAs($admin)
        ->from(route('admin.produksi'))
        ->post(route('admin.produksi.store'), [
            'id_produk' => $produk->id_produk,
            'jumlah' => 0,
            'biayas' => [
                ['nama' => 'Bahan', 'nominal' => 10000],
            ],
        ])
        ->assertSessionHasErrors('jumlah');

    $this->assertDatabaseCount('produksis', 0);
});

test('deleting a production batch reverses the added stock', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['jenis' => 'produksi', 'stok' => 100]);
    $produksi = Produksi::factory()->create([
        'id_produk' => $produk->id_produk,
        'jumlah' => 40,
    ]);

    $response = $this->actingAs($admin)->delete(route('admin.produksi.destroy', $produksi->id_produksi));

    $response->assertRedirect(route('admin.produksi'));
    $this->assertDatabaseMissing('produksis', ['id_produksi' => $produksi->id_produksi]);
    expect($produk->fresh()->stok)->toBe(60.0); // 100 - 40
});

test('kasir cannot access produksi pages', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);

    $this->actingAs($kasir)->get(route('admin.produksi'))->assertForbidden();
});

test('guests are redirected from produksi pages', function () {
    $this->get(route('admin.produksi'))->assertRedirect(route('login'));
});
