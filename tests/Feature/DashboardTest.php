<?php

use App\Models\User;

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