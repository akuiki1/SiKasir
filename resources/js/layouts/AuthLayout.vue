<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ArrowUpRight, ShoppingBag, Sparkles } from 'lucide-vue-next';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { home } from '@/routes';

const { title = '', description = '' } = defineProps<{
    title?: string;
    description?: string;
}>();

// Pesan berputar di panel kanan — mencerminkan fitur nyata aplikasi.
const slides = [
    {
        title: 'Kasir cepat, transaksi rapi.',
        desc: 'Catat penjualan, kelola stok, dan pantau pesanan dalam satu aplikasi.',
    },
    {
        title: 'Pesanan online langsung masuk.',
        desc: 'Pesanan dari website pelanggan otomatis tampil dan siap diproses kasir.',
    },
    {
        title: 'Laporan jelas tiap hari.',
        desc: 'Lihat ringkasan penjualan, untung, dan stok kapan saja.',
    },
];

const active = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const goTo = (i: number) => {
    active.value = i;
    start();
};

const start = () => {
    if (timer) {
clearInterval(timer);
}

    timer = setInterval(() => {
        active.value = (active.value + 1) % slides.length;
    }, 5500);
};

onMounted(start);
onBeforeUnmount(() => {
    if (timer) {
clearInterval(timer);
}
});
</script>

<template>
    <div
        class="kg-auth flex min-h-svh w-full bg-[var(--kg-page)] font-['Plus_Jakarta_Sans',sans-serif] text-[var(--kg-on)] antialiased lg:items-center lg:justify-center lg:p-6 xl:p-10"
    >
        <!-- Kartu (mengambang di desktop, full-screen di mobile) -->
        <div
            class="flex w-full overflow-hidden bg-[var(--kg-bg)] lg:min-h-[660px] lg:max-w-[1100px] lg:rounded-[2.25rem] lg:shadow-[0_30px_80px_-24px_rgba(20,12,4,0.45)] lg:ring-1 lg:ring-black/5 dark:lg:ring-white/10"
        >
            <!-- ===== Panel kiri: form ===== -->
            <div
                class="flex w-full flex-col px-6 py-8 sm:px-10 lg:w-[46%] lg:px-12 lg:py-10 xl:px-14"
            >
                <!-- Brand -->
                <Link
                    :href="home()"
                    class="inline-flex w-fit items-center gap-2.5 transition-opacity hover:opacity-80"
                >
                    <AppLogoIcon class="h-10 w-10 rounded-xl" />
                    <span
                        class="text-lg font-extrabold tracking-tight text-[var(--kg-primary)]"
                        >Cemilan Mba Tutut</span
                    >
                </Link>

                <!-- Konten form, terpusat vertikal -->
                <div class="flex flex-1 flex-col justify-center py-10">
                    <div class="mx-auto w-full max-w-[400px]">
                        <h1
                            v-if="title"
                            class="text-3xl font-extrabold tracking-tight text-[var(--kg-on)] sm:text-[2.1rem]"
                        >
                            {{ title }}
                        </h1>
                        <p
                            v-if="description"
                            class="mt-2.5 text-sm leading-relaxed text-[var(--kg-sec)]"
                        >
                            {{ description }}
                        </p>

                        <div class="mt-8">
                            <slot />
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <p
                    class="text-center text-xs text-[var(--kg-sec)] lg:text-left"
                >
                    © {{ new Date().getFullYear() }} Cemilan Mba Tutut · Hanya
                    untuk admin &amp; kasir.
                </p>
            </div>

            <!-- ===== Panel kanan: showcase brand (desktop) ===== -->
            <div
                class="relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex lg:w-[54%] xl:p-12"
                style="
                    background:
                        radial-gradient(
                            120% 120% at 85% 0%,
                            rgba(255, 92, 0, 0.55) 0%,
                            rgba(255, 92, 0, 0) 45%
                        ),
                        linear-gradient(
                            150deg,
                            #7a2900 0%,
                            #521800 60%,
                            #3a1100 100%
                        );
                "
            >
                <!-- Glow lembut -->
                <div
                    class="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-[#ff5c00]/30 blur-3xl"
                />
                <div
                    class="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-[#ff8a4d]/15 blur-3xl"
                />

                <!-- Top bar -->
                <div class="relative z-10 flex items-center justify-between">
                    <span
                        class="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-white/90"
                    >
                        <Sparkles class="h-4 w-4" /> SiKasir
                    </span>
                    <Link
                        :href="home()"
                        class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                    >
                        Kembali ke toko
                        <ArrowUpRight class="h-4 w-4" />
                    </Link>
                </div>

                <!-- Kartu showcase -->
                <div class="relative z-10 my-auto w-full max-w-md">
                    <div
                        class="relative rounded-[1.75rem] bg-white p-7 text-[#191c1e] shadow-2xl shadow-black/30"
                    >
                        <span
                            class="inline-flex items-center gap-1.5 rounded-full bg-[#ff5c00]/10 px-3 py-1 text-[11px] font-extrabold tracking-wide text-[#a73a00] uppercase"
                        >
                            <ShoppingBag class="h-3.5 w-3.5" /> Cemilan Mba
                            Tutut
                        </span>
                        <h3
                            class="mt-4 text-2xl leading-tight font-extrabold tracking-tight"
                        >
                            Serba 10 ribuan,<br />bikin nagih.
                        </h3>
                        <p class="mt-2 text-sm text-[#5d5e62]">
                            Aneka cemilan &amp; frozen food rumahan khas
                            Barabai, dibuat fresh tiap hari.
                        </p>
                        <Link
                            :href="home()"
                            class="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#ff5c00] px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                        >
                            Lihat toko
                            <ArrowUpRight class="h-4 w-4" />
                        </Link>

                        <img
                            src="/images/hero.png"
                            alt="Cemilan Mba Tutut"
                            class="pointer-events-none absolute -top-10 -right-6 hidden h-32 w-32 rotate-6 rounded-3xl object-cover shadow-xl ring-4 ring-white sm:block"
                        />
                    </div>

                    <!-- Chip statistik kecil yang menumpuk -->
                    <div
                        class="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-black/20"
                    >
                        <span
                            class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff5c00]/10 text-[#a73a00]"
                        >
                            <ShoppingBag class="h-5 w-5" />
                        </span>
                        <div class="leading-tight">
                            <p
                                class="text-[10px] font-bold tracking-widest text-[#5d5e62] uppercase"
                            >
                                Mulai dari
                            </p>
                            <p class="text-xl font-extrabold text-[#191c1e]">
                                Rp 10.000
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Carousel teks + dots -->
                <div class="relative z-10">
                    <Transition name="auth-slide" mode="out-in">
                        <div :key="active">
                            <h2
                                class="text-3xl font-extrabold tracking-tight xl:text-4xl"
                            >
                                {{ slides[active].title }}
                            </h2>
                            <p class="mt-3 max-w-md text-sm text-white/75">
                                {{ slides[active].desc }}
                            </p>
                        </div>
                    </Transition>

                    <div class="mt-7 flex items-center gap-2.5">
                        <button
                            v-for="(s, i) in slides"
                            :key="i"
                            type="button"
                            @click="goTo(i)"
                            :aria-label="`Slide ${i + 1}`"
                            class="h-2 rounded-full transition-all duration-300"
                            :class="
                                active === i
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/40 hover:bg-white/70'
                            "
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
/* ===== Palet brand (selaras dengan storefront), khusus area Auth ===== */
.kg-auth {
    --kg-page: #e7eaef;
    --kg-bg: #f7f9fb;
    --kg-surface: #ffffff;
    --kg-sc: #eceef0;
    --kg-on: #191c1e;
    --kg-sec: #5d5e62;
    --kg-primary: #a73a00;
    --kg-signal: #ff5c00;

    /* Override token shadcn agar tombol & fokus ikut warna brand */
    --primary: #ff5c00;
    --primary-foreground: #ffffff;
    --ring: #ff5c00;
}
.dark .kg-auth {
    --kg-page: #0c0e10;
    --kg-bg: #121417;
    --kg-surface: #1c1f22;
    --kg-sc: #25282b;
    --kg-on: #e7e9ea;
    --kg-sec: #a0a3a8;
    --kg-primary: #ff8a4d;
    --kg-signal: #ff5c00;

    --primary: #ff5c00;
    --primary-foreground: #ffffff;
    --ring: #ff7a33;
}

/* Input lebih besar & rounded ala referensi */
.kg-auth [data-slot='input'] {
    height: 3rem;
    border-radius: 0.85rem;
    padding-inline: 1rem;
    background-color: var(--kg-surface);
    border-color: color-mix(in srgb, var(--kg-on) 14%, transparent);
    font-size: 0.95rem;
}
.dark .kg-auth [data-slot='input'] {
    border-color: rgba(255, 255, 255, 0.12);
}
.kg-auth [data-slot='input']::placeholder {
    color: var(--kg-sec);
    opacity: 0.7;
}

/* Tombol submit penuh & tebal */
.kg-auth [data-slot='button'][type='submit'] {
    height: 3rem;
    border-radius: 0.85rem;
    font-weight: 700;
    box-shadow: 0 10px 20px -8px rgba(255, 92, 0, 0.55);
}

/* Transisi carousel panel kanan */
.auth-slide-enter-active,
.auth-slide-leave-active {
    transition:
        opacity 0.4s ease,
        transform 0.4s ease;
}
.auth-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
}
.auth-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
