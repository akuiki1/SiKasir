<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import {
    AlertTriangle,
    Crown,
    Link2,
    Mail,
    Phone,
    Printer,
    Repeat,
    Sheet,
    ShoppingBasket,
    Trophy,
    UserPlus,
    UsersRound,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import PeriodFilter from '@/components/PeriodFilter.vue';
import { formatRupiah, formatNumber } from '@/lib/format';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Laporan', href: '/admin/laporan/pelanggan' },
            { title: 'Wawasan Pelanggan', href: '/admin/laporan/pelanggan' },
        ],
    },
});

interface Summary {
    total_transactions: number;
    total_revenue: number;
    avg_basket: number;
    avg_items: number;
    multi_item_rate: number;
    active_customers: number;
    new_customers: number;
    returning_customers: number;
    repeat_rate: number;
    registered_share: number;
}

interface SidePart {
    transactions: number;
    revenue: number;
}

interface TopCustomer {
    id_pelanggan: number;
    nama: string;
    tipe: 'umum' | 'reseller';
    telp: string | null;
    transactions: number;
    revenue: number;
    avg: number;
    last_visit: string | null;
    is_returning: boolean;
}

interface Retention {
    active: number;
    new: number;
    returning: number;
    repeat_rate: number;
    one_timers: number;
    repeaters: number;
}

interface Bundle {
    a: string;
    b: string;
    count: number;
    pct: number;
}

const props = defineProps<{
    date_range: { start_date: string; end_date: string };
    period_days: number;
    summary: Summary;
    composition: { registered: SidePart; guest: SidePart };
    top_customers: TopCustomer[];
    retention: Retention;
    bundles: Bundle[];
}>();

// ---------------------------------------------------------------
// Filter periode — jendela bergulir (perilaku pelanggan butuh rentang panjang)
// ---------------------------------------------------------------
const REPORT_URL = '/admin/laporan/pelanggan';

function onPeriod(range: { start_date: string; end_date: string }): void {
    router.get(REPORT_URL, { start_date: range.start_date, end_date: range.end_date }, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}

// ---------------------------------------------------------------
// Komposisi: Terdaftar vs Umum (walk-in)
// ---------------------------------------------------------------
const compTrx = computed(() => {
    const reg = props.composition.registered.transactions;
    const guest = props.composition.guest.transactions;
    const total = reg + guest;

    return {
        regPct: total > 0 ? (reg / total) * 100 : 0,
        guestPct: total > 0 ? (guest / total) * 100 : 0,
        reg,
        guest,
        total,
    };
});

const compRevenue = computed(() => {
    const reg = props.composition.registered.revenue;
    const guest = props.composition.guest.revenue;
    const total = reg + guest;

    return {
        regPct: total > 0 ? (reg / total) * 100 : 0,
        guestPct: total > 0 ? (guest / total) * 100 : 0,
        reg,
        guest,
        total,
    };
});

// Retensi: baru vs kembali (share untuk bar).
const retentionShare = computed(() => {
    const active = props.retention.active;

    return {
        newPct: active > 0 ? (props.retention.new / active) * 100 : 0,
        returningPct: active > 0 ? (props.retention.returning / active) * 100 : 0,
    };
});

// ---------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------
type TabKey = 'loyal' | 'basket' | 'retensi';
const activeTab = ref<TabKey>('loyal');
const tabs: { key: TabKey; label: string; icon: typeof Crown }[] = [
    { key: 'loyal', label: 'Pelanggan Terloyal', icon: Crown },
    { key: 'basket', label: 'Keranjang & Bundling', icon: ShoppingBasket },
    { key: 'retensi', label: 'Retensi', icon: Repeat },
];

// Urutan pelanggan terloyal: total belanja atau frekuensi kunjungan.
type TopSort = 'revenue' | 'visits';
const topSort = ref<TopSort>('revenue');
const sortedCustomers = computed(() =>
    [...props.top_customers].sort((a, b) =>
        topSort.value === 'revenue'
            ? b.revenue - a.revenue
            : b.transactions - a.transactions,
    ),
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
        return '—';
    }

    const [y, m, d] = value.slice(0, 10).split('-');

    return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
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
        `*Wawasan Pelanggan*`,
        `Periode: ${periodLabel.value} (${props.period_days} hari)`,
        ``,
        `Rata-rata keranjang: ${formatRupiah(s.avg_basket)} / transaksi`,
        `Total transaksi: ${formatNumber(s.total_transactions)}`,
        `Pelanggan terdaftar aktif: ${s.active_customers} (${s.new_customers} baru, ${s.returning_customers} kembali)`,
        `Repeat order rate: ${s.repeat_rate}%`,
    ];

    const top = sortedCustomers.value.slice(0, 5);

    if (top.length > 0) {
        lines.push('', '*Pelanggan terloyal:*');
        top.forEach((c, i) =>
            lines.push(
                `${i + 1}. ${c.nama} — ${formatRupiah(c.revenue)} (${c.transactions}x)`,
            ),
        );
    }

    if (props.bundles.length > 0) {
        lines.push('', '*Sering dibeli bersamaan:*');
        props.bundles
            .slice(0, 3)
            .forEach((b) => lines.push(`• ${b.a} + ${b.b} (${b.count}x)`));
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
    const subject = `Wawasan Pelanggan ${periodLabel.value}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildSummaryText())}`;
}

function downloadCsv(): void {
    const header = [
        'Peringkat',
        'Pelanggan',
        'Tipe',
        'Telepon',
        'Kunjungan',
        'Total Belanja',
        'Rata-rata',
        'Kunjungan Terakhir',
        'Status',
    ];
    const rows: string[][] = [
        ['Wawasan Pelanggan', periodLabel.value],
        [],
        ['Pelanggan Terloyal'],
        header,
        ...sortedCustomers.value.map((c, i) => [
            String(i + 1),
            c.nama,
            c.tipe === 'reseller' ? 'Reseller' : 'Umum',
            c.telp ?? '',
            String(c.transactions),
            String(c.revenue),
            String(c.avg),
            c.last_visit ? c.last_visit.slice(0, 10) : '',
            c.is_returning ? 'Kembali' : 'Baru',
        ]),
        [],
        ['Sering Dibeli Bersamaan'],
        ['Produk A', 'Produk B', 'Frekuensi', '% Keranjang Multi-item'],
        ...props.bundles.map((b) => [
            b.a,
            b.b,
            String(b.count),
            String(b.pct),
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
    link.download = `wawasan-pelanggan-${props.date_range.start_date}_${props.date_range.end_date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

function printReport(): void {
    if (typeof window === 'undefined') {
        return;
    }

    const s = props.summary;

    const loyalTable = `
        <h2>Pelanggan Terloyal</h2>
        <table>
            <thead><tr><th>#</th><th>Pelanggan</th><th>Tipe</th><th class="num">Kunjungan</th><th class="num">Total Belanja</th><th class="num">Rata-rata</th><th>Status</th></tr></thead>
            <tbody>
            ${
                sortedCustomers.value
                    .map(
                        (c, i) =>
                            `<tr><td class="num">${i + 1}</td><td>${c.nama}</td><td>${c.tipe === 'reseller' ? 'Reseller' : 'Umum'}</td><td class="num">${c.transactions}x</td><td class="num">${formatRupiah(c.revenue)}</td><td class="num">${formatRupiah(c.avg)}</td><td>${c.is_returning ? 'Kembali' : 'Baru'}</td></tr>`,
                    )
                    .join('') ||
                '<tr><td colspan="7">Belum ada pelanggan terdaftar pada periode ini.</td></tr>'
            }
            </tbody>
        </table>`;

    const bundleTable = `
        <h2>Sering Dibeli Bersamaan</h2>
        <table>
            <thead><tr><th>Pasangan Produk</th><th class="num">Frekuensi</th><th class="num">% Keranjang Multi-item</th></tr></thead>
            <tbody>
            ${
                props.bundles
                    .map(
                        (b) =>
                            `<tr><td>${b.a} + ${b.b}</td><td class="num">${b.count}x</td><td class="num">${b.pct}%</td></tr>`,
                    )
                    .join('') ||
                '<tr><td colspan="3">Belum ada pola produk yang dibeli bersamaan.</td></tr>'
            }
            </tbody>
        </table>`;

    const shell = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Wawasan Pelanggan</title>
<style>
    body { color: #0f172a; font-family: Arial, sans-serif; margin: 0; padding: 28px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    h2 { font-size: 15px; margin: 24px 0 8px; border-bottom: 2px solid #0f172a; padding-bottom: 4px; }
    p.period { color: #475569; margin: 0 0 8px; }
    ul.kpi { list-style: none; padding: 0; margin: 12px 0; display: flex; flex-wrap: wrap; gap: 16px; }
    ul.kpi li { font-size: 12px; color: #475569; }
    ul.kpi b { display: block; font-size: 16px; color: #0f172a; }
    table { border-collapse: collapse; width: 100%; font-size: 12px; margin-bottom: 8px; }
    td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; }
    td.num { text-align: right; font-variant-numeric: tabular-nums; }
    th { background: #f1f5f9; font-size: 10px; letter-spacing: .05em; text-transform: uppercase; padding: 7px 8px; text-align: left; }
    th.num { text-align: right; }
</style>
</head>
<body>
    <h1>Wawasan Pelanggan</h1>
    <p class="period">Periode: ${periodLabel.value} (${props.period_days} hari)</p>
    <ul class="kpi">
        <li>Rata-rata Keranjang<b>${formatRupiah(s.avg_basket)}</b></li>
        <li>Total Transaksi<b>${formatNumber(s.total_transactions)}</b></li>
        <li>Pelanggan Terdaftar Aktif<b>${s.active_customers}</b></li>
        <li>Repeat Order Rate<b>${s.repeat_rate}%</b></li>
    </ul>
    ${loyalTable}${bundleTable}
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
    <Head title="Wawasan Pelanggan - Admin" />

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
                    Wawasan Pelanggan
                </h1>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Strategi pemasaran &amp; loyalitas: siapa pelanggan terbaik,
                    apa yang dibeli bersamaan, dan seberapa sering mereka
                    kembali.
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


        <!-- Empty state global -->
        <div
            v-if="summary.total_transactions === 0"
            class="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 py-20 text-center dark:border-zinc-700"
        >
            <UsersRound class="h-10 w-10 text-slate-400" />
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">
                Belum ada transaksi pada periode ini untuk dianalisis.
            </p>
        </div>

        <template v-else>
            <!-- Ringkasan visual (KPI) -->
            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div
                    class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <p
                                class="text-sm font-medium text-slate-500 dark:text-slate-400"
                            >
                                Rata-rata Keranjang
                            </p>
                            <p class="mt-2 text-2xl font-bold">
                                {{ formatRupiah(summary.avg_basket) }}
                            </p>
                        </div>
                        <div
                            class="flex h-11 w-11 items-center justify-center rounded-md bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                        >
                            <ShoppingBasket class="h-5 w-5" />
                        </div>
                    </div>
                    <p
                        class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"
                    >
                        per transaksi &middot; {{ summary.avg_items }} jenis
                        produk rata-rata
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
                                Pelanggan Terdaftar Aktif
                            </p>
                            <p class="mt-2 text-2xl font-bold">
                                {{ summary.active_customers }}
                            </p>
                        </div>
                        <div
                            class="flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
                        >
                            <UsersRound class="h-5 w-5" />
                        </div>
                    </div>
                    <p
                        class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"
                    >
                        {{ summary.new_customers }} baru &middot;
                        {{ summary.returning_customers }} kembali
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
                                Repeat Order Rate
                            </p>
                            <p
                                class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400"
                            >
                                {{ summary.repeat_rate }}%
                            </p>
                        </div>
                        <div
                            class="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                        >
                            <Repeat class="h-5 w-5" />
                        </div>
                    </div>
                    <p
                        class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"
                    >
                        pelanggan lama yang datang kembali
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
                                Total Transaksi
                            </p>
                            <p class="mt-2 text-2xl font-bold">
                                {{ formatNumber(summary.total_transactions) }}
                            </p>
                        </div>
                        <div
                            class="flex h-11 w-11 items-center justify-center rounded-md bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                        >
                            <Trophy class="h-5 w-5" />
                        </div>
                    </div>
                    <p
                        class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"
                    >
                        {{ summary.registered_share }}% dari pelanggan terdaftar
                    </p>
                </div>
            </div>

            <!-- Komposisi: Terdaftar vs Umum -->
            <section
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div
                    class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-zinc-800"
                >
                    <h2 class="text-lg font-semibold">
                        Pelanggan Terdaftar vs Umum
                    </h2>
                    <div
                        class="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400"
                    >
                        <span class="inline-flex items-center gap-1.5">
                            <span
                                class="h-2.5 w-2.5 rounded-sm bg-violet-500"
                            ></span
                            >Terdaftar
                        </span>
                        <span class="inline-flex items-center gap-1.5">
                            <span
                                class="h-2.5 w-2.5 rounded-sm bg-slate-300 dark:bg-zinc-600"
                            ></span
                            >Umum (walk-in)
                        </span>
                    </div>
                </div>

                <div class="mt-5 space-y-5">
                    <div>
                        <div
                            class="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400"
                        >
                            <span>Jumlah Transaksi</span>
                            <span
                                >{{ compTrx.reg }} terdaftar &middot;
                                {{ compTrx.guest }} umum</span
                            >
                        </div>
                        <div
                            class="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800"
                        >
                            <div
                                class="h-full bg-violet-500 transition-all"
                                :style="{ width: `${compTrx.regPct}%` }"
                                :title="`Terdaftar: ${compTrx.reg} transaksi`"
                            ></div>
                            <div
                                class="h-full bg-slate-300 transition-all dark:bg-zinc-600"
                                :style="{ width: `${compTrx.guestPct}%` }"
                                :title="`Umum: ${compTrx.guest} transaksi`"
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div
                            class="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400"
                        >
                            <span>Kontribusi Omzet</span>
                            <span>{{
                                formatRupiah(compRevenue.total)
                            }}</span>
                        </div>
                        <div
                            class="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800"
                        >
                            <div
                                class="h-full bg-violet-500 transition-all"
                                :style="{ width: `${compRevenue.regPct}%` }"
                                :title="`Terdaftar: ${formatRupiah(compRevenue.reg)}`"
                            ></div>
                            <div
                                class="h-full bg-slate-300 transition-all dark:bg-zinc-600"
                                :style="{ width: `${compRevenue.guestPct}%` }"
                                :title="`Umum: ${formatRupiah(compRevenue.guest)}`"
                            ></div>
                        </div>
                        <p
                            class="mt-2 text-xs text-slate-500 dark:text-slate-400"
                        >
                            {{ Math.round(compRevenue.regPct) }}% omzet berasal
                            dari pelanggan terdaftar — semakin tinggi, semakin
                            mudah Anda menjaga loyalitas lewat data.
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
                    class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-sm font-semibold transition"
                    :class="
                        activeTab === tab.key
                            ? 'bg-violet-500 text-white shadow-sm'
                            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'
                    "
                    @click="activeTab = tab.key"
                >
                    <component :is="tab.icon" class="h-4 w-4 shrink-0" />
                    <span class="truncate">{{ tab.label }}</span>
                </button>
            </div>

            <!-- ============ TAB: PELANGGAN TERLOYAL ============ -->
            <section
                v-if="activeTab === 'loyal'"
                class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div
                    class="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                >
                    <div class="flex items-start gap-3">
                        <Crown class="mt-0.5 h-5 w-5 shrink-0" />
                        <p>
                            Pelanggan terdaftar dengan kontribusi terbesar.
                            Jaga hubungan dengan mereka — beri perhatian khusus
                            atau promo loyalitas.
                        </p>
                    </div>
                    <div
                        class="flex shrink-0 gap-1 rounded-lg bg-white/70 p-0.5 dark:bg-zinc-900/50"
                    >
                        <button
                            type="button"
                            class="rounded-md px-2.5 py-1 text-xs font-semibold transition"
                            :class="
                                topSort === 'revenue'
                                    ? 'bg-amber-500 text-white'
                                    : 'text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-zinc-800'
                            "
                            @click="topSort = 'revenue'"
                        >
                            Belanja
                        </button>
                        <button
                            type="button"
                            class="rounded-md px-2.5 py-1 text-xs font-semibold transition"
                            :class="
                                topSort === 'visits'
                                    ? 'bg-amber-500 text-white'
                                    : 'text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-zinc-800'
                            "
                            @click="topSort = 'visits'"
                        >
                            Kunjungan
                        </button>
                    </div>
                </div>

                <div
                    v-if="sortedCustomers.length === 0"
                    class="flex flex-col items-center justify-center gap-2 py-12 text-center"
                >
                    <UsersRound class="h-9 w-9 text-slate-300" />
                    <p
                        class="text-sm font-medium text-slate-500 dark:text-slate-400"
                    >
                        Belum ada pelanggan terdaftar yang bertransaksi pada
                        periode ini.
                    </p>
                    <p class="max-w-md text-xs text-slate-400">
                        Catat pelanggan (terutama reseller) saat transaksi di
                        kasir agar loyalitas mereka bisa dianalisis di sini.
                    </p>
                </div>

                <div v-else class="mt-4 overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr
                                class="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase dark:border-zinc-800 dark:text-slate-400"
                            >
                                <th class="pr-2 pb-2 font-semibold">#</th>
                                <th class="px-2 pb-2 font-semibold">
                                    Pelanggan
                                </th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Kunjungan
                                </th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Total Belanja
                                </th>
                                <th class="px-2 pb-2 text-right font-semibold">
                                    Rata-rata
                                </th>
                                <th class="pb-2 pl-2 text-right font-semibold">
                                    Terakhir
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            class="divide-y divide-slate-100 dark:divide-zinc-800"
                        >
                            <tr
                                v-for="(c, i) in sortedCustomers"
                                :key="c.id_pelanggan"
                            >
                                <td
                                    class="py-3 pr-2 text-sm font-bold text-slate-400 tabular-nums"
                                >
                                    {{ i + 1 }}
                                </td>
                                <td class="px-2 py-3">
                                    <div class="flex items-center gap-2">
                                        <p class="font-semibold">
                                            {{ c.nama }}
                                        </p>
                                        <span
                                            v-if="c.tipe === 'reseller'"
                                            class="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                                            >Reseller</span
                                        >
                                        <span
                                            class="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                                            :class="
                                                c.is_returning
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                                                    : 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300'
                                            "
                                            >{{
                                                c.is_returning
                                                    ? 'Kembali'
                                                    : 'Baru'
                                            }}</span
                                        >
                                    </div>
                                    <p
                                        v-if="c.telp"
                                        class="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-400"
                                    >
                                        <Phone class="h-3 w-3" />{{ c.telp }}
                                    </p>
                                </td>
                                <td
                                    class="px-2 text-right font-medium tabular-nums"
                                >
                                    {{ c.transactions }}x
                                </td>
                                <td
                                    class="px-2 text-right font-semibold tabular-nums"
                                >
                                    {{ formatRupiah(c.revenue) }}
                                </td>
                                <td
                                    class="px-2 text-right text-slate-600 tabular-nums dark:text-slate-300"
                                >
                                    {{ formatRupiah(c.avg) }}
                                </td>
                                <td
                                    class="pl-2 text-right text-slate-600 dark:text-slate-300"
                                >
                                    {{ formatDate(c.last_visit) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- ============ TAB: KERANJANG & BUNDLING ============ -->
            <section
                v-else-if="activeTab === 'basket'"
                class="space-y-5"
            >
                <div class="grid gap-4 sm:grid-cols-3">
                    <div
                        class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <p
                            class="text-xs font-medium text-slate-500 dark:text-slate-400"
                        >
                            Rata-rata Belanja / Transaksi
                        </p>
                        <p class="mt-1 text-xl font-bold">
                            {{ formatRupiah(summary.avg_basket) }}
                        </p>
                    </div>
                    <div
                        class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <p
                            class="text-xs font-medium text-slate-500 dark:text-slate-400"
                        >
                            Rata-rata Jenis Produk
                        </p>
                        <p class="mt-1 text-xl font-bold">
                            {{ summary.avg_items }}
                            <span class="text-sm font-semibold text-slate-400"
                                >/ keranjang</span
                            >
                        </p>
                    </div>
                    <div
                        class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <p
                            class="text-xs font-medium text-slate-500 dark:text-slate-400"
                        >
                            Transaksi Multi-item
                        </p>
                        <p class="mt-1 text-xl font-bold">
                            {{ summary.multi_item_rate }}%
                        </p>
                    </div>
                </div>

                <div
                    class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div
                        class="flex items-start gap-3 rounded-lg bg-violet-50 p-4 text-sm text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                    >
                        <Link2 class="mt-0.5 h-5 w-5 shrink-0" />
                        <p>
                            Produk yang paling sering muncul bersamaan dalam
                            satu transaksi. Manfaatkan untuk paket bundling,
                            penataan rak berdekatan, atau rekomendasi "sering
                            dibeli bersama".
                        </p>
                    </div>

                    <div
                        v-if="bundles.length === 0"
                        class="flex flex-col items-center justify-center gap-2 py-12 text-center"
                    >
                        <ShoppingBasket class="h-9 w-9 text-slate-300" />
                        <p
                            class="text-sm font-medium text-slate-500 dark:text-slate-400"
                        >
                            Belum ada pola produk yang dibeli bersamaan.
                        </p>
                        <p class="max-w-md text-xs text-slate-400">
                            Pola muncul saat ada cukup transaksi berisi lebih
                            dari satu jenis produk.
                        </p>
                    </div>

                    <ul v-else class="mt-4 space-y-3">
                        <li
                            v-for="(b, i) in bundles"
                            :key="i"
                            class="flex items-center gap-3"
                        >
                            <div class="min-w-0 flex-1">
                                <div
                                    class="flex items-center gap-2 text-sm font-semibold"
                                >
                                    <span class="truncate">{{ b.a }}</span>
                                    <span class="text-violet-400">+</span>
                                    <span class="truncate">{{ b.b }}</span>
                                </div>
                                <div
                                    class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800"
                                >
                                    <div
                                        class="h-full rounded-full bg-violet-500"
                                        :style="{
                                            width: `${Math.min(100, b.pct)}%`,
                                        }"
                                    ></div>
                                </div>
                            </div>
                            <div class="shrink-0 text-right">
                                <p class="text-sm font-bold tabular-nums">
                                    {{ b.count }}x
                                </p>
                                <p
                                    class="text-xs text-slate-400 tabular-nums"
                                >
                                    {{ b.pct }}%
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            <!-- ============ TAB: RETENSI ============ -->
            <section
                v-else
                class="space-y-5"
            >
                <div
                    class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div
                        class="flex items-start gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                    >
                        <Repeat class="mt-0.5 h-5 w-5 shrink-0" />
                        <p>
                            Dari
                            <span class="font-bold">{{
                                retention.active
                            }}</span>
                            pelanggan terdaftar yang aktif,
                            <span class="font-bold"
                                >{{ retention.returning }} kembali</span
                            >
                            (sudah pernah belanja sebelumnya) dan
                            <span class="font-bold"
                                >{{ retention.new }} baru</span
                            >. Repeat order rate
                            <span class="font-bold"
                                >{{ retention.repeat_rate }}%</span
                            >.
                        </p>
                    </div>

                    <div class="mt-5">
                        <div
                            class="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400"
                        >
                            <span class="inline-flex items-center gap-1.5">
                                <span
                                    class="h-2.5 w-2.5 rounded-sm bg-emerald-500"
                                ></span
                                >Kembali ({{ retention.returning }})
                            </span>
                            <span class="inline-flex items-center gap-1.5">
                                <span
                                    class="h-2.5 w-2.5 rounded-sm bg-sky-400"
                                ></span
                                >Baru ({{ retention.new }})
                            </span>
                        </div>
                        <div
                            class="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800"
                        >
                            <div
                                class="h-full bg-emerald-500 transition-all"
                                :style="{
                                    width: `${retentionShare.returningPct}%`,
                                }"
                                :title="`Kembali: ${retention.returning}`"
                            ></div>
                            <div
                                class="h-full bg-sky-400 transition-all"
                                :style="{ width: `${retentionShare.newPct}%` }"
                                :title="`Baru: ${retention.new}`"
                            ></div>
                        </div>
                    </div>
                </div>

                <div class="grid gap-4 sm:grid-cols-3">
                    <div
                        class="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                    >
                        <div class="flex items-center gap-2">
                            <Repeat
                                class="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                            />
                            <p
                                class="text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                            >
                                Pelanggan Kembali
                            </p>
                        </div>
                        <p
                            class="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300"
                        >
                            {{ retention.returning }}
                        </p>
                        <p
                            class="mt-1 text-xs text-emerald-600/80 dark:text-emerald-400/80"
                        >
                            sudah pernah belanja sebelum periode ini
                        </p>
                    </div>
                    <div
                        class="rounded-lg border border-sky-200 bg-sky-50/60 p-4 dark:border-sky-500/30 dark:bg-sky-500/10"
                    >
                        <div class="flex items-center gap-2">
                            <UserPlus
                                class="h-4 w-4 text-sky-600 dark:text-sky-400"
                            />
                            <p
                                class="text-xs font-semibold text-sky-700 dark:text-sky-300"
                            >
                                Pelanggan Baru
                            </p>
                        </div>
                        <p
                            class="mt-2 text-2xl font-bold text-sky-700 dark:text-sky-300"
                        >
                            {{ retention.new }}
                        </p>
                        <p
                            class="mt-1 text-xs text-sky-600/80 dark:text-sky-400/80"
                        >
                            transaksi pertama jatuh di periode ini
                        </p>
                    </div>
                    <div
                        class="rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <div class="flex items-center gap-2">
                            <Repeat
                                class="h-4 w-4 text-slate-500 dark:text-slate-400"
                            />
                            <p
                                class="text-xs font-semibold text-slate-600 dark:text-slate-300"
                            >
                                Datang Berulang
                            </p>
                        </div>
                        <p class="mt-2 text-2xl font-bold">
                            {{ retention.repeaters }}
                        </p>
                        <p
                            class="mt-1 text-xs text-slate-500 dark:text-slate-400"
                        >
                            belanja &ge; 2x dalam periode ({{
                                retention.one_timers
                            }}
                            sekali saja)
                        </p>
                    </div>
                </div>
            </section>

            <!-- Catatan metodologi -->
            <div
                class="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-slate-300"
            >
                <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <p>
                    Dihitung dari transaksi {{ period_days }} hari terakhir.
                    <b>Loyalitas</b> &amp; <b>retensi</b> hanya menghitung
                    pelanggan terdaftar (punya nama di sistem); transaksi tanpa
                    pelanggan dianggap <b>Umum</b> (walk-in).
                    <b>Pelanggan kembali</b> = sudah pernah bertransaksi sebelum
                    periode ini; <b>baru</b> = transaksi pertamanya jatuh di
                    periode ini. <b>Rata-rata keranjang</b> &amp;
                    <b>bundling</b> memakai semua transaksi (produk saja, jasa
                    transfer/tarik tunai dikecualikan). Omzet = total bersih
                    setelah diskon.
                </p>
            </div>
        </template>
    </div>
</template>
