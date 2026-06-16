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
        Schema::table('produks', function (Blueprint $table): void {
            $table->dropColumn('harga_beli');
        });
    }

    public function down(): void
    {
        Schema::table('produks', function (Blueprint $table): void {
            $table->unsignedBigInteger('harga_beli')->default(0)->after('foto');
        });
    }
};
