<script setup lang="ts">
import { Check, ChevronDown, Search, X } from 'lucide-vue-next';
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { formatRupiah } from '@/lib/format';

// Pemilih produk berbasis pencarian (menggantikan <select> panjang) untuk modal
// transaksi admin. Memfilter di sisi klien dari daftar produk yang sudah dimuat —
// cukup ringan karena jumlah produk toko masih wajar dan sudah ada di props halaman.

interface PickerProduk {
    id_produk: number;
    nama: string;
    harga_jual: number;
    stok: number;
}

const props = withDefaults(
    defineProps<{
        modelValue: string;
        products: PickerProduk[];
        invalid?: boolean;
        placeholder?: string;
    }>(),
    {
        invalid: false,
        placeholder: 'Cari produk…',
    },
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const rootRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const query = ref('');
const open = ref(false);
const highlighted = ref(0);

const selected = computed(
    () =>
        props.products.find((p) => p.id_produk === Number(props.modelValue)) ??
        null,
);

// Saat produk terpilih dari luar (mis. mode edit), tampilkan namanya di kolom.
watch(
    selected,
    (produk) => {
        if (!open.value) {
            query.value = produk?.nama ?? '';
        }
    },
    { immediate: true },
);

const filtered = computed(() => {
    const q = query.value.toLowerCase().trim();

    // Query sama persis dengan produk terpilih = anggap "belum menyaring" → tampilkan semua.
    if (!q || (selected.value && q === selected.value.nama.toLowerCase())) {
        return props.products;
    }

    return props.products.filter((p) => p.nama.toLowerCase().includes(q));
});

function openDropdown(): void {
    open.value = true;
    const idx = filtered.value.findIndex(
        (p) => p.id_produk === selected.value?.id_produk,
    );
    highlighted.value = idx >= 0 ? idx : 0;
}

function onFocus(): void {
    openDropdown();
    nextTick(() => inputRef.value?.select());
}

function onInput(): void {
    open.value = true;
    highlighted.value = 0;
}

function pick(produk: PickerProduk): void {
    emit('update:modelValue', String(produk.id_produk));
    query.value = produk.nama;
    open.value = false;
}

function clearSelection(): void {
    emit('update:modelValue', '');
    query.value = '';
    open.value = true;
    nextTick(() => inputRef.value?.focus());
}

function closeAndRevert(): void {
    open.value = false;
    query.value = selected.value?.nama ?? '';
}

function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
        event.preventDefault();

        if (!open.value) {
            openDropdown();

            return;
        }

        highlighted.value = Math.min(
            highlighted.value + 1,
            filtered.value.length - 1,
        );
        scrollHighlightedIntoView();
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        highlighted.value = Math.max(highlighted.value - 1, 0);
        scrollHighlightedIntoView();
    } else if (event.key === 'Enter') {
        if (open.value && filtered.value[highlighted.value]) {
            event.preventDefault();
            pick(filtered.value[highlighted.value]);
        }
    } else if (event.key === 'Escape') {
        if (open.value) {
            event.preventDefault();
            closeAndRevert();
        }
    }
}

const listRef = ref<HTMLElement | null>(null);

function scrollHighlightedIntoView(): void {
    nextTick(() => {
        const el = listRef.value?.children[highlighted.value] as
            | HTMLElement
            | undefined;
        el?.scrollIntoView({ block: 'nearest' });
    });
}

function onClickOutside(event: MouseEvent): void {
    if (
        open.value &&
        rootRef.value &&
        !rootRef.value.contains(event.target as Node)
    ) {
        closeAndRevert();
    }
}

if (typeof document !== 'undefined') {
    // Dipasang di setiap instance; ringan dan otomatis dilepas saat komponen di-unmount.
    document.addEventListener('mousedown', onClickOutside);
}

onBeforeUnmount(() => {
    if (typeof document !== 'undefined') {
        document.removeEventListener('mousedown', onClickOutside);
    }
});
</script>

<template>
    <div ref="rootRef" class="relative">
        <div class="relative">
            <Search
                class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
                ref="inputRef"
                v-model="query"
                type="text"
                :placeholder="placeholder"
                autocomplete="off"
                role="combobox"
                :aria-expanded="open"
                class="w-full rounded-lg border bg-background py-2 pr-16 pl-9 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                :class="
                    invalid ? 'border-rose-500' : 'border-sidebar-border/70'
                "
                @focus="onFocus"
                @input="onInput"
                @keydown="onKeydown"
            />
            <div
                class="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1"
            >
                <button
                    v-if="selected"
                    type="button"
                    class="rounded p-0.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                    aria-label="Kosongkan pilihan"
                    @click="clearSelection"
                >
                    <X class="h-3.5 w-3.5" />
                </button>
                <ChevronDown
                    class="h-4 w-4 text-muted-foreground transition-transform"
                    :class="{ 'rotate-180': open }"
                />
            </div>
        </div>

        <!-- Harga & stok produk terpilih (ringkas, di bawah kolom) -->
        <p
            v-if="selected && !open"
            class="mt-1 pl-1 text-xs text-muted-foreground"
        >
            {{ formatRupiah(selected.harga_jual) }} · stok
            <span
                :class="selected.stok <= 0 ? 'font-semibold text-rose-600' : ''"
                >{{ selected.stok }}</span
            >
        </p>

        <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="scale-95 opacity-0"
            enter-to-class="scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="scale-100 opacity-100"
            leave-to-class="scale-95 opacity-0"
        >
            <div
                v-if="open"
                class="absolute z-40 mt-1 max-h-60 w-full origin-top overflow-y-auto rounded-lg border border-sidebar-border/70 bg-card py-1 shadow-xl dark:border-sidebar-border"
            >
                <p
                    v-if="filtered.length === 0"
                    class="px-3 py-4 text-center text-xs text-muted-foreground"
                >
                    Produk tidak ditemukan.
                </p>
                <ul ref="listRef" role="listbox">
                    <li
                        v-for="(produk, index) in filtered"
                        :key="produk.id_produk"
                        role="option"
                        :aria-selected="
                            produk.id_produk === selected?.id_produk
                        "
                        class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors"
                        :class="
                            index === highlighted
                                ? 'bg-indigo-50 dark:bg-indigo-500/10'
                                : 'hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                        "
                        @mousedown.prevent="pick(produk)"
                        @mouseenter="highlighted = index"
                    >
                        <Check
                            class="h-3.5 w-3.5 shrink-0"
                            :class="
                                produk.id_produk === selected?.id_produk
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'invisible'
                            "
                        />
                        <span class="flex-1 truncate font-medium">{{
                            produk.nama
                        }}</span>
                        <span class="shrink-0 text-xs text-muted-foreground">{{
                            formatRupiah(produk.harga_jual)
                        }}</span>
                        <span
                            class="w-16 shrink-0 text-right text-xs"
                            :class="
                                produk.stok <= 0
                                    ? 'font-semibold text-rose-500'
                                    : 'text-muted-foreground'
                            "
                            >stok {{ produk.stok }}</span
                        >
                    </li>
                </ul>
            </div>
        </Transition>
    </div>
</template>
