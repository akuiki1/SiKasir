<?php

use App\Models\Pengeluaran;
use App\Models\User;

test('admin can view pengeluaran page with data', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Pengeluaran::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.pengeluarans'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('admin/Pengeluarans')
            ->has('pengeluarans.data', 3)
            ->has('stats.total_pengeluaran')
            ->has('stats.total_nominal'),
    );
});

test('admin can create a new pengeluaran', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.pengeluarans.store'), [
        'tipe' => 'operasional',
        'judul' => 'Biaya Listrik Bulan Ini',
        'keterangan' => 'Pembayaran tagihan PLN',
        'nominal' => 150000,
    ]);

    $response->assertRedirect(route('admin.pengeluarans'));
    $this->assertDatabaseHas('pengeluarans', ['judul' => 'Biaya Listrik Bulan Ini']);
});

test('admin can update a pengeluaran', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $pengeluaran = Pengeluaran::factory()->create(['judul' => 'Biaya Lama', 'nominal' => 100000]);

    $response = $this->actingAs($admin)->put(
        route('admin.pengeluarans.update', $pengeluaran->id_pengeluaran),
        [
            'tipe' => 'operasional',
            'judul' => 'Biaya Diperbarui',
            'keterangan' => 'Update keterangan',
            'nominal' => 120000,
        ],
    );

    $response->assertRedirect(route('admin.pengeluarans'));
    $this->assertDatabaseHas('pengeluarans', ['judul' => 'Biaya Diperbarui', 'nominal' => 120000]);
});

test('admin can delete a pengeluaran', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $pengeluaran = Pengeluaran::factory()->create();

    $response = $this->actingAs($admin)->delete(
        route('admin.pengeluarans.destroy', $pengeluaran->id_pengeluaran),
    );

    $response->assertRedirect(route('admin.pengeluarans'));
    $this->assertDatabaseMissing('pengeluarans', ['id_pengeluaran' => $pengeluaran->id_pengeluaran]);
});

test('kasir cannot access pengeluaran admin page', function () {
    $kasir = User::factory()->create(['role' => 'kasir']);

    $this->actingAs($kasir)->get(route('admin.pengeluarans'))->assertForbidden();
});
