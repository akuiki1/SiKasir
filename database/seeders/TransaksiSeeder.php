<?php

namespace Database\Seeders;

use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\Promo;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransaksiSeeder extends Seeder
{
    public function run(): void
    {
        $kasirs = User::where('role', 'kasir')->pluck('id')->toArray();
        $produks = Produk::all();
        $promos = Promo::all();
        $metodes = ['cash', 'qris', 'transfer'];

        $total = 1000;
        // Distribusi acak per kasir yang hasilnya pas 1000
        $distribusi = $this->distribusiAcak(count($kasirs), $total);

        $globalIndex = 0;

        foreach ($kasirs as $kasirIndex => $idUser) {
            $jumlahTransaksi = $distribusi[$kasirIndex];

            for ($i = 0; $i < $jumlahTransaksi; $i++) {
                // Pilih 1-5 produk acak
                $produkDipilih = $produks->random(rand(1, 5));

                // Hitung subtotal item
                $detailItems = [];
                $totalHarga = 0;

                foreach ($produkDipilih as $produk) {
                    $jumlah = rand(1, 5);
                    $harga = $produk->harga_jual;
                    $subtotal = $jumlah * $harga;

                    $detailItems[] = [
                        'id_produk' => $produk->id_produk,
                        'jumlah' => $jumlah,
                        'harga' => $harga,
                        'modal' => $produk->harga_modal, // snapshot HPP/unit untuk perhitungan laba
                        'subtotal' => $subtotal,
                    ];

                    $totalHarga += $subtotal;
                }

                // Promo acak (30% kemungkinan dapat promo)
                $promo = null;
                $diskon = 0;
                $idPromo = null;

                if ($promos->isNotEmpty() && rand(1, 10) <= 3) {
                    $promo = $promos->random();
                    $idPromo = $promo->id_promo;

                    if ($promo->minimal_belanja === null || $totalHarga >= $promo->minimal_belanja) {
                        if ($promo->tipe === 'persen') {
                            $diskon = (int) round($totalHarga * ($promo->nilai / 100));
                        } else {
                            $diskon = (int) $promo->nilai;
                        }
                        $diskon = min($diskon, $totalHarga);
                    } else {
                        $idPromo = null;
                    }
                }

                $totalBayar = $totalHarga - $diskon;
                $metode = $metodes[array_rand($metodes)];

                // Untuk cash, bayar dibulatkan ke atas
                if ($metode === 'cash') {
                    $bayar = ceil($totalBayar / 1000) * 1000 + (rand(0, 3) * 1000);
                    $kembalian = $bayar - $totalBayar;
                } else {
                    $bayar = $totalBayar;
                    $kembalian = 0;
                }

                $tanggal = now()->subDays(rand(0, 180))->subHours(rand(0, 23))->subMinutes(rand(0, 59));

                $transaksi = Transaksi::create([
                    'id_user' => $idUser,
                    'id_promo' => $idPromo,
                    'total_harga' => $totalHarga,
                    'diskon' => $diskon,
                    'metode_pembayaran' => $metode,
                    'bayar' => $bayar,
                    'kembalian' => $kembalian,
                    'created_at' => $tanggal,
                    'updated_at' => $tanggal,
                ]);

                foreach ($detailItems as $item) {
                    DetailTransaksi::create([
                        'id_transaksi' => $transaksi->id_transaksi,
                        'id_produk' => $item['id_produk'],
                        'jumlah' => $item['jumlah'],
                        'harga' => $item['harga'],
                        'modal' => $item['modal'],
                        'subtotal' => $item['subtotal'],
                        'created_at' => $tanggal,
                        'updated_at' => $tanggal,
                    ]);
                }

                $globalIndex++;
            }
        }
    }

    private function distribusiAcak(int $jumlahKasir, int $total): array
    {
        $hasil = array_fill(0, $jumlahKasir, 0);
        $sisa = $total;

        for ($i = 0; $i < $jumlahKasir - 1; $i++) {
            $max = $sisa - ($jumlahKasir - $i - 1);
            $nilai = rand(1, $max);
            $hasil[$i] = $nilai;
            $sisa -= $nilai;
        }

        $hasil[$jumlahKasir - 1] = $sisa;

        return $hasil;
    }
}
