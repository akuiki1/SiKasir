<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import AppContent from '@/components/AppContent.vue';
import AppShell from '@/components/AppShell.vue';
import AppSidebar from '@/components/AppSidebar.vue';
import AppSidebarHeader from '@/components/AppSidebarHeader.vue';
import KasirBottomNav from '@/components/KasirBottomNav.vue';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const page = usePage();
const isKasir = computed(() => page.props.auth.user?.role !== 'admin');

// Beri ruang di bawah konten agar tidak tertutup Bottom Navigation (mobile kasir).
const contentClass = computed(() =>
    isKasir.value ? 'overflow-x-hidden pb-20 md:pb-0' : 'overflow-x-hidden',
);
</script>

<template>
    <AppShell variant="sidebar">
        <AppSidebar />
        <AppContent variant="sidebar" :class="contentClass">
            <AppSidebarHeader :breadcrumbs="breadcrumbs" />
            <slot />
        </AppContent>
        <!-- Bottom navigation khusus kasir (hanya tampil di mobile). -->
        <KasirBottomNav v-if="isKasir" />
        <Toaster />
    </AppShell>
</template>
