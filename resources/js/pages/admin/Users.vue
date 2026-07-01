<script setup lang="ts">
import { Head, useForm, router, usePage } from '@inertiajs/vue3';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    UserCheck,
    Shield,
    User,
    Mail,
    X,
    Save,
    AlertCircle,
} from 'lucide-vue-next';
import { ref, computed, watch } from 'vue';
import BodyTeleport from '@/components/BodyTeleport.vue';
import Pagination from '@/components/Pagination.vue';
import { store as userStore, update as userUpdate, destroy as userDestroy } from '@/routes/admin/users';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Data User',
                href: '/admin/users',
            },
        ],
    },
});

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'kasir';
    created_at: string;
}

interface Stats {
    total_users: number;
    total_admin: number;
    total_kasir: number;
}

interface Paginator<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Filters {
    search: string;
    role: string;
    per_page: number;
}

const props = defineProps<{
    users: Paginator<UserItem>;
    stats: Stats;
    filters: Filters;
}>();

const page = usePage();
const currentUserId = computed(() => (page.props.auth as { user: { id: number } }).user.id);

// Search & filter dikirim ke server (search di-debounce).
const searchQuery = ref(props.filters.search ?? '');
const filterRole = ref(props.filters.role ?? '');

let searchTimer: ReturnType<typeof setTimeout> | undefined;
watch(searchQuery, (value) => {
    if (searchTimer) {
        clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(() => reload({ search: value, page: 1 }), 350);
});

watch(filterRole, (value) => reload({ role: value, page: 1 }));

type QueryValue = string | number;

function buildParams(overrides: Record<string, QueryValue> = {}): Record<string, QueryValue> {
    const params: Record<string, QueryValue | undefined> = {
        search: searchQuery.value || undefined,
        role: filterRole.value || undefined,
        per_page: props.filters.per_page,
        ...overrides,
    };

    const cleaned: Record<string, QueryValue> = {};

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            cleaned[key] = value;
        }
    });

    return cleaned;
}

function reload(overrides: Record<string, QueryValue> = {}): void {
    router.get('/admin/users', buildParams(overrides), {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}

function goToPage(page: number): void {
    reload({ page });
}

function changePerPage(value: number): void {
    reload({ per_page: value, page: 1 });
}

const visiblePages = computed(() => {
    const pages: number[] = [];
    const total = props.users.last_page;
    const current = props.users.current_page;

    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);

        if (current > 3) {
            pages.push(-1);
        }

        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
            pages.push(i);
        }

        if (current < total - 2) {
            pages.push(-1);
        }

        pages.push(total);
    }

    return pages;
});

const showModal = ref(false);
const editingUser = ref<UserItem | null>(null);

const form = useForm({
    name: '',
    email: '',
    role: 'kasir' as 'admin' | 'kasir',
    password: '',
    password_confirmation: '',
});

function openTambah() {
    editingUser.value = null;
    form.reset();
    form.role = 'kasir';
    showModal.value = true;
}

function openEdit(user: UserItem) {
    editingUser.value = user;
    form.name = user.name;
    form.email = user.email;
    form.role = user.role;
    form.password = '';
    form.password_confirmation = '';
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
    form.reset();
    form.clearErrors();
}

function submitForm() {
    if (editingUser.value) {
        form.put(userUpdate(editingUser.value.id).url, {
            onSuccess: () => closeModal(),
        });
    } else {
        form.post(userStore().url, {
            onSuccess: () => closeModal(),
        });
    }
}

function hapusUser(user: UserItem) {
    if (user.id === currentUserId.value) {
        alert('Anda tidak dapat menghapus akun sendiri.');

        return;
    }

    if (confirm(`Hapus user "${user.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
        router.delete(userDestroy(user.id).url);
    }
}

function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(dateString));
}
</script>

<template>
    <Head title="Data User - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">Manajemen User</h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Kelola data pengguna, hak akses, dan atur akun kasir di sistem Anda.
                </p>
            </div>

            <button
                id="btn-tambah-user"
                class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                @click="openTambah"
            >
                <Plus class="h-4 w-4" />
                Tambah User Baru
            </button>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400"
                >
                    <User class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Pengguna</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_users }} Orang</h3>
                </div>
            </div>
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400"
                >
                    <Shield class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Administrator</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_admin }} Akun</h3>
                </div>
            </div>
            <div
                class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"
            >
                <div
                    class="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400"
                >
                    <UserCheck class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Kasir</span>
                    <h3 class="mt-0.5 text-xl font-bold">{{ stats.total_kasir }} Akun</h3>
                </div>
            </div>
        </div>

        <div
            class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"
        >
            <div
                class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border"
            >
                <div class="relative max-w-md flex-1">
                    <Search
                        class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari user berdasarkan nama atau email..."
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>

                <select
                    v-model="filterRole"
                    class="rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"
                >
                    <option value="">Semua Role</option>
                    <option value="admin">Admin</option>
                    <option value="kasir">Kasir</option>
                </select>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr
                            class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"
                        >
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                Nama Pengguna
                            </th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Email</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Role</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">
                                Terdaftar Sejak
                            </th>
                            <th class="px-6 py-4 text-right font-semibold text-muted-foreground">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        <tr v-if="props.users.data.length === 0">
                            <td colspan="5" class="px-6 py-12 text-center text-muted-foreground">
                                <User class="mx-auto mb-3 h-10 w-10 opacity-30" />
                                <p class="font-medium">
                                    {{
                                        searchQuery || filterRole
                                            ? 'Tidak ada user yang sesuai pencarian.'
                                            : 'Belum ada user. Tambahkan user pertama!'
                                    }}
                                </p>
                            </td>
                        </tr>
                        <tr
                            v-for="userItem in props.users.data"
                            :key="userItem.id"
                            class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"
                        >
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 dark:bg-zinc-800 dark:text-slate-300"
                                    >
                                        {{ userItem.name.charAt(0) }}
                                    </div>
                                    <span class="font-semibold text-foreground">{{
                                        userItem.name
                                    }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">
                                <div class="flex items-center gap-1.5">
                                    <Mail class="h-3.5 w-3.5" />
                                    {{ userItem.email }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    :class="[
                                        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
                                        userItem.role === 'admin'
                                            ? 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                            : 'border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
                                    ]"
                                >
                                    {{ userItem.role }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">
                                {{ formatDate(userItem.created_at) }}
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="inline-flex justify-end gap-2">
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
                                        aria-label="Edit"
                                        @click="openEdit(userItem)"
                                    >
                                        <Edit class="h-4 w-4" />
                                    </button>
                                    <button
                                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                                        aria-label="Hapus"
                                        :disabled="userItem.id === currentUserId"
                                        :class="{
                                            'cursor-not-allowed opacity-40':
                                                userItem.id === currentUserId,
                                        }"
                                        @click="hapusUser(userItem)"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Pagination
                :current-page="props.users.current_page"
                :total-pages="props.users.last_page"
                :total-items="props.users.total"
                :start-index="props.users.from ?? 0"
                :end-index="props.users.to ?? 0"
                :per-page="props.users.per_page"
                :visible-pages="visiblePages"
                @update:current-page="goToPage"
                @update:per-page="changePerPage"
            />
        </div>
    </div>

    <BodyTeleport>
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            @click.self="closeModal"
        >
            <div
                class="w-full max-w-md rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border"
                style="max-height: 90vh; overflow-y: auto"
            >
                <div class="mb-5 flex items-center justify-between">
                    <h2 class="text-lg font-bold">
                        {{ editingUser ? 'Edit User' : 'Tambah User Baru' }}
                    </h2>
                    <button
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                        @click="closeModal" aria-label="Tutup">
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <form class="flex flex-col gap-4" @submit.prevent="submitForm">
                    <div>
                        <label class="mb-1.5 block text-sm font-medium" for="user-name">
                            Nama
                        </label>
                        <input
                            id="user-name"
                            v-model="form.name"
                            type="text"
                            placeholder="Nama lengkap"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            :class="{ 'border-rose-500': form.errors.name }"
                        />
                        <p
                            v-if="form.errors.name"
                            class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                        >
                            <AlertCircle class="h-3 w-3" />{{ form.errors.name }}
                        </p>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium" for="user-email">
                            Email
                        </label>
                        <input
                            id="user-email"
                            v-model="form.email"
                            type="email"
                            placeholder="email@example.com"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            :class="{ 'border-rose-500': form.errors.email }"
                        />
                        <p
                            v-if="form.errors.email"
                            class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                        >
                            <AlertCircle class="h-3 w-3" />{{ form.errors.email }}
                        </p>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium" for="user-role">
                            Role
                        </label>
                        <select
                            id="user-role"
                            v-model="form.role"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            :class="{ 'border-rose-500': form.errors.role }"
                        >
                            <option value="kasir">Kasir</option>
                            <option value="admin">Admin</option>
                        </select>
                        <p
                            v-if="form.errors.role"
                            class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                        >
                            <AlertCircle class="h-3 w-3" />{{ form.errors.role }}
                        </p>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium" for="user-password">
                            Password
                            <span v-if="editingUser" class="font-normal text-muted-foreground">
                                (kosongkan jika tidak diubah)
                            </span>
                        </label>
                        <input
                            id="user-password"
                            v-model="form.password"
                            type="password"
                            placeholder="Password"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                            :class="{ 'border-rose-500': form.errors.password }"
                        />
                        <p
                            v-if="form.errors.password"
                            class="mt-1 flex items-center gap-1 text-xs text-rose-600"
                        >
                            <AlertCircle class="h-3 w-3" />{{ form.errors.password }}
                        </p>
                        <p v-else class="mt-1 text-xs text-muted-foreground">
                            Minimal 8 karakter, berisi huruf dan angka.
                        </p>
                    </div>

                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium"
                            for="user-password-confirmation"
                        >
                            Konfirmasi Password
                        </label>
                        <input
                            id="user-password-confirmation"
                            v-model="form.password_confirmation"
                            type="password"
                            placeholder="Ulangi password"
                            class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                        />
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
                                    : editingUser
                                      ? 'Simpan Perubahan'
                                      : 'Tambah User'
                            }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </BodyTeleport>
</template>
