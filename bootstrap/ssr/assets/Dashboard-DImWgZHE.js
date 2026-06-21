import { n as formatRupiah, t as formatCompact } from "./format-Cs1IUSJx.js";
import { Head, Link, useForm } from "@inertiajs/vue3";
import { computed, createTextVNode, createVNode, defineComponent, ref, unref, useSSRContext, withCtx } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, CalendarDays, ChevronLeft, ChevronRight, Clock3, Filter, Package, Percent, Printer, Receipt, TrendingUp, Trophy, Users, Wallet } from "lucide-vue-next";
//#region resources/js/pages/admin/Dashboard.vue?vue&type=script&setup=true&lang.ts
var Dashboard_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Admin Dashboard",
		href: "/admin/dashboard"
	}] },
	__name: "Dashboard",
	__ssrInlineRender: true,
	props: {
		stats: {},
		revenue_chart: {},
		sales_trend: {},
		top_sales_dates: {},
		top_sales_hours: {},
		best_selling_products: {},
		worst_selling_products: {},
		slow_movers: {},
		slow_mover_days: {},
		best_profit_products: {},
		cashier_achievements: {},
		top_cashiers_by_transactions: {},
		top_cashiers_by_revenue: {},
		waterfall: {},
		comparison: {},
		insight: {},
		monthly_cost_warning: { type: Boolean },
		period_days: {},
		date_range: {}
	},
	setup(__props) {
		const props = __props;
		const form = useForm({
			start_date: props.date_range.start_date,
			end_date: props.date_range.end_date
		});
		const showFilter = ref(false);
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
		function detectInitialYear() {
			return props.date_range.start_date ? (/* @__PURE__ */ new Date(props.date_range.start_date + "T00:00:00")).getFullYear() : (/* @__PURE__ */ new Date()).getFullYear();
		}
		const filterYear = ref(detectInitialYear());
		function detectInitialMode() {
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
		const selectedMode = ref(detectInitialMode());
		const filterBadgeLabel = computed(() => {
			if (selectedMode.value === "today") return "Hari Ini";
			if (selectedMode.value === "year") return `Tahun ${filterYear.value}`;
			if (selectedMode.value !== "custom") return `${MONTHS[Number(selectedMode.value)]} ${filterYear.value}`;
			return "Custom";
		});
		const maxRevenue = computed(() => Math.max(...props.revenue_chart.map((point) => point.value), 1));
		const maxSales = computed(() => Math.max(...props.sales_trend.map((point) => point.value), 1));
		const maxBestSellerQty = computed(() => Math.max(...props.best_selling_products.map((product) => product.qty), 1));
		const maxTopDates = computed(() => Math.max(...props.top_sales_dates.map((point) => point.value), 1));
		const maxTopHours = computed(() => Math.max(...props.top_sales_hours.map((point) => point.value), 1));
		const maxCashierTransactions = computed(() => Math.max(...props.top_cashiers_by_transactions.map((cashier) => cashier.transactions), 1));
		const maxCashierRevenue = computed(() => Math.max(...props.top_cashiers_by_revenue.map((cashier) => cashier.revenue), 1));
		const performanceColumns = computed(() => props.revenue_chart.map((point) => {
			const salesValue = props.sales_trend.find((item) => item.label === point.label)?.value ?? 0;
			return {
				label: point.label,
				revenue: point.value,
				sales: salesValue,
				revenueHeight: `${Math.max(Math.round(point.value / maxRevenue.value * 100), point.value > 0 ? 8 : 0)}%`,
				salesHeight: `${Math.max(Math.round(salesValue / maxSales.value * 100), salesValue > 0 ? 8 : 0)}%`
			};
		}));
		const bestSellingGraph = computed(() => props.best_selling_products.map((product) => ({
			...product,
			width: `${Math.round(product.qty / maxBestSellerQty.value * 100)}%`
		})));
		const topDatesGraph = computed(() => props.top_sales_dates.map((point) => ({
			label: point.label,
			value: point.value,
			width: `${Math.round(point.value / maxTopDates.value * 100)}%`
		})));
		const topHoursGraph = computed(() => props.top_sales_hours.map((point) => ({
			label: point.label,
			value: point.value,
			width: `${Math.round(point.value / maxTopHours.value * 100)}%`
		})));
		const topCashierTransactionsGraph = computed(() => props.top_cashiers_by_transactions.map((cashier) => ({
			...cashier,
			width: `${Math.round(cashier.transactions / maxCashierTransactions.value * 100)}%`
		})));
		const topCashierRevenueGraph = computed(() => props.top_cashiers_by_revenue.map((cashier) => ({
			...cashier,
			width: `${Math.round(cashier.revenue / maxCashierRevenue.value * 100)}%`
		})));
		const bestProduct = computed(() => props.best_selling_products[0]);
		const bestProfitProduct = computed(() => props.best_profit_products[0]);
		const bestCashierByRevenue = computed(() => props.top_cashiers_by_revenue[0]);
		const bestCashierByTransactions = computed(() => props.top_cashiers_by_transactions[0]);
		const busiestDate = computed(() => props.top_sales_dates[0]);
		const busiestHour = computed(() => props.top_sales_hours[0]);
		const waterfallView = computed(() => {
			const steps = props.waterfall;
			if (!steps || steps.length === 0) return {
				bars: [],
				zeroTop: 100
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
		function formatQty(value) {
			return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 3 }).format(Number(value) || 0);
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Admin Dashboard" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-slate-50 p-6 text-slate-950 dark:bg-zinc-950 dark:text-slate-100"><div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Dashboard Admin</p><h1 class="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Ringkasan Performa Bisnis</h1></div><div class="flex shrink-0 items-center gap-2"><div class="relative"><button type="button" class="${ssrRenderClass([showFilter.value ? "border-sky-500 bg-sky-50 text-sky-600 dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-400" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800", "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition"])}">`);
			_push(ssrRenderComponent(unref(Filter), { class: "h-4 w-4" }, null, _parent));
			_push(` Filter <span class="ml-0.5 rounded-md bg-sky-100 px-1.5 py-0.5 text-[11px] font-bold text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">${ssrInterpolate(filterBadgeLabel.value)}</span></button>`);
			if (showFilter.value) {
				_push(`<div class="absolute right-0 top-11 z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"><button type="button" class="${ssrRenderClass([selectedMode.value === "today" ? "bg-sky-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "mb-3 w-full rounded-lg py-2 text-xs font-semibold transition-all"])}"> Hari Ini </button><div class="flex items-center gap-0.5"><button type="button" class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800 dark:hover:text-slate-300">`);
				_push(ssrRenderComponent(unref(ChevronLeft), { class: "h-4 w-4" }, null, _parent));
				_push(`</button><span class="flex-1 text-center text-sm font-bold text-slate-800 dark:text-slate-100">${ssrInterpolate(filterYear.value)}</span><button type="button" class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-zinc-800 dark:hover:text-slate-300">`);
				_push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4" }, null, _parent));
				_push(`</button></div><div class="mt-3 grid grid-cols-4 gap-1"><!--[-->`);
				ssrRenderList(MONTHS, (month, i) => {
					_push(`<button type="button" class="${ssrRenderClass([selectedMode.value === String(i) ? "bg-sky-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "rounded-lg py-2 text-xs font-semibold transition-all"])}">${ssrInterpolate(month)}</button>`);
				});
				_push(`<!--]--><button type="button" class="${ssrRenderClass([selectedMode.value === "year" ? "bg-sky-500 text-white" : "text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-500/10", "col-span-4 rounded-lg py-2 text-xs font-semibold transition-all"])}"> Setahun Penuh (${ssrInterpolate(filterYear.value)}) </button><button type="button" class="${ssrRenderClass([selectedMode.value === "custom" ? "bg-sky-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "col-span-4 rounded-lg py-2 text-xs font-semibold transition-all"])}"> Custom </button></div>`);
				if (selectedMode.value === "custom") {
					_push(`<div class="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-zinc-800"><div class="grid grid-cols-2 gap-2"><label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"> Mulai <input${ssrRenderAttr("value", unref(form).start_date)} type="date" class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-sky-500/20"></label><label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"> Sampai <input${ssrRenderAttr("value", unref(form).end_date)} type="date" class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100 dark:focus:ring-sky-500/20"></label></div><button type="button" class="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-sky-500 text-xs font-semibold text-white transition hover:bg-sky-600">`);
					_push(ssrRenderComponent(unref(Filter), { class: "h-3 w-3" }, null, _parent));
					_push(` Terapkan </button></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div><button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800">`);
			_push(ssrRenderComponent(unref(Printer), { class: "h-4 w-4" }, null, _parent));
			_push(` Cetak </button></div></div>`);
			if (showFilter.value) _push(`<div class="fixed inset-0 z-40"></div>`);
			else _push(`<!---->`);
			_push(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400">Omzet</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(unref(formatRupiah)(props.stats.total_revenue))}</p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">`);
			_push(ssrRenderComponent(unref(Wallet), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">HPP ${ssrInterpolate(unref(formatRupiah)(props.stats.total_cogs))} · Laba kotor ${ssrInterpolate(unref(formatRupiah)(props.stats.gross_profit))}</p></div><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400">Biaya Operasional</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(unref(formatRupiah)(props.stats.total_expenses))}</p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">`);
			_push(ssrRenderComponent(unref(Receipt), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">Laba bersih ${ssrInterpolate(unref(formatRupiah)(props.stats.net_profit))}</p></div><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400">Margin</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(props.stats.sales_margin.toFixed(2))}%</p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">`);
			_push(ssrRenderComponent(unref(Percent), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">Laba bersih ${ssrInterpolate(unref(formatRupiah)(props.stats.net_profit))}</p></div><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Penjualan</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(props.stats.total_transactions)} trx</p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">`);
			_push(ssrRenderComponent(unref(BarChart3), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">${ssrInterpolate(props.stats.total_items_sold)} produk terjual</p></div></div><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-zinc-800 md:flex-row md:items-center md:justify-between"><div><h2 class="text-lg font-semibold">Analisis Laba &amp; Rugi</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Dari mana laba bocor &amp; perubahan vs periode setara sebelumnya</p></div><div class="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400"><span class="inline-flex items-center gap-2"><span class="h-3 w-3 rounded-sm bg-emerald-500"></span>Pemasukan</span><span class="inline-flex items-center gap-2"><span class="h-3 w-3 rounded-sm bg-rose-400"></span>Pengurang</span><span class="inline-flex items-center gap-2"><span class="h-3 w-3 rounded-sm bg-sky-500"></span>Subtotal</span></div></div>`);
			if (props.monthly_cost_warning) {
				_push(`<div class="mt-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">`);
				_push(ssrRenderComponent(unref(AlertTriangle), { class: "mt-0.5 h-4 w-4 shrink-0" }, null, _parent));
				_push(`<p>Rentang waktu pendek (${ssrInterpolate(props.period_days)} hari) memuat biaya bulanan (gaji/sewa/pajak). Laba bersih bisa terlihat &quot;rugi semu&quot; karena biaya satu bulan jatuh di rentang ini.</p></div>`);
			} else _push(`<!---->`);
			_push(`<div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><!--[-->`);
			ssrRenderList(comparisonCards.value, (card) => {
				_push(`<div class="rounded-md border border-slate-200 p-4 dark:border-zinc-800"><p class="text-sm font-medium text-slate-500 dark:text-slate-400">${ssrInterpolate(card.label)}</p><p class="${ssrRenderClass([card.isNegative ? "text-rose-600 dark:text-rose-400" : "", "mt-2 text-xl font-bold"])}">${ssrInterpolate(card.valueText)}</p><p class="${ssrRenderClass([card.good === null ? "text-slate-500 dark:text-slate-400" : card.good ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400", "mt-2 inline-flex items-center gap-1 text-xs font-medium"])}">`);
				if (card.showPct) {
					_push(`<!--[-->`);
					if (card.up) _push(ssrRenderComponent(unref(ArrowUpRight), { class: "h-3.5 w-3.5" }, null, _parent));
					else _push(ssrRenderComponent(unref(ArrowDownRight), { class: "h-3.5 w-3.5" }, null, _parent));
					_push(` ${ssrInterpolate(card.pctText)}<!--]-->`);
				} else _push(`<!--[-->${ssrInterpolate(card.prevText)}<!--]-->`);
				_push(`</p></div>`);
			});
			_push(`<!--]--></div><div class="mt-6 overflow-x-auto"><div class="min-w-[640px]"><div class="relative h-72"><div class="absolute inset-x-0 border-t border-dashed border-slate-300 dark:border-zinc-600" style="${ssrRenderStyle({ top: waterfallView.value.zeroTop })}"></div><div class="flex h-full items-stretch gap-2"><!--[-->`);
			ssrRenderList(waterfallView.value.bars, (bar) => {
				_push(`<div class="relative flex-1"><div class="${ssrRenderClass([bar.colorClass, "absolute left-1/2 w-6 -translate-x-1/2 rounded-sm transition-all duration-300"])}" style="${ssrRenderStyle({
					top: bar.topPct,
					height: bar.heightPct
				})}"></div></div>`);
			});
			_push(`<!--]--></div></div><div class="mt-2 flex gap-2"><!--[-->`);
			ssrRenderList(waterfallView.value.bars, (bar) => {
				_push(`<div class="min-w-0 flex-1 text-center"><p class="truncate text-[11px] font-semibold text-slate-600 dark:text-slate-300">${ssrInterpolate(bar.label)}</p><p class="truncate text-[10px] font-medium text-slate-400 dark:text-slate-500">${ssrInterpolate(bar.amountText)}</p></div>`);
			});
			_push(`<!--]--></div>`);
			if (waterfallView.value.bars.length === 0) _push(`<p class="text-sm text-slate-500 dark:text-slate-400">Belum ada data untuk periode ini.</p>`);
			else _push(`<!---->`);
			_push(`</div></div><div class="${ssrRenderClass([props.insight.tone === "success" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300", "mt-6 flex items-start gap-3 rounded-md p-4"])}">`);
			_push(ssrRenderComponent(unref(AlertTriangle), { class: "mt-0.5 h-5 w-5 shrink-0" }, null, _parent));
			_push(`<p class="text-sm leading-relaxed">${ssrInterpolate(props.insight.message)}</p></div></section><div class="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]"><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-zinc-800 md:flex-row md:items-center md:justify-between"><div><h2 class="text-lg font-semibold">Grafik Omzet &amp; Transaksi</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${ssrInterpolate(props.date_range.start_date)} - ${ssrInterpolate(props.date_range.end_date)}</p></div><div class="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400"><span class="inline-flex items-center gap-2"><span class="h-3 w-3 rounded-sm bg-sky-500"></span>Omzet</span><span class="inline-flex items-center gap-2"><span class="h-3 w-3 rounded-sm bg-emerald-500"></span>Transaksi</span></div></div><div class="mt-5 overflow-x-auto"><div class="flex h-80 min-w-[760px] items-end gap-3 border-b border-slate-200 px-1 pb-8 dark:border-zinc-800"><!--[-->`);
			ssrRenderList(performanceColumns.value, (item) => {
				_push(`<div class="group relative flex h-full flex-1 min-w-9 flex-col items-center justify-end gap-2"><div class="absolute bottom-[calc(100%+0.75rem)] hidden rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg group-hover:block dark:border-zinc-700 dark:bg-zinc-950"><p class="font-semibold">${ssrInterpolate(item.label)}</p><p class="mt-1 whitespace-nowrap text-slate-500 dark:text-slate-400">${ssrInterpolate(unref(formatRupiah)(item.revenue))}</p><p class="whitespace-nowrap text-slate-500 dark:text-slate-400">${ssrInterpolate(item.sales)} transaksi</p></div><div class="flex h-full w-full items-end justify-center gap-1.5"><div class="w-3 rounded-t-md bg-sky-500 transition-all duration-300" style="${ssrRenderStyle({ height: item.revenueHeight })}"></div><div class="w-3 rounded-t-md bg-emerald-500 transition-all duration-300" style="${ssrRenderStyle({ height: item.salesHeight })}"></div></div><span class="absolute -bottom-7 whitespace-nowrap text-[11px] font-medium text-slate-500 dark:text-slate-400">${ssrInterpolate(item.label)}</span></div>`);
			});
			_push(`<!--]--></div></div></section><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="border-b border-slate-200 pb-4 dark:border-zinc-800"><h2 class="text-lg font-semibold">Sorotan</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Peringkat teratas pada periode aktif</p></div><div class="mt-5 grid gap-3"><div class="rounded-md border border-slate-200 p-4 dark:border-zinc-800"><div class="flex items-start gap-3">`);
			_push(ssrRenderComponent(unref(Package), { class: "mt-0.5 h-5 w-5 text-sky-600 dark:text-sky-300" }, null, _parent));
			_push(`<div><p class="text-sm font-semibold">Produk paling laku</p><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${ssrInterpolate(bestProduct.value?.nama ?? "Belum ada data")}</p>`);
			if (bestProduct.value) _push(`<p class="mt-2 text-lg font-bold">${ssrInterpolate(bestProduct.value.qty)} pcs</p>`);
			else _push(`<!---->`);
			_push(`</div></div></div><div class="rounded-md border border-slate-200 p-4 dark:border-zinc-800"><div class="flex items-start gap-3">`);
			_push(ssrRenderComponent(unref(Wallet), { class: "mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-300" }, null, _parent));
			_push(`<div><p class="text-sm font-semibold">Produk paling untung</p><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${ssrInterpolate(bestProfitProduct.value?.nama ?? "Belum ada data")}</p>`);
			if (bestProfitProduct.value) _push(`<p class="mt-2 text-lg font-bold">${ssrInterpolate(unref(formatRupiah)(bestProfitProduct.value.profit))} laba</p>`);
			else _push(`<!---->`);
			_push(`</div></div></div><div class="rounded-md border border-slate-200 p-4 dark:border-zinc-800"><div class="flex items-start gap-3">`);
			_push(ssrRenderComponent(unref(Trophy), { class: "mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-300" }, null, _parent));
			_push(`<div><p class="text-sm font-semibold">Karyawan omzet terbanyak</p><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${ssrInterpolate(bestCashierByRevenue.value?.nama ?? "Belum ada data")}</p>`);
			if (bestCashierByRevenue.value) _push(`<p class="mt-2 text-lg font-bold">${ssrInterpolate(unref(formatRupiah)(bestCashierByRevenue.value.revenue))}</p>`);
			else _push(`<!---->`);
			_push(`</div></div></div><div class="rounded-md border border-slate-200 p-4 dark:border-zinc-800"><div class="flex items-start gap-3">`);
			_push(ssrRenderComponent(unref(Users), { class: "mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-300" }, null, _parent));
			_push(`<div><p class="text-sm font-semibold">Karyawan transaksi terbanyak</p><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${ssrInterpolate(bestCashierByTransactions.value?.nama ?? "Belum ada data")}</p>`);
			if (bestCashierByTransactions.value) _push(`<p class="mt-2 text-lg font-bold">${ssrInterpolate(bestCashierByTransactions.value.transactions)} trx</p>`);
			else _push(`<!---->`);
			_push(`</div></div></div></div></section></div><div class="grid gap-4 xl:grid-cols-3"><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-zinc-800"><div><h2 class="text-lg font-semibold">Produk Paling Laku</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Berdasarkan jumlah item terjual</p></div><button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-slate-300 dark:hover:bg-zinc-800" title="Cetak produk paling laku">`);
			_push(ssrRenderComponent(unref(Printer), { class: "h-4 w-4" }, null, _parent));
			_push(`</button></div><div class="mt-5 space-y-4"><!--[-->`);
			ssrRenderList(bestSellingGraph.value, (product) => {
				_push(`<div><div class="flex items-center justify-between gap-4 text-sm"><span class="min-w-0 truncate font-semibold">${ssrInterpolate(product.nama)}</span><span class="shrink-0 text-slate-500 dark:text-slate-400">${ssrInterpolate(product.qty)} pcs</span></div><div class="mt-2 h-2 rounded-full bg-slate-100 dark:bg-zinc-800"><div class="h-full rounded-full bg-sky-500" style="${ssrRenderStyle({ width: product.width })}"></div></div><p class="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">${ssrInterpolate(unref(formatRupiah)(product.revenue))}</p></div>`);
			});
			_push(`<!--]-->`);
			if (bestSellingGraph.value.length === 0) _push(`<p class="text-sm text-slate-500 dark:text-slate-400">Belum ada data produk.</p>`);
			else _push(`<!---->`);
			_push(`</div></section><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-zinc-800"><div><h2 class="text-lg font-semibold">Tanggal Transaksi Terbanyak</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${ssrInterpolate(busiestDate.value?.label ?? "Belum ada data")}</p></div><button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-slate-300 dark:hover:bg-zinc-800" title="Cetak tanggal transaksi terbanyak">`);
			_push(ssrRenderComponent(unref(Printer), { class: "h-4 w-4" }, null, _parent));
			_push(`</button></div><div class="mt-5 space-y-4"><!--[-->`);
			ssrRenderList(topDatesGraph.value, (item) => {
				_push(`<div><div class="flex items-center justify-between gap-4 text-sm"><span class="font-semibold">${ssrInterpolate(item.label)}</span><span class="text-slate-500 dark:text-slate-400">${ssrInterpolate(item.value)} trx</span></div><div class="mt-2 h-2 rounded-full bg-slate-100 dark:bg-zinc-800"><div class="h-full rounded-full bg-amber-500" style="${ssrRenderStyle({ width: item.width })}"></div></div></div>`);
			});
			_push(`<!--]-->`);
			if (topDatesGraph.value.length === 0) _push(`<p class="text-sm text-slate-500 dark:text-slate-400">Belum ada data tanggal.</p>`);
			else _push(`<!---->`);
			_push(`</div></section><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-zinc-800"><div><h2 class="text-lg font-semibold">Jam Transaksi Terbanyak</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${ssrInterpolate(busiestHour.value?.label ?? "Belum ada data")}</p></div><button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-slate-300 dark:hover:bg-zinc-800" title="Cetak jam transaksi terbanyak">`);
			_push(ssrRenderComponent(unref(Printer), { class: "h-4 w-4" }, null, _parent));
			_push(`</button></div><div class="mt-5 space-y-4"><!--[-->`);
			ssrRenderList(topHoursGraph.value, (item) => {
				_push(`<div><div class="flex items-center justify-between gap-4 text-sm"><span class="font-semibold">${ssrInterpolate(item.label)}</span><span class="text-slate-500 dark:text-slate-400">${ssrInterpolate(item.value)} trx</span></div><div class="mt-2 h-2 rounded-full bg-slate-100 dark:bg-zinc-800"><div class="h-full rounded-full bg-emerald-500" style="${ssrRenderStyle({ width: item.width })}"></div></div></div>`);
			});
			_push(`<!--]-->`);
			if (topHoursGraph.value.length === 0) _push(`<p class="text-sm text-slate-500 dark:text-slate-400">Belum ada data jam.</p>`);
			else _push(`<!---->`);
			_push(`</div></section></div><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-start justify-between gap-4 border-b border-slate-200 pb-4 dark:border-zinc-800"><div><h2 class="text-lg font-semibold">Produk Jarang Laku</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400"> Stok masih ada tapi paling sedikit terjual dalam ${ssrInterpolate(__props.slow_mover_days)} hari terakhir — pertimbangkan beri promo. </p></div>`);
			_push(ssrRenderComponent(unref(AlertTriangle), { class: "h-5 w-5 shrink-0 text-amber-500" }, null, _parent));
			_push(`</div><div class="mt-5 overflow-x-auto"><table class="w-full text-left text-sm"><thead><tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-zinc-800 dark:text-slate-400"><th class="pb-2 pr-3 font-semibold">Produk</th><th class="px-3 pb-2 text-right font-semibold">Terjual</th><th class="px-3 pb-2 text-right font-semibold">Stok</th><th class="pb-2 pl-3 text-right font-semibold">Saran</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-zinc-800"><!--[-->`);
			ssrRenderList(__props.slow_movers, (p) => {
				_push(`<tr><td class="py-3 pr-3"><div class="flex items-center gap-3">`);
				if (p.foto_url) _push(`<img${ssrRenderAttr("src", p.foto_url)}${ssrRenderAttr("alt", p.nama)} class="h-9 w-9 rounded-md border border-slate-200 object-cover dark:border-zinc-700">`);
				else {
					_push(`<div class="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-slate-400 dark:border-zinc-700 dark:bg-zinc-800">`);
					_push(ssrRenderComponent(unref(Package), { class: "h-4 w-4" }, null, _parent));
					_push(`</div>`);
				}
				_push(`<div class="min-w-0"><p class="truncate font-semibold">${ssrInterpolate(p.nama)}</p><p class="text-xs text-slate-500 dark:text-slate-400">${ssrInterpolate(unref(formatRupiah)(p.harga_jual))}</p></div></div></td><td class="px-3 text-right"><span class="${ssrRenderClass(p.terjual === 0 ? "font-bold text-rose-600 dark:text-rose-400" : "text-slate-600 dark:text-slate-300")}">${ssrInterpolate(formatQty(p.terjual))}</span></td><td class="px-3 text-right text-slate-600 dark:text-slate-300">${ssrInterpolate(formatQty(p.stok))} ${ssrInterpolate(p.satuan)}</td><td class="pl-3 text-right">`);
				if (p.sudah_promo) {
					_push(`<span class="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">`);
					_push(ssrRenderComponent(unref(Percent), { class: "h-3 w-3" }, null, _parent));
					_push(` Sudah promo </span>`);
				} else _push(ssrRenderComponent(unref(Link), {
					href: `/admin/promos?produk=${p.id_produk}`,
					class: "inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-indigo-500"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(ssrRenderComponent(unref(Percent), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(` Buat Promo `);
						} else return [createVNode(unref(Percent), { class: "h-3 w-3" }), createTextVNode(" Buat Promo ")];
					}),
					_: 2
				}, _parent));
				_push(`</td></tr>`);
			});
			_push(`<!--]-->`);
			if (__props.slow_movers.length === 0) _push(`<tr><td colspan="4" class="py-6 text-center text-slate-500 dark:text-slate-400"> Tidak ada produk berstok untuk dianalisis. </td></tr>`);
			else _push(`<!---->`);
			_push(`</tbody></table></div></section><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-zinc-800 md:flex-row md:items-center md:justify-between"><div><h2 class="text-lg font-semibold">Karyawan Dengan Omzet / Transaksi Terbanyak</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Perbandingan performa kasir pada periode aktif</p></div><div class="flex items-center gap-2"><button type="button" class="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-slate-300 dark:hover:bg-zinc-800">`);
			_push(ssrRenderComponent(unref(Printer), { class: "h-4 w-4" }, null, _parent));
			_push(` Omzet </button><button type="button" class="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-slate-300 dark:hover:bg-zinc-800">`);
			_push(ssrRenderComponent(unref(Printer), { class: "h-4 w-4" }, null, _parent));
			_push(` Transaksi </button></div></div><div class="mt-5 grid gap-6 lg:grid-cols-2"><div><div class="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">`);
			_push(ssrRenderComponent(unref(TrendingUp), { class: "h-4 w-4 text-sky-600 dark:text-sky-300" }, null, _parent));
			_push(` Omzet terbanyak </div><div class="space-y-4"><!--[-->`);
			ssrRenderList(topCashierRevenueGraph.value, (cashier) => {
				_push(`<div><div class="flex items-center justify-between gap-4 text-sm"><span class="min-w-0 truncate font-semibold">${ssrInterpolate(cashier.nama)}</span><span class="shrink-0 text-slate-500 dark:text-slate-400">${ssrInterpolate(unref(formatCompact)(cashier.revenue))}</span></div><div class="mt-2 h-2 rounded-full bg-slate-100 dark:bg-zinc-800"><div class="h-full rounded-full bg-sky-500" style="${ssrRenderStyle({ width: cashier.width })}"></div></div><p class="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">${ssrInterpolate(cashier.transactions)} transaksi</p></div>`);
			});
			_push(`<!--]-->`);
			if (topCashierRevenueGraph.value.length === 0) _push(`<p class="text-sm text-slate-500 dark:text-slate-400">Belum ada data karyawan.</p>`);
			else _push(`<!---->`);
			_push(`</div></div><div><div class="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">`);
			_push(ssrRenderComponent(unref(Users), { class: "h-4 w-4 text-emerald-600 dark:text-emerald-300" }, null, _parent));
			_push(` Transaksi terbanyak </div><div class="space-y-4"><!--[-->`);
			ssrRenderList(topCashierTransactionsGraph.value, (cashier) => {
				_push(`<div><div class="flex items-center justify-between gap-4 text-sm"><span class="min-w-0 truncate font-semibold">${ssrInterpolate(cashier.nama)}</span><span class="shrink-0 text-slate-500 dark:text-slate-400">${ssrInterpolate(cashier.transactions)} trx</span></div><div class="mt-2 h-2 rounded-full bg-slate-100 dark:bg-zinc-800"><div class="h-full rounded-full bg-emerald-500" style="${ssrRenderStyle({ width: cashier.width })}"></div></div><p class="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">${ssrInterpolate(unref(formatRupiah)(cashier.revenue))}</p></div>`);
			});
			_push(`<!--]-->`);
			if (topCashierTransactionsGraph.value.length === 0) _push(`<p class="text-sm text-slate-500 dark:text-slate-400">Belum ada data karyawan.</p>`);
			else _push(`<!---->`);
			_push(`</div></div></div></section><div class="grid gap-4 md:grid-cols-2"><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">`);
			_push(ssrRenderComponent(unref(CalendarDays), { class: "h-4 w-4 text-amber-600 dark:text-amber-300" }, null, _parent));
			_push(` Puncak tanggal </div><div class="text-2xl font-bold">${ssrInterpolate(busiestDate.value?.label ?? "-")}</div><p class="mt-2 text-sm text-slate-500 dark:text-slate-400">${ssrInterpolate(busiestDate.value?.value ?? 0)} transaksi</p></section><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">`);
			_push(ssrRenderComponent(unref(Clock3), { class: "h-4 w-4 text-emerald-600 dark:text-emerald-300" }, null, _parent));
			_push(` Puncak jam </div><div class="text-2xl font-bold">${ssrInterpolate(busiestHour.value?.label ?? "-")}</div><p class="mt-2 text-sm text-slate-500 dark:text-slate-400">${ssrInterpolate(busiestHour.value?.value ?? 0)} transaksi</p></section></div></div><!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/Dashboard.vue
var _sfc_setup = Dashboard_vue_vue_type_script_setup_true_lang_default.setup;
Dashboard_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/Dashboard.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Dashboard_default = Dashboard_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Dashboard_default as default };

//# sourceMappingURL=Dashboard-DImWgZHE.js.map