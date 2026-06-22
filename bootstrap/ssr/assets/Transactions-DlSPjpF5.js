import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-BrhwLpUM.js";
import { r as formatRupiah } from "./format-Cq6R5JhR.js";
import { t as BodyTeleport_default } from "./BodyTeleport-CHE96Sca.js";
import { t as Pagination_default } from "./Pagination-CxLXQdL4.js";
import { t as usePagination } from "./usePagination-Dbv9f4fT.js";
import { Head, router, useForm } from "@inertiajs/vue3";
import { Fragment, computed, createBlock, createCommentVNode, createTextVNode, createVNode, defineComponent, onBeforeUnmount, onMounted, openBlock, ref, renderList, resolveDynamicComponent, toDisplayString, unref, useSSRContext, vModelSelect, vModelText, withCtx, withDirectives, withModifiers } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderVNode } from "vue/server-renderer";
import { AlertCircle, ArrowUpRight, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock, DollarSign, Edit, FileText, History, Minus, PackageMinus, PackagePlus, Plus, Save, Search, ShoppingCart, SlidersHorizontal, Trash2, TrendingDown, TrendingUp, X } from "lucide-vue-next";
//#region resources/js/routes/admin/transactions/index.ts
/**
* @see \App\Http\Controllers\TransaksiController::store
* @see app/Http/Controllers/TransaksiController.php:65
* @route '/admin/transactions'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/admin/transactions"
};
/**
* @see \App\Http\Controllers\TransaksiController::store
* @see app/Http/Controllers/TransaksiController.php:65
* @route '/admin/transactions'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\TransaksiController::store
* @see app/Http/Controllers/TransaksiController.php:65
* @route '/admin/transactions'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\TransaksiController::store
* @see app/Http/Controllers/TransaksiController.php:65
* @route '/admin/transactions'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\TransaksiController::store
* @see app/Http/Controllers/TransaksiController.php:65
* @route '/admin/transactions'
*/
storeForm.post = (options) => ({
	action: store.url(options),
	method: "post"
});
store.form = storeForm;
/**
* @see \App\Http\Controllers\TransaksiController::update
* @see app/Http/Controllers/TransaksiController.php:87
* @route '/admin/transactions/{transaksi}'
*/
var update = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
update.definition = {
	methods: ["put"],
	url: "/admin/transactions/{transaksi}"
};
/**
* @see \App\Http\Controllers\TransaksiController::update
* @see app/Http/Controllers/TransaksiController.php:87
* @route '/admin/transactions/{transaksi}'
*/
update.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { transaksi: args };
	if (typeof args === "object" && !Array.isArray(args) && "id_transaksi" in args) args = { transaksi: args.id_transaksi };
	if (Array.isArray(args)) args = { transaksi: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { transaksi: typeof args.transaksi === "object" ? args.transaksi.id_transaksi : args.transaksi };
	return update.definition.url.replace("{transaksi}", parsedArgs.transaksi.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\TransaksiController::update
* @see app/Http/Controllers/TransaksiController.php:87
* @route '/admin/transactions/{transaksi}'
*/
update.put = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
/**
* @see \App\Http\Controllers\TransaksiController::update
* @see app/Http/Controllers/TransaksiController.php:87
* @route '/admin/transactions/{transaksi}'
*/
var updateForm = (args, options) => ({
	action: update.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\TransaksiController::update
* @see app/Http/Controllers/TransaksiController.php:87
* @route '/admin/transactions/{transaksi}'
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
* @see \App\Http\Controllers\TransaksiController::destroy
* @see app/Http/Controllers/TransaksiController.php:111
* @route '/admin/transactions/{transaksi}'
*/
var destroy = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
destroy.definition = {
	methods: ["delete"],
	url: "/admin/transactions/{transaksi}"
};
/**
* @see \App\Http\Controllers\TransaksiController::destroy
* @see app/Http/Controllers/TransaksiController.php:111
* @route '/admin/transactions/{transaksi}'
*/
destroy.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { transaksi: args };
	if (typeof args === "object" && !Array.isArray(args) && "id_transaksi" in args) args = { transaksi: args.id_transaksi };
	if (Array.isArray(args)) args = { transaksi: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { transaksi: typeof args.transaksi === "object" ? args.transaksi.id_transaksi : args.transaksi };
	return destroy.definition.url.replace("{transaksi}", parsedArgs.transaksi.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\TransaksiController::destroy
* @see app/Http/Controllers/TransaksiController.php:111
* @route '/admin/transactions/{transaksi}'
*/
destroy.delete = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\TransaksiController::destroy
* @see app/Http/Controllers/TransaksiController.php:111
* @route '/admin/transactions/{transaksi}'
*/
var destroyForm = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\TransaksiController::destroy
* @see app/Http/Controllers/TransaksiController.php:111
* @route '/admin/transactions/{transaksi}'
*/
destroyForm.delete = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
destroy.form = destroyForm;
Object.assign(store, store), Object.assign(update, update), Object.assign(destroy, destroy);
//#endregion
//#region resources/js/pages/admin/Transactions.vue?vue&type=script&setup=true&lang.ts
var Transactions_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Data Transaksi",
		href: "/admin/transactions"
	}] },
	__name: "Transactions",
	__ssrInlineRender: true,
	props: {
		transaksis: {},
		kasirs: {},
		produks: {},
		stats: {},
		date_range: {}
	},
	setup(__props) {
		const props = __props;
		function formatMetode(metode) {
			return {
				cash: "Tunai",
				qris: "QRIS",
				transfer: "Transfer"
			}[metode] ?? metode;
		}
		const searchQuery = ref("");
		const filterKasir = ref("");
		const sortBy = ref("");
		const showFilterPanel = ref(false);
		const filterPanelRef = ref(null);
		const sortOptions = [
			{
				value: "date_asc",
				label: "Terlama – Terbaru",
				icon: Clock
			},
			{
				value: "date_desc",
				label: "Terbaru – Terlama",
				icon: History
			},
			{
				value: "total_desc",
				label: "Belanja Terbesar",
				icon: TrendingDown
			},
			{
				value: "total_asc",
				label: "Belanja Terkecil",
				icon: TrendingUp
			},
			{
				value: "item_desc",
				label: "Barang Terbanyak",
				icon: PackageMinus
			},
			{
				value: "item_asc",
				label: "Barang Tersedikit",
				icon: PackagePlus
			}
		];
		const activeFilterCount = computed(() => {
			let count = 0;
			if (filterKasir.value) count++;
			if (sortBy.value) count++;
			return count;
		});
		function handleClickOutsideFilter(event) {
			if (filterPanelRef.value && !filterPanelRef.value.contains(event.target)) showFilterPanel.value = false;
		}
		onMounted(() => document.addEventListener("mousedown", handleClickOutsideFilter));
		onBeforeUnmount(() => document.removeEventListener("mousedown", handleClickOutsideFilter));
		onMounted(() => {
			const search = new URLSearchParams(window.location.search).get("search");
			if (search) searchQuery.value = search;
		});
		const MONTHS = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"Mei",
			"Jun",
			"Jul",
			"Agu",
			"Sep",
			"Okt",
			"Nov",
			"Des"
		];
		function getMonthRange(year, month) {
			const start = new Date(year, month, 1);
			const end = new Date(year, month + 1, 0);
			return {
				start: start.toISOString().slice(0, 10),
				end: end.toISOString().slice(0, 10)
			};
		}
		function getYearRange(year) {
			return {
				start: `${year}-01-01`,
				end: `${year}-12-31`
			};
		}
		const showDateFilter = ref(false);
		const filterYear = ref(props.date_range.start_date ? (/* @__PURE__ */ new Date(props.date_range.start_date + "T00:00:00")).getFullYear() : (/* @__PURE__ */ new Date()).getFullYear());
		const dateStartDate = ref(props.date_range.start_date);
		const dateEndDate = ref(props.date_range.end_date);
		function detectDateMode() {
			const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			if (props.date_range.start_date === today && props.date_range.end_date === today) return "today";
			const yearRange = getYearRange(filterYear.value);
			if (props.date_range.start_date === yearRange.start && props.date_range.end_date === yearRange.end) return "year";
			for (let m = 0; m < 12; m++) {
				const range = getMonthRange(filterYear.value, m);
				if (range.start === props.date_range.start_date && range.end === props.date_range.end_date) return String(m);
			}
			return "custom";
		}
		const selectedDateMode = ref(detectDateMode());
		const periodLabel = computed(() => {
			if (selectedDateMode.value === "today") return "Hari Ini";
			if (selectedDateMode.value === "year") return `Tahun ${filterYear.value}`;
			if (selectedDateMode.value !== "custom") return `${MONTHS[Number(selectedDateMode.value)]} ${filterYear.value}`;
			return props.date_range.start_date === props.date_range.end_date ? props.date_range.start_date : `${props.date_range.start_date} – ${props.date_range.end_date}`;
		});
		const filteredTransaksis = computed(() => {
			const q = searchQuery.value.toLowerCase();
			let result = props.transaksis.filter((t) => {
				const matchSearch = !q || t.kode.toLowerCase().includes(q) || t.kasir.toLowerCase().includes(q);
				const matchKasir = !filterKasir.value || String(t.id_user) === filterKasir.value;
				return matchSearch && matchKasir;
			});
			if (sortBy.value === "date_asc") result = [...result].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
			else if (sortBy.value === "date_desc") result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
			else if (sortBy.value === "total_asc") result = [...result].sort((a, b) => a.total_harga - b.total_harga);
			else if (sortBy.value === "total_desc") result = [...result].sort((a, b) => b.total_harga - a.total_harga);
			else if (sortBy.value === "item_asc") result = [...result].sort((a, b) => a.jumlah_item - b.jumlah_item);
			else if (sortBy.value === "item_desc") result = [...result].sort((a, b) => b.jumlah_item - a.jumlah_item);
			return result;
		});
		const { currentPage, perPage, totalItems, totalPages, paginatedItems: paginatedTransaksis, startIndex, endIndex, goToPage, visiblePages } = usePagination(() => filteredTransaksis.value);
		const showDetail = ref(false);
		const selectedTrx = ref(null);
		function closeDetail() {
			showDetail.value = false;
			selectedTrx.value = null;
		}
		const showFormModal = ref(false);
		const editingTransaksi = ref(null);
		const form = useForm({
			id_user: "",
			metode_pembayaran: "cash",
			bayar: "",
			items: [{
				id_produk: "",
				jumlah: "1"
			}]
		});
		const computedTotal = computed(() => {
			return form.items.reduce((total, item) => {
				if (!item.id_produk || !item.jumlah) return total;
				const produk = props.produks.find((p) => p.id_produk === Number(item.id_produk));
				if (!produk) return total;
				return total + produk.harga_jual * Number(item.jumlah);
			}, 0);
		});
		const computedKembalian = computed(() => {
			const bayar = Number(form.bayar) || 0;
			return Math.max(0, bayar - computedTotal.value);
		});
		function openEdit(trx) {
			editingTransaksi.value = trx;
			form.id_user = String(trx.id_user);
			form.metode_pembayaran = trx.metode_pembayaran;
			form.bayar = String(trx.bayar);
			form.items = trx.details.map((d) => ({
				id_produk: String(d.id_produk),
				jumlah: String(d.jumlah)
			}));
			showDetail.value = false;
			showFormModal.value = true;
		}
		function closeFormModal() {
			showFormModal.value = false;
			form.reset();
			form.clearErrors();
		}
		function addItem() {
			form.items.push({
				id_produk: "",
				jumlah: "1"
			});
		}
		function removeItem(index) {
			if (form.items.length > 1) form.items.splice(index, 1);
		}
		function getProdukHarga(idProduk) {
			return props.produks.find((p) => p.id_produk === Number(idProduk))?.harga_jual ?? 0;
		}
		function getProdukStok(idProduk) {
			return props.produks.find((p) => p.id_produk === Number(idProduk))?.stok ?? 0;
		}
		function submitForm() {
			const data = {
				id_user: Number(form.id_user),
				metode_pembayaran: form.metode_pembayaran,
				bayar: Number(form.bayar),
				items: form.items.map((item) => ({
					id_produk: Number(item.id_produk),
					jumlah: Number(item.jumlah)
				}))
			};
			if (editingTransaksi.value) router.put(update(editingTransaksi.value.id_transaksi).url, data, { onSuccess: () => closeFormModal() });
			else router.post(store().url, data, { onSuccess: () => closeFormModal() });
		}
		function hapusTransaksi(trx) {
			if (confirm(`Hapus transaksi "${trx.kode}"? Stok produk akan dikembalikan.`)) router.delete(destroy(trx.id_transaksi).url);
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Data Transaksi - Admin" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 p-6"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-3xl font-extrabold tracking-tight">Manajemen Transaksi</h1><p class="mt-1 text-sm text-muted-foreground"> Pantau riwayat seluruh transaksi penjualan, status pembayaran, serta metode pembayaran kasir. </p></div><div class="flex shrink-0 items-center gap-2"><div class="relative"><button type="button" class="${ssrRenderClass([showDateFilter.value ? "border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400" : "border-sidebar-border/70 bg-background text-slate-600 hover:bg-slate-50 dark:border-sidebar-border dark:text-slate-300 dark:hover:bg-zinc-800", "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition"])}">`);
			_push(ssrRenderComponent(unref(CalendarDays), { class: "h-4 w-4" }, null, _parent));
			_push(` Periode <span class="ml-0.5 rounded-md bg-indigo-100 px-1.5 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">${ssrInterpolate(periodLabel.value)}</span></button>`);
			if (showDateFilter.value) {
				_push(`<div class="absolute right-0 top-11 z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"><button type="button" class="${ssrRenderClass([selectedDateMode.value === "today" ? "bg-indigo-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "mb-3 w-full rounded-lg py-2 text-xs font-semibold transition-all"])}"> Hari Ini </button><div class="flex items-center gap-0.5"><button type="button" class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800 dark:hover:text-slate-300">`);
				_push(ssrRenderComponent(unref(ChevronLeft), { class: "h-4 w-4" }, null, _parent));
				_push(`</button><span class="flex-1 text-center text-sm font-bold text-slate-800 dark:text-slate-100">${ssrInterpolate(filterYear.value)}</span><button type="button" class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800 dark:hover:text-slate-300">`);
				_push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4" }, null, _parent));
				_push(`</button></div><div class="mt-3 grid grid-cols-4 gap-1"><!--[-->`);
				ssrRenderList(MONTHS, (month, i) => {
					_push(`<button type="button" class="${ssrRenderClass([selectedDateMode.value === String(i) ? "bg-indigo-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "rounded-lg py-2 text-xs font-semibold transition-all"])}">${ssrInterpolate(month)}</button>`);
				});
				_push(`<!--]--><button type="button" class="${ssrRenderClass([selectedDateMode.value === "year" ? "bg-indigo-500 text-white" : "text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10", "col-span-4 rounded-lg py-2 text-xs font-semibold transition-all"])}"> Setahun Penuh (${ssrInterpolate(filterYear.value)}) </button><button type="button" class="${ssrRenderClass([selectedDateMode.value === "custom" ? "bg-indigo-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "col-span-4 rounded-lg py-2 text-xs font-semibold transition-all"])}"> Custom </button></div>`);
				if (selectedDateMode.value === "custom") {
					_push(`<div class="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-zinc-800"><div class="grid grid-cols-2 gap-2"><label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"> Mulai <input${ssrRenderAttr("value", dateStartDate.value)} type="date" class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-indigo-500/20"></label><label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"> Sampai <input${ssrRenderAttr("value", dateEndDate.value)} type="date" class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-indigo-500/20"></label></div><button type="button" class="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-500 text-xs font-semibold text-white transition hover:bg-indigo-600">`);
					_push(ssrRenderComponent(unref(CalendarDays), { class: "h-3 w-3" }, null, _parent));
					_push(` Terapkan </button></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div><button id="btn-tambah-transaksi" class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500">`);
			_push(ssrRenderComponent(unref(Plus), { class: "h-4 w-4" }, null, _parent));
			_push(` Tambah Transaksi </button></div></div>`);
			if (showDateFilter.value) _push(`<div class="fixed inset-0 z-40"></div>`);
			else _push(`<!---->`);
			_push(`<div class="grid gap-4 md:grid-cols-3"><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">`);
			_push(ssrRenderComponent(unref(DollarSign), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground"> Total Penjualan ${ssrInterpolate(periodLabel.value)}</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(unref(formatRupiah)(__props.stats.total_penjualan_hari_ini))}</h3></div></div><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">`);
			_push(ssrRenderComponent(unref(ShoppingCart), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground"> Total Transaksi ${ssrInterpolate(periodLabel.value)}</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_transaksi_sukses)} Transaksi </h3></div></div><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">`);
			_push(ssrRenderComponent(unref(ArrowUpRight), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Rata-rata Pembelian</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(unref(formatRupiah)(__props.stats.rata_rata))}</h3></div></div></div><div class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"><div class="border-b border-sidebar-border/70 dark:border-sidebar-border"><div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div class="relative flex-1 max-w-sm">`);
			_push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, null, _parent));
			_push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Cari berdasarkan ID atau nama kasir..." class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm transition-colors focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"></div><div class="relative shrink-0"><button class="${ssrRenderClass([activeFilterCount.value > 0 ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-500" : "border border-sidebar-border/70 bg-background text-slate-700 hover:bg-slate-50 dark:border-sidebar-border dark:text-slate-200 dark:hover:bg-zinc-800/40", "inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-150"])}">`);
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
				_push(`</button></div><div class="p-4"><div class="mb-5"><p class="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Kasir</p><div class="flex flex-wrap gap-1.5"><button class="${ssrRenderClass([filterKasir.value === "" ? "border-indigo-500 bg-indigo-600 text-white shadow-sm" : "border-sidebar-border/70 bg-background text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-400", "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-100"])}"> Semua </button><!--[-->`);
				ssrRenderList(__props.kasirs, (kasir) => {
					_push(`<button class="${ssrRenderClass([filterKasir.value === String(kasir.id) ? "border-indigo-500 bg-indigo-600 text-white shadow-sm" : "border-sidebar-border/70 bg-background text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-sidebar-border dark:text-slate-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-400", "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-100"])}">${ssrInterpolate(kasir.name)}</button>`);
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
			_push(`</div></div>`);
			if (activeFilterCount.value > 0) {
				_push(`<div class="flex flex-wrap items-center gap-2 border-t border-indigo-100 bg-indigo-50/60 px-4 py-2.5 dark:border-indigo-500/10 dark:bg-indigo-500/5"><span class="text-xs font-medium text-muted-foreground">Filter aktif:</span>`);
				if (filterKasir.value) {
					_push(`<span class="inline-flex items-center gap-1 rounded-full bg-indigo-100 py-0.5 pl-2.5 pr-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">${ssrInterpolate(__props.kasirs.find((k) => String(k.id) === filterKasir.value)?.name)} <button class="rounded-full p-0.5 transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-500/30">`);
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
			_push(`</div><div class="overflow-x-auto"><table class="w-full border-collapse text-left text-sm"><thead><tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"><th class="px-6 py-4 font-semibold text-muted-foreground"> ID Transaksi </th><th class="px-6 py-4 font-semibold text-muted-foreground">Kasir</th><th class="px-6 py-4 font-semibold text-muted-foreground"> Jumlah Barang </th><th class="px-6 py-4 font-semibold text-muted-foreground"> Total Belanja </th><th class="px-6 py-4 font-semibold text-muted-foreground">Metode</th><th class="px-6 py-4 font-semibold text-muted-foreground">Waktu</th><th class="px-6 py-4 text-right font-semibold text-muted-foreground"> Aksi </th></tr></thead><tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">`);
			if (unref(paginatedTransaksis).length === 0) {
				_push(`<tr><td colspan="7" class="px-6 py-12 text-center text-muted-foreground">`);
				_push(ssrRenderComponent(unref(ShoppingCart), { class: "mx-auto mb-3 h-10 w-10 opacity-30" }, null, _parent));
				_push(`<p class="font-medium">${ssrInterpolate(searchQuery.value ? "Tidak ada transaksi yang sesuai pencarian." : "Belum ada transaksi.")}</p></td></tr>`);
			} else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(unref(paginatedTransaksis), (trx) => {
				_push(`<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"><td class="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">${ssrInterpolate(trx.kode)}</td><td class="px-6 py-4 font-semibold text-foreground">${ssrInterpolate(trx.kasir)}</td><td class="px-6 py-4 text-muted-foreground">${ssrInterpolate(trx.jumlah_item)} item </td><td class="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">${ssrInterpolate(unref(formatRupiah)(trx.total_harga))}</td><td class="px-6 py-4"><span class="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">${ssrInterpolate(formatMetode(trx.metode_pembayaran))}</span></td><td class="px-6 py-4 text-muted-foreground"><div><p class="font-medium">${ssrInterpolate(trx.waktu)}</p><p class="text-xs">${ssrInterpolate(trx.tanggal)}</p></div></td><td class="px-6 py-4 text-right"><div class="inline-flex justify-end gap-2"><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800" title="Lihat Detail">`);
				_push(ssrRenderComponent(unref(FileText), { class: "h-4 w-4" }, null, _parent));
				_push(`</button><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800" title="Edit">`);
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
					if (_push) if (showDetail.value && selectedTrx.value) {
						_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"${_scopeId}><div class="w-full max-w-lg rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border" style="${ssrRenderStyle({
							"max-height": "90vh",
							"overflow-y": "auto"
						})}"${_scopeId}><div class="mb-5 flex items-center justify-between"${_scopeId}><h2 class="text-lg font-bold"${_scopeId}>Detail Transaksi</h2><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"${_scopeId}>`);
						_push(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`</button></div><div class="mb-4 flex flex-col gap-3 text-sm"${_scopeId}><div class="flex justify-between"${_scopeId}><span class="text-muted-foreground"${_scopeId}>ID Transaksi</span><span class="font-mono font-bold text-indigo-600 dark:text-indigo-400"${_scopeId}>${ssrInterpolate(selectedTrx.value.kode)}</span></div><div class="flex justify-between"${_scopeId}><span class="text-muted-foreground"${_scopeId}>Kasir</span><span class="font-semibold"${_scopeId}>${ssrInterpolate(selectedTrx.value.kasir)}</span></div><div class="flex justify-between"${_scopeId}><span class="text-muted-foreground"${_scopeId}>Waktu</span><span${_scopeId}>${ssrInterpolate(selectedTrx.value.waktu)}, ${ssrInterpolate(selectedTrx.value.tanggal)}</span></div></div><div class="mb-4 overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border"${_scopeId}><table class="w-full text-sm"${_scopeId}><thead${_scopeId}><tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"${_scopeId}><th class="px-4 py-2 text-left font-semibold text-muted-foreground"${_scopeId}>Produk</th><th class="px-4 py-2 text-right font-semibold text-muted-foreground"${_scopeId}>Qty</th><th class="px-4 py-2 text-right font-semibold text-muted-foreground"${_scopeId}>Subtotal</th></tr></thead><tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border"${_scopeId}><!--[-->`);
						ssrRenderList(selectedTrx.value.details, (detail, idx) => {
							_push(`<tr${_scopeId}><td class="px-4 py-2 flex items-center gap-3"${_scopeId}>`);
							if (detail.foto_url) _push(`<img${ssrRenderAttr("src", detail.foto_url)}${ssrRenderAttr("alt", detail.nama_produk)} class="h-10 w-10 shrink-0 rounded-lg border border-sidebar-border/70 object-cover dark:border-sidebar-border"${_scopeId}>`);
							else _push(`<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sidebar-border/70 bg-slate-100 text-[10px] font-medium text-muted-foreground dark:border-sidebar-border dark:bg-zinc-800"${_scopeId}> Foto </div>`);
							_push(`<span${_scopeId}>${ssrInterpolate(detail.nama_produk)}</span></td><td class="px-4 py-2 text-right"${_scopeId}>${ssrInterpolate(detail.jumlah)}</td><td class="px-4 py-2 text-right font-medium"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(detail.subtotal))}</td></tr>`);
						});
						_push(`<!--]--></tbody></table></div><div class="flex flex-col gap-2 text-sm"${_scopeId}><div class="flex justify-between"${_scopeId}><span class="text-muted-foreground"${_scopeId}>Metode Pembayaran</span><span class="font-semibold"${_scopeId}>${ssrInterpolate(formatMetode(selectedTrx.value.metode_pembayaran))}</span></div><div class="flex justify-between"${_scopeId}><span class="text-muted-foreground"${_scopeId}>Total Belanja</span><span class="font-bold"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(selectedTrx.value.total_harga))}</span></div><div class="flex justify-between"${_scopeId}><span class="text-muted-foreground"${_scopeId}>Dibayar</span><span${_scopeId}>${ssrInterpolate(unref(formatRupiah)(selectedTrx.value.bayar))}</span></div><div class="flex justify-between"${_scopeId}><span class="text-muted-foreground"${_scopeId}>Kembalian</span><span class="font-semibold text-emerald-600"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(selectedTrx.value.kembalian))}</span></div></div><div class="mt-5 flex justify-end gap-3"${_scopeId}><button class="inline-flex items-center gap-2 rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Edit), { class: "h-4 w-4" }, null, _parent, _scopeId));
						_push(` Edit </button><button class="inline-flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-500/20"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4" }, null, _parent, _scopeId));
						_push(` Hapus </button></div></div></div>`);
					} else _push(`<!---->`);
					else return [showDetail.value && selectedTrx.value ? (openBlock(), createBlock("div", {
						key: 0,
						class: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
						onClick: withModifiers(closeDetail, ["self"])
					}, [createVNode("div", {
						class: "w-full max-w-lg rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border",
						style: {
							"max-height": "90vh",
							"overflow-y": "auto"
						}
					}, [
						createVNode("div", { class: "mb-5 flex items-center justify-between" }, [createVNode("h2", { class: "text-lg font-bold" }, "Detail Transaksi"), createVNode("button", {
							class: "rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800",
							onClick: closeDetail
						}, [createVNode(unref(X), { class: "h-5 w-5" })])]),
						createVNode("div", { class: "mb-4 flex flex-col gap-3 text-sm" }, [
							createVNode("div", { class: "flex justify-between" }, [createVNode("span", { class: "text-muted-foreground" }, "ID Transaksi"), createVNode("span", { class: "font-mono font-bold text-indigo-600 dark:text-indigo-400" }, toDisplayString(selectedTrx.value.kode), 1)]),
							createVNode("div", { class: "flex justify-between" }, [createVNode("span", { class: "text-muted-foreground" }, "Kasir"), createVNode("span", { class: "font-semibold" }, toDisplayString(selectedTrx.value.kasir), 1)]),
							createVNode("div", { class: "flex justify-between" }, [createVNode("span", { class: "text-muted-foreground" }, "Waktu"), createVNode("span", null, toDisplayString(selectedTrx.value.waktu) + ", " + toDisplayString(selectedTrx.value.tanggal), 1)])
						]),
						createVNode("div", { class: "mb-4 overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border" }, [createVNode("table", { class: "w-full text-sm" }, [createVNode("thead", null, [createVNode("tr", { class: "border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20" }, [
							createVNode("th", { class: "px-4 py-2 text-left font-semibold text-muted-foreground" }, "Produk"),
							createVNode("th", { class: "px-4 py-2 text-right font-semibold text-muted-foreground" }, "Qty"),
							createVNode("th", { class: "px-4 py-2 text-right font-semibold text-muted-foreground" }, "Subtotal")
						])]), createVNode("tbody", { class: "divide-y divide-sidebar-border/70 dark:divide-sidebar-border" }, [(openBlock(true), createBlock(Fragment, null, renderList(selectedTrx.value.details, (detail, idx) => {
							return openBlock(), createBlock("tr", { key: idx }, [
								createVNode("td", { class: "px-4 py-2 flex items-center gap-3" }, [detail.foto_url ? (openBlock(), createBlock("img", {
									key: 0,
									src: detail.foto_url,
									alt: detail.nama_produk,
									class: "h-10 w-10 shrink-0 rounded-lg border border-sidebar-border/70 object-cover dark:border-sidebar-border"
								}, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
									key: 1,
									class: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sidebar-border/70 bg-slate-100 text-[10px] font-medium text-muted-foreground dark:border-sidebar-border dark:bg-zinc-800"
								}, " Foto ")), createVNode("span", null, toDisplayString(detail.nama_produk), 1)]),
								createVNode("td", { class: "px-4 py-2 text-right" }, toDisplayString(detail.jumlah), 1),
								createVNode("td", { class: "px-4 py-2 text-right font-medium" }, toDisplayString(unref(formatRupiah)(detail.subtotal)), 1)
							]);
						}), 128))])])]),
						createVNode("div", { class: "flex flex-col gap-2 text-sm" }, [
							createVNode("div", { class: "flex justify-between" }, [createVNode("span", { class: "text-muted-foreground" }, "Metode Pembayaran"), createVNode("span", { class: "font-semibold" }, toDisplayString(formatMetode(selectedTrx.value.metode_pembayaran)), 1)]),
							createVNode("div", { class: "flex justify-between" }, [createVNode("span", { class: "text-muted-foreground" }, "Total Belanja"), createVNode("span", { class: "font-bold" }, toDisplayString(unref(formatRupiah)(selectedTrx.value.total_harga)), 1)]),
							createVNode("div", { class: "flex justify-between" }, [createVNode("span", { class: "text-muted-foreground" }, "Dibayar"), createVNode("span", null, toDisplayString(unref(formatRupiah)(selectedTrx.value.bayar)), 1)]),
							createVNode("div", { class: "flex justify-between" }, [createVNode("span", { class: "text-muted-foreground" }, "Kembalian"), createVNode("span", { class: "font-semibold text-emerald-600" }, toDisplayString(unref(formatRupiah)(selectedTrx.value.kembalian)), 1)])
						]),
						createVNode("div", { class: "mt-5 flex justify-end gap-3" }, [createVNode("button", {
							class: "inline-flex items-center gap-2 rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40",
							onClick: ($event) => openEdit(selectedTrx.value)
						}, [createVNode(unref(Edit), { class: "h-4 w-4" }), createTextVNode(" Edit ")], 8, ["onClick"]), createVNode("button", {
							class: "inline-flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-500/20",
							onClick: ($event) => {
								hapusTransaksi(selectedTrx.value);
								closeDetail();
							}
						}, [createVNode(unref(Trash2), { class: "h-4 w-4" }), createTextVNode(" Hapus ")], 8, ["onClick"])])
					])])) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(BodyTeleport_default, null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) if (showFormModal.value) {
						_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"${_scopeId}><div class="w-full max-w-2xl rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border" style="${ssrRenderStyle({
							"max-height": "90vh",
							"overflow-y": "auto"
						})}"${_scopeId}><div class="mb-5 flex items-center justify-between"${_scopeId}><h2 class="text-lg font-bold"${_scopeId}>${ssrInterpolate(editingTransaksi.value ? "Edit Transaksi" : "Tambah Transaksi Baru")}</h2><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"${_scopeId}>`);
						_push(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`</button></div><form class="flex flex-col gap-4"${_scopeId}><div class="grid grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="trx-kasir"${_scopeId}> Kasir </label><select id="trx-kasir" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.id_user }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).id_user) ? ssrLooseContain(unref(form).id_user, "") : ssrLooseEqual(unref(form).id_user, "")) ? " selected" : ""}${_scopeId}>Pilih kasir</option><!--[-->`);
						ssrRenderList(__props.kasirs, (kasir) => {
							_push(`<option${ssrRenderAttr("value", String(kasir.id))}${ssrIncludeBooleanAttr(Array.isArray(unref(form).id_user) ? ssrLooseContain(unref(form).id_user, String(kasir.id)) : ssrLooseEqual(unref(form).id_user, String(kasir.id))) ? " selected" : ""}${_scopeId}>${ssrInterpolate(kasir.name)} (${ssrInterpolate(kasir.role)}) </option>`);
						});
						_push(`<!--]--></select>`);
						if (unref(form).errors.id_user) {
							_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
							_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(form).errors.id_user)}</p>`);
						} else _push(`<!---->`);
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="trx-metode"${_scopeId}> Metode Pembayaran </label><select id="trx-metode" class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"${_scopeId}><option value="cash"${ssrIncludeBooleanAttr(Array.isArray(unref(form).metode_pembayaran) ? ssrLooseContain(unref(form).metode_pembayaran, "cash") : ssrLooseEqual(unref(form).metode_pembayaran, "cash")) ? " selected" : ""}${_scopeId}>Tunai</option><option value="qris"${ssrIncludeBooleanAttr(Array.isArray(unref(form).metode_pembayaran) ? ssrLooseContain(unref(form).metode_pembayaran, "qris") : ssrLooseEqual(unref(form).metode_pembayaran, "qris")) ? " selected" : ""}${_scopeId}>QRIS</option><option value="transfer"${ssrIncludeBooleanAttr(Array.isArray(unref(form).metode_pembayaran) ? ssrLooseContain(unref(form).metode_pembayaran, "transfer") : ssrLooseEqual(unref(form).metode_pembayaran, "transfer")) ? " selected" : ""}${_scopeId}>Transfer</option></select></div></div><div${_scopeId}><div class="mb-2 flex items-center justify-between"${_scopeId}><label class="text-sm font-medium"${_scopeId}>Item Produk</label><button type="button" class="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-500"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Plus), { class: "h-3 w-3" }, null, _parent, _scopeId));
						_push(` Tambah Item </button></div>`);
						if (unref(form).errors.items) {
							_push(`<div class="mb-2 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
							_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(form).errors.items)}</div>`);
						} else _push(`<!---->`);
						_push(`<div class="flex flex-col gap-2"${_scopeId}><!--[-->`);
						ssrRenderList(unref(form).items, (item, index) => {
							_push(`<div class="flex items-start gap-2 rounded-lg border border-sidebar-border/70 p-3 dark:border-sidebar-border"${_scopeId}><div class="flex-1"${_scopeId}><select class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(item.id_produk) ? ssrLooseContain(item.id_produk, "") : ssrLooseEqual(item.id_produk, "")) ? " selected" : ""}${_scopeId}>Pilih produk</option><!--[-->`);
							ssrRenderList(__props.produks, (produk) => {
								_push(`<option${ssrRenderAttr("value", String(produk.id_produk))}${ssrIncludeBooleanAttr(Array.isArray(item.id_produk) ? ssrLooseContain(item.id_produk, String(produk.id_produk)) : ssrLooseEqual(item.id_produk, String(produk.id_produk))) ? " selected" : ""}${_scopeId}>${ssrInterpolate(produk.nama)} — ${ssrInterpolate(unref(formatRupiah)(produk.harga_jual))} (stok: ${ssrInterpolate(produk.stok)}) </option>`);
							});
							_push(`<!--]--></select></div><div class="w-24"${_scopeId}><input${ssrRenderAttr("value", item.jumlah)} type="number" min="1"${ssrRenderAttr("max", getProdukStok(item.id_produk) || void 0)} placeholder="Qty" class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"${_scopeId}></div><div class="w-28 pt-2 text-right text-sm font-medium"${_scopeId}>${ssrInterpolate(item.id_produk && item.jumlah ? unref(formatRupiah)(getProdukHarga(item.id_produk) * Number(item.jumlah)) : "-")}</div><button type="button"${ssrIncludeBooleanAttr(unref(form).items.length <= 1) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-40": unref(form).items.length <= 1 }, "mt-1.5 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"])}"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Minus), { class: "h-4 w-4" }, null, _parent, _scopeId));
							_push(`</button></div>`);
						});
						_push(`<!--]--></div></div><div class="rounded-lg border border-sidebar-border/70 bg-slate-50/50 p-4 dark:border-sidebar-border dark:bg-zinc-800/20"${_scopeId}><div class="flex justify-between text-sm"${_scopeId}><span class="text-muted-foreground"${_scopeId}>Total</span><span class="font-bold"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(computedTotal.value))}</span></div><div class="mt-2 flex justify-between text-sm"${_scopeId}><span class="text-muted-foreground"${_scopeId}>Kembalian</span><span class="font-semibold text-emerald-600"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(computedKembalian.value))}</span></div></div><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="trx-bayar"${_scopeId}> Jumlah Bayar (Rp) </label><input id="trx-bayar"${ssrRenderAttr("value", unref(form).bayar)} type="number" min="0" placeholder="0" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.bayar }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}>`);
						if (unref(form).errors.bayar) {
							_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
							_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(form).errors.bayar)}</p>`);
						} else _push(`<!---->`);
						_push(`</div><div class="flex justify-end gap-3 pt-2"${_scopeId}><button type="button" class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"${_scopeId}> Batal </button><button type="submit" class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
						_push(ssrRenderComponent(unref(Save), { class: "h-4 w-4" }, null, _parent, _scopeId));
						_push(` ${ssrInterpolate(unref(form).processing ? "Menyimpan..." : editingTransaksi.value ? "Simpan Perubahan" : "Simpan Transaksi")}</button></div></form></div></div>`);
					} else _push(`<!---->`);
					else return [showFormModal.value ? (openBlock(), createBlock("div", {
						key: 0,
						class: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
						onClick: withModifiers(closeFormModal, ["self"])
					}, [createVNode("div", {
						class: "w-full max-w-2xl rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border",
						style: {
							"max-height": "90vh",
							"overflow-y": "auto"
						}
					}, [createVNode("div", { class: "mb-5 flex items-center justify-between" }, [createVNode("h2", { class: "text-lg font-bold" }, toDisplayString(editingTransaksi.value ? "Edit Transaksi" : "Tambah Transaksi Baru"), 1), createVNode("button", {
						class: "rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800",
						onClick: closeFormModal
					}, [createVNode(unref(X), { class: "h-5 w-5" })])]), createVNode("form", {
						class: "flex flex-col gap-4",
						onSubmit: withModifiers(submitForm, ["prevent"])
					}, [
						createVNode("div", { class: "grid grid-cols-2 gap-4" }, [createVNode("div", null, [
							createVNode("label", {
								class: "mb-1.5 block text-sm font-medium",
								for: "trx-kasir"
							}, " Kasir "),
							withDirectives(createVNode("select", {
								id: "trx-kasir",
								"onUpdate:modelValue": ($event) => unref(form).id_user = $event,
								class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.id_user }]
							}, [createVNode("option", { value: "" }, "Pilih kasir"), (openBlock(true), createBlock(Fragment, null, renderList(__props.kasirs, (kasir) => {
								return openBlock(), createBlock("option", {
									key: kasir.id,
									value: String(kasir.id)
								}, toDisplayString(kasir.name) + " (" + toDisplayString(kasir.role) + ") ", 9, ["value"]);
							}), 128))], 10, ["onUpdate:modelValue"]), [[vModelSelect, unref(form).id_user]]),
							unref(form).errors.id_user ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
							}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.id_user), 1)])) : createCommentVNode("", true)
						]), createVNode("div", null, [createVNode("label", {
							class: "mb-1.5 block text-sm font-medium",
							for: "trx-metode"
						}, " Metode Pembayaran "), withDirectives(createVNode("select", {
							id: "trx-metode",
							"onUpdate:modelValue": ($event) => unref(form).metode_pembayaran = $event,
							class: "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
						}, [
							createVNode("option", { value: "cash" }, "Tunai"),
							createVNode("option", { value: "qris" }, "QRIS"),
							createVNode("option", { value: "transfer" }, "Transfer")
						], 8, ["onUpdate:modelValue"]), [[vModelSelect, unref(form).metode_pembayaran]])])]),
						createVNode("div", null, [
							createVNode("div", { class: "mb-2 flex items-center justify-between" }, [createVNode("label", { class: "text-sm font-medium" }, "Item Produk"), createVNode("button", {
								type: "button",
								class: "inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-500",
								onClick: addItem
							}, [createVNode(unref(Plus), { class: "h-3 w-3" }), createTextVNode(" Tambah Item ")])]),
							unref(form).errors.items ? (openBlock(), createBlock("div", {
								key: 0,
								class: "mb-2 flex items-center gap-1 text-xs text-rose-600"
							}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.items), 1)])) : createCommentVNode("", true),
							createVNode("div", { class: "flex flex-col gap-2" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(form).items, (item, index) => {
								return openBlock(), createBlock("div", {
									key: index,
									class: "flex items-start gap-2 rounded-lg border border-sidebar-border/70 p-3 dark:border-sidebar-border"
								}, [
									createVNode("div", { class: "flex-1" }, [withDirectives(createVNode("select", {
										"onUpdate:modelValue": ($event) => item.id_produk = $event,
										class: "w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
									}, [createVNode("option", { value: "" }, "Pilih produk"), (openBlock(true), createBlock(Fragment, null, renderList(__props.produks, (produk) => {
										return openBlock(), createBlock("option", {
											key: produk.id_produk,
											value: String(produk.id_produk)
										}, toDisplayString(produk.nama) + " — " + toDisplayString(unref(formatRupiah)(produk.harga_jual)) + " (stok: " + toDisplayString(produk.stok) + ") ", 9, ["value"]);
									}), 128))], 8, ["onUpdate:modelValue"]), [[vModelSelect, item.id_produk]])]),
									createVNode("div", { class: "w-24" }, [withDirectives(createVNode("input", {
										"onUpdate:modelValue": ($event) => item.jumlah = $event,
										type: "number",
										min: "1",
										max: getProdukStok(item.id_produk) || void 0,
										placeholder: "Qty",
										class: "w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
									}, null, 8, ["onUpdate:modelValue", "max"]), [[vModelText, item.jumlah]])]),
									createVNode("div", { class: "w-28 pt-2 text-right text-sm font-medium" }, toDisplayString(item.id_produk && item.jumlah ? unref(formatRupiah)(getProdukHarga(item.id_produk) * Number(item.jumlah)) : "-"), 1),
									createVNode("button", {
										type: "button",
										class: ["mt-1.5 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800", { "opacity-40": unref(form).items.length <= 1 }],
										disabled: unref(form).items.length <= 1,
										onClick: ($event) => removeItem(index)
									}, [createVNode(unref(Minus), { class: "h-4 w-4" })], 10, ["disabled", "onClick"])
								]);
							}), 128))])
						]),
						createVNode("div", { class: "rounded-lg border border-sidebar-border/70 bg-slate-50/50 p-4 dark:border-sidebar-border dark:bg-zinc-800/20" }, [createVNode("div", { class: "flex justify-between text-sm" }, [createVNode("span", { class: "text-muted-foreground" }, "Total"), createVNode("span", { class: "font-bold" }, toDisplayString(unref(formatRupiah)(computedTotal.value)), 1)]), createVNode("div", { class: "mt-2 flex justify-between text-sm" }, [createVNode("span", { class: "text-muted-foreground" }, "Kembalian"), createVNode("span", { class: "font-semibold text-emerald-600" }, toDisplayString(unref(formatRupiah)(computedKembalian.value)), 1)])]),
						createVNode("div", null, [
							createVNode("label", {
								class: "mb-1.5 block text-sm font-medium",
								for: "trx-bayar"
							}, " Jumlah Bayar (Rp) "),
							withDirectives(createVNode("input", {
								id: "trx-bayar",
								"onUpdate:modelValue": ($event) => unref(form).bayar = $event,
								type: "number",
								min: "0",
								placeholder: "0",
								class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.bayar }]
							}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).bayar]]),
							unref(form).errors.bayar ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
							}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.bayar), 1)])) : createCommentVNode("", true)
						]),
						createVNode("div", { class: "flex justify-end gap-3 pt-2" }, [createVNode("button", {
							type: "button",
							class: "rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40",
							onClick: closeFormModal
						}, " Batal "), createVNode("button", {
							type: "submit",
							class: "inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60",
							disabled: unref(form).processing
						}, [createVNode(unref(Save), { class: "h-4 w-4" }), createTextVNode(" " + toDisplayString(unref(form).processing ? "Menyimpan..." : editingTransaksi.value ? "Simpan Perubahan" : "Simpan Transaksi"), 1)], 8, ["disabled"])])
					], 32)])])) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/Transactions.vue
var _sfc_setup = Transactions_vue_vue_type_script_setup_true_lang_default.setup;
Transactions_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/Transactions.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Transactions_default = Transactions_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Transactions_default as default };

//# sourceMappingURL=Transactions-DlSPjpF5.js.map