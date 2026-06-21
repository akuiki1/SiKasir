import { defineComponent, mergeProps, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderClass } from "vue/server-renderer";
//#region resources/js/components/Heading.vue?vue&type=script&setup=true&lang.ts
var Heading_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Heading",
	__ssrInlineRender: true,
	props: {
		title: {},
		description: {},
		variant: { default: "default" }
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<header${ssrRenderAttrs(mergeProps({ class: __props.variant === "small" ? "" : "mb-8 space-y-0.5" }, _attrs))}><h2 class="${ssrRenderClass(__props.variant === "small" ? "mb-0.5 text-base font-medium" : "text-xl font-semibold tracking-tight")}">${ssrInterpolate(__props.title)}</h2>`);
			if (__props.description) _push(`<p class="text-sm text-muted-foreground">${ssrInterpolate(__props.description)}</p>`);
			else _push(`<!---->`);
			_push(`</header>`);
		};
	}
});
//#endregion
//#region resources/js/components/Heading.vue
var _sfc_setup = Heading_vue_vue_type_script_setup_true_lang_default.setup;
Heading_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Heading.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Heading_default = Heading_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Heading_default as t };

//# sourceMappingURL=Heading-GycAGUxB.js.map