import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-BrhwLpUM.js";
import { t as Pagination_default } from "./Pagination-CxLXQdL4.js";
import { t as usePagination } from "./usePagination-Dbv9f4fT.js";
import { Head, useForm } from "@inertiajs/vue3";
import { computed, defineComponent, ref, unref, useSSRContext, watch } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderTeleport } from "vue/server-renderer";
import { CalendarDays, ChevronLeft, ChevronRight, DollarSign, Edit, FileText, Plus, Save, Search, Trash2, X } from "lucide-vue-next";
//#region resources/js/routes/admin/pengeluarans/index.ts
/**
* @see \App\Http\Controllers\PengeluaranController::store
* @see app/Http/Controllers/PengeluaranController.php:53
* @route '/admin/pengeluarans'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/admin/pengeluarans"
};
/**
* @see \App\Http\Controllers\PengeluaranController::store
* @see app/Http/Controllers/PengeluaranController.php:53
* @route '/admin/pengeluarans'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\PengeluaranController::store
* @see app/Http/Controllers/PengeluaranController.php:53
* @route '/admin/pengeluarans'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\PengeluaranController::store
* @see app/Http/Controllers/PengeluaranController.php:53
* @route '/admin/pengeluarans'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\PengeluaranController::store
* @see app/Http/Controllers/PengeluaranController.php:53
* @route '/admin/pengeluarans'
*/
storeForm.post = (options) => ({
	action: store.url(options),
	method: "post"
});
store.form = storeForm;
/**
* @see \App\Http\Controllers\PengeluaranController::update
* @see app/Http/Controllers/PengeluaranController.php:70
* @route '/admin/pengeluarans/{pengeluaran}'
*/
var update = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
update.definition = {
	methods: ["put"],
	url: "/admin/pengeluarans/{pengeluaran}"
};
/**
* @see \App\Http\Controllers\PengeluaranController::update
* @see app/Http/Controllers/PengeluaranController.php:70
* @route '/admin/pengeluarans/{pengeluaran}'
*/
update.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { pengeluaran: args };
	if (typeof args === "object" && !Array.isArray(args) && "id_pengeluaran" in args) args = { pengeluaran: args.id_pengeluaran };
	if (Array.isArray(args)) args = { pengeluaran: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { pengeluaran: typeof args.pengeluaran === "object" ? args.pengeluaran.id_pengeluaran : args.pengeluaran };
	return update.definition.url.replace("{pengeluaran}", parsedArgs.pengeluaran.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\PengeluaranController::update
* @see app/Http/Controllers/PengeluaranController.php:70
* @route '/admin/pengeluarans/{pengeluaran}'
*/
update.put = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
/**
* @see \App\Http\Controllers\PengeluaranController::update
* @see app/Http/Controllers/PengeluaranController.php:70
* @route '/admin/pengeluarans/{pengeluaran}'
*/
var updateForm = (args, options) => ({
	action: update.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\PengeluaranController::update
* @see app/Http/Controllers/PengeluaranController.php:70
* @route '/admin/pengeluarans/{pengeluaran}'
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
* @see \App\Http\Controllers\PengeluaranController::destroy
* @see app/Http/Controllers/PengeluaranController.php:87
* @route '/admin/pengeluarans/{pengeluaran}'
*/
var destroy = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
destroy.definition = {
	methods: ["delete"],
	url: "/admin/pengeluarans/{pengeluaran}"
};
/**
* @see \App\Http\Controllers\PengeluaranController::destroy
* @see app/Http/Controllers/PengeluaranController.php:87
* @route '/admin/pengeluarans/{pengeluaran}'
*/
destroy.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { pengeluaran: args };
	if (typeof args === "object" && !Array.isArray(args) && "id_pengeluaran" in args) args = { pengeluaran: args.id_pengeluaran };
	if (Array.isArray(args)) args = { pengeluaran: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { pengeluaran: typeof args.pengeluaran === "object" ? args.pengeluaran.id_pengeluaran : args.pengeluaran };
	return destroy.definition.url.replace("{pengeluaran}", parsedArgs.pengeluaran.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\PengeluaranController::destroy
* @see app/Http/Controllers/PengeluaranController.php:87
* @route '/admin/pengeluarans/{pengeluaran}'
*/
destroy.delete = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\PengeluaranController::destroy
* @see app/Http/Controllers/PengeluaranController.php:87
* @route '/admin/pengeluarans/{pengeluaran}'
*/
var destroyForm = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\PengeluaranController::destroy
* @see app/Http/Controllers/PengeluaranController.php:87
* @route '/admin/pengeluarans/{pengeluaran}'
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
//#region resources/js/pages/admin/Pengeluarans.vue?vue&type=script&setup=true&lang.ts
var Pengeluarans_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Pengeluarans",
	__ssrInlineRender: true,
	props: {
		pengeluarans: {},
		stats: {},
		date_range: {}
	},
	setup(__props) {
		const props = __props;
		const tipeOptions = [
			{
				value: "bahan_baku",
				label: "Bahan Baku"
			},
			{
				value: "kemasan",
				label: "Kemasan"
			},
			{
				value: "operasional",
				label: "Operasional"
			},
			{
				value: "transportasi",
				label: "Transportasi"
			},
			{
				value: "gaji",
				label: "Gaji"
			},
			{
				value: "peralatan",
				label: "Peralatan"
			},
			{
				value: "sewa",
				label: "Sewa"
			},
			{
				value: "listrik_air",
				label: "Listrik & Air"
			},
			{
				value: "promosi",
				label: "Promosi"
			},
			{
				value: "pajak",
				label: "Pajak"
			},
			{
				value: "lainnya",
				label: "Lainnya"
			}
		];
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
		const showDateFilter = ref(false);
		const filterYear = ref(props.date_range.start_date ? (/* @__PURE__ */ new Date(props.date_range.start_date + "T00:00:00")).getFullYear() : (/* @__PURE__ */ new Date()).getFullYear());
		const dateStartDate = ref(props.date_range.start_date);
		const dateEndDate = ref(props.date_range.end_date);
		function detectDateMode() {
			const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			if (props.date_range.start_date === today && props.date_range.end_date === today) return "today";
			for (let m = 0; m < 12; m++) {
				const range = getMonthRange(filterYear.value, m);
				if (range.start === props.date_range.start_date && range.end === props.date_range.end_date) return String(m);
			}
			return "custom";
		}
		const selectedDateMode = ref(detectDateMode());
		const periodLabel = computed(() => {
			if (selectedDateMode.value === "today") return "Hari Ini";
			if (selectedDateMode.value !== "custom") return `${MONTHS[Number(selectedDateMode.value)]} ${filterYear.value}`;
			return props.date_range.start_date === props.date_range.end_date ? props.date_range.start_date : `${props.date_range.start_date} – ${props.date_range.end_date}`;
		});
		const searchQuery = ref("");
		const filteredPengeluarans = computed(() => {
			if (!searchQuery.value) return props.pengeluarans;
			return props.pengeluarans.filter((item) => `${item.judul} ${item.tipe}`.toLowerCase().includes(searchQuery.value.toLowerCase()));
		});
		const { currentPage, perPage, totalItems, totalPages, paginatedItems: paginatedPengeluarans, startIndex, endIndex, goToPage, visiblePages } = usePagination(() => filteredPengeluarans.value);
		const showModal = ref(false);
		const editingPengeluaran = ref(null);
		const form = useForm({
			tipe: "",
			judul: "",
			keterangan: "",
			nominal: 0
		});
		const nominalDisplay = ref("");
		function formatNominalDisplay(value) {
			if (!value && value !== 0) return "";
			return value === 0 ? "" : value.toLocaleString("id-ID");
		}
		watch(showModal, (isOpen) => {
			if (isOpen) nominalDisplay.value = formatNominalDisplay(form.nominal);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Data Pengeluaran - Admin" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 p-6"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-3xl font-extrabold tracking-tight">Manajemen Pengeluaran</h1><p class="mt-1 text-sm text-muted-foreground"> Kelola semua pengeluaran operasional dan bahan.</p></div><div class="flex shrink-0 items-center gap-2"><div class="relative"><button type="button" class="${ssrRenderClass([showDateFilter.value ? "border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400" : "border-sidebar-border/70 bg-background text-slate-600 hover:bg-slate-50 dark:border-sidebar-border dark:text-slate-300 dark:hover:bg-zinc-800", "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition"])}">`);
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
				_push(`<!--]--><button type="button" class="${ssrRenderClass([selectedDateMode.value === "custom" ? "bg-indigo-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "col-span-4 rounded-lg py-2 text-xs font-semibold transition-all"])}"> Custom </button></div>`);
				if (selectedDateMode.value === "custom") {
					_push(`<div class="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-zinc-800"><div class="grid grid-cols-2 gap-2"><label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"> Mulai <input${ssrRenderAttr("value", dateStartDate.value)} type="date" class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-indigo-500/20"></label><label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"> Sampai <input${ssrRenderAttr("value", dateEndDate.value)} type="date" class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-indigo-500/20"></label></div><button type="button" class="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-500 text-xs font-semibold text-white transition hover:bg-indigo-600">`);
					_push(ssrRenderComponent(unref(CalendarDays), { class: "h-3 w-3" }, null, _parent));
					_push(` Terapkan </button></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div><button id="btn-tambah-pengeluaran" class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">`);
			_push(ssrRenderComponent(unref(Plus), { class: "h-4 w-4" }, null, _parent));
			_push(` Tambah Pengeluaran </button></div></div>`);
			if (showDateFilter.value) _push(`<div class="fixed inset-0 z-40"></div>`);
			else _push(`<!---->`);
			_push(`<div class="grid gap-4 md:grid-cols-2"><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400">`);
			_push(ssrRenderComponent(unref(DollarSign), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Total Pengeluaran ${ssrInterpolate(periodLabel.value)}</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_pengeluaran)} entri</h3></div></div><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">`);
			_push(ssrRenderComponent(unref(FileText), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Total Nominal ${ssrInterpolate(periodLabel.value)}</span><h3 class="mt-0.5 text-xl font-bold">Rp ${ssrInterpolate(__props.stats.total_nominal.toLocaleString("id-ID"))}</h3></div></div></div><div class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"><div class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border"><div class="relative flex-1 max-w-md">`);
			_push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, null, _parent));
			_push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Cari judul atau tipe pengeluaran..." class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"></div></div><div class="overflow-x-auto"><table class="w-full border-collapse text-left text-sm"><thead><tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"><th class="px-6 py-4 font-semibold text-muted-foreground">No</th><th class="px-6 py-4 font-semibold text-muted-foreground">Judul</th><th class="px-6 py-4 font-semibold text-muted-foreground">Tipe</th><th class="px-6 py-4 font-semibold text-muted-foreground">Nominal</th><th class="px-6 py-4 font-semibold text-muted-foreground">Tanggal</th><th class="px-6 py-4 text-right font-semibold text-muted-foreground">Aksi</th></tr></thead><tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">`);
			if (unref(paginatedPengeluarans).length === 0) {
				_push(`<tr><td colspan="6" class="px-6 py-12 text-center text-muted-foreground">`);
				_push(ssrRenderComponent(unref(DollarSign), { class: "mx-auto mb-3 h-10 w-10 opacity-30" }, null, _parent));
				_push(`<p class="font-medium">Tidak ada pengeluaran yang cocok.</p></td></tr>`);
			} else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(unref(paginatedPengeluarans), (item, index) => {
				_push(`<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"><td class="px-6 py-4 text-muted-foreground">${ssrInterpolate(unref(startIndex) + index)}</td><td class="px-6 py-4">${ssrInterpolate(item.judul)}</td><td class="px-6 py-4 capitalize">${ssrInterpolate(item.tipe.replace("_", " "))}</td><td class="px-6 py-4">Rp ${ssrInterpolate(item.nominal.toLocaleString("id-ID"))}</td><td class="px-6 py-4">${ssrInterpolate(item.created_at)}</td><td class="px-6 py-4 text-right"><div class="inline-flex justify-end gap-2"><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800" title="Edit">`);
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
			ssrRenderTeleport(_push, (_push) => {
				if (showModal.value) {
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div class="w-full max-w-2xl rounded-3xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border"><div class="flex items-start justify-between gap-4"><div><h2 class="text-xl font-semibold">${ssrInterpolate(editingPengeluaran.value ? "Edit Pengeluaran" : "Tambah Pengeluaran")}</h2><p class="mt-1 text-sm text-muted-foreground">Isi detail pengeluaran untuk pencatatan keuangan.</p></div><button class="rounded-full p-2 text-muted-foreground transition hover:bg-slate-100 dark:hover:bg-zinc-800">`);
					_push(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent));
					_push(`</button></div><div class="mt-6 grid gap-4 lg:grid-cols-2"><div><label class="mb-2 block text-sm font-medium">Tipe Pengeluaran</label><select class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, "") : ssrLooseEqual(unref(form).tipe, "")) ? " selected" : ""}>Pilih tipe</option><!--[-->`);
					ssrRenderList(tipeOptions, (option) => {
						_push(`<option${ssrRenderAttr("value", option.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, option.value) : ssrLooseEqual(unref(form).tipe, option.value)) ? " selected" : ""}>${ssrInterpolate(option.label)}</option>`);
					});
					_push(`<!--]--></select>`);
					if (unref(form).errors.tipe) _push(`<p class="mt-2 text-sm text-rose-600">${ssrInterpolate(unref(form).errors.tipe)}</p>`);
					else _push(`<!---->`);
					_push(`</div><div><label class="mb-2 block text-sm font-medium">Judul</label><input type="text"${ssrRenderAttr("value", unref(form).judul)} class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border">`);
					if (unref(form).errors.judul) _push(`<p class="mt-2 text-sm text-rose-600">${ssrInterpolate(unref(form).errors.judul)}</p>`);
					else _push(`<!---->`);
					_push(`</div><div><label class="mb-2 block text-sm font-medium">Nominal</label><div class="relative"><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</span><input type="text" inputmode="numeric"${ssrRenderAttr("value", nominalDisplay.value)} placeholder="0" class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"></div>`);
					if (unref(form).errors.nominal) _push(`<p class="mt-2 text-sm text-rose-600">${ssrInterpolate(unref(form).errors.nominal)}</p>`);
					else _push(`<!---->`);
					_push(`</div><div><label class="mb-2 block text-sm font-medium">Keterangan</label><textarea rows="4" class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border">${ssrInterpolate(unref(form).keterangan)}</textarea>`);
					if (unref(form).errors.keterangan) _push(`<p class="mt-2 text-sm text-rose-600">${ssrInterpolate(unref(form).errors.keterangan)}</p>`);
					else _push(`<!---->`);
					_push(`</div></div><div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end"><button class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800" type="button"> Batal </button><button class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500" type="button">`);
					_push(ssrRenderComponent(unref(Save), { class: "h-4 w-4" }, null, _parent));
					_push(` ${ssrInterpolate(editingPengeluaran.value ? "Simpan Perubahan" : "Simpan Pengeluaran")}</button></div></div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/Pengeluarans.vue
var _sfc_setup = Pengeluarans_vue_vue_type_script_setup_true_lang_default.setup;
Pengeluarans_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/Pengeluarans.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Pengeluarans_default = Pengeluarans_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Pengeluarans_default as default };

//# sourceMappingURL=Pengeluarans-DnWMa-ni.js.map