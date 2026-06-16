<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Budi Santoso',
            'email' => 'admin@gmail.com',
            'role' => 'admin',
            'password' => Hash::make('admin123'),
        ]);

        $kasirs = [
            ['name' => 'Siti Rahayu',    'email' => 'siti@gmail.com'],
            ['name' => 'Agus Permana',   'email' => 'agus@gmail.com'],
            ['name' => 'Dewi Lestari',   'email' => 'dewi@gmail.com'],
        ];

        foreach ($kasirs as $kasir) {
            User::create([
                'name'     => $kasir['name'],
                'email'    => $kasir['email'],
                'role'     => 'kasir',
                'password' => Hash::make('kasir123'),
            ]);
        }
    }
}
