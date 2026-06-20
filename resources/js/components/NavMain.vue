<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { toUrl } from '@/lib/utils';
import type { NavGroup, NavItem } from '@/types';

defineProps<{
    groups: NavGroup[];
}>();

const { currentUrl } = useCurrentUrl();

// Aktif jika persis di halaman tsb. atau di salah satu sub-rute-nya
// (mis. /admin/products tetap aktif saat membuka /admin/products/5/edit).
function isActive(href: NavItem['href']): boolean {
    const path = toUrl(href);
    const current = currentUrl.value;

    return current === path || current.startsWith(`${path}/`);
}
</script>

<template>
    <SidebarGroup v-for="group in groups" :key="group.label" class="px-2 py-1">
        <SidebarGroupLabel
            v-if="group.label"
            class="px-2 text-[0.7rem] font-semibold tracking-wider text-sidebar-foreground/50 uppercase"
        >
            {{ group.label }}
        </SidebarGroupLabel>
        <SidebarMenu class="gap-0.5">
            <SidebarMenuItem v-for="item in group.items" :key="item.title">
                <!-- Aksi utama yang ditonjolkan (primary CTA) -->
                <SidebarMenuButton
                    v-if="item.highlight"
                    as-child
                    :is-active="isActive(item.href)"
                    :tooltip="item.title"
                    class="h-10 gap-3 rounded-lg bg-primary px-3 font-medium text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                >
                    <Link :href="item.href">
                        <component :is="item.icon" />
                        <span>{{ item.title }}</span>
                    </Link>
                </SidebarMenuButton>

                <!-- Item navigasi standar -->
                <SidebarMenuButton
                    v-else
                    as-child
                    :is-active="isActive(item.href)"
                    :tooltip="item.title"
                    :class="[
                        'relative h-10 gap-3 rounded-lg px-3 transition-colors',
                        isActive(item.href)
                            ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                    ]"
                >
                    <Link :href="item.href">
                        <!-- Indikator "kamu di sini" ala app besar (accent bar) -->
                        <span
                            v-if="isActive(item.href)"
                            class="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary group-data-[collapsible=icon]:hidden"
                        />
                        <component :is="item.icon" />
                        <span>{{ item.title }}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarGroup>
</template>
