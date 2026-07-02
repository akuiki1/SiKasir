<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
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
    Loader2,
    ClipboardList,
    Phone,
    CheckCircle2,
    Printer,
} from 'lucide-vue-next';
import {
    ref,
    computed,
    watch,
    onMounted,
    onBeforeUnmount,
    nextTick,
} from 'vue';
import { toast } from 'vue-sonner';
import Pagination from '@/components/Pagination.vue';
import { usePagination } from '@/composables/usePagination';
import { formatRupiah } from '@/lib/format';
import { printReceipt } from '@/lib/struk';
import type { StrukData } from '@/lib/struk';
import { store as kasirTransaksiStore } from '@/routes/kasir/transaksi';

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
    tipe: 'persen' | 'nominal' | 'bundling';
    nilai: number;
    beli_qty?: number | null;
    gratis_qty?: number | null;
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
    items: [] as Array<{
        id_produk: number;
        jumlah: number;
        nominal?: number;
        fee?: number;
    }>,
});

// Mode keranjang: 'proses' = langsung jadi transaksi (default), 'pesanan' = simpan
// sebagai pesanan pending (reserve stok) untuk pelanggan walk-in yang belum bayar.
const cartMode = ref<'proses' | 'pesanan'>('proses');
const orderNama = ref('');
const orderTelp = ref('');
const orderCatatan = ref('');

// Pesanan hanya mendukung produk satuan (curah/jasa tidak bisa di-reserve).
const allSatuan = computed(
    () =>
        cartItems.value.length > 0 &&
        cartItems.value.every((item) => item.tipe_jual === 'satuan'),
);
const pesananReady = computed(
    () =>
        allSatuan.value &&
        orderNama.value.trim() !== '' &&
        /^[0-9+\-\s()]{6,}$/.test(orderTelp.value.trim()),
);

function setPesananMode(): void {
    if (!allSatuan.value) {
        toast.warning('Pesanan hanya untuk produk satuan', {
            description:
                'Keluarkan produk curah/jasa dari keranjang untuk menyimpan sebagai pesanan.',
        });

        return;
    }

    cartMode.value = 'pesanan';
}

// Kembali ke mode proses bila keranjang berisi produk non-satuan.
watch(allSatuan, (ok) => {
    if (!ok && cartMode.value === 'pesanan') {
        cartMode.value = 'proses';
    }
});

// Estimasi total pesanan = harga dasar (umum) tanpa promo. Backend memfinalkan
// (mis. harga reseller bila nomor WA cocok) — bisa lebih murah dari estimasi ini.
const pesananEstimasi = computed(() =>
    cartItems.value
        .filter((item) => item.tipe_jual === 'satuan')
        .reduce(
            (sum, item) =>
                sum + item.harga_base * Math.max(1, Math.round(item.qty)),
            0,
        ),
);

// Penanda baris keranjang yang unik (produk dedup by id_produk, jasa selalu baris baru).
let cartUidSeq = 0;
const nextUid = (): number => ++cartUidSeq;

// Pelanggan dipilih via pencarian server-side (bukan dropdown penuh) agar tetap ringan
// walau pelanggan banyak. selectedPelanggan disimpan lokal, bukan diturunkan dari props.
const selectedPelanggan = ref<Pelanggan | null>(null);
const isReseller = computed(() => selectedPelanggan.value?.tipe === 'reseller');

const pelangganQuery = ref('');
const pelangganResults = ref<Pelanggan[]>(props.pelanggans);
const pelangganSearching = ref(false);
const pelangganDropdownOpen = ref(false);
const pelangganBoxRef = ref<HTMLElement | null>(null);
let pelangganDebounce: ReturnType<typeof setTimeout> | undefined;

function onPelangganInput(): void {
    pelangganDropdownOpen.value = true;

    if (pelangganDebounce) {
        clearTimeout(pelangganDebounce);
    }

    pelangganDebounce = setTimeout(fetchPelanggan, 250);
}

async function fetchPelanggan(): Promise<void> {
    pelangganSearching.value = true;

    try {
        const url = `/kasir/pelanggan/cari?q=${encodeURIComponent(pelangganQuery.value.trim())}`;
        const res = await fetch(url, {
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        const data = await res.json();
        pelangganResults.value = Array.isArray(data?.pelanggans)
            ? data.pelanggans
            : [];
    } catch {
        pelangganResults.value = [];
    } finally {
        pelangganSearching.value = false;
    }
}

function selectPelanggan(pelanggan: Pelanggan | null): void {
    selectedPelanggan.value = pelanggan;
    form.id_pelanggan = pelanggan?.id_pelanggan ?? null;
    pelangganDropdownOpen.value = false;
    pelangganQuery.value = '';
}

function clearPelanggan(): void {
    selectPelanggan(null);
    pelangganResults.value = props.pelanggans;
}

function openPelangganDropdown(): void {
    pelangganDropdownOpen.value = true;

    // Saat dibuka tanpa kata kunci, kembalikan saran awal bila kosong.
    if (!pelangganQuery.value.trim() && pelangganResults.value.length === 0) {
        pelangganResults.value = props.pelanggans;
    }
}

function handlePelangganOutside(event: MouseEvent): void {
    if (
        pelangganDropdownOpen.value &&
        pelangganBoxRef.value &&
        !pelangganBoxRef.value.contains(event.target as Node)
    ) {
        pelangganDropdownOpen.value = false;
    }
}

// Harga efektif per item: reseller dipotong rupiah per produk; jasa tak terpengaruh.
function effectiveHarga(item: CartItem): number {
    if (isReseller.value && item.tipe_jual !== 'jasa') {
        return Math.max(0, item.harga_base - (item.potongan_reseller || 0));
    }

    return item.harga_base;
}

// Field harga awal saat produk ditambahkan ke keranjang (ikut status reseller saat itu).
function basePricing(product: Produk): {
    harga: number;
    harga_base: number;
    potongan_reseller: number;
} {
    const potongan = product.potongan_reseller ?? 0;

    return {
        harga_base: product.harga_jual,
        potongan_reseller: potongan,
        harga: isReseller.value
            ? Math.max(0, product.harga_jual - potongan)
            : product.harga_jual,
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
const activeProductPromos = computed(
    () =>
        new Map(
            props.promos
                .filter((promo) => promo.id_produk !== null)
                .map((promo) => [promo.id_produk as number, promo]),
        ),
);

const filteredProduks = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    const promoIds = activeProductPromos.value;

    return (
        props.produks
            .filter((product) => {
                const matchesSearch =
                    !query ||
                    product.nama.toLowerCase().includes(query) ||
                    product.kategori?.toLowerCase().includes(query);

                const matchesCategory =
                    !selectedCategory.value ||
                    product.kategori === selectedCategory.value;

                return matchesSearch && matchesCategory;
            })
            // Produk yang sedang promo tampil paling depan (urutan lain tetap).
            .sort((a, b) => {
                const aPromo = promoIds.has(a.id_produk) ? 1 : 0;
                const bPromo = promoIds.has(b.id_produk) ? 1 : 0;

                return bPromo - aPromo;
            })
    );
});

const {
    currentPage,
    perPage,
    totalItems,
    totalPages,
    paginatedItems: paginatedProduks,
    startIndex,
    endIndex,
    goToPage,
    visiblePages,
} = usePagination(() => filteredProduks.value, 10);

// Kuantitas curah bisa pecahan (mis. 1,429 liter) — tampilkan rapi.
function formatQty(value: number): string {
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 3 }).format(
        Number(value) || 0,
    );
}

// Curah: dari nominal rupiah → qty = nominal ÷ harga/satuan (3 desimal), subtotal = nominal persis.
// Tidak menulis ulang item.nominal agar kasir tetap bisa mengosongkan input saat mengetik.
function recomputeCurahItem(item: CartItem): void {
    const nominal = Math.max(0, Number(item.nominal) || 0);
    item.qty =
        item.harga > 0 ? Math.round((nominal / item.harga) * 1000) / 1000 : 0;
    item.subtotal = Math.round(nominal);
}

function resolveFoto(foto: string | null): string | null {
    if (!foto) {
        return null;
    }

    if (
        foto.startsWith('http://') ||
        foto.startsWith('https://') ||
        foto.startsWith('/')
    ) {
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

    const hasBarcodeUsagePage =
        device.collections?.some(
            (collection) => collection.usagePage === 0x8c,
        ) ?? false;

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
        const scanner = devices.find((device) =>
            looksLikeBarcodeScanner(device),
        );

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
    const existing = cartItems.value.find(
        (item) => item.id_produk === product.id_produk,
    );

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
    const uid = nextUid();

    cartItems.value.push({
        uid,
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

    // Fokuskan langsung input nominal baris baru supaya kasir bisa mengetik tanpa
    // mencari-cari. preventScroll agar tidak melompat saat drawer mobile beranimasi.
    void nextTick(() => {
        document
            .querySelector<HTMLInputElement>(`[data-jasa-nominal="${uid}"]`)
            ?.focus({ preventScroll: true });
    });
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

    if (next < 1) {
        next = 1;
    }

    if (next > item.stock) {
        next = item.stock;
    }

    item.qty = next;
    item.subtotal = item.harga * item.qty;
    el.value = String(next);
}

// Saat input kehilangan fokus: pastikan qty minimal 1 dan tidak melebihi stok.
function normalizeItemQuantity(item: CartItem, event: Event) {
    const el = event.target as HTMLInputElement;
    let next = parseInt(el.value.replace(/\D/g, ''), 10);

    if (!Number.isFinite(next) || next < 1) {
        next = 1;
    }

    if (next > item.stock) {
        next = item.stock;
    }

    item.qty = next;
    item.subtotal = item.harga * item.qty;
    el.value = String(next);
}

// Produk satuan dihitung per qty; curah dihitung 1 baris (qty pecahan).
const cartCount = computed(() =>
    cartItems.value.reduce(
        (sum, item) => sum + (item.tipe_jual === 'satuan' ? item.qty : 1),
        0,
    ),
);

// Baris curah yang belum valid: nominal belum diisi atau qty melebihi stok.
const invalidCurahItems = computed(() =>
    cartItems.value.filter(
        (item) =>
            item.tipe_jual === 'curah' &&
            ((Number(item.nominal) || 0) <= 0 || item.qty > item.stock),
    ),
);

// Baris jasa yang belum valid: nominal atau fee belum diisi.
const invalidJasaItems = computed(() =>
    cartItems.value.filter(
        (item) =>
            item.tipe_jual === 'jasa' &&
            ((Number(item.nominal) || 0) <= 0 || (Number(item.fee) || 0) <= 0),
    ),
);

const hasInvalidItems = computed(
    () =>
        invalidCurahItems.value.length > 0 || invalidJasaItems.value.length > 0,
);

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

const globalPromos = computed(() =>
    props.promos.filter((promo) => promo.id_produk === null),
);

function globalPromoValue(promo: Promo): number {
    if (promo.tipe === 'persen') {
        return Math.floor(totalHarga.value * (promo.nilai / 100));
    }

    return Math.floor(promo.nilai);
}

// Promo keranjang diterapkan OTOMATIS: dari promo global yang syarat minimal
// belanjanya terpenuhi, pilih yang paling menguntungkan pelanggan (mirror backend).
const autoGlobalPromo = computed(() => {
    let best: Promo | null = null;
    let bestValue = 0;

    for (const promo of globalPromos.value) {
        if (promo.minimal_belanja && totalHarga.value < promo.minimal_belanja) {
            continue;
        }

        const value = globalPromoValue(promo);

        if (value > bestValue) {
            bestValue = value;
            best = promo;
        }
    }

    return best;
});

// Promo global yang belum aktif karena minimal belanja belum tercapai — untuk
// mendorong kasir/pelanggan menambah belanja (gap terkecil ditampilkan).
const pendingGlobalPromo = computed(() => {
    if (autoGlobalPromo.value) {
        return null;
    }

    return (
        globalPromos.value
            .filter(
                (promo) =>
                    promo.minimal_belanja &&
                    totalHarga.value < promo.minimal_belanja,
            )
            .sort(
                (a, b) => (a.minimal_belanja ?? 0) - (b.minimal_belanja ?? 0),
            )[0] ?? null
    );
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

    if (promo.tipe === 'bundling') {
        // Beli X gratis Y — hanya produk satuan. Mirror perhitungan backend.
        const grup =
            Number(promo.beli_qty ?? 0) + Number(promo.gratis_qty ?? 0);

        if (
            item.tipe_jual !== 'satuan' ||
            grup <= 0 ||
            Number(promo.gratis_qty ?? 0) <= 0
        ) {
            return 0;
        }

        const hargaSatuan = item.qty > 0 ? item.subtotal / item.qty : 0;
        const gratis =
            Math.floor(Math.floor(item.qty) / grup) * Number(promo.gratis_qty);

        return Math.floor(gratis * hargaSatuan);
    }

    return Math.floor(promo.nilai * item.qty);
}

// Label badge promo pada kartu produk (persen / bundling / nominal).
function productPromoLabel(idProduk: number): string {
    const promo = activeProductPromos.value.get(idProduk);

    if (!promo) {
        return '';
    }

    if (promo.tipe === 'persen') {
        return `${promo.nilai}%`;
    }

    if (promo.tipe === 'bundling') {
        return `Beli ${promo.beli_qty} Gratis ${promo.gratis_qty}`;
    }

    return 'Promo';
}

const productPromoDiscount = computed(() => {
    return cartItems.value.reduce(
        (sum, item) => sum + calculateItemPromoDiscount(item),
        0,
    );
});

const globalPromoDiscount = computed(() =>
    autoGlobalPromo.value ? globalPromoValue(autoGlobalPromo.value) : 0,
);

const totalDiscount = computed(() =>
    Math.max(0, productPromoDiscount.value + globalPromoDiscount.value),
);

const totalAfterDiscount = computed(() =>
    Math.max(0, totalHarga.value - totalDiscount.value),
);

// Titipan jasa (nominal transfer/tarik tunai) dibayar tunai oleh pelanggan tapi BUKAN omzet.
const totalNominalJasa = computed(() =>
    cartItems.value.reduce(
        (sum, item) =>
            sum + (item.tipe_jual === 'jasa' ? Number(item.nominal) || 0 : 0),
        0,
    ),
);

// Total yang ditagih ke pelanggan = omzet (produk + fee) + titipan jasa. Kembalian dari sini.
const totalTagihan = computed(
    () => totalAfterDiscount.value + totalNominalJasa.value,
);

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
    const set = new Set<number>([
        rounded,
        ...QUICK_DENOMS.filter((denom) => denom >= total),
    ]);

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

    if (
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
    ) {
        scannerBuffer.value += event.key;
    }
}

// ===== Modal "Transaksi Selesai" (cetak struk / selesai) =====
// Setelah transaksi tersimpan, server mengirim flash 'struk' berisi data transaksi
// yang sudah final (total, diskon, kembalian). Tampilkan modal dengan opsi cetak.
const showStrukSelesai = ref(false);
const lastStruk = ref<StrukData | null>(null);
let stopFlashListener: (() => void) | null = null;

function cetakStruk(): void {
    if (lastStruk.value) {
        printReceipt(lastStruk.value);
    }
}

function tutupStrukSelesai(): void {
    showStrukSelesai.value = false;
    lastStruk.value = null;
}

onMounted(() => {
    document.addEventListener('keydown', handleScannerKeydown);
    document.addEventListener('mousedown', handlePelangganOutside);
    void detectScannerDevice();

    const hid = getHidApi();

    hid?.addEventListener('connect', handleScannerDeviceConnectionChange);
    hid?.addEventListener('disconnect', handleScannerDeviceConnectionChange);

    stopFlashListener = router.on('flash', (event) => {
        const flash = (event as CustomEvent).detail?.flash;
        const struk = flash?.struk as StrukData | undefined;

        if (struk) {
            lastStruk.value = struk;
            showStrukSelesai.value = true;
        }
    });

    // Pra-isi pencarian bila halaman dibuka dari dashboard (tap "Produk Terlaris": /kasir/transaksi?cari=...).
    const cari = new URLSearchParams(window.location.search).get('cari');

    if (cari) {
        searchQuery.value = cari;
    }
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleScannerKeydown);
    document.removeEventListener('mousedown', handlePelangganOutside);

    const hid = getHidApi();

    hid?.removeEventListener('connect', handleScannerDeviceConnectionChange);
    hid?.removeEventListener('disconnect', handleScannerDeviceConnectionChange);

    stopFlashListener?.();
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

    // --- Mode simpan sebagai pesanan pending ---
    if (cartMode.value === 'pesanan') {
        if (!pesananReady.value) {
            cartOpen.value = true;
            toast.warning('Lengkapi data pesanan', {
                description:
                    'Isi nama & nomor WhatsApp pemesan terlebih dahulu.',
            });

            return;
        }

        const pesananItems = cartItems.value
            .filter((item) => item.tipe_jual === 'satuan')
            .map((item) => ({
                id_produk: item.id_produk,
                jumlah: Math.max(1, Math.round(item.qty)),
            }));

        form.transform(() => ({
            mode: 'pesanan',
            nama_pelanggan: orderNama.value.trim(),
            telp: orderTelp.value.trim(),
            catatan: orderCatatan.value.trim() || null,
            items: pesananItems,
        })).post(kasirTransaksiStore().url, {
            preserveScroll: true,
            onSuccess: () => {
                cartItems.value = [];
                orderNama.value = '';
                orderTelp.value = '';
                orderCatatan.value = '';
                cartMode.value = 'proses';
                cartOpen.value = false;
            },
        });

        return;
    }

    // --- Mode proses langsung (transaksi) ---
    if (hasInvalidItems.value) {
        cartOpen.value = true;

        return;
    }

    form.items = cartItems.value.map((item) => {
        if (item.tipe_jual === 'curah') {
            return {
                id_produk: item.id_produk,
                jumlah: item.qty,
                nominal: Math.floor(Number(item.nominal) || 0),
            };
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

    // Reset transform (identitas) agar tidak terbawa payload mode pesanan sebelumnya.
    form.transform((data) => data).post(kasirTransaksiStore().url, {
        preserveScroll: true,
        onSuccess: () => {
            cartItems.value = [];
            form.bayar = '';
            form.id_pelanggan = null;
            selectedPelanggan.value = null;
            pelangganQuery.value = '';
            pelangganResults.value = props.pelanggans;
            cartOpen.value = false;
        },
    });
}
</script>

<template>
    <Head title="Transaksi Baru - Kasir" />

    <div class="@container/pos relative">
        <div
            class="flex min-h-[calc(100svh-4rem)] flex-col @2xl/pos:min-h-[calc(100svh-5rem)] @2xl/pos:flex-row @2xl/pos:gap-4 @2xl/pos:p-4 @5xl/pos:gap-6 @5xl/pos:p-6"
        >
            <!-- ============ PRODUK ============ -->
            <div class="flex min-w-0 flex-1 flex-col">
                <!-- Header + pencarian + kategori (tetap di atas, tidak ikut scroll) -->
                <div
                    class="shrink-0 space-y-3 px-4 pt-4 @md/pos:px-6 @md/pos:pt-6 @2xl/pos:px-0 @2xl/pos:pt-0"
                >
                    <div class="flex items-center justify-between gap-3">
                        <div class="min-w-0">
                            <h1
                                class="text-xl font-extrabold tracking-tight sm:text-2xl"
                            >
                                Kasir
                            </h1>
                            <p
                                class="hidden text-xs text-muted-foreground sm:block"
                            >
                                Cari, scan, atau ketuk produk untuk menambah ke
                                keranjang.
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
                            <span
                                :class="[
                                    'h-1.5 w-1.5 rounded-full',
                                    isScannerDetected
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-400',
                                ]"
                            ></span>
                            <span class="hidden sm:inline">{{
                                isScannerDetected
                                    ? 'Scanner siap'
                                    : 'Scan manual'
                            }}</span>
                        </div>
                    </div>

                    <div class="relative">
                        <Search
                            class="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Cari nama produk atau kategori..."
                            aria-label="Cari produk"
                            class="w-full rounded-2xl border border-sidebar-border/70 bg-background py-3 pr-11 pl-12 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                        />
                        <button
                            v-if="searchQuery"
                            type="button"
                            aria-label="Hapus pencarian"
                            class="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition hover:bg-slate-100 dark:hover:bg-zinc-800"
                            @click="searchQuery = ''"
                        >
                            <X class="h-4 w-4" />
                        </button>
                    </div>

                    <!-- Layanan / Jasa: transfer & tarik tunai. Band tersendiri (bukan ikut
                     baris favorit) agar selalu terlihat & tidak terdorong keluar layar.
                     Tiap tombol menambah baris jasa ke keranjang yang sama. -->
                    <div
                        v-if="layanan.length"
                        class="flex items-center gap-2.5 rounded-2xl border border-violet-500/30 bg-violet-500/[0.07] px-3 py-2 dark:bg-violet-500/10"
                    >
                        <span
                            class="flex shrink-0 items-center gap-1.5 text-[11px] font-bold tracking-wide text-violet-700 uppercase dark:text-violet-300"
                        >
                            <CreditCard class="h-4 w-4" />
                            <span class="hidden sm:inline">Layanan</span>
                        </span>
                        <div
                            class="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto"
                        >
                            <button
                                v-for="svc in layanan"
                                :key="'svc-' + svc.id_produk"
                                type="button"
                                class="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500 active:scale-[0.98]"
                                @click="addJasaToCart(svc)"
                            >
                                {{ svc.nama }}
                                <Plus class="h-3.5 w-3.5 opacity-90" />
                            </button>
                        </div>
                    </div>

                    <!-- Filter kategori -->
                    <div
                        v-if="categories.length"
                        class="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 @md/pos:-mx-6 @md/pos:px-6 @2xl/pos:mx-0 @2xl/pos:px-0"
                    >
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

                    <!-- Sering dibeli: quick-add produk terlaris (sembunyi saat mencari) -->
                    <div
                        v-if="favoriteProducts.length && !searchQuery"
                        class="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-0.5 @md/pos:-mx-6 @md/pos:px-6 @2xl/pos:mx-0 @2xl/pos:px-0"
                    >
                        <span
                            class="flex shrink-0 items-center gap-1 text-[11px] font-bold tracking-wide text-muted-foreground uppercase"
                        >
                            <Zap class="h-3.5 w-3.5" /> Sering dibeli
                        </span>

                        <button
                            v-for="fav in favoriteProducts"
                            :key="'fav-' + fav.id_produk"
                            type="button"
                            class="inline-flex shrink-0 items-center gap-2 rounded-full border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs font-semibold transition hover:border-indigo-500/40 hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800"
                            @click="addToCart(fav)"
                        >
                            <span class="max-w-[7rem] truncate">{{
                                fav.nama
                            }}</span>
                            <span
                                class="text-indigo-600 dark:text-indigo-400"
                                >{{ formatRupiah(fav.harga_jual) }}</span
                            >
                            <span
                                v-if="cartQtyById.get(fav.id_produk)"
                                class="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white"
                                >{{
                                    formatQty(cartQtyById.get(fav.id_produk)!)
                                }}</span
                            >
                        </button>
                    </div>
                </div>

                <!-- Grid produk (mengalir sesuai paginasi, tanpa scroll internal) -->
                <div
                    class="@container/cat flex-1 px-4 pt-4 pb-28 @md/pos:px-6 @2xl/pos:px-0 @2xl/pos:pb-4"
                >
                    <div
                        class="grid grid-cols-4 gap-2 @md/cat:gap-3 @3xl/cat:grid-cols-5 @5xl/cat:grid-cols-6"
                    >
                        <button
                            v-for="product in paginatedProduks"
                            :key="product.id_produk"
                            type="button"
                            :disabled="product.stok === 0"
                            :class="[
                                'group relative flex flex-col overflow-hidden rounded-xl border bg-card text-left shadow-sm transition-all duration-200 @lg/cat:rounded-2xl',
                                product.stok > 0
                                    ? 'border-sidebar-border/70 hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-md active:scale-[0.98] dark:border-sidebar-border'
                                    : 'cursor-not-allowed border-sidebar-border/40 opacity-60',
                            ]"
                            @click="addToCart(product)"
                        >
                            <div
                                class="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-zinc-900"
                            >
                                <img
                                    v-if="
                                        resolveFoto(
                                            product.foto_url ?? product.foto,
                                        )
                                    "
                                    :src="
                                        resolveFoto(
                                            product.foto_url ?? product.foto,
                                        ) ?? undefined
                                    "
                                    :alt="product.nama"
                                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div
                                    v-else
                                    class="flex h-full w-full items-center justify-center text-muted-foreground"
                                >
                                    <PackageX class="h-6 w-6 opacity-40" />
                                </div>

                                <!-- Badge promo -->
                                <span
                                    v-if="
                                        activeProductPromos.get(
                                            product.id_produk,
                                        )
                                    "
                                    class="absolute top-1 left-1 inline-flex items-center gap-0.5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold whitespace-nowrap text-white shadow @lg/cat:top-2 @lg/cat:left-2 @lg/cat:px-2 @lg/cat:text-[10px]"
                                >
                                    <Percent class="h-2.5 w-2.5" />
                                    {{ productPromoLabel(product.id_produk) }}
                                </span>

                                <!-- Badge qty di keranjang -->
                                <span
                                    v-if="cartQtyById.get(product.id_produk)"
                                    class="absolute top-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-md ring-2 ring-white @lg/cat:top-2 @lg/cat:right-2 @lg/cat:h-6 @lg/cat:min-w-6 @lg/cat:text-xs dark:ring-zinc-900"
                                >
                                    {{
                                        formatQty(
                                            cartQtyById.get(product.id_produk)!,
                                        )
                                    }}
                                </span>

                                <!-- Overlay habis -->
                                <div
                                    v-if="product.stok === 0"
                                    class="absolute inset-0 flex items-center justify-center bg-slate-900/40"
                                >
                                    <span
                                        class="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white"
                                        >Habis</span
                                    >
                                </div>
                            </div>

                            <div class="flex flex-1 flex-col p-2 @lg/cat:p-3">
                                <h3
                                    class="line-clamp-2 text-[11px] leading-tight font-semibold text-foreground @lg/cat:text-sm @lg/cat:leading-snug"
                                >
                                    {{ product.nama }}
                                </h3>
                                <p
                                    class="mt-1 truncate text-xs font-bold text-indigo-600 @lg/cat:text-sm dark:text-indigo-400"
                                >
                                    {{ formatRupiah(product.harga_jual)
                                    }}<span
                                        v-if="product.tipe_jual === 'curah'"
                                        class="text-[9px] font-medium text-muted-foreground"
                                        >/{{ product.satuan }}</span
                                    >
                                </p>
                                <p
                                    :class="[
                                        'mt-0.5 text-[9px] font-medium @lg/cat:text-[10px]',
                                        product.stok > 10
                                            ? 'text-muted-foreground'
                                            : product.stok > 0
                                              ? 'text-amber-600 dark:text-amber-400'
                                              : 'text-rose-600 dark:text-rose-400',
                                    ]"
                                >
                                    {{
                                        product.stok > 0
                                            ? `Stok ${formatQty(product.stok)}`
                                            : 'Habis'
                                    }}
                                </p>
                            </div>
                        </button>
                    </div>

                    <div
                        v-if="filteredProduks.length === 0"
                        class="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground"
                    >
                        <PackageX class="h-10 w-10 opacity-40" />
                        <p class="font-medium">
                            Tidak ada produk yang sesuai pencarian.
                        </p>
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
                    class="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm @2xl/pos:hidden"
                    @click="cartOpen = false"
                ></div>
            </Transition>

            <!-- ============ KERANJANG (kolom desktop / drawer mobile) ============ -->
            <aside
                :class="[
                    'flex flex-col bg-card shadow-2xl transition-transform duration-300 ease-out',
                    'fixed inset-x-0 bottom-0 z-[60] max-h-[88vh] overflow-y-auto rounded-t-3xl border-t border-sidebar-border/70 dark:border-sidebar-border',
                    cartOpen ? 'translate-y-0' : 'translate-y-full',
                    '@2xl/pos:static @2xl/pos:z-auto @2xl/pos:max-h-none @2xl/pos:w-[300px] @2xl/pos:shrink-0 @2xl/pos:translate-y-0 @2xl/pos:self-start @2xl/pos:overflow-visible @2xl/pos:rounded-2xl @2xl/pos:border @2xl/pos:shadow-sm @4xl/pos:w-[340px] @6xl/pos:w-[380px]',
                ]"
            >
                <!-- Header keranjang: menempel di atas saat drawer mobile di-scroll -->
                <div class="sticky top-0 z-10 shrink-0 bg-card @2xl/pos:static">
                    <!-- handle drawer (mobile) -->
                    <div class="flex justify-center pt-2.5 @2xl/pos:hidden">
                        <span
                            class="h-1.5 w-10 rounded-full bg-slate-300 dark:bg-zinc-700"
                        ></span>
                    </div>
                    <div
                        class="flex items-center justify-between border-b border-sidebar-border/70 px-4 py-3.5 dark:border-sidebar-border"
                    >
                        <div class="flex items-center gap-2">
                            <ShoppingCart
                                class="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                            />
                            <h2 class="font-bold tracking-tight">Keranjang</h2>
                            <span
                                class="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                            >
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

                <!-- Daftar item: tampil sepanjang isinya, tanpa scroll internal (modal/halaman yang scroll) -->
                <div
                    class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border"
                >
                    <div
                        v-if="cartItems.length === 0"
                        class="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center"
                    >
                        <div
                            class="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800"
                        >
                            <ShoppingBag
                                class="h-7 w-7 text-muted-foreground"
                            />
                        </div>
                        <p class="text-sm font-medium text-muted-foreground">
                            Keranjang masih kosong
                        </p>
                        <p class="text-xs text-muted-foreground">
                            Pilih produk atau scan barcode untuk memulai.
                        </p>
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
                                v-else-if="
                                    resolveFoto(item.foto_url ?? item.foto)
                                "
                                :src="
                                    resolveFoto(item.foto_url ?? item.foto) ??
                                    undefined
                                "
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
                                <h4
                                    class="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground"
                                >
                                    {{ item.nama }}
                                    <span
                                        v-if="item.tipe_jual === 'jasa'"
                                        class="inline-flex shrink-0 items-center rounded border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-bold text-violet-600 dark:text-violet-400"
                                    >
                                        Jasa
                                    </span>
                                </h4>
                                <p
                                    v-if="item.tipe_jual === 'jasa'"
                                    class="text-xs text-muted-foreground"
                                >
                                    Fee admin (pendapatan)
                                </p>
                                <p v-else class="text-xs text-muted-foreground">
                                    {{ formatRupiah(item.harga)
                                    }}<span v-if="item.tipe_jual === 'curah'">
                                        / {{ item.satuan }}</span
                                    >
                                </p>
                                <p
                                    class="text-sm font-bold text-indigo-600 dark:text-indigo-400"
                                >
                                    {{ formatRupiah(item.subtotal) }}
                                </p>
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
                                        class="w-10 rounded-md bg-transparent text-center text-sm font-bold text-foreground tabular-nums outline-none focus:ring-2 focus:ring-indigo-500/30"
                                        @focus="
                                            (
                                                $event.target as HTMLInputElement
                                            ).select()
                                        "
                                        @input="setItemQuantity(item, $event)"
                                        @blur="
                                            normalizeItemQuantity(item, $event)
                                        "
                                        @keyup.enter="
                                            (
                                                $event.target as HTMLInputElement
                                            ).blur()
                                        "
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
                        <div
                            v-if="item.tipe_jual === 'curah'"
                            class="mt-2 space-y-1"
                        >
                            <div class="relative">
                                <span
                                    class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs font-semibold text-muted-foreground"
                                    >Rp</span
                                >
                                <input
                                    v-model.number="item.nominal"
                                    type="number"
                                    min="0"
                                    inputmode="numeric"
                                    placeholder="Nominal pembelian (mis. 20000)"
                                    :class="[
                                        'w-full rounded-lg border bg-background py-2 pr-3 pl-8 text-sm font-semibold transition focus:ring-2 focus:ring-indigo-500/20 focus:outline-none',
                                        item.nominal > 0 &&
                                        item.qty > item.stock
                                            ? 'border-rose-500 focus:border-rose-500'
                                            : 'border-sidebar-border/70 focus:border-indigo-500 dark:border-sidebar-border',
                                    ]"
                                    @input="recomputeCurahItem(item)"
                                />
                            </div>
                            <p
                                v-if="
                                    item.nominal > 0 && item.qty <= item.stock
                                "
                                class="text-xs text-muted-foreground"
                            >
                                ≈ {{ formatQty(item.qty) }} {{ item.satuan }} ·
                                stok {{ formatQty(item.stock) }}
                                {{ item.satuan }}
                            </p>
                            <p
                                v-else-if="item.qty > item.stock"
                                class="text-xs font-medium text-rose-600 dark:text-rose-400"
                            >
                                Melebihi stok: butuh {{ formatQty(item.qty) }}
                                {{ item.satuan }}, tersedia
                                {{ formatQty(item.stock) }} {{ item.satuan }}.
                            </p>
                            <p
                                v-else
                                class="text-xs text-amber-600 dark:text-amber-400"
                            >
                                Masukkan nominal pembelian dulu.
                            </p>
                        </div>

                        <!-- Input nominal (titipan) + fee untuk produk jasa -->
                        <div
                            v-if="item.tipe_jual === 'jasa'"
                            class="mt-2 grid grid-cols-2 gap-2"
                        >
                            <div>
                                <label
                                    class="mb-1 block text-[11px] font-medium text-muted-foreground"
                                    >Nominal (titipan)</label
                                >
                                <div class="relative">
                                    <span
                                        class="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs font-semibold text-muted-foreground"
                                        >Rp</span
                                    >
                                    <input
                                        v-model.number="item.nominal"
                                        type="number"
                                        min="0"
                                        inputmode="numeric"
                                        placeholder="500000"
                                        :data-jasa-nominal="item.uid"
                                        :class="[
                                            'w-full rounded-lg border bg-background py-2 pr-2 pl-7 text-sm font-semibold transition focus:ring-2 focus:ring-indigo-500/20 focus:outline-none',
                                            (Number(item.nominal) || 0) <= 0
                                                ? 'border-amber-500/50 focus:border-amber-500'
                                                : 'border-sidebar-border/70 focus:border-indigo-500 dark:border-sidebar-border',
                                        ]"
                                        @input="recomputeJasaItem(item)"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    class="mb-1 flex items-center gap-1 text-[11px] font-medium text-muted-foreground"
                                >
                                    Fee
                                    <span
                                        v-if="item.tarifs.length > 0"
                                        class="inline-flex items-center gap-0.5 rounded bg-violet-500/10 px-1 py-0.5 text-[9px] font-semibold text-violet-600 dark:text-violet-400"
                                    >
                                        <Lock class="h-2.5 w-2.5" /> Otomatis
                                    </span>
                                </label>
                                <div class="relative">
                                    <span
                                        class="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs font-semibold text-muted-foreground"
                                        >Rp</span
                                    >
                                    <input
                                        v-model.number="item.fee"
                                        type="number"
                                        min="0"
                                        inputmode="numeric"
                                        placeholder="5000"
                                        :readonly="item.tarifs.length > 0"
                                        :class="[
                                            'w-full rounded-lg border py-2 pr-2 pl-7 text-sm font-semibold transition focus:ring-2 focus:ring-indigo-500/20 focus:outline-none',
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
                            <p
                                v-if="
                                    item.tarifs.length > 0 &&
                                    appliedTarifLabel(item)
                                "
                                class="col-span-2 -mt-0.5 text-[11px] font-medium text-violet-600 dark:text-violet-400"
                            >
                                Tarif: {{ appliedTarifLabel(item) }}
                            </p>
                            <p
                                v-else-if="item.tarifs.length > 0"
                                class="col-span-2 -mt-0.5 text-[11px] text-muted-foreground"
                            >
                                Isi nominal dulu — fee terisi otomatis dari
                                tarif.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Ringkasan + pembayaran -->
                <div
                    class="shrink-0 border-t border-sidebar-border/70 bg-slate-50/60 pb-[env(safe-area-inset-bottom)] dark:border-sidebar-border dark:bg-zinc-900/40"
                >
                    <template v-if="cartItems.length">
                        <!-- Pelanggan & promo: selalu terlihat agar kasir tidak terlewat memilih -->
                        <div
                            class="space-y-2.5 border-b border-sidebar-border/70 px-4 py-3 dark:border-sidebar-border"
                        >
                            <!-- Pelanggan: pencarian server-side -->
                            <div ref="pelangganBoxRef" class="relative">
                                <label
                                    class="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground"
                                >
                                    <Users class="h-3.5 w-3.5" /> Pelanggan
                                </label>

                                <!-- Pelanggan terpilih (chip) -->
                                <div
                                    v-if="selectedPelanggan"
                                    class="flex items-center justify-between gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/5 px-3 py-2"
                                >
                                    <span
                                        class="flex min-w-0 items-center gap-1.5"
                                    >
                                        <span
                                            class="truncate text-sm font-semibold text-foreground"
                                            >{{ selectedPelanggan.nama }}</span
                                        >
                                        <span
                                            v-if="
                                                selectedPelanggan.tipe ===
                                                'reseller'
                                            "
                                            class="shrink-0 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"
                                            >Reseller</span
                                        >
                                    </span>
                                    <button
                                        type="button"
                                        aria-label="Hapus pelanggan"
                                        class="rounded-lg p-1 text-muted-foreground transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                                        @click="clearPelanggan"
                                    >
                                        <X class="h-4 w-4" />
                                    </button>
                                </div>

                                <!-- Input pencarian -->
                                <div v-else class="relative">
                                    <Search
                                        class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                    />
                                    <input
                                        v-model="pelangganQuery"
                                        type="text"
                                        placeholder="Cari nama pelanggan..."
                                        aria-label="Cari pelanggan"
                                        class="w-full rounded-xl border border-sidebar-border/70 bg-background py-2 pr-9 pl-9 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                                        @input="onPelangganInput"
                                        @focus="openPelangganDropdown"
                                    />
                                    <Loader2
                                        v-if="pelangganSearching"
                                        class="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
                                    />
                                </div>

                                <!-- Dropdown hasil pencarian -->
                                <div
                                    v-if="
                                        pelangganDropdownOpen &&
                                        !selectedPelanggan
                                    "
                                    class="absolute inset-x-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-sidebar-border/70 bg-card py-1 shadow-xl dark:border-sidebar-border"
                                >
                                    <button
                                        type="button"
                                        class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-zinc-800"
                                        @click="selectPelanggan(null)"
                                    >
                                        <Users
                                            class="h-4 w-4 shrink-0 text-muted-foreground"
                                        />
                                        Umum (tanpa potongan)
                                    </button>
                                    <button
                                        v-for="p in pelangganResults"
                                        :key="p.id_pelanggan"
                                        type="button"
                                        class="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-zinc-800"
                                        @click="selectPelanggan(p)"
                                    >
                                        <span class="truncate">{{
                                            p.nama
                                        }}</span>
                                        <span
                                            v-if="p.tipe === 'reseller'"
                                            class="shrink-0 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"
                                            >Reseller</span
                                        >
                                    </button>
                                    <p
                                        v-if="pelangganSearching"
                                        class="px-3 py-2 text-xs text-muted-foreground"
                                    >
                                        Mencari…
                                    </p>
                                    <p
                                        v-else-if="
                                            pelangganResults.length === 0
                                        "
                                        class="px-3 py-2 text-xs text-muted-foreground"
                                    >
                                        Pelanggan tidak ditemukan.
                                    </p>
                                </div>

                                <p
                                    v-if="isReseller"
                                    class="mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
                                >
                                    Harga reseller diterapkan ke produk yang
                                    punya potongan.
                                </p>
                            </div>

                            <!-- Promo keranjang: otomatis, tanpa perlu dipilih kasir -->
                            <div
                                v-if="autoGlobalPromo"
                                class="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2"
                            >
                                <Percent
                                    class="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                                />
                                <span
                                    class="min-w-0 flex-1 truncate text-xs font-semibold text-foreground"
                                    >{{ autoGlobalPromo.nama }}</span
                                >
                                <span
                                    class="shrink-0 text-xs font-bold text-emerald-600 tabular-nums dark:text-emerald-400"
                                    >-{{
                                        formatRupiah(globalPromoDiscount)
                                    }}</span
                                >
                            </div>
                            <p
                                v-else-if="
                                    pendingGlobalPromo &&
                                    pendingGlobalPromo.minimal_belanja
                                "
                                class="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400"
                            >
                                <Percent class="h-3.5 w-3.5 shrink-0" />
                                Belanja
                                {{
                                    formatRupiah(
                                        pendingGlobalPromo.minimal_belanja -
                                            totalHarga,
                                    )
                                }}
                                lagi untuk promo {{ pendingGlobalPromo.nama }}.
                            </p>
                        </div>

                        <div class="space-y-3 p-4">
                            <!-- Mode keranjang: proses langsung vs simpan pesanan -->
                            <div class="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    :class="[
                                        'flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition',
                                        cartMode === 'proses'
                                            ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                            : 'border-sidebar-border/70 bg-background text-muted-foreground hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800',
                                    ]"
                                    @click="cartMode = 'proses'"
                                >
                                    <Banknote class="h-4 w-4" /> Proses Sekarang
                                </button>
                                <button
                                    type="button"
                                    :disabled="!allSatuan"
                                    :class="[
                                        'flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40',
                                        cartMode === 'pesanan'
                                            ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                                            : 'border-sidebar-border/70 bg-background text-muted-foreground hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800',
                                    ]"
                                    @click="setPesananMode()"
                                >
                                    <ClipboardList class="h-4 w-4" /> Simpan
                                    Pesanan
                                </button>
                            </div>
                            <p
                                v-if="!allSatuan && cartItems.length"
                                class="-mt-1 text-[11px] text-muted-foreground"
                            >
                                Simpan pesanan hanya untuk produk satuan.
                            </p>

                            <!-- Rincian + Total (hero) -->
                            <div class="space-y-1.5">
                                <template v-if="cartMode === 'proses'">
                                    <div
                                        class="flex items-center justify-between text-xs text-muted-foreground"
                                    >
                                        <span>Subtotal</span>
                                        <span class="tabular-nums">{{
                                            formatRupiah(totalHarga)
                                        }}</span>
                                    </div>
                                    <div
                                        v-if="totalDiscount > 0"
                                        class="flex items-center justify-between text-xs"
                                    >
                                        <span class="text-muted-foreground"
                                            >Diskon</span
                                        >
                                        <span
                                            class="font-medium text-emerald-600 tabular-nums dark:text-emerald-400"
                                            >-{{
                                                formatRupiah(totalDiscount)
                                            }}</span
                                        >
                                    </div>
                                    <div
                                        v-if="totalNominalJasa > 0"
                                        class="flex items-center justify-between text-xs"
                                    >
                                        <span class="text-muted-foreground"
                                            >Titipan layanan (bukan omzet)</span
                                        >
                                        <span class="tabular-nums"
                                            >+{{
                                                formatRupiah(totalNominalJasa)
                                            }}</span
                                        >
                                    </div>
                                </template>
                                <div
                                    class="flex items-baseline justify-between border-t border-sidebar-border/70 pt-2 dark:border-sidebar-border"
                                >
                                    <span class="text-sm font-bold">{{
                                        cartMode === 'pesanan'
                                            ? 'Estimasi total'
                                            : totalNominalJasa > 0
                                              ? 'Total Bayar'
                                              : 'Total'
                                    }}</span>
                                    <span
                                        class="text-2xl font-extrabold text-indigo-600 tabular-nums dark:text-indigo-400"
                                        >{{
                                            formatRupiah(
                                                cartMode === 'pesanan'
                                                    ? pesananEstimasi
                                                    : totalTagihan,
                                            )
                                        }}</span
                                    >
                                </div>
                            </div>

                            <!-- Pembayaran (hanya mode proses langsung) -->
                            <template v-if="cartMode === 'proses'">
                                <!-- Metode pembayaran -->
                                <div>
                                    <label
                                        class="mb-1.5 block text-[11px] font-semibold text-muted-foreground"
                                        >Metode pembayaran</label
                                    >
                                    <div class="grid grid-cols-3 gap-2">
                                        <button
                                            v-for="method in paymentMethods"
                                            :key="method.value"
                                            type="button"
                                            :class="[
                                                'flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs font-semibold transition',
                                                form.metode_pembayaran ===
                                                method.value
                                                    ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                                    : 'border-sidebar-border/70 bg-background text-muted-foreground hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800',
                                            ]"
                                            @click="
                                                form.metode_pembayaran =
                                                    method.value
                                            "
                                        >
                                            <component
                                                :is="method.icon"
                                                class="h-4 w-4"
                                            />
                                            {{ method.label }}
                                        </button>
                                    </div>
                                </div>

                                <!-- Uang diterima -->
                                <div>
                                    <label
                                        class="mb-1.5 block text-[11px] font-semibold text-muted-foreground"
                                        >Uang diterima</label
                                    >
                                    <div class="relative">
                                        <span
                                            class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-muted-foreground"
                                            >Rp</span
                                        >
                                        <input
                                            v-model="form.bayar"
                                            type="number"
                                            min="0"
                                            inputmode="numeric"
                                            placeholder="0"
                                            class="w-full rounded-xl border border-sidebar-border/70 bg-background py-2.5 pr-3 pl-9 text-sm font-semibold transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                                        />
                                    </div>
                                    <div
                                        v-if="
                                            form.metode_pembayaran === 'cash' &&
                                            cashSuggestions.length
                                        "
                                        class="mt-2 flex flex-wrap gap-2"
                                    >
                                        <button
                                            type="button"
                                            class="rounded-lg border border-indigo-500/30 bg-indigo-500/5 px-2.5 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-500/10 dark:text-indigo-400"
                                            @click="
                                                form.bayar =
                                                    String(totalTagihan)
                                            "
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
                                    <p
                                        v-if="form.errors.bayar"
                                        class="mt-1 text-xs text-rose-600"
                                    >
                                        {{ form.errors.bayar }}
                                    </p>
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
                                    <span>{{
                                        isPaid
                                            ? 'Kembalian'
                                            : 'Uang masih kurang'
                                    }}</span>
                                    <span class="tabular-nums">{{
                                        isPaid
                                            ? formatRupiah(kembalian)
                                            : formatRupiah(
                                                  totalTagihan -
                                                      (Number(form.bayar) || 0),
                                              )
                                    }}</span>
                                </div>

                                <p
                                    v-if="hasInvalidItems"
                                    class="text-center text-xs font-medium text-amber-600 dark:text-amber-400"
                                >
                                    Lengkapi nominal produk curah & nominal/fee
                                    layanan, pastikan tidak melebihi stok.
                                </p>
                            </template>

                            <!-- Data pemesan (mode simpan pesanan) -->
                            <template v-else>
                                <div>
                                    <label
                                        class="mb-1 block text-[11px] font-semibold text-muted-foreground"
                                        >Nama pemesan</label
                                    >
                                    <div class="relative">
                                        <Users
                                            class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                        />
                                        <input
                                            v-model="orderNama"
                                            type="text"
                                            placeholder="Nama pelanggan"
                                            class="w-full rounded-xl border border-sidebar-border/70 bg-background py-2.5 pr-3 pl-9 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        class="mb-1 block text-[11px] font-semibold text-muted-foreground"
                                        >Nomor WhatsApp</label
                                    >
                                    <div class="relative">
                                        <Phone
                                            class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                        />
                                        <input
                                            v-model="orderTelp"
                                            type="tel"
                                            inputmode="tel"
                                            placeholder="08…"
                                            class="w-full rounded-xl border border-sidebar-border/70 bg-background py-2.5 pr-3 pl-9 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        class="mb-1 block text-[11px] font-semibold text-muted-foreground"
                                        >Catatan (opsional)</label
                                    >
                                    <input
                                        v-model="orderCatatan"
                                        type="text"
                                        placeholder="Catatan pesanan"
                                        class="w-full rounded-xl border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                                    />
                                </div>
                                <p
                                    class="rounded-lg bg-amber-500/5 px-3 py-2 text-[11px] text-amber-700 dark:text-amber-400"
                                >
                                    Pesanan disimpan sebagai pending & stok
                                    di-reserve. Bayar nanti saat pelanggan ambil
                                    barang.
                                </p>
                            </template>

                            <button
                                type="button"
                                class="flex w-full items-center justify-between gap-2 rounded-2xl px-5 py-3.5 text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-50"
                                :class="
                                    cartMode === 'pesanan'
                                        ? 'bg-amber-500 hover:bg-amber-400'
                                        : 'bg-indigo-600 hover:bg-indigo-500'
                                "
                                :disabled="
                                    cartItems.length === 0 ||
                                    form.processing ||
                                    (cartMode === 'proses'
                                        ? hasInvalidItems
                                        : !pesananReady)
                                "
                                @click="submitTransaction"
                            >
                                <span
                                    class="flex items-center gap-2 text-sm font-bold"
                                >
                                    <Loader2
                                        v-if="form.processing"
                                        class="h-4 w-4 animate-spin"
                                    />
                                    <ClipboardList
                                        v-else-if="cartMode === 'pesanan'"
                                        class="h-4 w-4"
                                    />
                                    <ArrowRight v-else class="h-4 w-4" />
                                    {{
                                        form.processing
                                            ? 'Memproses...'
                                            : cartMode === 'pesanan'
                                              ? 'Simpan sebagai Pesanan'
                                              : 'Bayar Sekarang'
                                    }}
                                </span>
                                <span
                                    v-if="!form.processing"
                                    class="text-base font-extrabold tabular-nums"
                                    >{{
                                        formatRupiah(
                                            cartMode === 'pesanan'
                                                ? pesananEstimasi
                                                : totalTagihan,
                                        )
                                    }}</span
                                >
                            </button>
                        </div>
                    </template>

                    <!-- Footer saat keranjang kosong -->
                    <div v-else class="p-4">
                        <div
                            class="flex w-full items-center justify-center rounded-2xl border border-dashed border-sidebar-border/70 bg-background px-5 py-3.5 text-sm font-semibold text-muted-foreground dark:border-sidebar-border"
                        >
                            Tambahkan produk untuk mulai transaksi
                        </div>
                    </div>
                </div>
            </aside>
        </div>

        <!-- ============ Bottom bar keranjang (mobile) ============ -->
        <!-- Ditumpuk tepat di atas Bottom Navigation (tinggi 3.75rem + safe area), bukan di bawahnya. -->
        <div
            class="fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] z-30 border-t border-sidebar-border/70 bg-card/95 p-3 backdrop-blur @2xl/pos:hidden dark:border-sidebar-border"
        >
            <button
                type="button"
                class="flex w-full items-center justify-between gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-white shadow-lg transition active:scale-[0.99]"
                @click="cartOpen = true"
            >
                <span class="relative flex items-center gap-2">
                    <ShoppingCart class="h-5 w-5" />
                    <span
                        class="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-indigo-600"
                    >
                        {{ cartCount }}
                    </span>
                </span>
                <span class="flex flex-1 flex-col items-start leading-tight">
                    <span class="text-[11px] font-medium text-indigo-100"
                        >{{ cartItems.length }} item</span
                    >
                    <span class="text-base font-extrabold tabular-nums">{{
                        formatRupiah(totalTagihan)
                    }}</span>
                </span>
                <span class="flex items-center gap-1 text-sm font-bold">
                    Lihat
                    <ChevronUp class="h-4 w-4" />
                </span>
            </button>
        </div>

        <!-- ============ Modal "Transaksi Selesai" (cetak struk / selesai) ============ -->
        <Teleport to="body">
            <div
                v-if="showStrukSelesai && lastStruk"
                class="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                @click.self="tutupStrukSelesai"
            >
                <div
                    class="w-full max-w-sm rounded-2xl border border-sidebar-border/70 bg-card p-6 text-center shadow-2xl dark:border-sidebar-border"
                >
                    <div
                        class="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    >
                        <CheckCircle2 class="h-8 w-8" />
                    </div>
                    <h2 class="mt-4 text-lg font-bold">Transaksi Selesai</h2>
                    <p class="mt-1 text-sm text-muted-foreground">
                        {{ lastStruk.kode }} berhasil disimpan.
                    </p>

                    <div
                        class="mt-4 space-y-1.5 rounded-xl border border-sidebar-border/70 bg-background p-3.5 text-sm dark:border-sidebar-border"
                    >
                        <div class="flex items-center justify-between">
                            <span class="text-muted-foreground">Total</span>
                            <span class="font-bold tabular-nums">{{
                                formatRupiah(lastStruk.total_harga)
                            }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-muted-foreground">Bayar</span>
                            <span class="font-medium tabular-nums">{{
                                formatRupiah(lastStruk.bayar)
                            }}</span>
                        </div>
                        <div
                            class="flex items-center justify-between border-t border-dashed border-sidebar-border/70 pt-1.5 dark:border-sidebar-border"
                        >
                            <span class="font-semibold">Kembalian</span>
                            <span
                                class="font-bold text-emerald-600 tabular-nums dark:text-emerald-400"
                                >{{ formatRupiah(lastStruk.kembalian) }}</span
                            >
                        </div>
                    </div>

                    <div class="mt-6 flex flex-col gap-2">
                        <button
                            type="button"
                            class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
                            @click="cetakStruk"
                        >
                            <Printer class="h-4 w-4" />
                            Cetak Struk Belanja
                        </button>
                        <button
                            type="button"
                            class="inline-flex w-full cursor-pointer items-center justify-center rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"
                            @click="tutupStrukSelesai"
                        >
                            Selesai
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
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
