<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { LayoutGrid, Users, Package, ShoppingCart, History, DollarSign, Tag, Tags, Factory, Contact, CreditCard } from 'lucide-vue-next';
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
import type { NavGroup, NavItem } from '@/types';

const page = usePage();
const user = computed(() => page.props.auth.user);

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
                        title: 'Produksi',
                        href: '/admin/produksi',
                        icon: Factory,
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
                {
                    title: 'Layanan / Jasa',
                    href: '/kasir/layanan',
                    icon: CreditCard,
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
            <NavMain :groups="mainNavGroups" />
        </SidebarContent>

        <SidebarFooter>
            <NavFooter :items="footerNavItems" />
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
