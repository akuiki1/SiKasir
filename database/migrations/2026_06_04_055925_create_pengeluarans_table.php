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
        Schema::create('pengeluarans', function (Blueprint $table) {
            $table->id('id_pengeluaran');
            $table->enum('tipe', [
                'bahan_baku',
                'kemasan',
                'operasional',
                'transportasi',
                'gaji',
                'peralatan',
                'sewa',
                'listrik_air',
                'promosi',
                'pajak',
                'lainnya',
            ]);
            $table->string('judul');
            $table->text('keterangan')->nullable();
            $table->unsignedBigInteger('nominal');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengeluarans');
    }
};
