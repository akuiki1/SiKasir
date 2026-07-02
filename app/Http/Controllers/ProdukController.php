<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesPerPage;
use App\Models\Kategori;
use App\Models\Produk;
use App\Models\Promo;
use App\Models\TarifJasa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProdukController extends Controller
{
    use ResolvesPerPage;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $kategori = $request->query('kategori', '');
        $kategori = is_numeric($kategori) ? (int) $kategori : null;
        // Filter asal produk: 'produksi' (buatan sendiri) atau 'beli' (beli jadi/agen).
        $jenis = in_array($request->query('jenis'), ['beli', 'produksi'], true)
            ? $request->query('jenis')
            : null;
        $sort = (string) $request->query('sort', '');
        // Tampilan: produk aktif (default) atau arsip (yang sudah diarsipkan).
        $view = $request->query('view') === 'arsip' ? 'arsip' : 'aktif';

        [$sortColumn, $sortDir] = match ($sort) {
            'nama_desc' => ['nama', 'desc'],
            'harga_asc' => ['harga_jual', 'asc'],
            'harga_desc' => ['harga_jual', 'desc'],
            'stok_asc' => ['stok', 'asc'],
            'stok_desc' => ['stok', 'desc'],
            default => ['nama', 'asc'],
        };

        $produks = Produk::with(['kategori', 'tarifJasas' => fn ($q) => $q->orderBy('min_nominal')])
            ->when($view === 'arsip', fn ($query) => $query->onlyTrashed())
            ->when($search !== '', fn ($query) => $query->where('nama', 'like', '%'.$search.'%'))
            ->when($kategori !== null, fn ($query) => $query->where('id_kategori', $kategori))
            ->when($jenis !== null, fn ($query) => $query->where('jenis', $jenis))
            ->orderBy($sortColumn, $sortDir)
            ->paginate($this->resolvePerPage($request))
            ->withQueryString()
            ->through(function (Produk $produk) use ($view) {
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
                    'foto_url' => Produk::fotoUrl($produk->foto),
                    'status_stok' => $produk->status_stok,
                    'archived_at' => $produk->deleted_at?->translatedFormat('d M Y'),
                    // Hanya produk arsip TANPA riwayat (transaksi/produksi/pesanan) yang
                    // boleh dihapus permanen. Untuk tampilan aktif tak relevan.
                    'bisa_hapus' => $view === 'arsip' ? ! $this->produkPunyaRiwayat($produk) : false,
                    // Tarif fee bertingkat untuk produk jasa (kosong untuk produk lain).
                    'tarifs' => $produk->tarifJasas
                        ->map(fn (TarifJasa $tarif) => [
                            'min_nominal' => (int) $tarif->min_nominal,
                            'fee' => (int) $tarif->fee,
                        ])
                        ->values(),
                ];
            });

        $kategoris = Kategori::orderBy('nama_kategori')->get(['id_kategori', 'nama_kategori']);

        // Daftar barcode untuk "Cetak Semua Barcode": lintas halaman (bukan cuma
        // halaman aktif), mengikuti filter pencarian & kategori yang sedang dipakai.
        // Hanya produk fisik yang sudah punya barcode. Kolom dibatasi seperlunya.
        $barcodePrint = Produk::where('tipe_jual', '!=', 'jasa')
            ->whereNotNull('barcode')
            ->where('barcode', '!=', '')
            ->when($search !== '', fn ($query) => $query->where('nama', 'like', '%'.$search.'%'))
            ->when($kategori !== null, fn ($query) => $query->where('id_kategori', $kategori))
            ->when($jenis !== null, fn ($query) => $query->where('jenis', $jenis))
            ->orderBy('nama')
            ->get(['id_produk', 'nama', 'harga_jual', 'barcode'])
            ->map(fn (Produk $produk) => [
                'id_produk' => $produk->id_produk,
                'nama' => $produk->nama,
                'harga_jual' => $produk->harga_jual,
                'barcode' => $produk->barcode,
            ]);

        return Inertia::render('admin/Products', [
            'produks' => $produks,
            'kategoris' => $kategoris,
            'barcode_print' => $barcodePrint,
            'stats' => [
                // Agregat lintas halaman — bukan dari data halaman aktif.
                'total_produk' => Produk::count(),
                'total_kategori' => Kategori::count(),
                // status_stok bermasalah = produk fisik (non-jasa) dengan stok <= 5.
                'stok_bermasalah' => Produk::where('tipe_jual', '!=', 'jasa')->where('stok', '<=', 5)->count(),
                // Produk fisik tanpa barcode — guard tombol "Generate Barcode Semua"
                // (harus lintas halaman, selaras dengan generateAllBarcodes()).
                'produk_tanpa_barcode' => Produk::where('tipe_jual', '!=', 'jasa')
                    ->where(fn ($q) => $q->whereNull('barcode')->orWhere('barcode', ''))
                    ->count(),
                // Jumlah produk yang diarsipkan (untuk badge tab Arsip).
                'arsip' => Produk::onlyTrashed()->count(),
            ],
            'filters' => [
                'search' => $search,
                'kategori' => $kategori === null ? '' : (string) $kategori,
                'jenis' => $jenis ?? '',
                'sort' => $sort,
                'view' => $view,
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

        // Produk jasa (tarik tunai/transfer) tidak punya barang fisik: tanpa stok,
        // tanpa potongan reseller, dan tanpa "asal produk" — omzet murni dari fee.
        // harga_jual tidak dipakai untuk jasa (fee diambil dari tarif bertingkat atau
        // diketik kasir tiap transaksi), jadi dipaksa 0 agar tidak menyesatkan.
        if ($validated['tipe_jual'] === 'jasa') {
            $validated['jenis'] = 'beli';
            $validated['stok'] = 0;
            $validated['potongan_reseller'] = 0;
            $validated['harga_jual'] = 0;
        } else {
            $validated['potongan_reseller'] = (int) ($validated['potongan_reseller'] ?? 0);
        }

        if ($request->hasFile('foto_upload')) {
            $validated['foto'] = $request->file('foto_upload')->store('produk', 'public');
        } else {
            $validated['foto'] = blank($validated['foto'] ?? null) ? null : $validated['foto'];
        }

        // Modal barang: produk jasa tidak punya modal (omzet = fee saja); produk
        // 'produksi' dikelola otomatis oleh modul Produksi (batch costing); 'beli'
        // diisi manual.
        $validated['harga_modal'] = $validated['tipe_jual'] === 'jasa' || $validated['jenis'] === 'produksi'
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

        // Produk "buatan sendiri" dibuat tanpa stok & modal (keduanya berasal dari
        // catatan Produksi). Beritahu frontend agar menawarkan lanjut ke menu Produksi.
        if ($produk->jenis === 'produksi') {
            Inertia::flash('produk_baru', [
                'id' => $produk->id_produk,
                'nama' => $produk->nama,
                'jenis' => $produk->jenis,
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

        // Produk jasa tidak punya barang fisik: tanpa stok, potongan reseller, modal,
        // atau harga_jual (fee diambil dari tarif bertingkat / diketik kasir).
        if ($validated['tipe_jual'] === 'jasa') {
            $validated['jenis'] = 'beli';
            $validated['stok'] = 0;
            $validated['potongan_reseller'] = 0;
            $validated['harga_jual'] = 0;
        } else {
            $validated['potongan_reseller'] = (int) ($validated['potongan_reseller'] ?? 0);
        }

        $stokLama = (float) $produk->stok;

        if ($request->hasFile('foto_upload')) {
            $validated['foto'] = $request->file('foto_upload')->store('produk', 'public');
        } else {
            $validated['foto'] = blank($validated['foto'] ?? null) ? null : $validated['foto'];
        }

        if ($validated['tipe_jual'] === 'jasa') {
            // Jasa tidak punya modal barang (omzet = fee saja).
            $validated['harga_modal'] = 0;
        } elseif ($validated['jenis'] === 'produksi') {
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
     * Arsipkan produk (soft delete). Produk hilang dari katalog, kasir, stok, dan
     * laporan, tapi riwayat transaksi/produksi/pesanannya tetap utuh dan bisa
     * dipulihkan. Dipakai sebagai pengganti hapus permanen agar tidak terganjal
     * foreign key untuk produk yang sudah pernah terjual/diproduksi.
     */
    public function destroy(Produk $produk): RedirectResponse
    {
        $produk->delete();

        return redirect()->route('admin.products')->with('success', 'Produk berhasil diarsipkan.');
    }

    /**
     * Pulihkan produk yang sebelumnya diarsipkan agar aktif kembali.
     */
    public function restore(int $produk): RedirectResponse
    {
        Produk::onlyTrashed()->findOrFail($produk)->restore();

        return redirect()->route('admin.products', ['view' => 'arsip'])
            ->with('success', 'Produk berhasil dipulihkan.');
    }

    /**
     * Apakah produk sudah pernah dipakai pada riwayat bisnis (transaksi/produksi/
     * pesanan)? Ketiganya FK restrictOnDelete — produk seperti ini wajib tetap
     * diarsipkan agar laporan & riwayat tidak rusak, tidak boleh dihapus permanen.
     */
    private function produkPunyaRiwayat(Produk $produk): bool
    {
        return $produk->detailTransaksis()->exists()
            || $produk->produksis()->exists()
            || DB::table('pesanan_items')->where('id_produk', $produk->id_produk)->exists();
    }

    /**
     * Hapus PERMANEN produk yang diarsipkan. Hanya untuk produk salah input /
     * duplikat yang BELUM pernah dipakai — produk dengan riwayat tetap diarsipkan
     * (dijaga juga oleh FK restrictOnDelete di level DB).
     */
    public function hapusPermanen(int $produk): RedirectResponse
    {
        $produk = Produk::onlyTrashed()->findOrFail($produk);

        if ($this->produkPunyaRiwayat($produk)) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Produk ini sudah pernah dipakai di transaksi/produksi/pesanan, jadi tidak bisa dihapus permanen. Biarkan tetap diarsipkan agar laporan tidak rusak.',
            ]);

            return back();
        }

        DB::transaction(function () use ($produk): void {
            // Bersihkan jejak yang TIDAK memblokir agar tak menyisakan data yatim:
            // kartu stok (saldo awal) & promo khusus produk ini. Tarif jasa ikut
            // terhapus otomatis (FK cascade).
            $produk->stokMutasis()->delete();
            Promo::where('id_produk', $produk->id_produk)->delete();

            $produk->forceDelete();
        });

        return redirect()->route('admin.products', ['view' => 'arsip'])
            ->with('success', 'Produk berhasil dihapus permanen.');
    }
}
