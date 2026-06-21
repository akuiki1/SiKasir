import { n as cn } from "./button-BASArwVF.js";
import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import { ssrGetDynamicModelProps, ssrRenderAttrs } from "vue/server-renderer";
import { useVModel } from "@vueuse/core";
//#region resources/js/components/ui/input/Input.vue?vue&type=script&setup=true&lang.ts
var Input_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Input",
	__ssrInlineRender: true,
	props: {
		defaultValue: {},
		modelValue: {},
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] }
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const modelValue = useVModel(props, "modelValue", __emit, {
			passive: true,
			defaultValue: props.defaultValue
		});
		return (_ctx, _push, _parent, _attrs) => {
			let _temp0;
			_push(`<input${ssrRenderAttrs((_temp0 = mergeProps({
				"data-slot": "input",
				class: unref(cn)("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", props.class)
			}, _attrs), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, unref(modelValue)))))}>`);
		};
	}
});
//#endregion
//#region resources/js/components/ui/input/Input.vue
var _sfc_setup = Input_vue_vue_type_script_setup_true_lang_default.setup;
Input_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/input/Input.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Input_default = Input_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Input_default as t };

//# sourceMappingURL=input-VcrzL7za.js.map