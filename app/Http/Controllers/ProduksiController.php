<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\Produksi;
use App\Models\ProduksiBiaya;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProduksiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $produksis = Produksi::with(['produk', 'biayas'])
            ->orderByDesc('id_produksi')
            ->get()
            ->map(fn (Produksi $produksi) => [
                'id_produksi' => $produksi->id_produksi,
                'id_produk' => $produksi->id_produk,
                'produk_nama' => $produksi->produk?->nama ?? 'Produk Terhapus',
                'jumlah' => $produksi->jumlah,
                'total_biaya' => $produksi->total_biaya,
                'modal_per_unit' => $produksi->modal_per_unit,
                'catatan' => $produksi->catatan,
                'tanggal' => Carbon::parse($produksi->created_at)->translatedFormat('d M Y'),
                'biayas' => $produksi->biayas->map(fn (ProduksiBiaya $biaya) => [
                    'nama' => $biaya->nama,
                    'nominal' => $biaya->nominal,
                ])->values(),
            ]);

        // Hanya produk buatan sendiri yang punya batch produksi.
        $produks = Produk::where('jenis', 'produksi')
            ->orderBy('nama')
            ->get(['id_produk', 'nama', 'stok', 'harga_modal']);

        return Inertia::render('admin/Produksi', [
            'produksis' => $produksis,
            'produks' => $produks,
            'stats' => [
                'total_batch' => $produksis->count(),
                'total_unit' => $produksis->sum('jumlah'),
                'total_biaya' => $produksis->sum('total_biaya'),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_produk' => [
                'required',
                Rule::exists('produks', 'id_produk')->where('jenis', 'produksi'),
            ],
            'jumlah' => ['required', 'integer', 'min:1'],
            'catatan' => ['nullable', 'string', 'max:1000'],
            'biayas' => ['required', 'array', 'min:1'],
            'biayas.*.nama' => ['required', 'string', 'max:255'],
            'biayas.*.nominal' => ['required', 'integer', 'min:0'],
        ], [
            'id_produk.exists' => 'Produk harus berupa produk buatan sendiri (jenis produksi).',
        ]);

        DB::transaction(function () use ($validated): void {
            $totalBiaya = collect($validated['biayas'])->sum('nominal');
            $modalPerUnit = (int) round($totalBiaya / $validated['jumlah']);

            $produksi = Produksi::create([
                'id_produk' => $validated['id_produk'],
                'jumlah' => $validated['jumlah'],
                'total_biaya' => $totalBiaya,
                'modal_per_unit' => $modalPerUnit,
                'catatan' => $validated['catatan'] ?? null,
            ]);

            foreach ($validated['biayas'] as $biaya) {
                ProduksiBiaya::create([
                    'id_produksi' => $produksi->id_produksi,
                    'nama' => $biaya['nama'],
                    'nominal' => $biaya['nominal'],
                ]);
            }

            // Produksi menambah stok barang jadi & memperbarui modal per unit produk.
            $produk = Produk::lockForUpdate()->findOrFail($validated['id_produk']);
            $produk->increment('stok', $validated['jumlah']);
            $produk->update(['harga_modal' => $modalPerUnit]);
        });

        return redirect()->route('admin.produksi')->with('success', 'Batch produksi berhasil dicatat.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Produksi $produksi): RedirectResponse
    {
        DB::transaction(function () use ($produksi): void {
            // Kembalikan stok barang jadi yang sempat ditambahkan batch ini.
            $produk = Produk::lockForUpdate()->find($produksi->id_produk);

            if ($produk) {
                $sisa = max(0, $produk->stok - $produksi->jumlah);
                $produk->update(['stok' => $sisa]);
            }

            $produksi->delete(); // biaya ikut terhapus (cascade)
        });

        return redirect()->route('admin.produksi')->with('success', 'Batch produksi berhasil dihapus.');
    }
}
