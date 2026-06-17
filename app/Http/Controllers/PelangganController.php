<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PelangganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $pelanggans = Pelanggan::withCount('transaksis')
            ->orderBy('nama')
            ->get()
            ->map(fn (Pelanggan $pelanggan) => [
                'id_pelanggan' => $pelanggan->id_pelanggan,
                'nama' => $pelanggan->nama,
                'telp' => $pelanggan->telp,
                'tipe' => $pelanggan->tipe,
                'transaksis_count' => $pelanggan->transaksis_count,
            ]);

        return Inertia::render('admin/Pelanggan', [
            'pelanggans' => $pelanggans,
            'stats' => [
                'total_pelanggan' => $pelanggans->count(),
                'total_reseller' => $pelanggans->where('tipe', 'reseller')->count(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'telp' => ['nullable', 'string', 'max:30'],
            'tipe' => ['required', Rule::in(['umum', 'reseller'])],
        ]);

        Pelanggan::create($validated);

        return redirect()->route('admin.pelanggan')->with('success', 'Pelanggan berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pelanggan $pelanggan): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'telp' => ['nullable', 'string', 'max:30'],
            'tipe' => ['required', Rule::in(['umum', 'reseller'])],
        ]);

        $pelanggan->update($validated);

        return redirect()->route('admin.pelanggan')->with('success', 'Pelanggan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pelanggan $pelanggan): RedirectResponse
    {
        $pelanggan->delete();

        return redirect()->route('admin.pelanggan')->with('success', 'Pelanggan berhasil dihapus.');
    }
}
