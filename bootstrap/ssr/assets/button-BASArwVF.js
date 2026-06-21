import { defineComponent, mergeProps, renderSlot, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Primitive } from "reka-ui";
//#region resources/js/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function toUrl(href) {
	return typeof href === "string" ? href : href?.url;
}
//#endregion
//#region resources/js/components/ui/button/Button.vue?vue&type=script&setup=true&lang.ts
var Button_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Button",
	__ssrInlineRender: true,
	props: {
		variant: {},
		size: {},
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] },
		asChild: { type: Boolean },
		as: { default: "button" }
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(Primitive), mergeProps({
				"data-slot": "button",
				as: __props.as,
				"as-child": __props.asChild,
				class: unref(cn)(unref(buttonVariants)({
					variant: __props.variant,
					size: __props.size
				}), props.class)
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
//#region resources/js/components/ui/button/Button.vue
var _sfc_setup = Button_vue_vue_type_script_setup_true_lang_default.setup;
Button_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/button/Button.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Button_default = Button_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region resources/js/components/ui/button/index.ts
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
			outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			"default": "h-9 px-4 py-2 has-[>svg]:px-3",
			"sm": "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
			"lg": "h-10 rounded-md px-6 has-[>svg]:px-4",
			"icon": "size-9",
			"icon-sm": "size-8",
			"icon-lg": "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
//#endregion
export { cn as n, toUrl as r, Button_default as t };

//# sourceMappingURL=button-BASArwVF.js.map