<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Index pendukung pencarian/sort/filter yang kini server-side.
     *
     * Kolom FK sudah otomatis terindeks oleh InnoDB; yang ditambah di sini
     * adalah kolom non-FK yang rutin difilter (rentang tanggal) atau diurutkan
     * setelah pagination dipindah ke server. Lihat juga perbaikan whereDate()
     * di TransaksiController/PengeluaranController/PesananController/KasirController
     * agar index created_at benar-benar terpakai (DATE() membungkus kolom = full scan).
     */
    public function up(): void
    {
        Schema::table('transaksis', function (Blueprint $table) {
            // Laporan & dashboard memfilter rentang created_at lintas semua kasir.
            $table->index('created_at');
            // Dashboard & riwayat kasir: per-kasir + rentang tanggal.
            $table->index(['id_user', 'created_at']);
        });

        Schema::table('pengeluarans', function (Blueprint $table) {
            $table->index('created_at');
        });

        Schema::table('produks', function (Blueprint $table) {
            // orderBy('nama') dipakai di hampir semua daftar produk.
            $table->index('nama');
        });

        Schema::table('pesanans', function (Blueprint $table) {
            // Endpoint publik lacak pesanan mencocokkan telp secara persis.
            $table->index('telp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaksis', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropIndex(['id_user', 'created_at']);
        });

        Schema::table('pengeluarans', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
        });

        Schema::table('produks', function (Blueprint $table) {
            $table->dropIndex(['nama']);
        });

        Schema::table('pesanans', function (Blueprint $table) {
            $table->dropIndex(['telp']);
        });
    }
};
