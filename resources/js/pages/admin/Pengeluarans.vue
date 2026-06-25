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
    Wallet,
    Factory,
    Warehouse,
} from 'lucide-vue-next';
import { ref, computed, watch, onMounted } from 'vue';
import BodyTeleport from '@/components/BodyTeleport.vue';
import PagePurpose from '@/components/PagePurpose.vue';
import Pagination from '@/components/Pagination.vue';
import PeriodFilter from '@/components/PeriodFilter.vue';
import { formatPeriodLabel } from '@/lib/period';
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

interface Paginator<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Filters {
    search: string;
    per_page: number;
}

const props = defineProps<{
    pengeluarans: Paginator<Pengeluaran>;
    stats: Stats;
    date_range: {
        start_date: string;
        end_date: string;
    };
    filters: Filters;
}>();

// Tipe modal barang (HPP). Sengaja TIDAK lagi bisa diinput di sini: bahan baku &
// kemasan dicatat lewat menu Produksi (batch costing) agar tidak dobel-input antar
// halaman. Labelnya tetap dipakai untuk menampilkan data lama yang sudah terlanjur ada.
const LEGACY_COGS_LABELS: Record<string, string> = {
    bahan_baku: 'Bahan Baku',
    kemasan: 'Kemasan',
};

// Hanya biaya operasional yang bisa dipilih untuk entri baru.
const tipeGroups = [
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

// Saat mengedit pengeluaran lama bertipe modal barang, tampilkan tipenya sebagai
// grup terpisah supaya nilainya tak hilang — tapi tetap tak tersedia untuk entri baru.
const tipeOptionGroups = computed(() => {
    const legacyLabel = LEGACY_COGS_LABELS[form.tipe];

    if (!legacyLabel) {
        return tipeGroups;
    }

    return [
        {
            label: 'Tipe Lama (kini dicatat via Produksi)',
            options: [{ value: form.tipe, label: legacyLabel }],
        },
        ...tipeGroups,
    ];
});

const isLegacyCogsTipe = computed(() => form.tipe in LEGACY_COGS_LABELS);

const periodLabel = computed(() => formatPeriodLabel(props.date_range.start_date, props.date_range.end_date));

function onPeriod(range: { start_date: string; end_date: string }): void {
    reload({ start_date: range.start_date, end_date: range.end_date, page: 1 });
}

// Pencarian dikirim ke server (debounce) — hanya satu halaman data yang dimuat.
const searchQuery = ref(props.filters.search ?? '');

let searchTimer: ReturnType<typeof setTimeout> | undefined;
watch(searchQuery, (value) => {
    if (searchTimer) {
        clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(() => reload({ search: value, page: 1 }), 350);
});

type QueryValue = string | number;

function buildParams(overrides: Record<string, QueryValue> = {}): Record<string, QueryValue> {
    const params: Record<string, QueryValue | undefined> = {
        search: searchQuery.value || undefined,
        start_date: props.date_range.start_date || undefined,
        end_date: props.date_range.end_date || undefined,
        per_page: props.filters.per_page,
        ...overrides,
    };

    const cleaned: Record<string, QueryValue> = {};

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            cleaned[key] = value;
        }
    });

    return cleaned;
}

function reload(overrides: Record<string, QueryValue> = {}): void {
    router.get('/admin/pengeluarans', buildParams(overrides), {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}

function goToPage(page: number): void {
    reload({ page });
}

function changePerPage(value: number): void {
    reload({ per_page: value, page: 1 });
}

const visiblePages = computed(() => {
    const pages: number[] = [];
    const total = props.pengeluarans.last_page;
    const current = props.pengeluarans.current_page;

    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);

        if (current > 3) {
            pages.push(-1);
        }

        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
            pages.push(i);
        }

        if (current < total - 2) {
            pages.push(-1);
        }

        pages.push(total);
    }

    return pages;
});

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

// Deep-link dari hub "Catat": /admin/pengeluarans?aksi=tambah langsung buka form.
onMounted(() => {
    if (new URLSearchParams(window.location.search).get('aksi') === 'tambah') {
        openTambah();
    }
});

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
                    Kelola pengeluaran operasional toko.</p>
            </div>

            <div class="flex shrink-0 items-center gap-2">
                <!-- Date range filter -->
                <PeriodFilter
                    :start-date="props.date_range.start_date"
                    :end-date="props.date_range.end_date"
                    @change="onPeriod"
                />

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

        <PagePurpose
            :icon="Wallet"
            tone="amber"
            title="Untuk biaya operasional (bukan modal barang)"
            description="Catat gaji, sewa, listrik, transportasi, dan biaya operasional lain. Biaya bahan & kemasan dicatat di Produksi agar tidak dobel."
            :links="[
                { label: 'Bikin barang? Produksi', href: '/admin/produksi', icon: Factory },
                { label: 'Stok barang? Manajemen Stok', href: '/admin/stok', icon: Warehouse },
            ]"
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
                        <tr v-if="props.pengeluarans.data.length === 0">
                            <td colspan="6" class="px-6 py-12 text-center text-muted-foreground">
                                <DollarSign class="mx-auto mb-3 h-10 w-10 opacity-30" />
                                <p class="font-medium">Tidak ada pengeluaran yang cocok.</p>
                            </td>
                        </tr>
                        <tr
                            v-for="(item, index) in props.pengeluarans.data"
                            :key="item.id_pengeluaran"
                            class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"
                        >
                            <td class="px-6 py-4 text-muted-foreground">{{ (props.pengeluarans.from ?? 0) + index }}</td>
                            <td class="px-6 py-4">{{ item.judul }}</td>
                            <td class="px-6 py-4 capitalize">{{ item.tipe.replace('_', ' ') }}</td>
                            <td class="px-6 py-4">Rp {{ item.nominal.toLocaleString('id-ID') }}</td>
                            <td class="px-6 py-4">{{ item.created_at }}</td>
                            <td class="px-6 py-4 text-right">
                                <div class="inline-flex justify-end gap-2">
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
                                        aria-label="Edit"
                                        @click="openEdit(item)"
                                    >
                                        <Edit class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                                        aria-label="Hapus"
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
                :current-page="props.pengeluarans.current_page"
                :total-pages="props.pengeluarans.last_page"
                :total-items="props.pengeluarans.total"
                :start-index="props.pengeluarans.from ?? 0"
                :end-index="props.pengeluarans.to ?? 0"
                :per-page="props.pengeluarans.per_page"
                :visible-pages="visiblePages"
                @update:current-page="goToPage"
                @update:per-page="changePerPage"
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
                    <button class="rounded-full p-2 text-muted-foreground transition hover:bg-slate-100 dark:hover:bg-zinc-800" @click="closeModal" aria-label="Tutup">
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
                            <optgroup v-for="group in tipeOptionGroups" :key="group.label" :label="group.label">
                                <option v-for="option in group.options" :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </optgroup>
                        </select>
                        <p v-if="form.errors.tipe" class="mt-2 text-sm text-rose-600">{{ form.errors.tipe }}</p>
                        <p
                            v-else-if="isLegacyCogsTipe"
                            class="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                        >
                            <strong>Bahan baku &amp; kemasan kini dicatat di menu Produksi</strong> (batch costing), bukan di sini, supaya modal tidak terinput dua kali. Tipe ini hanya tampil karena data lama.
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
