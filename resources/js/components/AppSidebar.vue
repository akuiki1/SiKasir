<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { LayoutGrid, Users, Package, ShoppingCart, History, DollarSign, Tag, Tags, Factory, Contact, Warehouse, Wallet, TrendingUp, UsersRound } from 'lucide-vue-next';
import { computed } from 'vue';
import AppLogo from '@/components/AppLogo.vue';
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
import type { NavGroup } from '@/types';

const page = usePage();
const user = computed(() => page.props.auth.user);

const roleLabel = computed(() =>
    user.value?.role === 'admin' ? 'Panel Admin' : 'Mode Kasir',
);

const mainNavGroups = computed<NavGroup[]>(() => {
    const role = user.value?.role;

    if (role === 'admin') {
        return [
            {
                label: 'Ringkasan',
                items: [
                    {
                        title: 'Dashboard',
                        href: '/admin/dashboard',
                        icon: LayoutGrid,
                    },
                ],
            },
            {
                label: 'Penjualan',
                items: [
                    {
                        title: 'Data Transaksi',
                        href: '/admin/transactions',
                        icon: ShoppingCart,
                    },
                    {
                        title: 'Pelanggan',
                        href: '/admin/pelanggan',
                        icon: Contact,
                    },
                    {
                        title: 'Promo',
                        href: '/admin/promos',
                        icon: Tag,
                    },
                ],
            },
            {
                label: 'Produk & Stok',
                items: [
                    {
                        title: 'Kategori',
                        href: '/admin/kategori',
                        icon: Tags,
                    },
                    {
                        title: 'Data Produk',
                        href: '/admin/products',
                        icon: Package,
                    },
                    {
                        title: 'Manajemen Stok',
                        href: '/admin/stok',
                        icon: Warehouse,
                    },
                    {
                        title: 'Produksi',
                        href: '/admin/produksi',
                        icon: Factory,
                    },
                ],
            },
            {
                label: 'Keuangan',
                items: [
                    {
                        title: 'Pengeluaran',
                        href: '/admin/pengeluarans',
                        icon: DollarSign,
                    },
                ],
            },
            {
                label: 'Laporan & Analisis',
                items: [
                    {
                        title: 'Analisis Penjualan',
                        href: '/admin/laporan/penjualan',
                        icon: TrendingUp,
                    },
                    {
                        title: 'Analisis Keuangan',
                        href: '/admin/laporan/keuangan',
                        icon: Wallet,
                    },
                    {
                        title: 'Analisis Pelanggan',
                        href: '/admin/laporan/pelanggan',
                        icon: UsersRound,
                    },
                ],
            },
            {
                label: 'Pengaturan',
                items: [
                    {
                        title: 'Data User',
                        href: '/admin/users',
                        icon: Users,
                    },
                ],
            },
        ];
    }

    return [
        {
            label: 'Ringkasan',
            items: [
                {
                    title: 'Dashboard',
                    href: '/kasir/dashboard',
                    icon: LayoutGrid,
                },
            ],
        },
        {
            label: 'Penjualan',
            items: [
                {
                    title: 'Transaksi',
                    href: '/kasir/transaksi',
                    icon: ShoppingCart,
                },
            ],
        },
        {
            label: 'Riwayat',
            items: [
                {
                    title: 'Riwayat Transaksi',
                    href: '/kasir/riwayat',
                    icon: History,
                },
            ],
        },
    ];
});

</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader class="border-b border-sidebar-border/60 pb-2">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="user?.role === 'admin' ? '/admin/dashboard' : '/kasir/dashboard'">
                            <AppLogo :subtitle="roleLabel" />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent class="py-1">
            <NavMain :groups="mainNavGroups" />
        </SidebarContent>

        <SidebarFooter class="border-t border-sidebar-border/60 pt-2">
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
