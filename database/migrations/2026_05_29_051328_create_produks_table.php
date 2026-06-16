<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('produks', function (Blueprint $table) {
            $table->id('id_produk');

            $table
                ->foreignId('id_kategori')
                ->constrained('kategoris', 'id_kategori')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('nama');
            $table->string('foto')->nullable();

            $table->unsignedBigInteger('harga_jual');

            $table->integer('stok')->default(0);

            $table->string('barcode')->unique();
            $table->string('sku')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produks');
    }
};
