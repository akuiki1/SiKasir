import { n as useAppearance } from "./useAppearance-DAHt6sku.js";
import { t as Heading_default } from "./Heading-GycAGUxB.js";
import { t as edit } from "./appearance-C9XoGQxF.js";
import { Head } from "@inertiajs/vue3";
import { createVNode, defineComponent, mergeProps, resolveDynamicComponent, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderVNode } from "vue/server-renderer";
import { Monitor, Moon, Sun } from "lucide-vue-next";
//#region resources/js/components/AppearanceTabs.vue?vue&type=script&setup=true&lang.ts
var AppearanceTabs_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "AppearanceTabs",
	__ssrInlineRender: true,
	setup(__props) {
		const { appearance, updateAppearance } = useAppearance();
		const tabs = [
			{
				value: "light",
				Icon: Sun,
				label: "Light"
			},
			{
				value: "dark",
				Icon: Moon,
				label: "Dark"
			},
			{
				value: "system",
				Icon: Monitor,
				label: "System"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800" }, _attrs))}><!--[-->`);
			ssrRenderList(tabs, ({ value, Icon, label }) => {
				_push(`<button class="${ssrRenderClass(["flex items-center rounded-md px-3.5 py-1.5 transition-colors", unref(appearance) === value ? "bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100" : "text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60"])}">`);
				ssrRenderVNode(_push, createVNode(resolveDynamicComponent(Icon), { class: "-ml-1 h-4 w-4" }, null), _parent);
				_push(`<span class="ml-1.5 text-sm">${ssrInterpolate(label)}</span></button>`);
			});
			_push(`<!--]--></div>`);
		};
	}
});
//#endregion
//#region resources/js/components/AppearanceTabs.vue
var _sfc_setup$1 = AppearanceTabs_vue_vue_type_script_setup_true_lang_default.setup;
AppearanceTabs_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/AppearanceTabs.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var AppearanceTabs_default = AppearanceTabs_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region resources/js/pages/settings/Appearance.vue?vue&type=script&setup=true&lang.ts
var Appearance_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Appearance settings",
		href: edit()
	}] },
	__name: "Appearance",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Appearance settings" }, null, _parent));
			_push(`<h1 class="sr-only">Appearance settings</h1><div class="space-y-6">`);
			_push(ssrRenderComponent(Heading_default, {
				variant: "small",
				title: "Appearance settings",
				description: "Update the appearance settings for your account"
			}, null, _parent));
			_push(ssrRenderComponent(AppearanceTabs_default, null, null, _parent));
			_push(`</div><!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/settings/Appearance.vue
var _sfc_setup = Appearance_vue_vue_type_script_setup_true_lang_default.setup;
Appearance_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/settings/Appearance.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Appearance_default = Appearance_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Appearance_default as default };

//# sourceMappingURL=Appearance-nwn_-qEb.js.map