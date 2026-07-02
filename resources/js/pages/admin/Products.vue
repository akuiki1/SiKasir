<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import JsBarcode from 'jsbarcode';
import {
    Plus,
    Search,
    Package,
    Layers,
    AlertTriangle,
    Edit,
    Trash2,
    Archive,
    ArchiveRestore,
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
    Info,
    ScanLine,
    Check,
    Upload,
    Lock,
    ChevronLeft,
    ChevronRight,
} from 'lucide-vue-next';
import {
    ref,
    computed,
    nextTick,
    onBeforeUnmount,
    watch,
    onMounted,
} from 'vue';
import BodyTeleport from '@/components/BodyTeleport.vue';
import Pagination from '@/components/Pagination.vue';
import { formatRupiah } from '@/lib/format';
import {
    store as productStore,
    update as productUpdate,
    destroy as productDestroy,
    restore as productRestore,
    generateAll as productGenerateAll,
} from '@/routes/admin/products';

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

interface TarifJasa {
    min_nominal: number;
    fee: number;
}

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
    tarifs?: TarifJasa[];
    // Tanggal arsip (terisi hanya di tampilan Arsip).
    archived_at?: string | null;
    // Boleh dihapus permanen? (true hanya di Arsip & tanpa riwayat transaksi/produksi/pesanan).
    bisa_hapus?: boolean;
}

interface Stats {
    total_produk: number;
    total_kategori: number;
    stok_bermasalah: number;
    produk_tanpa_barcode: number;
    arsip: number;
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
    kategori: string;
    jenis: '' | 'beli' | 'produksi';
    sort: string;
    view: 'aktif' | 'arsip';
    per_page: number;
}

// Item ringkas untuk cetak barcode lintas halaman (lihat barcode_print di server).
interface BarcodePrintItem {
    id_produk: number;
    nama: string;
    harga_jual: number;
    barcode: string;
}

const props = defineProps<{
    produks: Paginator<Produk>;
    kategoris: Kategori[];
    stats: Stats;
    filters: Filters;
    barcode_print: BarcodePrintItem[];
}>();

// Search & filter — semua dikirim ke server (search di-debounce).
const searchQuery = ref(props.filters.search ?? '');
const filterKategori = ref(props.filters.kategori ?? '');
const filterJenis = ref<'' | 'beli' | 'produksi'>(props.filters.jenis ?? '');
const sortBy = ref(props.filters.sort ?? '');

// Opsi filter asal produk (kolom `jenis`): buatan sendiri vs beli jadi/agen.
const jenisFilterOptions = [
    { value: 'produksi', label: 'Buatan Sendiri', icon: ChefHat },
    { value: 'beli', label: 'Beli Jadi / Agen', icon: PackagePlus },
] as const;
const showFilterPanel = ref(false);
const filterPanelRef = ref<HTMLDivElement | null>(null);

// Tampilan aktif vs arsip (produk yang sudah diarsipkan).
const currentView = computed<'aktif' | 'arsip'>(
    () => props.filters.view ?? 'aktif',
);
const isArsipView = computed(() => currentView.value === 'arsip');

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

    if (filterKategori.value) {
        count++;
    }

    if (filterJenis.value) {
        count++;
    }

    if (sortBy.value) {
        count++;
    }

    return count;
});

function clearFilters() {
    filterKategori.value = '';
    filterJenis.value = '';
    sortBy.value = '';
    reload({ page: 1 });
}

function handleClickOutsideFilter(event: MouseEvent) {
    if (
        filterPanelRef.value &&
        !filterPanelRef.value.contains(event.target as Node)
    ) {
        showFilterPanel.value = false;
    }
}

// Dengarkan flash 'produk_baru' (dikirim server saat produk produksi dibuat) untuk
// menyimpan id produk baru — dipakai tombol "Ya, catat produksi" di overlay sukses.
let stopFlashListener: (() => void) | null = null;

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutsideFilter);

    stopFlashListener = router.on('flash', (event) => {
        const flash = (event as CustomEvent).detail?.flash;
        const produkBaru = flash?.produk_baru as
            | { id: number; nama: string; jenis: string }
            | undefined;

        if (produkBaru && produkBaru.jenis === 'produksi') {
            newProduksiProduk.value = {
                id: produkBaru.id,
                nama: produkBaru.nama,
            };
        }
    });
});

let searchTimer: ReturnType<typeof setTimeout> | undefined;
watch(searchQuery, (value) => {
    if (searchTimer) {
        clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(() => reload({ search: value, page: 1 }), 350);
});

type QueryValue = string | number;

function buildParams(
    overrides: Record<string, QueryValue> = {},
): Record<string, QueryValue> {
    const params: Record<string, QueryValue | undefined> = {
        search: searchQuery.value || undefined,
        kategori: filterKategori.value || undefined,
        jenis: filterJenis.value || undefined,
        sort: sortBy.value || undefined,
        view: currentView.value !== 'aktif' ? currentView.value : undefined,
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
    router.get('/admin/products', buildParams(overrides), {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}

function setView(value: 'aktif' | 'arsip'): void {
    if (value === currentView.value) {
        return;
    }

    // page direset & view 'aktif' dikirim eksplisit agar param lama terhapus.
    reload({ view: value, page: 1 });
}

function setKategori(value: string): void {
    filterKategori.value = value;
    reload({ kategori: value, page: 1 });
}

function setJenis(value: '' | 'beli' | 'produksi'): void {
    filterJenis.value = value;
    reload({ jenis: value, page: 1 });
}

function setSort(value: string): void {
    sortBy.value = value;
    reload({ sort: value, page: 1 });
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
    const total = props.produks.last_page;
    const current = props.produks.current_page;

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

// Stok bisa pecahan (curah) — tampilkan tanpa nol di belakang yang tak perlu.
function formatStok(value: number): string {
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 3 }).format(
        Number(value) || 0,
    );
}

const tipeJualBadge: Record<string, { label: string; class: string }> = {
    curah: {
        label: 'Curah',
        class: 'border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400',
    },
    jasa: {
        label: 'Jasa',
        class: 'border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400',
    },
};

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

// Modal
const showModal = ref(false);
const editingProduk = ref<Produk | null>(null);
const isScannerDetected = ref(false);
const scannerStatusText = ref('Scanner tidak terdeteksi');
const scannerBuffer = ref('');
const lastScannerTime = ref(0);
const SCANNER_TIMEOUT_MS = 150;
const SCANNER_MIN_LENGTH = 3;

// ===== Wizard 3 langkah (Jenis → Detail → Harga/Tarif) =====
type WizardStep = 1 | 2 | 3;
const wizardStep = ref<WizardStep>(1);
// Panel Barcode & SKU (opsional) dilipat secara default sesuai desain.
const showBarcodeSection = ref(false);
// Tooltip mini (i) yang sedang terbuka: asal produk / potongan reseller / tarif.
const activeTip = ref<'asal' | 'reseller' | 'tarif' | null>(null);
// Overlay sukses dalam modal (menggantikan penutupan langsung).
const submitted = ref(false);
const submitting = ref(false);
const successMeta = ref<{ nama: string; isProd: boolean; editing: boolean }>({
    nama: '',
    isProd: false,
    editing: false,
});

const isJasa = computed(() => form.tipe_jual === 'jasa');
const step3Label = computed(() => (isJasa.value ? 'Tarif' : 'Harga'));
const stepSubtitle = computed(() => {
    if (wizardStep.value === 1) {
        return 'Langkah 1 · Tentukan jenis jualan';
    }

    if (wizardStep.value === 2) {
        return 'Langkah 2 · Detail & kategori';
    }

    return isJasa.value
        ? 'Langkah 3 · Atur tarif fee'
        : 'Langkah 3 · Harga & stok';
});

const footerNextLabel = computed(() => {
    if (wizardStep.value < 3) {
        return 'Lanjut';
    }

    if (submitting.value) {
        return 'Menyimpan...';
    }

    return editingProduk.value ? 'Simpan Perubahan' : 'Tambah Produk';
});

const successTitle = computed(() =>
    successMeta.value.editing
        ? 'Produk berhasil diperbarui 🎉'
        : 'Produk berhasil dibuat 🎉',
);
const successText = computed(() => {
    const nama = successMeta.value.nama;

    if (successMeta.value.isProd) {
        return `${nama} tersimpan. Tambahkan harga modal & stok sekarang lewat catatan Produksi?`;
    }

    if (successMeta.value.editing) {
        return `Perubahan pada ${nama} sudah tersimpan.`;
    }

    return `${nama} sudah tersimpan dan siap dijual.`;
});
const successSecondary = computed(() =>
    successMeta.value.isProd ? 'Nanti saja' : 'Selesai',
);

function goToStep(n: WizardStep): void {
    wizardStep.value = n;
    activeTip.value = null;
}

function nextStep(): void {
    if (wizardStep.value < 3) {
        wizardStep.value = (wizardStep.value + 1) as WizardStep;
        activeTip.value = null;

        return;
    }

    submitForm();
}

function prevStep(): void {
    if (wizardStep.value > 1) {
        wizardStep.value = (wizardStep.value - 1) as WizardStep;
        activeTip.value = null;
    }
}

function toggleTip(key: 'asal' | 'reseller' | 'tarif'): void {
    activeTip.value = activeTip.value === key ? null : key;
}

function resetWizardState(): void {
    wizardStep.value = 1;
    activeTip.value = null;
    submitted.value = false;
    submitting.value = false;
    showBarcodeSection.value = false;
}

// Pilih tipe jual + samakan satuan default (kosong utk jasa, liter utk curah).
function setTipeJual(value: TipeJual): void {
    form.tipe_jual = value;

    if (value === 'jasa') {
        form.satuan = '';

        return;
    }

    if (
        !form.satuan ||
        form.satuan === 'transaksi' ||
        form.satuan === 'layanan'
    ) {
        form.satuan = value === 'curah' ? 'liter' : 'pcs';
    }
}

// Loncat ke langkah yang memuat error validasi pertama (nama/kategori/satuan/foto
// = langkah 2; sisanya = langkah 3) agar pesan error langsung terlihat.
function jumpToErrorStep(errors: Record<string, string>): void {
    const step2Fields = ['nama', 'id_kategori', 'satuan', 'foto'];
    const keys = Object.keys(errors);

    wizardStep.value = keys.some((k) => step2Fields.includes(k)) ? 2 : 3;

    if (errors.barcode || errors.sku) {
        showBarcodeSection.value = true;
    }
}

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
    // Tarif fee bertingkat (khusus jasa): tiap baris = batas bawah + fee.
    tarifs: [] as Array<{ min_nominal: number | string; fee: number | string }>,
});

// Harga setelah potongan reseller & peringatan bila di bawah modal (jual rugi).
const hargaReseller = computed(() =>
    Math.max(
        0,
        Number(form.harga_jual || 0) - Number(form.potongan_reseller || 0),
    ),
);
const resellerBelowModal = computed(() => {
    const potongan = Number(form.potongan_reseller || 0);

    if (potongan <= 0) {
        return false;
    }

    return hargaReseller.value < Number(form.harga_modal || 0);
});

const tipeJualOptions: {
    value: TipeJual;
    label: string;
    short: string;
    hint: string;
    icon: typeof Package;
}[] = [
    {
        value: 'satuan',
        label: 'Satuan',
        short: 'per biji',
        hint: 'Dihitung per buah/bungkus. Cocok untuk cemilan, kue, permen.',
        icon: Package,
    },
    {
        value: 'curah',
        label: 'Curah',
        short: 'per takaran',
        hint: 'Dijual per liter/kg, boleh pecahan. Kasir bisa input rupiah (mis. bensin, bawang).',
        icon: Scale,
    },
    {
        value: 'jasa',
        label: 'Jasa',
        short: 'biaya admin',
        hint: 'Tanpa stok. Harga = fee/biaya admin (mis. transfer, tarik tunai).',
        icon: HandCoins,
    },
];

const jenisOptions: {
    value: 'beli' | 'produksi';
    label: string;
    hint: string;
    icon: typeof Package;
}[] = [
    {
        value: 'beli',
        label: 'Beli Jadi',
        hint: 'Dibeli dari agen / supplier',
        icon: ShoppingBag,
    },
    {
        value: 'produksi',
        label: 'Buatan Sendiri',
        hint: 'Modal dihitung dari produksi',
        icon: ChefHat,
    },
];

// Saran satuan sesuai tipe jual (tetap bisa diketik bebas).
const satuanSuggestions = computed<string[]>(() => {
    if (form.tipe_jual === 'curah') {
        return ['liter', 'kg', 'gram', 'meter'];
    }

    if (form.tipe_jual === 'jasa') {
        return ['transaksi', 'layanan'];
    }

    return ['pcs', 'bungkus', 'box', 'pack'];
});

const fotoUploadName = computed(() => form.foto_upload?.name ?? '');

// Preview object-URL untuk file yang baru dipilih (di-revoke saat ganti/tutup).
const fotoUploadPreview = ref<string | null>(null);

// Pesan kesalahan sisi-klien untuk pemilihan foto (mis. masih terlalu besar
// setelah dikompres, atau format tak didukung). Ditampilkan sebelum submit
// supaya user tak menabrak 503 di hosting.
const fotoUploadError = ref<string | null>(null);

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
const fotoPreviewUrl = computed<string | null>(
    () => fotoUploadPreview.value ?? resolveFoto(form.foto),
);

function openTambah() {
    editingProduk.value = null;
    form.reset();
    form.foto_upload = null;
    form.clearErrors();
    fotoUploadError.value = null;
    setFotoUploadPreview(null);
    resetWizardState();
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
    form.tarifs = (produk.tarifs ?? []).map((t) => ({
        min_nominal: t.min_nominal,
        fee: t.fee,
    }));
    form.clearErrors();
    fotoUploadError.value = null;
    setFotoUploadPreview(null);
    resetWizardState();
    showModal.value = true;
    startScannerListening();
}

function closeModal() {
    showModal.value = false;
    stopScannerListening();
    form.reset();
    form.foto_upload = null;
    fotoUploadError.value = null;
    setFotoUploadPreview(null);
    form.clearErrors();
    resetWizardState();
    newProduksiProduk.value = null;
}

// Id produk buatan sendiri yang baru dibuat (dari flash server) — dipakai tombol
// "Ya, catat produksi" di overlay sukses untuk membuka menu Produksi produk tsb.
const newProduksiProduk = ref<{ id: number; nama: string } | null>(null);

function lanjutKeProduksi() {
    const id = newProduksiProduk.value?.id;
    router.visit(`/admin/produksi?aksi=tambah${id ? `&produk=${id}` : ''}`);
}

// Batas keras ukuran yang boleh dikirim ke server. Validasi Laravel (`foto_upload`
// max:2048 KB = 2 MB) dan `upload_max_filesize` PHP di hosting bersama SAMA-SAMA
// bisa persis 2 MB dengan nol toleransi — ditemukan di produksi bahwa foto yang
// hasil kompresinya mepet ke 2 MB tetap ditolak server (503 sebelum request
// sempat sampai ke Laravel). Jadi batas & sasaran di sini sengaja dibuat lebih
// rendah, menyisakan jarak aman yang nyata di bawah 2 MB.
const MAX_UPLOAD_BYTES = Math.floor(1.8 * 1024 * 1024);
const TARGET_UPLOAD_BYTES = 1024 * 1024;

function toCompressedFile(original: File, blob: Blob): File {
    const nama = original.name.replace(/\.[^.]+$/, '') || 'foto';

    return new File([blob], `${nama}.jpg`, { type: 'image/jpeg' });
}

function isHeic(file: File): boolean {
    return (
        /image\/hei[cf]/i.test(file.type) || /\.(heic|heif)$/i.test(file.name)
    );
}

async function decodeToBitmap(source: Blob): Promise<ImageBitmap | null> {
    try {
        return await createImageBitmap(source, {
            imageOrientation: 'from-image', // hormati orientasi EXIF foto HP
        });
    } catch {
        return null;
    }
}

// Konversi HEIC/HEIF (mis. foto iPhone yang di-import lewat Android) ke JPEG.
// heic2any membawa libheif (WASM) yang besar, jadi diimpor DINAMIS — hanya
// diunduh saat benar-benar ketemu file HEIC, tak membebani bundle utama.
async function decodeHeic(file: File): Promise<Blob | null> {
    try {
        const heic2any = (await import('heic2any')).default;
        const out = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.92,
        });

        return Array.isArray(out) ? out[0] : out;
    } catch {
        return null;
    }
}

// Kompres + perkecil foto di browser SEBELUM diunggah. Foto langsung dari HP
// biasanya 3–8 MB; hosting bersama sering menolaknya dengan "503 Service
// Unavailable" (kena batas ukuran upload / memori server) sebelum Laravel
// sempat memvalidasi. Fungsi ini menurunkan kualitas lalu resolusi secara
// BERTAHAP sampai hasilnya di bawah TARGET_UPLOAD_BYTES — jadi foto sebesar apa
// pun otomatis mengecil mengikuti batas server, bukan ditolak. Kombinasi dicoba
// dari besar→kecil sehingga hasil pertama yang muat = kualitas terbaik yang muat.
// Foto HEIC yang tak bisa didecode browser (mis. di Android) dikonversi dulu via
// heic2any; bila tetap gagal, file asli dikembalikan dan guard di
// handleFileUpload yang akan menolaknya dengan pesan.
async function compressImage(file: File): Promise<File> {
    const heic = isHeic(file);

    // Lewati non-gambar & gif animasi (render kanvas mematikan animasi). HEIC
    // tetap diproses walau MIME-nya kadang kosong di Android.
    if (
        !heic &&
        (!file.type.startsWith('image/') || file.type === 'image/gif')
    ) {
        return file;
    }

    // Decode langsung dulu (cepat; Safari bahkan bisa HEIC). Bila gagal & ini
    // HEIC, konversi lewat heic2any lalu decode hasilnya.
    let bitmap = await decodeToBitmap(file);

    if (!bitmap && heic) {
        const jpeg = await decodeHeic(file);
        bitmap = jpeg ? await decodeToBitmap(jpeg) : null;
    }

    if (!bitmap) {
        return file;
    }

    // Sisi terpanjang & kualitas JPEG, dicoba dari paling tinggi ke paling rendah.
    const edges = [1600, 1280, 1024, 800];
    const qualities = [0.82, 0.7, 0.6, 0.5];

    let smallest: Blob | null = null;

    for (const edge of edges) {
        const scale = Math.min(1, edge / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            break;
        }

        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

        for (const quality of qualities) {
            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, 'image/jpeg', quality),
            );

            if (!blob) {
                continue;
            }

            if (!smallest || blob.size < smallest.size) {
                smallest = blob;
            }

            if (blob.size <= TARGET_UPLOAD_BYTES) {
                bitmap.close?.();

                return toCompressedFile(file, blob);
            }
        }
    }

    bitmap.close?.();

    // Sangat jarang: tak ada yang mencapai sasaran. Pakai yang terkecil bila
    // memang lebih kecil dari aslinya; kalau tidak, biarkan file asli.
    if (smallest && smallest.size < file.size) {
        return toCompressedFile(file, smallest);
    }

    return file;
}

// Format yang bisa ditampilkan langsung sebagai <img> di katalog & didukung server.
// HEIC/HEIF dari iPhone yang gagal dikonversi (di browser non-Apple) tak lolos ini.
const WEB_SAFE_IMAGE = /^image\/(jpe?g|png|webp|gif)$/;

async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    fotoUploadError.value = null;

    if (!file) {
        form.foto_upload = null;
        setFotoUploadPreview(null);

        return;
    }

    const prepared = await compressImage(file);

    // Jaring pengaman: bila kompresi gagal (format tak didukung spt HEIC) atau
    // hasilnya masih di atas batas server, jangan diteruskan — tampilkan pesan
    // ramah alih-alih membiarkan upload menabrak 503 di hosting.
    if (!WEB_SAFE_IMAGE.test(prepared.type)) {
        fotoUploadError.value =
            'Format foto ini tidak didukung atau filenya rusak. Coba foto lain (JPG/PNG) atau kirim ulang lewat screenshot galeri.';
    } else if (prepared.size > MAX_UPLOAD_BYTES) {
        fotoUploadError.value =
            'Foto masih terlalu besar setelah dikompres. Pilih foto lain atau perkecil resolusinya dulu.';
    }

    if (fotoUploadError.value) {
        form.foto_upload = null;
        setFotoUploadPreview(null);
        // Kosongkan input agar memilih file yang sama lagi tetap memicu @change.
        input.value = '';

        return;
    }

    form.foto_upload = prepared;
    setFotoUploadPreview(prepared);
    form.foto = '';
}

function clearFoto() {
    form.foto = '';
    form.foto_upload = null;
    fotoUploadError.value = null;
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

    if (
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
    ) {
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
    stopFlashListener?.();
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
    const tanpaBarcode = props.stats.produk_tanpa_barcode;

    if (tanpaBarcode === 0) {
        alert(
            'Semua produk (non-jasa) sudah memiliki barcode. Tidak ada yang perlu dibuat.',
        );

        return;
    }

    if (
        !confirm(
            `Buat barcode & SKU otomatis untuk ${tanpaBarcode} produk yang belum memiliki barcode? Produk jasa dilewati.`,
        )
    ) {
        return;
    }

    router.post(
        productGenerateAll().url,
        {},
        {
            preserveScroll: true,
            onStart: () => (generatingAll.value = true),
            onFinish: () => (generatingAll.value = false),
        },
    );
}

// ===== Tarif fee bertingkat (produk jasa) =====
function addTarif() {
    // Baris baru otomatis melanjutkan dari batas tertinggi yang ada.
    const tertinggi = form.tarifs.reduce(
        (max, t) => Math.max(max, Number(t.min_nominal || 0)),
        0,
    );
    form.tarifs.push({
        min_nominal: form.tarifs.length === 0 ? 0 : tertinggi,
        fee: '',
    });
}

function removeTarif(index: number) {
    form.tarifs.splice(index, 1);
}

// Label range yang berlaku untuk sebuah baris: batas atas = min terkecil yang lebih
// besar dari baris ini (robust walau baris belum urut). Baris tertinggi = "ke atas".
function tarifRangeLabel(index: number): string {
    const min = Number(form.tarifs[index]?.min_nominal || 0);
    const higher = form.tarifs
        .map((t) => Number(t.min_nominal || 0))
        .filter((m) => m > min)
        .sort((a, b) => a - b)[0];

    if (higher === undefined) {
        return `${formatRupiah(min)} ke atas`;
    }

    return `${formatRupiah(min)} – ${formatRupiah(higher - 1)}`;
}

function submitForm() {
    const data = {
        ...form.data(),
        id_kategori: Number(form.id_kategori),
        foto: form.foto || null,
        // Jasa: harga_jual tak dipakai (fee dari tarif/manual kasir) → kirim 0.
        harga_jual: form.tipe_jual === 'jasa' ? 0 : Number(form.harga_jual),
        harga_modal:
            form.tipe_jual === 'jasa' || form.jenis === 'produksi'
                ? 0
                : Number(form.harga_modal || 0),
        // Jasa tidak punya stok fisik / potongan reseller; backend juga memaksanya ke 0.
        stok: form.tipe_jual === 'jasa' ? 0 : Number(form.stok || 0),
        potongan_reseller:
            form.tipe_jual === 'jasa' ? 0 : Number(form.potongan_reseller || 0),
        satuan: form.satuan || 'pcs',
        // Tarif bertingkat hanya untuk jasa; tipe lain dikirim kosong (backend membersihkan).
        tarifs:
            form.tipe_jual === 'jasa'
                ? form.tarifs.map((t) => ({
                      min_nominal: Number(t.min_nominal || 0),
                      fee: Number(t.fee || 0),
                  }))
                : [],
    };

    const isEditing = !!editingProduk.value;
    const options = {
        onStart: () => {
            submitting.value = true;
        },
        onFinish: () => {
            submitting.value = false;
        },
        onSuccess: () => {
            // Tampilkan overlay sukses alih-alih menutup modal langsung.
            successMeta.value = {
                nama: form.nama || 'Produk',
                // Tawaran "catat produksi" hanya untuk produk buatan sendiri baru.
                isProd:
                    !isEditing &&
                    form.jenis === 'produksi' &&
                    form.tipe_jual !== 'jasa',
                editing: isEditing,
            };
            submitted.value = true;
        },
        onError: (errors: Record<string, string>) => {
            // router.* tidak mengisi form.errors otomatis — sinkronkan manual
            // agar pesan error tampil inline, lalu loncat ke langkah terkait.
            form.clearErrors();
            form.setError(errors);
            jumpToErrorStep(errors);
        },
    };

    if (isEditing) {
        // PHP tak bisa mem-parse form multipart (yang membawa file foto) pada
        // request PUT/PATCH — isian jadi kosong & (untuk file besar) body
        // menumpuk di memori sampai memicu 503. Kirim sebagai POST dengan spoof
        // `_method: 'put'` (pola standar Inertia/Laravel utuk upload saat update):
        // POST di-parse benar & filenya ditulis ke temp disk, bukan memori.
        router.post(
            productUpdate(editingProduk.value!.id_produk).url,
            { ...data, _method: 'put' },
            options,
        );
    } else {
        router.post(productStore().url, data, options);
    }
}

function arsipkanProduk(produk: Produk) {
    if (
        confirm(
            `Arsipkan produk "${produk.nama}"? Produk akan disembunyikan dari kasir, katalog, dan stok — tapi riwayat penjualannya tetap tersimpan dan bisa dipulihkan kapan saja.`,
        )
    ) {
        router.delete(productDestroy(produk.id_produk).url, {
            preserveScroll: true,
        });
    }
}

function pulihkanProduk(produk: Produk) {
    router.post(
        productRestore(produk.id_produk).url,
        {},
        { preserveScroll: true },
    );
}

// Hapus permanen (force delete) produk arsip yang belum pernah dipakai. Backend tetap
// menolak bila ternyata ada riwayat (pertahanan berlapis).
function hapusPermanenProduk(produk: Produk) {
    if (
        !confirm(
            `Hapus PERMANEN produk "${produk.nama}"? Tindakan ini tidak bisa dibatalkan. Pakai hanya untuk produk salah input / duplikat yang belum pernah terjual atau diproduksi.`,
        )
    ) {
        return;
    }

    router.delete(`/admin/products/${produk.id_produk}/force`, {
        preserveScroll: true,
    });
}

// Aksi kontekstual sesuai jenis produk: "Buatan Sendiri" → catat produksi,
// "Beli Jadi" → tambah stok. Admin tak perlu paham menu Stok/Produksi.
function aksiStokProduk(produk: Produk) {
    if (produk.jenis === 'produksi') {
        router.visit(`/admin/produksi?aksi=tambah&produk=${produk.id_produk}`);

        return;
    }

    router.visit(`/admin/stok?aksi=masuk&produk=${produk.id_produk}`);
}

const statusLabel: Record<string, string> = {
    'in-stock': 'Stok Tersedia',
    'low-stock': 'Hampir Habis',
    'out-of-stock': 'Stok Habis',
};

// Barcode print
const showBarcodeModal = ref(false);
const barcodePrintList = ref<BarcodePrintItem[]>([]);
const barcodeRefs = ref<SVGElement[]>([]);
// Mode 'single' = cetak per produk (boleh pilih jumlah salinan), 'all' = cetak semua produk.
const barcodeMode = ref<'single' | 'all'>('single');
const barcodeCopies = ref(1);
const MAX_BARCODE_COPIES = 200;

function openPrintBarcode(produk: Produk) {
    barcodeMode.value = 'single';
    barcodeCopies.value = 1;
    // Tombol hanya tampil bila produk punya barcode; petakan ke bentuk cetak ringkas.
    barcodePrintList.value = produk.barcode
        ? [
              {
                  id_produk: produk.id_produk,
                  nama: produk.nama,
                  harga_jual: produk.harga_jual,
                  barcode: produk.barcode,
              },
          ]
        : [];
    showBarcodeModal.value = true;
    nextTick(() => renderBarcodes());
}

function openPrintAllBarcodes() {
    barcodeMode.value = 'all';
    barcodeCopies.value = 1;
    // Lintas halaman & mengikuti filter aktif (bukan cuma halaman tabel yang tampil).
    barcodePrintList.value = props.barcode_print;
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
    // Jumlah salinan tiap label: di mode 'single' user bisa pilih, di mode 'all' selalu 1.
    const copies =
        barcodeMode.value === 'single'
            ? Math.min(
                  Math.max(Math.floor(barcodeCopies.value) || 1, 1),
                  MAX_BARCODE_COPIES,
              )
            : 1;

    const labels = barcodePrintList.value
        .map((produk, i) => {
            const svgEl = barcodeRefs.value[i];
            const svgHtml = svgEl ? svgEl.outerHTML : '';

            const singleLabel = `
                <div class="label">
                    ${svgHtml}
                    <p class="nama">${produk.nama}</p>
                    <p class="harga">${formatRupiah(produk.harga_jual)}</p>
                </div>
            `;

            return singleLabel.repeat(copies);
        })
        .join('');

    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (!printWindow) {
        return;
    }

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
    'in-stock':
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    'low-stock':
        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    'out-of-stock':
        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};
</script>

<template>
    <Head title="Data Produk - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <!-- Header Section -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">
                    Manajemen Produk
                </h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Kelola data produk, persediaan stok, kategori barang, dan
                    harga penjualan toko Anda.
                </p>
            </div>

            <button
                v-if="!isArsipView"
                id="btn-tambah-produk"
                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                @click="openTambah"
            >
                <Plus class="h-4 w-4" />
                Tambah Produk Baru
            </button>
        </div>

        <!-- Tab Aktif / Arsip -->
        <div
            class="flex gap-1 rounded-xl border border-sidebar-border/70 bg-card p-1 shadow-sm sm:w-fit dark:border-sidebar-border"
        >
            <button
                :class="[
                    'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition',
                    !isArsipView
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800',
                ]"
                @click="setView('aktif')"
            >
                <Package class="h-4 w-4" />
                Produk Aktif
            </button>
            <button
                :class="[
                    'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition',
                    isArsipView
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800',
                ]"
                @click="setView('arsip')"
            >
                <Archive class="h-4 w-4" />
                Arsip
                <span
                    v-if="stats.arsip > 0"
                    :class="[
                        'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold',
                        isArsipView
                            ? 'bg-white/25 text-white'
                            : 'bg-slate-200 text-slate-600 dark:bg-zinc-700 dark:text-slate-300',
                    ]"
                    >{{ stats.arsip }}</span
                >
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
                    <span class="text-xs font-medium text-muted-foreground"
                        >Total Produk</span
                    >
                    <h3 class="mt-0.5 text-xl font-bold">
                        {{ stats.total_produk }} Item
                    </h3>
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
                    <span class="text-xs font-medium text-muted-foreground"
                        >Kategori</span
                    >
                    <h3 class="mt-0.5 text-xl font-bold">
                        {{ stats.total_kategori }} Kategori
                    </h3>
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
                    <span class="text-xs font-medium text-muted-foreground"
                        >Stok Menipis / Habis</span
                    >
                    <h3 class="mt-0.5 text-xl font-bold">
                        {{ stats.stok_bermasalah }} Produk
                    </h3>
                </div>
            </div>
        </div>

        <!-- Filters & Table Section -->
        <div
            class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"
        >
            <!-- Table Action Bar -->
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
                            placeholder="Cari produk berdasarkan nama..."
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pr-4 pl-9 text-sm transition-colors focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                        />
                    </div>

                    <!-- Right buttons -->
                    <div class="flex shrink-0 gap-2">
                        <!-- Filter Trigger + Dropdown -->
                        <div ref="filterPanelRef" class="relative">
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
                                    <!-- Panel header -->
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
                                        <!-- Kategori -->
                                        <div class="mb-5">
                                            <p
                                                class="mb-2.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
                                            >
                                                Kategori
                                            </p>
                                            <div class="flex flex-wrap gap-1.5">
                                                <button
                                                    class="rounded-full border px-3 py-1 text-xs font-medium transition-all duration-100"
                                                    :class="
                                                        filterKategori === ''
                                                            ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                                            : 'border-sidebar-border/70 bg-background text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-400'
                                                    "
                                                    @click="setKategori('')"
                                                >
                                                    Semua
                                                </button>
                                                <button
                                                    v-for="kat in kategoris"
                                                    :key="kat.id_kategori"
                                                    class="rounded-full border px-3 py-1 text-xs font-medium transition-all duration-100"
                                                    :class="
                                                        filterKategori ===
                                                        String(kat.id_kategori)
                                                            ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                                            : 'border-sidebar-border/70 bg-background text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-400'
                                                    "
                                                    @click="
                                                        setKategori(
                                                            String(
                                                                kat.id_kategori,
                                                            ),
                                                        )
                                                    "
                                                >
                                                    {{ kat.nama_kategori }}
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Asal Produk -->
                                        <div class="mb-5">
                                            <p
                                                class="mb-2.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
                                            >
                                                Asal Produk
                                            </p>
                                            <div class="flex flex-wrap gap-1.5">
                                                <button
                                                    class="rounded-full border px-3 py-1 text-xs font-medium transition-all duration-100"
                                                    :class="
                                                        filterJenis === ''
                                                            ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                                            : 'border-sidebar-border/70 bg-background text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-400'
                                                    "
                                                    @click="setJenis('')"
                                                >
                                                    Semua
                                                </button>
                                                <button
                                                    v-for="opt in jenisFilterOptions"
                                                    :key="opt.value"
                                                    class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-100"
                                                    :class="
                                                        filterJenis ===
                                                        opt.value
                                                            ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                                            : 'border-sidebar-border/70 bg-background text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-400'
                                                    "
                                                    @click="setJenis(opt.value)"
                                                >
                                                    <component
                                                        :is="opt.icon"
                                                        class="h-3.5 w-3.5"
                                                    />
                                                    {{ opt.label }}
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
                                            <div
                                                class="grid grid-cols-2 gap-1.5"
                                            >
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
                                                        setSort(
                                                            sortBy === opt.value
                                                                ? ''
                                                                : opt.value,
                                                        )
                                                    "
                                                >
                                                    <component
                                                        :is="opt.icon"
                                                        class="h-3.5 w-3.5 shrink-0"
                                                    />
                                                    <span
                                                        class="leading-tight"
                                                        >{{ opt.label }}</span
                                                    >
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
                            v-if="!isArsipView"
                            class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-emerald-400"
                            title="Buat barcode & SKU otomatis untuk produk yang belum punya barcode"
                            :disabled="generatingAll"
                            @click="runGenerateAllBarcodes"
                        >
                            <Sparkles class="h-4 w-4" />
                            {{
                                generatingAll
                                    ? 'Membuat...'
                                    : 'Generate Barcode Semua'
                            }}
                        </button>

                        <!-- Print All Barcodes -->
                        <button
                            v-if="!isArsipView"
                            class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:text-slate-200 dark:hover:bg-zinc-800/40"
                            title="Cetak barcode semua produk (sesuai filter aktif, lintas halaman)"
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
                    <span class="text-xs font-medium text-muted-foreground"
                        >Filter aktif:</span
                    >

                    <span
                        v-if="filterKategori"
                        class="inline-flex items-center gap-1 rounded-full bg-indigo-100 py-0.5 pr-1.5 pl-2.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                    >
                        {{
                            kategoris.find(
                                (k) => String(k.id_kategori) === filterKategori,
                            )?.nama_kategori
                        }}
                        <button
                            class="rounded-full p-0.5 transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-500/30"
                            @click="setKategori('')"
                            aria-label="Hapus filter kategori"
                        >
                            <X class="h-2.5 w-2.5" />
                        </button>
                    </span>

                    <span
                        v-if="filterJenis"
                        class="inline-flex items-center gap-1 rounded-full bg-indigo-100 py-0.5 pr-1.5 pl-2.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                    >
                        {{
                            jenisFilterOptions.find(
                                (o) => o.value === filterJenis,
                            )?.label
                        }}
                        <button
                            class="rounded-full p-0.5 transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-500/30"
                            @click="setJenis('')"
                            aria-label="Hapus filter asal produk"
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
                            @click="setSort('')"
                            aria-label="Hapus urutan"
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
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Nama Produk
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Kategori
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Harga Jual
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Persediaan (Stok)
                            </th>
                            <th
                                class="px-6 py-4 font-semibold text-muted-foreground"
                            >
                                Status
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
                                <Package
                                    class="mx-auto mb-3 h-10 w-10 opacity-30"
                                />
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
                            v-for="produk in props.produks.data"
                            :key="produk.id_produk"
                            class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"
                        >
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <img
                                        v-if="
                                            resolveFoto(
                                                produk.foto_url ?? produk.foto,
                                            )
                                        "
                                        :src="
                                            resolveFoto(
                                                produk.foto_url ?? produk.foto,
                                            ) ?? undefined
                                        "
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
                                            <p
                                                class="truncate font-semibold text-foreground"
                                            >
                                                {{ produk.nama }}
                                            </p>
                                            <span
                                                v-if="
                                                    tipeJualBadge[
                                                        produk.tipe_jual
                                                    ]
                                                "
                                                :class="[
                                                    'inline-flex shrink-0 items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold',
                                                    tipeJualBadge[
                                                        produk.tipe_jual
                                                    ].class,
                                                ]"
                                            >
                                                {{
                                                    tipeJualBadge[
                                                        produk.tipe_jual
                                                    ].label
                                                }}
                                            </span>
                                        </div>
                                        <p
                                            class="text-xs text-muted-foreground"
                                        >
                                            SKU: {{ produk.sku }}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">
                                {{ produk.kategori ?? '-' }}
                            </td>
                            <td
                                class="px-6 py-4 font-bold text-slate-800 dark:text-slate-200"
                            >
                                {{ formatRupiah(produk.harga_jual) }}
                            </td>
                            <td class="px-6 py-4 font-medium">
                                <span
                                    v-if="produk.tipe_jual === 'jasa'"
                                    class="text-muted-foreground"
                                    >—</span
                                >
                                <span v-else
                                    >{{ formatStok(produk.stok) }}
                                    {{ produk.satuan }}</span
                                >
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
                                <!-- Tampilan Arsip: Pulihkan + Hapus Permanen -->
                                <div
                                    v-if="isArsipView"
                                    class="inline-flex items-center justify-end gap-2"
                                >
                                    <span
                                        v-if="produk.archived_at"
                                        class="hidden text-xs text-muted-foreground sm:inline"
                                        >Diarsipkan
                                        {{ produk.archived_at }}</span
                                    >
                                    <button
                                        class="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
                                        @click="pulihkanProduk(produk)"
                                    >
                                        <ArchiveRestore class="h-3.5 w-3.5" />
                                        Pulihkan
                                    </button>
                                    <!-- Hapus permanen: aktif hanya untuk produk tanpa riwayat -->
                                    <button
                                        v-if="produk.bisa_hapus"
                                        class="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-500/20 dark:text-rose-400"
                                        @click="hapusPermanenProduk(produk)"
                                    >
                                        <Trash2 class="h-3.5 w-3.5" />
                                        Hapus Permanen
                                    </button>
                                    <span
                                        v-else
                                        class="inline-flex cursor-help items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground dark:border-sidebar-border"
                                        title="Tidak bisa dihapus permanen karena produk ini sudah pernah dipakai di transaksi, produksi, atau pesanan. Biarkan diarsipkan agar laporan tetap utuh."
                                    >
                                        <Lock class="h-3.5 w-3.5" />
                                        Terkunci
                                    </span>
                                </div>
                                <!-- Tampilan Aktif: aksi stok/produksi + cetak / edit / arsipkan -->
                                <div
                                    v-else
                                    class="inline-flex items-center justify-end gap-2"
                                >
                                    <!-- Aksi kontekstual: ikut jenis produk (jasa tak punya stok) -->
                                    <button
                                        v-if="produk.tipe_jual !== 'jasa'"
                                        class="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors"
                                        :class="
                                            produk.jenis === 'produksi'
                                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400'
                                                : 'border-sky-500/30 bg-sky-500/10 text-sky-700 hover:bg-sky-500/20 dark:text-sky-400'
                                        "
                                        :title="
                                            produk.jenis === 'produksi'
                                                ? 'Catat batch produksi (stok & modal dihitung otomatis)'
                                                : 'Tambah stok masuk (restock dari supplier)'
                                        "
                                        @click="aksiStokProduk(produk)"
                                    >
                                        <component
                                            :is="
                                                produk.jenis === 'produksi'
                                                    ? ChefHat
                                                    : PackagePlus
                                            "
                                            class="h-3.5 w-3.5"
                                        />
                                        {{
                                            produk.jenis === 'produksi'
                                                ? 'Catat Produksi'
                                                : 'Tambah Stok'
                                        }}
                                    </button>
                                    <button
                                        v-if="produk.barcode"
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-zinc-800"
                                        aria-label="Cetak barcode"
                                        @click="openPrintBarcode(produk)"
                                    >
                                        <Printer class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
                                        aria-label="Edit"
                                        @click="openEdit(produk)"
                                    >
                                        <Edit class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-amber-600 dark:hover:bg-zinc-800"
                                        aria-label="Arsipkan"
                                        title="Arsipkan produk"
                                        @click="arsipkanProduk(produk)"
                                    >
                                        <Archive class="h-4 w-4" />
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
                :visible-pages="visiblePages"
                @update:current-page="goToPage"
                @update:per-page="changePerPage"
            />
        </div>
    </div>

    <!-- Modal Cetak Barcode -->
    <BodyTeleport>
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
                            <template v-if="barcodeMode === 'single'">
                                {{
                                    Math.min(
                                        Math.max(
                                            Math.floor(barcodeCopies) || 1,
                                            1,
                                        ),
                                        MAX_BARCODE_COPIES,
                                    )
                                }}
                                label barcode siap dicetak
                            </template>
                            <template v-else>
                                {{ barcodePrintList.length }} label barcode siap
                                dicetak
                            </template>
                        </p>
                    </div>
                    <button
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                        @click="closeBarcodeModal"
                        aria-label="Tutup"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <div
                    v-if="barcodePrintList.length === 0"
                    class="py-10 text-center text-muted-foreground"
                >
                    <Barcode class="mx-auto mb-3 h-10 w-10 opacity-30" />
                    <p class="text-sm font-medium">
                        Tidak ada produk dengan barcode yang dapat dicetak.
                    </p>
                    <p class="mt-1 text-xs">
                        Tambahkan barcode ke produk terlebih dahulu melalui menu
                        Edit.
                    </p>
                </div>

                <div v-else>
                    <!-- Preview labels -->
                    <div
                        class="mb-5 flex flex-wrap gap-4 rounded-xl border border-sidebar-border/70 bg-slate-50/50 p-4 dark:border-sidebar-border dark:bg-zinc-800/20"
                    >
                        <div
                            v-for="(produk, index) in barcodePrintList"
                            :key="produk.id_produk"
                            class="flex w-48 flex-col items-center rounded-lg border border-sidebar-border/70 bg-white p-3 dark:border-sidebar-border dark:bg-zinc-900"
                        >
                            <svg
                                :ref="(el) => setBarcodeRef(el, index)"
                                class="w-full"
                            />
                            <p
                                class="mt-2 text-center text-xs leading-tight font-semibold text-slate-800 dark:text-slate-200"
                            >
                                {{ produk.nama }}
                            </p>
                            <p
                                class="mt-0.5 text-center text-xs text-muted-foreground"
                            >
                                {{ formatRupiah(produk.harga_jual) }}
                            </p>
                        </div>
                    </div>

                    <!-- Pilihan jumlah salinan: hanya untuk cetak per produk -->
                    <div
                        v-if="barcodeMode === 'single'"
                        class="mb-5 flex flex-col gap-2 rounded-xl border border-sidebar-border/70 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border dark:bg-zinc-800/20"
                    >
                        <div>
                            <label
                                for="barcode-copies"
                                class="block text-sm font-medium"
                                >Jumlah label dicetak</label
                            >
                            <p class="mt-0.5 text-xs text-muted-foreground">
                                Cetak beberapa label sekaligus dalam satu kertas
                                (maks. {{ MAX_BARCODE_COPIES }}).
                            </p>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <button
                                type="button"
                                class="flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-lg font-semibold transition-colors hover:bg-slate-100 disabled:opacity-40 dark:border-sidebar-border dark:hover:bg-zinc-800"
                                :disabled="barcodeCopies <= 1"
                                @click="
                                    barcodeCopies = Math.max(
                                        1,
                                        Math.floor(barcodeCopies || 1) - 1,
                                    )
                                "
                            >
                                −
                            </button>
                            <input
                                id="barcode-copies"
                                v-model.number="barcodeCopies"
                                type="number"
                                min="1"
                                :max="MAX_BARCODE_COPIES"
                                class="h-9 w-20 rounded-lg border border-sidebar-border/70 bg-background text-center text-sm font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-sidebar-border"
                                @blur="
                                    barcodeCopies = Math.min(
                                        Math.max(
                                            Math.floor(barcodeCopies || 1),
                                            1,
                                        ),
                                        MAX_BARCODE_COPIES,
                                    )
                                "
                            />
                            <button
                                type="button"
                                class="flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-lg font-semibold transition-colors hover:bg-slate-100 disabled:opacity-40 dark:border-sidebar-border dark:hover:bg-zinc-800"
                                :disabled="barcodeCopies >= MAX_BARCODE_COPIES"
                                @click="
                                    barcodeCopies = Math.min(
                                        MAX_BARCODE_COPIES,
                                        Math.floor(barcodeCopies || 1) + 1,
                                    )
                                "
                            >
                                +
                            </button>
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
    </BodyTeleport>

    <!-- Modal Tambah / Edit Produk (wizard 3 langkah) -->
    <BodyTeleport>
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
                    class="relative flex h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-sidebar-border/70 bg-card shadow-2xl sm:h-auto sm:max-h-[90vh] sm:w-[560px] sm:max-w-[calc(100vw-2rem)] sm:rounded-2xl dark:border-sidebar-border"
                >
                    <!-- Drag handle (mobile) -->
                    <div
                        class="flex shrink-0 justify-center pt-2.5 pb-0.5 sm:hidden"
                    >
                        <div
                            class="h-1.5 w-10 rounded-full bg-slate-300 dark:bg-zinc-700"
                        ></div>
                    </div>

                    <!-- Header -->
                    <div
                        class="flex shrink-0 items-center gap-3 px-5 pt-3.5 pb-3.5"
                    >
                        <div
                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                        >
                            <Package class="h-5 w-5" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <h2
                                class="text-base leading-tight font-bold sm:text-lg"
                            >
                                {{
                                    editingProduk
                                        ? 'Edit Produk'
                                        : 'Tambah Produk Baru'
                                }}
                            </h2>
                            <p
                                class="mt-0.5 truncate text-xs text-muted-foreground"
                            >
                                {{ stepSubtitle }}
                            </p>
                        </div>
                        <button
                            type="button"
                            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-muted-foreground transition-colors hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                            @click="closeModal"
                            aria-label="Tutup"
                        >
                            <X class="h-[18px] w-[18px]" />
                        </button>
                    </div>

                    <!-- Stepper -->
                    <div class="shrink-0 px-6 pb-4">
                        <div class="flex items-center">
                            <button
                                v-for="(stepDef, idx) in [
                                    { n: 1, label: 'Jenis' },
                                    { n: 2, label: 'Detail' },
                                    { n: 3, label: step3Label },
                                ]"
                                :key="stepDef.n"
                                type="button"
                                class="contents"
                                @click="goToStep(stepDef.n as 1 | 2 | 3)"
                            >
                                <span
                                    v-if="idx > 0"
                                    class="mx-1.5 mb-[22px] h-0.5 flex-1 rounded transition-colors"
                                    :class="
                                        wizardStep >= stepDef.n
                                            ? 'bg-indigo-600'
                                            : 'bg-slate-200 dark:bg-zinc-700'
                                    "
                                ></span>
                                <span
                                    class="flex cursor-pointer flex-col items-center gap-1.5"
                                >
                                    <span
                                        class="flex h-8 w-8 items-center justify-center rounded-full border-2 text-[13px] font-bold transition-all"
                                        :class="
                                            wizardStep >= stepDef.n
                                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                                : 'border-slate-300 bg-card text-muted-foreground dark:border-zinc-600'
                                        "
                                    >
                                        <Check
                                            v-if="wizardStep > stepDef.n"
                                            class="h-4 w-4"
                                        />
                                        <span v-else>{{ stepDef.n }}</span>
                                    </span>
                                    <span
                                        class="text-[11.5px] transition-colors"
                                        :class="
                                            wizardStep === stepDef.n
                                                ? 'font-bold text-indigo-600 dark:text-indigo-400'
                                                : 'font-medium text-muted-foreground'
                                        "
                                        >{{ stepDef.label }}</span
                                    >
                                </span>
                            </button>
                        </div>
                    </div>

                    <!-- Body (scroll) -->
                    <div class="min-h-0 flex-1 overflow-y-auto px-5 pt-1 pb-5">
                        <!-- ============ STEP 1: JENIS ============ -->
                        <div v-if="wizardStep === 1">
                            <h3 class="text-[15px] font-bold">
                                Bagaimana produk ini dijual?
                            </h3>
                            <p
                                class="mt-1 mb-3.5 text-xs text-muted-foreground"
                            >
                                Pilihan ini menentukan kolom yang muncul
                                berikutnya.
                            </p>

                            <!-- Tipe jual -->
                            <div class="grid grid-cols-3 gap-2.5">
                                <button
                                    v-for="opt in tipeJualOptions"
                                    :key="opt.value"
                                    type="button"
                                    class="flex flex-col items-center gap-1.5 rounded-2xl border p-3.5 text-center transition-all"
                                    :class="
                                        form.tipe_jual === opt.value
                                            ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/15 dark:bg-indigo-500/10'
                                            : 'border-sidebar-border/70 hover:border-indigo-300 dark:border-sidebar-border dark:hover:border-indigo-500/50'
                                    "
                                    @click="setTipeJual(opt.value)"
                                >
                                    <component
                                        :is="opt.icon"
                                        class="h-6 w-6"
                                        :class="
                                            form.tipe_jual === opt.value
                                                ? 'text-indigo-600 dark:text-indigo-400'
                                                : 'text-muted-foreground'
                                        "
                                    />
                                    <span
                                        class="text-[13px] leading-tight font-bold"
                                        :class="
                                            form.tipe_jual === opt.value
                                                ? 'text-indigo-700 dark:text-indigo-300'
                                                : ''
                                        "
                                        >{{ opt.label }}</span
                                    >
                                    <span
                                        class="text-[10.5px] leading-tight text-muted-foreground"
                                        >{{ opt.short }}</span
                                    >
                                </button>
                            </div>

                            <!-- Hint tipe jual -->
                            <p
                                class="mt-2.5 flex items-start gap-1.5 rounded-xl bg-slate-50 px-3 py-2.5 text-[11.5px] leading-relaxed text-muted-foreground dark:bg-zinc-800/40"
                            >
                                <Info class="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span>{{
                                    tipeJualOptions.find(
                                        (o) => o.value === form.tipe_jual,
                                    )?.hint
                                }}</span>
                            </p>

                            <!-- Asal produk (non-jasa) -->
                            <div v-if="form.tipe_jual !== 'jasa'" class="mt-5">
                                <div class="mb-2.5 flex items-center gap-1.5">
                                    <span
                                        class="text-[13px] font-semibold text-slate-700 dark:text-slate-200"
                                        >Asal produk</span
                                    >
                                    <span class="relative inline-flex">
                                        <button
                                            type="button"
                                            class="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                                            @click="toggleTip('asal')"
                                            aria-label="Info asal produk"
                                        >
                                            <Info class="h-3 w-3" />
                                        </button>
                                        <span
                                            v-if="activeTip === 'asal'"
                                            class="absolute top-6 left-0 z-20 w-56 rounded-xl bg-slate-900 px-3 py-2.5 text-[11px] leading-relaxed font-normal text-slate-100 shadow-xl dark:bg-zinc-950"
                                        >
                                            Untuk produk
                                            <b class="text-white"
                                                >buatan sendiri</b
                                            >, harga modal &amp; stok tidak
                                            diisi di sini — dihitung otomatis
                                            dari catatan
                                            <b class="text-white">Produksi</b>.
                                        </span>
                                    </span>
                                </div>
                                <div class="grid grid-cols-2 gap-2.5">
                                    <button
                                        v-for="opt in jenisOptions"
                                        :key="opt.value"
                                        type="button"
                                        class="flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all"
                                        :class="
                                            form.jenis === opt.value
                                                ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/15 dark:bg-indigo-500/10'
                                                : 'border-sidebar-border/70 hover:border-indigo-300 dark:border-sidebar-border dark:hover:border-indigo-500/50'
                                        "
                                        @click="form.jenis = opt.value"
                                    >
                                        <component
                                            :is="opt.icon"
                                            class="h-5 w-5 shrink-0"
                                            :class="
                                                form.jenis === opt.value
                                                    ? 'text-indigo-600 dark:text-indigo-400'
                                                    : 'text-muted-foreground'
                                            "
                                        />
                                        <span class="min-w-0">
                                            <span
                                                class="block text-[13px] leading-tight font-bold"
                                                :class="
                                                    form.jenis === opt.value
                                                        ? 'text-indigo-700 dark:text-indigo-300'
                                                        : ''
                                                "
                                                >{{ opt.label }}</span
                                            >
                                            <span
                                                class="mt-0.5 block text-[11px] leading-tight text-muted-foreground"
                                                >{{ opt.hint }}</span
                                            >
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- ============ STEP 2: DETAIL ============ -->
                        <div v-else-if="wizardStep === 2" class="space-y-5">
                            <!-- Nama -->
                            <div>
                                <label
                                    class="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-200"
                                    for="prod-nama"
                                >
                                    Nama produk
                                    <span class="text-rose-500">*</span>
                                </label>
                                <input
                                    id="prod-nama"
                                    v-model="form.nama"
                                    type="text"
                                    placeholder="mis. Kopi Sachet, Bensin Eceran…"
                                    class="w-full rounded-xl border border-sidebar-border/70 bg-background px-3.5 py-3 text-sm text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 focus:outline-none dark:border-sidebar-border"
                                    :class="{
                                        'border-rose-500': form.errors.nama,
                                    }"
                                />
                                <p
                                    v-if="form.errors.nama"
                                    class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                                >
                                    <AlertCircle class="h-3 w-3" />{{
                                        form.errors.nama
                                    }}
                                </p>
                            </div>

                            <!-- Kategori -->
                            <div>
                                <label
                                    class="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-200"
                                    for="prod-kategori"
                                >
                                    Kategori
                                    <span class="text-rose-500">*</span>
                                </label>
                                <select
                                    id="prod-kategori"
                                    v-model="form.id_kategori"
                                    class="w-full appearance-none rounded-xl border border-sidebar-border/70 bg-background px-3.5 py-3 text-sm text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 focus:outline-none dark:border-sidebar-border"
                                    :class="{
                                        'border-rose-500':
                                            form.errors.id_kategori,
                                    }"
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
                                <p
                                    v-if="form.errors.id_kategori"
                                    class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                                >
                                    <AlertCircle class="h-3 w-3" />{{
                                        form.errors.id_kategori
                                    }}
                                </p>
                            </div>

                            <!-- Satuan (non-jasa) -->
                            <div v-if="form.tipe_jual !== 'jasa'">
                                <label
                                    class="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-200"
                                    for="prod-satuan"
                                >
                                    Satuan
                                </label>
                                <input
                                    id="prod-satuan"
                                    v-model="form.satuan"
                                    type="text"
                                    list="satuan-suggestions"
                                    placeholder="pcs / liter / kg"
                                    class="w-full rounded-xl border border-sidebar-border/70 bg-background px-3.5 py-3 text-sm text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 focus:outline-none dark:border-sidebar-border"
                                    :class="{
                                        'border-rose-500': form.errors.satuan,
                                    }"
                                />
                                <datalist id="satuan-suggestions">
                                    <option
                                        v-for="s in satuanSuggestions"
                                        :key="s"
                                        :value="s"
                                    />
                                </datalist>
                                <div class="mt-2 flex flex-wrap gap-1.5">
                                    <button
                                        v-for="s in satuanSuggestions"
                                        :key="s"
                                        type="button"
                                        class="rounded-full border px-3 py-1 text-xs font-semibold transition-colors"
                                        :class="
                                            form.satuan === s
                                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                                : 'border-sidebar-border/70 text-muted-foreground hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border'
                                        "
                                        @click="form.satuan = s"
                                    >
                                        {{ s }}
                                    </button>
                                </div>
                                <p
                                    v-if="form.errors.satuan"
                                    class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                                >
                                    <AlertCircle class="h-3 w-3" />{{
                                        form.errors.satuan
                                    }}
                                </p>
                            </div>

                            <!-- Foto -->
                            <div>
                                <label
                                    class="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-200"
                                >
                                    Foto produk
                                    <span
                                        class="font-normal text-muted-foreground"
                                        >(opsional)</span
                                    >
                                </label>
                                <div class="flex items-start gap-3">
                                    <div
                                        class="relative h-[82px] w-[82px] shrink-0 overflow-hidden rounded-2xl border border-sidebar-border/70 bg-slate-100 dark:border-sidebar-border dark:bg-zinc-800"
                                    >
                                        <img
                                            v-if="fotoPreviewUrl"
                                            :src="fotoPreviewUrl"
                                            alt="Pratinjau foto produk"
                                            class="h-full w-full object-cover"
                                        />
                                        <div
                                            v-else
                                            class="flex h-full w-full items-center justify-center text-muted-foreground"
                                        >
                                            <ImageIcon class="h-6 w-6" />
                                        </div>
                                        <button
                                            v-if="fotoPreviewUrl"
                                            type="button"
                                            class="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                                            aria-label="Hapus foto"
                                            @click="clearFoto"
                                        >
                                            <X class="h-3 w-3" />
                                        </button>
                                    </div>
                                    <div
                                        class="flex min-w-0 flex-1 flex-col gap-2"
                                    >
                                        <label
                                            class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-sidebar-border/70 bg-slate-50 px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-sidebar-border dark:bg-zinc-900 dark:text-slate-200 dark:hover:bg-zinc-800"
                                        >
                                            <Upload class="h-4 w-4" />
                                            {{
                                                fotoUploadName
                                                    ? 'Ganti Foto'
                                                    : 'Upload dari Galeri'
                                            }}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                class="hidden"
                                                @change="handleFileUpload"
                                            />
                                        </label>
                                        <input
                                            id="prod-foto"
                                            v-model="form.foto"
                                            type="text"
                                            placeholder="atau tempel URL gambar…"
                                            class="w-full rounded-xl border border-sidebar-border/70 bg-background px-3 py-2 text-[13px] text-foreground focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                            :class="{
                                                'border-rose-500':
                                                    form.errors.foto,
                                            }"
                                        />
                                    </div>
                                </div>
                                <p
                                    v-if="fotoUploadName"
                                    class="mt-1.5 truncate text-xs text-muted-foreground"
                                >
                                    File dipilih: {{ fotoUploadName }}
                                </p>
                                <p
                                    v-if="fotoUploadError || form.errors.foto"
                                    class="mt-1 flex items-start gap-1 text-xs text-rose-600"
                                >
                                    <AlertCircle
                                        class="mt-0.5 h-3 w-3 shrink-0"
                                    />{{ fotoUploadError || form.errors.foto }}
                                </p>
                            </div>
                        </div>

                        <!-- ============ STEP 3: HARGA / TARIF ============ -->
                        <div v-else class="space-y-5">
                            <!-- Pricing (non-jasa) -->
                            <template v-if="form.tipe_jual !== 'jasa'">
                                <!-- Harga Jual -->
                                <div>
                                    <label
                                        class="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-200"
                                        for="prod-harga-jual"
                                    >
                                        {{
                                            form.tipe_jual === 'curah'
                                                ? `Harga per ${form.satuan || 'satuan'}`
                                                : 'Harga Jual'
                                        }}
                                        <span class="text-rose-500">*</span>
                                    </label>
                                    <div class="relative">
                                        <span
                                            class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-medium text-muted-foreground"
                                            >Rp</span
                                        >
                                        <input
                                            id="prod-harga-jual"
                                            v-model="form.harga_jual"
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            class="w-full rounded-xl border border-sidebar-border/70 bg-background py-3 pr-4 pl-9 text-sm text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 focus:outline-none dark:border-sidebar-border"
                                            :class="{
                                                'border-rose-500':
                                                    form.errors.harga_jual,
                                            }"
                                        />
                                    </div>
                                    <p
                                        v-if="form.errors.harga_jual"
                                        class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                                    >
                                        <AlertCircle class="h-3 w-3" />{{
                                            form.errors.harga_jual
                                        }}
                                    </p>
                                </div>

                                <!-- Beli jadi: Modal + Stok -->
                                <div
                                    v-if="form.jenis === 'beli'"
                                    class="grid grid-cols-2 gap-3"
                                >
                                    <div>
                                        <label
                                            class="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-200"
                                            for="prod-harga-modal"
                                        >
                                            Harga Modal
                                        </label>
                                        <div class="relative">
                                            <span
                                                class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-medium text-muted-foreground"
                                                >Rp</span
                                            >
                                            <input
                                                id="prod-harga-modal"
                                                v-model="form.harga_modal"
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                class="w-full rounded-xl border border-sidebar-border/70 bg-background py-3 pr-3 pl-9 text-sm text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 focus:outline-none dark:border-sidebar-border"
                                                :class="{
                                                    'border-rose-500':
                                                        form.errors.harga_modal,
                                                }"
                                            />
                                        </div>
                                        <p
                                            v-if="form.errors.harga_modal"
                                            class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                                        >
                                            <AlertCircle class="h-3 w-3" />{{
                                                form.errors.harga_modal
                                            }}
                                        </p>
                                    </div>
                                    <div>
                                        <label
                                            class="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-200"
                                            for="prod-stok"
                                        >
                                            Stok{{
                                                form.satuan
                                                    ? ` (${form.satuan})`
                                                    : ''
                                            }}
                                        </label>
                                        <input
                                            id="prod-stok"
                                            v-model="form.stok"
                                            type="number"
                                            min="0"
                                            :step="
                                                form.tipe_jual === 'curah'
                                                    ? 'any'
                                                    : '1'
                                            "
                                            placeholder="0"
                                            class="w-full rounded-xl border border-sidebar-border/70 bg-background px-3.5 py-3 text-sm text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 focus:outline-none dark:border-sidebar-border"
                                            :class="{
                                                'border-rose-500':
                                                    form.errors.stok,
                                            }"
                                        />
                                        <p
                                            v-if="form.errors.stok"
                                            class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                                        >
                                            <AlertCircle class="h-3 w-3" />{{
                                                form.errors.stok
                                            }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Produksi: catatan otomatis -->
                                <div
                                    v-else
                                    class="flex items-start gap-2 rounded-xl bg-slate-50 px-3.5 py-3 text-[11.5px] leading-relaxed text-muted-foreground dark:bg-zinc-800/40"
                                >
                                    <ChefHat
                                        class="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400"
                                    />
                                    <span
                                        ><b
                                            class="text-slate-600 dark:text-slate-300"
                                            >Harga modal &amp; stok</b
                                        >
                                        produk buatan sendiri terisi otomatis
                                        dari menu
                                        <b
                                            class="text-slate-600 dark:text-slate-300"
                                            >Produksi</b
                                        >
                                        — lewati saja di sini.</span
                                    >
                                </div>

                                <!-- Potongan reseller -->
                                <div>
                                    <div
                                        class="mb-1.5 flex items-center gap-1.5"
                                    >
                                        <label
                                            class="text-[13px] font-semibold text-slate-700 dark:text-slate-200"
                                            for="prod-potongan"
                                            >Potongan Reseller</label
                                        >
                                        <span class="relative inline-flex">
                                            <button
                                                type="button"
                                                class="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                                                @click="toggleTip('reseller')"
                                                aria-label="Info potongan reseller"
                                            >
                                                <Info class="h-3 w-3" />
                                            </button>
                                            <span
                                                v-if="activeTip === 'reseller'"
                                                class="absolute top-6 left-0 z-20 w-56 rounded-xl bg-slate-900 px-3 py-2.5 text-[11px] leading-relaxed font-normal text-slate-100 shadow-xl dark:bg-zinc-950"
                                            >
                                                Potongan harga khusus reseller.
                                                Kosongkan / 0 bila produk ini
                                                tidak diberi potongan.
                                            </span>
                                        </span>
                                    </div>
                                    <div class="relative">
                                        <span
                                            class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-medium text-muted-foreground"
                                            >Rp</span
                                        >
                                        <input
                                            id="prod-potongan"
                                            v-model="form.potongan_reseller"
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            class="w-full rounded-xl border border-sidebar-border/70 bg-background py-3 pr-4 pl-9 text-sm text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 focus:outline-none dark:border-sidebar-border"
                                            :class="{
                                                'border-rose-500':
                                                    form.errors
                                                        .potongan_reseller,
                                            }"
                                        />
                                    </div>
                                    <div
                                        v-if="
                                            Number(form.potongan_reseller) > 0
                                        "
                                        class="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                    >
                                        Harga untuk reseller:
                                        <b>{{ formatRupiah(hargaReseller) }}</b>
                                        <span class="opacity-70"
                                            >(dari
                                            {{
                                                formatRupiah(
                                                    Number(
                                                        form.harga_jual || 0,
                                                    ),
                                                )
                                            }})</span
                                        >
                                    </div>
                                    <p
                                        v-if="resellerBelowModal"
                                        class="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400"
                                    >
                                        <AlertCircle
                                            class="h-3.5 w-3.5 shrink-0"
                                        />
                                        Harga reseller di bawah modal — berisiko
                                        rugi.
                                    </p>
                                    <p
                                        v-if="form.errors.potongan_reseller"
                                        class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                                    >
                                        <AlertCircle class="h-3 w-3" />{{
                                            form.errors.potongan_reseller
                                        }}
                                    </p>
                                </div>
                            </template>

                            <!-- Tarif fee (jasa) -->
                            <template v-else>
                                <div>
                                    <div class="mb-1 flex items-center gap-1.5">
                                        <span class="text-[15px] font-bold"
                                            >Tarif Fee Bertingkat</span
                                        >
                                        <span
                                            class="text-[11.5px] font-normal text-muted-foreground"
                                            >(opsional)</span
                                        >
                                        <span class="relative inline-flex">
                                            <button
                                                type="button"
                                                class="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400"
                                                @click="toggleTip('tarif')"
                                                aria-label="Info tarif fee"
                                            >
                                                <Info class="h-3 w-3" />
                                            </button>
                                            <span
                                                v-if="activeTip === 'tarif'"
                                                class="absolute top-6 -left-28 z-20 w-64 rounded-xl bg-slate-900 px-3 py-2.5 text-[11px] leading-relaxed font-normal text-slate-100 shadow-xl dark:bg-zinc-950"
                                            >
                                                Fee = pendapatan toko (biaya
                                                admin), bukan nominal
                                                transfer/tarik. Atur fee per
                                                <b class="text-white"
                                                    >range nominal</b
                                                >; saat transaksi fee terisi
                                                otomatis. Kosongkan bila ingin
                                                diketik manual tiap transaksi.
                                            </span>
                                        </span>
                                    </div>
                                    <p
                                        class="mb-3.5 text-xs text-muted-foreground"
                                    >
                                        Fee terisi otomatis saat kasir mengetik
                                        nominal.
                                    </p>

                                    <div
                                        v-if="form.tarifs.length > 0"
                                        class="mb-3 space-y-2.5"
                                    >
                                        <div
                                            class="grid grid-cols-[1fr_1fr_34px] gap-2 px-0.5 text-[10px] font-bold tracking-wide text-muted-foreground uppercase"
                                        >
                                            <span>Mulai dari</span>
                                            <span>Fee</span>
                                            <span></span>
                                        </div>
                                        <div
                                            v-for="(
                                                tarif, index
                                            ) in form.tarifs"
                                            :key="index"
                                        >
                                            <div
                                                class="grid grid-cols-[1fr_1fr_34px] items-center gap-2"
                                            >
                                                <div class="relative">
                                                    <span
                                                        class="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs font-medium text-muted-foreground"
                                                        >Rp</span
                                                    >
                                                    <input
                                                        v-model.number="
                                                            tarif.min_nominal
                                                        "
                                                        type="number"
                                                        min="0"
                                                        inputmode="numeric"
                                                        placeholder="0"
                                                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pr-2 pl-7 text-sm text-foreground focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                                    />
                                                </div>
                                                <div class="relative">
                                                    <span
                                                        class="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs font-medium text-muted-foreground"
                                                        >Rp</span
                                                    >
                                                    <input
                                                        v-model.number="
                                                            tarif.fee
                                                        "
                                                        type="number"
                                                        min="0"
                                                        inputmode="numeric"
                                                        placeholder="0"
                                                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pr-2 pl-7 text-sm text-foreground focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    class="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-slate-100 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600 dark:bg-zinc-800 dark:hover:bg-rose-500/10"
                                                    aria-label="Hapus range"
                                                    @click="removeTarif(index)"
                                                >
                                                    <Trash2 class="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p
                                                class="px-0.5 pt-1 text-[11px] text-muted-foreground"
                                            >
                                                Berlaku untuk
                                                <b class="text-foreground">{{
                                                    tarifRangeLabel(index)
                                                }}</b>
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-dashed border-indigo-300 bg-indigo-50 px-3.5 py-2.5 text-xs font-bold text-indigo-600 transition-colors hover:bg-indigo-100 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-400"
                                        @click="addTarif"
                                    >
                                        <Plus class="h-3.5 w-3.5" />
                                        Tambah Range
                                    </button>
                                </div>
                            </template>

                            <!-- Barcode & SKU (opsional, collapsible) -->
                            <div
                                class="border-t border-sidebar-border/60 pt-4 dark:border-sidebar-border"
                            >
                                <button
                                    type="button"
                                    class="flex w-full items-center gap-2.5"
                                    @click="
                                        showBarcodeSection = !showBarcodeSection
                                    "
                                >
                                    <span
                                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-muted-foreground dark:bg-zinc-800"
                                    >
                                        <ScanLine class="h-4 w-4" />
                                    </span>
                                    <span class="min-w-0 flex-1 text-left">
                                        <span
                                            class="block text-[13.5px] leading-tight font-bold"
                                            >Barcode &amp; SKU</span
                                        >
                                        <span
                                            class="block text-[11.5px] leading-tight text-muted-foreground"
                                            >Opsional — bisa diisi nanti</span
                                        >
                                    </span>
                                    <ChevronDown
                                        class="h-[18px] w-[18px] text-muted-foreground transition-transform"
                                        :class="{
                                            'rotate-180': showBarcodeSection,
                                        }"
                                    />
                                </button>

                                <div v-if="showBarcodeSection" class="mt-3.5">
                                    <div
                                        class="mb-3 flex flex-wrap items-center justify-between gap-2"
                                    >
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
                                                    isScannerDetected
                                                        ? 'bg-emerald-500'
                                                        : 'bg-rose-500',
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
                                    <div class="grid grid-cols-2 gap-3">
                                        <div>
                                            <label
                                                class="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-200"
                                                for="prod-barcode"
                                            >
                                                Barcode
                                            </label>
                                            <input
                                                id="prod-barcode"
                                                v-model="form.barcode"
                                                type="text"
                                                placeholder="Barcode unik"
                                                class="w-full rounded-xl border border-sidebar-border/70 bg-background px-3.5 py-3 text-sm text-foreground focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                                :class="{
                                                    'border-rose-500':
                                                        form.errors.barcode,
                                                }"
                                            />
                                            <p
                                                v-if="form.errors.barcode"
                                                class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                                            >
                                                <AlertCircle
                                                    class="h-3 w-3"
                                                />{{ form.errors.barcode }}
                                            </p>
                                        </div>
                                        <div>
                                            <label
                                                class="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-200"
                                                for="prod-sku"
                                            >
                                                SKU
                                            </label>
                                            <input
                                                id="prod-sku"
                                                v-model="form.sku"
                                                type="text"
                                                placeholder="SKU unik"
                                                class="w-full rounded-xl border border-sidebar-border/70 bg-background px-3.5 py-3 text-sm text-foreground focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                                :class="{
                                                    'border-rose-500':
                                                        form.errors.sku,
                                                }"
                                            />
                                            <p
                                                v-if="form.errors.sku"
                                                class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                                            >
                                                <AlertCircle
                                                    class="h-3 w-3"
                                                />{{ form.errors.sku }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div
                        class="flex shrink-0 items-center gap-3 border-t border-sidebar-border/70 bg-card px-5 py-3.5 dark:border-sidebar-border"
                    >
                        <button
                            v-if="wizardStep > 1"
                            type="button"
                            class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-sidebar-border/70 bg-background px-4 py-3 text-[13.5px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:text-slate-200 dark:hover:bg-zinc-800/40"
                            @click="prevStep"
                        >
                            <ChevronLeft class="h-4 w-4" />
                            Kembali
                        </button>
                        <span
                            class="flex-1 text-xs font-semibold text-muted-foreground/70"
                            >Langkah {{ wizardStep }} dari 3</span
                        >
                        <button
                            type="button"
                            class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-3 text-[13.5px] font-bold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60"
                            :disabled="submitting"
                            @click="nextStep"
                        >
                            {{ footerNextLabel }}
                            <ChevronRight
                                v-if="wizardStep < 3"
                                class="h-4 w-4"
                            />
                            <Save v-else class="h-4 w-4" />
                        </button>
                    </div>

                    <!-- Overlay sukses -->
                    <div
                        v-if="submitted"
                        class="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/55 p-6 backdrop-blur-sm"
                    >
                        <div
                            class="w-full max-w-sm rounded-2xl border border-sidebar-border/70 bg-card p-7 text-center shadow-2xl dark:border-sidebar-border"
                        >
                            <div
                                class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            >
                                <Check class="h-7 w-7" />
                            </div>
                            <h3 class="mt-4 text-lg font-bold">
                                {{ successTitle }}
                            </h3>
                            <p class="mt-1.5 text-sm text-muted-foreground">
                                {{ successText }}
                            </p>
                            <div class="mt-6 flex flex-col gap-2.5">
                                <button
                                    v-if="successMeta.isProd"
                                    type="button"
                                    class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-[13.5px] font-bold text-white transition-colors hover:bg-indigo-500"
                                    @click="lanjutKeProduksi"
                                >
                                    <ChefHat class="h-4 w-4" />
                                    Ya, catat produksi
                                </button>
                                <button
                                    type="button"
                                    class="inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-100 px-4 py-3 text-[13.5px] font-semibold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-200 dark:hover:bg-zinc-700"
                                    @click="closeModal"
                                >
                                    {{ successSecondary }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </BodyTeleport>
</template>
