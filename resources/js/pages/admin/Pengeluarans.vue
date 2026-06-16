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
} from 'lucide-vue-next';
import { ref, computed, watch } from 'vue';
import {
    store as pengeluaransStore,
    update as pengeluaransUpdate,
    destroy as pengeluaransDestroy,
} from '@/routes/admin/pengeluarans';
import { usePagination } from '@/composables/usePagination';
import Pagination from '@/components/Pagination.vue';

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
}>();

const tipeOptions = [
    { value: 'bahan_baku', label: 'Bahan Baku' },
    { value: 'kemasan', label: 'Kemasan' },
    { value: 'operasional', label: 'Operasional' },
    { value: 'transportasi', label: 'Transportasi' },
    { value: 'gaji', label: 'Gaji' },
    { value: 'peralatan', label: 'Peralatan' },
    { value: 'sewa', label: 'Sewa' },
    { value: 'listrik_air', label: 'Listrik & Air' },
    { value: 'promosi', label: 'Promosi' },
    { value: 'pajak', label: 'Pajak' },
    { value: 'lainnya', label: 'Lainnya' },
];

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

            <button
                id="btn-tambah-pengeluaran"
                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                @click="openTambah"
            >
                <Plus class="h-4 w-4" />
                Tambah Pengeluaran
            </button>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
            <div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                <div class="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400">
                    <DollarSign class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Pengeluaran</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_pengeluaran }} entri</h3>
                </div>
            </div>
            <div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                <div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                    <FileText class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Nominal</span>
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

    <Teleport to="body">
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
                            <option v-for="option in tipeOptions" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
                        <p v-if="form.errors.tipe" class="mt-2 text-sm text-rose-600">{{ form.errors.tipe }}</p>
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
    </Teleport>
</template>
