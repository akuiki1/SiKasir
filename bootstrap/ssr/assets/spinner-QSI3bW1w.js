import { n as cn } from "./button-BASArwVF.js";
import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Loader2Icon } from "lucide-vue-next";
//#region resources/js/components/ui/spinner/Spinner.vue?vue&type=script&setup=true&lang.ts
var Spinner_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Spinner",
	__ssrInlineRender: true,
	props: { class: { type: [
		Boolean,
		null,
		String,
		Object,
		Array
	] } },
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(Loader2Icon), mergeProps({
				role: "status",
				"aria-label": "Loading",
				class: unref(cn)("size-4 animate-spin", props.class)
			}, _attrs), null, _parent));
		};
	}
});
//#endregion
//#region resources/js/components/ui/spinner/Spinner.vue
var _sfc_setup = Spinner_vue_vue_type_script_setup_true_lang_default.setup;
Spinner_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/spinner/Spinner.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Spinner_default = Spinner_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Spinner_default as t };

//# sourceMappingURL=spinner-QSI3bW1w.js.map