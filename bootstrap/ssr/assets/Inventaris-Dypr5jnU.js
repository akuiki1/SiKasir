import { n as formatNumber, r as formatRupiah } from "./format-Cq6R5JhR.js";
import { Head } from "@inertiajs/vue3";
import { computed, createVNode, defineComponent, ref, resolveDynamicComponent, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderVNode } from "vue/server-renderer";
import { AlertTriangle, Boxes, Calendar, Flame, Mail, PackageX, Printer, Sheet, Snowflake, Warehouse } from "lucide-vue-next";
//#region resources/js/pages/admin/laporan/Inventaris.vue?vue&type=script&setup=true&lang.ts
var Inventaris_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Laporan",
		href: "/admin/laporan/inventaris"
	}, {
		title: "Stok & Inventaris",
		href: "/admin/laporan/inventaris"
	}] },
	__name: "Inventaris",
	__ssrInlineRender: true,
	props: {
		date_range: {},
		period_days: {},
		summary: {},
		totals: {},
		products: {}
	},
	setup(__props) {
		const props = __props;
		const classMeta = {
			fast: {
				label: "Fast-moving",
				bar: "bg-emerald-500",
				dot: "bg-emerald-500",
				icon: Flame,
				chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
			},
			slow: {
				label: "Slow-moving",
				bar: "bg-amber-500",
				dot: "bg-amber-500",
				icon: Snowflake,
				chip: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
			},
			dead: {
				label: "Dead-stock",
				bar: "bg-rose-500",
				dot: "bg-rose-500",
				icon: PackageX,
				chip: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
			}
		};
		const showFilter = ref(false);
		const customStart = ref(props.date_range.start_date);
		const customEnd = ref(props.date_range.end_date);
		const PRESETS = [
			{
				days: 30,
				label: "30 Hari"
			},
			{
				days: 90,
				label: "90 Hari"
			},
			{
				days: 180,
				label: "6 Bulan"
			},
			{
				days: 365,
				label: "1 Tahun"
			}
		];
		function toLocalISO(date) {
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
		}
		const todayISO = toLocalISO(/* @__PURE__ */ new Date());
		const endsToday = computed(() => props.date_range.end_date === todayISO);
		const activePreset = computed(() => endsToday.value ? PRESETS.find((p) => p.days === props.period_days) ?? null : null);
		const filterBadgeLabel = computed(() => activePreset.value?.label ?? `${props.period_days} Hari`);
		const KELAS_ORDER = [
			"fast",
			"slow",
			"dead"
		];
		const distByCount = computed(() => KELAS_ORDER.map((kelas) => ({
			kelas,
			value: props.summary[kelas].count,
			pct: props.totals.products > 0 ? props.summary[kelas].count / props.totals.products * 100 : 0
		})));
		const distByValue = computed(() => KELAS_ORDER.map((kelas) => ({
			kelas,
			value: props.summary[kelas].stock_value,
			pct: props.totals.stock_value > 0 ? props.summary[kelas].stock_value / props.totals.stock_value * 100 : 0
		})));
		const activeTab = ref("fast");
		const tabs = [
			{
				key: "fast",
				icon: Flame
			},
			{
				key: "slow",
				icon: Snowflake
			},
			{
				key: "dead",
				icon: PackageX
			}
		];
		const fastRows = computed(() => props.products.filter((p) => p.kelas === "fast").sort((a, b) => b.qty - a.qty));
		const slowRows = computed(() => props.products.filter((p) => p.kelas === "slow").sort((a, b) => b.stock_value - a.stock_value));
		const deadRows = computed(() => props.products.filter((p) => p.kelas === "dead").sort((a, b) => b.stock_value - a.stock_value));
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
		function formatDate(value) {
			if (!value) return "Belum pernah";
			const [y, m, d] = value.slice(0, 10).split("-");
			return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
		}
		function qtyLabel(row) {
			return `${formatNumber(row.qty)} ${row.satuan}`;
		}
		computed(() => `${props.date_range.start_date} s/d ${props.date_range.end_date}`);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Stok & Inventaris - Admin" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 bg-slate-50 p-4 text-slate-950 sm:p-6 dark:bg-zinc-950 dark:text-slate-100"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400"> Laporan </p><h1 class="mt-1 text-2xl font-bold tracking-tight md:text-3xl"> Manajemen Stok &amp; Inventaris </h1><p class="mt-1 text-sm text-slate-500 dark:text-slate-400"> Analisis ABC perputaran stok: efisiensi modal yang tertanam di barang dagangan. </p></div><div class="flex flex-wrap items-center gap-2"><div class="relative"><button type="button" class="${ssrRenderClass([showFilter.value ? "border-sky-500 bg-sky-50 text-sky-600 dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-400" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800", "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition"])}">`);
			_push(ssrRenderComponent(unref(Calendar), { class: "h-4 w-4" }, null, _parent));
			_push(`<span class="hidden sm:inline">Periode</span><span class="rounded-md bg-sky-100 px-1.5 py-0.5 text-[11px] font-bold text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">${ssrInterpolate(filterBadgeLabel.value)}</span></button>`);
			if (showFilter.value) {
				_push(`<div class="absolute top-11 right-0 z-50 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"><p class="px-1 pb-2 text-xs font-semibold text-slate-400"> Hitung perputaran dari </p><div class="grid grid-cols-2 gap-1.5"><!--[-->`);
				ssrRenderList(PRESETS, (preset) => {
					_push(`<button type="button" class="${ssrRenderClass([activePreset.value?.days === preset.days ? "bg-sky-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "rounded-lg py-2 text-xs font-semibold transition-all"])}">${ssrInterpolate(preset.label)}</button>`);
				});
				_push(`<!--]--></div><div class="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-zinc-800"><p class="px-1 text-xs font-semibold text-slate-400"> Rentang khusus </p><div class="grid grid-cols-2 gap-2"><label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"> Mulai <input${ssrRenderAttr("value", customStart.value)} type="date" class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 transition outline-none focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100"></label><label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"> Sampai <input${ssrRenderAttr("value", customEnd.value)} type="date" class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 transition outline-none focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100"></label></div><button type="button" class="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-sky-500 text-xs font-semibold text-white transition hover:bg-sky-600">`);
				_push(ssrRenderComponent(unref(Calendar), { class: "h-3 w-3" }, null, _parent));
				_push(` Terapkan </button></div></div>`);
			} else _push(`<!---->`);
			_push(`</div><button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800">`);
			_push(ssrRenderComponent(unref(Printer), { class: "h-4 w-4" }, null, _parent));
			_push(`<span class="hidden sm:inline">Cetak / PDF</span></button><button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800">`);
			_push(ssrRenderComponent(unref(Sheet), { class: "h-4 w-4" }, null, _parent));
			_push(`<span class="hidden sm:inline">Excel</span></button><button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.879-1.017zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path></svg><span class="hidden sm:inline">WhatsApp</span></button><button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800">`);
			_push(ssrRenderComponent(unref(Mail), { class: "h-4 w-4" }, null, _parent));
			_push(`<span class="hidden sm:inline">Email</span></button></div></div>`);
			if (showFilter.value) _push(`<div class="fixed inset-0 z-40"></div>`);
			else _push(`<!---->`);
			_push(`<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400"> Nilai Aset Stok </p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(unref(formatRupiah)(__props.totals.stock_value))}</p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">`);
			_push(ssrRenderComponent(unref(Warehouse), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">${ssrInterpolate(__props.totals.products)} produk berstok · harga modal </p></div><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400"> Fast-moving </p><p class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">${ssrInterpolate(__props.summary.fast.count)} <span class="text-base font-semibold text-slate-400">produk</span></p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">`);
			_push(ssrRenderComponent(unref(Flame), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"> Modal ${ssrInterpolate(unref(formatRupiah)(__props.summary.fast.stock_value))}</p></div><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400"> Slow-moving </p><p class="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">${ssrInterpolate(__props.summary.slow.count)} <span class="text-base font-semibold text-slate-400">produk</span></p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">`);
			_push(ssrRenderComponent(unref(Snowflake), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"> Modal ${ssrInterpolate(unref(formatRupiah)(__props.summary.slow.stock_value))}</p></div><div class="${ssrRenderClass([__props.summary.dead.count > 0 ? "border-rose-200 bg-rose-50/60 dark:border-rose-500/30 dark:bg-rose-500/10" : "border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900", "rounded-lg border p-5 shadow-sm"])}"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400"> Dead-stock </p><p class="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">${ssrInterpolate(__props.summary.dead.count)} <span class="text-base font-semibold text-slate-400">produk</span></p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">`);
			_push(ssrRenderComponent(unref(PackageX), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"> Modal mengendap ${ssrInterpolate(unref(formatRupiah)(__props.summary.dead.stock_value))}</p></div></div>`);
			if (__props.totals.products === 0) {
				_push(`<div class="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 py-20 text-center dark:border-zinc-700">`);
				_push(ssrRenderComponent(unref(Boxes), { class: "h-10 w-10 text-slate-400" }, null, _parent));
				_push(`<p class="text-sm font-medium text-slate-500 dark:text-slate-400"> Belum ada produk berstok untuk dianalisis. </p></div>`);
			} else {
				_push(`<!--[--><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-zinc-800"><h2 class="text-lg font-semibold"> Komposisi Perputaran Stok </h2><div class="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400"><!--[-->`);
				ssrRenderList(KELAS_ORDER, (kelas) => {
					_push(`<span class="inline-flex items-center gap-1.5"><span class="${ssrRenderClass([classMeta[kelas].dot, "h-2.5 w-2.5 rounded-sm"])}"></span>${ssrInterpolate(classMeta[kelas].label)}</span>`);
				});
				_push(`<!--]--></div></div><div class="mt-5 space-y-5"><div><div class="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400"><span>Jumlah Produk</span><span>${ssrInterpolate(__props.totals.products)} produk</span></div><div class="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800"><!--[-->`);
				ssrRenderList(distByCount.value, (seg) => {
					_push(`<div class="${ssrRenderClass([classMeta[seg.kelas].bar, "h-full transition-all"])}" style="${ssrRenderStyle({ width: `${seg.pct}%` })}"${ssrRenderAttr("title", `${classMeta[seg.kelas].label}: ${seg.value} produk`)}></div>`);
				});
				_push(`<!--]--></div></div><div><div class="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400"><span>Nilai Modal Tertanam</span><span>${ssrInterpolate(unref(formatRupiah)(__props.totals.stock_value))}</span></div><div class="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800"><!--[-->`);
				ssrRenderList(distByValue.value, (seg) => {
					_push(`<div class="${ssrRenderClass([classMeta[seg.kelas].bar, "h-full transition-all"])}" style="${ssrRenderStyle({ width: `${seg.pct}%` })}"${ssrRenderAttr("title", `${classMeta[seg.kelas].label}: ${unref(formatRupiah)(seg.value)}`)}></div>`);
				});
				_push(`<!--]--></div>`);
				if (__props.summary.dead.stock_value > 0) _push(`<p class="mt-2 text-xs text-rose-600 dark:text-rose-400">${ssrInterpolate(Math.round(distByValue.value[2].pct))}% modal Anda (${ssrInterpolate(unref(formatRupiah)(__props.summary.dead.stock_value))}) tertahan di produk yang tidak laku. </p>`);
				else _push(`<!---->`);
				_push(`</div></div></section><div class="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><!--[-->`);
				ssrRenderList(tabs, (tab) => {
					_push(`<button type="button" class="${ssrRenderClass([activeTab.value === tab.key ? "bg-sky-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition"])}">`);
					ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tab.icon), { class: "h-4 w-4" }, null), _parent);
					_push(`<span>${ssrInterpolate(classMeta[tab.key].label)}</span><span class="${ssrRenderClass([activeTab.value === tab.key ? "bg-white/20 text-white" : classMeta[tab.key].chip, "rounded-full px-1.5 py-0.5 text-[11px] font-bold"])}">${ssrInterpolate(__props.summary[tab.key].count)}</span></button>`);
				});
				_push(`<!--]--></div>`);
				if (activeTab.value === "fast") {
					_push(`<section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-start gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">`);
					_push(ssrRenderComponent(unref(Flame), { class: "mt-0.5 h-5 w-5 shrink-0" }, null, _parent));
					_push(`<p> Produk paling laku (penyumbang ~80% volume penjualan). Pastikan stok selalu aman — jangan sampai kehabisan saat sedang ramai. </p></div><div class="mt-4 overflow-x-auto"><table class="w-full text-left text-sm"><thead><tr class="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase dark:border-zinc-800 dark:text-slate-400"><th class="pr-3 pb-2 font-semibold">Produk</th><th class="px-2 pb-2 text-right font-semibold"> Terjual </th><th class="px-2 pb-2 text-right font-semibold"> Trx </th><th class="px-2 pb-2 text-right font-semibold"> Omzet </th><th class="px-2 pb-2 text-right font-semibold"> Stok </th><th class="pb-2 pl-2 text-right font-semibold"> Estimasi Habis </th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-zinc-800"><!--[-->`);
					ssrRenderList(fastRows.value, (r) => {
						_push(`<tr><td class="py-3 pr-3"><p class="font-semibold">${ssrInterpolate(r.nama)}</p><p class="text-xs text-slate-400">${ssrInterpolate(r.kategori)}</p></td><td class="px-2 text-right font-medium tabular-nums">${ssrInterpolate(qtyLabel(r))}</td><td class="px-2 text-right text-slate-600 dark:text-slate-300">${ssrInterpolate(r.trx)}</td><td class="px-2 text-right font-medium tabular-nums">${ssrInterpolate(unref(formatRupiah)(r.revenue))}</td><td class="px-2 text-right tabular-nums">${ssrInterpolate(unref(formatNumber)(r.stok))}</td><td class="pl-2 text-right"><span class="${ssrRenderClass([r.stok <= 0 ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300" : (r.days_of_supply ?? 999) <= 7 ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300" : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300", "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums"])}">${ssrInterpolate(r.stok <= 0 ? "Stok habis" : `≈ ${r.days_of_supply} hari`)}</span></td></tr>`);
					});
					_push(`<!--]--></tbody></table>`);
					if (fastRows.value.length === 0) _push(`<p class="py-8 text-center text-sm text-slate-400"> Belum ada produk fast-moving pada periode ini. </p>`);
					else _push(`<!---->`);
					_push(`</div></section>`);
				} else if (activeTab.value === "slow") {
					_push(`<section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">`);
					_push(ssrRenderComponent(unref(Snowflake), { class: "mt-0.5 h-5 w-5 shrink-0" }, null, _parent));
					_push(`<p> Kurang laku — masih terjual tapi lambat. Rem pembelian agar modal tidak menumpuk; pertimbangkan promo bundling untuk mempercepat perputaran. </p></div><div class="mt-4 overflow-x-auto"><table class="w-full text-left text-sm"><thead><tr class="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase dark:border-zinc-800 dark:text-slate-400"><th class="pr-3 pb-2 font-semibold">Produk</th><th class="px-2 pb-2 text-right font-semibold"> Terjual </th><th class="px-2 pb-2 text-right font-semibold"> Omzet </th><th class="px-2 pb-2 text-right font-semibold"> Stok </th><th class="pb-2 pl-2 text-right font-semibold"> Nilai Modal </th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-zinc-800"><!--[-->`);
					ssrRenderList(slowRows.value, (r) => {
						_push(`<tr><td class="py-3 pr-3"><p class="font-semibold">${ssrInterpolate(r.nama)}</p><p class="text-xs text-slate-400">${ssrInterpolate(r.kategori)}</p></td><td class="px-2 text-right font-medium tabular-nums">${ssrInterpolate(qtyLabel(r))}</td><td class="px-2 text-right tabular-nums">${ssrInterpolate(unref(formatRupiah)(r.revenue))}</td><td class="px-2 text-right tabular-nums">${ssrInterpolate(unref(formatNumber)(r.stok))}</td><td class="pl-2 text-right font-medium tabular-nums">${ssrInterpolate(unref(formatRupiah)(r.stock_value))}</td></tr>`);
					});
					_push(`<!--]--></tbody></table>`);
					if (slowRows.value.length === 0) _push(`<p class="py-8 text-center text-sm text-slate-400"> Belum ada produk slow-moving pada periode ini. </p>`);
					else _push(`<!---->`);
					_push(`</div></section>`);
				} else {
					_push(`<section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-start gap-3 rounded-lg bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">`);
					_push(ssrRenderComponent(unref(AlertTriangle), { class: "mt-0.5 h-5 w-5 shrink-0" }, null, _parent));
					_push(`<p> Tidak terjual sama sekali pada periode ini. Modal mengendap <span class="font-bold">${ssrInterpolate(unref(formatRupiah)(__props.summary.dead.stock_value))}</span> — segera diskon atau cuci gudang agar uang berputar kembali. </p></div><div class="mt-4 overflow-x-auto"><table class="w-full text-left text-sm"><thead><tr class="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase dark:border-zinc-800 dark:text-slate-400"><th class="pr-3 pb-2 font-semibold">Produk</th><th class="px-2 pb-2 text-right font-semibold"> Stok </th><th class="px-2 pb-2 text-right font-semibold"> Nilai Modal </th><th class="pb-2 pl-2 text-right font-semibold"> Terakhir Terjual </th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-zinc-800"><!--[-->`);
					ssrRenderList(deadRows.value, (r) => {
						_push(`<tr><td class="py-3 pr-3"><p class="font-semibold">${ssrInterpolate(r.nama)}</p><p class="text-xs text-slate-400">${ssrInterpolate(r.kategori)}</p></td><td class="px-2 text-right tabular-nums">${ssrInterpolate(unref(formatNumber)(r.stok))} ${ssrInterpolate(r.satuan)}</td><td class="${ssrRenderClass([r.stock_value > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-400", "px-2 text-right font-semibold tabular-nums"])}">${ssrInterpolate(unref(formatRupiah)(r.stock_value))}</td><td class="pl-2 text-right text-slate-600 dark:text-slate-300">${ssrInterpolate(formatDate(r.last_sold))}</td></tr>`);
					});
					_push(`<!--]--></tbody></table>`);
					if (deadRows.value.length === 0) _push(`<p class="py-8 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400"> Bagus! Semua produk berstok terjual pada periode ini. </p>`);
					else _push(`<!---->`);
					_push(`</div></section>`);
				}
				_push(`<div class="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-slate-300">`);
				_push(ssrRenderComponent(unref(AlertTriangle), { class: "mt-0.5 h-4 w-4 shrink-0 text-slate-400" }, null, _parent));
				_push(`<p> Klasifikasi dihitung dari penjualan ${ssrInterpolate(__props.period_days)} hari terakhir. <b>Fast-moving</b> = produk penyumbang ~80% volume penjualan teratas; <b>Slow-moving</b> = sisa produk yang masih terjual; <b>Dead-stock</b> = tidak terjual sama sekali pada periode ini. <b>Nilai modal</b> = stok × harga modal. <b>Estimasi habis</b> = perkiraan stok mencukupi berapa hari pada laju penjualan saat ini. Produk jasa tidak diikutkan (tidak mengelola stok). </p></div><!--]-->`);
			}
			_push(`</div><!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/laporan/Inventaris.vue
var _sfc_setup = Inventaris_vue_vue_type_script_setup_true_lang_default.setup;
Inventaris_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/laporan/Inventaris.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Inventaris_default = Inventaris_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Inventaris_default as default };

//# sourceMappingURL=Inventaris-Dypr5jnU.js.map