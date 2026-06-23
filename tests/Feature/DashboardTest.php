<?php

use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
    $this->get('/admin/dashboard')->assertRedirect(route('login'));
    $this->get('/kasir/dashboard')->assertRedirect(route('login'));
});

test('admin is redirected to admin dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('admin.dashboard'));
});

test('kasir is redirected to kasir dashboard', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $this->actingAs($kasir);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('kasir.dashboard'));
});

test('admin can access admin dashboard but not kasir dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $this->get(route('admin.dashboard'))->assertOk();
    $this->get(route('kasir.dashboard'))->assertForbidden();
});

test('kasir can access kasir dashboard but not admin dashboard', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $this->actingAs($kasir);

    $this->get(route('kasir.dashboard'))->assertOk();
    $this->get(route('admin.dashboard'))->assertForbidden();
});

test('kasir dashboard returns today sales and range sales from database', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['nama' => 'Roti Bakar', 'harga_jual' => 25000]);

    $trxToday = Transaksi::factory()->create([
        'id_user' => $kasir->id,
        'total_harga' => 25000,
        'bayar' => 30000,
        'kembalian' => 5000,
    ]);
    $trxToday->forceFill([
        'created_at' => Carbon::today()->setTime(10, 0),
        'updated_at' => Carbon::today()->setTime(10, 0),
    ])->save();

    DetailTransaksi::factory()->create([
        'id_transaksi' => $trxToday->id_transaksi,
        'id_produk' => $produk->id_produk,
        'jumlah' => 1,
        'harga' => 25000,
        'subtotal' => 25000,
    ]);

    $trxYesterday = Transaksi::factory()->create([
        'id_user' => $kasir->id,
        'total_harga' => 40000,
        'bayar' => 50000,
        'kembalian' => 10000,
    ]);
    $trxYesterday->forceFill([
        'created_at' => Carbon::yesterday()->setTime(14, 0),
        'updated_at' => Carbon::yesterday()->setTime(14, 0),
    ])->save();

    DetailTransaksi::factory()->create([
        'id_transaksi' => $trxYesterday->id_transaksi,
        'id_produk' => $produk->id_produk,
        'jumlah' => 2,
        'harga' => 20000,
        'subtotal' => 40000,
    ]);

    $this->actingAs($kasir);

    $response = $this->get(route('kasir.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('kasir/Dashboard')
        ->where('today_sales.total_revenue', 25000)
        ->where('today_sales.total_transactions', 1)
        ->where('range_sales.total_revenue', 65000)
        ->where('range_sales.total_transactions', 2)
        ->where('date_range.start_date', Carbon::yesterday()->toDateString())
        ->where('date_range.end_date', Carbon::today()->toDateString())
        ->has('recent_transactions', 2)
    );
});

test('kasir dashboard can filter sales by explicit date range', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['nama' => 'Nasi Goreng', 'harga_jual' => 20000]);

    $today = Transaksi::factory()->create([
        'id_user' => $kasir->id,
        'total_harga' => 20000,
        'bayar' => 25000,
        'kembalian' => 5000,
    ]);
    $today->forceFill([
        'created_at' => Carbon::today()->setTime(12, 0),
        'updated_at' => Carbon::today()->setTime(12, 0),
    ])->save();

    $yesterday = Transaksi::factory()->create([
        'id_user' => $kasir->id,
        'total_harga' => 30000,
        'bayar' => 35000,
        'kembalian' => 5000,
    ]);
    $yesterday->forceFill([
        'created_at' => Carbon::yesterday()->setTime(15, 0),
        'updated_at' => Carbon::yesterday()->setTime(15, 0),
    ])->save();

    DetailTransaksi::factory()->create([
        'id_transaksi' => $yesterday->id_transaksi,
        'id_produk' => $produk->id_produk,
        'jumlah' => 1,
        'harga' => 30000,
        'subtotal' => 30000,
    ]);

    $this->actingAs($kasir);

    $response = $this->get(route('kasir.dashboard', [
        'start_date' => Carbon::yesterday()->toDateString(),
        'end_date' => Carbon::yesterday()->toDateString(),
    ]));

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('kasir/Dashboard')
        ->where('range_sales.total_revenue', 30000)
        ->where('range_sales.total_transactions', 1)
        ->where('date_range.start_date', Carbon::yesterday()->toDateString())
        ->where('date_range.end_date', Carbon::yesterday()->toDateString())
    );
});

/*
 * Dashboard admin telah didesain ulang menjadi ringkasan "buka-pagi" (today_stats,
 * tren 7 hari, alert, aktivitas terakhir). Analisis mendalam (ranking produk, slow
 * mover, performa kasir) dipindah ke menu Laporan & diuji di Laporan*Test. Tes di
 * bawah memverifikasi KONTRAK dashboard yang sekarang.
 */

test('admin dashboard shows today stats and meta', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create(['harga_modal' => 4000]);

    $today = Transaksi::factory()->create([
        'id_user' => $admin->id,
        'total_harga' => 50000,
        'bayar' => 50000,
        'kembalian' => 0,
        'created_at' => Carbon::today()->setTime(10, 0),
    ]);
    DetailTransaksi::factory()->create([
        'id_transaksi' => $today->id_transaksi,
        'id_produk' => $produk->id_produk,
        'jumlah' => 2,
        'harga' => 25000,
        'modal' => 4000,
        'subtotal' => 50000,
    ]);

    $this->actingAs($admin);

    $this->get(route('admin.dashboard'))->assertOk()->assertInertia(
        fn (AssertableInertia $page) => $page
            ->component('admin/Dashboard')
            ->where('today_stats.revenue', 50000)
            ->where('today_stats.transactions', 1)
            ->has('today_stats.gross_profit')
            ->has('today_stats.revenue_delta')
            ->has('greeting')
            ->has('admin_name')
    );
});

test('admin dashboard returns a 7-day trend including today', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin);

    $this->get(route('admin.dashboard'))->assertOk()->assertInertia(
        fn (AssertableInertia $page) => $page
            ->component('admin/Dashboard')
            ->has('trend', 7)
            ->has('trend.0.revenue')
            ->has('trend.0.transactions')
            ->has('trend.6.day')
    );
});

test('admin dashboard surfaces a low stock alert', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Produk::factory()->create(['nama' => 'Hampir Habis', 'tipe_jual' => 'satuan', 'stok' => 2]);

    $this->actingAs($admin);

    $this->get(route('admin.dashboard'))->assertOk()->assertInertia(
        fn (AssertableInertia $page) => $page
            ->component('admin/Dashboard')
            ->where('alerts', fn ($alerts) => collect($alerts)
                ->contains(fn ($a) => $a['key'] === 'low_stock' && $a['count'] >= 1))
    );
});

test('admin dashboard recent activity lists latest transactions', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $trx = Transaksi::factory()->create([
        'id_user' => $admin->id,
        'total_harga' => 30000,
        'bayar' => 30000,
        'kembalian' => 0,
    ]);

    $this->actingAs($admin);

    $this->get(route('admin.dashboard'))->assertOk()->assertInertia(
        fn (AssertableInertia $page) => $page
            ->component('admin/Dashboard')
            ->has('recent_activity', 1)
            ->where('recent_activity.0.kode', 'TRX-'.$trx->id_transaksi)
            ->where('recent_activity.0.total', 30000)
    );
});
