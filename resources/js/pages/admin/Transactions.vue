<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { 
    Search, 
    Filter, 
    Calendar,
    DollarSign, 
    ShoppingCart, 
    FileText,
    ArrowUpRight
} from 'lucide-vue-next';

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

// Mock transactions data
const transactions = [
    { id: 'TRX-1029', cashier: 'Ahmad Kasir', items: '3 items', total: 'Rp 450.000', method: 'Qris', status: 'success', time: '10:15 WIB' },
    { id: 'TRX-1028', cashier: 'Ahmad Kasir', items: '8 items', total: 'Rp 1.200.000', method: 'Tunai', status: 'success', time: '09:42 WIB' },
    { id: 'TRX-1027', cashier: 'Rina Kasir', items: '2 items', total: 'Rp 88.000', method: 'Qris', status: 'success', time: '08:10 WIB' },
    { id: 'TRX-1026', cashier: 'Rina Kasir', items: '4 items', total: 'Rp 165.000', method: 'Debit', status: 'failed', time: 'Kemarin' },
];
</script>

<template>
    <Head title="Data Transaksi - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <!-- Header Section -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">Manajemen Transaksi</h1>
                <p class="text-sm text-muted-foreground mt-1">
                    Pantau riwayat seluruh transaksi penjualan, status pembayaran, serta metode pembayaran kasir.
                </p>
            </div>
            
            <button class="inline-flex items-center justify-center gap-2 rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800/40 dark:border-sidebar-border cursor-pointer">
                <Calendar class="h-4 w-4" />
                Pilih Periode
            </button>
        </div>

        <!-- Stats Row -->
        <div class="grid gap-4 md:grid-cols-3">
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border flex items-center gap-4 shadow-sm">
                <div class="rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <DollarSign class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Penjualan Hari Ini</span>
                    <h3 class="text-xl font-bold mt-0.5">Rp 1.738.000</h3>
                </div>
            </div>
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border flex items-center gap-4 shadow-sm">
                <div class="rounded-lg bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <ShoppingCart class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Transaksi Sukses</span>
                    <h3 class="text-xl font-bold mt-0.5">3 Transaksi</h3>
                </div>
            </div>
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border flex items-center gap-4 shadow-sm">
                <div class="rounded-lg bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <ArrowUpRight class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Rata-rata Pembelian</span>
                    <h3 class="text-xl font-bold mt-0.5">Rp 579.333</h3>
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
                        placeholder="Cari transaksi berdasarkan ID atau kasir..." 
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background pl-9 pr-4 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
                
                <div class="flex gap-2">
                    <button class="inline-flex items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800/40 dark:border-sidebar-border">
                        <Filter class="h-4 w-4" />
                        Metode Bayar
                    </button>
                </div>
            </div>

            <!-- Responsive Table -->
            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:bg-zinc-800/20 dark:border-sidebar-border">
                            <th class="px-6 py-4 font-semibold text-muted-foreground">ID Transaksi</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Kasir</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Jumlah Barang</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Total Belanja</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Metode</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Waktu</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground text-right">Detail</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        <tr 
                            v-for="trx in transactions" 
                            :key="trx.id"
                            class="hover:bg-slate-50/50 dark:hover:bg-zinc-800/10 transition-colors"
                        >
                            <td class="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ trx.id }}</td>
                            <td class="px-6 py-4 font-semibold text-foreground">{{ trx.cashier }}</td>
                            <td class="px-6 py-4 text-muted-foreground">{{ trx.items }}</td>
                            <td class="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{{ trx.total }}</td>
                            <td class="px-6 py-4 text-muted-foreground">{{ trx.method }}</td>
                            <td class="px-6 py-4">
                                <span 
                                    :class="[
                                        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide border',
                                        trx.status === 'success' 
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                    ]"
                                >
                                    {{ trx.status === 'success' ? 'Sukses' : 'Gagal' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">{{ trx.time }}</td>
                            <td class="px-6 py-4 text-right">
                                <button class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-indigo-600 transition-colors">
                                    <FileText class="h-4 w-4" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
