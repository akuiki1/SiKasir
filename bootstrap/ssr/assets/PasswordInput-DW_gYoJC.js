import { n as cn } from "./button-BASArwVF.js";
import { t as Input_default } from "./input-VcrzL7za.js";
import { defineComponent, mergeProps, ref, unref, useSSRContext, useTemplateRef } from "vue";
import { ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent } from "vue/server-renderer";
import { Eye, EyeOff } from "lucide-vue-next";
//#region resources/js/components/PasswordInput.vue?vue&type=script&setup=true&lang.ts
var PasswordInput_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "PasswordInput",
	__ssrInlineRender: true,
	props: { class: { type: [
		Boolean,
		null,
		String,
		Object,
		Array
	] } },
	setup(__props, { expose: __expose }) {
		const props = __props;
		const showPassword = ref(false);
		const inputRef = useTemplateRef("inputRef");
		__expose({
			$el: inputRef,
			focus: () => inputRef.value?.$el?.focus()
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(Input_default), mergeProps({
				ref_key: "inputRef",
				ref: inputRef,
				type: showPassword.value ? "text" : "password",
				class: unref(cn)("pr-10", props.class)
			}, _ctx.$attrs), null, _parent));
			_push(`<button type="button" class="${ssrRenderClass(unref(cn)("absolute inset-y-0 right-0 flex items-center rounded-r-md px-3 text-muted-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none"))}"${ssrRenderAttr("aria-label", showPassword.value ? "Hide password" : "Show password")}${ssrRenderAttr("tabindex", -1)}>`);
			if (showPassword.value) _push(ssrRenderComponent(unref(EyeOff), { class: "size-4" }, null, _parent));
			else _push(ssrRenderComponent(unref(Eye), { class: "size-4" }, null, _parent));
			_push(`</button></div>`);
		};
	}
});
//#endregion
//#region resources/js/components/PasswordInput.vue
var _sfc_setup = PasswordInput_vue_vue_type_script_setup_true_lang_default.setup;
PasswordInput_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/PasswordInput.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var PasswordInput_default = PasswordInput_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { PasswordInput_default as t };

//# sourceMappingURL=PasswordInput-DW_gYoJC.js.map