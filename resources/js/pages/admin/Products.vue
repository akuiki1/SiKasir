<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import {
    Plus,
    Search,
    Package,
    Layers,
    AlertTriangle,
    Edit,
    Trash2,
    X,
    Save,
    AlertCircle,
    ImageIcon,
} from 'lucide-vue-next';
import { ref, computed, watch } from 'vue';
import { store as productStore, update as productUpdate, destroy as productDestroy } from '@/routes/admin/products';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Data Produk',
                href: '/admin/products',
            },
        ],
    },
});

interface Kategori {
    id_kategori: number;
    nama_kategori: string;
}

interface Produk {
    id_produk: number;
    nama: string;
    kategori: string | null;
    id_kategori: number;
    harga_beli: number;
    harga_jual: number;
    stok: number;
    barcode: string;
    sku: string;
    foto: string | null;
    foto_url?: string | null;
    status_stok: 'in-stock' | 'low-stock' | 'out-of-stock';
}

interface Stats {
    total_produk: number;
    total_kategori: number;
    stok_bermasalah: number;
}

const props = defineProps<{
    produks: Produk[];
    kategoris: Kategori[];
    stats: Stats;
}>();

// Search & filter
const searchQuery = ref('');
const filterKategori = ref('');

const filteredProduks = computed(() => {
    return props.produks.filter((p) => {
        const matchSearch = !searchQuery.value || p.nama.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchKategori = !filterKategori.value || String(p.id_kategori) === filterKategori.value;

        return matchSearch && matchKategori;
    });
});

// Format rupiah
function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

function resolveFoto(foto: string | null): string | null {
    if (!foto) {
        return null;
    }

    if (foto.startsWith('http://') || foto.startsWith('https://') || foto.startsWith('/')) {
        return foto;
    }

    return `/storage/${foto}`;
}

// Modal
const showModal = ref(false);
const editingProduk = ref<Produk | null>(null);

const form = useForm({
    id_kategori: '',
    nama: '',
    foto: '',
    foto_upload: null as File | null,
    harga_beli: '',
    harga_jual: '',
    stok: '',
    barcode: '',
    sku: '',
});

const fotoUploadName = computed(() => form.foto_upload?.name ?? '');

function openTambah() {
    editingProduk.value = null;
    form.reset();
    form.foto_upload = null;
    showModal.value = true;
}

function openEdit(produk: Produk) {
    editingProduk.value = produk;
    form.id_kategori = String(produk.id_kategori);
    form.nama = produk.nama;
    form.foto = produk.foto ?? '';
    form.foto_upload = null;
    form.harga_beli = String(produk.harga_beli);
    form.harga_jual = String(produk.harga_jual);
    form.stok = String(produk.stok);
    form.barcode = produk.barcode;
    form.sku = produk.sku;
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
    form.reset();
    form.foto_upload = null;
    form.clearErrors();
}

function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    form.foto_upload = file;

    if (file) {
        form.foto = '';
    }
}


const lastGeneratedSku = ref('');

function generateSKUFromBarcode(barcode: string): string {
    const normalized = barcode
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 12);

    return normalized ? `SKU-${normalized}` : '';
}

watch(
    () => form.barcode,
    (barcode) => {
        const value = String(barcode || '').trim();
        const generated = generateSKUFromBarcode(value);

        if (!value) {
            lastGeneratedSku.value = '';

            return;
        }

        if (!form.sku || form.sku === lastGeneratedSku.value) {
            form.sku = generated;
            lastGeneratedSku.value = generated;
        }
    },
);

function submitForm() {
    const data = {
        ...form.data(),
        id_kategori: Number(form.id_kategori),
        foto: form.foto || null,
        harga_beli: Number(form.harga_beli),
        harga_jual: Number(form.harga_jual),
        stok: Number(form.stok),
    };

    if (editingProduk.value) {
        router.put(productUpdate(editingProduk.value.id_produk).url, data, {
            onSuccess: () => closeModal(),
        });
    } else {
        router.post(productStore().url, data, {
            onSuccess: () => closeModal(),
        });
    }
}

function hapusProduk(produk: Produk) {
    if (confirm(`Hapus produk "${produk.nama}"? Tindakan ini tidak dapat dibatalkan.`)) {
        router.delete(productDestroy(produk.id_produk).url);
    }
}

const statusLabel: Record<string, string> = {
    'in-stock': 'Stok Tersedia',
    'low-stock': 'Hampir Habis',
    'out-of-stock': 'Stok Habis',
};

const statusClass: Record<string, string> = {
    'in-stock': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    'low-stock': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    'out-of-stock': 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};
</script>

<template>
    <Head title="Data Produk - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <!-- Header Section -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">Manajemen Produk</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Kelola data produk, persediaan stok, kategori barang, dan harga penjualan toko
                    Anda.
                </p>
            </div>

            <button
                id="btn-tambah-produk"
                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                @click="openTambah"
            >
                <Plus class="h-4 w-4" />
                Tambah Produk Baru
            </button>
        </div>

        <!-- Stats Row -->
        <div class="grid gap-4 md:grid-cols-3">
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400"
                >
                    <Package class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Produk</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_produk }} Item</h3>
                </div>
            </div>
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400"
                >
                    <Layers class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Kategori</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_kategori }} Kategori</h3>
                </div>
            </div>
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400"
                >
                    <AlertTriangle class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Stok Menipis / Habis</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.stok_bermasalah }} Produk</h3>
                </div>
            </div>
        </div>

        <!-- Filters & Table Section -->
        <div
            class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"
        >
            <!-- Table Action Bar -->
            <div
                class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border"
            >
                <div class="relative flex-1 max-w-md">
                    <Search
                        class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari produk berdasarkan nama..."
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>

                <div class="flex gap-2">
                    <select
                        v-model="filterKategori"
                        class="rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"
                    >
                        <option value="">Semua Kategori</option>
                        <option
                            v-for="kat in kategoris"
                            :key="kat.id_kategori"
                            :value="String(kat.id_kategori)"
                        >
                            {{ kat.nama_kategori }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Responsive Table -->
            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr
                            class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"
                        >
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                Nama Produk
                            </th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Kategori</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                Harga Jual
                            </th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                Persediaan (Stok)
                            </th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                            <th class="px-6 py-4 text-right font-semibold text-muted-foreground">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        <tr v-if="filteredProduks.length === 0">
                            <td
                                colspan="6"
                                class="px-6 py-12 text-center text-muted-foreground"
                            >
                                <Package class="mx-auto mb-3 h-10 w-10 opacity-30" />
                                <p class="font-medium">
                                    {{
                                        searchQuery
                                            ? 'Tidak ada produk yang sesuai pencarian.'
                                            : 'Belum ada produk. Tambahkan produk pertama!'
                                    }}
                                </p>
                            </td>
                        </tr>
                        <tr
                            v-for="produk in filteredProduks"
                            :key="produk.id_produk"
                            class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"
                        >
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <img
                                        v-if="resolveFoto(produk.foto_url ?? produk.foto)"
                                        :src="resolveFoto(produk.foto_url ?? produk.foto) ?? undefined"
                                        :alt="produk.nama"
                                        class="h-12 w-12 rounded-lg border border-sidebar-border/70 object-cover dark:border-sidebar-border"
                                    />
                                    <div
                                        v-else
                                        class="flex h-12 w-12 items-center justify-center rounded-lg border border-sidebar-border/70 bg-slate-100 text-muted-foreground dark:border-sidebar-border dark:bg-zinc-800"
                                    >
                                        <ImageIcon class="h-5 w-5" />
                                    </div>
                                    <div class="min-w-0">
                                        <p class="font-semibold text-foreground">{{ produk.nama }}</p>
                                        <p class="text-xs text-muted-foreground">SKU: {{ produk.sku }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">
                                {{ produk.kategori ?? '-' }}
                            </td>
                            <td class="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                                {{ formatRupiah(produk.harga_jual) }}
                            </td>
                            <td class="px-6 py-4 font-medium">{{ produk.stok }} pcs</td>
                            <td class="px-6 py-4">
                                <span
                                    :class="[
                                        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide',
                                        statusClass[produk.status_stok],
                                    ]"
                                >
                                    {{ statusLabel[produk.status_stok] }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="inline-flex justify-end gap-2">
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
                                        title="Edit"
                                        @click="openEdit(produk)"
                                    >
                                        <Edit class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                                        title="Hapus"
                                        @click="hapusProduk(produk)"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal Tambah / Edit Produk -->
    <Teleport to="body">
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            @click.self="closeModal"
        >
            <div
                class="w-full max-w-lg rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border"
                style="max-height: 90vh; overflow-y: auto"
            >
                <div class="mb-5 flex items-center justify-between">
                    <h2 class="text-lg font-bold">
                        {{ editingProduk ? 'Edit Produk' : 'Tambah Produk Baru' }}
                    </h2>
                    <button
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                        @click="closeModal"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <form class="flex flex-col gap-4" @submit.prevent="submitForm">
                    <!-- Nama -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium" for="prod-nama">
                            Nama Produk
                        </label>
                        <input
                            id="prod-nama"
                            v-model="form.nama"
                            type="text"
                            placeholder="Nama produk"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            :class="{ 'border-rose-500': form.errors.nama }"
                        />
                        <p v-if="form.errors.nama" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                            <AlertCircle class="h-3 w-3" />{{ form.errors.nama }}
                        </p>
                    </div>

                    <!-- Foto -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium" for="prod-foto">
                            Foto Produk
                        </label>
                        <div class="grid gap-3 sm:grid-cols-[1fr_auto]">
                            <input
                                id="prod-foto"
                                v-model="form.foto"
                                type="text"
                                placeholder="/images/produk/kopi.jpg atau https://..."
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                :class="{ 'border-rose-500': form.errors.foto }"
                            />
                            <label
                                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-sidebar-border/70 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-sidebar-border dark:bg-zinc-900 dark:text-slate-200 dark:hover:bg-zinc-800"
                            >
                                <ImageIcon class="h-4 w-4" />
                                Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    class="hidden"
                                    @change="handleFileUpload"
                                />
                            </label>
                        </div>
                        <p class="mt-2 text-xs text-muted-foreground">
                            Unggah gambar produk atau masukkan URL jika sudah tersedia.
                        </p>
                        <p v-if="fotoUploadName" class="text-xs text-slate-600">
                            File dipilih: {{ fotoUploadName }}
                        </p>
                        <p v-if="form.errors.foto" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                            <AlertCircle class="h-3 w-3" />{{ form.errors.foto }}
                        </p>
                    </div>

                    <!-- Kategori -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium" for="prod-kategori">
                            Kategori
                        </label>
                        <select
                            id="prod-kategori"
                            v-model="form.id_kategori"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            :class="{ 'border-rose-500': form.errors.id_kategori }"
                        >
                            <option value="">Pilih kategori</option>
                            <option
                                v-for="kat in kategoris"
                                :key="kat.id_kategori"
                                :value="String(kat.id_kategori)"
                            >
                                {{ kat.nama_kategori }}
                            </option>
                        </select>
                        <p v-if="form.errors.id_kategori" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                            <AlertCircle class="h-3 w-3" />{{ form.errors.id_kategori }}
                        </p>
                    </div>

                    <!-- Harga Beli & Jual -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium" for="prod-harga-beli">
                                Harga Beli (Rp)
                            </label>
                            <input
                                id="prod-harga-beli"
                                v-model="form.harga_beli"
                                type="number"
                                min="0"
                                placeholder="0"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                :class="{ 'border-rose-500': form.errors.harga_beli }"
                            />
                            <p v-if="form.errors.harga_beli" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                <AlertCircle class="h-3 w-3" />{{ form.errors.harga_beli }}
                            </p>
                        </div>
                        <div>
                            <label class="mb-1.5 block text-sm font-medium" for="prod-harga-jual">
                                Harga Jual (Rp)
                            </label>
                            <input
                                id="prod-harga-jual"
                                v-model="form.harga_jual"
                                type="number"
                                min="0"
                                placeholder="0"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                :class="{ 'border-rose-500': form.errors.harga_jual }"
                            />
                            <p v-if="form.errors.harga_jual" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                <AlertCircle class="h-3 w-3" />{{ form.errors.harga_jual }}
                            </p>
                        </div>
                    </div>

                    <!-- Stok -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium" for="prod-stok">Stok</label>
                        <input
                            id="prod-stok"
                            v-model="form.stok"
                            type="number"
                            min="0"
                            placeholder="0"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            :class="{ 'border-rose-500': form.errors.stok }"
                        />
                        <p v-if="form.errors.stok" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                            <AlertCircle class="h-3 w-3" />{{ form.errors.stok }}
                        </p>
                    </div>

                    <!-- Barcode & SKU -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium" for="prod-barcode">
                                Barcode
                            </label>
                            <input
                                id="prod-barcode"
                                v-model="form.barcode"
                                type="text"
                                placeholder="Barcode unik"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                :class="{ 'border-rose-500': form.errors.barcode }"
                            />
                            <p v-if="form.errors.barcode" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                <AlertCircle class="h-3 w-3" />{{ form.errors.barcode }}
                            </p>
                        </div>
                        <div>
                            <label class="mb-1.5 block text-sm font-medium" for="prod-sku">
                                SKU
                            </label>
                            <input
                                id="prod-sku"
                                v-model="form.sku"
                                type="text"
                                placeholder="SKU unik"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                :class="{ 'border-rose-500': form.errors.sku }"
                            />
                            <p v-if="form.errors.sku" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                                <AlertCircle class="h-3 w-3" />{{ form.errors.sku }}
                            </p>
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"
                            @click="closeModal"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60"
                            :disabled="form.processing"
                        >
                            <Save class="h-4 w-4" />
                            {{
                                form.processing
                                    ? 'Menyimpan...'
                                    : editingProduk
                                      ? 'Simpan Perubahan'
                                      : 'Tambah Produk'
                            }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </Teleport>
</template>
