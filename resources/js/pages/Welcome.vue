<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
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
    Search,
    ShoppingBag,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    Award,
    ShieldCheck,
    Leaf,
    Clock,
    ThumbsUp,
    TrendingUp,
    Tag,
} from 'lucide-vue-next';
import { ref, computed } from 'vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { useAppearance } from '@/composables/useAppearance';
import { dashboard, login } from '@/routes';

interface Promo {
    nama: string;
    label: string;
    tipe: 'persen' | 'nominal';
    nilai: number;
    sisa_hari: number;
    tanggal_selesai: string;
}

interface BestSeller {
    id_produk: number;
    nama: string;
    harga_jual: number;
    foto_url: string | null;
    total_terjual: number;
    promo: Promo | null;
}

interface Product {
    id_produk: number;
    nama: string;
    kategori: string | null;
    harga_jual: number;
    stok: number;
    foto_url: string | null;
    promo: Promo | null;
}

interface CartItem {
    id_produk: number;
    nama: string;
    harga_jual: number;
    foto_url: string | null;
    quantity: number;
}

const props = defineProps<{
    bestSellers: BestSeller[];
    allProducts: Product[];
}>();

const { appearance, updateAppearance } = useAppearance();

const isMobileMenuOpen = ref(false);

const toggleTheme = () => {
    updateAppearance(appearance.value === 'dark' ? 'light' : 'dark');
};

const getRankTag = (index: number): string => {
    if (index === 0) return 'Terlaris 🔥';
    if (index === 1) return '#2 Best Seller';
    if (index === 2) return '#3 Favorit';
    return `#${index + 1} Pilihan`;
};

// Static data for the flavor quiz section only
const quizProducts = [
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
    if (!selectedFlavor.value) {
        return null;
    }

    return (
        quizProducts.find((p) => p.flavorType === selectedFlavor.value) ||
        quizProducts[0]
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

// Nomor WhatsApp tujuan (admin Cemilan Mba Tutut)
const WHATSAPP_NUMBER = '6281254744177';

// WhatsApp Direct Link Generator
const getWhatsAppLink = (productName: string) => {
    const message = encodeURIComponent(
        `Halo Kak! Saya tertarik untuk memesan produk Cemilan "${productName}" dari Cemilan Mba Tutut. Bagaimana cara memesannya ya?`,
    );

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};

const getGeneralWhatsAppLink = () => {
    const message = encodeURIComponent(
        'Halo Cemilan Mba Tutut! Saya ingin tahu lebih lanjut tentang aneka cemilan & frozen food yang tersedia. Boleh minta daftar menunya?',
    );

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};

// ===== Shopping Cart State & Logic =====
const cart = ref<CartItem[]>([]);
const isCartOpen = ref(false);

const cartItemCount = computed(() =>
    cart.value.reduce((sum, item) => sum + item.quantity, 0),
);

const cartTotal = computed(() =>
    cart.value.reduce((sum, item) => sum + item.harga_jual * item.quantity, 0),
);

// Menerima Product (katalog) maupun BestSeller (produk favorit) —
// keduanya berbagi field minimal yang dibutuhkan keranjang.
type AddableProduct = Pick<
    CartItem,
    'id_produk' | 'nama' | 'harga_jual' | 'foto_url'
>;

const addToCart = (product: AddableProduct) => {
    const existing = cart.value.find(
        (item) => item.id_produk === product.id_produk,
    );

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.value.push({
            id_produk: product.id_produk,
            nama: product.nama,
            harga_jual: product.harga_jual,
            foto_url: product.foto_url,
            quantity: 1,
        });
    }

    // Jangan auto-buka keranjang — cukup tampilkan notifikasi singkat.
    showToast(`${product.nama} ditambahkan ke keranjang`);
};

const increaseQty = (id: number) => {
    const item = cart.value.find((i) => i.id_produk === id);
    if (item) {
        item.quantity += 1;
    }
};

const decreaseQty = (id: number) => {
    const item = cart.value.find((i) => i.id_produk === id);
    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            removeFromCart(id);
        }
    }
};

const removeFromCart = (id: number) => {
    cart.value = cart.value.filter((i) => i.id_produk !== id);
};

const clearCart = () => {
    cart.value = [];
};

// ===== Toast Notification (feedback tambah ke keranjang) =====
const toastMessage = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const showToast = (message: string) => {
    toastMessage.value = message;
    if (toastTimer) {
        clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(() => {
        toastMessage.value = null;
    }, 2200);
};

// ===== Product Search =====
const searchQuery = ref('');

const filteredProducts = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) {
        return props.allProducts;
    }

    return props.allProducts.filter((product) => {
        const haystack = `${product.nama} ${product.kategori ?? ''}`.toLowerCase();
        return haystack.includes(query);
    });
});

// Checkout: kirim pesan otomatis via WhatsApp (TANPA mengurangi stok)
const checkoutViaWhatsApp = () => {
    if (cart.value.length === 0) {
        return;
    }

    const lines = cart.value.map(
        (item, index) =>
            `${index + 1}. ${item.nama}\n   ${item.quantity} x ${formatPrice(item.harga_jual)} = ${formatPrice(item.harga_jual * item.quantity)}`,
    );

    const message =
        `Halo Cemilan Mba Tutut! 👋\nSaya ingin memesan cemilan berikut:\n\n` +
        `${lines.join('\n')}\n\n` +
        `*Total Pesanan: ${formatPrice(cartTotal.value)}*\n\n` +
        `Mohon info ketersediaan dan ongkos kirimnya ya. Terima kasih! 🙏`;

    window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        '_blank',
    );
};

// Formatting helper
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
};

// Teks sisa masa berlaku promo
const promoSisaText = (sisaHari: number) => {
    if (sisaHari <= 0) {
        return 'Berakhir hari ini';
    }
    if (sisaHari === 1) {
        return 'Sisa 1 hari lagi';
    }
    return `Sisa ${sisaHari} hari lagi`;
};
</script>

<template>
    <Head title="Cemilan Mba Tutut - Aneka Cemilan & Frozen Food Barabai">
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
                            <AppLogoIcon class="h-6 w-6" />
                        </div>
                        <span
                            class="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text font-['Outfit',sans-serif] text-xl font-extrabold tracking-tight text-transparent sm:text-2xl"
                        >
                            Cemilan Mba Tutut
                        </span>
                        <span
                            class="hidden rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-600 sm:inline-block dark:bg-amber-400/10 dark:text-amber-400"
                        >
                            UMKM Barabai
                        </span>
                    </div>

                    <!-- Navigation Links - Desktop -->
                    <nav class="hidden items-center gap-6 lg:flex xl:gap-8">
                        <a
                            href="#home"
                            class="text-sm font-semibold text-neutral-600 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-amber-400"
                            >Beranda</a
                        >
                        <a
                            href="#menu"
                            class="text-sm font-semibold text-neutral-600 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-amber-400"
                            >Best Seller</a
                        >
                        <a
                            href="#katalog"
                            class="text-sm font-semibold text-neutral-600 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-amber-400"
                            >Katalog</a
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
                    <div class="hidden items-center gap-4 lg:flex">
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
                    <div class="flex items-center gap-2 lg:hidden">
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
                class="border-t border-amber-100 bg-[#FFFDF9] px-4 py-4 shadow-lg lg:hidden dark:border-neutral-800 dark:bg-neutral-950"
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
                        >Best Seller</a
                    >
                    <a
                        href="#katalog"
                        @click="isMobileMenuOpen = false"
                        class="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-amber-50 hover:text-orange-600 dark:hover:bg-neutral-900"
                        >Katalog</a
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
                            Nikmati aneka cemilan serba 10 ribuan, dari yang
                            jadul sampai kekinian, plus frozen food seperti
                            pancake durian & ice cream. Cemilan rumahan khas
                            Barabai yang bikin nagih.
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
                                    >10K</span
                                >
                                <span
                                    class="text-xs text-neutral-500 dark:text-neutral-400"
                                    >Aneka Cemilan</span
                                >
                            </div>
                            <div
                                class="flex flex-col items-center lg:items-start"
                            >
                                <span
                                    class="text-2xl font-bold text-orange-600 dark:text-amber-400"
                                    >Frozen</span
                                >
                                <span
                                    class="text-xs text-neutral-500 dark:text-neutral-400"
                                    >Food Tersedia</span
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
                                    >Homemade</span
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
                                alt="Aneka Cemilan Mba Tutut Barabai"
                                class="h-full w-full transform object-cover transition-all duration-700 hover:scale-105"
                            />

                            <!-- Floating Promo Sticker -->
                            <div
                                class="absolute right-6 bottom-6 rotate-6 transform rounded-2xl border-2 border-orange-500 bg-[#FFFDF9] px-5 py-3 text-neutral-900 shadow-xl transition-transform hover:rotate-0 dark:bg-neutral-900 dark:text-white"
                            >
                                <span
                                    class="block text-xs font-semibold tracking-widest text-orange-600 uppercase dark:text-amber-400"
                                    >Harga Hemat</span
                                >
                                <span class="block text-xl font-extrabold"
                                    >Serba 10 Ribu</span
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
                            Higienis & Selalu Fresh
                        </h3>
                        <p
                            class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                        >
                            Diolah dengan proses yang bersih dan rapi. Cemilan
                            selalu dibuat fresh, dan frozen food disimpan dengan
                            baik agar kualitasnya tetap terjaga sampai ke tangan
                            Anda.
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
                            Pilihan Lengkap & Kekinian
                        </h3>
                        <p
                            class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                        >
                            Dari cemilan jadul yang bikin kangen sampai varian
                            kekinian, ditambah frozen food seperti pancake durian
                            dan ice cream. Lengkap untuk segala suasana.
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
                            Paling banyak dipesan oleh pelanggan setia Cemilan
                            Mba Tutut. Yuk pilih kriuk favoritmu hari ini!
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
                    v-if="props.bestSellers.length > 0"
                    class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5"
                >
                    <div
                        v-for="(product, index) in props.bestSellers"
                        :key="product.id_produk"
                        class="group flex flex-col overflow-hidden rounded-2xl border border-amber-100/50 bg-[#FFFDF9] shadow-xs transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-2xl sm:rounded-3xl dark:border-neutral-800/80 dark:bg-neutral-900"
                    >
                        <!-- Image Container with rank badge -->
                        <div
                            class="relative aspect-square w-full overflow-hidden bg-amber-50/50 dark:bg-neutral-900"
                        >
                            <span
                                :class="[
                                    'absolute top-3 left-3 z-10 rounded-lg px-2 py-1 text-[10px] font-extrabold text-white shadow-md sm:top-4 sm:left-4 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs',
                                    index === 0 ? 'bg-orange-600' : 'bg-neutral-700',
                                ]"
                            >
                                {{ getRankTag(index) }}
                            </span>

                            <!-- Promo ribbon -->
                            <span
                                v-if="product.promo"
                                class="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 px-2 py-1 text-[10px] font-extrabold text-white shadow-md sm:top-4 sm:right-4"
                            >
                                <Tag class="h-3 w-3" />
                                {{ product.promo.label }}
                            </span>

                            <img
                                :src="product.foto_url || '/images/hero.png'"
                                :alt="product.nama"
                                class="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        <!-- Card Content -->
                        <div
                            class="flex flex-1 flex-col justify-between gap-3 p-3 sm:p-5"
                        >
                            <div class="space-y-1.5">
                                <!-- Total Terjual -->
                                <div class="flex items-center gap-1.5">
                                    <TrendingUp class="h-3.5 w-3.5 shrink-0 text-orange-500" />
                                    <span
                                        class="text-[11px] font-bold text-neutral-500 sm:text-xs dark:text-neutral-400"
                                    >
                                        {{ product.total_terjual.toLocaleString('id-ID') }} terjual
                                    </span>
                                </div>

                                <h3
                                    class="line-clamp-2 text-sm font-bold leading-snug text-neutral-900 transition-colors group-hover:text-orange-600 sm:text-base dark:text-white dark:group-hover:text-amber-400"
                                >
                                    {{ product.nama }}
                                </h3>
                            </div>

                            <div class="space-y-2.5">
                                <span
                                    class="block text-base font-extrabold text-orange-600 sm:text-lg dark:text-amber-400"
                                    >{{ formatPrice(product.harga_jual) }}</span
                                >

                                <!-- Promo info: promo apa + sisa masa berlaku -->
                                <div
                                    v-if="product.promo"
                                    class="space-y-1 rounded-xl border border-red-200/70 bg-red-50/70 p-2 dark:border-red-900/40 dark:bg-red-950/30"
                                >
                                    <div class="flex items-center gap-1.5">
                                        <Tag class="h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400" />
                                        <span class="line-clamp-1 text-[11px] font-bold text-red-700 dark:text-red-300">
                                            {{ product.promo.nama }}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-1.5">
                                        <Clock class="h-3.5 w-3.5 shrink-0 text-red-500 dark:text-red-400" />
                                        <span class="text-[11px] font-semibold text-red-600 dark:text-red-400">
                                            {{ promoSisaText(product.promo.sisa_hari) }}
                                        </span>
                                    </div>
                                </div>

                                <div class="flex items-center gap-2">
                                    <button
                                        @click="addToCart(product)"
                                        class="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-3 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-orange-500 active:scale-95"
                                    >
                                        <Plus class="h-4 w-4" />
                                        <span>Keranjang</span>
                                    </button>
                                    <a
                                        :href="getWhatsAppLink(product.nama)"
                                        target="_blank"
                                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs transition-colors hover:bg-emerald-500"
                                        title="Pesan langsung via WhatsApp"
                                    >
                                        <MessageCircle class="h-5 w-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty state -->
                <div
                    v-else
                    class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-amber-200 py-20 text-center dark:border-neutral-700"
                >
                    <ShoppingBag class="mb-4 h-12 w-12 text-amber-300 dark:text-neutral-600" />
                    <p class="text-neutral-500 dark:text-neutral-400">Belum ada produk tersedia.</p>
                </div>
            </div>
        </section>

        <!-- Full Product Catalog Section -->
        <section
            id="katalog"
            class="relative z-10 border-t border-amber-100/30 bg-amber-50/30 py-24 dark:border-neutral-900/30 dark:bg-neutral-900/20"
        >
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="mx-auto mb-10 max-w-2xl space-y-3 text-center sm:mb-12">
                    <span
                        class="text-xs font-extrabold tracking-widest text-orange-600 uppercase dark:text-amber-400"
                        >Katalog Lengkap</span
                    >
                    <h2
                        class="font-['Outfit',sans-serif] text-2xl font-bold text-neutral-900 sm:text-4xl dark:text-white"
                    >
                        Semua Produk Cemilan Kami
                    </h2>
                    <p class="text-sm text-neutral-600 sm:text-base dark:text-neutral-300">
                        Tambahkan cemilan favoritmu ke keranjang, lalu checkout
                        langsung lewat WhatsApp. Mudah & cepat!
                    </p>
                </div>

                <!-- Search Bar -->
                <div class="mx-auto mb-10 max-w-xl">
                    <div class="relative">
                        <Search
                            class="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-neutral-400"
                        />
                        <input
                            v-model="searchQuery"
                            type="text"
                            inputmode="search"
                            placeholder="Cari cemilan favoritmu..."
                            class="w-full rounded-2xl border border-amber-200 bg-white py-3.5 pr-12 pl-12 text-sm font-medium text-neutral-800 shadow-xs transition-all outline-none placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
                        />
                        <button
                            v-if="searchQuery"
                            @click="searchQuery = ''"
                            class="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-amber-50 hover:text-neutral-700 dark:hover:bg-neutral-800"
                            title="Hapus pencarian"
                        >
                            <X class="h-4 w-4" />
                        </button>
                    </div>
                    <p
                        v-if="searchQuery"
                        class="mt-3 text-center text-xs text-neutral-500 dark:text-neutral-400"
                    >
                        Menampilkan {{ filteredProducts.length }} produk untuk
                        "<span class="font-semibold text-orange-600 dark:text-amber-400">{{ searchQuery }}</span>"
                    </p>
                </div>

                <!-- Catalog Grid -->
                <div
                    v-if="filteredProducts.length > 0"
                    class="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
                >
                    <div
                        v-for="product in filteredProducts"
                        :key="product.id_produk"
                        class="group flex flex-col overflow-hidden rounded-2xl border border-amber-100/50 bg-[#FFFDF9] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl sm:rounded-3xl dark:border-neutral-800/80 dark:bg-neutral-900"
                    >
                        <!-- Image -->
                        <div
                            class="relative aspect-square w-full overflow-hidden bg-amber-50/50 dark:bg-neutral-900"
                        >
                            <span
                                v-if="product.kategori"
                                class="absolute top-3 left-3 z-10 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold text-orange-600 shadow-xs dark:bg-neutral-800/90 dark:text-amber-400"
                            >
                                {{ product.kategori }}
                            </span>
                            <!-- Promo ribbon -->
                            <span
                                v-if="product.promo"
                                class="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 px-2 py-1 text-[10px] font-extrabold text-white shadow-md"
                            >
                                <Tag class="h-3 w-3" />
                                {{ product.promo.label }}
                            </span>
                            <img
                                :src="product.foto_url || '/images/hero.png'"
                                :alt="product.nama"
                                class="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        <!-- Content -->
                        <div
                            class="flex flex-1 flex-col justify-between gap-3 p-3 sm:p-4"
                        >
                            <h3
                                class="line-clamp-2 text-sm font-bold leading-snug text-neutral-900 transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-amber-400"
                            >
                                {{ product.nama }}
                            </h3>

                            <div class="space-y-2.5">
                                <span
                                    class="block text-base font-extrabold text-orange-600 dark:text-amber-400"
                                    >{{ formatPrice(product.harga_jual) }}</span
                                >

                                <!-- Promo info: promo apa + sisa masa berlaku -->
                                <div
                                    v-if="product.promo"
                                    class="space-y-1 rounded-xl border border-red-200/70 bg-red-50/70 p-2 dark:border-red-900/40 dark:bg-red-950/30"
                                >
                                    <div class="flex items-center gap-1.5">
                                        <Tag class="h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400" />
                                        <span class="line-clamp-1 text-[11px] font-bold text-red-700 dark:text-red-300">
                                            {{ product.promo.nama }}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-1.5">
                                        <Clock class="h-3.5 w-3.5 shrink-0 text-red-500 dark:text-red-400" />
                                        <span class="text-[11px] font-semibold text-red-600 dark:text-red-400">
                                            {{ promoSisaText(product.promo.sisa_hari) }}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    @click="addToCart(product)"
                                    class="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-3 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-orange-500 active:scale-95"
                                >
                                    <Plus class="h-4 w-4" />
                                    <span>Keranjang</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- No search result -->
                <div
                    v-else-if="props.allProducts.length > 0"
                    class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-amber-200 py-16 text-center dark:border-neutral-700"
                >
                    <Search class="mb-4 h-12 w-12 text-amber-300 dark:text-neutral-600" />
                    <p class="font-bold text-neutral-700 dark:text-neutral-300">
                        Produk tidak ditemukan
                    </p>
                    <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Coba kata kunci lain ya.
                    </p>
                    <button
                        @click="searchQuery = ''"
                        class="mt-4 cursor-pointer rounded-xl border border-amber-200 px-5 py-2.5 text-sm font-semibold text-orange-700 transition-colors hover:bg-amber-50 dark:border-neutral-700 dark:text-amber-400 dark:hover:bg-neutral-800"
                    >
                        Reset Pencarian
                    </button>
                </div>

                <!-- Empty state -->
                <div
                    v-else
                    class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-amber-200 py-20 text-center dark:border-neutral-700"
                >
                    <ShoppingBag class="mb-4 h-12 w-12 text-amber-300 dark:text-neutral-600" />
                    <p class="text-neutral-500 dark:text-neutral-400">Belum ada produk tersedia.</p>
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
                        Apa Kata Pelanggan Kami?
                    </h2>
                    <p class="text-neutral-600 dark:text-neutral-300">
                        Cerita dari pelanggan setia di Barabai dan sekitarnya
                        yang sudah mencoba cemilan kami.
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
                                NJ
                            </div>
                            <div>
                                <h4 class="text-sm font-bold">
                                    Norjannah
                                </h4>
                                <span class="text-xs text-neutral-400"
                                    >Ibu Rumah Tangga, Barabai</span
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
                                "Langganan frozen food-nya, pancake duriannya
                                enak banget dan duriannya berasa! Cemilan serba
                                10 ribunya juga banyak pilihan. Cocok buat stok
                                di rumah. Mantap Mba Tutut!"
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-600"
                            >
                                MR
                            </div>
                            <div>
                                <h4 class="text-sm font-bold">M. Rizki</h4>
                                <span class="text-xs text-neutral-400"
                                    >Mahasiswa, Kandangan</span
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
                                "Pelayanan ramah banget dan ordernya gampang
                                lewat WhatsApp. Cemilannya fresh, basreng
                                pedasnya mantap abis. Sering jadi langganan kalau
                                ada acara keluarga!"
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-600"
                            >
                                HW
                            </div>
                            <div>
                                <h4 class="text-sm font-bold">Hesti Wulandari</h4>
                                <span class="text-xs text-neutral-400"
                                    >Karyawan Swasta, Amuntai</span
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
                            Pesan cemilan & frozen food favoritmu langsung lewat
                            WhatsApp. Bisa diantar di area Barabai & sekitarnya,
                            atau ambil langsung di tempat. Praktis!
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
                                >atau hubungi admin kami (0812-5474-4177)</span
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
                    class="grid grid-cols-2 gap-8 border-b border-neutral-800 pb-10 md:grid-cols-4 md:gap-12 md:pb-12"
                >
                    <!-- Brand column -->
                    <div class="col-span-2 space-y-4 md:col-span-1">
                        <div class="flex items-center gap-2">
                            <div
                                class="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white"
                            >
                                <AppLogoIcon class="h-5 w-5" />
                            </div>
                            <span
                                class="font-['Outfit',sans-serif] text-xl font-black tracking-tight text-white"
                                >Cemilan Mba Tutut</span
                            >
                        </div>
                        <p class="text-xs leading-relaxed text-neutral-400">
                            Cemilan Mba Tutut adalah UMKM asal Barabai yang
                            menyajikan aneka cemilan serba 10 ribuan, kue kering,
                            dan frozen food rumahan. Enak, terjangkau, dan bikin
                            nagih.
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
                                    >Best Seller</a
                                >
                            </li>
                            <li>
                                <a
                                    href="#katalog"
                                    class="transition-colors hover:text-amber-400"
                                    >Katalog Produk</a
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
                                <span>+62 812-5474-4177</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <MessageCircle
                                    class="h-3.5 w-3.5 text-amber-400"
                                />
                                <span>@rumahcemilan_mbatutut12barabai</span>
                            </li>
                            <li>
                                Jl. Putera Harapan, Matang Ginalun, Barabai, Hulu
                                Sungai Tengah, Kalimantan Selatan
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
                        &copy; 2026 Cemilan Mba Tutut Barabai. Seluruh Hak Cipta
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
            class="fixed right-6 bottom-6 z-50 flex h-14 w-14 transform items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl transition-all hover:scale-110 hover:bg-emerald-400 active:scale-95"
            title="Chat Admin WhatsApp"
        >
            <MessageCircle class="h-7 w-7" />
        </a>

        <!-- Floating Cart Button -->
        <button
            @click="isCartOpen = true"
            class="fixed right-6 bottom-24 z-50 flex h-14 w-14 transform cursor-pointer items-center justify-center rounded-full bg-orange-600 text-white shadow-2xl transition-all hover:scale-110 hover:bg-orange-500 active:scale-95"
            title="Buka Keranjang"
        >
            <ShoppingCart class="h-7 w-7" />
            <span
                v-if="cartItemCount > 0"
                class="absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[#FFFDF9] bg-red-500 px-1.5 text-xs font-extrabold text-white dark:border-neutral-950"
            >
                {{ cartItemCount }}
            </span>
        </button>

        <!-- Cart Drawer -->
        <transition name="fade">
            <div
                v-if="isCartOpen"
                class="fixed inset-0 z-[60] bg-neutral-950/50 backdrop-blur-sm"
                @click="isCartOpen = false"
            ></div>
        </transition>

        <transition name="slide">
            <aside
                v-if="isCartOpen"
                class="fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col bg-[#FFFDF9] shadow-2xl dark:bg-neutral-950"
            >
                <!-- Drawer Header -->
                <div
                    class="flex items-center justify-between border-b border-amber-100/60 px-4 py-4 sm:px-6 sm:py-5 dark:border-neutral-800"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-amber-400"
                        >
                            <ShoppingCart class="h-5 w-5" />
                        </div>
                        <div>
                            <h3
                                class="font-['Outfit',sans-serif] text-lg font-extrabold text-neutral-900 dark:text-white"
                            >
                                Keranjang Belanja
                            </h3>
                            <p class="text-xs text-neutral-500 dark:text-neutral-400">
                                {{ cartItemCount }} item dipilih
                            </p>
                        </div>
                    </div>
                    <button
                        @click="isCartOpen = false"
                        class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-amber-50 hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-white"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <!-- Cart Items List -->
                <div class="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                    <div
                        v-if="cart.length > 0"
                        class="space-y-3"
                    >
                        <div
                            v-for="item in cart"
                            :key="item.id_produk"
                            class="flex gap-3 rounded-2xl border border-amber-100/70 bg-white p-2.5 shadow-xs transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <img
                                :src="item.foto_url || '/images/hero.png'"
                                :alt="item.nama"
                                class="h-20 w-20 shrink-0 rounded-xl object-cover"
                            />
                            <div class="flex min-w-0 flex-1 flex-col justify-between gap-2">
                                <!-- Title + remove -->
                                <div class="flex items-start justify-between gap-2">
                                    <div class="min-w-0">
                                        <h4
                                            class="line-clamp-2 text-sm leading-snug font-bold text-neutral-900 dark:text-white"
                                        >
                                            {{ item.nama }}
                                        </h4>
                                        <p
                                            class="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500"
                                        >
                                            {{ formatPrice(item.harga_jual) }} / pcs
                                        </p>
                                    </div>
                                    <button
                                        @click="removeFromCart(item.id_produk)"
                                        class="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                                        title="Hapus item"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </button>
                                </div>

                                <!-- Quantity stepper + subtotal -->
                                <div class="flex items-center justify-between gap-2">
                                    <div
                                        class="inline-flex items-center gap-1 rounded-full bg-amber-50 p-1 dark:bg-neutral-800"
                                    >
                                        <button
                                            @click="decreaseQty(item.id_produk)"
                                            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white text-neutral-700 shadow-xs transition-colors hover:text-orange-600 dark:bg-neutral-700 dark:text-neutral-200"
                                            :title="item.quantity === 1 ? 'Hapus item' : 'Kurangi'"
                                        >
                                            <Minus class="h-3.5 w-3.5" />
                                        </button>
                                        <span
                                            class="w-7 text-center text-sm font-extrabold text-neutral-900 dark:text-white"
                                            >{{ item.quantity }}</span
                                        >
                                        <button
                                            @click="increaseQty(item.id_produk)"
                                            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white text-neutral-700 shadow-xs transition-colors hover:text-orange-600 dark:bg-neutral-700 dark:text-neutral-200"
                                            title="Tambah"
                                        >
                                            <Plus class="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <span
                                        class="text-sm font-extrabold text-orange-600 dark:text-amber-400"
                                        >{{ formatPrice(item.harga_jual * item.quantity) }}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Empty Cart -->
                    <div
                        v-else
                        class="flex h-full flex-col items-center justify-center py-20 text-center"
                    >
                        <div
                            class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-neutral-900"
                        >
                            <ShoppingCart
                                class="h-8 w-8 text-amber-300 dark:text-neutral-600"
                            />
                        </div>
                        <p class="font-bold text-neutral-700 dark:text-neutral-300">
                            Keranjang masih kosong
                        </p>
                        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Yuk pilih cemilan favoritmu dulu!
                        </p>
                        <button
                            @click="isCartOpen = false"
                            class="mt-5 cursor-pointer rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-500"
                        >
                            Lihat Produk
                        </button>
                    </div>
                </div>

                <!-- Drawer Footer / Checkout -->
                <div
                    v-if="cart.length > 0"
                    class="space-y-3 border-t border-amber-100/60 bg-[#FFFDF9] px-4 py-4 sm:px-6 sm:py-5 dark:border-neutral-800 dark:bg-neutral-950"
                >
                    <div
                        class="flex items-center justify-between rounded-2xl bg-amber-50/70 px-4 py-3 dark:bg-neutral-900"
                    >
                        <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-300"
                            >Total ({{ cartItemCount }} item)</span
                        >
                        <span
                            class="font-['Outfit',sans-serif] text-xl font-black text-orange-600 sm:text-2xl dark:text-amber-400"
                            >{{ formatPrice(cartTotal) }}</span
                        >
                    </div>
                    <button
                        @click="checkoutViaWhatsApp"
                        class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-xl active:scale-[0.98]"
                    >
                        <MessageCircle class="h-5 w-5" />
                        <span>Checkout via WhatsApp</span>
                    </button>
                    <div class="flex items-center justify-between gap-3">
                        <button
                            @click="isCartOpen = false"
                            class="flex-1 cursor-pointer rounded-xl border border-amber-200 px-4 py-2.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-amber-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
                        >
                            Lanjut Belanja
                        </button>
                        <button
                            @click="clearCart"
                            class="flex-1 cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold text-neutral-400 transition-colors hover:text-red-500"
                        >
                            Kosongkan
                        </button>
                    </div>
                </div>
            </aside>
        </transition>

        <!-- Toast Notification (feedback tambah ke keranjang) -->
        <div
            class="pointer-events-none fixed inset-x-0 top-24 z-[80] flex justify-center px-4"
        >
            <transition name="toast">
                <div
                    v-if="toastMessage"
                    class="pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl dark:bg-white dark:text-neutral-900"
                >
                    <CheckCircle2
                        class="h-5 w-5 shrink-0 text-emerald-400 dark:text-emerald-500"
                    />
                    <span class="line-clamp-2">{{ toastMessage }}</span>
                </div>
            </transition>
        </div>
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

/* Cart drawer transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

/* Toast transition */
.toast-enter-active,
.toast-leave-active {
    transition:
        opacity 0.3s ease,
        transform 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(-12px);
}
</style>
