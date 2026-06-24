<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import {
    AlertTriangle,
    Boxes,
    Flame,
    Mail,
    PackageX,
    Printer,
    Sheet,
    Snowflake,
    Warehouse,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import PeriodFilter from '@/components/PeriodFilter.vue';
import { formatRupiah, formatNumber } from '@/lib/format';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Laporan', href: '/admin/laporan/inventaris' },
            { title: 'Stok & Inventaris', href: '/admin/laporan/inventaris' },
        ],
    },
});

type Kelas = 'fast' | 'slow' | 'dead';

interface ProductRow {
    id_produk: number;
    nama: string;
    kategori: string;
    satuan: string;
    qty: number;
    revenue: number;
    trx: number;
    stok: number;
    harga_modal: number;
    stock_value: number;
    velocity: number;
    days_of_supply: number | null;
    last_sold: string | null;
    kelas: Kelas;
}

interface ClassSummary {
    count: number;
    stock_value: number;
    revenue: number;
    qty: number;
}

const props = defineProps<{
    date_range: { start_date: string; end_date: string };
    period_days: number;
    summary: Record<Kelas, ClassSummary>;
    totals: {
        products: number;
        stock_value: number;
        revenue: number;
        qty: number;
    };
    products: ProductRow[];
}>();

// ---------------------------------------------------------------
// Metadata kelas (warna & label) — satu sumber untuk badge/legenda/tab.
// ---------------------------------------------------------------
const classMeta: Record<
    Kelas,
    {
        label: string;
        bar: string;
        dot: string;
        icon: typeof Flame;
        chip: string;
    }
> = {
    fast: {
        label: 'Fast-moving',
        bar: 'bg-emerald-500',
        dot: 'bg-emerald-500',
        icon: Flame,
        chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    },
    slow: {
        label: 'Slow-moving',
        bar: 'bg-amber-500',
        dot: 'bg-amber-500',
        icon: Snowflake,
        chip: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    },
    dead: {
        label: 'Dead-stock',
        bar: 'bg-rose-500',
        dot: 'bg-rose-500',
        icon: PackageX,
        chip: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
    },
};

// ---------------------------------------------------------------
// Filter periode — jendela bergulir (cocok untuk analisis perputaran)
// ---------------------------------------------------------------
const REPORT_URL = '/admin/laporan/inventaris';
function onPeriod(range: { start_date: string; end_date: string }): void {
    router.get(REPORT_URL, { start_date: range.start_date, end_date: range.end_date }, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}

// ---------------------------------------------------------------
// Komposisi (visual ringkas di atas) — per jumlah produk & per nilai modal
// ---------------------------------------------------------------
const KELAS_ORDER: Kelas[] = ['fast', 'slow', 'dead'];

const distByCount = computed(() =>
    KELAS_ORDER.map((kelas) => ({
        kelas,
        value: props.summary[kelas].count,
        pct:
            props.totals.products > 0
                ? (props.summary[kelas].count / props.totals.products) * 100
                : 0,
    })),
);

const distByValue = computed(() =>
    KELAS_ORDER.map((kelas) => ({
        kelas,
        value: props.summary[kelas].stock_value,
        pct:
            props.totals.stock_value > 0
                ? (props.summary[kelas].stock_value /
                      props.totals.stock_value) *
                  100
                : 0,
    })),
);

// ---------------------------------------------------------------
// Tabel per kelas
// ---------------------------------------------------------------
type TabKey = Kelas;
const activeTab = ref<TabKey>('fast');
const tabs: { key: TabKey; icon: typeof Flame }[] = [
    { key: 'fast', icon: Flame },
    { key: 'slow', icon: Snowflake },
    { key: 'dead', icon: PackageX },
];

const fastRows = computed(() =>
    props.products
        .filter((p) => p.kelas === 'fast')
        .sort((a, b) => b.qty - a.qty),
);
const slowRows = computed(() =>
    props.products
        .filter((p) => p.kelas === 'slow')
        .sort((a, b) => b.stock_value - a.stock_value),
);
const deadRows = computed(() =>
    props.products
        .filter((p) => p.kelas === 'dead')
        .sort((a, b) => b.stock_value - a.stock_value),
);

const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
];

// Format tanggal deterministik (hindari mismatch hidrasi dari Intl date).
function formatDate(value: string | null): string {
    if (!value) {
        return 'Belum pernah';
    }

    const [y, m, d] = value.slice(0, 10).split('-');

    return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}

function qtyLabel(row: ProductRow): string {
    return `${formatNumber(row.qty)} ${row.satuan}`;
}

// ---------------------------------------------------------------
// Ekspor: Cetak/PDF, Excel (CSV), WhatsApp, Email
// ---------------------------------------------------------------
const periodLabel = computed(
    () => `${props.date_range.start_date} s/d ${props.date_range.end_date}`,
);

function buildSummaryText(): string {
    const s = props.summary;
    const lines = [
        `*Laporan Stok & Inventaris*`,
        `Periode: ${periodLabel.value} (${props.period_days} hari)`,
        ``,
        `Nilai Aset Stok: ${formatRupiah(props.totals.stock_value)} (${props.totals.products} produk)`,
        ``,
        `🔥 Fast-moving: ${s.fast.count} produk`,
        `❄️ Slow-moving: ${s.slow.count} produk`,
        `⚠️ Dead-stock: ${s.dead.count} produk — modal mengendap ${formatRupiah(s.dead.stock_value)}`,
    ];

    const topDead = deadRows.value.filter((r) => r.stock_value > 0).slice(0, 5);

    if (topDead.length > 0) {
        lines.push('', '*Dead-stock modal terbesar:*');
        topDead.forEach((r) =>
            lines.push(`• ${r.nama} — ${formatRupiah(r.stock_value)}`),
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
    const subject = `Laporan Stok & Inventaris ${periodLabel.value}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildSummaryText())}`;
}

function downloadCsv(): void {
    const header = [
        'Kelas',
        'Produk',
        'Kategori',
        'Terjual',
        'Satuan',
        'Transaksi',
        'Omzet',
        'Stok',
        'Nilai Modal',
        'Estimasi Habis (hari)',
        'Terakhir Terjual',
    ];
    const ordered = [...fastRows.value, ...slowRows.value, ...deadRows.value];
    const rows: string[][] = [
        ['Laporan Stok & Inventaris', periodLabel.value],
        [],
        header,
        ...ordered.map((r) => [
            classMeta[r.kelas].label,
            r.nama,
            r.kategori,
            String(r.qty),
            r.satuan,
            String(r.trx),
            String(r.revenue),
            String(r.stok),
            String(r.stock_value),
            r.days_of_supply !== null ? String(r.days_of_supply) : '',
            r.last_sold ? r.last_sold.slice(0, 10) : '',
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
    link.download = `laporan-inventaris-${props.date_range.start_date}_${props.date_range.end_date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

function printReport(): void {
    if (typeof window === 'undefined') {
        return;
    }

    const fastTable = `
        <h2>Fast-moving (${props.summary.fast.count})</h2>
        <table>
            <thead><tr><th>Produk</th><th>Kategori</th><th class="num">Terjual</th><th class="num">Trx</th><th class="num">Omzet</th><th class="num">Stok</th><th class="num">Estimasi Habis</th></tr></thead>
            <tbody>
            ${
                fastRows.value
                    .map(
                        (r) =>
                            `<tr><td>${r.nama}</td><td>${r.kategori}</td><td class="num">${formatNumber(r.qty)} ${r.satuan}</td><td class="num">${r.trx}</td><td class="num">${formatRupiah(r.revenue)}</td><td class="num">${formatNumber(r.stok)}</td><td class="num">${r.days_of_supply !== null ? `${r.days_of_supply} hari` : '-'}</td></tr>`,
                    )
                    .join('') ||
                '<tr><td colspan="7">Tidak ada produk.</td></tr>'
            }
            </tbody>
        </table>`;

    const slowTable = `
        <h2>Slow-moving (${props.summary.slow.count})</h2>
        <table>
            <thead><tr><th>Produk</th><th>Kategori</th><th class="num">Terjual</th><th class="num">Omzet</th><th class="num">Stok</th><th class="num">Nilai Modal</th></tr></thead>
            <tbody>
            ${
                slowRows.value
                    .map(
                        (r) =>
                            `<tr><td>${r.nama}</td><td>${r.kategori}</td><td class="num">${formatNumber(r.qty)} ${r.satuan}</td><td class="num">${formatRupiah(r.revenue)}</td><td class="num">${formatNumber(r.stok)}</td><td class="num">${formatRupiah(r.stock_value)}</td></tr>`,
                    )
                    .join('') ||
                '<tr><td colspan="6">Tidak ada produk.</td></tr>'
            }
            </tbody>
        </table>`;

    const deadTable = `
        <h2>Dead-stock (${props.summary.dead.count}) — modal mengendap ${formatRupiah(props.summary.dead.stock_value)}</h2>
        <table>
            <thead><tr><th>Produk</th><th>Kategori</th><th class="num">Stok</th><th class="num">Nilai Modal</th><th>Terakhir Terjual</th></tr></thead>
            <tbody>
            ${
                deadRows.value
                    .map(
                        (r) =>
                            `<tr><td>${r.nama}</td><td>${r.kategori}</td><td class="num">${formatNumber(r.stok)} ${r.satuan}</td><td class="num">${formatRupiah(r.stock_value)}</td><td>${formatDate(r.last_sold)}</td></tr>`,
                    )
                    .join('') ||
                '<tr><td colspan="5">Tidak ada produk.</td></tr>'
            }
            </tbody>
        </table>`;

    const shell = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Laporan Stok & Inventaris</title>
<style>
    body { color: #0f172a; font-family: Arial, sans-serif; margin: 0; padding: 28px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    h2 { font-size: 15px; margin: 24px 0 8px; border-bottom: 2px solid #0f172a; padding-bottom: 4px; }
    p.period { color: #475569; margin: 0 0 8px; }
    table { border-collapse: collapse; width: 100%; font-size: 12px; margin-bottom: 8px; }
    td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; }
    td.num { text-align: right; font-variant-numeric: tabular-nums; }
    th { background: #f1f5f9; font-size: 10px; letter-spacing: .05em; text-transform: uppercase; padding: 7px 8px; text-align: left; }
    th.num { text-align: right; }
</style>
</head>
<body>
    <h1>Laporan Stok &amp; Inventaris</h1>
    <p class="period">Periode: ${periodLabel.value} (${props.period_days} hari) &middot; Nilai aset stok ${formatRupiah(props.totals.stock_value)}</p>
    ${fastTable}${slowTable}${deadTable}
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
    <Head title="Stok & Inventaris - Admin" />

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
                    Manajemen Stok &amp; Inventaris
                </h1>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Analisis ABC perputaran stok: efisiensi modal yang tertanam
                    di barang dagangan.
                </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <!-- Filter periode -->
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
                            Nilai Aset Stok
                        </p>
                        <p class="mt-2 text-2xl font-bold">
                            {{ formatRupiah(totals.stock_value) }}
                        </p>
                    </div>
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
                    >
                        <Warehouse class="h-5 w-5" />
                    </div>
                </div>
                <p
                    class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                    {{ totals.products }} produk berstok &middot; harga modal
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
                            Fast-moving
                        </p>
                        <p
                            class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400"
                        >
                            {{ summary.fast.count }}
                            <span class="text-base font-semibold text-slate-400"
                                >produk</span
                            >
                        </p>
                    </div>
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                    >
                        <Flame class="h-5 w-5" />
                    </div>
                </div>
                <p
                    class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                    Modal {{ formatRupiah(summary.fast.stock_value) }}
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
                            Slow-moving
                        </p>
                        <p
                            class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400"
                        >
                            {{ summary.slow.count }}
                            <span class="text-base font-semibold text-slate-400"
                                >produk</span
                            >
                        </p>
                    </div>
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-md bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                    >
                        <Snowflake class="h-5 w-5" />
                    </div>
                </div>
                <p
                    class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                    Modal {{ formatRupiah(summary.slow.stock_value) }}
                </p>
            </div>

            <div
                class="rounded-lg border p-5 shadow-sm"
                :class="
                    summary.dead.count > 0
                        ? 'border-rose-200 bg-rose-50/60 dark:border-rose-500/30 dark:bg-rose-500/10'
                        : 'border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
                "
            >
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p
                            class="text-sm font-medium text-slate-500 dark:text-slate-400"
                        >
                            Dead-stock
                        </p>
                        <p
                            class="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400"
                        >
                            {{ summary.dead.count }}
                            <span class="text-base font-semibold text-slate-400"
                                >produk</span
                            >
                        </p>
                    </div>
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-md bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                    >
                        <PackageX class="h-5 w-5" />
                    </div>
                </div>
                <p
                    class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                    Modal mengendap {{ formatRupiah(summary.dead.stock_value) }}
                </p>
            </div>
        </div>

        <!-- Empty state -->
        <div
            v-if="totals.products === 0"
            class="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 py-20 text-center dark:border-zinc-700"
        >
            <Boxes class="h-10 w-10 text-slate-400" />
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">
                Belum ada produk berstok untuk dianalisis.
            </p>
        </div>

        <template v-else>
            <!-- Komposisi (visual ringkas) -->
            <section
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div
                    class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-zinc-800"
                >
                    <h2 class="text-lg font-semibold">
                        Komposisi Perputaran Stok
                    </h2>
                    <div
                        class="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400"
                    >
                        <span
                            v-for="kelas in KELAS_ORDER"
                            :key="kelas"
                            class="inline-flex items-center gap-1.5"
                        >
                            <span
                                class="h-2.5 w-2.5 rounded-sm"
                                :class="classMeta[kelas].dot"
                            ></span
                            >{{ classMeta[kelas].label }}
                        </span>
                    </div>
                </div>

                <div class="mt-5 space-y-5">
                    <div>
                        <div
                            class="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400"
                        >
                            <span>Jumlah Produk</span
                            ><span>{{ totals.products }} produk</span>
                        </div>
                        <div
                            class="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800"
                        >
                            <div
                                v-for="seg in distByCount"
                                :key="seg.kelas"
                                class="h-full transition-all"
                                :class="classMeta[seg.kelas].bar"
                                :style="{ width: `${seg.pct}%` }"
                                :title="`${classMeta[seg.kelas].label}: ${seg.value} produk`"
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div
                            class="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400"
                        >
                            <span>Nilai Modal Tertanam</span
                            ><span>{{ formatRupiah(totals.stock_value) }}</span>
                        </div>
                        <div
                            class="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800"
                        >
                            <div
                                v-for="seg in distByValue"
                                :key="seg.kelas"
                                class="h-full transition-all"
                                :class="classMeta[seg.kelas].bar"
                                :style="{ width: `${seg.pct}%` }"
                                :title="`${classMeta[seg.kelas].label}: ${formatRupiah(seg.value)}`"
                            ></div>
                        </div>
                        <p
                            v-if="summary.dead.stock_value > 0"
                            class="mt-2 text-xs text-rose-600 dark:text-rose-400"
                        >
                            {{ Math.round(distByValue[2].pct) }}% modal Anda ({{
                                formatRupiah(summary.dead.stock_value)
                            }}) tertahan di produk yang tidak laku.
                        </p>
                    </div>
                </div>
            </section>

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
                    <span>{{ classMeta[tab.key].label }}</span>
                    <span
                        class="rounded-full px-1.5 py-0.5 text-[11px] font-bold"
                        :class="
                            activeTab === tab.key
                                ? 'bg-white/20 text-white'
                                : classMeta[tab.key].chip
                        "
                        >{{ summary[tab.key].count }}</span
                    >
                </button>
            </div>

            <!-- ============ TAB: FAST-MOVING ============ -->
            <section
                v-if="activeTab === 'fast'"
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div
                    class="flex items-start gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                >
                    <Flame class="mt-0.5 h-5 w-5 shrink-0" />
                    <p>
                        Produk paling laku (penyumbang ~80% volume penjualan).
                        Pastikan stok selalu aman — jangan sampai kehabisan saat
                        sedang ramai.
                    </p>
                </div>

                <div class="mt-4 overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr
                                class="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase dark:border-zinc-800 dark:text-slate-400"
                            >
                                <th class="pr-3 pb-2 font-semibold">Produk</th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Terjual
                                </th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Trx
                                </th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Omzet
                                </th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Stok
                                </th>
                                <th class="pb-2 pl-2 text-right font-semibold">
                                    Estimasi Habis
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            class="divide-y divide-slate-100 dark:divide-zinc-800"
                        >
                            <tr v-for="r in fastRows" :key="r.id_produk">
                                <td class="py-3 pr-3">
                                    <p class="font-semibold">{{ r.nama }}</p>
                                    <p class="text-xs text-slate-400">
                                        {{ r.kategori }}
                                    </p>
                                </td>
                                <td
                                    class="px-2 text-right font-medium tabular-nums"
                                >
                                    {{ qtyLabel(r) }}
                                </td>
                                <td
                                    class="px-2 text-right text-slate-600 dark:text-slate-300"
                                >
                                    {{ r.trx }}
                                </td>
                                <td
                                    class="px-2 text-right font-medium tabular-nums"
                                >
                                    {{ formatRupiah(r.revenue) }}
                                </td>
                                <td class="px-2 text-right tabular-nums">
                                    {{ formatNumber(r.stok) }}
                                </td>
                                <td class="pl-2 text-right">
                                    <span
                                        class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums"
                                        :class="
                                            r.stok <= 0
                                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                                                : (r.days_of_supply ?? 999) <= 7
                                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                                                  : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300'
                                        "
                                    >
                                        {{
                                            r.stok <= 0
                                                ? 'Stok habis'
                                                : `≈ ${r.days_of_supply} hari`
                                        }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p
                        v-if="fastRows.length === 0"
                        class="py-8 text-center text-sm text-slate-400"
                    >
                        Belum ada produk fast-moving pada periode ini.
                    </p>
                </div>
            </section>

            <!-- ============ TAB: SLOW-MOVING ============ -->
            <section
                v-else-if="activeTab === 'slow'"
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div
                    class="flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                >
                    <Snowflake class="mt-0.5 h-5 w-5 shrink-0" />
                    <p>
                        Kurang laku — masih terjual tapi lambat. Rem pembelian
                        agar modal tidak menumpuk; pertimbangkan promo bundling
                        untuk mempercepat perputaran.
                    </p>
                </div>

                <div class="mt-4 overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr
                                class="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase dark:border-zinc-800 dark:text-slate-400"
                            >
                                <th class="pr-3 pb-2 font-semibold">Produk</th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Terjual
                                </th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Omzet
                                </th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Stok
                                </th>
                                <th class="pb-2 pl-2 text-right font-semibold">
                                    Nilai Modal
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            class="divide-y divide-slate-100 dark:divide-zinc-800"
                        >
                            <tr v-for="r in slowRows" :key="r.id_produk">
                                <td class="py-3 pr-3">
                                    <p class="font-semibold">{{ r.nama }}</p>
                                    <p class="text-xs text-slate-400">
                                        {{ r.kategori }}
                                    </p>
                                </td>
                                <td
                                    class="px-2 text-right font-medium tabular-nums"
                                >
                                    {{ qtyLabel(r) }}
                                </td>
                                <td class="px-2 text-right tabular-nums">
                                    {{ formatRupiah(r.revenue) }}
                                </td>
                                <td class="px-2 text-right tabular-nums">
                                    {{ formatNumber(r.stok) }}
                                </td>
                                <td
                                    class="pl-2 text-right font-medium tabular-nums"
                                >
                                    {{ formatRupiah(r.stock_value) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p
                        v-if="slowRows.length === 0"
                        class="py-8 text-center text-sm text-slate-400"
                    >
                        Belum ada produk slow-moving pada periode ini.
                    </p>
                </div>
            </section>

            <!-- ============ TAB: DEAD-STOCK ============ -->
            <section
                v-else
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div
                    class="flex items-start gap-3 rounded-lg bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                >
                    <AlertTriangle class="mt-0.5 h-5 w-5 shrink-0" />
                    <p>
                        Tidak terjual sama sekali pada periode ini. Modal
                        mengendap
                        <span class="font-bold">{{
                            formatRupiah(summary.dead.stock_value)
                        }}</span>
                        — segera diskon atau cuci gudang agar uang berputar
                        kembali.
                    </p>
                </div>

                <div class="mt-4 overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr
                                class="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase dark:border-zinc-800 dark:text-slate-400"
                            >
                                <th class="pr-3 pb-2 font-semibold">Produk</th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Stok
                                </th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Nilai Modal
                                </th>
                                <th class="pb-2 pl-2 text-right font-semibold">
                                    Terakhir Terjual
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            class="divide-y divide-slate-100 dark:divide-zinc-800"
                        >
                            <tr v-for="r in deadRows" :key="r.id_produk">
                                <td class="py-3 pr-3">
                                    <p class="font-semibold">{{ r.nama }}</p>
                                    <p class="text-xs text-slate-400">
                                        {{ r.kategori }}
                                    </p>
                                </td>
                                <td class="px-2 text-right tabular-nums">
                                    {{ formatNumber(r.stok) }} {{ r.satuan }}
                                </td>
                                <td
                                    class="px-2 text-right font-semibold tabular-nums"
                                    :class="
                                        r.stock_value > 0
                                            ? 'text-rose-600 dark:text-rose-400'
                                            : 'text-slate-400'
                                    "
                                >
                                    {{ formatRupiah(r.stock_value) }}
                                </td>
                                <td
                                    class="pl-2 text-right text-slate-600 dark:text-slate-300"
                                >
                                    {{ formatDate(r.last_sold) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p
                        v-if="deadRows.length === 0"
                        class="py-8 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400"
                    >
                        Bagus! Semua produk berstok terjual pada periode ini.
                    </p>
                </div>
            </section>

            <!-- Catatan metodologi -->
            <div
                class="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-slate-300"
            >
                <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <p>
                    Klasifikasi dihitung dari penjualan {{ period_days }} hari
                    terakhir. <b>Fast-moving</b> = produk penyumbang ~80% volume
                    penjualan teratas; <b>Slow-moving</b> = sisa produk yang
                    masih terjual; <b>Dead-stock</b> = tidak terjual sama sekali
                    pada periode ini. <b>Nilai modal</b> = stok &times; harga
                    modal. <b>Estimasi habis</b> = perkiraan stok mencukupi
                    berapa hari pada laju penjualan saat ini. Produk jasa tidak
                    diikutkan (tidak mengelola stok).
                </p>
            </div>
        </template>
    </div>
</template>
