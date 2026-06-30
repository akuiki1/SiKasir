<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\PesananItem;
use App\Services\PesananService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PesananPublikController extends Controller
{
    /**
     * Nomor WhatsApp toko (tujuan pesan konfirmasi pesanan dari pelanggan).
     * Selaras dengan WHATSAPP_NUMBER di resources/js/pages/Welcome.vue.
     */
    private const WHATSAPP_TOKO = '6283114827245';

    public function __construct(private readonly PesananService $service) {}

    /**
     * Simpan pesanan online (pending) dari storefront + reserve stok.
     *
     * Endpoint publik (tanpa auth) yang dipanggil via fetch dari Welcome.vue.
     * Mengembalikan JSON berisi kode pesanan + tautan wa.me ke toko agar
     * pelanggan bisa mengonfirmasi. Pesanan sudah tersimpan walau WA tidak dikirim.
     */
    public function store(Request $request): JsonResponse
    {
        // Endpoint JSON publik. Karena app hanya merender JSON otomatis untuk
        // path api/* (lihat bootstrap/app.php), error validasi ditangkap manual
        // dan dikembalikan sebagai JSON 422 agar fetch storefront bisa membacanya.
        try {
            $validated = $request->validate([
                'nama' => ['required', 'string', 'max:100'],
                'telp' => ['required', 'string', 'max:30', 'regex:/^[0-9+\-\s()]{6,}$/'],
                'catatan' => ['nullable', 'string', 'max:500'],
                'items' => ['required', 'array', 'min:1', 'max:100'],
                'items.*.id_produk' => ['required', 'exists:produks,id_produk'],
                'items.*.jumlah' => ['required', 'integer', 'min:1'],
            ], [
                'telp.regex' => 'Nomor WhatsApp tidak valid.',
            ]);

            $pesanan = $this->service->buat([
                'nama' => $validated['nama'],
                'telp' => $validated['telp'],
                'catatan' => $validated['catatan'] ?? null,
                'sumber' => 'web',
                'items' => $validated['items'],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->validator->errors()->first() ?: 'Pesanan gagal dibuat.',
                'errors' => $e->errors(),
            ], 422);
        }

        return response()->json([
            'kode' => $pesanan->kode,
            'total' => $pesanan->total,
            'wa_url' => $this->waKonfirmasiUrl($pesanan),
        ]);
    }

    /**
     * Lacak pesanan publik berdasarkan nomor WhatsApp pemesan.
     *
     * Hanya butuh nomor WA (pelanggan melacak pesanannya sendiri) — tidak
     * membocorkan pesanan orang lain. Pencarian nama/tanggal yang lebih luas
     * disediakan di sisi kasir/admin.
     */
    public function lacak(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'telp' => ['required', 'string', 'max:30', 'regex:/^[0-9+\-\s()]{6,}$/'],
            ], [
                'telp.regex' => 'Nomor WhatsApp tidak valid.',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->validator->errors()->first(),
                'errors' => $e->errors(),
            ], 422);
        }

        // Cocokkan nomor SECARA PERSIS (bukan substring "9 digit terakhir") agar
        // tidak membocorkan pesanan nomor lain yang kebetulan berakhiran digit sama.
        // telp pesanan selalu tersimpan ternormalisasi (lihat PesananService::buat),
        // jadi normalisasi input cukup untuk pencocokan yang konsisten.
        $telp = PesananService::normalizeTelp($validated['telp']);

        $pesanans = Pesanan::with('items')
            ->where('telp', $telp)
            ->latest('created_at')
            ->limit(20)
            ->get()
            ->map(fn (Pesanan $p) => [
                'kode' => $p->kode,
                'status' => $p->status,
                'status_label' => $this->statusLabel($p->status),
                'total' => (int) $p->total,
                'nama_pelanggan' => $p->nama_pelanggan,
                'tanggal' => $p->created_at->translatedFormat('d M Y · H:i'),
                'items' => $p->items->map(fn (PesananItem $i) => [
                    'nama_produk' => $i->nama_produk,
                    'jumlah' => (int) $i->jumlah,
                    'subtotal' => (int) $i->subtotal,
                ])->values(),
            ]);

        return response()->json(['pesanans' => $pesanans]);
    }

    private function statusLabel(string $status): string
    {
        return match ($status) {
            'pending' => 'Menunggu diproses',
            'disiapkan' => 'Siap diambil',
            'selesai' => 'Selesai',
            'batal' => 'Dibatalkan',
            default => $status,
        };
    }

    /** Bangun tautan wa.me ke toko berisi ringkasan pesanan (pesan konfirmasi pelanggan). */
    private function waKonfirmasiUrl(Pesanan $pesanan): string
    {
        $pesanan->loadMissing('items');

        $baris = $pesanan->items
            ->map(fn (PesananItem $item, int $i) => ($i + 1).'. '.$item->nama_produk
                .' ('.$item->jumlah.'x) = Rp'.number_format($item->subtotal, 0, ',', '.'))
            ->implode("\n");

        $teks = "Halo Cemilan Mba Tutut! 👋\n"
            ."Saya sudah membuat pesanan *{$pesanan->kode}* lewat web:\n\n"
            ."{$baris}\n\n"
            .'*Total: Rp'.number_format($pesanan->total, 0, ',', '.')."*\n\n"
            ."Atas nama: {$pesanan->nama_pelanggan}\n"
            .'Mohon disiapkan ya, nanti saya ambil. Terima kasih! 🙏';

        return 'https://wa.me/'.self::WHATSAPP_TOKO.'?text='.rawurlencode($teks);
    }
}
