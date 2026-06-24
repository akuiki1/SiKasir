<?php

namespace App\Http\Controllers;

use App\Models\DetailTransaksi;
use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Services\PesananService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Kelola pesanan online (pending). Dipakai bersama oleh kasir (/kasir/pesanan) &
 * admin (/admin/pesanan) — komponen Vue sama, hanya base URL aksi yang berbeda.
 */
class PesananController extends Controller
{
    public function __construct(private readonly PesananService $service) {}

    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        // Periode kalender hanya untuk Riwayat; default bulan berjalan.
        $startDate = $request->input('start_date') ?: Carbon::today()->startOfMonth()->toDateString();
        $endDate = $request->input('end_date') ?: Carbon::today()->endOfMonth()->toDateString();

        // Antrian aktif (perlu ditindak): SELALU tampil semua — tak terfilter tanggal
        // agar pesanan pending lama tak hilang dari antrian; hanya ikut pencarian.
        $aktif = $this->applyFilters(
            Pesanan::with(['items', 'pelanggan'])->whereIn('status', PesananService::STATUS_AKTIF),
            $search,
        )
            ->orderBy('created_at')
            ->get()
            ->map(fn (Pesanan $pesanan) => $this->mapPesanan($pesanan));

        // Riwayat (selesai/batal): dipersempit pencarian + periode. Saat memfilter, perbesar batas.
        $adaFilter = $search !== '' || $request->filled('start_date') || $request->filled('end_date');
        $riwayat = $this->applyFilters(
            Pesanan::with(['items', 'transaksi'])->whereIn('status', ['selesai', 'batal']),
            $search,
            $startDate,
            $endDate,
        )
            ->latest('updated_at')
            ->limit($adaFilter ? 50 : 20)
            ->get()
            ->map(fn (Pesanan $pesanan) => $this->mapPesanan($pesanan));

        // Katalog produk satuan untuk pemilih "tambah produk" di modal edit.
        $produks = Produk::where('tipe_jual', 'satuan')
            ->orderBy('nama')
            ->get(['id_produk', 'nama', 'harga_jual', 'potongan_reseller', 'stok'])
            ->map(fn (Produk $p) => [
                'id_produk' => $p->id_produk,
                'nama' => $p->nama,
                'harga_jual' => (int) $p->harga_jual,
                'potongan_reseller' => (int) $p->potongan_reseller,
                'stok' => (float) $p->stok,
            ]);

        return Inertia::render('pesanan/Index', [
            'pesanans_aktif' => $aktif,
            'pesanans_riwayat' => $riwayat,
            'produks' => $produks,
            'filters' => ['search' => $search, 'start_date' => $startDate, 'end_date' => $endDate],
            'base_url' => $this->basePath($request),
        ]);
    }

    /** Tandai pesanan sudah disiapkan (siap diambil). */
    public function siap(Pesanan $pesanan): RedirectResponse
    {
        if ($pesanan->status !== 'pending') {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Pesanan tidak bisa ditandai siap.']);

            return back();
        }

        $pesanan->update(['status' => 'disiapkan', 'disiapkan_at' => now()]);

        Inertia::flash('toast', ['type' => 'success', 'message' => "Pesanan {$pesanan->kode} ditandai siap diambil."]);

        return back();
    }

    /** Ubah isi pesanan (tambah/kurangi/hapus produk) — stok direkonsiliasi otomatis. */
    public function edit(Request $request, Pesanan $pesanan): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.id_produk' => ['required', 'exists:produks,id_produk'],
            'items.*.jumlah' => ['required', 'integer', 'min:1'],
        ]);

        try {
            $this->service->perbaruiItems($pesanan, $validated['items'], Auth::id());
        } catch (ValidationException $e) {
            Inertia::flash('toast', ['type' => 'error', 'message' => $e->validator->errors()->first()]);

            return back();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => "Pesanan {$pesanan->kode} diperbarui."]);

        return back();
    }

    /**
     * Proses pembayaran pesanan → buat transaksi nyata.
     * Stok TIDAK dikurangi lagi (sudah di-reserve saat pesanan masuk).
     */
    public function proses(Request $request, Pesanan $pesanan): RedirectResponse
    {
        $validated = $request->validate([
            'metode_pembayaran' => ['required', Rule::in(['cash', 'qris', 'transfer'])],
            'bayar' => ['required', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($validated, $pesanan): void {
            $pesanan = Pesanan::with('items')->lockForUpdate()->findOrFail($pesanan->id_pesanan);

            if (! in_array($pesanan->status, PesananService::STATUS_AKTIF, true)) {
                throw ValidationException::withMessages(['status' => 'Pesanan ini sudah diproses atau dibatalkan.']);
            }

            $total = (int) $pesanan->total;

            if ($validated['bayar'] < $total) {
                throw ValidationException::withMessages(['bayar' => 'Jumlah bayar kurang dari total pesanan.']);
            }

            $transaksi = Transaksi::create([
                'id_user' => Auth::id(),
                'id_pelanggan' => $pesanan->id_pelanggan,
                'id_promo' => null,
                'total_harga' => $total,
                'diskon' => 0,
                'metode_pembayaran' => $validated['metode_pembayaran'],
                'bayar' => $validated['bayar'],
                'kembalian' => $validated['bayar'] - $total,
            ]);

            foreach ($pesanan->items as $item) {
                $produk = Produk::find($item->id_produk);

                DetailTransaksi::create([
                    'id_transaksi' => $transaksi->id_transaksi,
                    'id_produk' => $item->id_produk,
                    'jumlah' => $item->jumlah,
                    'harga' => $item->harga,
                    'modal' => $produk?->harga_modal ?? 0, // snapshot HPP/unit saat dibayar
                    'subtotal' => $item->subtotal,
                    'nominal' => null,
                ]);

                // Stok sengaja TIDAK disentuh: sudah berkurang saat reserve pesanan.
            }

            $pesanan->update([
                'status' => 'selesai',
                'selesai_at' => now(),
                'id_transaksi' => $transaksi->id_transaksi,
            ]);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => "Pembayaran pesanan {$pesanan->kode} berhasil diproses."]);

        return back();
    }

    /** Batalkan pesanan → kembalikan stok yang sempat di-reserve. */
    public function batal(Pesanan $pesanan): RedirectResponse
    {
        DB::transaction(function () use ($pesanan): void {
            $pesanan = Pesanan::with('items')->lockForUpdate()->findOrFail($pesanan->id_pesanan);

            if (! in_array($pesanan->status, PesananService::STATUS_AKTIF, true)) {
                throw ValidationException::withMessages(['status' => 'Pesanan ini tidak bisa dibatalkan.']);
            }

            $this->service->kembalikanStok($pesanan, Auth::id(), 'Batal pesanan '.$pesanan->kode);
            $pesanan->update(['status' => 'batal']);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => "Pesanan {$pesanan->kode} dibatalkan, stok dikembalikan."]);

        return back();
    }

    /** Terapkan filter pencarian (nama/telp) & rentang tanggal pembuatan (opsional). */
    private function applyFilters(Builder $query, string $search, ?string $startDate = null, ?string $endDate = null): Builder
    {
        if ($search !== '') {
            $digits = preg_replace('/\D/', '', $search);

            $query->where(function (Builder $q) use ($search, $digits) {
                $q->where('nama_pelanggan', 'like', "%{$search}%");

                // Hanya cocokkan telp bila kata kunci mengandung angka (cegah LIKE '%%').
                if ($digits !== '') {
                    $q->orWhere('telp', 'like', "%{$digits}%");
                }
            });
        }

        // Bandingkan datetime mentah (bukan whereDate) agar index created_at terpakai.
        if ($startDate !== null && $startDate !== '') {
            $query->where('created_at', '>=', Carbon::parse($startDate)->startOfDay());
        }

        if ($endDate !== null && $endDate !== '') {
            $query->where('created_at', '<=', Carbon::parse($endDate)->endOfDay());
        }

        return $query;
    }

    private function basePath(Request $request): string
    {
        return $request->is('admin/*') ? '/admin/pesanan' : '/kasir/pesanan';
    }

    /** Bentuk payload satu pesanan untuk halaman kelola pesanan. */
    private function mapPesanan(Pesanan $pesanan): array
    {
        return [
            'id_pesanan' => $pesanan->id_pesanan,
            'kode' => $pesanan->kode,
            'status' => $pesanan->status,
            'nama_pelanggan' => $pesanan->nama_pelanggan,
            'telp' => $pesanan->telp,
            'tipe_pelanggan' => $pesanan->tipe_pelanggan,
            'total' => (int) $pesanan->total,
            'catatan' => $pesanan->catatan,
            'sumber' => $pesanan->sumber,
            'waktu' => Carbon::parse($pesanan->created_at)->translatedFormat('d M Y · H:i'),
            'items' => $pesanan->items->map(fn ($item) => [
                'id_produk' => (int) $item->id_produk,
                'nama_produk' => $item->nama_produk,
                'jumlah' => (int) $item->jumlah,
                'harga' => (int) $item->harga,
                'subtotal' => (int) $item->subtotal,
            ])->values(),
            'transaksi' => $pesanan->relationLoaded('transaksi') && $pesanan->transaksi
                ? [
                    'kode' => 'TRX-'.$pesanan->transaksi->id_transaksi,
                    'metode_pembayaran' => $pesanan->transaksi->metode_pembayaran,
                    'bayar' => (int) $pesanan->transaksi->bayar,
                    'kembalian' => (int) $pesanan->transaksi->kembalian,
                ]
                : null,
        ];
    }
}
