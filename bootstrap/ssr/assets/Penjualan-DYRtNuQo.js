import { n as formatNumber, r as formatRupiah } from "./format-Cq6R5JhR.js";
import { Head } from "@inertiajs/vue3";
import { computed, createVNode, defineComponent, ref, resolveDynamicComponent, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderVNode } from "vue/server-renderer";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, BadgePercent, ChevronLeft, ChevronRight, Clock, Filter, Mail, Printer, Receipt, Sheet, TrendingUp, Users, Wallet } from "lucide-vue-next";
//#region resources/js/pages/admin/laporan/Penjualan.vue?vue&type=script&setup=true&lang.ts
var Penjualan_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Laporan",
		href: "/admin/laporan/penjualan"
	}, {
		title: "Analisis Penjualan",
		href: "/admin/laporan/penjualan"
	}] },
	__name: "Penjualan",
	__ssrInlineRender: true,
	props: {
		date_range: {},
		period_days: {},
		summary: {},
		hourly: {},
		weekday: {},
		cashiers: {},
		trend: {},
		revenue_chart: {}
	},
	setup(__props) {
		const props = __props;
		const activeTab = ref("waktu_sibuk");
		const tabs = [
			{
				key: "waktu_sibuk",
				label: "Waktu Sibuk",
				icon: Clock
			},
			{
				key: "tren",
				label: "Tren Penjualan",
				icon: TrendingUp
			},
			{
				key: "kasir",
				label: "Performa Kasir",
				icon: Users
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
		const hasData = computed(() => props.summary.total_transactions > 0);
		const peakHour = computed(() => props.hourly.reduce((a, b) => b.count > a.count ? b : a, props.hourly[0]));
		const peakDay = computed(() => props.weekday.reduce((a, b) => b.count > a.count ? b : a, props.weekday[0]));
		const maxHourCount = computed(() => Math.max(...props.hourly.map((h) => h.count), 1));
		const hourlyBars = computed(() => props.hourly.map((h) => ({
			...h,
			height: `${Math.max(Math.round(h.count / maxHourCount.value * 100), h.count > 0 ? 6 : 0)}%`,
			isPeak: hasData.value && h.hour === peakHour.value.hour && h.count > 0
		})));
		const maxDayCount = computed(() => Math.max(...props.weekday.map((d) => d.count), 1));
		const weekdayBars = computed(() => props.weekday.map((d) => ({
			...d,
			height: `${Math.max(Math.round(d.count / maxDayCount.value * 100), d.count > 0 ? 6 : 0)}%`,
			isPeak: hasData.value && d.weekday === peakDay.value.weekday && d.count > 0
		})));
		const peakInsight = computed(() => {
			if (!hasData.value) return "Belum ada transaksi pada periode ini, jadi pola waktu sibuk belum bisa dibaca.";
			return `Toko paling ramai hari ${peakDay.value.label}, sekitar pukul ${peakHour.value.label}. Pertimbangkan menambah staf atau membuat promo "happy hour" di jam tersebut.`;
		});
		function pct(current, previous) {
			return previous > 0 ? (current - previous) / previous * 100 : null;
		}
		function buildTrendCard(metric, current, previous, money) {
			const delta = pct(current, previous);
			return {
				metric,
				valueText: money ? formatRupiah(current) : formatNumber(current),
				prevText: `dari ${money ? formatRupiah(previous) : formatNumber(previous)}`,
				showPct: delta !== null,
				up: (delta ?? 0) >= 0,
				pctText: delta !== null ? `${Math.abs(Math.round(delta))}% vs sebelumnya` : "baru periode ini"
			};
		}
		const trendGroups = computed(() => [{
			title: "Minggu Ini vs Minggu Lalu",
			subtitle: "Sejak Senin sampai sekarang, dibanding rentang yang sama minggu lalu.",
			cards: [buildTrendCard("Omzet", props.trend.this_week.revenue, props.trend.last_week.revenue, true), buildTrendCard("Transaksi", props.trend.this_week.count, props.trend.last_week.count, false)]
		}, {
			title: "Bulan Ini vs Bulan Lalu",
			subtitle: "Sejak tanggal 1 sampai sekarang, dibanding rentang yang sama bulan lalu.",
			cards: [buildTrendCard("Omzet", props.trend.this_month.revenue, props.trend.last_month.revenue, true), buildTrendCard("Transaksi", props.trend.this_month.count, props.trend.last_month.count, false)]
		}]);
		const trendInsight = computed(() => {
			const delta = pct(props.trend.this_month.revenue, props.trend.last_month.revenue);
			if (delta === null) return {
				tone: "neutral",
				message: "Belum ada data periode sebelumnya untuk dibandingkan."
			};
			if (delta >= 0) return {
				tone: "success",
				message: `Omzet bulan ini tumbuh ${Math.round(delta)}% dibanding rentang yang sama bulan lalu. Pertahankan momentum penjualan.`
			};
			return {
				tone: "danger",
				message: `Omzet bulan ini turun ${Math.abs(Math.round(delta))}% dibanding rentang yang sama bulan lalu. Tinjau promo atau jam ramai untuk mendorong penjualan.`
			};
		});
		const maxCashierRevenue = computed(() => Math.max(...props.cashiers.map((c) => c.revenue), 1));
		const cashierRows = computed(() => props.cashiers.map((c) => ({
			...c,
			width: `${Math.max(Math.round(c.revenue / maxCashierRevenue.value * 100), c.revenue > 0 ? 3 : 0)}%`,
			diskonPct: c.transactions > 0 ? c.diskon_count / c.transactions * 100 : 0
		})));
		const maxRevenue = computed(() => Math.max(...props.revenue_chart.map((p) => p.value), 1));
		const revenueColumns = computed(() => props.revenue_chart.map((point) => ({
			...point,
			height: `${Math.max(Math.round(point.value / maxRevenue.value * 100), point.value > 0 ? 4 : 0)}%`
		})));
		computed(() => `${props.date_range.start_date} s/d ${props.date_range.end_date}`);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Analisis Penjualan - Admin" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 bg-slate-50 p-4 text-slate-950 dark:bg-zinc-950 dark:text-slate-100 sm:p-6"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Laporan</p><h1 class="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Analisis Penjualan &amp; Performa</h1><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Waktu sibuk, tren penjualan, dan performa kasir untuk menaikkan omzet.</p></div><div class="flex flex-wrap items-center gap-2"><div class="relative"><button type="button" class="${ssrRenderClass([showFilter.value ? "border-sky-500 bg-sky-50 text-sky-600 dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-400" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800", "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition"])}">`);
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
			_push(`<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400">Omzet</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(unref(formatRupiah)(__props.summary.total_revenue))}</p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">`);
			_push(ssrRenderComponent(unref(Wallet), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">Total penjualan periode ini</p></div><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400">Jumlah Transaksi</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(unref(formatNumber)(__props.summary.total_transactions))}</p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">`);
			_push(ssrRenderComponent(unref(Receipt), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">${ssrInterpolate(unref(formatNumber)(__props.summary.diskon_count))} transaksi diberi diskon</p></div><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400">Rata-rata / Transaksi</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(unref(formatRupiah)(__props.summary.avg_transaction))}</p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">`);
			_push(ssrRenderComponent(unref(BadgePercent), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">Diskon diberikan ${ssrInterpolate(unref(formatRupiah)(__props.summary.total_diskon))}</p></div><div class="rounded-lg border border-amber-200 bg-amber-50/60 p-5 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400">Jam Tersibuk</p><p class="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-300">${ssrInterpolate(hasData.value ? peakHour.value.label : "—")}</p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">`);
			_push(ssrRenderComponent(unref(Clock), { class: "h-5 w-5" }, null, _parent));
			_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">Hari tersibuk: ${ssrInterpolate(hasData.value ? peakDay.value.label : "—")}</p></div></div><div class="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><!--[-->`);
			ssrRenderList(tabs, (tab) => {
				_push(`<button type="button" class="${ssrRenderClass([activeTab.value === tab.key ? "bg-sky-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition"])}">`);
				ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tab.icon), { class: "h-4 w-4" }, null), _parent);
				_push(`<span>${ssrInterpolate(tab.label)}</span></button>`);
			});
			_push(`<!--]--></div>`);
			if (activeTab.value === "waktu_sibuk") {
				_push(`<div class="flex flex-col gap-4"><div class="${ssrRenderClass([hasData.value ? "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300" : "bg-slate-100 text-slate-500 dark:bg-zinc-900 dark:text-slate-400", "flex items-start gap-3 rounded-lg p-4 shadow-sm"])}">`);
				_push(ssrRenderComponent(unref(Clock), { class: "mt-0.5 h-5 w-5 shrink-0" }, null, _parent));
				_push(`<p class="text-sm leading-relaxed">${ssrInterpolate(peakInsight.value)}</p></div><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-zinc-800"><div><h2 class="text-lg font-semibold">Transaksi per Jam</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Sebaran jumlah transaksi sepanjang hari (00–23).</p></div><span class="hidden items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 sm:inline-flex"><span class="h-2.5 w-2.5 rounded-sm bg-amber-400"></span>Jam tersibuk</span></div><div class="mt-5 overflow-x-auto"><div class="flex h-56 min-w-[760px] items-end gap-1.5 border-b border-slate-200 px-1 pb-7 dark:border-zinc-800"><!--[-->`);
				ssrRenderList(hourlyBars.value, (bar) => {
					_push(`<div class="group relative flex h-full flex-1 flex-col items-center justify-end"><div class="absolute bottom-[calc(100%+0.4rem)] z-10 hidden whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-1 text-xs shadow-lg group-hover:block dark:border-zinc-700 dark:bg-zinc-950"><span class="font-semibold">${ssrInterpolate(bar.label)}</span> · ${ssrInterpolate(bar.count)} trx<br><span class="text-slate-500 dark:text-slate-400">${ssrInterpolate(unref(formatRupiah)(bar.revenue))}</span></div><div class="${ssrRenderClass([bar.isPeak ? "bg-amber-400" : "bg-sky-500", "w-full max-w-[18px] rounded-t-sm transition-all duration-300"])}" style="${ssrRenderStyle({ height: bar.height })}"></div><span class="absolute -bottom-6 whitespace-nowrap text-[10px] font-medium text-slate-400">${ssrInterpolate(bar.hour)}</span></div>`);
				});
				_push(`<!--]--></div></div></section><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-zinc-800"><div><h2 class="text-lg font-semibold">Transaksi per Hari</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Hari mana toko paling ramai dalam seminggu.</p></div><span class="hidden items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 sm:inline-flex"><span class="h-2.5 w-2.5 rounded-sm bg-amber-400"></span>Hari tersibuk</span></div><div class="mt-5 flex h-56 items-end gap-2 border-b border-slate-200 px-1 pb-7 dark:border-zinc-800 sm:gap-4"><!--[-->`);
				ssrRenderList(weekdayBars.value, (bar) => {
					_push(`<div class="group relative flex h-full flex-1 flex-col items-center justify-end"><div class="absolute bottom-[calc(100%+0.4rem)] z-10 hidden whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-1 text-xs shadow-lg group-hover:block dark:border-zinc-700 dark:bg-zinc-950"><span class="font-semibold">${ssrInterpolate(bar.label)}</span> · ${ssrInterpolate(bar.count)} trx<br><span class="text-slate-500 dark:text-slate-400">${ssrInterpolate(unref(formatRupiah)(bar.revenue))}</span></div><div class="${ssrRenderClass([bar.isPeak ? "bg-amber-400" : "bg-sky-500", "w-full max-w-[48px] rounded-t-sm transition-all duration-300"])}" style="${ssrRenderStyle({ height: bar.height })}"></div><span class="absolute -bottom-6 whitespace-nowrap text-[11px] font-medium text-slate-500 dark:text-slate-400">${ssrInterpolate(bar.label)}</span></div>`);
				});
				_push(`<!--]--></div></section></div>`);
			} else if (activeTab.value === "tren") {
				_push(`<div class="flex flex-col gap-4"><div class="${ssrRenderClass([trendInsight.value.tone === "success" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : trendInsight.value.tone === "danger" ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300" : "bg-slate-100 text-slate-500 dark:bg-zinc-900 dark:text-slate-400", "flex items-start gap-3 rounded-lg p-4 shadow-sm"])}">`);
				_push(ssrRenderComponent(unref(TrendingUp), { class: "mt-0.5 h-5 w-5 shrink-0" }, null, _parent));
				_push(`<p class="text-sm leading-relaxed">${ssrInterpolate(trendInsight.value.message)}</p></div><!--[-->`);
				ssrRenderList(trendGroups.value, (group) => {
					_push(`<section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><h2 class="text-lg font-semibold">${ssrInterpolate(group.title)}</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${ssrInterpolate(group.subtitle)}</p><div class="mt-5 grid gap-3 sm:grid-cols-2"><!--[-->`);
					ssrRenderList(group.cards, (card) => {
						_push(`<div class="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40"><p class="text-sm font-medium text-slate-500 dark:text-slate-400">${ssrInterpolate(card.metric)}</p><p class="mt-1 text-xl font-bold">${ssrInterpolate(card.valueText)}</p><p class="${ssrRenderClass([!card.showPct ? "text-slate-500 dark:text-slate-400" : card.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400", "mt-1 inline-flex items-center gap-1 text-xs font-medium"])}">`);
						if (card.showPct) {
							_push(`<!--[-->`);
							if (card.up) _push(ssrRenderComponent(unref(ArrowUpRight), { class: "h-3.5 w-3.5" }, null, _parent));
							else _push(ssrRenderComponent(unref(ArrowDownRight), { class: "h-3.5 w-3.5" }, null, _parent));
							_push(` ${ssrInterpolate(card.pctText)}<!--]-->`);
						} else _push(`<!--[-->${ssrInterpolate(card.pctText)}<!--]-->`);
						_push(`</p><p class="mt-0.5 text-xs text-slate-400">${ssrInterpolate(card.prevText)}</p></div>`);
					});
					_push(`<!--]--></div></section>`);
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="flex flex-col gap-4"><div class="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">`);
				_push(ssrRenderComponent(unref(AlertTriangle), { class: "mt-0.5 h-4 w-4 shrink-0" }, null, _parent));
				_push(`<p>Frekuensi diskon ditampilkan sebagai sinyal kontrol. Pembatalan (void) belum direkam di sistem — transaksi yang dihapus tidak meninggalkan jejak — jadi frekuensi void belum tersedia di sini.</p></div><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><h2 class="text-lg font-semibold">Ringkasan per Kasir</h2><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Total penjualan, jumlah transaksi, dan diskon yang diberikan tiap staf.</p><div class="mt-5 overflow-x-auto"><table class="w-full text-left text-sm"><thead><tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-zinc-800 dark:text-slate-400"><th class="pb-2 pr-3 font-semibold">Kasir</th><th class="px-2 pb-2 text-right font-semibold">Omzet</th><th class="px-2 pb-2 text-right font-semibold">Trx</th><th class="px-2 pb-2 text-right font-semibold">Rata-rata</th><th class="px-2 pb-2 text-right font-semibold">Diskon</th><th class="pb-2 pl-2 text-right font-semibold">Frek. Diskon</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-zinc-800"><!--[-->`);
				ssrRenderList(cashierRows.value, (c) => {
					_push(`<tr><td class="py-3 pr-3 font-semibold">${ssrInterpolate(c.nama)}</td><td class="px-2 text-right font-medium tabular-nums">${ssrInterpolate(unref(formatRupiah)(c.revenue))}</td><td class="px-2 text-right tabular-nums text-slate-600 dark:text-slate-300">${ssrInterpolate(unref(formatNumber)(c.transactions))}</td><td class="px-2 text-right tabular-nums text-slate-600 dark:text-slate-300">${ssrInterpolate(unref(formatRupiah)(c.avg))}</td><td class="px-2 text-right tabular-nums text-slate-600 dark:text-slate-300">${ssrInterpolate(c.diskon > 0 ? unref(formatRupiah)(c.diskon) : "—")}</td><td class="${ssrRenderClass([c.diskonPct >= 50 ? "text-rose-600 dark:text-rose-400" : "text-slate-600 dark:text-slate-300", "pl-2 text-right tabular-nums"])}">${ssrInterpolate(c.diskon_count)} (${ssrInterpolate(Math.round(c.diskonPct))}%)</td></tr>`);
				});
				_push(`<!--]-->`);
				if (cashierRows.value.length === 0) _push(`<tr><td colspan="6" class="py-6 text-center text-sm text-slate-400">Belum ada transaksi pada periode ini.</td></tr>`);
				else _push(`<!---->`);
				_push(`</tbody></table></div></section>`);
				if (cashierRows.value.length > 0) {
					_push(`<section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><h3 class="text-sm font-semibold text-slate-600 dark:text-slate-300">Kontribusi Omzet per Kasir</h3><div class="mt-4 space-y-4"><!--[-->`);
					ssrRenderList(cashierRows.value, (c) => {
						_push(`<div><div class="flex items-center justify-between text-sm"><span class="font-semibold">${ssrInterpolate(c.nama)}</span><span class="text-slate-500 dark:text-slate-400">${ssrInterpolate(unref(formatRupiah)(c.revenue))} · ${ssrInterpolate(unref(formatNumber)(c.transactions))} trx</span></div><div class="mt-2 h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800"><div class="h-full rounded-full bg-sky-500 transition-all" style="${ssrRenderStyle({ width: c.width })}"></div></div></div>`);
					});
					_push(`<!--]--></div></section>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			}
			_push(`<section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-zinc-800"><h2 class="text-lg font-semibold">Tren Omzet Harian</h2><span class="text-xs text-slate-400">${ssrInterpolate(__props.date_range.start_date)} – ${ssrInterpolate(__props.date_range.end_date)}</span></div><div class="mt-5 overflow-x-auto"><div class="flex h-48 min-w-[640px] items-end gap-1.5 border-b border-slate-200 px-1 pb-7 dark:border-zinc-800"><!--[-->`);
			ssrRenderList(revenueColumns.value, (item) => {
				_push(`<div class="group relative flex h-full flex-1 flex-col items-center justify-end"><div class="absolute bottom-[calc(100%+0.4rem)] z-10 hidden whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-1 text-xs shadow-lg group-hover:block dark:border-zinc-700 dark:bg-zinc-950"><span class="font-semibold">${ssrInterpolate(item.label)}</span> · ${ssrInterpolate(unref(formatRupiah)(item.value))}<br><span class="text-slate-500 dark:text-slate-400">${ssrInterpolate(item.count)} transaksi</span></div><div class="w-full max-w-[14px] rounded-t-sm bg-sky-500 transition-all duration-300" style="${ssrRenderStyle({ height: item.height })}"></div><span class="absolute -bottom-6 whitespace-nowrap text-[10px] font-medium text-slate-400">${ssrInterpolate(item.label)}</span></div>`);
			});
			_push(`<!--]--></div></div></section></div><!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/laporan/Penjualan.vue
var _sfc_setup = Penjualan_vue_vue_type_script_setup_true_lang_default.setup;
Penjualan_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/laporan/Penjualan.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Penjualan_default = Penjualan_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Penjualan_default as default };

//# sourceMappingURL=Penjualan-DYRtNuQo.js.map