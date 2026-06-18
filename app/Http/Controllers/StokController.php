<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\StokMutasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StokController extends Controller
{
    /** Label tipe mutasi untuk kartu stok. */
    private const TIPE_LABEL = [
        'awal' => 'Stok Awal',
        'masuk' => 'Stok Masuk',
        'keluar' => 'Stok Keluar',
        'jual' => 'Penjualan',
        'produksi' => 'Produksi',
        'produksi_batal' => 'Batal Produksi',
        'penyesuaian' => 'Penyesuaian',
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
    public function index(): Response
    {
        // Hanya produk berstok fisik — produk jasa tidak punya stok.
        $produks = Produk::with('kategori')
            ->where('tipe_jual', '!=', 'jasa')
            ->orderBy('nama')
            ->get()
            ->map(fn (Produk $p) => [
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

        // Kartu stok: 200 mutasi terbaru (cukup untuk audit harian toko kecil).
        $mutasis = StokMutasi::with(['produk', 'user'])
            ->orderByDesc('id_stok_mutasi')
            ->take(200)
            ->get()
            ->map(fn (StokMutasi $m) => [
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

        return Inertia::render('admin/Stok', [
            'produks' => $produks,
            'mutasis' => $mutasis,
            'stats' => [
                'total_produk' => $produks->count(),
                'stok_menipis' => $produks->where('status_stok', 'low-stock')->count(),
                'stok_habis' => $produks->where('status_stok', 'out-of-stock')->count(),
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
    private function produkBerstokRule(): \Illuminate\Validation\Rules\Exists
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
