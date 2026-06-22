<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

defineOptions({
    inheritAttrs: false,
});

type Props = {
    className?: HTMLAttributes['class'];
};

defineProps<Props>();
</script>

<template>
    <!-- Logo brand "Mba Tutut" — gambar full-color, ikut ukuran dari class pemanggil -->
    <img
        src="/images/logo.png"
        alt="Cemilan Mba Tutut"
        class="object-contain"
        v-bind="$attrs"
    />
</template>
