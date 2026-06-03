<?php

namespace Database\Factories;

use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\Transaksi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DetailTransaksi>
 */
class DetailTransaksiFactory extends Factory
{
    protected $model = DetailTransaksi::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jumlah = fake()->numberBetween(1, 5);
        $harga = fake()->numberBetween(5000, 50000);

        return [
            'id_transaksi' => Transaksi::factory(),
            'id_produk' => Produk::factory(),
            'jumlah' => $jumlah,
            'harga' => $harga,
            'subtotal' => $harga * $jumlah,
        ];
    }
}
