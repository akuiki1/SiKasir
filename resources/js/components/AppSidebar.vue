<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { BookOpen, FolderGit2, LayoutGrid, Users, Package, ShoppingCart, History, DollarSign } from 'lucide-vue-next';
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

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/vue-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#vue',
        icon: BookOpen,
    },
];
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
