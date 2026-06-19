<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    public function keuangan(): Response
    {
        return Inertia::render('admin/laporan/Keuangan');
    }

    public function penjualan(): Response
    {
        return Inertia::render('admin/laporan/Penjualan');
    }

    public function pelanggan(): Response
    {
        return Inertia::render('admin/laporan/Pelanggan');
    }
}
