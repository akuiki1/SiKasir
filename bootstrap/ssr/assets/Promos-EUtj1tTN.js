import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-BrhwLpUM.js";
import { r as formatRupiah } from "./format-Cq6R5JhR.js";
import { t as BodyTeleport_default } from "./BodyTeleport-CHE96Sca.js";
import { t as Pagination_default } from "./Pagination-CxLXQdL4.js";
import { t as usePagination } from "./usePagination-Dbv9f4fT.js";
import { Head, router, useForm } from "@inertiajs/vue3";
import { Fragment, computed, createBlock, createCommentVNode, createTextVNode, createVNode, defineComponent, nextTick, onMounted, openBlock, ref, renderList, toDisplayString, unref, useSSRContext, vModelCheckbox, vModelSelect, vModelText, withCtx, withDirectives, withModifiers } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
import { AlertCircle, Boxes, Check, CheckCircle2, Edit, Info, PackageSearch, PencilLine, Percent, Plus, Save, Search, ShoppingBag, Tag, Trash2, TrendingDown, TrendingUp, Wallet, X, XCircle } from "lucide-vue-next";
//#region resources/js/routes/admin/promos/index.ts
/**
* @see \App\Http\Controllers\PromoController::store
* @see app/Http/Controllers/PromoController.php:60
* @route '/admin/promos'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/admin/promos"
};
/**
* @see \App\Http\Controllers\PromoController::store
* @see app/Http/Controllers/PromoController.php:60
* @route '/admin/promos'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\PromoController::store
* @see app/Http/Controllers/PromoController.php:60
* @route '/admin/promos'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\PromoController::store
* @see app/Http/Controllers/PromoController.php:60
* @route '/admin/promos'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\PromoController::store
* @see app/Http/Controllers/PromoController.php:60
* @route '/admin/promos'
*/
storeForm.post = (options) => ({
	action: store.url(options),
	method: "post"
});
store.form = storeForm;
/**
* @see \App\Http\Controllers\PromoController::update
* @see app/Http/Controllers/PromoController.php:82
* @route '/admin/promos/{promo}'
*/
var update = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
update.definition = {
	methods: ["put"],
	url: "/admin/promos/{promo}"
};
/**
* @see \App\Http\Controllers\PromoController::update
* @see app/Http/Controllers/PromoController.php:82
* @route '/admin/promos/{promo}'
*/
update.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { promo: args };
	if (typeof args === "object" && !Array.isArray(args) && "id_promo" in args) args = { promo: args.id_promo };
	if (Array.isArray(args)) args = { promo: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { promo: typeof args.promo === "object" ? args.promo.id_promo : args.promo };
	return update.definition.url.replace("{promo}", parsedArgs.promo.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\PromoController::update
* @see app/Http/Controllers/PromoController.php:82
* @route '/admin/promos/{promo}'
*/
update.put = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
/**
* @see \App\Http\Controllers\PromoController::update
* @see app/Http/Controllers/PromoController.php:82
* @route '/admin/promos/{promo}'
*/
var updateForm = (args, options) => ({
	action: update.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\PromoController::update
* @see app/Http/Controllers/PromoController.php:82
* @route '/admin/promos/{promo}'
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
* @see \App\Http\Controllers\PromoController::destroy
* @see app/Http/Controllers/PromoController.php:104
* @route '/admin/promos/{promo}'
*/
var destroy = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
destroy.definition = {
	methods: ["delete"],
	url: "/admin/promos/{promo}"
};
/**
* @see \App\Http\Controllers\PromoController::destroy
* @see app/Http/Controllers/PromoController.php:104
* @route '/admin/promos/{promo}'
*/
destroy.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { promo: args };
	if (typeof args === "object" && !Array.isArray(args) && "id_promo" in args) args = { promo: args.id_promo };
	if (Array.isArray(args)) args = { promo: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { promo: typeof args.promo === "object" ? args.promo.id_promo : args.promo };
	return destroy.definition.url.replace("{promo}", parsedArgs.promo.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\PromoController::destroy
* @see app/Http/Controllers/PromoController.php:104
* @route '/admin/promos/{promo}'
*/
destroy.delete = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\PromoController::destroy
* @see app/Http/Controllers/PromoController.php:104
* @route '/admin/promos/{promo}'
*/
var destroyForm = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\PromoController::destroy
* @see app/Http/Controllers/PromoController.php:104
* @route '/admin/promos/{promo}'
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
//#region resources/js/pages/admin/Promos.vue?vue&type=script&setup=true&lang.ts
var Promos_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Data Promo",
		href: "/admin/promos"
	}] },
	__name: "Promos",
	__ssrInlineRender: true,
	props: {
		promos: {},
		produks: {},
		stats: {}
	},
	setup(__props) {
		const props = __props;
		const searchQuery = ref("");
		const filterStatus = ref("");
		const filteredPromos = computed(() => {
			return props.promos.filter((p) => {
				const matchSearch = !searchQuery.value || p.nama.toLowerCase().includes(searchQuery.value.toLowerCase());
				let matchStatus = true;
				if (filterStatus.value === "aktif") matchStatus = p.aktif;
				else if (filterStatus.value === "non-aktif") matchStatus = !p.aktif;
				return matchSearch && matchStatus;
			});
		});
		const { currentPage, perPage, totalItems, totalPages, paginatedItems: paginatedPromos, startIndex, endIndex, goToPage, visiblePages } = usePagination(() => filteredPromos.value);
		function formatDate(dateStr) {
			return new Date(dateStr).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
		}
		const showModal = ref(false);
		const editingPromo = ref(null);
		const form = useForm({
			nama: "",
			deskripsi: "",
			tipe: "persen",
			nilai: "",
			id_produk: "",
			minimal_belanja: "",
			tanggal_mulai: "",
			tanggal_selesai: "",
			aktif: true
		});
		const selectedProduk = computed(() => {
			if (!form.id_produk) return null;
			return props.produks.find((p) => String(p.id_produk) === String(form.id_produk)) ?? null;
		});
		const pickingProduk = ref(false);
		const produkSearch = ref("");
		const produkSearchInput = ref(null);
		const produkQuery = computed(() => produkSearch.value.trim().toLowerCase());
		const filteredProdukOptions = computed(() => {
			if (!produkQuery.value) return [];
			return props.produks.filter((p) => p.nama.toLowerCase().includes(produkQuery.value));
		});
		function pilihProduk(p) {
			form.id_produk = String(p.id_produk);
			pickingProduk.value = false;
			form.clearErrors("id_produk");
		}
		function pilihSemuaProduk() {
			form.id_produk = "";
			pickingProduk.value = false;
			form.clearErrors("id_produk");
		}
		function gantiProduk() {
			pickingProduk.value = true;
			produkSearch.value = "";
			nextTick(() => produkSearchInput.value?.focus());
		}
		const promoPreview = computed(() => {
			const produk = selectedProduk.value;
			if (!produk) return null;
			const hargaJual = Number(produk.harga_jual) || 0;
			const modal = Number(produk.harga_modal) || 0;
			const nilai = Number(form.nilai) || 0;
			let hargaSetelah = form.tipe === "persen" ? hargaJual * (1 - nilai / 100) : hargaJual - nilai;
			hargaSetelah = Math.max(0, Math.round(hargaSetelah));
			const labaSetelah = hargaSetelah - modal;
			const marginSetelah = hargaSetelah > 0 ? labaSetelah / hargaSetelah * 100 : -100;
			let kind;
			let status = "none";
			if (produk.tipe_jual === "jasa") kind = "jasa";
			else if (modal <= 0) kind = "no-modal";
			else {
				kind = "ok";
				if (labaSetelah < 0) status = "rugi";
				else if (marginSetelah < 15) status = "tipis";
				else status = "aman";
			}
			return {
				kind,
				jenis: produk.jenis,
				hargaJual,
				modal,
				hargaSetelah,
				labaSetelah,
				marginSetelah,
				status
			};
		});
		function openTambah() {
			editingPromo.value = null;
			form.reset();
			pickingProduk.value = false;
			produkSearch.value = "";
			form.aktif = true;
			form.tipe = "persen";
			const now = /* @__PURE__ */ new Date();
			const nextWeek = /* @__PURE__ */ new Date();
			nextWeek.setDate(now.getDate() + 7);
			form.tanggal_mulai = now.toISOString().slice(0, 16);
			form.tanggal_selesai = nextWeek.toISOString().slice(0, 16);
			showModal.value = true;
		}
		function closeModal() {
			showModal.value = false;
			pickingProduk.value = false;
			produkSearch.value = "";
			form.reset();
			form.clearErrors();
		}
		function submitForm() {
			const data = {
				...form.data(),
				nilai: Number(form.nilai),
				id_produk: form.id_produk ? Number(form.id_produk) : null,
				minimal_belanja: form.minimal_belanja ? Number(form.minimal_belanja) : null,
				aktif: Boolean(form.aktif)
			};
			if (editingPromo.value) router.put(update(editingPromo.value.id_promo).url, data, { onSuccess: () => closeModal() });
			else router.post(store().url, data, { onSuccess: () => closeModal() });
		}
		onMounted(() => {
			const produkId = new URLSearchParams(window.location.search).get("produk");
			if (!produkId) return;
			const produk = props.produks.find((p) => String(p.id_produk) === produkId);
			if (!produk) return;
			openTambah();
			form.id_produk = produkId;
			form.nama = `Promo ${produk.nama}`;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Manajemen Promo - Admin" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 p-6"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-3xl font-extrabold tracking-tight">Manajemen Promo</h1><p class="mt-1 text-sm text-muted-foreground"> Kelola program diskon, potongan harga produk, minimal belanja, dan masa aktif promo toko Anda. </p></div><button id="btn-tambah-promo" class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">`);
			_push(ssrRenderComponent(unref(Plus), { class: "h-4 w-4" }, null, _parent));
			_push(` Tambah Promo Baru </button></div><div class="grid gap-4 md:grid-cols-3"><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">`);
			_push(ssrRenderComponent(unref(Tag), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Total Promo</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_promo)} Program</h3></div></div><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">`);
			_push(ssrRenderComponent(unref(CheckCircle2), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Promo Aktif</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_aktif)} Aktif</h3></div></div><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400">`);
			_push(ssrRenderComponent(unref(XCircle), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Non-Aktif</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_non_aktif)} Non-Aktif</h3></div></div></div><div class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"><div class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border"><div class="relative flex-1 max-w-md">`);
			_push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, null, _parent));
			_push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Cari promo berdasarkan nama..." class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"></div><div class="flex gap-2"><select class="rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "") : ssrLooseEqual(filterStatus.value, "")) ? " selected" : ""}>Semua Status</option><option value="aktif"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "aktif") : ssrLooseEqual(filterStatus.value, "aktif")) ? " selected" : ""}>Aktif</option><option value="non-aktif"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "non-aktif") : ssrLooseEqual(filterStatus.value, "non-aktif")) ? " selected" : ""}>Non-Aktif</option></select></div></div><div class="overflow-x-auto"><table class="w-full border-collapse text-left text-sm"><thead><tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"><th class="px-6 py-4 font-semibold text-muted-foreground">Promo</th><th class="px-6 py-4 font-semibold text-muted-foreground">Potongan</th><th class="px-6 py-4 font-semibold text-muted-foreground">Berlaku Untuk</th><th class="px-6 py-4 font-semibold text-muted-foreground">Min. Belanja</th><th class="px-6 py-4 font-semibold text-muted-foreground">Masa Berlaku</th><th class="px-6 py-4 font-semibold text-muted-foreground">Status</th><th class="px-6 py-4 text-right font-semibold text-muted-foreground">Aksi</th></tr></thead><tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">`);
			if (unref(paginatedPromos).length === 0) {
				_push(`<tr><td colspan="7" class="px-6 py-12 text-center text-muted-foreground">`);
				_push(ssrRenderComponent(unref(Tag), { class: "mx-auto mb-3 h-10 w-10 opacity-30" }, null, _parent));
				_push(`<p class="font-medium">${ssrInterpolate(searchQuery.value ? "Tidak ada promo yang sesuai pencarian." : "Belum ada promo. Tambahkan promo pertama!")}</p></td></tr>`);
			} else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(unref(paginatedPromos), (promo) => {
				_push(`<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"><td class="px-6 py-4"><div><p class="font-semibold text-foreground">${ssrInterpolate(promo.nama)}</p><p class="text-xs text-muted-foreground max-w-xs truncate"${ssrRenderAttr("title", promo.deskripsi || "")}>${ssrInterpolate(promo.deskripsi ?? "-")}</p></div></td><td class="px-6 py-4 font-bold text-foreground">`);
				if (promo.tipe === "persen") {
					_push(`<span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">`);
					_push(ssrRenderComponent(unref(Percent), { class: "h-4 w-4" }, null, _parent));
					_push(` ${ssrInterpolate(promo.nilai)}% </span>`);
				} else _push(`<span class="text-indigo-600 dark:text-indigo-400">${ssrInterpolate(unref(formatRupiah)(promo.nilai))}</span>`);
				_push(`</td><td class="px-6 py-4 text-muted-foreground"><span class="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-xs font-semibold">`);
				_push(ssrRenderComponent(unref(ShoppingBag), { class: "h-3 w-3" }, null, _parent));
				_push(` ${ssrInterpolate(promo.produk_nama)}</span></td><td class="px-6 py-4 text-muted-foreground">${ssrInterpolate(promo.minimal_belanja ? unref(formatRupiah)(promo.minimal_belanja) : "Tanpa Minimal")}</td><td class="px-6 py-4"><div class="flex flex-col gap-0.5 text-xs text-muted-foreground"><span class="flex items-center gap-1"><span class="font-medium text-emerald-600 dark:text-emerald-400">Mulai:</span> ${ssrInterpolate(formatDate(promo.tanggal_mulai))}</span><span class="flex items-center gap-1"><span class="font-medium text-rose-600 dark:text-rose-400">Selesai:</span> ${ssrInterpolate(formatDate(promo.tanggal_selesai))}</span></div></td><td class="px-6 py-4"><span class="${ssrRenderClass(["inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide", promo.aktif ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"])}">${ssrInterpolate(promo.aktif ? "Aktif" : "Non-Aktif")}</span></td><td class="px-6 py-4 text-right"><div class="inline-flex justify-end gap-2"><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800" title="Edit">`);
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
					if (_push) if (showModal.value) {
						_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"${_scopeId}><div class="w-full max-w-lg rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border" style="${ssrRenderStyle({
							"max-height": "90vh",
							"overflow-y": "auto"
						})}"${_scopeId}><div class="mb-5 flex items-center justify-between"${_scopeId}><h2 class="text-lg font-bold"${_scopeId}>${ssrInterpolate(editingPromo.value ? "Edit Promo" : "Tambah Promo Baru")}</h2><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"${_scopeId}>`);
						_push(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`</button></div><form class="flex flex-col gap-4"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="promo-nama"${_scopeId}> Nama Promo </label><input id="promo-nama"${ssrRenderAttr("value", unref(form).nama)} type="text" placeholder="Contoh: Diskon Akhir Tahun" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.nama }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}>`);
						if (unref(form).errors.nama) {
							_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
							_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(form).errors.nama)}</p>`);
						} else _push(`<!---->`);
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="promo-deskripsi"${_scopeId}> Deskripsi </label><textarea id="promo-deskripsi" placeholder="Penjelasan ringkas mengenai promo" rows="2" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.deskripsi }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}>${ssrInterpolate(unref(form).deskripsi)}</textarea>`);
						if (unref(form).errors.deskripsi) {
							_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
							_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(form).errors.deskripsi)}</p>`);
						} else _push(`<!---->`);
						_push(`</div><div class="grid grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="promo-tipe"${_scopeId}> Tipe Diskon </label><select id="promo-tipe" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.tipe }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}><option value="persen"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, "persen") : ssrLooseEqual(unref(form).tipe, "persen")) ? " selected" : ""}${_scopeId}>Persentase (%)</option><option value="nominal"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, "nominal") : ssrLooseEqual(unref(form).tipe, "nominal")) ? " selected" : ""}${_scopeId}>Nominal (Rp)</option></select>`);
						if (unref(form).errors.tipe) {
							_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
							_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(form).errors.tipe)}</p>`);
						} else _push(`<!---->`);
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="promo-nilai"${_scopeId}> Nilai Diskon </label><input id="promo-nilai"${ssrRenderAttr("value", unref(form).nilai)} type="number" min="0"${ssrRenderAttr("placeholder", unref(form).tipe === "persen" ? "Contoh: 10" : "Contoh: 15000")} class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.nilai }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}>`);
						if (unref(form).errors.nilai) {
							_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
							_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(form).errors.nilai)}</p>`);
						} else _push(`<!---->`);
						_push(`</div></div><div${_scopeId}><label class="mb-1.5 block text-sm font-medium"${_scopeId}> Berlaku Untuk Produk </label>`);
						if (!pickingProduk.value) {
							_push(`<div class="flex items-center justify-between gap-3 rounded-xl border border-indigo-500/40 bg-indigo-500/5 p-3"${_scopeId}><div class="flex min-w-0 items-center gap-3"${_scopeId}><div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white"${_scopeId}>`);
							if (!selectedProduk.value) _push(ssrRenderComponent(unref(Boxes), { class: "h-5 w-5" }, null, _parent, _scopeId));
							else _push(ssrRenderComponent(unref(Check), { class: "h-5 w-5" }, null, _parent, _scopeId));
							_push(`</div><div class="min-w-0"${_scopeId}><p class="truncate font-semibold"${_scopeId}>${ssrInterpolate(selectedProduk.value ? selectedProduk.value.nama : "Semua Produk")}</p><p class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(selectedProduk.value ? `Harga jual ${unref(formatRupiah)(selectedProduk.value.harga_jual)}` : "Promo berlaku untuk seluruh produk toko")}</p></div></div><button type="button" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800"${_scopeId}>`);
							_push(ssrRenderComponent(unref(PencilLine), { class: "h-3.5 w-3.5" }, null, _parent, _scopeId));
							_push(` Ganti </button></div>`);
						} else {
							_push(`<div${_scopeId}><div class="relative"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, null, _parent, _scopeId));
							_push(`<input${ssrRenderAttr("value", produkSearch.value)} type="text" placeholder="Ketik nama produk untuk mencari..." class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"${_scopeId}></div><button type="button" class="mt-2 flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Boxes), { class: "h-4 w-4 shrink-0 text-muted-foreground" }, null, _parent, _scopeId));
							_push(`<span class="text-sm font-medium"${_scopeId}>Semua Produk</span></button>`);
							if (!produkQuery.value) _push(`<p class="mt-2 px-1 text-xs text-muted-foreground"${_scopeId}> Mulai ketik nama produk untuk menampilkan daftarnya, atau pilih &quot;Semua Produk&quot; di atas. </p>`);
							else if (filteredProdukOptions.value.length === 0) {
								_push(`<div class="mt-2 flex flex-col items-center gap-2 rounded-xl border border-dashed border-sidebar-border/70 px-4 py-6 text-center text-sm text-muted-foreground dark:border-sidebar-border"${_scopeId}>`);
								_push(ssrRenderComponent(unref(PackageSearch), { class: "h-7 w-7 opacity-30" }, null, _parent, _scopeId));
								_push(` Produk &quot;<strong${_scopeId}>${ssrInterpolate(produkSearch.value)}</strong>&quot; tidak ditemukan. </div>`);
							} else {
								_push(`<div class="mt-2 max-h-56 space-y-1 overflow-y-auto pr-1"${_scopeId}><!--[-->`);
								ssrRenderList(filteredProdukOptions.value, (prod) => {
									_push(`<button type="button" class="flex w-full items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5"${_scopeId}><span class="min-w-0 truncate text-sm font-medium"${_scopeId}>${ssrInterpolate(prod.nama)}</span><span class="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(prod.harga_jual))}</span></button>`);
								});
								_push(`<!--]--></div>`);
							}
							_push(`</div>`);
						}
						if (unref(form).errors.id_produk) {
							_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
							_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(form).errors.id_produk)}</p>`);
						} else _push(`<!---->`);
						_push(`</div>`);
						if (promoPreview.value) {
							_push(`<div class="rounded-lg border border-sidebar-border/70 bg-slate-50/50 p-4 text-sm dark:border-sidebar-border dark:bg-zinc-800/20"${_scopeId}>`);
							if (promoPreview.value.kind === "jasa") {
								_push(`<div class="flex items-start gap-2 text-muted-foreground"${_scopeId}>`);
								_push(ssrRenderComponent(unref(Info), { class: "mt-0.5 h-4 w-4 shrink-0" }, null, _parent, _scopeId));
								_push(`<span${_scopeId}>Produk jasa tidak memiliki modal barang. Promo dinilai dari fee, bukan margin produk.</span></div>`);
							} else if (promoPreview.value.kind === "no-modal") {
								_push(`<div class="flex items-start gap-2 text-amber-600 dark:text-amber-400"${_scopeId}>`);
								_push(ssrRenderComponent(unref(AlertCircle), { class: "mt-0.5 h-4 w-4 shrink-0" }, null, _parent, _scopeId));
								_push(`<span${_scopeId}> Modal produk ini belum tercatat`);
								if (promoPreview.value.jenis === "produksi") _push(`<!--[--> — catat batch produksi dulu<!--]-->`);
								else _push(`<!---->`);
								_push(`, jadi laba promo belum bisa dihitung. </span></div>`);
							} else {
								_push(`<div class="flex flex-col gap-3"${_scopeId}><div class="flex items-center gap-2 font-semibold text-foreground"${_scopeId}>`);
								_push(ssrRenderComponent(unref(Wallet), { class: "h-4 w-4 text-indigo-600 dark:text-indigo-400" }, null, _parent, _scopeId));
								_push(` Dampak ke Laba per Unit </div><div class="grid grid-cols-2 gap-x-4 gap-y-1.5"${_scopeId}><span class="text-muted-foreground"${_scopeId}>Harga jual</span><span class="text-right font-medium"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(promoPreview.value.hargaJual))}</span><span class="text-muted-foreground"${_scopeId}>${ssrInterpolate(promoPreview.value.jenis === "produksi" ? "Modal bahan / unit" : "Modal / unit")}</span><span class="text-right font-medium"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(promoPreview.value.modal))}</span><span class="text-muted-foreground"${_scopeId}>Harga setelah promo</span><span class="text-right font-bold text-indigo-600 dark:text-indigo-400"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(promoPreview.value.hargaSetelah))}</span><span class="text-muted-foreground"${_scopeId}>Laba / unit</span><span class="${ssrRenderClass([promoPreview.value.labaSetelah < 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400", "text-right font-bold"])}"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(promoPreview.value.labaSetelah))} <span class="font-normal text-muted-foreground"${_scopeId}>(${ssrInterpolate(promoPreview.value.marginSetelah.toFixed(0))}%)</span></span></div>`);
								if (promoPreview.value.status === "rugi") {
									_push(`<div class="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-700 dark:text-rose-300"${_scopeId}>`);
									_push(ssrRenderComponent(unref(TrendingDown), { class: "mt-0.5 h-4 w-4 shrink-0" }, null, _parent, _scopeId));
									_push(`<span${_scopeId}><strong${_scopeId}>Jual rugi!</strong> Harga setelah promo di bawah modal. Pakai hanya kalau memang sedang cuci gudang.</span></div>`);
								} else if (promoPreview.value.status === "tipis") {
									_push(`<div class="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-700 dark:text-amber-300"${_scopeId}>`);
									_push(ssrRenderComponent(unref(AlertCircle), { class: "mt-0.5 h-4 w-4 shrink-0" }, null, _parent, _scopeId));
									_push(`<span${_scopeId}><strong${_scopeId}>Margin tipis.</strong> Masih di atas modal`);
									if (promoPreview.value.jenis === "produksi") _push(`<!--[--> bahan, tapi biaya gas, listrik &amp; tenaga belum termasuk<!--]-->`);
									else _push(`<!---->`);
									_push(`. Pastikan tetap untung. </span></div>`);
								} else {
									_push(`<div class="flex items-start gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-700 dark:text-emerald-300"${_scopeId}>`);
									_push(ssrRenderComponent(unref(TrendingUp), { class: "mt-0.5 h-4 w-4 shrink-0" }, null, _parent, _scopeId));
									_push(`<span${_scopeId}><strong${_scopeId}>Margin aman.</strong> Promo ini masih memberi laba sehat.</span></div>`);
								}
								_push(`</div>`);
							}
							_push(`</div>`);
						} else _push(`<!---->`);
						_push(`<div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="promo-min-belanja"${_scopeId}> Minimal Belanja (Rp) <span class="text-xs text-muted-foreground"${_scopeId}>(Opsional)</span></label><input id="promo-min-belanja"${ssrRenderAttr("value", unref(form).minimal_belanja)} type="number" min="0" placeholder="Contoh: 50000" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.minimal_belanja }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}>`);
						if (unref(form).errors.minimal_belanja) {
							_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
							_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(form).errors.minimal_belanja)}</p>`);
						} else _push(`<!---->`);
						_push(`</div><div class="grid grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="promo-mulai"${_scopeId}> Tanggal Mulai </label><input id="promo-mulai"${ssrRenderAttr("value", unref(form).tanggal_mulai)} type="datetime-local" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.tanggal_mulai }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}>`);
						if (unref(form).errors.tanggal_mulai) {
							_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
							_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(form).errors.tanggal_mulai)}</p>`);
						} else _push(`<!---->`);
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="promo-selesai"${_scopeId}> Tanggal Selesai </label><input id="promo-selesai"${ssrRenderAttr("value", unref(form).tanggal_selesai)} type="datetime-local" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.tanggal_selesai }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}>`);
						if (unref(form).errors.tanggal_selesai) {
							_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
							_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(form).errors.tanggal_selesai)}</p>`);
						} else _push(`<!---->`);
						_push(`</div></div><div class="flex items-center gap-3 py-1"${_scopeId}><input id="promo-aktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).aktif) ? ssrLooseContain(unref(form).aktif, null) : unref(form).aktif) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-sidebar-border/70 text-indigo-600 focus:ring-indigo-500 dark:border-sidebar-border"${_scopeId}><label for="promo-aktif" class="text-sm font-semibold select-none cursor-pointer"${_scopeId}> Promo ini aktif dan siap digunakan </label></div><div class="flex justify-end gap-3 pt-2"${_scopeId}><button type="button" class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"${_scopeId}> Batal </button><button type="submit" class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
						_push(ssrRenderComponent(unref(Save), { class: "h-4 w-4" }, null, _parent, _scopeId));
						_push(` ${ssrInterpolate(unref(form).processing ? "Menyimpan..." : editingPromo.value ? "Simpan Perubahan" : "Tambah Promo")}</button></div></form></div></div>`);
					} else _push(`<!---->`);
					else return [showModal.value ? (openBlock(), createBlock("div", {
						key: 0,
						class: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
						onClick: withModifiers(closeModal, ["self"])
					}, [createVNode("div", {
						class: "w-full max-w-lg rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border",
						style: {
							"max-height": "90vh",
							"overflow-y": "auto"
						}
					}, [createVNode("div", { class: "mb-5 flex items-center justify-between" }, [createVNode("h2", { class: "text-lg font-bold" }, toDisplayString(editingPromo.value ? "Edit Promo" : "Tambah Promo Baru"), 1), createVNode("button", {
						class: "rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800",
						onClick: closeModal
					}, [createVNode(unref(X), { class: "h-5 w-5" })])]), createVNode("form", {
						class: "flex flex-col gap-4",
						onSubmit: withModifiers(submitForm, ["prevent"])
					}, [
						createVNode("div", null, [
							createVNode("label", {
								class: "mb-1.5 block text-sm font-medium",
								for: "promo-nama"
							}, " Nama Promo "),
							withDirectives(createVNode("input", {
								id: "promo-nama",
								"onUpdate:modelValue": ($event) => unref(form).nama = $event,
								type: "text",
								placeholder: "Contoh: Diskon Akhir Tahun",
								class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.nama }]
							}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).nama]]),
							unref(form).errors.nama ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
							}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.nama), 1)])) : createCommentVNode("", true)
						]),
						createVNode("div", null, [
							createVNode("label", {
								class: "mb-1.5 block text-sm font-medium",
								for: "promo-deskripsi"
							}, " Deskripsi "),
							withDirectives(createVNode("textarea", {
								id: "promo-deskripsi",
								"onUpdate:modelValue": ($event) => unref(form).deskripsi = $event,
								placeholder: "Penjelasan ringkas mengenai promo",
								rows: "2",
								class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.deskripsi }]
							}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).deskripsi]]),
							unref(form).errors.deskripsi ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
							}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.deskripsi), 1)])) : createCommentVNode("", true)
						]),
						createVNode("div", { class: "grid grid-cols-2 gap-4" }, [createVNode("div", null, [
							createVNode("label", {
								class: "mb-1.5 block text-sm font-medium",
								for: "promo-tipe"
							}, " Tipe Diskon "),
							withDirectives(createVNode("select", {
								id: "promo-tipe",
								"onUpdate:modelValue": ($event) => unref(form).tipe = $event,
								class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.tipe }]
							}, [createVNode("option", { value: "persen" }, "Persentase (%)"), createVNode("option", { value: "nominal" }, "Nominal (Rp)")], 10, ["onUpdate:modelValue"]), [[vModelSelect, unref(form).tipe]]),
							unref(form).errors.tipe ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
							}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.tipe), 1)])) : createCommentVNode("", true)
						]), createVNode("div", null, [
							createVNode("label", {
								class: "mb-1.5 block text-sm font-medium",
								for: "promo-nilai"
							}, " Nilai Diskon "),
							withDirectives(createVNode("input", {
								id: "promo-nilai",
								"onUpdate:modelValue": ($event) => unref(form).nilai = $event,
								type: "number",
								min: "0",
								placeholder: unref(form).tipe === "persen" ? "Contoh: 10" : "Contoh: 15000",
								class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.nilai }]
							}, null, 10, ["onUpdate:modelValue", "placeholder"]), [[vModelText, unref(form).nilai]]),
							unref(form).errors.nilai ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
							}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.nilai), 1)])) : createCommentVNode("", true)
						])]),
						createVNode("div", null, [
							createVNode("label", { class: "mb-1.5 block text-sm font-medium" }, " Berlaku Untuk Produk "),
							!pickingProduk.value ? (openBlock(), createBlock("div", {
								key: 0,
								class: "flex items-center justify-between gap-3 rounded-xl border border-indigo-500/40 bg-indigo-500/5 p-3"
							}, [createVNode("div", { class: "flex min-w-0 items-center gap-3" }, [createVNode("div", { class: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white" }, [!selectedProduk.value ? (openBlock(), createBlock(unref(Boxes), {
								key: 0,
								class: "h-5 w-5"
							})) : (openBlock(), createBlock(unref(Check), {
								key: 1,
								class: "h-5 w-5"
							}))]), createVNode("div", { class: "min-w-0" }, [createVNode("p", { class: "truncate font-semibold" }, toDisplayString(selectedProduk.value ? selectedProduk.value.nama : "Semua Produk"), 1), createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(selectedProduk.value ? `Harga jual ${unref(formatRupiah)(selectedProduk.value.harga_jual)}` : "Promo berlaku untuk seluruh produk toko"), 1)])]), createVNode("button", {
								type: "button",
								class: "inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800",
								onClick: gantiProduk
							}, [createVNode(unref(PencilLine), { class: "h-3.5 w-3.5" }), createTextVNode(" Ganti ")])])) : (openBlock(), createBlock("div", { key: 1 }, [
								createVNode("div", { class: "relative" }, [createVNode(unref(Search), { class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), withDirectives(createVNode("input", {
									ref_key: "produkSearchInput",
									ref: produkSearchInput,
									"onUpdate:modelValue": ($event) => produkSearch.value = $event,
									type: "text",
									placeholder: "Ketik nama produk untuk mencari...",
									class: "w-full rounded-lg border border-sidebar-border/70 bg-background py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
								}, null, 8, ["onUpdate:modelValue"]), [[vModelText, produkSearch.value]])]),
								createVNode("button", {
									type: "button",
									class: "mt-2 flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5",
									onClick: pilihSemuaProduk
								}, [createVNode(unref(Boxes), { class: "h-4 w-4 shrink-0 text-muted-foreground" }), createVNode("span", { class: "text-sm font-medium" }, "Semua Produk")]),
								!produkQuery.value ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-2 px-1 text-xs text-muted-foreground"
								}, " Mulai ketik nama produk untuk menampilkan daftarnya, atau pilih \"Semua Produk\" di atas. ")) : filteredProdukOptions.value.length === 0 ? (openBlock(), createBlock("div", {
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
								}, [(openBlock(true), createBlock(Fragment, null, renderList(filteredProdukOptions.value, (prod) => {
									return openBlock(), createBlock("button", {
										key: prod.id_produk,
										type: "button",
										class: "flex w-full items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5",
										onClick: ($event) => pilihProduk(prod)
									}, [createVNode("span", { class: "min-w-0 truncate text-sm font-medium" }, toDisplayString(prod.nama), 1), createVNode("span", { class: "shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground" }, toDisplayString(unref(formatRupiah)(prod.harga_jual)), 1)], 8, ["onClick"]);
								}), 128))]))
							])),
							unref(form).errors.id_produk ? (openBlock(), createBlock("p", {
								key: 2,
								class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
							}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.id_produk), 1)])) : createCommentVNode("", true)
						]),
						promoPreview.value ? (openBlock(), createBlock("div", {
							key: 0,
							class: "rounded-lg border border-sidebar-border/70 bg-slate-50/50 p-4 text-sm dark:border-sidebar-border dark:bg-zinc-800/20"
						}, [promoPreview.value.kind === "jasa" ? (openBlock(), createBlock("div", {
							key: 0,
							class: "flex items-start gap-2 text-muted-foreground"
						}, [createVNode(unref(Info), { class: "mt-0.5 h-4 w-4 shrink-0" }), createVNode("span", null, "Produk jasa tidak memiliki modal barang. Promo dinilai dari fee, bukan margin produk.")])) : promoPreview.value.kind === "no-modal" ? (openBlock(), createBlock("div", {
							key: 1,
							class: "flex items-start gap-2 text-amber-600 dark:text-amber-400"
						}, [createVNode(unref(AlertCircle), { class: "mt-0.5 h-4 w-4 shrink-0" }), createVNode("span", null, [
							createTextVNode(" Modal produk ini belum tercatat"),
							promoPreview.value.jenis === "produksi" ? (openBlock(), createBlock(Fragment, { key: 0 }, [createTextVNode(" — catat batch produksi dulu")], 64)) : createCommentVNode("", true),
							createTextVNode(", jadi laba promo belum bisa dihitung. ")
						])])) : (openBlock(), createBlock("div", {
							key: 2,
							class: "flex flex-col gap-3"
						}, [
							createVNode("div", { class: "flex items-center gap-2 font-semibold text-foreground" }, [createVNode(unref(Wallet), { class: "h-4 w-4 text-indigo-600 dark:text-indigo-400" }), createTextVNode(" Dampak ke Laba per Unit ")]),
							createVNode("div", { class: "grid grid-cols-2 gap-x-4 gap-y-1.5" }, [
								createVNode("span", { class: "text-muted-foreground" }, "Harga jual"),
								createVNode("span", { class: "text-right font-medium" }, toDisplayString(unref(formatRupiah)(promoPreview.value.hargaJual)), 1),
								createVNode("span", { class: "text-muted-foreground" }, toDisplayString(promoPreview.value.jenis === "produksi" ? "Modal bahan / unit" : "Modal / unit"), 1),
								createVNode("span", { class: "text-right font-medium" }, toDisplayString(unref(formatRupiah)(promoPreview.value.modal)), 1),
								createVNode("span", { class: "text-muted-foreground" }, "Harga setelah promo"),
								createVNode("span", { class: "text-right font-bold text-indigo-600 dark:text-indigo-400" }, toDisplayString(unref(formatRupiah)(promoPreview.value.hargaSetelah)), 1),
								createVNode("span", { class: "text-muted-foreground" }, "Laba / unit"),
								createVNode("span", { class: ["text-right font-bold", promoPreview.value.labaSetelah < 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"] }, [createTextVNode(toDisplayString(unref(formatRupiah)(promoPreview.value.labaSetelah)) + " ", 1), createVNode("span", { class: "font-normal text-muted-foreground" }, "(" + toDisplayString(promoPreview.value.marginSetelah.toFixed(0)) + "%)", 1)], 2)
							]),
							promoPreview.value.status === "rugi" ? (openBlock(), createBlock("div", {
								key: 0,
								class: "flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-700 dark:text-rose-300"
							}, [createVNode(unref(TrendingDown), { class: "mt-0.5 h-4 w-4 shrink-0" }), createVNode("span", null, [createVNode("strong", null, "Jual rugi!"), createTextVNode(" Harga setelah promo di bawah modal. Pakai hanya kalau memang sedang cuci gudang.")])])) : promoPreview.value.status === "tipis" ? (openBlock(), createBlock("div", {
								key: 1,
								class: "flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-700 dark:text-amber-300"
							}, [createVNode(unref(AlertCircle), { class: "mt-0.5 h-4 w-4 shrink-0" }), createVNode("span", null, [
								createVNode("strong", null, "Margin tipis."),
								createTextVNode(" Masih di atas modal"),
								promoPreview.value.jenis === "produksi" ? (openBlock(), createBlock(Fragment, { key: 0 }, [createTextVNode(" bahan, tapi biaya gas, listrik & tenaga belum termasuk")], 64)) : createCommentVNode("", true),
								createTextVNode(". Pastikan tetap untung. ")
							])])) : (openBlock(), createBlock("div", {
								key: 2,
								class: "flex items-start gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-700 dark:text-emerald-300"
							}, [createVNode(unref(TrendingUp), { class: "mt-0.5 h-4 w-4 shrink-0" }), createVNode("span", null, [createVNode("strong", null, "Margin aman."), createTextVNode(" Promo ini masih memberi laba sehat.")])]))
						]))])) : createCommentVNode("", true),
						createVNode("div", null, [
							createVNode("label", {
								class: "mb-1.5 block text-sm font-medium",
								for: "promo-min-belanja"
							}, [createTextVNode(" Minimal Belanja (Rp) "), createVNode("span", { class: "text-xs text-muted-foreground" }, "(Opsional)")]),
							withDirectives(createVNode("input", {
								id: "promo-min-belanja",
								"onUpdate:modelValue": ($event) => unref(form).minimal_belanja = $event,
								type: "number",
								min: "0",
								placeholder: "Contoh: 50000",
								class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.minimal_belanja }]
							}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).minimal_belanja]]),
							unref(form).errors.minimal_belanja ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
							}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.minimal_belanja), 1)])) : createCommentVNode("", true)
						]),
						createVNode("div", { class: "grid grid-cols-2 gap-4" }, [createVNode("div", null, [
							createVNode("label", {
								class: "mb-1.5 block text-sm font-medium",
								for: "promo-mulai"
							}, " Tanggal Mulai "),
							withDirectives(createVNode("input", {
								id: "promo-mulai",
								"onUpdate:modelValue": ($event) => unref(form).tanggal_mulai = $event,
								type: "datetime-local",
								class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.tanggal_mulai }]
							}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).tanggal_mulai]]),
							unref(form).errors.tanggal_mulai ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
							}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.tanggal_mulai), 1)])) : createCommentVNode("", true)
						]), createVNode("div", null, [
							createVNode("label", {
								class: "mb-1.5 block text-sm font-medium",
								for: "promo-selesai"
							}, " Tanggal Selesai "),
							withDirectives(createVNode("input", {
								id: "promo-selesai",
								"onUpdate:modelValue": ($event) => unref(form).tanggal_selesai = $event,
								type: "datetime-local",
								class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.tanggal_selesai }]
							}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).tanggal_selesai]]),
							unref(form).errors.tanggal_selesai ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
							}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.tanggal_selesai), 1)])) : createCommentVNode("", true)
						])]),
						createVNode("div", { class: "flex items-center gap-3 py-1" }, [withDirectives(createVNode("input", {
							id: "promo-aktif",
							"onUpdate:modelValue": ($event) => unref(form).aktif = $event,
							type: "checkbox",
							class: "h-4 w-4 rounded border-sidebar-border/70 text-indigo-600 focus:ring-indigo-500 dark:border-sidebar-border"
						}, null, 8, ["onUpdate:modelValue"]), [[vModelCheckbox, unref(form).aktif]]), createVNode("label", {
							for: "promo-aktif",
							class: "text-sm font-semibold select-none cursor-pointer"
						}, " Promo ini aktif dan siap digunakan ")]),
						createVNode("div", { class: "flex justify-end gap-3 pt-2" }, [createVNode("button", {
							type: "button",
							class: "rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40",
							onClick: closeModal
						}, " Batal "), createVNode("button", {
							type: "submit",
							class: "inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60",
							disabled: unref(form).processing
						}, [createVNode(unref(Save), { class: "h-4 w-4" }), createTextVNode(" " + toDisplayString(unref(form).processing ? "Menyimpan..." : editingPromo.value ? "Simpan Perubahan" : "Tambah Promo"), 1)], 8, ["disabled"])])
					], 32)])])) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/Promos.vue
var _sfc_setup = Promos_vue_vue_type_script_setup_true_lang_default.setup;
Promos_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/Promos.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Promos_default = Promos_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Promos_default as default };

//# sourceMappingURL=Promos-EUtj1tTN.js.map