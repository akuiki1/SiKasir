<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import { DollarSign, Printer, TrendingUp, Wallet, Receipt, Percent } from 'lucide-vue-next';
import { computed } from 'vue';

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

interface ProfitProductItem {
    nama: string;
    profit: number;
    transactions: number;
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
        gross_profit: number;
        net_profit: number;
    };
    revenue_chart: ChartPoint[];
    sales_trend: ChartPoint[];
    top_sales_dates: ChartPoint[];
    top_sales_hours: ChartPoint[];
    best_selling_products: ProductItem[];
    worst_selling_products: WorstProductItem[];
    cashier_achievements: CashierItem[];
    best_profit_products: ProfitProductItem[];
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

const maxRevenue = computed(() => Math.max(...props.revenue_chart.map((point) => point.value), 1));
const maxSales = computed(() => Math.max(...props.sales_trend.map((point) => point.value), 1));
const maxTopDates = computed(() => Math.max(...props.top_sales_dates.map((point) => point.value), 1));
const maxTopHours = computed(() => Math.max(...props.top_sales_hours.map((point) => point.value), 1));
const maxCashierTransactions = computed(() => Math.max(...props.cashier_achievements.map((cashier) => cashier.transactions), 1));
const maxCashierRevenue = computed(() => Math.max(...props.cashier_achievements.map((cashier) => cashier.revenue), 1));
const maxProfitMargin = computed(() => Math.max(...props.best_profit_products.map((product) => product.profit), 1));

const trendGraph = computed(() => props.revenue_chart.map((point) => {
    const salesPoint = props.sales_trend.find((item) => item.label === point.label);

    return {
        label: point.label,
        revenue: point.value,
        sales: salesPoint?.value ?? 0,
        revenueWidth: `${Math.round((point.value / maxRevenue.value) * 100)}%`,
        salesWidth: `${Math.round(((salesPoint?.value ?? 0) / maxSales.value) * 100)}%`,
    };
}));

const bestSellingGraph = computed(() => {
    const maxQty = Math.max(...props.best_selling_products.map((product) => product.qty), 1);

    return props.best_selling_products.map((product) => ({
        ...product,
        width: `${Math.round((product.qty / maxQty) * 100)}%`,
    }));
});

const worstSellingGraph = computed(() => {
    const maxQty = Math.max(...props.worst_selling_products.map((product) => product.qty), 1);

    return props.worst_selling_products.map((product) => ({
        ...product,
        width: `${Math.round((product.qty / maxQty) * 100)}%`,
    }));
});

const profitGraph = computed(() => props.best_profit_products.map((product) => ({
    ...product,
    width: `${Math.round((product.profit / maxProfitMargin.value) * 100)}%`,
})));

function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
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
        <div class="section">
            <h2>${title}</h2>
            <table>
                <thead>
                    <tr>${columns.map((column) => `<th>${column}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${rows.map((row) => `<tr>${row.map((column) => `<td>${column}</td>`).join('')}</tr>`).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function openPrintWindow(html: string): void {
    const win = window.open('', '_blank', 'width=900,height=700');

    if (!win) {
        window.alert('Tidak dapat membuka jendela cetak. Pastikan pop-up tidak diblokir.');

        return;
    }

    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
}

function printReport(): void {
    if (typeof window === 'undefined') {
        return;
    }

    const sections = [
        {
            title: 'Produk Terlaris',
            columns: ['Produk', 'Qty', 'Pendapatan'],
            rows: props.best_selling_products.map((product) => [product.nama, `${product.qty}`, formatRupiah(product.revenue)]),
        },
        {
            title: 'Produk Paling Tidak Laku',
            columns: ['Produk', 'Qty', 'Pendapatan'],
            rows: props.worst_selling_products.map((product) => [product.nama, `${product.qty}`, formatRupiah(product.revenue)]),
        },
        {
            title: 'Tanggal Penjualan Terbanyak',
            columns: ['Tanggal', 'Transaksi'],
            rows: props.top_sales_dates.map((item) => [item.label, `${item.value}`]),
        },
        {
            title: 'Waktu Penjualan Terbanyak',
            columns: ['Jam', 'Transaksi'],
            rows: props.top_sales_hours.map((item) => [item.label, `${item.value}`]),
        },
        {
            title: 'Pencapaian Kasir',
            columns: ['Kasir', 'Transaksi', 'Pendapatan'],
            rows: props.cashier_achievements.map((cashier) => [cashier.nama, `${cashier.transactions}`, formatRupiah(cashier.revenue)]),
        },
        {
            title: 'Profit Produk Teratas',
            columns: ['Produk', 'Keuntungan', 'Transaksi'],
            rows: props.best_profit_products.map((product) => [product.nama, formatRupiah(product.profit), `${product.transactions}`]),
        },
    ];

    const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Laporan Dashboard Admin</title>
<style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 24px; color: #111; }
    h1, h2 { margin: 0 0 12px 0; }
    .section { margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { padding: 8px 6px; border: 1px solid #ddd; text-align: left; }
    .summary { display: flex; gap: 16px; flex-wrap: wrap; }
    .card { padding: 12px; border: 1px solid #ddd; border-radius: 8px; flex: 1 1 200px; }
</style>
</head>
<body>
    <h1>Laporan Dashboard Admin</h1>
    <p>Periode: ${form.start_date} — ${form.end_date}</p>
    <div class="section summary">
        <div class="card"><strong>Total Pendapatan</strong><div>${formatRupiah(props.stats.total_revenue)}</div></div>
        <div class="card"><strong>Total Pengeluaran</strong><div>${formatRupiah(props.stats.total_expenses)}</div></div>
        <div class="card"><strong>Sales Margin</strong><div>${props.stats.sales_margin.toFixed(2)}%</div></div>
        <div class="card"><strong>Total Transaksi</strong><div>${props.stats.total_transactions}</div></div>
    </div>
    ${sections.map((section) => buildTableHtml(section.title, section.columns, section.rows)).join('')}
</body>
</html>`;

    openPrintWindow(html);
}

function printSection(section: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    let title = '';
    let columns: string[] = [];
    let rows: string[][] = [];

    switch (section) {
        case 'best_sellers':
            title = 'Produk Terlaris';
            columns = ['Produk', 'Qty', 'Pendapatan'];
            rows = props.best_selling_products.map((product) => [product.nama, `${product.qty}`, formatRupiah(product.revenue)]);
            break;
        case 'worst_sellers':
            title = 'Produk Paling Tidak Laku';
            columns = ['Produk', 'Qty', 'Pendapatan'];
            rows = props.worst_selling_products.map((product) => [product.nama, `${product.qty}`, formatRupiah(product.revenue)]);
            break;
        case 'top_dates':
            title = 'Tanggal Penjualan Terbanyak';
            columns = ['Tanggal', 'Transaksi'];
            rows = props.top_sales_dates.map((item) => [item.label, `${item.value}`]);
            break;
        case 'top_hours':
            title = 'Waktu Penjualan Terbanyak';
            columns = ['Jam', 'Transaksi'];
            rows = props.top_sales_hours.map((item) => [item.label, `${item.value}`]);
            break;
        case 'cashier_achievements':
            title = 'Pencapaian Kasir';
            columns = ['Kasir', 'Transaksi', 'Pendapatan'];
            rows = props.cashier_achievements.map((cashier) => [cashier.nama, `${cashier.transactions}`, formatRupiah(cashier.revenue)]);
            break;
        case 'profit_products':
            title = 'Profit Produk Teratas';
            columns = ['Produk', 'Keuntungan', 'Transaksi'];
            rows = props.best_profit_products.map((product) => [product.nama, formatRupiah(product.profit), `${product.transactions}`]);
            break;

        default:

            return;
    }

    const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 24px; color: #111; }
    h1, h2 { margin: 0 0 12px 0; }
    .section { margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { padding: 8px 6px; border: 1px solid #ddd; text-align: left; }
</style>
</head>
<body>
    <h1>${title}</h1>
    <p>Periode: ${form.start_date} — ${form.end_date}</p>
    ${buildTableHtml(title, columns, rows)}
</body>
</html>`;

    openPrintWindow(html);
}

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
</script>

<template>
    <Head title="Admin Dashboard" />

    <div class="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="space-y-2">
                <p class="text-sm uppercase tracking-[0.2em] text-muted-foreground">Dashboard Admin</p>
                <h1 class="text-3xl font-extrabold tracking-tight">Analitik Penjualan & Kinerja Bisnis</h1>
                <p class="max-w-2xl text-sm text-muted-foreground">
                    Gunakan filter rentang tanggal untuk melihat performa pendapatan, produk terlaris, tren penjualan, dan daftar kasir terbaik.
                </p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    @click="printReport"
                >
                    <Printer class="h-4 w-4" />
                    Cetak Laporan
                </button>
                <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:hover:bg-zinc-800"
                    @click="applyRange"
                >
                    Terapkan Filter
                </button>
            </div>
        </div>

        <div class="grid gap-4 lg:grid-cols-[280px_auto]">
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                <h2 class="text-lg font-semibold">Rentang Tanggal</h2>
                <div class="mt-4 space-y-4">
                    <label class="block text-sm font-medium">Mulai</label>
                    <input
                        type="date"
                        v-model="form.start_date"
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                    <label class="block text-sm font-medium">Sampai</label>
                    <input
                        type="date"
                        v-model="form.end_date"
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div class="group relative overflow-hidden rounded-2xl border border-sidebar-border/70 bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-sidebar-border">
                    <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-emerald-100">Total Pendapatan</p>
                            <p class="mt-2 text-2xl font-bold tracking-tight text-white">{{ formatRupiah(props.stats.total_revenue) }}</p>
                        </div>
                        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                            <Wallet class="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div class="mt-4 flex items-center gap-2">
                        <TrendingUp class="h-4 w-4 text-emerald-100" />
                        <span class="text-xs font-medium text-emerald-100">Revenue</span>
                    </div>
                </div>

                <div class="group relative overflow-hidden rounded-2xl border border-sidebar-border/70 bg-gradient-to-br from-rose-500 to-rose-600 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-sidebar-border">
                    <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-rose-100">Total Pengeluaran</p>
                            <p class="mt-2 text-2xl font-bold tracking-tight text-white">{{ formatRupiah(props.stats.total_expenses) }}</p>
                        </div>
                        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                            <Receipt class="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div class="mt-4 flex items-center gap-2">
                        <span class="text-xs font-medium text-rose-100">Expenses</span>
                    </div>
                </div>

                <div class="group relative overflow-hidden rounded-2xl border border-sidebar-border/70 bg-gradient-to-br from-violet-500 to-violet-600 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-sidebar-border">
                    <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-violet-100">Sales Margin</p>
                            <p class="mt-2 text-2xl font-bold tracking-tight text-white">{{ props.stats.sales_margin.toFixed(2) }}%</p>
                        </div>
                        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                            <Percent class="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div class="mt-4 flex items-center gap-2">
                        <span :class="['text-xs font-medium', props.stats.sales_margin >= 0 ? 'text-violet-100' : 'text-red-200']">
                            {{ props.stats.sales_margin >= 0 ? 'Profitable' : 'Loss' }}
                        </span>
                    </div>
                </div>

                <div class="group relative overflow-hidden rounded-2xl border border-sidebar-border/70 bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-sidebar-border">
                    <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-indigo-100">Total Transaksi</p>
                            <p class="mt-2 text-2xl font-bold tracking-tight text-white">{{ props.stats.total_transactions }}</p>
                        </div>
                        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                            <DollarSign class="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div class="mt-4 flex items-center gap-2">
                        <span class="text-xs font-medium text-indigo-100">Transactions</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
            <div class="flex items-center justify-between gap-4 pb-4 border-b border-sidebar-border/70 dark:border-sidebar-border">
                <div>
                    <h2 class="text-lg font-semibold">Tren Pendapatan & Transaksi</h2>
                    <p class="text-sm text-muted-foreground">Bandingkan pendapatan harian dan jumlah transaksi dalam satu tampilan ringkas.</p>
                </div>
                <div class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-zinc-800 dark:text-slate-300">
                    <DollarSign class="h-4 w-4" />
                    Pendapatan & Transaksi
                </div>
            </div>
            <div class="mt-6 space-y-4">
                <div v-for="item in trendGraph" :key="item.label" class="rounded-2xl border border-sidebar-border/70 bg-slate-50 p-4 dark:bg-zinc-950/40 dark:border-zinc-800">
                    <div class="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                        <span>{{ item.label }}</span>
                        <span>{{ formatRupiah(item.revenue) }} · {{ item.sales }} trx</span>
                    </div>
                    <div class="mt-4 space-y-3">
                        <div>
                            <div class="mb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Pendapatan</div>
                            <div class="h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                                <div :style="{ width: item.revenueWidth }" class="h-full rounded-full bg-indigo-600"></div>
                            </div>
                        </div>
                        <div>
                            <div class="mb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Transaksi</div>
                            <div class="h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                                <div :style="{ width: item.salesWidth }" class="h-full rounded-full bg-emerald-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid gap-4 lg:grid-cols-3">
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                <div class="flex items-center justify-between gap-4 pb-4 border-b border-sidebar-border/70 dark:border-sidebar-border">
                    <div>
                        <h2 class="text-lg font-semibold">Produk Terlaris</h2>
                        <p class="text-sm text-muted-foreground">Item terlaris berdasarkan volume.</p>
                    </div>
                    <button
                        type="button"
                        class="inline-flex items-center gap-2 rounded-lg border border-sidebar-border/70 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-zinc-950 dark:text-slate-200 dark:hover:bg-zinc-800"
                        @click="printSection('best_sellers')"
                    >
                        <Printer class="h-3.5 w-3.5" />
                        Cetak
                    </button>
                </div>
                <div class="mt-6 space-y-4">
                    <div v-for="product in bestSellingGraph" :key="product.nama" class="space-y-2 rounded-2xl bg-slate-50 p-4 dark:bg-zinc-950/40">
                        <div class="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                            <span>{{ product.nama }}</span>
                            <span>{{ product.qty }} pcs</span>
                        </div>
                        <div class="h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                            <div :style="{ width: product.width }" class="h-full rounded-full bg-indigo-600"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                <div class="flex items-center justify-between gap-4 pb-4 border-b border-sidebar-border/70 dark:border-sidebar-border">
                    <div>
                        <h2 class="text-lg font-semibold">Produk Paling Tidak Laku</h2>
                        <p class="text-sm text-muted-foreground">Item dengan penjualan paling rendah.</p>
                    </div>
                    <button
                        type="button"
                        class="inline-flex items-center gap-2 rounded-lg border border-sidebar-border/70 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-zinc-950 dark:text-slate-200 dark:hover:bg-zinc-800"
                        @click="printSection('worst_sellers')"
                    >
                        <Printer class="h-3.5 w-3.5" />
                        Cetak
                    </button>
                </div>
                <div class="mt-6 space-y-4">
                    <div v-for="product in worstSellingGraph" :key="product.nama" class="space-y-2 rounded-2xl bg-slate-50 p-4 dark:bg-zinc-950/40">
                        <div class="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                            <span>{{ product.nama }}</span>
                            <span>{{ product.qty }} pcs</span>
                        </div>
                        <div class="h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                            <div :style="{ width: product.width }" class="h-full rounded-full bg-rose-500"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                <div class="flex items-center justify-between gap-4 pb-4 border-b border-sidebar-border/70 dark:border-sidebar-border">
                    <div>
                        <h2 class="text-lg font-semibold">Profit Produk Teratas</h2>
                        <p class="text-sm text-muted-foreground">Margin keuntungan produk.</p>
                    </div>
                    <button
                        type="button"
                        class="inline-flex items-center gap-2 rounded-lg border border-sidebar-border/70 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-zinc-950 dark:text-slate-200 dark:hover:bg-zinc-800"
                        @click="printSection('profit_products')"
                    >
                        <Printer class="h-3.5 w-3.5" />
                        Cetak
                    </button>
                </div>
                <div class="mt-6 space-y-4">
                    <div v-for="product in profitGraph" :key="product.nama" class="space-y-2 rounded-2xl bg-slate-50 p-4 dark:bg-zinc-950/40">
                        <div class="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                            <span>{{ product.nama }}</span>
                            <span>{{ formatRupiah(product.profit) }}</span>
                        </div>
                        <div class="h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                            <div :style="{ width: product.width }" class="h-full rounded-full bg-fuchsia-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                <div class="flex items-center justify-between gap-4 pb-4 border-b border-sidebar-border/70 dark:border-sidebar-border">
                    <div>
                        <h2 class="text-lg font-semibold">Tanggal Penjualan Terbanyak</h2>
                        <p class="text-sm text-muted-foreground">Hari paling sibuk berdasarkan transaksi.</p>
                    </div>
                    <button
                        type="button"
                        class="inline-flex items-center gap-2 rounded-lg border border-sidebar-border/70 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-zinc-950 dark:text-slate-200 dark:hover:bg-zinc-800"
                        @click="printSection('top_dates')"
                    >
                        <Printer class="h-3.5 w-3.5" />
                        Cetak
                    </button>
                </div>
                <div class="mt-6 space-y-4">
                    <div v-for="item in topDatesGraph" :key="item.label" class="space-y-2 rounded-2xl bg-slate-50 p-4 dark:bg-zinc-950/40">
                        <div class="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                            <span>{{ item.label }}</span>
                            <span>{{ item.value }} trx</span>
                        </div>
                        <div class="h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                            <div :style="{ width: item.width }" class="h-full rounded-full bg-indigo-600"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                <div class="flex items-center justify-between gap-4 pb-4 border-b border-sidebar-border/70 dark:border-sidebar-border">
                    <div>
                        <h2 class="text-lg font-semibold">Jam Penjualan Terbanyak</h2>
                        <p class="text-sm text-muted-foreground">Waktu paling sibuk berdasarkan transaksi.</p>
                    </div>
                    <button
                        type="button"
                        class="inline-flex items-center gap-2 rounded-lg border border-sidebar-border/70 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-zinc-950 dark:text-slate-200 dark:hover:bg-zinc-800"
                        @click="printSection('top_hours')"
                    >
                        <Printer class="h-3.5 w-3.5" />
                        Cetak
                    </button>
                </div>
                <div class="mt-6 space-y-4">
                    <div v-for="item in topHoursGraph" :key="item.label" class="space-y-2 rounded-2xl bg-slate-50 p-4 dark:bg-zinc-950/40">
                        <div class="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                            <span>{{ item.label }}</span>
                            <span>{{ item.value }} trx</span>
                        </div>
                        <div class="h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                            <div :style="{ width: item.width }" class="h-full rounded-full bg-emerald-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
            <div class="flex items-center justify-between gap-4 pb-4 border-b border-sidebar-border/70 dark:border-sidebar-border">
                <div>
                    <h2 class="text-lg font-semibold">Pencapaian Kasir</h2>
                    <p class="text-sm text-muted-foreground">Bandingkan transaksi dan omzet kasir terbaik.</p>
                </div>
                <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-lg border border-sidebar-border/70 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-zinc-950 dark:text-slate-200 dark:hover:bg-zinc-800"
                    @click="printSection('cashier_achievements')"
                >
                    <Printer class="h-3.5 w-3.5" />
                    Cetak
                </button>
            </div>
            <div class="mt-6 grid gap-4 lg:grid-cols-2">
                <div class="space-y-4">
                    <h3 class="text-sm font-semibold text-muted-foreground">Top Transaksi</h3>
                    <div v-for="cashier in props.top_cashiers_by_transactions" :key="cashier.nama" class="rounded-2xl bg-slate-50 p-4 dark:bg-zinc-950/40">
                        <div class="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                            <span>{{ cashier.nama }}</span>
                            <span>{{ cashier.transactions }} trx</span>
                        </div>
                        <div class="mt-2 h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                            <div :style="{ width: `${Math.round((cashier.transactions / maxCashierTransactions.value) * 100)}%` }" class="h-full rounded-full bg-indigo-600"></div>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <h3 class="text-sm font-semibold text-muted-foreground">Top Omzet</h3>
                    <div v-for="cashier in props.top_cashiers_by_revenue" :key="cashier.nama" class="rounded-2xl bg-slate-50 p-4 dark:bg-zinc-950/40">
                        <div class="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                            <span>{{ cashier.nama }}</span>
                            <span>{{ formatRupiah(cashier.revenue) }}</span>
                        </div>
                        <div class="mt-2 h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                            <div :style="{ width: `${Math.round((cashier.revenue / maxCashierRevenue.value) * 100)}%` }" class="h-full rounded-full bg-emerald-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
