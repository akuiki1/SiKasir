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
        Schema::create('promos', function (Blueprint $table) {
            $table->id('id_promo');

            $table->string('nama');
            $table->text('deskripsi')->nullable();

            $table->enum('tipe', [
                'persen',
                'nominal',
            ]);

            $table->decimal('nilai', 12, 2);

            $table
                ->foreignId('id_produk')
                ->nullable()
                ->constrained('produks', 'id_produk')
                ->nullOnDelete();

            $table
                ->decimal('minimal_belanja', 12, 2)
                ->nullable();

            $table->dateTime('tanggal_mulai');
            $table->dateTime('tanggal_selesai');

            $table
                ->boolean('aktif')
                ->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promos');
    }
};
