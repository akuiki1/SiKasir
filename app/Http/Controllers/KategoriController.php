<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KategoriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $kategoris = Kategori::withCount('produks')
            ->orderBy('nama_kategori')
            ->get();

        $totalKategori = $kategoris->count();
        $totalProduk = $kategoris->sum('produks_count');

        return Inertia::render('admin/Kategori', [
            'kategoris' => $kategoris,
            'stats' => [
                'total_kategori' => $totalKategori,
                'total_produk' => $totalProduk,
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
        if ($kategori->produks()->exists()) {
            return redirect()->route('admin.kategori')->with('error', 'Kategori tidak dapat dihapus karena masih memiliki produk.');
        }

        $kategori->delete();

        return redirect()->route('admin.kategori')->with('success', 'Kategori berhasil dihapus.');
    }
}
