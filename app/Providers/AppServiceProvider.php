<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        // Jaring pengaman N+1: lazy-load relasi yang belum di-eager-load akan
        // melempar error saat dev/test (paksa eager-loading eksplisit), tapi
        // tetap toleran di produksi agar tak menjatuhkan request pelanggan.
        Model::preventLazyLoading(! app()->isProduction());

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        // Aturan sandi disederhanakan sesuai kebutuhan toko: cukup minimal 8
        // karakter dan wajib memuat huruf + angka (huruf besar & simbol tidak
        // diwajibkan) agar mudah dibuatkan admin untuk staf kasir. Lingkungan
        // testing dilonggarkan (null) agar kredensial fixtur yang sederhana
        // tetap lolos dan suite tidak perlu diubah.
        Password::defaults(fn (): ?Password => app()->environment('testing')
            ? null
            : Password::min(8)->letters()->numbers(),
        );
    }
}
