<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import {
    Search,
    Calendar,
    DollarSign,
    ShoppingCart,
    ArrowUpRight,
    FileText,
    X,
} from 'lucide-vue-next';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Data Transaksi',
                href: '/admin/transactions',
            },
        ],
    },
});

interface Transaksi {
    id_transaksi: number;
    kode: string;
    kasir: string;
    jumlah_item: number;
    total_harga: number;
    metode_pembayaran: string;
    bayar: number;
    kembalian: number;
    created_at: string;
    waktu: string;
    tanggal: string;
}

interface Stats {
    total_penjualan_hari_ini: number;
    total_transaksi_sukses: number;
    rata_rata: number;
}

const props = defineProps<{
    transaksis: Transaksi[];
    stats: Stats;
}>();

// Format rupiah
function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

// Format metode
function formatMetode(metode: string): string {
    const labels: Record<string, string> = {
        cash: 'Tunai',
        qris: 'QRIS',
        transfer: 'Transfer',
    };
    return labels[metode] ?? metode;
}

// Search
const searchQuery = ref('');
const filteredTransaksis = computed(() => {
    if (!searchQuery.value) return props.transaksis;
    const q = searchQuery.value.toLowerCase();
    return props.transaksis.filter(
        (t) =>
            t.kode.toLowerCase().includes(q) ||
            t.kasir.toLowerCase().includes(q),
    );
});

// Detail modal
const showDetail = ref(false);
const selectedTrx = ref<Transaksi | null>(null);

function openDetail(trx: Transaksi) {
    selectedTrx.value = trx;
    showDetail.value = true;
}

function closeDetail() {
    showDetail.value = false;
    selectedTrx.value = null;
}
</script>

<template>
    <Head title="Data Transaksi - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <!-- Header Section -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">Manajemen Transaksi</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Pantau riwayat seluruh transaksi penjualan, status pembayaran, serta metode
                    pembayaran kasir.
                </p>
            </div>

            <button
                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"
            >
                <Calendar class="h-4 w-4" />
                Pilih Periode
            </button>
        </div>

        <!-- Stats Row -->
        <div class="grid gap-4 md:grid-cols-3">
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400"
                >
                    <DollarSign class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">
                        Total Penjualan Hari Ini
                    </span>
                    <h3 class="mt-0.5 text-xl font-bold">
                        {{ formatRupiah(stats.total_penjualan_hari_ini) }}
                    </h3>
                </div>
            </div>
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400"
                >
                    <ShoppingCart class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">
                        Total Transaksi Hari Ini
                    </span>
                    <h3 class="mt-0.5 text-xl font-bold">
                        {{ stats.total_transaksi_sukses }} Transaksi
                    </h3>
                </div>
            </div>
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400"
                >
                    <ArrowUpRight class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Rata-rata Pembelian</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ formatRupiah(stats.rata_rata) }}</h3>
                </div>
            </div>
        </div>

        <!-- Filters & Table Section -->
        <div
            class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"
        >
            <!-- Table Action Bar -->
            <div
                class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border"
            >
                <div class="relative flex-1 max-w-md">
                    <Search
                        class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari transaksi berdasarkan ID atau kasir..."
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
            </div>

            <!-- Responsive Table -->
            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr
                            class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"
                        >
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                ID Transaksi
                            </th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Kasir</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                Jumlah Barang
                            </th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                Total Belanja
                            </th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Metode</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Waktu</th>
                            <th class="px-6 py-4 text-right font-semibold text-muted-foreground">
                                Detail
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        <tr v-if="filteredTransaksis.length === 0">
                            <td
                                colspan="7"
                                class="px-6 py-12 text-center text-muted-foreground"
                            >
                                <ShoppingCart class="mx-auto mb-3 h-10 w-10 opacity-30" />
                                <p class="font-medium">
                                    {{
                                        searchQuery
                                            ? 'Tidak ada transaksi yang sesuai pencarian.'
                                            : 'Belum ada transaksi.'
                                    }}
                                </p>
                            </td>
                        </tr>
                        <tr
                            v-for="trx in filteredTransaksis"
                            :key="trx.id_transaksi"
                            class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"
                        >
                            <td class="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                {{ trx.kode }}
                            </td>
                            <td class="px-6 py-4 font-semibold text-foreground">
                                {{ trx.kasir }}
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">
                                {{ trx.jumlah_item }} item
                            </td>
                            <td class="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                                {{ formatRupiah(trx.total_harga) }}
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400"
                                >
                                    {{ formatMetode(trx.metode_pembayaran) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">
                                <div>
                                    <p class="font-medium">{{ trx.waktu }}</p>
                                    <p class="text-xs">{{ trx.tanggal }}</p>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button
                                    class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
                                    title="Lihat Detail"
                                    @click="openDetail(trx)"
                                >
                                    <FileText class="h-4 w-4" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal Detail Transaksi -->
    <Teleport to="body">
        <div
            v-if="showDetail && selectedTrx"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            @click.self="closeDetail"
        >
            <div
                class="w-full max-w-md rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border"
            >
                <div class="mb-5 flex items-center justify-between">
                    <h2 class="text-lg font-bold">Detail Transaksi</h2>
                    <button
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                        @click="closeDetail"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <div class="flex flex-col gap-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">ID Transaksi</span>
                        <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">{{
                            selectedTrx.kode
                        }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Kasir</span>
                        <span class="font-semibold">{{ selectedTrx.kasir }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Waktu</span>
                        <span>{{ selectedTrx.waktu }}, {{ selectedTrx.tanggal }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Jumlah Item</span>
                        <span>{{ selectedTrx.jumlah_item }} item</span>
                    </div>
                    <div class="my-1 border-t border-sidebar-border/70 dark:border-sidebar-border" />
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Metode Pembayaran</span>
                        <span class="font-semibold">{{
                            formatMetode(selectedTrx.metode_pembayaran)
                        }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Total Belanja</span>
                        <span class="font-bold text-slate-800 dark:text-slate-200">{{
                            formatRupiah(selectedTrx.total_harga)
                        }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Dibayar</span>
                        <span>{{ formatRupiah(selectedTrx.bayar) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Kembalian</span>
                        <span class="font-semibold text-emerald-600">{{
                            formatRupiah(selectedTrx.kembalian)
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
