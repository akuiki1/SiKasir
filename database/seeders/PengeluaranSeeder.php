<?php

namespace Database\Seeders;

use App\Models\Pengeluaran;
use Illuminate\Database\Seeder;

class PengeluaranSeeder extends Seeder
{
    public function run(): void
    {
        $tipeData = [
            'bahan_baku'   => ['Pembelian Tepung Terigu', 'Beli Gula Pasir Curah', 'Pembelian Minyak Goreng Bulk', 'Stok Beras 50kg'],
            'kemasan'      => ['Plastik Kresek', 'Kardus Packaging', 'Stiker Label Produk', 'Bubble Wrap Pengiriman'],
            'operasional'  => ['Biaya Internet Kantor', 'Perbaikan Printer', 'Pembelian Tinta Kasir', 'Servis AC'],
            'transportasi' => ['Bensin Pengiriman', 'Ongkos Angkut Barang', 'Biaya Parkir Bulanan', 'Servis Kendaraan'],
            'gaji'         => ['Gaji Kasir Bulan Ini', 'THR Karyawan', 'Bonus Kinerja', 'Uang Lembur'],
            'peralatan'    => ['Beli Timbangan Digital', 'Mesin Kasir Baru', 'Rak Display', 'Kursi Kasir'],
            'sewa'         => ['Sewa Tempat Bulanan', 'Sewa Gudang', 'Sewa Kontainer', 'Perpanjangan Kontrak Sewa'],
            'listrik_air'  => ['Tagihan Listrik', 'Tagihan Air PDAM', 'Token Listrik', 'Biaya Listrik Lembur'],
            'promosi'      => ['Cetak Banner', 'Iklan Media Sosial', 'Brosur Promosi', 'Hadiah Undian'],
            'pajak'        => ['PPN Bulanan', 'Pajak Penghasilan', 'Retribusi Daerah', 'Biaya Perizinan'],
            'lainnya'      => ['Biaya ATK Kantor', 'Sumbangan Sosial', 'Biaya Kebersihan', 'Kebutuhan Lain-lain'],
        ];

        $nominalMap = [
            'bahan_baku'   => [200000, 2000000],
            'kemasan'      => [50000,  500000],
            'operasional'  => [100000, 1000000],
            'transportasi' => [50000,  500000],
            'gaji'         => [1500000, 5000000],
            'peralatan'    => [200000, 3000000],
            'sewa'         => [1000000, 8000000],
            'listrik_air'  => [200000, 1500000],
            'promosi'      => [100000, 2000000],
            'pajak'        => [300000, 3000000],
            'lainnya'      => [50000,  500000],
        ];

        $entries = [];

        for ($i = 0; $i < 80; $i++) {
            $tipe = array_rand($tipeData);
            $judulList = $tipeData[$tipe];
            [$min, $max] = $nominalMap[$tipe];

            $entries[] = [
                'tipe'       => $tipe,
                'judul'      => $judulList[array_rand($judulList)],
                'keterangan' => rand(0, 1) ? 'Pengeluaran rutin ' . now()->subDays(rand(0, 90))->format('F Y') : null,
                'nominal'    => rand($min / 1000, $max / 1000) * 1000,
                'created_at' => now()->subDays(rand(0, 180))->subHours(rand(0, 23)),
                'updated_at' => now(),
            ];
        }

        foreach ($entries as $entry) {
            Pengeluaran::create($entry);
        }
    }
}
