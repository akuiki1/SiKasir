<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;

/**
 * Validasi parameter "per_page" untuk daftar berpaginasi server-side.
 * Opsi harus selaras dengan komponen Pagination.vue (perPageOptions).
 */
trait ResolvesPerPage
{
    /** Opsi jumlah baris per halaman yang diperbolehkan. */
    protected const PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];

    /**
     * Ambil per_page dari query string, jatuh ke default bila tidak valid.
     * $key dapat dikustomisasi bila satu halaman punya >1 tabel berpaginasi.
     */
    protected function resolvePerPage(Request $request, int $default = 10, string $key = 'per_page'): int
    {
        $perPage = (int) $request->query($key, (string) $default);

        return in_array($perPage, self::PER_PAGE_OPTIONS, true) ? $perPage : $default;
    }
}
