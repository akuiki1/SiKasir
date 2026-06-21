import { n as cn, t as Button_default } from "./button-BASArwVF.js";
import { t as Input_default } from "./input-VcrzL7za.js";
import { n as queryParams } from "./wayfinder-BrhwLpUM.js";
import { n as InputError_default, t as Label_default } from "./label-DRx-Wcmr.js";
import { t as TextLink_default } from "./TextLink-DwPA3bKG.js";
import { t as Spinner_default } from "./spinner-QSI3bW1w.js";
import { n as request } from "./password-BksZHZoH.js";
import { t as PasswordInput_default } from "./PasswordInput-DW_gYoJC.js";
import { Form, Head } from "@inertiajs/vue3";
import { createBlock, createCommentVNode, createTextVNode, createVNode, defineComponent, mergeProps, openBlock, renderSlot, toDisplayString, unref, useSSRContext, withCtx } from "vue";
import { ssrInterpolate, ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from "reka-ui";
import { reactiveOmit } from "@vueuse/core";
import { Check } from "lucide-vue-next";
//#region resources/js/components/ui/checkbox/Checkbox.vue?vue&type=script&setup=true&lang.ts
var Checkbox_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Checkbox",
	__ssrInlineRender: true,
	props: {
		defaultValue: {},
		modelValue: {},
		disabled: { type: Boolean },
		value: {},
		id: {},
		trueValue: {},
		falseValue: {},
		asChild: { type: Boolean },
		as: {},
		name: {},
		required: { type: Boolean },
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
		const emits = __emit;
		const forwarded = useForwardPropsEmits(reactiveOmit(props, "class"), emits);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(CheckboxRoot), mergeProps({ "data-slot": "checkbox" }, unref(forwarded), { class: unref(cn)("peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", props.class) }, _attrs), {
				default: withCtx((slotProps, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(CheckboxIndicator), {
						"data-slot": "checkbox-indicator",
						class: "grid place-content-center text-current transition-none"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) ssrRenderSlot(_ctx.$slots, "default", slotProps, () => {
								_push(ssrRenderComponent(unref(Check), { class: "size-3.5" }, null, _parent, _scopeId));
							}, _push, _parent, _scopeId);
							else return [renderSlot(_ctx.$slots, "default", slotProps, () => [createVNode(unref(Check), { class: "size-3.5" })])];
						}),
						_: 2
					}, _parent, _scopeId));
					else return [createVNode(unref(CheckboxIndicator), {
						"data-slot": "checkbox-indicator",
						class: "grid place-content-center text-current transition-none"
					}, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default", slotProps, () => [createVNode(unref(Check), { class: "size-3.5" })])]),
						_: 2
					}, 1024)];
				}),
				_: 3
			}, _parent));
		};
	}
});
//#endregion
//#region resources/js/components/ui/checkbox/Checkbox.vue
var _sfc_setup$1 = Checkbox_vue_vue_type_script_setup_true_lang_default.setup;
Checkbox_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/checkbox/Checkbox.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var Checkbox_default = Checkbox_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region resources/js/routes/login/index.ts
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::store
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:58
* @route '/login'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/login"
};
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::store
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:58
* @route '/login'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::store
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:58
* @route '/login'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::store
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:58
* @route '/login'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "post"
});
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::store
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:58
* @route '/login'
*/
storeForm.post = (options) => ({
	action: store.url(options),
	method: "post"
});
store.form = storeForm;
Object.assign(store, store);
//#endregion
//#region resources/js/pages/auth/Login.vue?vue&type=script&setup=true&lang.ts
var Login_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: {
		title: "Log in to your account",
		description: "Enter your email and password below to log in"
	},
	__name: "Login",
	__ssrInlineRender: true,
	props: {
		status: {},
		canResetPassword: { type: Boolean }
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Log in" }, null, _parent));
			if (__props.status) _push(`<div role="status" class="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-800">${ssrInterpolate(__props.status)}</div>`);
			else _push(`<!---->`);
			_push(ssrRenderComponent(unref(Form), mergeProps(unref(store).form(), {
				"reset-on-success": ["password"],
				class: "space-y-6"
			}), {
				default: withCtx(({ errors, processing }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid gap-6"${_scopeId}><div class="grid gap-2"${_scopeId}>`);
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
							name: "email",
							required: "",
							autofocus: "",
							tabindex: 1,
							autocomplete: "email",
							placeholder: "email@example.com"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(InputError_default, { message: errors.email }, null, _parent, _scopeId));
						_push(`</div><div class="grid gap-2"${_scopeId}><div class="flex items-center justify-between gap-4"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Label_default), { for: "password" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Password`);
								else return [createTextVNode("Password")];
							}),
							_: 2
						}, _parent, _scopeId));
						if (__props.canResetPassword) _push(ssrRenderComponent(TextLink_default, {
							href: unref(request)(),
							class: "text-sm",
							tabindex: 5
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Forgot your password? `);
								else return [createTextVNode(" Forgot your password? ")];
							}),
							_: 2
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push(`</div>`);
						_push(ssrRenderComponent(PasswordInput_default, {
							id: "password",
							name: "password",
							required: "",
							tabindex: 2,
							autocomplete: "current-password",
							placeholder: "Password"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(InputError_default, { message: errors.password }, null, _parent, _scopeId));
						_push(`</div><div class="flex items-center justify-between"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Label_default), {
							for: "remember",
							class: "flex items-center space-x-3"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(ssrRenderComponent(unref(Checkbox_default), {
										id: "remember",
										name: "remember",
										tabindex: 3
									}, null, _parent, _scopeId));
									_push(`<span${_scopeId}>Remember me</span>`);
								} else return [createVNode(unref(Checkbox_default), {
									id: "remember",
									name: "remember",
									tabindex: 3
								}), createVNode("span", null, "Remember me")];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(`</div></div>`);
						_push(ssrRenderComponent(unref(Button_default), {
							type: "submit",
							class: "w-full",
							tabindex: 4,
							disabled: processing,
							"data-test": "login-button"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<span class="inline-flex items-center justify-center gap-2"${_scopeId}>`);
									if (processing) _push(ssrRenderComponent(unref(Spinner_default), null, null, _parent, _scopeId));
									else _push(`<!---->`);
									_push(` ${ssrInterpolate(processing ? "Signing in..." : "Log in")}</span>`);
								} else return [createVNode("span", { class: "inline-flex items-center justify-center gap-2" }, [processing ? (openBlock(), createBlock(unref(Spinner_default), { key: 0 })) : createCommentVNode("", true), createTextVNode(" " + toDisplayString(processing ? "Signing in..." : "Log in"), 1)])];
							}),
							_: 2
						}, _parent, _scopeId));
					} else return [createVNode("div", { class: "grid gap-6" }, [
						createVNode("div", { class: "grid gap-2" }, [
							createVNode(unref(Label_default), { for: "email" }, {
								default: withCtx(() => [createTextVNode("Email address")]),
								_: 1
							}),
							createVNode(unref(Input_default), {
								id: "email",
								type: "email",
								name: "email",
								required: "",
								autofocus: "",
								tabindex: 1,
								autocomplete: "email",
								placeholder: "email@example.com"
							}),
							createVNode(InputError_default, { message: errors.email }, null, 8, ["message"])
						]),
						createVNode("div", { class: "grid gap-2" }, [
							createVNode("div", { class: "flex items-center justify-between gap-4" }, [createVNode(unref(Label_default), { for: "password" }, {
								default: withCtx(() => [createTextVNode("Password")]),
								_: 1
							}), __props.canResetPassword ? (openBlock(), createBlock(TextLink_default, {
								key: 0,
								href: unref(request)(),
								class: "text-sm",
								tabindex: 5
							}, {
								default: withCtx(() => [createTextVNode(" Forgot your password? ")]),
								_: 1
							}, 8, ["href"])) : createCommentVNode("", true)]),
							createVNode(PasswordInput_default, {
								id: "password",
								name: "password",
								required: "",
								tabindex: 2,
								autocomplete: "current-password",
								placeholder: "Password"
							}),
							createVNode(InputError_default, { message: errors.password }, null, 8, ["message"])
						]),
						createVNode("div", { class: "flex items-center justify-between" }, [createVNode(unref(Label_default), {
							for: "remember",
							class: "flex items-center space-x-3"
						}, {
							default: withCtx(() => [createVNode(unref(Checkbox_default), {
								id: "remember",
								name: "remember",
								tabindex: 3
							}), createVNode("span", null, "Remember me")]),
							_: 1
						})])
					]), createVNode(unref(Button_default), {
						type: "submit",
						class: "w-full",
						tabindex: 4,
						disabled: processing,
						"data-test": "login-button"
					}, {
						default: withCtx(() => [createVNode("span", { class: "inline-flex items-center justify-center gap-2" }, [processing ? (openBlock(), createBlock(unref(Spinner_default), { key: 0 })) : createCommentVNode("", true), createTextVNode(" " + toDisplayString(processing ? "Signing in..." : "Log in"), 1)])]),
						_: 2
					}, 1032, ["disabled"])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/auth/Login.vue
var _sfc_setup = Login_vue_vue_type_script_setup_true_lang_default.setup;
Login_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/auth/Login.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Login_default = Login_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Login_default as default };

//# sourceMappingURL=Login-BBliiNnz.js.map