<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            KategoriSeeder::class,
            ProdukSeeder::class,
            ProduksiSeeder::class,
            PromoSeeder::class,
            PengeluaranSeeder::class,
            TransaksiSeeder::class,
        ]);
    }
}
