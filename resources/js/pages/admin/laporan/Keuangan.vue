<script setup lang="ts">
import { Head, router, usePage } from '@inertiajs/vue3';
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
import { formatCompact, formatNumber, formatRupiah } from '@/lib/format';
import { formatPeriodLabel } from '@/lib/period';

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
    delta_pct: number | null;
    is_new: boolean;
    flagged: boolean;
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

type HealthStatus = 'sehat' | 'perhatian' | 'kritis';

interface StoryInsight {
    icon: string;
    tone: 'good' | 'warn' | 'bad' | 'neutral';
    text: string;
}

interface TopProduct {
    name: string;
    kategori: string;
    revenue: number;
}

interface TopCategory {
    name: string;
    revenue: number;
}

interface PreviousPeriod {
    start_date: string;
    end_date: string;
    revenue: number;
    net_profit: number;
    margin: number;
    opex: number;
    transaksi_count: number;
}

interface Previous2Period {
    start_date: string;
    end_date: string;
    margin: number;
}

interface FinancialStory {
    status: HealthStatus;
    verdict: string;
    insights: StoryInsight[];
    transaksi_count: number;
    top_products: TopProduct[];
    top_categories: TopCategory[];
    previous_period: PreviousPeriod;
    previous2_period: Previous2Period;
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
    story: FinancialStory;
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

function rp(value: number): string {
    return formatRupiah(value);
}

// ---------------------------------------------------------------
// Laporan cetak (A4) — desain "cerita" 4 babak: Kondisi Bisnis, Perubahan,
// Penyebab, Bukti. Dibangun sebagai satu dokumen HTML mandiri (bukan Vue),
// konsisten dengan pola window.open + document.write yang sudah dipakai di
// struk.ts & laporan lain — hanya CSS/markup-nya yang jauh lebih kaya.
// ---------------------------------------------------------------
type Tone = 'good' | 'warn' | 'bad' | 'neutral';

const PAL: Record<
    Tone,
    {
        text: string;
        deep: string;
        bg: string;
        border: string;
        line: string;
        ring: string;
    }
> = {
    good: {
        text: '#047857',
        deep: '#065f46',
        bg: '#ecfdf5',
        border: '#a7f3d0',
        line: '#10b981',
        ring: '#d1fae5',
    },
    warn: {
        text: '#b45309',
        deep: '#92400e',
        bg: '#fffbeb',
        border: '#fde68a',
        line: '#f59e0b',
        ring: '#fef3c7',
    },
    bad: {
        text: '#be123c',
        deep: '#9f1239',
        bg: '#fff1f2',
        border: '#fecdd3',
        line: '#f43f5e',
        ring: '#ffe4e6',
    },
    neutral: {
        text: '#334155',
        deep: '#0f172a',
        bg: '#f8fafc',
        border: '#e2e8f0',
        line: '#94a3b8',
        ring: '#e2e8f0',
    },
};
const ARROW: Record<'up' | 'down' | 'flat', string> = {
    up: '▲',
    down: '▼',
    flat: '▬',
};
const STATUS_META: Record<
    HealthStatus,
    { word: string; sub: string; tone: Tone }
> = {
    sehat: { word: 'SEHAT', sub: 'Pertahankan momentum', tone: 'good' },
    perhatian: {
        word: 'PERLU PERHATIAN',
        sub: 'Ada yang harus dibenahi',
        tone: 'warn',
    },
    kritis: { word: 'KRITIS', sub: 'Perlu tindakan segera', tone: 'bad' },
};

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function cpt(value: number): string {
    const n = Number(value) || 0;

    return `${n < 0 ? '−' : ''}Rp${formatCompact(Math.abs(n))}`;
}

function pct1(value: number): string {
    return (Math.round(value * 10) / 10).toFixed(1).replace('.', ',');
}

function pct0(value: number): string {
    return String(Math.round(value));
}

function spct0(value: number): string {
    const r = Math.round(value);

    return `${r > 0 ? '+' : r < 0 ? '−' : ''}${Math.abs(r)}%`;
}

function spctPoin(value: number): string {
    const r = Math.round(value * 10) / 10;

    return `${r > 0 ? '+' : r < 0 ? '−' : ''}${pct1(Math.abs(r))} poin`;
}

function dirOf(delta: number): 'up' | 'down' | 'flat' {
    return delta > 0.05 ? 'up' : delta < -0.05 ? 'down' : 'flat';
}

// Periode sebelumnya cuma dapat label pendek ("Mei 2026") kalau kebetulan bulan
// kalender penuh — kalau tidak, formatPeriodLabel mengembalikan rentang tanggal
// mentah yang terlalu panjang untuk kolom label sempit di bar chart.
function shortPeriodLabel(label: string): string {
    return label.length > 10 ? 'Sebelumnya' : label;
}

interface PrintKpi {
    label: string;
    value: string;
    arrow: string;
    deltaText: string;
    deltaColor: string;
    compare: string;
}

function kpiCard(
    label: string,
    value: string,
    deltaPct: number,
    higherIsBetter: boolean,
    compare: string,
    unit: 'pct' | 'poin' = 'pct',
): PrintKpi {
    const dir = dirOf(deltaPct);
    const tone: Tone =
        dir === 'flat'
            ? 'neutral'
            : higherIsBetter
              ? dir === 'up'
                  ? 'good'
                  : 'bad'
              : dir === 'up'
                ? 'warn'
                : 'good';

    return {
        label,
        value,
        arrow: ARROW[dir],
        deltaText: unit === 'poin' ? spctPoin(deltaPct) : spct0(deltaPct),
        deltaColor: PAL[tone].text,
        compare,
    };
}

function deltaCard(
    label: string,
    valueText: string,
    curVal: number,
    prevVal: number,
    higherIsBetter: boolean,
    compare: string,
): PrintKpi {
    const flip = curVal < 0 !== prevVal < 0;

    if (flip) {
        return {
            label,
            value: valueText,
            arrow: curVal < 0 ? '▼' : '▲',
            deltaText: curVal < 0 ? 'jadi rugi' : 'jadi untung',
            deltaColor: curVal < 0 ? PAL.bad.text : PAL.good.text,
            compare,
        };
    }

    if (prevVal === 0) {
        return {
            label,
            value: valueText,
            arrow: ARROW.flat,
            deltaText: 'baru periode ini',
            deltaColor: PAL.neutral.text,
            compare,
        };
    }

    return kpiCard(
        label,
        valueText,
        ((curVal - prevVal) / Math.abs(prevVal)) * 100,
        higherIsBetter,
        compare,
    );
}

function buildStoryKpis(prevLabel: string): PrintKpi[] {
    const p = props.pnl;
    const s = props.story;
    const prev = s.previous_period;
    const netCash = props.cashflow.net_cash;
    const compare = `vs ${prevLabel}`;

    return [
        deltaCard(
            'Omzet',
            cpt(p.total_revenue),
            p.total_revenue,
            prev.revenue,
            true,
            compare,
        ),
        deltaCard(
            'Laba Bersih',
            cpt(p.net_profit),
            p.net_profit,
            prev.net_profit,
            true,
            compare,
        ),
        kpiCard(
            'Margin Laba',
            `${pct1(p.margin)}%`,
            p.margin - prev.margin,
            true,
            compare,
            'poin',
        ),
        deltaCard(
            'Pengeluaran',
            cpt(p.operational_expenses),
            p.operational_expenses,
            prev.opex,
            false,
            compare,
        ),
        {
            label: 'Arus Kas',
            value: cpt(netCash),
            arrow: netCash >= 0 ? '▲' : '▼',
            deltaText: netCash >= 0 ? 'Surplus' : 'Defisit',
            deltaColor: netCash >= 0 ? PAL.good.text : PAL.bad.text,
            compare: netCash >= 0 ? 'kas bertambah' : 'kas berkurang',
        },
        deltaCard(
            'Jumlah Transaksi',
            formatNumber(s.transaksi_count, 0),
            s.transaksi_count,
            prev.transaksi_count,
            true,
            compare,
        ),
    ];
}

const SCALE_LABELS: Record<HealthStatus, string> = {
    sehat: 'Sehat',
    perhatian: 'Perhatian',
    kritis: 'Kritis',
};

function buildScaleSteps(status: HealthStatus) {
    return (['sehat', 'perhatian', 'kritis'] as const).map((key) => {
        const on = key === status;
        const tone = STATUS_META[key].tone;

        return {
            label: SCALE_LABELS[key],
            bar: on ? PAL[tone].line : '#e2e8f0',
            labelColor: on ? PAL[tone].text : '#cbd5e1',
        };
    });
}

function buildTrend() {
    const points = props.revenue_chart.points;

    if (points.length === 0) {
        return null;
    }

    const maxV = Math.max(...points.map((pt) => pt.value), 1);
    const avg = points.reduce((sum, pt) => sum + pt.value, 0) / points.length;
    const peakIdx = points.reduce(
        (best, pt, i) => (pt.value > points[best].value ? i : best),
        0,
    );

    return {
        bars: points.map((pt, i) => ({
            hStr: `${((pt.value / maxV) * 100).toFixed(1)}%`,
            bg: i === peakIdx ? '#0f172a' : '#cbd5e1',
        })),
        avgTopStr: `${((1 - avg / maxV) * 100).toFixed(1)}%`,
        avgText: cpt(avg),
        peakLabel: points[peakIdx]?.label ?? '',
        first: points[0]?.label ?? '',
        mid: points[Math.floor(points.length / 2)]?.label ?? '',
        last: points[points.length - 1]?.label ?? '',
    };
}

function buildMonthCompare(prevLabel: string) {
    const wanted = ['Omzet', 'Laba Bersih'];

    return props.comparison
        .filter((c) => wanted.includes(c.label))
        .map((c) => {
            const mx = Math.max(Math.abs(c.previous), Math.abs(c.current), 1);
            const flip = c.current < 0 !== c.previous < 0;
            const d =
                c.previous !== 0
                    ? ((c.current - c.previous) / Math.abs(c.previous)) * 100
                    : 0;
            const dir = dirOf(d);

            return {
                label: c.label,
                prevText: cpt(c.previous),
                curText: cpt(c.current),
                prevW: `${((Math.abs(c.previous) / mx) * 100).toFixed(1)}%`,
                curW: `${((Math.abs(c.current) / mx) * 100).toFixed(1)}%`,
                curColor: c.current < 0 ? PAL.bad.text : '#0f172a',
                deltaText: flip ? 'jadi rugi' : spct0(d),
                arrow: ARROW[dir],
                deltaColor: flip
                    ? PAL.bad.text
                    : dir === 'up'
                      ? PAL.good.text
                      : dir === 'down'
                        ? PAL.bad.text
                        : '#64748b',
                prevLabel,
            };
        });
}

function buildMargin3() {
    const p2 = props.story.previous2_period;
    const p1 = props.story.previous_period;
    const labels = [
        formatPeriodLabel(p2.start_date, p2.end_date),
        formatPeriodLabel(p1.start_date, p1.end_date),
        formatPeriodLabel(
            props.date_range.start_date,
            props.date_range.end_date,
        ),
    ];
    const values = [p2.margin, p1.margin, props.pnl.margin];

    return values.map((v, i) => {
        const prev = i > 0 ? values[i - 1] : null;
        const dir = prev == null ? 'flat' : dirOf(v - prev);

        return {
            label: labels[i],
            pctText: `${pct1(v)}%`,
            color:
                v < 0 ? PAL.bad.text : v >= 5 ? PAL.good.text : PAL.warn.text,
            arrow: ARROW[dir],
            showArrow: i > 0,
        };
    });
}

function buildTopProducts() {
    const list = props.story.top_products;
    const totalRevenue = Math.max(props.pnl.total_revenue, 1);
    const maxRev = Math.max(...list.map((p) => p.revenue), 1);

    return list.map((p, i) => ({
        rank: i + 1,
        name: escapeHtml(p.name),
        cat: escapeHtml(p.kategori),
        revText: cpt(p.revenue),
        shareText: `${pct1((p.revenue / totalRevenue) * 100)}%`,
        w: `${((p.revenue / maxRev) * 100).toFixed(1)}%`,
    }));
}

function buildTopCats() {
    const list = props.story.top_categories;
    const totalRevenue = Math.max(props.pnl.total_revenue, 1);
    const maxRev = Math.max(...list.map((c) => c.revenue), 1);

    return list.map((c) => ({
        name: escapeHtml(c.name),
        pctText: `${Math.round((c.revenue / totalRevenue) * 100)}%`,
        w: `${((c.revenue / maxRev) * 100).toFixed(1)}%`,
    }));
}

function buildOpexView() {
    const list = props.pnl.expense_breakdown;
    const maxNom = Math.max(...list.map((o) => o.nominal), 1);

    return list.map((o) => {
        const dir = o.delta_pct == null ? 'flat' : dirOf(o.delta_pct);
        const deltaText = o.is_new
            ? 'Baru'
            : o.delta_pct == null
              ? '—'
              : `${dir === 'up' ? '▲' : dir === 'down' ? '▼' : '▬'} ${pct0(Math.abs(o.delta_pct))}%`;

        return {
            label: escapeHtml(o.label),
            nomText: rp(o.nominal),
            w: `${((o.nominal / maxNom) * 100).toFixed(1)}%`,
            deltaText,
            deltaColor:
                o.is_new || dir === 'up'
                    ? PAL.warn.text
                    : dir === 'down'
                      ? PAL.good.text
                      : '#94a3b8',
            flag: o.flagged,
            barBg: o.flagged ? PAL.warn.line : '#cbd5e1',
        };
    });
}

function printTimestamp(): { datePart: string; timePart: string } {
    const now = new Date();
    const datePart = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(now);
    const timePart = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(now);

    return { datePart, timePart };
}

const page = usePage();
const printedByName = computed(() => page.props.auth.user?.name ?? 'Admin');

function buildFinancialReportHtml(): string {
    const p = props.pnl;
    const c = props.cashflow;
    const s = props.story;
    const meta = STATUS_META[s.status];
    const prevLabel = formatPeriodLabel(
        s.previous_period.start_date,
        s.previous_period.end_date,
    );
    const printPeriodLabel = formatPeriodLabel(
        props.date_range.start_date,
        props.date_range.end_date,
    );
    const { datePart, timePart } = printTimestamp();

    const kpis = buildStoryKpis(prevLabel);
    const scaleSteps = buildScaleSteps(s.status);
    const trend = buildTrend();
    const monthCompare = buildMonthCompare(prevLabel);
    const margin3 = buildMargin3();
    const topProducts = buildTopProducts();
    const topCats = buildTopCats();
    const opexView = buildOpexView();
    const recon = reconciliationRows.value;
    const reconTotal = reconciliationTotals.value;

    const netTone: Tone = p.net_profit >= 0 ? 'good' : 'bad';
    const cashTone: Tone = c.net_cash >= 0 ? 'good' : 'bad';

    const insightsHtml = s.insights
        .map((ins) => {
            const tone = PAL[ins.tone] ?? PAL.neutral;

            return `<div class="insight-row">
                <span class="insight-icon" style="background:${tone.bg};color:${tone.text};">${ins.icon}</span>
                <p class="insight-text">${escapeHtml(ins.text)}</p>
            </div>`;
        })
        .join('');

    const kpisHtml = kpis
        .map(
            (k) => `<div class="kpi-card">
                <div class="kpi-label">${k.label}</div>
                <div class="kpi-value">${k.value}</div>
                <div class="kpi-delta-row">
                    <span class="kpi-delta" style="color:${k.deltaColor};"><span class="kpi-arrow">${k.arrow}</span>${k.deltaText}</span>
                    <span class="kpi-compare">${k.compare}</span>
                </div>
            </div>`,
        )
        .join('');

    const scaleHtml = scaleSteps
        .map(
            (st) => `<div class="scale-step">
                <div class="scale-bar" style="background:${st.bar};"></div>
                <div class="scale-label" style="color:${st.labelColor};">${st.label}</div>
            </div>`,
        )
        .join('');

    const section1 = `
    <section class="page-section">
        <div class="section-head">
            <div>
                <div class="eyebrow">01 · KONDISI BISNIS</div>
                <div class="section-title">Bagaimana kondisi bisnis Anda?</div>
            </div>
            <div class="meta-block">
                <div><span class="meta-label">Periode</span>&nbsp;&nbsp;<span class="meta-value">${escapeHtml(printPeriodLabel)}</span></div>
                <div><span class="meta-label">Dicetak</span>&nbsp;&nbsp;<span class="meta-value">${datePart}</span></div>
                <div><span class="meta-label">Oleh</span>&nbsp;&nbsp;<span class="meta-value">${escapeHtml(printedByName.value)}</span></div>
            </div>
        </div>

        <div class="status-card" style="border-color:${PAL[meta.tone].border};background:${PAL[meta.tone].bg};">
            <div class="status-left" style="border-color:${PAL[meta.tone].border};">
                <div class="status-badge-row">
                    <span class="status-dot" style="background:${PAL[meta.tone].line};box-shadow:0 0 0 3.5px ${PAL[meta.tone].ring};"></span>
                    <span class="status-caption" style="color:${PAL[meta.tone].text};">STATUS</span>
                </div>
                <div class="status-word" style="color:${PAL[meta.tone].text};">${meta.word}</div>
                <div class="status-sub" style="color:${PAL[meta.tone].text};">${meta.sub}</div>
            </div>
            <div class="status-right">
                <div class="status-right-caption">RINGKASAN 5 DETIK</div>
                <p class="verdict-text">${escapeHtml(s.verdict)}</p>
                <div class="scale-row">${scaleHtml}</div>
            </div>
        </div>

        <div class="kpi-grid">${kpisHtml}</div>

        <div class="insight-card">
            <div class="insight-head">YANG PERLU ANDA TAHU</div>
            <div class="insight-body">${insightsHtml}</div>
        </div>

        <div class="footnote-row">
            <span class="footnote-dot">i</span>
            <span>Laporan mencakup <strong>${formatNumber(s.transaksi_count, 0)} transaksi</strong> pada ${escapeHtml(printPeriodLabel)}.</span>
        </div>
    </section>`;

    const section2 = trend
        ? `
    <section class="page-section page-break">
        <div class="section-head">
            <div>
                <div class="eyebrow">02 · PERUBAHAN</div>
                <div class="section-title">Apa yang berubah pada periode ini?</div>
            </div>
            <div class="section-head-note">Dibanding <strong>${escapeHtml(prevLabel)}</strong></div>
        </div>

        <div class="callout">${escapeHtml(s.insights[0]?.text ?? s.verdict)}</div>

        <div class="subhead-row">
            <div class="subhead">Tren omzet</div>
            <div class="subhead-note">Rata-rata <strong>${trend.avgText}/hari</strong> · puncak ${escapeHtml(trend.peakLabel)}</div>
        </div>
        <div class="trend-wrap">
            <div class="trend-avg-line" style="top:${trend.avgTopStr};"><span class="trend-avg-label">rata-rata</span></div>
            <div class="trend-bars">
                ${trend.bars.map((b) => `<div class="trend-bar" style="height:${b.hStr};background:${b.bg};"></div>`).join('')}
            </div>
        </div>
        <div class="trend-axis"><span>${escapeHtml(trend.first)}</span><span>${escapeHtml(trend.mid)}</span><span>${escapeHtml(trend.last)}</span></div>

        <div class="two-col mt-22">
            <div>
                <div class="subhead mb-12">Periode ini vs ${escapeHtml(prevLabel)}</div>
                ${monthCompare
                    .map(
                        (m) => `<div class="mc-row">
                        <div class="mc-top"><span class="mc-label">${m.label}</span><span class="mc-delta" style="color:${m.deltaColor};">${m.arrow} ${m.deltaText}</span></div>
                        <div class="mc-bar-row"><span class="mc-bar-label">${escapeHtml(shortPeriodLabel(prevLabel))}</span><div class="mc-track"><div class="mc-fill mc-fill-prev" style="width:${m.prevW};"></div></div><span class="mc-value">${m.prevText}</span></div>
                        <div class="mc-bar-row"><span class="mc-bar-label mc-bar-label-cur">Ini</span><div class="mc-track"><div class="mc-fill mc-fill-cur" style="width:${m.curW};"></div></div><span class="mc-value mc-value-cur" style="color:${m.curColor};">${m.curText}</span></div>
                    </div>`,
                    )
                    .join('')}
            </div>
            <div>
                <div class="subhead mb-12">Margin 3 periode</div>
                <div class="margin3-card">
                    ${margin3
                        .map(
                            (g) => `<div class="margin3-row">
                            <span class="margin3-label">${escapeHtml(g.label)}</span>
                            <span class="margin3-value" style="color:${g.color};">${g.showArrow ? `<span class="margin3-arrow">${g.arrow}</span>` : ''}${g.pctText}</span>
                        </div>`,
                        )
                        .join('')}
                </div>
                <div class="hint-text">Margin = laba bersih dibagi omzet. Makin tinggi makin sehat.</div>
            </div>
        </div>
    </section>`
        : '';

    const section3 = `
    <section class="page-section page-break">
        <div class="section-head">
            <div>
                <div class="eyebrow">0${trend ? '3' : '2'} · PENYEBAB</div>
                <div class="section-title">Siapa penyebab utamanya?</div>
            </div>
            <div class="section-head-note">Produk, kategori &amp; biaya</div>
        </div>

        <div class="subhead mb-11">Produk penyumbang omzet terbesar</div>
        <div class="table-card">
            <div class="tp-row tp-head"><span>#</span><span>Produk</span><span>Kontribusi</span><span class="ta-right">Porsi</span></div>
            ${
                topProducts.length > 0
                    ? topProducts
                          .map(
                              (p) => `<div class="tp-row">
                            <span class="tp-rank">${p.rank}</span>
                            <div><div class="tp-name">${p.name}</div><div class="tp-cat">${p.cat}</div></div>
                            <div class="tp-bar-row"><div class="tp-track"><div class="tp-fill" style="width:${p.w};"></div></div><span class="tp-rev">${p.revText}</span></div>
                            <span class="ta-right tp-share">${p.shareText}</span>
                        </div>`,
                          )
                          .join('')
                    : '<div class="tp-row tp-empty">Belum ada penjualan produk pada periode ini.</div>'
            }
        </div>

        <div class="two-col mt-20">
            <div>
                <div class="subhead mb-11">Omzet per kategori</div>
                ${
                    topCats.length > 0
                        ? topCats
                              .map(
                                  (c) => `<div class="cat-row">
                                <div class="cat-top"><span class="cat-name">${c.name}</span><span class="cat-pct">${c.pctText}</span></div>
                                <div class="cat-track"><div class="cat-fill" style="width:${c.w};"></div></div>
                            </div>`,
                              )
                              .join('')
                        : '<p class="hint-text">Belum ada data kategori.</p>'
                }
            </div>
            <div>
                <div class="subhead-row mb-11"><span class="subhead">Ke mana biaya pergi</span><span class="section-head-note">Total ${rp(p.operational_expenses)}</span></div>
                <div class="table-card">
                    ${
                        opexView.length > 0
                            ? opexView
                                  .map(
                                      (o) => `<div class="opex-row">
                                <div class="opex-label-cell">${o.flag ? '<span class="opex-flag"></span>' : ''}<span class="opex-label">${o.label}</span></div>
                                <div class="opex-track"><div class="opex-fill" style="width:${o.w};background:${o.barBg};"></div></div>
                                <div class="opex-value"><div class="opex-nom">${o.nomText}</div><div class="opex-delta" style="color:${o.deltaColor};">${o.deltaText}</div></div>
                            </div>`,
                                  )
                                  .join('')
                            : '<div class="opex-row opex-empty">Belum ada biaya operasional pada periode ini.</div>'
                    }
                </div>
                <div class="legend-row"><span class="opex-flag"></span> Titik kuning = biaya yang naik tajam, perlu dicek.</div>
            </div>
        </div>
    </section>`;

    const section4 = `
    <section class="page-section page-break">
        <div class="section-head">
            <div>
                <div class="eyebrow">0${trend ? '4' : '3'} · BUKTI</div>
                <div class="section-title">Apa buktinya?</div>
            </div>
            <div class="section-head-note">Rincian angka</div>
        </div>

        <div class="two-col mt-18">
            <div>
                <div class="subhead mb-11">Laba rugi</div>
                <div class="statement-card">
                    <div class="stmt-row"><span>Penjualan produk</span><span class="stmt-val">${rp(p.product_revenue)}</span></div>
                    <div class="stmt-row stmt-alt"><span>Pendapatan jasa</span><span class="stmt-val">${rp(p.jasa_revenue)}</span></div>
                    <div class="stmt-row"><span>Diskon diberikan</span><span class="stmt-val stmt-muted">−${rp(p.total_diskon)}</span></div>
                    <div class="stmt-row stmt-sub"><span>Total omzet</span><span class="stmt-val">${rp(p.total_revenue)}</span></div>
                    <div class="stmt-row"><span>Harga pokok (HPP)</span><span class="stmt-val stmt-neg">−${rp(p.hpp)}</span></div>
                    <div class="stmt-row stmt-alt"><span>Laba kotor</span><span class="stmt-val">${rp(p.gross_profit)}</span></div>
                    <div class="stmt-row"><span>Total pengeluaran</span><span class="stmt-val stmt-neg">−${rp(p.operational_expenses)}</span></div>
                    <div class="stmt-row stmt-net" style="background:${PAL[netTone].bg};border-color:${PAL[netTone].border};">
                        <span style="color:${PAL[netTone].deep};">Laba bersih</span>
                        <span class="stmt-net-val"><span style="color:${PAL[netTone].deep};">${rp(p.net_profit)}</span><span class="stmt-net-margin" style="color:${PAL[netTone].deep};">margin ${pct1(p.margin)}%</span></span>
                    </div>
                </div>
            </div>
            <div>
                <div class="subhead mb-11">Arus kas</div>
                <div class="statement-card">
                    <div class="stmt-row"><span>Uang masuk (penjualan)</span><span class="stmt-val" style="color:${PAL.good.text};">${rp(c.kas_masuk)}</span></div>
                    <div class="stmt-row stmt-alt"><span>Belanja stok</span><span class="stmt-val" style="color:${PAL.bad.text};">−${rp(c.pembelian_produksi)}</span></div>
                    <div class="stmt-row"><span>Bayar biaya operasional</span><span class="stmt-val" style="color:${PAL.bad.text};">−${rp(c.biaya_operasional)}</span></div>
                    <div class="stmt-row stmt-net" style="background:${PAL[cashTone].bg};border-color:${PAL[cashTone].border};">
                        <span style="color:${PAL[cashTone].deep};">Arus kas bersih</span>
                        <span class="stmt-net-val" style="color:${PAL[cashTone].deep};">${rp(c.net_cash)}</span>
                    </div>
                </div>
                <div class="hint-text">Arus kas bisa beda dari laba karena belanja stok dibayar di muka, sebelum barang terjual habis.</div>
            </div>
        </div>

        <div class="subhead mt-20 mb-11">Rekonsiliasi metode pembayaran</div>
        <div class="table-card">
            <div class="recon-row recon-head"><span>Metode</span><span class="ta-right">Trx</span><span class="ta-right">Bruto</span><span class="ta-right">Biaya</span><span class="ta-right">Bersih</span><span class="ta-right">Porsi</span></div>
            ${recon
                .map(
                    (
                        r,
                        i,
                    ) => `<div class="recon-row" style="background:${i % 2 === 1 ? '#f8fafc' : '#ffffff'};">
                    <span class="recon-label">${escapeHtml(r.label)} <span class="recon-rate">fee ${pct1(r.rate)}%</span></span>
                    <span class="ta-right recon-muted">${formatNumber(r.jumlah, 0)}</span>
                    <span class="ta-right recon-muted">${rp(r.total)}</span>
                    <span class="ta-right recon-faint">${r.fee > 0 ? `−${rp(r.fee)}` : '—'}</span>
                    <span class="ta-right recon-bold">${rp(r.net)}</span>
                    <span class="ta-right recon-share">${Math.round(r.share)}%</span>
                </div>`,
                )
                .join('')}
            <div class="recon-row recon-total">
                <span>Total</span>
                <span class="ta-right">${formatNumber(reconTotal.jumlah, 0)}</span>
                <span class="ta-right">${rp(reconTotal.gross)}</span>
                <span class="ta-right recon-total-fee">${reconTotal.fee > 0 ? `−${rp(reconTotal.fee)}` : '—'}</span>
                <span class="ta-right">${rp(reconTotal.net)}</span>
                <span class="ta-right">100%</span>
            </div>
        </div>
    </section>`;

    const header = `<div class="doc-header">
        <div class="brand">
            <div class="brand-mark">C</div>
            <div class="brand-name">Cemilan Mba Tutut</div>
        </div>
        <div class="doc-title">
            <div class="doc-title-word">LAPORAN KEUANGAN</div>
            <div class="doc-title-period">${escapeHtml(printPeriodLabel)}</div>
        </div>
    </div>`;

    const footer = `<div class="doc-footer">
        <span>Dibuat otomatis oleh <strong>SiKasir</strong> · Sistem Kasir &amp; Laporan</span>
        <span class="doc-footer-secret">RAHASIA — UNTUK INTERNAL</span>
        <span>Dicetak ${datePart}, ${timePart} WITA</span>
    </div>`;

    return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Laporan Keuangan</title>
<style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; color: #0f172a; }
    body { font-family: Arial, 'Segoe UI', sans-serif; font-variant-numeric: tabular-nums; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .doc-table { width: 100%; border-collapse: collapse; }
    .doc-table td { padding: 0; }
    .hdr-space, .ftr-space { height: 24mm; }
    .doc-body { padding: 0 14mm; }
    .doc-header, .doc-footer { padding: 0 14mm; }
    .doc-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 10mm; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand-mark { width: 26px; height: 26px; border-radius: 7px; background: #0f172a; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; }
    .brand-name { font-size: 14px; font-weight: 800; letter-spacing: -0.01em; color: #0f172a; }
    .doc-title { text-align: right; }
    .doc-title-word { font-size: 11px; font-weight: 800; letter-spacing: 0.14em; color: #334155; }
    .doc-title-period { font-size: 9px; font-weight: 600; color: #94a3b8; margin-top: 3px; }
    .doc-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 9px; padding-bottom: 10mm; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; }
    .doc-footer-secret { font-weight: 600; color: #94a3b8; letter-spacing: 0.04em; }
    .page-section { padding-top: 6px; }
    .page-break { break-before: page; }
    .section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; border-bottom: 2px solid #0f172a; padding-bottom: 11px; }
    .eyebrow { font-size: 10.5px; font-weight: 800; letter-spacing: 0.16em; color: #94a3b8; }
    .section-title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-top: 5px; }
    .section-head-note { font-size: 11px; color: #94a3b8; white-space: nowrap; }
    .meta-block { text-align: right; font-size: 11px; line-height: 1.6; color: #475569; white-space: nowrap; }
    .meta-label { color: #94a3b8; }
    .meta-value { font-weight: 700; color: #0f172a; }
    .status-card { margin-top: 18px; display: grid; grid-template-columns: 212px 1fr; border: 1px solid; border-radius: 14px; overflow: hidden; }
    .status-left { padding: 20px 22px; border-right: 1px solid; display: flex; flex-direction: column; justify-content: center; }
    .status-badge-row { display: inline-flex; align-items: center; gap: 8px; }
    .status-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
    .status-caption { font-size: 10px; font-weight: 800; letter-spacing: 0.16em; }
    .status-word { font-size: 27px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.05; margin-top: 10px; }
    .status-sub { font-size: 12px; font-weight: 600; opacity: 0.82; margin-top: 5px; }
    .status-right { padding: 19px 22px; background: #fff; }
    .status-right-caption { font-size: 10px; font-weight: 800; letter-spacing: 0.15em; color: #94a3b8; }
    .verdict-text { font-size: 14px; line-height: 1.6; margin: 9px 0 0; color: #1e293b; }
    .scale-row { display: flex; gap: 7px; margin-top: 16px; }
    .scale-step { flex: 1; text-align: center; }
    .scale-bar { height: 6px; border-radius: 3px; }
    .scale-label { font-size: 9px; font-weight: 800; letter-spacing: 0.05em; margin-top: 6px; text-transform: uppercase; }
    .kpi-grid { margin-top: 15px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .kpi-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 13px 14px; background: #fff; break-inside: avoid; }
    .kpi-label { font-size: 9.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; }
    .kpi-value { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-top: 7px; color: #0f172a; line-height: 1; }
    .kpi-delta-row { display: flex; align-items: center; gap: 6px; margin-top: 9px; flex-wrap: wrap; }
    .kpi-delta { display: inline-flex; align-items: center; gap: 3px; font-size: 11.5px; font-weight: 800; }
    .kpi-arrow { font-size: 9px; }
    .kpi-compare { font-size: 10px; color: #94a3b8; font-weight: 500; }
    .insight-card { margin-top: 15px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; break-inside: avoid; }
    .insight-head { padding: 11px 15px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 10.5px; font-weight: 800; letter-spacing: 0.1em; color: #334155; }
    .insight-body { padding: 4px 15px 6px; }
    .insight-row { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; align-items: flex-start; }
    .insight-row:last-child { border-bottom: none; }
    .insight-icon { flex: none; width: 22px; height: 22px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; }
    .insight-text { margin: 0; font-size: 12px; line-height: 1.55; color: #1e293b; }
    .footnote-row { margin-top: 14px; display: flex; align-items: center; gap: 8px; font-size: 10px; color: #94a3b8; }
    .footnote-dot { flex: none; width: 15px; height: 15px; border-radius: 50%; border: 1.5px solid #cbd5e1; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; font-style: italic; }
    .callout { margin-top: 16px; border-left: 3px solid #0f172a; background: #f8fafc; border-radius: 0 10px 10px 0; padding: 13px 16px; font-size: 13px; line-height: 1.6; color: #1e293b; }
    .subhead-row { display: flex; align-items: baseline; justify-content: space-between; margin-top: 20px; }
    .subhead { font-size: 13px; font-weight: 800; color: #0f172a; }
    .subhead-note { font-size: 10.5px; color: #94a3b8; }
    .mb-11 { margin-bottom: 11px; }
    .mb-12 { margin-bottom: 12px; }
    .mt-18 { margin-top: 18px; }
    .mt-20 { margin-top: 20px; }
    .mt-22 { margin-top: 22px; }
    .trend-wrap { margin-top: 12px; position: relative; height: 120px; border-bottom: 1.5px solid #e2e8f0; }
    .trend-avg-line { position: absolute; left: 0; right: 0; border-top: 1px dashed #cbd5e1; }
    .trend-avg-label { position: absolute; right: 0; top: -14px; font-size: 8.5px; font-weight: 700; color: #94a3b8; }
    .trend-bars { position: absolute; inset: 0; display: flex; align-items: flex-end; gap: 2px; }
    .trend-bar { flex: 1; border-radius: 2px 2px 0 0; }
    .trend-axis { display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8; margin-top: 5px; }
    .two-col { display: grid; grid-template-columns: 1.3fr 1fr; gap: 18px; }
    .mc-row { margin-bottom: 15px; break-inside: avoid; }
    .mc-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 7px; }
    .mc-label { font-size: 11.5px; font-weight: 700; color: #334155; }
    .mc-delta { font-size: 11px; font-weight: 800; }
    .mc-bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
    .mc-bar-label { width: 58px; flex: none; font-size: 9px; font-weight: 700; color: #94a3b8; text-align: right; white-space: nowrap; }
    .mc-bar-label-cur { font-weight: 800; color: #334155; }
    .mc-track { flex: 1; height: 14px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
    .mc-fill { height: 100%; border-radius: 3px; }
    .mc-fill-prev { background: #cbd5e1; }
    .mc-fill-cur { background: #0f172a; }
    .mc-value { width: 78px; font-size: 10px; font-weight: 600; color: #94a3b8; }
    .mc-value-cur { font-weight: 800; }
    .margin3-card { border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
    .margin3-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-bottom: 1px solid #f1f5f9; }
    .margin3-row:last-child { border-bottom: none; }
    .margin3-label { font-size: 11.5px; font-weight: 700; color: #475569; }
    .margin3-value { display: inline-flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 800; }
    .margin3-arrow { font-size: 9px; }
    .hint-text { font-size: 9.5px; color: #94a3b8; margin-top: 9px; line-height: 1.5; }
    .table-card { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .tp-row { display: grid; grid-template-columns: 22px 1fr 140px 56px; gap: 10px; padding: 10px 14px; border-bottom: 1px solid #f1f5f9; align-items: center; break-inside: avoid; }
    .tp-row:last-child { border-bottom: none; }
    .tp-head { background: #f8fafc; font-size: 9.5px; font-weight: 800; letter-spacing: 0.06em; color: #94a3b8; text-transform: uppercase; padding: 9px 14px; }
    .tp-rank { font-size: 12px; font-weight: 800; color: #cbd5e1; }
    .tp-name { font-size: 12px; font-weight: 700; color: #0f172a; }
    .tp-cat { font-size: 9.5px; color: #94a3b8; margin-top: 2px; }
    .tp-bar-row { display: flex; align-items: center; gap: 8px; }
    .tp-track { flex: 1; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
    .tp-fill { height: 100%; background: #0f172a; border-radius: 4px; }
    .tp-rev { font-size: 9.5px; font-weight: 700; color: #475569; white-space: nowrap; }
    .tp-share { font-size: 11px; font-weight: 800; color: #334155; }
    .tp-empty, .opex-empty { padding: 14px; font-size: 11.5px; color: #94a3b8; }
    .ta-right { text-align: right; }
    .cat-row { margin-bottom: 10px; break-inside: avoid; }
    .cat-top { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; }
    .cat-name { font-weight: 700; color: #334155; }
    .cat-pct { font-weight: 800; color: #475569; }
    .cat-track { height: 9px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
    .cat-fill { height: 100%; background: #64748b; border-radius: 4px; }
    .opex-row { display: grid; grid-template-columns: 1fr 84px 56px; gap: 8px; padding: 8px 12px; border-bottom: 1px solid #f1f5f9; align-items: center; break-inside: avoid; }
    .opex-row:last-child { border-bottom: none; }
    .opex-label-cell { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .opex-flag { flex: none; width: 5px; height: 5px; border-radius: 50%; background: #f59e0b; display: inline-block; }
    .opex-label { font-size: 10.5px; font-weight: 600; color: #334155; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .opex-track { height: 7px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
    .opex-fill { height: 100%; border-radius: 4px; }
    .opex-value { text-align: right; }
    .opex-nom { font-size: 10px; font-weight: 700; color: #334155; }
    .opex-delta { font-size: 8.5px; font-weight: 700; }
    .legend-row { display: flex; align-items: center; gap: 6px; font-size: 9.5px; color: #94a3b8; margin-top: 8px; }
    .statement-card { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; font-size: 11.5px; }
    .stmt-row { display: flex; justify-content: space-between; padding: 9px 14px; break-inside: avoid; }
    .stmt-row span:first-child { color: #475569; }
    .stmt-alt { background: #f8fafc; }
    .stmt-sub { border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; background: #f8fafc; font-weight: 800; }
    .stmt-sub span { color: #0f172a !important; font-weight: 800; }
    .stmt-val { font-weight: 700; color: #0f172a; }
    .stmt-neg { color: #be123c !important; }
    .stmt-muted { color: #94a3b8 !important; }
    .stmt-net { align-items: center; padding: 12px 14px; border-top: 1px solid; font-weight: 800; }
    .stmt-net span:first-child { font-weight: 800; }
    .stmt-net-val { text-align: right; }
    .stmt-net-val span { display: block; font-weight: 800; font-size: 14px; }
    .stmt-net-margin { font-size: 9px !important; font-weight: 700 !important; opacity: 0.75; }
    .recon-row { display: grid; grid-template-columns: 1.1fr 56px 0.9fr 0.9fr 0.9fr 48px; gap: 8px; padding: 9px 14px; border-bottom: 1px solid #f1f5f9; align-items: center; font-size: 10.5px; break-inside: avoid; }
    .recon-row:last-child { border-bottom: none; }
    .recon-head { background: #f8fafc; font-size: 9px; font-weight: 800; letter-spacing: 0.05em; color: #94a3b8; text-transform: uppercase; }
    .recon-label { font-weight: 700; color: #0f172a; }
    .recon-rate { font-weight: 600; color: #94a3b8; font-size: 9px; }
    .recon-muted { color: #475569; }
    .recon-faint { color: #94a3b8; }
    .recon-bold { font-weight: 800; color: #0f172a; }
    .recon-share { font-weight: 700; color: #64748b; }
    .recon-total { background: #0f172a; color: #fff; font-weight: 800; }
    .recon-total-fee { opacity: 0.8; }
    @media print {
        .hdr-space, .ftr-space { height: max(24mm, 24mm); }
        .doc-header { position: fixed; top: 0; left: 0; right: 0; margin: 0; }
        .doc-footer { position: fixed; bottom: 0; left: 0; right: 0; margin: 0; }
        tr, .kpi-card, .insight-row, .mc-row, .tp-row, .cat-row, .opex-row, .stmt-row, .recon-row, .margin3-row { break-inside: avoid; }
        h1, h2, h3 { break-after: avoid; }
    }
</style>
</head>
<body>
    ${header}
    <table class="doc-table">
        <thead><tr><td><div class="hdr-space"></div></td></tr></thead>
        <tbody><tr><td>
            <div class="doc-body">${section1}${section2}${section3}${section4}</div>
        </td></tr></tbody>
        <tfoot><tr><td><div class="ftr-space"></div></td></tr></tfoot>
    </table>
    ${footer}
</body>
</html>`;
}

function printReport(): void {
    if (typeof window === 'undefined') {
        return;
    }

    const win = window.open('', '_blank', 'width=900,height=1120');

    if (!win) {
        window.alert(
            'Tidak dapat membuka jendela cetak. Pastikan pop-up tidak diblokir.',
        );

        return;
    }

    win.document.write(buildFinancialReportHtml());
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
