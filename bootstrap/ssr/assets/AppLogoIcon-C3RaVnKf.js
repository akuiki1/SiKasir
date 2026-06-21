import { defineComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
//#region resources/js/components/AppLogoIcon.vue?vue&type=script&setup=true&lang.ts
var AppLogoIcon_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "AppLogoIcon",
	__ssrInlineRender: true,
	props: { className: { type: [
		Boolean,
		null,
		String,
		Object,
		Array
	] } },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<svg${ssrRenderAttrs(mergeProps({
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 32 32",
				fill: "none",
				class: __props.className
			}, _ctx.$attrs, _attrs))}><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 24 V8 L11 17 L16 8 V24"></path><path d="M18 8 H28 M23 8 V24"></path></g></svg>`);
		};
	}
});
//#endregion
//#region resources/js/components/AppLogoIcon.vue
var _sfc_setup = AppLogoIcon_vue_vue_type_script_setup_true_lang_default.setup;
AppLogoIcon_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/AppLogoIcon.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var AppLogoIcon_default = AppLogoIcon_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { AppLogoIcon_default as t };

//# sourceMappingURL=AppLogoIcon-C3RaVnKf.js.map