<?php

namespace App\Http\Controllers;

use App\Models\Pengeluaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengeluaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $pengeluarans = Pengeluaran::orderByDesc('created_at')
            ->get()
            ->map(function (Pengeluaran $pengeluaran) {
                return [
                    'id_pengeluaran' => $pengeluaran->id_pengeluaran,
                    'tipe' => $pengeluaran->tipe,
                    'judul' => $pengeluaran->judul,
                    'keterangan' => $pengeluaran->keterangan,
                    'nominal' => $pengeluaran->nominal,
                    'created_at' => $pengeluaran->created_at->toDateString(),
                ];
            });

        return Inertia::render('admin/Pengeluarans', [
            'pengeluarans' => $pengeluarans,
            'stats' => [
                'total_pengeluaran' => $pengeluarans->count(),
                'total_nominal' => $pengeluarans->sum('nominal'),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tipe' => ['required', 'in:bahan_baku,kemasan,operasional,transportasi,gaji,peralatan,sewa,listrik_air,promosi,pajak,lainnya'],
            'judul' => ['required', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string'],
            'nominal' => ['required', 'integer', 'min:0'],
        ]);

        Pengeluaran::create($validated);

        return redirect()->route('admin.pengeluarans')->with('success', 'Pengeluaran berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pengeluaran $pengeluaran): RedirectResponse
    {
        $validated = $request->validate([
            'tipe' => ['required', 'in:bahan_baku,kemasan,operasional,transportasi,gaji,peralatan,sewa,listrik_air,promosi,pajak,lainnya'],
            'judul' => ['required', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string'],
            'nominal' => ['required', 'integer', 'min:0'],
        ]);

        $pengeluaran->update($validated);

        return redirect()->route('admin.pengeluarans')->with('success', 'Pengeluaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pengeluaran $pengeluaran): RedirectResponse
    {
        $pengeluaran->delete();

        return redirect()->route('admin.pengeluarans')->with('success', 'Pengeluaran berhasil dihapus.');
    }
}
