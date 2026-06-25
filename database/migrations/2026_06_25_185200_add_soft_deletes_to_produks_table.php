<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Soft delete untuk produk → "Arsipkan", bukan hapus permanen.
 *
 * Produk yang sudah punya riwayat (produksi/pesanan/transaksi) tidak bisa
 * dihapus permanen karena foreign key. Dengan soft delete, "Hapus" jadi
 * "Arsipkan": produk hilang dari katalog/kasir/stok/laporan tapi riwayatnya
 * tetap utuh dan bisa dipulihkan.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produks', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('produks', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
