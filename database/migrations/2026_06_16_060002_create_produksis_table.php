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
        Schema::create('produksis', function (Blueprint $table) {
            $table->id('id_produksi');

            $table->foreignId('id_produk')
                ->constrained('produks', 'id_produk')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->integer('jumlah'); // jumlah unit jadi yang dihasilkan batch ini
            $table->unsignedBigInteger('total_biaya')->default(0); // total biaya bahan yang dialokasikan
            $table->unsignedBigInteger('modal_per_unit')->default(0); // total_biaya / jumlah (snapshot)
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produksis');
    }
};
