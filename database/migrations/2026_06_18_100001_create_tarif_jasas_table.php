<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Tarif fee bertingkat untuk produk jasa (transfer/tarik tunai). Tiap baris =
     * satu tingkat: fee yang berlaku mulai dari `min_nominal` (inclusive). Batas
     * atas tersirat dari baris berikutnya, jadi tidak ada celah/overlap. Tarif
     * berlaku = baris dengan `min_nominal` terbesar yang masih <= nominal transaksi.
     */
    public function up(): void
    {
        Schema::create('tarif_jasas', function (Blueprint $table) {
            $table->id('id_tarif_jasa');

            $table->foreignId('id_produk')
                ->constrained('produks', 'id_produk')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->unsignedBigInteger('min_nominal')->default(0); // batas bawah (inclusive)
            $table->unsignedInteger('fee')->default(0);            // biaya admin untuk tingkat ini
            $table->timestamps();

            $table->index(['id_produk', 'min_nominal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tarif_jasas');
    }
};
