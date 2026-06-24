<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\ResolvesPerPage;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    use ResolvesPerPage;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $role = $request->query('role', '');
        $role = in_array($role, ['admin', 'kasir'], true) ? $role : '';

        $users = User::when($search !== '', fn ($q) => $q->where(fn ($sub) => $sub
                ->where('name', 'like', '%'.$search.'%')
                ->orWhere('email', 'like', '%'.$search.'%')))
            ->when($role !== '', fn ($q) => $q->where('role', $role))
            ->orderBy('name')
            ->paginate($this->resolvePerPage($request))
            ->withQueryString()
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
            ]);

        return Inertia::render('admin/Users', [
            'users' => $users,
            'stats' => [
                // Agregat lintas halaman — bukan dari data halaman aktif.
                'total_users' => User::count(),
                'total_admin' => User::where('role', 'admin')->count(),
                'total_kasir' => User::where('role', 'kasir')->count(),
            ],
            'filters' => [
                'search' => $search,
                'role' => $role,
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', Rule::in(['admin', 'kasir'])],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('admin.users')->with('success', 'User berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin', 'kasir'])],
            'password' => ['nullable', Password::defaults(), 'confirmed'],
        ]);

        // Cegah menurunkan peran admin terakhir agar panel admin tidak terkunci.
        if ($user->role === 'admin' && $validated['role'] !== 'admin' && $this->isLastAdmin()) {
            return redirect()->route('admin.users')->with('error', 'Tidak dapat menurunkan peran admin terakhir.');
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->route('admin.users')->with('success', 'User berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return redirect()->route('admin.users')->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }

        // Cegah menghapus admin terakhir agar selalu ada yang bisa mengelola sistem.
        if ($user->role === 'admin' && $this->isLastAdmin()) {
            return redirect()->route('admin.users')->with('error', 'Tidak dapat menghapus admin terakhir.');
        }

        $user->delete();

        return redirect()->route('admin.users')->with('success', 'User berhasil dihapus.');
    }

    /** Apakah sistem hanya tersisa satu akun admin? */
    private function isLastAdmin(): bool
    {
        return User::where('role', 'admin')->count() <= 1;
    }
}
