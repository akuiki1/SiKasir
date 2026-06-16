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
        return [
            'id_kategori' => Kategori::factory(),
            'nama' => fake()->words(3, true),
            'foto' => null,
            'harga_jual' => fake()->numberBetween(10000, 100000),
            'stok' => fake()->numberBetween(0, 100),
            'barcode' => fake()->unique()->ean13(),
            'sku' => fake()->unique()->bothify('SKU-####-??'),
        ];
    }
}
