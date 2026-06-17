<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * `nominal` = uang pokok yang ditransfer/ditarik pada baris JASA.
     * Ini PASS-THROUGH (titipan), BUKAN omzet. Omzet/laba tetap dari `subtotal`
     * (= fee/biaya admin). Untuk baris non-jasa, kolom ini null.
     */
    public function up(): void
    {
        Schema::table('detail_transaksis', function (Blueprint $table) {
            $table->unsignedBigInteger('nominal')->nullable()->after('subtotal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detail_transaksis', function (Blueprint $table) {
            $table->dropColumn('nominal');
        });
    }
};
