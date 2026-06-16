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
        Schema::create('produksi_biayas', function (Blueprint $table) {
            $table->id('id_produksi_biaya');

            $table->foreignId('id_produksi')
                ->constrained('produksis', 'id_produksi')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->string('nama'); // contoh: "Kemasan 100 lembar", "Bawang merah ~2kg"
            $table->unsignedBigInteger('nominal');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produksi_biayas');
    }
};
