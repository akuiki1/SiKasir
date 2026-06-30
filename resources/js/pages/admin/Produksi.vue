<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import {
    Plus,
    Search,
    Trash2,
    Factory,
    Boxes,
    Wallet,
    X,
    Save,
    PlusCircle,
    Check,
    PencilLine,
    PackageSearch,
    Warehouse,
} from 'lucide-vue-next';
import { ref, computed, nextTick, watch, onMounted } from 'vue';
import BodyTeleport from '@/components/BodyTeleport.vue';
import PagePurpose from '@/components/PagePurpose.vue';
import Pagination from '@/components/Pagination.vue';
import { store as produksiStore, destroy as produksiDestroy } from '@/routes/admin/produksi';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Produksi',
                href: '/admin/produksi',
            },
        ],
    },
});

interface Biaya {
    nama: string;
    nominal: number;
}

interface Produksi {
    id_produksi: number;
    id_produk: number;
    produk_nama: string;
    jumlah: number;
    total_biaya: number;
    modal_per_unit: number;
    catatan: string | null;
    tanggal: string;
    biayas: Biaya[];
}

interface ProdukOption {
    id_produk: number;
    nama: string;
    stok: number;
    harga_modal: number;
}

interface Stats {
    total_batch: number;
    total_unit: number;
    total_biaya: number;
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
    produksis: Paginator<Produksi>;
    produks: ProdukOption[];
    stats: Stats;
    filters: Filters;
}>();

const rupiah = (value: number): string => 'Rp ' + (value ?? 0).toLocaleString('id-ID');

// Tampilkan stok tanpa desimal berlebih (30, 12.5).
const formatStok = (stok: number): string =>
    Number.isInteger(stok) ? stok.toLocaleString('id-ID') : stok.toLocaleString('id-ID', { maximumFractionDigits: 3 });

/* ----------------------------------------------------------------------------
 | Daftar batch produksi (pencarian + paginasi)
 ---------------------------------------------------------------------------- */
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
    router.get('/admin/produksi', buildParams(overrides), {
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
    const total = props.produksis.last_page;
    const current = props.produksis.current_page;

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

/* ----------------------------------------------------------------------------
 | Modal catat produksi
 ---------------------------------------------------------------------------- */
const showModal = ref(false);

type ProduksiMode = 'sederhana' | 'rinci';

const form = useForm<{
    id_produk: number | '';
    jumlah: number;
    catatan: string;
    mode: ProduksiMode;
    total_biaya: number;
    biayas: Biaya[];
}>({
    id_produk: '',
    jumlah: 0,
    catatan: '',
    mode: 'sederhana',
    total_biaya: 0,
    biayas: [{ nama: '', nominal: 0 }],
});

const totalBiaya = computed(() =>
    form.mode === 'sederhana'
        ? Number(form.total_biaya) || 0
        : form.biayas.reduce((sum, b) => sum + (Number(b.nominal) || 0), 0),
);
const modalPerUnit = computed(() => (form.jumlah > 0 ? Math.round(totalBiaya.value / form.jumlah) : 0));

const selectedProduk = computed(() => props.produks.find((p) => p.id_produk === form.id_produk) ?? null);

/* ----------------------------------------------------------------------------
 | Pemilih produk dengan pencarian
 ---------------------------------------------------------------------------- */
const produkSearch = ref('');
const produkSearchInput = ref<HTMLInputElement | null>(null);

const produkQuery = computed(() => produkSearch.value.trim().toLowerCase());

// Daftar hanya muncul setelah admin mengetik — sebelum itu kosong agar form bersih.
const filteredProdukOptions = computed(() => {
    if (!produkQuery.value) {
        return [];
    }

    return props.produks.filter((p) => p.nama.toLowerCase().includes(produkQuery.value));
});

function pilihProduk(p: ProdukOption): void {
    form.id_produk = p.id_produk;
    form.clearErrors('id_produk');
}

function gantiProduk(): void {
    form.id_produk = '';
    produkSearch.value = '';
    nextTick(() => produkSearchInput.value?.focus());
}

function addBiaya(): void {
    form.biayas.push({ nama: '', nominal: 0 });
}

function removeBiaya(index: number): void {
    if (form.biayas.length > 1) {
        form.biayas.splice(index, 1);
    }
}

function openTambah(): void {
    form.reset();
    form.mode = 'sederhana';
    form.total_biaya = 0;
    form.biayas = [{ nama: '', nominal: 0 }];
    form.clearErrors();
    produkSearch.value = '';
    showModal.value = true;
    nextTick(() => produkSearchInput.value?.focus());
}

// Deep-link dari hub "Catat" / modal "produk berhasil dibuat":
// /admin/produksi?aksi=tambah[&produk=ID] membuka form batch & (opsional) memilih produk.
onMounted(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('aksi') !== 'tambah') {
        return;
    }

    openTambah();

    const produkId = Number(params.get('produk'));

    if (produkId && props.produks.some((p) => p.id_produk === produkId)) {
        form.id_produk = produkId;
        form.clearErrors('id_produk');
    }
});

function closeModal(): void {
    showModal.value = false;
    produkSearch.value = '';
    form.reset();
    form.clearErrors();
}

function submitForm(): void {
    form
        .transform((data) => {
            const base = {
                id_produk: data.id_produk,
                jumlah: data.jumlah,
                catatan: data.catatan,
                mode: data.mode,
            };

            // Kirim hanya field yang relevan dengan mode terpilih.
            return data.mode === 'sederhana'
                ? { ...base, total_biaya: data.total_biaya }
                : { ...base, biayas: data.biayas };
        })
        .post(produksiStore().url, {
            onSuccess: () => closeModal(),
        });
}

function hapusProduksi(item: Produksi): void {
    if (
        confirm(
            `Hapus batch produksi "${item.produk_nama}" (${item.jumlah} unit)? Stok barang jadi akan dikurangi kembali.`,
        )
    ) {
        router.delete(produksiDestroy(item.id_produksi).url);
    }
}
</script>

<template>
    <Head title="Produksi - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-extrabold tracking-tight sm:text-3xl">Produksi</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Catat batch produksi barang buatan sendiri. Modal per unit dihitung dari total biaya dibagi jumlah hasil.
                </p>
            </div>

            <button
                id="btn-tambah-produksi"
                class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500"
                @click="openTambah"
            >
                <Plus class="h-4 w-4" />
                Catat Produksi
            </button>
        </div>

        <PagePurpose
            :icon="Factory"
            tone="emerald"
            title="Untuk barang yang dibuat sendiri"
            description="Catat batch produksi beserta biaya bahannya. Stok barang jadi bertambah & modal per unit (HPP) dihitung otomatis."
            :links="[
                { label: 'Barang beli? Stok', href: '/admin/stok', icon: Warehouse },
                { label: 'Biaya operasional? Pengeluaran', href: '/admin/pengeluarans', icon: Wallet },
            ]"
        />

        <div class="grid gap-4 md:grid-cols-3">
            <div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-4 shadow-sm sm:p-6 dark:border-sidebar-border">
                <div class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">
                    <Factory class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Batch</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_batch }} batch</h3>
                </div>
            </div>
            <div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-4 shadow-sm sm:p-6 dark:border-sidebar-border">
                <div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                    <Boxes class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Unit Diproduksi</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_unit.toLocaleString('id-ID') }} unit</h3>
                </div>
            </div>
            <div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-4 shadow-sm sm:p-6 dark:border-sidebar-border">
                <div class="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
                    <Wallet class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Biaya Produksi</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ rupiah(stats.total_biaya) }}</h3>
                </div>
            </div>
        </div>

        <div class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border">
            <div class="border-b border-sidebar-border/70 p-4 dark:border-sidebar-border">
                <div class="relative max-w-md">
                    <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari batch berdasarkan nama produk..."
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
            </div>

            <!-- Empty state -->
            <div v-if="props.produksis.data.length === 0" class="px-6 py-12 text-center text-muted-foreground">
                <Factory class="mx-auto mb-3 h-10 w-10 opacity-30" />
                <p class="font-medium">Belum ada batch produksi.</p>
            </div>

            <!-- Mobile: daftar kartu -->
            <div v-else class="divide-y divide-sidebar-border/70 md:hidden dark:divide-sidebar-border">
                <div v-for="item in props.produksis.data" :key="item.id_produksi" class="p-4">
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <p class="truncate font-semibold">{{ item.produk_nama }}</p>
                            <p class="mt-0.5 text-xs text-muted-foreground">{{ item.tanggal }}</p>
                        </div>
                        <button
                            class="-mr-1 -mt-1 shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                            aria-label="Hapus"
                            @click="hapusProduksi(item)"
                        >
                            <Trash2 class="h-4 w-4" />
                        </button>
                    </div>
                    <div class="mt-3 grid grid-cols-3 gap-2">
                        <div>
                            <span class="block text-[11px] font-medium text-muted-foreground">Hasil</span>
                            <span class="text-sm font-semibold">{{ formatStok(item.jumlah) }} unit</span>
                        </div>
                        <div>
                            <span class="block text-[11px] font-medium text-muted-foreground">Total Biaya</span>
                            <span class="text-sm font-semibold">{{ rupiah(item.total_biaya) }}</span>
                        </div>
                        <div>
                            <span class="block text-[11px] font-medium text-muted-foreground">Modal / Unit</span>
                            <span class="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{{ rupiah(item.modal_per_unit) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Desktop: tabel -->
            <div v-if="props.produksis.data.length > 0" class="hidden overflow-x-auto md:block">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20">
                            <th class="px-6 py-4 font-semibold text-muted-foreground">No</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Produk</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Jumlah Hasil</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Total Biaya</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Modal / Unit</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Tanggal</th>
                            <th class="px-6 py-4 text-right font-semibold text-muted-foreground">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        <tr
                            v-for="(item, index) in props.produksis.data"
                            :key="item.id_produksi"
                            class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"
                        >
                            <td class="px-6 py-4 text-muted-foreground">{{ (props.produksis.from ?? 0) + index }}</td>
                            <td class="px-6 py-4 font-medium">{{ item.produk_nama }}</td>
                            <td class="px-6 py-4">{{ formatStok(item.jumlah) }} unit</td>
                            <td class="px-6 py-4">{{ rupiah(item.total_biaya) }}</td>
                            <td class="px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400">{{ rupiah(item.modal_per_unit) }}</td>
                            <td class="px-6 py-4">{{ item.tanggal }}</td>
                            <td class="px-6 py-4 text-right">
                                <button
                                    class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                                    aria-label="Hapus"
                                    @click="hapusProduksi(item)"
                                >
                                    <Trash2 class="h-4 w-4" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Pagination
                :current-page="props.produksis.current_page"
                :total-pages="props.produksis.last_page"
                :total-items="props.produksis.total"
                :start-index="props.produksis.from ?? 0"
                :end-index="props.produksis.to ?? 0"
                :per-page="props.produksis.per_page"
                :visible-pages="visiblePages"
                @update:current-page="goToPage"
                @update:per-page="changePerPage"
            />
        </div>
    </div>

    <BodyTeleport>
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
            @click.self="closeModal"
        >
            <div class="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-sidebar-border/70 bg-card shadow-2xl sm:rounded-3xl dark:border-sidebar-border">
                <!-- Header -->
                <div class="flex items-start justify-between gap-4 border-b border-sidebar-border/70 p-5 sm:p-6 dark:border-sidebar-border">
                    <div>
                        <h2 class="text-lg font-semibold sm:text-xl">Catat Batch Produksi</h2>
                        <p class="mt-1 text-sm text-muted-foreground">
                            Pilih produk, isi jumlah hasil & biaya — modal per unit dihitung otomatis.
                        </p>
                    </div>
                    <button
                        class="-mr-1 -mt-1 shrink-0 rounded-full p-2 text-muted-foreground transition hover:bg-slate-100 dark:hover:bg-zinc-800"
                        @click="closeModal" aria-label="Tutup">
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <!-- Body (scrollable) -->
                <div class="flex flex-col gap-5 overflow-y-auto p-5 sm:p-6">
                    <div v-if="produks.length === 0" class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
                        Belum ada produk berjenis <strong>produksi</strong>. Buat dulu produk dengan jenis "Buatan Sendiri" di menu Data Produk.
                    </div>

                    <!-- 1. Pemilih produk dengan pencarian -->
                    <div>
                        <label class="mb-2 block text-sm font-medium">Produk (Buatan Sendiri)</label>

                        <!-- Sudah dipilih -->
                        <div
                            v-if="selectedProduk"
                            class="flex items-center justify-between gap-3 rounded-xl border border-indigo-500/40 bg-indigo-500/5 p-3"
                        >
                            <div class="flex min-w-0 items-center gap-3">
                                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                                    <Check class="h-5 w-5" />
                                </div>
                                <div class="min-w-0">
                                    <p class="truncate font-semibold">{{ selectedProduk.nama }}</p>
                                    <p class="text-xs text-muted-foreground">
                                        Stok {{ formatStok(selectedProduk.stok) }} · Modal kini {{ rupiah(selectedProduk.harga_modal) }}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800"
                                @click="gantiProduk"
                            >
                                <PencilLine class="h-3.5 w-3.5" />
                                Ganti
                            </button>
                        </div>

                        <!-- Pencarian + daftar -->
                        <div v-else-if="produks.length > 0">
                            <div class="relative">
                                <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    ref="produkSearchInput"
                                    v-model="produkSearch"
                                    type="text"
                                    placeholder="Ketik nama produk untuk mencari..."
                                    class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                />
                            </div>
                            <!-- Hint sebelum mengetik: daftar disembunyikan agar form bersih -->
                            <p v-if="!produkQuery" class="mt-2 px-1 text-xs text-muted-foreground">
                                Mulai ketik nama produk untuk menampilkan daftarnya.
                            </p>

                            <!-- Tidak ada hasil -->
                            <div
                                v-else-if="filteredProdukOptions.length === 0"
                                class="mt-2 flex flex-col items-center gap-2 rounded-xl border border-dashed border-sidebar-border/70 px-4 py-6 text-center text-sm text-muted-foreground dark:border-sidebar-border"
                            >
                                <PackageSearch class="h-7 w-7 opacity-30" />
                                Produk "<strong>{{ produkSearch }}</strong>" tidak ditemukan.
                            </div>

                            <!-- Hasil pencarian -->
                            <div v-else class="mt-2 max-h-56 space-y-1 overflow-y-auto pr-1">
                                <button
                                    v-for="p in filteredProdukOptions"
                                    :key="p.id_produk"
                                    type="button"
                                    class="flex w-full items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5"
                                    @click="pilihProduk(p)"
                                >
                                    <span class="min-w-0 truncate text-sm font-medium">{{ p.nama }}</span>
                                    <span class="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                                        Stok {{ formatStok(p.stok) }}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <p v-if="form.errors.id_produk" class="mt-2 text-sm text-rose-600">{{ form.errors.id_produk }}</p>
                    </div>

                    <!-- 2. Jumlah hasil -->
                    <div>
                        <label class="mb-2 block text-sm font-medium">Jumlah Hasil (unit)</label>
                        <input
                            v-model.number="form.jumlah"
                            type="number"
                            min="1"
                            inputmode="numeric"
                            placeholder="0"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                        />
                        <p v-if="form.errors.jumlah" class="mt-2 text-sm text-rose-600">{{ form.errors.jumlah }}</p>
                    </div>

                    <!-- 3. Biaya: pilih mode -->
                    <div>
                        <div class="mb-2 flex items-center justify-between gap-2">
                            <label class="text-sm font-medium">Biaya Produksi</label>
                            <div class="inline-flex gap-1 rounded-lg border border-sidebar-border/70 bg-background p-1 dark:border-sidebar-border">
                                <button
                                    type="button"
                                    :class="[
                                        'rounded-md px-3 py-1 text-xs font-semibold transition',
                                        form.mode === 'sederhana'
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800',
                                    ]"
                                    @click="form.mode = 'sederhana'"
                                >
                                    Total
                                </button>
                                <button
                                    type="button"
                                    :class="[
                                        'rounded-md px-3 py-1 text-xs font-semibold transition',
                                        form.mode === 'rinci'
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800',
                                    ]"
                                    @click="form.mode = 'rinci'"
                                >
                                    Rincian
                                </button>
                            </div>
                        </div>

                        <!-- Mode sederhana: total biaya satu angka -->
                        <div v-if="form.mode === 'sederhana'">
                            <div class="relative">
                                <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</span>
                                <input
                                    v-model.number="form.total_biaya"
                                    type="number"
                                    min="0"
                                    inputmode="numeric"
                                    placeholder="Total uang yang keluar untuk batch ini"
                                    class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                />
                            </div>
                            <p class="mt-1.5 text-xs text-muted-foreground">Cukup isi total biaya — modal per unit dihitung otomatis.</p>
                            <p v-if="form.errors.total_biaya" class="mt-2 text-sm text-rose-600">{{ form.errors.total_biaya }}</p>
                        </div>

                        <!-- Mode rinci: daftar biaya bahan -->
                        <div v-else>
                            <div class="space-y-2">
                                <div v-for="(biaya, index) in form.biayas" :key="index" class="flex items-center gap-2">
                                    <input
                                        v-model="biaya.nama"
                                        type="text"
                                        placeholder="Nama bahan, mis. bawang ~2kg"
                                        class="min-w-0 flex-1 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                    />
                                    <div class="relative w-28 shrink-0 sm:w-36">
                                        <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</span>
                                        <input
                                            v-model.number="biaya.nominal"
                                            type="number"
                                            min="0"
                                            inputmode="numeric"
                                            placeholder="0"
                                            class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-9 pr-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        class="shrink-0 rounded-lg p-2 text-muted-foreground transition hover:bg-slate-100 hover:text-rose-600 disabled:opacity-30 dark:hover:bg-zinc-800"
                                        :disabled="form.biayas.length <= 1"
                                        @click="removeBiaya(index)"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <button
                                type="button"
                                class="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                @click="addBiaya"
                            >
                                <PlusCircle class="h-4 w-4" />
                                Tambah baris bahan
                            </button>
                            <p class="mt-1.5 text-xs text-muted-foreground">Rinci biaya bahan yang <em>terpakai</em> (bukan total pembelian).</p>
                            <p v-if="form.errors.biayas" class="mt-2 text-sm text-rose-600">{{ form.errors.biayas }}</p>
                            <p v-if="form.errors.total_biaya" class="mt-2 text-sm text-rose-600">{{ form.errors.total_biaya }}</p>
                        </div>
                    </div>

                    <!-- 4. Catatan -->
                    <div>
                        <label class="mb-2 block text-sm font-medium">Catatan (opsional)</label>
                        <textarea
                            v-model="form.catatan"
                            rows="2"
                            placeholder="Mis. tanggal masak atau kode batch."
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                        ></textarea>
                    </div>

                    <!-- Preview perhitungan -->
                    <div class="grid grid-cols-3 gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                        <div>
                            <span class="text-xs font-medium text-muted-foreground">Total Biaya</span>
                            <p class="mt-0.5 text-sm font-bold sm:text-lg">{{ rupiah(totalBiaya) }}</p>
                        </div>
                        <div>
                            <span class="text-xs font-medium text-muted-foreground">Jumlah Hasil</span>
                            <p class="mt-0.5 text-sm font-bold sm:text-lg">{{ formatStok(form.jumlah || 0) }} unit</p>
                        </div>
                        <div>
                            <span class="text-xs font-medium text-muted-foreground">Modal / Unit</span>
                            <p class="mt-0.5 text-sm font-bold text-indigo-600 sm:text-lg dark:text-indigo-400">{{ rupiah(modalPerUnit) }}</p>
                        </div>
                    </div>
                    <p v-if="selectedProduk" class="-mt-2 text-xs text-muted-foreground">
                        Modal produk akan diperbarui dari <strong>{{ rupiah(selectedProduk.harga_modal) }}</strong> ke {{ rupiah(modalPerUnit) }} setelah disimpan.
                    </p>
                </div>

                <!-- Footer (sticky) -->
                <div class="flex flex-col gap-3 border-t border-sidebar-border/70 p-5 sm:flex-row sm:justify-end sm:p-6 dark:border-sidebar-border">
                    <button
                        class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800"
                        type="button"
                        @click="closeModal"
                    >
                        Batal
                    </button>
                    <button
                        class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                        type="button"
                        :disabled="form.processing || produks.length === 0"
                        @click="submitForm"
                    >
                        <Save class="h-4 w-4" />
                        Simpan Produksi
                    </button>
                </div>
            </div>
        </div>
    </BodyTeleport>
</template>
