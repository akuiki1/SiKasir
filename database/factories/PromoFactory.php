<?php

namespace Database\Factories;

use App\Models\Promo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Promo>
 */
class PromoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tipe = fake()->randomElement(['persen', 'nominal']);
        $nilai = $tipe === 'persen' ? fake()->numberBetween(5, 50) : fake()->numberBetween(5000, 50000);

        return [
            'nama' => fake()->words(2, true).' Promo',
            'deskripsi' => fake()->sentence(),
            'tipe' => $tipe,
            'nilai' => $nilai,
            'id_produk' => null,
            'minimal_belanja' => fake()->numberBetween(10000, 100000),
            'tanggal_mulai' => now()->subDays(fake()->numberBetween(1, 5)),
            'tanggal_selesai' => now()->addDays(fake()->numberBetween(5, 15)),
            'aktif' => true,
        ];
    }
}
