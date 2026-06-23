<?php

namespace App\Console\Commands;

use App\Models\Pesanan;
use App\Services\PesananService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Batalkan pesanan online yang ditelantarkan (masih pending/disiapkan melewati
 * batas hari) dan kembalikan stok yang sempat di-reserve. Dijadwalkan harian;
 * default 14 hari (2 minggu).
 */
class ExpirePesananCommand extends Command
{
    protected $signature = 'pesanan:expire {--days=14 : Umur maksimum pesanan aktif sebelum dibatalkan}';

    protected $description = 'Batalkan pesanan pending/disiapkan yang sudah lewat batas hari & kembalikan stok';

    public function handle(PesananService $service): int
    {
        $days = max(1, (int) $this->option('days'));
        $batas = Carbon::now()->subDays($days);

        $ids = Pesanan::whereIn('status', PesananService::STATUS_AKTIF)
            ->where('created_at', '<', $batas)
            ->pluck('id_pesanan');

        $jumlah = 0;

        foreach ($ids as $id) {
            DB::transaction(function () use ($id, $service, &$jumlah): void {
                $pesanan = Pesanan::with('items')->lockForUpdate()->find($id);

                if (! $pesanan || ! in_array($pesanan->status, PesananService::STATUS_AKTIF, true)) {
                    return;
                }

                $service->kembalikanStok($pesanan, null, 'Pesanan kedaluwarsa ('.$pesanan->kode.')');
                $pesanan->update(['status' => 'batal']);
                $jumlah++;
            });
        }

        $this->info("Pesanan kedaluwarsa dibatalkan: {$jumlah} (umur > {$days} hari).");

        return self::SUCCESS;
    }
}
