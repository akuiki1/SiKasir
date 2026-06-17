<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Pelanggan terdaftar — terutama untuk reseller agar pendaftaran resmi
     * (ganti "ka aku mau jadi reseller ya"). Tipe menentukan harga di kasir.
     */
    public function up(): void
    {
        Schema::create('pelanggans', function (Blueprint $table) {
            $table->id('id_pelanggan');
            $table->string('nama');
            $table->string('telp', 30)->nullable();
            $table->enum('tipe', ['umum', 'reseller'])->default('umum');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelanggans');
    }
};
