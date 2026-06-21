import { n as queryParams } from "./wayfinder-BrhwLpUM.js";
import { n as formatRupiah } from "./format-Cs1IUSJx.js";
import { t as transaksi$1 } from "./transaksi-BRFObyvO.js";
import { Head, Link, useForm, usePage } from "@inertiajs/vue3";
import { computed, createBlock, createTextVNode, createVNode, defineComponent, openBlock, ref, resolveDynamicComponent, toDisplayString, unref, useSSRContext, withCtx } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderVNode } from "vue/server-renderer";
import { AlertTriangle, Banknote, CalendarDays, CheckCircle, ChevronLeft, ChevronRight, Clock, CreditCard, DollarSign, FileText, PackageX, PlusCircle, QrCode, Search, ShoppingBag, Tag, Target, Trophy, Wallet } from "lucide-vue-next";
//#region resources/js/routes/kasir/pelanggan/index.ts
/**
* @see \App\Http\Controllers\KasirController::cari
* @see app/Http/Controllers/KasirController.php:283
* @route '/kasir/pelanggan/cari'
*/
var cari = (options) => ({
	url: cari.url(options),
	method: "get"
});
cari.definition = {
	methods: ["get", "head"],
	url: "/kasir/pelanggan/cari"
};
/**
* @see \App\Http\Controllers\KasirController::cari
* @see app/Http/Controllers/KasirController.php:283
* @route '/kasir/pelanggan/cari'
*/
cari.url = (options) => {
	return cari.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\KasirController::cari
* @see app/Http/Controllers/KasirController.php:283
* @route '/kasir/pelanggan/cari'
*/
cari.get = (options) => ({
	url: cari.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\KasirController::cari
* @see app/Http/Controllers/KasirController.php:283
* @route '/kasir/pelanggan/cari'
*/
cari.head = (options) => ({
	url: cari.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\KasirController::cari
* @see app/Http/Controllers/KasirController.php:283
* @route '/kasir/pelanggan/cari'
*/
var cariForm = (options) => ({
	action: cari.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\KasirController::cari
* @see app/Http/Controllers/KasirController.php:283
* @route '/kasir/pelanggan/cari'
*/
cariForm.get = (options) => ({
	action: cari.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\KasirController::cari
* @see app/Http/Controllers/KasirController.php:283
* @route '/kasir/pelanggan/cari'
*/
cariForm.head = (options) => ({
	action: cari.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
cari.form = cariForm;
var pelanggan = { cari: Object.assign(cari, cari) };
//#endregion
//#region resources/js/routes/kasir/riwayat/index.ts
/**
* @see \App\Http\Controllers\KasirController::cetak
* @see app/Http/Controllers/KasirController.php:603
* @route '/kasir/riwayat/cetak'
*/
var cetak = (options) => ({
	url: cetak.url(options),
	method: "get"
});
cetak.definition = {
	methods: ["get", "head"],
	url: "/kasir/riwayat/cetak"
};
/**
* @see \App\Http\Controllers\KasirController::cetak
* @see app/Http/Controllers/KasirController.php:603
* @route '/kasir/riwayat/cetak'
*/
cetak.url = (options) => {
	return cetak.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\KasirController::cetak
* @see app/Http/Controllers/KasirController.php:603
* @route '/kasir/riwayat/cetak'
*/
cetak.get = (options) => ({
	url: cetak.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\KasirController::cetak
* @see app/Http/Controllers/KasirController.php:603
* @route '/kasir/riwayat/cetak'
*/
cetak.head = (options) => ({
	url: cetak.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\KasirController::cetak
* @see app/Http/Controllers/KasirController.php:603
* @route '/kasir/riwayat/cetak'
*/
var cetakForm = (options) => ({
	action: cetak.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\KasirController::cetak
* @see app/Http/Controllers/KasirController.php:603
* @route '/kasir/riwayat/cetak'
*/
cetakForm.get = (options) => ({
	action: cetak.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\KasirController::cetak
* @see app/Http/Controllers/KasirController.php:603
* @route '/kasir/riwayat/cetak'
*/
cetakForm.head = (options) => ({
	action: cetak.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
cetak.form = cetakForm;
var riwayat$1 = { cetak: Object.assign(cetak, cetak) };
//#endregion
//#region resources/js/routes/kasir/index.ts
/**
* @see \App\Http\Controllers\KasirController::dashboard
* @see app/Http/Controllers/KasirController.php:34
* @route '/kasir/dashboard'
*/
var dashboard = (options) => ({
	url: dashboard.url(options),
	method: "get"
});
dashboard.definition = {
	methods: ["get", "head"],
	url: "/kasir/dashboard"
};
/**
* @see \App\Http\Controllers\KasirController::dashboard
* @see app/Http/Controllers/KasirController.php:34
* @route '/kasir/dashboard'
*/
dashboard.url = (options) => {
	return dashboard.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\KasirController::dashboard
* @see app/Http/Controllers/KasirController.php:34
* @route '/kasir/dashboard'
*/
dashboard.get = (options) => ({
	url: dashboard.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\KasirController::dashboard
* @see app/Http/Controllers/KasirController.php:34
* @route '/kasir/dashboard'
*/
dashboard.head = (options) => ({
	url: dashboard.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\KasirController::dashboard
* @see app/Http/Controllers/KasirController.php:34
* @route '/kasir/dashboard'
*/
var dashboardForm = (options) => ({
	action: dashboard.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\KasirController::dashboard
* @see app/Http/Controllers/KasirController.php:34
* @route '/kasir/dashboard'
*/
dashboardForm.get = (options) => ({
	action: dashboard.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\KasirController::dashboard
* @see app/Http/Controllers/KasirController.php:34
* @route '/kasir/dashboard'
*/
dashboardForm.head = (options) => ({
	action: dashboard.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
dashboard.form = dashboardForm;
/**
* @see \App\Http\Controllers\KasirController::transaksi
* @see app/Http/Controllers/KasirController.php:212
* @route '/kasir/transaksi'
*/
var transaksi = (options) => ({
	url: transaksi.url(options),
	method: "get"
});
transaksi.definition = {
	methods: ["get", "head"],
	url: "/kasir/transaksi"
};
/**
* @see \App\Http\Controllers\KasirController::transaksi
* @see app/Http/Controllers/KasirController.php:212
* @route '/kasir/transaksi'
*/
transaksi.url = (options) => {
	return transaksi.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\KasirController::transaksi
* @see app/Http/Controllers/KasirController.php:212
* @route '/kasir/transaksi'
*/
transaksi.get = (options) => ({
	url: transaksi.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\KasirController::transaksi
* @see app/Http/Controllers/KasirController.php:212
* @route '/kasir/transaksi'
*/
transaksi.head = (options) => ({
	url: transaksi.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\KasirController::transaksi
* @see app/Http/Controllers/KasirController.php:212
* @route '/kasir/transaksi'
*/
var transaksiForm = (options) => ({
	action: transaksi.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\KasirController::transaksi
* @see app/Http/Controllers/KasirController.php:212
* @route '/kasir/transaksi'
*/
transaksiForm.get = (options) => ({
	action: transaksi.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\KasirController::transaksi
* @see app/Http/Controllers/KasirController.php:212
* @route '/kasir/transaksi'
*/
transaksiForm.head = (options) => ({
	action: transaksi.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
transaksi.form = transaksiForm;
/**
* @see \App\Http\Controllers\KasirController::riwayat
* @see app/Http/Controllers/KasirController.php:561
* @route '/kasir/riwayat'
*/
var riwayat = (options) => ({
	url: riwayat.url(options),
	method: "get"
});
riwayat.definition = {
	methods: ["get", "head"],
	url: "/kasir/riwayat"
};
/**
* @see \App\Http\Controllers\KasirController::riwayat
* @see app/Http/Controllers/KasirController.php:561
* @route '/kasir/riwayat'
*/
riwayat.url = (options) => {
	return riwayat.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\KasirController::riwayat
* @see app/Http/Controllers/KasirController.php:561
* @route '/kasir/riwayat'
*/
riwayat.get = (options) => ({
	url: riwayat.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\KasirController::riwayat
* @see app/Http/Controllers/KasirController.php:561
* @route '/kasir/riwayat'
*/
riwayat.head = (options) => ({
	url: riwayat.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\KasirController::riwayat
* @see app/Http/Controllers/KasirController.php:561
* @route '/kasir/riwayat'
*/
var riwayatForm = (options) => ({
	action: riwayat.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\KasirController::riwayat
* @see app/Http/Controllers/KasirController.php:561
* @route '/kasir/riwayat'
*/
riwayatForm.get = (options) => ({
	action: riwayat.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\KasirController::riwayat
* @see app/Http/Controllers/KasirController.php:561
* @route '/kasir/riwayat'
*/
riwayatForm.head = (options) => ({
	action: riwayat.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
riwayat.form = riwayatForm;
Object.assign(dashboard, dashboard), Object.assign(transaksi, transaksi$1), Object.assign(pelanggan, pelanggan), Object.assign(riwayat, riwayat$1);
//#endregion
//#region resources/js/pages/kasir/Dashboard.vue?vue&type=script&setup=true&lang.ts
var Dashboard_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Kasir Dashboard",
		href: "/kasir/dashboard"
	}] },
	__name: "Dashboard",
	__ssrInlineRender: true,
	props: {
		today_sales: {},
		range_sales: {},
		date_range: {},
		recent_transactions: {},
		payment_breakdown: {},
		low_stock: {},
		low_stock_count: {},
		active_promos: {},
		best_sellers: {},
		target: {}
	},
	setup(__props) {
		const props = __props;
		const form = useForm({
			start_date: props.date_range.start_date,
			end_date: props.date_range.end_date
		});
		const page = usePage();
		const firstName = computed(() => {
			return (page.props.auth.user?.name ?? "").trim().split(" ")[0] || "Kasir";
		});
		const showDateFilter = ref(false);
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
		const filterYear = ref(props.date_range.start_date ? (/* @__PURE__ */ new Date(props.date_range.start_date + "T00:00:00")).getFullYear() : (/* @__PURE__ */ new Date()).getFullYear());
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
			return props.date_range.label;
		});
		const stats = computed(() => [
			{
				name: "Penjualan Hari Ini",
				value: formatRupiah(props.today_sales.total_revenue),
				icon: DollarSign,
				color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
			},
			{
				name: "Transaksi Hari Ini",
				value: `${props.today_sales.total_transactions} Transaksi`,
				icon: ShoppingBag,
				color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
			},
			{
				name: "Penjualan Rentang",
				value: formatRupiah(props.range_sales.total_revenue),
				icon: Wallet,
				color: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20"
			},
			{
				name: "Transaksi Rentang",
				value: `${props.range_sales.total_transactions} Transaksi`,
				icon: FileText,
				color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
			}
		]);
		const todayAvg = computed(() => props.today_sales.total_transactions > 0 ? Math.round(props.today_sales.total_revenue / props.today_sales.total_transactions) : 0);
		const cashTotal = computed(() => props.payment_breakdown.find((p) => p.metode === "cash")?.total ?? 0);
		const paymentMeta = {
			cash: {
				label: "Tunai",
				icon: Banknote,
				color: "text-emerald-600 dark:text-emerald-400"
			},
			qris: {
				label: "QRIS",
				icon: QrCode,
				color: "text-indigo-600 dark:text-indigo-400"
			},
			transfer: {
				label: "Transfer",
				icon: CreditCard,
				color: "text-amber-600 dark:text-amber-400"
			}
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Kasir Dashboard" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-5 overflow-x-hidden rounded-xl p-4 md:gap-6 md:p-6"><div class="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-900 to-teal-950 p-5 text-white shadow-xl md:p-6 dark:from-zinc-950 dark:to-neutral-900"><div class="relative z-10 flex flex-col gap-2"><span class="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">`);
			_push(ssrRenderComponent(unref(CheckCircle), { class: "h-3.5 w-3.5 animate-pulse" }, null, _parent));
			_push(` Sesi Kasir Aktif </span><h1 class="text-2xl font-extrabold tracking-tight md:text-3xl">Selamat Bekerja, ${ssrInterpolate(firstName.value)}!</h1><p class="hidden max-w-xl text-sm text-slate-300 sm:block"> Sistem siap melayani. Mulai transaksi baru dengan cepat menggunakan tombol pintasan di bawah untuk mengoptimalkan pelayanan pelanggan. </p></div><div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"></div><div class="absolute right-20 bottom-0 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl"></div></div><div class="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">`);
			_push(ssrRenderComponent(unref(Link), {
				href: unref(transaksi).url(),
				class: "col-span-2 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-left text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] md:col-span-1 md:p-5"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="shrink-0 rounded-xl bg-white/20 p-3 backdrop-blur-sm"${_scopeId}>`);
						_push(ssrRenderComponent(unref(PlusCircle), { class: "h-6 w-6" }, null, _parent, _scopeId));
						_push(`</div><div class="min-w-0"${_scopeId}><h3 class="font-bold"${_scopeId}>Transaksi Baru</h3><p class="truncate text-xs text-emerald-50/90"${_scopeId}>Buka keranjang penjualan</p></div>`);
					} else return [createVNode("div", { class: "shrink-0 rounded-xl bg-white/20 p-3 backdrop-blur-sm" }, [createVNode(unref(PlusCircle), { class: "h-6 w-6" })]), createVNode("div", { class: "min-w-0" }, [createVNode("h3", { class: "font-bold" }, "Transaksi Baru"), createVNode("p", { class: "truncate text-xs text-emerald-50/90" }, "Buka keranjang penjualan")])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(Link), {
				href: unref(transaksi).url(),
				class: "flex flex-col items-start gap-2 rounded-2xl border border-sidebar-border/70 bg-card p-4 text-left transition-all hover:bg-slate-50 active:scale-[0.98] md:flex-row md:items-center md:gap-4 md:p-5 dark:border-sidebar-border dark:hover:bg-zinc-800/50"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="shrink-0 rounded-xl bg-slate-100 p-2.5 text-foreground md:rounded-full md:p-3 dark:bg-zinc-800"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Search), { class: "h-5 w-5 md:h-6 md:w-6" }, null, _parent, _scopeId));
						_push(`</div><div class="min-w-0"${_scopeId}><h3 class="text-sm font-bold md:text-base"${_scopeId}>Cek Stok &amp; Harga</h3><p class="hidden text-xs text-muted-foreground sm:block"${_scopeId}>Cari produk &amp; ketersediaan</p></div>`);
					} else return [createVNode("div", { class: "shrink-0 rounded-xl bg-slate-100 p-2.5 text-foreground md:rounded-full md:p-3 dark:bg-zinc-800" }, [createVNode(unref(Search), { class: "h-5 w-5 md:h-6 md:w-6" })]), createVNode("div", { class: "min-w-0" }, [createVNode("h3", { class: "text-sm font-bold md:text-base" }, "Cek Stok & Harga"), createVNode("p", { class: "hidden text-xs text-muted-foreground sm:block" }, "Cari produk & ketersediaan")])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(Link), {
				href: unref(riwayat).url(),
				class: "flex flex-col items-start gap-2 rounded-2xl border border-sidebar-border/70 bg-card p-4 text-left transition-all hover:bg-slate-50 active:scale-[0.98] md:flex-row md:items-center md:gap-4 md:p-5 dark:border-sidebar-border dark:hover:bg-zinc-800/50"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="shrink-0 rounded-xl bg-slate-100 p-2.5 text-foreground md:rounded-full md:p-3 dark:bg-zinc-800"${_scopeId}>`);
						_push(ssrRenderComponent(unref(FileText), { class: "h-5 w-5 md:h-6 md:w-6" }, null, _parent, _scopeId));
						_push(`</div><div class="min-w-0"${_scopeId}><h3 class="text-sm font-bold md:text-base"${_scopeId}>Riwayat Transaksi</h3><p class="hidden text-xs text-muted-foreground sm:block"${_scopeId}>Cetak ulang struk / penjualan</p></div>`);
					} else return [createVNode("div", { class: "shrink-0 rounded-xl bg-slate-100 p-2.5 text-foreground md:rounded-full md:p-3 dark:bg-zinc-800" }, [createVNode(unref(FileText), { class: "h-5 w-5 md:h-6 md:w-6" })]), createVNode("div", { class: "min-w-0" }, [createVNode("h3", { class: "text-sm font-bold md:text-base" }, "Riwayat Transaksi"), createVNode("p", { class: "hidden text-xs text-muted-foreground sm:block" }, "Cetak ulang struk / penjualan")])];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 class="text-lg font-bold tracking-tight">Ringkasan Penjualan</h2><p class="text-sm text-muted-foreground">Periode: ${ssrInterpolate(periodLabel.value)}</p></div><div class="relative w-fit"><button type="button" class="${ssrRenderClass([showDateFilter.value ? "border-emerald-500 bg-emerald-50 text-emerald-600 dark:border-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400" : "border-sidebar-border/70 bg-background text-slate-600 hover:bg-slate-50 dark:border-sidebar-border dark:text-slate-300 dark:hover:bg-zinc-800", "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition"])}">`);
			_push(ssrRenderComponent(unref(CalendarDays), { class: "h-4 w-4" }, null, _parent));
			_push(` Periode <span class="ml-0.5 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">${ssrInterpolate(periodLabel.value)}</span></button>`);
			if (showDateFilter.value) {
				_push(`<div class="absolute left-0 top-11 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:left-auto sm:right-0 dark:border-zinc-700 dark:bg-zinc-900"><button type="button" class="${ssrRenderClass([selectedDateMode.value === "today" ? "bg-emerald-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "mb-3 w-full rounded-lg py-2 text-xs font-semibold transition-all"])}"> Hari Ini </button><div class="flex items-center gap-0.5"><button type="button" class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800 dark:hover:text-slate-300">`);
				_push(ssrRenderComponent(unref(ChevronLeft), { class: "h-4 w-4" }, null, _parent));
				_push(`</button><span class="flex-1 text-center text-sm font-bold text-slate-800 dark:text-slate-100">${ssrInterpolate(filterYear.value)}</span><button type="button" class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800 dark:hover:text-slate-300">`);
				_push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4" }, null, _parent));
				_push(`</button></div><div class="mt-3 grid grid-cols-4 gap-1"><!--[-->`);
				ssrRenderList(MONTHS, (month, i) => {
					_push(`<button type="button" class="${ssrRenderClass([selectedDateMode.value === String(i) ? "bg-emerald-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "rounded-lg py-2 text-xs font-semibold transition-all"])}">${ssrInterpolate(month)}</button>`);
				});
				_push(`<!--]--><button type="button" class="${ssrRenderClass([selectedDateMode.value === "year" ? "bg-emerald-500 text-white" : "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10", "col-span-4 rounded-lg py-2 text-xs font-semibold transition-all"])}"> Setahun Penuh (${ssrInterpolate(filterYear.value)}) </button><button type="button" class="${ssrRenderClass([selectedDateMode.value === "custom" ? "bg-emerald-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "col-span-4 rounded-lg py-2 text-xs font-semibold transition-all"])}"> Custom </button></div>`);
				if (selectedDateMode.value === "custom") {
					_push(`<div class="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-zinc-800"><div class="grid grid-cols-2 gap-2"><label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"> Mulai <input${ssrRenderAttr("value", unref(form).start_date)} type="date" class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-emerald-500/20"></label><label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"> Sampai <input${ssrRenderAttr("value", unref(form).end_date)} type="date" class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-emerald-500/20"></label></div><button type="button" class="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-500 text-xs font-semibold text-white transition hover:bg-emerald-600">`);
					_push(ssrRenderComponent(unref(CalendarDays), { class: "h-3 w-3" }, null, _parent));
					_push(` Terapkan </button></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div></div>`);
			if (showDateFilter.value) _push(`<div class="fixed inset-0 z-40"></div>`);
			else _push(`<!---->`);
			_push(`<div class="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4"><!--[-->`);
			ssrRenderList(stats.value, (stat) => {
				_push(`<div class="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-4 shadow-sm md:p-6 dark:border-sidebar-border"><div class="flex items-start justify-between gap-2"><span class="text-xs font-medium text-muted-foreground md:text-sm">${ssrInterpolate(stat.name)}</span><div class="${ssrRenderClass(["shrink-0 rounded-lg border p-1.5 md:p-2", stat.color])}">`);
				ssrRenderVNode(_push, createVNode(resolveDynamicComponent(stat.icon), { class: "h-4 w-4 md:h-5 md:w-5" }, null), _parent);
				_push(`</div></div><div class="mt-3 md:mt-4"><span class="block truncate text-lg font-bold tracking-tight tabular-nums md:text-2xl">${ssrInterpolate(stat.value)}</span></div></div>`);
			});
			_push(`<!--]--></div><div class="rounded-xl border border-sidebar-border/70 bg-card p-4 md:p-6 dark:border-sidebar-border"><div class="flex items-center justify-between gap-3 mb-3"><div class="flex items-center gap-2 min-w-0"><div class="shrink-0 rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">`);
			_push(ssrRenderComponent(unref(Target), { class: "h-5 w-5" }, null, _parent));
			_push(`</div><div class="min-w-0"><h2 class="text-base font-bold tracking-tight md:text-lg">Target Penjualan Hari Ini</h2><p class="truncate text-xs text-muted-foreground">${ssrInterpolate(unref(formatRupiah)(props.target.tercapai))} dari ${ssrInterpolate(unref(formatRupiah)(props.target.harian))}</p></div></div><span class="shrink-0 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">${ssrInterpolate(props.target.persen)}%</span></div><div class="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800"><div class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" style="${ssrRenderStyle({ width: props.target.persen + "%" })}"></div></div>`);
			if (props.target.persen >= 100) _push(`<p class="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400"> 🎉 Target tercapai. Mantap, pertahankan! </p>`);
			else _push(`<p class="mt-2 text-xs text-muted-foreground"> Kurang ${ssrInterpolate(unref(formatRupiah)(Math.max(0, props.target.harian - props.target.tercapai)))} lagi untuk capai target. </p>`);
			_push(`</div><div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6"><div class="rounded-xl border border-sidebar-border/70 bg-card p-4 md:col-span-2 md:p-6 dark:border-sidebar-border"><div class="flex items-center justify-between border-b border-sidebar-border/70 pb-4 mb-4 dark:border-sidebar-border"><div><h2 class="text-lg font-bold tracking-tight">Transaksi Terakhir Saya</h2><p class="text-xs text-muted-foreground">Daftar transaksi yang baru saja diselesaikan</p></div>`);
			_push(ssrRenderComponent(unref(Link), {
				href: unref(riwayat).url(),
				class: "text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Lihat semua `);
					else return [createTextVNode(" Lihat semua ")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (props.recent_transactions.length) {
				_push(`<div class="space-y-2"><!--[-->`);
				ssrRenderList(props.recent_transactions, (trx) => {
					_push(ssrRenderComponent(unref(Link), {
						key: trx.id_transaksi,
						href: unref(riwayat).url({ query: { search: trx.kode } }),
						title: `Lihat detail ${trx.kode} di Riwayat`,
						class: "group flex items-center justify-between gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50 active:scale-[0.99] dark:hover:bg-zinc-800/40"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex min-w-0 items-center gap-3"${_scopeId}><div class="shrink-0 rounded-full bg-emerald-500/10 p-2 text-emerald-600"${_scopeId}>`);
								_push(ssrRenderComponent(unref(Clock), { class: "h-4 w-4" }, null, _parent, _scopeId));
								_push(`</div><div class="min-w-0"${_scopeId}><p class="text-sm font-bold text-indigo-600 dark:text-indigo-400"${_scopeId}>#${ssrInterpolate(trx.kode)}</p><p class="truncate text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(trx.items)} item • Pukul ${ssrInterpolate(trx.waktu)}</p></div></div><div class="flex shrink-0 items-center gap-2"${_scopeId}><div class="text-right"${_scopeId}><p class="text-sm font-bold text-slate-900 dark:text-slate-100"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(trx.total_harga))}</p><span class="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"${_scopeId}>${ssrInterpolate(trx.status)}</span></div>`);
								_push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400" }, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [createVNode("div", { class: "flex min-w-0 items-center gap-3" }, [createVNode("div", { class: "shrink-0 rounded-full bg-emerald-500/10 p-2 text-emerald-600" }, [createVNode(unref(Clock), { class: "h-4 w-4" })]), createVNode("div", { class: "min-w-0" }, [createVNode("p", { class: "text-sm font-bold text-indigo-600 dark:text-indigo-400" }, "#" + toDisplayString(trx.kode), 1), createVNode("p", { class: "truncate text-xs text-muted-foreground" }, toDisplayString(trx.items) + " item • Pukul " + toDisplayString(trx.waktu), 1)])]), createVNode("div", { class: "flex shrink-0 items-center gap-2" }, [createVNode("div", { class: "text-right" }, [createVNode("p", { class: "text-sm font-bold text-slate-900 dark:text-slate-100" }, toDisplayString(unref(formatRupiah)(trx.total_harga)), 1), createVNode("span", { class: "inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400" }, toDisplayString(trx.status), 1)]), createVNode(unref(ChevronRight), { class: "h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400" })])];
						}),
						_: 2
					}, _parent));
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="flex flex-col items-center justify-center gap-2 py-10 text-center">`);
				_push(ssrRenderComponent(unref(ShoppingBag), { class: "h-8 w-8 text-muted-foreground/40" }, null, _parent));
				_push(`<p class="text-sm text-muted-foreground">Belum ada transaksi. Mulai transaksi pertamamu!</p></div>`);
			}
			_push(`</div><div class="rounded-xl border border-sidebar-border/70 bg-card p-4 md:p-6 dark:border-sidebar-border"><h2 class="text-lg font-bold tracking-tight border-b border-sidebar-border/70 pb-4 mb-4 dark:border-sidebar-border">Ringkasan Hari Ini</h2><div class="space-y-4 text-sm"><div class="flex justify-between border-b border-sidebar-border/40 pb-2 dark:border-sidebar-border/40"><span class="text-muted-foreground">Total Item Terjual</span><span class="font-semibold">${ssrInterpolate(props.today_sales.total_items)} item</span></div><div class="flex justify-between border-b border-sidebar-border/40 pb-2 dark:border-sidebar-border/40"><span class="text-muted-foreground">Jumlah Transaksi</span><span class="font-semibold">${ssrInterpolate(props.today_sales.total_transactions)} transaksi</span></div><div class="flex justify-between border-b border-sidebar-border/40 pb-2 dark:border-sidebar-border/40"><span class="text-muted-foreground">Rata-rata / Transaksi</span><span class="font-semibold">${ssrInterpolate(unref(formatRupiah)(todayAvg.value))}</span></div><div class="pt-1"><p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Rincian Pembayaran</p><div class="space-y-2"><!--[-->`);
			ssrRenderList(props.payment_breakdown, (pay) => {
				_push(`<div class="flex items-center justify-between"><span class="flex items-center gap-2">`);
				ssrRenderVNode(_push, createVNode(resolveDynamicComponent(paymentMeta[pay.metode].icon), { class: ["h-4 w-4", paymentMeta[pay.metode].color] }, null), _parent);
				_push(`<span>${ssrInterpolate(paymentMeta[pay.metode].label)}</span><span class="text-xs text-muted-foreground">(${ssrInterpolate(pay.jumlah)})</span></span><span class="font-semibold">${ssrInterpolate(unref(formatRupiah)(pay.total))}</span></div>`);
			});
			_push(`<!--]--></div></div><div class="mt-2 rounded-lg bg-emerald-500/10 p-3 border border-emerald-500/20"><p class="text-xs text-muted-foreground">Uang tunai di laci (seharusnya)</p><p class="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">${ssrInterpolate(unref(formatRupiah)(cashTotal.value))}</p></div></div></div></div><div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6"><div class="rounded-xl border border-sidebar-border/70 bg-card p-4 md:p-6 dark:border-sidebar-border"><div class="flex items-center justify-between border-b border-sidebar-border/70 pb-4 mb-4 dark:border-sidebar-border"><div class="flex items-center gap-2"><div class="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400 border border-amber-500/20">`);
			_push(ssrRenderComponent(unref(AlertTriangle), { class: "h-5 w-5" }, null, _parent));
			_push(`</div><h2 class="text-base font-bold tracking-tight">Stok Menipis</h2></div>`);
			if (props.low_stock_count) _push(`<span class="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">${ssrInterpolate(props.low_stock_count)}</span>`);
			else _push(`<!---->`);
			_push(`</div>`);
			if (props.low_stock.length) {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(props.low_stock, (item) => {
					_push(`<div class="flex items-center justify-between gap-3"><div class="flex items-center gap-3 min-w-0">`);
					if (item.foto_url) _push(`<img${ssrRenderAttr("src", item.foto_url)}${ssrRenderAttr("alt", item.nama)} class="h-9 w-9 rounded-md object-cover border border-sidebar-border/70">`);
					else {
						_push(`<div class="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 dark:bg-zinc-800 text-muted-foreground">`);
						_push(ssrRenderComponent(unref(PackageX), { class: "h-4 w-4" }, null, _parent));
						_push(`</div>`);
					}
					_push(`<p class="truncate text-sm font-medium">${ssrInterpolate(item.nama)}</p></div>`);
					if (item.status === "out-of-stock") _push(`<span class="shrink-0 inline-flex items-center rounded-full bg-red-100 dark:bg-red-950 px-2 py-0.5 text-xs font-bold text-red-700 dark:text-red-300"> Habis </span>`);
					else _push(`<span class="shrink-0 inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-950 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300"> Sisa ${ssrInterpolate(item.stok)}</span>`);
					_push(`</div>`);
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="flex flex-col items-center justify-center gap-2 py-8 text-center">`);
				_push(ssrRenderComponent(unref(CheckCircle), { class: "h-8 w-8 text-emerald-500/50" }, null, _parent));
				_push(`<p class="text-sm text-muted-foreground">Semua stok aman 👍</p></div>`);
			}
			_push(`</div><div class="rounded-xl border border-sidebar-border/70 bg-card p-4 md:p-6 dark:border-sidebar-border"><div class="flex items-center justify-between gap-2 border-b border-sidebar-border/70 pb-4 mb-4 dark:border-sidebar-border"><div class="flex items-center gap-2"><div class="rounded-lg bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">`);
			_push(ssrRenderComponent(unref(Tag), { class: "h-5 w-5" }, null, _parent));
			_push(`</div><h2 class="text-base font-bold tracking-tight">Promo Hari Ini</h2></div>`);
			if (props.active_promos.length) _push(`<span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><span class="relative flex h-2 w-2"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span></span> ${ssrInterpolate(props.active_promos.length)} berlaku </span>`);
			else _push(`<!---->`);
			_push(`</div>`);
			if (props.active_promos.length) {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(props.active_promos, (promo) => {
					_push(`<div class="${ssrRenderClass(["rounded-lg border p-3 transition", promo.berakhir_hari_ini ? "border-rose-400/50 bg-rose-500/5" : "border-indigo-500/20 bg-indigo-500/5"])}"><div class="flex items-start justify-between gap-2"><div class="min-w-0"><p class="truncate text-sm font-bold text-indigo-700 dark:text-indigo-300">${ssrInterpolate(promo.nama)}</p>`);
					if (promo.deskripsi) _push(`<p class="truncate text-xs text-muted-foreground">${ssrInterpolate(promo.deskripsi)}</p>`);
					else _push(`<!---->`);
					_push(`</div><span class="shrink-0 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">${ssrInterpolate(promo.label)}</span></div><div class="mt-2 flex flex-wrap items-center gap-1.5"><span class="inline-flex items-center gap-1 rounded-md border border-sidebar-border/50 bg-background/60 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">`);
					_push(ssrRenderComponent(unref(ShoppingBag), { class: "h-3 w-3" }, null, _parent));
					_push(` ${ssrInterpolate(promo.target)}</span>`);
					if (promo.minimal_belanja) _push(`<span class="inline-flex items-center rounded-md border border-sidebar-border/50 bg-background/60 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"> Min. ${ssrInterpolate(unref(formatRupiah)(promo.minimal_belanja))}</span>`);
					else _push(`<!---->`);
					if (promo.berakhir_hari_ini) {
						_push(`<span class="inline-flex items-center gap-1 rounded-md bg-rose-100 px-1.5 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">`);
						_push(ssrRenderComponent(unref(Clock), { class: "h-3 w-3" }, null, _parent));
						_push(` Berakhir hari ini </span>`);
					} else if (promo.mulai_hari_ini) _push(`<span class="inline-flex items-center rounded-md bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"> Baru hari ini </span>`);
					else _push(`<span class="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground dark:bg-zinc-800"> Sisa ${ssrInterpolate(promo.sisa_hari)} hari </span>`);
					_push(`</div><p class="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">`);
					_push(ssrRenderComponent(unref(CalendarDays), { class: "h-3 w-3" }, null, _parent));
					_push(` ${ssrInterpolate(promo.periode)}</p></div>`);
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="flex flex-col items-center justify-center gap-2 py-8 text-center">`);
				_push(ssrRenderComponent(unref(Tag), { class: "h-8 w-8 text-muted-foreground/40" }, null, _parent));
				_push(`<p class="text-sm text-muted-foreground">Tidak ada promo berlaku hari ini.</p></div>`);
			}
			_push(`</div><div class="rounded-xl border border-sidebar-border/70 bg-card p-4 md:p-6 dark:border-sidebar-border"><div class="flex items-center gap-2 border-b border-sidebar-border/70 pb-4 mb-4 dark:border-sidebar-border"><div class="rounded-lg bg-yellow-500/10 p-2 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">`);
			_push(ssrRenderComponent(unref(Trophy), { class: "h-5 w-5" }, null, _parent));
			_push(`</div><h2 class="text-base font-bold tracking-tight">Produk Terlaris Saya</h2></div>`);
			if (props.best_sellers.length) {
				_push(`<div class="space-y-1"><!--[-->`);
				ssrRenderList(props.best_sellers, (item, index) => {
					_push(ssrRenderComponent(unref(Link), {
						key: item.id_produk,
						href: unref(transaksi).url({ query: { cari: item.nama } }),
						title: `Cari & jual ${item.nama} di Transaksi`,
						class: "group -mx-2 flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50 active:scale-[0.99] dark:hover:bg-zinc-800/40"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<span class="${ssrRenderClass(["flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold", index === 0 ? "bg-yellow-400 text-yellow-950" : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300"])}"${_scopeId}>${ssrInterpolate(index + 1)}</span>`);
								if (item.foto_url) _push(`<img${ssrRenderAttr("src", item.foto_url)}${ssrRenderAttr("alt", item.nama)} class="h-9 w-9 rounded-md object-cover border border-sidebar-border/70"${_scopeId}>`);
								else {
									_push(`<div class="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 dark:bg-zinc-800 text-muted-foreground"${_scopeId}>`);
									_push(ssrRenderComponent(unref(ShoppingBag), { class: "h-4 w-4" }, null, _parent, _scopeId));
									_push(`</div>`);
								}
								_push(`<p class="min-w-0 flex-1 truncate text-sm font-medium"${_scopeId}>${ssrInterpolate(item.nama)}</p><span class="shrink-0 text-sm font-bold text-emerald-600 dark:text-emerald-400"${_scopeId}>${ssrInterpolate(item.total_terjual)}x</span>`);
								_push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400" }, null, _parent, _scopeId));
							} else return [
								createVNode("span", { class: ["flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold", index === 0 ? "bg-yellow-400 text-yellow-950" : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300"] }, toDisplayString(index + 1), 3),
								item.foto_url ? (openBlock(), createBlock("img", {
									key: 0,
									src: item.foto_url,
									alt: item.nama,
									class: "h-9 w-9 rounded-md object-cover border border-sidebar-border/70"
								}, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
									key: 1,
									class: "flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 dark:bg-zinc-800 text-muted-foreground"
								}, [createVNode(unref(ShoppingBag), { class: "h-4 w-4" })])),
								createVNode("p", { class: "min-w-0 flex-1 truncate text-sm font-medium" }, toDisplayString(item.nama), 1),
								createVNode("span", { class: "shrink-0 text-sm font-bold text-emerald-600 dark:text-emerald-400" }, toDisplayString(item.total_terjual) + "x", 1),
								createVNode(unref(ChevronRight), { class: "h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400" })
							];
						}),
						_: 2
					}, _parent));
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="flex flex-col items-center justify-center gap-2 py-8 text-center">`);
				_push(ssrRenderComponent(unref(Trophy), { class: "h-8 w-8 text-muted-foreground/40" }, null, _parent));
				_push(`<p class="text-sm text-muted-foreground">Belum ada penjualan pada rentang ini.</p></div>`);
			}
			_push(`</div></div></div><!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/kasir/Dashboard.vue
var _sfc_setup = Dashboard_vue_vue_type_script_setup_true_lang_default.setup;
Dashboard_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/kasir/Dashboard.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Dashboard_default = Dashboard_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Dashboard_default as default };

//# sourceMappingURL=Dashboard-B2Qd4SkR2.js.map