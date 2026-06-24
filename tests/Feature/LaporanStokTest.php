<?php

use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia;

/*
|--------------------------------------------------------------------------
| Laporan Stok & Inventaris — Analisis ABC (perputaran stok).
|--------------------------------------------------------------------------
*/

/** Helper: catat penjualan `jumlah` unit produk pada tanggal tertentu. */
function jualProduk(Produk $produk, float $jumlah, User $kasir, ?Carbon $tanggal = null): void
{
    $tanggal ??= Carbon::today()->setTime(10, 0);
    $subtotal = (int) round($jumlah * $produk->harga_jual);

    $trx = Transaksi::factory()->create([
        'id_user' => $kasir->id,
        'total_harga' => $subtotal,
        'metode_pembayaran' => 'cash',
        'bayar' => $subtotal,
        'kembalian' => 0,
        'created_at' => $tanggal,
    ]);

    DetailTransaksi::factory()->create([
        'id_transaksi' => $trx->id_transaksi,
        'id_produk' => $produk->id_produk,
        'jumlah' => $jumlah,
        'harga' => $produk->harga_jual,
        'modal' => $produk->harga_modal,
        'subtotal' => $subtotal,
    ]);
}

test('admin can view the inventory report and other roles cannot', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kasir = User::factory()->create(['role' => 'kasir']);

    $this->get(route('admin.laporan.inventaris'))->assertRedirect(route('login'));
    $this->actingAs($kasir)->get(route('admin.laporan.inventaris'))->assertForbidden();
    $this->actingAs($admin)->get(route('admin.laporan.inventaris'))->assertOk();
});

test('products are classified into fast, slow, and dead stock by turnover', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    // Fast: mendominasi volume penjualan (100 unit).
    $fast = Produk::factory()->create(['harga_jual' => 10000, 'harga_modal' => 4000, 'stok' => 5]);
    // Slow: masih terjual tapi sedikit (1 unit) → sisa volume di luar 80% teratas.
    $slow = Produk::factory()->create(['harga_jual' => 8000, 'harga_modal' => 3000, 'stok' => 10]);
    // Dead: tidak terjual sama sekali, tapi modal mengendap di stok.
    $dead = Produk::factory()->create(['harga_jual' => 9000, 'harga_modal' => 5000, 'stok' => 8]);
    // Jasa: dikecualikan (tidak mengelola stok) walau ada transaksi.
    $jasa = Produk::factory()->create(['tipe_jual' => 'jasa', 'harga_jual' => 2500, 'harga_modal' => 0, 'stok' => 0]);

    jualProduk($fast, 100, $admin);
    jualProduk($slow, 1, $admin);
    jualProduk($jasa, 1, $admin);

    $response = $this->actingAs($admin)->get(route('admin.laporan.inventaris'));

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('admin/laporan/Inventaris')
        ->has('products', 3) // jasa dikecualikan
        ->where('totals.products', 3)
        ->where('totals.stock_value', 5 * 4000 + 10 * 3000 + 8 * 5000) // 90.000
        ->where('summary.fast.count', 1)
        ->where('summary.slow.count', 1)
        ->where('summary.dead.count', 1)
        ->where('summary.dead.stock_value', 8 * 5000) // 40.000
    );
});

test('inventory report defaults to the current calendar year', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('admin.laporan.inventaris'));

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->where('date_range.start_date', Carbon::today()->startOfYear()->toDateString())
        ->where('date_range.end_date', Carbon::today()->endOfYear()->toDateString())
    );
});

test('a product unsold within the window but in stock counts as dead stock', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $produk = Produk::factory()->create(['harga_jual' => 10000, 'harga_modal' => 6000, 'stok' => 3]);

    // Penjualan lama (tahun lalu) di luar jendela default tahun berjalan.
    jualProduk($produk, 5, $admin, Carbon::today()->subYear()->setTime(10, 0));

    $response = $this->actingAs($admin)->get(route('admin.laporan.inventaris'));

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->where('summary.dead.count', 1)
        ->where('summary.fast.count', 0)
        ->where('summary.slow.count', 0)
        // last_sold tetap tercatat (sepanjang waktu) untuk konteks.
        ->where('products.0.kelas', 'dead')
        ->where('products.0.last_sold', fn ($v) => $v !== null)
    );
});
