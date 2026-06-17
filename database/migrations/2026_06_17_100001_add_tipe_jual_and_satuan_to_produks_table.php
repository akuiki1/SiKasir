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
            // Cara jual (tegak lurus dengan `jenis` yang mengatur sumber modal):
            //  satuan = dihitung per biji (cemilan, permen)
            //  curah  = dijual per takaran/desimal (bensin /liter, bawang /kg)
            //  jasa   = layanan tanpa stok (tarik tunai, transfer) — omzet = fee
            $table->enum('tipe_jual', ['satuan', 'curah', 'jasa'])
                ->default('satuan')
                ->after('jenis');

            // Satuan tampilan/ukur: pcs, bungkus, liter, kg, gram, dst.
            $table->string('satuan', 20)->default('pcs')->after('tipe_jual');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produks', function (Blueprint $table) {
            $table->dropColumn(['tipe_jual', 'satuan']);
        });
    }
};
