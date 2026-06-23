<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Pesanan online (pending): pelanggan memesan dari web, stok langsung
     * di-reserve, lalu kasir tinggal memproses pembayaran saat barang diambil.
     */
    public function up(): void
    {
        Schema::create('pesanans', function (Blueprint $table) {
            $table->id('id_pesanan');

            // Pelanggan terdaftar (dicocokkan via nomor WA). Null = umum / tak terdaftar.
            $table->foreignId('id_pelanggan')
                ->nullable()
                ->constrained('pelanggans', 'id_pelanggan')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            // Snapshot identitas pemesan (selalu ada walau bukan pelanggan terdaftar).
            $table->string('nama_pelanggan');
            $table->string('telp', 30);
            $table->enum('tipe_pelanggan', ['umum', 'reseller'])->default('umum');

            $table->enum('status', ['pending', 'disiapkan', 'selesai', 'batal'])
                ->default('pending');

            $table->unsignedBigInteger('total')->default(0);
            $table->text('catatan')->nullable();
            $table->string('sumber', 30)->default('web');

            // Diisi saat kasir memproses pembayaran (pesanan → transaksi nyata).
            $table->foreignId('id_transaksi')
                ->nullable()
                ->constrained('transaksis', 'id_transaksi')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->timestamp('disiapkan_at')->nullable();
            $table->timestamp('selesai_at')->nullable();

            $table->timestamps();

            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanans');
    }
};
