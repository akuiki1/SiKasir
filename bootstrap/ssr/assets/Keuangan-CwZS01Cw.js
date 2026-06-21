import { n as formatRupiah, t as formatCompact } from "./format-Cs1IUSJx.js";
import { Head } from "@inertiajs/vue3";
import { computed, createVNode, defineComponent, ref, resolveDynamicComponent, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderVNode } from "vue/server-renderer";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Banknote, ChevronLeft, ChevronRight, Filter, Mail, Percent, Printer, Receipt, Scale, Sheet, Wallet } from "lucide-vue-next";
//#region resources/js/pages/admin/laporan/Keuangan.vue?vue&type=script&setup=true&lang.ts
var Keuangan_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Laporan",
		href: "/admin/laporan/keuangan"
	}, {
		title: "Keuangan",
		href: "/admin/laporan/keuangan"
	}] },
	__name: "Keuangan",
	__ssrInlineRender: true,
	props: {
		date_range: {},
		period_days: {},
		pnl: {},
		waterfall: {},
		comparison: {},
		insight: {},
		monthly_cost_warning: { type: Boolean },
		revenue_chart: {},
		cashflow: {},
		reconciliation: {}
	},
	setup(__props) {
		const props = __props;
		const activeTab = ref("laba_rugi");
		const tabs = [
			{
				key: "laba_rugi",
				label: "Laba Rugi",
				icon: Scale
			},
			{
				key: "arus_kas",
				label: "Arus Kas",
				icon: Banknote
			},
			{
				key: "rekonsiliasi",
				label: "Rekonsiliasi",
				icon: Receipt
			}
		];
		const showFilter = ref(false);
		const customStart = ref(props.date_range.start_date);
		const customEnd = ref(props.date_range.end_date);
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
				start: toLocalISO(start),
				end: toLocalISO(end)
			};
		}
		function getYearRange(year) {
			return {
				start: `${year}-01-01`,
				end: `${year}-12-31`
			};
		}
		function toLocalISO(date) {
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
		}
		function detectInitialYear() {
			return props.date_range.start_date ? (/* @__PURE__ */ new Date(props.date_range.start_date + "T00:00:00")).getFullYear() : (/* @__PURE__ */ new Date()).getFullYear();
		}
		const filterYear = ref(detectInitialYear());
		function detectInitialMode() {
			const today = toLocalISO(/* @__PURE__ */ new Date());
			if (props.date_range.start_date === today && props.date_range.end_date === today) return "today";
			const yearRange = getYearRange(filterYear.value);
			if (props.date_range.start_date === yearRange.start && props.date_range.end_date === yearRange.end) return "year";
			for (let m = 0; m < 12; m++) {
				const range = getMonthRange(filterYear.value, m);
				if (range.start === props.date_range.start_date && range.end === props.date_range.end_date) return String(m);
			}
			return "custom";
		}
		const selectedMode = ref(detectInitialMode());
		const filterBadgeLabel = computed(() => {
			if (selectedMode.value === "today") return "Hari Ini";
			if (selectedMode.value === "year") return `Tahun ${filterYear.value}`;
			if (selectedMode.value !== "custom") return `${MONTHS[Number(selectedMode.value)]} ${filterYear.value}`;
			return "Custom";
		});
		const maxRevenue = computed(() => Math.max(...props.revenue_chart.map((p) => p.value), 1));
		const revenueColumns = computed(() => props.revenue_chart.map((point) => ({
			label: point.label,
			value: point.value,
			height: `${Math.max(Math.round(point.value / maxRevenue.value * 100), point.value > 0 ? 4 : 0)}%`
		})));
		const waterfallView = computed(() => {
			const steps = props.waterfall;
			if (!steps || steps.length === 0) return {
				bars: [],
				zeroTop: "100%"
			};
			const values = steps.flatMap((step) => [step.start, step.end]);
			values.push(0);
			const maxV = Math.max(...values);
			const range = maxV - Math.min(...values) || 1;
			return {
				bars: steps.map((step) => {
					const hi = Math.max(step.start, step.end);
					const lo = Math.min(step.start, step.end);
					let colorClass = "bg-rose-400";
					if (step.type === "income") colorClass = "bg-emerald-500";
					else if (step.type === "subtotal") colorClass = "bg-sky-500";
					else if (step.type === "result") colorClass = step.end >= 0 ? "bg-emerald-600" : "bg-rose-600";
					return {
						label: step.label,
						amountText: `${step.amount < 0 ? "−" : ""}Rp${formatCompact(Math.abs(step.amount))}`,
						colorClass,
						topPct: `${(maxV - hi) / range * 100}%`,
						heightPct: `${Math.max((hi - lo) / range * 100, step.amount !== 0 ? 1.5 : .5)}%`
					};
				}),
				zeroTop: `${(maxV - 0) / range * 100}%`
			};
		});
		const comparisonCards = computed(() => props.comparison.map((card) => {
			const signFlip = card.current < 0 !== card.previous < 0;
			let good = null;
			if (card.delta_pct !== null) {
				const increased = card.delta_pct > 0;
				good = card.higher_is_better ? increased : !increased;
			}
			return {
				label: card.label,
				valueText: formatRupiah(card.current),
				isNegative: card.current < 0,
				showPct: card.delta_pct !== null && !signFlip,
				up: (card.delta_pct ?? 0) > 0,
				pctText: card.delta_pct !== null ? `${Math.abs(Math.round(card.delta_pct))}% vs sebelumnya` : "baru periode ini",
				prevText: `dari ${formatRupiah(card.previous)}`,
				good
			};
		}));
		const mdrRates = ref({
			cash: 0,
			qris: .7,
			transfer: 0
		});
		const reconciliationRows = computed(() => props.reconciliation.methods.map((m) => {
			const rate = Number(mdrRates.value[m.metode] ?? 0);
			const fee = Math.round(m.total * rate / 100);
			const net = m.total - fee;
			return {
				...m,
				rate,
				fee,
				net,
				share: props.reconciliation.total > 0 ? m.total / props.reconciliation.total * 100 : 0
			};
		}));
		const reconciliationTotals = computed(() => {
			const rows = reconciliationRows.value;
			return {
				gross: rows.reduce((s, r) => s + r.total, 0),
				fee: rows.reduce((s, r) => s + r.fee, 0),
				net: rows.reduce((s, r) => s + r.net, 0),
				jumlah: rows.reduce((s, r) => s + r.jumlah, 0)
			};
		});
		const methodColor = {
			cash: "bg-emerald-500",
			qris: "bg-sky-500",
			transfer: "bg-violet-500"
		};
		computed(() => `${props.date_range.start_date} s/d ${props.date_range.end_date}`);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Laporan Keuangan - Admin" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 bg-slate-50 p-4 text-slate-950 dark:bg-zinc-950 dark:text-slate-100 sm:p-6"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Laporan</p><h1 class="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Laporan Keuangan</h1><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Laba rugi, arus kas, dan rekonsiliasi pembayaran usaha.</p></div><div class="flex flex-wrap items-center gap-2"><div class="relative"><button type="button" class="${ssrRenderClass([showFilter.value ? "border-sky-500 bg-sky-50 text-sky-600 dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-400" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800", "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition"])}">`);
			_push(ssrRenderComponent(unref(Filter), { class: "h-4 w-4" }, null, _parent));
			_push(`<span class="hidden sm:inline">Filter</span><span class="rounded-md bg-sky-100 px-1.5 py-0.5 text-[11px] font-bold text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">${ssrInterpolate(filterBadgeLabel.value)}</span></button>`);
			if (showFilter.value) {
				_push(`<div class="absolute right-0 top-11 z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"><button type="button" class="${ssrRenderClass([selectedMode.value === "today" ? "bg-sky-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "mb-3 w-full rounded-lg py-2 text-xs font-semibold transition-all"])}"> Hari Ini </button><div class="flex items-center gap-0.5"><button type="button" class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800">`);
				_push(ssrRenderComponent(unref(ChevronLeft), { class: "h-4 w-4" }, null, _parent));
				_push(`</button><span class="flex-1 text-center text-sm font-bold text-slate-800 dark:text-slate-100">${ssrInterpolate(filterYear.value)}</span><button type="button" class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800">`);
				_push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4" }, null, _parent));
				_push(`</button></div><div class="mt-3 grid grid-cols-4 gap-1"><!--[-->`);
				ssrRenderList(MONTHS, (month, i) => {
					_push(`<button type="button" class="${ssrRenderClass([selectedMode.value === String(i) ? "bg-sky-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "rounded-lg py-2 text-xs font-semibold transition-all"])}">${ssrInterpolate(month)}</button>`);
				});
				_push(`<!--]--><button type="button" class="${ssrRenderClass([selectedMode.value === "year" ? "bg-sky-500 text-white" : "text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-500/10", "col-span-4 rounded-lg py-2 text-xs font-semibold transition-all"])}"> Setahun Penuh (${ssrInterpolate(filterYear.value)}) </button><button type="button" class="${ssrRenderClass([selectedMode.value === "custom" ? "bg-sky-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "col-span-4 rounded-lg py-2 text-xs font-semibold transition-all"])}"> Custom </button></div>`);
				if (selectedMode.value === "custom") {
					_push(`<div class="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-zinc-800"><div class="grid grid-cols-2 gap-2"><label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"> Mulai <input${ssrRenderAttr("value", customStart.value)} type="date" class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100"></label><label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"> Sampai <input${ssrRenderAttr("value", customEnd.value)} type="date" class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100"></label></div><button type="button" class="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-sky-500 text-xs font-semibold text-white transition hover:bg-sky-600">`);
					_push(ssrRenderComponent(unref(Filter), { class: "h-3 w-3" }, null, _parent));
					_push(` Terapkan </button></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
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
			_push(`<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400">Omzet</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(unref(formatRupiah)(__props.pnl.total_revenue))}</p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">`);
			_push(ssrRenderComponent(unref(Wallet), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">HPP ${ssrInterpolate(unref(formatRupiah)(__props.pnl.hpp))}</p></div><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400">Laba Kotor</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(unref(formatRupiah)(__props.pnl.gross_profit))}</p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">`);
			_push(ssrRenderComponent(unref(Scale), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">Sebelum biaya operasional</p></div><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400">Biaya Operasional</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(unref(formatRupiah)(__props.pnl.operational_expenses))}</p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">`);
			_push(ssrRenderComponent(unref(Receipt), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">Gaji, sewa, listrik, dll</p></div><div class="${ssrRenderClass([__props.pnl.net_profit >= 0 ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10" : "border-rose-200 bg-rose-50/60 dark:border-rose-500/30 dark:bg-rose-500/10", "rounded-lg border p-5 shadow-sm"])}"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400">Laba Bersih</p><p class="${ssrRenderClass([__props.pnl.net_profit >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300", "mt-2 text-2xl font-bold"])}">${ssrInterpolate(unref(formatRupiah)(__props.pnl.net_profit))}</p></div><div class="${ssrRenderClass([__props.pnl.net_profit >= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300", "flex h-11 w-11 items-center justify-center rounded-md"])}">`);
			_push(ssrRenderComponent(unref(Percent), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">Margin ${ssrInterpolate(__props.pnl.margin)}%</p></div></div><div class="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><!--[-->`);
			ssrRenderList(tabs, (tab) => {
				_push(`<button type="button" class="${ssrRenderClass([activeTab.value === tab.key ? "bg-sky-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition"])}">`);
				ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tab.icon), { class: "h-4 w-4" }, null), _parent);
				_push(`<span>${ssrInterpolate(tab.label)}</span></button>`);
			});
			_push(`<!--]--></div>`);
			if (activeTab.value === "laba_rugi") {
				_push(`<div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><h2 class="text-lg font-semibold">Laporan Laba Rugi</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Pendapatan dikurangi HPP &amp; biaya operasional.</p><div class="mt-5 space-y-1 text-sm"><p class="pb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Pendapatan</p><div class="flex items-center justify-between py-1.5"><span class="text-slate-600 dark:text-slate-300">Penjualan Barang</span><span class="font-medium tabular-nums">${ssrInterpolate(unref(formatRupiah)(__props.pnl.product_revenue))}</span></div><div class="flex items-center justify-between py-1.5"><span class="text-slate-600 dark:text-slate-300">Pendapatan Jasa (fee)</span><span class="font-medium tabular-nums">${ssrInterpolate(unref(formatRupiah)(__props.pnl.jasa_revenue))}</span></div><div class="flex items-center justify-between border-t border-slate-200 py-2 font-semibold dark:border-zinc-700"><span>Total Pendapatan (Omzet)</span><span class="tabular-nums">${ssrInterpolate(unref(formatRupiah)(__props.pnl.total_revenue))}</span></div>`);
				if (__props.pnl.total_diskon > 0) _push(`<p class="pt-0.5 text-xs text-slate-400">Sudah termasuk potongan diskon ${ssrInterpolate(unref(formatRupiah)(__props.pnl.total_diskon))}</p>`);
				else _push(`<!---->`);
				_push(`<p class="pb-1 pt-4 text-xs font-bold uppercase tracking-wide text-slate-400">Harga Pokok Penjualan</p><div class="flex items-center justify-between py-1.5"><span class="text-slate-600 dark:text-slate-300">HPP Barang Terjual</span><span class="font-medium tabular-nums text-rose-600 dark:text-rose-400">−${ssrInterpolate(unref(formatRupiah)(__props.pnl.hpp))}</span></div><div class="flex items-center justify-between border-t border-slate-200 py-2 font-semibold dark:border-zinc-700"><span>Laba Kotor</span><span class="tabular-nums">${ssrInterpolate(unref(formatRupiah)(__props.pnl.gross_profit))}</span></div><p class="pb-1 pt-4 text-xs font-bold uppercase tracking-wide text-slate-400">Biaya Operasional</p><!--[-->`);
				ssrRenderList(__props.pnl.expense_breakdown, (e) => {
					_push(`<div class="flex items-center justify-between py-1.5"><span class="text-slate-600 dark:text-slate-300">${ssrInterpolate(e.label)}</span><span class="font-medium tabular-nums text-rose-600 dark:text-rose-400">−${ssrInterpolate(unref(formatRupiah)(e.nominal))}</span></div>`);
				});
				_push(`<!--]-->`);
				if (__props.pnl.expense_breakdown.length === 0) _push(`<p class="py-1.5 text-sm text-slate-400">Belum ada biaya operasional pada periode ini.</p>`);
				else _push(`<!---->`);
				_push(`<div class="flex items-center justify-between border-t border-slate-200 py-2 font-semibold dark:border-zinc-700"><span>Total Biaya Operasional</span><span class="tabular-nums text-rose-600 dark:text-rose-400">−${ssrInterpolate(unref(formatRupiah)(__props.pnl.operational_expenses))}</span></div><div class="${ssrRenderClass([__props.pnl.net_profit >= 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300", "mt-2 flex items-center justify-between rounded-lg px-3 py-3 text-base font-bold"])}"><span>Laba Bersih</span><span class="tabular-nums">${ssrInterpolate(unref(formatRupiah)(__props.pnl.net_profit))}</span></div></div></section><section class="flex flex-col gap-4"><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-zinc-800"><h2 class="text-lg font-semibold">Alur Laba</h2><div class="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400"><span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-emerald-500"></span>Pemasukan</span><span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-rose-400"></span>Pengurang</span><span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-sky-500"></span>Subtotal</span></div></div>`);
				if (__props.monthly_cost_warning) {
					_push(`<div class="mt-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">`);
					_push(ssrRenderComponent(unref(AlertTriangle), { class: "mt-0.5 h-4 w-4 shrink-0" }, null, _parent));
					_push(`<p>Rentang pendek (${ssrInterpolate(__props.period_days)} hari) memuat biaya bulanan (gaji/sewa/pajak) — laba bisa terlihat &quot;rugi semu&quot;.</p></div>`);
				} else _push(`<!---->`);
				_push(`<div class="mt-4 overflow-x-auto"><div class="min-w-[420px]"><div class="relative h-56"><div class="absolute inset-x-0 border-t border-dashed border-slate-300 dark:border-zinc-600" style="${ssrRenderStyle({ top: waterfallView.value.zeroTop })}"></div><div class="flex h-full items-stretch gap-1.5"><!--[-->`);
				ssrRenderList(waterfallView.value.bars, (bar) => {
					_push(`<div class="relative flex-1"><div class="${ssrRenderClass([bar.colorClass, "absolute left-1/2 w-5 -translate-x-1/2 rounded-sm transition-all duration-300"])}" style="${ssrRenderStyle({
						top: bar.topPct,
						height: bar.heightPct
					})}"></div></div>`);
				});
				_push(`<!--]--></div></div><div class="mt-2 flex gap-1.5"><!--[-->`);
				ssrRenderList(waterfallView.value.bars, (bar) => {
					_push(`<div class="min-w-0 flex-1 text-center"><p class="truncate text-[10px] font-semibold text-slate-600 dark:text-slate-300">${ssrInterpolate(bar.label)}</p><p class="truncate text-[9px] font-medium text-slate-400">${ssrInterpolate(bar.amountText)}</p></div>`);
				});
				_push(`<!--]--></div></div></div></div><div class="grid gap-3 sm:grid-cols-2"><!--[-->`);
				ssrRenderList(comparisonCards.value, (card) => {
					_push(`<div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><p class="text-sm font-medium text-slate-500 dark:text-slate-400">${ssrInterpolate(card.label)}</p><p class="${ssrRenderClass([card.isNegative ? "text-rose-600 dark:text-rose-400" : "", "mt-1 text-lg font-bold"])}">${ssrInterpolate(card.valueText)}</p><p class="${ssrRenderClass([card.good === null ? "text-slate-500 dark:text-slate-400" : card.good ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400", "mt-1 inline-flex items-center gap-1 text-xs font-medium"])}">`);
					if (card.showPct) {
						_push(`<!--[-->`);
						if (card.up) _push(ssrRenderComponent(unref(ArrowUpRight), { class: "h-3.5 w-3.5" }, null, _parent));
						else _push(ssrRenderComponent(unref(ArrowDownRight), { class: "h-3.5 w-3.5" }, null, _parent));
						_push(` ${ssrInterpolate(card.pctText)}<!--]-->`);
					} else _push(`<!--[-->${ssrInterpolate(card.prevText)}<!--]-->`);
					_push(`</p></div>`);
				});
				_push(`<!--]--></div><div class="${ssrRenderClass([__props.insight.tone === "success" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300", "flex items-start gap-3 rounded-lg p-4 shadow-sm"])}">`);
				_push(ssrRenderComponent(unref(AlertTriangle), { class: "mt-0.5 h-5 w-5 shrink-0" }, null, _parent));
				_push(`<p class="text-sm leading-relaxed">${ssrInterpolate(__props.insight.message)}</p></div></section></div>`);
			} else if (activeTab.value === "arus_kas") {
				_push(`<div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><h2 class="text-lg font-semibold">Laporan Arus Kas</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Uang tunai yang masuk dan keluar pada periode ini.</p><div class="mt-5 space-y-1 text-sm"><p class="pb-1 text-xs font-bold uppercase tracking-wide text-emerald-500">Kas Masuk</p><div class="flex items-center justify-between py-1.5"><span class="text-slate-600 dark:text-slate-300">Penjualan (omzet)</span><span class="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">+${ssrInterpolate(unref(formatRupiah)(__props.cashflow.kas_masuk))}</span></div><div class="flex items-center justify-between border-t border-slate-200 py-2 font-semibold dark:border-zinc-700"><span>Total Kas Masuk</span><span class="tabular-nums">${ssrInterpolate(unref(formatRupiah)(__props.cashflow.kas_masuk))}</span></div><p class="pb-1 pt-4 text-xs font-bold uppercase tracking-wide text-rose-500">Kas Keluar</p><div class="flex items-center justify-between py-1.5"><span class="text-slate-600 dark:text-slate-300">Pembelian Bahan &amp; Produksi</span><span class="font-medium tabular-nums text-rose-600 dark:text-rose-400">−${ssrInterpolate(unref(formatRupiah)(__props.cashflow.pembelian_produksi))}</span></div><div class="flex items-center justify-between py-1.5"><span class="text-slate-600 dark:text-slate-300">Biaya Operasional</span><span class="font-medium tabular-nums text-rose-600 dark:text-rose-400">−${ssrInterpolate(unref(formatRupiah)(__props.cashflow.biaya_operasional))}</span></div><div class="flex items-center justify-between border-t border-slate-200 py-2 font-semibold dark:border-zinc-700"><span>Total Kas Keluar</span><span class="tabular-nums text-rose-600 dark:text-rose-400">−${ssrInterpolate(unref(formatRupiah)(__props.cashflow.kas_keluar))}</span></div><div class="${ssrRenderClass([__props.cashflow.net_cash >= 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300", "mt-2 flex items-center justify-between rounded-lg px-3 py-3 text-base font-bold"])}"><span>Arus Kas Bersih</span><span class="tabular-nums">${ssrInterpolate(unref(formatRupiah)(__props.cashflow.net_cash))}</span></div></div></section><section class="flex flex-col gap-4"><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><h3 class="text-sm font-semibold text-slate-600 dark:text-slate-300">Rincian Kas Keluar</h3><div class="mt-4 space-y-3 text-sm"><div><div class="flex items-center justify-between"><span class="text-slate-600 dark:text-slate-300">Batch Produksi</span><span class="font-medium tabular-nums">${ssrInterpolate(unref(formatRupiah)(__props.cashflow.biaya_produksi))}</span></div><div class="mt-1 flex items-center justify-between"><span class="text-slate-600 dark:text-slate-300">Belanja Bahan / Kemasan</span><span class="font-medium tabular-nums">${ssrInterpolate(unref(formatRupiah)(__props.cashflow.belanja_bahan))}</span></div><div class="mt-1 flex items-center justify-between"><span class="text-slate-600 dark:text-slate-300">Biaya Operasional</span><span class="font-medium tabular-nums">${ssrInterpolate(unref(formatRupiah)(__props.cashflow.biaya_operasional))}</span></div></div></div></div>`);
				if (__props.cashflow.jasa_pass_through > 0) {
					_push(`<div class="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/60">`);
					_push(ssrRenderComponent(unref(Banknote), { class: "mt-0.5 h-5 w-5 shrink-0 text-slate-400" }, null, _parent));
					_push(`<p class="text-slate-600 dark:text-slate-300"> Titipan jasa (transfer/tarik tunai) sebesar <span class="font-semibold">${ssrInterpolate(unref(formatRupiah)(__props.cashflow.jasa_pass_through))}</span> masuk lalu keluar lagi (net nol), jadi tidak dihitung dalam arus kas usaha. </p></div>`);
				} else _push(`<!---->`);
				_push(`<div class="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">`);
				_push(ssrRenderComponent(unref(AlertTriangle), { class: "mt-0.5 h-4 w-4 shrink-0" }, null, _parent));
				_push(`<p>Arus kas dihitung dari data yang tercatat: penjualan, biaya produksi, belanja bahan, dan pengeluaran. Pembelian stok barang &quot;beli&quot; yang tidak dicatat sebagai pengeluaran, setoran modal, atau pembayaran utang supplier belum termasuk.</p></div></section></div>`);
			} else {
				_push(`<div class="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><h2 class="text-lg font-semibold">Rekonsiliasi Pembayaran</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Pemasukan per metode bayar dikurangi biaya admin (MDR). Ubah tarif sesuai kesepakatan dengan penyedia.</p><div class="mt-5 overflow-x-auto"><table class="w-full text-left text-sm"><thead><tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-zinc-800 dark:text-slate-400"><th class="pb-2 pr-3 font-semibold">Metode</th><th class="px-2 pb-2 text-right font-semibold">Trx</th><th class="px-2 pb-2 text-right font-semibold">Bruto</th><th class="px-2 pb-2 text-right font-semibold">MDR %</th><th class="px-2 pb-2 text-right font-semibold">Biaya</th><th class="pb-2 pl-2 text-right font-semibold">Bersih</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-zinc-800"><!--[-->`);
				ssrRenderList(reconciliationRows.value, (r) => {
					_push(`<tr><td class="py-3 pr-3"><span class="inline-flex items-center gap-2 font-semibold"><span class="${ssrRenderClass([methodColor[r.metode], "h-2.5 w-2.5 rounded-full"])}"></span>${ssrInterpolate(r.label)}</span></td><td class="px-2 text-right text-slate-600 dark:text-slate-300">${ssrInterpolate(r.jumlah)}</td><td class="px-2 text-right font-medium tabular-nums">${ssrInterpolate(unref(formatRupiah)(r.total))}</td><td class="px-2 text-right"><input${ssrRenderAttr("value", mdrRates.value[r.metode])} type="number" min="0" step="0.1" class="h-8 w-16 rounded-md border border-slate-200 bg-white px-2 text-right text-xs tabular-nums outline-none focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100"></td><td class="px-2 text-right tabular-nums text-rose-600 dark:text-rose-400">${ssrInterpolate(r.fee > 0 ? `−${unref(formatRupiah)(r.fee)}` : "—")}</td><td class="pl-2 text-right font-semibold tabular-nums">${ssrInterpolate(unref(formatRupiah)(r.net))}</td></tr>`);
				});
				_push(`<!--]--></tbody><tfoot><tr class="border-t-2 border-slate-300 font-bold dark:border-zinc-600"><td class="py-3 pr-3">Total</td><td class="px-2 text-right">${ssrInterpolate(reconciliationTotals.value.jumlah)}</td><td class="px-2 text-right tabular-nums">${ssrInterpolate(unref(formatRupiah)(reconciliationTotals.value.gross))}</td><td class="px-2"></td><td class="px-2 text-right tabular-nums text-rose-600 dark:text-rose-400">${ssrInterpolate(reconciliationTotals.value.fee > 0 ? `−${unref(formatRupiah)(reconciliationTotals.value.fee)}` : "—")}</td><td class="pl-2 text-right tabular-nums">${ssrInterpolate(unref(formatRupiah)(reconciliationTotals.value.net))}</td></tr></tfoot></table></div><p class="mt-4 text-xs text-slate-400">QRIS &amp; Transfer masuk ke rekening bank (setelah dipotong MDR); Tunai tetap berupa uang fisik di laci.</p></section><section class="flex flex-col gap-4"><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><h3 class="text-sm font-semibold text-slate-600 dark:text-slate-300">Komposisi Pembayaran</h3><div class="mt-4 space-y-4"><!--[-->`);
				ssrRenderList(reconciliationRows.value, (r) => {
					_push(`<div><div class="flex items-center justify-between text-sm"><span class="font-semibold">${ssrInterpolate(r.label)}</span><span class="text-slate-500 dark:text-slate-400">${ssrInterpolate(unref(formatRupiah)(r.total))} · ${ssrInterpolate(Math.round(r.share))}%</span></div><div class="mt-2 h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800"><div class="${ssrRenderClass([methodColor[r.metode], "h-full rounded-full transition-all"])}" style="${ssrRenderStyle({ width: `${r.share}%` })}"></div></div></div>`);
				});
				_push(`<!--]-->`);
				if (reconciliationTotals.value.gross === 0) _push(`<p class="text-sm text-slate-400">Belum ada transaksi pada periode ini.</p>`);
				else _push(`<!---->`);
				_push(`</div></div><div class="rounded-lg border border-sky-200 bg-sky-50 p-5 dark:border-sky-500/30 dark:bg-sky-500/10"><p class="text-sm font-medium text-sky-700 dark:text-sky-300">Estimasi masuk rekening bank</p><p class="mt-1 text-2xl font-bold text-sky-700 dark:text-sky-300">${ssrInterpolate(unref(formatRupiah)(reconciliationRows.value.filter((r) => r.metode !== "cash").reduce((s, r) => s + r.net, 0)))}</p><p class="mt-1 text-xs text-sky-600/80 dark:text-sky-400/80">Dari QRIS &amp; Transfer, setelah dipotong biaya admin.</p></div></section></div>`);
			}
			_push(`<section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-zinc-800"><h2 class="text-lg font-semibold">Tren Omzet Harian</h2><span class="text-xs text-slate-400">${ssrInterpolate(__props.date_range.start_date)} – ${ssrInterpolate(__props.date_range.end_date)}</span></div><div class="mt-5 overflow-x-auto"><div class="flex h-48 min-w-[640px] items-end gap-1.5 border-b border-slate-200 px-1 pb-7 dark:border-zinc-800"><!--[-->`);
			ssrRenderList(revenueColumns.value, (item) => {
				_push(`<div class="group relative flex h-full flex-1 flex-col items-center justify-end"><div class="absolute bottom-[calc(100%+0.4rem)] hidden whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-1 text-xs shadow-lg group-hover:block dark:border-zinc-700 dark:bg-zinc-950"><span class="font-semibold">${ssrInterpolate(item.label)}</span> · ${ssrInterpolate(unref(formatRupiah)(item.value))}</div><div class="w-full max-w-[14px] rounded-t-sm bg-sky-500 transition-all duration-300" style="${ssrRenderStyle({ height: item.height })}"></div><span class="absolute -bottom-6 whitespace-nowrap text-[10px] font-medium text-slate-400">${ssrInterpolate(item.label)}</span></div>`);
			});
			_push(`<!--]--></div></div></section></div><!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/laporan/Keuangan.vue
var _sfc_setup = Keuangan_vue_vue_type_script_setup_true_lang_default.setup;
Keuangan_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/laporan/Keuangan.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Keuangan_default = Keuangan_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Keuangan_default as default };

//# sourceMappingURL=Keuangan-CwZS01Cw.js.map