import { t as Button_default } from "./button-BASArwVF.js";
import { t as Input_default } from "./input-VcrzL7za.js";
import { r as login } from "./routes-VTLDKrk-.js";
import { n as InputError_default, t as Label_default } from "./label-DRx-Wcmr.js";
import { t as TextLink_default } from "./TextLink-DwPA3bKG.js";
import { t as Spinner_default } from "./spinner-QSI3bW1w.js";
import { t as email } from "./password-BksZHZoH.js";
import { Form, Head } from "@inertiajs/vue3";
import { createBlock, createCommentVNode, createTextVNode, createVNode, defineComponent, openBlock, unref, useSSRContext, withCtx } from "vue";
import { ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
//#region resources/js/pages/auth/ForgotPassword.vue?vue&type=script&setup=true&lang.ts
var ForgotPassword_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: {
		title: "Forgot password",
		description: "Enter your email to receive a password reset link"
	},
	__name: "ForgotPassword",
	__ssrInlineRender: true,
	props: { status: {} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Forgot password" }, null, _parent));
			if (__props.status) _push(`<div class="mb-4 text-center text-sm font-medium text-green-600">${ssrInterpolate(__props.status)}</div>`);
			else _push(`<!---->`);
			_push(`<div class="space-y-6">`);
			_push(ssrRenderComponent(unref(Form), unref(email).form(), {
				default: withCtx(({ errors, processing }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid gap-2"${_scopeId}>`);
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
							autocomplete: "off",
							autofocus: "",
							placeholder: "email@example.com"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(InputError_default, { message: errors.email }, null, _parent, _scopeId));
						_push(`</div><div class="my-6 flex items-center justify-start"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Button_default), {
							class: "w-full",
							disabled: processing,
							"data-test": "email-password-reset-link-button"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									if (processing) _push(ssrRenderComponent(unref(Spinner_default), null, null, _parent, _scopeId));
									else _push(`<!---->`);
									_push(` Email password reset link `);
								} else return [processing ? (openBlock(), createBlock(unref(Spinner_default), { key: 0 })) : createCommentVNode("", true), createTextVNode(" Email password reset link ")];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid gap-2" }, [
						createVNode(unref(Label_default), { for: "email" }, {
							default: withCtx(() => [createTextVNode("Email address")]),
							_: 1
						}),
						createVNode(unref(Input_default), {
							id: "email",
							type: "email",
							name: "email",
							autocomplete: "off",
							autofocus: "",
							placeholder: "email@example.com"
						}),
						createVNode(InputError_default, { message: errors.email }, null, 8, ["message"])
					]), createVNode("div", { class: "my-6 flex items-center justify-start" }, [createVNode(unref(Button_default), {
						class: "w-full",
						disabled: processing,
						"data-test": "email-password-reset-link-button"
					}, {
						default: withCtx(() => [processing ? (openBlock(), createBlock(unref(Spinner_default), { key: 0 })) : createCommentVNode("", true), createTextVNode(" Email password reset link ")]),
						_: 2
					}, 1032, ["disabled"])])];
				}),
				_: 1
			}, _parent));
			_push(`<div class="space-x-1 text-center text-sm text-muted-foreground"><span>Or, return to</span>`);
			_push(ssrRenderComponent(TextLink_default, { href: unref(login)() }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`log in`);
					else return [createTextVNode("log in")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div><!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/auth/ForgotPassword.vue
var _sfc_setup = ForgotPassword_vue_vue_type_script_setup_true_lang_default.setup;
ForgotPassword_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/auth/ForgotPassword.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ForgotPassword_default = ForgotPassword_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { ForgotPassword_default as default };

//# sourceMappingURL=ForgotPassword-CxMgEwKE.js.map