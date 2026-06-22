import { r as formatRupiah } from "./format-Cq6R5JhR.js";
import { t as Pagination_default } from "./Pagination-CxLXQdL4.js";
import { t as usePagination } from "./usePagination-Dbv9f4fT.js";
import "./transaksi-BRFObyvO.js";
import { Head, useForm } from "@inertiajs/vue3";
import { computed, createVNode, defineComponent, onBeforeUnmount, onMounted, ref, resolveDynamicComponent, unref, useSSRContext, watch } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderVNode } from "vue/server-renderer";
import { ArrowRight, Banknote, Barcode, ChevronUp, CreditCard, LayoutGrid, Loader2, Lock, Minus, PackageX, Percent, Plus, QrCode, Search, ShoppingBag, ShoppingCart, Trash2, Users, X, Zap } from "lucide-vue-next";
import { toast } from "vue-sonner";
//#region resources/js/pages/kasir/Transaksi.vue?vue&type=script&setup=true&lang.ts
var SCANNER_TIMEOUT_MS = 150;
var SCANNER_MIN_LENGTH = 3;
var Transaksi_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Transaksi",
		href: "/kasir/transaksi"
	}] },
	__name: "Transaksi",
	__ssrInlineRender: true,
	props: {
		produks: {},
		favorite_ids: {},
		pelanggans: {},
		promos: {},
		layanan: {}
	},
	setup(__props) {
		const props = __props;
		const searchQuery = ref("");
		const isScannerDetected = ref(false);
		const scannerStatusText = ref("Scanner tidak terdeteksi");
		const selectedCategory = ref("");
		const cartItems = ref([]);
		const cartOpen = ref(false);
		const scannerBuffer = ref("");
		const lastScannerTime = ref(0);
		const QUICK_DENOMS = [
			5e3,
			1e4,
			2e4,
			5e4,
			1e5
		];
		const form = useForm({
			metode_pembayaran: "cash",
			bayar: "",
			id_pelanggan: null,
			id_promo: null,
			items: []
		});
		let cartUidSeq = 0;
		const nextUid = () => ++cartUidSeq;
		const selectedPelanggan = ref(null);
		const isReseller = computed(() => selectedPelanggan.value?.tipe === "reseller");
		const pelangganQuery = ref("");
		const pelangganResults = ref(props.pelanggans);
		const pelangganSearching = ref(false);
		const pelangganDropdownOpen = ref(false);
		const pelangganBoxRef = ref(null);
		function handlePelangganOutside(event) {
			if (pelangganDropdownOpen.value && pelangganBoxRef.value && !pelangganBoxRef.value.contains(event.target)) pelangganDropdownOpen.value = false;
		}
		function effectiveHarga(item) {
			if (isReseller.value && item.tipe_jual !== "jasa") return Math.max(0, item.harga_base - (item.potongan_reseller || 0));
			return item.harga_base;
		}
		function basePricing(product) {
			const potongan = product.potongan_reseller ?? 0;
			return {
				harga_base: product.harga_jual,
				potongan_reseller: potongan,
				harga: isReseller.value ? Math.max(0, product.harga_jual - potongan) : product.harga_jual
			};
		}
		function applyPricing() {
			cartItems.value.forEach((item) => {
				if (item.tipe_jual === "jasa") return;
				item.harga = effectiveHarga(item);
				if (item.tipe_jual === "curah") recomputeCurahItem(item);
				else item.subtotal = item.harga * item.qty;
			});
		}
		watch(() => form.id_pelanggan, applyPricing);
		const categories = computed(() => {
			const set = /* @__PURE__ */ new Set();
			props.produks.forEach((product) => {
				if (product.kategori) set.add(product.kategori);
			});
			return Array.from(set).sort((a, b) => a.localeCompare(b, "id-ID"));
		});
		const favoriteProducts = computed(() => props.favorite_ids.map((id) => props.produks.find((p) => p.id_produk === id)).filter((p) => !!p && p.stok > 0));
		const activeProductPromos = computed(() => new Map(props.promos.filter((promo) => promo.id_produk !== null).map((promo) => [promo.id_produk, promo])));
		const filteredProduks = computed(() => {
			const query = searchQuery.value.toLowerCase().trim();
			const promoIds = activeProductPromos.value;
			return props.produks.filter((product) => {
				const matchesSearch = !query || product.nama.toLowerCase().includes(query) || product.kategori?.toLowerCase().includes(query);
				const matchesCategory = !selectedCategory.value || product.kategori === selectedCategory.value;
				return matchesSearch && matchesCategory;
			}).sort((a, b) => {
				const aPromo = promoIds.has(a.id_produk) ? 1 : 0;
				return (promoIds.has(b.id_produk) ? 1 : 0) - aPromo;
			});
		});
		const { currentPage, perPage, totalItems, totalPages, paginatedItems: paginatedProduks, startIndex, endIndex, goToPage, visiblePages } = usePagination(() => filteredProduks.value, 10);
		function formatQty(value) {
			return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 3 }).format(Number(value) || 0);
		}
		function recomputeCurahItem(item) {
			const nominal = Math.max(0, Number(item.nominal) || 0);
			item.qty = item.harga > 0 ? Math.round(nominal / item.harga * 1e3) / 1e3 : 0;
			item.subtotal = Math.round(nominal);
		}
		function resolveFoto(foto) {
			if (!foto) return null;
			if (foto.startsWith("http://") || foto.startsWith("https://") || foto.startsWith("/")) return foto;
			return `/storage/${foto}`;
		}
		function getHidApi() {
			if (typeof navigator === "undefined") return null;
			return navigator.hid ?? null;
		}
		function looksLikeBarcodeScanner(device) {
			const productName = device.productName?.toLowerCase() ?? "";
			const productNameLooksLikeScanner = productName.includes("barcode") || productName.includes("scanner") || productName.includes("scan") || productName.includes("qr");
			const hasBarcodeUsagePage = device.collections?.some((collection) => collection.usagePage === 140) ?? false;
			return productNameLooksLikeScanner || hasBarcodeUsagePage;
		}
		function markScannerDetected(message = "Scanner terhubung") {
			isScannerDetected.value = true;
			scannerStatusText.value = message;
		}
		function markScannerNotDetected() {
			isScannerDetected.value = false;
			scannerStatusText.value = "Scanner tidak terdeteksi";
		}
		async function detectScannerDevice() {
			const hid = getHidApi();
			if (!hid) {
				markScannerNotDetected();
				return;
			}
			try {
				if ((await hid.getDevices()).find((device) => looksLikeBarcodeScanner(device))) {
					markScannerDetected("Scanner terhubung");
					return;
				}
				markScannerNotDetected();
			} catch {
				markScannerNotDetected();
			}
		}
		const handleScannerDeviceConnectionChange = () => {
			detectScannerDevice();
		};
		function addToCart(product) {
			const existing = cartItems.value.find((item) => item.id_produk === product.id_produk);
			if (product.tipe_jual === "curah") {
				if (!existing) {
					if (product.stok <= 0) return;
					cartItems.value.push({
						uid: nextUid(),
						id_produk: product.id_produk,
						nama: product.nama,
						...basePricing(product),
						qty: 0,
						subtotal: 0,
						stock: product.stok,
						tipe_jual: "curah",
						satuan: product.satuan,
						nominal: 0,
						fee: 0,
						tarifs: [],
						foto: product.foto,
						foto_url: product.foto_url ?? null
					});
				}
				cartOpen.value = true;
				return;
			}
			if (existing) {
				if (existing.qty < existing.stock) {
					existing.qty += 1;
					existing.subtotal = existing.harga * existing.qty;
				}
				return;
			}
			if (product.stok <= 0) return;
			const pricing = basePricing(product);
			cartItems.value.push({
				uid: nextUid(),
				id_produk: product.id_produk,
				nama: product.nama,
				...pricing,
				qty: 1,
				subtotal: pricing.harga,
				stock: product.stok,
				tipe_jual: product.tipe_jual,
				satuan: product.satuan,
				nominal: 0,
				fee: 0,
				tarifs: [],
				foto: product.foto,
				foto_url: product.foto_url ?? null
			});
		}
		function resolveTarif(tarifs, nominal) {
			if (!tarifs || tarifs.length === 0) return null;
			const sorted = [...tarifs].sort((a, b) => a.min_nominal - b.min_nominal);
			let match = sorted[0];
			for (const t of sorted) if (nominal >= t.min_nominal) match = t;
			return match;
		}
		function appliedTarifLabel(item) {
			const nominal = Number(item.nominal) || 0;
			if (item.tarifs.length === 0 || nominal <= 0) return "";
			const match = resolveTarif(item.tarifs, nominal);
			if (!match) return "";
			const higher = item.tarifs.map((t) => t.min_nominal).filter((m) => m > match.min_nominal).sort((a, b) => a - b)[0];
			return higher === void 0 ? `${formatRupiah(match.min_nominal)} ke atas` : `${formatRupiah(match.min_nominal)} – ${formatRupiah(higher - 1)}`;
		}
		const cartCount = computed(() => cartItems.value.reduce((sum, item) => sum + (item.tipe_jual === "satuan" ? item.qty : 1), 0));
		const invalidCurahItems = computed(() => cartItems.value.filter((item) => item.tipe_jual === "curah" && ((Number(item.nominal) || 0) <= 0 || item.qty > item.stock)));
		const invalidJasaItems = computed(() => cartItems.value.filter((item) => item.tipe_jual === "jasa" && ((Number(item.nominal) || 0) <= 0 || (Number(item.fee) || 0) <= 0)));
		const hasInvalidItems = computed(() => invalidCurahItems.value.length > 0 || invalidJasaItems.value.length > 0);
		const cartQtyById = computed(() => {
			const map = /* @__PURE__ */ new Map();
			cartItems.value.forEach((item) => {
				if (item.tipe_jual !== "jasa") map.set(item.id_produk, item.qty);
			});
			return map;
		});
		const totalHarga = computed(() => {
			return cartItems.value.reduce((sum, item) => sum + item.subtotal, 0);
		});
		const globalPromos = computed(() => props.promos.filter((promo) => promo.id_produk === null));
		const selectedPromo = computed(() => {
			return props.promos.find((promo) => promo.id_promo === form.id_promo) ?? null;
		});
		function calculateItemPromoDiscount(item) {
			if (item.tipe_jual === "jasa") return 0;
			const promo = activeProductPromos.value.get(item.id_produk);
			if (!promo) return 0;
			if (promo.tipe === "persen") return Math.floor(item.subtotal * (promo.nilai / 100));
			return Math.floor(promo.nilai * item.qty);
		}
		const productPromoDiscount = computed(() => {
			return cartItems.value.reduce((sum, item) => sum + calculateItemPromoDiscount(item), 0);
		});
		const globalPromoDiscount = computed(() => {
			if (!selectedPromo.value) return 0;
			if (selectedPromo.value.minimal_belanja && totalHarga.value < selectedPromo.value.minimal_belanja) return 0;
			if (selectedPromo.value.tipe === "persen") return Math.floor(totalHarga.value * (selectedPromo.value.nilai / 100));
			return Math.floor(selectedPromo.value.nilai);
		});
		const totalDiscount = computed(() => Math.max(0, productPromoDiscount.value + globalPromoDiscount.value));
		const totalAfterDiscount = computed(() => Math.max(0, totalHarga.value - totalDiscount.value));
		const totalNominalJasa = computed(() => cartItems.value.reduce((sum, item) => sum + (item.tipe_jual === "jasa" ? Number(item.nominal) || 0 : 0), 0));
		const totalTagihan = computed(() => totalAfterDiscount.value + totalNominalJasa.value);
		const kembalian = computed(() => {
			const bayar = Number(form.bayar) || 0;
			return Math.max(0, bayar - totalTagihan.value);
		});
		const isPaid = computed(() => (Number(form.bayar) || 0) >= totalTagihan.value);
		const paymentMethods = [
			{
				value: "cash",
				label: "Tunai",
				icon: Banknote
			},
			{
				value: "qris",
				label: "QRIS",
				icon: QrCode
			},
			{
				value: "transfer",
				label: "Transfer",
				icon: CreditCard
			}
		];
		const cashSuggestions = computed(() => {
			const total = totalTagihan.value;
			if (total <= 0) return [];
			const rounded = Math.ceil(total / 1e4) * 1e4;
			const set = new Set([rounded, ...QUICK_DENOMS.filter((denom) => denom >= total)]);
			return Array.from(set).filter((value) => value >= total).sort((a, b) => a - b).slice(0, 3);
		});
		function handleScannerKeydown(event) {
			if (event.defaultPrevented) return;
			const now = performance.now();
			if (now - lastScannerTime.value > SCANNER_TIMEOUT_MS) scannerBuffer.value = "";
			lastScannerTime.value = now;
			if (event.key === "Enter") {
				const barcode = scannerBuffer.value.trim();
				if (barcode.length >= SCANNER_MIN_LENGTH) {
					event.preventDefault();
					markScannerDetected("Scanner terhubung");
					scanBarcode(barcode);
				}
				scannerBuffer.value = "";
				return;
			}
			if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) scannerBuffer.value += event.key;
		}
		onMounted(() => {
			document.addEventListener("keydown", handleScannerKeydown);
			document.addEventListener("mousedown", handlePelangganOutside);
			detectScannerDevice();
			const hid = getHidApi();
			hid?.addEventListener("connect", handleScannerDeviceConnectionChange);
			hid?.addEventListener("disconnect", handleScannerDeviceConnectionChange);
			const cari = new URLSearchParams(window.location.search).get("cari");
			if (cari) searchQuery.value = cari;
		});
		onBeforeUnmount(() => {
			document.removeEventListener("keydown", handleScannerKeydown);
			document.removeEventListener("mousedown", handlePelangganOutside);
			const hid = getHidApi();
			hid?.removeEventListener("connect", handleScannerDeviceConnectionChange);
			hid?.removeEventListener("disconnect", handleScannerDeviceConnectionChange);
		});
		function scanBarcode(barcode) {
			const code = barcode.trim();
			if (!code) return;
			const produk = props.produks.find((item) => item.barcode === code);
			if (!produk) {
				toast.error("Produk tidak ditemukan", {
					description: `Barcode "${code}" tidak cocok dengan produk manapun.`,
					duration: 5e3
				});
				return;
			}
			if (produk.stok <= 0) {
				toast.warning("Stok habis", {
					description: `Produk "${produk.nama}" sedang tidak tersedia.`,
					duration: 4e3
				});
				return;
			}
			addToCart(produk);
			toast.success("Produk ditambahkan", {
				description: `"${produk.nama}" masuk ke keranjang.`,
				duration: 3e3
			});
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Transaksi Baru - Kasir" }, null, _parent));
			_push(`<div class="@container/pos relative" data-v-e717ba42><div class="flex min-h-[calc(100svh-4rem)] flex-col @2xl/pos:min-h-[calc(100svh-5rem)] @2xl/pos:flex-row @2xl/pos:gap-4 @2xl/pos:p-4 @5xl/pos:gap-6 @5xl/pos:p-6" data-v-e717ba42><div class="flex min-w-0 flex-1 flex-col" data-v-e717ba42><div class="shrink-0 space-y-3 px-4 pt-4 @md/pos:px-6 @md/pos:pt-6 @2xl/pos:px-0 @2xl/pos:pt-0" data-v-e717ba42><div class="flex items-center justify-between gap-3" data-v-e717ba42><div class="min-w-0" data-v-e717ba42><h1 class="text-xl font-extrabold tracking-tight sm:text-2xl" data-v-e717ba42>Kasir</h1><p class="hidden text-xs text-muted-foreground sm:block" data-v-e717ba42> Cari, scan, atau ketuk produk untuk menambah ke keranjang. </p></div><div role="status"${ssrRenderAttr("title", scannerStatusText.value)} class="${ssrRenderClass(["inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold", isScannerDetected.value ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-slate-300/70 bg-slate-100 text-slate-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"])}" data-v-e717ba42>`);
			_push(ssrRenderComponent(unref(Barcode), { class: "h-3.5 w-3.5" }, null, _parent));
			_push(`<span class="${ssrRenderClass(["h-1.5 w-1.5 rounded-full", isScannerDetected.value ? "bg-emerald-500" : "bg-slate-400"])}" data-v-e717ba42></span><span class="hidden sm:inline" data-v-e717ba42>${ssrInterpolate(isScannerDetected.value ? "Scanner siap" : "Scan manual")}</span></div></div><div class="relative" data-v-e717ba42>`);
			_push(ssrRenderComponent(unref(Search), { class: "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" }, null, _parent));
			_push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Cari nama produk atau kategori..." aria-label="Cari produk" class="w-full rounded-2xl border border-sidebar-border/70 bg-background py-3 pl-12 pr-11 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border" data-v-e717ba42>`);
			if (searchQuery.value) {
				_push(`<button type="button" aria-label="Hapus pencarian" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition hover:bg-slate-100 dark:hover:bg-zinc-800" data-v-e717ba42>`);
				_push(ssrRenderComponent(unref(X), { class: "h-4 w-4" }, null, _parent));
				_push(`</button>`);
			} else _push(`<!---->`);
			_push(`</div>`);
			if (__props.layanan.length) {
				_push(`<div class="flex items-center gap-2.5 rounded-2xl border border-violet-500/30 bg-violet-500/[0.07] px-3 py-2 dark:bg-violet-500/10" data-v-e717ba42><span class="flex shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-violet-700 dark:text-violet-300" data-v-e717ba42>`);
				_push(ssrRenderComponent(unref(CreditCard), { class: "h-4 w-4" }, null, _parent));
				_push(`<span class="hidden sm:inline" data-v-e717ba42>Layanan</span></span><div class="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto" data-v-e717ba42><!--[-->`);
				ssrRenderList(__props.layanan, (svc) => {
					_push(`<button type="button" class="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500 active:scale-[0.98]" data-v-e717ba42>${ssrInterpolate(svc.nama)} `);
					_push(ssrRenderComponent(unref(Plus), { class: "h-3.5 w-3.5 opacity-90" }, null, _parent));
					_push(`</button>`);
				});
				_push(`<!--]--></div></div>`);
			} else _push(`<!---->`);
			if (categories.value.length) {
				_push(`<div class="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 @md/pos:-mx-6 @md/pos:px-6 @2xl/pos:mx-0 @2xl/pos:px-0" data-v-e717ba42><button type="button" class="${ssrRenderClass(["inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition", selectedCategory.value === "" ? "border-indigo-500 bg-indigo-600 text-white shadow-sm" : "border-sidebar-border/70 bg-background text-muted-foreground hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800"])}" data-v-e717ba42>`);
				_push(ssrRenderComponent(unref(LayoutGrid), { class: "h-3.5 w-3.5" }, null, _parent));
				_push(` Semua </button><!--[-->`);
				ssrRenderList(categories.value, (cat) => {
					_push(`<button type="button" class="${ssrRenderClass(["shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition", selectedCategory.value === cat ? "border-indigo-500 bg-indigo-600 text-white shadow-sm" : "border-sidebar-border/70 bg-background text-muted-foreground hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800"])}" data-v-e717ba42>${ssrInterpolate(cat)}</button>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
			if (favoriteProducts.value.length && !searchQuery.value) {
				_push(`<div class="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-0.5 @md/pos:-mx-6 @md/pos:px-6 @2xl/pos:mx-0 @2xl/pos:px-0" data-v-e717ba42><span class="flex shrink-0 items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground" data-v-e717ba42>`);
				_push(ssrRenderComponent(unref(Zap), { class: "h-3.5 w-3.5" }, null, _parent));
				_push(` Sering dibeli </span><!--[-->`);
				ssrRenderList(favoriteProducts.value, (fav) => {
					_push(`<button type="button" class="inline-flex shrink-0 items-center gap-2 rounded-full border border-sidebar-border/70 bg-background px-3 py-1.5 text-xs font-semibold transition hover:border-indigo-500/40 hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800" data-v-e717ba42><span class="max-w-[7rem] truncate" data-v-e717ba42>${ssrInterpolate(fav.nama)}</span><span class="text-indigo-600 dark:text-indigo-400" data-v-e717ba42>${ssrInterpolate(unref(formatRupiah)(fav.harga_jual))}</span>`);
					if (cartQtyById.value.get(fav.id_produk)) _push(`<span class="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white" data-v-e717ba42>${ssrInterpolate(formatQty(cartQtyById.value.get(fav.id_produk)))}</span>`);
					else _push(`<!---->`);
					_push(`</button>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
			_push(`</div><div class="@container/cat flex-1 px-4 pt-4 pb-28 @md/pos:px-6 @2xl/pos:px-0 @2xl/pos:pb-4" data-v-e717ba42><div class="grid grid-cols-4 gap-2 @md/cat:gap-3 @3xl/cat:grid-cols-5 @5xl/cat:grid-cols-6" data-v-e717ba42><!--[-->`);
			ssrRenderList(unref(paginatedProduks), (product) => {
				_push(`<button type="button"${ssrIncludeBooleanAttr(product.stok === 0) ? " disabled" : ""} class="${ssrRenderClass(["group relative flex flex-col overflow-hidden rounded-xl border bg-card text-left shadow-sm transition-all duration-200 @lg/cat:rounded-2xl", product.stok > 0 ? "border-sidebar-border/70 hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-md active:scale-[0.98] dark:border-sidebar-border" : "cursor-not-allowed border-sidebar-border/40 opacity-60"])}" data-v-e717ba42><div class="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-zinc-900" data-v-e717ba42>`);
				if (resolveFoto(product.foto_url ?? product.foto)) _push(`<img${ssrRenderAttr("src", resolveFoto(product.foto_url ?? product.foto) ?? void 0)}${ssrRenderAttr("alt", product.nama)} class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" data-v-e717ba42>`);
				else {
					_push(`<div class="flex h-full w-full items-center justify-center text-muted-foreground" data-v-e717ba42>`);
					_push(ssrRenderComponent(unref(PackageX), { class: "h-6 w-6 opacity-40" }, null, _parent));
					_push(`</div>`);
				}
				if (activeProductPromos.value.get(product.id_produk)) {
					_push(`<span class="absolute left-1 top-1 inline-flex items-center gap-0.5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow @lg/cat:left-2 @lg/cat:top-2 @lg/cat:px-2 @lg/cat:text-[10px]" data-v-e717ba42>`);
					_push(ssrRenderComponent(unref(Percent), { class: "h-2.5 w-2.5" }, null, _parent));
					_push(` ${ssrInterpolate(activeProductPromos.value.get(product.id_produk)?.tipe === "persen" ? `${activeProductPromos.value.get(product.id_produk)?.nilai}%` : "Promo")}</span>`);
				} else _push(`<!---->`);
				if (cartQtyById.value.get(product.id_produk)) _push(`<span class="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-md ring-2 ring-white @lg/cat:right-2 @lg/cat:top-2 @lg/cat:h-6 @lg/cat:min-w-6 @lg/cat:text-xs dark:ring-zinc-900" data-v-e717ba42>${ssrInterpolate(formatQty(cartQtyById.value.get(product.id_produk)))}</span>`);
				else _push(`<!---->`);
				if (product.stok === 0) _push(`<div class="absolute inset-0 flex items-center justify-center bg-slate-900/40" data-v-e717ba42><span class="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white" data-v-e717ba42>Habis</span></div>`);
				else _push(`<!---->`);
				_push(`</div><div class="flex flex-1 flex-col p-2 @lg/cat:p-3" data-v-e717ba42><h3 class="line-clamp-2 text-[11px] font-semibold leading-tight text-foreground @lg/cat:text-sm @lg/cat:leading-snug" data-v-e717ba42>${ssrInterpolate(product.nama)}</h3><p class="mt-1 truncate text-xs font-bold text-indigo-600 @lg/cat:text-sm dark:text-indigo-400" data-v-e717ba42>${ssrInterpolate(unref(formatRupiah)(product.harga_jual))}`);
				if (product.tipe_jual === "curah") _push(`<span class="text-[9px] font-medium text-muted-foreground" data-v-e717ba42>/${ssrInterpolate(product.satuan)}</span>`);
				else _push(`<!---->`);
				_push(`</p><p class="${ssrRenderClass(["mt-0.5 text-[9px] font-medium @lg/cat:text-[10px]", product.stok > 10 ? "text-muted-foreground" : product.stok > 0 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"])}" data-v-e717ba42>${ssrInterpolate(product.stok > 0 ? `Stok ${formatQty(product.stok)}` : "Habis")}</p></div></button>`);
			});
			_push(`<!--]--></div>`);
			if (filteredProduks.value.length === 0) {
				_push(`<div class="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground" data-v-e717ba42>`);
				_push(ssrRenderComponent(unref(PackageX), { class: "h-10 w-10 opacity-40" }, null, _parent));
				_push(`<p class="font-medium" data-v-e717ba42>Tidak ada produk yang sesuai pencarian.</p></div>`);
			} else _push(`<!---->`);
			if (filteredProduks.value.length > 0) _push(ssrRenderComponent(Pagination_default, {
				class: "mt-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border",
				"current-page": unref(currentPage),
				"total-pages": unref(totalPages),
				"total-items": unref(totalItems),
				"start-index": unref(startIndex),
				"end-index": unref(endIndex),
				"per-page": unref(perPage),
				"visible-pages": unref(visiblePages),
				"onUpdate:currentPage": unref(goToPage),
				"onUpdate:perPage": ($event) => perPage.value = $event
			}, null, _parent));
			else _push(`<!---->`);
			_push(`</div></div>`);
			if (cartOpen.value) _push(`<div class="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm @2xl/pos:hidden" data-v-e717ba42></div>`);
			else _push(`<!---->`);
			_push(`<aside class="${ssrRenderClass([
				"flex flex-col bg-card shadow-2xl transition-transform duration-300 ease-out",
				"fixed inset-x-0 bottom-0 z-[60] max-h-[88vh] overflow-y-auto rounded-t-3xl border-t border-sidebar-border/70 dark:border-sidebar-border",
				cartOpen.value ? "translate-y-0" : "translate-y-full",
				"@2xl/pos:static @2xl/pos:z-auto @2xl/pos:max-h-none @2xl/pos:w-[300px] @2xl/pos:shrink-0 @2xl/pos:translate-y-0 @2xl/pos:self-start @2xl/pos:overflow-visible @2xl/pos:rounded-2xl @2xl/pos:border @2xl/pos:shadow-sm @4xl/pos:w-[340px] @6xl/pos:w-[380px]"
			])}" data-v-e717ba42><div class="sticky top-0 z-10 shrink-0 bg-card @2xl/pos:static" data-v-e717ba42><div class="flex justify-center pt-2.5 @2xl/pos:hidden" data-v-e717ba42><span class="h-1.5 w-10 rounded-full bg-slate-300 dark:bg-zinc-700" data-v-e717ba42></span></div><div class="flex items-center justify-between border-b border-sidebar-border/70 px-4 py-3.5 dark:border-sidebar-border" data-v-e717ba42><div class="flex items-center gap-2" data-v-e717ba42>`);
			_push(ssrRenderComponent(unref(ShoppingCart), { class: "h-5 w-5 text-indigo-600 dark:text-indigo-400" }, null, _parent));
			_push(`<h2 class="font-bold tracking-tight" data-v-e717ba42>Keranjang</h2><span class="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400" data-v-e717ba42>${ssrInterpolate(cartCount.value)}</span></div><div class="flex items-center gap-1" data-v-e717ba42>`);
			if (cartItems.value.length) {
				_push(`<button type="button" class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10" data-v-e717ba42>`);
				_push(ssrRenderComponent(unref(Trash2), { class: "h-3.5 w-3.5" }, null, _parent));
				_push(` Kosongkan </button>`);
			} else _push(`<!---->`);
			_push(`<button type="button" aria-label="Tutup keranjang" class="rounded-lg p-1.5 text-muted-foreground transition hover:bg-slate-100 @2xl/pos:hidden dark:hover:bg-zinc-800" data-v-e717ba42>`);
			_push(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent));
			_push(`</button></div></div></div><div class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border" data-v-e717ba42>`);
			if (cartItems.value.length === 0) {
				_push(`<div class="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center" data-v-e717ba42><div class="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800" data-v-e717ba42>`);
				_push(ssrRenderComponent(unref(ShoppingBag), { class: "h-7 w-7 text-muted-foreground" }, null, _parent));
				_push(`</div><p class="text-sm font-medium text-muted-foreground" data-v-e717ba42>Keranjang masih kosong</p><p class="text-xs text-muted-foreground" data-v-e717ba42>Pilih produk atau scan barcode untuk memulai.</p></div>`);
			} else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(cartItems.value, (item) => {
				_push(`<div class="px-4 py-3 transition-colors hover:bg-slate-50/60 dark:hover:bg-zinc-800/20" data-v-e717ba42><div class="flex items-center gap-3" data-v-e717ba42>`);
				if (item.tipe_jual === "jasa") {
					_push(`<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400" data-v-e717ba42>`);
					_push(ssrRenderComponent(unref(CreditCard), { class: "h-5 w-5" }, null, _parent));
					_push(`</div>`);
				} else if (resolveFoto(item.foto_url ?? item.foto)) _push(`<img${ssrRenderAttr("src", resolveFoto(item.foto_url ?? item.foto) ?? void 0)}${ssrRenderAttr("alt", item.nama)} class="h-12 w-12 shrink-0 rounded-xl border border-sidebar-border/70 object-cover dark:border-sidebar-border" data-v-e717ba42>`);
				else {
					_push(`<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sidebar-border/70 bg-slate-100 text-muted-foreground dark:border-sidebar-border dark:bg-zinc-800" data-v-e717ba42>`);
					_push(ssrRenderComponent(unref(PackageX), { class: "h-5 w-5 opacity-50" }, null, _parent));
					_push(`</div>`);
				}
				_push(`<div class="min-w-0 flex-1" data-v-e717ba42><h4 class="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground" data-v-e717ba42>${ssrInterpolate(item.nama)} `);
				if (item.tipe_jual === "jasa") _push(`<span class="inline-flex shrink-0 items-center rounded border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-bold text-violet-600 dark:text-violet-400" data-v-e717ba42> Jasa </span>`);
				else _push(`<!---->`);
				_push(`</h4>`);
				if (item.tipe_jual === "jasa") _push(`<p class="text-xs text-muted-foreground" data-v-e717ba42>Fee admin (pendapatan)</p>`);
				else {
					_push(`<p class="text-xs text-muted-foreground" data-v-e717ba42>${ssrInterpolate(unref(formatRupiah)(item.harga))}`);
					if (item.tipe_jual === "curah") _push(`<span data-v-e717ba42> / ${ssrInterpolate(item.satuan)}</span>`);
					else _push(`<!---->`);
					_push(`</p>`);
				}
				_push(`<p class="text-sm font-bold text-indigo-600 dark:text-indigo-400" data-v-e717ba42>${ssrInterpolate(unref(formatRupiah)(item.subtotal))}</p></div><div class="flex flex-col items-end gap-1.5" data-v-e717ba42><button type="button" class="rounded-lg p-1 text-muted-foreground transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10" data-v-e717ba42>`);
				_push(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4" }, null, _parent));
				_push(`</button>`);
				if (item.tipe_jual === "satuan") {
					_push(`<div class="flex items-center gap-1 rounded-lg border border-sidebar-border/70 p-0.5 dark:border-sidebar-border" data-v-e717ba42><button type="button" class="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-zinc-800" data-v-e717ba42>`);
					_push(ssrRenderComponent(unref(Minus), { class: "h-3.5 w-3.5" }, null, _parent));
					_push(`</button><input type="text" inputmode="numeric"${ssrRenderAttr("value", item.qty)}${ssrRenderAttr("aria-label", `Jumlah ${item.nama}`)} class="w-10 rounded-md bg-transparent text-center text-sm font-bold tabular-nums text-foreground outline-none focus:ring-2 focus:ring-indigo-500/30" data-v-e717ba42><button type="button" class="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-zinc-800"${ssrIncludeBooleanAttr(item.qty >= item.stock) ? " disabled" : ""} data-v-e717ba42>`);
					_push(ssrRenderComponent(unref(Plus), { class: "h-3.5 w-3.5" }, null, _parent));
					_push(`</button></div>`);
				} else _push(`<!---->`);
				_push(`</div></div>`);
				if (item.tipe_jual === "curah") {
					_push(`<div class="mt-2 space-y-1" data-v-e717ba42><div class="relative" data-v-e717ba42><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground" data-v-e717ba42>Rp</span><input${ssrRenderAttr("value", item.nominal)} type="number" min="0" inputmode="numeric" placeholder="Nominal pembelian (mis. 20000)" class="${ssrRenderClass(["w-full rounded-lg border bg-background py-2 pl-8 pr-3 text-sm font-semibold transition focus:ring-2 focus:ring-indigo-500/20 focus:outline-none", item.nominal > 0 && item.qty > item.stock ? "border-rose-500 focus:border-rose-500" : "border-sidebar-border/70 focus:border-indigo-500 dark:border-sidebar-border"])}" data-v-e717ba42></div>`);
					if (item.nominal > 0 && item.qty <= item.stock) _push(`<p class="text-xs text-muted-foreground" data-v-e717ba42> ≈ ${ssrInterpolate(formatQty(item.qty))} ${ssrInterpolate(item.satuan)} · stok ${ssrInterpolate(formatQty(item.stock))} ${ssrInterpolate(item.satuan)}</p>`);
					else if (item.qty > item.stock) _push(`<p class="text-xs font-medium text-rose-600 dark:text-rose-400" data-v-e717ba42> Melebihi stok: butuh ${ssrInterpolate(formatQty(item.qty))} ${ssrInterpolate(item.satuan)}, tersedia ${ssrInterpolate(formatQty(item.stock))} ${ssrInterpolate(item.satuan)}. </p>`);
					else _push(`<p class="text-xs text-amber-600 dark:text-amber-400" data-v-e717ba42> Masukkan nominal pembelian dulu. </p>`);
					_push(`</div>`);
				} else _push(`<!---->`);
				if (item.tipe_jual === "jasa") {
					_push(`<div class="mt-2 grid grid-cols-2 gap-2" data-v-e717ba42><div data-v-e717ba42><label class="mb-1 block text-[11px] font-medium text-muted-foreground" data-v-e717ba42>Nominal (titipan)</label><div class="relative" data-v-e717ba42><span class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground" data-v-e717ba42>Rp</span><input${ssrRenderAttr("value", item.nominal)} type="number" min="0" inputmode="numeric" placeholder="500000"${ssrRenderAttr("data-jasa-nominal", item.uid)} class="${ssrRenderClass(["w-full rounded-lg border bg-background py-2 pl-7 pr-2 text-sm font-semibold transition focus:ring-2 focus:ring-indigo-500/20 focus:outline-none", (Number(item.nominal) || 0) <= 0 ? "border-amber-500/50 focus:border-amber-500" : "border-sidebar-border/70 focus:border-indigo-500 dark:border-sidebar-border"])}" data-v-e717ba42></div></div><div data-v-e717ba42><label class="mb-1 flex items-center gap-1 text-[11px] font-medium text-muted-foreground" data-v-e717ba42> Fee `);
					if (item.tarifs.length > 0) {
						_push(`<span class="inline-flex items-center gap-0.5 rounded bg-violet-500/10 px-1 py-0.5 text-[9px] font-semibold text-violet-600 dark:text-violet-400" data-v-e717ba42>`);
						_push(ssrRenderComponent(unref(Lock), { class: "h-2.5 w-2.5" }, null, _parent));
						_push(` Otomatis </span>`);
					} else _push(`<!---->`);
					_push(`</label><div class="relative" data-v-e717ba42><span class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground" data-v-e717ba42>Rp</span><input${ssrRenderAttr("value", item.fee)} type="number" min="0" inputmode="numeric" placeholder="5000"${ssrIncludeBooleanAttr(item.tarifs.length > 0) ? " readonly" : ""} class="${ssrRenderClass(["w-full rounded-lg border py-2 pl-7 pr-2 text-sm font-semibold transition focus:ring-2 focus:ring-indigo-500/20 focus:outline-none", item.tarifs.length > 0 ? "cursor-not-allowed border-sidebar-border/70 bg-slate-100 text-muted-foreground dark:border-sidebar-border dark:bg-zinc-800" : (Number(item.fee) || 0) <= 0 ? "border-amber-500/50 bg-background focus:border-amber-500" : "border-sidebar-border/70 bg-background focus:border-indigo-500 dark:border-sidebar-border"])}" data-v-e717ba42></div></div>`);
					if (item.tarifs.length > 0 && appliedTarifLabel(item)) _push(`<p class="col-span-2 -mt-0.5 text-[11px] font-medium text-violet-600 dark:text-violet-400" data-v-e717ba42> Tarif: ${ssrInterpolate(appliedTarifLabel(item))}</p>`);
					else if (item.tarifs.length > 0) _push(`<p class="col-span-2 -mt-0.5 text-[11px] text-muted-foreground" data-v-e717ba42> Isi nominal dulu — fee terisi otomatis dari tarif. </p>`);
					else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			});
			_push(`<!--]--></div><div class="shrink-0 border-t border-sidebar-border/70 bg-slate-50/60 pb-[env(safe-area-inset-bottom)] dark:border-sidebar-border dark:bg-zinc-900/40" data-v-e717ba42>`);
			if (cartItems.value.length) {
				_push(`<!--[--><div class="space-y-2.5 border-b border-sidebar-border/70 px-4 py-3 dark:border-sidebar-border" data-v-e717ba42><div class="relative" data-v-e717ba42><label class="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground" data-v-e717ba42>`);
				_push(ssrRenderComponent(unref(Users), { class: "h-3.5 w-3.5" }, null, _parent));
				_push(` Pelanggan </label>`);
				if (selectedPelanggan.value) {
					_push(`<div class="flex items-center justify-between gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/5 px-3 py-2" data-v-e717ba42><span class="flex min-w-0 items-center gap-1.5" data-v-e717ba42><span class="truncate text-sm font-semibold text-foreground" data-v-e717ba42>${ssrInterpolate(selectedPelanggan.value.nama)}</span>`);
					if (selectedPelanggan.value.tipe === "reseller") _push(`<span class="shrink-0 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400" data-v-e717ba42>Reseller</span>`);
					else _push(`<!---->`);
					_push(`</span><button type="button" aria-label="Hapus pelanggan" class="rounded-lg p-1 text-muted-foreground transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10" data-v-e717ba42>`);
					_push(ssrRenderComponent(unref(X), { class: "h-4 w-4" }, null, _parent));
					_push(`</button></div>`);
				} else {
					_push(`<div class="relative" data-v-e717ba42>`);
					_push(ssrRenderComponent(unref(Search), { class: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, null, _parent));
					_push(`<input${ssrRenderAttr("value", pelangganQuery.value)} type="text" placeholder="Cari nama pelanggan..." aria-label="Cari pelanggan" class="w-full rounded-xl border border-sidebar-border/70 bg-background py-2 pl-9 pr-9 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border" data-v-e717ba42>`);
					if (pelangganSearching.value) _push(ssrRenderComponent(unref(Loader2), { class: "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" }, null, _parent));
					else _push(`<!---->`);
					_push(`</div>`);
				}
				if (pelangganDropdownOpen.value && !selectedPelanggan.value) {
					_push(`<div class="absolute inset-x-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-sidebar-border/70 bg-card py-1 shadow-xl dark:border-sidebar-border" data-v-e717ba42><button type="button" class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-zinc-800" data-v-e717ba42>`);
					_push(ssrRenderComponent(unref(Users), { class: "h-4 w-4 shrink-0 text-muted-foreground" }, null, _parent));
					_push(` Umum (tanpa potongan) </button><!--[-->`);
					ssrRenderList(pelangganResults.value, (p) => {
						_push(`<button type="button" class="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-zinc-800" data-v-e717ba42><span class="truncate" data-v-e717ba42>${ssrInterpolate(p.nama)}</span>`);
						if (p.tipe === "reseller") _push(`<span class="shrink-0 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400" data-v-e717ba42>Reseller</span>`);
						else _push(`<!---->`);
						_push(`</button>`);
					});
					_push(`<!--]-->`);
					if (pelangganSearching.value) _push(`<p class="px-3 py-2 text-xs text-muted-foreground" data-v-e717ba42>Mencari…</p>`);
					else if (pelangganResults.value.length === 0) _push(`<p class="px-3 py-2 text-xs text-muted-foreground" data-v-e717ba42> Pelanggan tidak ditemukan. </p>`);
					else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<!---->`);
				if (isReseller.value) _push(`<p class="mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400" data-v-e717ba42> Harga reseller diterapkan ke produk yang punya potongan. </p>`);
				else _push(`<!---->`);
				_push(`</div><div data-v-e717ba42><label class="mb-1 block text-[11px] font-semibold text-muted-foreground" data-v-e717ba42>Promo tambahan</label><select class="w-full rounded-xl border border-sidebar-border/70 bg-background px-3 py-2 text-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border" data-v-e717ba42><option${ssrRenderAttr("value", null)} data-v-e717ba42${ssrIncludeBooleanAttr(Array.isArray(unref(form).id_promo) ? ssrLooseContain(unref(form).id_promo, null) : ssrLooseEqual(unref(form).id_promo, null)) ? " selected" : ""}>Tanpa promo</option><!--[-->`);
				ssrRenderList(globalPromos.value, (promo) => {
					_push(`<option${ssrRenderAttr("value", promo.id_promo)} data-v-e717ba42${ssrIncludeBooleanAttr(Array.isArray(unref(form).id_promo) ? ssrLooseContain(unref(form).id_promo, promo.id_promo) : ssrLooseEqual(unref(form).id_promo, promo.id_promo)) ? " selected" : ""}>${ssrInterpolate(promo.nama)}</option>`);
				});
				_push(`<!--]--></select>`);
				if (selectedPromo.value && selectedPromo.value.minimal_belanja && totalHarga.value < selectedPromo.value.minimal_belanja) _push(`<p class="mt-1 text-[11px] text-amber-600 dark:text-amber-400" data-v-e717ba42> Minimal belanja ${ssrInterpolate(unref(formatRupiah)(selectedPromo.value.minimal_belanja))} untuk promo ini. </p>`);
				else _push(`<!---->`);
				_push(`</div></div><div class="space-y-3 p-4" data-v-e717ba42><div class="space-y-1.5" data-v-e717ba42><div class="flex items-center justify-between text-xs text-muted-foreground" data-v-e717ba42><span data-v-e717ba42>Subtotal</span><span class="tabular-nums" data-v-e717ba42>${ssrInterpolate(unref(formatRupiah)(totalHarga.value))}</span></div>`);
				if (totalDiscount.value > 0) _push(`<div class="flex items-center justify-between text-xs" data-v-e717ba42><span class="text-muted-foreground" data-v-e717ba42>Diskon</span><span class="font-medium text-emerald-600 tabular-nums dark:text-emerald-400" data-v-e717ba42>-${ssrInterpolate(unref(formatRupiah)(totalDiscount.value))}</span></div>`);
				else _push(`<!---->`);
				if (totalNominalJasa.value > 0) _push(`<div class="flex items-center justify-between text-xs" data-v-e717ba42><span class="text-muted-foreground" data-v-e717ba42>Titipan layanan (bukan omzet)</span><span class="tabular-nums" data-v-e717ba42>+${ssrInterpolate(unref(formatRupiah)(totalNominalJasa.value))}</span></div>`);
				else _push(`<!---->`);
				_push(`<div class="flex items-baseline justify-between border-t border-sidebar-border/70 pt-2 dark:border-sidebar-border" data-v-e717ba42><span class="text-sm font-bold" data-v-e717ba42>${ssrInterpolate(totalNominalJasa.value > 0 ? "Total Bayar" : "Total")}</span><span class="text-2xl font-extrabold text-indigo-600 tabular-nums dark:text-indigo-400" data-v-e717ba42>${ssrInterpolate(unref(formatRupiah)(totalTagihan.value))}</span></div></div><div data-v-e717ba42><label class="mb-1.5 block text-[11px] font-semibold text-muted-foreground" data-v-e717ba42>Metode pembayaran</label><div class="grid grid-cols-3 gap-2" data-v-e717ba42><!--[-->`);
				ssrRenderList(paymentMethods, (method) => {
					_push(`<button type="button" class="${ssrRenderClass(["flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs font-semibold transition", unref(form).metode_pembayaran === method.value ? "border-indigo-500 bg-indigo-600 text-white shadow-sm" : "border-sidebar-border/70 bg-background text-muted-foreground hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800"])}" data-v-e717ba42>`);
					ssrRenderVNode(_push, createVNode(resolveDynamicComponent(method.icon), { class: "h-4 w-4" }, null), _parent);
					_push(` ${ssrInterpolate(method.label)}</button>`);
				});
				_push(`<!--]--></div></div><div data-v-e717ba42><label class="mb-1.5 block text-[11px] font-semibold text-muted-foreground" data-v-e717ba42>Uang diterima</label><div class="relative" data-v-e717ba42><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground" data-v-e717ba42>Rp</span><input${ssrRenderAttr("value", unref(form).bayar)} type="number" min="0" inputmode="numeric" placeholder="0" class="w-full rounded-xl border border-sidebar-border/70 bg-background py-2.5 pl-9 pr-3 text-sm font-semibold transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-sidebar-border" data-v-e717ba42></div>`);
				if (unref(form).metode_pembayaran === "cash" && cashSuggestions.value.length) {
					_push(`<div class="mt-2 flex flex-wrap gap-2" data-v-e717ba42><button type="button" class="rounded-lg border border-indigo-500/30 bg-indigo-500/5 px-2.5 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-500/10 dark:text-indigo-400" data-v-e717ba42> Uang Pas </button><!--[-->`);
					ssrRenderList(cashSuggestions.value, (amount) => {
						_push(`<button type="button" class="rounded-lg border border-sidebar-border/70 bg-background px-2.5 py-1 text-xs font-semibold text-foreground transition hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800" data-v-e717ba42>${ssrInterpolate(unref(formatRupiah)(amount))}</button>`);
					});
					_push(`<!--]--></div>`);
				} else _push(`<!---->`);
				if (unref(form).errors.bayar) _push(`<p class="mt-1 text-xs text-rose-600" data-v-e717ba42>${ssrInterpolate(unref(form).errors.bayar)}</p>`);
				else _push(`<!---->`);
				_push(`</div>`);
				if (Number(unref(form).bayar) > 0) _push(`<div class="${ssrRenderClass(["flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-bold", isPaid.value ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400"])}" data-v-e717ba42><span data-v-e717ba42>${ssrInterpolate(isPaid.value ? "Kembalian" : "Uang masih kurang")}</span><span class="tabular-nums" data-v-e717ba42>${ssrInterpolate(isPaid.value ? unref(formatRupiah)(kembalian.value) : unref(formatRupiah)(totalTagihan.value - (Number(unref(form).bayar) || 0)))}</span></div>`);
				else _push(`<!---->`);
				if (hasInvalidItems.value) _push(`<p class="text-center text-xs font-medium text-amber-600 dark:text-amber-400" data-v-e717ba42> Lengkapi nominal produk curah &amp; nominal/fee layanan, pastikan tidak melebihi stok. </p>`);
				else _push(`<!---->`);
				_push(`<button type="button" class="flex w-full items-center justify-between gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(cartItems.value.length === 0 || unref(form).processing || hasInvalidItems.value) ? " disabled" : ""} data-v-e717ba42><span class="flex items-center gap-2 text-sm font-bold" data-v-e717ba42>`);
				if (!unref(form).processing) _push(ssrRenderComponent(unref(ArrowRight), { class: "h-4 w-4" }, null, _parent));
				else _push(`<!---->`);
				_push(` ${ssrInterpolate(unref(form).processing ? "Memproses..." : "Bayar Sekarang")}</span>`);
				if (!unref(form).processing) _push(`<span class="text-base font-extrabold tabular-nums" data-v-e717ba42>${ssrInterpolate(unref(formatRupiah)(totalTagihan.value))}</span>`);
				else _push(`<!---->`);
				_push(`</button></div><!--]-->`);
			} else _push(`<div class="p-4" data-v-e717ba42><div class="flex w-full items-center justify-center rounded-2xl border border-dashed border-sidebar-border/70 bg-background px-5 py-3.5 text-sm font-semibold text-muted-foreground dark:border-sidebar-border" data-v-e717ba42> Tambahkan produk untuk mulai transaksi </div></div>`);
			_push(`</div></aside></div><div class="fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] z-30 border-t border-sidebar-border/70 bg-card/95 p-3 backdrop-blur @2xl/pos:hidden dark:border-sidebar-border" data-v-e717ba42><button type="button" class="flex w-full items-center justify-between gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-white shadow-lg transition active:scale-[0.99]" data-v-e717ba42><span class="relative flex items-center gap-2" data-v-e717ba42>`);
			_push(ssrRenderComponent(unref(ShoppingCart), { class: "h-5 w-5" }, null, _parent));
			_push(`<span class="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-indigo-600" data-v-e717ba42>${ssrInterpolate(cartCount.value)}</span></span><span class="flex flex-1 flex-col items-start leading-tight" data-v-e717ba42><span class="text-[11px] font-medium text-indigo-100" data-v-e717ba42>${ssrInterpolate(cartItems.value.length)} item</span><span class="text-base font-extrabold tabular-nums" data-v-e717ba42>${ssrInterpolate(unref(formatRupiah)(totalTagihan.value))}</span></span><span class="flex items-center gap-1 text-sm font-bold" data-v-e717ba42> Lihat `);
			_push(ssrRenderComponent(unref(ChevronUp), { class: "h-4 w-4" }, null, _parent));
			_push(`</span></button></div></div><!--]-->`);
		};
	}
});
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region resources/js/pages/kasir/Transaksi.vue
var _sfc_setup = Transaksi_vue_vue_type_script_setup_true_lang_default.setup;
Transaksi_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/kasir/Transaksi.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Transaksi_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Transaksi_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-e717ba42"]]);
//#endregion
export { Transaksi_default as default };

//# sourceMappingURL=Transaksi-Dq59yXk2.js.map