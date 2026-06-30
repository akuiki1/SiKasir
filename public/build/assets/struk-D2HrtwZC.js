import{r as e}from"./format-C8HFEK_t.js";function t(t){let n=t.details.map(t=>`
                <tr>
                    <td>${t.foto?`[FOTO] `:``}${t.nama_produk}</td>
                    <td class="text-right">${t.jumlah}</td>
                    <td class="text-right">${e(t.harga)}</td>
                    <td class="text-right">${e(t.subtotal)}</td>
                </tr>
            `).join(``),r=t.details.reduce((e,t)=>e+(t.nominal?Number(t.nominal):0),0),i=t.total_harga+r,a=Number(t.diskon??0);return`<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Struk ${t.kode}</title>
<style>
    body { font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #000; margin: 0; padding: 12px; }
    .receipt { width: 320px; }
    .receipt h1, .receipt h2, .receipt p { margin: 0; }
    .receipt h1 { font-size: 16px; margin-bottom: 8px; }
    .receipt .center { text-align: center; }
    .receipt .separator { border-top: 1px dashed #000; margin: 8px 0; }
    .receipt table { width: 100%; border-collapse: collapse; }
    .receipt td { padding: 2px 0; vertical-align: top; }
    .receipt .text-right { text-align: right; }
    .receipt .totals td { padding: 4px 0; }
    .receipt .small { font-size: 11px; }
</style>
</head>
<body>
<div class="receipt">
    <h1 class="center">Toko SiKasir</h1>
    <p class="center small">Struk Transaksi</p>
    <div class="separator"></div>
    <p>Kode: ${t.kode}</p>
    <p>${t.tanggal} ${t.waktu}</p>
    <div class="separator"></div>
    <table>
        ${n}
    </table>
    <div class="separator"></div>
    <table class="totals">
        ${r>0?`<tr>
            <td>Penjualan / Fee</td>
            <td class="text-right">${e(t.total_harga)}</td>
        </tr>
        <tr>
            <td>Titipan layanan</td>
            <td class="text-right">${e(r)}</td>
        </tr>`:``}
        <tr>
            <td>Total</td>
            <td class="text-right">${e(i)}</td>
        </tr>
        <tr>
            <td>Bayar</td>
            <td class="text-right">${e(t.bayar)}</td>
        </tr>
        <tr>
            <td>Kembalian</td>
            <td class="text-right">${e(t.kembalian)}</td>
        </tr>
    </table>
    <div class="separator"></div>
    ${a>0?`<p class="center small">Anda hemat ${e(a)} dari promo.</p>`:``}
    <p class="center small">Terima kasih atas kunjungan Anda.</p>
</div>
</body>
</html>`}function n(e){if(typeof window>`u`)return;let n=window.open(``,`_blank`,`width=400,height=700`);if(!n){window.alert(`Tidak dapat membuka jendela cetak. Pastikan pop-up tidak diblokir.`);return}n.document.write(t(e)),n.document.close(),n.focus(),n.print()}export{n as t};