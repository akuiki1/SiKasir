import { n as queryParams } from "./wayfinder-BrhwLpUM.js";
//#region resources/js/routes/kasir/transaksi/index.ts
/**
* @see \App\Http\Controllers\KasirController::store
* @see app/Http/Controllers/KasirController.php:332
* @route '/kasir/transaksi'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/kasir/transaksi"
};
/**
* @see \App\Http\Controllers\KasirController::store
* @see app/Http/Controllers/KasirController.php:332
* @route '/kasir/transaksi'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\KasirController::store
* @see app/Http/Controllers/KasirController.php:332
* @route '/kasir/transaksi'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\KasirController::store
* @see app/Http/Controllers/KasirController.php:332
* @route '/kasir/transaksi'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\KasirController::store
* @see app/Http/Controllers/KasirController.php:332
* @route '/kasir/transaksi'
*/
storeForm.post = (options) => ({
	action: store.url(options),
	method: "post"
});
store.form = storeForm;
var transaksi = { store: Object.assign(store, store) };
//#endregion
export { transaksi as t };

//# sourceMappingURL=transaksi-BRFObyvO.js.map