<?php

use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\Promo;
use App\Models\Transaksi;
use App\Models\User;

test('admin can view users page with data', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    User::factory()->count(2)->create(['role' => 'kasir']);

    $response = $this->actingAs($admin)->get(route('admin.users'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('admin/Users')
            ->has('users.data', 3)
            ->has('stats.total_users')
            ->has('stats.total_admin')
            ->has('stats.total_kasir')
    );
});

test('admin can create a new user', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.users.store'), [
        'name' => 'Kasir Baru',
        'email' => 'kasirbaru@example.com',
        'role' => 'kasir',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertRedirect(route('admin.users'));
    $this->assertDatabaseHas('users', [
        'email' => 'kasirbaru@example.com',
        'role' => 'kasir',
    ]);
});

test('admin can update a user', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create(['role' => 'kasir', 'name' => 'Lama']);

    $response = $this->actingAs($admin)->put(route('admin.users.update', $user->id), [
        'name' => 'Baru',
        'email' => $user->email,
        'role' => 'kasir',
        'password' => '',
        'password_confirmation' => '',
    ]);

    $response->assertRedirect(route('admin.users'));
    $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Baru']);
});

test('admin can delete another user and preserve transaction history', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create(['role' => 'kasir']);
    $transaksi = Transaksi::factory()->create(['id_user' => $user->id, 'total_harga' => 10000, 'bayar' => 20000, 'kembalian' => 10000]);

    $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $user->id));

    $response->assertRedirect(route('admin.users'));
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
    $this->assertDatabaseHas('transaksis', ['id_transaksi' => $transaksi->id_transaksi, 'id_user' => null]);
});

test('admin cannot delete their own account', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $admin->id));

    $response->assertRedirect(route('admin.users'));
    $response->assertSessionHas('error');
    $this->assertDatabaseHas('users', ['id' => $admin->id]);
});

test('admin cannot demote the last admin', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->put(route('admin.users.update', $admin->id), [
        'name' => $admin->name,
        'email' => $admin->email,
        'role' => 'kasir',
        'password' => '',
        'password_confirmation' => '',
    ]);

    $response->assertRedirect(route('admin.users'));
    $response->assertSessionHas('error');
    $this->assertDatabaseHas('users', ['id' => $admin->id, 'role' => 'admin']);
});

test('admin can demote an admin when another admin exists', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $other = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->put(route('admin.users.update', $other->id), [
        'name' => $other->name,
        'email' => $other->email,
        'role' => 'kasir',
        'password' => '',
        'password_confirmation' => '',
    ]);

    $response->assertRedirect(route('admin.users'));
    $this->assertDatabaseHas('users', ['id' => $other->id, 'role' => 'kasir']);
});

test('admin can delete another admin when more than one exists', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $other = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $other->id));

    $response->assertRedirect(route('admin.users'));
    $this->assertDatabaseMissing('users', ['id' => $other->id]);
    expect(User::where('role', 'admin')->count())->toBe(1);
});

test('kasir cannot access admin users page', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);

    $this->actingAs($kasir)->get(route('admin.users'))->assertForbidden();
});

test('kasir can view transaksi page with product list', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    Produk::factory()->create(['harga_jual' => 12500, 'stok' => 10, 'foto' => '/images/produk/kopi.jpg']);

    $response = $this->actingAs($kasir)->get(route('kasir.transaksi'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('kasir/Transaksi')
        ->has('produks', 1)
        ->where('produks.0.foto', '/images/produk/kopi.jpg')
    );
});

test('kasir can view transaksi page with promo list', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    Promo::factory()->create(['nama' => 'Diskon Hari Ini', 'tipe' => 'persen', 'nilai' => 10, 'aktif' => true, 'tanggal_mulai' => now()->subDay(), 'tanggal_selesai' => now()->addDay()]);

    $response = $this->actingAs($kasir)->get(route('kasir.transaksi'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('kasir/Transaksi')->has('produks')->has('promos', 1));
});

test('kasir can store a new transaksi and decrement stock', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 5]);

    $response = $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 50000,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2],
        ],
    ]);

    $response->assertRedirect(route('kasir.transaksi'));
    $this->assertDatabaseHas('transaksis', [
        'id_user' => $kasir->id,
        'total_harga' => 20000,
        'kembalian' => 30000,
    ]);
    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $produk->id_produk,
        'jumlah' => 2,
        'subtotal' => 20000,
    ]);
    expect($produk->fresh()->stok)->toBe(3.0);
});

test('kasir can apply a global promo when storing transaksi', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 5]);
    $promo = Promo::factory()->create([
        'tipe' => 'persen',
        'nilai' => 20,
        'id_produk' => null,
        'minimal_belanja' => 0,
        'aktif' => true,
        'tanggal_mulai' => now()->subDay(),
        'tanggal_selesai' => now()->addDay(),
    ]);

    $response = $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 50000,
        'id_promo' => $promo->id_promo,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2],
        ],
    ]);

    $response->assertRedirect(route('kasir.transaksi'));
    $this->assertDatabaseHas('transaksis', [
        'id_user' => $kasir->id,
        'id_promo' => $promo->id_promo,
        'total_harga' => 16000,
        'diskon' => 4000,
        'kembalian' => 34000,
    ]);
});

test('kasir bundling promo gives free items by multiple', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 12, 'tipe_jual' => 'satuan']);
    // Beli 5 gratis 1 (kelipatan 6) untuk produk ini.
    Promo::factory()->create([
        'tipe' => 'bundling',
        'nilai' => 0,
        'beli_qty' => 5,
        'gratis_qty' => 1,
        'id_produk' => $produk->id_produk,
        'aktif' => true,
        'tanggal_mulai' => now()->subDay(),
        'tanggal_selesai' => now()->addDay(),
    ]);

    // Beli 6 → 1 gratis → diskon 10.000; total = 50.000.
    $response = $this->actingAs($kasir)->post(route('kasir.transaksi.store'), [
        'metode_pembayaran' => 'cash',
        'bayar' => 60000,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 6],
        ],
    ]);

    $response->assertRedirect(route('kasir.transaksi'));
    $this->assertDatabaseHas('transaksis', [
        'id_user' => $kasir->id,
        'total_harga' => 50000,
        'diskon' => 10000,
        'kembalian' => 10000,
    ]);
});

test('kasir can view riwayat page with stats', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);
    $transaksi = Transaksi::factory()->create([
        'id_user' => $kasir->id,
        'total_harga' => 15000,
        'bayar' => 20000,
        'kembalian' => 5000,
    ]);
    DetailTransaksi::factory()->create([
        'id_transaksi' => $transaksi->id_transaksi,
        'jumlah' => 1,
    ]);

    $response = $this->actingAs($kasir)->get(route('kasir.riwayat'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('kasir/Riwayat')
        ->has('transaksis.data', 1)
        ->where('stats.total_penjualan', 15000)
        ->where('stats.total_transaksi', 1)
    );
});

test('admin can create a transaction and decrement stock', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 20]);

    $response = $this->actingAs($admin)->post(route('admin.transactions.store'), [
        'id_user' => $kasir->id,
        'metode_pembayaran' => 'cash',
        'bayar' => 50000,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2],
        ],
    ]);

    $response->assertRedirect(route('admin.transactions'));
    $this->assertDatabaseHas('transaksis', [
        'id_user' => $kasir->id,
        'total_harga' => 20000,
        'kembalian' => 30000,
    ]);
    $this->assertDatabaseHas('detail_transaksis', [
        'id_produk' => $produk->id_produk,
        'jumlah' => 2,
        'subtotal' => 20000,
    ]);
    expect($produk->fresh()->stok)->toBe(18.0);
});

test('admin cannot create transaction with insufficient stock', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['stok' => 1]);

    $response = $this->actingAs($admin)->post(route('admin.transactions.store'), [
        'id_user' => $kasir->id,
        'metode_pembayaran' => 'cash',
        'bayar' => 100000,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 5],
        ],
    ]);

    $response->assertSessionHasErrors('items');
    expect($produk->fresh()->stok)->toBe(1.0);
});

test('admin can update a transaction', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['harga_jual' => 10000, 'stok' => 10]);
    $transaksi = Transaksi::factory()->create([
        'id_user' => $kasir->id,
        'total_harga' => 10000,
        'bayar' => 20000,
        'kembalian' => 10000,
    ]);
    DetailTransaksi::factory()->create([
        'id_transaksi' => $transaksi->id_transaksi,
        'id_produk' => $produk->id_produk,
        'jumlah' => 1,
        'harga' => 10000,
        'subtotal' => 10000,
    ]);
    $produk->update(['stok' => 9]);

    $response = $this->actingAs($admin)->put(route('admin.transactions.update', $transaksi->id_transaksi), [
        'id_user' => $kasir->id,
        'metode_pembayaran' => 'qris',
        'bayar' => 30000,
        'items' => [
            ['id_produk' => $produk->id_produk, 'jumlah' => 2],
        ],
    ]);

    $response->assertRedirect(route('admin.transactions'));
    $this->assertDatabaseHas('transaksis', [
        'id_transaksi' => $transaksi->id_transaksi,
        'total_harga' => 20000,
        'metode_pembayaran' => 'qris',
    ]);
    expect($produk->fresh()->stok)->toBe(8.0);
});

test('admin can delete a transaction and restore stock', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $kasir = User::factory()->create(['role' => 'kasir']);
    $produk = Produk::factory()->create(['stok' => 5]);
    $transaksi = Transaksi::factory()->create(['id_user' => $kasir->id]);
    DetailTransaksi::factory()->create([
        'id_transaksi' => $transaksi->id_transaksi,
        'id_produk' => $produk->id_produk,
        'jumlah' => 3,
    ]);
    $produk->update(['stok' => 2]);

    $response = $this->actingAs($admin)->delete(
        route('admin.transactions.destroy', $transaksi->id_transaksi)
    );

    $response->assertRedirect(route('admin.transactions'));
    $this->assertDatabaseMissing('transaksis', ['id_transaksi' => $transaksi->id_transaksi]);
    expect($produk->fresh()->stok)->toBe(5.0);
});

test('admin can delete produk used in transaction and preserve transaction history', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::factory()->create();
    $transaksi = Transaksi::factory()->create();
    DetailTransaksi::factory()->create([
        'id_transaksi' => $transaksi->id_transaksi,
        'id_produk' => $produk->id_produk,
        'jumlah' => 1,
        'harga' => $produk->harga_jual,
        'subtotal' => $produk->harga_jual,
    ]);

    $response = $this->actingAs($admin)->delete(
        route('admin.products.destroy', $produk->id_produk)
    );

    $response->assertRedirect(route('admin.products'));
    $response->assertSessionHas('success');
    $this->assertDatabaseMissing('produks', ['id_produk' => $produk->id_produk]);
    $this->assertDatabaseHas('detail_transaksis', ['id_transaksi' => $transaksi->id_transaksi, 'id_produk' => null]);
});
