import { t as Button_default } from "./button-BASArwVF.js";
import { i as logout } from "./routes-VTLDKrk-.js";
import { t as TextLink_default } from "./TextLink-DwPA3bKG.js";
import { t as Spinner_default } from "./spinner-QSI3bW1w.js";
import { t as send } from "./verification-B4VXILzx.js";
import { Form, Head } from "@inertiajs/vue3";
import { createBlock, createCommentVNode, createTextVNode, createVNode, defineComponent, mergeProps, openBlock, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
//#region resources/js/pages/auth/VerifyEmail.vue?vue&type=script&setup=true&lang.ts
var VerifyEmail_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: {
		title: "Email verification",
		description: "Please verify your email address by clicking on the link we just emailed to you."
	},
	__name: "VerifyEmail",
	__ssrInlineRender: true,
	props: { status: {} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Email verification" }, null, _parent));
			if (__props.status === "verification-link-sent") _push(`<div class="mb-4 text-center text-sm font-medium text-green-600"> A new verification link has been sent to the email address you provided during registration. </div>`);
			else _push(`<!---->`);
			_push(ssrRenderComponent(unref(Form), mergeProps(unref(send).form(), { class: "space-y-6 text-center" }), {
				default: withCtx(({ processing }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(Button_default), {
							disabled: processing,
							variant: "secondary"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									if (processing) _push(ssrRenderComponent(unref(Spinner_default), null, null, _parent, _scopeId));
									else _push(`<!---->`);
									_push(` Resend verification email `);
								} else return [processing ? (openBlock(), createBlock(unref(Spinner_default), { key: 0 })) : createCommentVNode("", true), createTextVNode(" Resend verification email ")];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(ssrRenderComponent(TextLink_default, {
							href: unref(logout)(),
							as: "button",
							class: "mx-auto block text-sm"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Log out `);
								else return [createTextVNode(" Log out ")];
							}),
							_: 2
						}, _parent, _scopeId));
					} else return [createVNode(unref(Button_default), {
						disabled: processing,
						variant: "secondary"
					}, {
						default: withCtx(() => [processing ? (openBlock(), createBlock(unref(Spinner_default), { key: 0 })) : createCommentVNode("", true), createTextVNode(" Resend verification email ")]),
						_: 2
					}, 1032, ["disabled"]), createVNode(TextLink_default, {
						href: unref(logout)(),
						as: "button",
						class: "mx-auto block text-sm"
					}, {
						default: withCtx(() => [createTextVNode(" Log out ")]),
						_: 1
					}, 8, ["href"])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/auth/VerifyEmail.vue
var _sfc_setup = VerifyEmail_vue_vue_type_script_setup_true_lang_default.setup;
VerifyEmail_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/auth/VerifyEmail.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var VerifyEmail_default = VerifyEmail_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { VerifyEmail_default as default };

//# sourceMappingURL=VerifyEmail-9kP-Ql0A.js.map