import { n as queryParams } from "./wayfinder-BrhwLpUM.js";
import { t as BodyTeleport_default } from "./BodyTeleport-CHE96Sca.js";
import { t as Pagination_default } from "./Pagination-CxLXQdL4.js";
import { t as usePagination } from "./usePagination-Dbv9f4fT.js";
import { Head, useForm } from "@inertiajs/vue3";
import { Fragment, computed, createBlock, createCommentVNode, createTextVNode, createVNode, defineComponent, nextTick, onMounted, openBlock, ref, renderList, toDisplayString, unref, useSSRContext, vModelSelect, vModelText, watch, withCtx, withDirectives } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
import { AlertTriangle, Boxes, Check, ClipboardCheck, History, PackageMinus, PackagePlus, PackageSearch, PackageX, PencilLine, Save, Search, Warehouse, X } from "lucide-vue-next";
//#region resources/js/routes/admin/stok/index.ts
/**
* @see \App\Http\Controllers\StokController::masuk
* @see app/Http/Controllers/StokController.php:94
* @route '/admin/stok/masuk'
*/
var masuk = (options) => ({
	url: masuk.url(options),
	method: "post"
});
masuk.definition = {
	methods: ["post"],
	url: "/admin/stok/masuk"
};
/**
* @see \App\Http\Controllers\StokController::masuk
* @see app/Http/Controllers/StokController.php:94
* @route '/admin/stok/masuk'
*/
masuk.url = (options) => {
	return masuk.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\StokController::masuk
* @see app/Http/Controllers/StokController.php:94
* @route '/admin/stok/masuk'
*/
masuk.post = (options) => ({
	url: masuk.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\StokController::masuk
* @see app/Http/Controllers/StokController.php:94
* @route '/admin/stok/masuk'
*/
var masukForm = (options) => ({
	action: masuk.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\StokController::masuk
* @see app/Http/Controllers/StokController.php:94
* @route '/admin/stok/masuk'
*/
masukForm.post = (options) => ({
	action: masuk.url(options),
	method: "post"
});
masuk.form = masukForm;
/**
* @see \App\Http\Controllers\StokController::keluar
* @see app/Http/Controllers/StokController.php:127
* @route '/admin/stok/keluar'
*/
var keluar = (options) => ({
	url: keluar.url(options),
	method: "post"
});
keluar.definition = {
	methods: ["post"],
	url: "/admin/stok/keluar"
};
/**
* @see \App\Http\Controllers\StokController::keluar
* @see app/Http/Controllers/StokController.php:127
* @route '/admin/stok/keluar'
*/
keluar.url = (options) => {
	return keluar.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\StokController::keluar
* @see app/Http/Controllers/StokController.php:127
* @route '/admin/stok/keluar'
*/
keluar.post = (options) => ({
	url: keluar.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\StokController::keluar
* @see app/Http/Controllers/StokController.php:127
* @route '/admin/stok/keluar'
*/
var keluarForm = (options) => ({
	action: keluar.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\StokController::keluar
* @see app/Http/Controllers/StokController.php:127
* @route '/admin/stok/keluar'
*/
keluarForm.post = (options) => ({
	action: keluar.url(options),
	method: "post"
});
keluar.form = keluarForm;
/**
* @see \App\Http\Controllers\StokController::penyesuaian
* @see app/Http/Controllers/StokController.php:167
* @route '/admin/stok/penyesuaian'
*/
var penyesuaian = (options) => ({
	url: penyesuaian.url(options),
	method: "post"
});
penyesuaian.definition = {
	methods: ["post"],
	url: "/admin/stok/penyesuaian"
};
/**
* @see \App\Http\Controllers\StokController::penyesuaian
* @see app/Http/Controllers/StokController.php:167
* @route '/admin/stok/penyesuaian'
*/
penyesuaian.url = (options) => {
	return penyesuaian.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\StokController::penyesuaian
* @see app/Http/Controllers/StokController.php:167
* @route '/admin/stok/penyesuaian'
*/
penyesuaian.post = (options) => ({
	url: penyesuaian.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\StokController::penyesuaian
* @see app/Http/Controllers/StokController.php:167
* @route '/admin/stok/penyesuaian'
*/
var penyesuaianForm = (options) => ({
	action: penyesuaian.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\StokController::penyesuaian
* @see app/Http/Controllers/StokController.php:167
* @route '/admin/stok/penyesuaian'
*/
penyesuaianForm.post = (options) => ({
	action: penyesuaian.url(options),
	method: "post"
});
penyesuaian.form = penyesuaianForm;
Object.assign(masuk, masuk), Object.assign(keluar, keluar), Object.assign(penyesuaian, penyesuaian);
//#endregion
//#region resources/js/pages/admin/Stok.vue?vue&type=script&setup=true&lang.ts
var Stok_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Manajemen Stok",
		href: "/admin/stok"
	}] },
	__name: "Stok",
	__ssrInlineRender: true,
	props: {
		produks: {},
		mutasis: {},
		stats: {}
	},
	setup(__props) {
		const props = __props;
		const rupiah = (value) => "Rp " + (value ?? 0).toLocaleString("id-ID");
		const formatStok = (stok, satuan = "") => {
			const angka = Number.isInteger(stok) ? stok.toString() : stok.toLocaleString("id-ID", { maximumFractionDigits: 3 });
			return satuan ? `${angka} ${satuan}` : angka;
		};
		const statusMeta = {
			"in-stock": {
				label: "Tersedia",
				badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
			},
			"low-stock": {
				label: "Menipis",
				badge: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
			},
			"out-of-stock": {
				label: "Habis",
				badge: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400"
			}
		};
		const tipeBadge = {
			awal: "border-slate-400/30 bg-slate-400/10 text-slate-600 dark:text-slate-300",
			masuk: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
			produksi: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
			keluar: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
			jual: "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
			produksi_batal: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
			penyesuaian: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
		};
		const activeTab = ref("daftar");
		const searchQuery = ref("");
		const statusFilter = ref("all");
		onMounted(() => {
			const params = new URLSearchParams(window.location.search);
			const status = params.get("status");
			const search = params.get("search") ?? params.get("q");
			if (status && [
				"all",
				"in-stock",
				"low-stock",
				"out-of-stock",
				"menipis"
			].includes(status)) statusFilter.value = status;
			if (search) searchQuery.value = search;
		});
		const filteredProduks = computed(() => {
			const q = searchQuery.value.toLowerCase();
			return props.produks.filter((p) => {
				const cocokNama = !q || p.nama.toLowerCase().includes(q) || (p.kategori ?? "").toLowerCase().includes(q);
				const cocokStatus = statusFilter.value === "all" || (statusFilter.value === "menipis" ? p.status_stok === "low-stock" || p.status_stok === "out-of-stock" : p.status_stok === statusFilter.value);
				return cocokNama && cocokStatus;
			});
		});
		const { currentPage: pageProduk, perPage: perPageProduk, totalItems: totalProduk, totalPages: totalPagesProduk, paginatedItems: paginatedProduks, startIndex: startProduk, endIndex: endProduk, goToPage: goToPageProduk, visiblePages: visiblePagesProduk } = usePagination(() => filteredProduks.value);
		const mutasiSearch = ref("");
		const tipeFilter = ref("all");
		const filteredMutasis = computed(() => {
			const q = mutasiSearch.value.toLowerCase();
			return props.mutasis.filter((m) => {
				const cocokNama = !q || m.produk_nama.toLowerCase().includes(q);
				const cocokTipe = tipeFilter.value === "all" || m.tipe === tipeFilter.value;
				return cocokNama && cocokTipe;
			});
		});
		const { currentPage: pageMutasi, perPage: perPageMutasi, totalItems: totalMutasi, totalPages: totalPagesMutasi, paginatedItems: paginatedMutasis, startIndex: startMutasi, endIndex: endMutasi, goToPage: goToPageMutasi, visiblePages: visiblePagesMutasi } = usePagination(() => filteredMutasis.value);
		const modalMode = ref(null);
		const alasanOptions = [
			{
				value: "rusak",
				label: "Rusak"
			},
			{
				value: "kadaluarsa",
				label: "Kadaluarsa"
			},
			{
				value: "hilang",
				label: "Hilang"
			},
			{
				value: "pakai_sendiri",
				label: "Dipakai sendiri"
			},
			{
				value: "lainnya",
				label: "Lainnya"
			}
		];
		const form = useForm({
			id_produk: "",
			jumlah: null,
			harga_beli: null,
			alasan: "rusak",
			stok_fisik: null,
			keterangan: ""
		});
		const selectedProduk = computed(() => props.produks.find((p) => p.id_produk === form.id_produk) ?? null);
		const produkSearch = ref("");
		const produkSearchInput = ref(null);
		const produkQuery = computed(() => produkSearch.value.trim().toLowerCase());
		const filteredProdukOptions = computed(() => {
			if (!produkQuery.value) return [];
			return props.produks.filter((p) => p.nama.toLowerCase().includes(produkQuery.value) || (p.kategori ?? "").toLowerCase().includes(produkQuery.value));
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
		watch(() => form.id_produk, () => {
			if (modalMode.value === "penyesuaian") form.stok_fisik = selectedProduk.value ? selectedProduk.value.stok : null;
		});
		const selisihOpname = computed(() => {
			if (!selectedProduk.value || form.stok_fisik === null) return 0;
			return Number(form.stok_fisik) - selectedProduk.value.stok;
		});
		const modalMeta = {
			masuk: {
				title: "Stok Masuk",
				desc: "Catat barang baru yang datang dari supplier/agen. Stok bertambah sesuai jumlah.",
				submit: "Simpan Stok Masuk"
			},
			keluar: {
				title: "Stok Keluar",
				desc: "Catat stok berkurang di luar penjualan (rusak, kadaluarsa, hilang, dipakai sendiri).",
				submit: "Simpan Stok Keluar"
			},
			penyesuaian: {
				title: "Penyesuaian / Opname",
				desc: "Samakan stok sistem dengan hasil hitung fisik. Selisihnya dicatat otomatis.",
				submit: "Simpan Penyesuaian"
			}
		};
		function closeModal() {
			modalMode.value = null;
			produkSearch.value = "";
			form.reset();
			form.clearErrors();
		}
		function submitForm() {
			if (!modalMode.value) return;
			const routeFor = {
				masuk: masuk(),
				keluar: keluar(),
				penyesuaian: penyesuaian()
			};
			form.transform((data) => {
				if (modalMode.value === "masuk") return {
					id_produk: data.id_produk,
					jumlah: data.jumlah,
					harga_beli: data.harga_beli,
					keterangan: data.keterangan
				};
				if (modalMode.value === "keluar") return {
					id_produk: data.id_produk,
					jumlah: data.jumlah,
					alasan: data.alasan,
					keterangan: data.keterangan
				};
				return {
					id_produk: data.id_produk,
					stok_fisik: data.stok_fisik,
					keterangan: data.keterangan
				};
			}).post(routeFor[modalMode.value].url, {
				preserveScroll: true,
				onSuccess: () => closeModal()
			});
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Manajemen Stok - Admin" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 p-6"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-3xl font-extrabold tracking-tight">Manajemen Stok</h1><p class="mt-1 text-sm text-muted-foreground"> Kelola stok masuk (restock), stok keluar, dan penyesuaian opname. Setiap perubahan tercatat di kartu stok. </p></div><button id="btn-stok-masuk" class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-500">`);
			_push(ssrRenderComponent(unref(PackagePlus), { class: "h-4 w-4" }, null, _parent));
			_push(` Stok Masuk </button></div><div class="grid gap-4 md:grid-cols-3"><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">`);
			_push(ssrRenderComponent(unref(Boxes), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Produk Berstok</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_produk.toLocaleString("id-ID"))} produk</h3></div></div><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">`);
			_push(ssrRenderComponent(unref(AlertTriangle), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Stok Menipis</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.stok_menipis.toLocaleString("id-ID"))} produk</h3></div></div><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-600 dark:text-rose-400">`);
			_push(ssrRenderComponent(unref(PackageX), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Stok Habis</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.stok_habis.toLocaleString("id-ID"))} produk</h3></div></div></div><div class="flex gap-1 rounded-xl border border-sidebar-border/70 bg-card p-1 shadow-sm dark:border-sidebar-border sm:w-fit"><button class="${ssrRenderClass(["inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition", activeTab.value === "daftar" ? "bg-indigo-600 text-white shadow-sm" : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800"])}">`);
			_push(ssrRenderComponent(unref(Warehouse), { class: "h-4 w-4" }, null, _parent));
			_push(` Daftar Stok </button><button class="${ssrRenderClass(["inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition", activeTab.value === "kartu" ? "bg-indigo-600 text-white shadow-sm" : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800"])}">`);
			_push(ssrRenderComponent(unref(History), { class: "h-4 w-4" }, null, _parent));
			_push(` Kartu Stok </button></div><div class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border" style="${ssrRenderStyle(activeTab.value === "daftar" ? null : { display: "none" })}"><div class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border"><div class="relative max-w-md flex-1">`);
			_push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, null, _parent));
			_push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Cari nama produk / kategori..." class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"></div><select class="rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "all") : ssrLooseEqual(statusFilter.value, "all")) ? " selected" : ""}>Semua status</option><option value="menipis"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "menipis") : ssrLooseEqual(statusFilter.value, "menipis")) ? " selected" : ""}>Menipis / habis</option><option value="in-stock"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "in-stock") : ssrLooseEqual(statusFilter.value, "in-stock")) ? " selected" : ""}>Tersedia</option><option value="low-stock"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "low-stock") : ssrLooseEqual(statusFilter.value, "low-stock")) ? " selected" : ""}>Menipis</option><option value="out-of-stock"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "out-of-stock") : ssrLooseEqual(statusFilter.value, "out-of-stock")) ? " selected" : ""}>Habis</option></select></div><div class="overflow-x-auto"><table class="w-full border-collapse text-left text-sm"><thead><tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"><th class="px-6 py-4 font-semibold text-muted-foreground">No</th><th class="px-6 py-4 font-semibold text-muted-foreground">Produk</th><th class="px-6 py-4 font-semibold text-muted-foreground">Stok</th><th class="px-6 py-4 font-semibold text-muted-foreground">Status</th><th class="px-6 py-4 font-semibold text-muted-foreground">Modal</th><th class="px-6 py-4 text-right font-semibold text-muted-foreground">Aksi</th></tr></thead><tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">`);
			if (unref(paginatedProduks).length === 0) {
				_push(`<tr><td colspan="6" class="px-6 py-12 text-center text-muted-foreground">`);
				_push(ssrRenderComponent(unref(Warehouse), { class: "mx-auto mb-3 h-10 w-10 opacity-30" }, null, _parent));
				_push(`<p class="font-medium">Tidak ada produk yang cocok.</p></td></tr>`);
			} else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(unref(paginatedProduks), (produk, index) => {
				_push(`<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"><td class="px-6 py-4 text-muted-foreground">${ssrInterpolate(unref(startProduk) + index)}</td><td class="px-6 py-4"><button class="text-left font-medium hover:text-indigo-600 dark:hover:text-indigo-400">${ssrInterpolate(produk.nama)}</button><div class="text-xs text-muted-foreground">${ssrInterpolate(produk.kategori ?? "Tanpa kategori")}</div></td><td class="px-6 py-4 font-semibold">${ssrInterpolate(formatStok(produk.stok, produk.satuan))}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", statusMeta[produk.status_stok].badge])}">${ssrInterpolate(statusMeta[produk.status_stok].label)}</span></td><td class="px-6 py-4 text-muted-foreground">${ssrInterpolate(rupiah(produk.harga_modal))}</td><td class="px-6 py-4"><div class="flex items-center justify-end gap-1"><button class="rounded-lg p-1.5 text-emerald-600 transition-colors hover:bg-emerald-500/10 dark:text-emerald-400" title="Stok Masuk">`);
				_push(ssrRenderComponent(unref(PackagePlus), { class: "h-4 w-4" }, null, _parent));
				_push(`</button><button class="rounded-lg p-1.5 text-rose-600 transition-colors hover:bg-rose-500/10 dark:text-rose-400" title="Stok Keluar">`);
				_push(ssrRenderComponent(unref(PackageMinus), { class: "h-4 w-4" }, null, _parent));
				_push(`</button><button class="rounded-lg p-1.5 text-amber-600 transition-colors hover:bg-amber-500/10 dark:text-amber-400" title="Penyesuaian / Opname">`);
				_push(ssrRenderComponent(unref(ClipboardCheck), { class: "h-4 w-4" }, null, _parent));
				_push(`</button></div></td></tr>`);
			});
			_push(`<!--]--></tbody></table></div>`);
			_push(ssrRenderComponent(Pagination_default, {
				"current-page": unref(pageProduk),
				"total-pages": unref(totalPagesProduk),
				"total-items": unref(totalProduk),
				"start-index": unref(startProduk),
				"end-index": unref(endProduk),
				"per-page": unref(perPageProduk),
				"visible-pages": unref(visiblePagesProduk),
				"onUpdate:currentPage": unref(goToPageProduk),
				"onUpdate:perPage": ($event) => perPageProduk.value = $event
			}, null, _parent));
			_push(`</div><div class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border" style="${ssrRenderStyle(activeTab.value === "kartu" ? null : { display: "none" })}"><div class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border"><div class="relative max-w-md flex-1">`);
			_push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, null, _parent));
			_push(`<input${ssrRenderAttr("value", mutasiSearch.value)} type="text" placeholder="Cari nama produk..." class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"></div><select class="rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(tipeFilter.value) ? ssrLooseContain(tipeFilter.value, "all") : ssrLooseEqual(tipeFilter.value, "all")) ? " selected" : ""}>Semua tipe</option><option value="masuk"${ssrIncludeBooleanAttr(Array.isArray(tipeFilter.value) ? ssrLooseContain(tipeFilter.value, "masuk") : ssrLooseEqual(tipeFilter.value, "masuk")) ? " selected" : ""}>Stok Masuk</option><option value="keluar"${ssrIncludeBooleanAttr(Array.isArray(tipeFilter.value) ? ssrLooseContain(tipeFilter.value, "keluar") : ssrLooseEqual(tipeFilter.value, "keluar")) ? " selected" : ""}>Stok Keluar</option><option value="penyesuaian"${ssrIncludeBooleanAttr(Array.isArray(tipeFilter.value) ? ssrLooseContain(tipeFilter.value, "penyesuaian") : ssrLooseEqual(tipeFilter.value, "penyesuaian")) ? " selected" : ""}>Penyesuaian</option><option value="jual"${ssrIncludeBooleanAttr(Array.isArray(tipeFilter.value) ? ssrLooseContain(tipeFilter.value, "jual") : ssrLooseEqual(tipeFilter.value, "jual")) ? " selected" : ""}>Penjualan</option><option value="produksi"${ssrIncludeBooleanAttr(Array.isArray(tipeFilter.value) ? ssrLooseContain(tipeFilter.value, "produksi") : ssrLooseEqual(tipeFilter.value, "produksi")) ? " selected" : ""}>Produksi</option><option value="awal"${ssrIncludeBooleanAttr(Array.isArray(tipeFilter.value) ? ssrLooseContain(tipeFilter.value, "awal") : ssrLooseEqual(tipeFilter.value, "awal")) ? " selected" : ""}>Stok Awal</option></select></div><div class="overflow-x-auto"><table class="w-full border-collapse text-left text-sm"><thead><tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"><th class="px-6 py-4 font-semibold text-muted-foreground">Tanggal</th><th class="px-6 py-4 font-semibold text-muted-foreground">Produk</th><th class="px-6 py-4 font-semibold text-muted-foreground">Tipe</th><th class="px-6 py-4 text-right font-semibold text-muted-foreground">Perubahan</th><th class="px-6 py-4 text-right font-semibold text-muted-foreground">Sebelum → Sesudah</th><th class="px-6 py-4 font-semibold text-muted-foreground">Keterangan</th><th class="px-6 py-4 font-semibold text-muted-foreground">Oleh</th></tr></thead><tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">`);
			if (unref(paginatedMutasis).length === 0) {
				_push(`<tr><td colspan="7" class="px-6 py-12 text-center text-muted-foreground">`);
				_push(ssrRenderComponent(unref(History), { class: "mx-auto mb-3 h-10 w-10 opacity-30" }, null, _parent));
				_push(`<p class="font-medium">Belum ada riwayat mutasi stok.</p></td></tr>`);
			} else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(unref(paginatedMutasis), (mutasi) => {
				_push(`<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"><td class="whitespace-nowrap px-6 py-4 text-muted-foreground">${ssrInterpolate(mutasi.tanggal)}</td><td class="px-6 py-4 font-medium">${ssrInterpolate(mutasi.produk_nama)}</td><td class="px-6 py-4"><span class="${ssrRenderClass(["inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", tipeBadge[mutasi.tipe] ?? tipeBadge.awal])}">${ssrInterpolate(mutasi.tipe_label)}</span></td><td class="${ssrRenderClass(["px-6 py-4 text-right font-semibold tabular-nums", mutasi.jumlah > 0 ? "text-emerald-600 dark:text-emerald-400" : mutasi.jumlah < 0 ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"])}">${ssrInterpolate(mutasi.jumlah > 0 ? "+" : "")}${ssrInterpolate(formatStok(mutasi.jumlah))}</td><td class="whitespace-nowrap px-6 py-4 text-right text-muted-foreground tabular-nums">${ssrInterpolate(formatStok(mutasi.stok_sebelum))} → <span class="font-semibold text-foreground">${ssrInterpolate(formatStok(mutasi.stok_sesudah))}</span></td><td class="px-6 py-4 text-muted-foreground">${ssrInterpolate(mutasi.keterangan ?? "—")}</td><td class="whitespace-nowrap px-6 py-4 text-muted-foreground">${ssrInterpolate(mutasi.user_nama)}</td></tr>`);
			});
			_push(`<!--]--></tbody></table></div>`);
			_push(ssrRenderComponent(Pagination_default, {
				"current-page": unref(pageMutasi),
				"total-pages": unref(totalPagesMutasi),
				"total-items": unref(totalMutasi),
				"start-index": unref(startMutasi),
				"end-index": unref(endMutasi),
				"per-page": unref(perPageMutasi),
				"visible-pages": unref(visiblePagesMutasi),
				"onUpdate:currentPage": unref(goToPageMutasi),
				"onUpdate:perPage": ($event) => perPageMutasi.value = $event
			}, null, _parent));
			_push(`<p class="border-t border-sidebar-border/70 px-6 py-3 text-xs text-muted-foreground dark:border-sidebar-border"> Menampilkan hingga 200 mutasi terbaru. </p></div></div>`);
			_push(ssrRenderComponent(BodyTeleport_default, null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) if (modalMode.value) {
						_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"${_scopeId}><div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border"${_scopeId}><div class="flex items-start justify-between gap-4"${_scopeId}><div${_scopeId}><h2 class="text-xl font-semibold"${_scopeId}>${ssrInterpolate(modalMeta[modalMode.value].title)}</h2><p class="mt-1 text-sm text-muted-foreground"${_scopeId}>${ssrInterpolate(modalMeta[modalMode.value].desc)}</p></div><button class="rounded-full p-2 text-muted-foreground transition hover:bg-slate-100 dark:hover:bg-zinc-800"${_scopeId}>`);
						_push(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`</button></div><div class="mt-6 grid gap-4"${_scopeId}>`);
						if (__props.produks.length === 0) _push(`<div class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400"${_scopeId}> Belum ada produk berstok. Tambahkan produk dulu di menu Data Produk. </div>`);
						else _push(`<!---->`);
						_push(`<div${_scopeId}><label class="mb-2 block text-sm font-medium"${_scopeId}>Produk</label>`);
						if (selectedProduk.value) {
							_push(`<div class="flex items-center justify-between gap-3 rounded-xl border border-indigo-500/40 bg-indigo-500/5 p-3"${_scopeId}><div class="flex min-w-0 items-center gap-3"${_scopeId}><div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Check), { class: "h-5 w-5" }, null, _parent, _scopeId));
							_push(`</div><div class="min-w-0"${_scopeId}><p class="truncate font-semibold"${_scopeId}>${ssrInterpolate(selectedProduk.value.nama)}</p><p class="text-xs text-muted-foreground"${_scopeId}> Stok sistem ${ssrInterpolate(formatStok(selectedProduk.value.stok, selectedProduk.value.satuan))} · ${ssrInterpolate(selectedProduk.value.kategori ?? "Tanpa kategori")}</p></div></div><button type="button" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800"${_scopeId}>`);
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
									_push(`<button type="button" class="flex w-full items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5"${_scopeId}><span class="min-w-0 truncate text-sm font-medium"${_scopeId}>${ssrInterpolate(p.nama)}</span><span class="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground"${_scopeId}> Stok ${ssrInterpolate(formatStok(p.stok, p.satuan))}</span></button>`);
								});
								_push(`<!--]--></div>`);
							}
							_push(`</div>`);
						} else _push(`<!---->`);
						if (unref(form).errors.id_produk) _push(`<p class="mt-2 text-sm text-rose-600"${_scopeId}>${ssrInterpolate(unref(form).errors.id_produk)}</p>`);
						else _push(`<!---->`);
						_push(`</div>`);
						if (modalMode.value === "masuk") {
							_push(`<!--[--><div${_scopeId}><label class="mb-2 block text-sm font-medium"${_scopeId}>Jumlah Masuk${ssrInterpolate(selectedProduk.value ? ` (${selectedProduk.value.satuan})` : "")}</label><input${ssrRenderAttr("value", unref(form).jumlah)} type="number" min="0" step="any" placeholder="0" class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-sidebar-border"${_scopeId}>`);
							if (unref(form).errors.jumlah) _push(`<p class="mt-2 text-sm text-rose-600"${_scopeId}>${ssrInterpolate(unref(form).errors.jumlah)}</p>`);
							else _push(`<!---->`);
							_push(`</div>`);
							if (!selectedProduk.value || selectedProduk.value.jenis === "beli") {
								_push(`<div${_scopeId}><label class="mb-2 block text-sm font-medium"${_scopeId}>Harga Beli / Modal Baru (opsional)</label><div class="relative"${_scopeId}><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground"${_scopeId}>Rp</span><input${ssrRenderAttr("value", unref(form).harga_beli)} type="number" min="0" placeholder="Kosongkan jika harga beli tidak berubah" class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-sidebar-border"${_scopeId}></div><p class="mt-1 text-xs text-muted-foreground"${_scopeId}>Isi bila harga beli dari supplier berubah — modal produk akan diperbarui.</p>`);
								if (unref(form).errors.harga_beli) _push(`<p class="mt-2 text-sm text-rose-600"${_scopeId}>${ssrInterpolate(unref(form).errors.harga_beli)}</p>`);
								else _push(`<!---->`);
								_push(`</div>`);
							} else _push(`<div class="rounded-lg border border-sky-500/30 bg-sky-500/10 p-3 text-xs text-sky-700 dark:text-sky-400"${_scopeId}> Produk buatan sendiri — modal dikelola lewat menu <strong${_scopeId}>Produksi</strong> (batch costing), jadi tidak diubah di sini. </div>`);
							_push(`<!--]-->`);
						} else if (modalMode.value === "keluar") {
							_push(`<!--[--><div${_scopeId}><label class="mb-2 block text-sm font-medium"${_scopeId}>Jumlah Keluar${ssrInterpolate(selectedProduk.value ? ` (${selectedProduk.value.satuan})` : "")}</label><input${ssrRenderAttr("value", unref(form).jumlah)} type="number" min="0" step="any" placeholder="0" class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-rose-500 focus:outline-none dark:border-sidebar-border"${_scopeId}>`);
							if (unref(form).errors.jumlah) _push(`<p class="mt-2 text-sm text-rose-600"${_scopeId}>${ssrInterpolate(unref(form).errors.jumlah)}</p>`);
							else _push(`<!---->`);
							_push(`</div><div${_scopeId}><label class="mb-2 block text-sm font-medium"${_scopeId}>Alasan</label><select class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-rose-500 focus:outline-none dark:border-sidebar-border"${_scopeId}><!--[-->`);
							ssrRenderList(alasanOptions, (opt) => {
								_push(`<option${ssrRenderAttr("value", opt.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).alasan) ? ssrLooseContain(unref(form).alasan, opt.value) : ssrLooseEqual(unref(form).alasan, opt.value)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(opt.label)}</option>`);
							});
							_push(`<!--]--></select>`);
							if (unref(form).errors.alasan) _push(`<p class="mt-2 text-sm text-rose-600"${_scopeId}>${ssrInterpolate(unref(form).errors.alasan)}</p>`);
							else _push(`<!---->`);
							_push(`</div><!--]-->`);
						} else {
							_push(`<!--[--><div${_scopeId}><label class="mb-2 block text-sm font-medium"${_scopeId}>Stok Fisik (hasil hitung)${ssrInterpolate(selectedProduk.value ? ` (${selectedProduk.value.satuan})` : "")}</label><input${ssrRenderAttr("value", unref(form).stok_fisik)} type="number" min="0" step="any" placeholder="0" class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-amber-500 focus:outline-none dark:border-sidebar-border"${_scopeId}>`);
							if (unref(form).errors.stok_fisik) _push(`<p class="mt-2 text-sm text-rose-600"${_scopeId}>${ssrInterpolate(unref(form).errors.stok_fisik)}</p>`);
							else _push(`<!---->`);
							_push(`</div>`);
							if (selectedProduk.value && unref(form).stok_fisik !== null) _push(`<div class="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm"${_scopeId}> Selisih penyesuaian: <strong class="${ssrRenderClass(selisihOpname.value > 0 ? "text-emerald-600 dark:text-emerald-400" : selisihOpname.value < 0 ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground")}"${_scopeId}>${ssrInterpolate(selisihOpname.value > 0 ? "+" : "")}${ssrInterpolate(formatStok(selisihOpname.value, selectedProduk.value.satuan))}</strong></div>`);
							else _push(`<!---->`);
							_push(`<!--]-->`);
						}
						_push(`<div${_scopeId}><label class="mb-2 block text-sm font-medium"${_scopeId}>Catatan (opsional)</label><input${ssrRenderAttr("value", unref(form).keterangan)} type="text" placeholder="Mis. nota #123, supplier, dsb." class="w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"${_scopeId}>`);
						if (unref(form).errors.keterangan) _push(`<p class="mt-2 text-sm text-rose-600"${_scopeId}>${ssrInterpolate(unref(form).errors.keterangan)}</p>`);
						else _push(`<!---->`);
						_push(`</div></div><div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end"${_scopeId}><button class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800" type="button"${_scopeId}> Batal </button><button class="${ssrRenderClass(["inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50", modalMode.value === "masuk" ? "bg-emerald-600 hover:bg-emerald-500" : modalMode.value === "keluar" ? "bg-rose-600 hover:bg-rose-500" : "bg-amber-600 hover:bg-amber-500"])}" type="button"${ssrIncludeBooleanAttr(unref(form).processing || __props.produks.length === 0 || unref(form).id_produk === "") ? " disabled" : ""}${_scopeId}>`);
						_push(ssrRenderComponent(unref(Save), { class: "h-4 w-4" }, null, _parent, _scopeId));
						_push(` ${ssrInterpolate(modalMeta[modalMode.value].submit)}</button></div></div></div>`);
					} else _push(`<!---->`);
					else return [modalMode.value ? (openBlock(), createBlock("div", {
						key: 0,
						class: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
					}, [createVNode("div", { class: "max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border" }, [
						createVNode("div", { class: "flex items-start justify-between gap-4" }, [createVNode("div", null, [createVNode("h2", { class: "text-xl font-semibold" }, toDisplayString(modalMeta[modalMode.value].title), 1), createVNode("p", { class: "mt-1 text-sm text-muted-foreground" }, toDisplayString(modalMeta[modalMode.value].desc), 1)]), createVNode("button", {
							class: "rounded-full p-2 text-muted-foreground transition hover:bg-slate-100 dark:hover:bg-zinc-800",
							onClick: closeModal
						}, [createVNode(unref(X), { class: "h-5 w-5" })])]),
						createVNode("div", { class: "mt-6 grid gap-4" }, [
							__props.produks.length === 0 ? (openBlock(), createBlock("div", {
								key: 0,
								class: "rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400"
							}, " Belum ada produk berstok. Tambahkan produk dulu di menu Data Produk. ")) : createCommentVNode("", true),
							createVNode("div", null, [
								createVNode("label", { class: "mb-2 block text-sm font-medium" }, "Produk"),
								selectedProduk.value ? (openBlock(), createBlock("div", {
									key: 0,
									class: "flex items-center justify-between gap-3 rounded-xl border border-indigo-500/40 bg-indigo-500/5 p-3"
								}, [createVNode("div", { class: "flex min-w-0 items-center gap-3" }, [createVNode("div", { class: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white" }, [createVNode(unref(Check), { class: "h-5 w-5" })]), createVNode("div", { class: "min-w-0" }, [createVNode("p", { class: "truncate font-semibold" }, toDisplayString(selectedProduk.value.nama), 1), createVNode("p", { class: "text-xs text-muted-foreground" }, " Stok sistem " + toDisplayString(formatStok(selectedProduk.value.stok, selectedProduk.value.satuan)) + " · " + toDisplayString(selectedProduk.value.kategori ?? "Tanpa kategori"), 1)])]), createVNode("button", {
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
									}, [createVNode("span", { class: "min-w-0 truncate text-sm font-medium" }, toDisplayString(p.nama), 1), createVNode("span", { class: "shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground" }, " Stok " + toDisplayString(formatStok(p.stok, p.satuan)), 1)], 8, ["onClick"]);
								}), 128))]))])) : createCommentVNode("", true),
								unref(form).errors.id_produk ? (openBlock(), createBlock("p", {
									key: 2,
									class: "mt-2 text-sm text-rose-600"
								}, toDisplayString(unref(form).errors.id_produk), 1)) : createCommentVNode("", true)
							]),
							modalMode.value === "masuk" ? (openBlock(), createBlock(Fragment, { key: 1 }, [createVNode("div", null, [
								createVNode("label", { class: "mb-2 block text-sm font-medium" }, "Jumlah Masuk" + toDisplayString(selectedProduk.value ? ` (${selectedProduk.value.satuan})` : ""), 1),
								withDirectives(createVNode("input", {
									"onUpdate:modelValue": ($event) => unref(form).jumlah = $event,
									type: "number",
									min: "0",
									step: "any",
									placeholder: "0",
									class: "w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-sidebar-border"
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
							]), !selectedProduk.value || selectedProduk.value.jenis === "beli" ? (openBlock(), createBlock("div", { key: 0 }, [
								createVNode("label", { class: "mb-2 block text-sm font-medium" }, "Harga Beli / Modal Baru (opsional)"),
								createVNode("div", { class: "relative" }, [createVNode("span", { class: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground" }, "Rp"), withDirectives(createVNode("input", {
									"onUpdate:modelValue": ($event) => unref(form).harga_beli = $event,
									type: "number",
									min: "0",
									placeholder: "Kosongkan jika harga beli tidak berubah",
									class: "w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-sidebar-border"
								}, null, 8, ["onUpdate:modelValue"]), [[
									vModelText,
									unref(form).harga_beli,
									void 0,
									{ number: true }
								]])]),
								createVNode("p", { class: "mt-1 text-xs text-muted-foreground" }, "Isi bila harga beli dari supplier berubah — modal produk akan diperbarui."),
								unref(form).errors.harga_beli ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-2 text-sm text-rose-600"
								}, toDisplayString(unref(form).errors.harga_beli), 1)) : createCommentVNode("", true)
							])) : (openBlock(), createBlock("div", {
								key: 1,
								class: "rounded-lg border border-sky-500/30 bg-sky-500/10 p-3 text-xs text-sky-700 dark:text-sky-400"
							}, [
								createTextVNode(" Produk buatan sendiri — modal dikelola lewat menu "),
								createVNode("strong", null, "Produksi"),
								createTextVNode(" (batch costing), jadi tidak diubah di sini. ")
							]))], 64)) : modalMode.value === "keluar" ? (openBlock(), createBlock(Fragment, { key: 2 }, [createVNode("div", null, [
								createVNode("label", { class: "mb-2 block text-sm font-medium" }, "Jumlah Keluar" + toDisplayString(selectedProduk.value ? ` (${selectedProduk.value.satuan})` : ""), 1),
								withDirectives(createVNode("input", {
									"onUpdate:modelValue": ($event) => unref(form).jumlah = $event,
									type: "number",
									min: "0",
									step: "any",
									placeholder: "0",
									class: "w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-rose-500 focus:outline-none dark:border-sidebar-border"
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
							]), createVNode("div", null, [
								createVNode("label", { class: "mb-2 block text-sm font-medium" }, "Alasan"),
								withDirectives(createVNode("select", {
									"onUpdate:modelValue": ($event) => unref(form).alasan = $event,
									class: "w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-rose-500 focus:outline-none dark:border-sidebar-border"
								}, [(openBlock(), createBlock(Fragment, null, renderList(alasanOptions, (opt) => {
									return createVNode("option", {
										key: opt.value,
										value: opt.value
									}, toDisplayString(opt.label), 9, ["value"]);
								}), 64))], 8, ["onUpdate:modelValue"]), [[vModelSelect, unref(form).alasan]]),
								unref(form).errors.alasan ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-2 text-sm text-rose-600"
								}, toDisplayString(unref(form).errors.alasan), 1)) : createCommentVNode("", true)
							])], 64)) : (openBlock(), createBlock(Fragment, { key: 3 }, [createVNode("div", null, [
								createVNode("label", { class: "mb-2 block text-sm font-medium" }, "Stok Fisik (hasil hitung)" + toDisplayString(selectedProduk.value ? ` (${selectedProduk.value.satuan})` : ""), 1),
								withDirectives(createVNode("input", {
									"onUpdate:modelValue": ($event) => unref(form).stok_fisik = $event,
									type: "number",
									min: "0",
									step: "any",
									placeholder: "0",
									class: "w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-amber-500 focus:outline-none dark:border-sidebar-border"
								}, null, 8, ["onUpdate:modelValue"]), [[
									vModelText,
									unref(form).stok_fisik,
									void 0,
									{ number: true }
								]]),
								unref(form).errors.stok_fisik ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-2 text-sm text-rose-600"
								}, toDisplayString(unref(form).errors.stok_fisik), 1)) : createCommentVNode("", true)
							]), selectedProduk.value && unref(form).stok_fisik !== null ? (openBlock(), createBlock("div", {
								key: 0,
								class: "rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm"
							}, [createTextVNode(" Selisih penyesuaian: "), createVNode("strong", { class: selisihOpname.value > 0 ? "text-emerald-600 dark:text-emerald-400" : selisihOpname.value < 0 ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground" }, toDisplayString(selisihOpname.value > 0 ? "+" : "") + toDisplayString(formatStok(selisihOpname.value, selectedProduk.value.satuan)), 3)])) : createCommentVNode("", true)], 64)),
							createVNode("div", null, [
								createVNode("label", { class: "mb-2 block text-sm font-medium" }, "Catatan (opsional)"),
								withDirectives(createVNode("input", {
									"onUpdate:modelValue": ($event) => unref(form).keterangan = $event,
									type: "text",
									placeholder: "Mis. nota #123, supplier, dsb.",
									class: "w-full rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
								}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).keterangan]]),
								unref(form).errors.keterangan ? (openBlock(), createBlock("p", {
									key: 0,
									class: "mt-2 text-sm text-rose-600"
								}, toDisplayString(unref(form).errors.keterangan), 1)) : createCommentVNode("", true)
							])
						]),
						createVNode("div", { class: "mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end" }, [createVNode("button", {
							class: "rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-slate-100 dark:border-sidebar-border dark:hover:bg-zinc-800",
							type: "button",
							onClick: closeModal
						}, " Batal "), createVNode("button", {
							class: ["inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50", modalMode.value === "masuk" ? "bg-emerald-600 hover:bg-emerald-500" : modalMode.value === "keluar" ? "bg-rose-600 hover:bg-rose-500" : "bg-amber-600 hover:bg-amber-500"],
							type: "button",
							disabled: unref(form).processing || __props.produks.length === 0 || unref(form).id_produk === "",
							onClick: submitForm
						}, [createVNode(unref(Save), { class: "h-4 w-4" }), createTextVNode(" " + toDisplayString(modalMeta[modalMode.value].submit), 1)], 10, ["disabled"])])
					])])) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/Stok.vue
var _sfc_setup = Stok_vue_vue_type_script_setup_true_lang_default.setup;
Stok_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/Stok.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Stok_default = Stok_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Stok_default as default };

//# sourceMappingURL=Stok-BxdvcMsh.js.map