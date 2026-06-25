<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesPerPage;
use App\Models\Produk;
use App\Models\StokMutasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Exists;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StokController extends Controller
{
    use ResolvesPerPage;

    /** Label tipe mutasi untuk kartu stok. */
    private const TIPE_LABEL = [
        'awal' => 'Stok Awal',
        'masuk' => 'Stok Masuk',
        'keluar' => 'Stok Keluar',
        'jual' => 'Penjualan',
        'produksi' => 'Produksi',
        'produksi_batal' => 'Batal Produksi',
        'penyesuaian' => 'Penyesuaian',
        'pesanan' => 'Reserve Pesanan',
        'pesanan_batal' => 'Batal Pesanan',
    ];

    /** Alasan stok keluar manual (di luar penjualan). */
    private const ALASAN_LABEL = [
        'rusak' => 'Rusak',
        'kadaluarsa' => 'Kadaluarsa',
        'hilang' => 'Hilang',
        'pakai_sendiri' => 'Dipakai sendiri',
        'lainnya' => 'Lainnya',
    ];

    /**
     * Halaman manajemen stok: daftar stok produk + kartu stok (riwayat mutasi).
     */
    public function index(Request $request): Response
    {
        // ── Tab 1: Daftar Stok (produk fisik — jasa tidak punya stok) ──
        $produkSearch = trim((string) $request->query('search', ''));
        $status = (string) $request->query('status', 'all');
        $produkPerPage = $this->resolvePerPage($request, 10, 'produk_per_page');

        $produks = Produk::with('kategori')
            ->where('tipe_jual', '!=', 'jasa')
            ->when($produkSearch !== '', fn ($q) => $q->where(fn ($sub) => $sub
                ->where('nama', 'like', '%'.$produkSearch.'%')
                ->orWhereHas('kategori', fn ($k) => $k->where('nama_kategori', 'like', '%'.$produkSearch.'%'))))
            // status_stok adalah accessor — diterjemahkan ke kondisi stok di DB.
            ->when($status === 'out-of-stock', fn ($q) => $q->where('stok', '<=', 0))
            ->when($status === 'low-stock', fn ($q) => $q->where('stok', '>', 0)->where('stok', '<=', 5))
            ->when($status === 'in-stock', fn ($q) => $q->where('stok', '>', 5))
            ->when($status === 'menipis', fn ($q) => $q->where('stok', '<=', 5))
            ->orderBy('nama')
            ->paginate($produkPerPage, ['*'], 'produk_page')
            ->withQueryString()
            ->through(fn (Produk $p) => [
                'id_produk' => $p->id_produk,
                'nama' => $p->nama,
                'jenis' => $p->jenis,
                'tipe_jual' => $p->tipe_jual,
                'satuan' => $p->satuan,
                'kategori' => $p->kategori?->nama_kategori,
                'stok' => (float) $p->stok,
                'harga_modal' => $p->harga_modal,
                'status_stok' => $p->status_stok,
            ]);

        // Daftar lengkap produk fisik untuk pemilih di modal aksi stok. Sengaja
        // tanpa paginasi: pencarian pemilih berjalan di klien atas SEMUA produk,
        // bukan cuma halaman tabel yang sedang tampil.
        $produkOptions = Produk::with('kategori')
            ->where('tipe_jual', '!=', 'jasa')
            ->orderBy('nama')
            ->get()
            ->map(fn (Produk $p) => [
                'id_produk' => $p->id_produk,
                'nama' => $p->nama,
                'jenis' => $p->jenis,
                'satuan' => $p->satuan,
                'kategori' => $p->kategori?->nama_kategori,
                'stok' => (float) $p->stok,
            ]);

        // ── Tab 2: Kartu Stok (riwayat mutasi, paginasi server-side) ──
        $mutasiSearch = trim((string) $request->query('m_search', ''));
        $tipe = (string) $request->query('tipe', 'all');
        $mutasiPerPage = $this->resolvePerPage($request, 10, 'mutasi_per_page');

        $mutasis = StokMutasi::with(['produk', 'user'])
            ->when($mutasiSearch !== '', fn ($q) => $q->whereHas('produk', fn ($p) => $p->where('nama', 'like', '%'.$mutasiSearch.'%')))
            ->when($tipe !== 'all', fn ($q) => $q->where('tipe', $tipe))
            ->orderByDesc('id_stok_mutasi')
            ->paginate($mutasiPerPage, ['*'], 'mutasi_page')
            ->withQueryString()
            ->through(fn (StokMutasi $m) => [
                'id_stok_mutasi' => $m->id_stok_mutasi,
                'id_produk' => $m->id_produk,
                'produk_nama' => $m->produk?->nama ?? 'Produk Terhapus',
                'tipe' => $m->tipe,
                'tipe_label' => self::TIPE_LABEL[$m->tipe] ?? ucfirst($m->tipe),
                'jumlah' => (float) $m->jumlah,
                'stok_sebelum' => (float) $m->stok_sebelum,
                'stok_sesudah' => (float) $m->stok_sesudah,
                'keterangan' => $m->keterangan,
                'user_nama' => $m->user?->name ?? '—',
                'tanggal' => Carbon::parse($m->created_at)->translatedFormat('d M Y H:i'),
            ]);

        // Stats agregat atas seluruh produk fisik (tidak terpengaruh filter tabel).
        $physical = fn () => Produk::where('tipe_jual', '!=', 'jasa');

        return Inertia::render('admin/Stok', [
            'produks' => $produks,
            'produk_options' => $produkOptions,
            'mutasis' => $mutasis,
            'stats' => [
                'total_produk' => $physical()->count(),
                'stok_menipis' => $physical()->where('stok', '>', 0)->where('stok', '<=', 5)->count(),
                'stok_habis' => $physical()->where('stok', '<=', 0)->count(),
            ],
            'filters' => [
                'search' => $produkSearch,
                'status' => $status,
                'produk_per_page' => $produkPerPage,
                'm_search' => $mutasiSearch,
                'tipe' => $tipe,
                'mutasi_per_page' => $mutasiPerPage,
            ],
        ]);
    }

    /**
     * Stok masuk (restock dari supplier/agen). Opsional perbarui harga modal
     * untuk produk 'beli' — produk 'produksi' modalnya dikelola modul Produksi.
     */
    public function masuk(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_produk' => ['required', $this->produkBerstokRule()],
            'jumlah' => ['required', 'numeric', 'gt:0'],
            'harga_beli' => ['nullable', 'integer', 'min:0'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ], [
            'id_produk.exists' => 'Produk tidak valid (produk jasa tidak punya stok).',
            'jumlah.gt' => 'Jumlah stok masuk harus lebih dari 0.',
        ]);

        DB::transaction(function () use ($validated): void {
            $produk = Produk::lockForUpdate()->findOrFail($validated['id_produk']);

            $produk->terapkanMutasiStok(
                (float) $validated['jumlah'],
                'masuk',
                ['keterangan' => $validated['keterangan'] ?? 'Stok masuk (restock)'],
            );

            // Perbarui modal hanya untuk produk 'beli' & bila harga beli diisi.
            if ($produk->jenis === 'beli' && filled($validated['harga_beli'] ?? null)) {
                $produk->update(['harga_modal' => (int) $validated['harga_beli']]);
            }
        });

        return redirect()->route('admin.stok')->with('success', 'Stok masuk berhasil dicatat.');
    }

    /**
     * Stok keluar manual (rusak/kadaluarsa/hilang/dipakai sendiri) — bukan penjualan.
     */
    public function keluar(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_produk' => ['required', $this->produkBerstokRule()],
            'jumlah' => ['required', 'numeric', 'gt:0'],
            'alasan' => ['required', Rule::in(array_keys(self::ALASAN_LABEL))],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ], [
            'id_produk.exists' => 'Produk tidak valid (produk jasa tidak punya stok).',
            'jumlah.gt' => 'Jumlah stok keluar harus lebih dari 0.',
        ]);

        DB::transaction(function () use ($validated): void {
            $produk = Produk::lockForUpdate()->findOrFail($validated['id_produk']);

            if ((float) $produk->stok < (float) $validated['jumlah']) {
                throw ValidationException::withMessages([
                    'jumlah' => 'Jumlah keluar melebihi stok tersedia ('.$this->formatStok($produk).').',
                ]);
            }

            $alasanLabel = self::ALASAN_LABEL[$validated['alasan']];
            $keterangan = filled($validated['keterangan'] ?? null)
                ? $alasanLabel.' — '.$validated['keterangan']
                : $alasanLabel;

            $produk->terapkanMutasiStok(
                -(float) $validated['jumlah'],
                'keluar',
                ['keterangan' => $keterangan],
            );
        });

        return redirect()->route('admin.stok')->with('success', 'Stok keluar berhasil dicatat.');
    }

    /**
     * Penyesuaian / opname: set stok ke jumlah fisik hasil hitung ulang.
     * Selisih dengan stok sistem dicatat sebagai mutasi 'penyesuaian'.
     */
    public function penyesuaian(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_produk' => ['required', $this->produkBerstokRule()],
            'stok_fisik' => ['required', 'numeric', 'min:0'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ], [
            'id_produk.exists' => 'Produk tidak valid (produk jasa tidak punya stok).',
        ]);

        DB::transaction(function () use ($validated): void {
            $produk = Produk::lockForUpdate()->findOrFail($validated['id_produk']);

            $sebelum = (float) $produk->stok;
            $sesudah = (float) $validated['stok_fisik'];
            $delta = $sesudah - $sebelum;

            if ($delta === 0.0) {
                throw ValidationException::withMessages([
                    'stok_fisik' => 'Stok fisik sama dengan stok sistem — tidak ada penyesuaian.',
                ]);
            }

            $produk->terapkanMutasiStok(
                $delta,
                'penyesuaian',
                ['keterangan' => $validated['keterangan'] ?? 'Penyesuaian / opname stok'],
            );
        });

        return redirect()->route('admin.stok')->with('success', 'Penyesuaian stok berhasil dicatat.');
    }

    /** Aturan: produk harus ada & bukan jasa (jasa tidak berstok). */
    private function produkBerstokRule(): Exists
    {
        return Rule::exists('produks', 'id_produk')
            ->where(fn ($query) => $query->where('tipe_jual', '!=', 'jasa'));
    }

    /** Tampilkan stok tanpa desimal berlebih untuk pesan error. */
    private function formatStok(Produk $produk): string
    {
        $stok = (float) $produk->stok;
        $angka = $stok == (int) $stok ? (string) (int) $stok : (string) $stok;

        return $angka.' '.$produk->satuan;
    }
}
