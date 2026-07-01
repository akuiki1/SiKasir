<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { Search, X } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useNavMenu } from '@/composables/useNavMenu';
import type { NavSearchEntry } from '@/composables/useNavMenu';
import { toUrl } from '@/lib/utils';

const { searchEntries } = useNavMenu();

const query = ref('');
const open = ref(false);
const activeIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);

const q = computed(() => query.value.trim().toLowerCase());

const results = computed<NavSearchEntry[]>(() =>
    q.value.length === 0
        ? []
        : searchEntries.value
              .filter((e) => e.item.title.toLowerCase().includes(q.value))
              .slice(0, 10),
);

const showDropdown = computed(() => open.value && q.value.length > 0);

watch(q, () => {
    activeIndex.value = 0;

    if (q.value.length > 0) {
        open.value = true;
    }
});

function go(entry: NavSearchEntry | undefined) {
    if (!entry) {
        return;
    }

    router.visit(toUrl(entry.item.href));
    query.value = '';
    open.value = false;
    inputRef.value?.blur();
}
function clear() {
    query.value = '';
    inputRef.value?.focus();
}
function onInputKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex.value = Math.min(
            results.value.length - 1,
            activeIndex.value + 1,
        );
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex.value = Math.max(0, activeIndex.value - 1);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        go(results.value[activeIndex.value]);
    } else if (e.key === 'Escape') {
        e.preventDefault();
        query.value = '';
        open.value = false;
        inputRef.value?.blur();
    }
}

// Pintasan ⌘K / Ctrl+K untuk fokus ke pencarian dari mana saja.
function onGlobalKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        inputRef.value?.focus();
        open.value = true;
    }
}
onMounted(() => window.addEventListener('keydown', onGlobalKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKeydown));
</script>

<template>
    <div class="relative w-full max-w-sm">
        <Search
            class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
            ref="inputRef"
            v-model="query"
            type="text"
            role="combobox"
            aria-label="Cari menu"
            aria-controls="menu-search-results"
            :aria-expanded="showDropdown"
            placeholder="Cari menu..."
            autocomplete="off"
            class="h-9 w-full rounded-lg border border-input bg-background pr-12 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            @focus="open = true"
            @blur="open = false"
            @keydown="onInputKeydown"
        />
        <kbd
            v-if="!query"
            class="pointer-events-none absolute top-1/2 right-2.5 inline-flex h-5 -translate-y-1/2 items-center rounded border border-input bg-muted px-1.5 text-[11px] text-muted-foreground"
        >
            ⌘K
        </kbd>
        <button
            v-else
            type="button"
            aria-label="Bersihkan pencarian"
            class="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            @mousedown.prevent
            @click="clear"
        >
            <X class="size-3.5" />
        </button>

        <!-- Dropdown hasil (command-palette). mousedown.prevent agar klik tidak
             memicu blur sebelum navigasi. -->
        <div
            v-if="showDropdown"
            id="menu-search-results"
            role="listbox"
            class="absolute top-[calc(100%+6px)] right-0 left-0 z-50 max-h-[60vh] overflow-auto rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg"
        >
            <button
                v-for="(entry, i) in results"
                :key="entry.item.title"
                type="button"
                role="option"
                :aria-selected="i === activeIndex"
                class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors"
                :class="
                    i === activeIndex
                        ? 'bg-accent text-accent-foreground'
                        : 'text-foreground'
                "
                @mousedown.prevent
                @mouseenter="activeIndex = i"
                @click="go(entry)"
            >
                <component
                    :is="entry.item.icon"
                    class="size-4 shrink-0 text-muted-foreground"
                />
                <span class="flex-1 truncate">{{ entry.item.title }}</span>
                <span
                    v-if="entry.group"
                    class="shrink-0 text-xs text-muted-foreground"
                >
                    {{ entry.group }}
                </span>
            </button>

            <div
                v-if="results.length === 0"
                class="px-2.5 py-6 text-center text-sm text-muted-foreground"
            >
                Tidak ada menu yang cocok.
            </div>
        </div>
    </div>
</template>
