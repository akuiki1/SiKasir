<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { ChevronDown } from 'lucide-vue-next';
import { computed } from 'vue';
import AppearanceToggle from '@/components/AppearanceToggle.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import MenuSearch from '@/components/MenuSearch.vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import UserMenuContent from '@/components/UserMenuContent.vue';
import { useInitials } from '@/composables/useInitials';
import type { BreadcrumbItem } from '@/types';

withDefaults(
    defineProps<{
        breadcrumbs?: BreadcrumbItem[];
    }>(),
    {
        breadcrumbs: () => [],
    },
);

const page = usePage();
const user = computed(() => page.props.auth.user);
const isKasir = computed(() => user.value?.role !== 'admin');

const { getInitials } = useInitials();
const showAvatar = computed(() => !!user.value?.avatar);
</script>

<template>
    <header
        class="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/70 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-6"
    >
        <div class="flex min-w-0 flex-1 items-center gap-2">
            <!-- Kasir: Bottom Navigation di mobile → toggle hanya desktop.
                 Admin: toggle desktop pindah ke dalam sidebar → di sini hanya
                 untuk membuka panel geser di mobile. -->
            <SidebarTrigger
                :class="['-ml-1', isKasir ? 'hidden md:flex' : 'md:hidden']"
            />
            <template v-if="breadcrumbs && breadcrumbs.length > 0">
                <Breadcrumbs :breadcrumbs="breadcrumbs" />
            </template>
        </div>

        <!-- Admin: command-palette cari menu di tengah, sejajar akun kanan-atas. -->
        <div v-if="!isKasir" class="hidden flex-1 justify-center md:flex">
            <MenuSearch />
        </div>

        <!-- Akun + pengaturan tampilan di kanan atas header (admin & kasir). -->
        <div class="flex flex-1 shrink-0 items-center justify-end gap-1">
            <AppearanceToggle />

            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button
                        variant="ghost"
                        class="h-9 gap-2 rounded-full px-1.5 sm:pr-2.5"
                        data-test="header-user-menu"
                    >
                        <Avatar class="size-7 overflow-hidden rounded-full">
                            <AvatarImage
                                v-if="showAvatar"
                                :src="user.avatar!"
                                :alt="user.name"
                            />
                            <AvatarFallback
                                class="rounded-full bg-primary/10 text-xs font-semibold text-primary"
                            >
                                {{ getInitials(user.name) }}
                            </AvatarFallback>
                        </Avatar>
                        <span
                            class="hidden max-w-32 truncate text-sm font-medium sm:inline"
                        >
                            {{ user.name }}
                        </span>
                        <ChevronDown
                            class="hidden size-4 text-muted-foreground sm:inline"
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    class="min-w-56 rounded-lg"
                    align="end"
                    :side-offset="6"
                >
                    <UserMenuContent :user="user" />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
</template>
