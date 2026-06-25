<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import {
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    Banknote,
    Mail,
    Percent,
    Printer,
    Receipt,
    Scale,
    Sheet,
    Wallet,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import PeriodFilter from '@/components/PeriodFilter.vue';
import RevenueTrendChart from '@/components/RevenueTrendChart.vue';
import { formatRupiah, formatCompact } from '@/lib/format';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Laporan', href: '/admin/laporan/keuangan' },
            { title: 'Keuangan', href: '/admin/laporan/keuangan' },
        ],
    },
});

interface ChartPoint {
    label: string;
    value: number;
    count?: number;
}

interface ExpenseRow {
    tipe: string;
    label: string;
    nominal: number;
}

interface WaterfallStep {
    label: string;
    type: 'income' | 'deduction' | 'subtotal' | 'result';
    amount: number;
    start: number;
    end: number;
}

interface ComparisonCard {
    label: string;
    current: number;
    previous: number;
    delta_pct: number | null;
    higher_is_better: boolean;
}

interface PaymentMethod {
    metode: string;
    label: string;
    total: number;
    jumlah: number;
}

const props = defineProps<{
    date_range: { start_date: string; end_date: string };
    period_days: number;
    pnl: {
        product_revenue: number;
        jasa_revenue: number;
        total_revenue: number;
        total_diskon: number;
        hpp: number;
        gross_profit: number;
        expense_breakdown: ExpenseRow[];
        operational_expenses: number;
        net_profit: number;
        margin: number;
    };
    waterfall: WaterfallStep[];
    comparison: ComparisonCard[];
    insight: { tone: 'success' | 'danger'; message: string };
    monthly_cost_warning: boolean;
    revenue_chart: {
        granularity: 'daily' | 'weekly' | 'monthly';
        points: ChartPoint[];
    };
    cashflow: {
        kas_masuk: number;
        pembelian_produksi: number;
        biaya_produksi: number;
        belanja_bahan: number;
        biaya_operasional: number;
        kas_keluar: number;
        net_cash: number;
        jasa_pass_through: number;
    };
    reconciliation: {
        methods: PaymentMethod[];
        total: number;
    };
}>();

type TabKey = 'laba_rugi' | 'arus_kas' | 'rekonsiliasi';
const activeTab = ref<TabKey>('laba_rugi');
const tabs: { key: TabKey; label: string; icon: typeof Scale }[] = [
    { key: 'laba_rugi', label: 'Laba Rugi', icon: Scale },
    { key: 'arus_kas', label: 'Arus Kas', icon: Banknote },
    { key: 'rekonsiliasi', label: 'Rekonsiliasi', icon: Receipt },
];

// ---------------------------------------------------------------
// Filter periode (pola sama dengan dashboard admin)
// ---------------------------------------------------------------
const REPORT_URL = '/admin/laporan/keuangan';

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
// Ringkasan grafik tren omzet — granularity adaptif (harian/mingguan/bulanan)
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
// Waterfall laba rugi
// ---------------------------------------------------------------
const waterfallView = computed(() => {
    const steps = props.waterfall;

    if (!steps || steps.length === 0) {
        return { bars: [], zeroTop: '100%' };
    }

    const values = steps.flatMap((step) => [step.start, step.end]);
    values.push(0);
    const maxV = Math.max(...values);
    const minV = Math.min(...values);
    const range = maxV - minV || 1;

    const bars = steps.map((step) => {
        const hi = Math.max(step.start, step.end);
        const lo = Math.min(step.start, step.end);

        let colorClass = 'bg-rose-400';

        if (step.type === 'income') {
            colorClass = 'bg-emerald-500';
        } else if (step.type === 'subtotal') {
            colorClass = 'bg-sky-500';
        } else if (step.type === 'result') {
            colorClass = step.end >= 0 ? 'bg-emerald-600' : 'bg-rose-600';
        }

        return {
            label: step.label,
            amountText: `${step.amount < 0 ? '−' : ''}Rp${formatCompact(Math.abs(step.amount))}`,
            colorClass,
            topPct: `${((maxV - hi) / range) * 100}%`,
            heightPct: `${Math.max(((hi - lo) / range) * 100, step.amount !== 0 ? 1.5 : 0.5)}%`,
        };
    });

    return { bars, zeroTop: `${((maxV - 0) / range) * 100}%` };
});

const comparisonCards = computed(() =>
    props.comparison.map((card) => {
        const signFlip = card.current < 0 !== card.previous < 0;
        let good: boolean | null = null;

        if (card.delta_pct !== null) {
            const increased = card.delta_pct > 0;
            good = card.higher_is_better ? increased : !increased;
        }

        return {
            label: card.label,
            valueText: formatRupiah(card.current),
            isNegative: card.current < 0,
            showPct: card.delta_pct !== null && !signFlip,
            up: (card.delta_pct ?? 0) > 0,
            pctText:
                card.delta_pct !== null
                    ? `${Math.abs(Math.round(card.delta_pct))}% vs sebelumnya`
                    : 'baru periode ini',
            prevText: `dari ${formatRupiah(card.previous)}`,
            good,
        };
    }),
);

// ---------------------------------------------------------------
// Rekonsiliasi pembayaran — tarif MDR bisa diatur (tidak tersimpan di DB)
// ---------------------------------------------------------------
const mdrRates = ref<Record<string, number>>({
    cash: 0,
    qris: 0.7,
    transfer: 0,
});

const reconciliationRows = computed(() =>
    props.reconciliation.methods.map((m) => {
        const rate = Number(mdrRates.value[m.metode] ?? 0);
        const fee = Math.round((m.total * rate) / 100);
        const net = m.total - fee;

        return {
            ...m,
            rate,
            fee,
            net,
            share:
                props.reconciliation.total > 0
                    ? (m.total / props.reconciliation.total) * 100
                    : 0,
        };
    }),
);

const reconciliationTotals = computed(() => {
    const rows = reconciliationRows.value;

    return {
        gross: rows.reduce((s, r) => s + r.total, 0),
        fee: rows.reduce((s, r) => s + r.fee, 0),
        net: rows.reduce((s, r) => s + r.net, 0),
        jumlah: rows.reduce((s, r) => s + r.jumlah, 0),
    };
});

const methodColor: Record<string, string> = {
    cash: 'bg-emerald-500',
    qris: 'bg-sky-500',
    transfer: 'bg-violet-500',
};

// ---------------------------------------------------------------
// Ekspor: Cetak/PDF, Excel (CSV), WhatsApp, Email
// ---------------------------------------------------------------
const periodLabel = computed(
    () => `${props.date_range.start_date} s/d ${props.date_range.end_date}`,
);

function buildSummaryText(): string {
    const p = props.pnl;
    const c = props.cashflow;
    const lines = [
        `*Laporan Keuangan*`,
        `Periode: ${periodLabel.value}`,
        ``,
        `*Laba Rugi*`,
        `Omzet: ${formatRupiah(p.total_revenue)}`,
        `HPP: ${formatRupiah(p.hpp)}`,
        `Laba Kotor: ${formatRupiah(p.gross_profit)}`,
        `Biaya Operasional: ${formatRupiah(p.operational_expenses)}`,
        `Laba Bersih: ${formatRupiah(p.net_profit)} (margin ${p.margin}%)`,
        ``,
        `*Arus Kas*`,
        `Kas Masuk: ${formatRupiah(c.kas_masuk)}`,
        `Kas Keluar: ${formatRupiah(c.kas_keluar)}`,
        `Arus Kas Bersih: ${formatRupiah(c.net_cash)}`,
    ];

    return lines.join('\n');
}

function shareWhatsApp(): void {
    window.open(
        `https://wa.me/?text=${encodeURIComponent(buildSummaryText())}`,
        '_blank',
    );
}

function emailOwner(): void {
    const subject = `Laporan Keuangan ${periodLabel.value}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildSummaryText())}`;
}

function downloadCsv(): void {
    const p = props.pnl;
    const c = props.cashflow;
    const rows: string[][] = [
        ['Laporan Keuangan', periodLabel.value],
        [],
        ['LABA RUGI'],
        ['Penjualan Barang', String(p.product_revenue)],
        ['Pendapatan Jasa', String(p.jasa_revenue)],
        ['Total Omzet', String(p.total_revenue)],
        ['HPP', String(-p.hpp)],
        ['Laba Kotor', String(p.gross_profit)],
        ...p.expense_breakdown.map((e) => [e.label, String(-e.nominal)]),
        ['Total Biaya Operasional', String(-p.operational_expenses)],
        ['Laba Bersih', String(p.net_profit)],
        ['Margin (%)', String(p.margin)],
        [],
        ['ARUS KAS'],
        ['Kas Masuk (Penjualan)', String(c.kas_masuk)],
        ['Pembelian & Produksi', String(-c.pembelian_produksi)],
        ['Biaya Operasional', String(-c.biaya_operasional)],
        ['Arus Kas Bersih', String(c.net_cash)],
        [],
        ['REKONSILIASI PEMBAYARAN'],
        ['Metode', 'Transaksi', 'Bruto', 'Biaya Admin', 'Diterima Bersih'],
        ...reconciliationRows.value.map((r) => [
            r.label,
            String(r.jumlah),
            String(r.total),
            String(-r.fee),
            String(r.net),
        ]),
        [
            'Total',
            String(reconciliationTotals.value.jumlah),
            String(reconciliationTotals.value.gross),
            String(-reconciliationTotals.value.fee),
            String(reconciliationTotals.value.net),
        ],
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
    link.download = `laporan-keuangan-${props.date_range.start_date}_${props.date_range.end_date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

function reportShell(body: string): string {
    return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Laporan Keuangan</title>
<style>
    body { color: #0f172a; font-family: Arial, sans-serif; margin: 0; padding: 28px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    h2 { font-size: 15px; margin: 24px 0 8px; border-bottom: 2px solid #0f172a; padding-bottom: 4px; }
    p.period { color: #475569; margin: 0 0 8px; }
    table { border-collapse: collapse; width: 100%; font-size: 13px; }
    td { padding: 7px 8px; border-bottom: 1px solid #e2e8f0; }
    td.num { text-align: right; font-variant-numeric: tabular-nums; }
    tr.total td { font-weight: bold; border-top: 2px solid #0f172a; border-bottom: none; }
    tr.sub td { font-weight: 600; background: #f8fafc; }
    .neg { color: #be123c; }
    th { background: #f1f5f9; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; padding: 8px; text-align: left; }
    th.num { text-align: right; }
</style>
</head>
<body>
    <h1>Laporan Keuangan</h1>
    <p class="period">Periode: ${periodLabel.value}</p>
    ${body}
</body>
</html>`;
}

function rp(value: number): string {
    return formatRupiah(value);
}

function printReport(): void {
    if (typeof window === 'undefined') {
        return;
    }

    const p = props.pnl;
    const c = props.cashflow;

    const labaRugi = `
        <h2>Laporan Laba Rugi</h2>
        <table>
            <tr><td>Penjualan Barang</td><td class="num">${rp(p.product_revenue)}</td></tr>
            <tr><td>Pendapatan Jasa (fee)</td><td class="num">${rp(p.jasa_revenue)}</td></tr>
            <tr class="sub"><td>Total Pendapatan (Omzet)</td><td class="num">${rp(p.total_revenue)}</td></tr>
            <tr><td>Harga Pokok Penjualan (HPP)</td><td class="num neg">−${rp(p.hpp)}</td></tr>
            <tr class="sub"><td>Laba Kotor</td><td class="num">${rp(p.gross_profit)}</td></tr>
            ${p.expense_breakdown.map((e) => `<tr><td>${e.label}</td><td class="num neg">−${rp(e.nominal)}</td></tr>`).join('')}
            <tr class="sub"><td>Total Biaya Operasional</td><td class="num neg">−${rp(p.operational_expenses)}</td></tr>
            <tr class="total"><td>Laba Bersih (margin ${p.margin}%)</td><td class="num">${rp(p.net_profit)}</td></tr>
        </table>`;

    const arusKas = `
        <h2>Laporan Arus Kas</h2>
        <table>
            <tr class="sub"><td>Kas Masuk</td><td class="num"></td></tr>
            <tr><td>Penjualan (omzet)</td><td class="num">${rp(c.kas_masuk)}</td></tr>
            <tr class="sub"><td>Kas Keluar</td><td class="num"></td></tr>
            <tr><td>Pembelian Bahan & Produksi</td><td class="num neg">−${rp(c.pembelian_produksi)}</td></tr>
            <tr><td>Biaya Operasional</td><td class="num neg">−${rp(c.biaya_operasional)}</td></tr>
            <tr class="total"><td>Arus Kas Bersih</td><td class="num">${rp(c.net_cash)}</td></tr>
        </table>`;

    const rekon = `
        <h2>Rekonsiliasi Pembayaran</h2>
        <table>
            <thead><tr><th>Metode</th><th class="num">Transaksi</th><th class="num">Bruto</th><th class="num">Biaya Admin</th><th class="num">Diterima Bersih</th></tr></thead>
            <tbody>
            ${reconciliationRows.value
                .map(
                    (r) =>
                        `<tr><td>${r.label} (${r.rate}%)</td><td class="num">${r.jumlah}</td><td class="num">${rp(r.total)}</td><td class="num neg">−${rp(r.fee)}</td><td class="num">${rp(r.net)}</td></tr>`,
                )
                .join('')}
            <tr class="total"><td>Total</td><td class="num">${reconciliationTotals.value.jumlah}</td><td class="num">${rp(reconciliationTotals.value.gross)}</td><td class="num neg">−${rp(reconciliationTotals.value.fee)}</td><td class="num">${rp(reconciliationTotals.value.net)}</td></tr>
            </tbody>
        </table>`;

    const win = window.open('', '_blank', 'width=900,height=720');

    if (!win) {
        window.alert(
            'Tidak dapat membuka jendela cetak. Pastikan pop-up tidak diblokir.',
        );

        return;
    }

    win.document.write(reportShell(labaRugi + arusKas + rekon));
    win.document.close();
    win.focus();
    win.print();
}
</script>

<template>
    <Head title="Laporan Keuangan - Admin" />

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
                    Laporan Keuangan
                </h1>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Laba rugi, arus kas, dan rekonsiliasi pembayaran usaha.
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

        <!-- Ringkasan visual -->
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
                            {{ formatRupiah(pnl.total_revenue) }}
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
                    HPP {{ formatRupiah(pnl.hpp) }}
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
                            Laba Kotor
                        </p>
                        <p class="mt-2 text-2xl font-bold">
                            {{ formatRupiah(pnl.gross_profit) }}
                        </p>
                    </div>
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
                    >
                        <Scale class="h-5 w-5" />
                    </div>
                </div>
                <p
                    class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                    Sebelum biaya operasional
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
                            Biaya Operasional
                        </p>
                        <p class="mt-2 text-2xl font-bold">
                            {{ formatRupiah(pnl.operational_expenses) }}
                        </p>
                    </div>
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-md bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                    >
                        <Receipt class="h-5 w-5" />
                    </div>
                </div>
                <p
                    class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                    Gaji, sewa, listrik, dll
                </p>
            </div>

            <div
                class="rounded-lg border p-5 shadow-sm"
                :class="
                    pnl.net_profit >= 0
                        ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                        : 'border-rose-200 bg-rose-50/60 dark:border-rose-500/30 dark:bg-rose-500/10'
                "
            >
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p
                            class="text-sm font-medium text-slate-500 dark:text-slate-400"
                        >
                            Laba Bersih
                        </p>
                        <p
                            class="mt-2 text-2xl font-bold"
                            :class="
                                pnl.net_profit >= 0
                                    ? 'text-emerald-700 dark:text-emerald-300'
                                    : 'text-rose-700 dark:text-rose-300'
                            "
                        >
                            {{ formatRupiah(pnl.net_profit) }}
                        </p>
                    </div>
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-md"
                        :class="
                            pnl.net_profit >= 0
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                        "
                    >
                        <Percent class="h-5 w-5" />
                    </div>
                </div>
                <p
                    class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                    Margin {{ pnl.margin }}%
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

        <!-- ============ TAB: LABA RUGI ============ -->
        <div
            v-if="activeTab === 'laba_rugi'"
            class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
        >
            <!-- Statement -->
            <section
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <h2 class="text-lg font-semibold">Laporan Laba Rugi</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Pendapatan dikurangi HPP & biaya operasional.
                </p>

                <div class="mt-5 space-y-1 text-sm">
                    <p
                        class="pb-1 text-xs font-bold tracking-wide text-slate-400 uppercase"
                    >
                        Pendapatan
                    </p>
                    <div class="flex items-center justify-between py-1.5">
                        <span class="text-slate-600 dark:text-slate-300"
                            >Penjualan Barang</span
                        ><span class="font-medium tabular-nums">{{
                            formatRupiah(pnl.product_revenue)
                        }}</span>
                    </div>
                    <div class="flex items-center justify-between py-1.5">
                        <span class="text-slate-600 dark:text-slate-300"
                            >Pendapatan Jasa (fee)</span
                        ><span class="font-medium tabular-nums">{{
                            formatRupiah(pnl.jasa_revenue)
                        }}</span>
                    </div>
                    <div
                        class="flex items-center justify-between border-t border-slate-200 py-2 font-semibold dark:border-zinc-700"
                    >
                        <span>Total Pendapatan (Omzet)</span
                        ><span class="tabular-nums">{{
                            formatRupiah(pnl.total_revenue)
                        }}</span>
                    </div>
                    <p
                        v-if="pnl.total_diskon > 0"
                        class="pt-0.5 text-xs text-slate-400"
                    >
                        Sudah termasuk potongan diskon
                        {{ formatRupiah(pnl.total_diskon) }}
                    </p>

                    <p
                        class="pt-4 pb-1 text-xs font-bold tracking-wide text-slate-400 uppercase"
                    >
                        Harga Pokok Penjualan
                    </p>
                    <div class="flex items-center justify-between py-1.5">
                        <span class="text-slate-600 dark:text-slate-300"
                            >HPP Barang Terjual</span
                        ><span
                            class="font-medium text-rose-600 tabular-nums dark:text-rose-400"
                            >−{{ formatRupiah(pnl.hpp) }}</span
                        >
                    </div>
                    <div
                        class="flex items-center justify-between border-t border-slate-200 py-2 font-semibold dark:border-zinc-700"
                    >
                        <span>Laba Kotor</span
                        ><span class="tabular-nums">{{
                            formatRupiah(pnl.gross_profit)
                        }}</span>
                    </div>

                    <p
                        class="pt-4 pb-1 text-xs font-bold tracking-wide text-slate-400 uppercase"
                    >
                        Biaya Operasional
                    </p>
                    <div
                        v-for="e in pnl.expense_breakdown"
                        :key="e.tipe"
                        class="flex items-center justify-between py-1.5"
                    >
                        <span class="text-slate-600 dark:text-slate-300">{{
                            e.label
                        }}</span>
                        <span
                            class="font-medium text-rose-600 tabular-nums dark:text-rose-400"
                            >−{{ formatRupiah(e.nominal) }}</span
                        >
                    </div>
                    <p
                        v-if="pnl.expense_breakdown.length === 0"
                        class="py-1.5 text-sm text-slate-400"
                    >
                        Belum ada biaya operasional pada periode ini.
                    </p>
                    <div
                        class="flex items-center justify-between border-t border-slate-200 py-2 font-semibold dark:border-zinc-700"
                    >
                        <span>Total Biaya Operasional</span
                        ><span
                            class="text-rose-600 tabular-nums dark:text-rose-400"
                            >−{{ formatRupiah(pnl.operational_expenses) }}</span
                        >
                    </div>

                    <div
                        class="mt-2 flex items-center justify-between rounded-lg px-3 py-3 text-base font-bold"
                        :class="
                            pnl.net_profit >= 0
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                        "
                    >
                        <span>Laba Bersih</span
                        ><span class="tabular-nums">{{
                            formatRupiah(pnl.net_profit)
                        }}</span>
                    </div>
                </div>
            </section>

            <!-- Waterfall + comparison + insight -->
            <section class="flex flex-col gap-4">
                <div
                    class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div
                        class="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-zinc-800"
                    >
                        <h2 class="text-lg font-semibold">Alur Laba</h2>
                        <div
                            class="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400"
                        >
                            <span class="inline-flex items-center gap-1.5"
                                ><span
                                    class="h-2.5 w-2.5 rounded-sm bg-emerald-500"
                                ></span
                                >Pemasukan</span
                            >
                            <span class="inline-flex items-center gap-1.5"
                                ><span
                                    class="h-2.5 w-2.5 rounded-sm bg-rose-400"
                                ></span
                                >Pengurang</span
                            >
                            <span class="inline-flex items-center gap-1.5"
                                ><span
                                    class="h-2.5 w-2.5 rounded-sm bg-sky-500"
                                ></span
                                >Subtotal</span
                            >
                        </div>
                    </div>

                    <div
                        v-if="monthly_cost_warning"
                        class="mt-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                    >
                        <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0" />
                        <p>
                            Rentang pendek ({{ period_days }} hari) memuat biaya
                            bulanan (gaji/sewa/pajak) — laba bisa terlihat "rugi
                            semu".
                        </p>
                    </div>

                    <div class="mt-4 overflow-x-auto">
                        <div class="min-w-[420px]">
                            <div class="relative h-56">
                                <div
                                    class="absolute inset-x-0 border-t border-dashed border-slate-300 dark:border-zinc-600"
                                    :style="{ top: waterfallView.zeroTop }"
                                ></div>
                                <div class="flex h-full items-stretch gap-1.5">
                                    <div
                                        v-for="bar in waterfallView.bars"
                                        :key="bar.label"
                                        class="relative flex-1"
                                    >
                                        <div
                                            class="absolute left-1/2 w-5 -translate-x-1/2 rounded-sm transition-all duration-300"
                                            :class="bar.colorClass"
                                            :style="{
                                                top: bar.topPct,
                                                height: bar.heightPct,
                                            }"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 flex gap-1.5">
                                <div
                                    v-for="bar in waterfallView.bars"
                                    :key="bar.label"
                                    class="min-w-0 flex-1 text-center"
                                >
                                    <p
                                        class="truncate text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                                    >
                                        {{ bar.label }}
                                    </p>
                                    <p
                                        class="truncate text-[9px] font-medium text-slate-400"
                                    >
                                        {{ bar.amountText }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid gap-3 sm:grid-cols-2">
                    <div
                        v-for="card in comparisonCards"
                        :key="card.label"
                        class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <p
                            class="text-sm font-medium text-slate-500 dark:text-slate-400"
                        >
                            {{ card.label }}
                        </p>
                        <p
                            class="mt-1 text-lg font-bold"
                            :class="
                                card.isNegative
                                    ? 'text-rose-600 dark:text-rose-400'
                                    : ''
                            "
                        >
                            {{ card.valueText }}
                        </p>
                        <p
                            class="mt-1 inline-flex items-center gap-1 text-xs font-medium"
                            :class="
                                card.good === null
                                    ? 'text-slate-500 dark:text-slate-400'
                                    : card.good
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
                            <template v-else>{{ card.prevText }}</template>
                        </p>
                    </div>
                </div>

                <div
                    class="flex items-start gap-3 rounded-lg p-4 shadow-sm"
                    :class="
                        insight.tone === 'success'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                    "
                >
                    <AlertTriangle class="mt-0.5 h-5 w-5 shrink-0" />
                    <p class="text-sm leading-relaxed">{{ insight.message }}</p>
                </div>
            </section>
        </div>

        <!-- ============ TAB: ARUS KAS ============ -->
        <div
            v-else-if="activeTab === 'arus_kas'"
            class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        >
            <section
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <h2 class="text-lg font-semibold">Laporan Arus Kas</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Uang tunai yang masuk dan keluar pada periode ini.
                </p>

                <div class="mt-5 space-y-1 text-sm">
                    <p
                        class="pb-1 text-xs font-bold tracking-wide text-emerald-500 uppercase"
                    >
                        Kas Masuk
                    </p>
                    <div class="flex items-center justify-between py-1.5">
                        <span class="text-slate-600 dark:text-slate-300"
                            >Penjualan (omzet)</span
                        ><span
                            class="font-medium text-emerald-600 tabular-nums dark:text-emerald-400"
                            >+{{ formatRupiah(cashflow.kas_masuk) }}</span
                        >
                    </div>
                    <div
                        class="flex items-center justify-between border-t border-slate-200 py-2 font-semibold dark:border-zinc-700"
                    >
                        <span>Total Kas Masuk</span
                        ><span class="tabular-nums">{{
                            formatRupiah(cashflow.kas_masuk)
                        }}</span>
                    </div>

                    <p
                        class="pt-4 pb-1 text-xs font-bold tracking-wide text-rose-500 uppercase"
                    >
                        Kas Keluar
                    </p>
                    <div class="flex items-center justify-between py-1.5">
                        <span class="text-slate-600 dark:text-slate-300"
                            >Pembelian Bahan & Produksi</span
                        >
                        <span
                            class="font-medium text-rose-600 tabular-nums dark:text-rose-400"
                            >−{{
                                formatRupiah(cashflow.pembelian_produksi)
                            }}</span
                        >
                    </div>
                    <div class="flex items-center justify-between py-1.5">
                        <span class="text-slate-600 dark:text-slate-300"
                            >Biaya Operasional</span
                        ><span
                            class="font-medium text-rose-600 tabular-nums dark:text-rose-400"
                            >−{{
                                formatRupiah(cashflow.biaya_operasional)
                            }}</span
                        >
                    </div>
                    <div
                        class="flex items-center justify-between border-t border-slate-200 py-2 font-semibold dark:border-zinc-700"
                    >
                        <span>Total Kas Keluar</span
                        ><span
                            class="text-rose-600 tabular-nums dark:text-rose-400"
                            >−{{ formatRupiah(cashflow.kas_keluar) }}</span
                        >
                    </div>

                    <div
                        class="mt-2 flex items-center justify-between rounded-lg px-3 py-3 text-base font-bold"
                        :class="
                            cashflow.net_cash >= 0
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                        "
                    >
                        <span>Arus Kas Bersih</span
                        ><span class="tabular-nums">{{
                            formatRupiah(cashflow.net_cash)
                        }}</span>
                    </div>
                </div>
            </section>

            <section class="flex flex-col gap-4">
                <div
                    class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <h3
                        class="text-sm font-semibold text-slate-600 dark:text-slate-300"
                    >
                        Rincian Kas Keluar
                    </h3>
                    <div class="mt-4 space-y-3 text-sm">
                        <div>
                            <div class="flex items-center justify-between">
                                <span class="text-slate-600 dark:text-slate-300"
                                    >Batch Produksi</span
                                ><span class="font-medium tabular-nums">{{
                                    formatRupiah(cashflow.biaya_produksi)
                                }}</span>
                            </div>
                            <div class="mt-1 flex items-center justify-between">
                                <span class="text-slate-600 dark:text-slate-300"
                                    >Belanja Bahan / Kemasan</span
                                ><span class="font-medium tabular-nums">{{
                                    formatRupiah(cashflow.belanja_bahan)
                                }}</span>
                            </div>
                            <div class="mt-1 flex items-center justify-between">
                                <span class="text-slate-600 dark:text-slate-300"
                                    >Biaya Operasional</span
                                ><span class="font-medium tabular-nums">{{
                                    formatRupiah(cashflow.biaya_operasional)
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="cashflow.jasa_pass_through > 0"
                    class="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/60"
                >
                    <Banknote class="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                    <p class="text-slate-600 dark:text-slate-300">
                        Titipan jasa (transfer/tarik tunai) sebesar
                        <span class="font-semibold">{{
                            formatRupiah(cashflow.jasa_pass_through)
                        }}</span>
                        masuk lalu keluar lagi (net nol), jadi tidak dihitung
                        dalam arus kas usaha.
                    </p>
                </div>

                <div
                    class="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                >
                    <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                        Arus kas dihitung dari data yang tercatat: penjualan,
                        biaya produksi, belanja bahan, dan pengeluaran.
                        Pembelian stok barang "beli" yang tidak dicatat sebagai
                        pengeluaran, setoran modal, atau pembayaran utang
                        supplier belum termasuk.
                    </p>
                </div>
            </section>
        </div>

        <!-- ============ TAB: REKONSILIASI ============ -->
        <div
            v-else
            class="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
        >
            <section
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <h2 class="text-lg font-semibold">Rekonsiliasi Pembayaran</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Pemasukan per metode bayar dikurangi biaya admin (MDR). Ubah
                    tarif sesuai kesepakatan dengan penyedia.
                </p>

                <div class="mt-5 overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr
                                class="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase dark:border-zinc-800 dark:text-slate-400"
                            >
                                <th class="pr-3 pb-2 font-semibold">Metode</th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Trx
                                </th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Bruto
                                </th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    MDR %
                                </th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Biaya
                                </th>
                                <th class="pb-2 pl-2 text-right font-semibold">
                                    Bersih
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            class="divide-y divide-slate-100 dark:divide-zinc-800"
                        >
                            <tr v-for="r in reconciliationRows" :key="r.metode">
                                <td class="py-3 pr-3">
                                    <span
                                        class="inline-flex items-center gap-2 font-semibold"
                                    >
                                        <span
                                            class="h-2.5 w-2.5 rounded-full"
                                            :class="methodColor[r.metode]"
                                        ></span
                                        >{{ r.label }}
                                    </span>
                                </td>
                                <td
                                    class="px-2 text-right text-slate-600 dark:text-slate-300"
                                >
                                    {{ r.jumlah }}
                                </td>
                                <td
                                    class="px-2 text-right font-medium tabular-nums"
                                >
                                    {{ formatRupiah(r.total) }}
                                </td>
                                <td class="px-2 text-right">
                                    <input
                                        v-model.number="mdrRates[r.metode]"
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        class="h-8 w-16 rounded-md border border-slate-200 bg-white px-2 text-right text-xs tabular-nums outline-none focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100"
                                    />
                                </td>
                                <td
                                    class="px-2 text-right text-rose-600 tabular-nums dark:text-rose-400"
                                >
                                    {{
                                        r.fee > 0
                                            ? `−${formatRupiah(r.fee)}`
                                            : '—'
                                    }}
                                </td>
                                <td
                                    class="pl-2 text-right font-semibold tabular-nums"
                                >
                                    {{ formatRupiah(r.net) }}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr
                                class="border-t-2 border-slate-300 font-bold dark:border-zinc-600"
                            >
                                <td class="py-3 pr-3">Total</td>
                                <td class="px-2 text-right">
                                    {{ reconciliationTotals.jumlah }}
                                </td>
                                <td class="px-2 text-right tabular-nums">
                                    {{
                                        formatRupiah(reconciliationTotals.gross)
                                    }}
                                </td>
                                <td class="px-2"></td>
                                <td
                                    class="px-2 text-right text-rose-600 tabular-nums dark:text-rose-400"
                                >
                                    {{
                                        reconciliationTotals.fee > 0
                                            ? `−${formatRupiah(reconciliationTotals.fee)}`
                                            : '—'
                                    }}
                                </td>
                                <td class="pl-2 text-right tabular-nums">
                                    {{ formatRupiah(reconciliationTotals.net) }}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <p class="mt-4 text-xs text-slate-400">
                    QRIS &amp; Transfer masuk ke rekening bank (setelah dipotong
                    MDR); Tunai tetap berupa uang fisik di laci.
                </p>
            </section>

            <section class="flex flex-col gap-4">
                <div
                    class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <h3
                        class="text-sm font-semibold text-slate-600 dark:text-slate-300"
                    >
                        Komposisi Pembayaran
                    </h3>
                    <div class="mt-4 space-y-4">
                        <div v-for="r in reconciliationRows" :key="r.metode">
                            <div
                                class="flex items-center justify-between text-sm"
                            >
                                <span class="font-semibold">{{ r.label }}</span>
                                <span class="text-slate-500 dark:text-slate-400"
                                    >{{ formatRupiah(r.total) }} ·
                                    {{ Math.round(r.share) }}%</span
                                >
                            </div>
                            <div
                                class="mt-2 h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800"
                            >
                                <div
                                    class="h-full rounded-full transition-all"
                                    :class="methodColor[r.metode]"
                                    :style="{ width: `${r.share}%` }"
                                ></div>
                            </div>
                        </div>
                        <p
                            v-if="reconciliationTotals.gross === 0"
                            class="text-sm text-slate-400"
                        >
                            Belum ada transaksi pada periode ini.
                        </p>
                    </div>
                </div>

                <div
                    class="rounded-lg border border-sky-200 bg-sky-50 p-5 dark:border-sky-500/30 dark:bg-sky-500/10"
                >
                    <p
                        class="text-sm font-medium text-sky-700 dark:text-sky-300"
                    >
                        Estimasi masuk rekening bank
                    </p>
                    <p
                        class="mt-1 text-2xl font-bold text-sky-700 dark:text-sky-300"
                    >
                        {{
                            formatRupiah(
                                reconciliationRows
                                    .filter((r) => r.metode !== 'cash')
                                    .reduce((s, r) => s + r.net, 0),
                            )
                        }}
                    </p>
                    <p
                        class="mt-1 text-xs text-sky-600/80 dark:text-sky-400/80"
                    >
                        Dari QRIS &amp; Transfer, setelah dipotong biaya admin.
                    </p>
                </div>
            </section>
        </div>

        <!-- Tren omzet (selalu tampil di bawah) -->
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
