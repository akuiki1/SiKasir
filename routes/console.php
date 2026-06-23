<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Auto-expire pesanan online yang ditelantarkan (>2 minggu) → batal + stok kembali.
Schedule::command('pesanan:expire')->dailyAt('02:00');
