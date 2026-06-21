import { t as dashboard } from "./routes-VTLDKrk-.js";
import { Head } from "@inertiajs/vue3";
import { defineComponent, mergeProps, unref, useId, useSSRContext } from "vue";
import { ssrRenderAttr, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region resources/js/components/PlaceholderPattern.vue?vue&type=script&setup=true&lang.ts
var PlaceholderPattern_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "PlaceholderPattern",
	__ssrInlineRender: true,
	setup(__props) {
		const patternId = `pattern-${useId()}`;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<svg${ssrRenderAttrs(mergeProps({
				class: "absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20",
				fill: "none"
			}, _attrs))}><defs><pattern${ssrRenderAttr("id", patternId)} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M-1 5L5 -1M3 9L8.5 3.5" stroke-width="0.5"></path></pattern></defs><rect stroke="none"${ssrRenderAttr("fill", `url(#${patternId})`)} width="100%" height="100%"></rect></svg>`);
		};
	}
});
//#endregion
//#region resources/js/components/PlaceholderPattern.vue
var _sfc_setup$1 = PlaceholderPattern_vue_vue_type_script_setup_true_lang_default.setup;
PlaceholderPattern_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/PlaceholderPattern.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var PlaceholderPattern_default = PlaceholderPattern_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region resources/js/pages/Dashboard.vue?vue&type=script&setup=true&lang.ts
var Dashboard_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Dashboard",
		href: dashboard()
	}] },
	__name: "Dashboard",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Dashboard" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4"><div class="grid auto-rows-min gap-4 md:grid-cols-3"><div class="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">`);
			_push(ssrRenderComponent(PlaceholderPattern_default, null, null, _parent));
			_push(`</div><div class="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">`);
			_push(ssrRenderComponent(PlaceholderPattern_default, null, null, _parent));
			_push(`</div><div class="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">`);
			_push(ssrRenderComponent(PlaceholderPattern_default, null, null, _parent));
			_push(`</div></div><div class="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">`);
			_push(ssrRenderComponent(PlaceholderPattern_default, null, null, _parent));
			_push(`</div></div><!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/Dashboard.vue
var _sfc_setup = Dashboard_vue_vue_type_script_setup_true_lang_default.setup;
Dashboard_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Dashboard.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Dashboard_default = Dashboard_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Dashboard_default as default };

//# sourceMappingURL=Dashboard-DA5J6WNz.js.map