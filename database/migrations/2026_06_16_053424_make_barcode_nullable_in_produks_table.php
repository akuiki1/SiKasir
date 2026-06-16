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
        Schema::table('produks', function (Blueprint $table) {
            $table->string('barcode')->nullable()->change();
            $table->string('sku')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('produks', function (Blueprint $table) {
            $table->string('barcode')->nullable(false)->change();
            $table->string('sku')->nullable(false)->change();
        });
    }
};
