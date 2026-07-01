import type { InertiaLinkProps } from '@inertiajs/vue3';
import type { LucideIcon } from 'lucide-vue-next';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

/** Badge angka di item nav. `order` = aksen (pesanan), `warn` = amber (stok menipis). */
export type NavBadge = {
    count: number;
    tone: 'order' | 'warn';
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon;
    isActive?: boolean;
    /** Render sebagai aksi utama yang ditonjolkan (primary CTA). */
    highlight?: boolean;
    /** Badge hitungan (mis. pesanan aktif / stok menipis). */
    badge?: NavBadge;
};

export type NavGroup = {
    label: string;
    items: NavItem[];
};
