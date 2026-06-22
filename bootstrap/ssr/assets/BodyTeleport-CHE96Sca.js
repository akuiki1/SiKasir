import { defineComponent, onMounted, ref, useSSRContext } from "vue";
import { ssrRenderSlot, ssrRenderTeleport } from "vue/server-renderer";
//#region resources/js/components/BodyTeleport.vue?vue&type=script&setup=true&lang.ts
var BodyTeleport_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "BodyTeleport",
	__ssrInlineRender: true,
	setup(__props) {
		const mounted = ref(false);
		onMounted(() => {
			mounted.value = true;
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (mounted.value) ssrRenderTeleport(_push, (_push) => {
				ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			}, "body", false, _parent);
			else _push(`<!---->`);
		};
	}
});
//#endregion
//#region resources/js/components/BodyTeleport.vue
var _sfc_setup = BodyTeleport_vue_vue_type_script_setup_true_lang_default.setup;
BodyTeleport_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/BodyTeleport.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var BodyTeleport_default = BodyTeleport_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { BodyTeleport_default as t };

//# sourceMappingURL=BodyTeleport-CHE96Sca.js.map