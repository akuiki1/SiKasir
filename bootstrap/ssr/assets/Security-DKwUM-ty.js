import { t as Button_default } from "./button-BASArwVF.js";
import { n as queryParams } from "./wayfinder-BrhwLpUM.js";
import { t as Heading_default } from "./Heading-GycAGUxB.js";
import { t as edit$1 } from "./security-hrxk8y1f.js";
import { n as InputError_default, t as Label_default } from "./label-DRx-Wcmr.js";
import { t as PasswordInput_default } from "./PasswordInput-DW_gYoJC.js";
import { Form, Head } from "@inertiajs/vue3";
import { createTextVNode, createVNode, defineComponent, mergeProps, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
//#region resources/js/actions/App/Http/Controllers/Settings/SecurityController.ts
/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
* @see app/Http/Controllers/Settings/SecurityController.php:18
* @route '/settings/security'
*/
var edit = (options) => ({
	url: edit.url(options),
	method: "get"
});
edit.definition = {
	methods: ["get", "head"],
	url: "/settings/security"
};
/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
* @see app/Http/Controllers/Settings/SecurityController.php:18
* @route '/settings/security'
*/
edit.url = (options) => {
	return edit.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
* @see app/Http/Controllers/Settings/SecurityController.php:18
* @route '/settings/security'
*/
edit.get = (options) => ({
	url: edit.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
* @see app/Http/Controllers/Settings/SecurityController.php:18
* @route '/settings/security'
*/
edit.head = (options) => ({
	url: edit.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
* @see app/Http/Controllers/Settings/SecurityController.php:18
* @route '/settings/security'
*/
var editForm = (options) => ({
	action: edit.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
* @see app/Http/Controllers/Settings/SecurityController.php:18
* @route '/settings/security'
*/
editForm.get = (options) => ({
	action: edit.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
* @see app/Http/Controllers/Settings/SecurityController.php:18
* @route '/settings/security'
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
* @see \App\Http\Controllers\Settings\SecurityController::update
* @see app/Http/Controllers/Settings/SecurityController.php:30
* @route '/settings/password'
*/
var update = (options) => ({
	url: update.url(options),
	method: "put"
});
update.definition = {
	methods: ["put"],
	url: "/settings/password"
};
/**
* @see \App\Http\Controllers\Settings\SecurityController::update
* @see app/Http/Controllers/Settings/SecurityController.php:30
* @route '/settings/password'
*/
update.url = (options) => {
	return update.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Settings\SecurityController::update
* @see app/Http/Controllers/Settings/SecurityController.php:30
* @route '/settings/password'
*/
update.put = (options) => ({
	url: update.url(options),
	method: "put"
});
/**
* @see \App\Http\Controllers\Settings\SecurityController::update
* @see app/Http/Controllers/Settings/SecurityController.php:30
* @route '/settings/password'
*/
var updateForm = (options) => ({
	action: update.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Settings\SecurityController::update
* @see app/Http/Controllers/Settings/SecurityController.php:30
* @route '/settings/password'
*/
updateForm.put = (options) => ({
	action: update.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
update.form = updateForm;
var SecurityController = {
	edit,
	update
};
//#endregion
//#region resources/js/pages/settings/Security.vue?vue&type=script&setup=true&lang.ts
var Security_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Security settings",
		href: edit$1()
	}] },
	__name: "Security",
	__ssrInlineRender: true,
	props: { passwordRules: {} },
	setup(__props) {
		const props = __props;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Security settings" }, null, _parent));
			_push(`<h1 class="sr-only">Security settings</h1><div class="space-y-6">`);
			_push(ssrRenderComponent(Heading_default, {
				variant: "small",
				title: "Update password",
				description: "Ensure your account is using a long, random password to stay secure"
			}, null, _parent));
			_push(ssrRenderComponent(unref(Form), mergeProps(unref(SecurityController).update.form(), {
				options: { preserveScroll: true },
				"reset-on-success": "",
				"reset-on-error": [
					"password",
					"password_confirmation",
					"current_password"
				],
				class: "space-y-6"
			}), {
				default: withCtx(({ errors, processing }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="grid gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Label_default), { for: "current_password" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Current password`);
								else return [createTextVNode("Current password")];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(ssrRenderComponent(PasswordInput_default, {
							id: "current_password",
							name: "current_password",
							class: "mt-1 block w-full",
							autocomplete: "current-password",
							placeholder: "Current password"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(InputError_default, { message: errors.current_password }, null, _parent, _scopeId));
						_push(`</div><div class="grid gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Label_default), { for: "password" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`New password`);
								else return [createTextVNode("New password")];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(ssrRenderComponent(PasswordInput_default, {
							id: "password",
							name: "password",
							class: "mt-1 block w-full",
							autocomplete: "new-password",
							placeholder: "New password",
							passwordrules: props.passwordRules
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(InputError_default, { message: errors.password }, null, _parent, _scopeId));
						_push(`</div><div class="grid gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Label_default), { for: "password_confirmation" }, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Confirm password`);
								else return [createTextVNode("Confirm password")];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(ssrRenderComponent(PasswordInput_default, {
							id: "password_confirmation",
							name: "password_confirmation",
							class: "mt-1 block w-full",
							autocomplete: "new-password",
							placeholder: "Confirm password",
							passwordrules: props.passwordRules
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(InputError_default, { message: errors.password_confirmation }, null, _parent, _scopeId));
						_push(`</div><div class="flex items-center gap-4"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Button_default), {
							disabled: processing,
							"data-test": "update-password-button"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Save `);
								else return [createTextVNode(" Save ")];
							}),
							_: 2
						}, _parent, _scopeId));
						_push(`</div>`);
					} else return [
						createVNode("div", { class: "grid gap-2" }, [
							createVNode(unref(Label_default), { for: "current_password" }, {
								default: withCtx(() => [createTextVNode("Current password")]),
								_: 1
							}),
							createVNode(PasswordInput_default, {
								id: "current_password",
								name: "current_password",
								class: "mt-1 block w-full",
								autocomplete: "current-password",
								placeholder: "Current password"
							}),
							createVNode(InputError_default, { message: errors.current_password }, null, 8, ["message"])
						]),
						createVNode("div", { class: "grid gap-2" }, [
							createVNode(unref(Label_default), { for: "password" }, {
								default: withCtx(() => [createTextVNode("New password")]),
								_: 1
							}),
							createVNode(PasswordInput_default, {
								id: "password",
								name: "password",
								class: "mt-1 block w-full",
								autocomplete: "new-password",
								placeholder: "New password",
								passwordrules: props.passwordRules
							}, null, 8, ["passwordrules"]),
							createVNode(InputError_default, { message: errors.password }, null, 8, ["message"])
						]),
						createVNode("div", { class: "grid gap-2" }, [
							createVNode(unref(Label_default), { for: "password_confirmation" }, {
								default: withCtx(() => [createTextVNode("Confirm password")]),
								_: 1
							}),
							createVNode(PasswordInput_default, {
								id: "password_confirmation",
								name: "password_confirmation",
								class: "mt-1 block w-full",
								autocomplete: "new-password",
								placeholder: "Confirm password",
								passwordrules: props.passwordRules
							}, null, 8, ["passwordrules"]),
							createVNode(InputError_default, { message: errors.password_confirmation }, null, 8, ["message"])
						]),
						createVNode("div", { class: "flex items-center gap-4" }, [createVNode(unref(Button_default), {
							disabled: processing,
							"data-test": "update-password-button"
						}, {
							default: withCtx(() => [createTextVNode(" Save ")]),
							_: 1
						}, 8, ["disabled"])])
					];
				}),
				_: 1
			}, _parent));
			_push(`</div><!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/settings/Security.vue
var _sfc_setup = Security_vue_vue_type_script_setup_true_lang_default.setup;
Security_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/settings/Security.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Security_default = Security_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Security_default as default };

//# sourceMappingURL=Security-DKwUM-ty.js.map