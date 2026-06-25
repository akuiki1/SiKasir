<script setup lang="ts">
// Hub "Catat" — satu pintu masuk yang memandu admin awam memilih APA yang ingin
// dicatat, lalu mengarahkannya ke halaman yang tepat (sekaligus membuka formnya
// lewat query ?aksi=). Tujuannya menghapus kebingungan "halaman ini buat apa".
import { Link } from '@inertiajs/vue3';
import { ChefHat, PackagePlus, Plus, Wallet, X } from 'lucide-vue-next';
import { ref } from 'vue';
import BodyTeleport from '@/components/BodyTeleport.vue';

const open = ref(false);

const choices = [
    {
        href: '/admin/produksi?aksi=tambah',
        icon: ChefHat,
        title: 'Bikin barang sendiri',
        desc: 'Catat batch produksi + biaya bahannya. Stok barang jadi bertambah otomatis.',
        tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
        href: '/admin/stok?aksi=masuk',
        icon: PackagePlus,
        title: 'Barang datang dari supplier',
        desc: 'Catat stok masuk untuk barang yang dibeli jadi (restock).',
        tone: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    },
    {
        href: '/admin/pengeluarans?aksi=tambah',
        icon: Wallet,
        title: 'Bayar biaya operasional',
        desc: 'Catat pengeluaran seperti gaji, sewa, listrik, transportasi.',
        tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
];
</script>

<template>
    <button
        type="button"
        class="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
        @click="open = true"
    >
        <Plus class="h-4 w-4" />
        <span class="hidden sm:inline">Catat</span>
    </button>

    <BodyTeleport>
        <div
            v-if="open"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            @click.self="open = false"
        >
            <div
                class="w-full max-w-md rounded-2xl border border-sidebar-border/70 bg-card p-5 shadow-2xl dark:border-sidebar-border"
            >
                <div class="mb-4 flex items-start justify-between">
                    <div>
                        <h2 class="text-lg font-bold">Apa yang ingin dicatat?</h2>
                        <p class="mt-0.5 text-xs text-muted-foreground">
                            Pilih salah satu, kami arahkan ke tempat yang tepat.
                        </p>
                    </div>
                    <button
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                        aria-label="Tutup"
                        @click="open = false"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <div class="flex flex-col gap-2">
                    <Link
                        v-for="choice in choices"
                        :key="choice.href"
                        :href="choice.href"
                        class="flex items-start gap-3 rounded-xl border border-sidebar-border/70 bg-background p-3 text-left transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/5 dark:border-sidebar-border"
                        @click="open = false"
                    >
                        <div
                            :class="[
                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                                choice.tone,
                            ]"
                        >
                            <component :is="choice.icon" class="h-5 w-5" />
                        </div>
                        <div class="min-w-0">
                            <p class="text-sm font-semibold">
                                {{ choice.title }}
                            </p>
                            <p class="mt-0.5 text-xs text-muted-foreground">
                                {{ choice.desc }}
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </BodyTeleport>
</template>
