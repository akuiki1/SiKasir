import { Link } from "@inertiajs/vue3";
import { defineComponent, mergeProps, renderSlot, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
//#region resources/js/components/TextLink.vue?vue&type=script&setup=true&lang.ts
var TextLink_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "TextLink",
	__ssrInlineRender: true,
	props: {
		href: {},
		tabindex: {},
		method: {},
		as: {}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(Link), mergeProps({
				href: __props.href,
				tabindex: __props.tabindex,
				method: __props.method,
				as: __props.as,
				class: "text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default")];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region resources/js/components/TextLink.vue
var _sfc_setup = TextLink_vue_vue_type_script_setup_true_lang_default.setup;
TextLink_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/TextLink.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var TextLink_default = TextLink_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { TextLink_default as t };

//# sourceMappingURL=TextLink-DwPA3bKG.js.map