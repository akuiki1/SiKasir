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
} from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { store as transaksiStore, update as transaksiUpdate, destroy as transaksiDestroy } from '@/routes/admin/transactions';

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

const props = defineProps<{
    transaksis: Transaksi[];
    kasirs: Kasir[];
    produks: ProdukItem[];
    stats: Stats;
}>();

function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

function formatMetode(metode: string): string {
    const labels: Record<string, string> = {
        cash: 'Tunai',
        qris: 'QRIS',
        transfer: 'Transfer',
    };

    return labels[metode] ?? metode;
}

const searchQuery = ref('');
const filteredTransaksis = computed(() => {
    if (!searchQuery.value) {
        return props.transaksis;
    }

    const q = searchQuery.value.toLowerCase();

    return props.transaksis.filter(
        (t) => t.kode.toLowerCase().includes(q) || t.kasir.toLowerCase().includes(q),
    );
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
    items: [{ id_produk: '', jumlah: '1' }] as FormItem[],
});

const computedTotal = computed(() => {
    return form.items.reduce((total, item) => {
        if (!item.id_produk || !item.jumlah) {
            return total;
        }

        const produk = props.produks.find((p) => p.id_produk === Number(item.id_produk));

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
    form.items = [{ id_produk: '', jumlah: '1' }];
    showFormModal.value = true;
}

function openEdit(trx: Transaksi) {
    editingTransaksi.value = trx;
    form.id_user = String(trx.id_user);
    form.metode_pembayaran = trx.metode_pembayaran as 'cash' | 'qris' | 'transfer';
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

function addItem() {
    form.items.push({ id_produk: '', jumlah: '1' });
}

function removeItem(index: number) {
    if (form.items.length > 1) {
        form.items.splice(index, 1);
    }
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
        router.put(transaksiUpdate(editingTransaksi.value.id_transaksi).url, data, {
            onSuccess: () => closeFormModal(),
        });
    } else {
        router.post(transaksiStore().url, data, {
            onSuccess: () => closeFormModal(),
        });
    }
}

function hapusTransaksi(trx: Transaksi) {
    if (confirm(`Hapus transaksi "${trx.kode}"? Stok produk akan dikembalikan.`)) {
        router.delete(transaksiDestroy(trx.id_transaksi).url);
    }
}
</script>

<template>
    <Head title="Data Transaksi - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">Manajemen Transaksi</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Pantau riwayat seluruh transaksi penjualan, status pembayaran, serta metode
                    pembayaran kasir.
                </p>
            </div>

            <button
                id="btn-tambah-transaksi"
                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500"
                @click="openTambah"
            >
                <Plus class="h-4 w-4" />
                Tambah Transaksi
            </button>
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
                        Total Penjualan Hari Ini
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
                        Total Transaksi Hari Ini
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
                    <span class="text-xs font-medium text-muted-foreground">Rata-rata Pembelian</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ formatRupiah(stats.rata_rata) }}</h3>
                </div>
            </div>
        </div>

        <div
            class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"
        >
            <div
                class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border"
            >
                <div class="relative max-w-md flex-1">
                    <Search
                        class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari transaksi berdasarkan ID atau kasir..."
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr
                            class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"
                        >
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                ID Transaksi
                            </th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Kasir</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                Jumlah Barang
                            </th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                Total Belanja
                            </th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Metode</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Waktu</th>
                            <th class="px-6 py-4 text-right font-semibold text-muted-foreground">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        <tr v-if="filteredTransaksis.length === 0">
                            <td colspan="7" class="px-6 py-12 text-center text-muted-foreground">
                                <ShoppingCart class="mx-auto mb-3 h-10 w-10 opacity-30" />
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
                            v-for="trx in filteredTransaksis"
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
                            <td class="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
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
                                        title="Lihat Detail"
                                        @click="openDetail(trx)"
                                    >
                                        <FileText class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
                                        title="Edit"
                                        @click="openEdit(trx)"
                                    >
                                        <Edit class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                                        title="Hapus"
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
        </div>
    </div>

    <!-- Modal Detail Transaksi -->
    <Teleport to="body">
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
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <div class="mb-4 flex flex-col gap-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">ID Transaksi</span>
                        <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">{{
                            selectedTrx.kode
                        }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Kasir</span>
                        <span class="font-semibold">{{ selectedTrx.kasir }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Waktu</span>
                        <span>{{ selectedTrx.waktu }}, {{ selectedTrx.tanggal }}</span>
                    </div>
                </div>

                <div class="mb-4 overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20">
                                <th class="px-4 py-2 text-left font-semibold text-muted-foreground">Produk</th>
                                <th class="px-4 py-2 text-right font-semibold text-muted-foreground">Qty</th>
                                <th class="px-4 py-2 text-right font-semibold text-muted-foreground">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            <tr v-for="(detail, idx) in selectedTrx.details" :key="idx">
                                <td class="px-4 py-2 flex items-center gap-3">
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
                                <td class="px-4 py-2 text-right">{{ detail.jumlah }}</td>
                                <td class="px-4 py-2 text-right font-medium">
                                    {{ formatRupiah(detail.subtotal) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="flex flex-col gap-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Metode Pembayaran</span>
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
                        @click="hapusTransaksi(selectedTrx); closeDetail()"
                    >
                        <Trash2 class="h-4 w-4" />
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- Modal Tambah / Edit Transaksi -->
    <Teleport to="body">
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
                        {{ editingTransaksi ? 'Edit Transaksi' : 'Tambah Transaksi Baru' }}
                    </h2>
                    <button
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                        @click="closeFormModal"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <form class="flex flex-col gap-4" @submit.prevent="submitForm">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium" for="trx-kasir">
                                Kasir
                            </label>
                            <select
                                id="trx-kasir"
                                v-model="form.id_user"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                :class="{ 'border-rose-500': form.errors.id_user }"
                            >
                                <option value="">Pilih kasir</option>
                                <option v-for="kasir in kasirs" :key="kasir.id" :value="String(kasir.id)">
                                    {{ kasir.name }} ({{ kasir.role }})
                                </option>
                            </select>
                            <p
                                v-if="form.errors.id_user"
                                class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                            >
                                <AlertCircle class="h-3 w-3" />{{ form.errors.id_user }}
                            </p>
                        </div>
                        <div>
                            <label class="mb-1.5 block text-sm font-medium" for="trx-metode">
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
                        <div class="mb-2 flex items-center justify-between">
                            <label class="text-sm font-medium">Item Produk</label>
                            <button
                                type="button"
                                class="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-500"
                                @click="addItem"
                            >
                                <Plus class="h-3 w-3" />
                                Tambah Item
                            </button>
                        </div>

                        <div
                            v-if="form.errors.items"
                            class="mb-2 flex items-center gap-1 text-xs text-rose-600"
                        >
                            <AlertCircle class="h-3 w-3" />{{ form.errors.items }}
                        </div>

                        <div class="flex flex-col gap-2">
                            <div
                                v-for="(item, index) in form.items"
                                :key="index"
                                class="flex items-start gap-2 rounded-lg border border-sidebar-border/70 p-3 dark:border-sidebar-border"
                            >
                                <div class="flex-1">
                                    <select
                                        v-model="item.id_produk"
                                        class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                    >
                                        <option value="">Pilih produk</option>
                                        <option
                                            v-for="produk in produks"
                                            :key="produk.id_produk"
                                            :value="String(produk.id_produk)"
                                        >
                                            {{ produk.nama }} — {{ formatRupiah(produk.harga_jual) }}
                                            (stok: {{ produk.stok }})
                                        </option>
                                    </select>
                                </div>
                                <div class="w-24">
                                    <input
                                        v-model="item.jumlah"
                                        type="number"
                                        min="1"
                                        :max="getProdukStok(item.id_produk) || undefined"
                                        placeholder="Qty"
                                        class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                    />
                                </div>
                                <div class="w-28 pt-2 text-right text-sm font-medium">
                                    {{
                                        item.id_produk && item.jumlah
                                            ? formatRupiah(
                                                  getProdukHarga(item.id_produk) * Number(item.jumlah),
                                              )
                                            : '-'
                                    }}
                                </div>
                                <button
                                    type="button"
                                    class="mt-1.5 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                                    :disabled="form.items.length <= 1"
                                    :class="{ 'opacity-40': form.items.length <= 1 }"
                                    @click="removeItem(index)"
                                >
                                    <Minus class="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-lg border border-sidebar-border/70 bg-slate-50/50 p-4 dark:border-sidebar-border dark:bg-zinc-800/20">
                        <div class="flex justify-between text-sm">
                            <span class="text-muted-foreground">Total</span>
                            <span class="font-bold">{{ formatRupiah(computedTotal) }}</span>
                        </div>
                        <div class="mt-2 flex justify-between text-sm">
                            <span class="text-muted-foreground">Kembalian</span>
                            <span class="font-semibold text-emerald-600">{{
                                formatRupiah(computedKembalian)
                            }}</span>
                        </div>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium" for="trx-bayar">
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
                            <AlertCircle class="h-3 w-3" />{{ form.errors.bayar }}
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
                            class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60"
                            :disabled="form.processing"
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
    </Teleport>
</template>
