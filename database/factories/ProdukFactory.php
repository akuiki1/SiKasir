<?php

namespace Database\Factories;

use App\Models\Kategori;
use App\Models\Produk;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Produk>
 */
class ProdukFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $hargaJual = fake()->numberBetween(10000, 100000);

        return [
            'id_kategori' => Kategori::factory(),
            'jenis' => 'beli',
            'nama' => fake()->words(3, true),
            'foto' => null,
            'harga_jual' => $hargaJual,
            'harga_modal' => (int) round($hargaJual * fake()->randomFloat(2, 0.4, 0.8)),
            'stok' => fake()->numberBetween(0, 100),
            'barcode' => fake()->unique()->ean13(),
            'sku' => fake()->unique()->bothify('SKU-####-??'),
        ];
    }
}
