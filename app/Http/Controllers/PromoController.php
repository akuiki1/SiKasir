<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesPerPage;
use App\Models\Produk;
use App\Models\Promo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PromoController extends Controller
{
    use ResolvesPerPage;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $status = (string) $request->query('status', '');

        $promos = Promo::with('produk')
            ->when($search !== '', fn ($q) => $q->where('nama', 'like', '%'.$search.'%'))
            ->when($status === 'aktif', fn ($q) => $q->where('aktif', true))
            ->when($status === 'non-aktif', fn ($q) => $q->where('aktif', false))
            ->orderBy('id_promo', 'desc')
            ->paginate($this->resolvePerPage($request))
            ->withQueryString()
            ->through(fn (Promo $promo) => [
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
            ]);

        $produks = Produk::orderBy('nama')->get([
            'id_produk', 'nama', 'jenis', 'tipe_jual', 'harga_jual', 'harga_modal',
        ]);

        // Stats agregat lintas halaman — bukan dari data halaman aktif.
        $totalPromo = Promo::count();
        $totalAktif = Promo::where('aktif', true)->count();

        return Inertia::render('admin/Promos', [
            'promos' => $promos,
            'produks' => $produks,
            'stats' => [
                'total_promo' => $totalPromo,
                'total_aktif' => $totalAktif,
                'total_non_aktif' => $totalPromo - $totalAktif,
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
                'per_page' => $this->resolvePerPage($request),
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
