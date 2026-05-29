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
        Schema::create('detail_transaksis', function (Blueprint $table) {
           $table->id('id_detail_transaksi');

            $table->foreignId('id_transaksi')
                ->constrained('transaksis', 'id_transaksi')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->foreignId('id_produk')
                ->constrained('produks', 'id_produk')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->integer('jumlah');
            $table->unsignedBigInteger('harga');

            $table->unsignedBigInteger('subtotal');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_transaksis');
    }
};
