import { usePage } from '@inertiajs/vue3';
import {
    BadgePercent,
    Boxes,
    CircleDollarSign,
    ClipboardList,
    ContactRound,
    Factory,
    History,
    LayoutGrid,
    Package,
    ReceiptText,
    ShoppingCart,
    Tags,
    TrendingUp,
    UserCog,
    UsersRound,
    Wallet,
    Warehouse,
} from 'lucide-vue-next';
import { computed } from 'vue';
import type { NavBadge, NavGroup, NavItem } from '@/types';

/** Satu hasil pencarian menu: item + label grup asalnya (untuk konteks di palette). */
export type NavSearchEntry = {
    item: NavItem;
    group: string;
};

/**
 * Sumber tunggal definisi menu navigasi (admin & kasir). Dipakai oleh sidebar
 * (AppSidebar/NavMain) dan command-palette di header (MenuSearch) agar tidak ganda.
 */
export function useNavMenu() {
    const page = usePage();
    const user = computed(() => page.props.auth.user);
    const isAdmin = computed(() => user.value?.role === 'admin');

    // Dashboard disematkan di atas (di luar grup) untuk admin.
    const pinned = computed<NavItem | undefined>(() =>
        isAdmin.value
            ? { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid }
            : undefined,
    );

    const groups = computed<NavGroup[]>(() => {
        if (isAdmin.value) {
            // Badge dari shared props (lihat HandleInertiaRequests); tampil bila > 0.
            const b = page.props.sidebarBadges;
            const pesananBadge: NavBadge | undefined =
                b && b.pesananAktif > 0
                    ? { count: b.pesananAktif, tone: 'order' }
                    : undefined;
            const stokBadge: NavBadge | undefined =
                b && b.stokMenipis > 0
                    ? { count: b.stokMenipis, tone: 'warn' }
                    : undefined;

            return [
                {
                    label: 'Penjualan',
                    items: [
                        {
                            title: 'Data Transaksi',
                            href: '/admin/transactions',
                            icon: ReceiptText,
                        },
                        {
                            title: 'Pesanan Online',
                            href: '/admin/pesanan',
                            icon: ClipboardList,
                            badge: pesananBadge,
                        },
                        {
                            title: 'Pelanggan',
                            href: '/admin/pelanggan',
                            icon: ContactRound,
                        },
                        {
                            title: 'Promo',
                            href: '/admin/promos',
                            icon: BadgePercent,
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
                            badge: stokBadge,
                        },
                        {
                            title: 'Produksi',
                            href: '/admin/produksi',
                            icon: Factory,
                        },
                    ],
                },
                {
                    // Pencatatan uang keluar — fungsinya "input", bukan "laporan",
                    // jadi dipisah dari grup analisis di bawah.
                    label: 'Keuangan',
                    items: [
                        {
                            title: 'Pengeluaran',
                            href: '/admin/pengeluarans',
                            icon: CircleDollarSign,
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
                            title: 'Stok & Inventaris',
                            href: '/admin/laporan/inventaris',
                            icon: Boxes,
                        },
                        {
                            title: 'Laporan Keuangan',
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
                    label: 'Sistem',
                    items: [
                        {
                            title: 'Data User',
                            href: '/admin/users',
                            icon: UserCog,
                        },
                    ],
                },
            ];
        }

        // Kasir hanya punya sedikit menu — tampilkan datar tanpa label kategori.
        return [
            {
                label: '',
                items: [
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
                        title: 'Pesanan Online',
                        href: '/kasir/pesanan',
                        icon: ClipboardList,
                    },
                    {
                        title: 'Riwayat Transaksi',
                        href: '/kasir/riwayat',
                        icon: History,
                    },
                ],
            },
        ];
    });

    // Daftar datar (pinned + semua item grup) untuk dicari di command-palette.
    const searchEntries = computed<NavSearchEntry[]>(() => {
        const entries: NavSearchEntry[] = [];

        if (pinned.value) {
            entries.push({ item: pinned.value, group: '' });
        }

        groups.value.forEach((g) => {
            g.items.forEach((item) => entries.push({ item, group: g.label }));
        });

        return entries;
    });

    return { isAdmin, pinned, groups, searchEntries };
}
