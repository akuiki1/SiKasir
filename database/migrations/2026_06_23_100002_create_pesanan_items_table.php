<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Baris item pesanan online. Harga & nama di-snapshot saat pesan agar total
     * pesanan stabil; harga sudah memperhitungkan potongan reseller bila berlaku.
     */
    public function up(): void
    {
        Schema::create('pesanan_items', function (Blueprint $table) {
            $table->id('id_pesanan_item');

            $table->foreignId('id_pesanan')
                ->constrained('pesanans', 'id_pesanan')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('id_produk')
                ->constrained('produks', 'id_produk')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('nama_produk');
            $table->unsignedBigInteger('harga'); // harga satuan efektif (sudah reseller-adjusted)
            $table->integer('jumlah');
            $table->unsignedBigInteger('subtotal');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanan_items');
    }
};
