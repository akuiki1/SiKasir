<?php

namespace Database\Factories;

use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaksi>
 */
class TransaksiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $totalHarga = fake()->numberBetween(10000, 500000);
        $bayar = $totalHarga + fake()->numberBetween(0, 50000);

        return [
            'id_user' => User::factory(),
            'total_harga' => $totalHarga,
            'metode_pembayaran' => fake()->randomElement(['cash', 'qris', 'transfer']),
            'bayar' => $bayar,
            'kembalian' => $bayar - $totalHarga,
        ];
    }
}
