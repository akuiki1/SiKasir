<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { LayoutGrid, Users, Package, ShoppingCart, History, DollarSign, Tag } from 'lucide-vue-next';
import { computed } from 'vue';
import AppLogo from '@/components/AppLogo.vue';
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const page = usePage();
const user = computed(() => page.props.auth.user);

const mainNavItems = computed<NavItem[]>(() => {
    const role = user.value?.role;

    if (role === 'admin') {
        return [
            {
                title: 'Dashboard',
                href: '/admin/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Data User',
                href: '/admin/users',
                icon: Users,
            },
            {
                title: 'Kategori',
                href: '/admin/kategori',
                icon: Users,
            },
            {
                title: 'Data Produk',
                href: '/admin/products',
                icon: Package,
            },
            {
                title: 'Data Transaksi',
                href: '/admin/transactions',
                icon: ShoppingCart,
            },
            {
                title: 'Pengeluaran',
                href: '/admin/pengeluarans',
                icon: DollarSign,
            },
            {
                title: 'Promo',
                href: '/admin/promos',
                icon: Tag,
            },
        ];
    }

    return [
        {
            title: 'Dashboard',
            href: '/kasir/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Transaksi',
            href: '/kasir/transaksi',
            icon: ShoppingCart,
        },
        {
            title: 'Riwayat Transaksi',
            href: '/kasir/riwayat',
            icon: History,
        },
    ];
});

const footerNavItems: NavItem[] = [];

</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="user?.role === 'admin' ? '/admin/dashboard' : '/kasir/dashboard'">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter>
            <NavFooter :items="footerNavItems" />
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
