<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import {
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    BadgePercent,
    Clock,
    Mail,
    Printer,
    Receipt,
    Sheet,
    TrendingUp,
    Users,
    Wallet,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import PeriodFilter from '@/components/PeriodFilter.vue';
import RevenueTrendChart from '@/components/RevenueTrendChart.vue';
import { formatRupiah, formatNumber } from '@/lib/format';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Laporan', href: '/admin/laporan/penjualan' },
            { title: 'Analisis Penjualan', href: '/admin/laporan/penjualan' },
        ],
    },
});

interface Distribution {
    label: string;
    revenue: number;
    count: number;
}
interface HourPoint extends Distribution {
    hour: number;
}
interface WeekdayPoint extends Distribution {
    weekday: number;
}
interface CashierRow {
    id_user: number;
    nama: string;
    revenue: number;
    transactions: number;
    avg: number;
    diskon: number;
    diskon_count: number;
}
interface WindowStat {
    revenue: number;
    count: number;
}
interface TrendPoint {
    label: string;
    value: number;
    count: number;
}

const props = defineProps<{
    date_range: { start_date: string; end_date: string };
    period_days: number;
    summary: {
        total_revenue: number;
        total_transactions: number;
        avg_transaction: number;
        total_diskon: number;
        diskon_count: number;
    };
    hourly: HourPoint[];
    weekday: WeekdayPoint[];
    cashiers: CashierRow[];
    trend: {
        this_week: WindowStat;
        last_week: WindowStat;
        this_month: WindowStat;
        last_month: WindowStat;
    };
    revenue_chart: {
        granularity: 'daily' | 'weekly' | 'monthly';
        points: TrendPoint[];
    };
}>();

type TabKey = 'waktu_sibuk' | 'tren' | 'kasir';
const activeTab = ref<TabKey>('waktu_sibuk');
const tabs: { key: TabKey; label: string; icon: typeof Clock }[] = [
    { key: 'waktu_sibuk', label: 'Waktu Sibuk', icon: Clock },
    { key: 'tren', label: 'Tren Penjualan', icon: TrendingUp },
    { key: 'kasir', label: 'Performa Kasir', icon: Users },
];

// ---------------------------------------------------------------
// Filter periode (pola sama dengan Laporan Keuangan)
// ---------------------------------------------------------------
const REPORT_URL = '/admin/laporan/penjualan';

function onPeriod(range: { start_date: string; end_date: string }): void {
    router.get(
        REPORT_URL,
        { start_date: range.start_date, end_date: range.end_date },
        {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        },
    );
}

// ---------------------------------------------------------------
// Waktu sibuk: distribusi per jam & per hari
// ---------------------------------------------------------------
const hasData = computed(() => props.summary.total_transactions > 0);

const peakHour = computed(() =>
    props.hourly.reduce((a, b) => (b.count > a.count ? b : a), props.hourly[0]),
);
const peakDay = computed(() =>
    props.weekday.reduce(
        (a, b) => (b.count > a.count ? b : a),
        props.weekday[0],
    ),
);

const maxHourCount = computed(() =>
    Math.max(...props.hourly.map((h) => h.count), 1),
);
const hourlyBars = computed(() =>
    props.hourly.map((h) => ({
        ...h,
        height: `${Math.max(Math.round((h.count / maxHourCount.value) * 100), h.count > 0 ? 6 : 0)}%`,
        isPeak: hasData.value && h.hour === peakHour.value.hour && h.count > 0,
    })),
);

const maxDayCount = computed(() =>
    Math.max(...props.weekday.map((d) => d.count), 1),
);
const weekdayBars = computed(() =>
    props.weekday.map((d) => ({
        ...d,
        height: `${Math.max(Math.round((d.count / maxDayCount.value) * 100), d.count > 0 ? 6 : 0)}%`,
        isPeak:
            hasData.value && d.weekday === peakDay.value.weekday && d.count > 0,
    })),
);

const peakInsight = computed(() => {
    if (!hasData.value) {
        return 'Belum ada transaksi pada periode ini, jadi pola waktu sibuk belum bisa dibaca.';
    }

    return `Toko paling ramai hari ${peakDay.value.label}, sekitar pukul ${peakHour.value.label}. Pertimbangkan menambah staf atau membuat promo "happy hour" di jam tersebut.`;
});

// ---------------------------------------------------------------
// Tren penjualan: minggu ini vs lalu, bulan ini vs lalu
// ---------------------------------------------------------------
function pct(current: number, previous: number): number | null {
    return previous > 0 ? ((current - previous) / previous) * 100 : null;
}

function buildTrendCard(
    metric: string,
    current: number,
    previous: number,
    money: boolean,
) {
    const delta = pct(current, previous);

    return {
        metric,
        valueText: money ? formatRupiah(current) : formatNumber(current),
        prevText: `dari ${money ? formatRupiah(previous) : formatNumber(previous)}`,
        showPct: delta !== null,
        up: (delta ?? 0) >= 0,
        pctText:
            delta !== null
                ? `${Math.abs(Math.round(delta))}% vs sebelumnya`
                : 'baru periode ini',
    };
}

const trendGroups = computed(() => [
    {
        title: 'Minggu Ini vs Minggu Lalu',
        subtitle:
            'Sejak Senin sampai sekarang, dibanding rentang yang sama minggu lalu.',
        cards: [
            buildTrendCard(
                'Omzet',
                props.trend.this_week.revenue,
                props.trend.last_week.revenue,
                true,
            ),
            buildTrendCard(
                'Transaksi',
                props.trend.this_week.count,
                props.trend.last_week.count,
                false,
            ),
        ],
    },
    {
        title: 'Bulan Ini vs Bulan Lalu',
        subtitle:
            'Sejak tanggal 1 sampai sekarang, dibanding rentang yang sama bulan lalu.',
        cards: [
            buildTrendCard(
                'Omzet',
                props.trend.this_month.revenue,
                props.trend.last_month.revenue,
                true,
            ),
            buildTrendCard(
                'Transaksi',
                props.trend.this_month.count,
                props.trend.last_month.count,
                false,
            ),
        ],
    },
]);

const trendInsight = computed(() => {
    const delta = pct(
        props.trend.this_month.revenue,
        props.trend.last_month.revenue,
    );

    if (delta === null) {
        return {
            tone: 'neutral' as const,
            message: 'Belum ada data periode sebelumnya untuk dibandingkan.',
        };
    }

    if (delta >= 0) {
        return {
            tone: 'success' as const,
            message: `Omzet bulan ini tumbuh ${Math.round(delta)}% dibanding rentang yang sama bulan lalu. Pertahankan momentum penjualan.`,
        };
    }

    return {
        tone: 'danger' as const,
        message: `Omzet bulan ini turun ${Math.abs(Math.round(delta))}% dibanding rentang yang sama bulan lalu. Tinjau promo atau jam ramai untuk mendorong penjualan.`,
    };
});

// ---------------------------------------------------------------
// Performa kasir
// ---------------------------------------------------------------
const maxCashierRevenue = computed(() =>
    Math.max(...props.cashiers.map((c) => c.revenue), 1),
);
const cashierRows = computed(() =>
    props.cashiers.map((c) => ({
        ...c,
        width: `${Math.max(Math.round((c.revenue / maxCashierRevenue.value) * 100), c.revenue > 0 ? 3 : 0)}%`,
        diskonPct:
            c.transactions > 0 ? (c.diskon_count / c.transactions) * 100 : 0,
    })),
);

// ---------------------------------------------------------------
// Tren omzet (grafik bawah, mengikuti filter) — granularity adaptif
// ---------------------------------------------------------------
const GRANULARITY_LABEL: Record<string, string> = {
    daily: 'Harian',
    weekly: 'Mingguan',
    monthly: 'Bulanan',
};
const trendTitle = computed(
    () =>
        `Tren Omzet ${GRANULARITY_LABEL[props.revenue_chart.granularity] ?? 'Harian'}`,
);

// ---------------------------------------------------------------
// Ekspor: Cetak/PDF, Excel (CSV), WhatsApp, Email
// ---------------------------------------------------------------
const periodLabel = computed(
    () => `${props.date_range.start_date} s/d ${props.date_range.end_date}`,
);

function buildSummaryText(): string {
    const s = props.summary;
    const top = props.cashiers[0];
    const lines = [
        '*Analisis Penjualan & Performa*',
        `Periode: ${periodLabel.value}`,
        '',
        '*Ringkasan*',
        `Omzet: ${formatRupiah(s.total_revenue)}`,
        `Transaksi: ${formatNumber(s.total_transactions)}`,
        `Rata-rata/transaksi: ${formatRupiah(s.avg_transaction)}`,
        '',
        '*Waktu Sibuk*',
        `Hari teramai: ${hasData.value ? peakDay.value.label : '—'}`,
        `Jam teramai: ${hasData.value ? peakHour.value.label : '—'}`,
        '',
        '*Tren*',
        `Omzet minggu ini: ${formatRupiah(props.trend.this_week.revenue)} (vs ${formatRupiah(props.trend.last_week.revenue)} minggu lalu)`,
        `Omzet bulan ini: ${formatRupiah(props.trend.this_month.revenue)} (vs ${formatRupiah(props.trend.last_month.revenue)} bulan lalu)`,
    ];

    if (top) {
        lines.push(
            '',
            '*Kasir Teratas*',
            `${top.nama}: ${formatRupiah(top.revenue)} (${formatNumber(top.transactions)} transaksi)`,
        );
    }

    return lines.join('\n');
}

function shareWhatsApp(): void {
    window.open(
        `https://wa.me/?text=${encodeURIComponent(buildSummaryText())}`,
        '_blank',
    );
}

function emailOwner(): void {
    const subject = `Analisis Penjualan ${periodLabel.value}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildSummaryText())}`;
}

function downloadCsv(): void {
    const s = props.summary;
    const rows: string[][] = [
        ['Analisis Penjualan & Performa', periodLabel.value],
        [],
        ['RINGKASAN'],
        ['Omzet', String(s.total_revenue)],
        ['Jumlah Transaksi', String(s.total_transactions)],
        ['Rata-rata per Transaksi', String(s.avg_transaction)],
        ['Total Diskon', String(s.total_diskon)],
        ['Transaksi Berdiskon', String(s.diskon_count)],
        [],
        ['WAKTU SIBUK — PER JAM'],
        ['Jam', 'Transaksi', 'Omzet'],
        ...props.hourly.map((h) => [
            h.label,
            String(h.count),
            String(h.revenue),
        ]),
        [],
        ['WAKTU SIBUK — PER HARI'],
        ['Hari', 'Transaksi', 'Omzet'],
        ...props.weekday.map((d) => [
            d.label,
            String(d.count),
            String(d.revenue),
        ]),
        [],
        ['TREN PENJUALAN'],
        ['Periode', 'Omzet', 'Transaksi'],
        [
            'Minggu Ini',
            String(props.trend.this_week.revenue),
            String(props.trend.this_week.count),
        ],
        [
            'Minggu Lalu',
            String(props.trend.last_week.revenue),
            String(props.trend.last_week.count),
        ],
        [
            'Bulan Ini',
            String(props.trend.this_month.revenue),
            String(props.trend.this_month.count),
        ],
        [
            'Bulan Lalu',
            String(props.trend.last_month.revenue),
            String(props.trend.last_month.count),
        ],
        [],
        ['PERFORMA KASIR'],
        ['Kasir', 'Omzet', 'Transaksi', 'Rata-rata', 'Diskon', 'Frek. Diskon'],
        ...props.cashiers.map((c) => [
            c.nama,
            String(c.revenue),
            String(c.transactions),
            String(c.avg),
            String(c.diskon),
            String(c.diskon_count),
        ]),
    ];

    const csv =
        '﻿' +
        rows
            .map((r) =>
                r
                    .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                    .join(';'),
            )
            .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analisis-penjualan-${props.date_range.start_date}_${props.date_range.end_date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

function rp(value: number): string {
    return formatRupiah(value);
}

function printReport(): void {
    if (typeof window === 'undefined') {
        return;
    }

    const s = props.summary;

    const ringkasan = `
        <h2>Ringkasan</h2>
        <table>
            <tr><td>Omzet</td><td class="num">${rp(s.total_revenue)}</td></tr>
            <tr><td>Jumlah Transaksi</td><td class="num">${formatNumber(s.total_transactions)}</td></tr>
            <tr><td>Rata-rata per Transaksi</td><td class="num">${rp(s.avg_transaction)}</td></tr>
            <tr><td>Hari Teramai</td><td class="num">${hasData.value ? peakDay.value.label : '—'}</td></tr>
            <tr><td>Jam Teramai</td><td class="num">${hasData.value ? peakHour.value.label : '—'}</td></tr>
        </table>`;

    const tren = `
        <h2>Tren Penjualan</h2>
        <table>
            <thead><tr><th>Periode</th><th class="num">Omzet</th><th class="num">Transaksi</th></tr></thead>
            <tbody>
                <tr><td>Minggu Ini</td><td class="num">${rp(props.trend.this_week.revenue)}</td><td class="num">${props.trend.this_week.count}</td></tr>
                <tr><td>Minggu Lalu</td><td class="num">${rp(props.trend.last_week.revenue)}</td><td class="num">${props.trend.last_week.count}</td></tr>
                <tr><td>Bulan Ini</td><td class="num">${rp(props.trend.this_month.revenue)}</td><td class="num">${props.trend.this_month.count}</td></tr>
                <tr><td>Bulan Lalu</td><td class="num">${rp(props.trend.last_month.revenue)}</td><td class="num">${props.trend.last_month.count}</td></tr>
            </tbody>
        </table>`;

    const kasir = `
        <h2>Performa Kasir</h2>
        <table>
            <thead><tr><th>Kasir</th><th class="num">Omzet</th><th class="num">Transaksi</th><th class="num">Rata-rata</th><th class="num">Diskon</th><th class="num">Frek. Diskon</th></tr></thead>
            <tbody>
            ${props.cashiers
                .map(
                    (c) =>
                        `<tr><td>${c.nama}</td><td class="num">${rp(c.revenue)}</td><td class="num">${c.transactions}</td><td class="num">${rp(c.avg)}</td><td class="num">${rp(c.diskon)}</td><td class="num">${c.diskon_count}</td></tr>`,
                )
                .join('')}
            ${props.cashiers.length === 0 ? '<tr><td colspan="6">Belum ada transaksi pada periode ini.</td></tr>' : ''}
            </tbody>
        </table>`;

    const shell = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Analisis Penjualan &amp; Performa</title>
<style>
    body { color: #0f172a; font-family: Arial, sans-serif; margin: 0; padding: 28px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    h2 { font-size: 15px; margin: 24px 0 8px; border-bottom: 2px solid #0f172a; padding-bottom: 4px; }
    p.period { color: #475569; margin: 0 0 8px; }
    table { border-collapse: collapse; width: 100%; font-size: 13px; }
    td { padding: 7px 8px; border-bottom: 1px solid #e2e8f0; }
    td.num { text-align: right; font-variant-numeric: tabular-nums; }
    th { background: #f1f5f9; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; padding: 8px; text-align: left; }
    th.num { text-align: right; }
</style>
</head>
<body>
    <h1>Analisis Penjualan &amp; Performa</h1>
    <p class="period">Periode: ${periodLabel.value}</p>
    ${ringkasan}${tren}${kasir}
</body>
</html>`;

    const win = window.open('', '_blank', 'width=900,height=720');

    if (!win) {
        window.alert(
            'Tidak dapat membuka jendela cetak. Pastikan pop-up tidak diblokir.',
        );

        return;
    }

    win.document.write(shell);
    win.document.close();
    win.focus();
    win.print();
}
</script>

<template>
    <Head title="Analisis Penjualan - Admin" />

    <div
        class="flex h-full flex-1 flex-col gap-6 bg-slate-50 p-4 text-slate-950 sm:p-6 dark:bg-zinc-950 dark:text-slate-100"
    >
        <!-- Header -->
        <div
            class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"
        >
            <div>
                <p
                    class="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400"
                >
                    Laporan
                </p>
                <h1 class="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                    Analisis Penjualan &amp; Performa
                </h1>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Waktu sibuk, tren penjualan, dan performa kasir untuk
                    menaikkan omzet.
                </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <!-- Filter -->
                <PeriodFilter
                    :start-date="props.date_range.start_date"
                    :end-date="props.date_range.end_date"
                    @change="onPeriod"
                />

                <!-- Ekspor -->
                <button
                    type="button"
                    class="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800"
                    @click="printReport"
                >
                    <Printer class="h-4 w-4" /><span class="hidden sm:inline"
                        >Cetak / PDF</span
                    >
                </button>
                <button
                    type="button"
                    class="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800"
                    @click="downloadCsv"
                >
                    <Sheet class="h-4 w-4" /><span class="hidden sm:inline"
                        >Excel</span
                    >
                </button>
                <button
                    type="button"
                    class="inline-flex h-9 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                    @click="shareWhatsApp"
                >
                    <svg
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.879-1.017zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"
                        />
                    </svg>
                    <span class="hidden sm:inline">WhatsApp</span>
                </button>
                <button
                    type="button"
                    class="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800"
                    @click="emailOwner"
                >
                    <Mail class="h-4 w-4" /><span class="hidden sm:inline"
                        >Email</span
                    >
                </button>
            </div>
        </div>

        <!-- Ringkasan KPI -->
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p
                            class="text-sm font-medium text-slate-500 dark:text-slate-400"
                        >
                            Omzet
                        </p>
                        <p class="mt-2 text-2xl font-bold">
                            {{ formatRupiah(summary.total_revenue) }}
                        </p>
                    </div>
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                    >
                        <Wallet class="h-5 w-5" />
                    </div>
                </div>
                <p
                    class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                    Total penjualan periode ini
                </p>
            </div>

            <div
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p
                            class="text-sm font-medium text-slate-500 dark:text-slate-400"
                        >
                            Jumlah Transaksi
                        </p>
                        <p class="mt-2 text-2xl font-bold">
                            {{ formatNumber(summary.total_transactions) }}
                        </p>
                    </div>
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
                    >
                        <Receipt class="h-5 w-5" />
                    </div>
                </div>
                <p
                    class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                    {{ formatNumber(summary.diskon_count) }} transaksi diberi
                    diskon
                </p>
            </div>

            <div
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p
                            class="text-sm font-medium text-slate-500 dark:text-slate-400"
                        >
                            Rata-rata / Transaksi
                        </p>
                        <p class="mt-2 text-2xl font-bold">
                            {{ formatRupiah(summary.avg_transaction) }}
                        </p>
                    </div>
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-md bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                    >
                        <BadgePercent class="h-5 w-5" />
                    </div>
                </div>
                <p
                    class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                    Diskon diberikan {{ formatRupiah(summary.total_diskon) }}
                </p>
            </div>

            <div
                class="rounded-lg border border-amber-200 bg-amber-50/60 p-5 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10"
            >
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p
                            class="text-sm font-medium text-slate-500 dark:text-slate-400"
                        >
                            Jam Tersibuk
                        </p>
                        <p
                            class="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-300"
                        >
                            {{ hasData ? peakHour.label : '—' }}
                        </p>
                    </div>
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-md bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                    >
                        <Clock class="h-5 w-5" />
                    </div>
                </div>
                <p
                    class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                    Hari tersibuk: {{ hasData ? peakDay.label : '—' }}
                </p>
            </div>
        </div>

        <!-- Tabs -->
        <div
            class="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
            <button
                v-for="tab in tabs"
                :key="tab.key"
                type="button"
                class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition"
                :class="
                    activeTab === tab.key
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'
                "
                @click="activeTab = tab.key"
            >
                <component :is="tab.icon" class="h-4 w-4" />
                <span>{{ tab.label }}</span>
            </button>
        </div>

        <!-- ============ TAB: WAKTU SIBUK ============ -->
        <div v-if="activeTab === 'waktu_sibuk'" class="flex flex-col gap-4">
            <!-- Insight -->
            <div
                class="flex items-start gap-3 rounded-lg p-4 shadow-sm"
                :class="
                    hasData
                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-zinc-900 dark:text-slate-400'
                "
            >
                <Clock class="mt-0.5 h-5 w-5 shrink-0" />
                <p class="text-sm leading-relaxed">{{ peakInsight }}</p>
            </div>

            <!-- Per jam -->
            <section
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div
                    class="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-zinc-800"
                >
                    <div>
                        <h2 class="text-lg font-semibold">Transaksi per Jam</h2>
                        <p
                            class="mt-1 text-sm text-slate-500 dark:text-slate-400"
                        >
                            Sebaran jumlah transaksi sepanjang hari (00–23).
                        </p>
                    </div>
                    <span
                        class="hidden items-center gap-1.5 text-[11px] font-semibold text-slate-500 sm:inline-flex dark:text-slate-400"
                        ><span
                            class="h-2.5 w-2.5 rounded-sm bg-amber-400"
                        ></span
                        >Jam tersibuk</span
                    >
                </div>
                <div class="mt-5 overflow-x-auto">
                    <div
                        class="flex h-56 min-w-[760px] items-end gap-1.5 border-b border-slate-200 px-1 pb-7 dark:border-zinc-800"
                    >
                        <div
                            v-for="bar in hourlyBars"
                            :key="bar.hour"
                            class="group relative flex h-full flex-1 flex-col items-center justify-end"
                        >
                            <div
                                class="absolute bottom-[calc(100%+0.4rem)] z-10 hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-xs whitespace-nowrap shadow-lg group-hover:block dark:border-zinc-700 dark:bg-zinc-950"
                            >
                                <span class="font-semibold">{{
                                    bar.label
                                }}</span>
                                · {{ bar.count }} trx<br /><span
                                    class="text-slate-500 dark:text-slate-400"
                                    >{{ formatRupiah(bar.revenue) }}</span
                                >
                            </div>
                            <div
                                class="w-full max-w-[18px] rounded-t-sm transition-all duration-300"
                                :class="
                                    bar.isPeak ? 'bg-amber-400' : 'bg-sky-500'
                                "
                                :style="{ height: bar.height }"
                            ></div>
                            <span
                                class="absolute -bottom-6 text-[10px] font-medium whitespace-nowrap text-slate-400"
                                >{{ bar.hour }}</span
                            >
                        </div>
                    </div>
                </div>
            </section>

            <!-- Per hari -->
            <section
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div
                    class="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-zinc-800"
                >
                    <div>
                        <h2 class="text-lg font-semibold">
                            Transaksi per Hari
                        </h2>
                        <p
                            class="mt-1 text-sm text-slate-500 dark:text-slate-400"
                        >
                            Hari mana toko paling ramai dalam seminggu.
                        </p>
                    </div>
                    <span
                        class="hidden items-center gap-1.5 text-[11px] font-semibold text-slate-500 sm:inline-flex dark:text-slate-400"
                        ><span
                            class="h-2.5 w-2.5 rounded-sm bg-amber-400"
                        ></span
                        >Hari tersibuk</span
                    >
                </div>
                <div
                    class="mt-5 flex h-56 items-end gap-2 border-b border-slate-200 px-1 pb-7 sm:gap-4 dark:border-zinc-800"
                >
                    <div
                        v-for="bar in weekdayBars"
                        :key="bar.weekday"
                        class="group relative flex h-full flex-1 flex-col items-center justify-end"
                    >
                        <div
                            class="absolute bottom-[calc(100%+0.4rem)] z-10 hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-xs whitespace-nowrap shadow-lg group-hover:block dark:border-zinc-700 dark:bg-zinc-950"
                        >
                            <span class="font-semibold">{{ bar.label }}</span> ·
                            {{ bar.count }} trx<br /><span
                                class="text-slate-500 dark:text-slate-400"
                                >{{ formatRupiah(bar.revenue) }}</span
                            >
                        </div>
                        <div
                            class="w-full max-w-[48px] rounded-t-sm transition-all duration-300"
                            :class="bar.isPeak ? 'bg-amber-400' : 'bg-sky-500'"
                            :style="{ height: bar.height }"
                        ></div>
                        <span
                            class="absolute -bottom-6 text-[11px] font-medium whitespace-nowrap text-slate-500 dark:text-slate-400"
                            >{{ bar.label }}</span
                        >
                    </div>
                </div>
            </section>
        </div>

        <!-- ============ TAB: TREN PENJUALAN ============ -->
        <div v-else-if="activeTab === 'tren'" class="flex flex-col gap-4">
            <div
                class="flex items-start gap-3 rounded-lg p-4 shadow-sm"
                :class="
                    trendInsight.tone === 'success'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : trendInsight.tone === 'danger'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-zinc-900 dark:text-slate-400'
                "
            >
                <TrendingUp class="mt-0.5 h-5 w-5 shrink-0" />
                <p class="text-sm leading-relaxed">
                    {{ trendInsight.message }}
                </p>
            </div>

            <section
                v-for="group in trendGroups"
                :key="group.title"
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <h2 class="text-lg font-semibold">{{ group.title }}</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {{ group.subtitle }}
                </p>
                <div class="mt-5 grid gap-3 sm:grid-cols-2">
                    <div
                        v-for="card in group.cards"
                        :key="card.metric"
                        class="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40"
                    >
                        <p
                            class="text-sm font-medium text-slate-500 dark:text-slate-400"
                        >
                            {{ card.metric }}
                        </p>
                        <p class="mt-1 text-xl font-bold">
                            {{ card.valueText }}
                        </p>
                        <p
                            class="mt-1 inline-flex items-center gap-1 text-xs font-medium"
                            :class="
                                !card.showPct
                                    ? 'text-slate-500 dark:text-slate-400'
                                    : card.up
                                      ? 'text-emerald-600 dark:text-emerald-400'
                                      : 'text-rose-600 dark:text-rose-400'
                            "
                        >
                            <template v-if="card.showPct">
                                <ArrowUpRight
                                    v-if="card.up"
                                    class="h-3.5 w-3.5"
                                />
                                <ArrowDownRight v-else class="h-3.5 w-3.5" />
                                {{ card.pctText }}
                            </template>
                            <template v-else>{{ card.pctText }}</template>
                        </p>
                        <p class="mt-0.5 text-xs text-slate-400">
                            {{ card.prevText }}
                        </p>
                    </div>
                </div>
            </section>
        </div>

        <!-- ============ TAB: PERFORMA KASIR ============ -->
        <div v-else class="flex flex-col gap-4">
            <div
                class="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
            >
                <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                    Frekuensi diskon ditampilkan sebagai sinyal kontrol.
                    Pembatalan (void) belum direkam di sistem — transaksi yang
                    dihapus tidak meninggalkan jejak — jadi frekuensi void belum
                    tersedia di sini.
                </p>
            </div>

            <section
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <h2 class="text-lg font-semibold">Ringkasan per Kasir</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Total penjualan, jumlah transaksi, dan diskon yang diberikan
                    tiap staf.
                </p>

                <div class="mt-5 overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr
                                class="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase dark:border-zinc-800 dark:text-slate-400"
                            >
                                <th class="pr-3 pb-2 font-semibold">Kasir</th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Omzet
                                </th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Trx
                                </th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Rata-rata
                                </th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Diskon
                                </th>
                                <th class="pb-2 pl-2 text-right font-semibold">
                                    Frek. Diskon
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            class="divide-y divide-slate-100 dark:divide-zinc-800"
                        >
                            <tr v-for="c in cashierRows" :key="c.id_user">
                                <td class="py-3 pr-3 font-semibold">
                                    {{ c.nama }}
                                </td>
                                <td
                                    class="px-2 text-right font-medium tabular-nums"
                                >
                                    {{ formatRupiah(c.revenue) }}
                                </td>
                                <td
                                    class="px-2 text-right text-slate-600 tabular-nums dark:text-slate-300"
                                >
                                    {{ formatNumber(c.transactions) }}
                                </td>
                                <td
                                    class="px-2 text-right text-slate-600 tabular-nums dark:text-slate-300"
                                >
                                    {{ formatRupiah(c.avg) }}
                                </td>
                                <td
                                    class="px-2 text-right text-slate-600 tabular-nums dark:text-slate-300"
                                >
                                    {{
                                        c.diskon > 0
                                            ? formatRupiah(c.diskon)
                                            : '—'
                                    }}
                                </td>
                                <td
                                    class="pl-2 text-right tabular-nums"
                                    :class="
                                        c.diskonPct >= 50
                                            ? 'text-rose-600 dark:text-rose-400'
                                            : 'text-slate-600 dark:text-slate-300'
                                    "
                                >
                                    {{ c.diskon_count }} ({{
                                        Math.round(c.diskonPct)
                                    }}%)
                                </td>
                            </tr>
                            <tr v-if="cashierRows.length === 0">
                                <td
                                    colspan="6"
                                    class="py-6 text-center text-sm text-slate-400"
                                >
                                    Belum ada transaksi pada periode ini.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section
                v-if="cashierRows.length > 0"
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <h3
                    class="text-sm font-semibold text-slate-600 dark:text-slate-300"
                >
                    Kontribusi Omzet per Kasir
                </h3>
                <div class="mt-4 space-y-4">
                    <div v-for="c in cashierRows" :key="c.id_user">
                        <div class="flex items-center justify-between text-sm">
                            <span class="font-semibold">{{ c.nama }}</span>
                            <span class="text-slate-500 dark:text-slate-400"
                                >{{ formatRupiah(c.revenue) }} ·
                                {{ formatNumber(c.transactions) }} trx</span
                            >
                        </div>
                        <div
                            class="mt-2 h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800"
                        >
                            <div
                                class="h-full rounded-full bg-sky-500 transition-all"
                                :style="{ width: c.width }"
                            ></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Tren omzet harian (selalu tampil di bawah, mengikuti filter) -->
        <section
            class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
            <div
                class="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-zinc-800"
            >
                <h2 class="text-lg font-semibold">{{ trendTitle }}</h2>
                <span class="text-xs text-slate-400"
                    >{{ date_range.start_date }} –
                    {{ date_range.end_date }}</span
                >
            </div>
            <div class="mt-5">
                <RevenueTrendChart :points="revenue_chart.points" />
            </div>
        </section>
    </div>
</template>
