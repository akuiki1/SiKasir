<?php

namespace Database\Seeders;

use App\Models\Kategori;
use App\Models\Produk;
use App\Models\Produksi;
use App\Models\ProduksiBiaya;
use Illuminate\Database\Seeder;

class ProduksiSeeder extends Seeder
{
    public function run(): void
    {
        // Kategori khusus produk buatan sendiri (UMKM hybrid).
        $kategori = Kategori::firstOrCreate(['nama_kategori' => 'Olahan Rumahan']);

        // Setiap produk 'produksi': harga jual + daftar batch produksi.
        // Tiap batch berisi rincian biaya bahan yang DIALOKASIKAN ke batch
        // (bukan total pembelian), persis seperti input di modul Produksi.
        $produkList = [
            [
                'nama' => 'Sambal Botol Pedas',
                'harga_jual' => 18000,
                'batches' => [
                    ['jumlah' => 100, 'biayas' => [
                        ['nama' => 'Cabai rawit ~3kg', 'nominal' => 150000],
                        ['nama' => 'Bawang merah & putih', 'nominal' => 60000],
                        ['nama' => 'Minyak & garam', 'nominal' => 40000],
                        ['nama' => 'Botol kaca 100 pcs', 'nominal' => 120000],
                        ['nama' => 'Gas LPG (estimasi)', 'nominal' => 30000],
                    ]],
                    ['jumlah' => 120, 'biayas' => [
                        ['nama' => 'Cabai rawit ~3.5kg', 'nominal' => 175000],
                        ['nama' => 'Bawang merah & putih', 'nominal' => 65000],
                        ['nama' => 'Minyak & garam', 'nominal' => 45000],
                        ['nama' => 'Botol kaca 120 pcs', 'nominal' => 144000],
                        ['nama' => 'Gas LPG (estimasi)', 'nominal' => 30000],
                    ]],
                ],
            ],
            [
                'nama' => 'Keripik Pisang Original',
                'harga_jual' => 12000,
                'batches' => [
                    ['jumlah' => 80, 'biayas' => [
                        ['nama' => 'Pisang kepok ~10kg', 'nominal' => 90000],
                        ['nama' => 'Minyak goreng', 'nominal' => 60000],
                        ['nama' => 'Bumbu & garam', 'nominal' => 20000],
                        ['nama' => 'Kemasan standing pouch 80', 'nominal' => 56000],
                    ]],
                ],
            ],
            [
                'nama' => 'Kue Kering Nastar (Toples)',
                'harga_jual' => 65000,
                'batches' => [
                    ['jumlah' => 40, 'biayas' => [
                        ['nama' => 'Tepung terigu & maizena', 'nominal' => 120000],
                        ['nama' => 'Mentega & margarin', 'nominal' => 180000],
                        ['nama' => 'Telur', 'nominal' => 50000],
                        ['nama' => 'Selai nanas', 'nominal' => 90000],
                        ['nama' => 'Toples 40 pcs', 'nominal' => 160000],
                    ]],
                    ['jumlah' => 50, 'biayas' => [
                        ['nama' => 'Tepung terigu & maizena', 'nominal' => 150000],
                        ['nama' => 'Mentega & margarin', 'nominal' => 220000],
                        ['nama' => 'Telur', 'nominal' => 60000],
                        ['nama' => 'Selai nanas', 'nominal' => 110000],
                        ['nama' => 'Toples 50 pcs', 'nominal' => 200000],
                    ]],
                ],
            ],
            [
                'nama' => 'Risol Mayo Frozen (isi 10)',
                'harga_jual' => 25000,
                'batches' => [
                    ['jumlah' => 60, 'biayas' => [
                        ['nama' => 'Kulit & tepung', 'nominal' => 90000],
                        ['nama' => 'Mayo, sosis, telur', 'nominal' => 240000],
                        ['nama' => 'Tepung panir', 'nominal' => 40000],
                        ['nama' => 'Kemasan mika 60 pcs', 'nominal' => 48000],
                    ]],
                ],
            ],
            [
                'nama' => 'Es Cincau Santan (Cup)',
                'harga_jual' => 8000,
                'batches' => [
                    ['jumlah' => 150, 'biayas' => [
                        ['nama' => 'Cincau hitam', 'nominal' => 75000],
                        ['nama' => 'Gula merah & santan', 'nominal' => 90000],
                        ['nama' => 'Cup + tutup + sedotan 150', 'nominal' => 105000],
                        ['nama' => 'Es batu', 'nominal' => 20000],
                    ]],
                ],
            ],
        ];

        $skuIndex = 1;

        foreach ($produkList as $data) {
            $produk = Produk::create([
                'id_kategori' => $kategori->id_kategori,
                'jenis' => 'produksi',
                'nama' => $data['nama'],
                'foto' => null,
                'harga_jual' => $data['harga_jual'],
                'harga_modal' => 0, // akan diisi otomatis oleh batch produksi
                'stok' => 0,
                'barcode' => str_pad((string) (9000 + $skuIndex), 13, '0', STR_PAD_LEFT),
                'sku' => 'SKU-P'.str_pad((string) $skuIndex, 3, '0', STR_PAD_LEFT),
            ]);

            $batchCount = count($data['batches']);

            foreach ($data['batches'] as $i => $batch) {
                // Sebar tanggal batch dalam ~60 hari terakhir (batch lama -> baru).
                $tanggal = now()->subDays(($batchCount - $i) * 20 + rand(0, 5));

                $totalBiaya = array_sum(array_column($batch['biayas'], 'nominal'));
                $modalPerUnit = (int) round($totalBiaya / $batch['jumlah']);

                $produksi = Produksi::create([
                    'id_produk' => $produk->id_produk,
                    'jumlah' => $batch['jumlah'],
                    'total_biaya' => $totalBiaya,
                    'modal_per_unit' => $modalPerUnit,
                    'catatan' => 'Batch awal hasil seeding.',
                    'created_at' => $tanggal,
                    'updated_at' => $tanggal,
                ]);

                foreach ($batch['biayas'] as $biaya) {
                    ProduksiBiaya::create([
                        'id_produksi' => $produksi->id_produksi,
                        'nama' => $biaya['nama'],
                        'nominal' => $biaya['nominal'],
                        'created_at' => $tanggal,
                        'updated_at' => $tanggal,
                    ]);
                }

                // Produksi menambah stok & memperbarui modal ke batch terbaru.
                $produk->increment('stok', $batch['jumlah']);
                $produk->update(['harga_modal' => $modalPerUnit]);
            }

            $skuIndex++;
        }
    }
}
