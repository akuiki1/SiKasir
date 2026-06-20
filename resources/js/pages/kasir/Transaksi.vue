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
    Lock,
    Zap,
    Users,
    ChevronDown,
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

interface Pelanggan {
    id_pelanggan: number;
    nama: string;
    tipe: 'umum' | 'reseller';
}

interface TarifJasa {
    min_nominal: number;
    fee: number;
}

interface Layanan {
    id_produk: number;
    nama: string;
    satuan: string;
    tarifs: TarifJasa[];
}

interface CartItem {
    uid: number; // id baris unik (jasa bisa muncul berkali-kali dengan nominal berbeda)
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
    nominal: number; // curah: rupiah yang dibayar (qty = nominal ÷ harga); jasa: nominal titipan
    fee: number; // jasa: biaya admin (satu-satunya pendapatan); 0 untuk produk lain
    tarifs: TarifJasa[]; // jasa: tarif bertingkat (kosong = fee diketik manual)
    foto: string | null;
    foto_url?: string | null;
}

const props = defineProps<{
    produks: Produk[];
    favorite_ids: number[];
    pelanggans: Pelanggan[];
    promos: Promo[];
    layanan: Layanan[];
}>();

const searchQuery = ref('');
const isScannerDetected = ref(false);
const scannerStatusText = ref('Scanner tidak terdeteksi');
const selectedCategory = ref('');
const cartItems = ref<CartItem[]>([]);
const cartOpen = ref(false);
const showOptions = ref(false); // pelanggan & promo dilipat (progressive disclosure)
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

// Penanda baris keranjang yang unik (produk dedup by id_produk, jasa selalu baris baru).
let cartUidSeq = 0;
const nextUid = (): number => ++cartUidSeq;

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

// Produk "sering dibeli" untuk quick-pick (urutan dari backend = top seller, masih berstok).
const favoriteProducts = computed(() =>
    props.favorite_ids
        .map((id) => props.produks.find((p) => p.id_produk === id))
        .filter((p): p is Produk => !!p && p.stok > 0),
);

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
                uid: nextUid(),
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
                tarifs: [],
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
        uid: nextUid(),
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
        tarifs: [],
        foto: product.foto,
        foto_url: product.foto_url ?? null,
    });
}

// Tambah baris jasa ke keranjang yang sama. Selalu baris baru: satu layanan bisa
// dipakai berkali-kali dengan nominal/fee berbeda dalam satu transaksi.
function addJasaToCart(svc: Layanan) {
    cartItems.value.push({
        uid: nextUid(),
        id_produk: svc.id_produk,
        nama: svc.nama,
        harga: 0,
        harga_base: 0,
        potongan_reseller: 0,
        qty: 1,
        subtotal: 0,
        stock: 0,
        tipe_jual: 'jasa',
        satuan: svc.satuan,
        nominal: 0,
        fee: 0,
        tarifs: svc.tarifs ?? [],
        foto: null,
        foto_url: null,
    });

    cartOpen.value = true; // buka keranjang agar kasir langsung isi nominal & fee
}

function removeCartItem(item: CartItem) {
    cartItems.value = cartItems.value.filter((c) => c.uid !== item.uid);
}

function clearCart() {
    cartItems.value = [];
}

// Tarif berlaku = min_nominal terbesar yang <= nominal; di bawah tarif terendah pakai
// tarif terendah. Selaras dengan backend Produk::resolveFeeJasa & halaman Layanan.
function resolveTarif(tarifs: TarifJasa[], nominal: number): TarifJasa | null {
    if (!tarifs || tarifs.length === 0) {
        return null;
    }

    const sorted = [...tarifs].sort((a, b) => a.min_nominal - b.min_nominal);
    let match = sorted[0];

    for (const t of sorted) {
        if (nominal >= t.min_nominal) {
            match = t;
        }
    }

    return match;
}

// Label range tarif yang sedang berlaku untuk sebuah baris jasa (ditampilkan ke kasir).
function appliedTarifLabel(item: CartItem): string {
    const nominal = Number(item.nominal) || 0;

    if (item.tarifs.length === 0 || nominal <= 0) {
        return '';
    }

    const match = resolveTarif(item.tarifs, nominal);

    if (!match) {
        return '';
    }

    const higher = item.tarifs
        .map((t) => t.min_nominal)
        .filter((m) => m > match.min_nominal)
        .sort((a, b) => a - b)[0];

    return higher === undefined
        ? `${formatRupiah(match.min_nominal)} ke atas`
        : `${formatRupiah(match.min_nominal)} – ${formatRupiah(higher - 1)}`;
}

// Jasa: baris bertarif → fee dihitung otomatis dari nominal; tanpa tarif → fee manual.
// subtotal jasa = fee (nominal hanya titipan, bukan omzet).
function recomputeJasaItem(item: CartItem): void {
    const nominal = Math.max(0, Number(item.nominal) || 0);

    if (item.tarifs.length > 0) {
        const match = resolveTarif(item.tarifs, nominal);
        item.fee = nominal > 0 && match ? match.fee : 0;
    }

    item.subtotal = Math.max(0, Number(item.fee) || 0);
}

function updateItemQuantity(item: CartItem, delta: number) {
    const nextQty = item.qty + delta;

    if (nextQty < 1 || nextQty > item.stock) {

        return;
    }

    item.qty = nextQty;
    item.subtotal = item.harga * item.qty;
}

// Qty diketik langsung: ambil hanya digit, clamp ke [1, stok], lalu sinkronkan DOM.
function setItemQuantity(item: CartItem, event: Event) {
    const el = event.target as HTMLInputElement;
    const digits = el.value.replace(/\D/g, '');

    // Biarkan kosong sementara saat kasir sedang mengetik ulang.
    if (digits === '') {
        el.value = '';
        return;
    }

    let next = parseInt(digits, 10);
    if (next < 1) next = 1;
    if (next > item.stock) next = item.stock;

    item.qty = next;
    item.subtotal = item.harga * item.qty;
    el.value = String(next);
}

// Saat input kehilangan fokus: pastikan qty minimal 1 dan tidak melebihi stok.
function normalizeItemQuantity(item: CartItem, event: Event) {
    const el = event.target as HTMLInputElement;
    let next = parseInt(el.value.replace(/\D/g, ''), 10);
    if (!Number.isFinite(next) || next < 1) next = 1;
    if (next > item.stock) next = item.stock;

    item.qty = next;
    item.subtotal = item.harga * item.qty;
    el.value = String(next);
}

// Produk satuan dihitung per qty; curah dihitung 1 baris (qty pecahan).
const cartCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + (item.tipe_jual === 'satuan' ? item.qty : 1), 0),
);

// Baris curah yang belum valid: nominal belum diisi atau qty melebihi stok.
const invalidCurahItems = computed(() =>
    cartItems.value.filter(
        (item) => item.tipe_jual === 'curah' && ((Number(item.nominal) || 0) <= 0 || item.qty > item.stock),
    ),
);

// Baris jasa yang belum valid: nominal atau fee belum diisi.
const invalidJasaItems = computed(() =>
    cartItems.value.filter(
        (item) => item.tipe_jual === 'jasa' && ((Number(item.nominal) || 0) <= 0 || (Number(item.fee) || 0) <= 0),
    ),
);

const hasInvalidItems = computed(() => invalidCurahItems.value.length > 0 || invalidJasaItems.value.length > 0);

const cartQtyById = computed(() => {
    const map = new Map<number, number>();
    // Hanya produk (jasa tak ada di grid & bisa berulang dengan id sama).
    cartItems.value.forEach((item) => {
        if (item.tipe_jual !== 'jasa') {
            map.set(item.id_produk, item.qty);
        }
    });

    return map;
});

const totalHarga = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.subtotal, 0);
});

const globalPromos = computed(() => props.promos.filter((promo) => promo.id_produk === null));

const selectedPromo = computed(() => {
    return props.promos.find((promo) => promo.id_promo === form.id_promo) ?? null;
});

// Ringkasan ringkas pelanggan + promo untuk header bagian opsi yang bisa dilipat.
const optionsSummary = computed(() => {
    const pelanggan = selectedPelanggan.value
        ? `${selectedPelanggan.value.nama}${isReseller.value ? ' (Reseller)' : ''}`
        : 'Pelanggan umum';
    const promo = selectedPromo.value ? selectedPromo.value.nama : 'Tanpa promo';

    return `${pelanggan} · ${promo}`;
});

function calculateItemPromoDiscount(item: CartItem): number {
    // Promo produk tidak berlaku untuk fee jasa (selaras backend: jasa di-skip).
    if (item.tipe_jual === 'jasa') {
        return 0;
    }

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

// Titipan jasa (nominal transfer/tarik tunai) dibayar tunai oleh pelanggan tapi BUKAN omzet.
const totalNominalJasa = computed(() =>
    cartItems.value.reduce((sum, item) => sum + (item.tipe_jual === 'jasa' ? Number(item.nominal) || 0 : 0), 0),
);

// Total yang ditagih ke pelanggan = omzet (produk + fee) + titipan jasa. Kembalian dari sini.
const totalTagihan = computed(() => totalAfterDiscount.value + totalNominalJasa.value);

const kembalian = computed(() => {
    const bayar = Number(form.bayar) || 0;

    return Math.max(0, bayar - totalTagihan.value);
});

const isPaid = computed(() => (Number(form.bayar) || 0) >= totalTagihan.value);

const paymentMethods = [
    { value: 'cash', label: 'Tunai', icon: Banknote },
    { value: 'qris', label: 'QRIS', icon: QrCode },
    { value: 'transfer', label: 'Transfer', icon: CreditCard },
] as const;

const cashSuggestions = computed(() => {
    const total = totalTagihan.value;

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

    <div class="@container/pos relative h-[calc(100svh-4rem)] overflow-hidden md:h-[calc(100svh-5rem)]">
        <div class="flex h-full flex-col overflow-hidden @2xl/pos:flex-row @2xl/pos:gap-4 @2xl/pos:p-4 @5xl/pos:gap-6 @5xl/pos:p-6">
        <!-- ============ PRODUK ============ -->
        <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
            <!-- Header + pencarian + kategori (tetap di atas, tidak ikut scroll) -->
            <div class="shrink-0 space-y-3 px-4 pt-4 @md/pos:px-6 @md/pos:pt-6 @2xl/pos:px-0 @2xl/pos:pt-0">
                <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                        <h1 class="text-xl font-extrabold tracking-tight sm:text-2xl">Kasir</h1>
                        <p class="hidden text-xs text-muted-foreground sm:block">
                            Cari, scan, atau ketuk produk untuk menambah ke keranjang.
                        </p>
                    </div>
                    <div
                        role="status"
                        :title="scannerStatusText"
                        :class="[
                            'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold',
                            isScannerDetected
                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                : 'border-slate-300/70 bg-slate-100 text-slate-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
                        ]"
                    >
                        <Barcode class="h-3.5 w-3.5" />
                        <span :class="['h-1.5 w-1.5 rounded-full', isScannerDetected ? 'bg-emerald-500' : 'bg-slate-400']"></span>
                        <span class="hidden sm:inline">{{ isScannerDetected ? 'Scanner siap' : 'Scan manual' }}</span>
                    </div>
                </div>

                <div class="relative">
                    <Search class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari nama produk atau kategori..."
                        aria-label="Cari produk"
                        class="w-full rounded-2xl border border-sidebar-border/70 bg-background py-3 pl-12 pr-11 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                    />
                    <button
                        v-if="searchQuery"
                        type="button"
                        aria-label="Hapus pencarian"
                        class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition hover:bg-slate-100 dark:hover:bg-zinc-800"
                        @click="searchQuery = ''"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>

                <!-- Filter kategori -->
                <div v-if="categories.length" class="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 @md/pos:-mx-6 @md/pos:px-6 @2xl/pos:mx-0 @2xl/pos:px-0">
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

                <!-- Tambah cepat: favorit (produk) + layanan/jasa dalam satu baris, dipisah dari filter -->
                <div
                    v-if="(favoriteProducts.length && !searchQuery) || layanan.length"
                    class="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-0.5 @md/pos:-mx-6 @md/pos:px-6 @2xl/pos:mx-0 @2xl/pos:px-0"
                >
                    <span class="flex shrink-0 items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                        <Zap class="h-3.5 w-3.5" /> Cepat
                    </span>

                    <template v-if="!searchQuery">
                        <button
                            v-for="fav in favoriteProducts"
                            :key="'fav-' + fav.id_produk"
                            type="button"
                            class="inline-flex shrink-0 items-center gap-2 rounded-full border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs font-semibold transition hover:border-indigo-500/40 hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800"
                            @click="addToCart(fav)"
                        >
                            <span class="max-w-[7rem] truncate">{{ fav.nama }}</span>
                            <span class="text-indigo-600 dark:text-indigo-400">{{ formatRupiah(fav.harga_jual) }}</span>
                            <span
                                v-if="cartQtyById.get(fav.id_produk)"
                                class="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white"
                            >{{ formatQty(cartQtyById.get(fav.id_produk)!) }}</span>
                        </button>
                    </template>

                    <span
                        v-if="!searchQuery && favoriteProducts.length && layanan.length"
                        class="h-5 w-px shrink-0 bg-sidebar-border/70 dark:bg-sidebar-border"
                    ></span>

                    <button
                        v-for="svc in layanan"
                        :key="'svc-' + svc.id_produk"
                        type="button"
                        class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-500/20 dark:text-violet-300"
                        @click="addJasaToCart(svc)"
                    >
                        <CreditCard class="h-3.5 w-3.5" />
                        {{ svc.nama }}
                    </button>
                </div>
            </div>

            <!-- Grid produk (area scroll) -->
            <div class="@container/cat flex-1 overflow-y-auto px-4 pt-4 pb-28 @md/pos:px-6 @2xl/pos:px-0 @2xl/pos:pb-4">
                <div class="grid grid-cols-2 gap-3 @lg/cat:grid-cols-3 @lg/cat:gap-4 @3xl/cat:grid-cols-4 @5xl/cat:grid-cols-5">
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
                class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm @2xl/pos:hidden"
                @click="cartOpen = false"
            ></div>
        </Transition>

        <!-- ============ KERANJANG (kolom desktop / drawer mobile) ============ -->
        <aside
            :class="[
                'flex flex-col bg-card shadow-2xl transition-transform duration-300 ease-out',
                'fixed inset-x-0 bottom-0 z-50 max-h-[88vh] rounded-t-3xl border-t border-sidebar-border/70 dark:border-sidebar-border',
                cartOpen ? 'translate-y-0' : 'translate-y-full',
                '@2xl/pos:static @2xl/pos:z-auto @2xl/pos:max-h-none @2xl/pos:w-[300px] @2xl/pos:shrink-0 @2xl/pos:translate-y-0 @2xl/pos:rounded-2xl @2xl/pos:border @2xl/pos:shadow-sm @4xl/pos:w-[340px] @6xl/pos:w-[380px]',
            ]"
        >
            <!-- Header keranjang -->
            <div class="shrink-0">
                <!-- handle drawer (mobile) -->
                <div class="flex justify-center pt-2.5 @2xl/pos:hidden">
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
                    <div class="flex items-center gap-1">
                        <button
                            v-if="cartItems.length"
                            type="button"
                            class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                            @click="clearCart"
                        >
                            <Trash2 class="h-3.5 w-3.5" />
                            Kosongkan
                        </button>
                        <button
                            type="button"
                            aria-label="Tutup keranjang"
                            class="rounded-lg p-1.5 text-muted-foreground transition hover:bg-slate-100 @2xl/pos:hidden dark:hover:bg-zinc-800"
                            @click="cartOpen = false"
                        >
                            <X class="h-5 w-5" />
                        </button>
                    </div>
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
                    :key="item.uid"
                    class="px-4 py-3 transition-colors hover:bg-slate-50/60 dark:hover:bg-zinc-800/20"
                >
                    <div class="flex items-center gap-3">
                        <div
                            v-if="item.tipe_jual === 'jasa'"
                            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400"
                        >
                            <CreditCard class="h-5 w-5" />
                        </div>
                        <img
                            v-else-if="resolveFoto(item.foto_url ?? item.foto)"
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
                            <h4 class="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
                                {{ item.nama }}
                                <span
                                    v-if="item.tipe_jual === 'jasa'"
                                    class="inline-flex shrink-0 items-center rounded border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-bold text-violet-600 dark:text-violet-400"
                                >
                                    Jasa
                                </span>
                            </h4>
                            <p v-if="item.tipe_jual === 'jasa'" class="text-xs text-muted-foreground">Fee admin (pendapatan)</p>
                            <p v-else class="text-xs text-muted-foreground">
                                {{ formatRupiah(item.harga) }}<span v-if="item.tipe_jual === 'curah'"> / {{ item.satuan }}</span>
                            </p>
                            <p class="text-sm font-bold text-indigo-600 dark:text-indigo-400">{{ formatRupiah(item.subtotal) }}</p>
                        </div>

                        <div class="flex flex-col items-end gap-1.5">
                            <button
                                type="button"
                                class="rounded-lg p-1 text-muted-foreground transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                                @click="removeCartItem(item)"
                            >
                                <Trash2 class="h-4 w-4" />
                            </button>
                            <div
                                v-if="item.tipe_jual === 'satuan'"
                                class="flex items-center gap-1 rounded-lg border border-sidebar-border/70 p-0.5 dark:border-sidebar-border"
                            >
                                <button
                                    type="button"
                                    class="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-zinc-800"
                                    @click="updateItemQuantity(item, -1)"
                                >
                                    <Minus class="h-3.5 w-3.5" />
                                </button>
                                <input
                                    type="text"
                                    inputmode="numeric"
                                    :value="item.qty"
                                    :aria-label="`Jumlah ${item.nama}`"
                                    class="w-10 rounded-md bg-transparent text-center text-sm font-bold tabular-nums text-foreground outline-none focus:ring-2 focus:ring-indigo-500/30"
                                    @focus="($event.target as HTMLInputElement).select()"
                                    @input="setItemQuantity(item, $event)"
                                    @blur="normalizeItemQuantity(item, $event)"
                                    @keyup.enter="($event.target as HTMLInputElement).blur()"
                                />
                                <button
                                    type="button"
                                    class="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-zinc-800"
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

                    <!-- Input nominal (titipan) + fee untuk produk jasa -->
                    <div v-if="item.tipe_jual === 'jasa'" class="mt-2 grid grid-cols-2 gap-2">
                        <div>
                            <label class="mb-1 block text-[11px] font-medium text-muted-foreground">Nominal (titipan)</label>
                            <div class="relative">
                                <span class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">Rp</span>
                                <input
                                    v-model.number="item.nominal"
                                    type="number"
                                    min="0"
                                    inputmode="numeric"
                                    placeholder="500000"
                                    :class="[
                                        'w-full rounded-lg border bg-background py-2 pl-7 pr-2 text-sm font-semibold transition focus:ring-2 focus:ring-indigo-500/20 focus:outline-none',
                                        (Number(item.nominal) || 0) <= 0
                                            ? 'border-amber-500/50 focus:border-amber-500'
                                            : 'border-sidebar-border/70 focus:border-indigo-500 dark:border-sidebar-border',
                                    ]"
                                    @input="recomputeJasaItem(item)"
                                />
                            </div>
                        </div>
                        <div>
                            <label class="mb-1 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                Fee
                                <span
                                    v-if="item.tarifs.length > 0"
                                    class="inline-flex items-center gap-0.5 rounded bg-violet-500/10 px-1 py-0.5 text-[9px] font-semibold text-violet-600 dark:text-violet-400"
                                >
                                    <Lock class="h-2.5 w-2.5" /> Otomatis
                                </span>
                            </label>
                            <div class="relative">
                                <span class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">Rp</span>
                                <input
                                    v-model.number="item.fee"
                                    type="number"
                                    min="0"
                                    inputmode="numeric"
                                    placeholder="5000"
                                    :readonly="item.tarifs.length > 0"
                                    :class="[
                                        'w-full rounded-lg border py-2 pl-7 pr-2 text-sm font-semibold transition focus:ring-2 focus:ring-indigo-500/20 focus:outline-none',
                                        item.tarifs.length > 0
                                            ? 'cursor-not-allowed border-sidebar-border/70 bg-slate-100 text-muted-foreground dark:border-sidebar-border dark:bg-zinc-800'
                                            : (Number(item.fee) || 0) <= 0
                                            ? 'border-amber-500/50 bg-background focus:border-amber-500'
                                            : 'border-sidebar-border/70 bg-background focus:border-indigo-500 dark:border-sidebar-border',
                                    ]"
                                    @input="recomputeJasaItem(item)"
                                />
                            </div>
                        </div>
                        <p v-if="item.tarifs.length > 0 && appliedTarifLabel(item)" class="col-span-2 -mt-0.5 text-[11px] font-medium text-violet-600 dark:text-violet-400">
                            Tarif: {{ appliedTarifLabel(item) }}
                        </p>
                        <p v-else-if="item.tarifs.length > 0" class="col-span-2 -mt-0.5 text-[11px] text-muted-foreground">
                            Isi nominal dulu — fee terisi otomatis dari tarif.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Ringkasan + pembayaran -->
            <div class="shrink-0 border-t border-sidebar-border/70 bg-slate-50/60 dark:border-sidebar-border dark:bg-zinc-900/40">
                <template v-if="cartItems.length">
                    <!-- Pelanggan & promo (dilipat; ringkasan selalu terlihat) -->
                    <div class="border-b border-sidebar-border/70 dark:border-sidebar-border">
                        <button
                            type="button"
                            class="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left transition hover:bg-slate-100/60 dark:hover:bg-zinc-800/40"
                            :aria-expanded="showOptions"
                            @click="showOptions = !showOptions"
                        >
                            <span class="flex min-w-0 items-center gap-2">
                                <Users class="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span class="truncate text-xs font-semibold text-foreground">{{ optionsSummary }}</span>
                            </span>
                            <span class="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                                {{ showOptions ? 'Tutup' : 'Ubah' }}
                                <ChevronDown :class="['h-4 w-4 transition-transform', showOptions ? 'rotate-180' : '']" />
                            </span>
                        </button>
                        <div v-show="showOptions" class="space-y-2.5 px-4 pb-3">
                            <div>
                                <label class="mb-1 block text-[11px] font-semibold text-muted-foreground">Pelanggan</label>
                                <select
                                    v-model.number="form.id_pelanggan"
                                    class="w-full rounded-xl border border-sidebar-border/70 bg-background px-3 py-2 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                                >
                                    <option :value="null">Umum (tanpa potongan)</option>
                                    <option v-for="p in pelanggans" :key="p.id_pelanggan" :value="p.id_pelanggan">
                                        {{ p.nama }}{{ p.tipe === 'reseller' ? ' (Reseller)' : '' }}
                                    </option>
                                </select>
                                <p v-if="isReseller" class="mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                    Harga reseller diterapkan ke produk yang punya potongan.
                                </p>
                            </div>
                            <div>
                                <label class="mb-1 block text-[11px] font-semibold text-muted-foreground">Promo tambahan</label>
                                <select
                                    v-model.number="form.id_promo"
                                    class="w-full rounded-xl border border-sidebar-border/70 bg-background px-3 py-2 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                                >
                                    <option :value="null">Tanpa promo</option>
                                    <option v-for="promo in globalPromos" :key="promo.id_promo" :value="promo.id_promo">
                                        {{ promo.nama }}
                                    </option>
                                </select>
                                <p v-if="selectedPromo && selectedPromo.minimal_belanja && totalHarga < selectedPromo.minimal_belanja" class="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                                    Minimal belanja {{ formatRupiah(selectedPromo.minimal_belanja) }} untuk promo ini.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-3 p-4">
                        <!-- Rincian + Total (hero) -->
                        <div class="space-y-1.5">
                            <div class="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Subtotal</span>
                                <span class="tabular-nums">{{ formatRupiah(totalHarga) }}</span>
                            </div>
                            <div v-if="totalDiscount > 0" class="flex items-center justify-between text-xs">
                                <span class="text-muted-foreground">Diskon</span>
                                <span class="font-medium text-emerald-600 tabular-nums dark:text-emerald-400">-{{ formatRupiah(totalDiscount) }}</span>
                            </div>
                            <div v-if="totalNominalJasa > 0" class="flex items-center justify-between text-xs">
                                <span class="text-muted-foreground">Titipan layanan (bukan omzet)</span>
                                <span class="tabular-nums">+{{ formatRupiah(totalNominalJasa) }}</span>
                            </div>
                            <div class="flex items-baseline justify-between border-t border-sidebar-border/70 pt-2 dark:border-sidebar-border">
                                <span class="text-sm font-bold">{{ totalNominalJasa > 0 ? 'Total Bayar' : 'Total' }}</span>
                                <span class="text-2xl font-extrabold text-indigo-600 tabular-nums dark:text-indigo-400">{{ formatRupiah(totalTagihan) }}</span>
                            </div>
                        </div>

                        <!-- Metode pembayaran -->
                        <div>
                            <label class="mb-1.5 block text-[11px] font-semibold text-muted-foreground">Metode pembayaran</label>
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
                        </div>

                        <!-- Uang diterima -->
                        <div>
                            <label class="mb-1.5 block text-[11px] font-semibold text-muted-foreground">Uang diterima</label>
                            <div class="relative">
                                <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</span>
                                <input
                                    v-model="form.bayar"
                                    type="number"
                                    min="0"
                                    inputmode="numeric"
                                    placeholder="0"
                                    class="w-full rounded-xl border border-sidebar-border/70 bg-background py-2.5 pl-9 pr-3 text-sm font-semibold transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                                />
                            </div>
                            <div v-if="form.metode_pembayaran === 'cash' && cashSuggestions.length" class="mt-2 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    class="rounded-lg border border-indigo-500/30 bg-indigo-500/5 px-2.5 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-500/10 dark:text-indigo-400"
                                    @click="form.bayar = String(totalTagihan)"
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
                            <p v-if="form.errors.bayar" class="mt-1 text-xs text-rose-600">{{ form.errors.bayar }}</p>
                        </div>

                        <!-- Kembalian / kurang -->
                        <div
                            v-if="Number(form.bayar) > 0"
                            :class="[
                                'flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-bold',
                                isPaid
                                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                    : 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400',
                            ]"
                        >
                            <span>{{ isPaid ? 'Kembalian' : 'Uang masih kurang' }}</span>
                            <span class="tabular-nums">{{ isPaid ? formatRupiah(kembalian) : formatRupiah(totalTagihan - (Number(form.bayar) || 0)) }}</span>
                        </div>

                        <p v-if="hasInvalidItems" class="text-center text-xs font-medium text-amber-600 dark:text-amber-400">
                            Lengkapi nominal produk curah & nominal/fee layanan, pastikan tidak melebihi stok.
                        </p>

                        <button
                            type="button"
                            class="flex w-full items-center justify-between gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                            :disabled="cartItems.length === 0 || form.processing || hasInvalidItems"
                            @click="submitTransaction"
                        >
                            <span class="flex items-center gap-2 text-sm font-bold">
                                <ArrowRight v-if="!form.processing" class="h-4 w-4" />
                                {{ form.processing ? 'Memproses...' : 'Bayar Sekarang' }}
                            </span>
                            <span v-if="!form.processing" class="text-base font-extrabold tabular-nums">{{ formatRupiah(totalTagihan) }}</span>
                        </button>
                    </div>
                </template>

                <!-- Footer saat keranjang kosong -->
                <div v-else class="p-4">
                    <div class="flex w-full items-center justify-center rounded-2xl border border-dashed border-sidebar-border/70 bg-background px-5 py-3.5 text-sm font-semibold text-muted-foreground dark:border-sidebar-border">
                        Tambahkan produk untuk mulai transaksi
                    </div>
                </div>
            </div>
        </aside>
        </div>

        <!-- ============ Bottom bar keranjang (mobile) ============ -->
        <div class="fixed inset-x-0 bottom-0 z-30 border-t border-sidebar-border/70 bg-card/95 p-3 backdrop-blur @2xl/pos:hidden dark:border-sidebar-border">
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
                    <span class="text-[11px] font-medium text-indigo-100">{{ cartItems.length }} item</span>
                    <span class="text-base font-extrabold tabular-nums">{{ formatRupiah(totalTagihan) }}</span>
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
