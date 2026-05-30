<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { 
    Plus, 
    Search, 
    Filter, 
    Package, 
    Layers, 
    AlertTriangle, 
    Edit, 
    Trash2,
    DollarSign
} from 'lucide-vue-next';

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

// Mock products data
const products = [
    { id: 1, name: 'Kopi Susu Gula Aren', category: 'Minuman', price: 'Rp 18.000', stock: 45, status: 'in-stock' },
    { id: 2, name: 'Croissant Cokelat Premium', category: 'Makanan', price: 'Rp 22.000', stock: 12, status: 'low-stock' },
    { id: 3, name: 'Es Teh Manis Jumbo', category: 'Minuman', price: 'Rp 6.000', stock: 150, status: 'in-stock' },
    { id: 4, name: 'Kentang Goreng Truffle', category: 'Camilan', price: 'Rp 25.000', stock: 0, status: 'out-of-stock' },
];
</script>

<template>
    <Head title="Data Produk - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <!-- Header Section -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">Manajemen Produk</h1>
                <p class="text-sm text-muted-foreground mt-1">
                    Kelola data produk, persediaan stok, kategori barang, dan harga penjualan toko Anda.
                </p>
            </div>
            
            <button class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">
                <Plus class="h-4 w-4" />
                Tambah Produk Baru
            </button>
        </div>

        <!-- Stats Row -->
        <div class="grid gap-4 md:grid-cols-3">
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border flex items-center gap-4 shadow-sm">
                <div class="rounded-lg bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <Package class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Produk</span>
                    <h3 class="text-xl font-bold mt-0.5">142 Item</h3>
                </div>
            </div>
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border flex items-center gap-4 shadow-sm">
                <div class="rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <Layers class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Kategori</span>
                    <h3 class="text-xl font-bold mt-0.5">8 Kategori</h3>
                </div>
            </div>
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border flex items-center gap-4 shadow-sm">
                <div class="rounded-lg bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    <AlertTriangle class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Stok Menipis / Habis</span>
                    <h3 class="text-xl font-bold mt-0.5">3 Produk</h3>
                </div>
            </div>
        </div>

        <!-- Filters & Table Section -->
        <div class="rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border overflow-hidden">
            <!-- Table Action Bar -->
            <div class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border">
                <div class="relative flex-1 max-w-md">
                    <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Cari produk berdasarkan nama..." 
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background pl-9 pr-4 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
                
                <div class="flex gap-2">
                    <button class="inline-flex items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800/40 dark:border-sidebar-border">
                        <Filter class="h-4 w-4" />
                        Kategori
                    </button>
                </div>
            </div>

            <!-- Responsive Table -->
            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:bg-zinc-800/20 dark:border-sidebar-border">
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Nama Produk</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Kategori</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Harga</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Persediaan (Stok)</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        <tr 
                            v-for="product in products" 
                            :key="product.id"
                            class="hover:bg-slate-50/50 dark:hover:bg-zinc-800/10 transition-colors"
                        >
                            <td class="px-6 py-4 font-semibold text-foreground">{{ product.name }}</td>
                            <td class="px-6 py-4 text-muted-foreground">{{ product.category }}</td>
                            <td class="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{{ product.price }}</td>
                            <td class="px-6 py-4 font-medium">{{ product.stock }} pcs</td>
                            <td class="px-6 py-4">
                                <span 
                                    :class="[
                                        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide border',
                                        product.status === 'in-stock' 
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                                            : product.status === 'low-stock'
                                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                    ]"
                                >
                                    {{ 
                                        product.status === 'in-stock' 
                                            ? 'Stok Tersedia' 
                                            : product.status === 'low-stock' 
                                                ? 'Hampir Habis' 
                                                : 'Stok Habis' 
                                    }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="inline-flex gap-2 justify-end">
                                    <button class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-indigo-600 transition-colors">
                                        <Edit class="h-4 w-4" />
                                    </button>
                                    <button class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-rose-600 transition-colors">
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
</template>
