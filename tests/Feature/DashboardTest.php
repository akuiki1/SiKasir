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

test('admin dashboard shows analytics and filters by date range', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kasirA = User::factory()->create(['role' => 'kasir', 'name' => 'Kasir A']);
    $kasirB = User::factory()->create(['role' => 'kasir', 'name' => 'Kasir B']);

    $produkA = Produk::factory()->create(['nama' => 'Kopi Hitam', 'harga_jual' => 20000]);
    $produkB = Produk::factory()->create(['nama' => 'Teh Manis', 'harga_jual' => 15000]);

    $startDate = Carbon::today()->subDays(2)->toDateString();
    $endDate = Carbon::today()->toDateString();

    $trx1 = Transaksi::factory()->create([
        'id_user' => $kasirA->id,
        'total_harga' => 40000,
        'bayar' => 50000,
        'kembalian' => 10000,
        'created_at' => Carbon::today()->subDays(2)->setTime(10, 0),
    ]);
    DetailTransaksi::factory()->create([
        'id_transaksi' => $trx1->id_transaksi,
        'id_produk' => $produkA->id_produk,
        'jumlah' => 2,
        'harga' => 20000,
        'subtotal' => 40000,
    ]);

    $trx2 = Transaksi::factory()->create([
        'id_user' => $kasirB->id,
        'total_harga' => 15000,
        'bayar' => 20000,
        'kembalian' => 5000,
        'created_at' => Carbon::today()->subDay()->setTime(11, 30),
    ]);
    DetailTransaksi::factory()->create([
        'id_transaksi' => $trx2->id_transaksi,
        'id_produk' => $produkB->id_produk,
        'jumlah' => 1,
        'harga' => 15000,
        'subtotal' => 15000,
    ]);

    $this->actingAs($admin);

    $response = $this->get(route('admin.dashboard', [
        'start_date' => $startDate,
        'end_date' => $endDate,
    ]));

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('admin/Dashboard')
        ->where('stats.total_revenue', 55000)
        ->where('stats.total_transactions', 2)
        ->where('date_range.start_date', $startDate)
        ->where('date_range.end_date', $endDate)
        ->has('best_selling_products', 2)
        ->has('worst_selling_products')
        ->has('top_sales_dates', 2)
        ->has('top_sales_hours', 2)
        ->has('cashier_achievements')
        ->has('best_profit_products')
        ->has('top_cashiers_by_transactions', 2)
    );
});
