<?php

namespace App\Http\Middleware;

use App\Models\Pesanan;
use App\Models\Produk;
use App\Services\PesananService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            // Angka kecil untuk badge sidebar admin; closure agar tak dievaluasi
            // pada partial reload yang tidak memintanya.
            'sidebarBadges' => fn () => $this->sidebarBadges($request),
        ];
    }

    /**
     * Hitungan ringkas untuk badge sidebar admin (pesanan aktif & stok menipis).
     * Hanya admin yang memakainya; peran lain dapat null agar tak ada query sia-sia.
     *
     * @return array{pesananAktif: int, stokMenipis: int}|null
     */
    private function sidebarBadges(Request $request): ?array
    {
        $user = $request->user();

        if (! $user || $user->role !== 'admin') {
            return null;
        }

        return [
            // Pesanan online yang masih perlu diproses (selaras KasirController).
            'pesananAktif' => Pesanan::whereIn('status', PesananService::STATUS_AKTIF)->count(),
            // Stok menipis/habis non-jasa, ambang 5 (selaras DashboardController & Produk).
            'stokMenipis' => Produk::where('tipe_jual', '!=', 'jasa')->where('stok', '<=', 5)->count(),
        ];
    }
}
