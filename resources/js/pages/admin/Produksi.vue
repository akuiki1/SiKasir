<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import {
    Plus,
    Search,
    Trash2,
    Factory,
    Boxes,
    Wallet,
    X,
    Save,
    PlusCircle,
} from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { store as produksiStore, destroy as produksiDestroy } from '@/routes/admin/produksi';
import { usePagination } from '@/composables/usePagination';
import Pagination from '@/components/Pagination.vue';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Produksi',
                href: '/admin/produksi',
            },
        ],
    },
});

interface Biaya {
    nama: string;
    nominal: number;
}

interface Produksi {
    id_produksi: number;
    id_produk: number;
    produk_nama: string;
    jumlah: number;
    total_biaya: number;
    modal_per_unit: number;
    catatan: string | null;
    tanggal: string;
    biayas: Biaya[];
}

interface ProdukOption {
    id_produk: number;
    nama: string;
    stok: number;
    harga_modal: number;
}

interface Stats {
    total_batch: number;
    total_unit: number;
    total_biaya: number;
}

const props = defineProps<{
    produksis: Produksi[];
    produks: ProdukOption[];
    stats: Stats;
}>();

const rupiah = (value: number): string => 'Rp ' + (value ?? 0).toLocaleString('id-ID');

const searchQuery = ref('');
const filteredProduksis = computed(() => {
    if (!searchQuery.value) {
        return props.produksis;
    }

    return props.produksis.filter((item) =>
        item.produk_nama.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
});

const {
    currentPage,
    perPage,
    totalItems,
    totalPages,
    paginatedItems: paginatedProduksis,
    startIndex,
    endIndex,
    goToPage,
    visiblePages,
} = usePagination(() => filteredProduksis.value);

const showModal = ref(false);

const form = useForm<{
    id_produk: number | '';
    jumlah: number;
    catatan: string;
    biayas: Biaya[];
}>({
    id_produk: '',
    jumlah: 0,
    catatan: '',
    biayas: [{ nama: '', nominal: 0 }],
});

const totalBiaya = computed(() => form.biayas.reduce((sum, b) => sum + (Number(b.nominal) || 0), 0));
const modalPerUnit = computed(() => (form.jumlah > 0 ? Math.round(totalBiaya.value / form.jumlah) : 0));

const selectedProduk = computed(() => props.produks.find((p) => p.id_produk === form.id_produk) ?? null);

function addBiaya(): void {
    form.biayas.push({ nama: '', nominal: 0 });
}

function removeBiaya(index: number): void {
    if (form.biayas.length > 1) {
        form.biayas.splice(index, 1);
    }
}

function openTambah(): void {
    form.reset();
    form.biayas = [{ nama: '', nominal: 0 }];
    form.clearErrors();
    showModal.value = true;
}

function closeModal(): void {
    showModal.value = false;
    form.reset();
    form.clearErrors();
}

function submitForm(): void {
    form.post(produksiStore().url, {
        onSuccess: () => closeModal(),
    });
}

function hapusProduksi(item: Produksi): void {
    if (
        confirm(
            `Hapus batch produksi "${item.produk_nama}" (${item.jumlah} unit)? Stok barang jadi akan dikurangi kembali.`,
        )
    ) {
        router.delete(produksiDestroy(item.id_produksi).url);
    }
}
</script>

<template>
    <Head title="Produksi - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">Produksi</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Catat batch produksi barang buatan sendiri. Modal per unit dihitung dari total biaya bahan dibagi jumlah hasil.
                </p>
            </div>

            <button
                id="btn-tambah-produksi"
                class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500"
                @click="openTambah"
            >
                <Plus class="h-4 w-4" />
                Catat Produksi
            </button>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
            <div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                <div class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">
                    <Factory class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Batch</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_batch }} batch</h3>
                </div>
            </div>
            <div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                <div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                    <Boxes class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Unit Diproduksi</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_unit.toLocaleString('id-ID') }} unit</h3>
                </div>
            </div>
            <div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                <div class="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
                    <Wallet class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Biaya Produksi</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ rupiah(stats.total_biaya) }}</h3>
                </div>
            </div>
        </div>

        <div class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border">
            <div class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border">
                <div class="relative max-w-md flex-1">
                    <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari nama produk..."
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20">
                            <th class="px-6 py-4 font-semibold text-muted-foreground">No</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Produk</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Jumlah Hasil</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Total Biaya</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Modal / Unit</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Tanggal</th>
                            <th class="px-6 py-4 text-right font-semibold text-muted-foreground">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        <tr v-if="paginatedProduksis.length === 0">
                            <td colspan="7" class="px-6 py-12 text-center text-muted-foreground">
                                <Factory class="mx-auto mb-3 h-10 w-10 opacity-30" />
                                <p class="font-medium">Belum ada batch produksi.</p>
                            </td>
                        </tr>
                        <tr
                            v-for="(item, index) in paginatedProduksis"
                            :key="item.id_produksi"
                            class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"
                        >
                            <td class="px-6 py-4 text-muted-foreground">{{ startIndex + index }}</td>
                            <td class="px-6 py-4 font-medium">{{ item.produk_nama }}</td>
                            <td class="px-6 py-4">{{ item.jumlah.toLocaleString('id-ID') }} unit</td>
                            <td class="px-6 py-4">{{ rupiah(item.total_biaya) }}</td>
                            <td class="px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400">{{ rupiah(item.modal_per_unit) }}</td>
                            <td class="px-6 py-4">{{ item.tanggal }}</td>
                            <td class="px-6 py-4 text-right">
                                <button
                                    class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                                    title="Hapus"
                                    @click="hapusProduksi(item)"
                                >
                                    <Trash2 class="h-4 w-4" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Pagination
                :current-page="currentPage"
                :total-pages="totalPages"
                :total-items="totalItems"
                :start-index="startIndex"
                :end-index="endIndex"
                :per-page="perPage"
                :visible-pages="visiblePages"
                @update:current-page="goToPage"
                @update:per-page="perPage = $event"
            />
        </div>
    </div>

    <Teleport to="body">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-semibold">Catat Batch Produksi</h2>
                        <p class="mt-1 text-sm text-muted-foreground">
                            Masukkan jumlah hasil dan biaya bahan yang <em>terpakai</em> untuk batch ini (bukan total pembelian).
                        </p>
                    </div>
                    <button class="rounded-full p-2 text-muted-foreground transition hover:bg-slate-100 dark:hover:bg-zinc-800" @click="closeModal">
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <div class="mt-6 grid gap-4">
                    <div v-if="produks.length === 0" class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
                        Belum ada produk berjenis <strong>produksi</strong>. Buat dulu produk dengan jenis "Buatan Sendiri" di menu Data Produk.
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label class="mb-2 block text-sm font-medium">Produk (Buatan Sendiri)</label>
                            <select
                                v-model="form.id_produk"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            >
                                <option value="" disabled>Pilih produk</option>
                                <option v-for="p in produks" :key="p.id_produk" :value="p.id_produk">
                                    {{ p.nama }} (stok: {{ p.stok }})
                                </option>
                            </select>
                            <p v-if="form.errors.id_produk" class="mt-2 text-sm text-rose-600">{{ form.errors.id_produk }}</p>
                        </div>
                        <div>
                            <label class="mb-2 block text-sm font-medium">Jumlah Hasil (unit)</label>
                            <input
                                v-model.number="form.jumlah"
                                type="number"
                                min="1"
                                placeholder="0"
                                class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            />
                            <p v-if="form.errors.jumlah" class="mt-2 text-sm text-rose-600">{{ form.errors.jumlah }}</p>
                        </div>
                    </div>

                    <!-- Rincian biaya -->
                    <div>
                        <div class="mb-2 flex items-center justify-between">
                            <label class="block text-sm font-medium">Rincian Biaya Bahan</label>
                            <button
                                type="button"
                                class="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                @click="addBiaya"
                            >
                                <PlusCircle class="h-4 w-4" />
                                Tambah Baris
                            </button>
                        </div>

                        <div class="space-y-2">
                            <div v-for="(biaya, index) in form.biayas" :key="index" class="flex items-center gap-2">
                                <input
                                    v-model="biaya.nama"
                                    type="text"
                                    placeholder="Contoh: Bawang merah ~2kg"
                                    class="flex-1 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                />
                                <div class="relative w-40">
                                    <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</span>
                                    <input
                                        v-model.number="biaya.nominal"
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                                    />
                                </div>
                                <button
                                    type="button"
                                    class="rounded-lg p-2 text-muted-foreground transition hover:bg-slate-100 hover:text-rose-600 disabled:opacity-30 dark:hover:bg-zinc-800"
                                    :disabled="form.biayas.length <= 1"
                                    @click="removeBiaya(index)"
                                >
                                    <Trash2 class="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <p v-if="form.errors.biayas" class="mt-2 text-sm text-rose-600">{{ form.errors.biayas }}</p>
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium">Catatan (opsional)</label>
                        <textarea
                            v-model="form.catatan"
                            rows="2"
                            placeholder="Catatan batch, misalnya tanggal masak atau kode batch."
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                        ></textarea>
                    </div>

                    <!-- Preview perhitungan -->
                    <div class="grid gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 sm:grid-cols-3">
                        <div>
                            <span class="text-xs font-medium text-muted-foreground">Total Biaya</span>
                            <p class="mt-0.5 text-lg font-bold">{{ rupiah(totalBiaya) }}</p>
                        </div>
                        <div>
                            <span class="text-xs font-medium text-muted-foreground">Jumlah Hasil</span>
                            <p class="mt-0.5 text-lg font-bold">{{ (form.jumlah || 0).toLocaleString('id-ID') }} unit</p>
                        </div>
                        <div>
                            <span class="text-xs font-medium text-muted-foreground">Modal / Unit</span>
                            <p class="mt-0.5 text-lg font-bold text-indigo-600 dark:text-indigo-400">{{ rupiah(modalPerUnit) }}</p>
                        </div>
                    </div>
                    <p v-if="selectedProduk" class="text-xs text-muted-foreground">
                        Modal produk saat ini: <strong>{{ rupiah(selectedProduk.harga_modal) }}</strong> — akan diperbarui ke {{ rupiah(modalPerUnit) }} setelah disimpan.
                    </p>
                </div>

                <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800"
                        type="button"
                        @click="closeModal"
                    >
                        Batal
                    </button>
                    <button
                        class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                        type="button"
                        :disabled="form.processing || produks.length === 0"
                        @click="submitForm"
                    >
                        <Save class="h-4 w-4" />
                        Simpan Produksi
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
