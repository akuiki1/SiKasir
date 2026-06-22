<script setup lang="ts">
// Teleport ke <body> yang aman dari hydration mismatch saat SSR.
//
// Vue SSR + <Teleport to="body"> bisa salah-align dengan <script> milik Vite/aplikasi
// yang ada di <body> ketika hydration, memunculkan warning "Hydration node mismatch
// (script vs comment)" di setiap halaman yang punya modal/overlay. Solusinya: jangan
// render Teleport sampai komponen ter-mount di klien. Render pertama di server & klien
// sama-sama hanya berupa placeholder komentar (cocok), lalu Teleport aktif setelah mount.
// Aman karena modal/overlay tidak pernah terbuka pada render awal.
import { onMounted, ref } from 'vue';

const mounted = ref(false);

onMounted(() => {
    mounted.value = true;
});
</script>

<template>
    <Teleport v-if="mounted" to="body">
        <slot />
    </Teleport>
</template>
