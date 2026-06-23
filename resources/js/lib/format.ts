// Formatter mata uang & angka yang deterministik untuk SSR.
//
// JANGAN memformat rupiah dengan Intl.NumberFormat({ style: 'currency', currency: 'IDR' })
// atau angka ringkas dengan { notation: 'compact' }. Output ICU di Node (saat server render)
// berbeda dengan ICU browser — terutama spasi no-break (U+00A0) setelah "Rp" dan sebelum
// sufiks ringkas (rb/jt/M), serta data CLDR yang bisa beda antar versi ICU. Perbedaan itu
// memicu warning "Hydration completed but contains mismatches." di setiap halaman bernilai rupiah.
//
// Solusi: rangkai string dari prefix literal "Rp" + grouping angka (pemisah ribuan id-ID
// stabil lintas ICU), dan susun notasi ringkas secara manual. Hasilnya identik di server & klien.

const rupiahGroup = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

/** Format rupiah: "Rp16.697.000". Identik di server & klien. */
export function formatRupiah(value: number): string {
    return 'Rp' + rupiahGroup.format(Number(value) || 0);
}

/** Format angka id-ID dengan pemisah ribuan; kuantitas curah bisa pecahan (mis. "1.429,5"). */
export function formatNumber(value: number, maximumFractionDigits = 3): string {
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits }).format(Number(value) || 0);
}

const compactTiers: ReadonlyArray<readonly [number, string]> = [
    [1e12, 'T'],
    [1e9, 'M'],
    [1e6, 'jt'],
    [1e3, 'rb'],
];

/**
 * Notasi ringkas TANPA prefix "Rp": "5 rb", "16,7 jt", "1,2 M", "3,4 T".
 * Disusun manual agar identik di server & klien.
 */
export function formatCompact(value: number): string {
    const n = Number(value) || 0;
    const sign = n < 0 ? '-' : '';
    const abs = Math.abs(n);

    for (const [factor, suffix] of compactTiers) {
        if (abs >= factor) {
            return `${sign}${formatNumber(abs / factor, 1)} ${suffix}`;
        }
    }

    return sign + formatNumber(abs, 0);
}
