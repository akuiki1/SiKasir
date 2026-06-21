import { n as formatRupiah } from "./format-Cs1IUSJx.js";
import { t as Pagination_default } from "./Pagination-CxLXQdL4.js";
import { Head, router } from "@inertiajs/vue3";
import { computed, defineComponent, ref, unref, useSSRContext, watch } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { Clock, DollarSign, FileText, Filter, Printer, Search } from "lucide-vue-next";
//#region resources/js/pages/kasir/Riwayat.vue?vue&type=script&setup=true&lang.ts
var Riwayat_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Riwayat Transaksi",
		href: "/kasir/riwayat"
	}] },
	__name: "Riwayat",
	__ssrInlineRender: true,
	props: {
		transaksis: {},
		stats: {},
		filters: {}
	},
	setup(__props) {
		const props = __props;
		const searchQuery = ref(props.filters.search ?? "");
		let searchTimer;
		watch(searchQuery, (value) => {
			if (searchTimer) clearTimeout(searchTimer);
			searchTimer = setTimeout(() => reload({
				search: value,
				page: 1
			}), 350);
		});
		function buildParams(overrides = {}) {
			const params = {
				search: searchQuery.value || void 0,
				per_page: props.filters.per_page,
				start_date: props.filters.start_date || void 0,
				end_date: props.filters.end_date || void 0,
				...overrides
			};
			const cleaned = {};
			Object.entries(params).forEach(([key, value]) => {
				if (value !== void 0 && value !== "") cleaned[key] = value;
			});
			return cleaned;
		}
		function reload(overrides = {}) {
			router.get("/kasir/riwayat", buildParams(overrides), {
				preserveState: true,
				preserveScroll: true,
				replace: true
			});
		}
		function goToPage(page) {
			reload({ page });
		}
		function changePerPage(value) {
			reload({
				per_page: value,
				page: 1
			});
		}
		const visiblePages = computed(() => {
			const pages = [];
			const total = props.transaksis.last_page;
			const current = props.transaksis.current_page;
			if (total <= 7) for (let i = 1; i <= total; i++) pages.push(i);
			else {
				pages.push(1);
				if (current > 3) pages.push(-1);
				for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
				if (current < total - 2) pages.push(-1);
				pages.push(total);
			}
			return pages;
		});
		function formatMetode(metode) {
			return {
				cash: "Tunai",
				qris: "QRIS",
				transfer: "Transfer"
			}[metode] ?? metode;
		}
		ref(false);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Riwayat Transaksi - Kasir" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 p-6"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-3xl font-extrabold tracking-tight">Riwayat Transaksi Anda</h1><p class="text-sm text-muted-foreground mt-1"> Daftar seluruh transaksi yang Anda proses saat ini. </p></div><button type="button" class="inline-flex items-center justify-center gap-2 rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800/40 dark:border-sidebar-border">`);
			_push(ssrRenderComponent(unref(Printer), { class: "h-4 w-4" }, null, _parent));
			_push(` Cetak Laporan Sesi </button></div><div class="grid gap-4 md:grid-cols-3"><div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border flex items-center gap-4 shadow-sm"><div class="rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">`);
			_push(ssrRenderComponent(unref(DollarSign), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Total Penjualan Anda</span><h3 class="text-xl font-bold mt-0.5">${ssrInterpolate(unref(formatRupiah)(props.stats.total_penjualan))}</h3></div></div><div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border flex items-center gap-4 shadow-sm"><div class="rounded-lg bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">`);
			_push(ssrRenderComponent(unref(Clock), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Total Transaksi</span><h3 class="text-xl font-bold mt-0.5">${ssrInterpolate(props.stats.total_transaksi)} Transaksi</h3></div></div><div class="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border flex items-center gap-4 shadow-sm"><div class="rounded-lg bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400 border border-blue-500/20">`);
			_push(ssrRenderComponent(unref(Printer), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Struk Dicetak</span><h3 class="text-xl font-bold mt-0.5">${ssrInterpolate(props.stats.total_struk)} Struk</h3></div></div></div><div class="rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border overflow-hidden"><div class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border"><div class="relative flex-1 max-w-md">`);
			_push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, null, _parent));
			_push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Cari transaksi berdasarkan ID atau metode..." class="w-full rounded-lg border border-sidebar-border/70 bg-background pl-9 pr-4 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"></div><div class="flex gap-2"><button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800/40 dark:border-sidebar-border">`);
			_push(ssrRenderComponent(unref(Filter), { class: "h-4 w-4" }, null, _parent));
			_push(` Semua Metode </button></div></div><div class="overflow-x-auto"><table class="w-full border-collapse text-left text-sm"><thead><tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:bg-zinc-800/20 dark:border-sidebar-border"><th class="px-6 py-4 font-semibold text-muted-foreground">ID Transaksi</th><th class="px-6 py-4 font-semibold text-muted-foreground">Jumlah Barang</th><th class="px-6 py-4 font-semibold text-muted-foreground">Total Penjualan</th><th class="px-6 py-4 font-semibold text-muted-foreground">Metode Bayar</th><th class="px-6 py-4 font-semibold text-muted-foreground">Status</th><th class="px-6 py-4 font-semibold text-muted-foreground">Waktu Selesai</th><th class="px-6 py-4 font-semibold text-muted-foreground text-right">Aksi</th></tr></thead><tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">`);
			if (props.transaksis.data.length === 0) _push(`<tr class="bg-background text-center text-sm text-muted-foreground"><td colspan="7" class="px-6 py-8"> Tidak ada transaksi yang cocok. </td></tr>`);
			else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(props.transaksis.data, (trx) => {
				_push(`<tr class="hover:bg-slate-50/50 dark:hover:bg-zinc-800/10 transition-colors"><td class="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">${ssrInterpolate(trx.kode)}</td><td class="px-6 py-4 text-muted-foreground">${ssrInterpolate(trx.jumlah_item)} item</td><td class="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">${ssrInterpolate(unref(formatRupiah)(trx.total_harga))}</td><td class="px-6 py-4 text-muted-foreground">${ssrInterpolate(formatMetode(trx.metode_pembayaran))}</td><td class="px-6 py-4"><span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"> Sukses </span></td><td class="px-6 py-4 text-muted-foreground">${ssrInterpolate(trx.waktu)} · ${ssrInterpolate(trx.tanggal)}</td><td class="px-6 py-4 text-right"><div class="inline-flex gap-2 justify-end"><button type="button" class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-indigo-600 transition-colors">`);
				_push(ssrRenderComponent(unref(Printer), { class: "h-4 w-4" }, null, _parent));
				_push(`</button><button type="button" class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-indigo-600 transition-colors">`);
				_push(ssrRenderComponent(unref(FileText), { class: "h-4 w-4" }, null, _parent));
				_push(`</button></div></td></tr>`);
			});
			_push(`<!--]--></tbody></table></div>`);
			_push(ssrRenderComponent(Pagination_default, {
				"current-page": props.transaksis.current_page,
				"total-pages": props.transaksis.last_page,
				"total-items": props.transaksis.total,
				"start-index": props.transaksis.from ?? 0,
				"end-index": props.transaksis.to ?? 0,
				"per-page": props.transaksis.per_page,
				"visible-pages": visiblePages.value,
				"onUpdate:currentPage": goToPage,
				"onUpdate:perPage": changePerPage
			}, null, _parent));
			_push(`</div></div><!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/kasir/Riwayat.vue
var _sfc_setup = Riwayat_vue_vue_type_script_setup_true_lang_default.setup;
Riwayat_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/kasir/Riwayat.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Riwayat_default = Riwayat_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Riwayat_default as default };

//# sourceMappingURL=Riwayat-2U-hF5TE.js.map