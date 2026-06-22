import { n as formatNumber, r as formatRupiah, t as formatCompact } from "./format-Cq6R5JhR.js";
import { Head, Link } from "@inertiajs/vue3";
import { computed, createBlock, createTextVNode, createVNode, defineComponent, openBlock, ref, resolveDynamicComponent, toDisplayString, unref, useSSRContext, withCtx } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderVNode } from "vue/server-renderer";
import { Archive, ArrowDownRight, ArrowRight, ArrowUpRight, CheckCircle2, CircleDollarSign, Clock, FileText, LayoutDashboard, LineChart, Package, PackageX, Percent, ShoppingCart, Users, Wallet } from "lucide-vue-next";
//#region resources/js/pages/admin/Dashboard.vue?vue&type=script&setup=true&lang.ts
var W = 720;
var H = 260;
var Dashboard_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Admin Dashboard",
		href: "/admin/dashboard"
	}] },
	__name: "Dashboard",
	__ssrInlineRender: true,
	props: {
		greeting: {},
		admin_name: {},
		today_label: {},
		active_cashier: {},
		today_stats: {},
		trend: {},
		alerts: {},
		recent_activity: {}
	},
	setup(__props) {
		const props = __props;
		const kpiCards = computed(() => [
			{
				label: "Omzet Hari Ini",
				value: formatRupiah(props.today_stats.revenue),
				delta: props.today_stats.revenue_delta,
				icon: LineChart,
				tint: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300"
			},
			{
				label: "Transaksi Hari Ini",
				value: formatNumber(props.today_stats.transactions, 0),
				delta: props.today_stats.transactions_delta,
				icon: ShoppingCart,
				tint: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
			},
			{
				label: "Laba Kotor Hari Ini",
				value: formatRupiah(props.today_stats.gross_profit),
				delta: props.today_stats.gross_profit_delta,
				margin: props.today_stats.margin,
				icon: Wallet,
				tint: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300"
			},
			{
				label: "Produk Terjual",
				value: formatNumber(props.today_stats.items_sold, 1),
				subtitle: `${formatNumber(props.today_stats.avg_items, 1)} / Nota (Rata-rata)`,
				icon: Package,
				tint: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
			}
		]);
		const SEVERITY = {
			danger: {
				icon: PackageX,
				chip: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
				button: "border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
			},
			warning: {
				icon: Archive,
				chip: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
				button: "border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-500/30 dark:text-orange-300 dark:hover:bg-orange-500/10"
			},
			caution: {
				icon: CircleDollarSign,
				chip: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
				button: "border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-300 dark:hover:bg-amber-500/10"
			},
			info: {
				icon: Users,
				chip: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
				button: "border-sky-200 text-sky-600 hover:bg-sky-50 dark:border-sky-500/30 dark:text-sky-300 dark:hover:bg-sky-500/10"
			}
		};
		const shortcuts = [
			{
				title: "Keuangan",
				desc: "Laba rugi & arus kas",
				href: "/admin/laporan/keuangan",
				icon: CircleDollarSign,
				iconClass: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30",
				glow: "from-emerald-500/10",
				hover: "group-hover:border-emerald-300 dark:group-hover:border-emerald-500/40",
				arrow: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
			},
			{
				title: "Penjualan",
				desc: "Tren & performa kasir",
				href: "/admin/laporan/penjualan",
				icon: ShoppingCart,
				iconClass: "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sky-500/30",
				glow: "from-sky-500/10",
				hover: "group-hover:border-sky-300 dark:group-hover:border-sky-500/40",
				arrow: "group-hover:text-sky-600 dark:group-hover:text-sky-400"
			},
			{
				title: "Inventaris",
				desc: "Perputaran & nilai stok",
				href: "/admin/laporan/inventaris",
				icon: Package,
				iconClass: "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-violet-500/30",
				glow: "from-violet-500/10",
				hover: "group-hover:border-violet-300 dark:group-hover:border-violet-500/40",
				arrow: "group-hover:text-violet-600 dark:group-hover:text-violet-400"
			},
			{
				title: "Pelanggan",
				desc: "Loyalitas & retensi",
				href: "/admin/laporan/pelanggan",
				icon: Users,
				iconClass: "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-rose-500/30",
				glow: "from-rose-500/10",
				hover: "group-hover:border-rose-300 dark:group-hover:border-rose-500/40",
				arrow: "group-hover:text-rose-600 dark:group-hover:text-rose-400"
			}
		];
		const metric = ref("revenue");
		const PAD = {
			left: 46,
			right: 18,
			top: 28,
			bottom: 42
		};
		const plotW = W - PAD.left - PAD.right;
		const plotH = H - PAD.top - PAD.bottom;
		function niceCeil(value) {
			if (value <= 0) return 1;
			const mag = Math.pow(10, Math.floor(Math.log10(value)));
			const norm = value / mag;
			return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
		}
		const isRevenue = computed(() => metric.value === "revenue");
		function metricValue(point) {
			return isRevenue.value ? point.revenue : point.transactions;
		}
		function axisLabel(value) {
			return isRevenue.value ? formatCompact(value) : formatNumber(Math.round(value), 0);
		}
		const chart = computed(() => {
			const data = props.trend;
			const max = niceCeil(Math.max(...data.map(metricValue), 0));
			const stepX = data.length > 1 ? plotW / (data.length - 1) : 0;
			const baseY = PAD.top + plotH;
			const points = data.map((point, i) => {
				const value = metricValue(point);
				const x = PAD.left + stepX * i;
				const y = PAD.top + plotH * (1 - value / max);
				const valueText = isRevenue.value ? formatCompact(value) : formatNumber(value, 0);
				const isLast = i === data.length - 1;
				return {
					key: point.date + i,
					x,
					y,
					day: point.day,
					date: point.date,
					valueText,
					isLast,
					badgeW: Math.max(34, valueText.length * 7 + 12)
				};
			});
			return {
				points,
				linePath: points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "),
				areaPath: points.length ? `M${points[0].x.toFixed(1)},${baseY} ${points.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} L${points[points.length - 1].x.toFixed(1)},${baseY} Z` : "",
				ticks: [
					0,
					1,
					2,
					3,
					4
				].map((i) => ({
					y: PAD.top + plotH * (1 - i / 4),
					label: axisLabel(max * i / 4)
				})),
				baseY
			};
		});
		function deltaTone(delta) {
			if (delta === null || delta === 0) return "text-slate-400 dark:text-slate-500";
			return delta > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400";
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Admin Dashboard" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 bg-slate-50 p-6 text-slate-950 dark:bg-zinc-950 dark:text-slate-100"><div class="relative overflow-hidden rounded-2xl border border-sky-200/70 bg-gradient-to-br from-sky-100/80 via-white to-blue-50/50 p-5 shadow-sm md:p-6 dark:border-sky-500/20 dark:from-sky-500/10 dark:via-zinc-900 dark:to-blue-500/5"><div class="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div class="flex flex-col gap-2"><span class="inline-flex w-fit items-center gap-1.5 rounded-full border border-sky-300/60 bg-sky-100/70 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-300">`);
			_push(ssrRenderComponent(unref(LayoutDashboard), { class: "h-3.5 w-3.5" }, null, _parent));
			_push(` Panel Admin </span><h1 class="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl dark:text-white">${ssrInterpolate(props.greeting)}, ${ssrInterpolate(props.admin_name)} 👋</h1><p class="text-sm font-medium text-slate-500 dark:text-slate-400">${ssrInterpolate(props.today_label)}</p></div>`);
			if (props.active_cashier) _push(`<div class="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-sky-200/70 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur dark:border-sky-500/20 dark:bg-zinc-900/70 dark:text-slate-300"><span class="relative flex h-2.5 w-2.5"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span></span> Kasir: ${ssrInterpolate(props.active_cashier)}</div>`);
			else _push(`<!---->`);
			_push(`</div><div class="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-sky-400/20 blur-3xl"></div><div class="pointer-events-none absolute bottom-0 right-28 h-28 w-28 rounded-full bg-blue-400/10 blur-2xl"></div></div><div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
			ssrRenderList(kpiCards.value, (card) => {
				_push(`<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-start justify-between gap-4"><div class="min-w-0"><p class="text-sm font-medium text-slate-500 dark:text-slate-400">${ssrInterpolate(card.label)}</p><p class="mt-2 text-2xl font-bold tracking-tight">${ssrInterpolate(card.value)}</p></div><div class="${ssrRenderClass([card.tint, "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"])}">`);
				ssrRenderVNode(_push, createVNode(resolveDynamicComponent(card.icon), { class: "h-5 w-5" }, null), _parent);
				_push(`</div></div><div class="mt-4 flex items-center justify-between gap-2"><div class="${ssrRenderClass([card.subtitle ? "text-slate-500 dark:text-slate-400" : deltaTone(card.delta ?? null), "flex items-center gap-1.5 text-xs font-medium"])}">`);
				if (card.subtitle) _push(`<!--[-->${ssrInterpolate(card.subtitle)}<!--]-->`);
				else if (card.delta === null) _push(`<span class="text-slate-400 dark:text-slate-500">Baru hari ini</span>`);
				else {
					_push(`<!--[-->`);
					if (card.delta > 0) _push(ssrRenderComponent(unref(ArrowUpRight), { class: "h-3.5 w-3.5" }, null, _parent));
					else if (card.delta < 0) _push(ssrRenderComponent(unref(ArrowDownRight), { class: "h-3.5 w-3.5" }, null, _parent));
					else _push(`<!---->`);
					_push(`<span>${ssrInterpolate(Math.abs(card.delta))}%</span><span class="text-slate-400 dark:text-slate-500">vs kemarin</span><!--]-->`);
				}
				_push(`</div>`);
				if (card.margin !== void 0) {
					_push(`<span class="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" title="Margin laba kotor hari ini">`);
					_push(ssrRenderComponent(unref(Percent), { class: "h-3 w-3" }, null, _parent));
					_push(` ${ssrInterpolate(card.margin === null ? "—" : `${card.margin}% margin`)}</span>`);
				} else _push(`<!---->`);
				_push(`</div></div>`);
			});
			_push(`<!--]--></div><div class="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"><section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center gap-2 border-b border-slate-200 pb-4 dark:border-zinc-800"><span class="text-lg">⚠️</span><h2 class="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">Perlu Perhatian</h2></div>`);
			if (props.alerts.length) {
				_push(`<div class="mt-4 space-y-3"><!--[-->`);
				ssrRenderList(props.alerts, (alert) => {
					_push(`<div class="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-800/40"><div class="${ssrRenderClass([SEVERITY[alert.severity].chip, "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"])}">`);
					ssrRenderVNode(_push, createVNode(resolveDynamicComponent(SEVERITY[alert.severity].icon), { class: "h-4 w-4" }, null), _parent);
					_push(`</div><p class="min-w-0 flex-1 text-sm text-slate-700 dark:text-slate-200"><span class="font-bold">${ssrInterpolate(alert.count)}</span> ${ssrInterpolate(alert.label)}</p>`);
					_push(ssrRenderComponent(unref(Link), {
						href: alert.cta_href,
						class: ["inline-flex shrink-0 items-center rounded-lg border px-3 py-1.5 text-xs font-semibold transition", SEVERITY[alert.severity].button]
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(alert.cta_label)}`);
							else return [createTextVNode(toDisplayString(alert.cta_label), 1)];
						}),
						_: 2
					}, _parent));
					_push(`</div>`);
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="mt-4 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 py-10 text-center dark:border-zinc-700">`);
				_push(ssrRenderComponent(unref(CheckCircle2), { class: "h-8 w-8 text-emerald-500" }, null, _parent));
				_push(`<p class="text-sm font-medium text-slate-600 dark:text-slate-300">Semua aman</p><p class="text-xs text-slate-400 dark:text-slate-500">Tidak ada yang perlu ditindak saat ini.</p></div>`);
			}
			_push(`</section><section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-zinc-800"><h2 class="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">Tren 7 Hari Terakhir</h2><select class="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 outline-none transition focus:border-sky-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-300"><option value="revenue"${ssrIncludeBooleanAttr(Array.isArray(metric.value) ? ssrLooseContain(metric.value, "revenue") : ssrLooseEqual(metric.value, "revenue")) ? " selected" : ""}>Omzet</option><option value="transactions"${ssrIncludeBooleanAttr(Array.isArray(metric.value) ? ssrLooseContain(metric.value, "transactions") : ssrLooseEqual(metric.value, "transactions")) ? " selected" : ""}>Transaksi</option></select></div><div class="mt-3"><svg${ssrRenderAttr("viewBox", `0 0 ${W} ${H}`)} class="h-auto w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Grafik tren 7 hari"><defs><linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.22"></stop><stop offset="100%" stop-color="#0ea5e9" stop-opacity="0"></stop></linearGradient></defs><!--[-->`);
			ssrRenderList(chart.value.ticks, (tick, i) => {
				_push(`<g><line${ssrRenderAttr("x1", PAD.left)}${ssrRenderAttr("y1", tick.y)}${ssrRenderAttr("x2", W - PAD.right)}${ssrRenderAttr("y2", tick.y)} class="stroke-slate-100 dark:stroke-zinc-800" stroke-width="1"></line><text${ssrRenderAttr("x", PAD.left - 8)}${ssrRenderAttr("y", tick.y + 3)} text-anchor="end" class="fill-slate-400 text-[10px] dark:fill-slate-500">${ssrInterpolate(tick.label)}</text></g>`);
			});
			_push(`<!--]--><path${ssrRenderAttr("d", chart.value.areaPath)} fill="url(#trendArea)"></path><path${ssrRenderAttr("d", chart.value.linePath)} fill="none" class="stroke-sky-500" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></path><!--[-->`);
			ssrRenderList(chart.value.points, (point) => {
				_push(`<g><circle${ssrRenderAttr("cx", point.x)}${ssrRenderAttr("cy", point.y)}${ssrRenderAttr("r", point.isLast ? 4.5 : 3.5)} class="fill-white stroke-sky-500" stroke-width="2"></circle>`);
				if (point.isLast) _push(`<!--[--><rect${ssrRenderAttr("x", point.x - point.badgeW / 2)}${ssrRenderAttr("y", point.y - 27)}${ssrRenderAttr("width", point.badgeW)} height="18" rx="5" class="fill-sky-500"></rect><text${ssrRenderAttr("x", point.x)}${ssrRenderAttr("y", point.y - 14)} text-anchor="middle" class="fill-white text-[10px] font-bold">${ssrInterpolate(point.valueText)}</text><!--]-->`);
				else _push(`<text${ssrRenderAttr("x", point.x)}${ssrRenderAttr("y", point.y - 11)} text-anchor="middle" class="fill-slate-400 text-[10px] font-semibold dark:fill-slate-500">${ssrInterpolate(point.valueText)}</text>`);
				_push(`<text${ssrRenderAttr("x", point.x)}${ssrRenderAttr("y", chart.value.baseY + 18)} text-anchor="middle" class="fill-slate-500 text-[11px] font-semibold dark:fill-slate-300">${ssrInterpolate(point.day)}</text><text${ssrRenderAttr("x", point.x)}${ssrRenderAttr("y", chart.value.baseY + 31)} text-anchor="middle" class="fill-slate-400 text-[9px] dark:fill-slate-500">${ssrInterpolate(point.date)}</text></g>`);
			});
			_push(`<!--]--></svg></div></section></div><div class="grid gap-4 xl:grid-cols-2"><section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><h2 class="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">Pintasan Laporan</h2><div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"><!--[-->`);
			ssrRenderList(shortcuts, (item) => {
				_push(ssrRenderComponent(unref(Link), {
					key: item.title,
					href: item.href,
					class: ["group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900", item.hover]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="${ssrRenderClass([item.glow, "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"])}"${_scopeId}></div><div class="relative z-10 flex items-center gap-3"${_scopeId}><div class="${ssrRenderClass([item.iconClass, "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg transition-transform duration-200 group-hover:scale-105"])}"${_scopeId}>`);
							ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), { class: "h-6 w-6" }, null), _parent, _scopeId);
							_push(`</div><div class="min-w-0 flex-1"${_scopeId}><p class="text-sm font-bold text-slate-800 dark:text-slate-100"${_scopeId}>${ssrInterpolate(item.title)}</p><p class="truncate text-xs text-slate-400 dark:text-slate-500"${_scopeId}>${ssrInterpolate(item.desc)}</p></div>`);
							_push(ssrRenderComponent(unref(ArrowRight), { class: ["h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-1 dark:text-slate-600", item.arrow] }, null, _parent, _scopeId));
							_push(`</div>`);
						} else return [createVNode("div", { class: ["pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100", item.glow] }, null, 2), createVNode("div", { class: "relative z-10 flex items-center gap-3" }, [
							createVNode("div", { class: ["flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg transition-transform duration-200 group-hover:scale-105", item.iconClass] }, [(openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "h-6 w-6" }))], 2),
							createVNode("div", { class: "min-w-0 flex-1" }, [createVNode("p", { class: "text-sm font-bold text-slate-800 dark:text-slate-100" }, toDisplayString(item.title), 1), createVNode("p", { class: "truncate text-xs text-slate-400 dark:text-slate-500" }, toDisplayString(item.desc), 1)]),
							createVNode(unref(ArrowRight), { class: ["h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-1 dark:text-slate-600", item.arrow] }, null, 8, ["class"])
						])];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></div></section><section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><h2 class="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">Aktivitas Terbaru</h2>`);
			_push(ssrRenderComponent(unref(Link), {
				href: "/admin/transactions",
				class: "text-xs font-semibold text-sky-600 transition hover:text-sky-700 dark:text-sky-400"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Lihat Semua`);
					else return [createTextVNode("Lihat Semua")];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="mt-4 divide-y divide-slate-100 dark:divide-zinc-800"><!--[-->`);
			ssrRenderList(props.recent_activity, (item) => {
				_push(ssrRenderComponent(unref(Link), {
					key: item.kode,
					href: `/admin/transactions?search=${item.kode}&start_date=${item.tanggal_iso}&end_date=${item.tanggal_iso}`,
					class: "group flex items-center gap-3 rounded-lg px-1 py-2.5 transition hover:bg-slate-50 dark:hover:bg-zinc-800/40",
					title: `Lihat ${item.kode} di Data Transaksi`
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-sky-100 group-hover:text-sky-600 dark:bg-zinc-800 dark:text-slate-400 dark:group-hover:bg-sky-500/15 dark:group-hover:text-sky-300"${_scopeId}>`);
							_push(ssrRenderComponent(unref(FileText), { class: "h-4 w-4" }, null, _parent, _scopeId));
							_push(`</div><div class="min-w-0 flex-1"${_scopeId}><p class="truncate font-mono text-sm font-semibold text-slate-700 dark:text-slate-200"${_scopeId}>${ssrInterpolate(item.kode)}</p><p class="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Users), { class: "h-3 w-3 shrink-0" }, null, _parent, _scopeId));
							_push(`<span class="truncate"${_scopeId}>${ssrInterpolate(item.kasir)}</span></p></div><div class="shrink-0 text-right"${_scopeId}><p class="text-sm font-bold tabular-nums"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(item.total))}</p><p class="flex items-center justify-end gap-1 text-xs text-slate-400 dark:text-slate-500"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Clock), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(` ${ssrInterpolate(item.tanggal)} · ${ssrInterpolate(item.waktu)}</p></div>`);
						} else return [
							createVNode("div", { class: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-sky-100 group-hover:text-sky-600 dark:bg-zinc-800 dark:text-slate-400 dark:group-hover:bg-sky-500/15 dark:group-hover:text-sky-300" }, [createVNode(unref(FileText), { class: "h-4 w-4" })]),
							createVNode("div", { class: "min-w-0 flex-1" }, [createVNode("p", { class: "truncate font-mono text-sm font-semibold text-slate-700 dark:text-slate-200" }, toDisplayString(item.kode), 1), createVNode("p", { class: "flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500" }, [createVNode(unref(Users), { class: "h-3 w-3 shrink-0" }), createVNode("span", { class: "truncate" }, toDisplayString(item.kasir), 1)])]),
							createVNode("div", { class: "shrink-0 text-right" }, [createVNode("p", { class: "text-sm font-bold tabular-nums" }, toDisplayString(unref(formatRupiah)(item.total)), 1), createVNode("p", { class: "flex items-center justify-end gap-1 text-xs text-slate-400 dark:text-slate-500" }, [createVNode(unref(Clock), { class: "h-3 w-3" }), createTextVNode(" " + toDisplayString(item.tanggal) + " · " + toDisplayString(item.waktu), 1)])])
						];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]-->`);
			if (!props.recent_activity.length) _push(`<p class="py-10 text-center text-sm text-slate-500 dark:text-slate-400"> Belum ada transaksi. </p>`);
			else _push(`<!---->`);
			_push(`</div></section></div></div><!--]-->`);
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

//# sourceMappingURL=Dashboard-CLAg-fcs.js.map