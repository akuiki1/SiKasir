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
} from 'lucide-vue-next';
import { ref, computed } from 'vue';
import BodyTeleport from '@/components/BodyTeleport.vue';
import { formatRupiah } from '@/lib/format';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Pesanan Online',
                href: '/kasir/pesanan',
            },
        ],
    },
});

interface PesananItem {
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

const props = defineProps<{
    pesanans_aktif: Pesanan[];
    pesanans_riwayat: Pesanan[];
}>();

const formatPrice = formatRupiah;

const STATUS_META: Record<
    Pesanan['status'],
    { label: string; badge: string }
> = {
    pending: {
        label: 'Menunggu',
        badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20',
    },
    disiapkan: {
        label: 'Siap diambil',
        badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-indigo-500/20',
    },
    selesai: {
        label: 'Selesai',
        badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
    },
    batal: {
        label: 'Dibatalkan',
        badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20',
    },
};

const metodeLabel: Record<string, string> = {
    cash: 'Tunai',
    qris: 'QRIS',
    transfer: 'Transfer',
};

// ===== Pesan WhatsApp (wa.me satu-ketuk ke nomor pelanggan) =====
// Builder dipisah agar mudah diganti gateway otomatis di kemudian hari.
function waUrl(telp: string, text: string): string {
    return `https://wa.me/${telp}?text=${encodeURIComponent(text)}`;
}

function itemLines(pesanan: Pesanan): string {
    return pesanan.items
        .map(
            (item, i) =>
                `${i + 1}. ${item.nama_produk} (${item.jumlah}x) = ${formatPrice(item.subtotal)}`,
        )
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
    router.post(
        `/kasir/pesanan/${pesanan.id_pesanan}/siap`,
        {},
        {
            preserveScroll: true,
            onFinish: () => {
                busyId.value = null;
            },
        },
    );
}

const batalTarget = ref<Pesanan | null>(null);

function konfirmBatal(): void {
    if (!batalTarget.value) {
        return;
    }

    const id = batalTarget.value.id_pesanan;
    busyId.value = id;
    router.post(
        `/kasir/pesanan/${id}/batal`,
        {},
        {
            preserveScroll: true,
            onSuccess: () => {
                batalTarget.value = null;
            },
            onFinish: () => {
                busyId.value = null;
            },
        },
    );
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

    // QRIS/Transfer biasanya pas dengan total; tunai diketik manual.
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
        .post(`/kasir/pesanan/${payTarget.value.id_pesanan}/proses`, {
            preserveScroll: true,
            onSuccess: () => {
                closePay();
            },
        });
}

const adaPesananAktif = computed(() => props.pesanans_aktif.length > 0);
</script>

<template>
    <Head title="Pesanan Online - Kasir" />

    <div class="space-y-5 p-4 md:space-y-6 md:p-6">
        <!-- Header -->
        <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
                <h1 class="text-xl font-extrabold tracking-tight md:text-2xl">
                    Pesanan Online
                </h1>
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

        <!-- Daftar pesanan aktif -->
        <section class="space-y-4">
            <h2 class="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                Perlu diproses
            </h2>

            <div
                v-if="!adaPesananAktif"
                class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sidebar-border/70 bg-card py-14 text-center"
            >
                <Inbox class="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p class="font-semibold">Belum ada pesanan menunggu</p>
                <p class="mt-1 text-sm text-muted-foreground">
                    Pesanan baru dari web akan muncul di sini.
                </p>
            </div>

            <div v-else class="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <article
                    v-for="pesanan in pesanans_aktif"
                    :key="pesanan.id_pesanan"
                    class="flex flex-col rounded-2xl border border-sidebar-border/70 bg-card p-4 shadow-sm md:p-5"
                >
                    <!-- Header kartu -->
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
                    </div>

                    <!-- Pelanggan -->
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

                    <!-- Item -->
                    <ul class="mt-3 space-y-1.5 rounded-xl bg-muted/40 p-3 text-sm">
                        <li
                            v-for="(item, idx) in pesanan.items"
                            :key="idx"
                            class="flex items-start justify-between gap-2"
                        >
                            <span class="min-w-0">
                                <span class="font-medium">{{ item.nama_produk }}</span>
                                <span class="text-muted-foreground"> × {{ item.jumlah }}</span>
                            </span>
                            <span class="shrink-0 tabular-nums">{{ formatPrice(item.subtotal) }}</span>
                        </li>
                    </ul>

                    <!-- Catatan -->
                    <p
                        v-if="pesanan.catatan"
                        class="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-500/5 p-2 text-xs text-amber-700 dark:text-amber-400"
                    >
                        <StickyNote class="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{{ pesanan.catatan }}</span>
                    </p>

                    <!-- Total -->
                    <div class="mt-3 flex items-center justify-between border-t border-dashed border-sidebar-border/70 pt-3">
                        <span class="text-sm font-semibold text-muted-foreground">Total</span>
                        <span class="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                            {{ formatPrice(pesanan.total) }}
                        </span>
                    </div>

                    <!-- Aksi -->
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
        <section v-if="pesanans_riwayat.length > 0" class="space-y-4">
            <h2 class="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                Riwayat pesanan
            </h2>
            <div class="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-card">
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
        </section>
    </div>

    <!-- ===== Modal proses pembayaran ===== -->
    <BodyTeleport>
        <div
            v-if="payTarget"
            class="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
            @click.self="closePay"
        >
            <div
                class="flex w-full max-w-md flex-col rounded-t-3xl bg-card p-5 shadow-2xl sm:rounded-3xl"
            >
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-extrabold">Proses Pembayaran</h3>
                    <button
                        type="button"
                        class="rounded-lg p-1 text-muted-foreground transition hover:bg-muted"
                        @click="closePay"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>
                <p class="mt-0.5 text-sm text-muted-foreground">
                    {{ payTarget.kode }} · {{ payTarget.nama_pelanggan }}
                </p>

                <!-- Total -->
                <div class="mt-4 flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
                    <span class="text-sm font-semibold text-muted-foreground">Total tagihan</span>
                    <span class="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {{ formatPrice(payTotal) }}
                    </span>
                </div>

                <!-- Metode -->
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

                <!-- Uang diterima -->
                <div class="mt-4 flex items-center justify-between">
                    <label class="text-xs font-bold text-muted-foreground uppercase">Uang diterima</label>
                    <button
                        type="button"
                        class="text-xs font-semibold text-indigo-600 transition hover:underline dark:text-indigo-400"
                        @click="uangPas"
                    >
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
                <p v-if="payForm.errors.bayar" class="mt-1 text-xs font-semibold text-rose-500">
                    {{ payForm.errors.bayar }}
                </p>

                <!-- Kembalian -->
                <div
                    class="mt-3 flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold"
                    :class="
                        isPaid
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    "
                >
                    <span>{{ isPaid ? 'Kembalian' : 'Kurang' }}</span>
                    <span class="tabular-nums">
                        {{ formatPrice(isPaid ? kembalian : payTotal - bayarNumber) }}
                    </span>
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
                    <button
                        type="button"
                        class="flex-1 rounded-xl border border-sidebar-border/70 px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
                        @click="batalTarget = null"
                    >
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
