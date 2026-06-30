<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import {
    Search,
    Warehouse,
    AlertTriangle,
    PackageX,
    PackagePlus,
    PackageMinus,
    ClipboardCheck,
    X,
    Save,
    History,
    Boxes,
    Check,
    PencilLine,
    PackageSearch,
    Factory,
    Wallet,
} from 'lucide-vue-next';
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import BodyTeleport from '@/components/BodyTeleport.vue';
import PagePurpose from '@/components/PagePurpose.vue';
import Pagination from '@/components/Pagination.vue';
import {
    masuk as stokMasuk,
    keluar as stokKeluar,
    penyesuaian as stokPenyesuaian,
} from '@/routes/admin/stok';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Manajemen Stok',
                href: '/admin/stok',
            },
        ],
    },
});

interface ProdukStok {
    id_produk: number;
    nama: string;
    jenis: 'beli' | 'produksi';
    tipe_jual: 'satuan' | 'curah' | 'jasa';
    satuan: string;
    kategori: string | null;
    stok: number;
    harga_modal: number;
    status_stok: 'in-stock' | 'low-stock' | 'out-of-stock';
}

// Opsi pemilih produk di modal aksi stok — daftar lengkap (non-paginasi).
interface ProdukOption {
    id_produk: number;
    nama: string;
    jenis: 'beli' | 'produksi';
    satuan: string;
    kategori: string | null;
    stok: number;
}

interface Mutasi {
    id_stok_mutasi: number;
    id_produk: number | null;
    produk_nama: string;
    tipe: string;
    tipe_label: string;
    jumlah: number;
    stok_sebelum: number;
    stok_sesudah: number;
    keterangan: string | null;
    user_nama: string;
    tanggal: string;
}

interface Stats {
    total_produk: number;
    stok_menipis: number;
    stok_habis: number;
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
    status: 'all' | ProdukStok['status_stok'] | 'menipis';
    produk_per_page: number;
    m_search: string;
    tipe: string;
    mutasi_per_page: number;
}

const props = defineProps<{
    produks: Paginator<ProdukStok>;
    produk_options: ProdukOption[];
    mutasis: Paginator<Mutasi>;
    stats: Stats;
    filters: Filters;
}>();

const rupiah = (value: number): string =>
    'Rp ' + (value ?? 0).toLocaleString('id-ID');

// Tampilkan stok tanpa desimal berlebih (30 pcs, 12.5 kg).
const formatStok = (stok: number, satuan = ''): string => {
    const angka = Number.isInteger(stok)
        ? stok.toString()
        : stok.toLocaleString('id-ID', { maximumFractionDigits: 3 });

    return satuan ? `${angka} ${satuan}` : angka;
};

const statusMeta: Record<
    ProdukStok['status_stok'],
    { label: string; badge: string }
> = {
    'in-stock': {
        label: 'Tersedia',
        badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    },
    'low-stock': {
        label: 'Menipis',
        badge: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
    },
    'out-of-stock': {
        label: 'Habis',
        badge: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400',
    },
};

// Warna badge tipe mutasi pada kartu stok.
const tipeBadge: Record<string, string> = {
    awal: 'border-slate-400/30 bg-slate-400/10 text-slate-600 dark:text-slate-300',
    masuk: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    produksi:
        'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    keluar: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400',
    jual: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
    produksi_batal:
        'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400',
    penyesuaian:
        'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
};

const activeTab = ref<'daftar' | 'kartu'>('daftar');

// Search & filter kedua tabel dikirim ke server (search di-debounce).
const searchQuery = ref(props.filters.search ?? '');
const statusFilter = ref<'all' | ProdukStok['status_stok'] | 'menipis'>(
    props.filters.status ?? 'all',
);
const mutasiSearch = ref(props.filters.m_search ?? '');
const tipeFilter = ref(props.filters.tipe ?? 'all');

type QueryValue = string | number;

function buildParams(
    overrides: Record<string, QueryValue> = {},
): Record<string, QueryValue> {
    const params: Record<string, QueryValue | undefined> = {
        search: searchQuery.value || undefined,
        status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
        produk_per_page: props.filters.produk_per_page,
        m_search: mutasiSearch.value || undefined,
        tipe: tipeFilter.value !== 'all' ? tipeFilter.value : undefined,
        mutasi_per_page: props.filters.mutasi_per_page,
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
    router.get('/admin/stok', buildParams(overrides), {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}

function makeVisiblePages(current: number, last: number): number[] {
    const pages: number[] = [];

    if (last <= 7) {
        for (let i = 1; i <= last; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);

        if (current > 3) {
            pages.push(-1);
        }

        for (
            let i = Math.max(2, current - 1);
            i <= Math.min(last - 1, current + 1);
            i++
        ) {
            pages.push(i);
        }

        if (current < last - 2) {
            pages.push(-1);
        }

        pages.push(last);
    }

    return pages;
}

/* ----------------------------------------------------------------------------
 | Tab 1: Daftar Stok
 ---------------------------------------------------------------------------- */
let produkSearchTimer: ReturnType<typeof setTimeout> | undefined;
watch(searchQuery, (value) => {
    if (produkSearchTimer) {
        clearTimeout(produkSearchTimer);
    }

    produkSearchTimer = setTimeout(
        () => reload({ search: value, produk_page: 1 }),
        350,
    );
});

watch(statusFilter, (value) => reload({ status: value, produk_page: 1 }));

function goToPageProduk(page: number): void {
    reload({ produk_page: page });
}

function changePerPageProduk(value: number): void {
    reload({ produk_per_page: value, produk_page: 1 });
}

const visiblePagesProduk = computed(() =>
    makeVisiblePages(props.produks.current_page, props.produks.last_page),
);

/* ----------------------------------------------------------------------------
 | Tab 2: Kartu Stok (riwayat mutasi)
 ---------------------------------------------------------------------------- */
let mutasiSearchTimer: ReturnType<typeof setTimeout> | undefined;
watch(mutasiSearch, (value) => {
    if (mutasiSearchTimer) {
        clearTimeout(mutasiSearchTimer);
    }

    mutasiSearchTimer = setTimeout(
        () => reload({ m_search: value, mutasi_page: 1 }),
        350,
    );
});

watch(tipeFilter, (value) => reload({ tipe: value, mutasi_page: 1 }));

function goToPageMutasi(page: number): void {
    reload({ mutasi_page: page });
}

function changePerPageMutasi(value: number): void {
    reload({ mutasi_per_page: value, mutasi_page: 1 });
}

const visiblePagesMutasi = computed(() =>
    makeVisiblePages(props.mutasis.current_page, props.mutasis.last_page),
);

/* ----------------------------------------------------------------------------
 | Modal aksi stok (masuk / keluar / penyesuaian)
 ---------------------------------------------------------------------------- */
type ModalMode = 'masuk' | 'keluar' | 'penyesuaian';

const modalMode = ref<ModalMode | null>(null);

const alasanOptions = [
    { value: 'rusak', label: 'Rusak' },
    { value: 'kadaluarsa', label: 'Kadaluarsa' },
    { value: 'hilang', label: 'Hilang' },
    { value: 'pakai_sendiri', label: 'Dipakai sendiri' },
    { value: 'lainnya', label: 'Lainnya' },
];

const form = useForm<{
    id_produk: number | '';
    jumlah: number | null;
    harga_beli: number | null;
    alasan: string;
    stok_fisik: number | null;
    keterangan: string;
}>({
    id_produk: '',
    jumlah: null,
    harga_beli: null,
    alasan: 'rusak',
    stok_fisik: null,
    keterangan: '',
});

const selectedProduk = computed(
    () =>
        props.produk_options.find((p) => p.id_produk === form.id_produk) ??
        null,
);

/* ----------------------------------------------------------------------------
 | Pemilih produk dengan pencarian (modal aksi stok)
 ---------------------------------------------------------------------------- */
const produkSearch = ref('');
const produkSearchInput = ref<HTMLInputElement | null>(null);

const produkQuery = computed(() => produkSearch.value.trim().toLowerCase());

// Daftar hanya muncul setelah admin mengetik — sebelum itu kosong agar form bersih.
const filteredProdukOptions = computed(() => {
    if (!produkQuery.value) {
        return [];
    }

    return props.produk_options.filter(
        (p) =>
            p.nama.toLowerCase().includes(produkQuery.value) ||
            (p.kategori ?? '').toLowerCase().includes(produkQuery.value),
    );
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

// Saat opname, default stok fisik = stok sistem agar tinggal koreksi selisihnya.
watch(
    () => form.id_produk,
    () => {
        if (modalMode.value === 'penyesuaian') {
            form.stok_fisik = selectedProduk.value
                ? selectedProduk.value.stok
                : null;
        }
    },
);

const selisihOpname = computed(() => {
    if (!selectedProduk.value || form.stok_fisik === null) {
        return 0;
    }

    return Number(form.stok_fisik) - selectedProduk.value.stok;
});

const modalMeta: Record<
    ModalMode,
    { title: string; desc: string; submit: string }
> = {
    masuk: {
        title: 'Stok Masuk',
        desc: 'Catat barang baru yang datang dari supplier/agen. Stok bertambah sesuai jumlah.',
        submit: 'Simpan Stok Masuk',
    },
    keluar: {
        title: 'Stok Keluar',
        desc: 'Catat stok berkurang di luar penjualan (rusak, kadaluarsa, hilang, dipakai sendiri).',
        submit: 'Simpan Stok Keluar',
    },
    penyesuaian: {
        title: 'Penyesuaian / Opname',
        desc: 'Samakan stok sistem dengan hasil hitung fisik. Selisihnya dicatat otomatis.',
        submit: 'Simpan Penyesuaian',
    },
};

function openModal(mode: ModalMode, produk?: ProdukStok): void {
    form.reset();
    form.clearErrors();
    modalMode.value = mode;
    produkSearch.value = '';

    if (produk) {
        form.id_produk = produk.id_produk;

        if (mode === 'penyesuaian') {
            form.stok_fisik = produk.stok;
        }
    } else {
        // Dibuka dari tombol header — fokuskan pencarian produk.
        nextTick(() => produkSearchInput.value?.focus());
    }
}

function closeModal(): void {
    modalMode.value = null;
    produkSearch.value = '';
    form.reset();
    form.clearErrors();
}

function submitForm(): void {
    if (!modalMode.value) {
        return;
    }

    const routeFor = {
        masuk: stokMasuk(),
        keluar: stokKeluar(),
        penyesuaian: stokPenyesuaian(),
    } as const;

    form.transform((data) => {
        if (modalMode.value === 'masuk') {
            return {
                id_produk: data.id_produk,
                jumlah: data.jumlah,
                harga_beli: data.harga_beli,
                keterangan: data.keterangan,
            };
        }

        if (modalMode.value === 'keluar') {
            return {
                id_produk: data.id_produk,
                jumlah: data.jumlah,
                alasan: data.alasan,
                keterangan: data.keterangan,
            };
        }

        return {
            id_produk: data.id_produk,
            stok_fisik: data.stok_fisik,
            keterangan: data.keterangan,
        };
    }).post(routeFor[modalMode.value].url, {
        preserveScroll: true,
        onSuccess: () => closeModal(),
    });
}

// Pintasan: buka kartu stok satu produk dari tombol di baris daftar.
function lihatKartu(produk: ProdukStok): void {
    activeTab.value = 'kartu';
    tipeFilter.value = 'all';
    // Memicu reload server (debounce) untuk menampilkan kartu stok produk ini.
    mutasiSearch.value = produk.nama;
}

// Deep-link dari hub "Catat" / tombol "Tambah Stok" di Data Produk:
// /admin/stok?aksi=masuk[&produk=ID] buka form stok masuk & (opsional) pilih produk.
onMounted(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('aksi') !== 'masuk') {
        return;
    }

    openModal('masuk');

    const produkId = Number(params.get('produk'));

    if (produkId && props.produk_options.some((p) => p.id_produk === produkId)) {
        form.id_produk = produkId;
        form.clearErrors('id_produk');
    }
});
</script>

<template>
    <Head title="Manajemen Stok - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">
                    Manajemen Stok
                </h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Kelola stok masuk (restock), stok keluar, dan penyesuaian
                    opname. Setiap perubahan tercatat di kartu stok.
                </p>
            </div>

            <button
                id="btn-stok-masuk"
                class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-500"
                @click="openModal('masuk')"
            >
                <PackagePlus class="h-4 w-4" />
                Stok Masuk
            </button>
        </div>

        <PagePurpose
            :icon="Warehouse"
            tone="sky"
            title="Untuk barang yang dibeli jadi dari supplier"
            description="Catat stok masuk (restock), stok keluar (rusak/hilang), dan opname. Modal barang beli diatur di sini."
            :links="[
                { label: 'Buatan sendiri? Produksi', href: '/admin/produksi', icon: Factory },
                { label: 'Biaya operasional? Pengeluaran', href: '/admin/pengeluarans', icon: Wallet },
            ]"
        />

        <!-- Stats -->
        <div class="grid gap-4 md:grid-cols-3">
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400"
                >
                    <Boxes class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground"
                        >Produk Berstok</span
                    >
                    <h3 class="mt-0.5 text-xl font-bold">
                        {{ stats.total_produk.toLocaleString('id-ID') }} produk
                    </h3>
                </div>
            </div>
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400"
                >
                    <AlertTriangle class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground"
                        >Stok Menipis</span
                    >
                    <h3 class="mt-0.5 text-xl font-bold">
                        {{ stats.stok_menipis.toLocaleString('id-ID') }} produk
                    </h3>
                </div>
            </div>
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400"
                >
                    <PackageX class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground"
                        >Stok Habis</span
                    >
                    <h3 class="mt-0.5 text-xl font-bold">
                        {{ stats.stok_habis.toLocaleString('id-ID') }} produk
                    </h3>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div
            class="flex gap-1 rounded-xl border border-sidebar-border/70 bg-card p-1 shadow-sm sm:w-fit dark:border-sidebar-border"
        >
            <button
                :class="[
                    'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition',
                    activeTab === 'daftar'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800',
                ]"
                @click="activeTab = 'daftar'"
            >
                <Warehouse class="h-4 w-4" />
                Daftar Stok
            </button>
            <button
                :class="[
                    'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition',
                    activeTab === 'kartu'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800',
                ]"
                @click="activeTab = 'kartu'"
            >
                <History class="h-4 w-4" />
                Kartu Stok
            </button>
        </div>

        <!-- ============================ TAB: DAFTAR STOK ============================ -->
        <div
            v-show="activeTab === 'daftar'"
            class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"
        >
            <div
                class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border"
            >
                <div class="relative max-w-md flex-1">
                    <Search
                        class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari nama produk / kategori..."
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pr-4 pl-9 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
                <select
                    v-model="statusFilter"
                    class="rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                >
                    <option value="all">Semua status</option>
                    <option value="menipis">Menipis / habis</option>
                    <option value="in-stock">Tersedia</option>
                    <option value="low-stock">Menipis</option>
                    <option value="out-of-stock">Habis</option>
                </select>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr
                            class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"
                        >
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                No
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Produk
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Stok
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Status
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Modal
                            </th>
                            <th
                                class="px-6 py-4 text-right font-semibold text-muted-foreground"
                            >
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody
                        class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border"
                    >
                        <tr v-if="props.produks.data.length === 0">
                            <td
                                colspan="6"
                                class="px-6 py-12 text-center text-muted-foreground"
                            >
                                <Warehouse
                                    class="mx-auto mb-3 h-10 w-10 opacity-30"
                                />
                                <p class="font-medium">
                                    Tidak ada produk yang cocok.
                                </p>
                            </td>
                        </tr>
                        <tr
                            v-for="(produk, index) in props.produks.data"
                            :key="produk.id_produk"
                            class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"
                        >
                            <td class="px-6 py-4 text-muted-foreground">
                                {{ (props.produks.from ?? 0) + index }}
                            </td>
                            <td class="px-6 py-4">
                                <button
                                    class="text-left font-medium hover:text-indigo-600 dark:hover:text-indigo-400"
                                    @click="lihatKartu(produk)"
                                >
                                    {{ produk.nama }}
                                </button>
                                <div class="text-xs text-muted-foreground">
                                    {{ produk.kategori ?? 'Tanpa kategori' }}
                                </div>
                            </td>
                            <td class="px-6 py-4 font-semibold">
                                {{ formatStok(produk.stok, produk.satuan) }}
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    :class="[
                                        'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                                        statusMeta[produk.status_stok].badge,
                                    ]"
                                >
                                    {{ statusMeta[produk.status_stok].label }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">
                                {{ rupiah(produk.harga_modal) }}
                            </td>
                            <td class="px-6 py-4">
                                <div
                                    class="flex items-center justify-end gap-1"
                                >
                                    <button
                                        class="rounded-lg p-1.5 text-emerald-600 transition-colors hover:bg-emerald-500/10 dark:text-emerald-400"
                                        aria-label="Stok masuk"
                                        @click="openModal('masuk', produk)"
                                    >
                                        <PackagePlus class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-rose-600 transition-colors hover:bg-rose-500/10 dark:text-rose-400"
                                        aria-label="Stok keluar"
                                        @click="openModal('keluar', produk)"
                                    >
                                        <PackageMinus class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-amber-600 transition-colors hover:bg-amber-500/10 dark:text-amber-400"
                                        aria-label="Penyesuaian / opname"
                                        @click="
                                            openModal('penyesuaian', produk)
                                        "
                                    >
                                        <ClipboardCheck class="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Pagination
                :current-page="props.produks.current_page"
                :total-pages="props.produks.last_page"
                :total-items="props.produks.total"
                :start-index="props.produks.from ?? 0"
                :end-index="props.produks.to ?? 0"
                :per-page="props.produks.per_page"
                :visible-pages="visiblePagesProduk"
                @update:current-page="goToPageProduk"
                @update:per-page="changePerPageProduk"
            />
        </div>

        <!-- ============================ TAB: KARTU STOK ============================ -->
        <div
            v-show="activeTab === 'kartu'"
            class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"
        >
            <div
                class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border"
            >
                <div class="relative max-w-md flex-1">
                    <Search
                        class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                        v-model="mutasiSearch"
                        type="text"
                        placeholder="Cari nama produk..."
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pr-4 pl-9 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
                <select
                    v-model="tipeFilter"
                    class="rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                >
                    <option value="all">Semua tipe</option>
                    <option value="masuk">Stok Masuk</option>
                    <option value="keluar">Stok Keluar</option>
                    <option value="penyesuaian">Penyesuaian</option>
                    <option value="jual">Penjualan</option>
                    <option value="produksi">Produksi</option>
                    <option value="awal">Stok Awal</option>
                </select>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr
                            class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"
                        >
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Tanggal
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Produk
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Tipe
                            </th>
                            <th
                                class="px-6 py-4 text-right font-semibold text-muted-foreground"
                            >
                                Perubahan
                            </th>
                            <th
                                class="px-6 py-4 text-right font-semibold text-muted-foreground"
                            >
                                Sebelum → Sesudah
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Keterangan
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Oleh
                            </th>
                        </tr>
                    </thead>
                    <tbody
                        class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border"
                    >
                        <tr v-if="props.mutasis.data.length === 0">
                            <td
                                colspan="7"
                                class="px-6 py-12 text-center text-muted-foreground"
                            >
                                <History
                                    class="mx-auto mb-3 h-10 w-10 opacity-30"
                                />
                                <p class="font-medium">
                                    Belum ada riwayat mutasi stok.
                                </p>
                            </td>
                        </tr>
                        <tr
                            v-for="mutasi in props.mutasis.data"
                            :key="mutasi.id_stok_mutasi"
                            class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"
                        >
                            <td
                                class="px-6 py-4 whitespace-nowrap text-muted-foreground"
                            >
                                {{ mutasi.tanggal }}
                            </td>
                            <td class="px-6 py-4 font-medium">
                                {{ mutasi.produk_nama }}
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    :class="[
                                        'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                                        tipeBadge[mutasi.tipe] ??
                                            tipeBadge.awal,
                                    ]"
                                >
                                    {{ mutasi.tipe_label }}
                                </span>
                            </td>
                            <td
                                :class="[
                                    'px-6 py-4 text-right font-semibold tabular-nums',
                                    mutasi.jumlah > 0
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : mutasi.jumlah < 0
                                          ? 'text-rose-600 dark:text-rose-400'
                                          : 'text-muted-foreground',
                                ]"
                            >
                                {{ mutasi.jumlah > 0 ? '+' : ''
                                }}{{ formatStok(mutasi.jumlah) }}
                            </td>
                            <td
                                class="px-6 py-4 text-right whitespace-nowrap text-muted-foreground tabular-nums"
                            >
                                {{ formatStok(mutasi.stok_sebelum) }} →
                                <span class="font-semibold text-foreground">{{
                                    formatStok(mutasi.stok_sesudah)
                                }}</span>
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">
                                {{ mutasi.keterangan ?? '—' }}
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-muted-foreground"
                            >
                                {{ mutasi.user_nama }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Pagination
                :current-page="props.mutasis.current_page"
                :total-pages="props.mutasis.last_page"
                :total-items="props.mutasis.total"
                :start-index="props.mutasis.from ?? 0"
                :end-index="props.mutasis.to ?? 0"
                :per-page="props.mutasis.per_page"
                :visible-pages="visiblePagesMutasi"
                @update:current-page="goToPageMutasi"
                @update:per-page="changePerPageMutasi"
            />
        </div>
    </div>

    <!-- ============================ MODAL AKSI STOK ============================ -->
    <BodyTeleport>
        <div
            v-if="modalMode"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
            <div
                class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border"
            >
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-semibold">
                            {{ modalMeta[modalMode].title }}
                        </h2>
                        <p class="mt-1 text-sm text-muted-foreground">
                            {{ modalMeta[modalMode].desc }}
                        </p>
                    </div>
                    <button
                        class="rounded-full p-2 text-muted-foreground transition hover:bg-slate-100 dark:hover:bg-zinc-800"
                        @click="closeModal"
                        aria-label="Tutup"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <div class="mt-6 grid gap-4">
                    <div
                        v-if="produk_options.length === 0"
                        class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400"
                    >
                        Belum ada produk berstok. Tambahkan produk dulu di menu
                        Data Produk.
                    </div>

                    <!-- Produk: pemilih dengan pencarian -->
                    <div>
                        <label class="mb-2 block text-sm font-medium"
                            >Produk</label
                        >

                        <!-- Sudah dipilih -->
                        <div
                            v-if="selectedProduk"
                            class="flex items-center justify-between gap-3 rounded-xl border border-indigo-500/40 bg-indigo-500/5 p-3"
                        >
                            <div class="flex min-w-0 items-center gap-3">
                                <div
                                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white"
                                >
                                    <Check class="h-5 w-5" />
                                </div>
                                <div class="min-w-0">
                                    <p class="truncate font-semibold">
                                        {{ selectedProduk.nama }}
                                    </p>
                                    <p class="text-xs text-muted-foreground">
                                        Stok sistem
                                        {{
                                            formatStok(
                                                selectedProduk.stok,
                                                selectedProduk.satuan,
                                            )
                                        }}
                                        ·
                                        {{
                                            selectedProduk.kategori ??
                                            'Tanpa kategori'
                                        }}
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
                        <div v-else-if="produk_options.length > 0">
                            <div class="relative">
                                <Search
                                    class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    ref="produkSearchInput"
                                    v-model="produkSearch"
                                    type="text"
                                    placeholder="Ketik nama produk untuk mencari..."
                                    class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pr-4 pl-9 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                />
                            </div>
                            <!-- Hint sebelum mengetik: daftar disembunyikan agar form bersih -->
                            <p
                                v-if="!produkQuery"
                                class="mt-2 px-1 text-xs text-muted-foreground"
                            >
                                Mulai ketik nama produk untuk menampilkan
                                daftarnya.
                            </p>

                            <!-- Tidak ada hasil -->
                            <div
                                v-else-if="filteredProdukOptions.length === 0"
                                class="mt-2 flex flex-col items-center gap-2 rounded-xl border border-dashed border-sidebar-border/70 px-4 py-6 text-center text-sm text-muted-foreground dark:border-sidebar-border"
                            >
                                <PackageSearch class="h-7 w-7 opacity-30" />
                                Produk "<strong>{{ produkSearch }}</strong
                                >" tidak ditemukan.
                            </div>

                            <!-- Hasil pencarian -->
                            <div
                                v-else
                                class="mt-2 max-h-56 space-y-1 overflow-y-auto pr-1"
                            >
                                <button
                                    v-for="p in filteredProdukOptions"
                                    :key="p.id_produk"
                                    type="button"
                                    class="flex w-full items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5"
                                    @click="pilihProduk(p)"
                                >
                                    <span
                                        class="min-w-0 truncate text-sm font-medium"
                                        >{{ p.nama }}</span
                                    >
                                    <span
                                        class="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground tabular-nums"
                                    >
                                        Stok {{ formatStok(p.stok, p.satuan) }}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <p
                            v-if="form.errors.id_produk"
                            class="mt-2 text-sm text-rose-600"
                        >
                            {{ form.errors.id_produk }}
                        </p>
                    </div>

                    <!-- MASUK: jumlah + harga beli opsional -->
                    <template v-if="modalMode === 'masuk'">
                        <div>
                            <label class="mb-2 block text-sm font-medium"
                                >Jumlah Masuk{{
                                    selectedProduk
                                        ? ` (${selectedProduk.satuan})`
                                        : ''
                                }}</label
                            >
                            <input
                                v-model.number="form.jumlah"
                                type="number"
                                min="0"
                                step="any"
                                placeholder="0"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-sidebar-border"
                            />
                            <p
                                v-if="form.errors.jumlah"
                                class="mt-2 text-sm text-rose-600"
                            >
                                {{ form.errors.jumlah }}
                            </p>
                        </div>
                        <div
                            v-if="
                                !selectedProduk ||
                                selectedProduk.jenis === 'beli'
                            "
                        >
                            <label class="mb-2 block text-sm font-medium"
                                >Harga Beli / Modal Baru (opsional)</label
                            >
                            <div class="relative">
                                <span
                                    class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-muted-foreground"
                                    >Rp</span
                                >
                                <input
                                    v-model.number="form.harga_beli"
                                    type="number"
                                    min="0"
                                    placeholder="Kosongkan jika harga beli tidak berubah"
                                    class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pr-3 pl-10 text-sm focus:border-emerald-500 focus:outline-none dark:border-sidebar-border"
                                />
                            </div>
                            <p class="mt-1 text-xs text-muted-foreground">
                                Isi bila harga beli dari supplier berubah —
                                modal produk akan diperbarui.
                            </p>
                            <p
                                v-if="form.errors.harga_beli"
                                class="mt-2 text-sm text-rose-600"
                            >
                                {{ form.errors.harga_beli }}
                            </p>
                        </div>
                        <div
                            v-else
                            class="rounded-lg border border-sky-500/30 bg-sky-500/10 p-3 text-xs text-sky-700 dark:text-sky-400"
                        >
                            Produk buatan sendiri — modal dikelola lewat menu
                            <strong>Produksi</strong> (batch costing), jadi
                            tidak diubah di sini.
                        </div>
                    </template>

                    <!-- KELUAR: jumlah + alasan -->
                    <template v-else-if="modalMode === 'keluar'">
                        <div>
                            <label class="mb-2 block text-sm font-medium"
                                >Jumlah Keluar{{
                                    selectedProduk
                                        ? ` (${selectedProduk.satuan})`
                                        : ''
                                }}</label
                            >
                            <input
                                v-model.number="form.jumlah"
                                type="number"
                                min="0"
                                step="any"
                                placeholder="0"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-rose-500 focus:outline-none dark:border-sidebar-border"
                            />
                            <p
                                v-if="form.errors.jumlah"
                                class="mt-2 text-sm text-rose-600"
                            >
                                {{ form.errors.jumlah }}
                            </p>
                        </div>
                        <div>
                            <label class="mb-2 block text-sm font-medium"
                                >Alasan</label
                            >
                            <select
                                v-model="form.alasan"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-rose-500 focus:outline-none dark:border-sidebar-border"
                            >
                                <option
                                    v-for="opt in alasanOptions"
                                    :key="opt.value"
                                    :value="opt.value"
                                >
                                    {{ opt.label }}
                                </option>
                            </select>
                            <p
                                v-if="form.errors.alasan"
                                class="mt-2 text-sm text-rose-600"
                            >
                                {{ form.errors.alasan }}
                            </p>
                        </div>
                    </template>

                    <!-- PENYESUAIAN: stok fisik -->
                    <template v-else>
                        <div>
                            <label class="mb-2 block text-sm font-medium"
                                >Stok Fisik (hasil hitung){{
                                    selectedProduk
                                        ? ` (${selectedProduk.satuan})`
                                        : ''
                                }}</label
                            >
                            <input
                                v-model.number="form.stok_fisik"
                                type="number"
                                min="0"
                                step="any"
                                placeholder="0"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-amber-500 focus:outline-none dark:border-sidebar-border"
                            />
                            <p
                                v-if="form.errors.stok_fisik"
                                class="mt-2 text-sm text-rose-600"
                            >
                                {{ form.errors.stok_fisik }}
                            </p>
                        </div>
                        <div
                            v-if="selectedProduk && form.stok_fisik !== null"
                            class="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm"
                        >
                            Selisih penyesuaian:
                            <strong
                                :class="
                                    selisihOpname > 0
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : selisihOpname < 0
                                          ? 'text-rose-600 dark:text-rose-400'
                                          : 'text-muted-foreground'
                                "
                            >
                                {{ selisihOpname > 0 ? '+' : ''
                                }}{{
                                    formatStok(
                                        selisihOpname,
                                        selectedProduk.satuan,
                                    )
                                }}
                            </strong>
                        </div>
                    </template>

                    <!-- Catatan -->
                    <div>
                        <label class="mb-2 block text-sm font-medium"
                            >Catatan (opsional)</label
                        >
                        <input
                            v-model="form.keterangan"
                            type="text"
                            placeholder="Mis. nota #123, supplier, dsb."
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                        />
                        <p
                            v-if="form.errors.keterangan"
                            class="mt-2 text-sm text-rose-600"
                        >
                            {{ form.errors.keterangan }}
                        </p>
                    </div>
                </div>

                <div
                    class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end"
                >
                    <button
                        class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800"
                        type="button"
                        @click="closeModal"
                    >
                        Batal
                    </button>
                    <button
                        :class="[
                            'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50',
                            modalMode === 'masuk'
                                ? 'bg-emerald-600 hover:bg-emerald-500'
                                : modalMode === 'keluar'
                                  ? 'bg-rose-600 hover:bg-rose-500'
                                  : 'bg-amber-600 hover:bg-amber-500',
                        ]"
                        type="button"
                        :disabled="
                            form.processing ||
                            produk_options.length === 0 ||
                            form.id_produk === ''
                        "
                        @click="submitForm"
                    >
                        <Save class="h-4 w-4" />
                        {{ modalMeta[modalMode].submit }}
                    </button>
                </div>
            </div>
        </div>
    </BodyTeleport>
</template>
