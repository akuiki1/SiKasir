<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Edit, 
    Trash2, 
    UserCheck, 
    Shield, 
    User,
    Mail,
    SearchCode
} from 'lucide-vue-next';

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

// Mock user list data
const users = [
    { id: 1, name: 'Administrator Utama', email: 'admin@sikasir.com', role: 'admin', status: 'active', lastActive: 'Baru saja' },
    { id: 2, name: 'Ahmad Kasir', email: 'ahmad@sikasir.com', role: 'kasir', status: 'active', lastActive: '5 menit yang lalu' },
    { id: 3, name: 'Rina Kasir', email: 'rina@sikasir.com', role: 'kasir', status: 'active', lastActive: '12 menit yang lalu' },
    { id: 4, name: 'Budi Kasir', email: 'budi@sikasir.com', role: 'kasir', status: 'inactive', lastActive: '2 hari yang lalu' },
];
</script>

<template>
    <Head title="Data User - Admin" />

    <div class="flex h-full flex-1 flex-col gap-6 p-6">
        <!-- Header Section -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">Manajemen User</h1>
                <p class="text-sm text-muted-foreground mt-1">
                    Kelola data pengguna, hak akses, dan atur akun kasir di sistem Anda.
                </p>
            </div>
            
            <button class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">
                <Plus class="h-4 w-4" />
                Tambah User Baru
            </button>
        </div>

        <!-- Stats Row -->
        <div class="grid gap-4 md:grid-cols-3">
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border flex items-center gap-4 shadow-sm">
                <div class="rounded-lg bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <User class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Total Pengguna</span>
                    <h3 class="text-xl font-bold mt-0.5">4 Orang</h3>
                </div>
            </div>
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border flex items-center gap-4 shadow-sm">
                <div class="rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <Shield class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Administrator</span>
                    <h3 class="text-xl font-bold mt-0.5">1 Akun</h3>
                </div>
            </div>
            <div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border flex items-center gap-4 shadow-sm">
                <div class="rounded-lg bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <UserCheck class="h-6 w-6" />
                </div>
                <div>
                    <span class="text-xs font-medium text-muted-foreground">Kasir Aktif</span>
                    <h3 class="text-xl font-bold mt-0.5">3 Akun</h3>
                </div>
            </div>
        </div>

        <!-- Filters & Table Section -->
        <div class="rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border overflow-hidden">
            <!-- Table Action Bar -->
            <div class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border">
                <div class="relative flex-1 max-w-md">
                    <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Cari user berdasarkan nama atau email..." 
                        class="w-full rounded-lg border border-sidebar-border/70 bg-background pl-9 pr-4 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
                    />
                </div>
                
                <div class="flex gap-2">
                    <button class="inline-flex items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800/40 dark:border-sidebar-border">
                        <Filter class="h-4 w-4" />
                        Filter
                    </button>
                </div>
            </div>

            <!-- Responsive Table -->
            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:bg-zinc-800/20 dark:border-sidebar-border">
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Nama Pengguna</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Email</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Role</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground">Aktifitas Terakhir</th>
                            <th class="px-6 py-4 font-semibold text-muted-foreground text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        <tr 
                            v-for="userItem in users" 
                            :key="userItem.id"
                            class="hover:bg-slate-50/50 dark:hover:bg-zinc-800/10 transition-colors"
                        >
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 font-bold text-slate-700 dark:text-slate-300">
                                        {{ userItem.name.charAt(0) }}
                                    </div>
                                    <span class="font-semibold text-foreground">{{ userItem.name }}</span>
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
                                        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
                                        userItem.role === 'admin' 
                                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' 
                                            : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                                    ]"
                                >
                                    {{ userItem.role }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span 
                                    :class="[
                                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                                        userItem.status === 'active' 
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                            : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                                    ]"
                                >
                                    <span :class="['h-1.5 w-1.5 rounded-full', userItem.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400']"></span>
                                    {{ userItem.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-muted-foreground">{{ userItem.lastActive }}</td>
                            <td class="px-6 py-4 text-right">
                                <div class="inline-flex gap-2 justify-end">
                                    <button class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-indigo-600 transition-colors">
                                        <Edit class="h-4 w-4" />
                                    </button>
                                    <button class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-rose-600 transition-colors">
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
</template>
