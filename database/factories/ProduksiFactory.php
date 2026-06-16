<?php

namespace Database\Factories;

use App\Models\Produk;
use App\Models\Produksi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Produksi>
 */
class ProduksiFactory extends Factory
{
    protected $model = Produksi::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jumlah = fake()->numberBetween(10, 200);
        $totalBiaya = fake()->numberBetween(50000, 500000);

        return [
            'id_produk' => Produk::factory()->state(['jenis' => 'produksi']),
            'jumlah' => $jumlah,
            'total_biaya' => $totalBiaya,
            'modal_per_unit' => (int) round($totalBiaya / $jumlah),
            'catatan' => null,
        ];
    }
}
