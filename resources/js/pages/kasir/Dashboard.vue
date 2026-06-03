<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import { 
    PlusCircle, 
    Search, 
    FileText, 
    DollarSign, 
    Clock, 
    CheckCircle, 
    ShoppingBag,
    Wallet
} from 'lucide-vue-next';
import { computed } from 'vue';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Kasir Dashboard',
                href: '/kasir/dashboard',
            },
        ],
    },
});

interface TransactionItem {
    id_transaksi: number;
    kode: string;
    waktu: string;
    items: number;
    total_harga: number;
    status: string;
}

const props = defineProps<{
    today_sales: {
        total_revenue: number;
        total_transactions: number;
    };
    range_sales: {
        total_revenue: number;
        total_transactions: number;
    };
    date_range: {
        start_date: string;
        end_date: string;
        label: string;
    };
    recent_transactions: TransactionItem[];
}>();

const form = useForm({
    start_date: props.date_range.start_date,
    end_date: props.date_range.end_date,
});

const stats = computed(() => [
    {
        name: 'Penjualan Hari Ini',
        value: formatRupiah(props.today_sales.total_revenue),
        icon: DollarSign,
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
        name: 'Transaksi Hari Ini',
        value: `${props.today_sales.total_transactions} Transaksi`,
        icon: ShoppingBag,
        color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    },
    {
        name: 'Penjualan Rentang',
        value: formatRupiah(props.range_sales.total_revenue),
        icon: Wallet,
        color: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
    },
    {
        name: 'Transaksi Rentang',
        value: `${props.range_sales.total_transactions} Transaksi`,
        icon: FileText,
        color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    },
]);

function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

function applyRange(): void {
    router.get('/kasir/dashboard', {
        start_date: form.start_date,
        end_date: form.end_date,
    }, {
        preserveState: true,
        replace: true,
    });
}
</script>

<template>
    <Head title="Kasir Dashboard" />

    <div class="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
        <!-- Welcoming Section -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 p-6 text-white shadow-xl dark:from-zinc-950 dark:to-neutral-900 border border-white/10">
            <div class="relative z-10 flex flex-col gap-2">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300 border border-emerald-500/30 w-fit">
                    <CheckCircle class="h-3.5 w-3.5 animate-pulse" />
                    Sesi Kasir Aktif
                </span>
                <h1 class="text-3xl font-extrabold tracking-tight">Selamat Bekerja, Kasir!</h1>
                <p class="text-slate-300 max-w-xl">
                    Sistem siap melayani. Mulai transaksi baru dengan cepat menggunakan tombol pintasan di bawah untuk mengoptimalkan pelayanan pelanggan.
                </p>
            </div>
            <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"></div>
            <div class="absolute right-20 bottom-0 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl"></div>
        </div>

        <!-- Action Grid - Highlighted for Cashiers -->
        <div class="grid gap-4 md:grid-cols-3">
            <button class="flex items-center gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-left hover:bg-emerald-500/10 transition-all hover:scale-[1.02]">
                <div class="rounded-full bg-emerald-500 p-3 text-white">
                    <PlusCircle class="h-6 w-6" />
                </div>
                <div>
                    <h3 class="font-bold text-emerald-700 dark:text-emerald-400">Entri Transaksi Baru</h3>
                    <p class="text-xs text-muted-foreground">Buka keranjang penjualan baru</p>
                </div>
            </button>
            <button class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-5 text-left hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all hover:scale-[1.02] dark:border-sidebar-border">
                <div class="rounded-full bg-slate-100 dark:bg-zinc-800 p-3 text-foreground">
                    <Search class="h-6 w-6" />
                </div>
                <div>
                    <h3 class="font-bold">Cari Produk (F8)</h3>
                    <p class="text-xs text-muted-foreground">Cek stok & info harga barang</p>
                </div>
            </button>
            <button class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-5 text-left hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all hover:scale-[1.02] dark:border-sidebar-border">
                <div class="rounded-full bg-slate-100 dark:bg-zinc-800 p-3 text-foreground">
                    <FileText class="h-6 w-6" />
                </div>
                <div>
                    <h3 class="font-bold">Riwayat Transaksi</h3>
                    <p class="text-xs text-muted-foreground">Cetak ulang struk / retur barang</p>
                </div>
            </button>
        </div>

        <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 class="text-lg font-bold tracking-tight">Filter Rentang Waktu</h2>
                    <p class="text-sm text-muted-foreground">{{ props.date_range.label }}</p>
                </div>

                <div class="grid w-full gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:w-auto">
                    <label class="block">
                        <span class="text-xs text-muted-foreground">Dari</span>
                        <input
                            v-model="form.start_date"
                            type="date"
                            class="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </label>
                    <label class="block">
                        <span class="text-xs text-muted-foreground">Sampai</span>
                        <input
                            v-model="form.end_date"
                            type="date"
                            class="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </label>
                    <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                        @click.prevent="applyRange"
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid gap-4 md:grid-cols-4">
            <div 
                v-for="stat in stats" 
                :key="stat.name"
                class="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-muted-foreground">{{ stat.name }}</span>
                    <div :class="['rounded-lg p-2 border', stat.color]">
                        <component :is="stat.icon" class="h-5 w-5" />
                    </div>
                </div>
                <div class="mt-4 flex items-baseline gap-2">
                    <span class="text-2xl font-bold tracking-tight">{{ stat.value }}</span>
                </div>
            </div>
        </div>

        <!-- Main Panel: Shift Logs & Active Products -->
        <div class="grid gap-6 md:grid-cols-3">
            <!-- Left Side: Recent Sales Log -->
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 md:col-span-2 dark:border-sidebar-border">
                <div class="flex items-center justify-between border-b border-sidebar-border/70 pb-4 mb-4 dark:border-sidebar-border">
                    <div>
                        <h2 class="text-lg font-bold tracking-tight">Transaksi Terakhir Saya</h2>
                        <p class="text-xs text-muted-foreground">Daftar transaksi yang diselesaikan pada shift ini</p>
                    </div>
                    <span class="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                        Shift Sedang Berjalan
                    </span>
                </div>

                <div class="space-y-4">
                    <div 
                        v-for="trx in props.recent_transactions" 
                        :key="trx.id_transaksi"
                        class="flex items-center justify-between rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                        <div class="flex items-center gap-3">
                            <div class="rounded-full bg-emerald-500/10 p-2 text-emerald-600">
                                <Clock class="h-4 w-4" />
                            </div>
                            <div>
                                <p class="text-sm font-bold text-indigo-600 dark:text-indigo-400">#{{ trx.kode }}</p>
                                <p class="text-xs text-muted-foreground">{{ trx.items }} item • Pukul {{ trx.waktu }}</p>
                            </div>
                        </div>
                        <div class="text-right flex items-center gap-4">
                            <div>
                                <p class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ formatRupiah(trx.total_harga) }}</p>
                                <span class="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    {{ trx.status }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Side: Shift Summary -->
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                <h2 class="text-lg font-bold tracking-tight border-b border-sidebar-border/70 pb-4 mb-4 dark:border-sidebar-border">Ringkasan Sesi</h2>
                <div class="space-y-4 text-sm">
                    <div class="flex justify-between border-b border-sidebar-border/40 pb-2 dark:border-sidebar-border/40">
                        <span class="text-muted-foreground">Mulai Shift</span>
                        <span class="font-medium">08:00 WIB</span>
                    </div>
                    <div class="flex justify-between border-b border-sidebar-border/40 pb-2 dark:border-sidebar-border/40">
                        <span class="text-muted-foreground">Durasi Sesi</span>
                        <span class="font-medium">5 Jam 35 Menit</span>
                    </div>
                    <div class="flex justify-between border-b border-sidebar-border/40 pb-2 dark:border-sidebar-border/40">
                        <span class="text-muted-foreground">Total Item Terjual</span>
                        <span class="font-medium">85 Items</span>
                    </div>
                    <div class="pt-2">
                        <button class="w-full flex items-center justify-center rounded-lg bg-red-600 text-white font-bold py-2.5 text-center text-xs hover:bg-red-700 transition-colors">
                            Akhiri Shift & Tutup Laci
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
