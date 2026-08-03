import{n as e,r as t}from"./format-C8HFEK_t.js";function n(n){let r=n.details.map(n=>{let r=n.harga*n.jumlah-n.subtotal;return`
                <tr>
                    <td>${n.nama_produk}</td>
                    <td class="text-right">${e(n.jumlah)}</td>
                    <td class="text-right">${t(n.harga)}</td>
                    <td class="text-right">${t(n.subtotal)}</td>
                </tr>
                ${r>=1?`<tr>
                    <td colspan="4" class="small diskon-note">Hemat ${t(r)}</td>
                </tr>`:``}
            `}).join(``),i=n.details.reduce((e,t)=>e+(t.nominal?Number(t.nominal):0),0),a=n.total_harga+i,o=Number(n.diskon??0);return`<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Struk ${n.kode}</title>
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
    .receipt thead td { font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 4px; }
    .receipt .diskon-note { padding: 0 0 4px; font-style: italic; }
</style>
</head>
<body>
<div class="receipt">
    <h1 class="center">Cemilan Mba Tutut</h1>
    <p class="center small">Struk Transaksi</p>
    <div class="separator"></div>
    <p>Kode: ${n.kode}</p>
    <p>${n.tanggal} ${n.waktu}</p>
    <div class="separator"></div>
    <table>
        <thead>
            <tr>
                <td>Produk</td>
                <td class="text-right">Qty</td>
                <td class="text-right">Harga Asal</td>
                <td class="text-right">Subtotal</td>
            </tr>
        </thead>
        <tbody>
            ${r}
        </tbody>
    </table>
    <div class="separator"></div>
    <table class="totals">
        ${i>0?`<tr>
            <td>Penjualan / Fee</td>
            <td class="text-right">${t(n.total_harga)}</td>
        </tr>
        <tr>
            <td>Titipan layanan</td>
            <td class="text-right">${t(i)}</td>
        </tr>`:``}
        <tr>
            <td>Total</td>
            <td class="text-right">${t(a)}</td>
        </tr>
        <tr>
            <td>Bayar</td>
            <td class="text-right">${t(n.bayar)}</td>
        </tr>
        <tr>
            <td>Kembalian</td>
            <td class="text-right">${t(n.kembalian)}</td>
        </tr>
    </table>
    <div class="separator"></div>
    ${o>0?`<p class="center small">Anda hemat ${t(o)} dari promo.</p>`:``}
    <p class="center small">Terima kasih atas kunjungan Anda.</p>
</div>
</body>
</html>`}function r(e){if(typeof window>`u`)return;let t=window.open(``,`_blank`,`width=400,height=700`);if(!t){window.alert(`Tidak dapat membuka jendela cetak. Pastikan pop-up tidak diblokir.`);return}t.document.write(n(e)),t.document.close(),t.focus(),t.print()}export{r as t};