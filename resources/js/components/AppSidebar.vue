<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import AppLogo from '@/components/AppLogo.vue';
import NavMain from '@/components/NavMain.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { useNavMenu } from '@/composables/useNavMenu';

const page = usePage();
const user = computed(() => page.props.auth.user);

const { isAdmin, pinned, groups } = useNavMenu();

const roleLabel = computed(() =>
    isAdmin.value ? 'Panel Admin' : 'Mode Kasir',
);
</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader class="border-b border-sidebar-border/60 pb-2">
            <!-- Admin: tombol buka/tutup sidebar ditaruh di sini, di samping logo.
                 Saat menyempit jadi ikon, logo disembunyikan & toggle di tengah. -->
            <div class="flex items-center gap-1">
                <SidebarMenu
                    :class="
                        isAdmin
                            ? 'min-w-0 flex-1 group-data-[collapsible=icon]:hidden'
                            : ''
                    "
                >
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" as-child>
                            <Link
                                :href="
                                    user?.role === 'admin'
                                        ? '/admin/dashboard'
                                        : '/kasir/dashboard'
                                "
                            >
                                <AppLogo :subtitle="roleLabel" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarTrigger
                    v-if="isAdmin"
                    class="hidden shrink-0 text-sidebar-foreground/70 group-data-[collapsible=icon]:mx-auto hover:bg-sidebar-accent hover:text-sidebar-foreground md:flex"
                />
            </div>
        </SidebarHeader>

        <SidebarContent class="py-1">
            <NavMain :groups="groups" :pinned="pinned" :enhanced="isAdmin" />
        </SidebarContent>

        <!-- Akun (admin & kasir) ada di kanan atas header → sidebar tanpa footer. -->
    </Sidebar>
    <slot />
</template>
