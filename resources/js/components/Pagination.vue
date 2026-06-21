<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

defineProps<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    startIndex: number;
    endIndex: number;
    perPage: number;
    visiblePages: number[];
}>();

const emit = defineEmits<{
    'update:currentPage': [value: number];
    'update:perPage': [value: number];
}>();

const perPageOptions = [5, 10, 25, 50, 100];
</script>

<template>
    <div
        class="flex flex-col gap-3 border-t border-sidebar-border/70 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between dark:border-sidebar-border"
    >
        <div class="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Tampilkan</span>
            <select
                :value="perPage"
                class="rounded-lg border border-sidebar-border/70 bg-background px-2 py-1 text-sm font-medium focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                @change="emit('update:perPage', Number(($event.target as HTMLSelectElement).value))"
            >
                <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
            <span>per halaman</span>
            <span v-if="totalItems > 0" class="hidden lg:inline">
                &mdash; Menampilkan {{ startIndex }}&ndash;{{ endIndex }} dari {{ totalItems }} data
            </span>
            <span v-else class="hidden lg:inline">&mdash; Tidak ada data</span>
        </div>

        <div class="flex items-center gap-1">
            <button
                :disabled="currentPage <= 1"
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-sidebar-border dark:hover:bg-zinc-800/40"
                @click="emit('update:currentPage', currentPage - 1)"
            >
                <ChevronLeft class="h-4 w-4" />
            </button>

            <template v-for="(pg, i) in visiblePages" :key="i">
                <span
                    v-if="pg === -1"
                    class="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
                >
                    &hellip;
                </span>
                <button
                    v-else
                    :class="[
                        'flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-medium transition-colors',
                        pg === currentPage
                            ? 'border-indigo-500 bg-indigo-600 text-white'
                            : 'border-sidebar-border/70 bg-background hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40',
                    ]"
                    @click="emit('update:currentPage', pg)"
                >
                    {{ pg }}
                </button>
            </template>

            <button
                :disabled="currentPage >= totalPages"
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-sidebar-border dark:hover:bg-zinc-800/40"
                @click="emit('update:currentPage', currentPage + 1)"
            >
                <ChevronRight class="h-4 w-4" />
            </button>
        </div>
    </div>
</template>
