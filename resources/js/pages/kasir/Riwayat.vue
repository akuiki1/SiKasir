<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import {
    Search,
    Filter,
    DollarSign,
    Clock,
    Printer,
    FileText,
} from 'lucide-vue-next';
import { ref, computed, watch } from 'vue';
import Pagination from '@/components/Pagination.vue';
import { formatRupiah } from '@/lib/format';
import { printReceipt } from '@/lib/struk';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Riwayat Transaksi',
                href: '/kasir/riwayat',
            },
        ],
    },
});

interface Transaksi {
    id_transaksi: number;
    kode: string;
    jumlah_item: number;
    total_harga: number;
    diskon?: number;
    metode_pembayaran: string;
    bayar: number;
    kembalian: number;
    created_at: string;
    waktu: string;
    tanggal: string;
    details: Array<{
        nama_produk: string;
        jumlah: number;
        harga: number;
        subtotal: number;
        nominal?: number | null;
        foto: string | null;
        foto_url?: string | null;
    }>;
}

interface Stats {
    total_penjualan: number;
    total_transaksi: number;
    total_struk: number;
}

interface Paginator<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Filters {
    start_date: string;
    end_date: string;
    search: string;
    per_page: number;
}

const props = defineProps<{
    transaksis: Paginator<Transaksi>;
    stats: Stats;
    filters: Filters;
}>();

const searchQuery = ref(props.filters.search ?? '');

// Pencarian dikirim ke server (debounce) sehingga hanya satu halaman data yang dimuat ke memori.
let searchTimer: ReturnType<typeof setTimeout> | undefined;
watch(searchQuery, (value) => {
    if (searchTimer) {
        clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(() => reload({ search: value, page: 1 }), 350);
});

type QueryValue = string | number;

function buildParams(overrides: Record<string, QueryValue> = {}): Record<string, QueryValue> {
    const params: Record<string, QueryValue | undefined> = {
        search: searchQuery.value || undefined,
        per_page: props.filters.per_page,
        start_date: props.filters.start_date || undefined,
        end_date: props.filters.end_date || undefined,
        ...overrides,
    };

    const cleaned: Record<string, QueryValue> = {};

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            cleaned[key] = value;
        }
    });

    return cleaned;
}

function reload(overrides: Record<string, QueryValue> = {}): void {
    router.get('/kasir/riwayat', buildParams(overrides), {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}

function goToPage(page: number): void {
    reload({ page });
}

function changePerPage(value: number): void {
    reload({ per_page: value, page: 1 });
}

// Susun nomor halaman yang tampil (mirror dari logika composable usePagination).
const visiblePages = computed(() => {
    const pages: number[] = [];
    const total = props.transaksis.last_page;
    const current = props.transaksis.current_page;

    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
pages.push(i);
}
    } else {
        pages.push(1);

        if (current > 3) {
pages.push(-1);
}

        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
            pages.push(i);
        }

        if (current < total - 2) {
pages.push(-1);
}

        pages.push(total);
    }

    return pages;
});


function formatMetode(metode: string): string {
    const labels: Record<string, string> = {
        cash: 'Tunai',
        qris: 'QRIS',
        transfer: 'Transfer',
    };

    return labels[metode] ?? metode;
}

function printTransaction(trx: Transaksi): void {
    printReceipt(trx);
}

const isPrinting = ref(false);

// Laporan sesi memuat SELURUH transaksi (lintas halaman) lewat endpoint khusus,
// mengikuti filter aktif — data tabel sendiri tetap dipaginasi agar hemat memori.
async function printSessionReport(): Promise<void> {
    if (typeof window === 'undefined' || isPrinting.value) {
        return;
    }

    isPrinting.value = true;

    let data: Transaksi[];

    try {
        const params = new URLSearchParams();

        if (searchQuery.value) {
            params.set('search', searchQuery.value);
        }

        if (props.filters.start_date) {
            params.set('start_date', props.filters.start_date);
        }

        if (props.filters.end_date) {
            params.set('end_date', props.filters.end_date);
        }

        const response = await fetch(`/kasir/riwayat/cetak?${params.toString()}`, {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
        });

        if (!response.ok) {
            throw new Error('Gagal memuat data laporan.');
        }

        data = (await response.json()).transaksis as Transaksi[];
    } catch {
        window.alert('Gagal memuat data laporan. Silakan coba lagi.');
        isPrinting.value = false;

        return;
    }

    const rows = data
        .map(
            (trx) => `
                <tr>
                    <td>${trx.kode}</td>
                    <td class="text-right">${trx.jumlah_item}</td>
                    <td class="text-right">${formatRupiah(trx.total_harga)}</td>
                    <td>${formatMetode(trx.metode_pembayaran)}</td>
                    <td>${trx.tanggal} ${trx.waktu}</td>
                </tr>
            `,
        )
        .join('');

    const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Laporan Transaksi</title>
<style>
    body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px 4px; border-bottom: 1px solid #ddd; }
    th { text-align: left; }
    .right { text-align: right; }
</style>
</head>
<body>
    <h1>Laporan Transaksi</h1>
    <p>Total transaksi: ${data.length}</p>
    <table>
        <thead>
            <tr>
                <th>Kode</th>
                <th class="right">Item</th>
                <th class="right">Total</th>
                <th>Metode</th>
                <th>Waktu</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>
</body>
</html>`;

    isPrinting.value = false;

    const printWindow = window.open('', '_blank', 'width=800,height=900');

    if (!printWindow) {
        window.alert('Tidak dapat membuka jendela cetak. Pastikan pop-up tidak diblokir.');

        return;
    }

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}
</script>

<template>
    <Head title="Riwayat Transaksi - Kasir" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">Riwayat Transaksi Anda</h1>
                <p class="text-sm text-muted-foreground mt-1">
                    Daftar seluruh transaksi yang Anda proses saat ini.
                </p>
            </div>

            <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800/40 dark:border-sidebar-border"
                @click="printSessionReport"
            >
                <Printer class="h-4 w-4" />
                Cetak Laporan Sesi
            </button>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border flex items-center gap-4 shadow-sm">
                <div class="rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <DollarSign class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Penjualan Anda</span>
                    <h3 class="text-xl font-bold mt-0.5">{{ formatRupiah(props.stats.total_penjualan) }}</h3>
                </div>
            </div>
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border flex items-center gap-4 shadow-sm">
                <div class="rounded-lg bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <Clock class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Transaksi</span>
                    <h3 class="text-xl font-bold mt-0.5">{{ props.stats.total_transaksi }} Transaksi</h3>
                </div>
            </div>
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border flex items-center gap-4 shadow-sm">
                <div class="rounded-lg bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <Printer class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Struk Dicetak</span>
                    <h3 class="text-xl font-bold mt-0.5">{{ props.stats.total_struk }} Struk</h3>
                </div>
            </div>
        </div>

        <div class="rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border overflow-hidden">
            <div class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border">
                <div class="relative flex-1 max-w-md">
                    <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari transaksi berdasarkan ID atau metode..."
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background pl-9 pr-4 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>

                <div class="flex gap-2">
                    <button
                        type="button"
                        class="inline-flex items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800/40 dark:border-sidebar-border"
                    >
                        <Filter class="h-4 w-4" />
                        Semua Metode
                    </button>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:bg-zinc-800/20 dark:border-sidebar-border">
                            <th class="px-6 py-4 font-semibold text-muted-foreground">ID Transaksi</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Jumlah Barang</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Total Penjualan</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Metode Bayar</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Waktu Selesai</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        <tr
                            v-if="props.transaksis.data.length === 0"
                            class="bg-background text-center text-sm text-muted-foreground"
                        >
                            <td colspan="7" class="px-6 py-8">
                                Tidak ada transaksi yang cocok.
                            </td>
                        </tr>
                        <tr
                            v-for="trx in props.transaksis.data"
                            :key="trx.id_transaksi"
                            class="hover:bg-slate-50/50 dark:hover:bg-zinc-800/10 transition-colors"
                        >
                            <td class="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ trx.kode }}</td>
                            <td class="px-6 py-4 text-muted-foreground">{{ trx.jumlah_item }} item</td>
                            <td class="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{{ formatRupiah(trx.total_harga) }}</td>
                            <td class="px-6 py-4 text-muted-foreground">{{ formatMetode(trx.metode_pembayaran) }}</td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                                    Sukses
                                </span>
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">
                                {{ trx.waktu }} · {{ trx.tanggal }}
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="inline-flex gap-2 justify-end">
                                    <button
                                        type="button"
                                        class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-indigo-600 transition-colors"
                                        @click="printTransaction(trx)"
                                    >
                                        <Printer class="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-indigo-600 transition-colors"
                                    >
                                        <FileText class="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Pagination
                :current-page="props.transaksis.current_page"
                :total-pages="props.transaksis.last_page"
                :total-items="props.transaksis.total"
                :start-index="props.transaksis.from ?? 0"
                :end-index="props.transaksis.to ?? 0"
                :per-page="props.transaksis.per_page"
                :visible-pages="visiblePages"
                @update:current-page="goToPage"
                @update:per-page="changePerPage"
            />
        </div>
    </div>
</template>
