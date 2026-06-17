<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Produk curah (bensin/liter, bawang/kg) butuh stok & jumlah pecahan.
     * Rupiah (harga/modal/subtotal) tetap integer — hanya kuantitas yang desimal.
     */
    public function up(): void
    {
        Schema::table('produks', function (Blueprint $table) {
            $table->decimal('stok', 12, 3)->default(0)->change();
        });

        Schema::table('detail_transaksis', function (Blueprint $table) {
            $table->decimal('jumlah', 12, 3)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produks', function (Blueprint $table) {
            $table->integer('stok')->default(0)->change();
        });

        Schema::table('detail_transaksis', function (Blueprint $table) {
            $table->integer('jumlah')->change();
        });
    }
};
