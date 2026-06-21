import { Head } from "@inertiajs/vue3";
import { defineComponent, unref, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { UsersRound } from "lucide-vue-next";
//#region resources/js/pages/admin/laporan/Pelanggan.vue?vue&type=script&setup=true&lang.ts
var Pelanggan_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Pelanggan",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Analisis Pelanggan - Admin" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 p-6"><div><h1 class="text-3xl font-extrabold tracking-tight">Analisis Pelanggan</h1><p class="mt-1 text-sm text-muted-foreground"> Perilaku pelanggan, retensi, dan kontribusi reseller. </p></div><div class="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-sidebar-border/70 py-20 text-center dark:border-sidebar-border">`);
			_push(ssrRenderComponent(unref(UsersRound), { class: "h-10 w-10 text-muted-foreground" }, null, _parent));
			_push(`<p class="text-sm font-medium text-muted-foreground">Halaman analisis pelanggan masih dalam pengembangan.</p></div></div><!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/laporan/Pelanggan.vue
var _sfc_setup = Pelanggan_vue_vue_type_script_setup_true_lang_default.setup;
Pelanggan_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/laporan/Pelanggan.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Pelanggan_default = Pelanggan_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Pelanggan_default as default };

//# sourceMappingURL=Pelanggan-CqoPKZBq.js.map