<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { 
    Search, 
    Filter, 
    ShoppingCart, 
    Plus, 
    Minus, 
    Trash2, 
    DollarSign, 
    CreditCard, 
    ArrowRight,
    Percent
} from 'lucide-vue-next';

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

// Mock active cart items
const cartItems = [
    { id: 1, name: 'Kopi Susu Gula Aren', price: 'Rp 18.000', qty: 2, subtotal: 'Rp 36.000' },
    { id: 2, name: 'Croissant Cokelat Premium', price: 'Rp 22.000', qty: 1, subtotal: 'Rp 22.000' },
];

// Mock product list for cashier catalog
const catalogProducts = [
    { id: 1, name: 'Kopi Susu Gula Aren', category: 'Minuman', price: 'Rp 18.000', stock: 45 },
    { id: 2, name: 'Croissant Cokelat Premium', category: 'Makanan', price: 'Rp 22.000', stock: 12 },
    { id: 3, name: 'Es Teh Manis Jumbo', category: 'Minuman', price: 'Rp 6.000', stock: 150 },
    { id: 4, name: 'Red Velvet Latte', category: 'Minuman', price: 'Rp 24.000', stock: 20 },
    { id: 5, name: 'Roti Bakar Keju', category: 'Makanan', price: 'Rp 15.000', stock: 35 },
    { id: 6, name: 'Kentang Goreng Truffle', category: 'Camilan', price: 'Rp 25.000', stock: 0 },
];
</script>

<template>
    <Head title="Transaksi Baru - Kasir" />

    <div class="flex h-full flex-1 flex-col lg:flex-row gap-6 p-6 overflow-hidden">
        <!-- Left Side: Product Catalog -->
        <div class="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
            <!-- Catalog Header & Search -->
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 class="text-3xl font-extrabold tracking-tight">Transaksi Baru</h1>
                    <p class="text-sm text-muted-foreground mt-1">Pilih produk di bawah untuk dimasukkan ke keranjang belanja pelanggan.</p>
                </div>
            </div>

            <!-- Search and Filter Bar -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="relative flex-1">
                    <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Cari produk berdasarkan nama atau scan barcode..." 
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background pl-9 pr-4 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
                
                <div class="flex gap-2">
                    <button class="inline-flex items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800/40 dark:border-sidebar-border">
                        <Filter class="h-4 w-4" />
                        Minuman
                    </button>
                    <button class="inline-flex items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800/40 dark:border-sidebar-border">
                        <Filter class="h-4 w-4" />
                        Makanan
                    </button>
                </div>
            </div>

            <!-- Products Grid -->
            <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div 
                    v-for="product in catalogProducts" 
                    :key="product.id"
                    :class="[
                        'relative overflow-hidden rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 select-none shadow-sm',
                        product.stock > 0 
                            ? 'border-sidebar-border/70 bg-card hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-indigo-500/30' 
                            : 'border-sidebar-border/40 bg-slate-50/50 dark:bg-zinc-900/10 opacity-60'
                    ]"
                >
                    <div>
                        <div class="flex items-center justify-between">
                            <span class="inline-flex rounded-full bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 text-xxs font-medium text-muted-foreground">
                                {{ product.category }}
                            </span>
                            <span 
                                :class="[
                                    'text-xxs font-semibold',
                                    product.stock > 10 
                                        ? 'text-emerald-600 dark:text-emerald-400' 
                                        : product.stock > 0
                                            ? 'text-amber-600 dark:text-amber-400'
                                            : 'text-rose-600 dark:text-rose-400'
                                ]"
                            >
                                {{ product.stock > 0 ? `Stok: ${product.stock}` : 'Habis' }}
                            </span>
                        </div>
                        <h3 class="font-bold text-foreground mt-3 leading-tight text-sm line-clamp-2 h-10">{{ product.name }}</h3>
                    </div>
                    <div class="mt-4 flex items-center justify-between">
                        <span class="font-extrabold text-indigo-600 dark:text-indigo-400">{{ product.price }}</span>
                        <button 
                            :disabled="product.stock === 0"
                            class="rounded-lg bg-indigo-50 dark:bg-indigo-950/40 p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <Plus class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side: Checkout Cart Summary -->
        <div class="w-full lg:w-[380px] rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border flex flex-col justify-between shadow-sm overflow-hidden h-[calc(100vh-120px)] lg:sticky lg:top-6">
            <div>
                <!-- Cart Header -->
                <div class="flex items-center justify-between border-b border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <div class="flex items-center gap-2">
                        <ShoppingCart class="h-5 w-5 text-indigo-600" />
                        <h2 class="font-bold tracking-tight">Keranjang Belanja</h2>
                    </div>
                    <span class="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        3 Items
                    </span>
                </div>

                <!-- Cart Items List -->
                <div class="divide-y divide-sidebar-border/70 max-h-[calc(100vh-420px)] overflow-y-auto dark:divide-sidebar-border">
                    <div 
                        v-for="item in cartItems" 
                        :key="item.id"
                        class="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-zinc-800/10 transition-colors"
                    >
                        <div class="flex-1 min-w-0 pr-3">
                            <h4 class="font-semibold text-sm truncate text-foreground">{{ item.name }}</h4>
                            <p class="text-xs text-muted-foreground mt-0.5">{{ item.price }} / item</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="flex items-center border border-sidebar-border rounded-lg bg-background dark:border-sidebar-border">
                                <button class="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 text-muted-foreground">
                                    <Minus class="h-3 w-3" />
                                </button>
                                <span class="px-2 text-xs font-bold select-none">{{ item.qty }}</span>
                                <button class="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 text-muted-foreground">
                                    <Plus class="h-3 w-3" />
                                </button>
                            </div>
                            <span class="font-bold text-sm text-foreground w-16 text-right">{{ item.subtotal }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cart Summary & Payment -->
            <div class="border-t border-sidebar-border/70 p-4 bg-slate-50/50 dark:bg-zinc-800/10 dark:border-sidebar-border space-y-4">
                <div class="space-y-2">
                    <div class="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Subtotal</span>
                        <span>Rp 58.000</span>
                    </div>
                    <div class="flex items-center justify-between text-xs text-muted-foreground">
                        <span class="flex items-center gap-1">Diskon Promo <Percent class="h-3 w-3 text-emerald-500" /></span>
                        <span class="text-emerald-500">-Rp 0</span>
                    </div>
                    <div class="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Pajak (PPN 11%)</span>
                        <span>Rp 6.380</span>
                    </div>
                    <div class="flex items-center justify-between border-t border-sidebar-border/70 pt-2 dark:border-sidebar-border">
                        <span class="font-bold text-sm">Total Tagihan</span>
                        <span class="font-extrabold text-lg text-indigo-600 dark:text-indigo-400">Rp 64.380</span>
                    </div>
                </div>

                <!-- Payment Methods Grid -->
                <div class="grid grid-cols-3 gap-2">
                    <button class="flex flex-col items-center justify-center rounded-lg border border-indigo-600 bg-indigo-50/10 p-2 text-indigo-600 hover:bg-indigo-50/20 transition-all cursor-pointer">
                        <DollarSign class="h-4 w-4" />
                        <span class="text-xxs font-bold mt-1">Tunai</span>
                    </button>
                    <button class="flex flex-col items-center justify-center rounded-lg border border-sidebar-border p-2 text-muted-foreground hover:bg-slate-50 dark:hover:bg-zinc-800/40 hover:text-foreground transition-all dark:border-sidebar-border cursor-pointer">
                        <CreditCard class="h-4 w-4" />
                        <span class="text-xxs font-bold mt-1">QRIS / E-Wallet</span>
                    </button>
                    <button class="flex flex-col items-center justify-center rounded-lg border border-sidebar-border p-2 text-muted-foreground hover:bg-slate-50 dark:hover:bg-zinc-800/40 hover:text-foreground transition-all dark:border-sidebar-border cursor-pointer">
                        <CreditCard class="h-4 w-4" />
                        <span class="text-xxs font-bold mt-1">Debit Card</span>
                    </button>
                </div>

                <button class="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors cursor-pointer">
                    Proses Pembayaran
                    <ArrowRight class="h-4 w-4" />
                </button>
            </div>
        </div>
    </div>
</template>
