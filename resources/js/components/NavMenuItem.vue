<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import {
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

const props = defineProps<{
    item: NavItem;
}>();

const { currentUrl } = useCurrentUrl();

// Aktif jika persis di halaman tsb. atau di salah satu sub-rute-nya
// (mis. /admin/products tetap aktif saat membuka /admin/products/5/edit).
const active = computed(() => {
    const path = toUrl(props.item.href);
    const current = currentUrl.value;

    return current === path || current.startsWith(`${path}/`);
});

// Warna badge & titik (mode ikon) per tone.
const badgeClass = computed(() =>
    props.item.badge?.tone === 'warn'
        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
        : 'bg-primary text-primary-foreground',
);
const dotClass = computed(() =>
    props.item.badge?.tone === 'warn' ? 'bg-amber-500' : 'bg-primary',
);
</script>

<template>
    <SidebarMenuItem>
        <SidebarMenuButton
            as-child
            :is-active="active"
            :tooltip="item.title"
            :class="[
                'relative h-10 gap-3 rounded-lg px-3 transition-colors',
                active
                    ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
            ]"
        >
            <Link :href="item.href">
                <!-- Indikator "kamu di sini" (accent bar), disembunyikan di mode ikon. -->
                <span
                    v-if="active"
                    class="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary group-data-[collapsible=icon]:hidden"
                />
                <component :is="item.icon" />
                <span>{{ item.title }}</span>
            </Link>
        </SidebarMenuButton>

        <!-- Badge angka saat sidebar lebar. -->
        <SidebarMenuBadge
            v-if="item.badge"
            :class="[
                'min-w-5 justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums',
                badgeClass,
            ]"
        >
            {{ item.badge.count }}
        </SidebarMenuBadge>

        <!-- Titik penanda saat sidebar menyempit jadi ikon. -->
        <span
            v-if="item.badge"
            class="pointer-events-none absolute top-1.5 right-1.5 hidden size-2 rounded-full ring-2 ring-sidebar group-data-[collapsible=icon]:block"
            :class="dotClass"
        />
    </SidebarMenuItem>
</template>
