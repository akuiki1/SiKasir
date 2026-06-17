<?php

use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Quick-pick "Sering dibeli" — top seller untuk akses cepat tanpa scan.
|--------------------------------------------------------------------------
*/

test('the kasir transaksi page returns frequently-bought products as favorite_ids, most sold first', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $popular = Produk::factory()->create(['nama' => 'Permen Mint', 'stok' => 50]);
    $rare = Produk::factory()->create(['nama' => 'Permen Susu', 'stok' => 50]);

    $trx = Transaksi::factory()->create(['id_user' => $kasir->id]);
    DetailTransaksi::factory()->create([
        'id_transaksi' => $trx->id_transaksi,
        'id_produk' => $popular->id_produk,
        'jumlah' => 10,
    ]);
    DetailTransaksi::factory()->create([
        'id_transaksi' => $trx->id_transaksi,
        'id_produk' => $rare->id_produk,
        'jumlah' => 1,
    ]);

    $this->actingAs($kasir)->get(route('kasir.transaksi'))->assertInertia(
        fn ($page) => $page
            ->component('kasir/Transaksi')
            ->has('favorite_ids', 2)
            ->where('favorite_ids.0', $popular->id_produk) // paling laku di urutan pertama
            ->where('favorite_ids.1', $rare->id_produk)
    );
});

test('out-of-stock and jasa products are not offered as quick-pick favorites', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $habis = Produk::factory()->create(['nama' => 'Permen Habis', 'stok' => 0]);
    $jasa = Produk::factory()->create(['nama' => 'Transfer', 'tipe_jual' => 'jasa', 'stok' => 0]);

    $trx = Transaksi::factory()->create(['id_user' => $kasir->id]);
    DetailTransaksi::factory()->create([
        'id_transaksi' => $trx->id_transaksi,
        'id_produk' => $habis->id_produk,
        'jumlah' => 20,
    ]);
    DetailTransaksi::factory()->create([
        'id_transaksi' => $trx->id_transaksi,
        'id_produk' => $jasa->id_produk,
        'jumlah' => 5,
    ]);

    $this->actingAs($kasir)->get(route('kasir.transaksi'))->assertInertia(
        fn ($page) => $page
            ->component('kasir/Transaksi')
            ->has('favorite_ids', 0) // habis & jasa dikecualikan
    );
});
