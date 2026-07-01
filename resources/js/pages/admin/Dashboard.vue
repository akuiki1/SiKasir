<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    Archive,
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    CheckCircle2,
    CircleDollarSign,
    Clock,
    FileText,
    LineChart,
    Package,
    Percent,
    PackageX,
    ShoppingCart,
    Users,
    Wallet,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { formatRupiah, formatCompact, formatNumber } from '@/lib/format';

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Admin Dashboard', href: '/admin/dashboard' }],
    },
});

interface TrendPoint {
    day: string;
    date: string;
    revenue: number;
    transactions: number;
}

interface Alert {
    key: string;
    severity: 'danger' | 'warning' | 'caution' | 'info';
    count: number;
    label: string;
    cta_label: string;
    cta_href: string;
}

interface Activity {
    kode: string;
    total: number;
    kasir: string;
    tanggal: string;
    tanggal_iso: string;
    waktu: string;
}

const props = defineProps<{
    greeting: string;
    admin_name: string;
    today_label: string;
    active_cashier: string | null;
    today_stats: {
        revenue: number;
        transactions: number;
        gross_profit: number;
        items_sold: number;
        avg_items: number;
        margin: number | null;
        revenue_delta: number | null;
        transactions_delta: number | null;
        gross_profit_delta: number | null;
    };
    trend: TrendPoint[];
    alerts: Alert[];
    recent_activity: Activity[];
}>();

// --- Kartu KPI hari ini ---
const kpiCards = computed(() => [
    {
        label: 'Omzet Hari Ini',
        value: formatRupiah(props.today_stats.revenue),
        delta: props.today_stats.revenue_delta,
        icon: LineChart,
        tint: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300',
    },
    {
        label: 'Transaksi Hari Ini',
        value: formatNumber(props.today_stats.transactions, 0),
        delta: props.today_stats.transactions_delta,
        icon: ShoppingCart,
        tint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
    },
    {
        label: 'Laba Kotor Hari Ini',
        value: formatRupiah(props.today_stats.gross_profit),
        delta: props.today_stats.gross_profit_delta,
        margin: props.today_stats.margin,
        icon: Wallet,
        tint: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300',
    },
    {
        label: 'Produk Terjual',
        value: formatNumber(props.today_stats.items_sold, 1),
        subtitle: `${formatNumber(props.today_stats.avg_items, 1)} / Nota (Rata-rata)`,
        icon: Package,
        tint: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300',
    },
]);

// --- Konfigurasi tampilan per jenis alert & shortcut ---
const SEVERITY: Record<Alert['severity'], { icon: typeof PackageX; chip: string; button: string }> = {
    danger: {
        icon: PackageX,
        chip: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
        button: 'border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10',
    },
    warning: {
        icon: Archive,
        chip: 'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300',
        button: 'border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-500/30 dark:text-orange-300 dark:hover:bg-orange-500/10',
    },
    caution: {
        icon: CircleDollarSign,
        chip: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
        button: 'border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-300 dark:hover:bg-amber-500/10',
    },
    info: {
        icon: Users,
        chip: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300',
        button: 'border-sky-200 text-sky-600 hover:bg-sky-50 dark:border-sky-500/30 dark:text-sky-300 dark:hover:bg-sky-500/10',
    },
};

const shortcuts = [
    {
        title: 'Keuangan',
        desc: 'Laba rugi & arus kas',
        href: '/admin/laporan/keuangan',
        icon: CircleDollarSign,
        iconClass: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30',
        glow: 'from-emerald-500/10',
        hover: 'group-hover:border-emerald-300 dark:group-hover:border-emerald-500/40',
        arrow: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    },
    {
        title: 'Penjualan',
        desc: 'Tren & performa kasir',
        href: '/admin/laporan/penjualan',
        icon: ShoppingCart,
        iconClass: 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sky-500/30',
        glow: 'from-sky-500/10',
        hover: 'group-hover:border-sky-300 dark:group-hover:border-sky-500/40',
        arrow: 'group-hover:text-sky-600 dark:group-hover:text-sky-400',
    },
    {
        title: 'Inventaris',
        desc: 'Perputaran & nilai stok',
        href: '/admin/laporan/inventaris',
        icon: Package,
        iconClass: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-violet-500/30',
        glow: 'from-violet-500/10',
        hover: 'group-hover:border-violet-300 dark:group-hover:border-violet-500/40',
        arrow: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
    },
    {
        title: 'Pelanggan',
        desc: 'Loyalitas & retensi',
        href: '/admin/laporan/pelanggan',
        icon: Users,
        iconClass: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-rose-500/30',
        glow: 'from-rose-500/10',
        hover: 'group-hover:border-rose-300 dark:group-hover:border-rose-500/40',
        arrow: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    },
];

// --- Grafik tren 7 hari ---
const metric = ref<'revenue' | 'transactions'>('revenue');

const W = 720;
const H = 260;
const PAD = { left: 46, right: 18, top: 28, bottom: 42 };
const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;

function niceCeil(value: number): number {
    if (value <= 0) {
        return 1;
    }

    const mag = Math.pow(10, Math.floor(Math.log10(value)));
    const norm = value / mag;
    const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;

    return nice * mag;
}

const isRevenue = computed(() => metric.value === 'revenue');

function metricValue(point: TrendPoint): number {
    return isRevenue.value ? point.revenue : point.transactions;
}

function axisLabel(value: number): string {
    return isRevenue.value ? formatCompact(value) : formatNumber(Math.round(value), 0);
}

const chart = computed(() => {
    const data = props.trend;
    const max = niceCeil(Math.max(...data.map(metricValue), 0));
    const stepX = data.length > 1 ? plotW / (data.length - 1) : 0;
    const baseY = PAD.top + plotH;

    const points = data.map((point, i) => {
        const value = metricValue(point);
        const x = PAD.left + stepX * i;
        const y = PAD.top + plotH * (1 - value / max);
        const valueText = isRevenue.value ? formatCompact(value) : formatNumber(value, 0);
        const isLast = i === data.length - 1;

        return { key: point.date + i, x, y, day: point.day, date: point.date, valueText, isLast, badgeW: Math.max(34, valueText.length * 7 + 12) };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaPath = points.length
        ? `M${points[0].x.toFixed(1)},${baseY} ${points.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} L${points[points.length - 1].x.toFixed(1)},${baseY} Z`
        : '';

    const ticks = [0, 1, 2, 3, 4].map((i) => ({
        y: PAD.top + plotH * (1 - i / 4),
        label: axisLabel((max * i) / 4),
    }));

    return { points, linePath, areaPath, ticks, baseY };
});

function deltaTone(delta: number | null): string {
    if (delta === null || delta === 0) {
        return 'text-slate-400 dark:text-slate-500';
    }

    return delta > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
}
</script>

<template>
    <Head title="Admin Dashboard" />

    <div class="flex h-full flex-1 flex-col gap-6 bg-slate-50 p-6 text-slate-950 dark:bg-zinc-950 dark:text-slate-100">
        <!-- Snapshot hari ini -->
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div
                v-for="card in kpiCards"
                :key="card.label"
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div class="flex items-start justify-between gap-4">
                    <div class="min-w-0">
                        <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ card.label }}</p>
                        <p class="mt-2 text-2xl font-bold tracking-tight">{{ card.value }}</p>
                    </div>
                    <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg" :class="card.tint">
                        <component :is="card.icon" class="h-5 w-5" />
                    </div>
                </div>

                <div class="mt-4 flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5 text-xs font-medium" :class="card.subtitle ? 'text-slate-500 dark:text-slate-400' : deltaTone(card.delta ?? null)">
                        <template v-if="card.subtitle">{{ card.subtitle }}</template>
                        <template v-else-if="card.delta === null">
                            <span class="text-slate-400 dark:text-slate-500">Baru hari ini</span>
                        </template>
                        <template v-else>
                            <ArrowUpRight v-if="(card.delta ?? 0) > 0" class="h-3.5 w-3.5" />
                            <ArrowDownRight v-else-if="(card.delta ?? 0) < 0" class="h-3.5 w-3.5" />
                            <span>{{ Math.abs(card.delta ?? 0) }}%</span>
                            <span class="text-slate-400 dark:text-slate-500">vs kemarin</span>
                        </template>
                    </div>

                    <span
                        v-if="card.margin !== undefined"
                        class="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                        title="Margin laba kotor hari ini"
                    >
                        <Percent class="h-3 w-3" />
                        {{ card.margin === null ? '—' : `${card.margin}% margin` }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Perlu perhatian + Tren 7 hari -->
        <div class="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <!-- Perlu perhatian -->
            <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div class="flex items-center gap-2 border-b border-slate-200 pb-4 dark:border-zinc-800">
                    <span class="text-lg">⚠️</span>
                    <h2 class="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">Perlu Perhatian</h2>
                </div>

                <div v-if="props.alerts.length" class="mt-4 space-y-3">
                    <div
                        v-for="alert in props.alerts"
                        :key="alert.key"
                        class="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-800/40"
                    >
                        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" :class="SEVERITY[alert.severity].chip">
                            <component :is="SEVERITY[alert.severity].icon" class="h-4 w-4" />
                        </div>
                        <p class="min-w-0 flex-1 text-sm text-slate-700 dark:text-slate-200">
                            <span class="font-bold">{{ alert.count }}</span> {{ alert.label }}
                        </p>
                        <Link
                            :href="alert.cta_href"
                            class="inline-flex shrink-0 items-center rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
                            :class="SEVERITY[alert.severity].button"
                        >
                            {{ alert.cta_label }}
                        </Link>
                    </div>
                </div>

                <div v-else class="mt-4 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 py-10 text-center dark:border-zinc-700">
                    <CheckCircle2 class="h-8 w-8 text-emerald-500" />
                    <p class="text-sm font-medium text-slate-600 dark:text-slate-300">Semua aman</p>
                    <p class="text-xs text-slate-400 dark:text-slate-500">Tidak ada yang perlu ditindak saat ini.</p>
                </div>
            </section>

            <!-- Tren 7 hari -->
            <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div class="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-zinc-800">
                    <h2 class="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">Tren 7 Hari Terakhir</h2>
                    <select
                        v-model="metric"
                        class="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 outline-none transition focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-300"
                    >
                        <option value="revenue">Omzet</option>
                        <option value="transactions">Transaksi</option>
                    </select>
                </div>

                <div class="mt-3">
                    <svg :viewBox="`0 0 ${W} ${H}`" class="h-auto w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Grafik tren 7 hari">
                        <defs>
                            <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.22" />
                                <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0" />
                            </linearGradient>
                        </defs>

                        <!-- Gridlines + label sumbu Y -->
                        <g v-for="(tick, i) in chart.ticks" :key="`tick-${i}`">
                            <line :x1="PAD.left" :y1="tick.y" :x2="W - PAD.right" :y2="tick.y" class="stroke-slate-100 dark:stroke-zinc-800" stroke-width="1" />
                            <text :x="PAD.left - 8" :y="tick.y + 3" text-anchor="end" class="fill-slate-400 text-[10px] dark:fill-slate-500">{{ tick.label }}</text>
                        </g>

                        <!-- Area + garis -->
                        <path :d="chart.areaPath" fill="url(#trendArea)" />
                        <path :d="chart.linePath" fill="none" class="stroke-sky-500" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />

                        <!-- Titik + label nilai + label sumbu X -->
                        <g v-for="point in chart.points" :key="point.key">
                            <circle :cx="point.x" :cy="point.y" :r="point.isLast ? 4.5 : 3.5" class="fill-white stroke-sky-500" stroke-width="2" />

                            <template v-if="point.isLast">
                                <rect :x="point.x - point.badgeW / 2" :y="point.y - 27" :width="point.badgeW" height="18" rx="5" class="fill-sky-500" />
                                <text :x="point.x" :y="point.y - 14" text-anchor="middle" class="fill-white text-[10px] font-bold">{{ point.valueText }}</text>
                            </template>
                            <text v-else :x="point.x" :y="point.y - 11" text-anchor="middle" class="fill-slate-400 text-[10px] font-semibold dark:fill-slate-500">{{ point.valueText }}</text>

                            <text :x="point.x" :y="chart.baseY + 18" text-anchor="middle" class="fill-slate-500 text-[11px] font-semibold dark:fill-slate-300">{{ point.day }}</text>
                            <text :x="point.x" :y="chart.baseY + 31" text-anchor="middle" class="fill-slate-400 text-[9px] dark:fill-slate-500">{{ point.date }}</text>
                        </g>
                    </svg>
                </div>
            </section>
        </div>

        <!-- Pintasan laporan + Aktivitas terbaru -->
        <div class="grid gap-4 xl:grid-cols-2">
            <!-- Pintasan laporan -->
            <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h2 class="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">Pintasan Laporan</h2>
                <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Link
                        v-for="item in shortcuts"
                        :key="item.title"
                        :href="item.href"
                        class="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                        :class="item.hover"
                    >
                        <!-- Glow latar saat hover -->
                        <div class="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" :class="item.glow"></div>

                        <div class="relative z-10 flex items-center gap-3">
                            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg transition-transform duration-200 group-hover:scale-105" :class="item.iconClass">
                                <component :is="item.icon" class="h-6 w-6" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ item.title }}</p>
                                <p class="truncate text-xs text-slate-400 dark:text-slate-500">{{ item.desc }}</p>
                            </div>
                            <ArrowRight class="h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-1 dark:text-slate-600" :class="item.arrow" />
                        </div>
                    </Link>
                </div>
            </section>

            <!-- Aktivitas terbaru -->
            <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div class="flex items-center justify-between gap-4">
                    <h2 class="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">Aktivitas Terbaru</h2>
                    <Link href="/admin/transactions" class="text-xs font-semibold text-sky-600 transition hover:text-sky-700 dark:text-sky-400">Lihat Semua</Link>
                </div>

                <div class="mt-4 divide-y divide-slate-100 dark:divide-zinc-800">
                    <Link
                        v-for="item in props.recent_activity"
                        :key="item.kode"
                        :href="`/admin/transactions?search=${item.kode}&start_date=${item.tanggal_iso}&end_date=${item.tanggal_iso}`"
                        class="group flex items-center gap-3 rounded-lg px-1 py-2.5 transition hover:bg-slate-50 dark:hover:bg-zinc-800/40"
                        :title="`Lihat ${item.kode} di Data Transaksi`"
                    >
                        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-sky-100 group-hover:text-sky-600 dark:bg-zinc-800 dark:text-slate-400 dark:group-hover:bg-sky-500/15 dark:group-hover:text-sky-300">
                            <FileText class="h-4 w-4" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="truncate font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">{{ item.kode }}</p>
                            <p class="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                                <Users class="h-3 w-3 shrink-0" />
                                <span class="truncate">{{ item.kasir }}</span>
                            </p>
                        </div>
                        <div class="shrink-0 text-right">
                            <p class="text-sm font-bold tabular-nums">{{ formatRupiah(item.total) }}</p>
                            <p class="flex items-center justify-end gap-1 text-xs text-slate-400 dark:text-slate-500">
                                <Clock class="h-3 w-3" /> {{ item.tanggal }} · {{ item.waktu }}
                            </p>
                        </div>
                    </Link>

                    <p v-if="!props.recent_activity.length" class="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                        Belum ada transaksi.
                    </p>
                </div>
            </section>
        </div>
    </div>
</template>
