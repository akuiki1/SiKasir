import { computed, onMounted, ref } from "vue";
//#region resources/js/composables/useAppearance.ts
function updateTheme(value) {
	if (typeof window === "undefined") return;
	if (value === "system") {
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		document.documentElement.classList.toggle("dark", systemTheme === "dark");
	} else document.documentElement.classList.toggle("dark", value === "dark");
}
var setCookie = (name, value, days = 365) => {
	if (typeof document === "undefined") return;
	const maxAge = days * 24 * 60 * 60;
	document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};
var mediaQuery = () => {
	if (typeof window === "undefined") return null;
	return window.matchMedia("(prefers-color-scheme: dark)");
};
var getStoredAppearance = () => {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("appearance");
};
var prefersDark = () => {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
};
var handleSystemThemeChange = () => {
	updateTheme(getStoredAppearance() || "system");
};
function initializeTheme() {
	if (typeof window === "undefined") return;
	updateTheme(getStoredAppearance() || "system");
	mediaQuery()?.addEventListener("change", handleSystemThemeChange);
}
var appearance = ref("system");
function useAppearance() {
	onMounted(() => {
		const savedAppearance = localStorage.getItem("appearance");
		if (savedAppearance) appearance.value = savedAppearance;
	});
	const resolvedAppearance = computed(() => {
		if (appearance.value === "system") return prefersDark() ? "dark" : "light";
		return appearance.value;
	});
	function updateAppearance(value) {
		appearance.value = value;
		localStorage.setItem("appearance", value);
		setCookie("appearance", value);
		updateTheme(value);
	}
	return {
		appearance,
		resolvedAppearance,
		updateAppearance
	};
}
//#endregion
export { useAppearance as n, initializeTheme as t };

//# sourceMappingURL=useAppearance-DAHt6sku.js.map