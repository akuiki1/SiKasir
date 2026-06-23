<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    DollarSign,
    FileText,
    X,
    Save,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
} from 'lucide-vue-next';
import { ref, computed, watch } from 'vue';
import BodyTeleport from '@/components/BodyTeleport.vue';
import Pagination from '@/components/Pagination.vue';
import { usePagination } from '@/composables/usePagination';
import {
    store as pengeluaransStore,
    update as pengeluaransUpdate,
    destroy as pengeluaransDestroy,
} from '@/routes/admin/pengeluarans';

interface Pengeluaran {
    id_pengeluaran: number;
    tipe: string;
    judul: string;
    keterangan: string | null;
    nominal: number;
    created_at: string;
}

interface Stats {
    total_pengeluaran: number;
    total_nominal: number;
}

const props = defineProps<{
    pengeluarans: Pengeluaran[];
    stats: Stats;
    date_range: {
        start_date: string;
        end_date: string;
    };
}>();

// Tipe yang tergolong modal barang (HPP). Dikecualikan dari Biaya Operasional di
// Laporan Laba Rugi karena modal produk sudah dihitung lewat batch produksi/HPP —
// tetap tercatat di Arus Kas sebagai "Belanja Bahan & Produksi".
const COGS_TIPES = ['bahan_baku', 'kemasan'];

// Dropdown dikelompokkan agar admin paham perbedaan modal barang vs biaya operasional.
const tipeGroups = [
    {
        label: 'Modal Barang (masuk HPP)',
        options: [
            { value: 'bahan_baku', label: 'Bahan Baku' },
            { value: 'kemasan', label: 'Kemasan' },
        ],
    },
    {
        label: 'Biaya Operasional',
        options: [
            { value: 'operasional', label: 'Operasional' },
            { value: 'transportasi', label: 'Transportasi' },
            { value: 'gaji', label: 'Gaji' },
            { value: 'peralatan', label: 'Peralatan' },
            { value: 'sewa', label: 'Sewa' },
            { value: 'listrik_air', label: 'Listrik & Air' },
            { value: 'promosi', label: 'Promosi' },
            { value: 'pajak', label: 'Pajak' },
            { value: 'lainnya', label: 'Lainnya' },
        ],
    },
];

const isModalBarangTipe = computed(() => COGS_TIPES.includes(form.tipe));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function getMonthRange(year: number, month: number) {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    return {
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10),
    };
}

const showDateFilter = ref(false);
const filterYear = ref(props.date_range.start_date ? new Date(props.date_range.start_date + 'T00:00:00').getFullYear() : new Date().getFullYear());
const dateStartDate = ref(props.date_range.start_date);
const dateEndDate = ref(props.date_range.end_date);

function detectDateMode(): string {
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

const selectedDateMode = ref(detectDateMode());

const periodLabel = computed(() => {
    if (selectedDateMode.value === 'today') {
return 'Hari Ini';
}

    if (selectedDateMode.value !== 'custom') {
        return `${MONTHS[Number(selectedDateMode.value)]} ${filterYear.value}`;
    }

    return props.date_range.start_date === props.date_range.end_date
        ? props.date_range.start_date
        : `${props.date_range.start_date} – ${props.date_range.end_date}`;
});

function selectMonth(monthIndex: number): void {
    selectedDateMode.value = String(monthIndex);
    const range = getMonthRange(filterYear.value, monthIndex);
    router.get('/admin/pengeluarans', {
        start_date: range.start,
        end_date: range.end,
    }, { preserveState: true, replace: true });
}

function selectToday(): void {
    selectedDateMode.value = 'today';
    const today = new Date().toISOString().slice(0, 10);
    router.get('/admin/pengeluarans', {
        start_date: today,
        end_date: today,
    }, { preserveState: true, replace: true });
}

function prevFilterYear(): void {
    filterYear.value--;

    if (selectedDateMode.value !== 'custom' && selectedDateMode.value !== 'today') {
        selectMonth(Number(selectedDateMode.value));
    }
}

function nextFilterYear(): void {
    filterYear.value++;

    if (selectedDateMode.value !== 'custom' && selectedDateMode.value !== 'today') {
        selectMonth(Number(selectedDateMode.value));
    }
}

function applyDateRange(): void {
    router.get('/admin/pengeluarans', {
        start_date: dateStartDate.value,
        end_date: dateEndDate.value,
    }, { preserveState: true, replace: true });
}

const searchQuery = ref('');
const filteredPengeluarans = computed(() => {
    if (!searchQuery.value) {
        return props.pengeluarans;
    }

    return props.pengeluarans.filter((item) =>
        `${item.judul} ${item.tipe}`
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()),
    );
});

const { currentPage, perPage, totalItems, totalPages, paginatedItems: paginatedPengeluarans, startIndex, endIndex, goToPage, visiblePages } = usePagination(() => filteredPengeluarans.value);

const showModal = ref(false);
const editingPengeluaran = ref<Pengeluaran | null>(null);

const form = useForm({
    tipe: '',
    judul: '',
    keterangan: '',
    nominal: 0,
});

const nominalDisplay = ref('');

function formatNominalDisplay(value: number): string {
    if (!value && value !== 0) {
        return '';
    }

    return value === 0 ? '' : value.toLocaleString('id-ID');
}

function handleNominalInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/\D/g, '');
    const numeric = Number(raw) || 0;

    form.nominal = numeric;
    nominalDisplay.value = numeric === 0 ? '' : numeric.toLocaleString('id-ID');

    const cursorPos = input.selectionStart ?? 0;
    const oldLength = input.value.length;

    input.value = nominalDisplay.value;

    const newLength = input.value.length;
    const newCursor = Math.max(0, cursorPos + (newLength - oldLength));

    input.setSelectionRange(newCursor, newCursor);
}

watch(showModal, (isOpen) => {
    if (isOpen) {
        nominalDisplay.value = formatNominalDisplay(form.nominal);
    }
});

function openTambah() {
    editingPengeluaran.value = null;
    form.reset();
    showModal.value = true;
}

function openEdit(pengeluarans: Pengeluaran) {
    editingPengeluaran.value = pengeluarans;
    form.tipe = pengeluarans.tipe;
    form.judul = pengeluarans.judul;
    form.keterangan = pengeluarans.keterangan ?? '';
    form.nominal = pengeluarans.nominal;
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
    form.reset();
    form.clearErrors();
}

function submitForm() {
    if (editingPengeluaran.value) {
        form.put(pengeluaransUpdate(editingPengeluaran.value.id_pengeluaran).url, {
            onSuccess: () => closeModal(),
        });

        return;
    }

    form.post(pengeluaransStore().url, {
        onSuccess: () => closeModal(),
    });
}

function hapusPengeluaran(pengeluarans: Pengeluaran) {
    if (
        confirm(`Hapus pengeluaran "${pengeluarans.judul}"? Tindakan ini tidak dapat dibatalkan.`)
    ) {
        router.delete(pengeluaransDestroy(pengeluarans.id_pengeluaran).url);
    }
}
</script>

<template>
    <Head title="Data Pengeluaran - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">Manajemen Pengeluaran</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Kelola semua pengeluaran operasional dan bahan.</p>
            </div>

            <div class="flex shrink-0 items-center gap-2">
                <!-- Date range filter -->
                <div class="relative">
                    <button
                        type="button"
                        class="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition"
                        :class="showDateFilter
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400'
                            : 'border-sidebar-border/70 bg-background text-slate-600 hover:bg-slate-50 dark:border-sidebar-border dark:text-slate-300 dark:hover:bg-zinc-800'"
                        @click="showDateFilter = !showDateFilter"
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
                            v-if="showDateFilter"
                            class="absolute right-0 top-11 z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                        >
                            <!-- Hari Ini preset -->
                            <button
                                type="button"
                                class="mb-3 w-full rounded-lg py-2 text-xs font-semibold transition-all"
                                :class="selectedDateMode === 'today'
                                    ? 'bg-indigo-500 text-white'
                                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'"
                                @click="selectToday(); showDateFilter = false"
                            >
                                Hari Ini
                            </button>

                            <!-- Year navigator -->
                            <div class="flex items-center gap-0.5">
                                <button
                                    type="button"
                                    class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800 dark:hover:text-slate-300"
                                    @click="prevFilterYear"
                                >
                                    <ChevronLeft class="h-4 w-4" />
                                </button>
                                <span class="flex-1 text-center text-sm font-bold text-slate-800 dark:text-slate-100">{{ filterYear }}</span>
                                <button
                                    type="button"
                                    class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800 dark:hover:text-slate-300"
                                    @click="nextFilterYear"
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
                                    :class="selectedDateMode === String(i)
                                        ? 'bg-indigo-500 text-white'
                                        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'"
                                    @click="selectMonth(i); showDateFilter = false"
                                >
                                    {{ month }}
                                </button>
                                <button
                                    type="button"
                                    class="col-span-4 rounded-lg py-2 text-xs font-semibold transition-all"
                                    :class="selectedDateMode === 'custom'
                                        ? 'bg-indigo-500 text-white'
                                        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800'"
                                    @click="selectedDateMode = 'custom'"
                                >
                                    Custom
                                </button>
                            </div>

                            <!-- Custom date inputs -->
                            <div
                                v-if="selectedDateMode === 'custom'"
                                class="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-zinc-800"
                            >
                                <div class="grid grid-cols-2 gap-2">
                                    <label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        Mulai
                                        <input
                                            v-model="dateStartDate"
                                            type="date"
                                            class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-indigo-500/20"
                                        />
                                    </label>
                                    <label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        Sampai
                                        <input
                                            v-model="dateEndDate"
                                            type="date"
                                            class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-indigo-500/20"
                                        />
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    class="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-500 text-xs font-semibold text-white transition hover:bg-indigo-600"
                                    @click="applyDateRange(); showDateFilter = false"
                                >
                                    <CalendarDays class="h-3 w-3" />
                                    Terapkan
                                </button>
                            </div>
                        </div>
                    </Transition>
                </div>

                <button
                    id="btn-tambah-pengeluaran"
                    class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    @click="openTambah"
                >
                    <Plus class="h-4 w-4" />
                    Tambah Pengeluaran
                </button>
            </div>
        </div>

        <!-- Backdrop to close date filter -->
        <div
            v-if="showDateFilter"
            class="fixed inset-0 z-40"
            @click="showDateFilter = false"
        />

        <div class="grid gap-4 md:grid-cols-2">
            <div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                <div class="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400">
                    <DollarSign class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Pengeluaran {{ periodLabel }}</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_pengeluaran }} entri</h3>
                </div>
            </div>
            <div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                <div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                    <FileText class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Nominal {{ periodLabel }}</span>
                    <h3 class="mt-0.5 text-xl font-bold">Rp {{ stats.total_nominal.toLocaleString('id-ID') }}</h3>
                </div>
            </div>
        </div>

        <div class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border">
            <div class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border">
                <div class="relative flex-1 max-w-md">
                    <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari judul atau tipe pengeluaran..."
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20">
                            <th class="px-6 py-4 font-semibold text-muted-foreground">No</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Judul</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Tipe</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Nominal</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Tanggal</th>
                            <th class="px-6 py-4 text-right font-semibold text-muted-foreground">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        <tr v-if="paginatedPengeluarans.length === 0">
                            <td colspan="6" class="px-6 py-12 text-center text-muted-foreground">
                                <DollarSign class="mx-auto mb-3 h-10 w-10 opacity-30" />
                                <p class="font-medium">Tidak ada pengeluaran yang cocok.</p>
                            </td>
                        </tr>
                        <tr
                            v-for="(item, index) in paginatedPengeluarans"
                            :key="item.id_pengeluaran"
                            class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"
                        >
                            <td class="px-6 py-4 text-muted-foreground">{{ startIndex + index }}</td>
                            <td class="px-6 py-4">{{ item.judul }}</td>
                            <td class="px-6 py-4 capitalize">{{ item.tipe.replace('_', ' ') }}</td>
                            <td class="px-6 py-4">Rp {{ item.nominal.toLocaleString('id-ID') }}</td>
                            <td class="px-6 py-4">{{ item.created_at }}</td>
                            <td class="px-6 py-4 text-right">
                                <div class="inline-flex justify-end gap-2">
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
                                        title="Edit"
                                        @click="openEdit(item)"
                                    >
                                        <Edit class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                                        title="Hapus"
                                        @click="hapusPengeluaran(item)"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Pagination
                :current-page="currentPage"
                :total-pages="totalPages"
                :total-items="totalItems"
                :start-index="startIndex"
                :end-index="endIndex"
                :per-page="perPage"
                :visible-pages="visiblePages"
                @update:current-page="goToPage"
                @update:per-page="perPage = $event"
            />
        </div>
    </div>

    <BodyTeleport>
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
            <div class="w-full max-w-2xl rounded-3xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-semibold">{{ editingPengeluaran ? 'Edit Pengeluaran' : 'Tambah Pengeluaran' }}</h2>
                        <p class="mt-1 text-sm text-muted-foreground">Isi detail pengeluaran untuk pencatatan keuangan.</p>
                    </div>
                    <button class="rounded-full p-2 text-muted-foreground transition hover:bg-slate-100 dark:hover:bg-zinc-800" @click="closeModal">
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <div class="mt-6 grid gap-4 lg:grid-cols-2">
                    <div>
                        <label class="mb-2 block text-sm font-medium">Tipe Pengeluaran</label>
                        <select
                            v-model="form.tipe"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                        >
                            <option value="" disabled>Pilih tipe</option>
                            <optgroup v-for="group in tipeGroups" :key="group.label" :label="group.label">
                                <option v-for="option in group.options" :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </optgroup>
                        </select>
                        <p v-if="form.errors.tipe" class="mt-2 text-sm text-rose-600">{{ form.errors.tipe }}</p>
                        <p
                            v-else-if="isModalBarangTipe"
                            class="mt-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs leading-relaxed text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300"
                        >
                            Tipe ini dihitung sebagai <strong>modal/HPP barang</strong>, jadi muncul di laporan <strong>Arus Kas</strong> — bukan di Biaya Operasional Laba Rugi, supaya modal tidak terhitung dua kali.
                        </p>
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-medium">Judul</label>
                        <input
                            type="text"
                            v-model="form.judul"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                        />
                        <p v-if="form.errors.judul" class="mt-2 text-sm text-rose-600">{{ form.errors.judul }}</p>
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-medium">Nominal</label>
                        <div class="relative">
                            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</span>
                            <input
                                type="text"
                                inputmode="numeric"
                                :value="nominalDisplay"
                                placeholder="0"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                @input="handleNominalInput"
                            />
                        </div>
                        <p v-if="form.errors.nominal" class="mt-2 text-sm text-rose-600">{{ form.errors.nominal }}</p>
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-medium">Keterangan</label>
                        <textarea
                            v-model="form.keterangan"
                            rows="4"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                        ></textarea>
                        <p v-if="form.errors.keterangan" class="mt-2 text-sm text-rose-600">{{ form.errors.keterangan }}</p>
                    </div>
                </div>

                <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800"
                        type="button"
                        @click="closeModal"
                    >
                        Batal
                    </button>
                    <button
                        class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        type="button"
                        @click="submitForm"
                    >
                        <Save class="h-4 w-4" />
                        {{ editingPengeluaran ? 'Simpan Perubahan' : 'Simpan Pengeluaran' }}
                    </button>
                </div>
            </div>
        </div>
    </BodyTeleport>
</template>
