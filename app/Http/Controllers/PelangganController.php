<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesPerPage;
use App\Models\Pelanggan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PelangganController extends Controller
{
    use ResolvesPerPage;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $tipe = $request->query('tipe', '');
        $tipe = in_array($tipe, ['umum', 'reseller'], true) ? $tipe : '';

        $pelanggans = Pelanggan::withCount('transaksis')
            ->when($search !== '', fn ($query) => $query->where(fn ($sub) => $sub
                ->where('nama', 'like', '%'.$search.'%')
                ->orWhere('telp', 'like', '%'.$search.'%')))
            ->when($tipe !== '', fn ($query) => $query->where('tipe', $tipe))
            ->orderBy('nama')
            ->paginate($this->resolvePerPage($request))
            ->withQueryString()
            ->through(fn (Pelanggan $pelanggan) => [
                'id_pelanggan' => $pelanggan->id_pelanggan,
                'nama' => $pelanggan->nama,
                'telp' => $pelanggan->telp,
                'tipe' => $pelanggan->tipe,
                'transaksis_count' => $pelanggan->transaksis_count,
            ]);

        return Inertia::render('admin/Pelanggan', [
            'pelanggans' => $pelanggans,
            'stats' => [
                // Agregat lintas halaman — bukan dari data halaman aktif.
                'total_pelanggan' => Pelanggan::count(),
                'total_reseller' => Pelanggan::where('tipe', 'reseller')->count(),
            ],
            'filters' => [
                'search' => $search,
                'tipe' => $tipe,
                'per_page' => $this->resolvePerPage($request),
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
