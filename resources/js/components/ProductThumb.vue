<script setup lang="ts">
import { computed, useId } from 'vue';

// Thumbnail produk untuk storefront. Bila ada foto, tampilkan apa adanya.
// Bila tidak, render placeholder SVG ber-monogram dengan warna yang
// diturunkan dari nama produk — supaya tiap produk tanpa foto tampil
// berbeda & rapi (bukan gambar brand yang sama berulang).
const props = defineProps<{
    src?: string | null;
    name?: string | null;
}>();

// Atribut (class, alt, loading, dst.) diteruskan manual ke elemen yang
// benar-benar dirender, karena root-nya bisa <img> atau <svg>.
defineOptions({ inheritAttrs: false });

// Warna unik & konsisten per nama: hash sederhana → hue.
const hue = computed(() => {
    const text = props.name ?? '';
    let hash = 0;

    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0; // jaga tetap 32-bit
    }

    return Math.abs(hash) % 360;
});

// Monogram: huruf awal dari maksimal dua kata pertama.
const initials = computed(() => {
    const words = (props.name ?? '').trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
        return '?';
    }

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
});

const bgTop = computed(() => `hsl(${hue.value}, 58%, 82%)`);
const bgBottom = computed(() => `hsl(${hue.value}, 52%, 68%)`);
const fg = computed(() => `hsl(${hue.value}, 55%, 30%)`);

// Id gradient harus unik antar-instance; sanitasi agar valid di url(#...).
const gradId = computed(() => 'pt-' + useId().replace(/[^a-zA-Z0-9]/g, ''));
</script>

<template>
    <img v-if="src" v-bind="$attrs" :src="src" />
    <svg
        v-else
        v-bind="$attrs"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        :aria-label="name ?? 'Produk'"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" :stop-color="bgTop" />
                <stop offset="100%" :stop-color="bgBottom" />
            </linearGradient>
        </defs>
        <rect width="100" height="100" :fill="`url(#${gradId})`" />
        <text
            x="50"
            y="50"
            text-anchor="middle"
            dominant-baseline="central"
            font-size="34"
            font-weight="700"
            font-family="inherit"
            :fill="fg"
            style="letter-spacing: -1px"
        >
            {{ initials }}
        </text>
    </svg>
</template>
