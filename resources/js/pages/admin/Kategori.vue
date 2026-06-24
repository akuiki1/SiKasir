<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Tag,
    Package,
    X,
    Save,
    AlertCircle,
} from 'lucide-vue-next';
import { ref, computed, watch } from 'vue';
import BodyTeleport from '@/components/BodyTeleport.vue';
import Pagination from '@/components/Pagination.vue';
import { store as kategoriStore, update as kategoriUpdate, destroy as kategoriDestroy } from '@/routes/admin/kategori';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Data Kategori',
                href: '/admin/kategori',
            },
        ],
    },
});

interface Kategori {
    id_kategori: number;
    nama_kategori: string;
    produks_count: number;
}

interface Stats {
    total_kategori: number;
    total_produk: number;
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
    kategoris: Paginator<Kategori>;
    stats: Stats;
    filters: Filters;
}>();

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
    router.get('/admin/kategori', buildParams(overrides), {
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

// Nomor halaman yang tampil (mirror logika composable usePagination).
const visiblePages = computed(() => {
    const pages: number[] = [];
    const total = props.kategoris.last_page;
    const current = props.kategoris.current_page;

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

// Modal state
const showModal = ref(false);
const editingKategori = ref<Kategori | null>(null);

const form = useForm({
    nama_kategori: '',
});

function openTambah() {
    editingKategori.value = null;
    form.reset();
    showModal.value = true;
}

function openEdit(kategori: Kategori) {
    editingKategori.value = kategori;
    form.nama_kategori = kategori.nama_kategori;
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
    form.reset();
    form.clearErrors();
}

function submitForm() {
    if (editingKategori.value) {
        form.put(kategoriUpdate(editingKategori.value.id_kategori).url, {
            onSuccess: () => closeModal(),
        });
    } else {
        form.post(kategoriStore().url, {
            onSuccess: () => closeModal(),
        });
    }
}

function hapusKategori(kategori: Kategori) {
    if (confirm(`Hapus kategori "${kategori.nama_kategori}"? Tindakan ini tidak dapat dibatalkan.`)) {
        router.delete(kategoriDestroy(kategori.id_kategori).url);
    }
}
</script>

<template>
    <Head title="Data Kategori - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <!-- Header Section -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">Manajemen Kategori</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Kelola data kategori produk di sistem Anda.
                </p>
            </div>

            <button
                id="btn-tambah-kategori"
                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                @click="openTambah"
            >
                <Plus class="h-4 w-4" />
                Tambah Kategori Baru
            </button>
        </div>

        <!-- Stats Row -->
        <div class="grid gap-4 md:grid-cols-2">
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400"
                >
                    <Tag class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Kategori</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_kategori }} Kategori</h3>
                </div>
            </div>
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400"
                >
                    <Package class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Produk Terdaftar</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_produk }} Produk</h3>
                </div>
            </div>
        </div>

        <!-- Table Section -->
        <div
            class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"
        >
            <!-- Table Action Bar -->
            <div
                class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border"
            >
                <div class="relative flex-1 max-w-md">
                    <Search
                        class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari kategori..."
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr
                            class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"
                        >
                            <th class="px-6 py-4 font-semibold text-muted-foreground">No</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                Nama Kategori
                            </th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                Jumlah Produk
                            </th>
                            <th class="px-6 py-4 text-right font-semibold text-muted-foreground">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        <tr v-if="props.kategoris.data.length === 0">
                            <td
                                colspan="4"
                                class="px-6 py-12 text-center text-muted-foreground"
                            >
                                <Tag class="mx-auto mb-3 h-10 w-10 opacity-30" />
                                <p class="font-medium">
                                    {{
                                        searchQuery
                                            ? 'Tidak ada kategori yang sesuai pencarian.'
                                            : 'Belum ada kategori. Tambahkan kategori pertama!'
                                    }}
                                </p>
                            </td>
                        </tr>
                        <tr
                            v-for="(kategori, index) in props.kategoris.data"
                            :key="kategori.id_kategori"
                            class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"
                        >
                            <td class="px-6 py-4 text-muted-foreground">{{ (props.kategoris.from ?? 0) + index }}</td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                                    >
                                        <Tag class="h-4 w-4" />
                                    </div>
                                    <span class="font-semibold text-foreground">{{
                                        kategori.nama_kategori
                                    }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                                >
                                    {{ kategori.produks_count }} Produk
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="inline-flex justify-end gap-2">
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
                                        aria-label="Edit"
                                        @click="openEdit(kategori)"
                                    >
                                        <Edit class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                                        aria-label="Hapus"
                                        :disabled="kategori.produks_count > 0"
                                        :class="{ 'opacity-40 cursor-not-allowed': kategori.produks_count > 0 }"
                                        @click="hapusKategori(kategori)"
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
                :current-page="props.kategoris.current_page"
                :total-pages="props.kategoris.last_page"
                :total-items="props.kategoris.total"
                :start-index="props.kategoris.from ?? 0"
                :end-index="props.kategoris.to ?? 0"
                :per-page="props.kategoris.per_page"
                :visible-pages="visiblePages"
                @update:current-page="goToPage"
                @update:per-page="changePerPage"
            />
        </div>
    </div>

    <!-- Modal Tambah / Edit Kategori -->
    <BodyTeleport>
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            @click.self="closeModal"
        >
            <div
                class="w-full max-w-md rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border"
            >
                <div class="mb-5 flex items-center justify-between">
                    <h2 class="text-lg font-bold">
                        {{ editingKategori ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
                    </h2>
                    <button
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                        @click="closeModal" aria-label="Tutup">
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <form @submit.prevent="submitForm">
                    <div class="mb-5">
                        <label class="mb-1.5 block text-sm font-medium" for="nama_kategori">
                            Nama Kategori
                        </label>
                        <input
                            id="nama_kategori"
                            v-model="form.nama_kategori"
                            type="text"
                            placeholder="Contoh: Minuman, Makanan, Camilan..."
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            :class="{ 'border-rose-500': form.errors.nama_kategori }"
                            autofocus
                        />
                        <p v-if="form.errors.nama_kategori" class="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
                            <AlertCircle class="h-3 w-3" />
                            {{ form.errors.nama_kategori }}
                        </p>
                    </div>

                    <div class="flex justify-end gap-3">
                        <button
                            type="button"
                            class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"
                            @click="closeModal"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60"
                            :disabled="form.processing"
                        >
                            <Save class="h-4 w-4" />
                            {{ form.processing ? 'Menyimpan...' : editingKategori ? 'Simpan Perubahan' : 'Tambah Kategori' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </BodyTeleport>
</template>
