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
} from 'lucide-vue-next';
import { ref, computed } from 'vue';
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

interface Produk {
    id_produk: number;
    nama: string;
    kategori: string | null;
    harga_jual: number;
    stok: number;
    barcode: string;
}

interface CartItem {
    id_produk: number;
    nama: string;
    harga: number;
    qty: number;
    subtotal: number;
    stock: number;
}

const props = defineProps<{
    produks: Produk[];
}>();

const searchQuery = ref('');
const barcodeScan = ref('');
const scanError = ref('');
const selectedCategory = ref('');
const cartItems = ref<CartItem[]>([]);

const form = useForm({
    metode_pembayaran: 'cash',
    bayar: '',
    items: [] as Array<{ id_produk: number; jumlah: number }>,
});

const filteredProduks = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();

    return props.produks.filter((product) => {
        const matchesSearch =
            !query ||
            product.nama.toLowerCase().includes(query) ||
            product.kategori?.toLowerCase().includes(query);

        const matchesCategory =
            !selectedCategory.value || product.kategori === selectedCategory.value;

        return matchesSearch && matchesCategory;
    });
});

function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

function addToCart(product: Produk) {
    scanError.value = '';
    const existing = cartItems.value.find((item) => item.id_produk === product.id_produk);

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

    cartItems.value.push({
        id_produk: product.id_produk,
        nama: product.nama,
        harga: product.harga_jual,
        qty: 1,
        subtotal: product.harga_jual,
        stock: product.stok,
    });
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

const totalHarga = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.subtotal, 0);
});

const kembalian = computed(() => {
    const bayar = Number(form.bayar) || 0;

    return Math.max(0, bayar - totalHarga.value);
});

function scanBarcode() {
    const barcode = barcodeScan.value.trim();

    if (!barcode) {
        scanError.value = 'Masukkan barcode terlebih dahulu.';

        return;
    }

    const produk = props.produks.find((item) => item.barcode === barcode);

    if (!produk) {
        scanError.value = `Produk dengan barcode ${barcode} tidak ditemukan.`;
        barcodeScan.value = '';

        return;
    }

    addToCart(produk);
    barcodeScan.value = '';
}

function submitTransaction() {
    if (cartItems.value.length === 0) {
        return;
    }

    form.items = cartItems.value.map((item) => ({
        id_produk: item.id_produk,
        jumlah: item.qty,
    }));

    form.post(kasirTransaksiStore().url, {
        preserveScroll: true,
        onSuccess: () => {
            cartItems.value = [];
            form.bayar = '';
        },
    });
}
</script>

<template>
    <Head title="Transaksi Baru - Kasir" />

    <div class="flex h-full flex-1 flex-col lg:flex-row gap-6 p-6 overflow-hidden">
        <div class="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 class="text-3xl font-extrabold tracking-tight">Transaksi Baru</h1>
                    <p class="text-sm text-muted-foreground mt-1">
                        Pilih produk di bawah untuk dimasukkan ke keranjang belanja pelanggan.
                    </p>
                </div>
            </div>

            <div class="grid gap-4 lg:grid-cols-[1fr_auto]">
                <div class="relative">
                    <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari produk..."
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background pl-9 pr-4 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
                <div class="grid gap-2 sm:grid-cols-[1fr_auto]">
                    <div class="relative">
                        <Barcode class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            v-model="barcodeScan"
                            @keyup.enter.prevent="scanBarcode"
                            type="text"
                            placeholder="Scan barcode produk"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background pl-9 pr-4 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                        />
                    </div>
                    <button
                        type="button"
                        class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800/40 dark:border-sidebar-border"
                        @click="scanBarcode"
                    >
                        Scan
                    </button>
                </div>
            </div>
            <p v-if="scanError" class="text-sm text-rose-600">{{ scanError }}</p>

            <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div
                    v-for="product in filteredProduks"
                    :key="product.id_produk"
                    :class="[
                        'relative overflow-hidden rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 select-none shadow-sm',
                        product.stok > 0
                            ? 'border-sidebar-border/70 bg-card hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-indigo-500/30'
                            : 'border-sidebar-border/40 bg-slate-50/50 dark:bg-zinc-900/10 opacity-60',
                    ]"
                >
                    <div>
                        <div class="flex items-center justify-between">
                            <span class="inline-flex rounded-full bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 text-xxs font-medium text-muted-foreground">
                                {{ product.kategori ?? 'Umum' }}
                            </span>
                            <span
                                :class="[
                                    'text-xxs font-semibold',
                                    product.stok > 10
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : product.stok > 0
                                        ? 'text-amber-600 dark:text-amber-400'
                                        : 'text-rose-600 dark:text-rose-400',
                                ]"
                            >
                                {{ product.stok > 0 ? `Stok: ${product.stok}` : 'Habis' }}
                            </span>
                        </div>
                        <h3 class="font-bold text-foreground mt-3 leading-tight text-sm line-clamp-2 h-10">
                            {{ product.nama }}
                        </h3>
                    </div>
                    <div class="mt-4 flex items-center justify-between">
                        <span class="font-extrabold text-indigo-600 dark:text-indigo-400">
                            {{ formatRupiah(product.harga_jual) }}
                        </span>
                        <button
                            type="button"
                            class="rounded-lg bg-indigo-50 dark:bg-indigo-950/40 p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="product.stok === 0"
                            @click="addToCart(product)"
                        >
                            <Plus class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-full lg:w-[380px] rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border flex flex-col justify-between shadow-sm overflow-hidden h-[calc(100vh-120px)] lg:sticky lg:top-6">
            <div>
                <div class="flex items-center justify-between border-b border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <div class="flex items-center gap-2">
                        <ShoppingCart class="h-5 w-5 text-indigo-600" />
                        <h2 class="font-bold tracking-tight">Keranjang Belanja</h2>
                    </div>
                    <span class="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {{ cartItems.length }} Items
                    </span>
                </div>

                <div class="divide-y divide-sidebar-border/70 max-h-[calc(100vh-420px)] overflow-y-auto dark:divide-sidebar-border">
                    <div
                        v-if="cartItems.length === 0"
                        class="p-6 text-center text-sm text-muted-foreground"
                    >
                        Belum ada produk di keranjang.
                    </div>
                    <div
                        v-for="item in cartItems"
                        :key="item.id_produk"
                        class="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-zinc-800/10 transition-colors"
                    >
                        <div class="flex-1 min-w-0 pr-3">
                            <h4 class="font-semibold text-sm truncate text-foreground">{{ item.nama }}</h4>
                            <p class="text-xs text-muted-foreground mt-0.5">{{ formatRupiah(item.harga) }} / item</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <button
                                type="button"
                                class="rounded-lg border border-sidebar-border/70 bg-background p-1 hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800"
                                @click="updateItemQuantity(item, -1)"
                            >
                                <Minus class="h-3 w-3" />
                            </button>
                            <span class="px-2 text-xs font-bold select-none">{{ item.qty }}</span>
                            <button
                                type="button"
                                class="rounded-lg border border-sidebar-border/70 bg-background p-1 hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800"
                                @click="updateItemQuantity(item, 1)"
                            >
                                <Plus class="h-3 w-3" />
                            </button>
                            <button
                                type="button"
                                class="rounded-lg p-1.5 text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800"
                                @click="removeCartItem(item.id_produk)"
                            >
                                <Trash2 class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="border-t border-sidebar-border/70 p-4 bg-slate-50/50 dark:bg-zinc-800/10 dark:border-sidebar-border space-y-4">
                <div class="space-y-2">
                    <div class="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Subtotal</span>
                        <span>{{ formatRupiah(totalHarga) }}</span>
                    </div>
                    <div class="flex items-center justify-between text-xs text-muted-foreground">
                        <span class="flex items-center gap-1">Diskon Promo <Percent class="h-3 w-3 text-emerald-500" /></span>
                        <span class="text-emerald-500">-Rp 0</span>
                    </div>
                    <div class="flex items-center justify-between border-t border-sidebar-border/70 pt-2 dark:border-sidebar-border">
                        <span class="font-bold text-sm">Total Tagihan</span>
                        <span class="font-extrabold text-lg text-indigo-600 dark:text-indigo-400">
                            {{ formatRupiah(totalHarga) }}
                        </span>
                    </div>
                </div>

                <div class="grid gap-3">
                    <label class="block text-sm font-medium">Metode Pembayaran</label>
                    <select
                        v-model="form.metode_pembayaran"
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    >
                        <option value="cash">Tunai</option>
                        <option value="qris">QRIS / E-Wallet</option>
                        <option value="transfer">Transfer</option>
                    </select>

                    <label class="block text-sm font-medium">Bayar</label>
                    <input
                        v-model="form.bayar"
                        type="number"
                        min="0"
                        inputmode="numeric"
                        placeholder="Masukkan jumlah bayar"
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                    <p v-if="form.errors.bayar" class="text-xs text-rose-600">{{ form.errors.bayar }}</p>
                    <p class="text-xs text-muted-foreground">Kembalian: {{ formatRupiah(kembalian) }}</p>
                </div>

                <button
                    type="button"
                    class="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors"
                    :disabled="cartItems.length === 0 || form.processing"
                    @click="submitTransaction"
                >
                    Proses Pembayaran
                    <ArrowRight class="h-4 w-4" />
                </button>
            </div>
        </div>
    </div>
</template>
