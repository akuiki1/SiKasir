<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import {
    ClipboardList,
    PackageCheck,
    BadgeCheck,
    Ban,
    MessageCircle,
    Banknote,
    QrCode,
    CreditCard,
    Phone,
    Clock,
    X,
    Loader2,
    Inbox,
    Wallet,
    Tag,
    StickyNote,
    Search,
    Pencil,
    Plus,
    Minus,
    Trash2,
} from 'lucide-vue-next';
import { ref, computed, watch } from 'vue';
import BodyTeleport from '@/components/BodyTeleport.vue';
import PeriodFilter from '@/components/PeriodFilter.vue';
import { formatRupiah } from '@/lib/format';

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Pesanan Online', href: '/kasir/pesanan' }],
    },
});

interface PesananItem {
    id_produk: number;
    nama_produk: string;
    jumlah: number;
    harga: number;
    subtotal: number;
}

interface TransaksiRingkas {
    kode: string;
    metode_pembayaran: string;
    bayar: number;
    kembalian: number;
}

interface Pesanan {
    id_pesanan: number;
    kode: string;
    status: 'pending' | 'disiapkan' | 'selesai' | 'batal';
    nama_pelanggan: string;
    telp: string;
    tipe_pelanggan: 'umum' | 'reseller';
    total: number;
    catatan: string | null;
    sumber: string;
    waktu: string;
    items: PesananItem[];
    transaksi: TransaksiRingkas | null;
}

interface ProdukOpsi {
    id_produk: number;
    nama: string;
    harga_jual: number;
    potongan_reseller: number;
    stok: number;
}

const props = defineProps<{
    pesanans_aktif: Pesanan[];
    pesanans_riwayat: Pesanan[];
    produks: ProdukOpsi[];
    filters: { search: string; start_date: string; end_date: string };
    base_url: string;
}>();

const formatPrice = formatRupiah;
const actionUrl = (id: number, action: string) => `${props.base_url}/${id}/${action}`;

const STATUS_META: Record<Pesanan['status'], { label: string; badge: string }> = {
    pending: { label: 'Menunggu', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20' },
    disiapkan: { label: 'Siap diambil', badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-indigo-500/20' },
    selesai: { label: 'Selesai', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20' },
    batal: { label: 'Dibatalkan', badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20' },
};

const metodeLabel: Record<string, string> = { cash: 'Tunai', qris: 'QRIS', transfer: 'Transfer' };

// ===== Pencarian (kedua daftar) + filter periode (khusus Riwayat) — server-side =====
const searchQuery = ref(props.filters.search ?? '');
let searchTimer: ReturnType<typeof setTimeout> | undefined;

type QueryValue = string | number;

function buildParams(overrides: Record<string, QueryValue> = {}): Record<string, QueryValue> {
    const params: Record<string, QueryValue | undefined> = {
        search: searchQuery.value || undefined,
        start_date: props.filters.start_date || undefined,
        end_date: props.filters.end_date || undefined,
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
    router.get(props.base_url, buildParams(overrides), {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}

watch(searchQuery, (value) => {
    if (searchTimer) {
        clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(() => reload({ search: value }), 350);
});

// Periode hanya mempersempit Riwayat; antrian aktif selalu tampil semua.
function onPeriod(range: { start_date: string; end_date: string }): void {
    reload({ start_date: range.start_date, end_date: range.end_date });
}

function resetFilter(): void {
    searchQuery.value = '';
}

const adaFilter = computed(() => !!props.filters.search);

// ===== Pesan WhatsApp (wa.me satu-ketuk ke nomor pelanggan) =====
function waUrl(telp: string, text: string): string {
    return `https://wa.me/${telp}?text=${encodeURIComponent(text)}`;
}

function itemLines(pesanan: Pesanan): string {
    return pesanan.items
        .map((item, i) => `${i + 1}. ${item.nama_produk} (${item.jumlah}x) = ${formatPrice(item.subtotal)}`)
        .join('\n');
}

function reminderText(pesanan: Pesanan): string {
    return (
        `Halo ${pesanan.nama_pelanggan}! 👋\n` +
        `Pesanan *${pesanan.kode}* kamu sudah *siap diambil* di Cemilan Mba Tutut.\n\n` +
        `${itemLines(pesanan)}\n\n` +
        `*Total: ${formatPrice(pesanan.total)}*\n\n` +
        `Ditunggu kedatangannya ya. Terima kasih! 🙏`
    );
}

function strukText(pesanan: Pesanan): string {
    const trx = pesanan.transaksi;
    const metode = trx ? (metodeLabel[trx.metode_pembayaran] ?? trx.metode_pembayaran) : '-';

    return (
        `Halo ${pesanan.nama_pelanggan} 🙏\n` +
        `Terima kasih sudah belanja di *Cemilan Mba Tutut*!\n\n` +
        `🧾 *STRUK ${trx?.kode ?? pesanan.kode}*\n` +
        `Pesanan: ${pesanan.kode}\n` +
        `------------------------------\n` +
        `${itemLines(pesanan)}\n` +
        `------------------------------\n` +
        `*Total: ${formatPrice(pesanan.total)}*\n` +
        `Bayar (${metode}): ${formatPrice(trx?.bayar ?? pesanan.total)}\n` +
        `Kembalian: ${formatPrice(trx?.kembalian ?? 0)}\n\n` +
        `Sampai jumpa lagi! 😊`
    );
}

function kirimReminder(pesanan: Pesanan): void {
    window.open(waUrl(pesanan.telp, reminderText(pesanan)), '_blank');
}

function kirimStruk(pesanan: Pesanan): void {
    window.open(waUrl(pesanan.telp, strukText(pesanan)), '_blank');
}

// ===== Aksi status =====
const busyId = ref<number | null>(null);

function tandaiSiap(pesanan: Pesanan): void {
    busyId.value = pesanan.id_pesanan;
    router.post(actionUrl(pesanan.id_pesanan, 'siap'), {}, {
        preserveScroll: true,
        onFinish: () => {
            busyId.value = null;
        },
    });
}

const batalTarget = ref<Pesanan | null>(null);

function konfirmBatal(): void {
    if (!batalTarget.value) {
        return;
    }

    const id = batalTarget.value.id_pesanan;
    busyId.value = id;
    router.post(actionUrl(id, 'batal'), {}, {
        preserveScroll: true,
        onSuccess: () => {
            batalTarget.value = null;
        },
        onFinish: () => {
            busyId.value = null;
        },
    });
}

// ===== Modal proses pembayaran =====
const payTarget = ref<Pesanan | null>(null);
const payForm = useForm({
    metode_pembayaran: 'cash' as 'cash' | 'qris' | 'transfer',
    bayar: '' as number | string,
});

const payTotal = computed(() => payTarget.value?.total ?? 0);
const bayarNumber = computed(() => Math.floor(Number(payForm.bayar) || 0));
const kembalian = computed(() => Math.max(0, bayarNumber.value - payTotal.value));
const isPaid = computed(() => bayarNumber.value >= payTotal.value);

function openPay(pesanan: Pesanan): void {
    payTarget.value = pesanan;
    payForm.clearErrors();
    payForm.metode_pembayaran = 'cash';
    payForm.bayar = '';
}

function closePay(): void {
    payTarget.value = null;
}

function setMetode(metode: 'cash' | 'qris' | 'transfer'): void {
    payForm.metode_pembayaran = metode;

    if (metode !== 'cash') {
        payForm.bayar = payTotal.value;
    }
}

function uangPas(): void {
    payForm.bayar = payTotal.value;
}

function onBayarInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const digits = el.value.replace(/\D/g, '');
    payForm.bayar = digits === '' ? '' : parseInt(digits, 10);
    el.value = payForm.bayar === '' ? '' : String(payForm.bayar);
}

function submitPay(): void {
    if (!payTarget.value) {
        return;
    }

    payForm
        .transform((data) => ({
            metode_pembayaran: data.metode_pembayaran,
            bayar: Math.floor(Number(data.bayar) || 0),
        }))
        .post(actionUrl(payTarget.value.id_pesanan, 'proses'), {
            preserveScroll: true,
            onSuccess: () => {
                closePay();
            },
        });
}

// ===== Modal edit pesanan =====
interface EditRow {
    id_produk: number;
    nama_produk: string;
    jumlah: number;
    harga: number;
    stok: number; // sisa stok katalog (untuk batas tambah)
}

const editTarget = ref<Pesanan | null>(null);
const editRows = ref<EditRow[]>([]);
const editSaving = ref(false);
const tambahQuery = ref('');

function hargaEfektif(p: ProdukOpsi, reseller: boolean): number {
    return reseller ? Math.max(0, p.harga_jual - p.potongan_reseller) : p.harga_jual;
}

function openEdit(pesanan: Pesanan): void {
    editTarget.value = pesanan;
    tambahQuery.value = '';
    const reseller = pesanan.tipe_pelanggan === 'reseller';

    editRows.value = pesanan.items.map((item) => {
        const opsi = props.produks.find((p) => p.id_produk === item.id_produk);
        // stok katalog + qty yang sudah ter-reserve untuk pesanan ini = batas atas.
        const stokTersedia = (opsi?.stok ?? 0) + item.jumlah;

        return {
            id_produk: item.id_produk,
            nama_produk: item.nama_produk,
            jumlah: item.jumlah,
            harga: opsi ? hargaEfektif(opsi, reseller) : item.harga,
            stok: stokTersedia,
        };
    });
}

function closeEdit(): void {
    editTarget.value = null;
    editRows.value = [];
}

const editReseller = computed(() => editTarget.value?.tipe_pelanggan === 'reseller');

const tambahHasil = computed(() => {
    const q = tambahQuery.value.trim().toLowerCase();

    if (!q) {
        return [];
    }

    const sudah = new Set(editRows.value.map((r) => r.id_produk));

    return props.produks
        .filter((p) => !sudah.has(p.id_produk) && p.stok > 0 && p.nama.toLowerCase().includes(q))
        .slice(0, 6);
});

function tambahProduk(p: ProdukOpsi): void {
    editRows.value.push({
        id_produk: p.id_produk,
        nama_produk: p.nama,
        jumlah: 1,
        harga: hargaEfektif(p, editReseller.value),
        stok: p.stok,
    });
    tambahQuery.value = '';
}

function incEdit(row: EditRow): void {
    if (row.jumlah < row.stok) {
        row.jumlah += 1;
    }
}

function decEdit(row: EditRow): void {
    if (row.jumlah > 1) {
        row.jumlah -= 1;
    }
}

function hapusEdit(index: number): void {
    editRows.value.splice(index, 1);
}

const editTotal = computed(() => editRows.value.reduce((s, r) => s + r.harga * r.jumlah, 0));

function simpanEdit(): void {
    if (!editTarget.value || editRows.value.length === 0) {
        return;
    }

    editSaving.value = true;
    router.post(
        actionUrl(editTarget.value.id_pesanan, 'edit'),
        { items: editRows.value.map((r) => ({ id_produk: r.id_produk, jumlah: r.jumlah })) },
        {
            preserveScroll: true,
            onSuccess: () => {
                closeEdit();
            },
            onFinish: () => {
                editSaving.value = false;
            },
        },
    );
}

const adaPesananAktif = computed(() => props.pesanans_aktif.length > 0);
</script>

<template>
    <Head title="Pesanan Online" />

    <div class="space-y-5 p-4 md:space-y-6 md:p-6">
        <!-- Header -->
        <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
                <h1 class="text-xl font-extrabold tracking-tight md:text-2xl">Pesanan Online</h1>
                <p class="mt-0.5 text-xs text-muted-foreground md:text-sm">
                    Pesanan dari web — proses pembayaran saat pelanggan ambil barang.
                </p>
            </div>
            <span
                class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1.5 text-sm font-bold text-indigo-600 ring-1 ring-indigo-500/20 dark:text-indigo-400"
            >
                <ClipboardList class="h-4 w-4" />
                {{ pesanans_aktif.length }}
            </span>
        </div>

        <!-- Pencarian -->
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div class="relative flex-1">
                <Search class="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Cari nama pemesan atau nomor WA…"
                    class="w-full rounded-xl border border-sidebar-border/70 bg-background py-2.5 pl-11 pr-4 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                />
            </div>
            <button
                v-if="adaFilter"
                type="button"
                class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-sidebar-border/70 px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted"
                @click="resetFilter"
            >
                <X class="h-4 w-4" /> Reset
            </button>
        </div>

        <!-- Daftar pesanan aktif -->
        <section class="space-y-4">
            <h2 class="text-sm font-bold text-muted-foreground uppercase tracking-wide">Perlu diproses</h2>

            <div
                v-if="!adaPesananAktif"
                class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sidebar-border/70 bg-card py-14 text-center"
            >
                <Inbox class="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p class="font-semibold">{{ adaFilter ? 'Tak ada pesanan cocok' : 'Belum ada pesanan menunggu' }}</p>
                <p class="mt-1 text-sm text-muted-foreground">
                    {{ adaFilter ? 'Coba kata kunci lain.' : 'Pesanan baru dari web akan muncul di sini.' }}
                </p>
            </div>

            <div v-else class="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <article
                    v-for="pesanan in pesanans_aktif"
                    :key="pesanan.id_pesanan"
                    class="flex flex-col rounded-2xl border border-sidebar-border/70 bg-card p-4 shadow-sm md:p-5"
                >
                    <div class="flex items-start justify-between gap-2">
                        <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2">
                                <span class="font-mono text-sm font-extrabold">{{ pesanan.kode }}</span>
                                <span
                                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1"
                                    :class="STATUS_META[pesanan.status].badge"
                                >
                                    <PackageCheck v-if="pesanan.status === 'disiapkan'" class="h-3 w-3" />
                                    {{ STATUS_META[pesanan.status].label }}
                                </span>
                            </div>
                            <p class="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock class="h-3.5 w-3.5" /> {{ pesanan.waktu }}
                            </p>
                        </div>
                        <button
                            type="button"
                            class="inline-flex shrink-0 items-center gap-1 rounded-lg border border-sidebar-border/70 px-2 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            @click="openEdit(pesanan)"
                        >
                            <Pencil class="h-3.5 w-3.5" /> Edit
                        </button>
                    </div>

                    <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <span class="font-semibold">{{ pesanan.nama_pelanggan }}</span>
                        <span
                            v-if="pesanan.tipe_pelanggan === 'reseller'"
                            class="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"
                        >
                            <Tag class="h-3 w-3" /> Reseller
                        </span>
                        <a
                            :href="`https://wa.me/${pesanan.telp}`"
                            target="_blank"
                            class="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-indigo-600"
                        >
                            <Phone class="h-3.5 w-3.5" /> {{ pesanan.telp }}
                        </a>
                    </div>

                    <ul class="mt-3 space-y-1.5 rounded-xl bg-muted/40 p-3 text-sm">
                        <li v-for="(item, idx) in pesanan.items" :key="idx" class="flex items-start justify-between gap-2">
                            <span class="min-w-0">
                                <span class="font-medium">{{ item.nama_produk }}</span>
                                <span class="text-muted-foreground"> × {{ item.jumlah }}</span>
                            </span>
                            <span class="shrink-0 tabular-nums">{{ formatPrice(item.subtotal) }}</span>
                        </li>
                    </ul>

                    <p
                        v-if="pesanan.catatan"
                        class="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-500/5 p-2 text-xs text-amber-700 dark:text-amber-400"
                    >
                        <StickyNote class="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{{ pesanan.catatan }}</span>
                    </p>

                    <div class="mt-3 flex items-center justify-between border-t border-dashed border-sidebar-border/70 pt-3">
                        <span class="text-sm font-semibold text-muted-foreground">Total</span>
                        <span class="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                            {{ formatPrice(pesanan.total) }}
                        </span>
                    </div>

                    <div class="mt-4 flex flex-wrap gap-2">
                        <button
                            v-if="pesanan.status === 'pending'"
                            type="button"
                            :disabled="busyId === pesanan.id_pesanan"
                            class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 px-3 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-500/10 disabled:opacity-50 dark:text-indigo-400"
                            @click="tandaiSiap(pesanan)"
                        >
                            <Loader2 v-if="busyId === pesanan.id_pesanan" class="h-4 w-4 animate-spin" />
                            <PackageCheck v-else class="h-4 w-4" />
                            Tandai Siap
                        </button>
                        <button
                            v-else
                            type="button"
                            class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-500/10 dark:text-emerald-400"
                            @click="kirimReminder(pesanan)"
                        >
                            <MessageCircle class="h-4 w-4" />
                            Ingatkan via WA
                        </button>
                        <button
                            type="button"
                            class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                            @click="openPay(pesanan)"
                        >
                            <Wallet class="h-4 w-4" />
                            Proses Bayar
                        </button>
                        <button
                            type="button"
                            aria-label="Batalkan pesanan"
                            :disabled="busyId === pesanan.id_pesanan"
                            class="inline-flex items-center justify-center rounded-xl border border-rose-500/30 px-3 py-2.5 text-rose-600 transition hover:bg-rose-500/10 disabled:opacity-50 dark:text-rose-400"
                            @click="batalTarget = pesanan"
                        >
                            <Ban class="h-4 w-4" />
                        </button>
                    </div>
                </article>
            </div>
        </section>

        <!-- Riwayat pesanan -->
        <section class="space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <h2 class="text-sm font-bold text-muted-foreground uppercase tracking-wide">Riwayat pesanan</h2>
                <PeriodFilter
                    :start-date="props.filters.start_date"
                    :end-date="props.filters.end_date"
                    @change="onPeriod"
                />
            </div>
            <div v-if="pesanans_riwayat.length > 0" class="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-card">
                <div
                    v-for="pesanan in pesanans_riwayat"
                    :key="pesanan.id_pesanan"
                    class="flex flex-wrap items-center justify-between gap-3 border-b border-sidebar-border/60 px-4 py-3 last:border-b-0"
                >
                    <div class="min-w-0">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="font-mono text-sm font-bold">{{ pesanan.kode }}</span>
                            <span
                                class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1"
                                :class="STATUS_META[pesanan.status].badge"
                            >
                                <BadgeCheck v-if="pesanan.status === 'selesai'" class="h-3 w-3" />
                                <Ban v-else class="h-3 w-3" />
                                {{ STATUS_META[pesanan.status].label }}
                            </span>
                        </div>
                        <p class="mt-0.5 text-xs text-muted-foreground">
                            {{ pesanan.nama_pelanggan }} · {{ pesanan.waktu }}
                            <span v-if="pesanan.transaksi"> · {{ pesanan.transaksi.kode }}</span>
                        </p>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-sm font-bold tabular-nums">{{ formatPrice(pesanan.total) }}</span>
                        <button
                            v-if="pesanan.status === 'selesai'"
                            type="button"
                            class="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-500/10 dark:text-emerald-400"
                            @click="kirimStruk(pesanan)"
                        >
                            <MessageCircle class="h-3.5 w-3.5" /> Kirim Struk
                        </button>
                    </div>
                </div>
            </div>
            <div
                v-else
                class="rounded-2xl border border-dashed border-sidebar-border/70 bg-card px-4 py-10 text-center text-sm text-muted-foreground"
            >
                Tidak ada riwayat pesanan pada periode ini.
            </div>
        </section>
    </div>

    <!-- ===== Modal proses pembayaran ===== -->
    <BodyTeleport>
        <div
            v-if="payTarget"
            class="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
            @click.self="closePay"
        >
            <div class="flex w-full max-w-md flex-col rounded-t-3xl bg-card p-5 shadow-2xl sm:rounded-3xl">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-extrabold">Proses Pembayaran</h3>
                    <button type="button" class="rounded-lg p-1 text-muted-foreground transition hover:bg-muted" @click="closePay">
                        <X class="h-5 w-5" />
                    </button>
                </div>
                <p class="mt-0.5 text-sm text-muted-foreground">{{ payTarget.kode }} · {{ payTarget.nama_pelanggan }}</p>

                <div class="mt-4 flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
                    <span class="text-sm font-semibold text-muted-foreground">Total tagihan</span>
                    <span class="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">{{ formatPrice(payTotal) }}</span>
                </div>

                <label class="mt-4 block text-xs font-bold text-muted-foreground uppercase">Metode bayar</label>
                <div class="mt-2 grid grid-cols-3 gap-2">
                    <button
                        v-for="opt in [
                            { v: 'cash', label: 'Tunai', icon: Banknote },
                            { v: 'qris', label: 'QRIS', icon: QrCode },
                            { v: 'transfer', label: 'Transfer', icon: CreditCard },
                        ]"
                        :key="opt.v"
                        type="button"
                        class="flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs font-semibold transition"
                        :class="
                            payForm.metode_pembayaran === opt.v
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                : 'border-sidebar-border/70 text-muted-foreground hover:bg-muted'
                        "
                        @click="setMetode(opt.v as 'cash' | 'qris' | 'transfer')"
                    >
                        <component :is="opt.icon" class="h-4 w-4" />
                        {{ opt.label }}
                    </button>
                </div>

                <div class="mt-4 flex items-center justify-between">
                    <label class="text-xs font-bold text-muted-foreground uppercase">Uang diterima</label>
                    <button type="button" class="text-xs font-semibold text-indigo-600 transition hover:underline dark:text-indigo-400" @click="uangPas">
                        Uang pas
                    </button>
                </div>
                <div class="mt-1.5 flex items-center gap-2 rounded-xl border border-sidebar-border/70 bg-background px-3 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                    <span class="text-sm font-semibold text-muted-foreground">Rp</span>
                    <input
                        :value="payForm.bayar === '' ? '' : formatRupiah(bayarNumber).replace('Rp', '').trim()"
                        type="text"
                        inputmode="numeric"
                        placeholder="0"
                        class="w-full bg-transparent text-right text-lg font-bold outline-none tabular-nums"
                        @input="onBayarInput"
                    />
                </div>
                <p v-if="payForm.errors.bayar" class="mt-1 text-xs font-semibold text-rose-500">{{ payForm.errors.bayar }}</p>

                <div
                    class="mt-3 flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold"
                    :class="isPaid ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'"
                >
                    <span>{{ isPaid ? 'Kembalian' : 'Kurang' }}</span>
                    <span class="tabular-nums">{{ formatPrice(isPaid ? kembalian : payTotal - bayarNumber) }}</span>
                </div>

                <button
                    type="button"
                    :disabled="!isPaid || payForm.processing"
                    class="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-base font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    @click="submitPay"
                >
                    <Loader2 v-if="payForm.processing" class="h-5 w-5 animate-spin" />
                    <BadgeCheck v-else class="h-5 w-5" />
                    Selesaikan Pembayaran
                </button>
            </div>
        </div>
    </BodyTeleport>

    <!-- ===== Modal edit pesanan ===== -->
    <BodyTeleport>
        <div
            v-if="editTarget"
            class="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
            @click.self="closeEdit"
        >
            <div class="flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl">
                <div class="flex items-center justify-between border-b border-sidebar-border/60 p-5">
                    <div>
                        <h3 class="text-lg font-extrabold">Edit Pesanan</h3>
                        <p class="text-sm text-muted-foreground">{{ editTarget.kode }} · {{ editTarget.nama_pelanggan }}</p>
                    </div>
                    <button type="button" class="rounded-lg p-1 text-muted-foreground transition hover:bg-muted" @click="closeEdit">
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto p-5">
                    <!-- Tambah produk -->
                    <div class="relative mb-4">
                        <Search class="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
                        <input
                            v-model="tambahQuery"
                            type="text"
                            placeholder="Cari produk untuk ditambahkan…"
                            class="w-full rounded-xl border border-sidebar-border/70 bg-background py-2.5 pl-11 pr-4 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                        />
                        <div
                            v-if="tambahHasil.length"
                            class="absolute inset-x-0 top-full z-10 mt-1 max-h-56 overflow-y-auto rounded-xl border border-sidebar-border/70 bg-card py-1 shadow-xl"
                        >
                            <button
                                v-for="p in tambahHasil"
                                :key="p.id_produk"
                                type="button"
                                class="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition hover:bg-muted"
                                @click="tambahProduk(p)"
                            >
                                <span class="min-w-0 truncate">{{ p.nama }}</span>
                                <span class="shrink-0 text-xs text-muted-foreground">stok {{ p.stok }} · {{ formatPrice(hargaEfektif(p, editReseller)) }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Baris item -->
                    <div v-if="editRows.length" class="space-y-2">
                        <div
                            v-for="(row, index) in editRows"
                            :key="row.id_produk"
                            class="flex items-center gap-2 rounded-xl border border-sidebar-border/70 p-2.5"
                        >
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-semibold">{{ row.nama_produk }}</p>
                                <p class="text-xs text-muted-foreground">{{ formatPrice(row.harga) }} · {{ formatPrice(row.harga * row.jumlah) }}</p>
                            </div>
                            <div class="inline-flex items-center gap-1 rounded-lg bg-muted p-0.5">
                                <button type="button" class="flex h-7 w-7 items-center justify-center rounded-md bg-card transition hover:text-indigo-600 disabled:opacity-40" :disabled="row.jumlah <= 1" @click="decEdit(row)">
                                    <Minus class="h-3.5 w-3.5" />
                                </button>
                                <span class="w-7 text-center text-sm font-bold tabular-nums">{{ row.jumlah }}</span>
                                <button type="button" class="flex h-7 w-7 items-center justify-center rounded-md bg-card transition hover:text-indigo-600 disabled:opacity-40" :disabled="row.jumlah >= row.stok" @click="incEdit(row)">
                                    <Plus class="h-3.5 w-3.5" />
                                </button>
                            </div>
                            <button type="button" aria-label="Hapus produk" class="rounded-lg p-1.5 text-muted-foreground transition hover:bg-rose-500/10 hover:text-rose-600" @click="hapusEdit(index)">
                                <Trash2 class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <p v-else class="rounded-xl bg-amber-500/5 p-3 text-center text-sm text-amber-700 dark:text-amber-400">
                        Pesanan harus berisi minimal 1 produk.
                    </p>
                </div>

                <div class="border-t border-sidebar-border/60 p-5">
                    <div class="mb-3 flex items-center justify-between">
                        <span class="text-sm font-semibold text-muted-foreground">Total baru</span>
                        <span class="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">{{ formatPrice(editTotal) }}</span>
                    </div>
                    <button
                        type="button"
                        :disabled="editRows.length === 0 || editSaving"
                        class="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-base font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        @click="simpanEdit"
                    >
                        <Loader2 v-if="editSaving" class="h-5 w-5 animate-spin" />
                        <BadgeCheck v-else class="h-5 w-5" />
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    </BodyTeleport>

    <!-- ===== Konfirmasi batal ===== -->
    <BodyTeleport>
        <div
            v-if="batalTarget"
            class="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            @click.self="batalTarget = null"
        >
            <div class="w-full max-w-sm rounded-3xl bg-card p-6 text-center shadow-2xl">
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <Ban class="h-6 w-6" />
                </div>
                <h3 class="mt-3 text-lg font-extrabold">Batalkan {{ batalTarget.kode }}?</h3>
                <p class="mt-1 text-sm text-muted-foreground">
                    Stok yang sempat dipesan akan dikembalikan. Tindakan ini tidak bisa dibatalkan.
                </p>
                <div class="mt-5 flex gap-3">
                    <button type="button" class="flex-1 rounded-xl border border-sidebar-border/70 px-4 py-2.5 text-sm font-semibold transition hover:bg-muted" @click="batalTarget = null">
                        Kembali
                    </button>
                    <button
                        type="button"
                        :disabled="busyId === batalTarget.id_pesanan"
                        class="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:opacity-50"
                        @click="konfirmBatal"
                    >
                        Ya, batalkan
                    </button>
                </div>
            </div>
        </div>
    </BodyTeleport>
</template>
