<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
import { computed, reactive } from 'vue';
import NavMenuItem from '@/components/NavMenuItem.vue';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    useSidebar,
} from '@/components/ui/sidebar';
import type { NavGroup, NavItem } from '@/types';

defineProps<{
    groups: NavGroup[];
    /** Item yang disematkan di atas, di luar grup (mis. Dashboard). */
    pinned?: NavItem;
    /** Aktifkan fitur v2: grup bisa dilipat (kasir = false → label statis). */
    enhanced?: boolean;
}>();

const { state, isMobile } = useSidebar();

// Mode "rail" = sidebar menyempit jadi ikon di desktop. Di mode ini label
// disembunyikan (CSS) dan semua item ditampilkan tanpa peduli lipatan grup.
const railMode = computed(() => state.value === 'collapsed' && !isMobile.value);

// ── Lipat/buka grup (dipersist) ──────────────────────────────────────────────
const STORAGE_KEY = 'sikasir.sidebar.groups';
const openGroups = reactive<Record<string, boolean>>({});

if (typeof window !== 'undefined') {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (raw) {
            Object.assign(openGroups, JSON.parse(raw));
        }
    } catch {
        /* abaikan localStorage rusak */
    }
}

function isGroupOpen(label: string): boolean {
    if (railMode.value) {
        return true;
    }

    return openGroups[label] !== false;
}
function toggleGroup(label: string) {
    openGroups[label] = openGroups[label] === false ? true : false;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(openGroups));
    } catch {
        /* abaikan */
    }
}
</script>

<template>
    <!-- Item tersemat (Dashboard) di atas, tanpa label grup. -->
    <SidebarGroup v-if="pinned" class="px-2 py-1">
        <SidebarMenu class="gap-0.5">
            <NavMenuItem :item="pinned" />
        </SidebarMenu>
    </SidebarGroup>

    <SidebarGroup v-for="group in groups" :key="group.label" class="px-2 py-1">
        <!-- Label grup: tombol pelipat saat mode v2, label statis untuk kasir. -->
        <SidebarGroupLabel
            v-if="group.label && enhanced"
            as="button"
            type="button"
            class="w-full cursor-pointer justify-between px-2 text-[0.7rem] font-semibold tracking-wider text-sidebar-foreground/50 uppercase hover:text-sidebar-foreground"
            @click="toggleGroup(group.label)"
        >
            <span>{{ group.label }}</span>
            <ChevronRight
                class="size-3.5 transition-transform duration-200"
                :class="isGroupOpen(group.label) ? 'rotate-90' : ''"
            />
        </SidebarGroupLabel>
        <SidebarGroupLabel
            v-else-if="group.label"
            class="px-2 text-[0.7rem] font-semibold tracking-wider text-sidebar-foreground/50 uppercase"
        >
            {{ group.label }}
        </SidebarGroupLabel>

        <SidebarMenu v-show="isGroupOpen(group.label)" class="gap-0.5">
            <NavMenuItem
                v-for="item in group.items"
                :key="item.title"
                :item="item"
            />
        </SidebarMenu>
    </SidebarGroup>
</template>
