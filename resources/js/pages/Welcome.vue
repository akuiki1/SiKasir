<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import { dashboard, login } from '@/routes';
import {
    Cookie,
    Flame,
    Sparkles,
    MessageCircle,
    PhoneCall,
    CheckCircle2,
    Star,
    Moon,
    Sun,
    ArrowRight,
    Utensils,
    Heart,
    Smile,
    Menu,
    X,
    ShoppingBag,
    Award,
    ShieldCheck,
    Leaf,
    Clock,
    ThumbsUp,
} from 'lucide-vue-next';
import { useAppearance } from '@/composables/useAppearance';

const { appearance, updateAppearance } = useAppearance();

const isMobileMenuOpen = ref(false);

const toggleTheme = () => {
    updateAppearance(appearance.value === 'dark' ? 'light' : 'dark');
};

// Snack Data
const products = [
    {
        id: 1,
        name: 'Keripik Singkong Pedas Daun Jeruk',
        image: '/images/singkong.png',
        description:
            'Irisan singkong tipis super renyah dibalut sambal merah cabai asli berkualitas dengan wangi segar daun jeruk purut melimpah.',
        price: 15000,
        tag: 'Pedas & Segar',
        rating: 4.9,
        reviews: 142,
        flavorType: 'spicy-lime',
    },
    {
        id: 2,
        name: 'Pisang Lumer Cokelat Premium',
        image: '/images/pisang.png',
        description:
            'Keripik pisang kepok pilihan yang diselimuti cokelat premium Belgia lumer yang lezat. Manisnya pas dan tidak bikin seret.',
        price: 18000,
        tag: 'Manis & Lumer',
        rating: 4.8,
        reviews: 98,
        flavorType: 'sweet',
    },
    {
        id: 3,
        name: 'Basreng Pedas Jeruk Nipis',
        image: '/images/basreng.png',
        description:
            'Bakso goreng khas Bandung yang diiris tipis, digoreng garing, dan dilumuri bumbu pedas bubuk cabai asli berpadu kesegaran jeruk nipis.',
        price: 16000,
        tag: 'Terlaris 🔥',
        rating: 5.0,
        reviews: 215,
        flavorType: 'super-spicy',
    },
    {
        id: 4,
        name: 'Makaroni Bantet Gurih Original',
        image: '/images/makaroni.png',
        description:
            'Makaroni bantet renyah dengan cita rasa gurih asin klasik hasil olahan bawang putih segar dan bumbu rahasia warisan keluarga.',
        price: 12000,
        tag: 'Asin Gurih',
        rating: 4.7,
        reviews: 84,
        flavorType: 'savory',
    },
];

// Interactive Quiz State
const selectedFlavor = ref<string | null>(null);
const quizCompleted = ref(false);

const quizOptions = [
    {
        id: 'super-spicy',
        label: 'Pedas Gila Nampol',
        emoji: '🥵',
        color: 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20',
    },
    {
        id: 'spicy-lime',
        label: 'Pedas Segar Daun Jeruk',
        emoji: '🍃',
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20',
    },
    {
        id: 'sweet',
        label: 'Manis Lembut Lumer',
        emoji: '🍫',
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20',
    },
    {
        id: 'savory',
        label: 'Asin Gurih Bikin Candu',
        emoji: '🍿',
        color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20',
    },
];

const matchedProduct = computed(() => {
    if (!selectedFlavor.value) return null;
    return (
        products.find((p) => p.flavorType === selectedFlavor.value) ||
        products[0]
    );
});

const selectQuizFlavor = (flavor: string) => {
    selectedFlavor.value = flavor;
    quizCompleted.value = true;
};

const resetQuiz = () => {
    selectedFlavor.value = null;
    quizCompleted.value = false;
};

// WhatsApp Direct Link Generator
const getWhatsAppLink = (productName: string) => {
    const message = encodeURIComponent(
        `Halo Kak! Saya tertarik untuk memesan produk Cemilan "${productName}" dari KriukKita. Bagaimana cara memesannya ya?`,
    );
    return `https://wa.me/6281234567890?text=${message}`;
};

const getGeneralWhatsAppLink = () => {
    const message = encodeURIComponent(
        'Halo KriukKita! Saya ingin tahu lebih lanjut tentang menu cemilan premium dan ingin memesan paket hemat.',
    );
    return `https://wa.me/6281234567890?text=${message}`;
};

// Formatting helper
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
};
</script>

<template>
    <Head title="KriukKita - Cemilan Premium UMKM Indonesia">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link
            href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet"
        />
    </Head>

    <div
        class="min-h-screen bg-[#FFFDF9] font-['Plus_Jakarta_Sans',sans-serif] text-[#2D2A26] transition-colors duration-300 selection:bg-amber-200 selection:text-amber-900 dark:bg-neutral-950 dark:text-neutral-100"
    >
        <!-- Premium Floating Background Elements -->
        <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
                class="absolute top-[10%] left-[-5%] h-72 w-72 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-900/10"
            ></div>
            <div
                class="absolute top-[40%] right-[-5%] h-96 w-96 rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-900/10"
            ></div>
            <div
                class="absolute bottom-[10%] left-[10%] h-80 w-80 rounded-full bg-yellow-100/50 blur-3xl dark:bg-yellow-900/5"
            ></div>

            <!-- Floating Chips Shapes Simulation -->
            <div
                class="absolute top-[18%] right-[15%] hidden h-10 w-10 rotate-12 animate-bounce rounded-xl bg-amber-400/20 duration-1000 md:block"
            ></div>
            <div
                class="absolute top-[60%] left-[5%] hidden h-8 w-8 -rotate-45 animate-pulse rounded-lg bg-orange-400/20 md:block"
            ></div>
            <div
                class="absolute right-[8%] bottom-[20%] hidden h-12 w-12 rotate-45 rounded-2xl bg-yellow-400/15 md:block"
            ></div>
        </div>

        <!-- Sticky Glassmorphism Header -->
        <header
            class="sticky top-0 z-50 w-full border-b border-amber-100/50 bg-[#FFFDF9]/85 backdrop-blur-md transition-all duration-300 dark:border-neutral-800/60 dark:bg-neutral-950/80"
        >
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-20 items-center justify-between">
                    <!-- Brand Logo -->
                    <div class="flex items-center gap-2">
                        <div
                            class="flex h-10 w-10 transform items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-md shadow-orange-500/20 transition-all hover:scale-105"
                        >
                            <Cookie class="h-6 w-6 animate-pulse" />
                        </div>
                        <span
                            class="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text font-['Outfit',sans-serif] text-2xl font-extrabold tracking-tight text-transparent"
                        >
                            KriukKita
                        </span>
                        <span
                            class="hidden rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-600 sm:inline-block dark:bg-amber-400/10 dark:text-amber-400"
                        >
                            UMKM Unggulan
                        </span>
                    </div>

                    <!-- Navigation Links - Desktop -->
                    <nav class="hidden items-center gap-8 md:flex">
                        <a
                            href="#home"
                            class="text-sm font-semibold text-neutral-600 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-amber-400"
                            >Beranda</a
                        >
                        <a
                            href="#menu"
                            class="text-sm font-semibold text-neutral-600 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-amber-400"
                            >Katalog Menu</a
                        >
                        <a
                            href="#quiz"
                            class="text-sm font-semibold text-neutral-600 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-amber-400"
                            >Kuis Rasa</a
                        >
                        <a
                            href="#about"
                            class="text-sm font-semibold text-neutral-600 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-amber-400"
                            >Mengapa Kami</a
                        >
                        <a
                            href="#testimoni"
                            class="text-sm font-semibold text-neutral-600 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-amber-400"
                            >Ulasan</a
                        >
                    </nav>

                    <!-- Header Actions -->
                    <div class="hidden items-center gap-4 md:flex">
                        <!-- Appearance Mode Switcher -->
                        <button
                            @click="toggleTheme"
                            class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-amber-200/50 bg-amber-50/50 text-neutral-700 transition-all hover:bg-amber-100/50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                            title="Ganti Tema"
                        >
                            <Sun
                                v-if="appearance === 'dark'"
                                class="h-4 w-4 text-amber-400"
                            />
                            <Moon v-else class="h-4 w-4 text-slate-700" />
                        </button>

                        <!-- Preserved Authentication Button -->
                        <Link
                            v-if="$page.props.auth.user"
                            :href="dashboard()"
                            class="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-neutral-950/10 transition-all hover:bg-neutral-800 hover:shadow-lg dark:bg-amber-500 dark:text-neutral-950 dark:shadow-orange-500/10 dark:hover:bg-amber-400"
                        >
                            <span>Dashboard Admin</span>
                            <ArrowRight class="h-4 w-4" />
                        </Link>
                        <template v-else>
                            <Link
                                :href="login()"
                                class="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50/30 px-5 py-2.5 text-sm font-semibold text-orange-700 transition-all hover:bg-amber-100/50 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-amber-400 dark:hover:bg-neutral-800"
                            >
                                Masuk Aplikasi
                            </Link>
                        </template>
                    </div>

                    <!-- Mobile Menu Button -->
                    <div class="flex items-center gap-2 md:hidden">
                        <button
                            @click="toggleTheme"
                            class="mr-1 flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200/50 bg-amber-50/50 text-neutral-700 transition-all dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                        >
                            <Sun
                                v-if="appearance === 'dark'"
                                class="h-4 w-4 text-amber-400"
                            />
                            <Moon v-else class="h-4 w-4" />
                        </button>
                        <button
                            @click="isMobileMenuOpen = !isMobileMenuOpen"
                            class="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-neutral-800 transition-all hover:bg-amber-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                        >
                            <Menu v-if="!isMobileMenuOpen" class="h-5 w-5" />
                            <X v-else class="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Mobile Navigation Overlay -->
            <div
                v-if="isMobileMenuOpen"
                class="border-t border-amber-100 bg-[#FFFDF9] px-4 py-4 shadow-lg md:hidden dark:border-neutral-800 dark:bg-neutral-950"
            >
                <div class="flex flex-col gap-3">
                    <a
                        href="#home"
                        @click="isMobileMenuOpen = false"
                        class="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-amber-50 hover:text-orange-600 dark:hover:bg-neutral-900"
                        >Beranda</a
                    >
                    <a
                        href="#menu"
                        @click="isMobileMenuOpen = false"
                        class="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-amber-50 hover:text-orange-600 dark:hover:bg-neutral-900"
                        >Katalog Menu</a
                    >
                    <a
                        href="#quiz"
                        @click="isMobileMenuOpen = false"
                        class="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-amber-50 hover:text-orange-600 dark:hover:bg-neutral-900"
                        >Kuis Rasa</a
                    >
                    <a
                        href="#about"
                        @click="isMobileMenuOpen = false"
                        class="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-amber-50 hover:text-orange-600 dark:hover:bg-neutral-900"
                        >Mengapa Kami</a
                    >
                    <a
                        href="#testimoni"
                        @click="isMobileMenuOpen = false"
                        class="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-amber-50 hover:text-orange-600 dark:hover:bg-neutral-900"
                        >Ulasan</a
                    >

                    <div
                        class="my-2 border-t border-amber-100/50 pt-2 dark:border-neutral-800"
                    >
                        <Link
                            v-if="$page.props.auth.user"
                            :href="dashboard()"
                            class="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 py-3 text-sm font-semibold text-white shadow-md dark:bg-amber-500 dark:text-neutral-950"
                        >
                            <span>Dashboard Admin</span>
                            <ArrowRight class="h-4 w-4" />
                        </Link>
                        <template v-else>
                            <Link
                                :href="login()"
                                class="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 py-3 text-sm font-semibold text-orange-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-amber-400"
                            >
                                Masuk Aplikasi
                            </Link>
                        </template>
                    </div>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <section
            id="home"
            class="relative z-10 overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32"
        >
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center"
                >
                    <!-- Left: Hero Text -->
                    <div
                        class="space-y-6 text-center lg:col-span-6 lg:text-left"
                    >
                        <div
                            class="inline-flex animate-bounce items-center gap-2 rounded-full border border-orange-200/50 bg-orange-100/80 px-4 py-1.5 text-xs font-semibold text-orange-800 shadow-xs dark:border-orange-900/50 dark:bg-orange-950/50 dark:text-orange-400"
                        >
                            <Sparkles class="h-3.5 w-3.5 text-amber-500" />
                            <span>100% Homemade Tanpa Pengawet</span>
                        </div>

                        <h1
                            class="font-['Outfit',sans-serif] text-4xl leading-tight font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl dark:text-white"
                        >
                            Kriuknya
                            <span
                                class="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent"
                                >Nagih</span
                            >,<br />
                            Rasanya Selalu
                            <span class="relative inline-block">
                                <span class="relative z-10">Juara!</span>
                                <span
                                    class="absolute bottom-1 left-0 -z-1 h-3 w-full bg-amber-200 dark:bg-amber-500/20"
                                ></span>
                            </span>
                        </h1>

                        <p
                            class="mx-auto max-w-xl text-base leading-relaxed text-neutral-600 md:text-lg lg:mx-0 dark:text-neutral-300"
                        >
                            Nikmati kelezatan aneka keripik premium hasil olahan
                            bahan baku lokal terbaik. Diolah secara higienis
                            dengan resep nusantara asli yang menghasilkan
                            kerenyahan tiada tanding.
                        </p>

                        <!-- CTA Actions -->
                        <div
                            class="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start"
                        >
                            <a
                                href="#menu"
                                class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-[1.02] hover:from-orange-500 hover:to-amber-400 hover:shadow-xl sm:w-auto"
                            >
                                <ShoppingBag class="h-5 w-5" />
                                <span>Pesan Sekarang</span>
                            </a>
                            <a
                                href="#quiz"
                                class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-amber-300 bg-amber-50/50 px-8 py-4 text-base font-bold text-orange-800 transition-all duration-300 hover:scale-[1.02] hover:bg-amber-100/80 sm:w-auto dark:border-neutral-800 dark:bg-neutral-900 dark:text-amber-400 dark:hover:bg-neutral-800"
                            >
                                <span>Cari Rasa Khasmu</span>
                                <ArrowRight class="h-5 w-5" />
                            </a>
                        </div>

                        <!-- Mini Trust Badges -->
                        <div
                            class="mx-auto grid max-w-md grid-cols-3 gap-4 border-t border-amber-100/50 pt-6 lg:mx-0 dark:border-neutral-900"
                        >
                            <div
                                class="flex flex-col items-center lg:items-start"
                            >
                                <span
                                    class="text-2xl font-bold text-orange-600 dark:text-amber-400"
                                    >10k+</span
                                >
                                <span
                                    class="text-xs text-neutral-500 dark:text-neutral-400"
                                    >Pecinta Cemilan</span
                                >
                            </div>
                            <div
                                class="flex flex-col items-center lg:items-start"
                            >
                                <span
                                    class="text-2xl font-bold text-orange-600 dark:text-amber-400"
                                    >4.9/5</span
                                >
                                <span
                                    class="text-xs text-neutral-500 dark:text-neutral-400"
                                    >Rating Google</span
                                >
                            </div>
                            <div
                                class="flex flex-col items-center lg:items-start"
                            >
                                <span
                                    class="text-2xl font-bold text-orange-600 dark:text-amber-400"
                                    >100%</span
                                >
                                <span
                                    class="text-xs text-neutral-500 dark:text-neutral-400"
                                    >Bahan Alami</span
                                >
                            </div>
                        </div>
                    </div>

                    <!-- Right: Hero Visual Artwork -->
                    <div
                        class="relative flex items-center justify-center lg:col-span-6"
                    >
                        <div
                            class="relative aspect-square w-full max-w-[480px] rotate-1 transform overflow-hidden rounded-3xl border-4 border-white bg-amber-100 shadow-2xl transition-transform duration-500 hover:rotate-0 dark:border-neutral-900 dark:bg-neutral-900"
                        >
                            <!-- Premium Background Design inside Image Wrapper -->
                            <div
                                class="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-orange-500/10"
                            ></div>

                            <!-- The generated Hero Snack Packaging Image -->
                            <img
                                src="/images/hero.png"
                                alt="KriukKita Premium Snacks"
                                class="h-full w-full transform object-cover transition-all duration-700 hover:scale-105"
                            />

                            <!-- Floating Promo Sticker -->
                            <div
                                class="absolute right-6 bottom-6 rotate-6 transform rounded-2xl border-2 border-orange-500 bg-[#FFFDF9] px-5 py-3 text-neutral-900 shadow-xl transition-transform hover:rotate-0 dark:bg-neutral-900 dark:text-white"
                            >
                                <span
                                    class="block text-xs font-semibold tracking-widest text-orange-600 uppercase dark:text-amber-400"
                                    >Diskon Spesial</span
                                >
                                <span class="block text-xl font-extrabold"
                                    >Beli 3 Gratis 1</span
                                >
                            </div>
                        </div>

                        <!-- Aesthetic shapes floating behind Hero Image -->
                        <div
                            class="absolute -top-6 -left-6 -z-1 hidden h-16 w-16 rounded-full bg-amber-400/20 blur-xl sm:block"
                        ></div>
                        <div
                            class="absolute -right-6 -bottom-6 -z-1 hidden h-24 w-24 rounded-full bg-orange-400/20 blur-xl sm:block"
                        ></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Value Proposition / Features Section -->
        <section
            id="about"
            class="border-y border-amber-100/30 bg-amber-50/40 py-20 dark:border-neutral-900/30 dark:bg-neutral-900/30"
        >
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="mx-auto mb-16 max-w-3xl space-y-3 text-center">
                    <span
                        class="text-xs font-extrabold tracking-widest text-orange-600 uppercase dark:text-amber-400"
                        >Keunggulan Kami</span
                    >
                    <h2
                        class="font-['Outfit',sans-serif] text-3xl font-bold text-neutral-900 sm:text-4xl dark:text-white"
                    >
                        Dibuat dengan Hati untuk Kualitas Terbaik
                    </h2>
                    <p class="text-neutral-600 dark:text-neutral-300">
                        Kami sangat berkomitmen menyajikan produk bermutu tinggi
                        demi kepuasan ngemil Anda sekeluarga.
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <!-- Card 1 -->
                    <div
                        class="group rounded-3xl border border-amber-100/50 bg-[#FFFDF9] p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800/80 dark:bg-neutral-900"
                    >
                        <div
                            class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition-transform group-hover:scale-110 dark:bg-orange-950/50 dark:text-orange-400"
                        >
                            <Leaf class="h-6 w-6" />
                        </div>
                        <h3 class="mb-3 text-xl font-bold">
                            100% Bahan Alami Lokal
                        </h3>
                        <p
                            class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                        >
                            Kami bermitra langsung dengan petani lokal untuk
                            mendapatkan singkong, pisang, dan rempah segar
                            kualitas terbaik di setiap musim.
                        </p>
                    </div>

                    <!-- Card 2 -->
                    <div
                        class="group rounded-3xl border border-amber-100/50 bg-[#FFFDF9] p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800/80 dark:bg-neutral-900"
                    >
                        <div
                            class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 transition-transform group-hover:scale-110 dark:bg-amber-950/50 dark:text-amber-400"
                        >
                            <ShieldCheck class="h-6 w-6" />
                        </div>
                        <h3 class="mb-3 text-xl font-bold">
                            Higienis & Bersertifikat Halal
                        </h3>
                        <p
                            class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                        >
                            Proses produksi dijamin super bersih, sesuai standar
                            kesehatan makanan, dan pastinya 100% Halal untuk
                            dikonsumsi siapa saja.
                        </p>
                    </div>

                    <!-- Card 3 -->
                    <div
                        class="group rounded-3xl border border-amber-100/50 bg-[#FFFDF9] p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800/80 dark:bg-neutral-900"
                    >
                        <div
                            class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600 transition-transform group-hover:scale-110 dark:bg-yellow-950/50 dark:text-yellow-400"
                        >
                            <Award class="h-6 w-6" />
                        </div>
                        <h3 class="mb-3 text-xl font-bold">
                            Resep Nusantara Otentik
                        </h3>
                        <p
                            class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                        >
                            Racikan bumbu tradisional istimewa yang melimpah dan
                            menempel sempurna di setiap kepingan cemilan,
                            menjamin rasa gurih merata.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Best Seller Catalog Section -->
        <section id="menu" class="relative z-10 py-24">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    class="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end"
                >
                    <div class="max-w-xl space-y-3">
                        <span
                            class="text-xs font-extrabold tracking-widest text-orange-600 uppercase dark:text-amber-400"
                            >Varian Best Seller</span
                        >
                        <h2
                            class="font-['Outfit',sans-serif] text-3xl font-bold text-neutral-900 sm:text-4xl dark:text-white"
                        >
                            Menu Cemilan Terfavorit
                        </h2>
                        <p class="text-neutral-600 dark:text-neutral-300">
                            Paling banyak dipesan oleh ribuan pelanggan setia
                            KriukKita. Yuk pilih kriuk favoritmu hari ini!
                        </p>
                    </div>
                    <div>
                        <a
                            :href="getGeneralWhatsAppLink()"
                            target="_blank"
                            class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-bold text-white shadow-md shadow-emerald-600/10 transition-all hover:bg-emerald-500 hover:shadow-lg"
                        >
                            <MessageCircle class="h-5 w-5" />
                            <span>Tanya Menu Lengkap</span>
                        </a>
                    </div>
                </div>

                <!-- Products Grid -->
                <div
                    class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
                >
                    <div
                        v-for="product in products"
                        :key="product.id"
                        class="group flex flex-col overflow-hidden rounded-3xl border border-amber-100/50 bg-[#FFFDF9] shadow-xs transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-2xl dark:border-neutral-800/80 dark:bg-neutral-900"
                    >
                        <!-- Image Container with tag badge -->
                        <div
                            class="relative aspect-square w-full overflow-hidden bg-amber-50/50 dark:bg-neutral-900"
                        >
                            <span
                                class="absolute top-4 left-4 z-10 rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-md"
                            >
                                {{ product.tag }}
                            </span>

                            <img
                                :src="product.image"
                                :alt="product.name"
                                class="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div
                                class="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            >
                                <span
                                    class="flex items-center gap-1 text-xs font-semibold text-white"
                                >
                                    <Sparkles class="h-3 w-3 text-amber-400" />
                                    Klik Pesan Sekarang
                                </span>
                            </div>
                        </div>

                        <!-- Card Content -->
                        <div
                            class="flex flex-1 flex-col justify-between space-y-4 p-6"
                        >
                            <div class="space-y-2">
                                <!-- Rating -->
                                <div class="flex items-center gap-1">
                                    <div class="flex text-amber-400">
                                        <Star
                                            v-for="n in 5"
                                            :key="n"
                                            class="h-3.5 w-3.5 fill-current"
                                        />
                                    </div>
                                    <span
                                        class="text-xs font-bold text-neutral-500 dark:text-neutral-400"
                                    >
                                        {{ product.rating }} ({{
                                            product.reviews
                                        }})
                                    </span>
                                </div>

                                <h3
                                    class="text-lg font-bold text-neutral-900 transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-amber-400"
                                >
                                    {{ product.name }}
                                </h3>

                                <p
                                    class="line-clamp-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400"
                                >
                                    {{ product.description }}
                                </p>
                            </div>

                            <div
                                class="flex items-center justify-between border-t border-amber-100/50 pt-2 dark:border-neutral-800/80"
                            >
                                <div class="flex flex-col">
                                    <span
                                        class="text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500"
                                        >Harga Kemasan</span
                                    >
                                    <span
                                        class="text-lg font-extrabold text-orange-600 dark:text-amber-400"
                                        >{{ formatPrice(product.price) }}</span
                                    >
                                </div>
                                <a
                                    :href="getWhatsAppLink(product.name)"
                                    target="_blank"
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-xs transition-colors hover:bg-orange-500"
                                    title="Pesan via WhatsApp"
                                >
                                    <MessageCircle class="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Interactive Quiz Section ("Flavor Matcher") -->
        <section
            id="quiz"
            class="border-y border-amber-100/30 bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-transparent py-20 dark:border-neutral-900/30 dark:from-amber-950/20 dark:via-neutral-950 dark:to-transparent"
        >
            <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div
                    class="relative overflow-hidden rounded-3xl border border-orange-500/10 bg-[#FFFDF9] p-8 shadow-2xl md:p-12 dark:border-neutral-800/80 dark:bg-neutral-900"
                >
                    <!-- Decorative quiz bg glow -->
                    <div
                        class="absolute top-[-10%] right-[-10%] h-40 w-40 rounded-full bg-orange-400/20 blur-2xl"
                    ></div>

                    <!-- Intro Section -->
                    <div
                        v-if="!quizCompleted"
                        class="relative z-10 space-y-6 text-center"
                    >
                        <div
                            class="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-orange-600 dark:bg-amber-950/50 dark:text-amber-400"
                        >
                            <Sparkles class="h-6 w-6 animate-pulse" />
                        </div>
                        <h2
                            class="font-['Outfit',sans-serif] text-3xl font-extrabold text-neutral-900 dark:text-white"
                        >
                            Bingung Pilih Cemilan? 🤔
                        </h2>
                        <p
                            class="mx-auto max-w-md text-neutral-600 dark:text-neutral-300"
                        >
                            Ikuti kuis 1-detik kami untuk menemukan varian
                            cemilan terbaik yang paling cocok dengan seleramu
                            saat ini!
                        </p>

                        <div
                            class="mx-auto grid max-w-2xl grid-cols-1 gap-4 pt-4 sm:grid-cols-2"
                        >
                            <button
                                v-for="option in quizOptions"
                                :key="option.id"
                                @click="selectQuizFlavor(option.id)"
                                :class="[
                                    'flex cursor-pointer items-center gap-4 rounded-2xl border border-amber-100 p-5 text-left font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-neutral-800',
                                    option.color,
                                ]"
                            >
                                <span class="text-3xl">{{ option.emoji }}</span>
                                <span class="text-sm md:text-base">{{
                                    option.label
                                }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Result Section -->
                    <div v-else class="relative z-10 space-y-8">
                        <div class="space-y-2 text-center">
                            <span
                                class="text-xs font-bold tracking-widest text-emerald-600 uppercase dark:text-emerald-400"
                                >Match Sempurna Ditemukan! 🎉</span
                            >
                            <h3
                                class="font-['Outfit',sans-serif] text-2xl font-extrabold"
                            >
                                Ini Cemilan Paling Cocok Buat Kamu
                            </h3>
                        </div>

                        <div
                            v-if="matchedProduct"
                            class="grid grid-cols-1 items-center gap-8 rounded-2xl border border-amber-100/50 bg-amber-50/40 p-6 md:grid-cols-12 dark:border-neutral-800/80 dark:bg-neutral-900/50"
                        >
                            <!-- Product Image -->
                            <div
                                class="aspect-square overflow-hidden rounded-2xl bg-white shadow-md md:col-span-4 dark:bg-neutral-800"
                            >
                                <img
                                    :src="matchedProduct.image"
                                    :alt="matchedProduct.name"
                                    class="h-full w-full object-cover"
                                />
                            </div>

                            <!-- Product Info -->
                            <div class="space-y-4 md:col-span-8">
                                <div class="flex items-center gap-2">
                                    <span
                                        class="rounded-full bg-orange-600 px-3 py-1 text-[10px] font-extrabold text-white shadow-xs"
                                    >
                                        {{ matchedProduct.tag }}
                                    </span>
                                    <div
                                        class="flex items-center text-amber-400"
                                    >
                                        <Star
                                            class="h-4.5 w-4.5 fill-current"
                                        />
                                        <span
                                            class="ml-1 text-sm font-bold text-neutral-600 dark:text-neutral-300"
                                        >
                                            {{ matchedProduct.rating }}
                                        </span>
                                    </div>
                                </div>

                                <h4
                                    class="text-xl font-bold text-neutral-900 dark:text-white"
                                >
                                    {{ matchedProduct.name }}
                                </h4>
                                <p
                                    class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                                >
                                    {{ matchedProduct.description }}
                                </p>

                                <div
                                    class="flex flex-col items-stretch justify-between gap-4 pt-2 sm:flex-row sm:items-center"
                                >
                                    <div>
                                        <span
                                            class="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase"
                                            >Harga Spesial Kuis</span
                                        >
                                        <span
                                            class="text-2xl font-black text-orange-600 dark:text-amber-400"
                                            >{{
                                                formatPrice(
                                                    matchedProduct.price,
                                                )
                                            }}</span
                                        >
                                    </div>
                                    <div class="flex gap-2">
                                        <button
                                            @click="resetQuiz"
                                            class="cursor-pointer rounded-xl border border-amber-200 px-5 py-3 text-sm font-semibold transition-colors hover:bg-amber-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                        >
                                            Ulangi Kuis
                                        </button>
                                        <a
                                            :href="
                                                getWhatsAppLink(
                                                    matchedProduct.name,
                                                )
                                            "
                                            target="_blank"
                                            class="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-orange-500 hover:shadow-lg"
                                        >
                                            <MessageCircle class="h-5 w-5" />
                                            <span>Pesan Sekarang</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonial Section -->
        <section id="testimoni" class="relative z-10 py-24">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="mx-auto mb-16 max-w-3xl space-y-3 text-center">
                    <span
                        class="text-xs font-extrabold tracking-widest text-orange-600 uppercase dark:text-amber-400"
                        >Testimoni Nyata</span
                    >
                    <h2
                        class="font-['Outfit',sans-serif] text-3xl font-bold text-neutral-900 sm:text-4xl dark:text-white"
                    >
                        Apa Kata Pecinta KriukKita?
                    </h2>
                    <p class="text-neutral-600 dark:text-neutral-300">
                        Lebih dari ribuan testimoni bintang 5 telah terkumpul
                        dari seluruh penjuru Indonesia.
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <!-- Testimonial 1 -->
                    <div
                        class="flex flex-col justify-between space-y-6 rounded-3xl border border-amber-100/50 bg-[#FFFDF9] p-8 shadow-xs transition-all hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900"
                    >
                        <div class="space-y-4">
                            <div class="flex text-amber-400">
                                <Star
                                    v-for="n in 5"
                                    :key="n"
                                    class="h-4.5 w-4.5 fill-current"
                                />
                            </div>
                            <p
                                class="text-sm leading-relaxed text-neutral-600 italic dark:text-neutral-400"
                            >
                                "Sumpah keripik singkong pedas daun jeruknya
                                juara banget! Bumbunya melimpah dan ada daun
                                jeruk aslinya yang bikin wangi segar. Garingnya
                                pas dan ga keras sama sekali!"
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600"
                            >
                                ND
                            </div>
                            <div>
                                <h4 class="text-sm font-bold">
                                    Nabila Dewanti
                                </h4>
                                <span class="text-xs text-neutral-400"
                                    >Ibu Rumah Tangga, Jakarta</span
                                >
                            </div>
                        </div>
                    </div>

                    <!-- Testimonial 2 -->
                    <div
                        class="flex flex-col justify-between space-y-6 rounded-3xl border border-amber-100/50 bg-[#FFFDF9] p-8 shadow-xs transition-all hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900"
                    >
                        <div class="space-y-4">
                            <div class="flex text-amber-400">
                                <Star
                                    v-for="n in 5"
                                    :key="n"
                                    class="h-4.5 w-4.5 fill-current"
                                />
                            </div>
                            <p
                                class="text-sm leading-relaxed text-neutral-600 italic dark:text-neutral-400"
                            >
                                "Gokil pisang cokelat lumernya! Saya biasa beli
                                pisang cokelat yang bikin seret, tapi punya
                                KriukKita ini cokelat Belgia-nya premium banget.
                                Manisnya pas, ga bikin nek. Nagih!"
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-600"
                            >
                                RP
                            </div>
                            <div>
                                <h4 class="text-sm font-bold">Rian Prasetya</h4>
                                <span class="text-xs text-neutral-400"
                                    >Mahasiswa, Bandung</span
                                >
                            </div>
                        </div>
                    </div>

                    <!-- Testimonial 3 -->
                    <div
                        class="flex flex-col justify-between space-y-6 rounded-3xl border border-amber-100/50 bg-[#FFFDF9] p-8 shadow-xs transition-all hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900"
                    >
                        <div class="space-y-4">
                            <div class="flex text-amber-400">
                                <Star
                                    v-for="n in 5"
                                    :key="n"
                                    class="h-4.5 w-4.5 fill-current"
                                />
                            </div>
                            <p
                                class="text-sm leading-relaxed text-neutral-600 italic dark:text-neutral-400"
                            >
                                "Pelayanan ramah banget dan pengiriman super
                                cepat. Paket dibungkus pakai bubble wrap tebal
                                jadi keripiknya aman ga remuk pas nyampe.
                                Basreng pedasnya mantap abis!"
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-600"
                            >
                                AF
                            </div>
                            <div>
                                <h4 class="text-sm font-bold">Amelia Fitri</h4>
                                <span class="text-xs text-neutral-400"
                                    >Karyawan Swasta, Surabaya</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Dynamic CTA Banner Section -->
        <section class="relative z-10 overflow-hidden py-16">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    class="relative space-y-6 rounded-3xl bg-gradient-to-r from-orange-600 to-amber-500 p-8 text-center text-white shadow-2xl md:p-16 dark:from-orange-800 dark:to-amber-600"
                >
                    <!-- Light effect -->
                    <div
                        class="backdrop-blur-2xs absolute inset-0 bg-white/5"
                    ></div>

                    <div class="relative z-10 mx-auto max-w-2xl space-y-4">
                        <h2
                            class="font-['Outfit',sans-serif] text-3xl font-extrabold sm:text-4xl"
                        >
                            Mau Ngemil Enak Tanpa Ribet?
                        </h2>
                        <p class="font-medium text-orange-50 md:text-lg">
                            Dapatkan harga promo khusus minggu ini untuk
                            pemesanan minimal 3 bungkus varian apa saja. Kami
                            siap kirim ke seluruh Indonesia!
                        </p>
                        <div
                            class="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
                        >
                            <a
                                :href="getGeneralWhatsAppLink()"
                                target="_blank"
                                class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-extrabold text-orange-700 shadow-xl transition-all hover:scale-105 hover:bg-neutral-100 sm:w-auto"
                            >
                                <MessageCircle
                                    class="h-5 w-5 text-orange-600"
                                />
                                <span>Pesan Sekarang via WA</span>
                            </a>
                            <span
                                class="text-xs font-semibold opacity-90 sm:text-sm"
                                >atau hubungi admin kami (0812-3456-7890)</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer
            class="dark:bg-neutral-980 border-t border-neutral-800 bg-neutral-900 pt-16 pb-8 text-neutral-300 transition-colors duration-300"
        >
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    class="grid grid-cols-1 gap-12 border-b border-neutral-800 pb-12 md:grid-cols-4"
                >
                    <!-- Brand column -->
                    <div class="space-y-4">
                        <div class="flex items-center gap-2">
                            <div
                                class="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white"
                            >
                                <Cookie class="h-5 w-5" />
                            </div>
                            <span
                                class="font-['Outfit',sans-serif] text-xl font-black tracking-tight text-white"
                                >KriukKita</span
                            >
                        </div>
                        <p class="text-xs leading-relaxed text-neutral-400">
                            KriukKita adalah usaha mikro kuliner nusantara yang
                            berfokus menyajikan aneka keripik kering premium
                            tradisional dengan kemasan modern berkelas.
                        </p>
                    </div>

                    <!-- Navigation Link column -->
                    <div class="space-y-4">
                        <h4
                            class="text-sm font-bold tracking-wider text-white uppercase"
                        >
                            Navigasi
                        </h4>
                        <ul class="space-y-2 text-xs">
                            <li>
                                <a
                                    href="#home"
                                    class="transition-colors hover:text-amber-400"
                                    >Beranda</a
                                >
                            </li>
                            <li>
                                <a
                                    href="#menu"
                                    class="transition-colors hover:text-amber-400"
                                    >Katalog Menu</a
                                >
                            </li>
                            <li>
                                <a
                                    href="#quiz"
                                    class="transition-colors hover:text-amber-400"
                                    >Kuis Rasa</a
                                >
                            </li>
                            <li>
                                <a
                                    href="#about"
                                    class="transition-colors hover:text-amber-400"
                                    >Mengapa Kami</a
                                >
                            </li>
                        </ul>
                    </div>

                    <!-- Contact column -->
                    <div class="space-y-4">
                        <h4
                            class="text-sm font-bold tracking-wider text-white uppercase"
                        >
                            Hubungi Kami
                        </h4>
                        <ul class="space-y-2 text-xs text-neutral-400">
                            <li class="flex items-center gap-2">
                                <PhoneCall class="h-3.5 w-3.5 text-amber-400" />
                                <span>+62 812-3456-7890</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <MessageCircle
                                    class="h-3.5 w-3.5 text-amber-400"
                                />
                                <span>kriukkita@umkm.co.id</span>
                            </li>
                            <li>
                                Jl. Cemilan Lezat No. 99, Bandung, Jawa Barat
                            </li>
                        </ul>
                    </div>

                    <!-- Dynamic operation info -->
                    <div class="space-y-4">
                        <h4
                            class="text-sm font-bold tracking-wider text-white uppercase"
                        >
                            Jam Operasional
                        </h4>
                        <ul class="space-y-2 text-xs text-neutral-400">
                            <li class="flex items-center gap-1.5">
                                <Clock class="h-3.5 w-3.5 text-amber-400" />
                                <span>Senin - Sabtu: 08.00 - 18.00 WIB</span>
                            </li>
                            <li class="font-semibold text-orange-500">
                                Hari Minggu & Libur Nasional Tutup
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Copyright -->
                <div
                    class="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-neutral-500 sm:flex-row"
                >
                    <p>
                        &copy; 2026 KriukKita Snacks. Seluruh Hak Cipta
                        Dilindungi Undang-Undang.
                    </p>
                    <div class="flex gap-4">
                        <Link
                            :href="login()"
                            class="transition-colors hover:text-neutral-400"
                            >Portal Admin</Link
                        >
                        <span>&bull;</span>
                        <a
                            href="#"
                            class="transition-colors hover:text-neutral-400"
                            >Kebijakan Privasi</a
                        >
                    </div>
                </div>
            </div>
        </footer>

        <!-- Floating WhatsApp Button -->
        <a
            :href="getGeneralWhatsAppLink()"
            target="_blank"
            class="fixed right-6 bottom-6 z-50 flex h-14 w-14 transform animate-bounce items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl transition-all hover:scale-110 hover:bg-emerald-400 active:scale-95"
            title="Chat Admin WhatsApp"
        >
            <MessageCircle class="h-7 w-7" />
        </a>
    </div>
</template>

<style>
/* Custom animations & smoothing */
html {
    scroll-behavior: smooth;
}

/* Fine-tune outfit font layout */
.font-outfit {
    font-family: 'Outfit', sans-serif;
}
</style>
