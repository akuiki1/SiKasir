<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesPerPage;
use App\Models\Pengeluaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class PengeluaranController extends Controller
{
    use ResolvesPerPage;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $startDate = $request->input('start_date') ?: Carbon::today()->toDateString();
        $endDate = $request->input('end_date') ?: Carbon::today()->toDateString();
        $search = trim((string) $request->query('search', ''));

        // Bandingkan datetime mentah (bukan whereDate) agar index created_at terpakai.
        $pengeluarans = Pengeluaran::where('created_at', '>=', Carbon::parse($startDate)->startOfDay())
            ->where('created_at', '<=', Carbon::parse($endDate)->endOfDay())
            ->when($search !== '', fn ($q) => $q->where(fn ($sub) => $sub
                ->where('judul', 'like', '%'.$search.'%')
                ->orWhere('tipe', 'like', '%'.$search.'%')))
            ->orderByDesc('created_at')
            ->paginate($this->resolvePerPage($request))
            ->withQueryString()
            ->through(fn (Pengeluaran $pengeluaran) => [
                'id_pengeluaran' => $pengeluaran->id_pengeluaran,
                'tipe' => $pengeluaran->tipe,
                'judul' => $pengeluaran->judul,
                'keterangan' => $pengeluaran->keterangan,
                'nominal' => $pengeluaran->nominal,
                'created_at' => $pengeluaran->created_at->toDateString(),
            ]);

        // Stats agregat atas rentang tanggal (tidak terpengaruh search) — sesuai perilaku lama.
        $statBase = Pengeluaran::where('created_at', '>=', Carbon::parse($startDate)->startOfDay())
            ->where('created_at', '<=', Carbon::parse($endDate)->endOfDay());

        return Inertia::render('admin/Pengeluarans', [
            'pengeluarans' => $pengeluarans,
            'stats' => [
                'total_pengeluaran' => (clone $statBase)->count(),
                'total_nominal' => (int) (clone $statBase)->sum('nominal'),
            ],
            'date_range' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'filters' => [
                'search' => $search,
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
