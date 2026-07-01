import { formatNumber, formatRupiah } from '@/lib/format';

// Util struk belanja bersama (dipakai di kasir/Riwayat.vue & kasir/Transaksi.vue).
// Dibangun dari data transaksi yang sudah difinalkan server (total, diskon, kembalian).

export interface StrukDetail {
    nama_produk: string;
    jumlah: number;
    harga: number;
    subtotal: number;
    // Titipan jasa (nominal transfer/tarik tunai); null bila bukan produk jasa.
    nominal?: number | null;
    foto?: string | null;
    foto_url?: string | null;
}

export interface StrukData {
    kode: string;
    tanggal: string;
    waktu: string;
    total_harga: number;
    // Total diskon (promo produk + global). Opsional agar kompatibel data lama.
    diskon?: number;
    metode_pembayaran: string;
    bayar: number;
    kembalian: number;
    details: StrukDetail[];
}

export function buildReceiptHtml(trx: StrukData): string {
    const rows = trx.details
        .map((detail) => {
            // Harga asal baris ini sebelum diskon promo (harga satuan tak berubah,
            // hanya subtotal yang dipotong) — dipakai untuk catatan "Hemat" di bawah baris.
            const totalAsal = detail.harga * detail.jumlah;
            const hematItem = totalAsal - detail.subtotal;

            return `
                <tr>
                    <td>${detail.nama_produk}</td>
                    <td class="text-right">${formatNumber(detail.jumlah)}</td>
                    <td class="text-right">${formatRupiah(detail.harga)}</td>
                    <td class="text-right">${formatRupiah(detail.subtotal)}</td>
                </tr>
                ${
                    hematItem >= 1
                        ? `<tr>
                    <td colspan="4" class="small diskon-note">Hemat ${formatRupiah(hematItem)}</td>
                </tr>`
                        : ''
                }
            `;
        })
        .join('');

    // Titipan jasa (nominal transfer/tarik) ikut dibayar tunai walau bukan omzet → tampil di struk.
    const titipan = trx.details.reduce(
        (sum, detail) => sum + (detail.nominal ? Number(detail.nominal) : 0),
        0,
    );
    const tagihan = trx.total_harga + titipan;
    const diskon = Number(trx.diskon ?? 0);

    return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Struk ${trx.kode}</title>
<style>
    body { font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #000; margin: 0; padding: 12px; }
    .receipt { width: 320px; }
    .receipt h1, .receipt h2, .receipt p { margin: 0; }
    .receipt h1 { font-size: 16px; margin-bottom: 8px; }
    .receipt .center { text-align: center; }
    .receipt .separator { border-top: 1px dashed #000; margin: 8px 0; }
    .receipt table { width: 100%; border-collapse: collapse; }
    .receipt td { padding: 2px 0; vertical-align: top; }
    .receipt .text-right { text-align: right; }
    .receipt .totals td { padding: 4px 0; }
    .receipt .small { font-size: 11px; }
    .receipt thead td { font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 4px; }
    .receipt .diskon-note { padding: 0 0 4px; font-style: italic; }
</style>
</head>
<body>
<div class="receipt">
    <h1 class="center">Cemilan Mba Tutut</h1>
    <p class="center small">Struk Transaksi</p>
    <div class="separator"></div>
    <p>Kode: ${trx.kode}</p>
    <p>${trx.tanggal} ${trx.waktu}</p>
    <div class="separator"></div>
    <table>
        <thead>
            <tr>
                <td>Produk</td>
                <td class="text-right">Qty</td>
                <td class="text-right">Harga Asal</td>
                <td class="text-right">Subtotal</td>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>
    <div class="separator"></div>
    <table class="totals">
        ${
            titipan > 0
                ? `<tr>
            <td>Penjualan / Fee</td>
            <td class="text-right">${formatRupiah(trx.total_harga)}</td>
        </tr>
        <tr>
            <td>Titipan layanan</td>
            <td class="text-right">${formatRupiah(titipan)}</td>
        </tr>`
                : ''
        }
        <tr>
            <td>Total</td>
            <td class="text-right">${formatRupiah(tagihan)}</td>
        </tr>
        <tr>
            <td>Bayar</td>
            <td class="text-right">${formatRupiah(trx.bayar)}</td>
        </tr>
        <tr>
            <td>Kembalian</td>
            <td class="text-right">${formatRupiah(trx.kembalian)}</td>
        </tr>
    </table>
    <div class="separator"></div>
    ${diskon > 0 ? `<p class="center small">Anda hemat ${formatRupiah(diskon)} dari promo.</p>` : ''}
    <p class="center small">Terima kasih atas kunjungan Anda.</p>
</div>
</body>
</html>`;
}

export function printReceipt(trx: StrukData): void {
    if (typeof window === 'undefined') {
        return;
    }

    const printWindow = window.open('', '_blank', 'width=400,height=700');

    if (!printWindow) {
        window.alert(
            'Tidak dapat membuka jendela cetak. Pastikan pop-up tidak diblokir.',
        );

        return;
    }

    printWindow.document.write(buildReceiptHtml(trx));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}
