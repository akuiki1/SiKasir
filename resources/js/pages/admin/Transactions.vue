<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import {
    Plus,
    Search,
    DollarSign,
    ShoppingCart,
    ArrowUpRight,
    FileText,
    X,
    Save,
    AlertCircle,
    Edit,
    Trash2,
    Minus,
    SlidersHorizontal,
    ChevronDown,
    Clock,
    History,
    TrendingUp,
    TrendingDown,
    PackagePlus,
    PackageMinus,
} from 'lucide-vue-next';
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import BodyTeleport from '@/components/BodyTeleport.vue';
import Pagination from '@/components/Pagination.vue';
import PeriodFilter from '@/components/PeriodFilter.vue';
import ProductPicker from '@/components/ProductPicker.vue';
import { formatRupiah } from '@/lib/format';
import { formatPeriodLabel } from '@/lib/period';
import {
    store as transaksiStore,
    update as transaksiUpdate,
    destroy as transaksiDestroy,
} from '@/routes/admin/transactions';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Data Transaksi',
                href: '/admin/transactions',
            },
        ],
    },
});

interface DetailItem {
    id_produk: number;
    nama_produk: string;
    jumlah: number;
    harga: number;
    subtotal: number;
    foto: string | null;
    foto_url?: string | null;
}

interface Transaksi {
    id_transaksi: number;
    id_user: number;
    kode: string;
    kasir: string;
    jumlah_item: number;
    total_harga: number;
    metode_pembayaran: string;
    bayar: number;
    kembalian: number;
    created_at: string;
    waktu: string;
    tanggal: string;
    details: DetailItem[];
}

interface Kasir {
    id: number;
    name: string;
    role: string;
}

interface ProdukItem {
    id_produk: number;
    nama: string;
    harga_jual: number;
    stok: number;
}

interface Stats {
    total_penjualan_hari_ini: number;
    total_transaksi_sukses: number;
    rata_rata: number;
}

interface FormItem {
    id_produk: string;
    jumlah: string;
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
    kasir: string;
    sort: string;
    per_page: number;
}

const props = defineProps<{
    transaksis: Paginator<Transaksi>;
    kasirs: Kasir[];
    produks: ProdukItem[];
    stats: Stats;
    date_range: {
        start_date: string;
        end_date: string;
    };
    filters: Filters;
}>();

function formatMetode(metode: string): string {
    const labels: Record<string, string> = {
        cash: 'Tunai',
        qris: 'QRIS',
        transfer: 'Transfer',
    };

    return labels[metode] ?? metode;
}

const searchQuery = ref(props.filters.search ?? '');
const filterKasir = ref(props.filters.kasir ?? '');
const sortBy = ref(props.filters.sort ?? '');
const showFilterPanel = ref(false);

// Pencarian & filter dikirim ke server (search di-debounce).
let searchTimer: ReturnType<typeof setTimeout> | undefined;
watch(searchQuery, (value) => {
    if (searchTimer) {
        clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(() => reload({ search: value, page: 1 }), 350);
});

watch(filterKasir, (value) => reload({ kasir: value, page: 1 }));
watch(sortBy, (value) => reload({ sort: value, page: 1 }));
const filterPanelRef = ref<HTMLDivElement | null>(null);

const sortOptions = [
    { value: 'date_asc', label: 'Terlama – Terbaru', icon: Clock },
    { value: 'date_desc', label: 'Terbaru – Terlama', icon: History },
    { value: 'total_desc', label: 'Belanja Terbesar', icon: TrendingDown },
    { value: 'total_asc', label: 'Belanja Terkecil', icon: TrendingUp },
    { value: 'item_desc', label: 'Barang Terbanyak', icon: PackageMinus },
    { value: 'item_asc', label: 'Barang Tersedikit', icon: PackagePlus },
];

const activeFilterCount = computed(() => {
    let count = 0;

    if (filterKasir.value) {
        count++;
    }

    if (sortBy.value) {
        count++;
    }

    return count;
});

function clearFilters() {
    filterKasir.value = '';
    sortBy.value = '';
}

function handleClickOutsideFilter(event: MouseEvent) {
    if (
        filterPanelRef.value &&
        !filterPanelRef.value.contains(event.target as Node)
    ) {
        showFilterPanel.value = false;
    }
}

onMounted(() =>
    document.addEventListener('mousedown', handleClickOutsideFilter),
);
onBeforeUnmount(() =>
    document.removeEventListener('mousedown', handleClickOutsideFilter),
);

const periodLabel = computed(() =>
    formatPeriodLabel(props.date_range.start_date, props.date_range.end_date),
);

function onPeriod(range: { start_date: string; end_date: string }): void {
    reload({ start_date: range.start_date, end_date: range.end_date, page: 1 });
}

type QueryValue = string | number;

function buildParams(
    overrides: Record<string, QueryValue> = {},
): Record<string, QueryValue> {
    const params: Record<string, QueryValue | undefined> = {
        search: searchQuery.value || undefined,
        kasir: filterKasir.value || undefined,
        sort: sortBy.value || undefined,
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
    router.get('/admin/transactions', buildParams(overrides), {
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
    const total = props.transaksis.last_page;
    const current = props.transaksis.current_page;

    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);

        if (current > 3) {
            pages.push(-1);
        }

        for (
            let i = Math.max(2, current - 1);
            i <= Math.min(total - 1, current + 1);
            i++
        ) {
            pages.push(i);
        }

        if (current < total - 2) {
            pages.push(-1);
        }

        pages.push(total);
    }

    return pages;
});

const showDetail = ref(false);
const selectedTrx = ref<Transaksi | null>(null);

function openDetail(trx: Transaksi) {
    selectedTrx.value = trx;
    showDetail.value = true;
}

function closeDetail() {
    showDetail.value = false;
    selectedTrx.value = null;
}

const showFormModal = ref(false);
const editingTransaksi = ref<Transaksi | null>(null);

const form = useForm({
    id_user: '',
    metode_pembayaran: 'cash' as 'cash' | 'qris' | 'transfer',
    bayar: '',
    items: [] as FormItem[],
});

const computedTotal = computed(() => {
    return form.items.reduce((total, item) => {
        if (!item.id_produk || !item.jumlah) {
            return total;
        }

        const produk = props.produks.find(
            (p) => p.id_produk === Number(item.id_produk),
        );

        if (!produk) {
            return total;
        }

        return total + produk.harga_jual * Number(item.jumlah);
    }, 0);
});

const computedKembalian = computed(() => {
    const bayar = Number(form.bayar) || 0;

    return Math.max(0, bayar - computedTotal.value);
});

function openTambah() {
    editingTransaksi.value = null;
    form.reset();
    form.metode_pembayaran = 'cash';
    form.items = [];
    pickerModel.value = '';
    showFormModal.value = true;
}

function openEdit(trx: Transaksi) {
    editingTransaksi.value = trx;
    form.id_user = String(trx.id_user);
    form.metode_pembayaran = trx.metode_pembayaran as
        | 'cash'
        | 'qris'
        | 'transfer';
    form.bayar = String(trx.bayar);
    form.items = trx.details.map((d) => ({
        id_produk: String(d.id_produk),
        jumlah: String(d.jumlah),
    }));
    showDetail.value = false;
    showFormModal.value = true;
}

function closeFormModal() {
    showFormModal.value = false;
    form.reset();
    form.clearErrors();
}

// Item ditambah lewat satu kolom pencarian di atas (pola keranjang, seperti kasir):
// pilih produk → masuk daftar di bawah, atau menambah qty jika sudah ada.
const pickerModel = ref('');

watch(pickerModel, (value) => {
    if (!value) {
        return;
    }

    addProduk(value);
    pickerModel.value = ''; // reset agar picker siap untuk pencarian berikutnya
});

function addProduk(idProduk: string): void {
    const existing = form.items.find((item) => item.id_produk === idProduk);

    if (existing) {
        existing.jumlah = String(Number(existing.jumlah) + 1);

        return;
    }

    form.items.push({ id_produk: idProduk, jumlah: '1' });
}

function incItem(index: number): void {
    const item = form.items[index];
    item.jumlah = String(Number(item.jumlah) + 1);
}

function decItem(index: number): void {
    const item = form.items[index];
    const next = Number(item.jumlah) - 1;

    if (next >= 1) {
        item.jumlah = String(next);
    }
}

function removeItem(index: number) {
    form.items.splice(index, 1);
}

function getProdukNama(idProduk: string): string {
    const produk = props.produks.find((p) => p.id_produk === Number(idProduk));

    return produk?.nama ?? 'Produk';
}

function getProdukHarga(idProduk: string): number {
    const produk = props.produks.find((p) => p.id_produk === Number(idProduk));

    return produk?.harga_jual ?? 0;
}

function getProdukStok(idProduk: string): number {
    const produk = props.produks.find((p) => p.id_produk === Number(idProduk));

    return produk?.stok ?? 0;
}

function submitForm() {
    const data = {
        id_user: Number(form.id_user),
        metode_pembayaran: form.metode_pembayaran,
        bayar: Number(form.bayar),
        items: form.items.map((item) => ({
            id_produk: Number(item.id_produk),
            jumlah: Number(item.jumlah),
        })),
    };

    if (editingTransaksi.value) {
        router.put(
            transaksiUpdate(editingTransaksi.value.id_transaksi).url,
            data,
            {
                onSuccess: () => closeFormModal(),
            },
        );
    } else {
        router.post(transaksiStore().url, data, {
            onSuccess: () => closeFormModal(),
        });
    }
}

function hapusTransaksi(trx: Transaksi) {
    if (
        confirm(`Hapus transaksi "${trx.kode}"? Stok produk akan dikembalikan.`)
    ) {
        router.delete(transaksiDestroy(trx.id_transaksi).url);
    }
}
</script>

<template>
    <Head title="Data Transaksi - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">
                    Manajemen Transaksi
                </h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Pantau riwayat seluruh transaksi penjualan, status
                    pembayaran, serta metode pembayaran kasir.
                </p>
            </div>

            <div class="flex shrink-0 items-center gap-2">
                <PeriodFilter
                    :start-date="props.date_range.start_date"
                    :end-date="props.date_range.end_date"
                    @change="onPeriod"
                />

                <button
                    id="btn-tambah-transaksi"
                    class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500"
                    @click="openTambah"
                >
                    <Plus class="h-4 w-4" />
                    Tambah Transaksi
                </button>
            </div>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400"
                >
                    <DollarSign class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">
                        Total Penjualan {{ periodLabel }}
                    </span>
                    <h3 class="mt-0.5 text-xl font-bold">
                        {{ formatRupiah(stats.total_penjualan_hari_ini) }}
                    </h3>
                </div>
            </div>
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400"
                >
                    <ShoppingCart class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">
                        Total Transaksi {{ periodLabel }}
                    </span>
                    <h3 class="mt-0.5 text-xl font-bold">
                        {{ stats.total_transaksi_sukses }} Transaksi
                    </h3>
                </div>
            </div>
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400"
                >
                    <ArrowUpRight class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground"
                        >Rata-rata Pembelian</span
                    >
                    <h3 class="mt-0.5 text-xl font-bold">
                        {{ formatRupiah(stats.rata_rata) }}
                    </h3>
                </div>
            </div>
        </div>

        <div
            class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"
        >
            <!-- Action Bar -->
            <div
                class="border-b border-sidebar-border/70 dark:border-sidebar-border"
            >
                <div
                    class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <!-- Search -->
                    <div class="relative max-w-sm flex-1">
                        <Search
                            class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Cari berdasarkan ID atau nama kasir..."
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pr-4 pl-9 text-sm transition-colors focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                        />
                    </div>

                    <!-- Filter Trigger + Dropdown -->
                    <div ref="filterPanelRef" class="relative shrink-0">
                        <button
                            class="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-150"
                            :class="
                                activeFilterCount > 0
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-500'
                                    : 'border border-sidebar-border/70 bg-background text-slate-700 hover:bg-slate-50 dark:border-sidebar-border dark:text-slate-200 dark:hover:bg-zinc-800/40'
                            "
                            @click="showFilterPanel = !showFilterPanel"
                        >
                            <SlidersHorizontal class="h-4 w-4" />
                            Filter
                            <span
                                v-if="activeFilterCount > 0"
                                class="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white/25 px-1 text-[10px] font-bold"
                                >{{ activeFilterCount }}</span
                            >
                            <ChevronDown
                                class="h-3.5 w-3.5 transition-transform duration-200"
                                :class="{ 'rotate-180': showFilterPanel }"
                            />
                        </button>

                        <!-- Dropdown Panel -->
                        <Transition
                            enter-active-class="transition duration-150 ease-out"
                            enter-from-class="scale-95 opacity-0"
                            enter-to-class="scale-100 opacity-100"
                            leave-active-class="transition duration-100 ease-in"
                            leave-from-class="scale-100 opacity-100"
                            leave-to-class="scale-95 opacity-0"
                        >
                            <div
                                v-if="showFilterPanel"
                                class="absolute top-full right-0 z-30 mt-2 w-80 origin-top-right overflow-hidden rounded-2xl border border-sidebar-border/70 bg-card shadow-2xl dark:border-sidebar-border"
                            >
                                <!-- Panel Header -->
                                <div
                                    class="flex items-center justify-between border-b border-sidebar-border/70 px-4 py-3 dark:border-sidebar-border"
                                >
                                    <div class="flex items-center gap-2">
                                        <SlidersHorizontal
                                            class="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400"
                                        />
                                        <span class="text-sm font-semibold"
                                            >Filter & Urutkan</span
                                        >
                                    </div>
                                    <button
                                        class="rounded-md p-1 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground dark:hover:bg-zinc-800"
                                        @click="showFilterPanel = false"
                                        aria-label="Tutup"
                                    >
                                        <X class="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                <div class="p-4">
                                    <!-- Kasir -->
                                    <div class="mb-5">
                                        <p
                                            class="mb-2.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
                                        >
                                            Kasir
                                        </p>
                                        <div class="flex flex-wrap gap-1.5">
                                            <button
                                                class="rounded-full border px-3 py-1 text-xs font-medium transition-all duration-100"
                                                :class="
                                                    filterKasir === ''
                                                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                                        : 'border-sidebar-border/70 bg-background text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-400'
                                                "
                                                @click="filterKasir = ''"
                                            >
                                                Semua
                                            </button>
                                            <button
                                                v-for="kasir in kasirs"
                                                :key="kasir.id"
                                                class="rounded-full border px-3 py-1 text-xs font-medium transition-all duration-100"
                                                :class="
                                                    filterKasir ===
                                                    String(kasir.id)
                                                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                                        : 'border-sidebar-border/70 bg-background text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-400'
                                                "
                                                @click="
                                                    filterKasir = String(
                                                        kasir.id,
                                                    )
                                                "
                                            >
                                                {{ kasir.name }}
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Urutkan -->
                                    <div>
                                        <p
                                            class="mb-2.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
                                        >
                                            Urutkan Berdasarkan
                                        </p>
                                        <div class="grid grid-cols-2 gap-1.5">
                                            <button
                                                v-for="opt in sortOptions"
                                                :key="opt.value"
                                                class="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all duration-100"
                                                :class="
                                                    sortBy === opt.value
                                                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                                        : 'border-sidebar-border/70 bg-background text-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:border-sidebar-border dark:bg-zinc-900/30 dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:bg-zinc-800'
                                                "
                                                @click="
                                                    sortBy =
                                                        sortBy === opt.value
                                                            ? ''
                                                            : opt.value
                                                "
                                            >
                                                <component
                                                    :is="opt.icon"
                                                    class="h-3.5 w-3.5 shrink-0"
                                                />
                                                <span class="leading-tight">{{
                                                    opt.label
                                                }}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Footer reset -->
                                <div
                                    v-if="activeFilterCount > 0"
                                    class="border-t border-sidebar-border/70 px-4 py-3 dark:border-sidebar-border"
                                >
                                    <button
                                        class="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                        @click="clearFilters"
                                    >
                                        <X class="h-3 w-3" />
                                        Reset semua filter
                                    </button>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>

                <!-- Active filter tags strip -->
                <div
                    v-if="activeFilterCount > 0"
                    class="flex flex-wrap items-center gap-2 border-t border-indigo-100 bg-indigo-50/60 px-4 py-2.5 dark:border-indigo-500/10 dark:bg-indigo-500/5"
                >
                    <span class="text-xs font-medium text-muted-foreground"
                        >Filter aktif:</span
                    >

                    <span
                        v-if="filterKasir"
                        class="inline-flex items-center gap-1 rounded-full bg-indigo-100 py-0.5 pr-1.5 pl-2.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                    >
                        {{
                            kasirs.find((k) => String(k.id) === filterKasir)
                                ?.name
                        }}
                        <button
                            class="rounded-full p-0.5 transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-500/30"
                            @click="filterKasir = ''"
                            aria-label="Hapus filter kasir"
                        >
                            <X class="h-2.5 w-2.5" />
                        </button>
                    </span>

                    <span
                        v-if="sortBy"
                        class="inline-flex items-center gap-1 rounded-full bg-indigo-100 py-0.5 pr-1.5 pl-2.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                    >
                        <component
                            :is="
                                sortOptions.find((s) => s.value === sortBy)
                                    ?.icon
                            "
                            class="h-3 w-3"
                        />
                        {{ sortOptions.find((s) => s.value === sortBy)?.label }}
                        <button
                            class="rounded-full p-0.5 transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-500/30"
                            @click="sortBy = ''"
                            aria-label="Hapus urutan"
                        >
                            <X class="h-2.5 w-2.5" />
                        </button>
                    </span>
                </div>
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
                                ID Transaksi
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Kasir
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Jumlah Barang
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Total Belanja
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Metode
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Waktu
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
                        <tr v-if="props.transaksis.data.length === 0">
                            <td
                                colspan="7"
                                class="px-6 py-12 text-center text-muted-foreground"
                            >
                                <ShoppingCart
                                    class="mx-auto mb-3 h-10 w-10 opacity-30"
                                />
                                <p class="font-medium">
                                    {{
                                        searchQuery
                                            ? 'Tidak ada transaksi yang sesuai pencarian.'
                                            : 'Belum ada transaksi.'
                                    }}
                                </p>
                            </td>
                        </tr>
                        <tr
                            v-for="trx in props.transaksis.data"
                            :key="trx.id_transaksi"
                            class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"
                        >
                            <td
                                class="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400"
                            >
                                {{ trx.kode }}
                            </td>
                            <td class="px-6 py-4 font-semibold text-foreground">
                                {{ trx.kasir }}
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">
                                {{ trx.jumlah_item }} item
                            </td>
                            <td
                                class="px-6 py-4 font-bold text-slate-800 dark:text-slate-200"
                            >
                                {{ formatRupiah(trx.total_harga) }}
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400"
                                >
                                    {{ formatMetode(trx.metode_pembayaran) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">
                                <div>
                                    <p class="font-medium">{{ trx.waktu }}</p>
                                    <p class="text-xs">{{ trx.tanggal }}</p>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="inline-flex justify-end gap-2">
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
                                        aria-label="Lihat detail"
                                        @click="openDetail(trx)"
                                    >
                                        <FileText class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
                                        aria-label="Edit"
                                        @click="openEdit(trx)"
                                    >
                                        <Edit class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                                        aria-label="Hapus"
                                        @click="hapusTransaksi(trx)"
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
                :current-page="props.transaksis.current_page"
                :total-pages="props.transaksis.last_page"
                :total-items="props.transaksis.total"
                :start-index="props.transaksis.from ?? 0"
                :end-index="props.transaksis.to ?? 0"
                :per-page="props.transaksis.per_page"
                :visible-pages="visiblePages"
                @update:current-page="goToPage"
                @update:per-page="changePerPage"
            />
        </div>
    </div>

    <!-- Modal Detail Transaksi -->
    <BodyTeleport>
        <div
            v-if="showDetail && selectedTrx"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            @click.self="closeDetail"
        >
            <div
                class="w-full max-w-lg rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border"
                style="max-height: 90vh; overflow-y: auto"
            >
                <div class="mb-5 flex items-center justify-between">
                    <h2 class="text-lg font-bold">Detail Transaksi</h2>
                    <button
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                        @click="closeDetail"
                        aria-label="Tutup"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <div class="mb-4 flex flex-col gap-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">ID Transaksi</span>
                        <span
                            class="font-mono font-bold text-indigo-600 dark:text-indigo-400"
                            >{{ selectedTrx.kode }}</span
                        >
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Kasir</span>
                        <span class="font-semibold">{{
                            selectedTrx.kasir
                        }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Waktu</span>
                        <span
                            >{{ selectedTrx.waktu }},
                            {{ selectedTrx.tanggal }}</span
                        >
                    </div>
                </div>

                <div
                    class="mb-4 overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border"
                >
                    <table class="w-full text-sm">
                        <thead>
                            <tr
                                class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"
                            >
                                <th
                                    class="px-4 py-2 text-left font-semibold text-muted-foreground"
                                >
                                    Produk
                                </th>
                                <th
                                    class="px-4 py-2 text-right font-semibold text-muted-foreground"
                                >
                                    Qty
                                </th>
                                <th
                                    class="px-4 py-2 text-right font-semibold text-muted-foreground"
                                >
                                    Subtotal
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border"
                        >
                            <tr
                                v-for="(detail, idx) in selectedTrx.details"
                                :key="idx"
                            >
                                <td class="flex items-center gap-3 px-4 py-2">
                                    <img
                                        v-if="detail.foto_url"
                                        :src="detail.foto_url"
                                        :alt="detail.nama_produk"
                                        class="h-10 w-10 shrink-0 rounded-lg border border-sidebar-border/70 object-cover dark:border-sidebar-border"
                                    />
                                    <div
                                        v-else
                                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sidebar-border/70 bg-slate-100 text-[10px] font-medium text-muted-foreground dark:border-sidebar-border dark:bg-zinc-800"
                                    >
                                        Foto
                                    </div>
                                    <span>{{ detail.nama_produk }}</span>
                                </td>
                                <td class="px-4 py-2 text-right">
                                    {{ detail.jumlah }}
                                </td>
                                <td class="px-4 py-2 text-right font-medium">
                                    {{ formatRupiah(detail.subtotal) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="flex flex-col gap-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-muted-foreground"
                            >Metode Pembayaran</span
                        >
                        <span class="font-semibold">{{
                            formatMetode(selectedTrx.metode_pembayaran)
                        }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Total Belanja</span>
                        <span class="font-bold">{{
                            formatRupiah(selectedTrx.total_harga)
                        }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Dibayar</span>
                        <span>{{ formatRupiah(selectedTrx.bayar) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Kembalian</span>
                        <span class="font-semibold text-emerald-600">{{
                            formatRupiah(selectedTrx.kembalian)
                        }}</span>
                    </div>
                </div>

                <div class="mt-5 flex justify-end gap-3">
                    <button
                        class="inline-flex items-center gap-2 rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"
                        @click="openEdit(selectedTrx)"
                    >
                        <Edit class="h-4 w-4" />
                        Edit
                    </button>
                    <button
                        class="inline-flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-500/20"
                        @click="
                            hapusTransaksi(selectedTrx);
                            closeDetail();
                        "
                    >
                        <Trash2 class="h-4 w-4" />
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    </BodyTeleport>

    <!-- Modal Tambah / Edit Transaksi -->
    <BodyTeleport>
        <div
            v-if="showFormModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            @click.self="closeFormModal"
        >
            <div
                class="w-full max-w-2xl rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border"
                style="max-height: 90vh; overflow-y: auto"
            >
                <div class="mb-5 flex items-center justify-between">
                    <h2 class="text-lg font-bold">
                        {{
                            editingTransaksi
                                ? 'Edit Transaksi'
                                : 'Tambah Transaksi Baru'
                        }}
                    </h2>
                    <button
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                        @click="closeFormModal"
                        aria-label="Tutup"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <form class="flex flex-col gap-4" @submit.prevent="submitForm">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                class="mb-1.5 block text-sm font-medium"
                                for="trx-kasir"
                            >
                                Kasir
                            </label>
                            <select
                                id="trx-kasir"
                                v-model="form.id_user"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                :class="{
                                    'border-rose-500': form.errors.id_user,
                                }"
                            >
                                <option value="">Pilih kasir</option>
                                <option
                                    v-for="kasir in kasirs"
                                    :key="kasir.id"
                                    :value="String(kasir.id)"
                                >
                                    {{ kasir.name }} ({{ kasir.role }})
                                </option>
                            </select>
                            <p
                                v-if="form.errors.id_user"
                                class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                            >
                                <AlertCircle class="h-3 w-3" />{{
                                    form.errors.id_user
                                }}
                            </p>
                        </div>
                        <div>
                            <label
                                class="mb-1.5 block text-sm font-medium"
                                for="trx-metode"
                            >
                                Metode Pembayaran
                            </label>
                            <select
                                id="trx-metode"
                                v-model="form.metode_pembayaran"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            >
                                <option value="cash">Tunai</option>
                                <option value="qris">QRIS</option>
                                <option value="transfer">Transfer</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium"
                            >Item Produk</label
                        >

                        <!-- Cari & tambahkan produk ke keranjang -->
                        <ProductPicker
                            v-model="pickerModel"
                            :products="produks"
                            placeholder="Cari produk untuk ditambahkan…"
                        />

                        <div
                            v-if="form.errors.items"
                            class="mt-2 flex items-center gap-1 text-xs text-rose-600"
                        >
                            <AlertCircle class="h-3 w-3" />{{
                                form.errors.items
                            }}
                        </div>

                        <!-- Daftar produk yang sudah ditambahkan -->
                        <div
                            v-if="form.items.length > 0"
                            class="mt-3 flex flex-col gap-2"
                        >
                            <div
                                v-for="(item, index) in form.items"
                                :key="item.id_produk"
                                class="flex flex-col gap-2 rounded-lg border border-sidebar-border/70 p-3 sm:flex-row sm:items-center dark:border-sidebar-border"
                            >
                                <div class="min-w-0 flex-1">
                                    <p class="truncate text-sm font-semibold">
                                        {{ getProdukNama(item.id_produk) }}
                                    </p>
                                    <p class="text-xs text-muted-foreground">
                                        {{
                                            formatRupiah(
                                                getProdukHarga(item.id_produk),
                                            )
                                        }}
                                        · stok
                                        <span
                                            :class="
                                                getProdukStok(item.id_produk) <=
                                                0
                                                    ? 'font-semibold text-rose-600'
                                                    : ''
                                            "
                                            >{{
                                                getProdukStok(item.id_produk)
                                            }}</span
                                        >
                                    </p>
                                </div>
                                <div class="flex items-center gap-2">
                                    <!-- Stepper qty -->
                                    <div
                                        class="flex items-center rounded-lg border border-sidebar-border/70 dark:border-sidebar-border"
                                    >
                                        <button
                                            type="button"
                                            class="flex h-8 w-8 items-center justify-center rounded-l-lg text-muted-foreground transition-colors hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-zinc-800"
                                            :disabled="Number(item.jumlah) <= 1"
                                            aria-label="Kurangi"
                                            @click="decItem(index)"
                                        >
                                            <Minus class="h-3.5 w-3.5" />
                                        </button>
                                        <input
                                            v-model="item.jumlah"
                                            type="number"
                                            min="1"
                                            :max="
                                                getProdukStok(item.id_produk) ||
                                                undefined
                                            "
                                            class="h-8 w-12 border-x border-sidebar-border/70 bg-background text-center text-sm focus:outline-none dark:border-sidebar-border"
                                        />
                                        <button
                                            type="button"
                                            class="flex h-8 w-8 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                                            aria-label="Tambah"
                                            @click="incItem(index)"
                                        >
                                            <Plus class="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <div
                                        class="flex-1 text-right text-sm font-semibold sm:w-28 sm:flex-none"
                                    >
                                        {{
                                            formatRupiah(
                                                getProdukHarga(item.id_produk) *
                                                    Number(item.jumlah || 0),
                                            )
                                        }}
                                    </div>
                                    <button
                                        type="button"
                                        class="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                                        aria-label="Hapus item"
                                        @click="removeItem(index)"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Keranjang kosong -->
                        <p
                            v-else
                            class="mt-3 rounded-lg border border-dashed border-sidebar-border/70 px-3 py-4 text-center text-xs text-muted-foreground dark:border-sidebar-border"
                        >
                            Belum ada produk. Cari &amp; tambahkan lewat kolom
                            di atas.
                        </p>
                    </div>

                    <div
                        class="rounded-lg border border-sidebar-border/70 bg-slate-50/50 p-4 dark:border-sidebar-border dark:bg-zinc-800/20"
                    >
                        <div class="flex justify-between text-sm">
                            <span class="text-muted-foreground">Total</span>
                            <span class="font-bold">{{
                                formatRupiah(computedTotal)
                            }}</span>
                        </div>
                        <div class="mt-2 flex justify-between text-sm">
                            <span class="text-muted-foreground">Kembalian</span>
                            <span class="font-semibold text-emerald-600">{{
                                formatRupiah(computedKembalian)
                            }}</span>
                        </div>
                    </div>

                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium"
                            for="trx-bayar"
                        >
                            Jumlah Bayar (Rp)
                        </label>
                        <input
                            id="trx-bayar"
                            v-model="form.bayar"
                            type="number"
                            min="0"
                            placeholder="0"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            :class="{ 'border-rose-500': form.errors.bayar }"
                        />
                        <p
                            v-if="form.errors.bayar"
                            class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                        >
                            <AlertCircle class="h-3 w-3" />{{
                                form.errors.bayar
                            }}
                        </p>
                    </div>

                    <div class="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"
                            @click="closeFormModal"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                            :disabled="
                                form.processing || form.items.length === 0
                            "
                        >
                            <Save class="h-4 w-4" />
                            {{
                                form.processing
                                    ? 'Menyimpan...'
                                    : editingTransaksi
                                      ? 'Simpan Perubahan'
                                      : 'Simpan Transaksi'
                            }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </BodyTeleport>
</template>
