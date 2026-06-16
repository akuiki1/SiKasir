<?php

namespace Database\Seeders;

use App\Models\Kategori;
use App\Models\Produk;
use Illuminate\Database\Seeder;

class ProdukSeeder extends Seeder
{
    public function run(): void
    {
        $produkPerKategori = [
            'Makanan Ringan' => ['Chitato Sapi Panggang', 'Qtela Singkong', 'Taro Net', 'Cheetos Jagung', 'Lays Original'],
            'Minuman' => ['Aqua 600ml', 'Teh Botol Sosro', 'Pocari Sweat', 'Sprite 330ml', 'Milo Kotak'],
            'Sembako' => ['Beras Premium 5kg', 'Minyak Goreng 1L', 'Gula Pasir 1kg', 'Telur Ayam 1kg', 'Tepung Terigu 1kg'],
            'Kebersihan' => ['Sabun Cuci Piring', 'Detergen Rinso 1kg', 'Pembersih Lantai', 'Baygon Semprot', 'Wipol Disinfektan'],
            'Perawatan Tubuh' => ['Sabun Lifebuoy', 'Shampo Clear', 'Pasta Gigi Pepsodent', 'Deodoran Rexona', 'Lotion Citra'],
            'Bumbu Dapur' => ['Kecap Manis ABC', 'Saus Sambal Indofood', 'Royco Ayam', 'Masako Sapi', 'Terasi Cap Ikan'],
            'Produk Susu' => ['Susu UHT Indomilk', 'Yoghurt Cimory', 'Keju Kraft', 'Susu Kental Frisian', 'Es Krim Walls'],
            'Rokok & Tembakau' => ['Gudang Garam Filter', 'Sampoerna Hijau', 'Djarum Super', 'LA Bold', 'Surya 16'],
            'Alat Tulis' => ['Pulpen Pilot', 'Buku Tulis Sidu', 'Pensil 2B Staedtler', 'Penghapus Faber', 'Spidol Snowman'],
            'Frozen Food' => ['Sosis So Good', 'Nugget Fiesta', 'Bakso Kepala Sapi', 'Dimsum Cedea', 'Kentang Goreng McCain'],
        ];

        $hargaMap = [
            'Makanan Ringan' => [8000,  20000],
            'Minuman' => [3000,  25000],
            'Sembako' => [10000, 80000],
            'Kebersihan' => [5000,  50000],
            'Perawatan Tubuh' => [5000,  60000],
            'Bumbu Dapur' => [3000,  25000],
            'Produk Susu' => [5000,  55000],
            'Rokok & Tembakau' => [20000, 35000],
            'Alat Tulis' => [2000,  30000],
            'Frozen Food' => [15000, 65000],
        ];

        $skuIndex = 1;

        foreach ($produkPerKategori as $namaKategori => $produkList) {
            $kategori = Kategori::where('nama_kategori', $namaKategori)->first();

            [$hargaMin, $hargaMax] = $hargaMap[$namaKategori];

            foreach ($produkList as $namaProduk) {
                $hargaJual = rand($hargaMin / 1000, $hargaMax / 1000) * 1000;

                // Produk beli-jadi: modal = harga beli dari agen (~65-85% harga jual).
                $hargaModal = (int) (round(($hargaJual * rand(65, 85) / 100) / 500) * 500);

                Produk::create([
                    'id_kategori' => $kategori->id_kategori,
                    'jenis' => 'beli',
                    'nama' => $namaProduk,
                    'foto' => null,
                    'harga_jual' => $hargaJual,
                    'harga_modal' => $hargaModal,
                    'stok' => rand(20, 200),
                    'barcode' => str_pad($skuIndex, 13, '0', STR_PAD_LEFT),
                    'sku' => 'SKU-'.str_pad($skuIndex, 4, '0', STR_PAD_LEFT),
                ]);
                $skuIndex++;
            }
        }
    }
}
