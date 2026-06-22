import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-BrhwLpUM.js";
import { r as formatRupiah } from "./format-Cq6R5JhR.js";
import { t as BodyTeleport_default } from "./BodyTeleport-CHE96Sca.js";
import { t as Pagination_default } from "./Pagination-CxLXQdL4.js";
import { t as usePagination } from "./usePagination-Dbv9f4fT.js";
import { Head, router, useForm } from "@inertiajs/vue3";
import { Fragment, Transition, computed, createBlock, createCommentVNode, createTextVNode, createVNode, defineComponent, onBeforeUnmount, onMounted, openBlock, ref, renderList, resolveDynamicComponent, toDisplayString, unref, useSSRContext, vModelSelect, vModelText, watch, withCtx, withDirectives, withModifiers } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderVNode } from "vue/server-renderer";
import { AlertCircle, AlertTriangle, ArrowDownAZ, ArrowUpAZ, Barcode, Check, ChefHat, ChevronDown, Edit, HandCoins, ImageIcon, Info, Layers, Package, PackageMinus, PackagePlus, Plus, Printer, Save, Scale, ScanLine, Search, ShoppingBag, SlidersHorizontal, Sparkles, Tag, Trash2, TrendingDown, TrendingUp, Upload, Wallet, X } from "lucide-vue-next";
import "jsbarcode";
//#region resources/js/routes/admin/products/index.ts
/**
* @see \App\Http\Controllers\ProdukController::store
* @see app/Http/Controllers/ProdukController.php:71
* @route '/admin/products'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/admin/products"
};
/**
* @see \App\Http\Controllers\ProdukController::store
* @see app/Http/Controllers/ProdukController.php:71
* @route '/admin/products'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\ProdukController::store
* @see app/Http/Controllers/ProdukController.php:71
* @route '/admin/products'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\ProdukController::store
* @see app/Http/Controllers/ProdukController.php:71
* @route '/admin/products'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\ProdukController::store
* @see app/Http/Controllers/ProdukController.php:71
* @route '/admin/products'
*/
storeForm.post = (options) => ({
	action: store.url(options),
	method: "post"
});
store.form = storeForm;
/**
* @see \App\Http\Controllers\ProdukController::generateAll
* @see app/Http/Controllers/ProdukController.php:225
* @route '/admin/products/generate-all-barcodes'
*/
var generateAll = (options) => ({
	url: generateAll.url(options),
	method: "post"
});
generateAll.definition = {
	methods: ["post"],
	url: "/admin/products/generate-all-barcodes"
};
/**
* @see \App\Http\Controllers\ProdukController::generateAll
* @see app/Http/Controllers/ProdukController.php:225
* @route '/admin/products/generate-all-barcodes'
*/
generateAll.url = (options) => {
	return generateAll.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\ProdukController::generateAll
* @see app/Http/Controllers/ProdukController.php:225
* @route '/admin/products/generate-all-barcodes'
*/
generateAll.post = (options) => ({
	url: generateAll.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\ProdukController::generateAll
* @see app/Http/Controllers/ProdukController.php:225
* @route '/admin/products/generate-all-barcodes'
*/
var generateAllForm = (options) => ({
	action: generateAll.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\ProdukController::generateAll
* @see app/Http/Controllers/ProdukController.php:225
* @route '/admin/products/generate-all-barcodes'
*/
generateAllForm.post = (options) => ({
	action: generateAll.url(options),
	method: "post"
});
generateAll.form = generateAllForm;
/**
* @see \App\Http\Controllers\ProdukController::update
* @see app/Http/Controllers/ProdukController.php:144
* @route '/admin/products/{produk}'
*/
var update = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
update.definition = {
	methods: ["put"],
	url: "/admin/products/{produk}"
};
/**
* @see \App\Http\Controllers\ProdukController::update
* @see app/Http/Controllers/ProdukController.php:144
* @route '/admin/products/{produk}'
*/
update.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { produk: args };
	if (typeof args === "object" && !Array.isArray(args) && "id_produk" in args) args = { produk: args.id_produk };
	if (Array.isArray(args)) args = { produk: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { produk: typeof args.produk === "object" ? args.produk.id_produk : args.produk };
	return update.definition.url.replace("{produk}", parsedArgs.produk.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\ProdukController::update
* @see app/Http/Controllers/ProdukController.php:144
* @route '/admin/products/{produk}'
*/
update.put = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
/**
* @see \App\Http\Controllers\ProdukController::update
* @see app/Http/Controllers/ProdukController.php:144
* @route '/admin/products/{produk}'
*/
var updateForm = (args, options) => ({
	action: update.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\ProdukController::update
* @see app/Http/Controllers/ProdukController.php:144
* @route '/admin/products/{produk}'
*/
updateForm.put = (args, options) => ({
	action: update.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
update.form = updateForm;
/**
* @see \App\Http\Controllers\ProdukController::destroy
* @see app/Http/Controllers/ProdukController.php:276
* @route '/admin/products/{produk}'
*/
var destroy = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
destroy.definition = {
	methods: ["delete"],
	url: "/admin/products/{produk}"
};
/**
* @see \App\Http\Controllers\ProdukController::destroy
* @see app/Http/Controllers/ProdukController.php:276
* @route '/admin/products/{produk}'
*/
destroy.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { produk: args };
	if (typeof args === "object" && !Array.isArray(args) && "id_produk" in args) args = { produk: args.id_produk };
	if (Array.isArray(args)) args = { produk: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { produk: typeof args.produk === "object" ? args.produk.id_produk : args.produk };
	return destroy.definition.url.replace("{produk}", parsedArgs.produk.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\ProdukController::destroy
* @see app/Http/Controllers/ProdukController.php:276
* @route '/admin/products/{produk}'
*/
destroy.delete = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\ProdukController::destroy
* @see app/Http/Controllers/ProdukController.php:276
* @route '/admin/products/{produk}'
*/
var destroyForm = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\ProdukController::destroy
* @see app/Http/Controllers/ProdukController.php:276
* @route '/admin/products/{produk}'
*/
destroyForm.delete = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
destroy.form = destroyForm;
Object.assign(store, store), Object.assign(generateAll, generateAll), Object.assign(update, update), Object.assign(destroy, destroy);
//#endregion
//#region resources/js/pages/admin/Products.vue?vue&type=script&setup=true&lang.ts
var SCANNER_TIMEOUT_MS = 150;
var SCANNER_MIN_LENGTH = 3;
var MAX_BARCODE_COPIES = 200;
var Products_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Data Produk",
		href: "/admin/products"
	}] },
	__name: "Products",
	__ssrInlineRender: true,
	props: {
		produks: {},
		kategoris: {},
		stats: {}
	},
	setup(__props) {
		const props = __props;
		const searchQuery = ref("");
		const filterKategori = ref("");
		const sortBy = ref("");
		const showFilterPanel = ref(false);
		const filterPanelRef = ref(null);
		const sortOptions = [
			{
				value: "nama_asc",
				label: "Nama A–Z",
				icon: ArrowUpAZ
			},
			{
				value: "nama_desc",
				label: "Nama Z–A",
				icon: ArrowDownAZ
			},
			{
				value: "harga_asc",
				label: "Harga Terendah",
				icon: TrendingDown
			},
			{
				value: "harga_desc",
				label: "Harga Tertinggi",
				icon: TrendingUp
			},
			{
				value: "stok_asc",
				label: "Stok Terendah",
				icon: PackageMinus
			},
			{
				value: "stok_desc",
				label: "Stok Tertinggi",
				icon: PackagePlus
			}
		];
		const activeFilterCount = computed(() => {
			let count = 0;
			if (filterKategori.value) count++;
			if (sortBy.value) count++;
			return count;
		});
		function handleClickOutsideFilter(event) {
			if (filterPanelRef.value && !filterPanelRef.value.contains(event.target)) showFilterPanel.value = false;
		}
		onMounted(() => {
			document.addEventListener("mousedown", handleClickOutsideFilter);
		});
		const filteredProduks = computed(() => {
			let result = props.produks.filter((p) => {
				const matchSearch = !searchQuery.value || p.nama.toLowerCase().includes(searchQuery.value.toLowerCase());
				const matchKategori = !filterKategori.value || String(p.id_kategori) === filterKategori.value;
				return matchSearch && matchKategori;
			});
			if (sortBy.value === "nama_asc") result = [...result].sort((a, b) => a.nama.localeCompare(b.nama, "id"));
			else if (sortBy.value === "nama_desc") result = [...result].sort((a, b) => b.nama.localeCompare(a.nama, "id"));
			else if (sortBy.value === "harga_asc") result = [...result].sort((a, b) => a.harga_jual - b.harga_jual);
			else if (sortBy.value === "harga_desc") result = [...result].sort((a, b) => b.harga_jual - a.harga_jual);
			else if (sortBy.value === "stok_asc") result = [...result].sort((a, b) => a.stok - b.stok);
			else if (sortBy.value === "stok_desc") result = [...result].sort((a, b) => b.stok - a.stok);
			return result;
		});
		const { currentPage, perPage, totalItems, totalPages, paginatedItems: paginatedProduks, startIndex, endIndex, goToPage, visiblePages } = usePagination(() => filteredProduks.value);
		function formatStok(value) {
			return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 3 }).format(Number(value) || 0);
		}
		const tipeJualBadge = {
			curah: {
				label: "Curah",
				class: "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400"
			},
			jasa: {
				label: "Jasa",
				class: "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400"
			}
		};
		function resolveFoto(foto) {
			if (!foto) return null;
			if (foto.startsWith("http://") || foto.startsWith("https://") || foto.startsWith("/")) return foto;
			return `/storage/${foto}`;
		}
		const showModal = ref(false);
		const editingProduk = ref(null);
		const isScannerDetected = ref(false);
		const scannerStatusText = ref("Scanner tidak terdeteksi");
		const scannerBuffer = ref("");
		const lastScannerTime = ref(0);
		const form = useForm({
			id_kategori: "",
			jenis: "beli",
			tipe_jual: "satuan",
			satuan: "pcs",
			nama: "",
			foto: "",
			foto_upload: null,
			harga_jual: "",
			harga_modal: "",
			potongan_reseller: "",
			stok: "",
			barcode: "",
			sku: "",
			tarifs: []
		});
		const hargaReseller = computed(() => Math.max(0, Number(form.harga_jual || 0) - Number(form.potongan_reseller || 0)));
		const resellerBelowModal = computed(() => {
			if (Number(form.potongan_reseller || 0) <= 0) return false;
			return hargaReseller.value < Number(form.harga_modal || 0);
		});
		const tipeJualOptions = [
			{
				value: "satuan",
				label: "Satuan",
				short: "per biji",
				hint: "Dihitung per buah/bungkus. Cocok untuk cemilan, kue, permen.",
				icon: Package
			},
			{
				value: "curah",
				label: "Curah",
				short: "per takaran",
				hint: "Dijual per liter/kg, boleh pecahan. Kasir bisa input rupiah (mis. bensin, bawang).",
				icon: Scale
			},
			{
				value: "jasa",
				label: "Jasa",
				short: "biaya admin",
				hint: "Tanpa stok. Harga = fee/biaya admin (mis. transfer, tarik tunai).",
				icon: HandCoins
			}
		];
		const jenisOptions = [{
			value: "beli",
			label: "Beli Jadi",
			hint: "Dibeli dari agen / supplier",
			icon: ShoppingBag
		}, {
			value: "produksi",
			label: "Buatan Sendiri",
			hint: "Modal dihitung dari produksi",
			icon: ChefHat
		}];
		const satuanSuggestions = computed(() => {
			if (form.tipe_jual === "curah") return [
				"liter",
				"kg",
				"gram",
				"meter"
			];
			if (form.tipe_jual === "jasa") return ["transaksi", "layanan"];
			return [
				"pcs",
				"bungkus",
				"box",
				"pack"
			];
		});
		const fotoUploadName = computed(() => form.foto_upload?.name ?? "");
		const fotoUploadPreview = ref(null);
		function setFotoUploadPreview(file) {
			if (fotoUploadPreview.value) {
				URL.revokeObjectURL(fotoUploadPreview.value);
				fotoUploadPreview.value = null;
			}
			if (file) fotoUploadPreview.value = URL.createObjectURL(file);
		}
		const fotoPreviewUrl = computed(() => fotoUploadPreview.value ?? resolveFoto(form.foto));
		function closeModal() {
			showModal.value = false;
			stopScannerListening();
			form.reset();
			form.foto_upload = null;
			setFotoUploadPreview(null);
			form.clearErrors();
		}
		function handleFileUpload(event) {
			const file = event.target.files?.[0] ?? null;
			form.foto_upload = file;
			setFotoUploadPreview(file);
			if (file) form.foto = "";
		}
		function clearFoto() {
			form.foto = "";
			form.foto_upload = null;
			setFotoUploadPreview(null);
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
					form.barcode = barcode;
					form.clearErrors("barcode");
				}
				scannerBuffer.value = "";
				return;
			}
			if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) scannerBuffer.value += event.key;
		}
		function stopScannerListening() {
			document.removeEventListener("keydown", handleScannerKeydown);
			scannerBuffer.value = "";
			const hid = getHidApi();
			hid?.removeEventListener("connect", handleScannerDeviceConnectionChange);
			hid?.removeEventListener("disconnect", handleScannerDeviceConnectionChange);
		}
		onBeforeUnmount(() => {
			stopScannerListening();
			setFotoUploadPreview(null);
			document.removeEventListener("mousedown", handleClickOutsideFilter);
		});
		const lastGeneratedSku = ref("");
		function generateSKUFromBarcode(barcode) {
			const normalized = barcode.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
			return normalized ? `SKU-${normalized}` : "";
		}
		watch(() => form.barcode, (barcode) => {
			const value = String(barcode || "").trim();
			const generated = generateSKUFromBarcode(value);
			if (!value) {
				lastGeneratedSku.value = "";
				return;
			}
			if (!form.sku || form.sku === lastGeneratedSku.value) {
				form.sku = generated;
				lastGeneratedSku.value = generated;
			}
		});
		function ean13CheckDigit(base12) {
			let sum = 0;
			for (let i = 0; i < base12.length; i++) sum += Number(base12[i]) * (i % 2 === 0 ? 1 : 3);
			return String((10 - sum % 10) % 10);
		}
		function generateEan13() {
			let base = "2";
			for (let i = 0; i < 11; i++) base += Math.floor(Math.random() * 10);
			return base + ean13CheckDigit(base);
		}
		function generateBarcodeAndSku() {
			const barcode = generateEan13();
			const sku = generateSKUFromBarcode(barcode);
			form.barcode = barcode;
			form.sku = sku;
			lastGeneratedSku.value = sku;
			form.clearErrors("barcode", "sku");
		}
		const generatingAll = ref(false);
		function addTarif() {
			const tertinggi = form.tarifs.reduce((max, t) => Math.max(max, Number(t.min_nominal || 0)), 0);
			form.tarifs.push({
				min_nominal: form.tarifs.length === 0 ? 0 : tertinggi,
				fee: ""
			});
		}
		function removeTarif(index) {
			form.tarifs.splice(index, 1);
		}
		function tarifRangeLabel(index) {
			const min = Number(form.tarifs[index]?.min_nominal || 0);
			const higher = form.tarifs.map((t) => Number(t.min_nominal || 0)).filter((m) => m > min).sort((a, b) => a - b)[0];
			if (higher === void 0) return `${formatRupiah(min)} ke atas`;
			return `${formatRupiah(min)} – ${formatRupiah(higher - 1)}`;
		}
		function submitForm() {
			const data = {
				...form.data(),
				id_kategori: Number(form.id_kategori),
				foto: form.foto || null,
				harga_jual: form.tipe_jual === "jasa" ? 0 : Number(form.harga_jual),
				harga_modal: form.tipe_jual === "jasa" || form.jenis === "produksi" ? 0 : Number(form.harga_modal || 0),
				stok: form.tipe_jual === "jasa" ? 0 : Number(form.stok || 0),
				potongan_reseller: form.tipe_jual === "jasa" ? 0 : Number(form.potongan_reseller || 0),
				satuan: form.satuan || "pcs",
				tarifs: form.tipe_jual === "jasa" ? form.tarifs.map((t) => ({
					min_nominal: Number(t.min_nominal || 0),
					fee: Number(t.fee || 0)
				})) : []
			};
			if (editingProduk.value) router.put(update(editingProduk.value.id_produk).url, data, { onSuccess: () => closeModal() });
			else router.post(store().url, data, { onSuccess: () => closeModal() });
		}
		const statusLabel = {
			"in-stock": "Stok Tersedia",
			"low-stock": "Hampir Habis",
			"out-of-stock": "Stok Habis"
		};
		const showBarcodeModal = ref(false);
		const barcodePrintList = ref([]);
		const barcodeRefs = ref([]);
		const barcodeMode = ref("single");
		const barcodeCopies = ref(1);
		function closeBarcodeModal() {
			showBarcodeModal.value = false;
			barcodePrintList.value = [];
			barcodeRefs.value = [];
		}
		function setBarcodeRef(el, index) {
			if (el instanceof SVGElement) barcodeRefs.value[index] = el;
		}
		function printBarcodes() {
			const copies = barcodeMode.value === "single" ? Math.min(Math.max(Math.floor(barcodeCopies.value) || 1, 1), MAX_BARCODE_COPIES) : 1;
			const labels = barcodePrintList.value.map((produk, i) => {
				const svgEl = barcodeRefs.value[i];
				return `
                <div class="label">
                    ${svgEl ? svgEl.outerHTML : ""}
                    <p class="nama">${produk.nama}</p>
                    <p class="harga">${formatRupiah(produk.harga_jual)}</p>
                </div>
            `.repeat(copies);
			}).join("");
			const printWindow = window.open("", "_blank", "width=800,height=600");
			if (!printWindow) return;
			printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <title>Cetak Barcode Produk</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: Arial, sans-serif; background: #fff; padding: 16px; }
                .labels { display: flex; flex-wrap: wrap; gap: 12px; }
                .label {
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    padding: 10px 12px;
                    text-align: center;
                    width: 200px;
                    page-break-inside: avoid;
                }
                .label svg { max-width: 100%; height: auto; }
                .nama { font-size: 12px; font-weight: bold; margin-top: 6px; word-break: break-word; }
                .harga { font-size: 11px; color: #444; margin-top: 2px; }
                @media print {
                    body { padding: 8px; }
                    .labels { gap: 8px; }
                }
            </style>
        </head>
        <body>
            <div class="labels">${labels}</div>
            <script>
                window.onload = function() {
                    setTimeout(function() { window.print(); }, 300);
                };
            <\/script>
        </body>
        </html>
    `);
			printWindow.document.close();
		}
		const statusClass = {
			"in-stock": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
			"low-stock": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
			"out-of-stock": "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Data Produk - Admin" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 p-6"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-3xl font-extrabold tracking-tight">Manajemen Produk</h1><p class="mt-1 text-sm text-muted-foreground"> Kelola data produk, persediaan stok, kategori barang, dan harga penjualan toko Anda. </p></div><button id="btn-tambah-produk" class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">`);
			_push(ssrRenderComponent(unref(Plus), { class: "h-4 w-4" }, null, _parent));
			_push(` Tambah Produk Baru </button></div><div class="grid gap-4 md:grid-cols-3"><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">`);
			_push(ssrRenderComponent(unref(Package), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Total Produk</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_produk)} Item</h3></div></div><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">`);
			_push(ssrRenderComponent(unref(Layers), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Kategori</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_kategori)} Kategori</h3></div></div><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400">`);
			_push(ssrRenderComponent(unref(AlertTriangle), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Stok Menipis / Habis</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.stok_bermasalah)} Produk</h3></div></div></div><div class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"><div class="border-b border-sidebar-border/70 dark:border-sidebar-border"><div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div class="relative flex-1 max-w-sm">`);
			_push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, null, _parent));
			_push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Cari produk berdasarkan nama..." class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm transition-colors focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"></div><div class="flex shrink-0 gap-2"><div class="relative"><button class="${ssrRenderClass([activeFilterCount.value > 0 ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-500" : "border border-sidebar-border/70 bg-background text-slate-700 hover:bg-slate-50 dark:border-sidebar-border dark:text-slate-200 dark:hover:bg-zinc-800/40", "inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-150"])}">`);
			_push(ssrRenderComponent(unref(SlidersHorizontal), { class: "h-4 w-4" }, null, _parent));
			_push(` Filter `);
			if (activeFilterCount.value > 0) _push(`<span class="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white/25 px-1 text-[10px] font-bold">${ssrInterpolate(activeFilterCount.value)}</span>`);
			else _push(`<!---->`);
			_push(ssrRenderComponent(unref(ChevronDown), { class: ["h-3.5 w-3.5 transition-transform duration-200", { "rotate-180": showFilterPanel.value }] }, null, _parent));
			_push(`</button>`);
			if (showFilterPanel.value) {
				_push(`<div class="absolute right-0 top-full z-30 mt-2 w-80 origin-top-right overflow-hidden rounded-2xl border border-sidebar-border/70 bg-card shadow-2xl dark:border-sidebar-border"><div class="flex items-center justify-between border-b border-sidebar-border/70 px-4 py-3 dark:border-sidebar-border"><div class="flex items-center gap-2">`);
				_push(ssrRenderComponent(unref(SlidersHorizontal), { class: "h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" }, null, _parent));
				_push(`<span class="text-sm font-semibold">Filter &amp; Urutkan</span></div><button class="rounded-md p-1 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground dark:hover:bg-zinc-800">`);
				_push(ssrRenderComponent(unref(X), { class: "h-3.5 w-3.5" }, null, _parent));
				_push(`</button></div><div class="p-4"><div class="mb-5"><p class="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Kategori</p><div class="flex flex-wrap gap-1.5"><button class="${ssrRenderClass([filterKategori.value === "" ? "border-indigo-500 bg-indigo-600 text-white shadow-sm" : "border-sidebar-border/70 bg-background text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-400", "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-100"])}"> Semua </button><!--[-->`);
				ssrRenderList(__props.kategoris, (kat) => {
					_push(`<button class="${ssrRenderClass([filterKategori.value === String(kat.id_kategori) ? "border-indigo-500 bg-indigo-600 text-white shadow-sm" : "border-sidebar-border/70 bg-background text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-400", "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-100"])}">${ssrInterpolate(kat.nama_kategori)}</button>`);
				});
				_push(`<!--]--></div></div><div><p class="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Urutkan Berdasarkan</p><div class="grid grid-cols-2 gap-1.5"><!--[-->`);
				ssrRenderList(sortOptions, (opt) => {
					_push(`<button class="${ssrRenderClass([sortBy.value === opt.value ? "border-indigo-500 bg-indigo-600 text-white shadow-sm" : "border-sidebar-border/70 bg-background text-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:border-sidebar-border dark:bg-zinc-900/30 dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:bg-zinc-800", "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all duration-100"])}">`);
					ssrRenderVNode(_push, createVNode(resolveDynamicComponent(opt.icon), { class: "h-3.5 w-3.5 shrink-0" }, null), _parent);
					_push(`<span class="leading-tight">${ssrInterpolate(opt.label)}</span></button>`);
				});
				_push(`<!--]--></div></div></div>`);
				if (activeFilterCount.value > 0) {
					_push(`<div class="border-t border-sidebar-border/70 px-4 py-3 dark:border-sidebar-border"><button class="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10">`);
					_push(ssrRenderComponent(unref(X), { class: "h-3 w-3" }, null, _parent));
					_push(` Reset semua filter </button></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div><button class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-emerald-400" title="Buat barcode &amp; SKU otomatis untuk produk yang belum punya barcode"${ssrIncludeBooleanAttr(generatingAll.value) ? " disabled" : ""}>`);
			_push(ssrRenderComponent(unref(Sparkles), { class: "h-4 w-4" }, null, _parent));
			_push(` ${ssrInterpolate(generatingAll.value ? "Membuat..." : "Generate Barcode Semua")}</button><button class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:text-slate-200 dark:hover:bg-zinc-800/40" title="Cetak barcode semua produk yang tampil">`);
			_push(ssrRenderComponent(unref(Printer), { class: "h-4 w-4" }, null, _parent));
			_push(` Cetak Semua Barcode </button></div></div>`);
			if (activeFilterCount.value > 0) {
				_push(`<div class="flex flex-wrap items-center gap-2 border-t border-indigo-100 bg-indigo-50/60 px-4 py-2.5 dark:border-indigo-500/10 dark:bg-indigo-500/5"><span class="text-xs font-medium text-muted-foreground">Filter aktif:</span>`);
				if (filterKategori.value) {
					_push(`<span class="inline-flex items-center gap-1 rounded-full bg-indigo-100 py-0.5 pl-2.5 pr-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">${ssrInterpolate(__props.kategoris.find((k) => String(k.id_kategori) === filterKategori.value)?.nama_kategori)} <button class="rounded-full p-0.5 transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-500/30">`);
					_push(ssrRenderComponent(unref(X), { class: "h-2.5 w-2.5" }, null, _parent));
					_push(`</button></span>`);
				} else _push(`<!---->`);
				if (sortBy.value) {
					_push(`<span class="inline-flex items-center gap-1 rounded-full bg-indigo-100 py-0.5 pl-2.5 pr-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">`);
					ssrRenderVNode(_push, createVNode(resolveDynamicComponent(sortOptions.find((s) => s.value === sortBy.value)?.icon), { class: "h-3 w-3" }, null), _parent);
					_push(` ${ssrInterpolate(sortOptions.find((s) => s.value === sortBy.value)?.label)} <button class="rounded-full p-0.5 transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-500/30">`);
					_push(ssrRenderComponent(unref(X), { class: "h-2.5 w-2.5" }, null, _parent));
					_push(`</button></span>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div><div class="overflow-x-auto"><table class="w-full border-collapse text-left text-sm"><thead><tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"><th class="px-6 py-4 font-semibold text-muted-foreground"> Nama Produk </th><th class="px-6 py-4 font-semibold text-muted-foreground">Kategori</th><th class="px-6 py-4 font-semibold text-muted-foreground"> Harga Jual </th><th class="px-6 py-4 font-semibold text-muted-foreground"> Persediaan (Stok) </th><th class="px-6 py-4 font-semibold text-muted-foreground">Status</th><th class="px-6 py-4 text-right font-semibold text-muted-foreground"> Aksi </th></tr></thead><tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">`);
			if (unref(paginatedProduks).length === 0) {
				_push(`<tr><td colspan="6" class="px-6 py-12 text-center text-muted-foreground">`);
				_push(ssrRenderComponent(unref(Package), { class: "mx-auto mb-3 h-10 w-10 opacity-30" }, null, _parent));
				_push(`<p class="font-medium">${ssrInterpolate(searchQuery.value ? "Tidak ada produk yang sesuai pencarian." : "Belum ada produk. Tambahkan produk pertama!")}</p></td></tr>`);
			} else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(unref(paginatedProduks), (produk) => {
				_push(`<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"><td class="px-6 py-4"><div class="flex items-center gap-3">`);
				if (resolveFoto(produk.foto_url ?? produk.foto)) _push(`<img${ssrRenderAttr("src", resolveFoto(produk.foto_url ?? produk.foto) ?? void 0)}${ssrRenderAttr("alt", produk.nama)} class="h-12 w-12 rounded-lg border border-sidebar-border/70 object-cover dark:border-sidebar-border">`);
				else {
					_push(`<div class="flex h-12 w-12 items-center justify-center rounded-lg border border-sidebar-border/70 bg-slate-100 text-muted-foreground dark:border-sidebar-border dark:bg-zinc-800">`);
					_push(ssrRenderComponent(unref(ImageIcon), { class: "h-5 w-5" }, null, _parent));
					_push(`</div>`);
				}
				_push(`<div class="min-w-0"><div class="flex items-center gap-2"><p class="truncate font-semibold text-foreground">${ssrInterpolate(produk.nama)}</p>`);
				if (tipeJualBadge[produk.tipe_jual]) _push(`<span class="${ssrRenderClass(["inline-flex shrink-0 items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold", tipeJualBadge[produk.tipe_jual].class])}">${ssrInterpolate(tipeJualBadge[produk.tipe_jual].label)}</span>`);
				else _push(`<!---->`);
				_push(`</div><p class="text-xs text-muted-foreground">SKU: ${ssrInterpolate(produk.sku)}</p></div></div></td><td class="px-6 py-4 text-muted-foreground">${ssrInterpolate(produk.kategori ?? "-")}</td><td class="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">${ssrInterpolate(unref(formatRupiah)(produk.harga_jual))}</td><td class="px-6 py-4 font-medium">`);
				if (produk.tipe_jual === "jasa") _push(`<span class="text-muted-foreground">—</span>`);
				else _push(`<span>${ssrInterpolate(formatStok(produk.stok))} ${ssrInterpolate(produk.satuan)}</span>`);
				_push(`</td><td class="px-6 py-4"><span class="${ssrRenderClass(["inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide", statusClass[produk.status_stok]])}">${ssrInterpolate(statusLabel[produk.status_stok])}</span></td><td class="px-6 py-4 text-right"><div class="inline-flex justify-end gap-2">`);
				if (produk.barcode) {
					_push(`<button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-zinc-800" title="Cetak Barcode">`);
					_push(ssrRenderComponent(unref(Printer), { class: "h-4 w-4" }, null, _parent));
					_push(`</button>`);
				} else _push(`<!---->`);
				_push(`<button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800" title="Edit">`);
				_push(ssrRenderComponent(unref(Edit), { class: "h-4 w-4" }, null, _parent));
				_push(`</button><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800" title="Hapus">`);
				_push(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4" }, null, _parent));
				_push(`</button></div></td></tr>`);
			});
			_push(`<!--]--></tbody></table></div>`);
			_push(ssrRenderComponent(Pagination_default, {
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
			_push(`</div></div>`);
			_push(ssrRenderComponent(BodyTeleport_default, null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) if (showBarcodeModal.value) {
						_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"${_scopeId}><div class="w-full max-w-2xl rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border" style="${ssrRenderStyle({
							"max-height": "90vh",
							"overflow-y": "auto"
						})}"${_scopeId}><div class="mb-5 flex items-center justify-between"${_scopeId}><div${_scopeId}><h2 class="text-lg font-bold"${_scopeId}>Cetak Barcode Produk</h2><p class="mt-0.5 text-xs text-muted-foreground"${_scopeId}>`);
						if (barcodeMode.value === "single") _push(`<!--[-->${ssrInterpolate(Math.min(Math.max(Math.floor(barcodeCopies.value) || 1, 1), MAX_BARCODE_COPIES))} label barcode siap dicetak <!--]-->`);
						else _push(`<!--[-->${ssrInterpolate(barcodePrintList.value.length)} label barcode siap dicetak <!--]-->`);
						_push(`</p></div><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"${_scopeId}>`);
						_push(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`</button></div>`);
						if (barcodePrintList.value.length === 0) {
							_push(`<div class="py-10 text-center text-muted-foreground"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Barcode), { class: "mx-auto mb-3 h-10 w-10 opacity-30" }, null, _parent, _scopeId));
							_push(`<p class="text-sm font-medium"${_scopeId}>Tidak ada produk dengan barcode yang dapat dicetak.</p><p class="mt-1 text-xs"${_scopeId}>Tambahkan barcode ke produk terlebih dahulu melalui menu Edit.</p></div>`);
						} else {
							_push(`<div${_scopeId}><div class="mb-5 flex flex-wrap gap-4 rounded-xl border border-sidebar-border/70 bg-slate-50/50 p-4 dark:border-sidebar-border dark:bg-zinc-800/20"${_scopeId}><!--[-->`);
							ssrRenderList(barcodePrintList.value, (produk, index) => {
								_push(`<div class="flex w-48 flex-col items-center rounded-lg border border-sidebar-border/70 bg-white p-3 dark:border-sidebar-border dark:bg-zinc-900"${_scopeId}><svg class="w-full"${_scopeId}></svg><p class="mt-2 text-center text-xs font-semibold leading-tight text-slate-800 dark:text-slate-200"${_scopeId}>${ssrInterpolate(produk.nama)}</p><p class="mt-0.5 text-center text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(produk.harga_jual))}</p></div>`);
							});
							_push(`<!--]--></div>`);
							if (barcodeMode.value === "single") _push(`<div class="mb-5 flex flex-col gap-2 rounded-xl border border-sidebar-border/70 bg-slate-50/50 p-4 dark:border-sidebar-border dark:bg-zinc-800/20 sm:flex-row sm:items-center sm:justify-between"${_scopeId}><div${_scopeId}><label for="barcode-copies" class="block text-sm font-medium"${_scopeId}>Jumlah label dicetak</label><p class="mt-0.5 text-xs text-muted-foreground"${_scopeId}> Cetak beberapa label sekaligus dalam satu kertas (maks. ${ssrInterpolate(MAX_BARCODE_COPIES)}). </p></div><div class="flex items-center gap-1.5"${_scopeId}><button type="button" class="flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-lg font-semibold transition-colors hover:bg-slate-100 disabled:opacity-40 dark:border-sidebar-border dark:hover:bg-zinc-800"${ssrIncludeBooleanAttr(barcodeCopies.value <= 1) ? " disabled" : ""}${_scopeId}> − </button><input id="barcode-copies"${ssrRenderAttr("value", barcodeCopies.value)} type="number" min="1"${ssrRenderAttr("max", MAX_BARCODE_COPIES)} class="h-9 w-20 rounded-lg border border-sidebar-border/70 bg-background text-center text-sm font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-sidebar-border"${_scopeId}><button type="button" class="flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-lg font-semibold transition-colors hover:bg-slate-100 disabled:opacity-40 dark:border-sidebar-border dark:hover:bg-zinc-800"${ssrIncludeBooleanAttr(barcodeCopies.value >= MAX_BARCODE_COPIES) ? " disabled" : ""}${_scopeId}> + </button></div></div>`);
							else _push(`<!---->`);
							_push(`<div class="flex justify-end gap-3"${_scopeId}><button type="button" class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"${_scopeId}> Tutup </button><button type="button" class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Printer), { class: "h-4 w-4" }, null, _parent, _scopeId));
							_push(` Cetak Sekarang </button></div></div>`);
						}
						_push(`</div></div>`);
					} else _push(`<!---->`);
					else return [showBarcodeModal.value ? (openBlock(), createBlock("div", {
						key: 0,
						class: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
						onClick: withModifiers(closeBarcodeModal, ["self"])
					}, [createVNode("div", {
						class: "w-full max-w-2xl rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border",
						style: {
							"max-height": "90vh",
							"overflow-y": "auto"
						}
					}, [createVNode("div", { class: "mb-5 flex items-center justify-between" }, [createVNode("div", null, [createVNode("h2", { class: "text-lg font-bold" }, "Cetak Barcode Produk"), createVNode("p", { class: "mt-0.5 text-xs text-muted-foreground" }, [barcodeMode.value === "single" ? (openBlock(), createBlock(Fragment, { key: 0 }, [createTextVNode(toDisplayString(Math.min(Math.max(Math.floor(barcodeCopies.value) || 1, 1), MAX_BARCODE_COPIES)) + " label barcode siap dicetak ", 1)], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [createTextVNode(toDisplayString(barcodePrintList.value.length) + " label barcode siap dicetak ", 1)], 64))])]), createVNode("button", {
						class: "rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800",
						onClick: closeBarcodeModal
					}, [createVNode(unref(X), { class: "h-5 w-5" })])]), barcodePrintList.value.length === 0 ? (openBlock(), createBlock("div", {
						key: 0,
						class: "py-10 text-center text-muted-foreground"
					}, [
						createVNode(unref(Barcode), { class: "mx-auto mb-3 h-10 w-10 opacity-30" }),
						createVNode("p", { class: "text-sm font-medium" }, "Tidak ada produk dengan barcode yang dapat dicetak."),
						createVNode("p", { class: "mt-1 text-xs" }, "Tambahkan barcode ke produk terlebih dahulu melalui menu Edit.")
					])) : (openBlock(), createBlock("div", { key: 1 }, [
						createVNode("div", { class: "mb-5 flex flex-wrap gap-4 rounded-xl border border-sidebar-border/70 bg-slate-50/50 p-4 dark:border-sidebar-border dark:bg-zinc-800/20" }, [(openBlock(true), createBlock(Fragment, null, renderList(barcodePrintList.value, (produk, index) => {
							return openBlock(), createBlock("div", {
								key: produk.id_produk,
								class: "flex w-48 flex-col items-center rounded-lg border border-sidebar-border/70 bg-white p-3 dark:border-sidebar-border dark:bg-zinc-900"
							}, [
								(openBlock(), createBlock("svg", {
									ref_for: true,
									ref: (el) => setBarcodeRef(el, index),
									class: "w-full"
								}, null, 512)),
								createVNode("p", { class: "mt-2 text-center text-xs font-semibold leading-tight text-slate-800 dark:text-slate-200" }, toDisplayString(produk.nama), 1),
								createVNode("p", { class: "mt-0.5 text-center text-xs text-muted-foreground" }, toDisplayString(unref(formatRupiah)(produk.harga_jual)), 1)
							]);
						}), 128))]),
						barcodeMode.value === "single" ? (openBlock(), createBlock("div", {
							key: 0,
							class: "mb-5 flex flex-col gap-2 rounded-xl border border-sidebar-border/70 bg-slate-50/50 p-4 dark:border-sidebar-border dark:bg-zinc-800/20 sm:flex-row sm:items-center sm:justify-between"
						}, [createVNode("div", null, [createVNode("label", {
							for: "barcode-copies",
							class: "block text-sm font-medium"
						}, "Jumlah label dicetak"), createVNode("p", { class: "mt-0.5 text-xs text-muted-foreground" }, " Cetak beberapa label sekaligus dalam satu kertas (maks. " + toDisplayString(MAX_BARCODE_COPIES) + "). ")]), createVNode("div", { class: "flex items-center gap-1.5" }, [
							createVNode("button", {
								type: "button",
								class: "flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-lg font-semibold transition-colors hover:bg-slate-100 disabled:opacity-40 dark:border-sidebar-border dark:hover:bg-zinc-800",
								disabled: barcodeCopies.value <= 1,
								onClick: ($event) => barcodeCopies.value = Math.max(1, Math.floor(barcodeCopies.value || 1) - 1)
							}, " − ", 8, ["disabled", "onClick"]),
							withDirectives(createVNode("input", {
								id: "barcode-copies",
								"onUpdate:modelValue": ($event) => barcodeCopies.value = $event,
								type: "number",
								min: "1",
								max: MAX_BARCODE_COPIES,
								class: "h-9 w-20 rounded-lg border border-sidebar-border/70 bg-background text-center text-sm font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-sidebar-border",
								onBlur: ($event) => barcodeCopies.value = Math.min(Math.max(Math.floor(barcodeCopies.value || 1), 1), MAX_BARCODE_COPIES)
							}, null, 40, ["onUpdate:modelValue", "onBlur"]), [[
								vModelText,
								barcodeCopies.value,
								void 0,
								{ number: true }
							]]),
							createVNode("button", {
								type: "button",
								class: "flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-lg font-semibold transition-colors hover:bg-slate-100 disabled:opacity-40 dark:border-sidebar-border dark:hover:bg-zinc-800",
								disabled: barcodeCopies.value >= MAX_BARCODE_COPIES,
								onClick: ($event) => barcodeCopies.value = Math.min(MAX_BARCODE_COPIES, Math.floor(barcodeCopies.value || 1) + 1)
							}, " + ", 8, ["disabled", "onClick"])
						])])) : createCommentVNode("", true),
						createVNode("div", { class: "flex justify-end gap-3" }, [createVNode("button", {
							type: "button",
							class: "rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40",
							onClick: closeBarcodeModal
						}, " Tutup "), createVNode("button", {
							type: "button",
							class: "inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500",
							onClick: printBarcodes
						}, [createVNode(unref(Printer), { class: "h-4 w-4" }), createTextVNode(" Cetak Sekarang ")])])
					]))])])) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(BodyTeleport_default, null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(``);
						if (showModal.value) {
							_push(`<div class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"${_scopeId}><div class="flex h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-sidebar-border/70 bg-card shadow-2xl dark:border-sidebar-border sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl"${_scopeId}><form class="flex min-h-0 flex-1 flex-col"${_scopeId}><div class="shrink-0 border-b border-sidebar-border/70 bg-card px-5 pb-4 pt-3 dark:border-sidebar-border"${_scopeId}><div class="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-300 dark:bg-zinc-700 sm:hidden"${_scopeId}></div><div class="flex items-start justify-between gap-3"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Package), { class: "h-5 w-5" }, null, _parent, _scopeId));
							_push(`</div><div${_scopeId}><h2 class="text-base font-bold leading-tight sm:text-lg"${_scopeId}>${ssrInterpolate(editingProduk.value ? "Edit Produk" : "Tambah Produk Baru")}</h2><p class="text-xs text-muted-foreground"${_scopeId}> Kolom bertanda <span class="font-semibold text-rose-500"${_scopeId}>*</span> wajib diisi </p></div></div><button type="button" class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"${_scopeId}>`);
							_push(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent, _scopeId));
							_push(`</button></div></div><div class="min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-5"${_scopeId}><section class="space-y-4"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Package), { class: "h-4 w-4 text-indigo-600 dark:text-indigo-400" }, null, _parent, _scopeId));
							_push(`<h3 class="text-sm font-bold"${_scopeId}>Informasi Produk</h3></div><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="prod-nama"${_scopeId}> Nama Produk <span class="text-rose-500"${_scopeId}>*</span></label><input id="prod-nama"${ssrRenderAttr("value", unref(form).nama)} type="text" placeholder="mis. Kopi Sachet, Bensin Eceran…" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.nama }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}>`);
							if (unref(form).errors.nama) {
								_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
								_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
								_push(`${ssrInterpolate(unref(form).errors.nama)}</p>`);
							} else _push(`<!---->`);
							_push(`</div><div${_scopeId}><span class="mb-1.5 block text-sm font-medium"${_scopeId}>Foto Produk</span><div class="flex items-start gap-3"${_scopeId}><div class="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-sidebar-border/70 bg-slate-100 dark:border-sidebar-border dark:bg-zinc-800"${_scopeId}>`);
							if (fotoPreviewUrl.value) _push(`<img${ssrRenderAttr("src", fotoPreviewUrl.value)} alt="Pratinjau foto produk" class="h-full w-full object-cover"${_scopeId}>`);
							else {
								_push(`<div class="flex h-full w-full items-center justify-center text-muted-foreground"${_scopeId}>`);
								_push(ssrRenderComponent(unref(ImageIcon), { class: "h-7 w-7" }, null, _parent, _scopeId));
								_push(`</div>`);
							}
							if (fotoPreviewUrl.value) {
								_push(`<button type="button" class="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white transition-colors hover:bg-black/80" title="Hapus foto"${_scopeId}>`);
								_push(ssrRenderComponent(unref(X), { class: "h-3.5 w-3.5" }, null, _parent, _scopeId));
								_push(`</button>`);
							} else _push(`<!---->`);
							_push(`</div><div class="flex min-w-0 flex-1 flex-col gap-2"${_scopeId}><label class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-sidebar-border/70 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-sidebar-border dark:bg-zinc-900 dark:text-slate-200 dark:hover:bg-zinc-800"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Upload), { class: "h-4 w-4" }, null, _parent, _scopeId));
							_push(` ${ssrInterpolate(fotoUploadName.value ? "Ganti Foto" : "Upload dari Galeri")} <input type="file" accept="image/*" class="hidden"${_scopeId}></label><input id="prod-foto"${ssrRenderAttr("value", unref(form).foto)} type="text" placeholder="atau tempel URL gambar…" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.foto }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}></div></div>`);
							if (fotoUploadName.value) _push(`<p class="mt-1.5 truncate text-xs text-muted-foreground"${_scopeId}> File dipilih: ${ssrInterpolate(fotoUploadName.value)}</p>`);
							else _push(`<!---->`);
							if (unref(form).errors.foto) {
								_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
								_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
								_push(`${ssrInterpolate(unref(form).errors.foto)}</p>`);
							} else _push(`<!---->`);
							_push(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="prod-kategori"${_scopeId}> Kategori <span class="text-rose-500"${_scopeId}>*</span></label><select id="prod-kategori" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.id_kategori }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).id_kategori) ? ssrLooseContain(unref(form).id_kategori, "") : ssrLooseEqual(unref(form).id_kategori, "")) ? " selected" : ""}${_scopeId}>Pilih kategori</option><!--[-->`);
							ssrRenderList(__props.kategoris, (kat) => {
								_push(`<option${ssrRenderAttr("value", String(kat.id_kategori))}${ssrIncludeBooleanAttr(Array.isArray(unref(form).id_kategori) ? ssrLooseContain(unref(form).id_kategori, String(kat.id_kategori)) : ssrLooseEqual(unref(form).id_kategori, String(kat.id_kategori))) ? " selected" : ""}${_scopeId}>${ssrInterpolate(kat.nama_kategori)}</option>`);
							});
							_push(`<!--]--></select>`);
							if (unref(form).errors.id_kategori) {
								_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
								_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
								_push(`${ssrInterpolate(unref(form).errors.id_kategori)}</p>`);
							} else _push(`<!---->`);
							_push(`</div></section><section class="space-y-4"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Tag), { class: "h-4 w-4 text-indigo-600 dark:text-indigo-400" }, null, _parent, _scopeId));
							_push(`<h3 class="text-sm font-bold"${_scopeId}>Jenis &amp; Cara Jual</h3></div>`);
							if (unref(form).tipe_jual !== "jasa") {
								_push(`<div${_scopeId}><span class="mb-2 block text-sm font-medium"${_scopeId}>Asal Produk</span><div class="grid grid-cols-2 gap-2.5"${_scopeId}><!--[-->`);
								ssrRenderList(jenisOptions, (opt) => {
									_push(`<button type="button" class="${ssrRenderClass([unref(form).jenis === opt.value ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 dark:bg-indigo-500/10" : "border-sidebar-border/70 hover:border-indigo-300 dark:border-sidebar-border dark:hover:border-indigo-500/50", "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all"])}"${_scopeId}>`);
									ssrRenderVNode(_push, createVNode(resolveDynamicComponent(opt.icon), { class: ["h-5 w-5 shrink-0", unref(form).jenis === opt.value ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"] }, null), _parent, _scopeId);
									_push(`<div class="min-w-0"${_scopeId}><p class="${ssrRenderClass([{ "text-indigo-700 dark:text-indigo-300": unref(form).jenis === opt.value }, "text-sm font-semibold leading-tight"])}"${_scopeId}>${ssrInterpolate(opt.label)}</p><p class="mt-0.5 text-[11px] leading-tight text-muted-foreground"${_scopeId}>${ssrInterpolate(opt.hint)}</p></div></button>`);
								});
								_push(`<!--]--></div></div>`);
							} else _push(`<!---->`);
							_push(`<div${_scopeId}><span class="mb-2 block text-sm font-medium"${_scopeId}>Tipe Jual</span><div class="grid grid-cols-3 gap-2.5"${_scopeId}><!--[-->`);
							ssrRenderList(tipeJualOptions, (opt) => {
								_push(`<button type="button" class="${ssrRenderClass([unref(form).tipe_jual === opt.value ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 dark:bg-indigo-500/10" : "border-sidebar-border/70 hover:border-indigo-300 dark:border-sidebar-border dark:hover:border-indigo-500/50", "relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all"])}"${_scopeId}>`);
								if (unref(form).tipe_jual === opt.value) _push(ssrRenderComponent(unref(Check), { class: "absolute right-1.5 top-1.5 h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" }, null, _parent, _scopeId));
								else _push(`<!---->`);
								ssrRenderVNode(_push, createVNode(resolveDynamicComponent(opt.icon), { class: ["h-6 w-6", unref(form).tipe_jual === opt.value ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"] }, null), _parent, _scopeId);
								_push(`<div${_scopeId}><p class="${ssrRenderClass([{ "text-indigo-700 dark:text-indigo-300": unref(form).tipe_jual === opt.value }, "text-xs font-semibold leading-tight"])}"${_scopeId}>${ssrInterpolate(opt.label)}</p><p class="text-[10px] leading-tight text-muted-foreground"${_scopeId}>${ssrInterpolate(opt.short)}</p></div></button>`);
							});
							_push(`<!--]--></div><p class="mt-2 flex items-start gap-1.5 rounded-lg bg-indigo-50/70 px-3 py-2 text-xs text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Info), { class: "mt-0.5 h-3.5 w-3.5 shrink-0" }, null, _parent, _scopeId));
							_push(`<span${_scopeId}>${ssrInterpolate(tipeJualOptions.find((o) => o.value === unref(form).tipe_jual)?.hint)}</span></p></div>`);
							if (unref(form).tipe_jual !== "jasa") {
								_push(`<div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="prod-satuan"${_scopeId}> Satuan </label><input id="prod-satuan"${ssrRenderAttr("value", unref(form).satuan)} type="text" list="satuan-suggestions" placeholder="pcs / liter / kg" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.satuan }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}><datalist id="satuan-suggestions"${_scopeId}><!--[-->`);
								ssrRenderList(satuanSuggestions.value, (s) => {
									_push(`<option${ssrRenderAttr("value", s)}${_scopeId}></option>`);
								});
								_push(`<!--]--></datalist><div class="mt-2 flex flex-wrap gap-1.5"${_scopeId}><!--[-->`);
								ssrRenderList(satuanSuggestions.value, (s) => {
									_push(`<button type="button" class="${ssrRenderClass([unref(form).satuan === s ? "border-indigo-500 bg-indigo-600 text-white" : "border-sidebar-border/70 text-muted-foreground hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border", "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors"])}"${_scopeId}>${ssrInterpolate(s)}</button>`);
								});
								_push(`<!--]--></div>`);
								if (unref(form).errors.satuan) {
									_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
									_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
									_push(`${ssrInterpolate(unref(form).errors.satuan)}</p>`);
								} else _push(`<!---->`);
								_push(`</div>`);
							} else _push(`<!---->`);
							_push(`</section>`);
							if (unref(form).tipe_jual !== "jasa") {
								_push(`<section class="space-y-4"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(unref(Wallet), { class: "h-4 w-4 text-indigo-600 dark:text-indigo-400" }, null, _parent, _scopeId));
								_push(`<h3 class="text-sm font-bold"${_scopeId}>Harga &amp; Stok</h3></div><div class="grid gap-4 sm:grid-cols-2"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="prod-harga-jual"${_scopeId}>${ssrInterpolate(unref(form).tipe_jual === "curah" ? `Harga per ${unref(form).satuan || "satuan"}` : "Harga Jual")} <span class="text-rose-500"${_scopeId}>*</span></label><div class="relative"${_scopeId}><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground"${_scopeId}>Rp</span><input id="prod-harga-jual"${ssrRenderAttr("value", unref(form).harga_jual)} type="number" min="0" placeholder="0" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.harga_jual }, "w-full rounded-lg border border-sidebar-border/70 bg-background py-3 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}></div>`);
								if (unref(form).errors.harga_jual) {
									_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
									_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
									_push(`${ssrInterpolate(unref(form).errors.harga_jual)}</p>`);
								} else _push(`<!---->`);
								_push(`</div>`);
								if (unref(form).jenis === "beli") {
									_push(`<div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="prod-harga-modal"${_scopeId}> Harga Modal / Beli </label><div class="relative"${_scopeId}><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground"${_scopeId}>Rp</span><input id="prod-harga-modal"${ssrRenderAttr("value", unref(form).harga_modal)} type="number" min="0" placeholder="0" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.harga_modal }, "w-full rounded-lg border border-sidebar-border/70 bg-background py-3 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}></div>`);
									if (unref(form).errors.harga_modal) {
										_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
										_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
										_push(`${ssrInterpolate(unref(form).errors.harga_modal)}</p>`);
									} else _push(`<!---->`);
									_push(`</div>`);
								} else _push(`<!---->`);
								_push(`</div>`);
								if (unref(form).jenis !== "beli") {
									_push(`<div class="flex items-start gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3.5 py-2.5 text-xs text-muted-foreground"${_scopeId}>`);
									_push(ssrRenderComponent(unref(Info), { class: "mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" }, null, _parent, _scopeId));
									_push(`<span${_scopeId}>Modal produk ini dihitung otomatis lewat menu <strong${_scopeId}>Produksi</strong>, jadi tidak perlu diisi manual.</span></div>`);
								} else _push(`<!---->`);
								_push(`<div class="grid gap-4 sm:grid-cols-2"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="prod-stok"${_scopeId}> Stok${ssrInterpolate(unref(form).satuan ? ` (${unref(form).satuan})` : "")}</label><input id="prod-stok"${ssrRenderAttr("value", unref(form).stok)} type="number" min="0"${ssrRenderAttr("step", unref(form).tipe_jual === "curah" ? "any" : "1")} placeholder="0" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.stok }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}>`);
								if (unref(form).tipe_jual === "curah") _push(`<p class="mt-1 text-xs text-muted-foreground"${_scopeId}> Boleh pecahan, mis. 12.5 ${ssrInterpolate(unref(form).satuan || "satuan")}. </p>`);
								else _push(`<!---->`);
								if (unref(form).errors.stok) {
									_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
									_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
									_push(`${ssrInterpolate(unref(form).errors.stok)}</p>`);
								} else _push(`<!---->`);
								_push(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="prod-potongan"${_scopeId}> Potongan Reseller </label><div class="relative"${_scopeId}><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground"${_scopeId}>Rp</span><input id="prod-potongan"${ssrRenderAttr("value", unref(form).potongan_reseller)} type="number" min="0" placeholder="0" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.potongan_reseller }, "w-full rounded-lg border border-sidebar-border/70 bg-background py-3 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}></div>`);
								if (unref(form).errors.potongan_reseller) {
									_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
									_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
									_push(`${ssrInterpolate(unref(form).errors.potongan_reseller)}</p>`);
								} else _push(`<!---->`);
								_push(`</div></div>`);
								if (Number(unref(form).potongan_reseller) > 0) _push(`<div class="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 text-xs"${_scopeId}><span class="text-muted-foreground"${_scopeId}>Harga untuk reseller: </span><strong class="text-emerald-700 dark:text-emerald-400"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(hargaReseller.value))}</strong><span class="text-muted-foreground"${_scopeId}> (dari ${ssrInterpolate(unref(formatRupiah)(Number(unref(form).harga_jual || 0)))})</span></div>`);
								else _push(`<p class="text-xs text-muted-foreground"${_scopeId}> Kosongkan / 0 bila produk ini tidak diberi potongan untuk reseller. </p>`);
								if (resellerBelowModal.value) {
									_push(`<p class="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400"${_scopeId}>`);
									_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3.5 w-3.5 shrink-0" }, null, _parent, _scopeId));
									_push(` Harga reseller di bawah modal (${ssrInterpolate(unref(formatRupiah)(Number(unref(form).harga_modal || 0)))}) — berisiko rugi. </p>`);
								} else _push(`<!---->`);
								_push(`</section>`);
							} else _push(`<!---->`);
							if (unref(form).tipe_jual === "jasa") {
								_push(`<section class="space-y-3"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
								_push(ssrRenderComponent(unref(HandCoins), { class: "h-4 w-4 text-violet-600 dark:text-violet-400" }, null, _parent, _scopeId));
								_push(`<h3 class="text-sm font-bold"${_scopeId}>Tarif Fee Bertingkat</h3><span class="text-xs font-normal text-muted-foreground"${_scopeId}>(opsional)</span></div><div class="flex items-start gap-2 rounded-lg border border-sky-500/20 bg-sky-500/5 px-3.5 py-2.5 text-xs text-muted-foreground"${_scopeId}>`);
								_push(ssrRenderComponent(unref(Info), { class: "mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" }, null, _parent, _scopeId));
								_push(`<span${_scopeId}> Produk <strong${_scopeId}>jasa</strong> tidak menyimpan stok. Pendapatan toko = <strong${_scopeId}>fee (biaya admin)</strong>, bukan nominal transfer/tarik. Atur fee-nya di sini. </span></div><div class="flex items-start gap-2 rounded-lg border border-violet-500/20 bg-violet-500/5 px-3.5 py-2.5 text-xs text-muted-foreground"${_scopeId}>`);
								_push(ssrRenderComponent(unref(Info), { class: "mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" }, null, _parent, _scopeId));
								_push(`<span${_scopeId}> Atur fee sesuai <strong${_scopeId}>range nominal</strong>. Saat transaksi, kasir cukup mengisi nominal lalu fee terisi otomatis. Untuk <strong${_scopeId}>fee tetap</strong> (sama berapa pun nominal), cukup buat satu range mulai Rp0. <strong${_scopeId}>Kosongkan</strong> bila fee ingin diketik manual tiap transaksi. </span></div>`);
								if (unref(form).tarifs.length > 0) {
									_push(`<div class="space-y-2.5"${_scopeId}><div class="grid grid-cols-[1fr_1fr_auto] gap-2 px-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground"${_scopeId}><span${_scopeId}>Mulai dari</span><span${_scopeId}>Fee</span><span class="w-8"${_scopeId}></span></div><!--[-->`);
									ssrRenderList(unref(form).tarifs, (tarif, index) => {
										_push(`<div class="space-y-1"${_scopeId}><div class="grid grid-cols-[1fr_1fr_auto] items-center gap-2"${_scopeId}><div class="relative"${_scopeId}><span class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground"${_scopeId}>Rp</span><input${ssrRenderAttr("value", tarif.min_nominal)} type="number" min="0" inputmode="numeric" placeholder="0" class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-7 pr-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"${_scopeId}></div><div class="relative"${_scopeId}><span class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground"${_scopeId}>Rp</span><input${ssrRenderAttr("value", tarif.fee)} type="number" min="0" inputmode="numeric" placeholder="0" class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-7 pr-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"${_scopeId}></div><button type="button" class="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10" title="Hapus range"${_scopeId}>`);
										_push(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4" }, null, _parent, _scopeId));
										_push(`</button></div><p class="px-1 text-[11px] text-muted-foreground"${_scopeId}> Berlaku untuk <strong class="font-semibold text-foreground"${_scopeId}>${ssrInterpolate(tarifRangeLabel(index))}</strong></p></div>`);
									});
									_push(`<!--]--></div>`);
								} else _push(`<!---->`);
								_push(`<button type="button" class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/5 px-3 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-500/10 dark:text-indigo-400"${_scopeId}>`);
								_push(ssrRenderComponent(unref(Plus), { class: "h-3.5 w-3.5" }, null, _parent, _scopeId));
								_push(` Tambah Range </button>`);
								if (unref(form).tarifs.length > 0) _push(`<p class="text-[11px] text-muted-foreground"${_scopeId}> Nominal di bawah range terendah otomatis ikut fee range terendah. </p>`);
								else _push(`<!---->`);
								_push(`</section>`);
							} else _push(`<!---->`);
							_push(`<section class="space-y-3"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
							_push(ssrRenderComponent(unref(ScanLine), { class: "h-4 w-4 text-indigo-600 dark:text-indigo-400" }, null, _parent, _scopeId));
							_push(`<h3 class="text-sm font-bold"${_scopeId}>Barcode &amp; SKU</h3><span class="text-xs font-normal text-muted-foreground"${_scopeId}>(opsional)</span></div><div class="rounded-xl border border-sidebar-border/70 bg-slate-50/50 p-4 dark:border-sidebar-border dark:bg-zinc-800/20"${_scopeId}><div class="mb-3 flex flex-wrap items-center justify-between gap-2"${_scopeId}><div role="status" class="${ssrRenderClass(["inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold", isScannerDetected.value ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400"])}"${ssrRenderAttr("title", scannerStatusText.value)}${_scopeId}>`);
							_push(ssrRenderComponent(unref(Barcode), { class: "h-3.5 w-3.5" }, null, _parent, _scopeId));
							_push(`<span class="${ssrRenderClass(["h-2 w-2 rounded-full", isScannerDetected.value ? "bg-emerald-500" : "bg-rose-500"])}"${_scopeId}></span> ${ssrInterpolate(scannerStatusText.value)}</div><button type="button" class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400" title="Buat barcode EAN-13 &amp; SKU otomatis"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Sparkles), { class: "h-3.5 w-3.5" }, null, _parent, _scopeId));
							_push(` Generate Otomatis </button></div><p class="mb-3 text-xs text-muted-foreground"${_scopeId}> Boleh dikosongkan dulu jika produk belum punya barcode. Klik <strong${_scopeId}>Generate Otomatis</strong> untuk membuat barcode &amp; SKU sekaligus, atau scan / isi manual. </p><div class="grid grid-cols-1 gap-4 sm:grid-cols-2"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="prod-barcode"${_scopeId}> Barcode </label><input id="prod-barcode"${ssrRenderAttr("value", unref(form).barcode)} type="text" placeholder="Barcode unik" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.barcode }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}>`);
							if (unref(form).errors.barcode) {
								_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
								_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
								_push(`${ssrInterpolate(unref(form).errors.barcode)}</p>`);
							} else _push(`<!---->`);
							_push(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="prod-sku"${_scopeId}> SKU </label><input id="prod-sku"${ssrRenderAttr("value", unref(form).sku)} type="text" placeholder="SKU unik" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.sku }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}>`);
							if (unref(form).errors.sku) {
								_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
								_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
								_push(`${ssrInterpolate(unref(form).errors.sku)}</p>`);
							} else _push(`<!---->`);
							_push(`</div></div></div></section></div><div class="shrink-0 border-t border-sidebar-border/70 bg-card px-5 py-3.5 dark:border-sidebar-border"${_scopeId}><div class="flex gap-3"${_scopeId}><button type="button" class="rounded-lg border border-sidebar-border/70 bg-background px-5 py-3 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"${_scopeId}> Batal </button><button type="submit" class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
							_push(ssrRenderComponent(unref(Save), { class: "h-4 w-4" }, null, _parent, _scopeId));
							_push(` ${ssrInterpolate(unref(form).processing ? "Menyimpan..." : editingProduk.value ? "Simpan Perubahan" : "Tambah Produk")}</button></div></div></form></div></div>`);
						} else _push(`<!---->`);
					} else return [createVNode(Transition, {
						"enter-active-class": "transition duration-200 ease-out",
						"enter-from-class": "opacity-0",
						"enter-to-class": "opacity-100",
						"leave-active-class": "transition duration-150 ease-in",
						"leave-from-class": "opacity-100",
						"leave-to-class": "opacity-0"
					}, {
						default: withCtx(() => [showModal.value ? (openBlock(), createBlock("div", {
							key: 0,
							class: "fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4",
							onClick: withModifiers(closeModal, ["self"])
						}, [createVNode("div", { class: "flex h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-sidebar-border/70 bg-card shadow-2xl dark:border-sidebar-border sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl" }, [createVNode("form", {
							class: "flex min-h-0 flex-1 flex-col",
							onSubmit: withModifiers(submitForm, ["prevent"])
						}, [
							createVNode("div", { class: "shrink-0 border-b border-sidebar-border/70 bg-card px-5 pb-4 pt-3 dark:border-sidebar-border" }, [createVNode("div", { class: "mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-300 dark:bg-zinc-700 sm:hidden" }), createVNode("div", { class: "flex items-start justify-between gap-3" }, [createVNode("div", { class: "flex items-center gap-3" }, [createVNode("div", { class: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" }, [createVNode(unref(Package), { class: "h-5 w-5" })]), createVNode("div", null, [createVNode("h2", { class: "text-base font-bold leading-tight sm:text-lg" }, toDisplayString(editingProduk.value ? "Edit Produk" : "Tambah Produk Baru"), 1), createVNode("p", { class: "text-xs text-muted-foreground" }, [
								createTextVNode(" Kolom bertanda "),
								createVNode("span", { class: "font-semibold text-rose-500" }, "*"),
								createTextVNode(" wajib diisi ")
							])])]), createVNode("button", {
								type: "button",
								class: "rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800",
								onClick: closeModal
							}, [createVNode(unref(X), { class: "h-5 w-5" })])])]),
							createVNode("div", { class: "min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-5" }, [
								createVNode("section", { class: "space-y-4" }, [
									createVNode("div", { class: "flex items-center gap-2" }, [createVNode(unref(Package), { class: "h-4 w-4 text-indigo-600 dark:text-indigo-400" }), createVNode("h3", { class: "text-sm font-bold" }, "Informasi Produk")]),
									createVNode("div", null, [
										createVNode("label", {
											class: "mb-1.5 block text-sm font-medium",
											for: "prod-nama"
										}, [createTextVNode(" Nama Produk "), createVNode("span", { class: "text-rose-500" }, "*")]),
										withDirectives(createVNode("input", {
											id: "prod-nama",
											"onUpdate:modelValue": ($event) => unref(form).nama = $event,
											type: "text",
											placeholder: "mis. Kopi Sachet, Bensin Eceran…",
											class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.nama }]
										}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).nama]]),
										unref(form).errors.nama ? (openBlock(), createBlock("p", {
											key: 0,
											class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
										}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.nama), 1)])) : createCommentVNode("", true)
									]),
									createVNode("div", null, [
										createVNode("span", { class: "mb-1.5 block text-sm font-medium" }, "Foto Produk"),
										createVNode("div", { class: "flex items-start gap-3" }, [createVNode("div", { class: "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-sidebar-border/70 bg-slate-100 dark:border-sidebar-border dark:bg-zinc-800" }, [fotoPreviewUrl.value ? (openBlock(), createBlock("img", {
											key: 0,
											src: fotoPreviewUrl.value,
											alt: "Pratinjau foto produk",
											class: "h-full w-full object-cover"
										}, null, 8, ["src"])) : (openBlock(), createBlock("div", {
											key: 1,
											class: "flex h-full w-full items-center justify-center text-muted-foreground"
										}, [createVNode(unref(ImageIcon), { class: "h-7 w-7" })])), fotoPreviewUrl.value ? (openBlock(), createBlock("button", {
											key: 2,
											type: "button",
											class: "absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white transition-colors hover:bg-black/80",
											title: "Hapus foto",
											onClick: clearFoto
										}, [createVNode(unref(X), { class: "h-3.5 w-3.5" })])) : createCommentVNode("", true)]), createVNode("div", { class: "flex min-w-0 flex-1 flex-col gap-2" }, [createVNode("label", { class: "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-sidebar-border/70 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-sidebar-border dark:bg-zinc-900 dark:text-slate-200 dark:hover:bg-zinc-800" }, [
											createVNode(unref(Upload), { class: "h-4 w-4" }),
											createTextVNode(" " + toDisplayString(fotoUploadName.value ? "Ganti Foto" : "Upload dari Galeri") + " ", 1),
											createVNode("input", {
												type: "file",
												accept: "image/*",
												class: "hidden",
												onChange: handleFileUpload
											}, null, 32)
										]), withDirectives(createVNode("input", {
											id: "prod-foto",
											"onUpdate:modelValue": ($event) => unref(form).foto = $event,
											type: "text",
											placeholder: "atau tempel URL gambar…",
											class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.foto }]
										}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).foto]])])]),
										fotoUploadName.value ? (openBlock(), createBlock("p", {
											key: 0,
											class: "mt-1.5 truncate text-xs text-muted-foreground"
										}, " File dipilih: " + toDisplayString(fotoUploadName.value), 1)) : createCommentVNode("", true),
										unref(form).errors.foto ? (openBlock(), createBlock("p", {
											key: 1,
											class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
										}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.foto), 1)])) : createCommentVNode("", true)
									]),
									createVNode("div", null, [
										createVNode("label", {
											class: "mb-1.5 block text-sm font-medium",
											for: "prod-kategori"
										}, [createTextVNode(" Kategori "), createVNode("span", { class: "text-rose-500" }, "*")]),
										withDirectives(createVNode("select", {
											id: "prod-kategori",
											"onUpdate:modelValue": ($event) => unref(form).id_kategori = $event,
											class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.id_kategori }]
										}, [createVNode("option", { value: "" }, "Pilih kategori"), (openBlock(true), createBlock(Fragment, null, renderList(__props.kategoris, (kat) => {
											return openBlock(), createBlock("option", {
												key: kat.id_kategori,
												value: String(kat.id_kategori)
											}, toDisplayString(kat.nama_kategori), 9, ["value"]);
										}), 128))], 10, ["onUpdate:modelValue"]), [[vModelSelect, unref(form).id_kategori]]),
										unref(form).errors.id_kategori ? (openBlock(), createBlock("p", {
											key: 0,
											class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
										}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.id_kategori), 1)])) : createCommentVNode("", true)
									])
								]),
								createVNode("section", { class: "space-y-4" }, [
									createVNode("div", { class: "flex items-center gap-2" }, [createVNode(unref(Tag), { class: "h-4 w-4 text-indigo-600 dark:text-indigo-400" }), createVNode("h3", { class: "text-sm font-bold" }, "Jenis & Cara Jual")]),
									unref(form).tipe_jual !== "jasa" ? (openBlock(), createBlock("div", { key: 0 }, [createVNode("span", { class: "mb-2 block text-sm font-medium" }, "Asal Produk"), createVNode("div", { class: "grid grid-cols-2 gap-2.5" }, [(openBlock(), createBlock(Fragment, null, renderList(jenisOptions, (opt) => {
										return createVNode("button", {
											key: opt.value,
											type: "button",
											class: ["flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all", unref(form).jenis === opt.value ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 dark:bg-indigo-500/10" : "border-sidebar-border/70 hover:border-indigo-300 dark:border-sidebar-border dark:hover:border-indigo-500/50"],
											onClick: ($event) => unref(form).jenis = opt.value
										}, [(openBlock(), createBlock(resolveDynamicComponent(opt.icon), { class: ["h-5 w-5 shrink-0", unref(form).jenis === opt.value ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"] }, null, 8, ["class"])), createVNode("div", { class: "min-w-0" }, [createVNode("p", { class: ["text-sm font-semibold leading-tight", { "text-indigo-700 dark:text-indigo-300": unref(form).jenis === opt.value }] }, toDisplayString(opt.label), 3), createVNode("p", { class: "mt-0.5 text-[11px] leading-tight text-muted-foreground" }, toDisplayString(opt.hint), 1)])], 10, ["onClick"]);
									}), 64))])])) : createCommentVNode("", true),
									createVNode("div", null, [
										createVNode("span", { class: "mb-2 block text-sm font-medium" }, "Tipe Jual"),
										createVNode("div", { class: "grid grid-cols-3 gap-2.5" }, [(openBlock(), createBlock(Fragment, null, renderList(tipeJualOptions, (opt) => {
											return createVNode("button", {
												key: opt.value,
												type: "button",
												class: ["relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all", unref(form).tipe_jual === opt.value ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 dark:bg-indigo-500/10" : "border-sidebar-border/70 hover:border-indigo-300 dark:border-sidebar-border dark:hover:border-indigo-500/50"],
												onClick: ($event) => unref(form).tipe_jual = opt.value
											}, [
												unref(form).tipe_jual === opt.value ? (openBlock(), createBlock(unref(Check), {
													key: 0,
													class: "absolute right-1.5 top-1.5 h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400"
												})) : createCommentVNode("", true),
												(openBlock(), createBlock(resolveDynamicComponent(opt.icon), { class: ["h-6 w-6", unref(form).tipe_jual === opt.value ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"] }, null, 8, ["class"])),
												createVNode("div", null, [createVNode("p", { class: ["text-xs font-semibold leading-tight", { "text-indigo-700 dark:text-indigo-300": unref(form).tipe_jual === opt.value }] }, toDisplayString(opt.label), 3), createVNode("p", { class: "text-[10px] leading-tight text-muted-foreground" }, toDisplayString(opt.short), 1)])
											], 10, ["onClick"]);
										}), 64))]),
										createVNode("p", { class: "mt-2 flex items-start gap-1.5 rounded-lg bg-indigo-50/70 px-3 py-2 text-xs text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300" }, [createVNode(unref(Info), { class: "mt-0.5 h-3.5 w-3.5 shrink-0" }), createVNode("span", null, toDisplayString(tipeJualOptions.find((o) => o.value === unref(form).tipe_jual)?.hint), 1)])
									]),
									unref(form).tipe_jual !== "jasa" ? (openBlock(), createBlock("div", { key: 1 }, [
										createVNode("label", {
											class: "mb-1.5 block text-sm font-medium",
											for: "prod-satuan"
										}, " Satuan "),
										withDirectives(createVNode("input", {
											id: "prod-satuan",
											"onUpdate:modelValue": ($event) => unref(form).satuan = $event,
											type: "text",
											list: "satuan-suggestions",
											placeholder: "pcs / liter / kg",
											class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.satuan }]
										}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).satuan]]),
										createVNode("datalist", { id: "satuan-suggestions" }, [(openBlock(true), createBlock(Fragment, null, renderList(satuanSuggestions.value, (s) => {
											return openBlock(), createBlock("option", {
												key: s,
												value: s
											}, null, 8, ["value"]);
										}), 128))]),
										createVNode("div", { class: "mt-2 flex flex-wrap gap-1.5" }, [(openBlock(true), createBlock(Fragment, null, renderList(satuanSuggestions.value, (s) => {
											return openBlock(), createBlock("button", {
												key: s,
												type: "button",
												class: ["rounded-full border px-2.5 py-1 text-xs font-medium transition-colors", unref(form).satuan === s ? "border-indigo-500 bg-indigo-600 text-white" : "border-sidebar-border/70 text-muted-foreground hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border"],
												onClick: ($event) => unref(form).satuan = s
											}, toDisplayString(s), 11, ["onClick"]);
										}), 128))]),
										unref(form).errors.satuan ? (openBlock(), createBlock("p", {
											key: 0,
											class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
										}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.satuan), 1)])) : createCommentVNode("", true)
									])) : createCommentVNode("", true)
								]),
								unref(form).tipe_jual !== "jasa" ? (openBlock(), createBlock("section", {
									key: 0,
									class: "space-y-4"
								}, [
									createVNode("div", { class: "flex items-center gap-2" }, [createVNode(unref(Wallet), { class: "h-4 w-4 text-indigo-600 dark:text-indigo-400" }), createVNode("h3", { class: "text-sm font-bold" }, "Harga & Stok")]),
									createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [createVNode("div", null, [
										createVNode("label", {
											class: "mb-1.5 block text-sm font-medium",
											for: "prod-harga-jual"
										}, [createTextVNode(toDisplayString(unref(form).tipe_jual === "curah" ? `Harga per ${unref(form).satuan || "satuan"}` : "Harga Jual") + " ", 1), createVNode("span", { class: "text-rose-500" }, "*")]),
										createVNode("div", { class: "relative" }, [createVNode("span", { class: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground" }, "Rp"), withDirectives(createVNode("input", {
											id: "prod-harga-jual",
											"onUpdate:modelValue": ($event) => unref(form).harga_jual = $event,
											type: "number",
											min: "0",
											placeholder: "0",
											class: ["w-full rounded-lg border border-sidebar-border/70 bg-background py-3 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.harga_jual }]
										}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).harga_jual]])]),
										unref(form).errors.harga_jual ? (openBlock(), createBlock("p", {
											key: 0,
											class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
										}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.harga_jual), 1)])) : createCommentVNode("", true)
									]), unref(form).jenis === "beli" ? (openBlock(), createBlock("div", { key: 0 }, [
										createVNode("label", {
											class: "mb-1.5 block text-sm font-medium",
											for: "prod-harga-modal"
										}, " Harga Modal / Beli "),
										createVNode("div", { class: "relative" }, [createVNode("span", { class: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground" }, "Rp"), withDirectives(createVNode("input", {
											id: "prod-harga-modal",
											"onUpdate:modelValue": ($event) => unref(form).harga_modal = $event,
											type: "number",
											min: "0",
											placeholder: "0",
											class: ["w-full rounded-lg border border-sidebar-border/70 bg-background py-3 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.harga_modal }]
										}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).harga_modal]])]),
										unref(form).errors.harga_modal ? (openBlock(), createBlock("p", {
											key: 0,
											class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
										}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.harga_modal), 1)])) : createCommentVNode("", true)
									])) : createCommentVNode("", true)]),
									unref(form).jenis !== "beli" ? (openBlock(), createBlock("div", {
										key: 0,
										class: "flex items-start gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3.5 py-2.5 text-xs text-muted-foreground"
									}, [createVNode(unref(Info), { class: "mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" }), createVNode("span", null, [
										createTextVNode("Modal produk ini dihitung otomatis lewat menu "),
										createVNode("strong", null, "Produksi"),
										createTextVNode(", jadi tidak perlu diisi manual.")
									])])) : createCommentVNode("", true),
									createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [createVNode("div", null, [
										createVNode("label", {
											class: "mb-1.5 block text-sm font-medium",
											for: "prod-stok"
										}, " Stok" + toDisplayString(unref(form).satuan ? ` (${unref(form).satuan})` : ""), 1),
										withDirectives(createVNode("input", {
											id: "prod-stok",
											"onUpdate:modelValue": ($event) => unref(form).stok = $event,
											type: "number",
											min: "0",
											step: unref(form).tipe_jual === "curah" ? "any" : "1",
											placeholder: "0",
											class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.stok }]
										}, null, 10, ["onUpdate:modelValue", "step"]), [[vModelText, unref(form).stok]]),
										unref(form).tipe_jual === "curah" ? (openBlock(), createBlock("p", {
											key: 0,
											class: "mt-1 text-xs text-muted-foreground"
										}, " Boleh pecahan, mis. 12.5 " + toDisplayString(unref(form).satuan || "satuan") + ". ", 1)) : createCommentVNode("", true),
										unref(form).errors.stok ? (openBlock(), createBlock("p", {
											key: 1,
											class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
										}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.stok), 1)])) : createCommentVNode("", true)
									]), createVNode("div", null, [
										createVNode("label", {
											class: "mb-1.5 block text-sm font-medium",
											for: "prod-potongan"
										}, " Potongan Reseller "),
										createVNode("div", { class: "relative" }, [createVNode("span", { class: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground" }, "Rp"), withDirectives(createVNode("input", {
											id: "prod-potongan",
											"onUpdate:modelValue": ($event) => unref(form).potongan_reseller = $event,
											type: "number",
											min: "0",
											placeholder: "0",
											class: ["w-full rounded-lg border border-sidebar-border/70 bg-background py-3 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.potongan_reseller }]
										}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).potongan_reseller]])]),
										unref(form).errors.potongan_reseller ? (openBlock(), createBlock("p", {
											key: 0,
											class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
										}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.potongan_reseller), 1)])) : createCommentVNode("", true)
									])]),
									Number(unref(form).potongan_reseller) > 0 ? (openBlock(), createBlock("div", {
										key: 1,
										class: "rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 text-xs"
									}, [
										createVNode("span", { class: "text-muted-foreground" }, "Harga untuk reseller: "),
										createVNode("strong", { class: "text-emerald-700 dark:text-emerald-400" }, toDisplayString(unref(formatRupiah)(hargaReseller.value)), 1),
										createVNode("span", { class: "text-muted-foreground" }, " (dari " + toDisplayString(unref(formatRupiah)(Number(unref(form).harga_jual || 0))) + ")", 1)
									])) : (openBlock(), createBlock("p", {
										key: 2,
										class: "text-xs text-muted-foreground"
									}, " Kosongkan / 0 bila produk ini tidak diberi potongan untuk reseller. ")),
									resellerBelowModal.value ? (openBlock(), createBlock("p", {
										key: 3,
										class: "flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400"
									}, [createVNode(unref(AlertCircle), { class: "h-3.5 w-3.5 shrink-0" }), createTextVNode(" Harga reseller di bawah modal (" + toDisplayString(unref(formatRupiah)(Number(unref(form).harga_modal || 0))) + ") — berisiko rugi. ", 1)])) : createCommentVNode("", true)
								])) : createCommentVNode("", true),
								unref(form).tipe_jual === "jasa" ? (openBlock(), createBlock("section", {
									key: 1,
									class: "space-y-3"
								}, [
									createVNode("div", { class: "flex items-center gap-2" }, [
										createVNode(unref(HandCoins), { class: "h-4 w-4 text-violet-600 dark:text-violet-400" }),
										createVNode("h3", { class: "text-sm font-bold" }, "Tarif Fee Bertingkat"),
										createVNode("span", { class: "text-xs font-normal text-muted-foreground" }, "(opsional)")
									]),
									createVNode("div", { class: "flex items-start gap-2 rounded-lg border border-sky-500/20 bg-sky-500/5 px-3.5 py-2.5 text-xs text-muted-foreground" }, [createVNode(unref(Info), { class: "mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" }), createVNode("span", null, [
										createTextVNode(" Produk "),
										createVNode("strong", null, "jasa"),
										createTextVNode(" tidak menyimpan stok. Pendapatan toko = "),
										createVNode("strong", null, "fee (biaya admin)"),
										createTextVNode(", bukan nominal transfer/tarik. Atur fee-nya di sini. ")
									])]),
									createVNode("div", { class: "flex items-start gap-2 rounded-lg border border-violet-500/20 bg-violet-500/5 px-3.5 py-2.5 text-xs text-muted-foreground" }, [createVNode(unref(Info), { class: "mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" }), createVNode("span", null, [
										createTextVNode(" Atur fee sesuai "),
										createVNode("strong", null, "range nominal"),
										createTextVNode(". Saat transaksi, kasir cukup mengisi nominal lalu fee terisi otomatis. Untuk "),
										createVNode("strong", null, "fee tetap"),
										createTextVNode(" (sama berapa pun nominal), cukup buat satu range mulai Rp0. "),
										createVNode("strong", null, "Kosongkan"),
										createTextVNode(" bila fee ingin diketik manual tiap transaksi. ")
									])]),
									unref(form).tarifs.length > 0 ? (openBlock(), createBlock("div", {
										key: 0,
										class: "space-y-2.5"
									}, [createVNode("div", { class: "grid grid-cols-[1fr_1fr_auto] gap-2 px-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground" }, [
										createVNode("span", null, "Mulai dari"),
										createVNode("span", null, "Fee"),
										createVNode("span", { class: "w-8" })
									]), (openBlock(true), createBlock(Fragment, null, renderList(unref(form).tarifs, (tarif, index) => {
										return openBlock(), createBlock("div", {
											key: index,
											class: "space-y-1"
										}, [createVNode("div", { class: "grid grid-cols-[1fr_1fr_auto] items-center gap-2" }, [
											createVNode("div", { class: "relative" }, [createVNode("span", { class: "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground" }, "Rp"), withDirectives(createVNode("input", {
												"onUpdate:modelValue": ($event) => tarif.min_nominal = $event,
												type: "number",
												min: "0",
												inputmode: "numeric",
												placeholder: "0",
												class: "w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-7 pr-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
											}, null, 8, ["onUpdate:modelValue"]), [[
												vModelText,
												tarif.min_nominal,
												void 0,
												{ number: true }
											]])]),
											createVNode("div", { class: "relative" }, [createVNode("span", { class: "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground" }, "Rp"), withDirectives(createVNode("input", {
												"onUpdate:modelValue": ($event) => tarif.fee = $event,
												type: "number",
												min: "0",
												inputmode: "numeric",
												placeholder: "0",
												class: "w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-7 pr-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
											}, null, 8, ["onUpdate:modelValue"]), [[
												vModelText,
												tarif.fee,
												void 0,
												{ number: true }
											]])]),
											createVNode("button", {
												type: "button",
												class: "rounded-lg p-2 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10",
												title: "Hapus range",
												onClick: ($event) => removeTarif(index)
											}, [createVNode(unref(Trash2), { class: "h-4 w-4" })], 8, ["onClick"])
										]), createVNode("p", { class: "px-1 text-[11px] text-muted-foreground" }, [createTextVNode(" Berlaku untuk "), createVNode("strong", { class: "font-semibold text-foreground" }, toDisplayString(tarifRangeLabel(index)), 1)])]);
									}), 128))])) : createCommentVNode("", true),
									createVNode("button", {
										type: "button",
										class: "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/5 px-3 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-500/10 dark:text-indigo-400",
										onClick: addTarif
									}, [createVNode(unref(Plus), { class: "h-3.5 w-3.5" }), createTextVNode(" Tambah Range ")]),
									unref(form).tarifs.length > 0 ? (openBlock(), createBlock("p", {
										key: 1,
										class: "text-[11px] text-muted-foreground"
									}, " Nominal di bawah range terendah otomatis ikut fee range terendah. ")) : createCommentVNode("", true)
								])) : createCommentVNode("", true),
								createVNode("section", { class: "space-y-3" }, [createVNode("div", { class: "flex items-center gap-2" }, [
									createVNode(unref(ScanLine), { class: "h-4 w-4 text-indigo-600 dark:text-indigo-400" }),
									createVNode("h3", { class: "text-sm font-bold" }, "Barcode & SKU"),
									createVNode("span", { class: "text-xs font-normal text-muted-foreground" }, "(opsional)")
								]), createVNode("div", { class: "rounded-xl border border-sidebar-border/70 bg-slate-50/50 p-4 dark:border-sidebar-border dark:bg-zinc-800/20" }, [
									createVNode("div", { class: "mb-3 flex flex-wrap items-center justify-between gap-2" }, [createVNode("div", {
										role: "status",
										class: ["inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold", isScannerDetected.value ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400"],
										title: scannerStatusText.value
									}, [
										createVNode(unref(Barcode), { class: "h-3.5 w-3.5" }),
										createVNode("span", { class: ["h-2 w-2 rounded-full", isScannerDetected.value ? "bg-emerald-500" : "bg-rose-500"] }, null, 2),
										createTextVNode(" " + toDisplayString(scannerStatusText.value), 1)
									], 10, ["title"]), createVNode("button", {
										type: "button",
										class: "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400",
										title: "Buat barcode EAN-13 & SKU otomatis",
										onClick: generateBarcodeAndSku
									}, [createVNode(unref(Sparkles), { class: "h-3.5 w-3.5" }), createTextVNode(" Generate Otomatis ")])]),
									createVNode("p", { class: "mb-3 text-xs text-muted-foreground" }, [
										createTextVNode(" Boleh dikosongkan dulu jika produk belum punya barcode. Klik "),
										createVNode("strong", null, "Generate Otomatis"),
										createTextVNode(" untuk membuat barcode & SKU sekaligus, atau scan / isi manual. ")
									]),
									createVNode("div", { class: "grid grid-cols-1 gap-4 sm:grid-cols-2" }, [createVNode("div", null, [
										createVNode("label", {
											class: "mb-1.5 block text-sm font-medium",
											for: "prod-barcode"
										}, " Barcode "),
										withDirectives(createVNode("input", {
											id: "prod-barcode",
											"onUpdate:modelValue": ($event) => unref(form).barcode = $event,
											type: "text",
											placeholder: "Barcode unik",
											class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.barcode }]
										}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).barcode]]),
										unref(form).errors.barcode ? (openBlock(), createBlock("p", {
											key: 0,
											class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
										}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.barcode), 1)])) : createCommentVNode("", true)
									]), createVNode("div", null, [
										createVNode("label", {
											class: "mb-1.5 block text-sm font-medium",
											for: "prod-sku"
										}, " SKU "),
										withDirectives(createVNode("input", {
											id: "prod-sku",
											"onUpdate:modelValue": ($event) => unref(form).sku = $event,
											type: "text",
											placeholder: "SKU unik",
											class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.sku }]
										}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).sku]]),
										unref(form).errors.sku ? (openBlock(), createBlock("p", {
											key: 0,
											class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
										}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.sku), 1)])) : createCommentVNode("", true)
									])])
								])])
							]),
							createVNode("div", { class: "shrink-0 border-t border-sidebar-border/70 bg-card px-5 py-3.5 dark:border-sidebar-border" }, [createVNode("div", { class: "flex gap-3" }, [createVNode("button", {
								type: "button",
								class: "rounded-lg border border-sidebar-border/70 bg-background px-5 py-3 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40",
								onClick: closeModal
							}, " Batal "), createVNode("button", {
								type: "submit",
								class: "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60",
								disabled: unref(form).processing
							}, [createVNode(unref(Save), { class: "h-4 w-4" }), createTextVNode(" " + toDisplayString(unref(form).processing ? "Menyimpan..." : editingProduk.value ? "Simpan Perubahan" : "Tambah Produk"), 1)], 8, ["disabled"])])])
						], 32)])])) : createCommentVNode("", true)]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/Products.vue
var _sfc_setup = Products_vue_vue_type_script_setup_true_lang_default.setup;
Products_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/Products.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Products_default = Products_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Products_default as default };

//# sourceMappingURL=Products-D_cdLUwh.js.map