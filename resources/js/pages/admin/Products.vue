<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import {
    Plus,
    Search,
    Package,
    Layers,
    AlertTriangle,
    Edit,
    Trash2,
    X,
    Save,
    AlertCircle,
    ImageIcon,
    Barcode,
    Printer,
    SlidersHorizontal,
    ChevronDown,
    ArrowUpAZ,
    ArrowDownAZ,
    TrendingDown,
    TrendingUp,
    PackageMinus,
    PackagePlus,
    Sparkles,
    Scale,
    HandCoins,
    ShoppingBag,
    ChefHat,
    Tag,
    Wallet,
    Info,
    ScanLine,
    Check,
    Upload,
} from 'lucide-vue-next';
import { ref, computed, nextTick, onBeforeUnmount, watch, onMounted } from 'vue';
import JsBarcode from 'jsbarcode';
import { store as productStore, update as productUpdate, destroy as productDestroy, generateAll as productGenerateAll } from '@/routes/admin/products';
import { usePagination } from '@/composables/usePagination';
import Pagination from '@/components/Pagination.vue';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Data Produk',
                href: '/admin/products',
            },
        ],
    },
});

interface Kategori {
    id_kategori: number;
    nama_kategori: string;
}

type TipeJual = 'satuan' | 'curah' | 'jasa';

interface Produk {
    id_produk: number;
    nama: string;
    jenis: 'beli' | 'produksi';
    tipe_jual: TipeJual;
    satuan: string;
    kategori: string | null;
    id_kategori: number;
    harga_jual: number;
    harga_modal: number;
    potongan_reseller: number;
    stok: number;
    barcode: string | null;
    sku: string | null;
    foto: string | null;
    foto_url?: string | null;
    status_stok: 'in-stock' | 'low-stock' | 'out-of-stock';
}

interface Stats {
    total_produk: number;
    total_kategori: number;
    stok_bermasalah: number;
}

const props = defineProps<{
    produks: Produk[];
    kategoris: Kategori[];
    stats: Stats;
}>();

// Search & filter
const searchQuery = ref('');
const filterKategori = ref('');
const sortBy = ref('');
const showFilterPanel = ref(false);
const filterPanelRef = ref<HTMLDivElement | null>(null);

const sortOptions = [
    { value: 'nama_asc', label: 'Nama A–Z', icon: ArrowUpAZ },
    { value: 'nama_desc', label: 'Nama Z–A', icon: ArrowDownAZ },
    { value: 'harga_asc', label: 'Harga Terendah', icon: TrendingDown },
    { value: 'harga_desc', label: 'Harga Tertinggi', icon: TrendingUp },
    { value: 'stok_asc', label: 'Stok Terendah', icon: PackageMinus },
    { value: 'stok_desc', label: 'Stok Tertinggi', icon: PackagePlus },
];

const activeFilterCount = computed(() => {
    let count = 0;
    if (filterKategori.value) count++;
    if (sortBy.value) count++;
    return count;
});

function clearFilters() {
    filterKategori.value = '';
    sortBy.value = '';
}

function handleClickOutsideFilter(event: MouseEvent) {
    if (filterPanelRef.value && !filterPanelRef.value.contains(event.target as Node)) {
        showFilterPanel.value = false;
    }
}

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutsideFilter);
});

const filteredProduks = computed(() => {
    let result = props.produks.filter((p) => {
        const matchSearch = !searchQuery.value || p.nama.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchKategori = !filterKategori.value || String(p.id_kategori) === filterKategori.value;
        return matchSearch && matchKategori;
    });

    if (sortBy.value === 'nama_asc') result = [...result].sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
    else if (sortBy.value === 'nama_desc') result = [...result].sort((a, b) => b.nama.localeCompare(a.nama, 'id'));
    else if (sortBy.value === 'harga_asc') result = [...result].sort((a, b) => a.harga_jual - b.harga_jual);
    else if (sortBy.value === 'harga_desc') result = [...result].sort((a, b) => b.harga_jual - a.harga_jual);
    else if (sortBy.value === 'stok_asc') result = [...result].sort((a, b) => a.stok - b.stok);
    else if (sortBy.value === 'stok_desc') result = [...result].sort((a, b) => b.stok - a.stok);

    return result;
});

const { currentPage, perPage, totalItems, totalPages, paginatedItems: paginatedProduks, startIndex, endIndex, goToPage, visiblePages } = usePagination(() => filteredProduks.value);

// Format rupiah
function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

// Stok bisa pecahan (curah) — tampilkan tanpa nol di belakang yang tak perlu.
function formatStok(value: number): string {
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 3 }).format(Number(value) || 0);
}

const tipeJualBadge: Record<string, { label: string; class: string }> = {
    curah: { label: 'Curah', class: 'border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400' },
    jasa: { label: 'Jasa', class: 'border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400' },
};

function resolveFoto(foto: string | null): string | null {
    if (!foto) {
        return null;
    }

    if (foto.startsWith('http://') || foto.startsWith('https://') || foto.startsWith('/')) {
        return foto;
    }

    return `/storage/${foto}`;
}

// Modal
const showModal = ref(false);
const editingProduk = ref<Produk | null>(null);
const isScannerDetected = ref(false);
const scannerStatusText = ref('Scanner tidak terdeteksi');
const scannerBuffer = ref('');
const lastScannerTime = ref(0);
const SCANNER_TIMEOUT_MS = 150;
const SCANNER_MIN_LENGTH = 3;

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
    id_kategori: '',
    jenis: 'beli',
    tipe_jual: 'satuan' as TipeJual,
    satuan: 'pcs',
    nama: '',
    foto: '',
    foto_upload: null as File | null,
    harga_jual: '',
    harga_modal: '',
    potongan_reseller: '',
    stok: '',
    barcode: '',
    sku: '',
});

// Harga setelah potongan reseller & peringatan bila di bawah modal (jual rugi).
const hargaReseller = computed(() => Math.max(0, Number(form.harga_jual || 0) - Number(form.potongan_reseller || 0)));
const resellerBelowModal = computed(() => {
    const potongan = Number(form.potongan_reseller || 0);
    if (potongan <= 0) return false;

    return hargaReseller.value < Number(form.harga_modal || 0);
});

const tipeJualOptions: { value: TipeJual; label: string; short: string; hint: string; icon: typeof Package }[] = [
    { value: 'satuan', label: 'Satuan', short: 'per biji', hint: 'Dihitung per buah/bungkus. Cocok untuk cemilan, kue, permen.', icon: Package },
    { value: 'curah', label: 'Curah', short: 'per takaran', hint: 'Dijual per liter/kg, boleh pecahan. Kasir bisa input rupiah (mis. bensin, bawang).', icon: Scale },
    { value: 'jasa', label: 'Jasa', short: 'biaya admin', hint: 'Tanpa stok. Harga = fee/biaya admin (mis. transfer, tarik tunai).', icon: HandCoins },
];

const jenisOptions: { value: 'beli' | 'produksi'; label: string; hint: string; icon: typeof Package }[] = [
    { value: 'beli', label: 'Beli Jadi', hint: 'Dibeli dari agen / supplier', icon: ShoppingBag },
    { value: 'produksi', label: 'Buatan Sendiri', hint: 'Modal dihitung dari produksi', icon: ChefHat },
];

// Saran satuan sesuai tipe jual (tetap bisa diketik bebas).
const satuanSuggestions = computed<string[]>(() => {
    if (form.tipe_jual === 'curah') return ['liter', 'kg', 'gram', 'meter'];
    if (form.tipe_jual === 'jasa') return ['transaksi', 'layanan'];
    return ['pcs', 'bungkus', 'box', 'pack'];
});

const fotoUploadName = computed(() => form.foto_upload?.name ?? '');

// Preview object-URL untuk file yang baru dipilih (di-revoke saat ganti/tutup).
const fotoUploadPreview = ref<string | null>(null);

function setFotoUploadPreview(file: File | null) {
    if (fotoUploadPreview.value) {
        URL.revokeObjectURL(fotoUploadPreview.value);
        fotoUploadPreview.value = null;
    }

    if (file) {
        fotoUploadPreview.value = URL.createObjectURL(file);
    }
}

// Gambar yang ditampilkan di kotak preview: prioritaskan file baru, lalu URL/path.
const fotoPreviewUrl = computed<string | null>(() => fotoUploadPreview.value ?? resolveFoto(form.foto));

function openTambah() {
    editingProduk.value = null;
    form.reset();
    form.foto_upload = null;
    setFotoUploadPreview(null);
    showModal.value = true;
    startScannerListening();
}

function openEdit(produk: Produk) {
    editingProduk.value = produk;
    form.id_kategori = String(produk.id_kategori);
    form.jenis = produk.jenis;
    form.tipe_jual = produk.tipe_jual ?? 'satuan';
    form.satuan = produk.satuan ?? 'pcs';
    form.nama = produk.nama;
    form.foto = produk.foto ?? '';
    form.foto_upload = null;
    form.harga_jual = String(produk.harga_jual);
    form.harga_modal = String(produk.harga_modal);
    form.potongan_reseller = String(produk.potongan_reseller ?? 0);
    form.stok = String(produk.stok);
    form.barcode = produk.barcode ?? '';
    form.sku = produk.sku ?? '';
    setFotoUploadPreview(null);
    showModal.value = true;
    startScannerListening();
}

function closeModal() {
    showModal.value = false;
    stopScannerListening();
    form.reset();
    form.foto_upload = null;
    setFotoUploadPreview(null);
    form.clearErrors();
}

function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    form.foto_upload = file;
    setFotoUploadPreview(file);

    if (file) {
        form.foto = '';
    }
}

function clearFoto() {
    form.foto = '';
    form.foto_upload = null;
    setFotoUploadPreview(null);
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

function handleScannerKeydown(event: KeyboardEvent): void {
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
            form.barcode = barcode;
            form.clearErrors('barcode');
        }

        scannerBuffer.value = '';

        return;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
        scannerBuffer.value += event.key;
    }
}

function startScannerListening(): void {
    document.addEventListener('keydown', handleScannerKeydown);
    void detectScannerDevice();

    const hid = getHidApi();

    hid?.addEventListener('connect', handleScannerDeviceConnectionChange);
    hid?.addEventListener('disconnect', handleScannerDeviceConnectionChange);
}

function stopScannerListening(): void {
    document.removeEventListener('keydown', handleScannerKeydown);
    scannerBuffer.value = '';

    const hid = getHidApi();

    hid?.removeEventListener('connect', handleScannerDeviceConnectionChange);
    hid?.removeEventListener('disconnect', handleScannerDeviceConnectionChange);
}

onBeforeUnmount(() => {
    stopScannerListening();
    setFotoUploadPreview(null);
    document.removeEventListener('mousedown', handleClickOutsideFilter);
});


const lastGeneratedSku = ref('');

function generateSKUFromBarcode(barcode: string): string {
    const normalized = barcode
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 12);

    return normalized ? `SKU-${normalized}` : '';
}

watch(
    () => form.barcode,
    (barcode) => {
        const value = String(barcode || '').trim();
        const generated = generateSKUFromBarcode(value);

        if (!value) {
            lastGeneratedSku.value = '';

            return;
        }

        if (!form.sku || form.sku === lastGeneratedSku.value) {
            form.sku = generated;
            lastGeneratedSku.value = generated;
        }
    },
);

// Check digit (digit ke-13) EAN-13 dari 12 digit awal.
function ean13CheckDigit(base12: string): string {
    let sum = 0;
    for (let i = 0; i < base12.length; i++) {
        sum += Number(base12[i]) * (i % 2 === 0 ? 1 : 3);
    }
    return String((10 - (sum % 10)) % 10);
}

// Barcode EAN-13 internal toko: prefix "2" (in-store) + 11 digit acak + check digit.
function generateEan13(): string {
    let base = '2';
    for (let i = 0; i < 11; i++) {
        base += Math.floor(Math.random() * 10);
    }
    return base + ean13CheckDigit(base);
}

// Tombol "Generate Otomatis" pada form: isi barcode sekaligus SKU turunannya.
function generateBarcodeAndSku(): void {
    const barcode = generateEan13();
    const sku = generateSKUFromBarcode(barcode);
    form.barcode = barcode;
    form.sku = sku;
    lastGeneratedSku.value = sku;
    form.clearErrors('barcode', 'sku');
}

// Tombol massal: minta backend membuat barcode + SKU untuk semua produk tanpa barcode.
const generatingAll = ref(false);

function runGenerateAllBarcodes(): void {
    const tanpaBarcode = props.produks.filter((p) => p.tipe_jual !== 'jasa' && !p.barcode).length;

    if (tanpaBarcode === 0) {
        alert('Semua produk (non-jasa) sudah memiliki barcode. Tidak ada yang perlu dibuat.');
        return;
    }

    if (!confirm(`Buat barcode & SKU otomatis untuk ${tanpaBarcode} produk yang belum memiliki barcode? Produk jasa dilewati.`)) {
        return;
    }

    router.post(productGenerateAll().url, {}, {
        preserveScroll: true,
        onStart: () => (generatingAll.value = true),
        onFinish: () => (generatingAll.value = false),
    });
}

function submitForm() {
    const data = {
        ...form.data(),
        id_kategori: Number(form.id_kategori),
        foto: form.foto || null,
        harga_jual: Number(form.harga_jual),
        harga_modal: form.jenis === 'produksi' ? 0 : Number(form.harga_modal || 0),
        // Jasa tidak punya stok fisik / potongan reseller; backend juga memaksanya ke 0.
        stok: form.tipe_jual === 'jasa' ? 0 : Number(form.stok || 0),
        potongan_reseller: form.tipe_jual === 'jasa' ? 0 : Number(form.potongan_reseller || 0),
        satuan: form.satuan || 'pcs',
    };

    if (editingProduk.value) {
        router.put(productUpdate(editingProduk.value.id_produk).url, data, {
            onSuccess: () => closeModal(),
        });
    } else {
        router.post(productStore().url, data, {
            onSuccess: () => closeModal(),
        });
    }
}

function hapusProduk(produk: Produk) {
    if (confirm(`Hapus produk "${produk.nama}"? Tindakan ini tidak dapat dibatalkan.`)) {
        router.delete(productDestroy(produk.id_produk).url);
    }
}

const statusLabel: Record<string, string> = {
    'in-stock': 'Stok Tersedia',
    'low-stock': 'Hampir Habis',
    'out-of-stock': 'Stok Habis',
};

// Barcode print
const showBarcodeModal = ref(false);
const barcodePrintList = ref<Produk[]>([]);
const barcodeRefs = ref<SVGElement[]>([]);

function openPrintBarcode(produk: Produk) {
    barcodePrintList.value = [produk];
    showBarcodeModal.value = true;
    nextTick(() => renderBarcodes());
}

function openPrintAllBarcodes() {
    barcodePrintList.value = filteredProduks.value.filter((p) => p.barcode);
    showBarcodeModal.value = true;
    nextTick(() => renderBarcodes());
}

function closeBarcodeModal() {
    showBarcodeModal.value = false;
    barcodePrintList.value = [];
    barcodeRefs.value = [];
}

function renderBarcodes() {
    barcodeRefs.value.forEach((el, i) => {
        const barcode = barcodePrintList.value[i]?.barcode;
        if (barcode && el) {
            try {
                JsBarcode(el, barcode, {
                    format: 'CODE128',
                    width: 2,
                    height: 60,
                    displayValue: true,
                    fontSize: 12,
                    margin: 8,
                    background: '#ffffff',
                    lineColor: '#000000',
                });
            } catch {
                // barcode value may be invalid for CODE128
            }
        }
    });
}

function setBarcodeRef(el: unknown, index: number) {
    if (el instanceof SVGElement) {
        barcodeRefs.value[index] = el;
    }
}

function printBarcodes() {
    const labels = barcodePrintList.value
        .map((produk, i) => {
            const svgEl = barcodeRefs.value[i];
            const svgHtml = svgEl ? svgEl.outerHTML : '';
            return `
                <div class="label">
                    ${svgHtml}
                    <p class="nama">${produk.nama}</p>
                    <p class="harga">${formatRupiah(produk.harga_jual)}</p>
                </div>
            `;
        })
        .join('');

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <title>Cetak Barcode Produk</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: Arial, sans-serif; background: #fff; padding: 16px; }
                .labels { display: flex; flex-wrap: wrap; gap: 12px; }
                .label {
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    padding: 10px 12px;
                    text-align: center;
                    width: 200px;
                    page-break-inside: avoid;
                }
                .label svg { max-width: 100%; height: auto; }
                .nama { font-size: 12px; font-weight: bold; margin-top: 6px; word-break: break-word; }
                .harga { font-size: 11px; color: #444; margin-top: 2px; }
                @media print {
                    body { padding: 8px; }
                    .labels { gap: 8px; }
                }
            </style>
        </head>
        <body>
            <div class="labels">${labels}</div>
            <script>
                window.onload = function() {
                    setTimeout(function() { window.print(); }, 300);
                };
            <\/script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

const statusClass: Record<string, string> = {
    'in-stock': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    'low-stock': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    'out-of-stock': 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};
</script>

<template>
    <Head title="Data Produk - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <!-- Header Section -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">Manajemen Produk</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Kelola data produk, persediaan stok, kategori barang, dan harga penjualan toko
                    Anda.
                </p>
            </div>

            <button
                id="btn-tambah-produk"
                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                @click="openTambah"
            >
                <Plus class="h-4 w-4" />
                Tambah Produk Baru
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
                    <Package class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Produk</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_produk }} Item</h3>
                </div>
            </div>
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400"
                >
                    <Layers class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Kategori</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_kategori }} Kategori</h3>
                </div>
            </div>
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400"
                >
                    <AlertTriangle class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Stok Menipis / Habis</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.stok_bermasalah }} Produk</h3>
                </div>
            </div>
        </div>

        <!-- Filters & Table Section -->
        <div
            class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"
        >
            <!-- Table Action Bar -->
            <div class="border-b border-sidebar-border/70 dark:border-sidebar-border">
                <div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <!-- Search -->
                    <div class="relative flex-1 max-w-sm">
                        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Cari produk berdasarkan nama..."
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm transition-colors focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                        />
                    </div>

                    <!-- Right buttons -->
                    <div class="flex shrink-0 gap-2">
                        <!-- Filter Trigger + Dropdown -->
                        <div ref="filterPanelRef" class="relative">
                            <button
                                class="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-150"
                                :class="activeFilterCount > 0
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-500'
                                    : 'border border-sidebar-border/70 bg-background text-slate-700 hover:bg-slate-50 dark:border-sidebar-border dark:text-slate-200 dark:hover:bg-zinc-800/40'"
                                @click="showFilterPanel = !showFilterPanel"
                            >
                                <SlidersHorizontal class="h-4 w-4" />
                                Filter
                                <span
                                    v-if="activeFilterCount > 0"
                                    class="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white/25 px-1 text-[10px] font-bold"
                                >{{ activeFilterCount }}</span>
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
                                    class="absolute right-0 top-full z-30 mt-2 w-80 origin-top-right overflow-hidden rounded-2xl border border-sidebar-border/70 bg-card shadow-2xl dark:border-sidebar-border"
                                >
                                    <!-- Panel header -->
                                    <div class="flex items-center justify-between border-b border-sidebar-border/70 px-4 py-3 dark:border-sidebar-border">
                                        <div class="flex items-center gap-2">
                                            <SlidersHorizontal class="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                            <span class="text-sm font-semibold">Filter & Urutkan</span>
                                        </div>
                                        <button
                                            class="rounded-md p-1 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground dark:hover:bg-zinc-800"
                                            @click="showFilterPanel = false"
                                        >
                                            <X class="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    <div class="p-4">
                                        <!-- Kategori -->
                                        <div class="mb-5">
                                            <p class="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Kategori</p>
                                            <div class="flex flex-wrap gap-1.5">
                                                <button
                                                    class="rounded-full border px-3 py-1 text-xs font-medium transition-all duration-100"
                                                    :class="filterKategori === ''
                                                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                                        : 'border-sidebar-border/70 bg-background text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-400'"
                                                    @click="filterKategori = ''"
                                                >
                                                    Semua
                                                </button>
                                                <button
                                                    v-for="kat in kategoris"
                                                    :key="kat.id_kategori"
                                                    class="rounded-full border px-3 py-1 text-xs font-medium transition-all duration-100"
                                                    :class="filterKategori === String(kat.id_kategori)
                                                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                                        : 'border-sidebar-border/70 bg-background text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-400'"
                                                    @click="filterKategori = String(kat.id_kategori)"
                                                >
                                                    {{ kat.nama_kategori }}
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Urutkan -->
                                        <div>
                                            <p class="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Urutkan Berdasarkan</p>
                                            <div class="grid grid-cols-2 gap-1.5">
                                                <button
                                                    v-for="opt in sortOptions"
                                                    :key="opt.value"
                                                    class="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all duration-100"
                                                    :class="sortBy === opt.value
                                                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                                        : 'border-sidebar-border/70 bg-background text-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:border-sidebar-border dark:bg-zinc-900/30 dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:bg-zinc-800'"
                                                    @click="sortBy = sortBy === opt.value ? '' : opt.value"
                                                >
                                                    <component :is="opt.icon" class="h-3.5 w-3.5 shrink-0" />
                                                    <span class="leading-tight">{{ opt.label }}</span>
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

                        <!-- Generate All Barcodes & SKU -->
                        <button
                            class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-emerald-400"
                            title="Buat barcode & SKU otomatis untuk produk yang belum punya barcode"
                            :disabled="generatingAll"
                            @click="runGenerateAllBarcodes"
                        >
                            <Sparkles class="h-4 w-4" />
                            {{ generatingAll ? 'Membuat...' : 'Generate Barcode Semua' }}
                        </button>

                        <!-- Print All Barcodes -->
                        <button
                            class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:text-slate-200 dark:hover:bg-zinc-800/40"
                            title="Cetak barcode semua produk yang tampil"
                            @click="openPrintAllBarcodes"
                        >
                            <Printer class="h-4 w-4" />
                            Cetak Semua Barcode
                        </button>
                    </div>
                </div>

                <!-- Active filter tags strip -->
                <div
                    v-if="activeFilterCount > 0"
                    class="flex flex-wrap items-center gap-2 border-t border-indigo-100 bg-indigo-50/60 px-4 py-2.5 dark:border-indigo-500/10 dark:bg-indigo-500/5"
                >
                    <span class="text-xs font-medium text-muted-foreground">Filter aktif:</span>

                    <span
                        v-if="filterKategori"
                        class="inline-flex items-center gap-1 rounded-full bg-indigo-100 py-0.5 pl-2.5 pr-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                    >
                        {{ kategoris.find(k => String(k.id_kategori) === filterKategori)?.nama_kategori }}
                        <button
                            class="rounded-full p-0.5 transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-500/30"
                            @click="filterKategori = ''"
                        >
                            <X class="h-2.5 w-2.5" />
                        </button>
                    </span>

                    <span
                        v-if="sortBy"
                        class="inline-flex items-center gap-1 rounded-full bg-indigo-100 py-0.5 pl-2.5 pr-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                    >
                        <component :is="sortOptions.find(s => s.value === sortBy)?.icon" class="h-3 w-3" />
                        {{ sortOptions.find(s => s.value === sortBy)?.label }}
                        <button
                            class="rounded-full p-0.5 transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-500/30"
                            @click="sortBy = ''"
                        >
                            <X class="h-2.5 w-2.5" />
                        </button>
                    </span>
                </div>
            </div>

            <!-- Responsive Table -->
            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr
                            class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"
                        >
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                Nama Produk
                            </th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Kategori</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                Harga Jual
                            </th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                Persediaan (Stok)
                            </th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                            <th class="px-6 py-4 text-right font-semibold text-muted-foreground">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        <tr v-if="paginatedProduks.length === 0">
                            <td
                                colspan="6"
                                class="px-6 py-12 text-center text-muted-foreground"
                            >
                                <Package class="mx-auto mb-3 h-10 w-10 opacity-30" />
                                <p class="font-medium">
                                    {{
                                        searchQuery
                                            ? 'Tidak ada produk yang sesuai pencarian.'
                                            : 'Belum ada produk. Tambahkan produk pertama!'
                                    }}
                                </p>
                            </td>
                        </tr>
                        <tr
                            v-for="produk in paginatedProduks"
                            :key="produk.id_produk"
                            class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"
                        >
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <img
                                        v-if="resolveFoto(produk.foto_url ?? produk.foto)"
                                        :src="resolveFoto(produk.foto_url ?? produk.foto) ?? undefined"
                                        :alt="produk.nama"
                                        class="h-12 w-12 rounded-lg border border-sidebar-border/70 object-cover dark:border-sidebar-border"
                                    />
                                    <div
                                        v-else
                                        class="flex h-12 w-12 items-center justify-center rounded-lg border border-sidebar-border/70 bg-slate-100 text-muted-foreground dark:border-sidebar-border dark:bg-zinc-800"
                                    >
                                        <ImageIcon class="h-5 w-5" />
                                    </div>
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-2">
                                            <p class="truncate font-semibold text-foreground">{{ produk.nama }}</p>
                                            <span
                                                v-if="tipeJualBadge[produk.tipe_jual]"
                                                :class="['inline-flex shrink-0 items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold', tipeJualBadge[produk.tipe_jual].class]"
                                            >
                                                {{ tipeJualBadge[produk.tipe_jual].label }}
                                            </span>
                                        </div>
                                        <p class="text-xs text-muted-foreground">SKU: {{ produk.sku }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">
                                {{ produk.kategori ?? '-' }}
                            </td>
                            <td class="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                                {{ formatRupiah(produk.harga_jual) }}
                            </td>
                            <td class="px-6 py-4 font-medium">
                                <span v-if="produk.tipe_jual === 'jasa'" class="text-muted-foreground">—</span>
                                <span v-else>{{ formatStok(produk.stok) }} {{ produk.satuan }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    :class="[
                                        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide',
                                        statusClass[produk.status_stok],
                                    ]"
                                >
                                    {{ statusLabel[produk.status_stok] }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="inline-flex justify-end gap-2">
                                    <button
                                        v-if="produk.barcode"
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-zinc-800"
                                        title="Cetak Barcode"
                                        @click="openPrintBarcode(produk)"
                                    >
                                        <Printer class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
                                        title="Edit"
                                        @click="openEdit(produk)"
                                    >
                                        <Edit class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                                        title="Hapus"
                                        @click="hapusProduk(produk)"
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

    <!-- Modal Cetak Barcode -->
    <Teleport to="body">
        <div
            v-if="showBarcodeModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            @click.self="closeBarcodeModal"
        >
            <div
                class="w-full max-w-2xl rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border"
                style="max-height: 90vh; overflow-y: auto"
            >
                <div class="mb-5 flex items-center justify-between">
                    <div>
                        <h2 class="text-lg font-bold">Cetak Barcode Produk</h2>
                        <p class="mt-0.5 text-xs text-muted-foreground">
                            {{ barcodePrintList.length }} label barcode siap dicetak
                        </p>
                    </div>
                    <button
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                        @click="closeBarcodeModal"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <div v-if="barcodePrintList.length === 0" class="py-10 text-center text-muted-foreground">
                    <Barcode class="mx-auto mb-3 h-10 w-10 opacity-30" />
                    <p class="text-sm font-medium">Tidak ada produk dengan barcode yang dapat dicetak.</p>
                    <p class="mt-1 text-xs">Tambahkan barcode ke produk terlebih dahulu melalui menu Edit.</p>
                </div>

                <div v-else>
                    <!-- Preview labels -->
                    <div class="mb-5 flex flex-wrap gap-4 rounded-xl border border-sidebar-border/70 bg-slate-50/50 p-4 dark:border-sidebar-border dark:bg-zinc-800/20">
                        <div
                            v-for="(produk, index) in barcodePrintList"
                            :key="produk.id_produk"
                            class="flex w-48 flex-col items-center rounded-lg border border-sidebar-border/70 bg-white p-3 dark:border-sidebar-border dark:bg-zinc-900"
                        >
                            <svg
                                :ref="(el) => setBarcodeRef(el, index)"
                                class="w-full"
                            />
                            <p class="mt-2 text-center text-xs font-semibold leading-tight text-slate-800 dark:text-slate-200">
                                {{ produk.nama }}
                            </p>
                            <p class="mt-0.5 text-center text-xs text-muted-foreground">
                                {{ formatRupiah(produk.harga_jual) }}
                            </p>
                        </div>
                    </div>

                    <div class="flex justify-end gap-3">
                        <button
                            type="button"
                            class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"
                            @click="closeBarcodeModal"
                        >
                            Tutup
                        </button>
                        <button
                            type="button"
                            class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
                            @click="printBarcodes"
                        >
                            <Printer class="h-4 w-4" />
                            Cetak Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- Modal Tambah / Edit Produk -->
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="showModal"
                class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
                @click.self="closeModal"
            >
                <div
                    class="flex h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-sidebar-border/70 bg-card shadow-2xl dark:border-sidebar-border sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl"
                >
                    <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="submitForm">
                        <!-- Header (tetap terlihat saat scroll) -->
                        <div class="shrink-0 border-b border-sidebar-border/70 bg-card px-5 pb-4 pt-3 dark:border-sidebar-border">
                            <div class="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-300 dark:bg-zinc-700 sm:hidden"></div>
                            <div class="flex items-start justify-between gap-3">
                                <div class="flex items-center gap-3">
                                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                        <Package class="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 class="text-base font-bold leading-tight sm:text-lg">
                                            {{ editingProduk ? 'Edit Produk' : 'Tambah Produk Baru' }}
                                        </h2>
                                        <p class="text-xs text-muted-foreground">
                                            Kolom bertanda <span class="font-semibold text-rose-500">*</span> wajib diisi
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                                    @click="closeModal"
                                >
                                    <X class="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <!-- Isi form (area yang bisa di-scroll) -->
                        <div class="min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-5">
                            <!-- ====== Bagian 1: Informasi Produk ====== -->
                            <section class="space-y-4">
                                <div class="flex items-center gap-2">
                                    <Package class="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    <h3 class="text-sm font-bold">Informasi Produk</h3>
                                </div>

                                <!-- Nama -->
                                <div>
                                    <label class="mb-1.5 block text-sm font-medium" for="prod-nama">
                                        Nama Produk <span class="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="prod-nama"
                                        v-model="form.nama"
                                        type="text"
                                        placeholder="mis. Kopi Sachet, Bensin Eceran…"
                                        class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                        :class="{ 'border-rose-500': form.errors.nama }"
                                    />
                                    <p v-if="form.errors.nama" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                        <AlertCircle class="h-3 w-3" />{{ form.errors.nama }}
                                    </p>
                                </div>

                                <!-- Foto + preview -->
                                <div>
                                    <span class="mb-1.5 block text-sm font-medium">Foto Produk</span>
                                    <div class="flex items-start gap-3">
                                        <div class="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-sidebar-border/70 bg-slate-100 dark:border-sidebar-border dark:bg-zinc-800">
                                            <img
                                                v-if="fotoPreviewUrl"
                                                :src="fotoPreviewUrl"
                                                alt="Pratinjau foto produk"
                                                class="h-full w-full object-cover"
                                            />
                                            <div v-else class="flex h-full w-full items-center justify-center text-muted-foreground">
                                                <ImageIcon class="h-7 w-7" />
                                            </div>
                                            <button
                                                v-if="fotoPreviewUrl"
                                                type="button"
                                                class="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white transition-colors hover:bg-black/80"
                                                title="Hapus foto"
                                                @click="clearFoto"
                                            >
                                                <X class="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                        <div class="flex min-w-0 flex-1 flex-col gap-2">
                                            <label
                                                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-sidebar-border/70 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-sidebar-border dark:bg-zinc-900 dark:text-slate-200 dark:hover:bg-zinc-800"
                                            >
                                                <Upload class="h-4 w-4" />
                                                {{ fotoUploadName ? 'Ganti Foto' : 'Upload dari Galeri' }}
                                                <input type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
                                            </label>
                                            <input
                                                id="prod-foto"
                                                v-model="form.foto"
                                                type="text"
                                                placeholder="atau tempel URL gambar…"
                                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                                :class="{ 'border-rose-500': form.errors.foto }"
                                            />
                                        </div>
                                    </div>
                                    <p v-if="fotoUploadName" class="mt-1.5 truncate text-xs text-muted-foreground">
                                        File dipilih: {{ fotoUploadName }}
                                    </p>
                                    <p v-if="form.errors.foto" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                        <AlertCircle class="h-3 w-3" />{{ form.errors.foto }}
                                    </p>
                                </div>

                                <!-- Kategori -->
                                <div>
                                    <label class="mb-1.5 block text-sm font-medium" for="prod-kategori">
                                        Kategori <span class="text-rose-500">*</span>
                                    </label>
                                    <select
                                        id="prod-kategori"
                                        v-model="form.id_kategori"
                                        class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                        :class="{ 'border-rose-500': form.errors.id_kategori }"
                                    >
                                        <option value="">Pilih kategori</option>
                                        <option
                                            v-for="kat in kategoris"
                                            :key="kat.id_kategori"
                                            :value="String(kat.id_kategori)"
                                        >
                                            {{ kat.nama_kategori }}
                                        </option>
                                    </select>
                                    <p v-if="form.errors.id_kategori" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                        <AlertCircle class="h-3 w-3" />{{ form.errors.id_kategori }}
                                    </p>
                                </div>
                            </section>

                            <!-- ====== Bagian 2: Jenis & Cara Jual ====== -->
                            <section class="space-y-4">
                                <div class="flex items-center gap-2">
                                    <Tag class="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    <h3 class="text-sm font-bold">Jenis &amp; Cara Jual</h3>
                                </div>

                                <!-- Asal produk (kartu pilihan) -->
                                <div>
                                    <span class="mb-2 block text-sm font-medium">Asal Produk</span>
                                    <div class="grid grid-cols-2 gap-2.5">
                                        <button
                                            v-for="opt in jenisOptions"
                                            :key="opt.value"
                                            type="button"
                                            class="flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all"
                                            :class="form.jenis === opt.value
                                                ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 dark:bg-indigo-500/10'
                                                : 'border-sidebar-border/70 hover:border-indigo-300 dark:border-sidebar-border dark:hover:border-indigo-500/50'"
                                            @click="form.jenis = opt.value"
                                        >
                                            <component
                                                :is="opt.icon"
                                                class="h-5 w-5 shrink-0"
                                                :class="form.jenis === opt.value ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground'"
                                            />
                                            <div class="min-w-0">
                                                <p class="text-sm font-semibold leading-tight" :class="{ 'text-indigo-700 dark:text-indigo-300': form.jenis === opt.value }">
                                                    {{ opt.label }}
                                                </p>
                                                <p class="mt-0.5 text-[11px] leading-tight text-muted-foreground">{{ opt.hint }}</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <!-- Tipe jual (kartu pilihan) -->
                                <div>
                                    <span class="mb-2 block text-sm font-medium">Tipe Jual</span>
                                    <div class="grid grid-cols-3 gap-2.5">
                                        <button
                                            v-for="opt in tipeJualOptions"
                                            :key="opt.value"
                                            type="button"
                                            class="relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all"
                                            :class="form.tipe_jual === opt.value
                                                ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 dark:bg-indigo-500/10'
                                                : 'border-sidebar-border/70 hover:border-indigo-300 dark:border-sidebar-border dark:hover:border-indigo-500/50'"
                                            @click="form.tipe_jual = opt.value"
                                        >
                                            <Check
                                                v-if="form.tipe_jual === opt.value"
                                                class="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400"
                                            />
                                            <component
                                                :is="opt.icon"
                                                class="h-6 w-6"
                                                :class="form.tipe_jual === opt.value ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground'"
                                            />
                                            <div>
                                                <p class="text-xs font-semibold leading-tight" :class="{ 'text-indigo-700 dark:text-indigo-300': form.tipe_jual === opt.value }">
                                                    {{ opt.label }}
                                                </p>
                                                <p class="text-[10px] leading-tight text-muted-foreground">{{ opt.short }}</p>
                                            </div>
                                        </button>
                                    </div>
                                    <p class="mt-2 flex items-start gap-1.5 rounded-lg bg-indigo-50/70 px-3 py-2 text-xs text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                                        <Info class="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                        <span>{{ tipeJualOptions.find((o) => o.value === form.tipe_jual)?.hint }}</span>
                                    </p>
                                </div>

                                <!-- Satuan -->
                                <div v-if="form.tipe_jual !== 'jasa'">
                                    <label class="mb-1.5 block text-sm font-medium" for="prod-satuan">
                                        Satuan
                                    </label>
                                    <input
                                        id="prod-satuan"
                                        v-model="form.satuan"
                                        type="text"
                                        list="satuan-suggestions"
                                        placeholder="pcs / liter / kg"
                                        class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                        :class="{ 'border-rose-500': form.errors.satuan }"
                                    />
                                    <datalist id="satuan-suggestions">
                                        <option v-for="s in satuanSuggestions" :key="s" :value="s" />
                                    </datalist>
                                    <div class="mt-2 flex flex-wrap gap-1.5">
                                        <button
                                            v-for="s in satuanSuggestions"
                                            :key="s"
                                            type="button"
                                            class="rounded-full border px-2.5 py-1 text-xs font-medium transition-colors"
                                            :class="form.satuan === s
                                                ? 'border-indigo-500 bg-indigo-600 text-white'
                                                : 'border-sidebar-border/70 text-muted-foreground hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border'"
                                            @click="form.satuan = s"
                                        >
                                            {{ s }}
                                        </button>
                                    </div>
                                    <p v-if="form.errors.satuan" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                        <AlertCircle class="h-3 w-3" />{{ form.errors.satuan }}
                                    </p>
                                </div>
                            </section>

                            <!-- ====== Bagian 3: Harga & Stok ====== -->
                            <section class="space-y-4">
                                <div class="flex items-center gap-2">
                                    <Wallet class="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    <h3 class="text-sm font-bold">Harga &amp; Stok</h3>
                                </div>

                                <div class="grid gap-4 sm:grid-cols-2">
                                    <!-- Harga Jual -->
                                    <div>
                                        <label class="mb-1.5 block text-sm font-medium" for="prod-harga-jual">
                                            {{ form.tipe_jual === 'jasa' ? 'Biaya / Fee' : form.tipe_jual === 'curah' ? `Harga per ${form.satuan || 'satuan'}` : 'Harga Jual' }}
                                            <span class="text-rose-500">*</span>
                                        </label>
                                        <div class="relative">
                                            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">Rp</span>
                                            <input
                                                id="prod-harga-jual"
                                                v-model="form.harga_jual"
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                class="w-full rounded-lg border border-sidebar-border/70 bg-background py-3 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                                :class="{ 'border-rose-500': form.errors.harga_jual }"
                                            />
                                        </div>
                                        <p v-if="form.errors.harga_jual" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                            <AlertCircle class="h-3 w-3" />{{ form.errors.harga_jual }}
                                        </p>
                                    </div>

                                    <!-- Harga Modal (hanya untuk produk beli-jadi) -->
                                    <div v-if="form.jenis === 'beli'">
                                        <label class="mb-1.5 block text-sm font-medium" for="prod-harga-modal">
                                            Harga Modal / Beli
                                        </label>
                                        <div class="relative">
                                            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">Rp</span>
                                            <input
                                                id="prod-harga-modal"
                                                v-model="form.harga_modal"
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                class="w-full rounded-lg border border-sidebar-border/70 bg-background py-3 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                                :class="{ 'border-rose-500': form.errors.harga_modal }"
                                            />
                                        </div>
                                        <p v-if="form.errors.harga_modal" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                            <AlertCircle class="h-3 w-3" />{{ form.errors.harga_modal }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Info modal produksi -->
                                <div v-if="form.jenis !== 'beli'" class="flex items-start gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3.5 py-2.5 text-xs text-muted-foreground">
                                    <Info class="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                                    <span>Modal produk ini dihitung otomatis lewat menu <strong>Produksi</strong>, jadi tidak perlu diisi manual.</span>
                                </div>

                                <template v-if="form.tipe_jual !== 'jasa'">
                                    <div class="grid gap-4 sm:grid-cols-2">
                                        <!-- Stok -->
                                        <div>
                                            <label class="mb-1.5 block text-sm font-medium" for="prod-stok">
                                                Stok{{ form.satuan ? ` (${form.satuan})` : '' }}
                                            </label>
                                            <input
                                                id="prod-stok"
                                                v-model="form.stok"
                                                type="number"
                                                min="0"
                                                :step="form.tipe_jual === 'curah' ? 'any' : '1'"
                                                placeholder="0"
                                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                                :class="{ 'border-rose-500': form.errors.stok }"
                                            />
                                            <p v-if="form.tipe_jual === 'curah'" class="mt-1 text-xs text-muted-foreground">
                                                Boleh pecahan, mis. 12.5 {{ form.satuan || 'satuan' }}.
                                            </p>
                                            <p v-if="form.errors.stok" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                                <AlertCircle class="h-3 w-3" />{{ form.errors.stok }}
                                            </p>
                                        </div>

                                        <!-- Potongan reseller -->
                                        <div>
                                            <label class="mb-1.5 block text-sm font-medium" for="prod-potongan">
                                                Potongan Reseller
                                            </label>
                                            <div class="relative">
                                                <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">Rp</span>
                                                <input
                                                    id="prod-potongan"
                                                    v-model="form.potongan_reseller"
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    class="w-full rounded-lg border border-sidebar-border/70 bg-background py-3 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                                    :class="{ 'border-rose-500': form.errors.potongan_reseller }"
                                                />
                                            </div>
                                            <p v-if="form.errors.potongan_reseller" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                                <AlertCircle class="h-3 w-3" />{{ form.errors.potongan_reseller }}
                                            </p>
                                        </div>
                                    </div>

                                    <!-- Pratinjau harga reseller / peringatan rugi -->
                                    <div
                                        v-if="Number(form.potongan_reseller) > 0"
                                        class="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 text-xs"
                                    >
                                        <span class="text-muted-foreground">Harga untuk reseller: </span>
                                        <strong class="text-emerald-700 dark:text-emerald-400">{{ formatRupiah(hargaReseller) }}</strong>
                                        <span class="text-muted-foreground"> (dari {{ formatRupiah(Number(form.harga_jual || 0)) }})</span>
                                    </div>
                                    <p v-else class="text-xs text-muted-foreground">
                                        Kosongkan / 0 bila produk ini tidak diberi potongan untuk reseller.
                                    </p>
                                    <p v-if="resellerBelowModal" class="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                                        <AlertCircle class="h-3.5 w-3.5 shrink-0" /> Harga reseller di bawah modal ({{ formatRupiah(Number(form.harga_modal || 0)) }}) — berisiko rugi.
                                    </p>
                                </template>

                                <!-- Info jasa tanpa stok -->
                                <div v-else class="flex items-start gap-2 rounded-lg border border-sky-500/20 bg-sky-500/5 px-3.5 py-2.5 text-xs text-muted-foreground">
                                    <Info class="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" />
                                    <span>Produk <strong>jasa</strong> tidak menyimpan stok. Pendapatan dihitung dari fee/biaya admin.</span>
                                </div>
                            </section>

                            <!-- ====== Bagian 4: Barcode & SKU ====== -->
                            <section class="space-y-3">
                                <div class="flex items-center gap-2">
                                    <ScanLine class="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    <h3 class="text-sm font-bold">Barcode &amp; SKU</h3>
                                    <span class="text-xs font-normal text-muted-foreground">(opsional)</span>
                                </div>

                                <div class="rounded-xl border border-sidebar-border/70 bg-slate-50/50 p-4 dark:border-sidebar-border dark:bg-zinc-800/20">
                                    <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
                                        <div
                                            role="status"
                                            :class="[
                                                'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold',
                                                isScannerDetected
                                                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                    : 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400',
                                            ]"
                                            :title="scannerStatusText"
                                        >
                                            <Barcode class="h-3.5 w-3.5" />
                                            <span
                                                :class="[
                                                    'h-2 w-2 rounded-full',
                                                    isScannerDetected ? 'bg-emerald-500' : 'bg-rose-500',
                                                ]"
                                            ></span>
                                            {{ scannerStatusText }}
                                        </div>
                                        <button
                                            type="button"
                                            class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
                                            title="Buat barcode EAN-13 & SKU otomatis"
                                            @click="generateBarcodeAndSku"
                                        >
                                            <Sparkles class="h-3.5 w-3.5" />
                                            Generate Otomatis
                                        </button>
                                    </div>
                                    <p class="mb-3 text-xs text-muted-foreground">
                                        Boleh dikosongkan dulu jika produk belum punya barcode. Klik
                                        <strong>Generate Otomatis</strong> untuk membuat barcode &amp; SKU sekaligus,
                                        atau scan / isi manual.
                                    </p>
                                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label class="mb-1.5 block text-sm font-medium" for="prod-barcode">
                                                Barcode
                                            </label>
                                            <input
                                                id="prod-barcode"
                                                v-model="form.barcode"
                                                type="text"
                                                placeholder="Barcode unik"
                                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                                :class="{ 'border-rose-500': form.errors.barcode }"
                                            />
                                            <p v-if="form.errors.barcode" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                                <AlertCircle class="h-3 w-3" />{{ form.errors.barcode }}
                                            </p>
                                        </div>
                                        <div>
                                            <label class="mb-1.5 block text-sm font-medium" for="prod-sku">
                                                SKU
                                            </label>
                                            <input
                                                id="prod-sku"
                                                v-model="form.sku"
                                                type="text"
                                                placeholder="SKU unik"
                                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                                :class="{ 'border-rose-500': form.errors.sku }"
                                            />
                                            <p v-if="form.errors.sku" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                                <AlertCircle class="h-3 w-3" />{{ form.errors.sku }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <!-- Footer (tombol aksi selalu terlihat) -->
                        <div class="shrink-0 border-t border-sidebar-border/70 bg-card px-5 py-3.5 dark:border-sidebar-border">
                            <div class="flex gap-3">
                                <button
                                    type="button"
                                    class="rounded-lg border border-sidebar-border/70 bg-background px-5 py-3 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"
                                    @click="closeModal"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60"
                                    :disabled="form.processing"
                                >
                                    <Save class="h-4 w-4" />
                                    {{
                                        form.processing
                                            ? 'Menyimpan...'
                                            : editingProduk
                                              ? 'Simpan Perubahan'
                                              : 'Tambah Produk'
                                    }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
