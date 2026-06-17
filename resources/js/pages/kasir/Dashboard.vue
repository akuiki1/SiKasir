<script setup lang="ts">
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import {
    PlusCircle,
    Search,
    FileText,
    DollarSign,
    Clock,
    CheckCircle,
    ShoppingBag,
    Wallet,
    AlertTriangle,
    Tag,
    Trophy,
    Target,
    Banknote,
    QrCode,
    CreditCard,
    PackageX,
} from 'lucide-vue-next';
import { computed } from 'vue';
import { transaksi as transaksiRoute, riwayat as riwayatRoute } from '@/routes/kasir';

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

interface PaymentRow {
    metode: string;
    total: number;
    jumlah: number;
}

interface LowStockItem {
    id_produk: number;
    nama: string;
    stok: number;
    status: string;
    foto_url: string | null;
}

interface PromoItem {
    id_promo: number;
    nama: string;
    label: string;
    target: string;
    sisa_hari: number;
}

interface BestSeller {
    id_produk: number;
    nama: string;
    total_terjual: number;
    foto_url: string | null;
}

const props = defineProps<{
    today_sales: {
        total_revenue: number;
        total_transactions: number;
        total_items: number;
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
    payment_breakdown: PaymentRow[];
    low_stock: LowStockItem[];
    low_stock_count: number;
    active_promos: PromoItem[];
    best_sellers: BestSeller[];
    target: {
        harian: number;
        tercapai: number;
        persen: number;
    };
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

const todayAvg = computed(() =>
    props.today_sales.total_transactions > 0
        ? Math.round(props.today_sales.total_revenue / props.today_sales.total_transactions)
        : 0,
);

const cashTotal = computed(() => props.payment_breakdown.find((p) => p.metode === 'cash')?.total ?? 0);

const paymentMeta: Record<string, { label: string; icon: typeof Banknote; color: string }> = {
    cash: { label: 'Tunai', icon: Banknote, color: 'text-emerald-600 dark:text-emerald-400' },
    qris: { label: 'QRIS', icon: QrCode, color: 'text-indigo-600 dark:text-indigo-400' },
    transfer: { label: 'Transfer', icon: CreditCard, color: 'text-amber-600 dark:text-amber-400' },
};

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
            <Link
                :href="transaksiRoute.url()"
                class="flex items-center gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-left hover:bg-emerald-500/10 transition-all hover:scale-[1.02]"
            >
                <div class="rounded-full bg-emerald-500 p-3 text-white">
                    <PlusCircle class="h-6 w-6" />
                </div>
                <div>
                    <h3 class="font-bold text-emerald-700 dark:text-emerald-400">Entri Transaksi Baru</h3>
                    <p class="text-xs text-muted-foreground">Buka keranjang penjualan baru</p>
                </div>
            </Link>
            <Link
                :href="transaksiRoute.url()"
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-5 text-left hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all hover:scale-[1.02] dark:border-sidebar-border"
            >
                <div class="rounded-full bg-slate-100 dark:bg-zinc-800 p-3 text-foreground">
                    <Search class="h-6 w-6" />
                </div>
                <div>
                    <h3 class="font-bold">Cek Stok &amp; Harga</h3>
                    <p class="text-xs text-muted-foreground">Cari produk &amp; lihat ketersediaan</p>
                </div>
            </Link>
            <Link
                :href="riwayatRoute.url()"
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-5 text-left hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all hover:scale-[1.02] dark:border-sidebar-border"
            >
                <div class="rounded-full bg-slate-100 dark:bg-zinc-800 p-3 text-foreground">
                    <FileText class="h-6 w-6" />
                </div>
                <div>
                    <h3 class="font-bold">Riwayat Transaksi</h3>
                    <p class="text-xs text-muted-foreground">Cetak ulang struk / cek penjualan</p>
                </div>
            </Link>
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

        <!-- Target Harian -->
        <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                    <div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Target class="h-5 w-5" />
                    </div>
                    <div>
                        <h2 class="text-lg font-bold tracking-tight">Target Penjualan Hari Ini</h2>
                        <p class="text-xs text-muted-foreground">
                            {{ formatRupiah(props.target.tercapai) }} dari {{ formatRupiah(props.target.harian) }}
                        </p>
                    </div>
                </div>
                <span class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{{ props.target.persen }}%</span>
            </div>
            <div class="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                <div
                    class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    :style="{ width: props.target.persen + '%' }"
                ></div>
            </div>
            <p v-if="props.target.persen >= 100" class="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                🎉 Target tercapai. Mantap, pertahankan!
            </p>
            <p v-else class="mt-2 text-xs text-muted-foreground">
                Kurang {{ formatRupiah(Math.max(0, props.target.harian - props.target.tercapai)) }} lagi untuk capai target.
            </p>
        </div>

        <!-- Main Panel: Recent Sales & Session Summary -->
        <div class="grid gap-6 md:grid-cols-3">
            <!-- Left Side: Recent Sales Log -->
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 md:col-span-2 dark:border-sidebar-border">
                <div class="flex items-center justify-between border-b border-sidebar-border/70 pb-4 mb-4 dark:border-sidebar-border">
                    <div>
                        <h2 class="text-lg font-bold tracking-tight">Transaksi Terakhir Saya</h2>
                        <p class="text-xs text-muted-foreground">Daftar transaksi yang baru saja diselesaikan</p>
                    </div>
                    <Link
                        :href="riwayatRoute.url()"
                        class="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                        Lihat semua
                    </Link>
                </div>

                <div v-if="props.recent_transactions.length" class="space-y-4">
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
                <div v-else class="flex flex-col items-center justify-center gap-2 py-10 text-center">
                    <ShoppingBag class="h-8 w-8 text-muted-foreground/40" />
                    <p class="text-sm text-muted-foreground">Belum ada transaksi. Mulai transaksi pertamamu!</p>
                </div>
            </div>

            <!-- Right Side: Session Summary (real numbers) -->
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                <h2 class="text-lg font-bold tracking-tight border-b border-sidebar-border/70 pb-4 mb-4 dark:border-sidebar-border">Ringkasan Hari Ini</h2>
                <div class="space-y-4 text-sm">
                    <div class="flex justify-between border-b border-sidebar-border/40 pb-2 dark:border-sidebar-border/40">
                        <span class="text-muted-foreground">Total Item Terjual</span>
                        <span class="font-semibold">{{ props.today_sales.total_items }} item</span>
                    </div>
                    <div class="flex justify-between border-b border-sidebar-border/40 pb-2 dark:border-sidebar-border/40">
                        <span class="text-muted-foreground">Jumlah Transaksi</span>
                        <span class="font-semibold">{{ props.today_sales.total_transactions }} transaksi</span>
                    </div>
                    <div class="flex justify-between border-b border-sidebar-border/40 pb-2 dark:border-sidebar-border/40">
                        <span class="text-muted-foreground">Rata-rata / Transaksi</span>
                        <span class="font-semibold">{{ formatRupiah(todayAvg) }}</span>
                    </div>

                    <!-- Payment breakdown -->
                    <div class="pt-1">
                        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Rincian Pembayaran</p>
                        <div class="space-y-2">
                            <div
                                v-for="pay in props.payment_breakdown"
                                :key="pay.metode"
                                class="flex items-center justify-between"
                            >
                                <span class="flex items-center gap-2">
                                    <component :is="paymentMeta[pay.metode].icon" :class="['h-4 w-4', paymentMeta[pay.metode].color]" />
                                    <span>{{ paymentMeta[pay.metode].label }}</span>
                                    <span class="text-xs text-muted-foreground">({{ pay.jumlah }})</span>
                                </span>
                                <span class="font-semibold">{{ formatRupiah(pay.total) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-2 rounded-lg bg-emerald-500/10 p-3 border border-emerald-500/20">
                        <p class="text-xs text-muted-foreground">Uang tunai di laci (seharusnya)</p>
                        <p class="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">{{ formatRupiah(cashTotal) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Operational Row: Stok, Promo, Terlaris -->
        <div class="grid gap-6 md:grid-cols-3">
            <!-- Stok menipis -->
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                <div class="flex items-center justify-between border-b border-sidebar-border/70 pb-4 mb-4 dark:border-sidebar-border">
                    <div class="flex items-center gap-2">
                        <div class="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <AlertTriangle class="h-5 w-5" />
                        </div>
                        <h2 class="text-base font-bold tracking-tight">Stok Menipis</h2>
                    </div>
                    <span
                        v-if="props.low_stock_count"
                        class="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300"
                    >
                        {{ props.low_stock_count }}
                    </span>
                </div>

                <div v-if="props.low_stock.length" class="space-y-3">
                    <div
                        v-for="item in props.low_stock"
                        :key="item.id_produk"
                        class="flex items-center justify-between gap-3"
                    >
                        <div class="flex items-center gap-3 min-w-0">
                            <img
                                v-if="item.foto_url"
                                :src="item.foto_url"
                                :alt="item.nama"
                                class="h-9 w-9 rounded-md object-cover border border-sidebar-border/70"
                            />
                            <div v-else class="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 dark:bg-zinc-800 text-muted-foreground">
                                <PackageX class="h-4 w-4" />
                            </div>
                            <p class="truncate text-sm font-medium">{{ item.nama }}</p>
                        </div>
                        <span
                            v-if="item.status === 'out-of-stock'"
                            class="shrink-0 inline-flex items-center rounded-full bg-red-100 dark:bg-red-950 px-2 py-0.5 text-xs font-bold text-red-700 dark:text-red-300"
                        >
                            Habis
                        </span>
                        <span
                            v-else
                            class="shrink-0 inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-950 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300"
                        >
                            Sisa {{ item.stok }}
                        </span>
                    </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center gap-2 py-8 text-center">
                    <CheckCircle class="h-8 w-8 text-emerald-500/50" />
                    <p class="text-sm text-muted-foreground">Semua stok aman 👍</p>
                </div>
            </div>

            <!-- Promo aktif -->
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                <div class="flex items-center gap-2 border-b border-sidebar-border/70 pb-4 mb-4 dark:border-sidebar-border">
                    <div class="rounded-lg bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        <Tag class="h-5 w-5" />
                    </div>
                    <h2 class="text-base font-bold tracking-tight">Promo Aktif</h2>
                </div>

                <div v-if="props.active_promos.length" class="space-y-3">
                    <div
                        v-for="promo in props.active_promos"
                        :key="promo.id_promo"
                        class="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3"
                    >
                        <div class="flex items-center justify-between gap-2">
                            <p class="truncate text-sm font-bold text-indigo-700 dark:text-indigo-300">{{ promo.nama }}</p>
                            <span class="shrink-0 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">{{ promo.label }}</span>
                        </div>
                        <div class="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                            <span class="truncate">{{ promo.target }}</span>
                            <span class="shrink-0">Sisa {{ promo.sisa_hari }} hari</span>
                        </div>
                    </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center gap-2 py-8 text-center">
                    <Tag class="h-8 w-8 text-muted-foreground/40" />
                    <p class="text-sm text-muted-foreground">Tidak ada promo aktif saat ini.</p>
                </div>
            </div>

            <!-- Produk terlaris -->
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                <div class="flex items-center gap-2 border-b border-sidebar-border/70 pb-4 mb-4 dark:border-sidebar-border">
                    <div class="rounded-lg bg-yellow-500/10 p-2 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                        <Trophy class="h-5 w-5" />
                    </div>
                    <h2 class="text-base font-bold tracking-tight">Produk Terlaris Saya</h2>
                </div>

                <div v-if="props.best_sellers.length" class="space-y-3">
                    <div
                        v-for="(item, index) in props.best_sellers"
                        :key="item.id_produk"
                        class="flex items-center gap-3"
                    >
                        <span
                            :class="[
                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                                index === 0
                                    ? 'bg-yellow-400 text-yellow-950'
                                    : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300',
                            ]"
                        >
                            {{ index + 1 }}
                        </span>
                        <img
                            v-if="item.foto_url"
                            :src="item.foto_url"
                            :alt="item.nama"
                            class="h-9 w-9 rounded-md object-cover border border-sidebar-border/70"
                        />
                        <div v-else class="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 dark:bg-zinc-800 text-muted-foreground">
                            <ShoppingBag class="h-4 w-4" />
                        </div>
                        <p class="min-w-0 flex-1 truncate text-sm font-medium">{{ item.nama }}</p>
                        <span class="shrink-0 text-sm font-bold text-emerald-600 dark:text-emerald-400">{{ item.total_terjual }}x</span>
                    </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center gap-2 py-8 text-center">
                    <Trophy class="h-8 w-8 text-muted-foreground/40" />
                    <p class="text-sm text-muted-foreground">Belum ada penjualan pada rentang ini.</p>
                </div>
            </div>
        </div>
    </div>
</template>
