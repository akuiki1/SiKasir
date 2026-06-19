<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Models\Produk;
use App\Models\TarifJasa;
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
        $produks = Produk::with(['kategori', 'tarifJasas' => fn ($q) => $q->orderBy('min_nominal')])
            ->orderBy('nama')
            ->get()
            ->map(function (Produk $produk) {
                return [
                    'id_produk' => $produk->id_produk,
                    'nama' => $produk->nama,
                    'jenis' => $produk->jenis,
                    'tipe_jual' => $produk->tipe_jual,
                    'satuan' => $produk->satuan,
                    'kategori' => $produk->kategori?->nama_kategori,
                    'id_kategori' => $produk->id_kategori,
                    'harga_jual' => $produk->harga_jual,
                    'harga_modal' => $produk->harga_modal,
                    'potongan_reseller' => $produk->potongan_reseller,
                    'stok' => $produk->stok,
                    'barcode' => $produk->barcode,
                    'sku' => $produk->sku,
                    'foto' => $produk->foto,
                    'foto_url' => $produk->foto ? asset("storage/{$produk->foto}") : null,
                    'status_stok' => $produk->status_stok,
                    // Tarif fee bertingkat untuk produk jasa (kosong untuk produk lain).
                    'tarifs' => $produk->tarifJasas
                        ->map(fn (TarifJasa $tarif) => [
                            'min_nominal' => (int) $tarif->min_nominal,
                            'fee' => (int) $tarif->fee,
                        ])
                        ->values(),
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
            'tipe_jual' => ['nullable', 'in:satuan,curah,jasa'],
            'satuan' => ['nullable', 'string', 'max:20'],
            'nama' => ['required', 'string', 'max:255'],
            'harga_jual' => ['required', 'integer', 'min:0'],
            'harga_modal' => ['nullable', 'integer', 'min:0'],
            'potongan_reseller' => ['nullable', 'integer', 'min:0'],
            // numeric agar produk curah bisa berstok pecahan (mis. 12.5 liter).
            'stok' => ['required', 'numeric', 'min:0'],
            'barcode' => ['nullable', 'string', 'max:255', 'unique:produks,barcode'],
            'sku' => ['nullable', 'string', 'max:255', 'unique:produks,sku'],
            'foto' => ['nullable', 'string', 'max:2048'],
            'foto_upload' => ['nullable', 'image', 'max:2048'],
            // Tarif fee bertingkat (khusus produk jasa). Batas bawah + fee per tingkat.
            'tarifs' => ['nullable', 'array'],
            'tarifs.*.min_nominal' => ['required_with:tarifs', 'integer', 'min:0'],
            'tarifs.*.fee' => ['required_with:tarifs', 'integer', 'min:0'],
        ]);

        $validated['jenis'] = $validated['jenis'] ?? 'beli';
        $validated['tipe_jual'] = $validated['tipe_jual'] ?? 'satuan';
        $validated['satuan'] = $validated['satuan'] ?? 'pcs';

        // Produk jasa (tarik tunai/transfer) tidak punya stok fisik / potongan reseller.
        if ($validated['tipe_jual'] === 'jasa') {
            $validated['stok'] = 0;
            $validated['potongan_reseller'] = 0;
        } else {
            $validated['potongan_reseller'] = (int) ($validated['potongan_reseller'] ?? 0);
        }

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

        $produk = Produk::create($validated);

        // Tarif bertingkat hanya relevan untuk produk jasa.
        if ($produk->tipe_jual === 'jasa') {
            $this->syncTarifJasa($produk, $validated['tarifs'] ?? []);
        }

        // Catat saldo awal ke kartu stok bila produk dibuat dengan stok > 0.
        if ((float) $produk->stok != 0.0) {
            $produk->catatMutasiStok(0, (float) $produk->stok, (float) $produk->stok, 'awal', [
                'keterangan' => 'Stok awal saat produk dibuat',
            ]);
        }

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
            'tipe_jual' => ['nullable', 'in:satuan,curah,jasa'],
            'satuan' => ['nullable', 'string', 'max:20'],
            'nama' => ['required', 'string', 'max:255'],
            'harga_jual' => ['required', 'integer', 'min:0'],
            'harga_modal' => ['nullable', 'integer', 'min:0'],
            'potongan_reseller' => ['nullable', 'integer', 'min:0'],
            // numeric agar produk curah bisa berstok pecahan (mis. 12.5 liter).
            'stok' => ['required', 'numeric', 'min:0'],
            'barcode' => ['nullable', 'string', 'max:255', 'unique:produks,barcode,'.$produk->id_produk.',id_produk'],
            'sku' => ['nullable', 'string', 'max:255', 'unique:produks,sku,'.$produk->id_produk.',id_produk'],
            'foto' => ['nullable', 'string', 'max:2048'],
            'foto_upload' => ['nullable', 'image', 'max:2048'],
            // Tarif fee bertingkat (khusus produk jasa). Batas bawah + fee per tingkat.
            'tarifs' => ['nullable', 'array'],
            'tarifs.*.min_nominal' => ['required_with:tarifs', 'integer', 'min:0'],
            'tarifs.*.fee' => ['required_with:tarifs', 'integer', 'min:0'],
        ]);

        $validated['jenis'] = $validated['jenis'] ?? $produk->jenis;
        $validated['tipe_jual'] = $validated['tipe_jual'] ?? $produk->tipe_jual;
        $validated['satuan'] = $validated['satuan'] ?? $produk->satuan;

        // Produk jasa tidak punya stok fisik / potongan reseller.
        if ($validated['tipe_jual'] === 'jasa') {
            $validated['stok'] = 0;
            $validated['potongan_reseller'] = 0;
        } else {
            $validated['potongan_reseller'] = (int) ($validated['potongan_reseller'] ?? 0);
        }

        $stokLama = (float) $produk->stok;

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

        // Sinkronkan tarif bertingkat: produk jasa ditulis ulang dari form, produk
        // non-jasa dibersihkan (mis. baru dipindah dari jasa ke satuan/curah).
        if ($produk->tipe_jual === 'jasa') {
            $this->syncTarifJasa($produk, $validated['tarifs'] ?? []);
        } else {
            $produk->tarifJasas()->delete();
        }

        // Catat penyesuaian stok manual ke kartu stok bila stok berubah.
        $stokBaru = (float) $produk->stok;
        if ($stokBaru !== $stokLama) {
            $produk->catatMutasiStok($stokLama, $stokBaru, $stokBaru - $stokLama, 'penyesuaian', [
                'keterangan' => 'Penyesuaian stok manual dari halaman produk',
            ]);
        }

        return redirect()->route('admin.products')->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Buat barcode + SKU otomatis untuk semua produk yang belum punya barcode.
     * Produk jasa dilewati karena tidak ada barang fisik untuk discan.
     */
    public function generateAllBarcodes(): RedirectResponse
    {
        $produks = Produk::where('tipe_jual', '!=', 'jasa')
            ->where(fn ($q) => $q->whereNull('barcode')->orWhere('barcode', ''))
            ->get();

        $dibuat = 0;
        foreach ($produks as $produk) {
            $barcode = Produk::generateUniqueBarcode();
            // SKU lama dipertahankan; kalau kosong baru diturunkan dari barcode.
            $sku = filled($produk->sku) ? $produk->sku : Produk::generateUniqueSku($barcode);

            $produk->update([
                'barcode' => $barcode,
                'sku' => $sku,
            ]);

            $dibuat++;
        }

        $pesan = $dibuat > 0
            ? "Barcode & SKU otomatis dibuat untuk {$dibuat} produk."
            : 'Semua produk (non-jasa) sudah memiliki barcode. Tidak ada yang perlu dibuat.';

        return redirect()->route('admin.products')->with('success', $pesan);
    }

    /**
     * Tulis ulang tarif fee bertingkat sebuah produk jasa dari input form.
     * Tarif lama dihapus lalu dibuat ulang (set kecil — paling sederhana &
     * konsisten), diurutkan naik berdasarkan batas bawah agar resolusi rapi.
     *
     * @param  array<int, array{min_nominal?: int|string, fee?: int|string}>  $tarifs
     */
    private function syncTarifJasa(Produk $produk, array $tarifs): void
    {
        $produk->tarifJasas()->delete();

        collect($tarifs)
            ->map(fn ($tarif) => [
                'min_nominal' => max(0, (int) ($tarif['min_nominal'] ?? 0)),
                'fee' => max(0, (int) ($tarif['fee'] ?? 0)),
            ])
            ->sortBy('min_nominal')
            ->values()
            ->each(fn ($tarif) => $produk->tarifJasas()->create($tarif));
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
