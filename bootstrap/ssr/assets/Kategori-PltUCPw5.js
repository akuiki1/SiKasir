import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-BrhwLpUM.js";
import { t as Pagination_default } from "./Pagination-CxLXQdL4.js";
import { t as usePagination } from "./usePagination-Dbv9f4fT.js";
import { Head, useForm } from "@inertiajs/vue3";
import { computed, defineComponent, ref, unref, useSSRContext } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderTeleport } from "vue/server-renderer";
import { AlertCircle, Edit, Package, Plus, Save, Search, Tag, Trash2, X } from "lucide-vue-next";
//#region resources/js/routes/admin/kategori/index.ts
/**
* @see \App\Http\Controllers\KategoriController::store
* @see app/Http/Controllers/KategoriController.php:37
* @route '/admin/kategori'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/admin/kategori"
};
/**
* @see \App\Http\Controllers\KategoriController::store
* @see app/Http/Controllers/KategoriController.php:37
* @route '/admin/kategori'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\KategoriController::store
* @see app/Http/Controllers/KategoriController.php:37
* @route '/admin/kategori'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\KategoriController::store
* @see app/Http/Controllers/KategoriController.php:37
* @route '/admin/kategori'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\KategoriController::store
* @see app/Http/Controllers/KategoriController.php:37
* @route '/admin/kategori'
*/
storeForm.post = (options) => ({
	action: store.url(options),
	method: "post"
});
store.form = storeForm;
/**
* @see \App\Http\Controllers\KategoriController::update
* @see app/Http/Controllers/KategoriController.php:51
* @route '/admin/kategori/{kategori}'
*/
var update = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
update.definition = {
	methods: ["put"],
	url: "/admin/kategori/{kategori}"
};
/**
* @see \App\Http\Controllers\KategoriController::update
* @see app/Http/Controllers/KategoriController.php:51
* @route '/admin/kategori/{kategori}'
*/
update.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { kategori: args };
	if (typeof args === "object" && !Array.isArray(args) && "id_kategori" in args) args = { kategori: args.id_kategori };
	if (Array.isArray(args)) args = { kategori: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { kategori: typeof args.kategori === "object" ? args.kategori.id_kategori : args.kategori };
	return update.definition.url.replace("{kategori}", parsedArgs.kategori.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\KategoriController::update
* @see app/Http/Controllers/KategoriController.php:51
* @route '/admin/kategori/{kategori}'
*/
update.put = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
/**
* @see \App\Http\Controllers\KategoriController::update
* @see app/Http/Controllers/KategoriController.php:51
* @route '/admin/kategori/{kategori}'
*/
var updateForm = (args, options) => ({
	action: update.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\KategoriController::update
* @see app/Http/Controllers/KategoriController.php:51
* @route '/admin/kategori/{kategori}'
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
* @see \App\Http\Controllers\KategoriController::destroy
* @see app/Http/Controllers/KategoriController.php:65
* @route '/admin/kategori/{kategori}'
*/
var destroy = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
destroy.definition = {
	methods: ["delete"],
	url: "/admin/kategori/{kategori}"
};
/**
* @see \App\Http\Controllers\KategoriController::destroy
* @see app/Http/Controllers/KategoriController.php:65
* @route '/admin/kategori/{kategori}'
*/
destroy.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { kategori: args };
	if (typeof args === "object" && !Array.isArray(args) && "id_kategori" in args) args = { kategori: args.id_kategori };
	if (Array.isArray(args)) args = { kategori: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { kategori: typeof args.kategori === "object" ? args.kategori.id_kategori : args.kategori };
	return destroy.definition.url.replace("{kategori}", parsedArgs.kategori.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\KategoriController::destroy
* @see app/Http/Controllers/KategoriController.php:65
* @route '/admin/kategori/{kategori}'
*/
destroy.delete = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\KategoriController::destroy
* @see app/Http/Controllers/KategoriController.php:65
* @route '/admin/kategori/{kategori}'
*/
var destroyForm = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\KategoriController::destroy
* @see app/Http/Controllers/KategoriController.php:65
* @route '/admin/kategori/{kategori}'
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
//#region resources/js/pages/admin/Kategori.vue?vue&type=script&setup=true&lang.ts
var Kategori_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Data Kategori",
		href: "/admin/kategori"
	}] },
	__name: "Kategori",
	__ssrInlineRender: true,
	props: {
		kategoris: {},
		stats: {}
	},
	setup(__props) {
		const props = __props;
		const searchQuery = ref("");
		const filteredKategoris = computed(() => {
			if (!searchQuery.value) return props.kategoris;
			return props.kategoris.filter((k) => k.nama_kategori.toLowerCase().includes(searchQuery.value.toLowerCase()));
		});
		const { currentPage, perPage, totalItems, totalPages, paginatedItems: paginatedKategoris, startIndex, endIndex, goToPage, visiblePages } = usePagination(() => filteredKategoris.value);
		const showModal = ref(false);
		const editingKategori = ref(null);
		const form = useForm({ nama_kategori: "" });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Data Kategori - Admin" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 p-6"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-3xl font-extrabold tracking-tight">Manajemen Kategori</h1><p class="mt-1 text-sm text-muted-foreground"> Kelola data kategori produk di sistem Anda. </p></div><button id="btn-tambah-kategori" class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">`);
			_push(ssrRenderComponent(unref(Plus), { class: "h-4 w-4" }, null, _parent));
			_push(` Tambah Kategori Baru </button></div><div class="grid gap-4 md:grid-cols-2"><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">`);
			_push(ssrRenderComponent(unref(Tag), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Total Kategori</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_kategori)} Kategori</h3></div></div><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">`);
			_push(ssrRenderComponent(unref(Package), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Total Produk Terdaftar</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_produk)} Produk</h3></div></div></div><div class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"><div class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border"><div class="relative flex-1 max-w-md">`);
			_push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, null, _parent));
			_push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Cari kategori..." class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"></div></div><div class="overflow-x-auto"><table class="w-full border-collapse text-left text-sm"><thead><tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"><th class="px-6 py-4 font-semibold text-muted-foreground">No</th><th class="px-6 py-4 font-semibold text-muted-foreground"> Nama Kategori </th><th class="px-6 py-4 font-semibold text-muted-foreground"> Jumlah Produk </th><th class="px-6 py-4 text-right font-semibold text-muted-foreground"> Aksi </th></tr></thead><tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">`);
			if (unref(paginatedKategoris).length === 0) {
				_push(`<tr><td colspan="4" class="px-6 py-12 text-center text-muted-foreground">`);
				_push(ssrRenderComponent(unref(Tag), { class: "mx-auto mb-3 h-10 w-10 opacity-30" }, null, _parent));
				_push(`<p class="font-medium">${ssrInterpolate(searchQuery.value ? "Tidak ada kategori yang sesuai pencarian." : "Belum ada kategori. Tambahkan kategori pertama!")}</p></td></tr>`);
			} else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(unref(paginatedKategoris), (kategori, index) => {
				_push(`<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"><td class="px-6 py-4 text-muted-foreground">${ssrInterpolate(unref(startIndex) + index)}</td><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">`);
				_push(ssrRenderComponent(unref(Tag), { class: "h-4 w-4" }, null, _parent));
				_push(`</div><span class="font-semibold text-foreground">${ssrInterpolate(kategori.nama_kategori)}</span></div></td><td class="px-6 py-4"><span class="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">${ssrInterpolate(kategori.produks_count)} Produk </span></td><td class="px-6 py-4 text-right"><div class="inline-flex justify-end gap-2"><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800" title="Edit">`);
				_push(ssrRenderComponent(unref(Edit), { class: "h-4 w-4" }, null, _parent));
				_push(`</button><button title="Hapus"${ssrIncludeBooleanAttr(kategori.produks_count > 0) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-40 cursor-not-allowed": kategori.produks_count > 0 }, "rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"])}">`);
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
					_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"><div class="w-full max-w-md rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border"><div class="mb-5 flex items-center justify-between"><h2 class="text-lg font-bold">${ssrInterpolate(editingKategori.value ? "Edit Kategori" : "Tambah Kategori Baru")}</h2><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800">`);
					_push(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent));
					_push(`</button></div><form><div class="mb-5"><label class="mb-1.5 block text-sm font-medium" for="nama_kategori"> Nama Kategori </label><input id="nama_kategori"${ssrRenderAttr("value", unref(form).nama_kategori)} type="text" placeholder="Contoh: Minuman, Makanan, Camilan..." class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.nama_kategori }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}" autofocus>`);
					if (unref(form).errors.nama_kategori) {
						_push(`<p class="mt-1.5 flex items-center gap-1 text-xs text-rose-600">`);
						_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent));
						_push(` ${ssrInterpolate(unref(form).errors.nama_kategori)}</p>`);
					} else _push(`<!---->`);
					_push(`</div><div class="flex justify-end gap-3"><button type="button" class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"> Batal </button><button type="submit" class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}>`);
					_push(ssrRenderComponent(unref(Save), { class: "h-4 w-4" }, null, _parent));
					_push(` ${ssrInterpolate(unref(form).processing ? "Menyimpan..." : editingKategori.value ? "Simpan Perubahan" : "Tambah Kategori")}</button></div></form></div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/Kategori.vue
var _sfc_setup = Kategori_vue_vue_type_script_setup_true_lang_default.setup;
Kategori_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/Kategori.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Kategori_default = Kategori_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Kategori_default as default };

//# sourceMappingURL=Kategori-PltUCPw5.js.map