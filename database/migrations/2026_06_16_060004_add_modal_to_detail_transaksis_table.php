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
        Schema::table('detail_transaksis', function (Blueprint $table) {
            // Snapshot modal/HPP per unit saat barang terjual, agar laba historis
            // tidak ikut berubah ketika harga_modal produk diperbarui.
            $table->unsignedBigInteger('modal')->default(0)->after('harga');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detail_transaksis', function (Blueprint $table) {
            $table->dropColumn('modal');
        });
    }
};
