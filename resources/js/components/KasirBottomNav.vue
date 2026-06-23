<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ClipboardList, History, LayoutGrid, ShoppingCart } from 'lucide-vue-next';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

const items: NavItem[] = [
    { title: 'Dashboard', href: '/kasir/dashboard', icon: LayoutGrid },
    { title: 'Transaksi', href: '/kasir/transaksi', icon: ShoppingCart },
    { title: 'Pesanan', href: '/kasir/pesanan', icon: ClipboardList },
    { title: 'Riwayat', href: '/kasir/riwayat', icon: History },
];

const { currentUrl } = useCurrentUrl();

function isActive(href: NavItem['href']): boolean {
    const path = toUrl(href);

    return currentUrl.value === path || currentUrl.value.startsWith(`${path}/`);
}
</script>

<template>
    <nav
        class="fixed inset-x-0 bottom-0 z-50 border-t border-sidebar-border/70 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden"
        aria-label="Navigasi kasir"
    >
        <div class="mx-auto flex h-[3.75rem] max-w-md items-stretch justify-around">
            <Link
                v-for="item in items"
                :key="item.title"
                :href="item.href"
                :class="[
                    'group relative flex flex-1 flex-col items-center justify-center gap-1 text-[0.7rem] font-medium transition-colors',
                    isActive(item.href)
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground',
                ]"
            >
                <span
                    v-if="isActive(item.href)"
                    class="absolute top-0 h-0.5 w-8 rounded-full bg-primary"
                />
                <component
                    :is="item.icon"
                    :class="[
                        'size-5 transition-transform',
                        isActive(item.href)
                            ? 'scale-110'
                            : 'group-active:scale-95',
                    ]"
                />
                <span>{{ item.title }}</span>
            </Link>
        </div>
    </nav>
</template>
