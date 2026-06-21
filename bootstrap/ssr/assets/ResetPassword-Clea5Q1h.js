import { t as Button_default } from "./button-BASArwVF.js";
import { t as Input_default } from "./input-VcrzL7za.js";
import { n as InputError_default, t as Label_default } from "./label-DRx-Wcmr.js";
import { t as Spinner_default } from "./spinner-QSI3bW1w.js";
import { r as update } from "./password-BksZHZoH.js";
import { t as PasswordInput_default } from "./PasswordInput-DW_gYoJC.js";
import { Form, Head } from "@inertiajs/vue3";
import { createBlock, createCommentVNode, createTextVNode, createVNode, defineComponent, mergeProps, openBlock, ref, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
//#region resources/js/pages/auth/ResetPassword.vue?vue&type=script&setup=true&lang.ts
var ResetPassword_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: {
		title: "Reset password",
		description: "Please enter your new password below"
	},
	__name: "ResetPassword",
	__ssrInlineRender: true,
	props: {
		token: {},
		email: {},
		passwordRules: {}
	},
	setup(__props) {
		const inputEmail = ref(__props.email);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Reset password" }, null, _parent));
			_push(ssrRenderComponent(unref(Form), mergeProps(unref(update).form(), {
				transform: (data) => ({
					...data,
					token: __props.token,
					email: __props.email
				}),
				"reset-on-success": ["password", "password_confirmation"]
			}), {
				default: withCtx(({ errors, processing }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid gap-6"${_scopeId}><div class="grid gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Label_default), { for: "email" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Email`);
								else return [createTextVNode("Email")];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(Input_default), {
							id: "email",
							type: "email",
							name: "email",
							autocomplete: "email",
							modelValue: inputEmail.value,
							"onUpdate:modelValue": ($event) => inputEmail.value = $event,
							class: "mt-1 block w-full",
							readonly: ""
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(InputError_default, {
							message: errors.email,
							class: "mt-2"
						}, null, _parent, _scopeId));
						_push(`</div><div class="grid gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Label_default), { for: "password" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Password`);
								else return [createTextVNode("Password")];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(ssrRenderComponent(PasswordInput_default, {
							id: "password",
							name: "password",
							autocomplete: "new-password",
							class: "mt-1 block w-full",
							autofocus: "",
							placeholder: "Password",
							passwordrules: __props.passwordRules
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(InputError_default, { message: errors.password }, null, _parent, _scopeId));
						_push(`</div><div class="grid gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Label_default), { for: "password_confirmation" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Confirm password `);
								else return [createTextVNode(" Confirm password ")];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(ssrRenderComponent(PasswordInput_default, {
							id: "password_confirmation",
							name: "password_confirmation",
							autocomplete: "new-password",
							class: "mt-1 block w-full",
							placeholder: "Confirm password",
							passwordrules: __props.passwordRules
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(InputError_default, { message: errors.password_confirmation }, null, _parent, _scopeId));
						_push(`</div>`);
						_push(ssrRenderComponent(unref(Button_default), {
							type: "submit",
							class: "mt-4 w-full",
							disabled: processing,
							"data-test": "reset-password-button"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									if (processing) _push(ssrRenderComponent(unref(Spinner_default), null, null, _parent, _scopeId));
									else _push(`<!---->`);
									_push(` Reset password `);
								} else return [processing ? (openBlock(), createBlock(unref(Spinner_default), { key: 0 })) : createCommentVNode("", true), createTextVNode(" Reset password ")];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "grid gap-6" }, [
						createVNode("div", { class: "grid gap-2" }, [
							createVNode(unref(Label_default), { for: "email" }, {
								default: withCtx(() => [createTextVNode("Email")]),
								_: 1
							}),
							createVNode(unref(Input_default), {
								id: "email",
								type: "email",
								name: "email",
								autocomplete: "email",
								modelValue: inputEmail.value,
								"onUpdate:modelValue": ($event) => inputEmail.value = $event,
								class: "mt-1 block w-full",
								readonly: ""
							}, null, 8, ["modelValue", "onUpdate:modelValue"]),
							createVNode(InputError_default, {
								message: errors.email,
								class: "mt-2"
							}, null, 8, ["message"])
						]),
						createVNode("div", { class: "grid gap-2" }, [
							createVNode(unref(Label_default), { for: "password" }, {
								default: withCtx(() => [createTextVNode("Password")]),
								_: 1
							}),
							createVNode(PasswordInput_default, {
								id: "password",
								name: "password",
								autocomplete: "new-password",
								class: "mt-1 block w-full",
								autofocus: "",
								placeholder: "Password",
								passwordrules: __props.passwordRules
							}, null, 8, ["passwordrules"]),
							createVNode(InputError_default, { message: errors.password }, null, 8, ["message"])
						]),
						createVNode("div", { class: "grid gap-2" }, [
							createVNode(unref(Label_default), { for: "password_confirmation" }, {
								default: withCtx(() => [createTextVNode(" Confirm password ")]),
								_: 1
							}),
							createVNode(PasswordInput_default, {
								id: "password_confirmation",
								name: "password_confirmation",
								autocomplete: "new-password",
								class: "mt-1 block w-full",
								placeholder: "Confirm password",
								passwordrules: __props.passwordRules
							}, null, 8, ["passwordrules"]),
							createVNode(InputError_default, { message: errors.password_confirmation }, null, 8, ["message"])
						]),
						createVNode(unref(Button_default), {
							type: "submit",
							class: "mt-4 w-full",
							disabled: processing,
							"data-test": "reset-password-button"
						}, {
							default: withCtx(() => [processing ? (openBlock(), createBlock(unref(Spinner_default), { key: 0 })) : createCommentVNode("", true), createTextVNode(" Reset password ")]),
							_: 2
						}, 1032, ["disabled"])
					])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/auth/ResetPassword.vue
var _sfc_setup = ResetPassword_vue_vue_type_script_setup_true_lang_default.setup;
ResetPassword_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/auth/ResetPassword.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ResetPassword_default = ResetPassword_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { ResetPassword_default as default };

//# sourceMappingURL=ResetPassword-Clea5Q1h.js.map