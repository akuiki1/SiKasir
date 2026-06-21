import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-BrhwLpUM.js";
import { t as Pagination_default } from "./Pagination-CxLXQdL4.js";
import { t as usePagination } from "./usePagination-Dbv9f4fT.js";
import { Head, useForm } from "@inertiajs/vue3";
import { computed, defineComponent, ref, unref, useSSRContext } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderTeleport } from "vue/server-renderer";
import { AlertCircle, BadgePercent, Contact, Edit, Phone, Plus, Save, Search, Trash2, X } from "lucide-vue-next";
//#region resources/js/routes/admin/pelanggan/index.ts
/**
* @see \App\Http\Controllers\PelangganController::store
* @see app/Http/Controllers/PelangganController.php:42
* @route '/admin/pelanggan'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/admin/pelanggan"
};
/**
* @see \App\Http\Controllers\PelangganController::store
* @see app/Http/Controllers/PelangganController.php:42
* @route '/admin/pelanggan'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\PelangganController::store
* @see app/Http/Controllers/PelangganController.php:42
* @route '/admin/pelanggan'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\PelangganController::store
* @see app/Http/Controllers/PelangganController.php:42
* @route '/admin/pelanggan'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\PelangganController::store
* @see app/Http/Controllers/PelangganController.php:42
* @route '/admin/pelanggan'
*/
storeForm.post = (options) => ({
	action: store.url(options),
	method: "post"
});
store.form = storeForm;
/**
* @see \App\Http\Controllers\PelangganController::update
* @see app/Http/Controllers/PelangganController.php:58
* @route '/admin/pelanggan/{pelanggan}'
*/
var update = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
update.definition = {
	methods: ["put"],
	url: "/admin/pelanggan/{pelanggan}"
};
/**
* @see \App\Http\Controllers\PelangganController::update
* @see app/Http/Controllers/PelangganController.php:58
* @route '/admin/pelanggan/{pelanggan}'
*/
update.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { pelanggan: args };
	if (typeof args === "object" && !Array.isArray(args) && "id_pelanggan" in args) args = { pelanggan: args.id_pelanggan };
	if (Array.isArray(args)) args = { pelanggan: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { pelanggan: typeof args.pelanggan === "object" ? args.pelanggan.id_pelanggan : args.pelanggan };
	return update.definition.url.replace("{pelanggan}", parsedArgs.pelanggan.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\PelangganController::update
* @see app/Http/Controllers/PelangganController.php:58
* @route '/admin/pelanggan/{pelanggan}'
*/
update.put = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
/**
* @see \App\Http\Controllers\PelangganController::update
* @see app/Http/Controllers/PelangganController.php:58
* @route '/admin/pelanggan/{pelanggan}'
*/
var updateForm = (args, options) => ({
	action: update.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\PelangganController::update
* @see app/Http/Controllers/PelangganController.php:58
* @route '/admin/pelanggan/{pelanggan}'
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
* @see \App\Http\Controllers\PelangganController::destroy
* @see app/Http/Controllers/PelangganController.php:74
* @route '/admin/pelanggan/{pelanggan}'
*/
var destroy = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
destroy.definition = {
	methods: ["delete"],
	url: "/admin/pelanggan/{pelanggan}"
};
/**
* @see \App\Http\Controllers\PelangganController::destroy
* @see app/Http/Controllers/PelangganController.php:74
* @route '/admin/pelanggan/{pelanggan}'
*/
destroy.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { pelanggan: args };
	if (typeof args === "object" && !Array.isArray(args) && "id_pelanggan" in args) args = { pelanggan: args.id_pelanggan };
	if (Array.isArray(args)) args = { pelanggan: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { pelanggan: typeof args.pelanggan === "object" ? args.pelanggan.id_pelanggan : args.pelanggan };
	return destroy.definition.url.replace("{pelanggan}", parsedArgs.pelanggan.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\PelangganController::destroy
* @see app/Http/Controllers/PelangganController.php:74
* @route '/admin/pelanggan/{pelanggan}'
*/
destroy.delete = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\PelangganController::destroy
* @see app/Http/Controllers/PelangganController.php:74
* @route '/admin/pelanggan/{pelanggan}'
*/
var destroyForm = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\PelangganController::destroy
* @see app/Http/Controllers/PelangganController.php:74
* @route '/admin/pelanggan/{pelanggan}'
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
//#region resources/js/pages/admin/Pelanggan.vue?vue&type=script&setup=true&lang.ts
var Pelanggan_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Pelanggan",
		href: "/admin/pelanggan"
	}] },
	__name: "Pelanggan",
	__ssrInlineRender: true,
	props: {
		pelanggans: {},
		stats: {}
	},
	setup(__props) {
		const props = __props;
		const searchQuery = ref("");
		const filterTipe = ref("");
		const filteredPelanggans = computed(() => props.pelanggans.filter((p) => {
			const matchSearch = !searchQuery.value || p.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) || (p.telp ?? "").includes(searchQuery.value);
			const matchTipe = !filterTipe.value || p.tipe === filterTipe.value;
			return matchSearch && matchTipe;
		}));
		const { currentPage, perPage, totalItems, totalPages, paginatedItems: paginatedPelanggans, startIndex, endIndex, goToPage, visiblePages } = usePagination(() => filteredPelanggans.value);
		const showModal = ref(false);
		const editing = ref(null);
		const form = useForm({
			nama: "",
			telp: "",
			tipe: "umum"
		});
		const tipeBadge = {
			umum: {
				label: "Umum",
				class: "border-slate-400/30 bg-slate-400/10 text-slate-600 dark:text-slate-300"
			},
			reseller: {
				label: "Reseller",
				class: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
			}
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Pelanggan - Admin" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 p-6"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-3xl font-extrabold tracking-tight">Pelanggan</h1><p class="mt-1 text-sm text-muted-foreground"> Daftarkan pelanggan, khususnya reseller agar mendapat potongan harga otomatis di kasir. </p></div><button class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500">`);
			_push(ssrRenderComponent(unref(Plus), { class: "h-4 w-4" }, null, _parent));
			_push(` Tambah Pelanggan </button></div><div class="grid gap-4 sm:grid-cols-2"><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">`);
			_push(ssrRenderComponent(unref(Contact), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Total Pelanggan</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_pelanggan)} orang</h3></div></div><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">`);
			_push(ssrRenderComponent(unref(BadgePercent), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Reseller</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_reseller)} reseller</h3></div></div></div><div class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"><div class="flex flex-col gap-3 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border"><div class="relative max-w-md flex-1">`);
			_push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, null, _parent));
			_push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Cari nama / nomor telepon..." class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"></div><div class="flex gap-1.5"><!--[-->`);
			ssrRenderList([
				{
					v: "",
					l: "Semua"
				},
				{
					v: "reseller",
					l: "Reseller"
				},
				{
					v: "umum",
					l: "Umum"
				}
			], (opt) => {
				_push(`<button type="button" class="${ssrRenderClass(["rounded-full border px-3 py-1 text-xs font-semibold transition", filterTipe.value === opt.v ? "border-indigo-500 bg-indigo-600 text-white shadow-sm" : "border-sidebar-border/70 bg-background text-muted-foreground hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800"])}">${ssrInterpolate(opt.l)}</button>`);
			});
			_push(`<!--]--></div></div><div class="overflow-x-auto"><table class="w-full border-collapse text-left text-sm"><thead><tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"><th class="px-6 py-4 font-semibold text-muted-foreground">No</th><th class="px-6 py-4 font-semibold text-muted-foreground">Nama</th><th class="px-6 py-4 font-semibold text-muted-foreground">Telepon</th><th class="px-6 py-4 font-semibold text-muted-foreground">Tipe</th><th class="px-6 py-4 font-semibold text-muted-foreground">Transaksi</th><th class="px-6 py-4 text-right font-semibold text-muted-foreground">Aksi</th></tr></thead><tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">`);
			if (unref(paginatedPelanggans).length === 0) {
				_push(`<tr><td colspan="6" class="px-6 py-12 text-center text-muted-foreground">`);
				_push(ssrRenderComponent(unref(Contact), { class: "mx-auto mb-3 h-10 w-10 opacity-30" }, null, _parent));
				_push(`<p class="font-medium">Belum ada pelanggan terdaftar.</p></td></tr>`);
			} else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(unref(paginatedPelanggans), (pelanggan, index) => {
				_push(`<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"><td class="px-6 py-4 text-muted-foreground">${ssrInterpolate(unref(startIndex) + index)}</td><td class="px-6 py-4 font-medium">${ssrInterpolate(pelanggan.nama)}</td><td class="px-6 py-4 text-muted-foreground">`);
				if (pelanggan.telp) {
					_push(`<span class="inline-flex items-center gap-1">`);
					_push(ssrRenderComponent(unref(Phone), { class: "h-3.5 w-3.5" }, null, _parent));
					_push(` ${ssrInterpolate(pelanggan.telp)}</span>`);
				} else _push(`<span>-</span>`);
				_push(`</td><td class="px-6 py-4"><span class="${ssrRenderClass(["inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", tipeBadge[pelanggan.tipe].class])}">${ssrInterpolate(tipeBadge[pelanggan.tipe].label)}</span></td><td class="px-6 py-4 text-muted-foreground">${ssrInterpolate(pelanggan.transaksis_count)}x</td><td class="px-6 py-4 text-right"><div class="inline-flex justify-end gap-2"><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800" title="Edit">`);
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
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"><div class="w-full max-w-md rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border"><div class="mb-5 flex items-center justify-between"><h2 class="text-lg font-bold">${ssrInterpolate(editing.value ? "Edit Pelanggan" : "Tambah Pelanggan")}</h2><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800">`);
					_push(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent));
					_push(`</button></div><form class="flex flex-col gap-4"><div><label class="mb-1.5 block text-sm font-medium" for="pel-nama">Nama</label><input id="pel-nama"${ssrRenderAttr("value", unref(form).nama)} type="text" placeholder="Nama pelanggan" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.nama }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}">`);
					if (unref(form).errors.nama) {
						_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600">`);
						_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent));
						_push(`${ssrInterpolate(unref(form).errors.nama)}</p>`);
					} else _push(`<!---->`);
					_push(`</div><div><label class="mb-1.5 block text-sm font-medium" for="pel-telp">Telepon (opsional)</label><input id="pel-telp"${ssrRenderAttr("value", unref(form).telp)} type="text" inputmode="tel" placeholder="08xxxxxxxxxx" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.telp }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}">`);
					if (unref(form).errors.telp) {
						_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600">`);
						_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent));
						_push(`${ssrInterpolate(unref(form).errors.telp)}</p>`);
					} else _push(`<!---->`);
					_push(`</div><div><label class="mb-1.5 block text-sm font-medium">Tipe Pelanggan</label><div class="grid grid-cols-2 gap-2"><!--[-->`);
					ssrRenderList(["umum", "reseller"], (opt) => {
						_push(`<button type="button" class="${ssrRenderClass(["rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition", unref(form).tipe === opt ? "border-indigo-500 bg-indigo-600 text-white shadow-sm" : "border-sidebar-border/70 bg-background text-muted-foreground hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800"])}">${ssrInterpolate(opt)}</button>`);
					});
					_push(`<!--]--></div><p class="mt-1 text-xs text-muted-foreground"> Reseller mendapat potongan harga per produk (diatur di Data Produk) saat dipilih di kasir. </p></div><div class="flex justify-end gap-3 pt-2"><button type="button" class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"> Batal </button><button type="submit" class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}>`);
					_push(ssrRenderComponent(unref(Save), { class: "h-4 w-4" }, null, _parent));
					_push(` ${ssrInterpolate(editing.value ? "Simpan Perubahan" : "Tambah Pelanggan")}</button></div></form></div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/Pelanggan.vue
var _sfc_setup = Pelanggan_vue_vue_type_script_setup_true_lang_default.setup;
Pelanggan_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/Pelanggan.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Pelanggan_default = Pelanggan_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Pelanggan_default as default };

//# sourceMappingURL=Pelanggan-CEOOnKAl.js.map