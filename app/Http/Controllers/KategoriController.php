<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesPerPage;
use App\Models\Kategori;
use App\Models\Produk;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KategoriController extends Controller
{
    use ResolvesPerPage;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $kategoris = Kategori::withCount('produks')
            ->when($search !== '', fn ($query) => $query->where('nama_kategori', 'like', '%'.$search.'%'))
            ->orderBy('nama_kategori')
            ->paginate($this->resolvePerPage($request))
            ->withQueryString();

        return Inertia::render('admin/Kategori', [
            'kategoris' => $kategoris,
            'stats' => [
                // Agregat lintas halaman — bukan dari data halaman aktif.
                'total_kategori' => Kategori::count(),
                'total_produk' => Produk::whereNotNull('id_kategori')->count(),
            ],
            'filters' => [
                'search' => $search,
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
            'nama_kategori' => ['required', 'string', 'max:255', 'unique:kategoris,nama_kategori'],
        ]);

        Kategori::create($validated);

        return redirect()->route('admin.kategori')->with('success', 'Kategori berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kategori $kategori): RedirectResponse
    {
        $validated = $request->validate([
            'nama_kategori' => ['required', 'string', 'max:255', 'unique:kategoris,nama_kategori,'.$kategori->id_kategori.',id_kategori'],
        ]);

        $kategori->update($validated);

        return redirect()->route('admin.kategori')->with('success', 'Kategori berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kategori $kategori): RedirectResponse
    {
        $kategori->delete();

        return redirect()->route('admin.kategori')->with('success', 'Kategori berhasil dihapus.');
    }
}
