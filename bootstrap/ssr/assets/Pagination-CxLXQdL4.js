import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
//#region resources/js/components/Pagination.vue?vue&type=script&setup=true&lang.ts
var Pagination_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Pagination",
	__ssrInlineRender: true,
	props: {
		currentPage: {},
		totalPages: {},
		totalItems: {},
		startIndex: {},
		endIndex: {},
		perPage: {},
		visiblePages: {}
	},
	emits: ["update:currentPage", "update:perPage"],
	setup(__props, { emit: __emit }) {
		const perPageOptions = [
			5,
			10,
			25,
			50,
			100
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-3 border-t border-sidebar-border/70 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between dark:border-sidebar-border" }, _attrs))}><div class="flex items-center gap-3 text-sm text-muted-foreground"><span>Tampilkan</span><select${ssrRenderAttr("value", __props.perPage)} class="rounded-lg border border-sidebar-border/70 bg-background px-2 py-1 text-sm font-medium focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"><!--[-->`);
			ssrRenderList(perPageOptions, (opt) => {
				_push(`<option${ssrRenderAttr("value", opt)}>${ssrInterpolate(opt)}</option>`);
			});
			_push(`<!--]--></select><span>per halaman</span>`);
			if (__props.totalItems > 0) _push(`<span class="hidden lg:inline"> — Menampilkan ${ssrInterpolate(__props.startIndex)}–${ssrInterpolate(__props.endIndex)} dari ${ssrInterpolate(__props.totalItems)} data </span>`);
			else _push(`<span class="hidden lg:inline">— Tidak ada data</span>`);
			_push(`</div><div class="flex items-center gap-1"><button${ssrIncludeBooleanAttr(__props.currentPage <= 1) ? " disabled" : ""} class="flex h-8 w-8 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-sidebar-border dark:hover:bg-zinc-800/40">`);
			_push(ssrRenderComponent(unref(ChevronLeft), { class: "h-4 w-4" }, null, _parent));
			_push(`</button><!--[-->`);
			ssrRenderList(__props.visiblePages, (pg, i) => {
				_push(`<!--[-->`);
				if (pg === -1) _push(`<span class="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"> … </span>`);
				else _push(`<button class="${ssrRenderClass(["flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-medium transition-colors", pg === __props.currentPage ? "border-indigo-500 bg-indigo-600 text-white" : "border-sidebar-border/70 bg-background hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"])}">${ssrInterpolate(pg)}</button>`);
				_push(`<!--]-->`);
			});
			_push(`<!--]--><button${ssrIncludeBooleanAttr(__props.currentPage >= __props.totalPages) ? " disabled" : ""} class="flex h-8 w-8 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background text-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-sidebar-border dark:hover:bg-zinc-800/40">`);
			_push(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4" }, null, _parent));
			_push(`</button></div></div>`);
		};
	}
});
//#endregion
//#region resources/js/components/Pagination.vue
var _sfc_setup = Pagination_vue_vue_type_script_setup_true_lang_default.setup;
Pagination_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Pagination.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Pagination_default = Pagination_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Pagination_default as t };

//# sourceMappingURL=Pagination-CxLXQdL4.js.map