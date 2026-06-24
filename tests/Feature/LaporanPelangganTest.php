<?php

use App\Models\DetailTransaksi;
use App\Models\Pelanggan;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia;

/*
|--------------------------------------------------------------------------
| Wawasan Pelanggan — pelanggan terloyal, keranjang & bundling, retensi.
|--------------------------------------------------------------------------
*/

/**
 * Helper: catat satu transaksi (opsional milik pelanggan terdaftar) berisi
 * beberapa produk. $items = list of [Produk, jumlah].
 *
 * @param  list<array{0: Produk, 1: float}>  $items
 */
function transaksiPelanggan(?Pelanggan $pelanggan, array $items, User $kasir, ?Carbon $tanggal = null): Transaksi
{
    $tanggal ??= Carbon::today()->setTime(10, 0);

    $total = 0;
    foreach ($items as [$produk, $jumlah]) {
        $total += (int) round($jumlah * $produk->harga_jual);
    }

    $trx = Transaksi::factory()->create([
        'id_user' => $kasir->id,
        'id_pelanggan' => $pelanggan?->id_pelanggan,
        'total_harga' => $total,
        'metode_pembayaran' => 'cash',
        'bayar' => $total,
        'kembalian' => 0,
        'created_at' => $tanggal,
    ]);

    foreach ($items as [$produk, $jumlah]) {
        DetailTransaksi::factory()->create([
            'id_transaksi' => $trx->id_transaksi,
            'id_produk' => $produk->id_produk,
            'jumlah' => $jumlah,
            'harga' => $produk->harga_jual,
            'modal' => $produk->harga_modal,
            'subtotal' => (int) round($jumlah * $produk->harga_jual),
        ]);
    }

    return $trx;
}

test('admin can view the customer insights report and other roles cannot', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kasir = User::factory()->create(['role' => 'kasir']);

    $this->get(route('admin.laporan.pelanggan'))->assertRedirect(route('login'));
    $this->actingAs($kasir)->get(route('admin.laporan.pelanggan'))->assertForbidden();
    $this->actingAs($admin)->get(route('admin.laporan.pelanggan'))->assertOk();
});

test('customer insights report defaults to the current calendar year', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('admin.laporan.pelanggan'));

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('admin/laporan/Pelanggan')
        ->where('date_range.start_date', Carbon::today()->startOfYear()->toDateString())
        ->where('date_range.end_date', Carbon::today()->endOfYear()->toDateString())
    );
});

test('registered customers are ranked by spend and marked returning vs new', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'harga_modal' => 4000, 'stok' => 200]);

    $reseller = Pelanggan::create(['nama' => 'Toko Budi', 'tipe' => 'reseller']);
    $baru = Pelanggan::create(['nama' => 'Ibu Ani', 'tipe' => 'umum']);

    // Reseller: pernah belanja sebelum jendela (tahun lalu = returning) + 2 transaksi dalam periode.
    transaksiPelanggan($reseller, [[$produk, 5]], $admin, Carbon::today()->subYear()->setTime(9, 0));
    transaksiPelanggan($reseller, [[$produk, 10]], $admin); // 100.000
    transaksiPelanggan($reseller, [[$produk, 10]], $admin); // 100.000 → 200.000, 2 kunjungan

    // Pelanggan baru: transaksi pertamanya jatuh di periode ini.
    transaksiPelanggan($baru, [[$produk, 3]], $admin); // 30.000

    // Walk-in (tanpa pelanggan) → tidak dihitung loyalitas/retensi.
    transaksiPelanggan(null, [[$produk, 1]], $admin);

    $response = $this->actingAs($admin)->get(route('admin.laporan.pelanggan'));

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->has('top_customers', 2) // hanya pelanggan terdaftar
        ->where('top_customers.0.nama', 'Toko Budi')
        ->where('top_customers.0.tipe', 'reseller')
        ->where('top_customers.0.revenue', 200000)
        ->where('top_customers.0.transactions', 2)
        ->where('top_customers.0.is_returning', true)
        ->where('top_customers.1.nama', 'Ibu Ani')
        ->where('top_customers.1.revenue', 30000)
        ->where('top_customers.1.is_returning', false)
        ->where('summary.active_customers', 2)
        ->where('retention.returning', 1)
        ->where('retention.new', 1)
        ->where('retention.repeat_rate', fn ($v) => abs($v - 50) < 0.01)
    );
});

test('average basket and product bundling are computed', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kopi = Produk::factory()->create(['harga_jual' => 10000, 'harga_modal' => 4000, 'stok' => 200]);
    $roti = Produk::factory()->create(['harga_jual' => 8000, 'harga_modal' => 3000, 'stok' => 200]);
    $teh = Produk::factory()->create(['harga_jual' => 5000, 'harga_modal' => 2000, 'stok' => 200]);

    // 3 transaksi membeli kopi + roti bersamaan → pasangan dominan (muncul 3x).
    transaksiPelanggan(null, [[$kopi, 1], [$roti, 1]], $admin); // 18.000
    transaksiPelanggan(null, [[$kopi, 1], [$roti, 1]], $admin); // 18.000
    transaksiPelanggan(null, [[$kopi, 1], [$roti, 1]], $admin); // 18.000
    // 1 transaksi single-item.
    transaksiPelanggan(null, [[$teh, 1]], $admin); // 5.000

    // total omzet = 18.000*3 + 5.000 = 59.000; 4 transaksi → rata-rata 14.750.
    $response = $this->actingAs($admin)->get(route('admin.laporan.pelanggan'));

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->where('summary.total_transactions', 4)
        ->where('summary.total_revenue', 59000)
        ->where('summary.avg_basket', 14750)
        ->where('summary.multi_item_rate', fn ($v) => abs($v - 75) < 0.01) // 3 dari 4 transaksi
        ->has('bundles', 1)
        ->where('bundles.0.count', 3)
    );
});

test('jasa lines are excluded from bundling pairs', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kopi = Produk::factory()->create(['harga_jual' => 10000, 'harga_modal' => 4000, 'stok' => 100]);
    $jasa = Produk::factory()->create(['tipe_jual' => 'jasa', 'harga_jual' => 0, 'harga_modal' => 0, 'stok' => 0]);

    // Kopi + jasa dalam transaksi yang sama → bukan pasangan produk (jasa dikecualikan).
    transaksiPelanggan(null, [[$kopi, 1], [$jasa, 1]], $admin);
    transaksiPelanggan(null, [[$kopi, 1], [$jasa, 1]], $admin);

    $response = $this->actingAs($admin)->get(route('admin.laporan.pelanggan'));

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->has('bundles', 0)
    );
});
