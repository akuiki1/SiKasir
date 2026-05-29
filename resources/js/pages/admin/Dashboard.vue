<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { 
    TrendingUp, 
    Users, 
    Package, 
    ArrowUpRight, 
    ArrowDownRight, 
    Activity, 
    DollarSign,
    ShoppingCart
} from 'lucide-vue-next';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Admin Dashboard',
                href: '/admin/dashboard',
            },
        ],
    },
});

// Mock statistics for standard UI demo
const stats = [
    {
        name: 'Pendapatan Hari Ini',
        value: 'Rp 8.420.000',
        change: '+12.5%',
        trend: 'up',
        icon: DollarSign,
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    {
        name: 'Kasir Aktif',
        value: '4 Orang',
        change: 'Sesi Aktif',
        trend: 'neutral',
        icon: Users,
        color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    {
        name: 'Produk Terjual',
        value: '312 Items',
        change: '+8.2%',
        trend: 'up',
        icon: ShoppingCart,
        color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20'
    },
];

// Mock recent activities
const recentActivities = [
    { id: 1, user: 'Kasir Ahmad', action: 'Melakukan transaksi #TRX-1029', time: '5 menit yang lalu', amount: 'Rp 450.000' },
    { id: 2, user: 'Kasir Rina', action: 'Membuka sesi kasir baru', time: '12 menit yang lalu', amount: null },
    { id: 3, user: 'Sistem', action: 'Stok menipis pada produk "Kopi Susu Gula Aren"', time: '30 menit yang lalu', amount: null },
    { id: 4, user: 'Kasir Ahmad', action: 'Melakukan transaksi #TRX-1028', time: '45 menit yang lalu', amount: 'Rp 1.200.000' },
];
</script>

<template>
    <Head title="Admin Dashboard" />

    <div class="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
        <!-- Welcoming Section -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white shadow-xl dark:from-zinc-950 dark:to-neutral-900 border border-white/10">
            <div class="relative z-10 flex flex-col gap-2">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-medium text-indigo-300 border border-indigo-500/30 w-fit">
                    <Activity class="h-3.5 w-3.5 animate-pulse" />
                    Admin Mode
                </span>
                <h1 class="text-3xl font-extrabold tracking-tight">Selamat Datang, Administrator!</h1>
                <p class="text-slate-300 max-w-xl">
                    Pantau kinerja kasir, kelola stok barang, dan analisa pendapatan harian toko Anda langsung dari panel kontrol utama.
                </p>
            </div>
            <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"></div>
            <div class="absolute right-20 bottom-0 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl"></div>
        </div>

        <!-- Stats Grid -->
        <div class="grid gap-4 md:grid-cols-3">
            <div 
                v-for="stat in stats" 
                :key="stat.name"
                class="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-sidebar-border"
            >
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-muted-foreground">{{ stat.name }}</span>
                    <div :class="['rounded-lg p-2 border', stat.color]">
                        <component :is="stat.icon" class="h-5 w-5" />
                    </div>
                </div>
                <div class="mt-4 flex items-baseline gap-2">
                    <span class="text-2xl font-bold tracking-tight">{{ stat.value }}</span>
                    <span 
                        v-if="stat.trend === 'up'" 
                        class="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                    >
                        <ArrowUpRight class="h-3 w-3" />
                        {{ stat.change }}
                    </span>
                    <span 
                        v-else 
                        class="text-xs font-medium text-muted-foreground"
                    >
                        {{ stat.change }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Main Panel: Activity Log & Quick Access -->
        <div class="grid gap-6 md:grid-cols-3">
            <!-- Left Side: Recent Activity Log -->
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 md:col-span-2 dark:border-sidebar-border">
                <div class="flex items-center justify-between border-b border-sidebar-border/70 pb-4 mb-4 dark:border-sidebar-border">
                    <div>
                        <h2 class="text-lg font-bold tracking-tight">Log Aktivitas Kasir</h2>
                        <p class="text-xs text-muted-foreground">Aktifitas terbaru yang terjadi hari ini</p>
                    </div>
                    <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium">
                        Live Update
                    </span>
                </div>

                <div class="space-y-4">
                    <div 
                        v-for="activity in recentActivities" 
                        :key="activity.id"
                        class="flex items-center justify-between rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                        <div class="flex items-center gap-3">
                            <div class="h-2 w-2 rounded-full bg-indigo-500"></div>
                            <div>
                                <p class="text-sm font-semibold">{{ activity.user }}</p>
                                <p class="text-xs text-muted-foreground">{{ activity.action }}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ activity.amount }}</p>
                            <p class="text-xs text-muted-foreground">{{ activity.time }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Side: Administrator Quick Actions -->
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                <h2 class="text-lg font-bold tracking-tight border-b border-sidebar-border/70 pb-4 mb-4 dark:border-sidebar-border">Aksi Cepat</h2>
                <div class="space-y-3">
                    <button class="w-full flex items-center justify-between rounded-lg border border-sidebar-border/70 p-3 text-left hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all">
                        <div>
                            <p class="text-sm font-semibold">Kelola Produk</p>
                            <p class="text-xs text-muted-foreground">Tambah, ubah, atau hapus produk</p>
                        </div>
                        <span class="text-xs font-bold text-indigo-500">Buka →</span>
                    </button>
                    <button class="w-full flex items-center justify-between rounded-lg border border-sidebar-border/70 p-3 text-left hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all">
                        <div>
                            <p class="text-sm font-semibold">Laporan Penjualan</p>
                            <p class="text-xs text-muted-foreground">Unduh laporan bulanan PDF / Excel</p>
                        </div>
                        <span class="text-xs font-bold text-indigo-500">Unduh →</span>
                    </button>
                    <button class="w-full flex items-center justify-between rounded-lg border border-sidebar-border/70 p-3 text-left hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all">
                        <div>
                            <p class="text-sm font-semibold">Kelola Akun Kasir</p>
                            <p class="text-xs text-muted-foreground">Atur hak akses staf kasir</p>
                        </div>
                        <span class="text-xs font-bold text-indigo-500">Kelola →</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
