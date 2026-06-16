<?php

namespace Database\Seeders;

use App\Models\Kategori;
use Illuminate\Database\Seeder;

class KategoriSeeder extends Seeder
{
    public function run(): void
    {
        $kategoris = [
            'Makanan Ringan',
            'Minuman',
            'Sembako',
            'Kebersihan',
            'Perawatan Tubuh',
            'Bumbu Dapur',
            'Produk Susu',
            'Rokok & Tembakau',
            'Alat Tulis',
            'Frozen Food',
        ];

        foreach ($kategoris as $nama) {
            Kategori::create(['nama_kategori' => $nama]);
        }
    }
}
