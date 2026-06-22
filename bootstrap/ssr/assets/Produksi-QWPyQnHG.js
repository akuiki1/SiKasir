import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-BrhwLpUM.js";
import { t as BodyTeleport_default } from "./BodyTeleport-CHE96Sca.js";
import { t as Pagination_default } from "./Pagination-CxLXQdL4.js";
import { t as usePagination } from "./usePagination-Dbv9f4fT.js";
import { Head, useForm } from "@inertiajs/vue3";
import { Fragment, computed, createBlock, createCommentVNode, createTextVNode, createVNode, defineComponent, nextTick, openBlock, ref, renderList, toDisplayString, unref, useSSRContext, vModelText, withCtx, withDirectives, withModifiers } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { Boxes, Check, Factory, PackageSearch, PencilLine, Plus, PlusCircle, Save, Search, Trash2, Wallet, X } from "lucide-vue-next";
//#region resources/js/routes/admin/produksi/index.ts
/**
* @see \App\Http\Controllers\ProduksiController::store
* @see app/Http/Controllers/ProduksiController.php:61
* @route '/admin/produksi'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/admin/produksi"
};
/**
* @see \App\Http\Controllers\ProduksiController::store
* @see app/Http/Controllers/ProduksiController.php:61
* @route '/admin/produksi'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\ProduksiController::store
* @see app/Http/Controllers/ProduksiController.php:61
* @route '/admin/produksi'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\ProduksiController::store
* @see app/Http/Controllers/ProduksiController.php:61
* @route '/admin/produksi'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\ProduksiController::store
* @see app/Http/Controllers/ProduksiController.php:61
* @route '/admin/produksi'
*/
storeForm.post = (options) => ({
	action: store.url(options),
	method: "post"
});
store.form = storeForm;
/**
* @see \App\Http\Controllers\ProduksiController::destroy
* @see app/Http/Controllers/ProduksiController.php:145
* @route '/admin/produksi/{produksi}'
*/
var destroy = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
destroy.definition = {
	methods: ["delete"],
	url: "/admin/produksi/{produksi}"
};
/**
* @see \App\Http\Controllers\ProduksiController::destroy
* @see app/Http/Controllers/ProduksiController.php:145
* @route '/admin/produksi/{produksi}'
*/
destroy.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { produksi: args };
	if (typeof args === "object" && !Array.isArray(args) && "id_produksi" in args) args = { produksi: args.id_produksi };
	if (Array.isArray(args)) args = { produksi: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { produksi: typeof args.produksi === "object" ? args.produksi.id_produksi : args.produksi };
	return destroy.definition.url.replace("{produksi}", parsedArgs.produksi.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\ProduksiController::destroy
* @see app/Http/Controllers/ProduksiController.php:145
* @route '/admin/produksi/{produksi}'
*/
destroy.delete = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\ProduksiController::destroy
* @see app/Http/Controllers/ProduksiController.php:145
* @route '/admin/produksi/{produksi}'
*/
var destroyForm = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\ProduksiController::destroy
* @see app/Http/Controllers/ProduksiController.php:145
* @route '/admin/produksi/{produksi}'
*/
destroyForm.delete = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
destroy.form = destroyForm;
Object.assign(store, store), Object.assign(destroy, destroy);
//#endregion
//#region resources/js/pages/admin/Produksi.vue?vue&type=script&setup=true&lang.ts
var Produksi_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Produksi",
		href: "/admin/produksi"
	}] },
	__name: "Produksi",
	__ssrInlineRender: true,
	props: {
		produksis: {},
		produks: {},
		stats: {}
	},
	setup(__props) {
		const props = __props;
		const rupiah = (value) => "Rp " + (value ?? 0).toLocaleString("id-ID");
		const formatStok = (stok) => Number.isInteger(stok) ? stok.toLocaleString("id-ID") : stok.toLocaleString("id-ID", { maximumFractionDigits: 3 });
		const searchQuery = ref("");
		const filteredProduksis = computed(() => {
			if (!searchQuery.value) return props.produksis;
			return props.produksis.filter((item) => item.produk_nama.toLowerCase().includes(searchQuery.value.toLowerCase()));
		});
		const { currentPage, perPage, totalItems, totalPages, paginatedItems: paginatedProduksis, startIndex, endIndex, goToPage, visiblePages } = usePagination(() => filteredProduksis.value);
		const showModal = ref(false);
		const form = useForm({
			id_produk: "",
			jumlah: 0,
			catatan: "",
			mode: "sederhana",
			total_biaya: 0,
			biayas: [{
				nama: "",
				nominal: 0
			}]
		});
		const totalBiaya = computed(() => form.mode === "sederhana" ? Number(form.total_biaya) || 0 : form.biayas.reduce((sum, b) => sum + (Number(b.nominal) || 0), 0));
		const modalPerUnit = computed(() => form.jumlah > 0 ? Math.round(totalBiaya.value / form.jumlah) : 0);
		const selectedProduk = computed(() => props.produks.find((p) => p.id_produk === form.id_produk) ?? null);
		const produkSearch = ref("");
		const produkSearchInput = ref(null);
		const produkQuery = computed(() => produkSearch.value.trim().toLowerCase());
		const filteredProdukOptions = computed(() => {
			if (!produkQuery.value) return [];
			return props.produks.filter((p) => p.nama.toLowerCase().includes(produkQuery.value));
		});
		function pilihProduk(p) {
			form.id_produk = p.id_produk;
			form.clearErrors("id_produk");
		}
		function gantiProduk() {
			form.id_produk = "";
			produkSearch.value = "";
			nextTick(() => produkSearchInput.value?.focus());
		}
		function addBiaya() {
			form.biayas.push({
				nama: "",
				nominal: 0
			});
		}
		function removeBiaya(index) {
			if (form.biayas.length > 1) form.biayas.splice(index, 1);
		}
		function closeModal() {
			showModal.value = false;
			produkSearch.value = "";
			form.reset();
			form.clearErrors();
		}
		function submitForm() {
			form.transform((data) => {
				const base = {
					id_produk: data.id_produk,
					jumlah: data.jumlah,
					catatan: data.catatan,
					mode: data.mode
				};
				return data.mode === "sederhana" ? {
					...base,
					total_biaya: data.total_biaya
				} : {
					...base,
					biayas: data.biayas
				};
			}).post(store().url, { onSuccess: () => closeModal() });
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Produksi - Admin" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl font-extrabold tracking-tight sm:text-3xl">Produksi</h1><p class="mt-1 text-sm text-muted-foreground"> Catat batch produksi barang buatan sendiri. Modal per unit dihitung dari total biaya dibagi jumlah hasil. </p></div><button id="btn-tambah-produksi" class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500">`);
			_push(ssrRenderComponent(unref(Plus), { class: "h-4 w-4" }, null, _parent));
			_push(` Catat Produksi </button></div><div class="grid gap-4 md:grid-cols-3"><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-4 shadow-sm sm:p-6 dark:border-sidebar-border"><div class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">`);
			_push(ssrRenderComponent(unref(Factory), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Total Batch</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_batch)} batch</h3></div></div><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-4 shadow-sm sm:p-6 dark:border-sidebar-border"><div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">`);
			_push(ssrRenderComponent(unref(Boxes), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Total Unit Diproduksi</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_unit.toLocaleString("id-ID"))} unit</h3></div></div><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-4 shadow-sm sm:p-6 dark:border-sidebar-border"><div class="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">`);
			_push(ssrRenderComponent(unref(Wallet), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Total Biaya Produksi</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(rupiah(__props.stats.total_biaya))}</h3></div></div></div><div class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"><div class="border-b border-sidebar-border/70 p-4 dark:border-sidebar-border"><div class="relative max-w-md">`);
			_push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, null, _parent));
			_push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Cari batch berdasarkan nama produk..." class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"></div></div>`);
			if (unref(paginatedProduksis).length === 0) {
				_push(`<div class="px-6 py-12 text-center text-muted-foreground">`);
				_push(ssrRenderComponent(unref(Factory), { class: "mx-auto mb-3 h-10 w-10 opacity-30" }, null, _parent));
				_push(`<p class="font-medium">Belum ada batch produksi.</p></div>`);
			} else {
				_push(`<div class="divide-y divide-sidebar-border/70 md:hidden dark:divide-sidebar-border"><!--[-->`);
				ssrRenderList(unref(paginatedProduksis), (item) => {
					_push(`<div class="p-4"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><p class="truncate font-semibold">${ssrInterpolate(item.produk_nama)}</p><p class="mt-0.5 text-xs text-muted-foreground">${ssrInterpolate(item.tanggal)}</p></div><button class="-mr-1 -mt-1 shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800" title="Hapus">`);
					_push(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4" }, null, _parent));
					_push(`</button></div><div class="mt-3 grid grid-cols-3 gap-2"><div><span class="block text-[11px] font-medium text-muted-foreground">Hasil</span><span class="text-sm font-semibold">${ssrInterpolate(formatStok(item.jumlah))} unit</span></div><div><span class="block text-[11px] font-medium text-muted-foreground">Total Biaya</span><span class="text-sm font-semibold">${ssrInterpolate(rupiah(item.total_biaya))}</span></div><div><span class="block text-[11px] font-medium text-muted-foreground">Modal / Unit</span><span class="text-sm font-semibold text-indigo-600 dark:text-indigo-400">${ssrInterpolate(rupiah(item.modal_per_unit))}</span></div></div></div>`);
				});
				_push(`<!--]--></div>`);
			}
			if (unref(paginatedProduksis).length > 0) {
				_push(`<div class="hidden overflow-x-auto md:block"><table class="w-full border-collapse text-left text-sm"><thead><tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"><th class="px-6 py-4 font-semibold text-muted-foreground">No</th><th class="px-6 py-4 font-semibold text-muted-foreground">Produk</th><th class="px-6 py-4 font-semibold text-muted-foreground">Jumlah Hasil</th><th class="px-6 py-4 font-semibold text-muted-foreground">Total Biaya</th><th class="px-6 py-4 font-semibold text-muted-foreground">Modal / Unit</th><th class="px-6 py-4 font-semibold text-muted-foreground">Tanggal</th><th class="px-6 py-4 text-right font-semibold text-muted-foreground">Aksi</th></tr></thead><tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border"><!--[-->`);
				ssrRenderList(unref(paginatedProduksis), (item, index) => {
					_push(`<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"><td class="px-6 py-4 text-muted-foreground">${ssrInterpolate(unref(startIndex) + index)}</td><td class="px-6 py-4 font-medium">${ssrInterpolate(item.produk_nama)}</td><td class="px-6 py-4">${ssrInterpolate(formatStok(item.jumlah))} unit</td><td class="px-6 py-4">${ssrInterpolate(rupiah(item.total_biaya))}</td><td class="px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400">${ssrInterpolate(rupiah(item.modal_per_unit))}</td><td class="px-6 py-4">${ssrInterpolate(item.tanggal)}</td><td class="px-6 py-4 text-right"><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800" title="Hapus">`);
					_push(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4" }, null, _parent));
					_push(`</button></td></tr>`);
				});
				_push(`<!--]--></tbody></table></div>`);
			} else _push(`<!---->`);
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
					if (_push) if (showModal.value) {
						_push(`<div class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"${_scopeId}><div class="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-sidebar-border/70 bg-card shadow-2xl sm:rounded-3xl dark:border-sidebar-border"${_scopeId}><div class="flex items-start justify-between gap-4 border-b border-sidebar-border/70 p-5 sm:p-6 dark:border-sidebar-border"${_scopeId}><div${_scopeId}><h2 class="text-lg font-semibold sm:text-xl"${_scopeId}>Catat Batch Produksi</h2><p class="mt-1 text-sm text-muted-foreground"${_scopeId}> Pilih produk, isi jumlah hasil &amp; biaya — modal per unit dihitung otomatis. </p></div><button class="-mr-1 -mt-1 shrink-0 rounded-full p-2 text-muted-foreground transition hover:bg-slate-100 dark:hover:bg-zinc-800"${_scopeId}>`);
						_push(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`</button></div><div class="flex flex-col gap-5 overflow-y-auto p-5 sm:p-6"${_scopeId}>`);
						if (__props.produks.length === 0) _push(`<div class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400"${_scopeId}> Belum ada produk berjenis <strong${_scopeId}>produksi</strong>. Buat dulu produk dengan jenis &quot;Buatan Sendiri&quot; di menu Data Produk. </div>`);
						else _push(`<!---->`);
						_push(`<div${_scopeId}><label class="mb-2 block text-sm font-medium"${_scopeId}>Produk (Buatan Sendiri)</label>`);
						if (selectedProduk.value) {
							_push(`<div class="flex items-center justify-between gap-3 rounded-xl border border-indigo-500/40 bg-indigo-500/5 p-3"${_scopeId}><div class="flex min-w-0 items-center gap-3"${_scopeId}><div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Check), { class: "h-5 w-5" }, null, _parent, _scopeId));
							_push(`</div><div class="min-w-0"${_scopeId}><p class="truncate font-semibold"${_scopeId}>${ssrInterpolate(selectedProduk.value.nama)}</p><p class="text-xs text-muted-foreground"${_scopeId}> Stok ${ssrInterpolate(formatStok(selectedProduk.value.stok))} · Modal kini ${ssrInterpolate(rupiah(selectedProduk.value.harga_modal))}</p></div></div><button type="button" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800"${_scopeId}>`);
							_push(ssrRenderComponent(unref(PencilLine), { class: "h-3.5 w-3.5" }, null, _parent, _scopeId));
							_push(` Ganti </button></div>`);
						} else if (__props.produks.length > 0) {
							_push(`<div${_scopeId}><div class="relative"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, null, _parent, _scopeId));
							_push(`<input${ssrRenderAttr("value", produkSearch.value)} type="text" placeholder="Ketik nama produk untuk mencari..." class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"${_scopeId}></div>`);
							if (!produkQuery.value) _push(`<p class="mt-2 px-1 text-xs text-muted-foreground"${_scopeId}> Mulai ketik nama produk untuk menampilkan daftarnya. </p>`);
							else if (filteredProdukOptions.value.length === 0) {
								_push(`<div class="mt-2 flex flex-col items-center gap-2 rounded-xl border border-dashed border-sidebar-border/70 px-4 py-6 text-center text-sm text-muted-foreground dark:border-sidebar-border"${_scopeId}>`);
								_push(ssrRenderComponent(unref(PackageSearch), { class: "h-7 w-7 opacity-30" }, null, _parent, _scopeId));
								_push(` Produk &quot;<strong${_scopeId}>${ssrInterpolate(produkSearch.value)}</strong>&quot; tidak ditemukan. </div>`);
							} else {
								_push(`<div class="mt-2 max-h-56 space-y-1 overflow-y-auto pr-1"${_scopeId}><!--[-->`);
								ssrRenderList(filteredProdukOptions.value, (p) => {
									_push(`<button type="button" class="flex w-full items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5"${_scopeId}><span class="min-w-0 truncate text-sm font-medium"${_scopeId}>${ssrInterpolate(p.nama)}</span><span class="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground"${_scopeId}> Stok ${ssrInterpolate(formatStok(p.stok))}</span></button>`);
								});
								_push(`<!--]--></div>`);
							}
							_push(`</div>`);
						} else _push(`<!---->`);
						if (unref(form).errors.id_produk) _push(`<p class="mt-2 text-sm text-rose-600"${_scopeId}>${ssrInterpolate(unref(form).errors.id_produk)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div${_scopeId}><label class="mb-2 block text-sm font-medium"${_scopeId}>Jumlah Hasil (unit)</label><input${ssrRenderAttr("value", unref(form).jumlah)} type="number" min="1" inputmode="numeric" placeholder="0" class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"${_scopeId}>`);
						if (unref(form).errors.jumlah) _push(`<p class="mt-2 text-sm text-rose-600"${_scopeId}>${ssrInterpolate(unref(form).errors.jumlah)}</p>`);
						else _push(`<!---->`);
						_push(`</div><div${_scopeId}><div class="mb-2 flex items-center justify-between gap-2"${_scopeId}><label class="text-sm font-medium"${_scopeId}>Biaya Produksi</label><div class="inline-flex gap-1 rounded-lg border border-sidebar-border/70 bg-background p-1 dark:border-sidebar-border"${_scopeId}><button type="button" class="${ssrRenderClass(["rounded-md px-3 py-1 text-xs font-semibold transition", unref(form).mode === "sederhana" ? "bg-indigo-600 text-white shadow-sm" : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800"])}"${_scopeId}> Total </button><button type="button" class="${ssrRenderClass(["rounded-md px-3 py-1 text-xs font-semibold transition", unref(form).mode === "rinci" ? "bg-indigo-600 text-white shadow-sm" : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800"])}"${_scopeId}> Rincian </button></div></div>`);
						if (unref(form).mode === "sederhana") {
							_push(`<div${_scopeId}><div class="relative"${_scopeId}><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground"${_scopeId}>Rp</span><input${ssrRenderAttr("value", unref(form).total_biaya)} type="number" min="0" inputmode="numeric" placeholder="Total uang yang keluar untuk batch ini" class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"${_scopeId}></div><p class="mt-1.5 text-xs text-muted-foreground"${_scopeId}>Cukup isi total biaya — modal per unit dihitung otomatis.</p>`);
							if (unref(form).errors.total_biaya) _push(`<p class="mt-2 text-sm text-rose-600"${_scopeId}>${ssrInterpolate(unref(form).errors.total_biaya)}</p>`);
							else _push(`<!---->`);
							_push(`</div>`);
						} else {
							_push(`<div${_scopeId}><div class="space-y-2"${_scopeId}><!--[-->`);
							ssrRenderList(unref(form).biayas, (biaya, index) => {
								_push(`<div class="flex items-center gap-2"${_scopeId}><input${ssrRenderAttr("value", biaya.nama)} type="text" placeholder="Nama bahan, mis. bawang ~2kg" class="min-w-0 flex-1 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"${_scopeId}><div class="relative w-28 shrink-0 sm:w-36"${_scopeId}><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground"${_scopeId}>Rp</span><input${ssrRenderAttr("value", biaya.nominal)} type="number" min="0" inputmode="numeric" placeholder="0" class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-9 pr-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"${_scopeId}></div><button type="button" class="shrink-0 rounded-lg p-2 text-muted-foreground transition hover:bg-slate-100 hover:text-rose-600 disabled:opacity-30 dark:hover:bg-zinc-800"${ssrIncludeBooleanAttr(unref(form).biayas.length <= 1) ? " disabled" : ""}${_scopeId}>`);
								_push(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4" }, null, _parent, _scopeId));
								_push(`</button></div>`);
							});
							_push(`<!--]--></div><button type="button" class="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"${_scopeId}>`);
							_push(ssrRenderComponent(unref(PlusCircle), { class: "h-4 w-4" }, null, _parent, _scopeId));
							_push(` Tambah baris bahan </button><p class="mt-1.5 text-xs text-muted-foreground"${_scopeId}>Rinci biaya bahan yang <em${_scopeId}>terpakai</em> (bukan total pembelian).</p>`);
							if (unref(form).errors.biayas) _push(`<p class="mt-2 text-sm text-rose-600"${_scopeId}>${ssrInterpolate(unref(form).errors.biayas)}</p>`);
							else _push(`<!---->`);
							if (unref(form).errors.total_biaya) _push(`<p class="mt-2 text-sm text-rose-600"${_scopeId}>${ssrInterpolate(unref(form).errors.total_biaya)}</p>`);
							else _push(`<!---->`);
							_push(`</div>`);
						}
						_push(`</div><div${_scopeId}><label class="mb-2 block text-sm font-medium"${_scopeId}>Catatan (opsional)</label><textarea rows="2" placeholder="Mis. tanggal masak atau kode batch." class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"${_scopeId}>${ssrInterpolate(unref(form).catatan)}</textarea></div><div class="grid grid-cols-3 gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4"${_scopeId}><div${_scopeId}><span class="text-xs font-medium text-muted-foreground"${_scopeId}>Total Biaya</span><p class="mt-0.5 text-sm font-bold sm:text-lg"${_scopeId}>${ssrInterpolate(rupiah(totalBiaya.value))}</p></div><div${_scopeId}><span class="text-xs font-medium text-muted-foreground"${_scopeId}>Jumlah Hasil</span><p class="mt-0.5 text-sm font-bold sm:text-lg"${_scopeId}>${ssrInterpolate(formatStok(unref(form).jumlah || 0))} unit</p></div><div${_scopeId}><span class="text-xs font-medium text-muted-foreground"${_scopeId}>Modal / Unit</span><p class="mt-0.5 text-sm font-bold text-indigo-600 sm:text-lg dark:text-indigo-400"${_scopeId}>${ssrInterpolate(rupiah(modalPerUnit.value))}</p></div></div>`);
						if (selectedProduk.value) _push(`<p class="-mt-2 text-xs text-muted-foreground"${_scopeId}> Modal produk akan diperbarui dari <strong${_scopeId}>${ssrInterpolate(rupiah(selectedProduk.value.harga_modal))}</strong> ke ${ssrInterpolate(rupiah(modalPerUnit.value))} setelah disimpan. </p>`);
						else _push(`<!---->`);
						_push(`</div><div class="flex flex-col gap-3 border-t border-sidebar-border/70 p-5 sm:flex-row sm:justify-end sm:p-6 dark:border-sidebar-border"${_scopeId}><button class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800" type="button"${_scopeId}> Batal </button><button class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50" type="button"${ssrIncludeBooleanAttr(unref(form).processing || __props.produks.length === 0) ? " disabled" : ""}${_scopeId}>`);
						_push(ssrRenderComponent(unref(Save), { class: "h-4 w-4" }, null, _parent, _scopeId));
						_push(` Simpan Produksi </button></div></div></div>`);
					} else _push(`<!---->`);
					else return [showModal.value ? (openBlock(), createBlock("div", {
						key: 0,
						class: "fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4",
						onClick: withModifiers(closeModal, ["self"])
					}, [createVNode("div", { class: "flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-sidebar-border/70 bg-card shadow-2xl sm:rounded-3xl dark:border-sidebar-border" }, [
						createVNode("div", { class: "flex items-start justify-between gap-4 border-b border-sidebar-border/70 p-5 sm:p-6 dark:border-sidebar-border" }, [createVNode("div", null, [createVNode("h2", { class: "text-lg font-semibold sm:text-xl" }, "Catat Batch Produksi"), createVNode("p", { class: "mt-1 text-sm text-muted-foreground" }, " Pilih produk, isi jumlah hasil & biaya — modal per unit dihitung otomatis. ")]), createVNode("button", {
							class: "-mr-1 -mt-1 shrink-0 rounded-full p-2 text-muted-foreground transition hover:bg-slate-100 dark:hover:bg-zinc-800",
							onClick: closeModal
						}, [createVNode(unref(X), { class: "h-5 w-5" })])]),
						createVNode("div", { class: "flex flex-col gap-5 overflow-y-auto p-5 sm:p-6" }, [
							__props.produks.length === 0 ? (openBlock(), createBlock("div", {
								key: 0,
								class: "rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400"
							}, [
								createTextVNode(" Belum ada produk berjenis "),
								createVNode("strong", null, "produksi"),
								createTextVNode(". Buat dulu produk dengan jenis \"Buatan Sendiri\" di menu Data Produk. ")
							])) : createCommentVNode("", true),
							createVNode("div", null, [
								createVNode("label", { class: "mb-2 block text-sm font-medium" }, "Produk (Buatan Sendiri)"),
								selectedProduk.value ? (openBlock(), createBlock("div", {
									key: 0,
									class: "flex items-center justify-between gap-3 rounded-xl border border-indigo-500/40 bg-indigo-500/5 p-3"
								}, [createVNode("div", { class: "flex min-w-0 items-center gap-3" }, [createVNode("div", { class: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white" }, [createVNode(unref(Check), { class: "h-5 w-5" })]), createVNode("div", { class: "min-w-0" }, [createVNode("p", { class: "truncate font-semibold" }, toDisplayString(selectedProduk.value.nama), 1), createVNode("p", { class: "text-xs text-muted-foreground" }, " Stok " + toDisplayString(formatStok(selectedProduk.value.stok)) + " · Modal kini " + toDisplayString(rupiah(selectedProduk.value.harga_modal)), 1)])]), createVNode("button", {
									type: "button",
									class: "inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800",
									onClick: gantiProduk
								}, [createVNode(unref(PencilLine), { class: "h-3.5 w-3.5" }), createTextVNode(" Ganti ")])])) : __props.produks.length > 0 ? (openBlock(), createBlock("div", { key: 1 }, [createVNode("div", { class: "relative" }, [createVNode(unref(Search), { class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), withDirectives(createVNode("input", {
									ref_key: "produkSearchInput",
									ref: produkSearchInput,
									"onUpdate:modelValue": ($event) => produkSearch.value = $event,
									type: "text",
									placeholder: "Ketik nama produk untuk mencari...",
									class: "w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
								}, null, 8, ["onUpdate:modelValue"]), [[vModelText, produkSearch.value]])]), !produkQuery.value ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-2 px-1 text-xs text-muted-foreground"
								}, " Mulai ketik nama produk untuk menampilkan daftarnya. ")) : filteredProdukOptions.value.length === 0 ? (openBlock(), createBlock("div", {
									key: 1,
									class: "mt-2 flex flex-col items-center gap-2 rounded-xl border border-dashed border-sidebar-border/70 px-4 py-6 text-center text-sm text-muted-foreground dark:border-sidebar-border"
								}, [
									createVNode(unref(PackageSearch), { class: "h-7 w-7 opacity-30" }),
									createTextVNode(" Produk \""),
									createVNode("strong", null, toDisplayString(produkSearch.value), 1),
									createTextVNode("\" tidak ditemukan. ")
								])) : (openBlock(), createBlock("div", {
									key: 2,
									class: "mt-2 max-h-56 space-y-1 overflow-y-auto pr-1"
								}, [(openBlock(true), createBlock(Fragment, null, renderList(filteredProdukOptions.value, (p) => {
									return openBlock(), createBlock("button", {
										key: p.id_produk,
										type: "button",
										class: "flex w-full items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5",
										onClick: ($event) => pilihProduk(p)
									}, [createVNode("span", { class: "min-w-0 truncate text-sm font-medium" }, toDisplayString(p.nama), 1), createVNode("span", { class: "shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground" }, " Stok " + toDisplayString(formatStok(p.stok)), 1)], 8, ["onClick"]);
								}), 128))]))])) : createCommentVNode("", true),
								unref(form).errors.id_produk ? (openBlock(), createBlock("p", {
									key: 2,
									class: "mt-2 text-sm text-rose-600"
								}, toDisplayString(unref(form).errors.id_produk), 1)) : createCommentVNode("", true)
							]),
							createVNode("div", null, [
								createVNode("label", { class: "mb-2 block text-sm font-medium" }, "Jumlah Hasil (unit)"),
								withDirectives(createVNode("input", {
									"onUpdate:modelValue": ($event) => unref(form).jumlah = $event,
									type: "number",
									min: "1",
									inputmode: "numeric",
									placeholder: "0",
									class: "w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
								}, null, 8, ["onUpdate:modelValue"]), [[
									vModelText,
									unref(form).jumlah,
									void 0,
									{ number: true }
								]]),
								unref(form).errors.jumlah ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-2 text-sm text-rose-600"
								}, toDisplayString(unref(form).errors.jumlah), 1)) : createCommentVNode("", true)
							]),
							createVNode("div", null, [createVNode("div", { class: "mb-2 flex items-center justify-between gap-2" }, [createVNode("label", { class: "text-sm font-medium" }, "Biaya Produksi"), createVNode("div", { class: "inline-flex gap-1 rounded-lg border border-sidebar-border/70 bg-background p-1 dark:border-sidebar-border" }, [createVNode("button", {
								type: "button",
								class: ["rounded-md px-3 py-1 text-xs font-semibold transition", unref(form).mode === "sederhana" ? "bg-indigo-600 text-white shadow-sm" : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800"],
								onClick: ($event) => unref(form).mode = "sederhana"
							}, " Total ", 10, ["onClick"]), createVNode("button", {
								type: "button",
								class: ["rounded-md px-3 py-1 text-xs font-semibold transition", unref(form).mode === "rinci" ? "bg-indigo-600 text-white shadow-sm" : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800"],
								onClick: ($event) => unref(form).mode = "rinci"
							}, " Rincian ", 10, ["onClick"])])]), unref(form).mode === "sederhana" ? (openBlock(), createBlock("div", { key: 0 }, [
								createVNode("div", { class: "relative" }, [createVNode("span", { class: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground" }, "Rp"), withDirectives(createVNode("input", {
									"onUpdate:modelValue": ($event) => unref(form).total_biaya = $event,
									type: "number",
									min: "0",
									inputmode: "numeric",
									placeholder: "Total uang yang keluar untuk batch ini",
									class: "w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
								}, null, 8, ["onUpdate:modelValue"]), [[
									vModelText,
									unref(form).total_biaya,
									void 0,
									{ number: true }
								]])]),
								createVNode("p", { class: "mt-1.5 text-xs text-muted-foreground" }, "Cukup isi total biaya — modal per unit dihitung otomatis."),
								unref(form).errors.total_biaya ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-2 text-sm text-rose-600"
								}, toDisplayString(unref(form).errors.total_biaya), 1)) : createCommentVNode("", true)
							])) : (openBlock(), createBlock("div", { key: 1 }, [
								createVNode("div", { class: "space-y-2" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(form).biayas, (biaya, index) => {
									return openBlock(), createBlock("div", {
										key: index,
										class: "flex items-center gap-2"
									}, [
										withDirectives(createVNode("input", {
											"onUpdate:modelValue": ($event) => biaya.nama = $event,
											type: "text",
											placeholder: "Nama bahan, mis. bawang ~2kg",
											class: "min-w-0 flex-1 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
										}, null, 8, ["onUpdate:modelValue"]), [[vModelText, biaya.nama]]),
										createVNode("div", { class: "relative w-28 shrink-0 sm:w-36" }, [createVNode("span", { class: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground" }, "Rp"), withDirectives(createVNode("input", {
											"onUpdate:modelValue": ($event) => biaya.nominal = $event,
											type: "number",
											min: "0",
											inputmode: "numeric",
											placeholder: "0",
											class: "w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-9 pr-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
										}, null, 8, ["onUpdate:modelValue"]), [[
											vModelText,
											biaya.nominal,
											void 0,
											{ number: true }
										]])]),
										createVNode("button", {
											type: "button",
											class: "shrink-0 rounded-lg p-2 text-muted-foreground transition hover:bg-slate-100 hover:text-rose-600 disabled:opacity-30 dark:hover:bg-zinc-800",
											disabled: unref(form).biayas.length <= 1,
											onClick: ($event) => removeBiaya(index)
										}, [createVNode(unref(Trash2), { class: "h-4 w-4" })], 8, ["disabled", "onClick"])
									]);
								}), 128))]),
								createVNode("button", {
									type: "button",
									class: "mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400",
									onClick: addBiaya
								}, [createVNode(unref(PlusCircle), { class: "h-4 w-4" }), createTextVNode(" Tambah baris bahan ")]),
								createVNode("p", { class: "mt-1.5 text-xs text-muted-foreground" }, [
									createTextVNode("Rinci biaya bahan yang "),
									createVNode("em", null, "terpakai"),
									createTextVNode(" (bukan total pembelian).")
								]),
								unref(form).errors.biayas ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-2 text-sm text-rose-600"
								}, toDisplayString(unref(form).errors.biayas), 1)) : createCommentVNode("", true),
								unref(form).errors.total_biaya ? (openBlock(), createBlock("p", {
									key: 1,
									class: "mt-2 text-sm text-rose-600"
								}, toDisplayString(unref(form).errors.total_biaya), 1)) : createCommentVNode("", true)
							]))]),
							createVNode("div", null, [createVNode("label", { class: "mb-2 block text-sm font-medium" }, "Catatan (opsional)"), withDirectives(createVNode("textarea", {
								"onUpdate:modelValue": ($event) => unref(form).catatan = $event,
								rows: "2",
								placeholder: "Mis. tanggal masak atau kode batch.",
								class: "w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
							}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).catatan]])]),
							createVNode("div", { class: "grid grid-cols-3 gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4" }, [
								createVNode("div", null, [createVNode("span", { class: "text-xs font-medium text-muted-foreground" }, "Total Biaya"), createVNode("p", { class: "mt-0.5 text-sm font-bold sm:text-lg" }, toDisplayString(rupiah(totalBiaya.value)), 1)]),
								createVNode("div", null, [createVNode("span", { class: "text-xs font-medium text-muted-foreground" }, "Jumlah Hasil"), createVNode("p", { class: "mt-0.5 text-sm font-bold sm:text-lg" }, toDisplayString(formatStok(unref(form).jumlah || 0)) + " unit", 1)]),
								createVNode("div", null, [createVNode("span", { class: "text-xs font-medium text-muted-foreground" }, "Modal / Unit"), createVNode("p", { class: "mt-0.5 text-sm font-bold text-indigo-600 sm:text-lg dark:text-indigo-400" }, toDisplayString(rupiah(modalPerUnit.value)), 1)])
							]),
							selectedProduk.value ? (openBlock(), createBlock("p", {
								key: 1,
								class: "-mt-2 text-xs text-muted-foreground"
							}, [
								createTextVNode(" Modal produk akan diperbarui dari "),
								createVNode("strong", null, toDisplayString(rupiah(selectedProduk.value.harga_modal)), 1),
								createTextVNode(" ke " + toDisplayString(rupiah(modalPerUnit.value)) + " setelah disimpan. ", 1)
							])) : createCommentVNode("", true)
						]),
						createVNode("div", { class: "flex flex-col gap-3 border-t border-sidebar-border/70 p-5 sm:flex-row sm:justify-end sm:p-6 dark:border-sidebar-border" }, [createVNode("button", {
							class: "rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800",
							type: "button",
							onClick: closeModal
						}, " Batal "), createVNode("button", {
							class: "inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50",
							type: "button",
							disabled: unref(form).processing || __props.produks.length === 0,
							onClick: submitForm
						}, [createVNode(unref(Save), { class: "h-4 w-4" }), createTextVNode(" Simpan Produksi ")], 8, ["disabled"])])
					])])) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/Produksi.vue
var _sfc_setup = Produksi_vue_vue_type_script_setup_true_lang_default.setup;
Produksi_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/Produksi.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Produksi_default = Produksi_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Produksi_default as default };

//# sourceMappingURL=Produksi-QWPyQnHG.js.map