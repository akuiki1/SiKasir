<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transaksis', function (Blueprint $table) {
            $table->foreignId('id_promo')
                ->nullable()
                ->after('id_user')
                ->constrained('promos', 'id_promo')
                ->nullOnDelete();

            $table->unsignedBigInteger('diskon')
                ->default(0)
                ->after('total_harga');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaksis', function (Blueprint $table) {
            $table->dropForeign(['id_promo']);
            $table->dropColumn(['id_promo', 'diskon']);
        });
    }
};
