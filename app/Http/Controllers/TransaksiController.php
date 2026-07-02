<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesPerPage;
use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TransaksiController extends Controller
{
    use ResolvesPerPage;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $startDate = $request->input('start_date') ?: Carbon::today()->toDateString();
        $endDate = $request->input('end_date') ?: Carbon::today()->toDateString();
        $search = trim((string) $request->query('search', ''));
        $kasir = $request->query('kasir', '');
        $kasir = is_numeric($kasir) ? (int) $kasir : null;
        $sort = (string) $request->query('sort', '');

        $query = Transaksi::with(['user', 'detailTransaksis.produk', 'promo'])
            // Bandingkan datetime mentah (bukan whereDate) agar index created_at terpakai.
            ->where('created_at', '>=', Carbon::parse($startDate)->startOfDay())
            ->where('created_at', '<=', Carbon::parse($endDate)->endOfDay())
            // Pencarian "kode" = "TRX-{id}" (string bentukan, bukan kolom) atau nama kasir.
            ->when($search !== '', fn ($q) => $q->where(fn ($sub) => $sub
                ->whereRaw("CONCAT('TRX-', id_transaksi) LIKE ?", ['%'.$search.'%'])
                ->orWhereHas('user', fn ($u) => $u->where('name', 'like', '%'.$search.'%'))))
            ->when($kasir !== null, fn ($q) => $q->where('id_user', $kasir));

        // jumlah_item = SUM(detail.jumlah) → butuh agregat untuk sort by item.
        if ($sort === 'item_asc' || $sort === 'item_desc') {
            $query->withSum('detailTransaksis as item_count', 'jumlah')
                ->orderBy('item_count', $sort === 'item_asc' ? 'asc' : 'desc');
        } else {
            [$sortColumn, $sortDir] = match ($sort) {
                'date_asc' => ['created_at', 'asc'],
                'total_asc' => ['total_harga', 'asc'],
                'total_desc' => ['total_harga', 'desc'],
                default => ['created_at', 'desc'], // date_desc / kosong = terbaru dulu
            };
            $query->orderBy($sortColumn, $sortDir);
        }

        $transaksis = $query->paginate($this->resolvePerPage($request))
            ->withQueryString()
            ->through(fn (Transaksi $transaksi) => $this->formatTransaksi($transaksi));

        // Stats agregat atas rentang tanggal (tidak terpengaruh search/kasir) — sesuai perilaku lama.
        $statBase = Transaksi::where('created_at', '>=', Carbon::parse($startDate)->startOfDay())
            ->where('created_at', '<=', Carbon::parse($endDate)->endOfDay());
        $totalPenjualan = (int) (clone $statBase)->sum('total_harga');
        $totalTransaksi = (clone $statBase)->count();
        $rataRata = $totalTransaksi > 0 ? (int) ($totalPenjualan / $totalTransaksi) : 0;

        $kasirs = User::orderBy('name')->get(['id', 'name', 'role']);
        $produks = Produk::with('kategori')
            ->orderBy('nama')
            ->get(['id_produk', 'nama', 'harga_jual', 'stok']);

        return Inertia::render('admin/Transactions', [
            'transaksis' => $transaksis,
            'kasirs' => $kasirs,
            'produks' => $produks,
            'stats' => [
                'total_penjualan_hari_ini' => $totalPenjualan,
                'total_transaksi_sukses' => $totalTransaksi,
                'rata_rata' => $rataRata,
            ],
            'date_range' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'filters' => [
                'search' => $search,
                'kasir' => $kasir === null ? '' : (string) $kasir,
                'sort' => $sort,
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
            'id_user' => ['required', 'exists:users,id'],
            'metode_pembayaran' => ['required', Rule::in(['cash', 'qris', 'transfer'])],
            'bayar' => ['required', 'integer', 'min:0'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id_produk' => ['required', 'exists:produks,id_produk'],
            // numeric (bukan integer) agar produk curah bisa dijual pecahan.
            'items.*.jumlah' => ['required', 'numeric', 'gt:0'],
        ]);

        DB::transaction(function () use ($validated): void {
            $this->createTransaksiWithDetails($validated);
        });

        return redirect()->route('admin.transactions')->with('success', 'Transaksi berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaksi $transaksi): RedirectResponse
    {
        $validated = $request->validate([
            'id_user' => ['required', 'exists:users,id'],
            'metode_pembayaran' => ['required', Rule::in(['cash', 'qris', 'transfer'])],
            'bayar' => ['required', 'integer', 'min:0'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id_produk' => ['required', 'exists:produks,id_produk'],
            // numeric (bukan integer) agar produk curah bisa dijual pecahan.
            'items.*.jumlah' => ['required', 'numeric', 'gt:0'],
        ]);

        DB::transaction(function () use ($validated, $transaksi): void {
            $this->restoreStockFromTransaksi($transaksi);
            $transaksi->detailTransaksis()->delete();
            $this->createTransaksiWithDetails($validated, $transaksi);
        });

        return redirect()->route('admin.transactions')->with('success', 'Transaksi berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaksi $transaksi): RedirectResponse
    {
        DB::transaction(function () use ($transaksi): void {
            $this->restoreStockFromTransaksi($transaksi);
            $transaksi->delete();
        });

        return redirect()->route('admin.transactions')->with('success', 'Transaksi berhasil dihapus.');
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    private function createTransaksiWithDetails(array $validated, ?Transaksi $transaksi = null): void
    {
        $totalHarga = 0;
        $details = [];

        foreach ($validated['items'] as $item) {
            $produk = Produk::lockForUpdate()->findOrFail($item['id_produk']);

            if ($produk->stok < $item['jumlah']) {
                throw ValidationException::withMessages([
                    'items' => "Stok {$produk->nama} tidak mencukupi (tersedia: {$produk->stok}).",
                ]);
            }

            $harga = $produk->harga_jual;
            $subtotal = $harga * $item['jumlah'];
            $totalHarga += $subtotal;

            $details[] = [
                'produk' => $produk,
                'jumlah' => $item['jumlah'],
                'harga' => $harga,
                'modal' => $produk->harga_modal, // snapshot HPP/unit saat terjual
                'subtotal' => $subtotal,
            ];
        }

        if ($validated['bayar'] < $totalHarga) {
            throw ValidationException::withMessages([
                'bayar' => 'Jumlah bayar kurang dari total harga.',
            ]);
        }

        $transaksiData = [
            'id_user' => $validated['id_user'],
            'total_harga' => $totalHarga,
            'metode_pembayaran' => $validated['metode_pembayaran'],
            'bayar' => $validated['bayar'],
            'kembalian' => $validated['bayar'] - $totalHarga,
        ];

        if ($transaksi) {
            $transaksi->update($transaksiData);
        } else {
            $transaksi = Transaksi::create($transaksiData);
        }

        foreach ($details as $detail) {
            DetailTransaksi::create([
                'id_transaksi' => $transaksi->id_transaksi,
                'id_produk' => $detail['produk']->id_produk,
                'jumlah' => $detail['jumlah'],
                'harga' => $detail['harga'],
                'modal' => $detail['modal'],
                'subtotal' => $detail['subtotal'],
            ]);

            // Kurangi stok + catat ke kartu stok (produk masih terkunci dari loop validasi).
            $detail['produk']->terapkanMutasiStok(
                -(float) $detail['jumlah'],
                'jual',
                [
                    'keterangan' => 'Penjualan (admin) TRX-'.$transaksi->id_transaksi,
                    'ref_tipe' => 'Transaksi',
                    'id_referensi' => $transaksi->id_transaksi,
                ]
            );
        }
    }

    private function restoreStockFromTransaksi(Transaksi $transaksi): void
    {
        $transaksi->load('detailTransaksis');

        foreach ($transaksi->detailTransaksis as $detail) {
            if ($detail->id_produk === null) {
                continue; // produk sudah dihapus — lewati pengembalian stok.
            }

            $produk = Produk::lockForUpdate()->find($detail->id_produk);

            if ($produk) {
                // Kembalikan stok + catat ke kartu stok (edit/hapus transaksi).
                $produk->terapkanMutasiStok(
                    (float) $detail->jumlah,
                    'retur',
                    [
                        'keterangan' => 'Pengembalian stok dari edit/hapus TRX-'.$transaksi->id_transaksi,
                        'ref_tipe' => 'Transaksi',
                        'id_referensi' => $transaksi->id_transaksi,
                    ]
                );
            }
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function formatTransaksi(Transaksi $transaksi): array
    {
        return [
            'id_transaksi' => $transaksi->id_transaksi,
            'id_user' => $transaksi->id_user,
            'kode' => 'TRX-'.$transaksi->id_transaksi,
            'kasir' => $transaksi->user?->name ?? '-',
            'jumlah_item' => $transaksi->detailTransaksis->sum('jumlah'),
            'total_harga' => $transaksi->total_harga,
            'diskon' => $transaksi->diskon,
            'promo_nama' => $transaksi->promo?->nama,
            'metode_pembayaran' => $transaksi->metode_pembayaran,
            'bayar' => $transaksi->bayar,
            'kembalian' => $transaksi->kembalian,
            'created_at' => $transaksi->created_at,
            'waktu' => Carbon::parse($transaksi->created_at)->translatedFormat('H:i \W\I\T\A'),
            'tanggal' => Carbon::parse($transaksi->created_at)->translatedFormat('d M Y'),
            'details' => $transaksi->detailTransaksis->map(fn (DetailTransaksi $detail) => [
                'id_produk' => $detail->id_produk,
                'nama_produk' => $detail->produk?->nama ?? '-',
                'jumlah' => $detail->jumlah,
                'harga' => $detail->harga,
                'subtotal' => $detail->subtotal,
                'foto' => $detail->produk?->foto ?? null,
                'foto_url' => Produk::fotoUrl($detail->produk?->foto),
            ])->values(),
        ];
    }
}
