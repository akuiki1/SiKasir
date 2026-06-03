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
        Schema::table('transaksis', function (Blueprint $table) {
            $table->dropForeign(['id_user']);
            $table->unsignedBigInteger('id_user')->nullable()->change();
            $table->foreign('id_user')
                ->references('id')
                ->on('users')
                ->cascadeOnUpdate()
                ->nullOnDelete();
        });

        Schema::table('produks', function (Blueprint $table) {
            $table->dropForeign(['id_kategori']);
            $table->unsignedBigInteger('id_kategori')->nullable()->change();
            $table->foreign('id_kategori')
                ->references('id_kategori')
                ->on('kategoris')
                ->cascadeOnUpdate()
                ->nullOnDelete();
        });

        Schema::table('detail_transaksis', function (Blueprint $table) {
            $table->dropForeign(['id_produk']);
            $table->unsignedBigInteger('id_produk')->nullable()->change();
            $table->foreign('id_produk')
                ->references('id_produk')
                ->on('produks')
                ->cascadeOnUpdate()
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detail_transaksis', function (Blueprint $table) {
            $table->dropForeign(['id_produk']);
            $table->unsignedBigInteger('id_produk')->nullable(false)->change();
            $table->foreign('id_produk')
                ->references('id_produk')
                ->on('produks')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });

        Schema::table('produks', function (Blueprint $table) {
            $table->dropForeign(['id_kategori']);
            $table->unsignedBigInteger('id_kategori')->nullable(false)->change();
            $table->foreign('id_kategori')
                ->references('id_kategori')
                ->on('kategoris')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });

        Schema::table('transaksis', function (Blueprint $table) {
            $table->dropForeign(['id_user']);
            $table->unsignedBigInteger('id_user')->nullable(false)->change();
            $table->foreign('id_user')
                ->references('id')
                ->on('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }
};
