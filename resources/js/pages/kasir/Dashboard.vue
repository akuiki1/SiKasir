<script setup lang="ts">
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import {
    PlusCircle,
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
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { formatRupiah } from '@/lib/format';
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
    deskripsi: string | null;
    label: string;
    tipe: string;
    target: string;
    is_global: boolean;
    minimal_belanja: number | null;
    sisa_hari: number;
    berakhir_hari_ini: boolean;
    mulai_hari_ini: boolean;
    periode: string;
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
    pending_pesanan_count: number;
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

// --- Filter periode (selaras dashboard & transaksi admin) ---
const showDateFilter = ref(false);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function getMonthRange(year: number, month: number) {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    return {
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10),
    };
}

function getYearRange(year: number) {
    // String manual agar tidak bergeser akibat konversi UTC pada toISOString().
    return {
        start: `${year}-01-01`,
        end: `${year}-12-31`,
    };
}

const filterYear = ref(
    props.date_range.start_date
        ? new Date(props.date_range.start_date + 'T00:00:00').getFullYear()
        : new Date().getFullYear(),
);

function detectDateMode(): string {
    const today = new Date().toISOString().slice(0, 10);

    if (props.date_range.start_date === today && props.date_range.end_date === today) {
        return 'today';
    }

    const yearRange = getYearRange(filterYear.value);

    if (props.date_range.start_date === yearRange.start && props.date_range.end_date === yearRange.end) {
        return 'year';
    }

    for (let m = 0; m < 12; m++) {
        const range = getMonthRange(filterYear.value, m);

        if (range.start === props.date_range.start_date && range.end === props.date_range.end_date) {
            return String(m);
        }
    }

    return 'custom';
}

const selectedDateMode = ref(detectDateMode());

const periodLabel = computed(() => {
    if (selectedDateMode.value === 'today') {
return 'Hari Ini';
}

    if (selectedDateMode.value === 'year') {
return `Tahun ${filterYear.value}`;
}

    if (selectedDateMode.value !== 'custom') {
return `${MONTHS[Number(selectedDateMode.value)]} ${filterYear.value}`;
}

    return props.date_range.label;
});

function selectToday(): void {
    selectedDateMode.value = 'today';
    const today = new Date().toISOString().slice(0, 10);
    router.get('/kasir/dashboard', { start_date: today, end_date: today }, { preserveState: true, replace: true });
}

function selectMonth(monthIndex: number): void {
    selectedDateMode.value = String(monthIndex);
    const range = getMonthRange(filterYear.value, monthIndex);
    router.get('/kasir/dashboard', { start_date: range.start, end_date: range.end }, { preserveState: true, replace: true });
}

function selectYear(): void {
    selectedDateMode.value = 'year';
    const range = getYearRange(filterYear.value);
    router.get('/kasir/dashboard', { start_date: range.start, end_date: range.end }, { preserveState: true, replace: true });
}

function onYearNav(): void {
    if (selectedDateMode.value === 'year') {
        selectYear();
    } else if (selectedDateMode.value !== 'custom' && selectedDateMode.value !== 'today') {
        selectMonth(Number(selectedDateMode.value));
    }
}

function prevFilterYear(): void {
    filterYear.value--;
    onYearNav();
}

function nextFilterYear(): void {
    filterYear.value++;
    onYearNav();
}

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

    <div class="flex h-full flex-1 flex-col gap-5 overflow-x-hidden rounded-xl p-4 md:gap-6 md:p-6">
        <!-- Action Grid - Highlighted for Cashiers -->
        <div class="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            <!-- Primary CTA: ditonjolkan (filled) & melebar penuh di mobile -->
            <Link
                :href="transaksiRoute.url()"
                class="col-span-2 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-left text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] md:col-span-1 md:p-5"
            >
                <div class="shrink-0 rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                    <PlusCircle class="h-6 w-6" />
                </div>
                <div class="min-w-0">
                    <h3 class="font-bold">Transaksi Baru</h3>
                    <p class="truncate text-xs text-emerald-50/90">Buka keranjang penjualan</p>
                </div>
            </Link>
            <Link
                href="/kasir/pesanan"
                class="relative flex flex-col items-start gap-2 rounded-2xl border border-sidebar-border/70 bg-card p-4 text-left transition-all hover:bg-slate-50 active:scale-[0.98] md:flex-row md:items-center md:gap-4 md:p-5 dark:border-sidebar-border dark:hover:bg-zinc-800/50"
            >
                <div class="relative shrink-0 rounded-xl bg-indigo-100 p-2.5 text-indigo-600 md:rounded-full md:p-3 dark:bg-indigo-500/15 dark:text-indigo-400">
                    <ClipboardList class="h-5 w-5 md:h-6 md:w-6" />
                    <span
                        v-if="pending_pesanan_count > 0"
                        class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-extrabold text-white"
                    >{{ pending_pesanan_count }}</span>
                </div>
                <div class="min-w-0">
                    <h3 class="text-sm font-bold md:text-base">Pesanan Online</h3>
                    <p class="hidden text-xs text-muted-foreground sm:block">
                        {{ pending_pesanan_count > 0 ? `${pending_pesanan_count} pesanan menunggu` : 'Pesanan dari web' }}
                    </p>
                </div>
            </Link>
            <Link
                :href="riwayatRoute.url()"
                class="flex flex-col items-start gap-2 rounded-2xl border border-sidebar-border/70 bg-card p-4 text-left transition-all hover:bg-slate-50 active:scale-[0.98] md:flex-row md:items-center md:gap-4 md:p-5 dark:border-sidebar-border dark:hover:bg-zinc-800/50"
            >
                <div class="shrink-0 rounded-xl bg-slate-100 p-2.5 text-foreground md:rounded-full md:p-3 dark:bg-zinc-800">
                    <FileText class="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div class="min-w-0">
                    <h3 class="text-sm font-bold md:text-base">Riwayat Transaksi</h3>
                    <p class="hidden text-xs text-muted-foreground sm:block">Cetak ulang struk / penjualan</p>
                </div>
            </Link>
        </div>

        <!-- Promo Hari Ini — dinaikkan ke atas agar langsung terlihat kasir -->
        <div class="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 md:p-6 dark:border-indigo-500/20">
            <div class="flex items-center justify-between gap-2 border-b border-indigo-500/20 pb-4 mb-4">
                <div class="flex items-center gap-2">
                    <div class="rounded-lg bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        <Tag class="h-5 w-5" />
                    </div>
                    <h2 class="text-base font-bold tracking-tight md:text-lg">Promo Hari Ini</h2>
                </div>
                <span
                    v-if="props.active_promos.length"
                    class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                >
                    <span class="relative flex h-2 w-2">
                        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </span>
                    {{ props.active_promos.length }} berlaku
                </span>
            </div>

            <div v-if="props.active_promos.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div
                    v-for="promo in props.active_promos"
                    :key="promo.id_promo"
                    :class="[
                        'rounded-lg border bg-card p-3 transition',
                        promo.berakhir_hari_ini
                            ? 'border-rose-400/50'
                            : 'border-indigo-500/20',
                    ]"
                >
                    <div class="flex items-start justify-between gap-2">
                        <div class="min-w-0">
                            <p class="truncate text-sm font-bold text-indigo-700 dark:text-indigo-300">{{ promo.nama }}</p>
                            <p v-if="promo.deskripsi" class="truncate text-xs text-muted-foreground">{{ promo.deskripsi }}</p>
                        </div>
                        <span class="shrink-0 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">{{ promo.label }}</span>
                    </div>

                    <div class="mt-2 flex flex-wrap items-center gap-1.5">
                        <span class="inline-flex items-center gap-1 rounded-md border border-sidebar-border/50 bg-background/60 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                            <ShoppingBag class="h-3 w-3" />
                            {{ promo.target }}
                        </span>
                        <span
                            v-if="promo.minimal_belanja"
                            class="inline-flex items-center rounded-md border border-sidebar-border/50 bg-background/60 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                        >
                            Min. {{ formatRupiah(promo.minimal_belanja) }}
                        </span>
                        <span
                            v-if="promo.berakhir_hari_ini"
                            class="inline-flex items-center gap-1 rounded-md bg-rose-100 px-1.5 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        >
                            <Clock class="h-3 w-3" />
                            Berakhir hari ini
                        </span>
                        <span
                            v-else-if="promo.mulai_hari_ini"
                            class="inline-flex items-center rounded-md bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        >
                            Baru hari ini
                        </span>
                        <span
                            v-else
                            class="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground dark:bg-zinc-800"
                        >
                            Sisa {{ promo.sisa_hari }} hari
                        </span>
                    </div>

                    <p class="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <CalendarDays class="h-3 w-3" />
                        {{ promo.periode }}
                    </p>
                </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <Tag class="h-8 w-8 text-muted-foreground/40" />
                <p class="text-sm text-muted-foreground">Tidak ada promo berlaku hari ini.</p>
            </div>
        </div>

        <!-- Filter Periode (selaras dashboard & transaksi admin) -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 class="text-lg font-bold tracking-tight">Ringkasan Penjualan</h2>
                <p class="text-sm text-muted-foreground">Periode: {{ periodLabel }}</p>
            </div>

            <div class="relative w-fit">
                <button
                    type="button"
                    class="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition"
                    :class="showDateFilter
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:border-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'border-sidebar-border/70 bg-background text-slate-600 hover:bg-slate-50 dark:border-sidebar-border dark:text-slate-300 dark:hover:bg-zinc-800'"
                    @click="showDateFilter = !showDateFilter"
                >
                    <CalendarDays class="h-4 w-4" />
                    Periode
                    <span class="ml-0.5 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                        {{ periodLabel }}
                    </span>
                </button>

                <Transition
                    enter-active-class="transition ease-out duration-150"
                    enter-from-class="opacity-0 translate-y-1"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-100"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-1"
                >
                    <div
                        v-if="showDateFilter"
                        class="absolute left-0 top-11 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:left-auto sm:right-0 dark:border-zinc-700 dark:bg-zinc-900"
                    >
                        <!-- Hari Ini preset -->
                        <button
                            type="button"
                            class="mb-3 w-full rounded-lg py-2 text-xs font-semibold transition-all"
                            :class="selectedDateMode === 'today'
                                ? 'bg-emerald-500 text-white'
                                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'"
                            @click="selectToday(); showDateFilter = false"
                        >
                            Hari Ini
                        </button>

                        <!-- Year navigator -->
                        <div class="flex items-center gap-0.5">
                            <button
                                type="button"
                                class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800 dark:hover:text-slate-300"
                                @click="prevFilterYear"
                            >
                                <ChevronLeft class="h-4 w-4" />
                            </button>
                            <span class="flex-1 text-center text-sm font-bold text-slate-800 dark:text-slate-100">{{ filterYear }}</span>
                            <button
                                type="button"
                                class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800 dark:hover:text-slate-300"
                                @click="nextFilterYear"
                            >
                                <ChevronRight class="h-4 w-4" />
                            </button>
                        </div>

                        <!-- Month grid + Tahunan + Custom -->
                        <div class="mt-3 grid grid-cols-4 gap-1">
                            <button
                                v-for="(month, i) in MONTHS"
                                :key="i"
                                type="button"
                                class="rounded-lg py-2 text-xs font-semibold transition-all"
                                :class="selectedDateMode === String(i)
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'"
                                @click="selectMonth(i); showDateFilter = false"
                            >
                                {{ month }}
                            </button>
                            <button
                                type="button"
                                class="col-span-4 rounded-lg py-2 text-xs font-semibold transition-all"
                                :class="selectedDateMode === 'year'
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10'"
                                @click="selectYear(); showDateFilter = false"
                            >
                                Setahun Penuh ({{ filterYear }})
                            </button>
                            <button
                                type="button"
                                class="col-span-4 rounded-lg py-2 text-xs font-semibold transition-all"
                                :class="selectedDateMode === 'custom'
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'"
                                @click="selectedDateMode = 'custom'"
                            >
                                Custom
                            </button>
                        </div>

                        <!-- Custom date inputs -->
                        <div
                            v-if="selectedDateMode === 'custom'"
                            class="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-zinc-800"
                        >
                            <div class="grid grid-cols-2 gap-2">
                                <label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Mulai
                                    <input
                                        v-model="form.start_date"
                                        type="date"
                                        class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-emerald-500/20"
                                    />
                                </label>
                                <label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Sampai
                                    <input
                                        v-model="form.end_date"
                                        type="date"
                                        class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-emerald-500/20"
                                    />
                                </label>
                            </div>
                            <button
                                type="button"
                                class="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-500 text-xs font-semibold text-white transition hover:bg-emerald-600"
                                @click="applyRange(); showDateFilter = false"
                            >
                                <CalendarDays class="h-3 w-3" />
                                Terapkan
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <!-- Backdrop untuk menutup filter -->
        <div
            v-if="showDateFilter"
            class="fixed inset-0 z-40"
            @click="showDateFilter = false"
        />

        <!-- Stats Grid -->
        <!-- 2 kolom sampai xl agar nominal besar (mis. total Semua Waktu) tak terpotong di tablet/desktop sempit. -->
        <div class="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
            <div
                v-for="stat in stats"
                :key="stat.name"
                class="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-4 shadow-sm md:p-6 dark:border-sidebar-border"
            >
                <div class="flex items-start justify-between gap-2">
                    <span class="text-xs font-medium text-muted-foreground md:text-sm">{{ stat.name }}</span>
                    <div :class="['shrink-0 rounded-lg border p-1.5 md:p-2', stat.color]">
                        <component :is="stat.icon" class="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                </div>
                <div class="mt-3 md:mt-4">
                    <span class="block truncate text-lg font-bold tracking-tight tabular-nums md:text-2xl">{{ stat.value }}</span>
                </div>
            </div>
        </div>

        <!-- Target Harian -->
        <div class="rounded-xl border border-sidebar-border/70 bg-card p-4 md:p-6 dark:border-sidebar-border">
            <div class="flex items-center justify-between gap-3 mb-3">
                <div class="flex items-center gap-2 min-w-0">
                    <div class="shrink-0 rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Target class="h-5 w-5" />
                    </div>
                    <div class="min-w-0">
                        <h2 class="text-base font-bold tracking-tight md:text-lg">Target Penjualan Hari Ini</h2>
                        <p class="truncate text-xs text-muted-foreground">
                            {{ formatRupiah(props.target.tercapai) }} dari {{ formatRupiah(props.target.harian) }}
                        </p>
                    </div>
                </div>
                <span class="shrink-0 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{{ props.target.persen }}%</span>
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
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            <!-- Left Side: Recent Sales Log -->
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-4 md:col-span-2 md:p-6 dark:border-sidebar-border">
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

                <div v-if="props.recent_transactions.length" class="space-y-2">
                    <Link
                        v-for="trx in props.recent_transactions"
                        :key="trx.id_transaksi"
                        :href="riwayatRoute.url({ query: { search: trx.kode } })"
                        :title="`Lihat detail ${trx.kode} di Riwayat`"
                        class="group flex items-center justify-between gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50 active:scale-[0.99] dark:hover:bg-zinc-800/40"
                    >
                        <div class="flex min-w-0 items-center gap-3">
                            <div class="shrink-0 rounded-full bg-emerald-500/10 p-2 text-emerald-600">
                                <Clock class="h-4 w-4" />
                            </div>
                            <div class="min-w-0">
                                <p class="text-sm font-bold text-indigo-600 dark:text-indigo-400">#{{ trx.kode }}</p>
                                <p class="truncate text-xs text-muted-foreground">{{ trx.items }} item • Pukul {{ trx.waktu }}</p>
                            </div>
                        </div>
                        <div class="flex shrink-0 items-center gap-2">
                            <div class="text-right">
                                <p class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ formatRupiah(trx.total_harga) }}</p>
                                <span class="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    {{ trx.status }}
                                </span>
                            </div>
                            <ChevronRight class="h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                        </div>
                    </Link>
                </div>
                <div v-else class="flex flex-col items-center justify-center gap-2 py-10 text-center">
                    <ShoppingBag class="h-8 w-8 text-muted-foreground/40" />
                    <p class="text-sm text-muted-foreground">Belum ada transaksi. Mulai transaksi pertamamu!</p>
                </div>
            </div>

            <!-- Right Side: Session Summary (real numbers) -->
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-4 md:p-6 dark:border-sidebar-border">
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

        <!-- Operational Row: Stok, Terlaris -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <!-- Stok menipis -->
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-4 md:p-6 dark:border-sidebar-border">
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

            <!-- Produk terlaris -->
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-4 md:p-6 dark:border-sidebar-border">
                <div class="flex items-center gap-2 border-b border-sidebar-border/70 pb-4 mb-4 dark:border-sidebar-border">
                    <div class="rounded-lg bg-yellow-500/10 p-2 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                        <Trophy class="h-5 w-5" />
                    </div>
                    <h2 class="text-base font-bold tracking-tight">Produk Terlaris Saya</h2>
                </div>

                <div v-if="props.best_sellers.length" class="space-y-1">
                    <Link
                        v-for="(item, index) in props.best_sellers"
                        :key="item.id_produk"
                        :href="transaksiRoute.url({ query: { cari: item.nama } })"
                        :title="`Cari & jual ${item.nama} di Transaksi`"
                        class="group -mx-2 flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50 active:scale-[0.99] dark:hover:bg-zinc-800/40"
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
                        <ChevronRight class="h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                    </Link>
                </div>
                <div v-else class="flex flex-col items-center justify-center gap-2 py-8 text-center">
                    <Trophy class="h-8 w-8 text-muted-foreground/40" />
                    <p class="text-sm text-muted-foreground">Belum ada penjualan pada rentang ini.</p>
                </div>
            </div>
        </div>
    </div>
</template>
