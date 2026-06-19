<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';

defineProps<{
    /** Baris kecil di bawah nama brand (mis. peran pengguna). Opsional. */
    subtitle?: string;
}>();
</script>

<template>
    <div
        class="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"
    >
        <AppLogoIcon class="size-5 fill-current text-white dark:text-black" />
    </div>
    <div class="ml-1 grid flex-1 text-left text-sm">
        <span class="truncate leading-tight font-semibold"
            >Cemilan Mba Tutut</span
        >
        <span
            v-if="subtitle"
            class="truncate text-xs leading-tight font-normal text-muted-foreground"
            >{{ subtitle }}</span
        >
    </div>
</template>
