<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Kartu stok: mencatat SETIAP perubahan stok (jual, produksi, penyesuaian,
     * saldo awal) lengkap dengan stok sebelum/sesudah untuk audit & slow-mover.
     */
    public function up(): void
    {
        Schema::create('stok_mutasis', function (Blueprint $table) {
            $table->id('id_stok_mutasi');

            // nullOnDelete: riwayat mutasi tetap ada walau produk dihapus.
            $table->foreignId('id_produk')
                ->nullable()
                ->constrained('produks', 'id_produk')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            // jual | produksi | produksi_batal | penyesuaian | awal | masuk | keluar
            $table->string('tipe', 30);

            // delta bertanda: positif = stok bertambah, negatif = berkurang.
            $table->decimal('jumlah', 12, 3);
            $table->decimal('stok_sebelum', 12, 3);
            $table->decimal('stok_sesudah', 12, 3);

            $table->string('keterangan')->nullable();

            // Referensi sumber mutasi (mis. Transaksi/Produksi) — tanpa FK kaku.
            $table->string('ref_tipe', 50)->nullable();
            $table->unsignedBigInteger('id_referensi')->nullable();

            $table->foreignId('id_user')
                ->nullable()
                ->constrained('users', 'id')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->timestamps();

            $table->index(['id_produk', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stok_mutasis');
    }
};
