<?php

namespace Database\Factories;

use App\Models\Produksi;
use App\Models\ProduksiBiaya;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProduksiBiaya>
 */
class ProduksiBiayaFactory extends Factory
{
    protected $model = ProduksiBiaya::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id_produksi' => Produksi::factory(),
            'nama' => fake()->words(2, true),
            'nominal' => fake()->numberBetween(5000, 100000),
        ];
    }
}
