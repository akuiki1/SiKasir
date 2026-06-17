<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import {
    Search,
    Barcode,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    ArrowRight,
    Percent,
    X,
    ChevronUp,
    Banknote,
    QrCode,
    CreditCard,
    PackageX,
    ShoppingBag,
    LayoutGrid,
} from 'lucide-vue-next';
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { store as kasirTransaksiStore } from '@/routes/kasir/transaksi';
import { toast } from 'vue-sonner';
import { usePagination } from '@/composables/usePagination';
import Pagination from '@/components/Pagination.vue';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Transaksi',
                href: '/kasir/transaksi',
            },
        ],
    },
});

type TipeJual = 'satuan' | 'curah' | 'jasa';

interface Produk {
    id_produk: number;
    nama: string;
    kategori: string | null;
    harga_jual: number;
    potongan_reseller: number;
    stok: number;
    tipe_jual: TipeJual;
    satuan: string;
    barcode: string;
    foto: string | null;
    foto_url?: string | null;
}

interface Promo {
    id_promo: number;
    nama: string;
    deskripsi: string | null;
    tipe: 'persen' | 'nominal' | 'fix';
    nilai: number;
    id_produk: number | null;
    minimal_belanja: number | null;
}

interface Layanan {
    id_produk: number;
    nama: string;
    satuan: string;
}

interface Pelanggan {
    id_pelanggan: number;
    nama: string;
    tipe: 'umum' | 'reseller';
}

interface CartItem {
    id_produk: number;
    nama: string;
    harga: number; // harga efektif (sudah memperhitungkan potongan reseller bila berlaku)
    harga_base: number; // harga jual asli (sebelum potongan)
    potongan_reseller: number;
    qty: number;
    subtotal: number;
    stock: number;
    tipe_jual: TipeJual;
    satuan: string;
    nominal: number; // curah: rupiah dibayar · jasa: uang transfer/tarik (pass-through)
    fee: number; // hanya dipakai produk jasa (biaya admin = pendapatan)
    foto: string | null;
    foto_url?: string | null;
}

const props = defineProps<{
    produks: Produk[];
    layanan: Layanan[];
    pelanggans: Pelanggan[];
    promos: Promo[];
}>();

const searchQuery = ref('');
const isScannerDetected = ref(false);
const scannerStatusText = ref('Scanner tidak terdeteksi');
const selectedCategory = ref('');
const cartItems = ref<CartItem[]>([]);
const cartOpen = ref(false);
const scannerBuffer = ref('');
const lastScannerTime = ref(0);
const SCANNER_TIMEOUT_MS = 150;
const SCANNER_MIN_LENGTH = 3;
const QUICK_DENOMS = [5000, 10000, 20000, 50000, 100000];

interface HidDeviceInfo {
    productName?: string;
    collections?: Array<{
        usage?: number;
        usagePage?: number;
    }>;
}

interface HidDeviceApi {
    addEventListener: (type: string, listener: EventListener) => void;
    getDevices: () => Promise<HidDeviceInfo[]>;
    removeEventListener: (type: string, listener: EventListener) => void;
}

const form = useForm({
    metode_pembayaran: 'cash',
    bayar: '',
    id_pelanggan: null as number | null,
    id_promo: null as number | null,
    items: [] as Array<{ id_produk: number; jumlah: number; nominal?: number; fee?: number }>,
});

const selectedPelanggan = computed(() => props.pelanggans.find((p) => p.id_pelanggan === form.id_pelanggan) ?? null);
const isReseller = computed(() => selectedPelanggan.value?.tipe === 'reseller');

// Harga efektif per item: reseller dipotong rupiah per produk; jasa tak terpengaruh.
function effectiveHarga(item: CartItem): number {
    if (isReseller.value && item.tipe_jual !== 'jasa') {
        return Math.max(0, item.harga_base - (item.potongan_reseller || 0));
    }

    return item.harga_base;
}

// Field harga awal saat produk ditambahkan ke keranjang (ikut status reseller saat itu).
function basePricing(product: Produk): { harga: number; harga_base: number; potongan_reseller: number } {
    const potongan = product.potongan_reseller ?? 0;

    return {
        harga_base: product.harga_jual,
        potongan_reseller: potongan,
        harga: isReseller.value ? Math.max(0, product.harga_jual - potongan) : product.harga_jual,
    };
}

// Hitung ulang harga & subtotal seluruh keranjang saat pelanggan berubah.
function applyPricing(): void {
    cartItems.value.forEach((item) => {
        if (item.tipe_jual === 'jasa') {
            return;
        }

        item.harga = effectiveHarga(item);

        if (item.tipe_jual === 'curah') {
            recomputeCurahItem(item);
        } else {
            item.subtotal = item.harga * item.qty;
        }
    });
}

watch(() => form.id_pelanggan, applyPricing);

const categories = computed(() => {
    const set = new Set<string>();
    props.produks.forEach((product) => {
        if (product.kategori) {
            set.add(product.kategori);
        }
    });

    return Array.from(set).sort((a, b) => a.localeCompare(b, 'id-ID'));
});

// Map promo per-produk. Dideklarasikan sebelum filteredProduks/usePagination karena
// watch() di dalam usePagination meng-evaluasi getter source secara eager saat setup;
// jika ditaruh di bawah, terkena temporal dead zone (Cannot access before initialization).
const activeProductPromos = computed(() =>
    new Map(props.promos
        .filter((promo) => promo.id_produk !== null)
        .map((promo) => [promo.id_produk as number, promo]),
    ),
);

const filteredProduks = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    const promoIds = activeProductPromos.value;

    return props.produks
        .filter((product) => {
            const matchesSearch =
                !query ||
                product.nama.toLowerCase().includes(query) ||
                product.kategori?.toLowerCase().includes(query);

            const matchesCategory =
                !selectedCategory.value || product.kategori === selectedCategory.value;

            return matchesSearch && matchesCategory;
        })
        // Produk yang sedang promo tampil paling depan (urutan lain tetap).
        .sort((a, b) => {
            const aPromo = promoIds.has(a.id_produk) ? 1 : 0;
            const bPromo = promoIds.has(b.id_produk) ? 1 : 0;

            return bPromo - aPromo;
        });
});

const { currentPage, perPage, totalItems, totalPages, paginatedItems: paginatedProduks, startIndex, endIndex, goToPage, visiblePages } = usePagination(() => filteredProduks.value, 10);

function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

// Kuantitas curah bisa pecahan (mis. 1,429 liter) — tampilkan rapi.
function formatQty(value: number): string {
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 3 }).format(Number(value) || 0);
}

// Curah: dari nominal rupiah → qty = nominal ÷ harga/satuan (3 desimal), subtotal = nominal persis.
// Tidak menulis ulang item.nominal agar kasir tetap bisa mengosongkan input saat mengetik.
function recomputeCurahItem(item: CartItem): void {
    const nominal = Math.max(0, Number(item.nominal) || 0);
    item.qty = item.harga > 0 ? Math.round((nominal / item.harga) * 1000) / 1000 : 0;
    item.subtotal = Math.round(nominal);
}

// Jasa: subtotal/omzet = fee saja. Nominal pokok TIDAK masuk subtotal (pass-through).
function recomputeJasaItem(item: CartItem): void {
    const fee = Math.max(0, Number(item.fee) || 0);
    item.harga = fee;
    item.subtotal = fee;
    item.qty = 1;
}

function resolveFoto(foto: string | null): string | null {
    if (!foto) {
        return null;
    }

    if (foto.startsWith('http://') || foto.startsWith('https://') || foto.startsWith('/')) {
        return foto;
    }

    return `/storage/${foto}`;
}

function getHidApi(): HidDeviceApi | null {
    if (typeof navigator === 'undefined') {
        return null;
    }

    return (navigator as Navigator & { hid?: HidDeviceApi }).hid ?? null;
}

function looksLikeBarcodeScanner(device: HidDeviceInfo): boolean {
    const productName = device.productName?.toLowerCase() ?? '';
    const productNameLooksLikeScanner =
        productName.includes('barcode') ||
        productName.includes('scanner') ||
        productName.includes('scan') ||
        productName.includes('qr');

    const hasBarcodeUsagePage = device.collections?.some((collection) => collection.usagePage === 0x8c) ?? false;

    return productNameLooksLikeScanner || hasBarcodeUsagePage;
}

function markScannerDetected(message = 'Scanner terhubung'): void {
    isScannerDetected.value = true;
    scannerStatusText.value = message;
}

function markScannerNotDetected(): void {
    isScannerDetected.value = false;
    scannerStatusText.value = 'Scanner tidak terdeteksi';
}

async function detectScannerDevice(): Promise<void> {
    const hid = getHidApi();

    if (!hid) {
        markScannerNotDetected();

        return;
    }

    try {
        const devices = await hid.getDevices();
        const scanner = devices.find((device) => looksLikeBarcodeScanner(device));

        if (scanner) {
            markScannerDetected('Scanner terhubung');

            return;
        }

        markScannerNotDetected();
    } catch {
        markScannerNotDetected();
    }
}

const handleScannerDeviceConnectionChange = (): void => {
    void detectScannerDevice();
};

function addToCart(product: Produk) {
    const existing = cartItems.value.find((item) => item.id_produk === product.id_produk);

    // Produk curah: kasir mengisi NOMINAL rupiah di keranjang, bukan stepper qty.
    if (product.tipe_jual === 'curah') {
        if (!existing) {
            if (product.stok <= 0) {
                return;
            }

            cartItems.value.push({
                id_produk: product.id_produk,
                nama: product.nama,
                ...basePricing(product),
                qty: 0,
                subtotal: 0,
                stock: product.stok,
                tipe_jual: 'curah',
                satuan: product.satuan,
                nominal: 0,
                fee: 0,
                foto: product.foto,
                foto_url: product.foto_url ?? null,
            });
        }

        cartOpen.value = true; // buka keranjang agar kasir bisa langsung isi nominal

        return;
    }

    if (existing) {
        if (existing.qty < existing.stock) {
            existing.qty += 1;
            existing.subtotal = existing.harga * existing.qty;
        }

        return;
    }

    if (product.stok <= 0) {
        return;
    }

    const pricing = basePricing(product);

    cartItems.value.push({
        id_produk: product.id_produk,
        nama: product.nama,
        ...pricing,
        qty: 1,
        subtotal: pricing.harga,
        stock: product.stok,
        tipe_jual: product.tipe_jual,
        satuan: product.satuan,
        nominal: 0,
        fee: 0,
        foto: product.foto,
        foto_url: product.foto_url ?? null,
    });
}

// Layanan/jasa (transfer, tarik tunai): kasir isi nominal pokok + fee secara manual.
function addLayanan(item: Layanan) {
    const existing = cartItems.value.find((cart) => cart.id_produk === item.id_produk);

    if (!existing) {
        cartItems.value.push({
            id_produk: item.id_produk,
            nama: item.nama,
            harga: 0,
            harga_base: 0,
            potongan_reseller: 0,
            qty: 1,
            subtotal: 0,
            stock: Number.POSITIVE_INFINITY,
            tipe_jual: 'jasa',
            satuan: item.satuan,
            nominal: 0,
            fee: 0,
            foto: null,
            foto_url: null,
        });
    }

    cartOpen.value = true; // buka keranjang agar kasir bisa isi nominal & fee
}

function removeCartItem(id: number) {
    cartItems.value = cartItems.value.filter((item) => item.id_produk !== id);
}

function updateItemQuantity(item: CartItem, delta: number) {
    const nextQty = item.qty + delta;

    if (nextQty < 1 || nextQty > item.stock) {

        return;
    }

    item.qty = nextQty;
    item.subtotal = item.harga * item.qty;
}

// Hanya produk satuan yang dihitung per qty; curah & jasa dihitung 1 baris.
const cartCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + (item.tipe_jual === 'satuan' ? item.qty : 1), 0),
);

// Baris curah yang belum valid: nominal belum diisi atau qty melebihi stok.
const invalidCurahItems = computed(() =>
    cartItems.value.filter(
        (item) => item.tipe_jual === 'curah' && ((Number(item.nominal) || 0) <= 0 || item.qty > item.stock),
    ),
);

// Baris jasa yang belum valid: fee atau nominal pokok belum diisi.
const invalidJasaItems = computed(() =>
    cartItems.value.filter(
        (item) => item.tipe_jual === 'jasa' && ((Number(item.fee) || 0) <= 0 || (Number(item.nominal) || 0) <= 0),
    ),
);

const hasInvalidItems = computed(() => invalidCurahItems.value.length > 0 || invalidJasaItems.value.length > 0);

const cartQtyById = computed(() => {
    const map = new Map<number, number>();
    cartItems.value.forEach((item) => map.set(item.id_produk, item.qty));

    return map;
});

const totalHarga = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.subtotal, 0);
});

const globalPromos = computed(() => props.promos.filter((promo) => promo.id_produk === null));

const selectedPromo = computed(() => {
    return props.promos.find((promo) => promo.id_promo === form.id_promo) ?? null;
});

function calculateItemPromoDiscount(item: CartItem): number {
    const promo = activeProductPromos.value.get(item.id_produk);

    if (!promo) {
        return 0;
    }

    if (promo.tipe === 'persen') {
        return Math.floor(item.subtotal * (promo.nilai / 100));
    }

    return Math.floor(promo.nilai * item.qty);
}

const productPromoDiscount = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + calculateItemPromoDiscount(item), 0);
});

const globalPromoDiscount = computed(() => {
    if (!selectedPromo.value) {
        return 0;
    }

    if (selectedPromo.value.minimal_belanja && totalHarga.value < selectedPromo.value.minimal_belanja) {
        return 0;
    }

    if (selectedPromo.value.tipe === 'persen') {
        return Math.floor(totalHarga.value * (selectedPromo.value.nilai / 100));
    }

    return Math.floor(selectedPromo.value.nilai);
});

const totalDiscount = computed(() => Math.max(0, productPromoDiscount.value + globalPromoDiscount.value));

const totalAfterDiscount = computed(() => Math.max(0, totalHarga.value - totalDiscount.value));

const kembalian = computed(() => {
    const bayar = Number(form.bayar) || 0;

    return Math.max(0, bayar - totalAfterDiscount.value);
});

const isPaid = computed(() => (Number(form.bayar) || 0) >= totalAfterDiscount.value);

const paymentMethods = [
    { value: 'cash', label: 'Tunai', icon: Banknote },
    { value: 'qris', label: 'QRIS', icon: QrCode },
    { value: 'transfer', label: 'Transfer', icon: CreditCard },
] as const;

const cashSuggestions = computed(() => {
    const total = totalAfterDiscount.value;

    if (total <= 0) {
        return [];
    }

    const rounded = Math.ceil(total / 10000) * 10000;
    const set = new Set<number>([rounded, ...QUICK_DENOMS.filter((denom) => denom >= total)]);

    return Array.from(set)
        .filter((value) => value >= total)
        .sort((a, b) => a - b)
        .slice(0, 3);
});

function handleScannerKeydown(event: KeyboardEvent) {
    if (event.defaultPrevented) {
        return;
    }

    const now = performance.now();

    if (now - lastScannerTime.value > SCANNER_TIMEOUT_MS) {
        scannerBuffer.value = '';
    }

    lastScannerTime.value = now;

    if (event.key === 'Enter') {
        const barcode = scannerBuffer.value.trim();

        if (barcode.length >= SCANNER_MIN_LENGTH) {
            event.preventDefault();
            markScannerDetected('Scanner terhubung');
            scanBarcode(barcode);
        }

        scannerBuffer.value = '';

        return;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
        scannerBuffer.value += event.key;
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleScannerKeydown);
    void detectScannerDevice();

    const hid = getHidApi();

    hid?.addEventListener('connect', handleScannerDeviceConnectionChange);
    hid?.addEventListener('disconnect', handleScannerDeviceConnectionChange);
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleScannerKeydown);

    const hid = getHidApi();

    hid?.removeEventListener('connect', handleScannerDeviceConnectionChange);
    hid?.removeEventListener('disconnect', handleScannerDeviceConnectionChange);
});

function scanBarcode(barcode: string): void {
    const code = barcode.trim();

    if (!code) {
        return;
    }

    const produk = props.produks.find((item) => item.barcode === code);

    if (!produk) {
        toast.error('Produk tidak ditemukan', {
            description: `Barcode "${code}" tidak cocok dengan produk manapun.`,
            duration: 5000,
        });

        return;
    }

    if (produk.stok <= 0) {
        toast.warning('Stok habis', {
            description: `Produk "${produk.nama}" sedang tidak tersedia.`,
            duration: 4000,
        });

        return;
    }

    addToCart(produk);
    toast.success('Produk ditambahkan', {
        description: `"${produk.nama}" masuk ke keranjang.`,
        duration: 3000,
    });
}

function submitTransaction() {
    if (cartItems.value.length === 0) {
        return;
    }

    if (hasInvalidItems.value) {
        cartOpen.value = true;

        return;
    }

    form.items = cartItems.value.map((item) => {
        if (item.tipe_jual === 'curah') {
            return { id_produk: item.id_produk, jumlah: item.qty, nominal: Math.floor(Number(item.nominal) || 0) };
        }

        if (item.tipe_jual === 'jasa') {
            return {
                id_produk: item.id_produk,
                jumlah: 1,
                nominal: Math.floor(Number(item.nominal) || 0),
                fee: Math.floor(Number(item.fee) || 0),
            };
        }

        return { id_produk: item.id_produk, jumlah: item.qty };
    });

    form.post(kasirTransaksiStore().url, {
        preserveScroll: true,
        onSuccess: () => {
            cartItems.value = [];
            form.bayar = '';
            form.id_promo = null;
            form.id_pelanggan = null;
            cartOpen.value = false;
        },
    });
}
</script>

<template>
    <Head title="Transaksi Baru - Kasir" />

    <div class="relative flex h-full flex-1 flex-col overflow-hidden lg:flex-row lg:gap-6 lg:p-6">
        <!-- ============ PRODUK ============ -->
        <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
            <!-- Header + pencarian + kategori (tetap di atas, tidak ikut scroll) -->
            <div class="shrink-0 space-y-4 px-4 pt-4 sm:px-6 sm:pt-6 lg:px-0 lg:pt-0">
                <div class="flex flex-col gap-1">
                    <h1 class="text-2xl font-extrabold tracking-tight sm:text-3xl">Transaksi Baru</h1>
                    <p class="hidden text-sm text-muted-foreground sm:block">
                        Pilih produk atau scan barcode untuk menambahkannya ke keranjang.
                    </p>
                </div>

                <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div class="relative flex-1">
                        <Search class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Cari produk..."
                            class="w-full rounded-xl border border-sidebar-border/70 bg-background py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                        />
                    </div>
                    <div
                        role="status"
                        :class="[
                            'inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold sm:text-sm',
                            isScannerDetected
                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                : 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400',
                        ]"
                    >
                        <Barcode class="h-4 w-4" />
                        <span
                            :class="[
                                'h-2 w-2 rounded-full',
                                isScannerDetected ? 'bg-emerald-500' : 'bg-rose-500',
                            ]"
                        ></span>
                        <span class="hidden sm:inline">{{ scannerStatusText }}</span>
                    </div>
                </div>

                <!-- Filter kategori -->
                <div v-if="categories.length" class="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
                    <button
                        type="button"
                        :class="[
                            'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition',
                            selectedCategory === ''
                                ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                : 'border-sidebar-border/70 bg-background text-muted-foreground hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800',
                        ]"
                        @click="selectedCategory = ''"
                    >
                        <LayoutGrid class="h-3.5 w-3.5" />
                        Semua
                    </button>
                    <button
                        v-for="cat in categories"
                        :key="cat"
                        type="button"
                        :class="[
                            'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition',
                            selectedCategory === cat
                                ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                : 'border-sidebar-border/70 bg-background text-muted-foreground hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800',
                        ]"
                        @click="selectedCategory = cat"
                    >
                        {{ cat }}
                    </button>
                </div>

                <!-- Layanan (transfer / tarik tunai) — produk jasa, fee diisi di keranjang -->
                <div v-if="layanan.length" class="flex flex-wrap items-center gap-2">
                    <span class="text-xs font-semibold text-muted-foreground">Layanan:</span>
                    <button
                        v-for="svc in layanan"
                        :key="svc.id_produk"
                        type="button"
                        class="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-500/20 dark:text-violet-300"
                        @click="addLayanan(svc)"
                    >
                        <CreditCard class="h-3.5 w-3.5" />
                        {{ svc.nama }}
                    </button>
                </div>
            </div>

            <!-- Grid produk (area scroll) -->
            <div class="flex-1 overflow-y-auto px-4 pt-4 pb-28 sm:px-6 lg:px-0 lg:pb-4">
                <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
                    <button
                        v-for="product in paginatedProduks"
                        :key="product.id_produk"
                        type="button"
                        :disabled="product.stok === 0"
                        :class="[
                            'group relative flex flex-col overflow-hidden rounded-2xl border bg-card text-left shadow-sm transition-all duration-200',
                            product.stok > 0
                                ? 'border-sidebar-border/70 hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-md active:scale-[0.98] dark:border-sidebar-border'
                                : 'cursor-not-allowed border-sidebar-border/40 opacity-60',
                        ]"
                        @click="addToCart(product)"
                    >
                        <div class="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-zinc-900">
                            <img
                                v-if="resolveFoto(product.foto_url ?? product.foto)"
                                :src="resolveFoto(product.foto_url ?? product.foto) ?? undefined"
                                :alt="product.nama"
                                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div
                                v-else
                                class="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground"
                            >
                                <PackageX class="h-7 w-7 opacity-40" />
                            </div>

                            <!-- Badge promo -->
                            <span
                                v-if="activeProductPromos.get(product.id_produk)"
                                class="absolute left-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow"
                            >
                                <Percent class="h-2.5 w-2.5" />
                                {{ activeProductPromos.get(product.id_produk)?.tipe === 'persen' ? `${activeProductPromos.get(product.id_produk)?.nilai}%` : 'Promo' }}
                            </span>

                            <!-- Badge qty di keranjang -->
                            <span
                                v-if="cartQtyById.get(product.id_produk)"
                                class="absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-bold text-white shadow-md ring-2 ring-white dark:ring-zinc-900"
                            >
                                {{ formatQty(cartQtyById.get(product.id_produk)!) }}
                            </span>

                            <!-- Overlay habis -->
                            <div
                                v-if="product.stok === 0"
                                class="absolute inset-0 flex items-center justify-center bg-slate-900/40"
                            >
                                <span class="rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white">Stok Habis</span>
                            </div>
                        </div>

                        <div class="flex flex-1 flex-col p-3">
                            <span class="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                {{ product.kategori ?? 'Umum' }}
                            </span>
                            <h3 class="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                                {{ product.nama }}
                            </h3>
                            <div class="mt-2 flex items-end justify-between gap-2 pt-1">
                                <div class="min-w-0">
                                    <p class="truncate text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                        {{ formatRupiah(product.harga_jual) }}<span v-if="product.tipe_jual === 'curah'" class="text-[10px] font-medium text-muted-foreground"> / {{ product.satuan }}</span>
                                    </p>
                                    <p
                                        :class="[
                                            'text-[10px] font-medium',
                                            product.stok > 10
                                                ? 'text-muted-foreground'
                                                : product.stok > 0
                                                ? 'text-amber-600 dark:text-amber-400'
                                                : 'text-rose-600 dark:text-rose-400',
                                        ]"
                                    >
                                        {{ product.stok > 0 ? `Stok ${formatQty(product.stok)} ${product.satuan}` : 'Habis' }}
                                    </p>
                                </div>
                                <span
                                    v-if="product.stok > 0"
                                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm transition group-hover:bg-indigo-500"
                                >
                                    <Plus class="h-4 w-4" />
                                </span>
                            </div>
                        </div>
                    </button>
                </div>

                <div v-if="filteredProduks.length === 0" class="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
                    <PackageX class="h-10 w-10 opacity-40" />
                    <p class="font-medium">Tidak ada produk yang sesuai pencarian.</p>
                </div>

                <Pagination
                    v-if="filteredProduks.length > 0"
                    class="mt-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border"
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

        <!-- ============ Backdrop drawer (mobile) ============ -->
        <Transition
            enter-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            leave-active-class="transition-opacity duration-200"
            leave-to-class="opacity-0"
        >
            <div
                v-if="cartOpen"
                class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                @click="cartOpen = false"
            ></div>
        </Transition>

        <!-- ============ KERANJANG (kolom desktop / drawer mobile) ============ -->
        <aside
            :class="[
                'flex flex-col bg-card shadow-2xl transition-transform duration-300 ease-out',
                'fixed inset-x-0 bottom-0 z-50 max-h-[88vh] rounded-t-3xl border-t border-sidebar-border/70 dark:border-sidebar-border',
                cartOpen ? 'translate-y-0' : 'translate-y-full',
                'lg:static lg:z-auto lg:max-h-none lg:w-[380px] lg:translate-y-0 lg:rounded-2xl lg:border lg:shadow-sm',
            ]"
        >
            <!-- Header keranjang -->
            <div class="shrink-0">
                <!-- handle drawer (mobile) -->
                <div class="flex justify-center pt-2.5 lg:hidden">
                    <span class="h-1.5 w-10 rounded-full bg-slate-300 dark:bg-zinc-700"></span>
                </div>
                <div class="flex items-center justify-between border-b border-sidebar-border/70 px-4 py-3.5 dark:border-sidebar-border">
                    <div class="flex items-center gap-2">
                        <ShoppingCart class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <h2 class="font-bold tracking-tight">Keranjang</h2>
                        <span class="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {{ cartCount }}
                        </span>
                    </div>
                    <button
                        type="button"
                        class="rounded-lg p-1.5 text-muted-foreground transition hover:bg-slate-100 lg:hidden dark:hover:bg-zinc-800"
                        @click="cartOpen = false"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>
            </div>

            <!-- Daftar item (scroll) -->
            <div class="flex-1 divide-y divide-sidebar-border/70 overflow-y-auto dark:divide-sidebar-border">
                <div
                    v-if="cartItems.length === 0"
                    class="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center"
                >
                    <div class="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800">
                        <ShoppingBag class="h-7 w-7 text-muted-foreground" />
                    </div>
                    <p class="text-sm font-medium text-muted-foreground">Keranjang masih kosong</p>
                    <p class="text-xs text-muted-foreground">Pilih produk atau scan barcode untuk memulai.</p>
                </div>
                <div
                    v-for="item in cartItems"
                    :key="item.id_produk"
                    class="px-4 py-3 transition-colors hover:bg-slate-50/60 dark:hover:bg-zinc-800/20"
                >
                    <div class="flex items-center gap-3">
                        <img
                            v-if="resolveFoto(item.foto_url ?? item.foto)"
                            :src="resolveFoto(item.foto_url ?? item.foto) ?? undefined"
                            :alt="item.nama"
                            class="h-12 w-12 shrink-0 rounded-xl border border-sidebar-border/70 object-cover dark:border-sidebar-border"
                        />
                        <div
                            v-else
                            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sidebar-border/70 bg-slate-100 text-muted-foreground dark:border-sidebar-border dark:bg-zinc-800"
                        >
                            <PackageX class="h-5 w-5 opacity-50" />
                        </div>

                        <div class="min-w-0 flex-1">
                            <h4 class="truncate text-sm font-semibold text-foreground">{{ item.nama }}</h4>
                            <p v-if="item.tipe_jual === 'jasa'" class="text-xs text-muted-foreground">Biaya admin (fee)</p>
                            <p v-else class="text-xs text-muted-foreground">
                                {{ formatRupiah(item.harga) }}<span v-if="item.tipe_jual === 'curah'"> / {{ item.satuan }}</span>
                            </p>
                            <p class="text-sm font-bold text-indigo-600 dark:text-indigo-400">{{ formatRupiah(item.subtotal) }}</p>
                        </div>

                        <div class="flex flex-col items-end gap-1.5">
                            <button
                                type="button"
                                class="rounded-lg p-1 text-muted-foreground transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                                @click="removeCartItem(item.id_produk)"
                            >
                                <Trash2 class="h-4 w-4" />
                            </button>
                            <div
                                v-if="item.tipe_jual !== 'curah'"
                                class="flex items-center gap-1 rounded-lg border border-sidebar-border/70 p-0.5 dark:border-sidebar-border"
                            >
                                <button
                                    type="button"
                                    class="flex h-7 w-7 items-center justify-center rounded-md text-foreground transition hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-zinc-800"
                                    @click="updateItemQuantity(item, -1)"
                                >
                                    <Minus class="h-3.5 w-3.5" />
                                </button>
                                <span class="min-w-7 text-center text-sm font-bold tabular-nums select-none">{{ item.qty }}</span>
                                <button
                                    type="button"
                                    class="flex h-7 w-7 items-center justify-center rounded-md text-foreground transition hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-zinc-800"
                                    :disabled="item.qty >= item.stock"
                                    @click="updateItemQuantity(item, 1)"
                                >
                                    <Plus class="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Input nominal (rupiah) untuk produk curah -->
                    <div v-if="item.tipe_jual === 'curah'" class="mt-2 space-y-1">
                        <div class="relative">
                            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">Rp</span>
                            <input
                                v-model.number="item.nominal"
                                type="number"
                                min="0"
                                inputmode="numeric"
                                placeholder="Nominal pembelian (mis. 20000)"
                                :class="[
                                    'w-full rounded-lg border bg-background py-2 pl-8 pr-3 text-sm font-semibold transition focus:ring-2 focus:ring-indigo-500/20 focus:outline-none',
                                    item.nominal > 0 && item.qty > item.stock
                                        ? 'border-rose-500 focus:border-rose-500'
                                        : 'border-sidebar-border/70 focus:border-indigo-500 dark:border-sidebar-border',
                                ]"
                                @input="recomputeCurahItem(item)"
                            />
                        </div>
                        <p v-if="item.nominal > 0 && item.qty <= item.stock" class="text-xs text-muted-foreground">
                            ≈ {{ formatQty(item.qty) }} {{ item.satuan }} · stok {{ formatQty(item.stock) }} {{ item.satuan }}
                        </p>
                        <p v-else-if="item.qty > item.stock" class="text-xs font-medium text-rose-600 dark:text-rose-400">
                            Melebihi stok: butuh {{ formatQty(item.qty) }} {{ item.satuan }}, tersedia {{ formatQty(item.stock) }} {{ item.satuan }}.
                        </p>
                        <p v-else class="text-xs text-amber-600 dark:text-amber-400">
                            Masukkan nominal pembelian dulu.
                        </p>
                    </div>

                    <!-- Input nominal pokok + fee untuk jasa (transfer/tarik tunai) -->
                    <div v-if="item.tipe_jual === 'jasa'" class="mt-2 space-y-2">
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <label class="mb-1 block text-[11px] font-medium text-muted-foreground">Nominal transfer/tarik</label>
                                <div class="relative">
                                    <span class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">Rp</span>
                                    <input
                                        v-model.number="item.nominal"
                                        type="number"
                                        min="0"
                                        inputmode="numeric"
                                        placeholder="500000"
                                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-7 pr-2 text-sm font-semibold transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                                    />
                                </div>
                            </div>
                            <div>
                                <label class="mb-1 block text-[11px] font-medium text-muted-foreground">Biaya admin (fee)</label>
                                <div class="relative">
                                    <span class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">Rp</span>
                                    <input
                                        v-model.number="item.fee"
                                        type="number"
                                        min="0"
                                        inputmode="numeric"
                                        placeholder="5000"
                                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-7 pr-2 text-sm font-semibold transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                                        @input="recomputeJasaItem(item)"
                                    />
                                </div>
                            </div>
                        </div>
                        <p
                            v-if="(Number(item.fee) || 0) > 0 && (Number(item.nominal) || 0) > 0"
                            class="text-[11px] text-muted-foreground"
                        >
                            Hanya fee {{ formatRupiah(item.fee) }} masuk omzet · nominal {{ formatRupiah(item.nominal) }} hanya titipan.
                        </p>
                        <p v-else class="text-[11px] text-amber-600 dark:text-amber-400">
                            Isi nominal transfer/tarik & biaya admin.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Ringkasan + pembayaran -->
            <div class="shrink-0 space-y-3 border-t border-sidebar-border/70 bg-slate-50/60 p-4 dark:border-sidebar-border dark:bg-zinc-900/40">
                <!-- Metode pembayaran -->
                <div class="grid grid-cols-3 gap-2">
                    <button
                        v-for="method in paymentMethods"
                        :key="method.value"
                        type="button"
                        :class="[
                            'flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs font-semibold transition',
                            form.metode_pembayaran === method.value
                                ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                : 'border-sidebar-border/70 bg-background text-muted-foreground hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800',
                        ]"
                        @click="form.metode_pembayaran = method.value"
                    >
                        <component :is="method.icon" class="h-4 w-4" />
                        {{ method.label }}
                    </button>
                </div>

                <!-- Pelanggan (default Umum; reseller dapat potongan harga per produk) -->
                <div>
                    <select
                        v-model.number="form.id_pelanggan"
                        class="w-full rounded-xl border border-sidebar-border/70 bg-background px-3 py-2 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                    >
                        <option :value="null">Pelanggan: Umum</option>
                        <option v-for="p in pelanggans" :key="p.id_pelanggan" :value="p.id_pelanggan">
                            {{ p.nama }}{{ p.tipe === 'reseller' ? ' (Reseller)' : '' }}
                        </option>
                    </select>
                    <p v-if="isReseller" class="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        Harga reseller diterapkan ke produk yang punya potongan.
                    </p>
                </div>

                <!-- Promo -->
                <select
                    v-model.number="form.id_promo"
                    class="w-full rounded-xl border border-sidebar-border/70 bg-background px-3 py-2 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                >
                    <option :value="null">Tanpa promo tambahan</option>
                    <option
                        v-for="promo in globalPromos"
                        :key="promo.id_promo"
                        :value="promo.id_promo"
                    >
                        {{ promo.nama }}
                    </option>
                </select>
                <p v-if="selectedPromo && selectedPromo.minimal_belanja && totalHarga < selectedPromo.minimal_belanja" class="-mt-1 text-xs text-amber-600 dark:text-amber-400">
                    Minimal belanja {{ formatRupiah(selectedPromo.minimal_belanja) }} untuk promo ini.
                </p>

                <!-- Input bayar -->
                <div class="space-y-2">
                    <div class="relative">
                        <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</span>
                        <input
                            v-model="form.bayar"
                            type="number"
                            min="0"
                            inputmode="numeric"
                            placeholder="Jumlah uang diterima"
                            class="w-full rounded-xl border border-sidebar-border/70 bg-background py-2.5 pl-9 pr-3 text-sm font-semibold transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                        />
                    </div>
                    <div v-if="form.metode_pembayaran === 'cash' && cashSuggestions.length" class="flex flex-wrap gap-2">
                        <button
                            type="button"
                            class="rounded-lg border border-indigo-500/30 bg-indigo-500/5 px-2.5 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-500/10 dark:text-indigo-400"
                            @click="form.bayar = String(totalAfterDiscount)"
                        >
                            Uang Pas
                        </button>
                        <button
                            v-for="amount in cashSuggestions"
                            :key="amount"
                            type="button"
                            class="rounded-lg border border-sidebar-border/70 bg-background px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800"
                            @click="form.bayar = String(amount)"
                        >
                            {{ formatRupiah(amount) }}
                        </button>
                    </div>
                    <p v-if="form.errors.bayar" class="text-xs text-rose-600">{{ form.errors.bayar }}</p>
                </div>

                <!-- Rincian harga -->
                <div class="space-y-1.5 rounded-xl border border-sidebar-border/70 bg-background p-3 dark:border-sidebar-border">
                    <div class="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Subtotal</span>
                        <span class="tabular-nums">{{ formatRupiah(totalHarga) }}</span>
                    </div>
                    <div v-if="totalDiscount > 0" class="flex items-center justify-between text-xs">
                        <span class="text-muted-foreground">Diskon</span>
                        <span class="font-medium text-emerald-600 tabular-nums dark:text-emerald-400">-{{ formatRupiah(totalDiscount) }}</span>
                    </div>
                    <div class="flex items-center justify-between border-t border-sidebar-border/70 pt-2 dark:border-sidebar-border">
                        <span class="text-sm font-bold">Total</span>
                        <span class="text-xl font-extrabold text-indigo-600 tabular-nums dark:text-indigo-400">{{ formatRupiah(totalAfterDiscount) }}</span>
                    </div>
                    <div v-if="Number(form.bayar) > 0" class="flex items-center justify-between text-xs">
                        <span class="text-muted-foreground">Kembalian</span>
                        <span
                            :class="[
                                'font-semibold tabular-nums',
                                isPaid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
                            ]"
                        >
                            {{ isPaid ? formatRupiah(kembalian) : 'Uang kurang' }}
                        </span>
                    </div>
                </div>

                <p v-if="hasInvalidItems" class="-mb-1 text-center text-xs font-medium text-amber-600 dark:text-amber-400">
                    Lengkapi nominal/fee item curah & jasa, dan pastikan tidak melebihi stok.
                </p>

                <button
                    type="button"
                    class="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="cartItems.length === 0 || form.processing || hasInvalidItems"
                    @click="submitTransaction"
                >
                    {{ form.processing ? 'Memproses...' : 'Proses Pembayaran' }}
                    <ArrowRight v-if="!form.processing" class="h-4 w-4" />
                </button>
            </div>
        </aside>

        <!-- ============ Bottom bar keranjang (mobile) ============ -->
        <div class="fixed inset-x-0 bottom-0 z-30 border-t border-sidebar-border/70 bg-card/95 p-3 backdrop-blur lg:hidden dark:border-sidebar-border">
            <button
                type="button"
                class="flex w-full items-center justify-between gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-white shadow-lg transition active:scale-[0.99]"
                @click="cartOpen = true"
            >
                <span class="relative flex items-center gap-2">
                    <ShoppingCart class="h-5 w-5" />
                    <span class="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-indigo-600">
                        {{ cartCount }}
                    </span>
                </span>
                <span class="flex flex-1 flex-col items-start leading-tight">
                    <span class="text-[11px] font-medium text-indigo-100">{{ cartItems.length }} produk</span>
                    <span class="text-base font-extrabold tabular-nums">{{ formatRupiah(totalAfterDiscount) }}</span>
                </span>
                <span class="flex items-center gap-1 text-sm font-bold">
                    Lihat
                    <ChevronUp class="h-4 w-4" />
                </span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
