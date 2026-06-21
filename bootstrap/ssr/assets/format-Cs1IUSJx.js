//#region resources/js/lib/format.ts
var rupiahGroup = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });
/** Format rupiah: "Rp16.697.000". Identik di server & klien. */
function formatRupiah(value) {
	return "Rp" + rupiahGroup.format(Number(value) || 0);
}
/** Format angka id-ID dengan pemisah ribuan; kuantitas curah bisa pecahan (mis. "1.429,5"). */
function formatNumber(value, maximumFractionDigits = 3) {
	return new Intl.NumberFormat("id-ID", { maximumFractionDigits }).format(Number(value) || 0);
}
var compactTiers = [
	[0xe8d4a51000, "T"],
	[1e9, "M"],
	[1e6, "jt"],
	[1e3, "rb"]
];
/**
* Notasi ringkas TANPA prefix "Rp": "5 rb", "16,7 jt", "1,2 M", "3,4 T".
* Disusun manual agar identik di server & klien.
*/
function formatCompact(value) {
	const n = Number(value) || 0;
	const sign = n < 0 ? "-" : "";
	const abs = Math.abs(n);
	for (const [factor, suffix] of compactTiers) if (abs >= factor) return `${sign}${formatNumber(abs / factor, 1)} ${suffix}`;
	return sign + formatNumber(abs, 0);
}
//#endregion
export { formatRupiah as n, formatCompact as t };

//# sourceMappingURL=format-Cs1IUSJx.js.map