<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import {
    BarChart3,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Filter,
    Package,
    Percent,
    Printer,
    Receipt,
    TrendingUp,
    Trophy,
    Users,
    Wallet,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Admin Dashboard',
                href: '/admin/dashboard',
            },
        ],
    },
});

interface ChartPoint {
    label: string;
    value: number;
}

interface ProductItem {
    nama: string;
    qty: number;
    revenue: number;
}

interface CashierItem {
    nama: string;
    transactions: number;
    revenue: number;
}

interface WorstProductItem {
    nama: string;
    qty: number;
    revenue: number;
}

const props = defineProps<{
    stats: {
        total_revenue: number;
        total_transactions: number;
        average_order_value: number;
        total_items_sold: number;
        total_expenses: number;
        sales_margin: number;
        net_profit: number;
    };
    revenue_chart: ChartPoint[];
    sales_trend: ChartPoint[];
    top_sales_dates: ChartPoint[];
    top_sales_hours: ChartPoint[];
    best_selling_products: ProductItem[];
    worst_selling_products: WorstProductItem[];
    cashier_achievements: CashierItem[];
    top_cashiers_by_transactions: CashierItem[];
    top_cashiers_by_revenue: CashierItem[];
    date_range: {
        start_date: string;
        end_date: string;
    };
}>();

const form = useForm({
    start_date: props.date_range.start_date,
    end_date: props.date_range.end_date,
});

const showFilter = ref(false);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function getMonthRange(year: number, month: number) {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return {
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10),
    };
}

function detectInitialYear(): number {
    return props.date_range.start_date ? new Date(props.date_range.start_date + 'T00:00:00').getFullYear() : new Date().getFullYear();
}

const filterYear = ref(detectInitialYear());

function detectInitialMode(): string {
    const today = new Date().toISOString().slice(0, 10);
    if (props.date_range.start_date === today && props.date_range.end_date === today) {
        return 'today';
    }
    for (let m = 0; m < 12; m++) {
        const range = getMonthRange(filterYear.value, m);
        if (range.start === props.date_range.start_date && range.end === props.date_range.end_date) {
            return String(m);
        }
    }
    return 'custom';
}

const selectedMode = ref(detectInitialMode());

const filterBadgeLabel = computed(() => {
    if (selectedMode.value === 'today') return 'Hari Ini';
    if (selectedMode.value !== 'custom') return `${MONTHS[Number(selectedMode.value)]} ${filterYear.value}`;
    return 'Custom';
});

function selectMonth(monthIndex: number): void {
    selectedMode.value = String(monthIndex);
    const range = getMonthRange(filterYear.value, monthIndex);
    router.get('/admin/dashboard', {
        start_date: range.start,
        end_date: range.end,
    }, { preserveState: true, replace: true });
}

function selectCustom(): void {
    selectedMode.value = 'custom';
}

function selectToday(): void {
    selectedMode.value = 'today';
    const today = new Date().toISOString().slice(0, 10);
    router.get('/admin/dashboard', {
        start_date: today,
        end_date: today,
    }, { preserveState: true, replace: true });
}

function prevYear(): void {
    filterYear.value--;
    if (selectedMode.value !== 'custom' && selectedMode.value !== 'today') {
        selectMonth(Number(selectedMode.value));
    }
}

function nextYear(): void {
    filterYear.value++;
    if (selectedMode.value !== 'custom' && selectedMode.value !== 'today') {
        selectMonth(Number(selectedMode.value));
    }
}

const maxRevenue = computed(() => Math.max(...props.revenue_chart.map((point) => point.value), 1));
const maxSales = computed(() => Math.max(...props.sales_trend.map((point) => point.value), 1));
const maxBestSellerQty = computed(() => Math.max(...props.best_selling_products.map((product) => product.qty), 1));
const maxTopDates = computed(() => Math.max(...props.top_sales_dates.map((point) => point.value), 1));
const maxTopHours = computed(() => Math.max(...props.top_sales_hours.map((point) => point.value), 1));
const maxCashierTransactions = computed(() => Math.max(...props.top_cashiers_by_transactions.map((cashier) => cashier.transactions), 1));
const maxCashierRevenue = computed(() => Math.max(...props.top_cashiers_by_revenue.map((cashier) => cashier.revenue), 1));

const performanceColumns = computed(() => props.revenue_chart.map((point) => {
    const salesPoint = props.sales_trend.find((item) => item.label === point.label);
    const salesValue = salesPoint?.value ?? 0;

    return {
        label: point.label,
        revenue: point.value,
        sales: salesValue,
        revenueHeight: `${Math.max(Math.round((point.value / maxRevenue.value) * 100), point.value > 0 ? 8 : 0)}%`,
        salesHeight: `${Math.max(Math.round((salesValue / maxSales.value) * 100), salesValue > 0 ? 8 : 0)}%`,
    };
}));

const bestSellingGraph = computed(() => props.best_selling_products.map((product) => ({
    ...product,
    width: `${Math.round((product.qty / maxBestSellerQty.value) * 100)}%`,
})));

const topDatesGraph = computed(() => props.top_sales_dates.map((point) => ({
    label: point.label,
    value: point.value,
    width: `${Math.round((point.value / maxTopDates.value) * 100)}%`,
})));

const topHoursGraph = computed(() => props.top_sales_hours.map((point) => ({
    label: point.label,
    value: point.value,
    width: `${Math.round((point.value / maxTopHours.value) * 100)}%`,
})));

const topCashierTransactionsGraph = computed(() => props.top_cashiers_by_transactions.map((cashier) => ({
    ...cashier,
    width: `${Math.round((cashier.transactions / maxCashierTransactions.value) * 100)}%`,
})));

const topCashierRevenueGraph = computed(() => props.top_cashiers_by_revenue.map((cashier) => ({
    ...cashier,
    width: `${Math.round((cashier.revenue / maxCashierRevenue.value) * 100)}%`,
})));

const bestProduct = computed(() => props.best_selling_products[0]);
const bestCashierByRevenue = computed(() => props.top_cashiers_by_revenue[0]);
const bestCashierByTransactions = computed(() => props.top_cashiers_by_transactions[0]);
const busiestDate = computed(() => props.top_sales_dates[0]);
const busiestHour = computed(() => props.top_sales_hours[0]);

function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

function formatCompactRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
}

function applyRange(): void {
    router.get('/admin/dashboard', {
        start_date: form.start_date,
        end_date: form.end_date,
    }, {
        preserveState: true,
        replace: true,
    });
}

function buildTableHtml(title: string, columns: string[], rows: string[][]): string {
    return `
        <section>
            <h2>${title}</h2>
            <table>
                <thead>
                    <tr>${columns.map((column) => `<th>${column}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${rows.map((row) => `<tr>${row.map((column) => `<td>${column}</td>`).join('')}</tr>`).join('')}
                </tbody>
            </table>
        </section>
    `;
}

function openPrintWindow(html: string): void {
    const printWindow = window.open('', '_blank', 'width=960,height=720');

    if (!printWindow) {
        window.alert('Tidak dapat membuka jendela cetak. Pastikan pop-up tidak diblokir.');

        return;
    }

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

function reportShell(title: string, body: string): string {
    return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<style>
    body { color: #0f172a; font-family: Arial, sans-serif; margin: 0; padding: 28px; }
    h1 { font-size: 24px; margin: 0 0 8px; }
    h2 { font-size: 16px; margin: 24px 0 10px; }
    p { color: #475569; margin: 0 0 18px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border-bottom: 1px solid #e2e8f0; padding: 10px 8px; text-align: left; }
    th { background: #f8fafc; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; }
    .summary { display: grid; gap: 12px; grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 20px 0; }
    .metric { border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
    .metric span { color: #64748b; display: block; font-size: 12px; margin-bottom: 8px; }
    .metric strong { font-size: 18px; }
</style>
</head>
<body>
    <h1>${title}</h1>
    <p>Periode: ${form.start_date} - ${form.end_date}</p>
    ${body}
</body>
</html>`;
}

function printReport(): void {
    if (typeof window === 'undefined') {
        return;
    }

    const sections = [
        {
            title: 'Produk Paling Laku',
            columns: ['Produk', 'Qty', 'Omzet'],
            rows: props.best_selling_products.map((product) => [product.nama, `${product.qty}`, formatRupiah(product.revenue)]),
        },
        {
            title: 'Karyawan Omzet Terbanyak',
            columns: ['Karyawan', 'Transaksi', 'Omzet'],
            rows: props.top_cashiers_by_revenue.map((cashier) => [cashier.nama, `${cashier.transactions}`, formatRupiah(cashier.revenue)]),
        },
        {
            title: 'Karyawan Transaksi Terbanyak',
            columns: ['Karyawan', 'Transaksi', 'Omzet'],
            rows: props.top_cashiers_by_transactions.map((cashier) => [cashier.nama, `${cashier.transactions}`, formatRupiah(cashier.revenue)]),
        },
        {
            title: 'Tanggal Transaksi Terbanyak',
            columns: ['Tanggal', 'Transaksi'],
            rows: props.top_sales_dates.map((item) => [item.label, `${item.value}`]),
        },
        {
            title: 'Jam Transaksi Terbanyak',
            columns: ['Jam', 'Transaksi'],
            rows: props.top_sales_hours.map((item) => [item.label, `${item.value}`]),
        },
    ];

    const summaryHtml = `
        <div class="summary">
            <div class="metric"><span>Omzet</span><strong>${formatRupiah(props.stats.total_revenue)}</strong></div>
            <div class="metric"><span>Pengeluaran</span><strong>${formatRupiah(props.stats.total_expenses)}</strong></div>
            <div class="metric"><span>Margin</span><strong>${props.stats.sales_margin.toFixed(2)}%</strong></div>
            <div class="metric"><span>Total Penjualan</span><strong>${props.stats.total_transactions} transaksi</strong></div>
        </div>
        ${sections.map((section) => buildTableHtml(section.title, section.columns, section.rows)).join('')}
    `;

    openPrintWindow(reportShell('Laporan Dashboard Admin', summaryHtml));
}

function printSection(section: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    const sectionMap: Record<string, { title: string; columns: string[]; rows: string[][] }> = {
        best_sellers: {
            title: 'Produk Paling Laku',
            columns: ['Produk', 'Qty', 'Omzet'],
            rows: props.best_selling_products.map((product) => [product.nama, `${product.qty}`, formatRupiah(product.revenue)]),
        },
        top_cashier_revenue: {
            title: 'Karyawan Omzet Terbanyak',
            columns: ['Karyawan', 'Transaksi', 'Omzet'],
            rows: props.top_cashiers_by_revenue.map((cashier) => [cashier.nama, `${cashier.transactions}`, formatRupiah(cashier.revenue)]),
        },
        top_cashier_transactions: {
            title: 'Karyawan Transaksi Terbanyak',
            columns: ['Karyawan', 'Transaksi', 'Omzet'],
            rows: props.top_cashiers_by_transactions.map((cashier) => [cashier.nama, `${cashier.transactions}`, formatRupiah(cashier.revenue)]),
        },
        top_dates: {
            title: 'Tanggal Transaksi Terbanyak',
            columns: ['Tanggal', 'Transaksi'],
            rows: props.top_sales_dates.map((item) => [item.label, `${item.value}`]),
        },
        top_hours: {
            title: 'Jam Transaksi Terbanyak',
            columns: ['Jam', 'Transaksi'],
            rows: props.top_sales_hours.map((item) => [item.label, `${item.value}`]),
        },
    };

    const selectedSection = sectionMap[section];

    if (!selectedSection) {
        return;
    }

    openPrintWindow(reportShell(selectedSection.title, buildTableHtml(selectedSection.title, selectedSection.columns, selectedSection.rows)));
}
</script>

<template>
    <Head title="Admin Dashboard" />

    <div class="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-slate-50 p-6 text-slate-950 dark:bg-zinc-950 dark:text-slate-100">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Dashboard Admin</p>
                <h1 class="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Ringkasan Performa Bisnis</h1>
            </div>

            <div class="flex shrink-0 items-center gap-2">
                <!-- Filter button + dropdown -->
                <div class="relative">
                    <button
                        type="button"
                        class="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition"
                        :class="showFilter
                            ? 'border-sky-500 bg-sky-50 text-sky-600 dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-400'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800'"
                        @click="showFilter = !showFilter"
                    >
                        <Filter class="h-4 w-4" />
                        Filter
                        <span class="ml-0.5 rounded-md bg-sky-100 px-1.5 py-0.5 text-[11px] font-bold text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
                            {{ filterBadgeLabel }}
                        </span>
                    </button>

                    <!-- Dropdown panel -->
                    <Transition
                        enter-active-class="transition ease-out duration-150"
                        enter-from-class="opacity-0 translate-y-1"
                        enter-to-class="opacity-100 translate-y-0"
                        leave-active-class="transition ease-in duration-100"
                        leave-from-class="opacity-100 translate-y-0"
                        leave-to-class="opacity-0 translate-y-1"
                    >
                        <div
                            v-if="showFilter"
                            class="absolute right-0 top-11 z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                        >
                            <!-- Hari Ini preset -->
                            <button
                                type="button"
                                class="mb-3 w-full rounded-lg py-2 text-xs font-semibold transition-all"
                                :class="selectedMode === 'today'
                                    ? 'bg-sky-500 text-white'
                                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'"
                                @click="selectToday(); showFilter = false"
                            >
                                Hari Ini
                            </button>

                            <!-- Year navigator -->
                            <div class="flex items-center gap-0.5">
                                <button
                                    type="button"
                                    class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800 dark:hover:text-slate-300"
                                    @click="prevYear"
                                >
                                    <ChevronLeft class="h-4 w-4" />
                                </button>
                                <span class="flex-1 text-center text-sm font-bold text-slate-800 dark:text-slate-100">{{ filterYear }}</span>
                                <button
                                    type="button"
                                    class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800 dark:hover:text-slate-300"
                                    @click="nextYear"
                                >
                                    <ChevronRight class="h-4 w-4" />
                                </button>
                            </div>

                            <!-- Month grid -->
                            <div class="mt-3 grid grid-cols-4 gap-1">
                                <button
                                    v-for="(month, i) in MONTHS"
                                    :key="i"
                                    type="button"
                                    class="rounded-lg py-2 text-xs font-semibold transition-all"
                                    :class="selectedMode === String(i)
                                        ? 'bg-sky-500 text-white'
                                        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'"
                                    @click="selectMonth(i); showFilter = false"
                                >
                                    {{ month }}
                                </button>
                                <button
                                    type="button"
                                    class="col-span-4 rounded-lg py-2 text-xs font-semibold transition-all"
                                    :class="selectedMode === 'custom'
                                        ? 'bg-sky-500 text-white'
                                        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'"
                                    @click="selectCustom"
                                >
                                    Custom
                                </button>
                            </div>

                            <!-- Custom date inputs -->
                            <div
                                v-if="selectedMode === 'custom'"
                                class="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-zinc-800"
                            >
                                <div class="grid grid-cols-2 gap-2">
                                    <label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        Mulai
                                        <input
                                            v-model="form.start_date"
                                            type="date"
                                            class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-sky-500/20"
                                        />
                                    </label>
                                    <label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        Sampai
                                        <input
                                            v-model="form.end_date"
                                            type="date"
                                            class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-sky-500/20"
                                        />
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    class="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-sky-500 text-xs font-semibold text-white transition hover:bg-sky-600"
                                    @click="applyRange(); showFilter = false"
                                >
                                    <Filter class="h-3 w-3" />
                                    Terapkan
                                </button>
                            </div>
                        </div>
                    </Transition>
                </div>

                <!-- Print button -->
                <button
                    type="button"
                    class="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800"
                    @click="printReport"
                >
                    <Printer class="h-4 w-4" />
                    Cetak
                </button>
            </div>
        </div>

        <!-- Backdrop to close filter -->
        <div
            v-if="showFilter"
            class="fixed inset-0 z-40"
            @click="showFilter = false"
        />

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Omzet</p>
                        <p class="mt-2 text-2xl font-bold">{{ formatRupiah(props.stats.total_revenue) }}</p>
                    </div>
                    <div class="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <Wallet class="h-5 w-5" />
                    </div>
                </div>
                <p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">AOV {{ formatRupiah(props.stats.average_order_value) }}</p>
            </div>

            <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Pengeluaran</p>
                        <p class="mt-2 text-2xl font-bold">{{ formatRupiah(props.stats.total_expenses) }}</p>
                    </div>
                    <div class="flex h-11 w-11 items-center justify-center rounded-md bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                        <Receipt class="h-5 w-5" />
                    </div>
                </div>
                <p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">Laba bersih {{ formatRupiah(props.stats.net_profit) }}</p>
            </div>

            <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Margin</p>
                        <p class="mt-2 text-2xl font-bold">{{ props.stats.sales_margin.toFixed(2) }}%</p>
                    </div>
                    <div class="flex h-11 w-11 items-center justify-center rounded-md bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                        <Percent class="h-5 w-5" />
                    </div>
                </div>
                <p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">Laba bersih {{ formatRupiah(props.stats.net_profit) }}</p>
            </div>

            <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Penjualan</p>
                        <p class="mt-2 text-2xl font-bold">{{ props.stats.total_transactions }} trx</p>
                    </div>
                    <div class="flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                        <BarChart3 class="h-5 w-5" />
                    </div>
                </div>
                <p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">{{ props.stats.total_items_sold }} produk terjual</p>
            </div>
        </div>

        <div class="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
            <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div class="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 class="text-lg font-semibold">Grafik Omzet & Transaksi</h2>
                        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ props.date_range.start_date }} - {{ props.date_range.end_date }}</p>
                    </div>
                    <div class="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span class="inline-flex items-center gap-2"><span class="h-3 w-3 rounded-sm bg-sky-500"></span>Omzet</span>
                        <span class="inline-flex items-center gap-2"><span class="h-3 w-3 rounded-sm bg-emerald-500"></span>Transaksi</span>
                    </div>
                </div>

                <div class="mt-5 overflow-x-auto">
                    <div class="flex h-80 min-w-[760px] items-end gap-3 border-b border-slate-200 px-1 pb-8 dark:border-zinc-800">
                        <div v-for="item in performanceColumns" :key="item.label" class="group relative flex h-full flex-1 min-w-9 flex-col items-center justify-end gap-2">
                            <div class="absolute bottom-[calc(100%+0.75rem)] hidden rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg group-hover:block dark:border-zinc-700 dark:bg-zinc-950">
                                <p class="font-semibold">{{ item.label }}</p>
                                <p class="mt-1 whitespace-nowrap text-slate-500 dark:text-slate-400">{{ formatRupiah(item.revenue) }}</p>
                                <p class="whitespace-nowrap text-slate-500 dark:text-slate-400">{{ item.sales }} transaksi</p>
                            </div>
                            <div class="flex h-full w-full items-end justify-center gap-1.5">
                                <div class="w-3 rounded-t-md bg-sky-500 transition-all duration-300" :style="{ height: item.revenueHeight }"></div>
                                <div class="w-3 rounded-t-md bg-emerald-500 transition-all duration-300" :style="{ height: item.salesHeight }"></div>
                            </div>
                            <span class="absolute -bottom-7 whitespace-nowrap text-[11px] font-medium text-slate-500 dark:text-slate-400">{{ item.label }}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div class="border-b border-slate-200 pb-4 dark:border-zinc-800">
                    <h2 class="text-lg font-semibold">Sorotan</h2>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Peringkat teratas pada periode aktif</p>
                </div>
                <div class="mt-5 grid gap-3">
                    <div class="rounded-md border border-slate-200 p-4 dark:border-zinc-800">
                        <div class="flex items-start gap-3">
                            <Package class="mt-0.5 h-5 w-5 text-sky-600 dark:text-sky-300" />
                            <div>
                                <p class="text-sm font-semibold">Produk paling laku</p>
                                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ bestProduct?.nama ?? 'Belum ada data' }}</p>
                                <p v-if="bestProduct" class="mt-2 text-lg font-bold">{{ bestProduct.qty }} pcs</p>
                            </div>
                        </div>
                    </div>
                    <div class="rounded-md border border-slate-200 p-4 dark:border-zinc-800">
                        <div class="flex items-start gap-3">
                            <Trophy class="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-300" />
                            <div>
                                <p class="text-sm font-semibold">Karyawan omzet terbanyak</p>
                                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ bestCashierByRevenue?.nama ?? 'Belum ada data' }}</p>
                                <p v-if="bestCashierByRevenue" class="mt-2 text-lg font-bold">{{ formatRupiah(bestCashierByRevenue.revenue) }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="rounded-md border border-slate-200 p-4 dark:border-zinc-800">
                        <div class="flex items-start gap-3">
                            <Users class="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                            <div>
                                <p class="text-sm font-semibold">Karyawan transaksi terbanyak</p>
                                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ bestCashierByTransactions?.nama ?? 'Belum ada data' }}</p>
                                <p v-if="bestCashierByTransactions" class="mt-2 text-lg font-bold">{{ bestCashierByTransactions.transactions }} trx</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div class="grid gap-4 xl:grid-cols-3">
            <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div class="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-zinc-800">
                    <div>
                        <h2 class="text-lg font-semibold">Produk Paling Laku</h2>
                        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Berdasarkan jumlah item terjual</p>
                    </div>
                    <button
                        type="button"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-slate-300 dark:hover:bg-zinc-800"
                        title="Cetak produk paling laku"
                        @click="printSection('best_sellers')"
                    >
                        <Printer class="h-4 w-4" />
                    </button>
                </div>
                <div class="mt-5 space-y-4">
                    <div v-for="product in bestSellingGraph" :key="product.nama">
                        <div class="flex items-center justify-between gap-4 text-sm">
                            <span class="min-w-0 truncate font-semibold">{{ product.nama }}</span>
                            <span class="shrink-0 text-slate-500 dark:text-slate-400">{{ product.qty }} pcs</span>
                        </div>
                        <div class="mt-2 h-2 rounded-full bg-slate-100 dark:bg-zinc-800">
                            <div class="h-full rounded-full bg-sky-500" :style="{ width: product.width }"></div>
                        </div>
                        <p class="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{{ formatRupiah(product.revenue) }}</p>
                    </div>
                    <p v-if="bestSellingGraph.length === 0" class="text-sm text-slate-500 dark:text-slate-400">Belum ada data produk.</p>
                </div>
            </section>

            <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div class="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-zinc-800">
                    <div>
                        <h2 class="text-lg font-semibold">Tanggal Transaksi Terbanyak</h2>
                        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ busiestDate?.label ?? 'Belum ada data' }}</p>
                    </div>
                    <button
                        type="button"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-slate-300 dark:hover:bg-zinc-800"
                        title="Cetak tanggal transaksi terbanyak"
                        @click="printSection('top_dates')"
                    >
                        <Printer class="h-4 w-4" />
                    </button>
                </div>
                <div class="mt-5 space-y-4">
                    <div v-for="item in topDatesGraph" :key="item.label">
                        <div class="flex items-center justify-between gap-4 text-sm">
                            <span class="font-semibold">{{ item.label }}</span>
                            <span class="text-slate-500 dark:text-slate-400">{{ item.value }} trx</span>
                        </div>
                        <div class="mt-2 h-2 rounded-full bg-slate-100 dark:bg-zinc-800">
                            <div class="h-full rounded-full bg-amber-500" :style="{ width: item.width }"></div>
                        </div>
                    </div>
                    <p v-if="topDatesGraph.length === 0" class="text-sm text-slate-500 dark:text-slate-400">Belum ada data tanggal.</p>
                </div>
            </section>

            <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div class="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-zinc-800">
                    <div>
                        <h2 class="text-lg font-semibold">Jam Transaksi Terbanyak</h2>
                        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ busiestHour?.label ?? 'Belum ada data' }}</p>
                    </div>
                    <button
                        type="button"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-slate-300 dark:hover:bg-zinc-800"
                        title="Cetak jam transaksi terbanyak"
                        @click="printSection('top_hours')"
                    >
                        <Printer class="h-4 w-4" />
                    </button>
                </div>
                <div class="mt-5 space-y-4">
                    <div v-for="item in topHoursGraph" :key="item.label">
                        <div class="flex items-center justify-between gap-4 text-sm">
                            <span class="font-semibold">{{ item.label }}</span>
                            <span class="text-slate-500 dark:text-slate-400">{{ item.value }} trx</span>
                        </div>
                        <div class="mt-2 h-2 rounded-full bg-slate-100 dark:bg-zinc-800">
                            <div class="h-full rounded-full bg-emerald-500" :style="{ width: item.width }"></div>
                        </div>
                    </div>
                    <p v-if="topHoursGraph.length === 0" class="text-sm text-slate-500 dark:text-slate-400">Belum ada data jam.</p>
                </div>
            </section>
        </div>

        <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div class="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 class="text-lg font-semibold">Karyawan Dengan Omzet / Transaksi Terbanyak</h2>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Perbandingan performa kasir pada periode aktif</p>
                </div>
                <div class="flex items-center gap-2">
                    <button
                        type="button"
                        class="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-slate-300 dark:hover:bg-zinc-800"
                        @click="printSection('top_cashier_revenue')"
                    >
                        <Printer class="h-4 w-4" />
                        Omzet
                    </button>
                    <button
                        type="button"
                        class="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-slate-300 dark:hover:bg-zinc-800"
                        @click="printSection('top_cashier_transactions')"
                    >
                        <Printer class="h-4 w-4" />
                        Transaksi
                    </button>
                </div>
            </div>

            <div class="mt-5 grid gap-6 lg:grid-cols-2">
                <div>
                    <div class="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        <TrendingUp class="h-4 w-4 text-sky-600 dark:text-sky-300" />
                        Omzet terbanyak
                    </div>
                    <div class="space-y-4">
                        <div v-for="cashier in topCashierRevenueGraph" :key="cashier.nama">
                            <div class="flex items-center justify-between gap-4 text-sm">
                                <span class="min-w-0 truncate font-semibold">{{ cashier.nama }}</span>
                                <span class="shrink-0 text-slate-500 dark:text-slate-400">{{ formatCompactRupiah(cashier.revenue) }}</span>
                            </div>
                            <div class="mt-2 h-2 rounded-full bg-slate-100 dark:bg-zinc-800">
                                <div class="h-full rounded-full bg-sky-500" :style="{ width: cashier.width }"></div>
                            </div>
                            <p class="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{{ cashier.transactions }} transaksi</p>
                        </div>
                        <p v-if="topCashierRevenueGraph.length === 0" class="text-sm text-slate-500 dark:text-slate-400">Belum ada data karyawan.</p>
                    </div>
                </div>

                <div>
                    <div class="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        <Users class="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                        Transaksi terbanyak
                    </div>
                    <div class="space-y-4">
                        <div v-for="cashier in topCashierTransactionsGraph" :key="cashier.nama">
                            <div class="flex items-center justify-between gap-4 text-sm">
                                <span class="min-w-0 truncate font-semibold">{{ cashier.nama }}</span>
                                <span class="shrink-0 text-slate-500 dark:text-slate-400">{{ cashier.transactions }} trx</span>
                            </div>
                            <div class="mt-2 h-2 rounded-full bg-slate-100 dark:bg-zinc-800">
                                <div class="h-full rounded-full bg-emerald-500" :style="{ width: cashier.width }"></div>
                            </div>
                            <p class="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{{ formatRupiah(cashier.revenue) }}</p>
                        </div>
                        <p v-if="topCashierTransactionsGraph.length === 0" class="text-sm text-slate-500 dark:text-slate-400">Belum ada data karyawan.</p>
                    </div>
                </div>
            </div>
        </section>

        <div class="grid gap-4 md:grid-cols-2">
            <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div class="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <CalendarDays class="h-4 w-4 text-amber-600 dark:text-amber-300" />
                    Puncak tanggal
                </div>
                <div class="text-2xl font-bold">{{ busiestDate?.label ?? '-' }}</div>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ busiestDate?.value ?? 0 }} transaksi</p>
            </section>

            <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div class="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <Clock3 class="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                    Puncak jam
                </div>
                <div class="text-2xl font-bold">{{ busiestHour?.label ?? '-' }}</div>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ busiestHour?.value ?? 0 }} transaksi</p>
            </section>
        </div>
    </div>
</template>
