import { n as formatNumber, r as formatRupiah } from "./format-Cq6R5JhR.js";
import { Head } from "@inertiajs/vue3";
import { computed, createVNode, defineComponent, ref, resolveDynamicComponent, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderVNode } from "vue/server-renderer";
import { AlertTriangle, Calendar, Crown, Link2, Mail, Phone, Printer, Repeat, Sheet, ShoppingBasket, Trophy, UserPlus, UsersRound } from "lucide-vue-next";
//#region resources/js/pages/admin/laporan/Pelanggan.vue?vue&type=script&setup=true&lang.ts
var Pelanggan_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Laporan",
		href: "/admin/laporan/pelanggan"
	}, {
		title: "Wawasan Pelanggan",
		href: "/admin/laporan/pelanggan"
	}] },
	__name: "Pelanggan",
	__ssrInlineRender: true,
	props: {
		date_range: {},
		period_days: {},
		summary: {},
		composition: {},
		top_customers: {},
		retention: {},
		bundles: {}
	},
	setup(__props) {
		const props = __props;
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
		const compTrx = computed(() => {
			const reg = props.composition.registered.transactions;
			const guest = props.composition.guest.transactions;
			const total = reg + guest;
			return {
				regPct: total > 0 ? reg / total * 100 : 0,
				guestPct: total > 0 ? guest / total * 100 : 0,
				reg,
				guest,
				total
			};
		});
		const compRevenue = computed(() => {
			const reg = props.composition.registered.revenue;
			const guest = props.composition.guest.revenue;
			const total = reg + guest;
			return {
				regPct: total > 0 ? reg / total * 100 : 0,
				guestPct: total > 0 ? guest / total * 100 : 0,
				reg,
				guest,
				total
			};
		});
		const retentionShare = computed(() => {
			const active = props.retention.active;
			return {
				newPct: active > 0 ? props.retention.new / active * 100 : 0,
				returningPct: active > 0 ? props.retention.returning / active * 100 : 0
			};
		});
		const activeTab = ref("loyal");
		const tabs = [
			{
				key: "loyal",
				label: "Pelanggan Terloyal",
				icon: Crown
			},
			{
				key: "basket",
				label: "Keranjang & Bundling",
				icon: ShoppingBasket
			},
			{
				key: "retensi",
				label: "Retensi",
				icon: Repeat
			}
		];
		const topSort = ref("revenue");
		const sortedCustomers = computed(() => [...props.top_customers].sort((a, b) => topSort.value === "revenue" ? b.revenue - a.revenue : b.transactions - a.transactions));
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
			if (!value) return "—";
			const [y, m, d] = value.slice(0, 10).split("-");
			return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
		}
		computed(() => `${props.date_range.start_date} s/d ${props.date_range.end_date}`);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Wawasan Pelanggan - Admin" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 bg-slate-50 p-4 text-slate-950 sm:p-6 dark:bg-zinc-950 dark:text-slate-100"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400"> Laporan </p><h1 class="mt-1 text-2xl font-bold tracking-tight md:text-3xl"> Wawasan Pelanggan </h1><p class="mt-1 text-sm text-slate-500 dark:text-slate-400"> Strategi pemasaran &amp; loyalitas: siapa pelanggan terbaik, apa yang dibeli bersamaan, dan seberapa sering mereka kembali. </p></div><div class="flex flex-wrap items-center gap-2"><div class="relative"><button type="button" class="${ssrRenderClass([showFilter.value ? "border-violet-500 bg-violet-50 text-violet-600 dark:border-violet-500 dark:bg-violet-500/10 dark:text-violet-400" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800", "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition"])}">`);
			_push(ssrRenderComponent(unref(Calendar), { class: "h-4 w-4" }, null, _parent));
			_push(`<span class="hidden sm:inline">Periode</span><span class="rounded-md bg-violet-100 px-1.5 py-0.5 text-[11px] font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">${ssrInterpolate(filterBadgeLabel.value)}</span></button>`);
			if (showFilter.value) {
				_push(`<div class="absolute top-11 right-0 z-50 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"><p class="px-1 pb-2 text-xs font-semibold text-slate-400"> Analisis perilaku dari </p><div class="grid grid-cols-2 gap-1.5"><!--[-->`);
				ssrRenderList(PRESETS, (preset) => {
					_push(`<button type="button" class="${ssrRenderClass([activePreset.value?.days === preset.days ? "bg-violet-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "rounded-lg py-2 text-xs font-semibold transition-all"])}">${ssrInterpolate(preset.label)}</button>`);
				});
				_push(`<!--]--></div><div class="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-zinc-800"><p class="px-1 text-xs font-semibold text-slate-400"> Rentang khusus </p><div class="grid grid-cols-2 gap-2"><label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"> Mulai <input${ssrRenderAttr("value", customStart.value)} type="date" class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 transition outline-none focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100"></label><label class="grid gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"> Sampai <input${ssrRenderAttr("value", customEnd.value)} type="date" class="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 transition outline-none focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-slate-100"></label></div><button type="button" class="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-violet-500 text-xs font-semibold text-white transition hover:bg-violet-600">`);
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
			if (__props.summary.total_transactions === 0) {
				_push(`<div class="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 py-20 text-center dark:border-zinc-700">`);
				_push(ssrRenderComponent(unref(UsersRound), { class: "h-10 w-10 text-slate-400" }, null, _parent));
				_push(`<p class="text-sm font-medium text-slate-500 dark:text-slate-400"> Belum ada transaksi pada periode ini untuk dianalisis. </p></div>`);
			} else {
				_push(`<!--[--><div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400"> Rata-rata Keranjang </p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(unref(formatRupiah)(__props.summary.avg_basket))}</p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">`);
				_push(ssrRenderComponent(unref(ShoppingBasket), { class: "h-5 w-5" }, null, _parent));
				_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"> per transaksi · ${ssrInterpolate(__props.summary.avg_items)} jenis produk rata-rata </p></div><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400"> Pelanggan Terdaftar Aktif </p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(__props.summary.active_customers)}</p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">`);
				_push(ssrRenderComponent(unref(UsersRound), { class: "h-5 w-5" }, null, _parent));
				_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">${ssrInterpolate(__props.summary.new_customers)} baru · ${ssrInterpolate(__props.summary.returning_customers)} kembali </p></div><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400"> Repeat Order Rate </p><p class="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">${ssrInterpolate(__props.summary.repeat_rate)}% </p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">`);
				_push(ssrRenderComponent(unref(Repeat), { class: "h-5 w-5" }, null, _parent));
				_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400"> pelanggan lama yang datang kembali </p></div><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400"> Total Transaksi </p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(unref(formatNumber)(__props.summary.total_transactions))}</p></div><div class="flex h-11 w-11 items-center justify-center rounded-md bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">`);
				_push(ssrRenderComponent(unref(Trophy), { class: "h-5 w-5" }, null, _parent));
				_push(`</div></div><p class="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">${ssrInterpolate(__props.summary.registered_share)}% dari pelanggan terdaftar </p></div></div><section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-zinc-800"><h2 class="text-lg font-semibold"> Pelanggan Terdaftar vs Umum </h2><div class="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400"><span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-violet-500"></span>Terdaftar </span><span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-slate-300 dark:bg-zinc-600"></span>Umum (walk-in) </span></div></div><div class="mt-5 space-y-5"><div><div class="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400"><span>Jumlah Transaksi</span><span>${ssrInterpolate(compTrx.value.reg)} terdaftar · ${ssrInterpolate(compTrx.value.guest)} umum</span></div><div class="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800"><div class="h-full bg-violet-500 transition-all" style="${ssrRenderStyle({ width: `${compTrx.value.regPct}%` })}"${ssrRenderAttr("title", `Terdaftar: ${compTrx.value.reg} transaksi`)}></div><div class="h-full bg-slate-300 transition-all dark:bg-zinc-600" style="${ssrRenderStyle({ width: `${compTrx.value.guestPct}%` })}"${ssrRenderAttr("title", `Umum: ${compTrx.value.guest} transaksi`)}></div></div></div><div><div class="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400"><span>Kontribusi Omzet</span><span>${ssrInterpolate(unref(formatRupiah)(compRevenue.value.total))}</span></div><div class="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800"><div class="h-full bg-violet-500 transition-all" style="${ssrRenderStyle({ width: `${compRevenue.value.regPct}%` })}"${ssrRenderAttr("title", `Terdaftar: ${unref(formatRupiah)(compRevenue.value.reg)}`)}></div><div class="h-full bg-slate-300 transition-all dark:bg-zinc-600" style="${ssrRenderStyle({ width: `${compRevenue.value.guestPct}%` })}"${ssrRenderAttr("title", `Umum: ${unref(formatRupiah)(compRevenue.value.guest)}`)}></div></div><p class="mt-2 text-xs text-slate-500 dark:text-slate-400">${ssrInterpolate(Math.round(compRevenue.value.regPct))}% omzet berasal dari pelanggan terdaftar — semakin tinggi, semakin mudah Anda menjaga loyalitas lewat data. </p></div></div></section><div class="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><!--[-->`);
				ssrRenderList(tabs, (tab) => {
					_push(`<button type="button" class="${ssrRenderClass([activeTab.value === tab.key ? "bg-violet-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800", "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-sm font-semibold transition"])}">`);
					ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tab.icon), { class: "h-4 w-4 shrink-0" }, null), _parent);
					_push(`<span class="truncate">${ssrInterpolate(tab.label)}</span></button>`);
				});
				_push(`<!--]--></div>`);
				if (activeTab.value === "loyal") {
					_push(`<section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"><div class="flex items-start gap-3">`);
					_push(ssrRenderComponent(unref(Crown), { class: "mt-0.5 h-5 w-5 shrink-0" }, null, _parent));
					_push(`<p> Pelanggan terdaftar dengan kontribusi terbesar. Jaga hubungan dengan mereka — beri perhatian khusus atau promo loyalitas. </p></div><div class="flex shrink-0 gap-1 rounded-lg bg-white/70 p-0.5 dark:bg-zinc-900/50"><button type="button" class="${ssrRenderClass([topSort.value === "revenue" ? "bg-amber-500 text-white" : "text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-zinc-800", "rounded-md px-2.5 py-1 text-xs font-semibold transition"])}"> Belanja </button><button type="button" class="${ssrRenderClass([topSort.value === "visits" ? "bg-amber-500 text-white" : "text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-zinc-800", "rounded-md px-2.5 py-1 text-xs font-semibold transition"])}"> Kunjungan </button></div></div>`);
					if (sortedCustomers.value.length === 0) {
						_push(`<div class="flex flex-col items-center justify-center gap-2 py-12 text-center">`);
						_push(ssrRenderComponent(unref(UsersRound), { class: "h-9 w-9 text-slate-300" }, null, _parent));
						_push(`<p class="text-sm font-medium text-slate-500 dark:text-slate-400"> Belum ada pelanggan terdaftar yang bertransaksi pada periode ini. </p><p class="max-w-md text-xs text-slate-400"> Catat pelanggan (terutama reseller) saat transaksi di kasir agar loyalitas mereka bisa dianalisis di sini. </p></div>`);
					} else {
						_push(`<div class="mt-4 overflow-x-auto"><table class="w-full text-left text-sm"><thead><tr class="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase dark:border-zinc-800 dark:text-slate-400"><th class="pr-2 pb-2 font-semibold">#</th><th class="px-2 pb-2 font-semibold"> Pelanggan </th><th class="px-2 pb-2 text-right font-semibold"> Kunjungan </th><th class="px-2 pb-2 text-right font-semibold"> Total Belanja </th><th class="px-2 pb-2 text-right font-semibold"> Rata-rata </th><th class="pb-2 pl-2 text-right font-semibold"> Terakhir </th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-zinc-800"><!--[-->`);
						ssrRenderList(sortedCustomers.value, (c, i) => {
							_push(`<tr><td class="py-3 pr-2 text-sm font-bold text-slate-400 tabular-nums">${ssrInterpolate(i + 1)}</td><td class="px-2 py-3"><div class="flex items-center gap-2"><p class="font-semibold">${ssrInterpolate(c.nama)}</p>`);
							if (c.tipe === "reseller") _push(`<span class="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">Reseller</span>`);
							else _push(`<!---->`);
							_push(`<span class="${ssrRenderClass([c.is_returning ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300", "rounded-full px-1.5 py-0.5 text-[10px] font-bold"])}">${ssrInterpolate(c.is_returning ? "Kembali" : "Baru")}</span></div>`);
							if (c.telp) {
								_push(`<p class="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-400">`);
								_push(ssrRenderComponent(unref(Phone), { class: "h-3 w-3" }, null, _parent));
								_push(`${ssrInterpolate(c.telp)}</p>`);
							} else _push(`<!---->`);
							_push(`</td><td class="px-2 text-right font-medium tabular-nums">${ssrInterpolate(c.transactions)}x </td><td class="px-2 text-right font-semibold tabular-nums">${ssrInterpolate(unref(formatRupiah)(c.revenue))}</td><td class="px-2 text-right text-slate-600 tabular-nums dark:text-slate-300">${ssrInterpolate(unref(formatRupiah)(c.avg))}</td><td class="pl-2 text-right text-slate-600 dark:text-slate-300">${ssrInterpolate(formatDate(c.last_visit))}</td></tr>`);
						});
						_push(`<!--]--></tbody></table></div>`);
					}
					_push(`</section>`);
				} else if (activeTab.value === "basket") {
					_push(`<section class="space-y-5"><div class="grid gap-4 sm:grid-cols-3"><div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><p class="text-xs font-medium text-slate-500 dark:text-slate-400"> Rata-rata Belanja / Transaksi </p><p class="mt-1 text-xl font-bold">${ssrInterpolate(unref(formatRupiah)(__props.summary.avg_basket))}</p></div><div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><p class="text-xs font-medium text-slate-500 dark:text-slate-400"> Rata-rata Jenis Produk </p><p class="mt-1 text-xl font-bold">${ssrInterpolate(__props.summary.avg_items)} <span class="text-sm font-semibold text-slate-400">/ keranjang</span></p></div><div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><p class="text-xs font-medium text-slate-500 dark:text-slate-400"> Transaksi Multi-item </p><p class="mt-1 text-xl font-bold">${ssrInterpolate(__props.summary.multi_item_rate)}% </p></div></div><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-start gap-3 rounded-lg bg-violet-50 p-4 text-sm text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">`);
					_push(ssrRenderComponent(unref(Link2), { class: "mt-0.5 h-5 w-5 shrink-0" }, null, _parent));
					_push(`<p> Produk yang paling sering muncul bersamaan dalam satu transaksi. Manfaatkan untuk paket bundling, penataan rak berdekatan, atau rekomendasi &quot;sering dibeli bersama&quot;. </p></div>`);
					if (__props.bundles.length === 0) {
						_push(`<div class="flex flex-col items-center justify-center gap-2 py-12 text-center">`);
						_push(ssrRenderComponent(unref(ShoppingBasket), { class: "h-9 w-9 text-slate-300" }, null, _parent));
						_push(`<p class="text-sm font-medium text-slate-500 dark:text-slate-400"> Belum ada pola produk yang dibeli bersamaan. </p><p class="max-w-md text-xs text-slate-400"> Pola muncul saat ada cukup transaksi berisi lebih dari satu jenis produk. </p></div>`);
					} else {
						_push(`<ul class="mt-4 space-y-3"><!--[-->`);
						ssrRenderList(__props.bundles, (b, i) => {
							_push(`<li class="flex items-center gap-3"><div class="min-w-0 flex-1"><div class="flex items-center gap-2 text-sm font-semibold"><span class="truncate">${ssrInterpolate(b.a)}</span><span class="text-violet-400">+</span><span class="truncate">${ssrInterpolate(b.b)}</span></div><div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800"><div class="h-full rounded-full bg-violet-500" style="${ssrRenderStyle({ width: `${Math.min(100, b.pct)}%` })}"></div></div></div><div class="shrink-0 text-right"><p class="text-sm font-bold tabular-nums">${ssrInterpolate(b.count)}x </p><p class="text-xs text-slate-400 tabular-nums">${ssrInterpolate(b.pct)}% </p></div></li>`);
						});
						_push(`<!--]--></ul>`);
					}
					_push(`</div></section>`);
				} else {
					_push(`<section class="space-y-5"><div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-start gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">`);
					_push(ssrRenderComponent(unref(Repeat), { class: "mt-0.5 h-5 w-5 shrink-0" }, null, _parent));
					_push(`<p> Dari <span class="font-bold">${ssrInterpolate(__props.retention.active)}</span> pelanggan terdaftar yang aktif, <span class="font-bold">${ssrInterpolate(__props.retention.returning)} kembali</span> (sudah pernah belanja sebelumnya) dan <span class="font-bold">${ssrInterpolate(__props.retention.new)} baru</span>. Repeat order rate <span class="font-bold">${ssrInterpolate(__props.retention.repeat_rate)}%</span>. </p></div><div class="mt-5"><div class="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400"><span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-emerald-500"></span>Kembali (${ssrInterpolate(__props.retention.returning)}) </span><span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-sky-400"></span>Baru (${ssrInterpolate(__props.retention.new)}) </span></div><div class="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800"><div class="h-full bg-emerald-500 transition-all" style="${ssrRenderStyle({ width: `${retentionShare.value.returningPct}%` })}"${ssrRenderAttr("title", `Kembali: ${__props.retention.returning}`)}></div><div class="h-full bg-sky-400 transition-all" style="${ssrRenderStyle({ width: `${retentionShare.value.newPct}%` })}"${ssrRenderAttr("title", `Baru: ${__props.retention.new}`)}></div></div></div></div><div class="grid gap-4 sm:grid-cols-3"><div class="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10"><div class="flex items-center gap-2">`);
					_push(ssrRenderComponent(unref(Repeat), { class: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }, null, _parent));
					_push(`<p class="text-xs font-semibold text-emerald-700 dark:text-emerald-300"> Pelanggan Kembali </p></div><p class="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">${ssrInterpolate(__props.retention.returning)}</p><p class="mt-1 text-xs text-emerald-600/80 dark:text-emerald-400/80"> sudah pernah belanja sebelum periode ini </p></div><div class="rounded-lg border border-sky-200 bg-sky-50/60 p-4 dark:border-sky-500/30 dark:bg-sky-500/10"><div class="flex items-center gap-2">`);
					_push(ssrRenderComponent(unref(UserPlus), { class: "h-4 w-4 text-sky-600 dark:text-sky-400" }, null, _parent));
					_push(`<p class="text-xs font-semibold text-sky-700 dark:text-sky-300"> Pelanggan Baru </p></div><p class="mt-2 text-2xl font-bold text-sky-700 dark:text-sky-300">${ssrInterpolate(__props.retention.new)}</p><p class="mt-1 text-xs text-sky-600/80 dark:text-sky-400/80"> transaksi pertama jatuh di periode ini </p></div><div class="rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"><div class="flex items-center gap-2">`);
					_push(ssrRenderComponent(unref(Repeat), { class: "h-4 w-4 text-slate-500 dark:text-slate-400" }, null, _parent));
					_push(`<p class="text-xs font-semibold text-slate-600 dark:text-slate-300"> Datang Berulang </p></div><p class="mt-2 text-2xl font-bold">${ssrInterpolate(__props.retention.repeaters)}</p><p class="mt-1 text-xs text-slate-500 dark:text-slate-400"> belanja ≥ 2x dalam periode (${ssrInterpolate(__props.retention.one_timers)} sekali saja) </p></div></div></section>`);
				}
				_push(`<div class="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-slate-300">`);
				_push(ssrRenderComponent(unref(AlertTriangle), { class: "mt-0.5 h-4 w-4 shrink-0 text-slate-400" }, null, _parent));
				_push(`<p> Dihitung dari transaksi ${ssrInterpolate(__props.period_days)} hari terakhir. <b>Loyalitas</b> &amp; <b>retensi</b> hanya menghitung pelanggan terdaftar (punya nama di sistem); transaksi tanpa pelanggan dianggap <b>Umum</b> (walk-in). <b>Pelanggan kembali</b> = sudah pernah bertransaksi sebelum periode ini; <b>baru</b> = transaksi pertamanya jatuh di periode ini. <b>Rata-rata keranjang</b> &amp; <b>bundling</b> memakai semua transaksi (produk saja, jasa transfer/tarik tunai dikecualikan). Omzet = total bersih setelah diskon. </p></div><!--]-->`);
			}
			_push(`</div><!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/laporan/Pelanggan.vue
var _sfc_setup = Pelanggan_vue_vue_type_script_setup_true_lang_default.setup;
Pelanggan_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/laporan/Pelanggan.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Pelanggan_default = Pelanggan_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Pelanggan_default as default };

//# sourceMappingURL=Pelanggan-DtJ__AFK.js.map