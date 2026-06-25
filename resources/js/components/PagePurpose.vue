<script setup lang="ts">
// Banner "halaman ini untuk apa" — penjelas singkat di atas halaman yang mudah
// tertukar (Stok / Produksi / Pengeluaran). Membantu orang awam langsung paham
// fungsi halaman + ke mana harus pergi untuk hal yang mirip.
import { Link } from '@inertiajs/vue3';
import type { LucideIcon } from 'lucide-vue-next';

type Tone = 'indigo' | 'emerald' | 'amber' | 'sky';

interface CrossLink {
    label: string;
    href: string;
    icon?: LucideIcon;
}

withDefaults(
    defineProps<{
        icon: LucideIcon;
        title: string;
        description: string;
        tone?: Tone;
        // "Bukan di sini? →" tautan ke halaman lain yang mirip.
        links?: CrossLink[];
    }>(),
    { tone: 'indigo', links: () => [] },
);

const toneClass: Record<Tone, { wrap: string; icon: string }> = {
    indigo: {
        wrap: 'border-indigo-500/20 bg-indigo-500/5',
        icon: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    emerald: {
        wrap: 'border-emerald-500/20 bg-emerald-500/5',
        icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    amber: {
        wrap: 'border-amber-500/20 bg-amber-500/5',
        icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    sky: {
        wrap: 'border-sky-500/20 bg-sky-500/5',
        icon: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    },
};
</script>

<template>
    <div
        :class="[
            'flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center',
            toneClass[tone].wrap,
        ]"
    >
        <div class="flex items-start gap-3">
            <div
                :class="[
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                    toneClass[tone].icon,
                ]"
            >
                <component :is="icon" class="h-5 w-5" />
            </div>
            <div>
                <p class="text-sm font-semibold">{{ title }}</p>
                <p class="mt-0.5 text-sm text-muted-foreground">
                    {{ description }}
                </p>
            </div>
        </div>

        <div
            v-if="links.length > 0"
            class="flex flex-wrap items-center gap-2 sm:ml-auto sm:shrink-0"
        >
            <span class="text-xs text-muted-foreground">Bukan di sini?</span>
            <Link
                v-for="link in links"
                :key="link.href"
                :href="link.href"
                class="inline-flex items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800"
            >
                <component :is="link.icon" v-if="link.icon" class="h-3.5 w-3.5" />
                {{ link.label }}
            </Link>
        </div>
    </div>
</template>
