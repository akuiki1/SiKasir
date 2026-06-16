<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Models\Produk;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProdukController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $produks = Produk::with('kategori')
            ->orderBy('nama')
            ->get()
            ->map(function (Produk $produk) {
                return [
                    'id_produk' => $produk->id_produk,
                    'nama' => $produk->nama,
                    'jenis' => $produk->jenis,
                    'kategori' => $produk->kategori?->nama_kategori,
                    'id_kategori' => $produk->id_kategori,
                    'harga_jual' => $produk->harga_jual,
                    'harga_modal' => $produk->harga_modal,
                    'stok' => $produk->stok,
                    'barcode' => $produk->barcode,
                    'sku' => $produk->sku,
                    'foto' => $produk->foto,
                    'foto_url' => $produk->foto ? asset("storage/{$produk->foto}") : null,
                    'status_stok' => $produk->status_stok,
                ];
            });

        $totalProduk = $produks->count();
        $totalKategori = Kategori::count();
        $stokBermasalah = $produks->filter(fn ($p) => $p['status_stok'] !== 'in-stock')->count();

        $kategoris = Kategori::orderBy('nama_kategori')->get(['id_kategori', 'nama_kategori']);

        return Inertia::render('admin/Products', [
            'produks' => $produks,
            'kategoris' => $kategoris,
            'stats' => [
                'total_produk' => $totalProduk,
                'total_kategori' => $totalKategori,
                'stok_bermasalah' => $stokBermasalah,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_kategori' => ['required', 'exists:kategoris,id_kategori'],
            'jenis' => ['nullable', 'in:beli,produksi'],
            'nama' => ['required', 'string', 'max:255'],
            'harga_jual' => ['required', 'integer', 'min:0'],
            'harga_modal' => ['nullable', 'integer', 'min:0'],
            'stok' => ['required', 'integer', 'min:0'],
            'barcode' => ['nullable', 'string', 'max:255', 'unique:produks,barcode'],
            'sku' => ['nullable', 'string', 'max:255', 'unique:produks,sku'],
            'foto' => ['nullable', 'string', 'max:2048'],
            'foto_upload' => ['nullable', 'image', 'max:2048'],
        ]);

        $validated['jenis'] = $validated['jenis'] ?? 'beli';

        if ($request->hasFile('foto_upload')) {
            $validated['foto'] = $request->file('foto_upload')->store('produk', 'public');
        } else {
            $validated['foto'] = blank($validated['foto'] ?? null) ? null : $validated['foto'];
        }

        // Modal produk 'produksi' dikelola otomatis oleh modul Produksi (batch costing),
        // jadi diabaikan dari input form dan mulai dari 0 sampai ada batch produksi.
        $validated['harga_modal'] = $validated['jenis'] === 'produksi'
            ? 0
            : (int) ($validated['harga_modal'] ?? 0);

        Produk::create($validated);

        return redirect()->route('admin.products')->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Produk $produk): RedirectResponse
    {
        $validated = $request->validate([
            'id_kategori' => ['required', 'exists:kategoris,id_kategori'],
            'jenis' => ['nullable', 'in:beli,produksi'],
            'nama' => ['required', 'string', 'max:255'],
            'harga_jual' => ['required', 'integer', 'min:0'],
            'harga_modal' => ['nullable', 'integer', 'min:0'],
            'stok' => ['required', 'integer', 'min:0'],
            'barcode' => ['nullable', 'string', 'max:255', 'unique:produks,barcode,'.$produk->id_produk.',id_produk'],
            'sku' => ['nullable', 'string', 'max:255', 'unique:produks,sku,'.$produk->id_produk.',id_produk'],
            'foto' => ['nullable', 'string', 'max:2048'],
            'foto_upload' => ['nullable', 'image', 'max:2048'],
        ]);

        $validated['jenis'] = $validated['jenis'] ?? $produk->jenis;

        if ($request->hasFile('foto_upload')) {
            $validated['foto'] = $request->file('foto_upload')->store('produk', 'public');
        } else {
            $validated['foto'] = blank($validated['foto'] ?? null) ? null : $validated['foto'];
        }

        if ($validated['jenis'] === 'produksi') {
            // Modal dikelola oleh modul Produksi — jangan timpa dari form.
            unset($validated['harga_modal']);
        } else {
            $validated['harga_modal'] = (int) ($validated['harga_modal'] ?? 0);
        }

        $produk->update($validated);

        return redirect()->route('admin.products')->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Produk $produk): RedirectResponse
    {
        $produk->delete();

        return redirect()->route('admin.products')->with('success', 'Produk berhasil dihapus.');
    }
}
