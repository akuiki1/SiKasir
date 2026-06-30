<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import {
    Plus,
    Search,
    Tag,
    Percent,
    Edit,
    Trash2,
    X,
    Save,
    AlertCircle,
    ShoppingBag,
    CheckCircle2,
    XCircle,
    Wallet,
    TrendingUp,
    TrendingDown,
    Info,
    Check,
    PencilLine,
    PackageSearch,
    Boxes,
} from 'lucide-vue-next';
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import BodyTeleport from '@/components/BodyTeleport.vue';
import Pagination from '@/components/Pagination.vue';
import { formatRupiah } from '@/lib/format';
import { store as promoStore, update as promoUpdate, destroy as promoDestroy } from '@/routes/admin/promos';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Data Promo',
                href: '/admin/promos',
            },
        ],
    },
});

interface Produk {
    id_produk: number;
    nama: string;
    jenis: string;
    tipe_jual: string;
    harga_jual: number;
    harga_modal: number;
}

interface Promo {
    id_promo: number;
    nama: string;
    deskripsi: string | null;
    // 'persen' hanya untuk promo lama (tak bisa dibuat baru); 'bundling' = beli X gratis Y.
    tipe: 'persen' | 'nominal' | 'bundling';
    nilai: number;
    beli_qty: number | null;
    gratis_qty: number | null;
    id_produk: number | null;
    produk_nama: string;
    minimal_belanja: number | null;
    tanggal_mulai: string;
    tanggal_selesai: string;
    aktif: boolean;
}

interface Stats {
    total_promo: number;
    total_aktif: number;
    total_non_aktif: number;
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
    status: string;
    per_page: number;
}

const props = defineProps<{
    promos: Paginator<Promo>;
    produks: Produk[];
    stats: Stats;
    filters: Filters;
}>();

// Search & filter dikirim ke server (search di-debounce).
const searchQuery = ref(props.filters.search ?? '');
const filterStatus = ref(props.filters.status ?? '');

let searchTimer: ReturnType<typeof setTimeout> | undefined;
watch(searchQuery, (value) => {
    if (searchTimer) {
        clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(() => reload({ search: value, page: 1 }), 350);
});

watch(filterStatus, (value) => reload({ status: value, page: 1 }));

type QueryValue = string | number;

function buildParams(overrides: Record<string, QueryValue> = {}): Record<string, QueryValue> {
    const params: Record<string, QueryValue | undefined> = {
        search: searchQuery.value || undefined,
        status: filterStatus.value || undefined,
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
    router.get('/admin/promos', buildParams(overrides), {
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
    const total = props.promos.last_page;
    const current = props.promos.current_page;

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

// Format date for display
function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Modal
const showModal = ref(false);
const editingPromo = ref<Promo | null>(null);

const form = useForm({
    nama: '',
    deskripsi: '',
    tipe: 'nominal' as 'persen' | 'nominal' | 'bundling',
    nilai: '',
    beli_qty: '',
    gratis_qty: '',
    id_produk: '',
    minimal_belanja: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    aktif: true,
});

// Produk spesifik yang sedang dipilih (untuk preview modal & laba di form).
const selectedProduk = computed<Produk | null>(() => {
    if (!form.id_produk) {
        return null;
    }

    return props.produks.find((p) => String(p.id_produk) === String(form.id_produk)) ?? null;
});

/* ----------------------------------------------------------------------------
 | Pemilih produk dengan pencarian
 | Catatan: id_produk kosong = promo berlaku untuk "Semua Produk" (pilihan
 | valid), jadi `pickingProduk` dipakai untuk membedakan "sedang memilih"
 | dari "sudah memilih Semua Produk".
 ---------------------------------------------------------------------------- */
const pickingProduk = ref(false);
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

function pilihProduk(p: Produk): void {
    form.id_produk = String(p.id_produk);
    pickingProduk.value = false;
    form.clearErrors('id_produk');
}

function pilihSemuaProduk(): void {
    form.id_produk = '';
    pickingProduk.value = false;
    form.clearErrors('id_produk');
}

function gantiProduk(): void {
    pickingProduk.value = true;
    produkSearch.value = '';
    nextTick(() => produkSearchInput.value?.focus());
}

// Hitung dampak promo ke laba per unit secara live, agar admin tahu apakah
// promo masih untung sebelum disimpan. Untuk produk produksi, harga_modal =
// modal bahan per unit dari batch terakhir (biaya gas/listrik/tenaga belum
// termasuk), jadi peringatan "margin tipis" jadi penanda penting.
const promoPreview = computed(() => {
    const produk = selectedProduk.value;

    if (!produk) {
        return null;
    }

    const hargaJual = Number(produk.harga_jual) || 0;
    const modal = Number(produk.harga_modal) || 0;
    const nilai = Number(form.nilai) || 0;

    // Bundling: harga efektif rata-rata per unit dalam 1 paket (beli + gratis).
    const isBundling = form.tipe === 'bundling';
    const beli = Number(form.beli_qty) || 0;
    const gratis = Number(form.gratis_qty) || 0;
    const grup = beli + gratis;
    const diskonPersen = grup > 0 ? (gratis / grup) * 100 : 0;

    let hargaSetelah: number;

    if (isBundling) {
        hargaSetelah = grup > 0 ? Math.round((hargaJual * beli) / grup) : hargaJual;
    } else if (form.tipe === 'persen') {
        hargaSetelah = Math.max(0, Math.round(hargaJual * (1 - nilai / 100)));
    } else {
        hargaSetelah = Math.max(0, Math.round(hargaJual - nilai));
    }

    const labaSetelah = hargaSetelah - modal;
    const marginSetelah = hargaSetelah > 0 ? (labaSetelah / hargaSetelah) * 100 : -100;

    let kind: 'jasa' | 'no-modal' | 'ok';
    let status: 'rugi' | 'tipis' | 'aman' | 'none' = 'none';

    if (produk.tipe_jual === 'jasa') {
        kind = 'jasa';
    } else if (modal <= 0) {
        kind = 'no-modal';
    } else {
        kind = 'ok';

        if (labaSetelah < 0) {
            status = 'rugi';
        } else if (marginSetelah < 15) {
            status = 'tipis';
        } else {
            status = 'aman';
        }
    }

    return {
        kind,
        jenis: produk.jenis,
        hargaJual,
        modal,
        hargaSetelah,
        labaSetelah,
        marginSetelah,
        status,
        isBundling,
        beli,
        gratis,
        grup,
        diskonPersen,
    };
});

function openTambah() {
    editingPromo.value = null;
    form.reset();
    pickingProduk.value = false;
    produkSearch.value = '';
    form.aktif = true;
    form.tipe = 'nominal';
    // set default dates to now and next week
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    form.tanggal_mulai = now.toISOString().slice(0, 16);
    form.tanggal_selesai = nextWeek.toISOString().slice(0, 16);
    showModal.value = true;
}

function openEdit(promo: Promo) {
    editingPromo.value = promo;
    pickingProduk.value = false;
    produkSearch.value = '';
    form.nama = promo.nama;
    form.deskripsi = promo.deskripsi || '';
    form.tipe = promo.tipe;
    form.nilai = String(promo.nilai);
    form.beli_qty = promo.beli_qty != null ? String(promo.beli_qty) : '';
    form.gratis_qty = promo.gratis_qty != null ? String(promo.gratis_qty) : '';
    form.id_produk = promo.id_produk ? String(promo.id_produk) : '';
    form.minimal_belanja = promo.minimal_belanja ? String(promo.minimal_belanja) : '';
    form.tanggal_mulai = promo.tanggal_mulai.replace(' ', 'T').slice(0, 16);
    form.tanggal_selesai = promo.tanggal_selesai.replace(' ', 'T').slice(0, 16);
    form.aktif = promo.aktif;
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
    pickingProduk.value = false;
    produkSearch.value = '';
    form.reset();
    form.clearErrors();
}

function submitForm() {
    const isBundling = form.tipe === 'bundling';

    const data = {
        ...form.data(),
        // Bundling tak memakai nilai rupiah (diisi 0); nominal memakai nilai.
        nilai: isBundling ? 0 : Number(form.nilai),
        beli_qty: isBundling ? Number(form.beli_qty) : null,
        gratis_qty: isBundling ? Number(form.gratis_qty) : null,
        id_produk: form.id_produk ? Number(form.id_produk) : null,
        minimal_belanja: form.minimal_belanja ? Number(form.minimal_belanja) : null,
        aktif: Boolean(form.aktif),
    };

    if (editingPromo.value) {
        router.put(promoUpdate(editingPromo.value.id_promo).url, data, {
            onSuccess: () => closeModal(),
        });
    } else {
        router.post(promoStore().url, data, {
            onSuccess: () => closeModal(),
        });
    }
}

function hapusPromo(promo: Promo) {
    if (confirm(`Hapus promo "${promo.nama}"? Tindakan ini tidak dapat dibatalkan.`)) {
        router.delete(promoDestroy(promo.id_promo).url);
    }
}

// Prefill dari dashboard "Buat Promo" (?produk=ID): buka modal tambah & pilih produk.
onMounted(() => {
    const produkId = new URLSearchParams(window.location.search).get('produk');

    if (!produkId) {
        return;
    }

    const produk = props.produks.find((p) => String(p.id_produk) === produkId);

    if (!produk) {
        return;
    }

    openTambah();
    form.id_produk = produkId;
    form.nama = `Promo ${produk.nama}`;
});
</script>

<template>
    <Head title="Manajemen Promo - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <!-- Header Section -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">Manajemen Promo</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Kelola program diskon, potongan harga produk, minimal belanja, dan masa aktif promo toko Anda.
                </p>
            </div>

            <button
                id="btn-tambah-promo"
                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                @click="openTambah"
            >
                <Plus class="h-4 w-4" />
                Tambah Promo Baru
            </button>
        </div>

        <!-- Stats Row -->
        <div class="grid gap-4 md:grid-cols-3">
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400"
                >
                    <Tag class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Promo</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_promo }} Program</h3>
                </div>
            </div>
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400"
                >
                    <CheckCircle2 class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Promo Aktif</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_aktif }} Aktif</h3>
                </div>
            </div>
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400"
                >
                    <XCircle class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Non-Aktif</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_non_aktif }} Non-Aktif</h3>
                </div>
            </div>
        </div>

        <!-- Filters & Table Section -->
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
                        placeholder="Cari promo berdasarkan nama..."
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>

                <div class="flex gap-2">
                    <select
                        v-model="filterStatus"
                        class="rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"
                    >
                        <option value="">Semua Status</option>
                        <option value="aktif">Aktif</option>
                        <option value="non-aktif">Non-Aktif</option>
                    </select>
                </div>
            </div>

            <!-- Responsive Table -->
            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr
                            class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"
                        >
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Promo</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Potongan</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Berlaku Untuk</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Min. Belanja</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Masa Berlaku</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                            <th class="px-6 py-4 text-right font-semibold text-muted-foreground">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        <tr v-if="props.promos.data.length === 0">
                            <td
                                colspan="7"
                                class="px-6 py-12 text-center text-muted-foreground"
                            >
                                <Tag class="mx-auto mb-3 h-10 w-10 opacity-30" />
                                <p class="font-medium">
                                    {{
                                        searchQuery
                                            ? 'Tidak ada promo yang sesuai pencarian.'
                                            : 'Belum ada promo. Tambahkan promo pertama!'
                                    }}
                                </p>
                            </td>
                        </tr>
                        <tr
                            v-for="promo in props.promos.data"
                            :key="promo.id_promo"
                            class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"
                        >
                            <td class="px-6 py-4">
                                <div>
                                    <p class="font-semibold text-foreground">{{ promo.nama }}</p>
                                    <p class="text-xs text-muted-foreground max-w-xs truncate" :title="promo.deskripsi || ''">
                                        {{ promo.deskripsi ?? '-' }}
                                    </p>
                                </div>
                            </td>
                            <td class="px-6 py-4 font-bold text-foreground">
                                <span v-if="promo.tipe === 'persen'" class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                    <Percent class="h-4 w-4" /> {{ promo.nilai }}%
                                </span>
                                <span v-else-if="promo.tipe === 'bundling'" class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                    <Boxes class="h-4 w-4" /> Beli {{ promo.beli_qty }} Gratis {{ promo.gratis_qty }}
                                </span>
                                <span v-else class="text-indigo-600 dark:text-indigo-400">
                                    {{ formatRupiah(promo.nilai) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">
                                <span class="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-xs font-semibold">
                                    <ShoppingBag class="h-3 w-3" /> {{ promo.produk_nama }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">
                                {{ promo.minimal_belanja ? formatRupiah(promo.minimal_belanja) : 'Tanpa Minimal' }}
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-0.5 text-xs text-muted-foreground">
                                    <span class="flex items-center gap-1"><span class="font-medium text-emerald-600 dark:text-emerald-400">Mulai:</span> {{ formatDate(promo.tanggal_mulai) }}</span>
                                    <span class="flex items-center gap-1"><span class="font-medium text-rose-600 dark:text-rose-400">Selesai:</span> {{ formatDate(promo.tanggal_selesai) }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    :class="[
                                        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide',
                                        promo.aktif
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                    ]"
                                >
                                    {{ promo.aktif ? 'Aktif' : 'Non-Aktif' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="inline-flex justify-end gap-2">
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
                                        aria-label="Edit"
                                        @click="openEdit(promo)"
                                    >
                                        <Edit class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                                        aria-label="Hapus"
                                        @click="hapusPromo(promo)"
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
                :current-page="props.promos.current_page"
                :total-pages="props.promos.last_page"
                :total-items="props.promos.total"
                :start-index="props.promos.from ?? 0"
                :end-index="props.promos.to ?? 0"
                :per-page="props.promos.per_page"
                :visible-pages="visiblePages"
                @update:current-page="goToPage"
                @update:per-page="changePerPage"
            />
        </div>
    </div>

    <!-- Modal Tambah / Edit Promo -->
    <BodyTeleport>
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            @click.self="closeModal"
        >
            <div
                class="w-full max-w-lg rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border"
                style="max-height: 90vh; overflow-y: auto"
            >
                <div class="mb-5 flex items-center justify-between">
                    <h2 class="text-lg font-bold">
                        {{ editingPromo ? 'Edit Promo' : 'Tambah Promo Baru' }}
                    </h2>
                    <button
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                        @click="closeModal" aria-label="Tutup">
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <form class="flex flex-col gap-4" @submit.prevent="submitForm">
                    <!-- Nama Promo -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium" for="promo-nama">
                            Nama Promo
                        </label>
                        <input
                            id="promo-nama"
                            v-model="form.nama"
                            type="text"
                            placeholder="Contoh: Diskon Akhir Tahun"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            :class="{ 'border-rose-500': form.errors.nama }"
                        />
                        <p v-if="form.errors.nama" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                            <AlertCircle class="h-3 w-3" />{{ form.errors.nama }}
                        </p>
                    </div>

                    <!-- Deskripsi -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium" for="promo-deskripsi">
                            Deskripsi
                        </label>
                        <textarea
                            id="promo-deskripsi"
                            v-model="form.deskripsi"
                            placeholder="Penjelasan ringkas mengenai promo"
                            rows="2"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            :class="{ 'border-rose-500': form.errors.deskripsi }"
                        ></textarea>
                        <p v-if="form.errors.deskripsi" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                            <AlertCircle class="h-3 w-3" />{{ form.errors.deskripsi }}
                        </p>
                    </div>

                    <!-- Tipe & Nilai / Bundling -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium" for="promo-tipe">
                                Tipe Diskon
                            </label>
                            <select
                                id="promo-tipe"
                                v-model="form.tipe"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                :class="{ 'border-rose-500': form.errors.tipe }"
                            >
                                <!-- Persen hanya tampil untuk promo lama; tidak bisa dipilih untuk promo baru. -->
                                <option v-if="form.tipe === 'persen'" value="persen" disabled>
                                    Persentase (lama)
                                </option>
                                <option value="nominal">Nominal (Rp)</option>
                                <option value="bundling">Bundling (beli X gratis Y)</option>
                            </select>
                            <p v-if="form.tipe === 'persen'" class="mt-1 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                                <AlertCircle class="h-3 w-3" />Promo persen tidak lagi tersedia. Pilih Nominal atau Bundling untuk menyimpan.
                            </p>
                            <p v-else-if="form.errors.tipe" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                <AlertCircle class="h-3 w-3" />{{ form.errors.tipe }}
                            </p>
                        </div>

                        <!-- Nilai diskon (nominal / persen lama) -->
                        <div v-if="form.tipe !== 'bundling'">
                            <label class="mb-1.5 block text-sm font-medium" for="promo-nilai">
                                Nilai Diskon
                            </label>
                            <input
                                id="promo-nilai"
                                v-model="form.nilai"
                                type="number"
                                min="0"
                                :placeholder="form.tipe === 'persen' ? 'Contoh: 10' : 'Contoh: 15000'"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                :class="{ 'border-rose-500': form.errors.nilai }"
                            />
                            <p v-if="form.errors.nilai" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                <AlertCircle class="h-3 w-3" />{{ form.errors.nilai }}
                            </p>
                        </div>

                        <!-- Bundling: beli X gratis Y -->
                        <div v-else class="grid grid-cols-2 gap-2">
                            <div>
                                <label class="mb-1.5 block text-sm font-medium" for="promo-beli">
                                    Beli
                                </label>
                                <input
                                    id="promo-beli"
                                    v-model="form.beli_qty"
                                    type="number"
                                    min="1"
                                    placeholder="5"
                                    class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                    :class="{ 'border-rose-500': form.errors.beli_qty }"
                                />
                                <p v-if="form.errors.beli_qty" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                    <AlertCircle class="h-3 w-3" />{{ form.errors.beli_qty }}
                                </p>
                            </div>
                            <div>
                                <label class="mb-1.5 block text-sm font-medium" for="promo-gratis">
                                    Gratis
                                </label>
                                <input
                                    id="promo-gratis"
                                    v-model="form.gratis_qty"
                                    type="number"
                                    min="1"
                                    placeholder="1"
                                    class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                    :class="{ 'border-rose-500': form.errors.gratis_qty }"
                                />
                                <p v-if="form.errors.gratis_qty" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                    <AlertCircle class="h-3 w-3" />{{ form.errors.gratis_qty }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Catatan bundling: wajib produk spesifik -->
                    <div
                        v-if="form.tipe === 'bundling'"
                        class="flex items-start gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3.5 py-2.5 text-xs text-muted-foreground"
                    >
                        <Info class="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                        <span>
                            Promo bundling berlaku untuk <strong>satu produk tertentu</strong> (item
                            gratis adalah produk yang sama). Pilih produknya di bawah —
                            <strong>Semua Produk</strong> tidak berlaku untuk bundling.
                        </span>
                    </div>

                    <!-- Berlaku Untuk Produk: pemilih dengan pencarian -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium">
                            Berlaku Untuk Produk
                        </label>

                        <!-- Sudah dipilih (produk spesifik / Semua Produk) -->
                        <div
                            v-if="!pickingProduk"
                            class="flex items-center justify-between gap-3 rounded-xl border border-indigo-500/40 bg-indigo-500/5 p-3"
                        >
                            <div class="flex min-w-0 items-center gap-3">
                                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                                    <Boxes v-if="!selectedProduk" class="h-5 w-5" />
                                    <Check v-else class="h-5 w-5" />
                                </div>
                                <div class="min-w-0">
                                    <p class="truncate font-semibold">{{ selectedProduk ? selectedProduk.nama : 'Semua Produk' }}</p>
                                    <p class="text-xs text-muted-foreground">
                                        {{ selectedProduk ? `Harga jual ${formatRupiah(selectedProduk.harga_jual)}` : 'Promo berlaku untuk seluruh produk toko' }}
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
                        <div v-else>
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

                            <!-- Opsi cepat: Semua Produk (tidak berlaku untuk bundling) -->
                            <button
                                v-if="form.tipe !== 'bundling'"
                                type="button"
                                class="mt-2 flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5"
                                @click="pilihSemuaProduk"
                            >
                                <Boxes class="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span class="text-sm font-medium">Semua Produk</span>
                            </button>

                            <!-- Hint sebelum mengetik -->
                            <p v-if="!produkQuery" class="mt-2 px-1 text-xs text-muted-foreground">
                                Mulai ketik nama produk untuk menampilkan daftarnya, atau pilih "Semua Produk" di atas.
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
                                    v-for="prod in filteredProdukOptions"
                                    :key="prod.id_produk"
                                    type="button"
                                    class="flex w-full items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5"
                                    @click="pilihProduk(prod)"
                                >
                                    <span class="min-w-0 truncate text-sm font-medium">{{ prod.nama }}</span>
                                    <span class="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                                        {{ formatRupiah(prod.harga_jual) }}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <p v-if="form.errors.id_produk" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                            <AlertCircle class="h-3 w-3" />{{ form.errors.id_produk }}
                        </p>
                    </div>

                    <!-- Preview Modal & Laba per Unit (muncul saat produk spesifik dipilih) -->
                    <div
                        v-if="promoPreview"
                        class="rounded-lg border border-sidebar-border/70 bg-slate-50/50 p-4 text-sm dark:border-sidebar-border dark:bg-zinc-800/20"
                    >
                        <!-- Ringkasan bundling (beli X gratis Y) -->
                        <div
                            v-if="promoPreview.isBundling && promoPreview.grup > 0"
                            class="mb-3 flex items-start gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-700 dark:text-emerald-300"
                        >
                            <Boxes class="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                                Tiap beli <strong>{{ promoPreview.grup }}</strong>
                                ({{ promoPreview.beli }} + {{ promoPreview.gratis }} gratis),
                                pelanggan hanya membayar <strong>{{ promoPreview.beli }}</strong> —
                                setara diskon <strong>{{ promoPreview.diskonPersen.toFixed(0) }}%</strong>.
                                Angka di bawah memakai harga rata-rata per unit dalam paket.
                            </span>
                        </div>

                        <!-- Produk jasa: tak punya modal barang -->
                        <div
                            v-if="promoPreview.kind === 'jasa'"
                            class="flex items-start gap-2 text-muted-foreground"
                        >
                            <Info class="mt-0.5 h-4 w-4 shrink-0" />
                            <span>Produk jasa tidak memiliki modal barang. Promo dinilai dari fee, bukan margin produk.</span>
                        </div>

                        <!-- Modal belum tercatat -->
                        <div
                            v-else-if="promoPreview.kind === 'no-modal'"
                            class="flex items-start gap-2 text-amber-600 dark:text-amber-400"
                        >
                            <AlertCircle class="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                                Modal produk ini belum tercatat<template v-if="promoPreview.jenis === 'produksi'"> — catat batch produksi dulu</template>, jadi laba promo belum bisa dihitung.
                            </span>
                        </div>

                        <!-- Perhitungan laba lengkap -->
                        <div v-else class="flex flex-col gap-3">
                            <div class="flex items-center gap-2 font-semibold text-foreground">
                                <Wallet class="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                Dampak ke Laba per Unit
                            </div>

                            <div class="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                <span class="text-muted-foreground">Harga jual</span>
                                <span class="text-right font-medium">{{ formatRupiah(promoPreview.hargaJual) }}</span>

                                <span class="text-muted-foreground">
                                    {{ promoPreview.jenis === 'produksi' ? 'Modal bahan / unit' : 'Modal / unit' }}
                                </span>
                                <span class="text-right font-medium">{{ formatRupiah(promoPreview.modal) }}</span>

                                <span class="text-muted-foreground">Harga setelah promo</span>
                                <span class="text-right font-bold text-indigo-600 dark:text-indigo-400">{{ formatRupiah(promoPreview.hargaSetelah) }}</span>

                                <span class="text-muted-foreground">Laba / unit</span>
                                <span
                                    class="text-right font-bold"
                                    :class="promoPreview.labaSetelah < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'"
                                >
                                    {{ formatRupiah(promoPreview.labaSetelah) }}
                                    <span class="font-normal text-muted-foreground">({{ promoPreview.marginSetelah.toFixed(0) }}%)</span>
                                </span>
                            </div>

                            <!-- Status warna -->
                            <div
                                v-if="promoPreview.status === 'rugi'"
                                class="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-700 dark:text-rose-300"
                            >
                                <TrendingDown class="mt-0.5 h-4 w-4 shrink-0" />
                                <span><strong>Jual rugi!</strong> Harga setelah promo di bawah modal. Pakai hanya kalau memang sedang cuci gudang.</span>
                            </div>
                            <div
                                v-else-if="promoPreview.status === 'tipis'"
                                class="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-700 dark:text-amber-300"
                            >
                                <AlertCircle class="mt-0.5 h-4 w-4 shrink-0" />
                                <span>
                                    <strong>Margin tipis.</strong> Masih di atas modal<template v-if="promoPreview.jenis === 'produksi'"> bahan, tapi biaya gas, listrik &amp; tenaga belum termasuk</template>. Pastikan tetap untung.
                                </span>
                            </div>
                            <div
                                v-else
                                class="flex items-start gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-700 dark:text-emerald-300"
                            >
                                <TrendingUp class="mt-0.5 h-4 w-4 shrink-0" />
                                <span><strong>Margin aman.</strong> Promo ini masih memberi laba sehat.</span>
                            </div>
                        </div>
                    </div>

                    <!-- Minimal Belanja -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium" for="promo-min-belanja">
                            Minimal Belanja (Rp) <span class="text-xs text-muted-foreground">(Opsional)</span>
                        </label>
                        <input
                            id="promo-min-belanja"
                            v-model="form.minimal_belanja"
                            type="number"
                            min="0"
                            placeholder="Contoh: 50000"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            :class="{ 'border-rose-500': form.errors.minimal_belanja }"
                        />
                        <p v-if="form.errors.minimal_belanja" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                            <AlertCircle class="h-3 w-3" />{{ form.errors.minimal_belanja }}
                        </p>
                    </div>

                    <!-- Masa Berlaku (Mulai & Selesai) -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium" for="promo-mulai">
                                Tanggal Mulai
                            </label>
                            <input
                                id="promo-mulai"
                                v-model="form.tanggal_mulai"
                                type="datetime-local"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                :class="{ 'border-rose-500': form.errors.tanggal_mulai }"
                            />
                            <p v-if="form.errors.tanggal_mulai" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                <AlertCircle class="h-3 w-3" />{{ form.errors.tanggal_mulai }}
                            </p>
                        </div>
                        <div>
                            <label class="mb-1.5 block text-sm font-medium" for="promo-selesai">
                                Tanggal Selesai
                            </label>
                            <input
                                id="promo-selesai"
                                v-model="form.tanggal_selesai"
                                type="datetime-local"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                :class="{ 'border-rose-500': form.errors.tanggal_selesai }"
                            />
                            <p v-if="form.errors.tanggal_selesai" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                <AlertCircle class="h-3 w-3" />{{ form.errors.tanggal_selesai }}
                            </p>
                        </div>
                    </div>

                    <!-- Status Aktif -->
                    <div class="flex items-center gap-3 py-1">
                        <input
                            id="promo-aktif"
                            v-model="form.aktif"
                            type="checkbox"
                            class="h-4 w-4 rounded border-sidebar-border/70 text-indigo-600 focus:ring-indigo-500 dark:border-sidebar-border"
                        />
                        <label for="promo-aktif" class="text-sm font-semibold select-none cursor-pointer">
                            Promo ini aktif dan siap digunakan
                        </label>
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
                            {{
                                form.processing
                                    ? 'Menyimpan...'
                                    : editingPromo
                                      ? 'Simpan Perubahan'
                                      : 'Tambah Promo'
                            }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </BodyTeleport>
</template>
