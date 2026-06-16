<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('produks', function (Blueprint $table) {
            // 'beli'      = barang jadi dari agen (modal = harga beli)
            // 'produksi'  = dibuat sendiri (modal dihitung dari batch produksi)
            $table->enum('jenis', ['beli', 'produksi'])->default('beli')->after('id_kategori');

            // Modal/HPP per unit. Untuk 'beli' diisi manual; untuk 'produksi'
            // diisi otomatis dari batch produksi terbaru.
            $table->unsignedBigInteger('harga_modal')->default(0)->after('harga_jual');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produks', function (Blueprint $table) {
            $table->dropColumn(['jenis', 'harga_modal']);
        });
    }
};
