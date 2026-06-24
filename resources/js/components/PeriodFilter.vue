<script setup lang="ts">
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref, computed, watch } from 'vue';
import { formatPeriodLabel } from '@/lib/period';

/**
 * Filter periode kalender yang dipakai seragam di semua halaman berfilter tanggal.
 * Preset: Hari Ini · (grid bulan + navigasi tahun) · Setahun Penuh · Custom.
 * Bekerja dengan rentang tanggal (start/end) yang dikelola server.
 */
const props = defineProps<{
    startDate: string;
    endDate: string;
}>();

const emit = defineEmits<{
    (e: 'change', range: { start_date: string; end_date: string }): void;
}>();

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// Format tanggal LOKAL (hindari pergeseran 1 hari akibat toISOString yang berbasis UTC).
function toISO(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');

    return `${y}-${m}-${d}`;
}

function getMonthRange(year: number, month: number): { start: string; end: string } {
    return { start: toISO(new Date(year, month, 1)), end: toISO(new Date(year, month + 1, 0)) };
}

function getYearRange(year: number): { start: string; end: string } {
    return { start: `${year}-01-01`, end: `${year}-12-31` };
}

function todayISO(): string {
    return toISO(new Date());
}

function yearOf(dateStr: string): number {
    return dateStr ? new Date(dateStr + 'T00:00:00').getFullYear() : new Date().getFullYear();
}

const open = ref(false);
const filterYear = ref(yearOf(props.startDate));
const customStart = ref(props.startDate);
const customEnd = ref(props.endDate);

// Tentukan mode aktif dari rentang tanggal saat ini (relatif tahun yang sedang dilihat).
function detectMode(): string {
    const today = todayISO();

    if (props.startDate === today && props.endDate === today) {
        return 'today';
    }

    const yr = getYearRange(filterYear.value);

    if (props.startDate === yr.start && props.endDate === yr.end) {
        return 'year';
    }

    for (let m = 0; m < 12; m++) {
        const r = getMonthRange(filterYear.value, m);

        if (r.start === props.startDate && r.end === props.endDate) {
            return String(m);
        }
    }

    return 'custom';
}

const selectedMode = ref(detectMode());

// Sinkron ulang saat rentang berubah dari luar (mis. setelah reload server).
watch(
    () => [props.startDate, props.endDate],
    () => {
        customStart.value = props.startDate;
        customEnd.value = props.endDate;
        filterYear.value = yearOf(props.startDate);
        selectedMode.value = detectMode();
    },
);

const periodLabel = computed(() => formatPeriodLabel(props.startDate, props.endDate));

function apply(range: { start: string; end: string }): void {
    emit('change', { start_date: range.start, end_date: range.end });
    open.value = false;
}

function selectToday(): void {
    selectedMode.value = 'today';
    apply({ start: todayISO(), end: todayISO() });
}

function selectMonth(monthIndex: number): void {
    selectedMode.value = String(monthIndex);
    apply(getMonthRange(filterYear.value, monthIndex));
}

function selectYear(): void {
    selectedMode.value = 'year';
    apply(getYearRange(filterYear.value));
}

function applyCustom(): void {
    selectedMode.value = 'custom';
    apply({ start: customStart.value, end: customEnd.value });
}

// Navigasi tahun: bila mode bulan/tahun aktif, ikut pindahkan periode ke tahun baru.
function prevFilterYear(): void {
    filterYear.value--;
    reselectAfterYearNav();
}

function nextFilterYear(): void {
    filterYear.value++;
    reselectAfterYearNav();
}

function reselectAfterYearNav(): void {
    if (selectedMode.value === 'year') {
        selectYear();
    } else if (selectedMode.value !== 'custom' && selectedMode.value !== 'today') {
        selectMonth(Number(selectedMode.value));
    }
}
</script>

<template>
    <div class="relative">
        <button
            type="button"
            class="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition"
            :class="open
                ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400'
                : 'border-sidebar-border/70 bg-background text-slate-600 hover:bg-slate-50 dark:border-sidebar-border dark:text-slate-300 dark:hover:bg-zinc-800'"
            @click="open = !open"
        >
            <CalendarDays class="h-4 w-4" />
            Periode
            <span class="ml-0.5 rounded-md bg-indigo-100 px-1.5 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
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
                v-if="open"
                class="absolute right-0 top-11 z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
            >
                <button
                    type="button"
                    class="mb-3 w-full rounded-lg py-2 text-xs font-semibold transition-all"
                    :class="selectedMode === 'today'
                        ? 'bg-indigo-500 text-white'
                        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'"
                    @click="selectToday"
                >
                    Hari Ini
                </button>

                <div class="flex items-center gap-0.5">
                    <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800 dark:hover:text-slate-300"
                        aria-label="Tahun sebelumnya"
                        @click="prevFilterYear"
                    >
                        <ChevronLeft class="h-4 w-4" />
                    </button>
                    <span class="flex-1 text-center text-sm font-bold text-slate-800 dark:text-slate-100">{{ filterYear }}</span>
                    <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800 dark:hover:text-slate-300"
                        aria-label="Tahun berikutnya"
                        @click="nextFilterYear"
                    >
                        <ChevronRight class="h-4 w-4" />
                    </button>
                </div>

                <div class="mt-3 grid grid-cols-4 gap-1">
                    <button
                        v-for="(month, i) in MONTHS"
                        :key="i"
                        type="button"
                        class="rounded-lg py-2 text-xs font-semibold transition-all"
                        :class="selectedMode === String(i)
                            ? 'bg-indigo-500 text-white'
                            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'"
                        @click="selectMonth(i)"
                    >
                        {{ month }}
                    </button>
                    <button
                        type="button"
                        class="col-span-4 rounded-lg py-2 text-xs font-semibold transition-all"
                        :class="selectedMode === 'year'
                            ? 'bg-indigo-500 text-white'
                            : 'text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10'"
                        @click="selectYear"
                    >
                        Setahun Penuh ({{ filterYear }})
                    </button>
                    <button
                        type="button"
                        class="col-span-4 rounded-lg py-2 text-xs font-semibold transition-all"
                        :class="selectedMode === 'custom'
                            ? 'bg-indigo-500 text-white'
                            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'"
                        @click="selectedMode = 'custom'"
                    >
                        Custom
                    </button>
                </div>

                <div
                    v-if="selectedMode === 'custom'"
                    class="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-zinc-800"
                >
                    <div class="grid grid-cols-2 gap-2">
                        <label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                            Mulai
                            <input
                                v-model="customStart"
                                type="date"
                                class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-indigo-500/20"
                            />
                        </label>
                        <label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                            Sampai
                            <input
                                v-model="customEnd"
                                type="date"
                                class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-indigo-500/20"
                            />
                        </label>
                    </div>
                    <button
                        type="button"
                        class="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-500 text-xs font-semibold text-white transition hover:bg-indigo-600"
                        @click="applyCustom"
                    >
                        <CalendarDays class="h-3 w-3" />
                        Terapkan
                    </button>
                </div>
            </div>
        </Transition>

        <div
            v-if="open"
            class="fixed inset-0 z-40"
            @click="open = false"
        />
    </div>
</template>
