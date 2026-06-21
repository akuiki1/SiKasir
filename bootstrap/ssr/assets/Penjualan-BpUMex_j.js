import { Head } from "@inertiajs/vue3";
import { defineComponent, unref, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { TrendingUp } from "lucide-vue-next";
//#region resources/js/pages/admin/laporan/Penjualan.vue?vue&type=script&setup=true&lang.ts
var Penjualan_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Penjualan",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Analisis Penjualan - Admin" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 p-6"><div><h1 class="text-3xl font-extrabold tracking-tight">Analisis Penjualan</h1><p class="mt-1 text-sm text-muted-foreground"> Tren penjualan, produk terlaris, dan performa transaksi. </p></div><div class="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-sidebar-border/70 py-20 text-center dark:border-sidebar-border">`);
			_push(ssrRenderComponent(unref(TrendingUp), { class: "h-10 w-10 text-muted-foreground" }, null, _parent));
			_push(`<p class="text-sm font-medium text-muted-foreground">Halaman analisis penjualan masih dalam pengembangan.</p></div></div><!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/laporan/Penjualan.vue
var _sfc_setup = Penjualan_vue_vue_type_script_setup_true_lang_default.setup;
Penjualan_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/laporan/Penjualan.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Penjualan_default = Penjualan_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Penjualan_default as default };

//# sourceMappingURL=Penjualan-BpUMex_j.js.map