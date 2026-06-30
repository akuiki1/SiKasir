<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    Sparkles,
    MessageCircle,
    PhoneCall,
    CheckCircle2,
    Moon,
    Sun,
    ArrowRight,
    Menu,
    X,
    Search,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    ShieldCheck,
    Leaf,
    Clock,
    TrendingUp,
    Tag,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    MapPin,
    Instagram,
    Loader2,
    ArrowLeft,
    User,
    Phone,
} from 'lucide-vue-next';
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import type { DirectiveBinding } from 'vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import ProductThumb from '@/components/ProductThumb.vue';
import { useAppearance } from '@/composables/useAppearance';
import { useCart } from '@/composables/useCart';
import { useCatalog } from '@/composables/useCatalog';
import { useToast } from '@/composables/useToast';
import { formatRupiah } from '@/lib/format';
import { dashboard, login } from '@/routes';
import type { BestSeller, Product } from '@/types/storefront';

const props = defineProps<{
    bestSellers: BestSeller[];
    allProducts: Product[];
}>();

const { appearance, updateAppearance } = useAppearance();

const isMobileMenuOpen = ref(false);

const toggleTheme = () => {
    updateAppearance(appearance.value === 'dark' ? 'light' : 'dark');
};

// Nomor WhatsApp tujuan (admin Cemilan Mba Tutut)
const WHATSAPP_NUMBER = '6283114827245';

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

// ===== Toast, Keranjang & Katalog — logika dipindah ke composables =====
const { toastMessage, showToast } = useToast();

const {
    cart,
    isCartOpen,
    cartItemCount,
    cartTotal,
    addToCart,
    increaseQty,
    decreaseQty,
    setCartQuantity,
    normalizeCartQuantity,
    removeFromCart,
    clearCart,
} = useCart(showToast);

const {
    searchQuery,
    activeCategory,
    sortBy,
    sortOptions,
    categories,
    filteredProducts,
    catalogLimit,
    visibleProducts,
    resetKatalog,
} = useCatalog(() => props.allProducts);

// Tutup keranjang → kembalikan ke langkah keranjang & bersihkan error form.
watch(isCartOpen, (open) => {
    if (!open) {
        checkoutStep.value = 'cart';
        orderError.value = null;
    }
});

// ===== Status stok =====
const LOW_STOCK_THRESHOLD = 5;

const stockState = (stok: number): 'aman' | 'menipis' | 'habis' => {
    if (stok <= 0) {
        return 'habis';
    }

    if (stok <= LOW_STOCK_THRESHOLD) {
        return 'menipis';
    }

    return 'aman';
};

// ===== Best seller: scroll horizontal =====
const favScroller = ref<HTMLElement | null>(null);

const scrollFav = (dir: number) => {
    favScroller.value?.scrollBy({ left: dir * 320, behavior: 'smooth' });
};

// ===== Hero slider (foto usaha → promo hari ini) =====
const heroSlide = ref(0);
const heroSlideCount = 2;
let heroTimer: ReturnType<typeof setInterval> | null = null;

const startHeroTimer = () => {
    if (heroTimer) {
        clearInterval(heroTimer);
    }

    heroTimer = setInterval(() => {
        heroSlide.value = (heroSlide.value + 1) % heroSlideCount;
    }, 6000);
};

const goToSlide = (i: number) => {
    heroSlide.value = i;
    startHeroTimer();
};

// Navigasi maju/mundur (tombol kiri/kanan). Melingkar & reset timer auto-slide.
const nextSlide = () => goToSlide((heroSlide.value + 1) % heroSlideCount);
const prevSlide = () =>
    goToSlide((heroSlide.value - 1 + heroSlideCount) % heroSlideCount);

// Promo unggulan untuk slide kedua (produk promo pertama dari data nyata).
const promoOfDay = computed<Product | BestSeller | null>(() => {
    return (
        props.allProducts.find((p) => p.promo) ??
        props.bestSellers.find((p) => p.promo) ??
        null
    );
});

// ===== Lokasi / Maps =====
// Peta inline pakai OpenStreetMap (frameable & tanpa API key; embed Google
// "output=embed" kini diblokir X-Frame-Options). Tombol "Buka di Google Maps"
// tetap mengarah ke Google untuk navigasi/arah.
// Koordinat persis toko "Cemilan mba Tutut" (dari pin Google Maps) — sesuaikan
// bila titik usaha bergeser.
const LOKASI_LAT = -2.5905603;
const LOKASI_LNG = 115.361494;
const ALAMAT =
    'Jl. Putera Harapan, Matang Ginalun, Barabai, Hulu Sungai Tengah, Kalimantan Selatan';
const mapsEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    LOKASI_LNG - 0.006
}%2C${LOKASI_LAT - 0.006}%2C${LOKASI_LNG + 0.006}%2C${
    LOKASI_LAT + 0.006
}&layer=mapnik&marker=${LOKASI_LAT}%2C${LOKASI_LNG}`;
const mapsLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Cemilan Mba Tutut ' + ALAMAT,
)}`;

// ===== Checkout → buat pesanan pending (tersimpan di sistem) =====
// Langkah keranjang → form data pemesan. Saat dikirim, pesanan langsung
// tersimpan sebagai "pending" + stok di-reserve, lalu WhatsApp ke toko terbuka
// berisi kode pesanan (pelanggan tinggal kirim, tanpa edit).
const checkoutStep = ref<'cart' | 'form'>('cart');
const orderName = ref('');
const orderPhone = ref('');
const orderNote = ref('');
const orderError = ref<string | null>(null);
const placingOrder = ref(false);

// Token CSRF untuk fetch ke endpoint web (Laravel set cookie XSRF-TOKEN).
const getCsrfToken = (): string => {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);

    return match ? decodeURIComponent(match[1]) : '';
};

const placeOrder = () => {
    if (cart.value.length === 0) {
        return;
    }

    const nama = orderName.value.trim();
    const telp = orderPhone.value.trim();

    if (!nama) {
        orderError.value = 'Nama wajib diisi ya.';

        return;
    }

    if (!/^[0-9+\-\s()]{6,}$/.test(telp)) {
        orderError.value = 'Nomor WhatsApp belum benar.';

        return;
    }

    orderError.value = null;
    placingOrder.value = true;

    // Buka tab WhatsApp kosong SECARA SINKRON dulu agar tidak diblokir popup
    // blocker; lokasinya diisi setelah pesanan tersimpan.
    const waTab = window.open('', '_blank');

    fetch('/pesan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
            nama,
            telp,
            catatan: orderNote.value.trim() || null,
            items: cart.value.map((item) => ({
                id_produk: item.id_produk,
                jumlah: item.quantity,
            })),
        }),
    })
        .then(async (res) => {
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    data.message || 'Gagal membuat pesanan. Coba lagi ya.',
                );
            }

            return data as { kode: string; total: number; wa_url: string };
        })
        .then((data) => {
            if (waTab) {
                waTab.location.href = data.wa_url;
            } else {
                window.open(data.wa_url, '_blank');
            }

            clearCart();
            orderName.value = '';
            orderPhone.value = '';
            orderNote.value = '';
            checkoutStep.value = 'cart';
            isCartOpen.value = false;
            showToast(
                `Pesanan ${data.kode} berhasil dibuat! Lanjutkan di WhatsApp ya.`,
            );
        })
        .catch((err: Error) => {
            waTab?.close();
            orderError.value = err.message;
            showToast(err.message);
        })
        .finally(() => {
            placingOrder.value = false;
        });
};

const formatPrice = formatRupiah;

// ===== Lacak pesanan (publik, berdasarkan nomor WhatsApp) =====
interface TrackedItem {
    nama_produk: string;
    jumlah: number;
    subtotal: number;
}
interface TrackedOrder {
    kode: string;
    status: string;
    status_label: string;
    total: number;
    nama_pelanggan: string;
    tanggal: string;
    items: TrackedItem[];
}

const trackPhone = ref('');
const trackResults = ref<TrackedOrder[]>([]);
const trackLoading = ref(false);
const trackError = ref<string | null>(null);
const trackSearched = ref(false);

const trackStatusClass = (status: string): string => {
    switch (status) {
        case 'selesai':
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300';
        case 'disiapkan':
            return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300';
        case 'batal':
            return 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300';
        default:
            return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300';
    }
};

const lacakPesanan = () => {
    const telp = trackPhone.value.trim();

    if (!/^[0-9+\-\s()]{6,}$/.test(telp)) {
        trackError.value = 'Masukkan nomor WhatsApp yang benar.';

        return;
    }

    trackError.value = null;
    trackLoading.value = true;
    trackSearched.value = true;

    fetch('/lacak-pesanan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ telp }),
    })
        .then(async (res) => {
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.message || 'Gagal melacak pesanan.');
            }

            return data as { pesanans: TrackedOrder[] };
        })
        .then((data) => {
            trackResults.value = data.pesanans ?? [];
        })
        .catch((err: Error) => {
            trackError.value = err.message;
            trackResults.value = [];
        })
        .finally(() => {
            trackLoading.value = false;
        });
};

const promoSisaText = (sisaHari: number) => {
    if (sisaHari <= 0) {
        return 'Berakhir hari ini';
    }

    if (sisaHari === 1) {
        return 'Sisa 1 hari lagi';
    }

    return `Sisa ${sisaHari} hari lagi`;
};

// ===== Motion: scroll-reveal & hitung mundur (client-only → aman SSR) =====
const isMounted = ref(false);
const nowTs = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
    isMounted.value = true;
    nowTs.value = Date.now();
    document.documentElement.classList.add('motion-ready');

    countdownTimer = setInterval(() => {
        nowTs.value = Date.now();
    }, 1000);

    startHeroTimer();
});

onBeforeUnmount(() => {
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }

    if (heroTimer) {
        clearInterval(heroTimer);
    }
});

const vReveal = {
    mounted(
        el: HTMLElement,
        binding: DirectiveBinding<{ delay?: number } | undefined>,
    ) {
        const delay = binding.value?.delay ?? 0;

        if (delay) {
            el.style.transitionDelay = `${delay}ms`;
        }

        if (typeof IntersectionObserver === 'undefined') {
            el.classList.add('is-visible');

            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        el.classList.add('is-visible');
                        io.unobserve(el);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
        );

        io.observe(el);
    },
};

const promoCountdown = (berakhirPada: string): string | null => {
    const end = new Date(berakhirPada).getTime();

    if (!Number.isFinite(end)) {
        return null;
    }

    let diff = Math.floor((end - nowTs.value) / 1000);

    if (diff <= 0) {
        return null;
    }

    const hari = Math.floor(diff / 86400);
    diff -= hari * 86400;
    const jam = Math.floor(diff / 3600);
    diff -= jam * 3600;
    const menit = Math.floor(diff / 60);
    const detik = diff - menit * 60;
    const pad = (n: number) => String(n).padStart(2, '0');

    return hari > 0
        ? `${hari}h ${pad(jam)}:${pad(menit)}:${pad(detik)}`
        : `${pad(jam)}:${pad(menit)}:${pad(detik)}`;
};
</script>

<template>
    <Head title="Cemilan Mba Tutut — Snack & Frozen Food Rumahan Barabai">
        <meta
            name="description"
            content="Cemilan Mba Tutut: keripik, basreng, makaroni & frozen food rumahan khas Barabai. Mulai 5 ribuan, dibuat tiap hari. Pesan mudah lewat WhatsApp."
        />
        <meta property="og:type" content="website" />
        <meta
            property="og:title"
            content="Cemilan Mba Tutut — Snack & Frozen Food Rumahan Barabai"
        />
        <meta
            property="og:description"
            content="Aneka cemilan mulai 5 ribuan & frozen food rumahan khas Barabai. Pesan mudah lewat WhatsApp."
        />
        <meta property="og:image" content="/images/hero.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link
            href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
        />
    </Head>

    <div
        class="kg min-h-screen overflow-x-clip bg-[var(--kg-bg)] font-['Plus_Jakarta_Sans',sans-serif] text-[var(--kg-on)] antialiased transition-colors duration-300 selection:bg-[#ffdbce] selection:text-[#802a00]"
    >
        <!-- Floating glass nav -->
        <header
            class="fixed inset-x-0 top-3 z-50 mx-auto flex w-[95%] max-w-[1180px] items-center justify-between rounded-full border border-black/5 bg-[var(--kg-surface)]/70 px-4 py-2.5 shadow-sm backdrop-blur-xl md:top-6 md:px-6 md:py-3 dark:border-white/10"
        >
            <a href="#home" class="flex items-center gap-2">
                <AppLogoIcon class="h-9 w-9" />
                <span
                    class="font-display text-lg font-extrabold tracking-tight text-[var(--kg-primary)] sm:text-xl"
                    >Cemilan Mba Tutut</span
                >
            </a>

            <nav
                class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 text-sm font-semibold lg:flex"
            >
                <a
                    href="#home"
                    class="text-[var(--kg-sec)] transition-colors hover:text-[var(--kg-primary)]"
                    >Beranda</a
                >
                <a
                    href="#favorit"
                    class="text-[var(--kg-sec)] transition-colors hover:text-[var(--kg-primary)]"
                    >Favorit</a
                >
                <a
                    href="#katalog"
                    class="text-[var(--kg-sec)] transition-colors hover:text-[var(--kg-primary)]"
                    >Katalog</a
                >
                <a
                    href="#lokasi"
                    class="text-[var(--kg-sec)] transition-colors hover:text-[var(--kg-primary)]"
                    >Lokasi</a
                >
                <a
                    href="#lacak"
                    class="text-[var(--kg-sec)] transition-colors hover:text-[var(--kg-primary)]"
                    >Lacak Pesanan</a
                >
            </nav>

            <div class="flex items-center gap-2">
                <button
                    @click="toggleTheme"
                    title="Ganti tema"
                    class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--kg-sec)] transition-colors hover:bg-[var(--kg-sc)] hover:text-[var(--kg-on)]"
                >
                    <Sun v-if="appearance === 'dark'" class="h-5 w-5" />
                    <Moon v-else class="h-5 w-5" />
                </button>
                <button
                    @click="isCartOpen = true"
                    title="Keranjang"
                    class="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--kg-sec)] transition-colors hover:bg-[var(--kg-sc)] hover:text-[var(--kg-on)]"
                >
                    <ShoppingCart class="h-5 w-5" />
                    <span
                        v-if="cartItemCount > 0"
                        class="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[var(--kg-signal)] px-1 text-[10px] font-bold text-white"
                        >{{ cartItemCount }}</span
                    >
                </button>
                <Link
                    v-if="$page.props.auth.user"
                    :href="dashboard()"
                    class="hidden items-center gap-1.5 rounded-full bg-[var(--kg-signal)] px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 sm:inline-flex"
                >
                    <span>Dashboard</span>
                </Link>
                <Link
                    v-else
                    :href="login()"
                    class="hidden items-center gap-1.5 rounded-full bg-[var(--kg-signal)] px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 sm:inline-flex"
                >
                    <span>Masuk Aplikasi</span>
                </Link>
                <button
                    @click="isMobileMenuOpen = !isMobileMenuOpen"
                    class="flex h-9 w-9 items-center justify-center rounded-full text-[var(--kg-on)] lg:hidden"
                >
                    <Menu v-if="!isMobileMenuOpen" class="h-5 w-5" />
                    <X v-else class="h-5 w-5" />
                </button>
            </div>
        </header>

        <!-- Mobile menu -->
        <transition name="fade">
            <div
                v-if="isMobileMenuOpen"
                class="fixed inset-x-4 top-20 z-40 rounded-3xl border border-black/5 bg-[var(--kg-surface)] p-4 shadow-2xl lg:hidden dark:border-white/10"
            >
                <a
                    v-for="link in [
                        { href: '#home', label: 'Beranda' },
                        { href: '#favorit', label: 'Favorit' },
                        { href: '#katalog', label: 'Katalog' },
                        { href: '#lokasi', label: 'Lokasi' },
                        { href: '#lacak', label: 'Lacak Pesanan' },
                    ]"
                    :key="link.href"
                    :href="link.href"
                    @click="isMobileMenuOpen = false"
                    class="block rounded-2xl px-4 py-3 text-base font-semibold text-[var(--kg-on)] transition-colors hover:bg-[var(--kg-sc)]"
                    >{{ link.label }}</a
                >
            </div>
        </transition>

        <main>
            <!-- ===== HERO SLIDER (full-screen, transisi geser) ===== -->
            <section
                id="home"
                class="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-[var(--kg-sc)]"
            >
                <!-- Track: geser horizontal antar slide -->
                <div
                    class="hero-track flex h-full w-full"
                    :style="{ transform: `translateX(-${heroSlide * 100}%)` }"
                >
                    <!-- Slide 0: foto brand + teks -->
                    <div class="relative h-full w-full shrink-0">
                        <img
                            src="/images/hero.png"
                            alt="Rumah Cemilan Mba Tutut, Barabai"
                            class="absolute inset-0 h-full w-full object-cover"
                        />
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/30 sm:bg-gradient-to-r sm:from-black/85 sm:via-black/45 sm:to-transparent"
                        ></div>
                        <div
                            class="relative z-10 mx-auto flex h-full max-w-[1180px] flex-col justify-center px-6 md:px-8"
                        >
                            <div
                                class="max-w-xl"
                                :class="heroSlide === 0 ? 'hero-in' : ''"
                            >
                                <span
                                    class="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur"
                                >
                                    <Sparkles class="h-3.5 w-3.5" /> Homemade ·
                                    khas Barabai
                                </span>
                                <h1
                                    class="font-display text-4xl leading-[1.02] font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
                                >
                                    Ngemil nagih,<br />mulai
                                    <span class="text-[#ff8a4d] italic"
                                        >5rb-an.</span
                                    >
                                </h1>
                                <p
                                    class="mt-5 max-w-md text-sm text-white/85 sm:text-base"
                                >
                                    Keripik, basreng, makaroni & frozen food
                                    rumahan khas Barabai. Enak, terjangkau,
                                    bikin nagih.
                                </p>
                                <div class="mt-7 flex flex-wrap gap-3">
                                    <a
                                        :href="getGeneralWhatsAppLink()"
                                        target="_blank"
                                        class="inline-flex items-center gap-2 rounded-full bg-[var(--kg-signal)] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                                    >
                                        <MessageCircle class="h-4.5 w-4.5" />
                                        Pesan via WhatsApp
                                    </a>
                                    <a
                                        href="#katalog"
                                        class="inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/25"
                                    >
                                        Lihat katalog
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Slide 1: promo hari ini + foto produk -->
                    <div class="relative h-full w-full shrink-0">
                        <!-- Banner tunggal: foto promo bila ada, monogram bila produk
                             promo tanpa foto, atau foto brand bila tak ada promo. -->
                        <ProductThumb
                            v-if="promoOfDay"
                            :src="promoOfDay.foto_url"
                            :name="promoOfDay.nama"
                            :alt="promoOfDay.nama"
                            class="absolute inset-0 h-full w-full object-cover"
                        />
                        <img
                            v-else
                            src="/images/hero.png"
                            alt="Promo Cemilan Mba Tutut"
                            class="absolute inset-0 h-full w-full object-cover"
                        />
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-[#521800]/90 via-[#521800]/55 to-black/30 sm:bg-gradient-to-r sm:from-[#521800]/90 sm:via-[#521800]/45 sm:to-transparent"
                        ></div>
                        <div
                            class="relative z-10 mx-auto flex h-full max-w-[1180px] flex-col justify-center px-6 md:px-8"
                        >
                            <div
                                class="max-w-xl"
                                :class="heroSlide === 1 ? 'hero-in' : ''"
                            >
                                <span
                                    class="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--kg-signal)] px-3 py-1.5 text-xs font-bold text-white"
                                >
                                    <Tag class="h-3.5 w-3.5" /> Promo hari ini
                                </span>
                                <template v-if="promoOfDay && promoOfDay.promo">
                                    <h2
                                        class="font-display text-4xl leading-[1.02] font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
                                    >
                                        {{ promoOfDay.nama }}
                                    </h2>
                                    <div class="mt-5 flex items-center gap-3">
                                        <span
                                            class="font-display text-3xl font-extrabold text-white sm:text-4xl"
                                            >{{
                                                formatPrice(
                                                    promoOfDay.promo.harga_promo ??
                                                        promoOfDay.harga_jual,
                                                )
                                            }}</span
                                        >
                                        <span
                                            v-if="
                                                promoOfDay.promo.harga_promo !==
                                                null
                                            "
                                            class="text-lg text-white/70 line-through sm:text-xl"
                                            >{{
                                                formatPrice(promoOfDay.harga_jual)
                                            }}</span
                                        >
                                        <span
                                            class="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-[#a73a00]"
                                            >{{ promoOfDay.promo.label }}</span
                                        >
                                    </div>
                                    <p
                                        v-if="
                                            isMounted &&
                                            promoCountdown(
                                                promoOfDay.promo.berakhir_pada,
                                            )
                                        "
                                        class="mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-white/90 tabular-nums"
                                    >
                                        <Clock class="h-4 w-4" /> Berakhir
                                        {{
                                            promoCountdown(
                                                promoOfDay.promo.berakhir_pada,
                                            )
                                        }}
                                    </p>
                                    <div class="mt-7">
                                        <a
                                            :href="getWhatsAppLink(promoOfDay.nama)"
                                            target="_blank"
                                            class="inline-flex items-center gap-2 rounded-full bg-[var(--kg-signal)] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                                        >
                                            <MessageCircle class="h-4.5 w-4.5" />
                                            Ambil promo via WhatsApp
                                        </a>
                                    </div>
                                </template>
                                <template v-else>
                                    <h2
                                        class="font-display text-4xl leading-[1.02] font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
                                    >
                                        Mulai 5 ribuan,<br />bikin nagih.
                                    </h2>
                                    <div class="mt-7">
                                        <a
                                            href="#katalog"
                                            class="inline-flex items-center gap-2 rounded-full bg-[var(--kg-signal)] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                                        >
                                            Jelajahi katalog
                                        </a>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Floating "mulai dari" badge -->
                <div
                    class="absolute top-24 right-6 z-20 hidden flex-col items-center rounded-3xl bg-white/95 px-5 py-3 shadow-2xl backdrop-blur sm:flex"
                >
                    <span
                        class="font-display text-2xl font-extrabold text-[#a73a00]"
                        >5rb</span
                    >
                    <span
                        class="text-[10px] font-bold tracking-widest text-[#5d5e62] uppercase"
                        >mulai dari</span
                    >
                </div>

                <!-- Kontrol slider: [‹] • • [›] dikelompokkan di tengah-bawah agar tidak
                     menutupi teks hero, scroll cue (kiri), maupun tombol mengambang (kanan). -->
                <div
                    class="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3"
                >
                    <button
                        @click="prevSlide"
                        aria-label="Slide sebelumnya"
                        class="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/35 sm:h-10 sm:w-10"
                    >
                        <ChevronLeft class="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                    </button>

                    <div class="flex items-center gap-2">
                        <button
                            v-for="i in heroSlideCount"
                            :key="i"
                            @click="goToSlide(i - 1)"
                            :aria-label="`Slide ${i}`"
                            class="h-2 rounded-full transition-all duration-300"
                            :class="
                                heroSlide === i - 1
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/50 hover:bg-white/80'
                            "
                        ></button>
                    </div>

                    <button
                        @click="nextSlide"
                        aria-label="Slide berikutnya"
                        class="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/35 sm:h-10 sm:w-10"
                    >
                        <ChevronRight class="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                    </button>
                </div>

                <!-- Scroll cue -->
                <a
                    href="#favorit"
                    aria-label="Gulir ke bawah"
                    class="absolute bottom-7 left-6 z-20 hidden items-center gap-2 text-xs font-semibold text-white/80 transition-colors hover:text-white sm:flex"
                >
                    <span
                        class="flex h-9 w-9 items-center justify-center rounded-full border border-white/40"
                    >
                        <ChevronDown class="h-4 w-4 animate-bounce" />
                    </span>
                    Gulir
                </a>
            </section>

            <!-- ===== BENTO FEATURES ===== -->
            <section class="mx-auto max-w-[1180px] px-5 py-16 md:px-8 md:py-24">
                <div
                    v-reveal
                    class="reveal mb-8 max-w-2xl md:mb-12"
                >
                    <span
                        class="inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-widest text-[var(--kg-primary)] uppercase sm:text-xs"
                    >
                        <span
                            class="h-1.5 w-1.5 rounded-full bg-[var(--kg-primary)]"
                        ></span>
                        Kenapa Mba Tutut
                    </span>
                    <h2
                        class="mt-3 font-display text-[1.6rem] leading-[1.15] font-extrabold tracking-tight text-balance sm:text-3xl md:text-4xl"
                    >
                        Cemilan rumahan, dibuat sepenuh hati.
                    </h2>
                </div>

                <div class="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
                    <div
                        v-reveal
                        class="bento-card flex flex-row items-center gap-4 rounded-2xl border border-[#ff5c00]/10 bg-[#ff5c00]/5 p-4 md:h-[280px] md:flex-col md:items-start md:justify-between md:gap-0 md:rounded-[2rem] md:p-8 dark:border-[#ff5c00]/20 dark:bg-[#ff5c00]/10"
                    >
                        <div
                            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ffdbce] text-[#a73a00] md:h-14 md:w-14 md:rounded-2xl"
                        >
                            <Leaf class="h-6 w-6 md:h-7 md:w-7" />
                        </div>
                        <div class="min-w-0">
                            <h3
                                class="font-display text-base leading-tight font-bold md:text-2xl"
                            >
                                Homemade
                            </h3>
                            <p
                                class="mt-1 text-sm text-[var(--kg-sec)] md:mt-2 md:text-base"
                            >
                                Resep keluarga, tanpa pengawet. Dibuat dalam
                                jumlah terbatas tiap hari.
                            </p>
                        </div>
                    </div>

                    <div
                        v-reveal="{ delay: 100 }"
                        class="bento-card flex flex-row items-center gap-4 rounded-2xl border border-[#8494ac]/30 bg-[#d3e4fe]/40 p-4 md:h-[280px] md:flex-col md:items-start md:justify-between md:gap-0 md:rounded-[2rem] md:p-8 dark:border-white/10 dark:bg-[#1c2c40]/40"
                    >
                        <div
                            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#d3e4fe] text-[#0b1c30] md:h-14 md:w-14 md:rounded-2xl"
                        >
                            <ShieldCheck class="h-6 w-6 md:h-7 md:w-7" />
                        </div>
                        <div class="min-w-0">
                            <h3
                                class="font-display text-base leading-tight font-bold md:text-2xl"
                            >
                                Higiene &amp; rapi
                            </h3>
                            <p
                                class="mt-1 text-sm text-[var(--kg-sec)] md:mt-2 md:text-base"
                            >
                                Diproses bersih dengan kemasan rapi agar kesegaran
                                rasa terjaga lebih lama.
                            </p>
                        </div>
                    </div>

                    <div
                        v-reveal="{ delay: 200 }"
                        class="bento-card flex flex-row items-center gap-4 rounded-2xl border border-black/5 bg-[var(--kg-sc)] p-4 md:h-[280px] md:flex-col md:items-start md:justify-between md:gap-0 md:rounded-[2rem] md:p-8 dark:border-white/10"
                    >
                        <div
                            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--kg-surface)] text-[var(--kg-primary)] shadow-sm md:h-14 md:w-14 md:rounded-2xl"
                        >
                            <Tag class="h-6 w-6 md:h-7 md:w-7" />
                        </div>
                        <div class="min-w-0">
                            <h3
                                class="font-display text-base leading-tight font-bold md:text-2xl"
                            >
                                Mulai 5 ribuan
                            </h3>
                            <p
                                class="mt-1 text-sm text-[var(--kg-sec)] md:mt-2 md:text-base"
                            >
                                Enak tak harus mahal — pas untuk stok cemilan
                                mingguan keluarga.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ===== PRODUK FAVORIT (scroll horizontal) ===== -->
            <section id="favorit" class="overflow-hidden pb-16 md:pb-24">
                <div
                    v-reveal
                    class="reveal mx-auto mb-8 flex max-w-[1180px] items-end justify-between px-5 md:px-8"
                >
                    <div>
                        <h2
                            class="font-display text-2xl leading-[1.15] font-extrabold tracking-tight text-balance sm:text-3xl md:text-4xl"
                        >
                            Produk favorit
                        </h2>
                        <p class="mt-1 text-[var(--kg-sec)]">
                            Paling banyak dicari pelanggan.
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <button
                            @click="scrollFav(-1)"
                            aria-label="Sebelumnya"
                            class="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--kg-sc)] text-[var(--kg-on)] transition-colors hover:bg-[var(--kg-signal)] hover:text-white"
                        >
                            <ChevronLeft class="h-5 w-5" />
                        </button>
                        <button
                            @click="scrollFav(1)"
                            aria-label="Berikutnya"
                            class="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--kg-sc)] text-[var(--kg-on)] transition-colors hover:bg-[var(--kg-signal)] hover:text-white"
                        >
                            <ChevronRight class="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div
                    v-if="props.bestSellers.length > 0"
                    ref="favScroller"
                    class="no-scrollbar flex snap-x gap-5 overflow-x-auto px-5 pb-4 md:px-8"
                >
                    <div
                        v-for="(product, index) in props.bestSellers"
                        :key="product.id_produk"
                        v-reveal="{ delay: index * 90 }"
                        class="reveal w-[260px] shrink-0 snap-start sm:w-[300px]"
                    >
                        <div class="fav-card group">
                            <div
                                class="relative mb-4 aspect-square overflow-hidden rounded-3xl bg-[var(--kg-sc)] shadow-sm transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-black/10"
                            >
                                <ProductThumb
                                    :src="product.foto_url"
                                    :name="product.nama"
                                    :alt="product.nama"
                                    loading="lazy"
                                    class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                                />
                                <span
                                    v-if="index === 0"
                                    class="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold tracking-tight text-[var(--kg-primary)] uppercase backdrop-blur transition-transform duration-300 group-hover:-translate-y-0.5"
                                    >Best seller</span
                                >
                                <span
                                    v-if="product.promo"
                                    class="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-[var(--kg-signal)] px-2.5 py-1 text-[11px] font-extrabold text-white"
                                    >{{ product.promo.label }}</span
                                >
                                <button
                                    @click="addToCart(product)"
                                    :disabled="product.stok <= 0"
                                    class="absolute right-4 bottom-4 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-[var(--kg-signal)] text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110 disabled:bg-neutral-400"
                                    aria-label="Tambah ke keranjang"
                                >
                                    <ShoppingCart class="h-5 w-5" />
                                </button>
                            </div>
                            <div class="flex items-start justify-between gap-2">
                                <div class="min-w-0">
                                    <h4
                                        class="truncate font-bold text-[var(--kg-on)] transition-colors group-hover:text-[var(--kg-primary)]"
                                    >
                                        {{ product.nama }}
                                    </h4>
                                    <p
                                        class="mt-1 flex items-center gap-1 text-xs text-[var(--kg-sec)]"
                                    >
                                        <TrendingUp class="h-3.5 w-3.5" />
                                        {{
                                            product.total_terjual.toLocaleString(
                                                'id-ID',
                                            )
                                        }}
                                        terjual
                                    </p>
                                </div>
                                <div class="text-right">
                                    <span
                                        class="block font-bold text-[var(--kg-primary)]"
                                        >{{
                                            formatPrice(
                                                product.promo?.harga_promo ??
                                                    product.harga_jual,
                                            )
                                        }}</span
                                    >
                                    <span
                                        v-if="
                                            product.promo &&
                                            product.promo.harga_promo !== null
                                        "
                                        class="text-[11px] text-[var(--kg-sec)] line-through"
                                        >{{ formatPrice(product.harga_jual) }}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ===== KATALOG ===== -->
            <section
                id="katalog"
                class="mx-auto max-w-[1180px] px-5 py-4 md:px-8"
            >
                <div
                    v-reveal
                    class="reveal mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
                >
                    <h2
                        class="font-display text-2xl leading-[1.15] font-extrabold tracking-tight text-balance sm:text-3xl md:text-4xl"
                    >
                        Katalog lengkap
                    </h2>
                    <div class="flex flex-wrap items-center gap-3">
                        <div class="relative w-full sm:w-[280px]">
                            <Search
                                class="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[var(--kg-sec)]"
                            />
                            <input
                                v-model="searchQuery"
                                type="text"
                                inputmode="search"
                                placeholder="Cari cemilan…"
                                class="w-full rounded-2xl border-none bg-[var(--kg-surface)] py-3 pr-4 pl-12 text-sm shadow-sm outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-[var(--kg-signal)] dark:ring-white/10"
                            />
                        </div>
                        <label
                            class="inline-flex items-center gap-2 rounded-2xl bg-[var(--kg-surface)] px-3 py-2.5 text-sm font-semibold text-[var(--kg-sec)] shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                        >
                            <ArrowUpDown class="h-4 w-4" />
                            <select
                                v-model="sortBy"
                                aria-label="Urutkan produk"
                                class="cursor-pointer border-none bg-transparent text-sm font-semibold text-[var(--kg-on)] outline-none"
                            >
                                <option
                                    v-for="opt in sortOptions"
                                    :key="opt.value"
                                    :value="opt.value"
                                >
                                    {{ opt.label }}
                                </option>
                            </select>
                        </label>
                    </div>
                </div>

                <!-- Pills kategori -->
                <div
                    v-reveal
                    class="reveal no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1"
                >
                    <button
                        v-for="kat in categories"
                        :key="kat"
                        @click="activeCategory = kat"
                        :class="[
                            'shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-sm font-bold transition-all',
                            activeCategory === kat
                                ? 'bg-[var(--kg-signal)] text-white shadow-sm'
                                : 'bg-[var(--kg-surface)] text-[var(--kg-sec)] ring-1 ring-black/5 hover:text-[var(--kg-primary)] dark:ring-white/10',
                        ]"
                    >
                        {{ kat }}
                    </button>
                </div>

                <!-- Grid katalog -->
                <div
                    v-if="visibleProducts.length > 0"
                    class="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
                >
                    <div
                        v-for="product in visibleProducts"
                        :key="product.id_produk"
                        class="group flex flex-col rounded-3xl bg-[var(--kg-surface)] p-3 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-4 dark:ring-white/10"
                    >
                        <div
                            class="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-[var(--kg-sc)]"
                        >
                            <span
                                v-if="product.promo"
                                class="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-[var(--kg-signal)] px-2 py-0.5 text-[10px] font-extrabold text-white"
                                >{{ product.promo.label }}</span
                            >
                            <span
                                v-if="stockState(product.stok) === 'habis'"
                                class="absolute inset-0 z-10 flex items-center justify-center bg-black/45 text-sm font-bold text-white"
                                >Stok habis</span
                            >
                            <ProductThumb
                                :src="product.foto_url"
                                :name="product.nama"
                                :alt="product.nama"
                                loading="lazy"
                                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        <h5
                            class="mb-1 text-[10px] font-bold tracking-widest text-[var(--kg-sec)] uppercase"
                        >
                            {{ product.kategori || 'Cemilan' }}
                        </h5>
                        <h4
                            class="mb-2 line-clamp-2 leading-snug font-bold text-[var(--kg-on)]"
                        >
                            {{ product.nama }}
                        </h4>

                        <!-- Hitung mundur promo -->
                        <p
                            v-if="product.promo"
                            class="mb-2 inline-flex w-fit items-center gap-1 rounded-lg bg-[#ff5c00]/10 px-2 py-0.5 text-[11px] font-bold text-[var(--kg-primary)]"
                        >
                            <Clock class="h-3.5 w-3.5" />
                            <span
                                v-if="
                                    isMounted &&
                                    promoCountdown(product.promo.berakhir_pada)
                                "
                                class="tabular-nums"
                                >{{
                                    promoCountdown(product.promo.berakhir_pada)
                                }}</span
                            >
                            <span v-else>{{
                                promoSisaText(product.promo.sisa_hari)
                            }}</span>
                        </p>

                        <div class="mt-auto flex items-center justify-between gap-2">
                            <div>
                                <span
                                    class="block font-bold text-[var(--kg-primary)]"
                                    >{{
                                        formatPrice(
                                            product.promo?.harga_promo ??
                                                product.harga_jual,
                                        )
                                    }}</span
                                >
                                <span
                                    v-if="
                                        product.promo &&
                                        product.promo.harga_promo !== null
                                    "
                                    class="text-[11px] text-[var(--kg-sec)] line-through"
                                    >{{ formatPrice(product.harga_jual) }}</span
                                >
                            </div>
                            <button
                                @click="addToCart(product)"
                                :disabled="product.stok <= 0"
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff5c00]/10 text-[var(--kg-primary)] transition-colors hover:bg-[var(--kg-signal)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#ff5c00]/10 disabled:hover:text-[var(--kg-primary)]"
                                aria-label="Tambah ke keranjang"
                            >
                                <Plus class="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Empty state -->
                <div
                    v-else
                    class="flex flex-col items-center justify-center rounded-3xl bg-[var(--kg-surface)] py-20 text-center ring-1 ring-black/5 dark:ring-white/10"
                >
                    <Search class="mb-4 h-12 w-12 text-[var(--kg-sec)]/50" />
                    <p class="font-bold">Produk tidak ditemukan</p>
                    <p class="mt-1 text-sm text-[var(--kg-sec)]">
                        Coba kata kunci atau kategori lain ya.
                    </p>
                    <button
                        @click="resetKatalog"
                        class="mt-4 cursor-pointer rounded-full bg-[var(--kg-sc)] px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--kg-signal)] hover:text-white"
                    >
                        Reset filter
                    </button>
                </div>

                <!-- Muat lebih banyak -->
                <div
                    v-if="filteredProducts.length > catalogLimit"
                    class="mt-12 text-center"
                >
                    <button
                        @click="catalogLimit += 8"
                        class="cursor-pointer rounded-full bg-[var(--kg-sc)] px-10 py-4 font-bold transition-colors hover:bg-[var(--kg-signal)] hover:text-white"
                    >
                        Muat lebih banyak
                    </button>
                </div>
            </section>

            <!-- ===== GOOGLE MAPS / LOKASI ===== -->
            <section
                id="lokasi"
                class="mx-auto max-w-[1180px] px-5 py-16 md:px-8 md:py-24"
            >
                <div
                    v-reveal
                    class="reveal grid grid-cols-1 gap-6 overflow-hidden rounded-[2rem] bg-[var(--kg-surface)] shadow-sm ring-1 ring-black/5 lg:grid-cols-2 dark:ring-white/10"
                >
                    <!-- Info -->
                    <div class="flex flex-col justify-center p-8 md:p-12">
                        <span
                            class="inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-widest text-[var(--kg-primary)] uppercase sm:text-xs"
                        >
                            <span
                                class="h-1.5 w-1.5 rounded-full bg-[var(--kg-primary)]"
                            ></span>
                            Kunjungi kami
                        </span>
                        <h2
                            class="mt-3 font-display text-2xl leading-[1.15] font-extrabold tracking-tight text-balance sm:text-3xl md:text-4xl"
                        >
                            Ambil di tempat,<br />atau tanya admin.
                        </h2>

                        <ul class="mt-8 space-y-5">
                            <li class="flex items-start gap-3">
                                <span
                                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff5c00]/10 text-[var(--kg-primary)]"
                                >
                                    <MapPin class="h-5 w-5" />
                                </span>
                                <div>
                                    <p class="font-bold">Alamat</p>
                                    <p class="text-sm text-[var(--kg-sec)]">
                                        Jl. Putera Harapan, Matang Ginalun,
                                        Barabai, Hulu Sungai Tengah, Kalsel.
                                    </p>
                                </div>
                            </li>
                            <li class="flex items-start gap-3">
                                <span
                                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff5c00]/10 text-[var(--kg-primary)]"
                                >
                                    <Clock class="h-5 w-5" />
                                </span>
                                <div>
                                    <p class="font-bold">Jam buka</p>
                                    <p class="text-sm text-[var(--kg-sec)]">
                                        Setiap hari, 09.00–21.00 WITA. Jumat &
                                        hari libur tertentu tutup.
                                    </p>
                                </div>
                            </li>
                            <li class="flex items-start gap-3">
                                <span
                                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff5c00]/10 text-[var(--kg-primary)]"
                                >
                                    <PhoneCall class="h-5 w-5" />
                                </span>
                                <div>
                                    <p class="font-bold">Kontak</p>
                                    <p class="text-sm text-[var(--kg-sec)]">
                                        +62 831-1482-7245 (WhatsApp)
                                    </p>
                                </div>
                            </li>
                        </ul>

                        <div class="mt-8 flex flex-wrap gap-3">
                            <a
                                :href="getGeneralWhatsAppLink()"
                                target="_blank"
                                class="inline-flex items-center gap-2 rounded-full bg-[var(--kg-signal)] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                            >
                                <MessageCircle class="h-4.5 w-4.5" /> Chat admin
                            </a>
                            <a
                                :href="mapsLinkUrl"
                                target="_blank"
                                class="inline-flex items-center gap-2 rounded-full bg-[var(--kg-sc)] px-6 py-3 text-sm font-bold transition-colors hover:bg-[var(--kg-sc-high)]"
                            >
                                Buka di Google Maps
                                <ArrowRight class="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <!-- Map embed -->
                    <div class="min-h-[320px] w-full lg:min-h-full">
                        <iframe
                            :src="mapsEmbedUrl"
                            title="Lokasi Cemilan Mba Tutut di Google Maps"
                            class="h-full min-h-[320px] w-full border-0"
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            </section>

            <!-- ===== LACAK PESANAN ===== -->
            <section
                id="lacak"
                class="mx-auto max-w-[1180px] px-5 pb-16 md:px-8 md:pb-24"
            >
                <div
                    v-reveal
                    class="reveal rounded-[2rem] bg-[var(--kg-surface)] p-8 shadow-sm ring-1 ring-black/5 md:p-12 dark:ring-white/10"
                >
                    <div class="mx-auto max-w-xl text-center">
                        <span
                            class="inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-widest text-[var(--kg-primary)] uppercase sm:text-xs"
                        >
                            <span
                                class="h-1.5 w-1.5 rounded-full bg-[var(--kg-primary)]"
                            ></span>
                            Lacak Pesanan
                        </span>
                        <h2
                            class="mt-3 font-display text-2xl leading-[1.15] font-extrabold tracking-tight text-balance sm:text-3xl md:text-4xl"
                        >
                            Cek status pesananmu
                        </h2>
                        <p class="mt-2 text-[var(--kg-sec)]">
                            Masukkan nomor WhatsApp yang kamu pakai saat memesan.
                        </p>
                        <form
                            @submit.prevent="lacakPesanan"
                            class="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
                        >
                            <input
                                v-model="trackPhone"
                                type="tel"
                                inputmode="tel"
                                autocomplete="tel"
                                placeholder="Nomor WhatsApp (08…)"
                                class="w-full rounded-full border-none bg-[var(--kg-bg)] px-5 py-3.5 text-sm shadow-sm outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-[var(--kg-signal)] dark:ring-white/10"
                            />
                            <button
                                type="submit"
                                :disabled="trackLoading"
                                class="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--kg-signal)] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                            >
                                <Loader2
                                    v-if="trackLoading"
                                    class="h-4.5 w-4.5 animate-spin"
                                />
                                <Search v-else class="h-4.5 w-4.5" />
                                Lacak
                            </button>
                        </form>
                        <p
                            v-if="trackError"
                            class="mt-2 text-sm font-semibold text-red-500"
                        >
                            {{ trackError }}
                        </p>
                    </div>

                    <div
                        v-if="trackResults.length"
                        class="mx-auto mt-8 max-w-xl space-y-3"
                    >
                        <div
                            v-for="order in trackResults"
                            :key="order.kode"
                            class="rounded-2xl border border-black/5 bg-[var(--kg-bg)] p-4 dark:border-white/10"
                        >
                            <div class="flex items-center justify-between gap-2">
                                <span class="font-display font-extrabold">{{
                                    order.kode
                                }}</span>
                                <span
                                    class="rounded-full px-2.5 py-0.5 text-xs font-bold"
                                    :class="trackStatusClass(order.status)"
                                    >{{ order.status_label }}</span
                                >
                            </div>
                            <p class="mt-1 text-xs text-[var(--kg-sec)]">
                                {{ order.tanggal }} · {{ order.nama_pelanggan }}
                            </p>
                            <ul class="mt-2 space-y-1 text-sm">
                                <li
                                    v-for="(item, i) in order.items"
                                    :key="i"
                                    class="flex justify-between gap-2"
                                >
                                    <span class="text-[var(--kg-sec)]"
                                        >{{ item.nama_produk }} ×
                                        {{ item.jumlah }}</span
                                    >
                                    <span>{{ formatPrice(item.subtotal) }}</span>
                                </li>
                            </ul>
                            <div
                                class="mt-2 flex justify-between border-t border-black/5 pt-2 font-bold dark:border-white/10"
                            >
                                <span>Total</span>
                                <span class="text-[var(--kg-primary)]">{{
                                    formatPrice(order.total)
                                }}</span>
                            </div>
                        </div>
                    </div>
                    <p
                        v-else-if="trackSearched && !trackLoading"
                        class="mt-6 text-center text-sm text-[var(--kg-sec)]"
                    >
                        Tidak ada pesanan untuk nomor itu.
                    </p>
                </div>
            </section>
        </main>

        <!-- ===== FOOTER (modern) ===== -->
        <footer
            class="mt-8 border-t border-black/5 bg-[var(--kg-surface)] dark:border-white/10"
        >
            <div class="mx-auto max-w-[1180px] px-5 py-16 md:px-8">
                <div
                    class="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8"
                >
                    <!-- Brand -->
                    <div class="md:col-span-5">
                        <div class="flex items-center gap-2">
                            <AppLogoIcon class="h-9 w-9" />
                            <span
                                class="font-display text-xl font-extrabold tracking-tight text-[var(--kg-primary)]"
                                >Cemilan Mba Tutut</span
                            >
                        </div>
                        <p class="mt-4 max-w-sm text-sm text-[var(--kg-sec)]">
                            UMKM asal Barabai yang menyajikan aneka cemilan mulai 5
                            ribuan, kue kering, dan frozen food rumahan. Enak,
                            terjangkau, dan bikin nagih.
                        </p>
                        <div class="mt-6 flex gap-3">
                            <a
                                :href="getGeneralWhatsAppLink()"
                                target="_blank"
                                aria-label="WhatsApp"
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--kg-sc)] text-[var(--kg-primary)] transition-colors hover:bg-[var(--kg-signal)] hover:text-white"
                            >
                                <MessageCircle class="h-5 w-5" />
                            </a>
                            <a
                                href="https://instagram.com/rumahcemilan_mbatutut12barabai"
                                target="_blank"
                                aria-label="Instagram"
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--kg-sc)] text-[var(--kg-primary)] transition-colors hover:bg-[var(--kg-signal)] hover:text-white"
                            >
                                <Instagram class="h-5 w-5" />
                            </a>
                            <a
                                :href="mapsLinkUrl"
                                target="_blank"
                                aria-label="Lokasi"
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--kg-sc)] text-[var(--kg-primary)] transition-colors hover:bg-[var(--kg-signal)] hover:text-white"
                            >
                                <MapPin class="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <!-- Navigasi -->
                    <div class="md:col-span-3">
                        <h5
                            class="mb-5 text-xs font-bold tracking-widest text-[var(--kg-on)] uppercase"
                        >
                            Navigasi
                        </h5>
                        <nav class="flex flex-col gap-3 text-sm">
                            <a
                                href="#home"
                                class="text-[var(--kg-sec)] transition-colors hover:text-[var(--kg-primary)]"
                                >Beranda</a
                            >
                            <a
                                href="#favorit"
                                class="text-[var(--kg-sec)] transition-colors hover:text-[var(--kg-primary)]"
                                >Produk favorit</a
                            >
                            <a
                                href="#katalog"
                                class="text-[var(--kg-sec)] transition-colors hover:text-[var(--kg-primary)]"
                                >Katalog</a
                            >
                            <a
                                href="#lokasi"
                                class="text-[var(--kg-sec)] transition-colors hover:text-[var(--kg-primary)]"
                                >Lokasi</a
                            >
                        </nav>
                    </div>

                    <!-- Kontak & jam -->
                    <div class="md:col-span-4">
                        <h5
                            class="mb-5 text-xs font-bold tracking-widest text-[var(--kg-on)] uppercase"
                        >
                            Hubungi kami
                        </h5>
                        <ul class="space-y-3 text-sm text-[var(--kg-sec)]">
                            <li class="flex items-center gap-2">
                                <PhoneCall
                                    class="h-4 w-4 shrink-0 text-[var(--kg-primary)]"
                                />
                                <span>+62 831-1482-7245</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <Instagram
                                    class="h-4 w-4 shrink-0 text-[var(--kg-primary)]"
                                />
                                <span>@rumahcemilan_mbatutut12barabai</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <MapPin
                                    class="mt-0.5 h-4 w-4 shrink-0 text-[var(--kg-primary)]"
                                />
                                <span
                                    >Jl. Putera Harapan, Matang Ginalun,
                                    Barabai, HST, Kalsel</span
                                >
                            </li>
                            <li class="flex items-center gap-2">
                                <Clock
                                    class="h-4 w-4 shrink-0 text-[var(--kg-primary)]"
                                />
                                <span>Setiap hari (kecuali Jumat), 09.00–21.00 WITA</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div
                    class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-8 text-xs text-[var(--kg-sec)] sm:flex-row dark:border-white/10"
                >
                    <p>
                        © 2026 Cemilan Mba Tutut Barabai. Seluruh hak cipta
                        dilindungi.
                    </p>
                    <div class="flex items-center gap-4">
                        <Link
                            :href="login()"
                            class="transition-colors hover:text-[var(--kg-primary)]"
                            >Portal Admin</Link
                        >
                        <span>•</span>
                        <a
                            href="#home"
                            class="transition-colors hover:text-[var(--kg-primary)]"
                            >Kembali ke atas</a
                        >
                    </div>
                </div>
            </div>
        </footer>

        <!-- Floating WhatsApp -->
        <a
            :href="getGeneralWhatsAppLink()"
            target="_blank"
            class="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform hover:scale-110 active:scale-95"
            title="Chat admin WhatsApp"
        >
            <MessageCircle class="h-7 w-7" />
        </a>

        <!-- Floating cart -->
        <button
            @click="isCartOpen = true"
            class="fixed right-5 bottom-24 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[var(--kg-signal)] text-white shadow-2xl transition-transform hover:scale-110 active:scale-95"
            title="Buka keranjang"
        >
            <ShoppingCart class="h-7 w-7" />
            <span
                v-if="cartItemCount > 0"
                class="absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[var(--kg-bg)] bg-[#a73a00] px-1.5 text-xs font-extrabold text-white"
                >{{ cartItemCount }}</span
            >
        </button>

        <!-- Cart drawer -->
        <transition name="fade">
            <div
                v-if="isCartOpen"
                class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
                @click="isCartOpen = false"
            ></div>
        </transition>

        <transition name="slide">
            <aside
                v-if="isCartOpen"
                class="fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col bg-[var(--kg-bg)] shadow-2xl"
            >
                <div
                    class="flex items-center justify-between border-b border-black/5 px-5 py-5 dark:border-white/10"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff5c00]/10 text-[var(--kg-primary)]"
                        >
                            <ShoppingCart class="h-5 w-5" />
                        </div>
                        <div>
                            <h3 class="font-display text-lg font-extrabold">
                                Keranjang
                            </h3>
                            <p class="text-xs text-[var(--kg-sec)]">
                                {{ cartItemCount }} item dipilih
                            </p>
                        </div>
                    </div>
                    <button
                        @click="isCartOpen = false"
                        class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[var(--kg-sec)] transition-colors hover:bg-[var(--kg-sc)]"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto px-5 py-4">
                    <div v-if="cart.length > 0" class="space-y-3">
                        <div
                            v-for="item in cart"
                            :key="item.id_produk"
                            class="flex gap-3 rounded-2xl bg-[var(--kg-surface)] p-2.5 ring-1 ring-black/5 dark:ring-white/10"
                        >
                            <ProductThumb
                                :src="item.foto_url"
                                :name="item.nama"
                                :alt="item.nama"
                                class="h-20 w-20 shrink-0 rounded-xl object-cover"
                            />
                            <div
                                class="flex min-w-0 flex-1 flex-col justify-between gap-2"
                            >
                                <div class="flex items-start justify-between gap-2">
                                    <div class="min-w-0">
                                        <h4
                                            class="line-clamp-2 text-sm leading-snug font-bold"
                                        >
                                            {{ item.nama }}
                                        </h4>
                                        <p
                                            class="mt-0.5 text-xs text-[var(--kg-sec)]"
                                        >
                                            {{ formatPrice(item.harga_jual) }} /
                                            pcs
                                        </p>
                                    </div>
                                    <button
                                        @click="removeFromCart(item.id_produk)"
                                        class="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[var(--kg-sec)] transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                                        title="Hapus item"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </button>
                                </div>
                                <div class="flex items-center justify-between gap-2">
                                    <div
                                        class="inline-flex items-center gap-1 rounded-full bg-[var(--kg-sc)] p-1"
                                    >
                                        <button
                                            @click="decreaseQty(item.id_produk)"
                                            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[var(--kg-surface)] text-[var(--kg-on)] transition-colors hover:text-[var(--kg-primary)]"
                                        >
                                            <Minus class="h-3.5 w-3.5" />
                                        </button>
                                        <input
                                            type="text"
                                            inputmode="numeric"
                                            :value="item.quantity"
                                            :aria-label="`Jumlah ${item.nama}`"
                                            class="w-9 bg-transparent text-center text-sm font-extrabold outline-none"
                                            @focus="
                                                (
                                                    $event.target as HTMLInputElement
                                                ).select()
                                            "
                                            @input="setCartQuantity(item, $event)"
                                            @blur="
                                                normalizeCartQuantity(item, $event)
                                            "
                                            @keyup.enter="
                                                (
                                                    $event.target as HTMLInputElement
                                                ).blur()
                                            "
                                        />
                                        <button
                                            @click="increaseQty(item.id_produk)"
                                            :disabled="item.quantity >= item.stok"
                                            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[var(--kg-surface)] text-[var(--kg-on)] transition-colors hover:text-[var(--kg-primary)] disabled:opacity-40"
                                        >
                                            <Plus class="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <span
                                        class="text-sm font-extrabold text-[var(--kg-primary)]"
                                        >{{
                                            formatPrice(
                                                item.harga_jual * item.quantity,
                                            )
                                        }}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        v-else
                        class="flex h-full flex-col items-center justify-center py-20 text-center"
                    >
                        <div
                            class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--kg-sc)]"
                        >
                            <ShoppingCart class="h-8 w-8 text-[var(--kg-sec)]" />
                        </div>
                        <p class="font-bold">Keranjang masih kosong</p>
                        <p class="mt-1 text-sm text-[var(--kg-sec)]">
                            Yuk pilih cemilan favoritmu dulu!
                        </p>
                        <button
                            @click="isCartOpen = false"
                            class="mt-5 cursor-pointer rounded-full bg-[var(--kg-signal)] px-5 py-2.5 text-sm font-bold text-white"
                        >
                            Lihat produk
                        </button>
                    </div>
                </div>

                <div
                    v-if="cart.length > 0"
                    class="space-y-3 border-t border-black/5 px-5 py-5 dark:border-white/10"
                >
                    <div
                        class="flex items-center justify-between rounded-2xl bg-[var(--kg-sc)] px-4 py-3"
                    >
                        <span class="text-sm font-semibold text-[var(--kg-sec)]"
                            >Total ({{ cartItemCount }} item)</span
                        >
                        <span
                            class="font-display text-xl font-extrabold text-[var(--kg-primary)]"
                            >{{ formatPrice(cartTotal) }}</span
                        >
                    </div>

                    <!-- Langkah 1: ringkasan keranjang -->
                    <template v-if="checkoutStep === 'cart'">
                        <button
                            @click="checkoutStep = 'form'"
                            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--kg-signal)] px-6 py-3.5 text-base font-bold text-white transition-transform hover:scale-[1.01] active:scale-[0.98]"
                        >
                            <ShoppingCart class="h-5 w-5" /> Lanjut ke Pemesanan
                        </button>
                        <div class="flex items-center justify-between gap-3">
                            <button
                                @click="isCartOpen = false"
                                class="flex-1 cursor-pointer rounded-full bg-[var(--kg-sc)] px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[var(--kg-sc-high)]"
                            >
                                Lanjut belanja
                            </button>
                            <button
                                @click="clearCart"
                                class="flex-1 cursor-pointer rounded-full px-4 py-2.5 text-xs font-semibold text-[var(--kg-sec)] transition-colors hover:text-red-500"
                            >
                                Kosongkan
                            </button>
                        </div>
                    </template>

                    <!-- Langkah 2: data pemesan → buat pesanan pending -->
                    <form
                        v-else
                        @submit.prevent="placeOrder"
                        class="space-y-2.5"
                    >
                        <p class="text-xs text-[var(--kg-sec)]">
                            Lengkapi data agar pesanan tersimpan & kami ingatkan
                            via WhatsApp saat siap diambil.
                        </p>
                        <div class="relative">
                            <User
                                class="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-[var(--kg-sec)]"
                            />
                            <input
                                v-model="orderName"
                                type="text"
                                autocomplete="name"
                                placeholder="Nama kamu*"
                                class="w-full rounded-2xl border-none bg-[var(--kg-surface)] py-3 pr-4 pl-11 text-sm shadow-sm outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-[var(--kg-signal)] dark:ring-white/10"
                            />
                        </div>
                        <div class="relative">
                            <Phone
                                class="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-[var(--kg-sec)]"
                            />
                            <input
                                v-model="orderPhone"
                                type="tel"
                                inputmode="tel"
                                autocomplete="tel"
                                placeholder="Nomor WhatsApp* (08…)"
                                class="w-full rounded-2xl border-none bg-[var(--kg-surface)] py-3 pr-4 pl-11 text-sm shadow-sm outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-[var(--kg-signal)] dark:ring-white/10"
                            />
                        </div>
                        <textarea
                            v-model="orderNote"
                            rows="2"
                            placeholder="Catatan untuk penjual (opsional)"
                            class="w-full resize-none rounded-2xl border-none bg-[var(--kg-surface)] px-4 py-3 text-sm shadow-sm outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-[var(--kg-signal)] dark:ring-white/10"
                        ></textarea>
                        <p
                            v-if="orderError"
                            class="text-xs font-semibold text-red-500"
                        >
                            {{ orderError }}
                        </p>
                        <button
                            type="submit"
                            :disabled="placingOrder"
                            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-base font-bold text-white transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Loader2
                                v-if="placingOrder"
                                class="h-5 w-5 animate-spin"
                            />
                            <MessageCircle v-else class="h-5 w-5" />
                            {{
                                placingOrder
                                    ? 'Menyimpan pesanan…'
                                    : 'Buat Pesanan & Kirim WA'
                            }}
                        </button>
                        <button
                            type="button"
                            :disabled="placingOrder"
                            @click="checkoutStep = 'cart'"
                            class="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-[var(--kg-sec)] transition-colors hover:text-[var(--kg-on)] disabled:opacity-60"
                        >
                            <ArrowLeft class="h-4 w-4" /> Kembali ke keranjang
                        </button>
                    </form>
                </div>
            </aside>
        </transition>

        <!-- Toast -->
        <div
            class="pointer-events-none fixed inset-x-0 top-24 z-[80] flex justify-center px-4"
        >
            <transition name="toast">
                <div
                    v-if="toastMessage"
                    class="pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-2xl bg-[var(--kg-on)] px-4 py-3 text-sm font-semibold text-[var(--kg-bg)] shadow-2xl"
                >
                    <CheckCircle2 class="h-5 w-5 shrink-0 text-emerald-400" />
                    <span class="line-clamp-2">{{ toastMessage }}</span>
                </div>
            </transition>
        </div>
    </div>
</template>

<style>
html {
    scroll-behavior: smooth;
}

/* ===== Kinetic Gourmet palette ===== */
.kg {
    --kg-bg: #f7f9fb;
    --kg-surface: #ffffff;
    --kg-sc: #eceef0;
    --kg-sc-high: #e6e8ea;
    --kg-on: #191c1e;
    --kg-sec: #5d5e62;
    --kg-primary: #a73a00;
    --kg-signal: #ff5c00;
}
.dark .kg {
    --kg-bg: #121417;
    --kg-surface: #1c1f22;
    --kg-sc: #25282b;
    --kg-sc-high: #2c3033;
    --kg-on: #e7e9ea;
    --kg-sec: #a0a3a8;
    --kg-primary: #ff8a4d;
    --kg-signal: #ff5c00;
}

.font-display {
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: -0.03em;
}

.bento-card {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bento-card:hover {
    transform: translateY(-4px);
}

/* Hero: transisi geser antar slide + konten naik saat slide aktif */
.hero-track {
    transition: transform 0.8s cubic-bezier(0.7, 0, 0.2, 1);
}
@keyframes heroIn {
    from {
        opacity: 0;
        transform: translateY(22px);
    }
    to {
        opacity: 1;
        transform: none;
    }
}
.hero-in > * {
    animation: heroIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.hero-in > *:nth-child(2) {
    animation-delay: 0.08s;
}
.hero-in > *:nth-child(3) {
    animation-delay: 0.16s;
}
.hero-in > *:nth-child(4) {
    animation-delay: 0.24s;
}
.hero-in > *:nth-child(5) {
    animation-delay: 0.32s;
}

/* Kartu favorit: spring lift saat hover */
.fav-card {
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    will-change: transform;
}
.fav-card:hover {
    transform: translateY(-8px);
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* ===== Motion: scroll-reveal (client-only) ===== */
.reveal {
    opacity: 1;
    transform: none;
}
.motion-ready .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition:
        opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
        transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: opacity, transform;
}
.motion-ready .reveal.is-visible {
    opacity: 1;
    transform: none;
}

/* Cart drawer & toast transitions */
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

@media (prefers-reduced-motion: reduce) {
    .motion-ready .reveal {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
    }
    .hero-track {
        transition: none !important;
    }
    .hero-in > * {
        animation: none !important;
    }
    .fav-card {
        transition: none !important;
    }
    .animate-bounce {
        animation: none !important;
    }
}
</style>
