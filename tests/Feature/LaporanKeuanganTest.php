<?php

use App\Models\DetailTransaksi;
use App\Models\Pengeluaran;
use App\Models\Produk;
use App\Models\Produksi;
use App\Models\Transaksi;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia;

test('admin can view financial report and other roles cannot', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kasir = User::factory()->create(['role' => 'kasir']);

    // Guest lebih dulu (actingAs persist antar request dalam satu test).
    $this->get(route('admin.laporan.keuangan'))->assertRedirect(route('login'));
    $this->actingAs($kasir)->get(route('admin.laporan.keuangan'))->assertForbidden();
    $this->actingAs($admin)->get(route('admin.laporan.keuangan'))->assertOk();
});

test('profit & loss is computed from sales, COGS, and operational expenses', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $today = Carbon::today()->toDateString();

    $produk = Produk::factory()->create(['harga_jual' => 10000, 'harga_modal' => 4000]);

    // Penjualan barang: omzet 20.000, HPP 8.000 (modal 4.000 x 2).
    $trx = Transaksi::factory()->create([
        'id_user' => $admin->id,
        'total_harga' => 20000,
        'metode_pembayaran' => 'cash',
        'bayar' => 20000,
        'kembalian' => 0,
        'created_at' => Carbon::today()->setTime(10, 0),
    ]);
    DetailTransaksi::factory()->create([
        'id_transaksi' => $trx->id_transaksi,
        'id_produk' => $produk->id_produk,
        'jumlah' => 2,
        'harga' => 10000,
        'modal' => 4000,
        'subtotal' => 20000,
    ]);

    // Pendapatan jasa: fee 5.000 (subtotal), nominal titipan 50.000 (pass-through).
    $jasa = Produk::factory()->create(['tipe_jual' => 'jasa', 'harga_modal' => 0]);
    $trxJasa = Transaksi::factory()->create([
        'id_user' => $admin->id,
        'total_harga' => 5000,
        'metode_pembayaran' => 'qris',
        'bayar' => 55000,
        'kembalian' => 0,
        'created_at' => Carbon::today()->setTime(11, 0),
    ]);
    DetailTransaksi::factory()->create([
        'id_transaksi' => $trxJasa->id_transaksi,
        'id_produk' => $jasa->id_produk,
        'jumlah' => 1,
        'harga' => 5000,
        'modal' => 0,
        'subtotal' => 5000,
        'nominal' => 50000,
    ]);

    // Biaya operasional 5.000; bahan_baku 3.000 dikecualikan dari opex (anti double-count).
    Pengeluaran::factory()->create(['tipe' => 'operasional', 'nominal' => 5000]);
    Pengeluaran::factory()->create(['tipe' => 'bahan_baku', 'nominal' => 3000]);

    // Batch produksi: kas keluar untuk modal barang buatan sendiri.
    Produksi::factory()->create(['id_produk' => $produk->id_produk, 'total_biaya' => 10000, 'jumlah' => 10]);

    $response = $this->actingAs($admin)->get(route('admin.laporan.keuangan', [
        'start_date' => $today,
        'end_date' => $today,
    ]));

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('admin/laporan/Keuangan')
        ->where('pnl.total_revenue', 25000)
        ->where('pnl.product_revenue', 20000)
        ->where('pnl.jasa_revenue', 5000)
        ->where('pnl.hpp', 8000)
        ->where('pnl.gross_profit', 17000)
        ->where('pnl.operational_expenses', 5000) // bahan_baku tidak ikut
        ->where('pnl.net_profit', 12000)
        ->where('pnl.margin', fn ($v) => abs((float) $v - 48.0) < 0.001)
    );
});

test('cash flow includes production and material purchases as outflow', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $today = Carbon::today()->toDateString();

    $produk = Produk::factory()->create(['harga_jual' => 10000, 'harga_modal' => 4000]);

    $trx = Transaksi::factory()->create([
        'id_user' => $admin->id,
        'total_harga' => 25000,
        'metode_pembayaran' => 'cash',
        'bayar' => 25000,
        'kembalian' => 0,
        'created_at' => Carbon::today()->setTime(9, 0),
    ]);
    DetailTransaksi::factory()->create([
        'id_transaksi' => $trx->id_transaksi,
        'id_produk' => $produk->id_produk,
        'jumlah' => 1,
        'harga' => 25000,
        'modal' => 4000,
        'subtotal' => 25000,
    ]);

    Pengeluaran::factory()->create(['tipe' => 'operasional', 'nominal' => 5000]);
    Pengeluaran::factory()->create(['tipe' => 'bahan_baku', 'nominal' => 3000]);
    Produksi::factory()->create(['id_produk' => $produk->id_produk, 'total_biaya' => 10000, 'jumlah' => 10]);

    $response = $this->actingAs($admin)->get(route('admin.laporan.keuangan', [
        'start_date' => $today,
        'end_date' => $today,
    ]));

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->where('cashflow.kas_masuk', 25000)
        ->where('cashflow.biaya_produksi', 10000)
        ->where('cashflow.belanja_bahan', 3000)
        ->where('cashflow.pembelian_produksi', 13000)
        ->where('cashflow.biaya_operasional', 5000)
        ->where('cashflow.kas_keluar', 18000)
        ->where('cashflow.net_cash', 7000)
    );
});

test('payment reconciliation breaks revenue down by method', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $today = Carbon::today()->toDateString();

    $produk = Produk::factory()->create(['harga_jual' => 10000, 'harga_modal' => 4000]);

    foreach ([['cash', 20000], ['qris', 5000], ['qris', 5000]] as [$metode, $total]) {
        $trx = Transaksi::factory()->create([
            'id_user' => $admin->id,
            'total_harga' => $total,
            'metode_pembayaran' => $metode,
            'bayar' => $total,
            'kembalian' => 0,
            'created_at' => Carbon::today()->setTime(10, 0),
        ]);
        DetailTransaksi::factory()->create([
            'id_transaksi' => $trx->id_transaksi,
            'id_produk' => $produk->id_produk,
            'jumlah' => 1,
            'harga' => $total,
            'modal' => 4000,
            'subtotal' => $total,
        ]);
    }

    $response = $this->actingAs($admin)->get(route('admin.laporan.keuangan', [
        'start_date' => $today,
        'end_date' => $today,
    ]));

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->where('reconciliation.total', 30000)
        ->has('reconciliation.methods', 3)
        ->where('reconciliation.methods.0.metode', 'cash')
        ->where('reconciliation.methods.0.total', 20000)
        ->where('reconciliation.methods.0.jumlah', 1)
        ->where('reconciliation.methods.1.metode', 'qris')
        ->where('reconciliation.methods.1.total', 10000)
        ->where('reconciliation.methods.1.jumlah', 2)
        ->where('reconciliation.methods.2.metode', 'transfer')
        ->where('reconciliation.methods.2.total', 0)
    );
});

test('financial report defaults to the current month', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('admin.laporan.keuangan'));

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->where('date_range.start_date', Carbon::today()->startOfMonth()->toDateString())
        ->where('date_range.end_date', Carbon::today()->toDateString())
    );
});
