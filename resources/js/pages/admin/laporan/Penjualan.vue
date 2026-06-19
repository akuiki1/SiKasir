<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { TrendingUp } from 'lucide-vue-next';
</script>

<template>
    <Head title="Analisis Penjualan - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <div>
            <h1 class="text-3xl font-extrabold tracking-tight">Analisis Penjualan</h1>
            <p class="mt-1 text-sm text-muted-foreground">
                Tren penjualan, produk terlaris, dan performa transaksi.
            </p>
        </div>

        <div class="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-sidebar-border/70 py-20 text-center dark:border-sidebar-border">
            <TrendingUp class="h-10 w-10 text-muted-foreground" />
            <p class="text-sm font-medium text-muted-foreground">Halaman analisis penjualan masih dalam pengembangan.</p>
        </div>
    </div>
</template>
