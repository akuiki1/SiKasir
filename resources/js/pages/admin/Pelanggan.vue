<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import { Plus, Search, Contact, BadgePercent, X, Save, Edit, Trash2, AlertCircle, Phone } from 'lucide-vue-next';
import { ref, computed, watch } from 'vue';
import BodyTeleport from '@/components/BodyTeleport.vue';
import Pagination from '@/components/Pagination.vue';
import { store as pelangganStore, update as pelangganUpdate, destroy as pelangganDestroy } from '@/routes/admin/pelanggan';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Pelanggan',
                href: '/admin/pelanggan',
            },
        ],
    },
});

type TipePelanggan = 'umum' | 'reseller';

interface Pelanggan {
    id_pelanggan: number;
    nama: string;
    telp: string | null;
    tipe: TipePelanggan;
    transaksis_count: number;
}

interface Stats {
    total_pelanggan: number;
    total_reseller: number;
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
    tipe: '' | TipePelanggan;
    per_page: number;
}

const props = defineProps<{
    pelanggans: Paginator<Pelanggan>;
    stats: Stats;
    filters: Filters;
}>();

// Pencarian & filter tipe dikirim ke server (search di-debounce).
const searchQuery = ref(props.filters.search ?? '');
const filterTipe = ref<'' | TipePelanggan>(props.filters.tipe ?? '');

let searchTimer: ReturnType<typeof setTimeout> | undefined;
watch(searchQuery, (value) => {
    if (searchTimer) {
        clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(() => reload({ search: value, page: 1 }), 350);
});

watch(filterTipe, (value) => reload({ tipe: value, page: 1 }));

type QueryValue = string | number;

function buildParams(overrides: Record<string, QueryValue> = {}): Record<string, QueryValue> {
    const params: Record<string, QueryValue | undefined> = {
        search: searchQuery.value || undefined,
        tipe: filterTipe.value || undefined,
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
    router.get('/admin/pelanggan', buildParams(overrides), {
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
    const total = props.pelanggans.last_page;
    const current = props.pelanggans.current_page;

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
const editing = ref<Pelanggan | null>(null);

const form = useForm<{ nama: string; telp: string; tipe: TipePelanggan }>({
    nama: '',
    telp: '',
    tipe: 'umum',
});

function openTambah(): void {
    editing.value = null;
    form.reset();
    form.clearErrors();
    showModal.value = true;
}

function openEdit(pelanggan: Pelanggan): void {
    editing.value = pelanggan;
    form.nama = pelanggan.nama;
    form.telp = pelanggan.telp ?? '';
    form.tipe = pelanggan.tipe;
    form.clearErrors();
    showModal.value = true;
}

function closeModal(): void {
    showModal.value = false;
    form.reset();
    form.clearErrors();
}

function submitForm(): void {
    if (editing.value) {
        router.put(pelangganUpdate(editing.value.id_pelanggan).url, form.data(), {
            onSuccess: () => closeModal(),
            onError: (errors) => form.setError(errors),
        });
    } else {
        form.post(pelangganStore().url, {
            onSuccess: () => closeModal(),
        });
    }
}

function hapus(pelanggan: Pelanggan): void {
    if (confirm(`Hapus pelanggan "${pelanggan.nama}"? Riwayat transaksinya tetap tersimpan.`)) {
        router.delete(pelangganDestroy(pelanggan.id_pelanggan).url);
    }
}

const tipeBadge: Record<TipePelanggan, { label: string; class: string }> = {
    umum: { label: 'Umum', class: 'border-slate-400/30 bg-slate-400/10 text-slate-600 dark:text-slate-300' },
    reseller: { label: 'Reseller', class: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
};
</script>

<template>
    <Head title="Pelanggan - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <!-- Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">Pelanggan</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Daftarkan pelanggan, khususnya reseller agar mendapat potongan harga otomatis di kasir.
                </p>
            </div>

            <button
                class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500"
                @click="openTambah"
            >
                <Plus class="h-4 w-4" />
                Tambah Pelanggan
            </button>
        </div>

        <!-- Stats -->
        <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                <div class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">
                    <Contact class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Pelanggan</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_pelanggan }} orang</h3>
                </div>
            </div>
            <div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                <div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                    <BadgePercent class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Reseller</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_reseller }} reseller</h3>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border">
            <div class="flex flex-col gap-3 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border">
                <div class="relative max-w-md flex-1">
                    <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari nama / nomor telepon..."
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
                <div class="flex gap-1.5">
                    <button
                        v-for="opt in ([{ v: '', l: 'Semua' }, { v: 'reseller', l: 'Reseller' }, { v: 'umum', l: 'Umum' }] as const)"
                        :key="opt.v"
                        type="button"
                        :class="[
                            'rounded-full border px-3 py-1 text-xs font-semibold transition',
                            filterTipe === opt.v
                                ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                : 'border-sidebar-border/70 bg-background text-muted-foreground hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800',
                        ]"
                        @click="filterTipe = opt.v"
                    >
                        {{ opt.l }}
                    </button>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20">
                            <th class="px-6 py-4 font-semibold text-muted-foreground">No</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Nama</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Telepon</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Tipe</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Transaksi</th>
                            <th class="px-6 py-4 text-right font-semibold text-muted-foreground">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        <tr v-if="props.pelanggans.data.length === 0">
                            <td colspan="6" class="px-6 py-12 text-center text-muted-foreground">
                                <Contact class="mx-auto mb-3 h-10 w-10 opacity-30" />
                                <p class="font-medium">Belum ada pelanggan terdaftar.</p>
                            </td>
                        </tr>
                        <tr
                            v-for="(pelanggan, index) in props.pelanggans.data"
                            :key="pelanggan.id_pelanggan"
                            class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"
                        >
                            <td class="px-6 py-4 text-muted-foreground">{{ (props.pelanggans.from ?? 0) + index }}</td>
                            <td class="px-6 py-4 font-medium">{{ pelanggan.nama }}</td>
                            <td class="px-6 py-4 text-muted-foreground">
                                <span v-if="pelanggan.telp" class="inline-flex items-center gap-1">
                                    <Phone class="h-3.5 w-3.5" /> {{ pelanggan.telp }}
                                </span>
                                <span v-else>-</span>
                            </td>
                            <td class="px-6 py-4">
                                <span :class="['inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', tipeBadge[pelanggan.tipe].class]">
                                    {{ tipeBadge[pelanggan.tipe].label }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">{{ pelanggan.transaksis_count }}x</td>
                            <td class="px-6 py-4 text-right">
                                <div class="inline-flex justify-end gap-2">
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
                                        aria-label="Edit"
                                        @click="openEdit(pelanggan)"
                                    >
                                        <Edit class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                                        aria-label="Hapus"
                                        @click="hapus(pelanggan)"
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
                :current-page="props.pelanggans.current_page"
                :total-pages="props.pelanggans.last_page"
                :total-items="props.pelanggans.total"
                :start-index="props.pelanggans.from ?? 0"
                :end-index="props.pelanggans.to ?? 0"
                :per-page="props.pelanggans.per_page"
                :visible-pages="visiblePages"
                @update:current-page="goToPage"
                @update:per-page="changePerPage"
            />
        </div>
    </div>

    <!-- Modal Tambah / Edit -->
    <BodyTeleport>
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            @click.self="closeModal"
        >
            <div class="w-full max-w-md rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border">
                <div class="mb-5 flex items-center justify-between">
                    <h2 class="text-lg font-bold">{{ editing ? 'Edit Pelanggan' : 'Tambah Pelanggan' }}</h2>
                    <button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800" @click="closeModal" aria-label="Tutup">
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <form class="flex flex-col gap-4" @submit.prevent="submitForm">
                    <div>
                        <label class="mb-1.5 block text-sm font-medium" for="pel-nama">Nama</label>
                        <input
                            id="pel-nama"
                            v-model="form.nama"
                            type="text"
                            placeholder="Nama pelanggan"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            :class="{ 'border-rose-500': form.errors.nama }"
                        />
                        <p v-if="form.errors.nama" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                            <AlertCircle class="h-3 w-3" />{{ form.errors.nama }}
                        </p>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium" for="pel-telp">Telepon (opsional)</label>
                        <input
                            id="pel-telp"
                            v-model="form.telp"
                            type="text"
                            inputmode="tel"
                            placeholder="08xxxxxxxxxx"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            :class="{ 'border-rose-500': form.errors.telp }"
                        />
                        <p v-if="form.errors.telp" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                            <AlertCircle class="h-3 w-3" />{{ form.errors.telp }}
                        </p>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium">Tipe Pelanggan</label>
                        <div class="grid grid-cols-2 gap-2">
                            <button
                                v-for="opt in (['umum', 'reseller'] as TipePelanggan[])"
                                :key="opt"
                                type="button"
                                :class="[
                                    'rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition',
                                    form.tipe === opt
                                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                        : 'border-sidebar-border/70 bg-background text-muted-foreground hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800',
                                ]"
                                @click="form.tipe = opt"
                            >
                                {{ opt }}
                            </button>
                        </div>
                        <p class="mt-1 text-xs text-muted-foreground">
                            Reseller mendapat potongan harga per produk (diatur di Data Produk) saat dipilih di kasir.
                        </p>
                    </div>

                    <div class="flex justify-end gap-3 pt-2">
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
                            {{ editing ? 'Simpan Perubahan' : 'Tambah Pelanggan' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </BodyTeleport>
</template>
