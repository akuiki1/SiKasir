<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah jenis promo "bundling" (beli X gratis Y) tanpa mengganggu data lama.
     * Bersifat additive: kolom baru nullable + perluas nilai 'tipe'. Promo 'persen'
     * & 'nominal' yang sudah ada tetap valid.
     */
    public function up(): void
    {
        Schema::table('promos', function (Blueprint $table) {
            // Konfig bundling. Null untuk promo non-bundling (persen/nominal).
            $table->unsignedInteger('beli_qty')->nullable()->after('nilai');
            $table->unsignedInteger('gratis_qty')->nullable()->after('beli_qty');
        });

        $driver = DB::getDriverName();

        if ($driver === 'mysql' || $driver === 'mariadb') {
            // Surgical di MySQL: cukup menambah nilai enum, tipe kolom tetap ENUM.
            DB::statement("ALTER TABLE promos MODIFY tipe ENUM('persen', 'nominal', 'bundling') NOT NULL");
        } else {
            // SQLite (test): enum = CHECK constraint. Ubah ke string agar 'bundling' diterima.
            Schema::table('promos', function (Blueprint $table) {
                $table->string('tipe')->change();
            });
        }
    }

    public function down(): void
    {
        Schema::table('promos', function (Blueprint $table) {
            $table->dropColumn(['beli_qty', 'gratis_qty']);
        });

        $driver = DB::getDriverName();

        if ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement("ALTER TABLE promos MODIFY tipe ENUM('persen', 'nominal') NOT NULL");
        } else {
            Schema::table('promos', function (Blueprint $table) {
                $table->string('tipe')->change();
            });
        }
    }
};
