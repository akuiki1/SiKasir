<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesPerPage;
use App\Models\Produk;
use App\Models\Produksi;
use App\Models\ProduksiBiaya;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProduksiController extends Controller
{
    use ResolvesPerPage;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $produksis = Produksi::with(['produk', 'biayas'])
            ->when($search !== '', fn ($q) => $q->whereHas('produk', fn ($p) => $p->where('nama', 'like', '%'.$search.'%')))
            ->orderByDesc('id_produksi')
            ->paginate($this->resolvePerPage($request))
            ->withQueryString()
            ->through(fn (Produksi $produksi) => [
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
                // Agregat lintas halaman — bukan dari data halaman aktif.
                'total_batch' => Produksi::count(),
                'total_unit' => (int) Produksi::sum('jumlah'),
                'total_biaya' => (int) Produksi::sum('total_biaya'),
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
            'id_produk' => [
                'required',
                Rule::exists('produks', 'id_produk')->where('jenis', 'produksi'),
            ],
            'jumlah' => ['required', 'integer', 'min:1'],
            'catatan' => ['nullable', 'string', 'max:1000'],
            // Mode sederhana: cukup 1 angka total. Mode rinci: daftar biaya bahan.
            'mode' => ['nullable', 'in:sederhana,rinci'],
            'total_biaya' => ['nullable', 'integer', 'min:0'],
            'biayas' => ['nullable', 'array'],
            'biayas.*.nama' => ['required', 'string', 'max:255'],
            'biayas.*.nominal' => ['required', 'integer', 'min:0'],
        ], [
            'id_produk.exists' => 'Produk harus berupa produk buatan sendiri (jenis produksi).',
        ]);

        DB::transaction(function () use ($validated): void {
            // Mode eksplisit diutamakan; jika tak ada, deteksi dari ada/tidaknya rincian.
            $mode = $validated['mode'] ?? (! empty($validated['biayas']) ? 'rinci' : 'sederhana');

            if ($mode === 'rinci') {
                $biayas = $validated['biayas'] ?? [];

                if (count($biayas) === 0) {
                    throw ValidationException::withMessages([
                        'biayas' => 'Tambahkan minimal satu rincian biaya bahan.',
                    ]);
                }

                $totalBiaya = (int) collect($biayas)->sum('nominal');
            } else {
                $totalBiaya = (int) ($validated['total_biaya'] ?? 0);
            }

            if ($totalBiaya <= 0) {
                throw ValidationException::withMessages([
                    'total_biaya' => 'Total biaya produksi harus lebih dari 0 (isi total atau rincian bahan).',
                ]);
            }

            $modalPerUnit = (int) round($totalBiaya / $validated['jumlah']);

            $produksi = Produksi::create([
                'id_produk' => $validated['id_produk'],
                'jumlah' => $validated['jumlah'],
                'total_biaya' => $totalBiaya,
                'modal_per_unit' => $modalPerUnit,
                'catatan' => $validated['catatan'] ?? null,
            ]);

            // Rincian biaya hanya disimpan pada mode rinci.
            if ($mode === 'rinci') {
                foreach ($validated['biayas'] as $biaya) {
                    ProduksiBiaya::create([
                        'id_produksi' => $produksi->id_produksi,
                        'nama' => $biaya['nama'],
                        'nominal' => $biaya['nominal'],
                    ]);
                }
            }

            // Produksi menambah stok barang jadi & memperbarui modal per unit produk.
            $produk = Produk::lockForUpdate()->findOrFail($validated['id_produk']);
            $produk->terapkanMutasiStok(
                (float) $validated['jumlah'],
                'produksi',
                [
                    'keterangan' => 'Batch produksi #'.$produksi->id_produksi,
                    'ref_tipe' => 'Produksi',
                    'id_referensi' => $produksi->id_produksi,
                ]
            );
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
                $produk->terapkanMutasiStok(
                    -(float) $produksi->jumlah,
                    'produksi_batal',
                    [
                        'keterangan' => 'Pembatalan batch produksi #'.$produksi->id_produksi,
                        'ref_tipe' => 'Produksi',
                        'id_referensi' => $produksi->id_produksi,
                    ]
                );
            }

            $produksi->delete(); // biaya ikut terhapus (cascade)
        });

        return redirect()->route('admin.produksi')->with('success', 'Batch produksi berhasil dihapus.');
    }
}
