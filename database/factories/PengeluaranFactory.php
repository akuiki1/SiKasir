<?php

namespace Database\Factories;

use App\Models\Pengeluaran;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pengeluaran>
 */
class PengeluaranFactory extends Factory
{
    protected $model = Pengeluaran::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tipe' => $this->faker->randomElement([
                'bahan_baku',
                'kemasan',
                'operasional',
                'transportasi',
                'gaji',
                'peralatan',
                'sewa',
                'listrik_air',
                'promosi',
                'pajak',
                'lainnya',
            ]),
            'judul' => $this->faker->sentence(3),
            'keterangan' => $this->faker->optional()->sentence(6),
            'nominal' => $this->faker->numberBetween(10000, 500000),
        ];
    }
}
