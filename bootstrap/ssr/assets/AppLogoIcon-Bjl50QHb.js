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
			_push(`<img${ssrRenderAttrs(mergeProps({
				src: "/images/logo.png",
				alt: "Cemilan Mba Tutut",
				class: "object-contain"
			}, _ctx.$attrs, _attrs))}>`);
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

//# sourceMappingURL=AppLogoIcon-Bjl50QHb.js.map