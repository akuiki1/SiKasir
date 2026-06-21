import { n as cn, t as Button_default } from "./button-BASArwVF.js";
import { t as Input_default } from "./input-VcrzL7za.js";
import { n as queryParams } from "./wayfinder-BrhwLpUM.js";
import { t as edit$1 } from "./profile-C0rmUldE.js";
import { t as Heading_default } from "./Heading-GycAGUxB.js";
import { n as InputError_default, t as Label_default } from "./label-DRx-Wcmr.js";
import { t as PasswordInput_default } from "./PasswordInput-DW_gYoJC.js";
import { t as send } from "./verification-B4VXILzx.js";
import { Form, Head, Link, usePage } from "@inertiajs/vue3";
import { computed, createBlock, createCommentVNode, createTextVNode, createVNode, defineComponent, mergeProps, openBlock, renderSlot, unref, useSSRContext, useTemplateRef, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger, useForwardProps, useForwardPropsEmits } from "reka-ui";
import { reactiveOmit } from "@vueuse/core";
import { X } from "lucide-vue-next";
//#region resources/js/actions/App/Http/Controllers/Settings/ProfileController.ts
/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:20
* @route '/settings/profile'
*/
var edit = (options) => ({
	url: edit.url(options),
	method: "get"
});
edit.definition = {
	methods: ["get", "head"],
	url: "/settings/profile"
};
/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:20
* @route '/settings/profile'
*/
edit.url = (options) => {
	return edit.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:20
* @route '/settings/profile'
*/
edit.get = (options) => ({
	url: edit.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:20
* @route '/settings/profile'
*/
edit.head = (options) => ({
	url: edit.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:20
* @route '/settings/profile'
*/
var editForm = (options) => ({
	action: edit.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:20
* @route '/settings/profile'
*/
editForm.get = (options) => ({
	action: edit.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
* @see app/Http/Controllers/Settings/ProfileController.php:20
* @route '/settings/profile'
*/
editForm.head = (options) => ({
	action: edit.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
edit.form = editForm;
/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:31
* @route '/settings/profile'
*/
var update = (options) => ({
	url: update.url(options),
	method: "patch"
});
update.definition = {
	methods: ["patch"],
	url: "/settings/profile"
};
/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:31
* @route '/settings/profile'
*/
update.url = (options) => {
	return update.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:31
* @route '/settings/profile'
*/
update.patch = (options) => ({
	url: update.url(options),
	method: "patch"
});
/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:31
* @route '/settings/profile'
*/
var updateForm = (options) => ({
	action: update.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PATCH",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Settings\ProfileController::update
* @see app/Http/Controllers/Settings/ProfileController.php:31
* @route '/settings/profile'
*/
updateForm.patch = (options) => ({
	action: update.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PATCH",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
update.form = updateForm;
/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
* @see app/Http/Controllers/Settings/ProfileController.php:49
* @route '/settings/profile'
*/
var destroy = (options) => ({
	url: destroy.url(options),
	method: "delete"
});
destroy.definition = {
	methods: ["delete"],
	url: "/settings/profile"
};
/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
* @see app/Http/Controllers/Settings/ProfileController.php:49
* @route '/settings/profile'
*/
destroy.url = (options) => {
	return destroy.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
* @see app/Http/Controllers/Settings/ProfileController.php:49
* @route '/settings/profile'
*/
destroy.delete = (options) => ({
	url: destroy.url(options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
* @see app/Http/Controllers/Settings/ProfileController.php:49
* @route '/settings/profile'
*/
var destroyForm = (options) => ({
	action: destroy.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
* @see app/Http/Controllers/Settings/ProfileController.php:49
* @route '/settings/profile'
*/
destroyForm.delete = (options) => ({
	action: destroy.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
destroy.form = destroyForm;
var ProfileController = {
	edit,
	update,
	destroy
};
//#endregion
//#region resources/js/components/ui/dialog/Dialog.vue?vue&type=script&setup=true&lang.ts
var Dialog_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Dialog",
	__ssrInlineRender: true,
	props: {
		open: { type: Boolean },
		defaultOpen: { type: Boolean },
		modal: { type: Boolean }
	},
	emits: ["update:open"],
	setup(__props, { emit: __emit }) {
		const forwarded = useForwardPropsEmits(__props, __emit);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(DialogRoot), mergeProps({ "data-slot": "dialog" }, unref(forwarded), _attrs), {
				default: withCtx((slotProps, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", slotProps, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default", slotProps)];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region resources/js/components/ui/dialog/Dialog.vue
var _sfc_setup$11 = Dialog_vue_vue_type_script_setup_true_lang_default.setup;
Dialog_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/Dialog.vue");
	return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
var Dialog_default = Dialog_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region resources/js/components/ui/dialog/DialogClose.vue?vue&type=script&setup=true&lang.ts
var DialogClose_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DialogClose",
	__ssrInlineRender: true,
	props: {
		asChild: { type: Boolean },
		as: {}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(DialogClose), mergeProps({ "data-slot": "dialog-close" }, props, _attrs), {
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
//#region resources/js/components/ui/dialog/DialogClose.vue
var _sfc_setup$10 = DialogClose_vue_vue_type_script_setup_true_lang_default.setup;
DialogClose_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogClose.vue");
	return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
var DialogClose_default = DialogClose_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region resources/js/components/ui/dialog/DialogOverlay.vue?vue&type=script&setup=true&lang.ts
var DialogOverlay_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DialogOverlay",
	__ssrInlineRender: true,
	props: {
		forceMount: { type: Boolean },
		asChild: { type: Boolean },
		as: {},
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] }
	},
	setup(__props) {
		const props = __props;
		const delegatedProps = reactiveOmit(props, "class");
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(DialogOverlay), mergeProps({ "data-slot": "dialog-overlay" }, unref(delegatedProps), { class: unref(cn)("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80", props.class) }, _attrs), {
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
//#region resources/js/components/ui/dialog/DialogOverlay.vue
var _sfc_setup$9 = DialogOverlay_vue_vue_type_script_setup_true_lang_default.setup;
DialogOverlay_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogOverlay.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
var DialogOverlay_default = DialogOverlay_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region resources/js/components/ui/dialog/DialogContent.vue?vue&type=script&setup=true&lang.ts
var DialogContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "DialogContent",
	__ssrInlineRender: true,
	props: {
		forceMount: { type: Boolean },
		disableOutsidePointerEvents: { type: Boolean },
		asChild: { type: Boolean },
		as: {},
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] },
		showCloseButton: {
			type: Boolean,
			default: true
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const forwarded = useForwardPropsEmits(reactiveOmit(props, "class"), emits);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(DialogPortal), _attrs, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(DialogOverlay_default, null, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(DialogContent), mergeProps({ "data-slot": "dialog-content" }, {
							..._ctx.$attrs,
							...unref(forwarded)
						}, { class: unref(cn)("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", props.class) }), {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
									if (__props.showCloseButton) _push(ssrRenderComponent(unref(DialogClose), {
										"data-slot": "dialog-close",
										class: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(ssrRenderComponent(unref(X), null, null, _parent, _scopeId));
												_push(`<span class="sr-only"${_scopeId}>Close</span>`);
											} else return [createVNode(unref(X)), createVNode("span", { class: "sr-only" }, "Close")];
										}),
										_: 1
									}, _parent, _scopeId));
									else _push(`<!---->`);
								} else return [renderSlot(_ctx.$slots, "default"), __props.showCloseButton ? (openBlock(), createBlock(unref(DialogClose), {
									key: 0,
									"data-slot": "dialog-close",
									class: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
								}, {
									default: withCtx(() => [createVNode(unref(X)), createVNode("span", { class: "sr-only" }, "Close")]),
									_: 1
								})) : createCommentVNode("", true)];
							}),
							_: 3
						}, _parent, _scopeId));
					} else return [createVNode(DialogOverlay_default), createVNode(unref(DialogContent), mergeProps({ "data-slot": "dialog-content" }, {
						..._ctx.$attrs,
						...unref(forwarded)
					}, { class: unref(cn)("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", props.class) }), {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default"), __props.showCloseButton ? (openBlock(), createBlock(unref(DialogClose), {
							key: 0,
							"data-slot": "dialog-close",
							class: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
						}, {
							default: withCtx(() => [createVNode(unref(X)), createVNode("span", { class: "sr-only" }, "Close")]),
							_: 1
						})) : createCommentVNode("", true)]),
						_: 3
					}, 16, ["class"])];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region resources/js/components/ui/dialog/DialogContent.vue
var _sfc_setup$8 = DialogContent_vue_vue_type_script_setup_true_lang_default.setup;
DialogContent_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogContent.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
var DialogContent_default = DialogContent_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region resources/js/components/ui/dialog/DialogDescription.vue?vue&type=script&setup=true&lang.ts
var DialogDescription_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DialogDescription",
	__ssrInlineRender: true,
	props: {
		asChild: { type: Boolean },
		as: {},
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] }
	},
	setup(__props) {
		const props = __props;
		const forwardedProps = useForwardProps(reactiveOmit(props, "class"));
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(DialogDescription), mergeProps({ "data-slot": "dialog-description" }, unref(forwardedProps), { class: unref(cn)("text-muted-foreground text-sm", props.class) }, _attrs), {
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
//#region resources/js/components/ui/dialog/DialogDescription.vue
var _sfc_setup$7 = DialogDescription_vue_vue_type_script_setup_true_lang_default.setup;
DialogDescription_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogDescription.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var DialogDescription_default = DialogDescription_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region resources/js/components/ui/dialog/DialogFooter.vue?vue&type=script&setup=true&lang.ts
var DialogFooter_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DialogFooter",
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
			_push(`<div${ssrRenderAttrs(mergeProps({
				"data-slot": "dialog-footer",
				class: unref(cn)("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", props.class)
			}, _attrs))}>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region resources/js/components/ui/dialog/DialogFooter.vue
var _sfc_setup$6 = DialogFooter_vue_vue_type_script_setup_true_lang_default.setup;
DialogFooter_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogFooter.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var DialogFooter_default = DialogFooter_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region resources/js/components/ui/dialog/DialogHeader.vue?vue&type=script&setup=true&lang.ts
var DialogHeader_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DialogHeader",
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
			_push(`<div${ssrRenderAttrs(mergeProps({
				"data-slot": "dialog-header",
				class: unref(cn)("flex flex-col gap-2 text-center sm:text-left", props.class)
			}, _attrs))}>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region resources/js/components/ui/dialog/DialogHeader.vue
var _sfc_setup$5 = DialogHeader_vue_vue_type_script_setup_true_lang_default.setup;
DialogHeader_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogHeader.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var DialogHeader_default = DialogHeader_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region resources/js/components/ui/dialog/DialogScrollContent.vue?vue&type=script&setup=true&lang.ts
var DialogScrollContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "DialogScrollContent",
	__ssrInlineRender: true,
	props: {
		forceMount: { type: Boolean },
		disableOutsidePointerEvents: { type: Boolean },
		asChild: { type: Boolean },
		as: {},
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] }
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const forwarded = useForwardPropsEmits(reactiveOmit(props, "class"), emits);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(DialogPortal), _attrs, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(DialogOverlay), { class: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(ssrRenderComponent(unref(DialogContent), mergeProps({ class: unref(cn)("relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full", props.class) }, {
								..._ctx.$attrs,
								...unref(forwarded)
							}, { onPointerDownOutside: (event) => {
								const originalEvent = event.detail.originalEvent;
								const target = originalEvent.target;
								if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) event.preventDefault();
							} }), {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) {
										ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
										_push(ssrRenderComponent(unref(DialogClose), { class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
											default: withCtx((_, _push, _parent, _scopeId) => {
												if (_push) {
													_push(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent, _scopeId));
													_push(`<span class="sr-only"${_scopeId}>Close</span>`);
												} else return [createVNode(unref(X), { class: "w-4 h-4" }), createVNode("span", { class: "sr-only" }, "Close")];
											}),
											_: 1
										}, _parent, _scopeId));
									} else return [renderSlot(_ctx.$slots, "default"), createVNode(unref(DialogClose), { class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
										default: withCtx(() => [createVNode(unref(X), { class: "w-4 h-4" }), createVNode("span", { class: "sr-only" }, "Close")]),
										_: 1
									})];
								}),
								_: 3
							}, _parent, _scopeId));
							else return [createVNode(unref(DialogContent), mergeProps({ class: unref(cn)("relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full", props.class) }, {
								..._ctx.$attrs,
								...unref(forwarded)
							}, { onPointerDownOutside: (event) => {
								const originalEvent = event.detail.originalEvent;
								const target = originalEvent.target;
								if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) event.preventDefault();
							} }), {
								default: withCtx(() => [renderSlot(_ctx.$slots, "default"), createVNode(unref(DialogClose), { class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
									default: withCtx(() => [createVNode(unref(X), { class: "w-4 h-4" }), createVNode("span", { class: "sr-only" }, "Close")]),
									_: 1
								})]),
								_: 3
							}, 16, ["class", "onPointerDownOutside"])];
						}),
						_: 3
					}, _parent, _scopeId));
					else return [createVNode(unref(DialogOverlay), { class: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, {
						default: withCtx(() => [createVNode(unref(DialogContent), mergeProps({ class: unref(cn)("relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full", props.class) }, {
							..._ctx.$attrs,
							...unref(forwarded)
						}, { onPointerDownOutside: (event) => {
							const originalEvent = event.detail.originalEvent;
							const target = originalEvent.target;
							if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) event.preventDefault();
						} }), {
							default: withCtx(() => [renderSlot(_ctx.$slots, "default"), createVNode(unref(DialogClose), { class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
								default: withCtx(() => [createVNode(unref(X), { class: "w-4 h-4" }), createVNode("span", { class: "sr-only" }, "Close")]),
								_: 1
							})]),
							_: 3
						}, 16, ["class", "onPointerDownOutside"])]),
						_: 3
					})];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region resources/js/components/ui/dialog/DialogScrollContent.vue
var _sfc_setup$4 = DialogScrollContent_vue_vue_type_script_setup_true_lang_default.setup;
DialogScrollContent_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogScrollContent.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
//#endregion
//#region resources/js/components/ui/dialog/DialogTitle.vue?vue&type=script&setup=true&lang.ts
var DialogTitle_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DialogTitle",
	__ssrInlineRender: true,
	props: {
		asChild: { type: Boolean },
		as: {},
		class: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] }
	},
	setup(__props) {
		const props = __props;
		const forwardedProps = useForwardProps(reactiveOmit(props, "class"));
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(DialogTitle), mergeProps({ "data-slot": "dialog-title" }, unref(forwardedProps), { class: unref(cn)("text-lg leading-none font-semibold", props.class) }, _attrs), {
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
//#region resources/js/components/ui/dialog/DialogTitle.vue
var _sfc_setup$3 = DialogTitle_vue_vue_type_script_setup_true_lang_default.setup;
DialogTitle_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogTitle.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var DialogTitle_default = DialogTitle_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region resources/js/components/ui/dialog/DialogTrigger.vue?vue&type=script&setup=true&lang.ts
var DialogTrigger_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DialogTrigger",
	__ssrInlineRender: true,
	props: {
		asChild: { type: Boolean },
		as: {}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(DialogTrigger), mergeProps({ "data-slot": "dialog-trigger" }, props, _attrs), {
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
//#region resources/js/components/ui/dialog/DialogTrigger.vue
var _sfc_setup$2 = DialogTrigger_vue_vue_type_script_setup_true_lang_default.setup;
DialogTrigger_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogTrigger.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var DialogTrigger_default = DialogTrigger_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region resources/js/components/DeleteUser.vue?vue&type=script&setup=true&lang.ts
var DeleteUser_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DeleteUser",
	__ssrInlineRender: true,
	setup(__props) {
		const passwordInput = useTemplateRef("passwordInput");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
			_push(ssrRenderComponent(Heading_default, {
				variant: "small",
				title: "Delete account",
				description: "Delete your account and all of its resources"
			}, null, _parent));
			_push(`<div class="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10"><div class="relative space-y-0.5 text-red-600 dark:text-red-100"><p class="font-medium">Warning</p><p class="text-sm"> Please proceed with caution, this cannot be undone. </p></div>`);
			_push(ssrRenderComponent(unref(Dialog_default), null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(DialogTrigger_default), { "as-child": "" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(Button_default), {
									variant: "destructive",
									"data-test": "delete-user-button"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`Delete account`);
										else return [createTextVNode("Delete account")];
									}),
									_: 1
								}, _parent, _scopeId));
								else return [createVNode(unref(Button_default), {
									variant: "destructive",
									"data-test": "delete-user-button"
								}, {
									default: withCtx(() => [createTextVNode("Delete account")]),
									_: 1
								})];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(DialogContent_default), null, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(Form), mergeProps(unref(ProfileController).destroy.form(), {
									"reset-on-success": "",
									onError: () => passwordInput.value?.focus(),
									options: { preserveScroll: true },
									class: "space-y-6"
								}), {
									default: withCtx(({ errors, processing, reset, clearErrors }, _push, _parent, _scopeId) => {
										if (_push) {
											_push(ssrRenderComponent(unref(DialogHeader_default), { class: "space-y-3" }, {
												default: withCtx((_, _push, _parent, _scopeId) => {
													if (_push) {
														_push(ssrRenderComponent(unref(DialogTitle_default), null, {
															default: withCtx((_, _push, _parent, _scopeId) => {
																if (_push) _push(`Are you sure you want to delete your account?`);
																else return [createTextVNode("Are you sure you want to delete your account?")];
															}),
															_: 2
														}, _parent, _scopeId));
														_push(ssrRenderComponent(unref(DialogDescription_default), null, {
															default: withCtx((_, _push, _parent, _scopeId) => {
																if (_push) _push(` Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account. `);
																else return [createTextVNode(" Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account. ")];
															}),
															_: 2
														}, _parent, _scopeId));
													} else return [createVNode(unref(DialogTitle_default), null, {
														default: withCtx(() => [createTextVNode("Are you sure you want to delete your account?")]),
														_: 1
													}), createVNode(unref(DialogDescription_default), null, {
														default: withCtx(() => [createTextVNode(" Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account. ")]),
														_: 1
													})];
												}),
												_: 2
											}, _parent, _scopeId));
											_push(`<div class="grid gap-2"${_scopeId}>`);
											_push(ssrRenderComponent(unref(Label_default), {
												for: "password",
												class: "sr-only"
											}, {
												default: withCtx((_, _push, _parent, _scopeId) => {
													if (_push) _push(`Password`);
													else return [createTextVNode("Password")];
												}),
												_: 2
											}, _parent, _scopeId));
											_push(ssrRenderComponent(PasswordInput_default, {
												id: "password",
												name: "password",
												ref_key: "passwordInput",
												ref: passwordInput,
												placeholder: "Password"
											}, null, _parent, _scopeId));
											_push(ssrRenderComponent(InputError_default, { message: errors.password }, null, _parent, _scopeId));
											_push(`</div>`);
											_push(ssrRenderComponent(unref(DialogFooter_default), { class: "gap-2" }, {
												default: withCtx((_, _push, _parent, _scopeId) => {
													if (_push) {
														_push(ssrRenderComponent(unref(DialogClose_default), { "as-child": "" }, {
															default: withCtx((_, _push, _parent, _scopeId) => {
																if (_push) _push(ssrRenderComponent(unref(Button_default), {
																	variant: "secondary",
																	onClick: () => {
																		clearErrors();
																		reset();
																	}
																}, {
																	default: withCtx((_, _push, _parent, _scopeId) => {
																		if (_push) _push(` Cancel `);
																		else return [createTextVNode(" Cancel ")];
																	}),
																	_: 2
																}, _parent, _scopeId));
																else return [createVNode(unref(Button_default), {
																	variant: "secondary",
																	onClick: () => {
																		clearErrors();
																		reset();
																	}
																}, {
																	default: withCtx(() => [createTextVNode(" Cancel ")]),
																	_: 1
																}, 8, ["onClick"])];
															}),
															_: 2
														}, _parent, _scopeId));
														_push(ssrRenderComponent(unref(Button_default), {
															type: "submit",
															variant: "destructive",
															disabled: processing,
															"data-test": "confirm-delete-user-button"
														}, {
															default: withCtx((_, _push, _parent, _scopeId) => {
																if (_push) _push(` Delete account `);
																else return [createTextVNode(" Delete account ")];
															}),
															_: 2
														}, _parent, _scopeId));
													} else return [createVNode(unref(DialogClose_default), { "as-child": "" }, {
														default: withCtx(() => [createVNode(unref(Button_default), {
															variant: "secondary",
															onClick: () => {
																clearErrors();
																reset();
															}
														}, {
															default: withCtx(() => [createTextVNode(" Cancel ")]),
															_: 1
														}, 8, ["onClick"])]),
														_: 2
													}, 1024), createVNode(unref(Button_default), {
														type: "submit",
														variant: "destructive",
														disabled: processing,
														"data-test": "confirm-delete-user-button"
													}, {
														default: withCtx(() => [createTextVNode(" Delete account ")]),
														_: 1
													}, 8, ["disabled"])];
												}),
												_: 2
											}, _parent, _scopeId));
										} else return [
											createVNode(unref(DialogHeader_default), { class: "space-y-3" }, {
												default: withCtx(() => [createVNode(unref(DialogTitle_default), null, {
													default: withCtx(() => [createTextVNode("Are you sure you want to delete your account?")]),
													_: 1
												}), createVNode(unref(DialogDescription_default), null, {
													default: withCtx(() => [createTextVNode(" Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account. ")]),
													_: 1
												})]),
												_: 1
											}),
											createVNode("div", { class: "grid gap-2" }, [
												createVNode(unref(Label_default), {
													for: "password",
													class: "sr-only"
												}, {
													default: withCtx(() => [createTextVNode("Password")]),
													_: 1
												}),
												createVNode(PasswordInput_default, {
													id: "password",
													name: "password",
													ref_key: "passwordInput",
													ref: passwordInput,
													placeholder: "Password"
												}, null, 512),
												createVNode(InputError_default, { message: errors.password }, null, 8, ["message"])
											]),
											createVNode(unref(DialogFooter_default), { class: "gap-2" }, {
												default: withCtx(() => [createVNode(unref(DialogClose_default), { "as-child": "" }, {
													default: withCtx(() => [createVNode(unref(Button_default), {
														variant: "secondary",
														onClick: () => {
															clearErrors();
															reset();
														}
													}, {
														default: withCtx(() => [createTextVNode(" Cancel ")]),
														_: 1
													}, 8, ["onClick"])]),
													_: 2
												}, 1024), createVNode(unref(Button_default), {
													type: "submit",
													variant: "destructive",
													disabled: processing,
													"data-test": "confirm-delete-user-button"
												}, {
													default: withCtx(() => [createTextVNode(" Delete account ")]),
													_: 1
												}, 8, ["disabled"])]),
												_: 2
											}, 1024)
										];
									}),
									_: 1
								}, _parent, _scopeId));
								else return [createVNode(unref(Form), mergeProps(unref(ProfileController).destroy.form(), {
									"reset-on-success": "",
									onError: () => passwordInput.value?.focus(),
									options: { preserveScroll: true },
									class: "space-y-6"
								}), {
									default: withCtx(({ errors, processing, reset, clearErrors }) => [
										createVNode(unref(DialogHeader_default), { class: "space-y-3" }, {
											default: withCtx(() => [createVNode(unref(DialogTitle_default), null, {
												default: withCtx(() => [createTextVNode("Are you sure you want to delete your account?")]),
												_: 1
											}), createVNode(unref(DialogDescription_default), null, {
												default: withCtx(() => [createTextVNode(" Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account. ")]),
												_: 1
											})]),
											_: 1
										}),
										createVNode("div", { class: "grid gap-2" }, [
											createVNode(unref(Label_default), {
												for: "password",
												class: "sr-only"
											}, {
												default: withCtx(() => [createTextVNode("Password")]),
												_: 1
											}),
											createVNode(PasswordInput_default, {
												id: "password",
												name: "password",
												ref_key: "passwordInput",
												ref: passwordInput,
												placeholder: "Password"
											}, null, 512),
											createVNode(InputError_default, { message: errors.password }, null, 8, ["message"])
										]),
										createVNode(unref(DialogFooter_default), { class: "gap-2" }, {
											default: withCtx(() => [createVNode(unref(DialogClose_default), { "as-child": "" }, {
												default: withCtx(() => [createVNode(unref(Button_default), {
													variant: "secondary",
													onClick: () => {
														clearErrors();
														reset();
													}
												}, {
													default: withCtx(() => [createTextVNode(" Cancel ")]),
													_: 1
												}, 8, ["onClick"])]),
												_: 2
											}, 1024), createVNode(unref(Button_default), {
												type: "submit",
												variant: "destructive",
												disabled: processing,
												"data-test": "confirm-delete-user-button"
											}, {
												default: withCtx(() => [createTextVNode(" Delete account ")]),
												_: 1
											}, 8, ["disabled"])]),
											_: 2
										}, 1024)
									]),
									_: 1
								}, 16, ["onError"])];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [createVNode(unref(DialogTrigger_default), { "as-child": "" }, {
						default: withCtx(() => [createVNode(unref(Button_default), {
							variant: "destructive",
							"data-test": "delete-user-button"
						}, {
							default: withCtx(() => [createTextVNode("Delete account")]),
							_: 1
						})]),
						_: 1
					}), createVNode(unref(DialogContent_default), null, {
						default: withCtx(() => [createVNode(unref(Form), mergeProps(unref(ProfileController).destroy.form(), {
							"reset-on-success": "",
							onError: () => passwordInput.value?.focus(),
							options: { preserveScroll: true },
							class: "space-y-6"
						}), {
							default: withCtx(({ errors, processing, reset, clearErrors }) => [
								createVNode(unref(DialogHeader_default), { class: "space-y-3" }, {
									default: withCtx(() => [createVNode(unref(DialogTitle_default), null, {
										default: withCtx(() => [createTextVNode("Are you sure you want to delete your account?")]),
										_: 1
									}), createVNode(unref(DialogDescription_default), null, {
										default: withCtx(() => [createTextVNode(" Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account. ")]),
										_: 1
									})]),
									_: 1
								}),
								createVNode("div", { class: "grid gap-2" }, [
									createVNode(unref(Label_default), {
										for: "password",
										class: "sr-only"
									}, {
										default: withCtx(() => [createTextVNode("Password")]),
										_: 1
									}),
									createVNode(PasswordInput_default, {
										id: "password",
										name: "password",
										ref_key: "passwordInput",
										ref: passwordInput,
										placeholder: "Password"
									}, null, 512),
									createVNode(InputError_default, { message: errors.password }, null, 8, ["message"])
								]),
								createVNode(unref(DialogFooter_default), { class: "gap-2" }, {
									default: withCtx(() => [createVNode(unref(DialogClose_default), { "as-child": "" }, {
										default: withCtx(() => [createVNode(unref(Button_default), {
											variant: "secondary",
											onClick: () => {
												clearErrors();
												reset();
											}
										}, {
											default: withCtx(() => [createTextVNode(" Cancel ")]),
											_: 1
										}, 8, ["onClick"])]),
										_: 2
									}, 1024), createVNode(unref(Button_default), {
										type: "submit",
										variant: "destructive",
										disabled: processing,
										"data-test": "confirm-delete-user-button"
									}, {
										default: withCtx(() => [createTextVNode(" Delete account ")]),
										_: 1
									}, 8, ["disabled"])]),
									_: 2
								}, 1024)
							]),
							_: 1
						}, 16, ["onError"])]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region resources/js/components/DeleteUser.vue
var _sfc_setup$1 = DeleteUser_vue_vue_type_script_setup_true_lang_default.setup;
DeleteUser_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/DeleteUser.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var DeleteUser_default = DeleteUser_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region resources/js/pages/settings/Profile.vue?vue&type=script&setup=true&lang.ts
var Profile_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Profile settings",
		href: edit$1()
	}] },
	__name: "Profile",
	__ssrInlineRender: true,
	setup(__props) {
		const page = usePage();
		const user = computed(() => page.props.auth.user);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Profile settings" }, null, _parent));
			_push(`<h1 class="sr-only">Profile settings</h1><div class="flex flex-col space-y-6">`);
			_push(ssrRenderComponent(Heading_default, {
				variant: "small",
				title: "Profile",
				description: "Update your name and email address"
			}, null, _parent));
			_push(ssrRenderComponent(unref(Form), mergeProps(unref(ProfileController).update.form(), { class: "space-y-6" }), {
				default: withCtx(({ errors, processing }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Label_default), { for: "name" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Name`);
								else return [createTextVNode("Name")];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(Input_default), {
							id: "name",
							class: "mt-1 block w-full",
							name: "name",
							"default-value": user.value.name,
							required: "",
							autocomplete: "name",
							placeholder: "Full name"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(InputError_default, {
							class: "mt-2",
							message: errors.name
						}, null, _parent, _scopeId));
						_push(`</div><div class="grid gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Label_default), { for: "email" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Email address`);
								else return [createTextVNode("Email address")];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(Input_default), {
							id: "email",
							type: "email",
							class: "mt-1 block w-full",
							name: "email",
							"default-value": user.value.email,
							required: "",
							autocomplete: "username",
							placeholder: "Email address"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(InputError_default, {
							class: "mt-2",
							message: errors.email
						}, null, _parent, _scopeId));
						_push(`</div>`);
						if (unref(page).props.mustVerifyEmail && !user.value.email_verified_at) {
							_push(`<div${_scopeId}><p class="-mt-4 text-sm text-muted-foreground"${_scopeId}> Your email address is unverified. `);
							_push(ssrRenderComponent(unref(Link), {
								href: unref(send)(),
								as: "button",
								class: "text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(` Click here to re-send the verification email. `);
									else return [createTextVNode(" Click here to re-send the verification email. ")];
								}),
								_: 2
							}, _parent, _scopeId));
							_push(`</p>`);
							if (unref(page).props.status === "verification-link-sent") _push(`<div class="mt-2 text-sm font-medium text-green-600"${_scopeId}> A new verification link has been sent to your email address. </div>`);
							else _push(`<!---->`);
							_push(`</div>`);
						} else _push(`<!---->`);
						_push(`<div class="flex items-center gap-4"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Button_default), {
							disabled: processing,
							"data-test": "update-profile-button"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Save`);
								else return [createTextVNode("Save")];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(`</div>`);
					} else return [
						createVNode("div", { class: "grid gap-2" }, [
							createVNode(unref(Label_default), { for: "name" }, {
								default: withCtx(() => [createTextVNode("Name")]),
								_: 1
							}),
							createVNode(unref(Input_default), {
								id: "name",
								class: "mt-1 block w-full",
								name: "name",
								"default-value": user.value.name,
								required: "",
								autocomplete: "name",
								placeholder: "Full name"
							}, null, 8, ["default-value"]),
							createVNode(InputError_default, {
								class: "mt-2",
								message: errors.name
							}, null, 8, ["message"])
						]),
						createVNode("div", { class: "grid gap-2" }, [
							createVNode(unref(Label_default), { for: "email" }, {
								default: withCtx(() => [createTextVNode("Email address")]),
								_: 1
							}),
							createVNode(unref(Input_default), {
								id: "email",
								type: "email",
								class: "mt-1 block w-full",
								name: "email",
								"default-value": user.value.email,
								required: "",
								autocomplete: "username",
								placeholder: "Email address"
							}, null, 8, ["default-value"]),
							createVNode(InputError_default, {
								class: "mt-2",
								message: errors.email
							}, null, 8, ["message"])
						]),
						unref(page).props.mustVerifyEmail && !user.value.email_verified_at ? (openBlock(), createBlock("div", { key: 0 }, [createVNode("p", { class: "-mt-4 text-sm text-muted-foreground" }, [createTextVNode(" Your email address is unverified. "), createVNode(unref(Link), {
							href: unref(send)(),
							as: "button",
							class: "text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
						}, {
							default: withCtx(() => [createTextVNode(" Click here to re-send the verification email. ")]),
							_: 1
						}, 8, ["href"])]), unref(page).props.status === "verification-link-sent" ? (openBlock(), createBlock("div", {
							key: 0,
							class: "mt-2 text-sm font-medium text-green-600"
						}, " A new verification link has been sent to your email address. ")) : createCommentVNode("", true)])) : createCommentVNode("", true),
						createVNode("div", { class: "flex items-center gap-4" }, [createVNode(unref(Button_default), {
							disabled: processing,
							"data-test": "update-profile-button"
						}, {
							default: withCtx(() => [createTextVNode("Save")]),
							_: 1
						}, 8, ["disabled"])])
					];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			_push(ssrRenderComponent(DeleteUser_default, null, null, _parent));
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/settings/Profile.vue
var _sfc_setup = Profile_vue_vue_type_script_setup_true_lang_default.setup;
Profile_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/settings/Profile.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Profile_default = Profile_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Profile_default as default };

//# sourceMappingURL=Profile-C7VQucxV.js.map