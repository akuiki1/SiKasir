import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-BrhwLpUM.js";
import { t as BodyTeleport_default } from "./BodyTeleport-CHE96Sca.js";
import { t as Pagination_default } from "./Pagination-CxLXQdL4.js";
import { t as usePagination } from "./usePagination-Dbv9f4fT.js";
import { Head, useForm, usePage } from "@inertiajs/vue3";
import { computed, createBlock, createCommentVNode, createTextVNode, createVNode, defineComponent, openBlock, ref, toDisplayString, unref, useSSRContext, vModelSelect, vModelText, withCtx, withDirectives, withModifiers } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
import { AlertCircle, Edit, Mail, Plus, Save, Search, Shield, Trash2, User, UserCheck, X } from "lucide-vue-next";
//#region resources/js/routes/admin/users/index.ts
/**
* @see \App\Http\Controllers\Admin\UserController::store
* @see app/Http/Controllers/Admin/UserController.php:47
* @route '/admin/users'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/admin/users"
};
/**
* @see \App\Http\Controllers\Admin\UserController::store
* @see app/Http/Controllers/Admin/UserController.php:47
* @route '/admin/users'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\UserController::store
* @see app/Http/Controllers/Admin/UserController.php:47
* @route '/admin/users'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\UserController::store
* @see app/Http/Controllers/Admin/UserController.php:47
* @route '/admin/users'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\UserController::store
* @see app/Http/Controllers/Admin/UserController.php:47
* @route '/admin/users'
*/
storeForm.post = (options) => ({
	action: store.url(options),
	method: "post"
});
store.form = storeForm;
/**
* @see \App\Http\Controllers\Admin\UserController::update
* @see app/Http/Controllers/Admin/UserController.php:69
* @route '/admin/users/{user}'
*/
var update = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
update.definition = {
	methods: ["put"],
	url: "/admin/users/{user}"
};
/**
* @see \App\Http\Controllers\Admin\UserController::update
* @see app/Http/Controllers/Admin/UserController.php:69
* @route '/admin/users/{user}'
*/
update.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { user: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { user: args.id };
	if (Array.isArray(args)) args = { user: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { user: typeof args.user === "object" ? args.user.id : args.user };
	return update.definition.url.replace("{user}", parsedArgs.user.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\UserController::update
* @see app/Http/Controllers/Admin/UserController.php:69
* @route '/admin/users/{user}'
*/
update.put = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
/**
* @see \App\Http\Controllers\Admin\UserController::update
* @see app/Http/Controllers/Admin/UserController.php:69
* @route '/admin/users/{user}'
*/
var updateForm = (args, options) => ({
	action: update.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\UserController::update
* @see app/Http/Controllers/Admin/UserController.php:69
* @route '/admin/users/{user}'
*/
updateForm.put = (args, options) => ({
	action: update.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
update.form = updateForm;
/**
* @see \App\Http\Controllers\Admin\UserController::destroy
* @see app/Http/Controllers/Admin/UserController.php:94
* @route '/admin/users/{user}'
*/
var destroy = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
destroy.definition = {
	methods: ["delete"],
	url: "/admin/users/{user}"
};
/**
* @see \App\Http\Controllers\Admin\UserController::destroy
* @see app/Http/Controllers/Admin/UserController.php:94
* @route '/admin/users/{user}'
*/
destroy.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { user: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { user: args.id };
	if (Array.isArray(args)) args = { user: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { user: typeof args.user === "object" ? args.user.id : args.user };
	return destroy.definition.url.replace("{user}", parsedArgs.user.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\UserController::destroy
* @see app/Http/Controllers/Admin/UserController.php:94
* @route '/admin/users/{user}'
*/
destroy.delete = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\Admin\UserController::destroy
* @see app/Http/Controllers/Admin/UserController.php:94
* @route '/admin/users/{user}'
*/
var destroyForm = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\UserController::destroy
* @see app/Http/Controllers/Admin/UserController.php:94
* @route '/admin/users/{user}'
*/
destroyForm.delete = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
destroy.form = destroyForm;
Object.assign(store, store), Object.assign(update, update), Object.assign(destroy, destroy);
//#endregion
//#region resources/js/pages/admin/Users.vue?vue&type=script&setup=true&lang.ts
var Users_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	layout: { breadcrumbs: [{
		title: "Data User",
		href: "/admin/users"
	}] },
	__name: "Users",
	__ssrInlineRender: true,
	props: {
		users: {},
		stats: {}
	},
	setup(__props) {
		const props = __props;
		const page = usePage();
		const currentUserId = computed(() => page.props.auth.user.id);
		const searchQuery = ref("");
		const filterRole = ref("");
		const filteredUsers = computed(() => {
			return props.users.filter((user) => {
				const matchSearch = !searchQuery.value || user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
				const matchRole = !filterRole.value || user.role === filterRole.value;
				return matchSearch && matchRole;
			});
		});
		const { currentPage, perPage, totalItems, totalPages, paginatedItems: paginatedUsers, startIndex, endIndex, goToPage, visiblePages } = usePagination(() => filteredUsers.value);
		const showModal = ref(false);
		const editingUser = ref(null);
		const form = useForm({
			name: "",
			email: "",
			role: "kasir",
			password: "",
			password_confirmation: ""
		});
		function closeModal() {
			showModal.value = false;
			form.reset();
			form.clearErrors();
		}
		function submitForm() {
			if (editingUser.value) form.put(update(editingUser.value.id).url, { onSuccess: () => closeModal() });
			else form.post(store().url, { onSuccess: () => closeModal() });
		}
		function formatDate(dateString) {
			return new Intl.DateTimeFormat("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric"
			}).format(new Date(dateString));
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Data User - Admin" }, null, _parent));
			_push(`<div class="flex h-full flex-1 flex-col gap-6 p-6"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-3xl font-extrabold tracking-tight">Manajemen User</h1><p class="mt-1 text-sm text-muted-foreground"> Kelola data pengguna, hak akses, dan atur akun kasir di sistem Anda. </p></div><button id="btn-tambah-user" class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">`);
			_push(ssrRenderComponent(unref(Plus), { class: "h-4 w-4" }, null, _parent));
			_push(` Tambah User Baru </button></div><div class="grid gap-4 md:grid-cols-3"><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">`);
			_push(ssrRenderComponent(unref(User), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Total Pengguna</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_users)} Orang</h3></div></div><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">`);
			_push(ssrRenderComponent(unref(Shield), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Administrator</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_admin)} Akun</h3></div></div><div class="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border"><div class="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">`);
			_push(ssrRenderComponent(unref(UserCheck), { class: "h-6 w-6" }, null, _parent));
			_push(`</div><div><span class="text-xs font-medium text-muted-foreground">Kasir</span><h3 class="mt-0.5 text-xl font-bold">${ssrInterpolate(__props.stats.total_kasir)} Akun</h3></div></div></div><div class="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border"><div class="flex flex-col gap-4 border-b border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border"><div class="relative max-w-md flex-1">`);
			_push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, null, _parent));
			_push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Cari user berdasarkan nama atau email..." class="w-full rounded-lg border border-sidebar-border/70 bg-background py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"></div><select class="rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filterRole.value) ? ssrLooseContain(filterRole.value, "") : ssrLooseEqual(filterRole.value, "")) ? " selected" : ""}>Semua Role</option><option value="admin"${ssrIncludeBooleanAttr(Array.isArray(filterRole.value) ? ssrLooseContain(filterRole.value, "admin") : ssrLooseEqual(filterRole.value, "admin")) ? " selected" : ""}>Admin</option><option value="kasir"${ssrIncludeBooleanAttr(Array.isArray(filterRole.value) ? ssrLooseContain(filterRole.value, "kasir") : ssrLooseEqual(filterRole.value, "kasir")) ? " selected" : ""}>Kasir</option></select></div><div class="overflow-x-auto"><table class="w-full border-collapse text-left text-sm"><thead><tr class="border-b border-sidebar-border/70 bg-slate-50/50 dark:border-sidebar-border dark:bg-zinc-800/20"><th class="px-6 py-4 font-semibold text-muted-foreground"> Nama Pengguna </th><th class="px-6 py-4 font-semibold text-muted-foreground">Email</th><th class="px-6 py-4 font-semibold text-muted-foreground">Role</th><th class="px-6 py-4 font-semibold text-muted-foreground"> Terdaftar Sejak </th><th class="px-6 py-4 text-right font-semibold text-muted-foreground"> Aksi </th></tr></thead><tbody class="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">`);
			if (unref(paginatedUsers).length === 0) {
				_push(`<tr><td colspan="5" class="px-6 py-12 text-center text-muted-foreground">`);
				_push(ssrRenderComponent(unref(User), { class: "mx-auto mb-3 h-10 w-10 opacity-30" }, null, _parent));
				_push(`<p class="font-medium">${ssrInterpolate(searchQuery.value || filterRole.value ? "Tidak ada user yang sesuai pencarian." : "Belum ada user. Tambahkan user pertama!")}</p></td></tr>`);
			} else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(unref(paginatedUsers), (userItem) => {
				_push(`<tr class="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/10"><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 dark:bg-zinc-800 dark:text-slate-300">${ssrInterpolate(userItem.name.charAt(0))}</div><span class="font-semibold text-foreground">${ssrInterpolate(userItem.name)}</span></div></td><td class="px-6 py-4 text-muted-foreground"><div class="flex items-center gap-1.5">`);
				_push(ssrRenderComponent(unref(Mail), { class: "h-3.5 w-3.5" }, null, _parent));
				_push(` ${ssrInterpolate(userItem.email)}</div></td><td class="px-6 py-4"><span class="${ssrRenderClass(["inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider", userItem.role === "admin" ? "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400" : "border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"])}">${ssrInterpolate(userItem.role)}</span></td><td class="px-6 py-4 text-muted-foreground">${ssrInterpolate(formatDate(userItem.created_at))}</td><td class="px-6 py-4 text-right"><div class="inline-flex justify-end gap-2"><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-zinc-800" title="Edit">`);
				_push(ssrRenderComponent(unref(Edit), { class: "h-4 w-4" }, null, _parent));
				_push(`</button><button title="Hapus"${ssrIncludeBooleanAttr(userItem.id === currentUserId.value) ? " disabled" : ""} class="${ssrRenderClass([{ "cursor-not-allowed opacity-40": userItem.id === currentUserId.value }, "rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-zinc-800"])}">`);
				_push(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4" }, null, _parent));
				_push(`</button></div></td></tr>`);
			});
			_push(`<!--]--></tbody></table></div>`);
			_push(ssrRenderComponent(Pagination_default, {
				"current-page": unref(currentPage),
				"total-pages": unref(totalPages),
				"total-items": unref(totalItems),
				"start-index": unref(startIndex),
				"end-index": unref(endIndex),
				"per-page": unref(perPage),
				"visible-pages": unref(visiblePages),
				"onUpdate:currentPage": unref(goToPage),
				"onUpdate:perPage": ($event) => perPage.value = $event
			}, null, _parent));
			_push(`</div></div>`);
			_push(ssrRenderComponent(BodyTeleport_default, null, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) if (showModal.value) {
						_push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"${_scopeId}><div class="w-full max-w-md rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border" style="${ssrRenderStyle({
							"max-height": "90vh",
							"overflow-y": "auto"
						})}"${_scopeId}><div class="mb-5 flex items-center justify-between"${_scopeId}><h2 class="text-lg font-bold"${_scopeId}>${ssrInterpolate(editingUser.value ? "Edit User" : "Tambah User Baru")}</h2><button class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"${_scopeId}>`);
						_push(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent, _scopeId));
						_push(`</button></div><form class="flex flex-col gap-4"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="user-name"${_scopeId}> Nama </label><input id="user-name"${ssrRenderAttr("value", unref(form).name)} type="text" placeholder="Nama lengkap" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.name }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}>`);
						if (unref(form).errors.name) {
							_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
							_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(form).errors.name)}</p>`);
						} else _push(`<!---->`);
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="user-email"${_scopeId}> Email </label><input id="user-email"${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="email@example.com" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.email }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}>`);
						if (unref(form).errors.email) {
							_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
							_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(form).errors.email)}</p>`);
						} else _push(`<!---->`);
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="user-role"${_scopeId}> Role </label><select id="user-role" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.role }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}><option value="kasir"${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "kasir") : ssrLooseEqual(unref(form).role, "kasir")) ? " selected" : ""}${_scopeId}>Kasir</option><option value="admin"${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "admin") : ssrLooseEqual(unref(form).role, "admin")) ? " selected" : ""}${_scopeId}>Admin</option></select>`);
						if (unref(form).errors.role) {
							_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
							_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(form).errors.role)}</p>`);
						} else _push(`<!---->`);
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="user-password"${_scopeId}> Password `);
						if (editingUser.value) _push(`<span class="font-normal text-muted-foreground"${_scopeId}> (kosongkan jika tidak diubah) </span>`);
						else _push(`<!---->`);
						_push(`</label><input id="user-password"${ssrRenderAttr("value", unref(form).password)} type="password" placeholder="Password" class="${ssrRenderClass([{ "border-rose-500": unref(form).errors.password }, "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"])}"${_scopeId}>`);
						if (unref(form).errors.password) {
							_push(`<p class="mt-1 flex items-center gap-1 text-xs text-rose-600"${_scopeId}>`);
							_push(ssrRenderComponent(unref(AlertCircle), { class: "h-3 w-3" }, null, _parent, _scopeId));
							_push(`${ssrInterpolate(unref(form).errors.password)}</p>`);
						} else _push(`<!---->`);
						_push(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-medium" for="user-password-confirmation"${_scopeId}> Konfirmasi Password </label><input id="user-password-confirmation"${ssrRenderAttr("value", unref(form).password_confirmation)} type="password" placeholder="Ulangi password" class="w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"${_scopeId}></div><div class="flex justify-end gap-3 pt-2"${_scopeId}><button type="button" class="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40"${_scopeId}> Batal </button><button type="submit" class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
						_push(ssrRenderComponent(unref(Save), { class: "h-4 w-4" }, null, _parent, _scopeId));
						_push(` ${ssrInterpolate(unref(form).processing ? "Menyimpan..." : editingUser.value ? "Simpan Perubahan" : "Tambah User")}</button></div></form></div></div>`);
					} else _push(`<!---->`);
					else return [showModal.value ? (openBlock(), createBlock("div", {
						key: 0,
						class: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
						onClick: withModifiers(closeModal, ["self"])
					}, [createVNode("div", {
						class: "w-full max-w-md rounded-2xl border border-sidebar-border/70 bg-card p-6 shadow-2xl dark:border-sidebar-border",
						style: {
							"max-height": "90vh",
							"overflow-y": "auto"
						}
					}, [createVNode("div", { class: "mb-5 flex items-center justify-between" }, [createVNode("h2", { class: "text-lg font-bold" }, toDisplayString(editingUser.value ? "Edit User" : "Tambah User Baru"), 1), createVNode("button", {
						class: "rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800",
						onClick: closeModal
					}, [createVNode(unref(X), { class: "h-5 w-5" })])]), createVNode("form", {
						class: "flex flex-col gap-4",
						onSubmit: withModifiers(submitForm, ["prevent"])
					}, [
						createVNode("div", null, [
							createVNode("label", {
								class: "mb-1.5 block text-sm font-medium",
								for: "user-name"
							}, " Nama "),
							withDirectives(createVNode("input", {
								id: "user-name",
								"onUpdate:modelValue": ($event) => unref(form).name = $event,
								type: "text",
								placeholder: "Nama lengkap",
								class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.name }]
							}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).name]]),
							unref(form).errors.name ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
							}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.name), 1)])) : createCommentVNode("", true)
						]),
						createVNode("div", null, [
							createVNode("label", {
								class: "mb-1.5 block text-sm font-medium",
								for: "user-email"
							}, " Email "),
							withDirectives(createVNode("input", {
								id: "user-email",
								"onUpdate:modelValue": ($event) => unref(form).email = $event,
								type: "email",
								placeholder: "email@example.com",
								class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.email }]
							}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).email]]),
							unref(form).errors.email ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
							}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.email), 1)])) : createCommentVNode("", true)
						]),
						createVNode("div", null, [
							createVNode("label", {
								class: "mb-1.5 block text-sm font-medium",
								for: "user-role"
							}, " Role "),
							withDirectives(createVNode("select", {
								id: "user-role",
								"onUpdate:modelValue": ($event) => unref(form).role = $event,
								class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.role }]
							}, [createVNode("option", { value: "kasir" }, "Kasir"), createVNode("option", { value: "admin" }, "Admin")], 10, ["onUpdate:modelValue"]), [[vModelSelect, unref(form).role]]),
							unref(form).errors.role ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
							}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.role), 1)])) : createCommentVNode("", true)
						]),
						createVNode("div", null, [
							createVNode("label", {
								class: "mb-1.5 block text-sm font-medium",
								for: "user-password"
							}, [createTextVNode(" Password "), editingUser.value ? (openBlock(), createBlock("span", {
								key: 0,
								class: "font-normal text-muted-foreground"
							}, " (kosongkan jika tidak diubah) ")) : createCommentVNode("", true)]),
							withDirectives(createVNode("input", {
								id: "user-password",
								"onUpdate:modelValue": ($event) => unref(form).password = $event,
								type: "password",
								placeholder: "Password",
								class: ["w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border", { "border-rose-500": unref(form).errors.password }]
							}, null, 10, ["onUpdate:modelValue"]), [[vModelText, unref(form).password]]),
							unref(form).errors.password ? (openBlock(), createBlock("p", {
								key: 0,
								class: "mt-1 flex items-center gap-1 text-xs text-rose-600"
							}, [createVNode(unref(AlertCircle), { class: "h-3 w-3" }), createTextVNode(toDisplayString(unref(form).errors.password), 1)])) : createCommentVNode("", true)
						]),
						createVNode("div", null, [createVNode("label", {
							class: "mb-1.5 block text-sm font-medium",
							for: "user-password-confirmation"
						}, " Konfirmasi Password "), withDirectives(createVNode("input", {
							id: "user-password-confirmation",
							"onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
							type: "password",
							placeholder: "Ulangi password",
							class: "w-full rounded-lg border border-sidebar-border/70 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-sidebar-border"
						}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).password_confirmation]])]),
						createVNode("div", { class: "flex justify-end gap-3 pt-2" }, [createVNode("button", {
							type: "button",
							class: "rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-sidebar-border dark:hover:bg-zinc-800/40",
							onClick: closeModal
						}, " Batal "), createVNode("button", {
							type: "submit",
							class: "inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60",
							disabled: unref(form).processing
						}, [createVNode(unref(Save), { class: "h-4 w-4" }), createTextVNode(" " + toDisplayString(unref(form).processing ? "Menyimpan..." : editingUser.value ? "Simpan Perubahan" : "Tambah User"), 1)], 8, ["disabled"])])
					], 32)])])) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region resources/js/pages/admin/Users.vue
var _sfc_setup = Users_vue_vue_type_script_setup_true_lang_default.setup;
Users_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/admin/Users.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Users_default = Users_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Users_default as default };

//# sourceMappingURL=Users-BWIKhUF2.js.map