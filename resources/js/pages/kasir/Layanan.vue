<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { CreditCard, Plus, Trash2, Banknote, QrCode, ArrowRight, Sparkles, Info } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { store as kasirTransaksiStore } from '@/routes/kasir/transaksi';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Layanan / Jasa',
                href: '/kasir/layanan',
            },
        ],
    },
});

interface Layanan {
    id_produk: number;
    nama: string;
    satuan: string;
}

interface JasaLine {
    id_produk: number;
    nama: string;
    nominal: number | '';
    fee: number | '';
}

const props = defineProps<{
    layanan: Layanan[];
}>();

const lines = ref<JasaLine[]>([]);

const form = useForm({
    metode_pembayaran: 'cash',
    bayar: '',
    items: [] as Array<{ id_produk: number; jumlah: number; nominal: number; fee: number }>,
});

const paymentMethods = [
    { value: 'cash', label: 'Tunai', icon: Banknote },
    { value: 'qris', label: 'QRIS', icon: QrCode },
    { value: 'transfer', label: 'Transfer', icon: CreditCard },
] as const;

function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

function addLine(svc: Layanan): void {
    lines.value.push({ id_produk: svc.id_produk, nama: svc.nama, nominal: '', fee: '' });
}

function removeLine(index: number): void {
    lines.value.splice(index, 1);
}

const totalFee = computed(() => lines.value.reduce((sum, l) => sum + (Number(l.fee) || 0), 0));
const totalNominal = computed(() => lines.value.reduce((sum, l) => sum + (Number(l.nominal) || 0), 0));

const hasInvalid = computed(
    () => lines.value.length === 0 || lines.value.some((l) => (Number(l.fee) || 0) <= 0 || (Number(l.nominal) || 0) <= 0),
);

const isPaid = computed(() => (Number(form.bayar) || 0) >= totalFee.value);
const kembalian = computed(() => Math.max(0, (Number(form.bayar) || 0) - totalFee.value));

function submit(): void {
    if (hasInvalid.value || !isPaid.value) {
        return;
    }

    form.items = lines.value.map((l) => ({
        id_produk: l.id_produk,
        jumlah: 1,
        nominal: Math.floor(Number(l.nominal) || 0),
        fee: Math.floor(Number(l.fee) || 0),
    }));

    form.post(kasirTransaksiStore().url, {
        preserveScroll: true,
        onSuccess: () => {
            lines.value = [];
            form.bayar = '';
        },
    });
}
</script>

<template>
    <Head title="Layanan / Jasa - Kasir" />

    <div class="mx-auto flex h-full w-full max-w-3xl flex-1 flex-col gap-6 p-4 sm:p-6">
        <!-- Header -->
        <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-extrabold tracking-tight sm:text-3xl">Layanan / Jasa</h1>
            <p class="text-sm text-muted-foreground">
                Transfer & tarik tunai. Catat nominal pokok dan biaya admin (fee) — hanya fee yang dihitung sebagai pendapatan.
            </p>
        </div>

        <!-- Catatan akunting -->
        <div class="flex items-start gap-2 rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 text-xs text-muted-foreground">
            <Info class="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
            <p>
                <strong>Nominal transfer/tarik adalah titipan</strong>, bukan omzet. Yang masuk ke pendapatan toko hanya
                <strong>biaya admin (fee)</strong>.
            </p>
        </div>

        <!-- Pilih layanan -->
        <div v-if="layanan.length === 0" class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-400">
            Belum ada produk jasa. Tambahkan produk dengan Tipe Jual <strong>Jasa</strong> di menu Data Produk (admin) dulu.
        </div>
        <div v-else class="flex flex-wrap gap-2">
            <button
                v-for="svc in layanan"
                :key="svc.id_produk"
                type="button"
                class="inline-flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-500/20 dark:text-violet-300"
                @click="addLine(svc)"
            >
                <Plus class="h-4 w-4" />
                {{ svc.nama }}
            </button>
        </div>

        <!-- Daftar layanan yang dipilih -->
        <div class="flex flex-col gap-3">
            <div
                v-if="lines.length === 0"
                class="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-sidebar-border/70 py-12 text-center text-muted-foreground dark:border-sidebar-border"
            >
                <Sparkles class="h-8 w-8 opacity-40" />
                <p class="text-sm font-medium">Pilih layanan di atas untuk mulai.</p>
            </div>

            <div
                v-for="(line, index) in lines"
                :key="index"
                class="rounded-2xl border border-sidebar-border/70 bg-card p-4 shadow-sm dark:border-sidebar-border"
            >
                <div class="flex items-center justify-between">
                    <h3 class="flex items-center gap-2 font-bold">
                        <CreditCard class="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        {{ line.nama }}
                    </h3>
                    <button
                        type="button"
                        class="rounded-lg p-1.5 text-muted-foreground transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                        @click="removeLine(index)"
                    >
                        <Trash2 class="h-4 w-4" />
                    </button>
                </div>

                <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <label class="mb-1 block text-xs font-medium text-muted-foreground">Nominal transfer/tarik (titipan)</label>
                        <div class="relative">
                            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</span>
                            <input
                                v-model.number="line.nominal"
                                type="number"
                                min="0"
                                inputmode="numeric"
                                placeholder="500000"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-9 pr-3 text-sm font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                            />
                        </div>
                    </div>
                    <div>
                        <label class="mb-1 block text-xs font-medium text-muted-foreground">Biaya admin / fee (pendapatan)</label>
                        <div class="relative">
                            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</span>
                            <input
                                v-model.number="line.fee"
                                type="number"
                                min="0"
                                inputmode="numeric"
                                placeholder="5000"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-9 pr-3 text-sm font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Ringkasan & pembayaran -->
        <div v-if="lines.length > 0" class="space-y-3 rounded-2xl border border-sidebar-border/70 bg-slate-50/60 p-4 dark:border-sidebar-border dark:bg-zinc-900/40">
            <!-- Metode pembayaran fee -->
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

            <!-- Input bayar (fee) -->
            <div class="space-y-2">
                <div class="relative">
                    <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</span>
                    <input
                        v-model="form.bayar"
                        type="number"
                        min="0"
                        inputmode="numeric"
                        placeholder="Uang diterima untuk fee"
                        class="w-full rounded-xl border border-sidebar-border/70 bg-background py-2.5 pl-9 pr-3 text-sm font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
                <button
                    type="button"
                    class="rounded-lg border border-indigo-500/30 bg-indigo-500/5 px-2.5 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-500/10 dark:text-indigo-400"
                    @click="form.bayar = String(totalFee)"
                >
                    Uang Pas
                </button>
                <p v-if="form.errors.bayar" class="text-xs text-rose-600">{{ form.errors.bayar }}</p>
                <p v-if="form.errors.items" class="text-xs text-rose-600">{{ form.errors.items }}</p>
            </div>

            <!-- Rincian -->
            <div class="space-y-1.5 rounded-xl border border-sidebar-border/70 bg-background p-3 dark:border-sidebar-border">
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Total nominal (titipan, bukan omzet)</span>
                    <span class="tabular-nums">{{ formatRupiah(totalNominal) }}</span>
                </div>
                <div class="flex items-center justify-between border-t border-sidebar-border/70 pt-2 dark:border-sidebar-border">
                    <span class="text-sm font-bold">Total Fee (pendapatan)</span>
                    <span class="text-xl font-extrabold text-indigo-600 tabular-nums dark:text-indigo-400">{{ formatRupiah(totalFee) }}</span>
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

            <p v-if="hasInvalid" class="text-center text-xs font-medium text-amber-600 dark:text-amber-400">
                Lengkapi nominal & fee tiap layanan.
            </p>

            <button
                type="button"
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="hasInvalid || !isPaid || form.processing"
                @click="submit"
            >
                {{ form.processing ? 'Memproses...' : 'Proses Layanan' }}
                <ArrowRight v-if="!form.processing" class="h-4 w-4" />
            </button>
        </div>
    </div>
</template>
