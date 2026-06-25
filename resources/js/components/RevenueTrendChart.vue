<script setup lang="ts">
// Grafik garis/area tren omzet — responsif & tanpa library chart.
//
// Digambar dengan SVG (viewBox + preserveAspectRatio="none") sehingga melar
// mengikuti lebar kartu. Garis & guide pakai vector-effect="non-scaling-stroke"
// agar ketebalannya tetap walau sumbu X/Y diskalakan berbeda. Label sumbu & dot
// dirender sebagai overlay HTML (bukan teks SVG) supaya tajam dan tak ikut melar.
import { computed, ref } from 'vue';
import { formatCompact, formatNumber, formatRupiah } from '@/lib/format';

interface Point {
    label: string;
    value: number;
    count?: number;
}

const props = withDefaults(
    defineProps<{
        points: Point[];
        emptyText?: string;
    }>(),
    { emptyText: 'Belum ada data pada periode ini.' },
);

// Sistem koordinat internal (viewBox). preserveAspectRatio="none" memetakannya
// linear per-sumbu ke piksel, jadi titik data tetap presisi.
const VBW = 760;
const VBH = 220;
const PLOT_TOP = 8;
const PLOT_BOTTOM = 212;
const PLOT_H = PLOT_BOTTOM - PLOT_TOP;

const n = computed(() => props.points.length);
const maxValue = computed(() =>
    Math.max(...props.points.map((p) => p.value), 1),
);
const hasData = computed(() => props.points.some((p) => p.value > 0));
const hasCount = computed(() => props.points.some((p) => p.count != null));

function xAt(i: number): number {
    return n.value <= 1 ? VBW / 2 : (i / (n.value - 1)) * VBW;
}
function yAt(value: number): number {
    return PLOT_TOP + (1 - value / maxValue.value) * PLOT_H;
}
function leftPct(i: number): number {
    return (xAt(i) / VBW) * 100;
}
function topPct(value: number): number {
    return (yAt(value) / VBH) * 100;
}

const linePath = computed(() =>
    props.points
        .map(
            (p, i) =>
                `${i ? 'L' : 'M'}${xAt(i).toFixed(2)} ${yAt(p.value).toFixed(2)}`,
        )
        .join(' '),
);
const areaPath = computed(() => {
    if (!n.value) {
        return '';
    }

    return `${linePath.value} L${xAt(n.value - 1).toFixed(2)} ${PLOT_BOTTOM} L${xAt(0).toFixed(2)} ${PLOT_BOTTOM} Z`;
});

// Garis bantu horizontal + label sumbu Y (5 garis: 0%, 25%, … 100% dari maks).
const gridLines = computed(() =>
    [0, 1, 2, 3, 4].map((k) => {
        const ratio = k / 4;

        return {
            y: PLOT_TOP + ratio * PLOT_H,
            topPct: ((PLOT_TOP + ratio * PLOT_H) / VBH) * 100,
            label: formatCompact(maxValue.value * (1 - ratio)),
        };
    }),
);

// Label sumbu X dijarangkan agar maksimal ~7 label, plus selalu tampilkan titik terakhir.
const xTicks = computed(() => {
    const total = n.value;

    if (total === 0) {
        return [] as { i: number; left: number; label: string }[];
    }

    const step = Math.max(1, Math.ceil(total / 7));
    const ticks: { i: number; left: number; label: string }[] = [];

    for (let i = 0; i < total; i += step) {
        ticks.push({ i, left: leftPct(i), label: props.points[i].label });
    }

    const last = total - 1;

    if (ticks.length && ticks[ticks.length - 1].i !== last) {
        ticks.push({
            i: last,
            left: leftPct(last),
            label: props.points[last].label,
        });
    }

    return ticks;
});

// Titik penanda statis hanya saat data jarang, supaya rapi di rentang padat.
const showMarkers = computed(() => n.value > 0 && n.value <= 14);

// ----- Interaksi hover -----
const plotEl = ref<HTMLElement | null>(null);
const hoverIndex = ref<number | null>(null);

function onMove(event: PointerEvent): void {
    const el = plotEl.value;

    if (!el || n.value === 0) {
        return;
    }

    const rect = el.getBoundingClientRect();
    const ratio = Math.min(
        Math.max((event.clientX - rect.left) / rect.width, 0),
        1,
    );
    hoverIndex.value = n.value <= 1 ? 0 : Math.round(ratio * (n.value - 1));
}
function onLeave(): void {
    hoverIndex.value = null;
}

const hoverPoint = computed(() =>
    hoverIndex.value == null ? null : props.points[hoverIndex.value],
);
// Jaga tooltip tetap di dalam area (geser anchor di tepi kiri/kanan).
const tooltipLeft = computed(() =>
    hoverIndex.value == null
        ? 0
        : Math.min(Math.max(leftPct(hoverIndex.value), 10), 90),
);
</script>

<template>
    <div
        v-if="!hasData"
        class="flex h-52 items-center justify-center text-sm text-slate-400"
    >
        {{ emptyText }}
    </div>
    <div v-else class="flex select-none">
        <!-- Sumbu Y -->
        <div class="relative h-52 w-12 shrink-0">
            <span
                v-for="(g, idx) in gridLines"
                :key="idx"
                class="absolute right-1.5 -translate-y-1/2 text-[10px] text-slate-400 tabular-nums"
                :style="{ top: `${g.topPct}%` }"
                >{{ g.label }}</span
            >
        </div>

        <!-- Area plot -->
        <div class="relative flex-1">
            <div
                ref="plotEl"
                class="relative"
                style="touch-action: pan-y"
                @pointermove="onMove"
                @pointerleave="onLeave"
            >
                <svg
                    :viewBox="`0 0 ${VBW} ${VBH}`"
                    preserveAspectRatio="none"
                    class="h-52 w-full overflow-visible"
                >
                    <defs>
                        <linearGradient
                            id="rev-trend-grad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stop-color="#0ea5e9"
                                stop-opacity="0.28"
                            />
                            <stop
                                offset="100%"
                                stop-color="#0ea5e9"
                                stop-opacity="0"
                            />
                        </linearGradient>
                    </defs>

                    <line
                        v-for="(g, idx) in gridLines"
                        :key="idx"
                        :x1="0"
                        :x2="VBW"
                        :y1="g.y"
                        :y2="g.y"
                        class="stroke-slate-200 dark:stroke-zinc-800"
                        stroke-width="1"
                        vector-effect="non-scaling-stroke"
                    />

                    <path
                        :d="areaPath"
                        fill="url(#rev-trend-grad)"
                        stroke="none"
                    />
                    <path
                        :d="linePath"
                        fill="none"
                        class="stroke-sky-500"
                        stroke-width="2"
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        vector-effect="non-scaling-stroke"
                    />

                    <line
                        v-if="hoverIndex != null"
                        :x1="xAt(hoverIndex)"
                        :x2="xAt(hoverIndex)"
                        :y1="PLOT_TOP"
                        :y2="PLOT_BOTTOM"
                        class="stroke-sky-400/70"
                        stroke-width="1"
                        stroke-dasharray="3 3"
                        vector-effect="non-scaling-stroke"
                    />
                </svg>

                <!-- Dot statis (data jarang) -->
                <template v-if="showMarkers">
                    <span
                        v-for="(p, i) in points"
                        :key="i"
                        class="pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-zinc-900"
                        :style="{
                            left: `${leftPct(i)}%`,
                            top: `${topPct(p.value)}%`,
                        }"
                    />
                </template>

                <!-- Dot hover -->
                <span
                    v-if="hoverPoint"
                    class="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-600 ring-2 ring-white dark:ring-zinc-900"
                    :style="{
                        left: `${leftPct(hoverIndex as number)}%`,
                        top: `${topPct(hoverPoint.value)}%`,
                    }"
                />

                <!-- Tooltip -->
                <div
                    v-if="hoverPoint"
                    class="pointer-events-none absolute bottom-full z-10 mb-2 -translate-x-1/2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs whitespace-nowrap shadow-lg dark:border-zinc-700 dark:bg-zinc-950"
                    :style="{ left: `${tooltipLeft}%` }"
                >
                    <span class="font-semibold">{{ hoverPoint.label }}</span> ·
                    {{ formatRupiah(hoverPoint.value) }}
                    <template v-if="hasCount">
                        <br /><span class="text-slate-500 dark:text-slate-400"
                            >{{
                                formatNumber(hoverPoint.count ?? 0)
                            }}
                            transaksi</span
                        >
                    </template>
                </div>
            </div>

            <!-- Sumbu X -->
            <div class="relative mt-1 h-4">
                <span
                    v-for="t in xTicks"
                    :key="t.i"
                    class="absolute -translate-x-1/2 text-[10px] whitespace-nowrap text-slate-400"
                    :style="{ left: `${t.left}%` }"
                    >{{ t.label }}</span
                >
            </div>
        </div>
    </div>
</template>
