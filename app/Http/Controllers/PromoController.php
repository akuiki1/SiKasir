<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\Promo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PromoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $promos = Promo::with('produk')
            ->orderBy('id_promo', 'desc')
            ->get()
            ->map(function (Promo $promo) {
                return [
                    'id_promo' => $promo->id_promo,
                    'nama' => $promo->nama,
                    'deskripsi' => $promo->deskripsi,
                    'tipe' => $promo->tipe,
                    'nilai' => $promo->nilai,
                    'id_produk' => $promo->id_produk,
                    'produk_nama' => $promo->produk?->nama ?? 'Semua Produk',
                    'minimal_belanja' => $promo->minimal_belanja,
                    'tanggal_mulai' => $promo->tanggal_mulai->format('Y-m-d H:i:s'),
                    'tanggal_selesai' => $promo->tanggal_selesai->format('Y-m-d H:i:s'),
                    'aktif' => $promo->aktif,
                ];
            });

        $produks = Produk::orderBy('nama')->get(['id_produk', 'nama']);

        $totalPromo = $promos->count();
        $totalAktif = $promos->where('aktif', true)->count();
        $totalNonAktif = $totalPromo - $totalAktif;

        return Inertia::render('admin/Promos', [
            'promos' => $promos,
            'produks' => $produks,
            'stats' => [
                'total_promo' => $totalPromo,
                'total_aktif' => $totalAktif,
                'total_non_aktif' => $totalNonAktif,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'tipe' => ['required', 'in:persen,nominal'],
            'nilai' => ['required', 'numeric', 'min:0'],
            'id_produk' => ['nullable', 'exists:produks,id_produk'],
            'minimal_belanja' => ['nullable', 'numeric', 'min:0'],
            'tanggal_mulai' => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'aktif' => ['required', 'boolean'],
        ]);

        Promo::create($validated);

        return redirect()->route('admin.promos')->with('success', 'Promo berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Promo $promo): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'tipe' => ['required', 'in:persen,nominal'],
            'nilai' => ['required', 'numeric', 'min:0'],
            'id_produk' => ['nullable', 'exists:produks,id_produk'],
            'minimal_belanja' => ['nullable', 'numeric', 'min:0'],
            'tanggal_mulai' => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'aktif' => ['required', 'boolean'],
        ]);

        $promo->update($validated);

        return redirect()->route('admin.promos')->with('success', 'Promo berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Promo $promo): RedirectResponse
    {
        $promo->delete();

        return redirect()->route('admin.promos')->with('success', 'Promo berhasil dihapus.');
    }
}
