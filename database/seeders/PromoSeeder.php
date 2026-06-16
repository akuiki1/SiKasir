<?php

namespace Database\Seeders;

use App\Models\Produk;
use App\Models\Promo;
use Illuminate\Database\Seeder;

class PromoSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $promos = [
            [
                'nama'            => 'Diskon Akhir Pekan',
                'deskripsi'       => 'Diskon 10% untuk semua produk setiap akhir pekan',
                'tipe'            => 'persen',
                'nilai'           => 10,
                'id_produk'       => null,
                'minimal_belanja' => 50000,
                'tanggal_mulai'   => $now->copy()->subDays(10),
                'tanggal_selesai' => $now->copy()->addDays(20),
                'aktif'           => true,
            ],
            [
                'nama'            => 'Hemat Belanja 15rb',
                'deskripsi'       => 'Potongan Rp15.000 untuk belanja minimal Rp100.000',
                'tipe'            => 'nominal',
                'nilai'           => 15000,
                'id_produk'       => null,
                'minimal_belanja' => 100000,
                'tanggal_mulai'   => $now->copy()->subDays(5),
                'tanggal_selesai' => $now->copy()->addDays(30),
                'aktif'           => true,
            ],
            [
                'nama'            => 'Promo Produk Pilihan 20%',
                'deskripsi'       => 'Diskon 20% untuk produk tertentu',
                'tipe'            => 'persen',
                'nilai'           => 20,
                'id_produk'       => Produk::inRandomOrder()->first()?->id_produk,
                'minimal_belanja' => null,
                'tanggal_mulai'   => $now->copy()->subDays(3),
                'tanggal_selesai' => $now->copy()->addDays(7),
                'aktif'           => true,
            ],
            [
                'nama'            => 'Flash Sale Pagi',
                'deskripsi'       => 'Promo kilat setiap pagi hari',
                'tipe'            => 'persen',
                'nilai'           => 25,
                'id_produk'       => null,
                'minimal_belanja' => 75000,
                'tanggal_mulai'   => $now->copy()->subDays(15),
                'tanggal_selesai' => $now->copy()->subDays(2),
                'aktif'           => false,
            ],
            [
                'nama'            => 'Bonus Belanja 5rb',
                'deskripsi'       => 'Potongan Rp5.000 tanpa minimal belanja',
                'tipe'            => 'nominal',
                'nilai'           => 5000,
                'id_produk'       => null,
                'minimal_belanja' => null,
                'tanggal_mulai'   => $now->copy()->addDays(5),
                'tanggal_selesai' => $now->copy()->addDays(30),
                'aktif'           => true,
            ],
        ];

        foreach ($promos as $promo) {
            Promo::create($promo);
        }
    }
}
