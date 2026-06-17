/* eslint-disable */
const fs = require("fs");
const path = require("path");
const docx = require("C:/Users/User/AppData/Roaming/npm/node_modules/docx");

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, TabStopType, TabStopPosition,
  TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak,
} = docx;

// ---- Palette ----
const BRAND = "1F6F54";       // hijau kasir
const BRAND_DARK = "14503C";
const ACCENT = "B45309";      // amber
const HEADER_FILL = "1F6F54";
const ROW_ALT = "EEF5F1";
const CODE_FILL = "F3F4F6";
const GREY = "6B7280";

const CONTENT_WIDTH = 9360; // US Letter, margin 1"

// ---- Helpers ----
function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(text)] });
}
function p(text, opts = {}) {
  const runs = Array.isArray(text) ? text : [new TextRun({ text, ...opts })];
  return new Paragraph({ spacing: { after: 120, line: 276 }, alignment: AlignmentType.JUSTIFIED, children: runs });
}
function bullet(text, level = 0) {
  const runs = Array.isArray(text) ? text : [new TextRun(text)];
  return new Paragraph({ numbering: { reference: "bullets", level }, spacing: { after: 60 }, children: runs });
}
function num(text) {
  const runs = Array.isArray(text) ? text : [new TextRun(text)];
  return new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: runs });
}
function code(lines) {
  const arr = Array.isArray(lines) ? lines : [lines];
  return arr.map((ln, i) =>
    new Paragraph({
      shading: { fill: CODE_FILL, type: ShadingType.CLEAR },
      spacing: { before: i === 0 ? 80 : 0, after: i === arr.length - 1 ? 120 : 0 },
      indent: { left: 200, right: 200 },
      children: [new TextRun({ text: ln === "" ? " " : ln, font: "Consolas", size: 18, color: "111827" })],
    })
  );
}
function bold(t) { return new TextRun({ text: t, bold: true }); }
function plain(t) { return new TextRun(t); }
function mono(t) { return new TextRun({ text: t, font: "Consolas", size: 19, color: BRAND_DARK }); }

function cell(content, { width, header = false, fill, align = AlignmentType.LEFT, bold: b = false } = {}) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CFD8D3" };
  const runs = Array.isArray(content)
    ? content
    : [new TextRun({ text: String(content), bold: header || b, color: header ? "FFFFFF" : "111827", size: header ? 19 : 19 })];
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: { top: border, bottom: border, left: border, right: border },
    shading: { fill: header ? HEADER_FILL : (fill || "FFFFFF"), type: ShadingType.CLEAR },
    margins: { top: 60, bottom: 60, left: 110, right: 110 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: align, children: runs })],
  });
}

// table: headers = [..], rows = [[..],..], widths = [..]
function buildTable(headers, rows, widths) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((hd, i) => cell(hd, { width: widths[i], header: true })),
  });
  const dataRows = rows.map((r, ri) =>
    new TableRow({
      children: r.map((c, i) =>
        cell(c, { width: widths[i], fill: ri % 2 === 1 ? ROW_ALT : "FFFFFF" })
      ),
    })
  );
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...dataRows],
  });
}

function spacer() { return new Paragraph({ spacing: { after: 80 }, children: [] }); }

// callout box (single-cell table)
function callout(title, body, fill = "FBEFD9", barColor = ACCENT) {
  const children = [
    new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: title, bold: true, color: BRAND_DARK })] }),
  ];
  (Array.isArray(body) ? body : [body]).forEach((b) =>
    children.push(new Paragraph({ spacing: { after: 40 }, children: Array.isArray(b) ? b : [new TextRun(b)] }))
  );
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            shading: { fill, type: ShadingType.CLEAR },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: fill },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: fill },
              right: { style: BorderStyle.SINGLE, size: 1, color: fill },
              left: { style: BorderStyle.SINGLE, size: 24, color: barColor },
            },
            margins: { top: 120, bottom: 120, left: 200, right: 160 },
            children,
          }),
        ],
      }),
    ],
  });
}

// =====================================================================
// DOCUMENT CONTENT
// =====================================================================
const children = [];

// ---------- COVER ----------
children.push(
  new Paragraph({ spacing: { before: 1800 }, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: "SiKasir", bold: true, size: 88, color: BRAND })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: "Sistem Aplikasi Kasir (Point of Sale)", size: 32, color: "374151" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 600 },
    children: [new TextRun({ text: "Dokumentasi Teknis", bold: true, size: 36, color: ACCENT })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BRAND, space: 8 } },
    spacing: { after: 400 },
    children: [],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
    children: [new TextRun({ text: "Laravel 13  •  Inertia.js v3  •  Vue 3 + TypeScript  •  TailwindCSS v4  •  MySQL", size: 22, color: GREY })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1400 },
    children: [new TextRun({ text: "Versi Dokumen 1.0", size: 22, color: "374151" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "16 Juni 2026", size: 22, color: "374151" })],
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ---------- TOC ----------
children.push(
  h1("Daftar Isi"),
  new TableOfContents("Daftar Isi", { hyperlink: true, headingStyleRange: "1-3" }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ---------- 1. PENDAHULUAN ----------
children.push(h1("1. Pendahuluan"));
children.push(h2("1.1 Tentang SiKasir"));
children.push(p("SiKasir adalah aplikasi kasir berbasis web (Point of Sale / POS) untuk usaha ritel skala kecil hingga menengah, seperti toko atau usaha makanan dan minuman. Aplikasi ini membantu pemilik usaha mengelola produk, mencatat transaksi penjualan, memantau stok, mengatur promo, mencatat pengeluaran, serta menghitung modal dan laba secara akurat melalui modul produksi (batch costing)."));
children.push(p("Aplikasi memiliki dua peran pengguna utama: Admin yang mengelola data master dan memantau performa bisnis melalui dashboard analitik, serta Kasir yang melayani transaksi penjualan di garis depan."));

children.push(h2("1.2 Tujuan Dokumen"));
children.push(p("Dokumen ini merupakan dokumentasi teknis yang ditujukan bagi pengembang (developer) dan pihak yang ingin memahami cara kerja internal SiKasir. Dokumen menjelaskan arsitektur sistem, struktur basis data, alur logika bisnis penting, daftar endpoint, pengujian, serta cara instalasi dan menjalankan aplikasi."));

children.push(h2("1.3 Ruang Lingkup"));
children.push(p("Cakupan fitur yang didokumentasikan meliputi:"));
[
  "Manajemen kategori dan produk (termasuk cetak barcode).",
  "Transaksi kasir dengan dukungan promo per produk dan promo global.",
  "Modul produksi dengan perhitungan modal berbasis batch (batch costing).",
  "Pencatatan pengeluaran operasional.",
  "Dashboard admin dengan analisis penjualan dan analisis laba-rugi.",
  "Dashboard dan riwayat transaksi untuk kasir.",
  "Manajemen pengguna dan peran (admin/kasir).",
].forEach((t) => children.push(bullet(t)));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 2. ARSITEKTUR & TEKNOLOGI ----------
children.push(h1("2. Arsitektur & Teknologi"));

children.push(h2("2.1 Tumpukan Teknologi (Tech Stack)"));
children.push(p("SiKasir dibangun di atas Laravel Vue Starter Kit dengan kombinasi teknologi berikut:"));
children.push(buildTable(
  ["Lapisan", "Teknologi", "Keterangan"],
  [
    ["Backend", "Laravel 13 (PHP 8.3)", "Framework aplikasi, routing, ORM Eloquent, validasi."],
    ["Frontend", "Vue 3 + TypeScript", "Komponen antarmuka berbasis Single File Component."],
    ["Penghubung", "Inertia.js v3", "Menjembatani Laravel dan Vue tanpa membangun REST API terpisah (monolith SPA)."],
    ["Styling", "TailwindCSS v4", "Utility-first CSS; komponen UI memakai reka-ui."],
    ["Build tool", "Vite 8", "Bundling aset frontend, hot-reload saat pengembangan."],
    ["Autentikasi", "Laravel Fortify", "Login, verifikasi email, reset password, dan 2FA (google2fa)."],
    ["Ikon & Notifikasi", "lucide-vue-next, vue-sonner", "Set ikon dan notifikasi toast."],
    ["Barcode", "JsBarcode", "Render barcode produk format CODE128 di sisi klien."],
    ["Basis data", "MySQL", "Dijalankan melalui Laragon pada lingkungan pengembangan."],
    ["Pengujian", "Pest 4", "Feature & unit test."],
  ],
  [1700, 2700, 4960],
));

children.push(spacer());
children.push(h2("2.2 Pola Arsitektur"));
children.push(p([
  plain("SiKasir menggunakan pola "),
  bold("monolith SPA"),
  plain(" melalui Inertia.js. Controller Laravel tidak mengembalikan JSON murni, melainkan me-render komponen halaman Vue lewat "),
  mono("Inertia::render('NamaHalaman', [data])"),
  plain(". Data dikirim sebagai props ke komponen Vue, sehingga navigasi terasa seperti SPA namun routing, validasi, dan otorisasi tetap ditangani di sisi server."),
]));
children.push(p("Beberapa pola khusus yang dipakai pada proyek ini:"));
children.push(bullet([bold("Inertia v3 layout props: "), plain("layout dan breadcrumbs didefinisikan di komponen halaman menggunakan defineOptions({ layout: { breadcrumbs: [...] } }).")]));
children.push(bullet([bold("Plugin @inertiajs/vite: "), plain("secara otomatis menyuntikkan fungsi resolve dan setup default ke dalam createInertiaApp.")]));
children.push(bullet([bold("Otorisasi berbasis middleware: "), plain("grup route dilindungi middleware role:admin dan role:kasir.")]));

children.push(spacer());
children.push(h2("2.3 Struktur Direktori Penting"));
children.push(buildTable(
  ["Direktori / Berkas", "Isi"],
  [
    ["routes/web.php", "Definisi seluruh route web, etalase publik, dan pembagian grup admin/kasir."],
    ["app/Http/Controllers", "Controller per modul (Produk, Kasir, Transaksi, Promo, Pengeluaran, Produksi, Admin\\Dashboard, Admin\\User)."],
    ["app/Models", "Model Eloquent: Produk, Transaksi, DetailTransaksi, Promo, Pengeluaran, Kategori, Produksi, ProduksiBiaya, User."],
    ["database/migrations", "Skema tabel dan perubahan struktur basis data."],
    ["resources/js/pages", "Komponen halaman Vue, terbagi admin/, kasir/, auth/, settings/."],
    ["tests/Feature", "Pengujian fitur dengan Pest."],
  ],
  [3000, 6360],
));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 3. AUTENTIKASI & PERAN ----------
children.push(h1("3. Autentikasi & Manajemen Peran"));
children.push(p([
  plain("Autentikasi ditangani oleh Laravel Fortify (login, verifikasi email, reset password, dan two-factor authentication). Setiap pengguna memiliki kolom "),
  mono("role"),
  plain(" bertipe enum dengan dua nilai: "),
  mono("admin"),
  plain(" dan "),
  mono("kasir"),
  plain(" (default kasir)."),
]));
children.push(p([
  plain("Setelah login, route "),
  mono("/dashboard"),
  plain(" mengarahkan pengguna sesuai perannya — admin diarahkan ke "),
  mono("admin.dashboard"),
  plain(", kasir ke "),
  mono("kasir.dashboard"),
  plain(". Seluruh route fungsional berada di balik middleware "),
  mono("auth"),
  plain(" dan "),
  mono("verified"),
  plain(", lalu dipisah lagi dengan middleware peran:"),
]));
children.push(buildTable(
  ["Peran", "Hak Akses"],
  [
    ["Admin", "Mengelola kategori, produk, transaksi, pengeluaran, produksi, promo, dan pengguna; mengakses dashboard analitik & analisis laba-rugi."],
    ["Kasir", "Mengakses dashboard kasir, melakukan transaksi penjualan, dan melihat riwayat transaksinya sendiri."],
  ],
  [1700, 7660],
));
children.push(spacer());
children.push(p("Akun bawaan untuk pengembangan/seeder:"));
children.push(buildTable(
  ["Peran", "Email"],
  [
    ["Admin", "admin@gmail.com"],
    ["Kasir", "siti@gmail.com, agus@gmail.com, dewi@gmail.com"],
  ],
  [2400, 6960],
));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 4. MODUL & FITUR ----------
children.push(h1("4. Modul & Fitur"));

children.push(h2("4.1 Manajemen Kategori"));
children.push(p([
  plain("Kategori mengelompokkan produk. Dikelola admin melalui CRUD penuh ("),
  mono("KategoriController"),
  plain("). Saat kategori dihapus, relasi pada produk diset null ("),
  mono("nullOnDelete"),
  plain(") dan ditampilkan sebagai “Kategori Terhapus” agar data produk tetap utuh."),
]));

children.push(h2("4.2 Manajemen Produk"));
children.push(p([
  plain("Produk memiliki dua jenis yang menentukan cara modal dihitung, dikontrol oleh kolom "),
  mono("jenis"),
  plain(":"),
]));
children.push(bullet([bold("beli "), plain("— barang jadi dari agen/supplier. Modal (harga_modal) diisi manual.")]));
children.push(bullet([bold("produksi "), plain("— dibuat sendiri. Modal TIDAK diisi manual, melainkan dihitung otomatis dari modul Produksi (lihat 4.3).")]));
children.push(p([
  plain("Setiap produk memiliki harga jual, stok, foto, "),
  mono("sku"),
  plain(" (unik), dan "),
  mono("barcode"),
  plain(" (string 13 digit, unik, boleh kosong). Barcode dirender di sisi klien dengan JsBarcode format CODE128 dan dapat dicetak. Status stok dihitung otomatis lewat accessor: "),
  mono("out-of-stock"),
  plain(" (stok 0), "),
  mono("low-stock"),
  plain(" (stok ≤ 5), dan "),
  mono("in-stock"),
  plain(" (di atas itu)."),
]));

children.push(h2("4.3 Produksi & Batch Costing"));
children.push(p([
  plain("Modul Produksi mencatat batch pembuatan produk "),
  mono("jenis = produksi"),
  plain(". Setiap batch mencatat sekumpulan biaya bahan (tabel produksi_biayas), jumlah unit jadi yang dihasilkan, dan modal per unit hasil perhitungan. Saat batch disimpan ("),
  mono("ProduksiController@store"),
  plain("), sistem melakukan, dalam satu transaksi basis data:"),
]));
children.push(num("Menjumlahkan seluruh biaya bahan menjadi total_biaya."));
children.push(num([mono("modal_per_unit = round(total_biaya / jumlah)"), plain(".")]));
children.push(num("Menambah stok produk sebesar jumlah unit yang dihasilkan."));
children.push(num([plain("Memperbarui "), mono("harga_modal"), plain(" produk ke nilai modal_per_unit batch terbaru.")]));
children.push(p([
  plain("Saat batch dihapus, stok yang sempat ditambahkan dikembalikan (dikurangi, minimal 0) dan rincian biaya ikut terhapus secara "),
  mono("cascade"),
  plain("."),
]));

children.push(h2("4.4 Transaksi Kasir (POS)"));
children.push(p([
  plain("Kasir memilih produk, sistem menerapkan promo, lalu menyimpan transaksi melalui "),
  mono("KasirController@store"),
  plain(". Seluruh proses dibungkus dalam database transaction dengan penguncian baris ("),
  mono("lockForUpdate"),
  plain(") untuk mencegah balapan stok. Alur ringkasnya:"),
]));
children.push(num("Validasi input: metode pembayaran (cash/qris/transfer), jumlah bayar, dan daftar item."));
children.push(num("Untuk tiap item: kunci baris produk, cek kecukupan stok (gagal → ValidationException), hitung subtotal, dan terapkan promo spesifik produk bila ada."));
children.push(num([plain("Snapshot modal: "), mono("harga_modal"), plain(" produk saat itu disalin ke kolom modal pada detail_transaksis.")]));
children.push(num("Terapkan promo global (opsional) bila syarat minimal belanja terpenuhi."));
children.push(num("Hitung total harga = subtotal − total diskon; validasi bayar ≥ total; simpan transaksi, detail, lalu kurangi stok tiap produk."));
children.push(p("Setelah berhasil, kasir diarahkan ke halaman riwayat dengan notifikasi sukses."));

children.push(h2("4.5 Promo"));
children.push(p("Promo dikelola admin dan terdiri dari dua tipe nilai dan dua cakupan:"));
children.push(bullet([bold("Tipe: "), plain("persen (diskon %) atau nominal (potongan rupiah).")]));
children.push(bullet([bold("Cakupan per produk: "), plain("promo terikat ke satu produk (id_produk terisi), diterapkan otomatis per item saat penjualan.")]));
children.push(bullet([bold("Cakupan global: "), plain("id_produk null (“Semua Produk”), dipilih saat transaksi, dapat memiliki syarat minimal belanja.")]));
children.push(p("Promo hanya berlaku jika aktif dan tanggal kini berada di antara tanggal_mulai dan tanggal_selesai. Pada etalase publik, produk yang sedang promo ditampilkan paling atas beserta keterangan diskon dan sisa hari berlakunya."));

children.push(h2("4.6 Pengeluaran"));
children.push(p([
  plain("Mencatat pengeluaran usaha dengan kolom "),
  mono("tipe"),
  plain(" (enum: bahan_baku, kemasan, operasional, transportasi, gaji, peralatan, sewa, listrik_air, promosi, pajak, lainnya), judul, keterangan, dan nominal. "),
]));
children.push(callout(
  "⚠ Aturan Anti Double-Count",
  [
    [plain("Pengeluaran bertipe "), mono("bahan_baku"), plain(" dan "), mono("kemasan"), plain(" DIKECUALIKAN dari perhitungan biaya operasional di dashboard.")],
    [plain("Alasannya: biaya bahan untuk produk buatan sendiri sudah dihitung lewat batch Produksi. Mencatatnya lagi sebagai pengeluaran akan menghitung biaya dua kali. Karena itu, biaya bahan dicatat di modul Produksi, BUKAN di modul Pengeluaran.")],
  ],
));

children.push(h2("4.7 Dashboard Admin & Analisis Laba-Rugi"));
children.push(p([
  plain("Dashboard admin ("),
  mono("Admin\\DashboardController"),
  plain(") menyajikan ringkasan kinerja untuk rentang tanggal terpilih (default: hari ini). Metrik dan visual yang ditampilkan:"),
]));
children.push(bullet("Kartu statistik: omzet, jumlah transaksi, rata-rata nilai transaksi, total item terjual, HPP, laba kotor, biaya operasional, laba bersih, dan margin penjualan."));
children.push(bullet("Grafik tren: omzet harian dan jumlah transaksi harian."));
children.push(bullet("Peringkat: produk terlaris, kurang laku, paling menguntungkan; tanggal & jam penjualan tertinggi; peringkat kasir berdasar transaksi dan omzet."));
children.push(bullet("Analisis laba-rugi: grafik waterfall, perbandingan periode, peringatan rugi semu, dan kesimpulan otomatis (dibahas di Bab 6)."));

children.push(h2("4.8 Dashboard & Riwayat Kasir"));
children.push(p([
  plain("Kasir memiliki dashboard ringkas ("),
  mono("KasirController@dashboard"),
  plain(") berisi penjualan hari ini, penjualan pada rentang tanggal, dan 5 transaksi terakhir miliknya. Halaman Riwayat menampilkan seluruh transaksi kasir tersebut beserta rincian item, diskon, metode bayar, dan kembalian, dengan filter rentang tanggal."),
]));

children.push(h2("4.9 Etalase Publik"));
children.push(p([
  plain("Halaman beranda ("),
  mono("Welcome"),
  plain(") dapat diakses tanpa login dan menampilkan 5 produk terlaris serta seluruh produk, dengan produk yang sedang promo ditampilkan paling atas beserta label diskonnya."),
]));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 5. DESAIN BASIS DATA ----------
children.push(h1("5. Desain Basis Data"));

children.push(h2("5.1 Daftar Tabel Utama"));
children.push(buildTable(
  ["Tabel", "Fungsi"],
  [
    ["users", "Pengguna aplikasi beserta peran (admin/kasir)."],
    ["kategoris", "Kategori produk."],
    ["produks", "Data produk (jenis, harga jual, modal, stok, barcode, sku)."],
    ["transaksis", "Header transaksi penjualan."],
    ["detail_transaksis", "Baris item per transaksi (termasuk snapshot modal)."],
    ["promos", "Promo per produk maupun global."],
    ["pengeluarans", "Pengeluaran usaha menurut tipe."],
    ["produksis", "Batch produksi produk buatan sendiri."],
    ["produksi_biayas", "Rincian biaya bahan per batch produksi."],
  ],
  [2600, 6760],
));

children.push(spacer());
children.push(h2("5.2 Skema Kolom"));

children.push(h3("Tabel produks"));
children.push(buildTable(
  ["Kolom", "Tipe", "Keterangan"],
  [
    ["id_produk", "bigint, PK", "Primary key."],
    ["id_kategori", "FK → kategoris, nullable", "Null saat kategori dihapus."],
    ["jenis", "enum(beli, produksi)", "Menentukan cara modal dihitung. Default beli."],
    ["nama", "string", "Nama produk."],
    ["foto", "string, nullable", "Path foto pada storage."],
    ["harga_jual", "unsigned bigint", "Harga jual per unit."],
    ["harga_modal", "unsigned bigint", "Modal/HPP per unit (manual untuk beli, otomatis untuk produksi)."],
    ["stok", "integer", "Jumlah stok tersedia."],
    ["barcode", "string, unik, nullable", "Barcode 13 digit (CODE128)."],
    ["sku", "string, unik", "Kode SKU produk."],
  ],
  [2100, 2600, 4660],
));

children.push(spacer());
children.push(h3("Tabel transaksis & detail_transaksis"));
children.push(buildTable(
  ["Kolom", "Tipe", "Keterangan"],
  [
    ["id_transaksi", "bigint, PK", "Primary key."],
    ["id_user", "FK → users, nullable", "Kasir/admin pembuat; null bila user dihapus."],
    ["id_promo", "FK → promos, nullable", "Promo global yang diterapkan."],
    ["total_harga", "unsigned bigint", "Total setelah diskon."],
    ["diskon", "unsigned bigint", "Total diskon (item + global)."],
    ["metode_pembayaran", "enum(cash, qris, transfer)", "Metode bayar."],
    ["bayar / kembalian", "unsigned bigint", "Jumlah dibayar dan kembalian."],
  ],
  [2300, 2900, 4160],
));
children.push(spacer());
children.push(buildTable(
  ["Kolom (detail_transaksis)", "Tipe", "Keterangan"],
  [
    ["id_detail_transaksi", "bigint, PK", "Primary key."],
    ["id_transaksi", "FK → transaksis (cascade)", "Induk transaksi."],
    ["id_produk", "FK → produks, nullable", "Produk; null bila produk dihapus."],
    ["jumlah", "integer", "Kuantitas item."],
    ["harga", "unsigned bigint", "Harga jual saat transaksi."],
    ["modal", "unsigned bigint", "Snapshot HPP/unit saat terjual (untuk laba historis)."],
    ["subtotal", "unsigned bigint", "Subtotal item setelah promo."],
  ],
  [2600, 2700, 4060],
));

children.push(spacer());
children.push(h3("Tabel produksis & produksi_biayas"));
children.push(buildTable(
  ["Kolom", "Tipe", "Keterangan"],
  [
    ["id_produksi", "bigint, PK", "Primary key batch."],
    ["id_produk", "FK → produks", "Produk buatan sendiri yang diproduksi."],
    ["jumlah", "integer", "Unit jadi yang dihasilkan batch."],
    ["total_biaya", "unsigned bigint", "Total biaya bahan batch."],
    ["modal_per_unit", "unsigned bigint", "total_biaya / jumlah (snapshot)."],
    ["catatan", "text, nullable", "Catatan batch."],
    ["(produksi_biayas) nama, nominal", "string, unsigned bigint", "Rincian item biaya per batch (cascade saat batch dihapus)."],
  ],
  [2900, 2500, 3960],
));

children.push(spacer());
children.push(h3("Tabel promos & pengeluarans"));
children.push(buildTable(
  ["Kolom", "Tipe", "Keterangan"],
  [
    ["(promos) tipe", "enum(persen, nominal)", "Jenis nilai diskon."],
    ["(promos) nilai", "decimal(12,2)", "Besaran diskon."],
    ["(promos) id_produk", "FK, nullable", "Null = promo global (Semua Produk)."],
    ["(promos) minimal_belanja", "decimal, nullable", "Syarat minimal untuk promo global."],
    ["(promos) tanggal_mulai/selesai, aktif", "datetime, boolean", "Periode & status aktif."],
    ["(pengeluarans) tipe", "enum (11 nilai)", "bahan_baku, kemasan, operasional, dst."],
    ["(pengeluarans) judul, keterangan, nominal", "string, text, unsigned bigint", "Detail pengeluaran."],
  ],
  [3100, 2500, 3760],
));

children.push(spacer());
children.push(h2("5.3 Relasi Antar Tabel"));
children.push(bullet("kategoris 1 — N produks (kategori memiliki banyak produk)."));
children.push(bullet("users 1 — N transaksis (kasir membuat banyak transaksi)."));
children.push(bullet("transaksis 1 — N detail_transaksis (satu transaksi banyak item)."));
children.push(bullet("produks 1 — N detail_transaksis (produk muncul di banyak transaksi)."));
children.push(bullet("promos 1 — N transaksis (promo global) dan promos N — 1 produks (promo per produk)."));
children.push(bullet("produks 1 — N produksis (produk diproduksi dalam banyak batch)."));
children.push(bullet("produksis 1 — N produksi_biayas (satu batch banyak item biaya)."));

children.push(spacer());
children.push(h2("5.4 Strategi Preservasi Histori"));
children.push(p([
  plain("Agar laporan keuangan historis tidak rusak ketika data master dihapus, foreign key pada transaksis (id_user), produks (id_kategori), dan detail_transaksis (id_produk) memakai "),
  mono("nullOnDelete"),
  plain(". Relasi Eloquent menyediakan nilai default — misalnya “User Terhapus”, “Produk Terhapus”, “Kategori Terhapus” — sehingga data transaksi lama tetap dapat ditampilkan utuh. Detail transaksi sendiri ikut terhapus (cascade) bila induk transaksinya dihapus."),
]));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 6. LOGIKA BISNIS INTI ----------
children.push(h1("6. Logika Bisnis Inti"));

children.push(h2("6.1 Perhitungan Modal: beli vs produksi"));
children.push(p([
  plain("Modal per unit (harga_modal) adalah dasar perhitungan laba. Untuk produk "),
  mono("beli"),
  plain(", nilai ini diisi manual. Untuk produk "),
  mono("produksi"),
  plain(", nilai dihitung otomatis dari batch produksi dan tidak boleh diisi manual."),
]));

children.push(h2("6.2 Batch Costing"));
children.push(p("Setiap batch produksi menghitung modal per unit dengan rumus:"));
children.push(...code([
  "total_biaya   = Σ nominal seluruh biaya bahan batch",
  "modal_per_unit = round(total_biaya / jumlah_unit_hasil)",
]));
children.push(p([
  plain("Mencatat batch akan menambah stok produk sebesar jumlah unit dan memperbarui "),
  mono("harga_modal"),
  plain(" produk ke nilai modal_per_unit batch terbaru."),
]));

children.push(h2("6.3 Snapshot Modal & Laba Historis"));
children.push(p([
  plain("Saat penjualan terjadi, nilai "),
  mono("harga_modal"),
  plain(" produk disalin (snapshot) ke kolom "),
  mono("modal"),
  plain(" di detail_transaksis. Dengan begitu, ketika modal produk berubah di kemudian hari (misalnya batch baru lebih mahal), laba transaksi lama tetap dihitung berdasarkan modal saat barang itu benar-benar terjual — laba historis tidak ikut berubah."),
]));

children.push(h2("6.4 Perhitungan Laba pada Dashboard"));
children.push(p("Metrik finansial dihitung sebagai berikut:"));
children.push(...code([
  "HPP (COGS)        = Σ (modal × jumlah)   // dari snapshot detail_transaksis",
  "Laba Kotor        = Omzet − HPP",
  "Biaya Operasional = Σ nominal pengeluaran  (KECUALI bahan_baku & kemasan)",
  "Laba Bersih       = Laba Kotor − Biaya Operasional",
  "Margin Penjualan  = (Laba Bersih / Omzet) × 100%",
]));
children.push(p([
  plain("Pengecualian tipe "),
  mono("bahan_baku"),
  plain(" dan "),
  mono("kemasan"),
  plain(" pada biaya operasional adalah penerapan langsung aturan anti double-count (lihat 4.6)."),
]));

children.push(h2("6.5 Penerapan Promo saat Transaksi"));
children.push(p("Diskon dihitung dalam dua tahap dan dijumlahkan menjadi total diskon:"));
children.push(bullet([bold("Diskon per item "), plain("— promo spesifik produk. Tipe persen: subtotal item × nilai%. Tipe nominal: nilai × jumlah item.")]));
children.push(bullet([bold("Diskon global "), plain("— dari promo yang dipilih (id_produk null). Diterapkan hanya bila syarat minimal_belanja terpenuhi. Tipe persen dihitung dari subtotal; tipe nominal dipotong langsung.")]));
children.push(p([mono("total_harga = max(0, subtotal − (diskon_global + Σ diskon_item))"), plain(".")]));

children.push(h2("6.6 Analisis Laba-Rugi"));
children.push(p("Bagian analisis dirancang untuk mendiagnosis penyebab rugi, terdiri dari empat komponen:"));
children.push(num([bold("Grafik waterfall "), plain("— rantai laba: Omzet → −HPP → Laba Kotor → −biaya per kategori → Laba Bersih.")]));
children.push(num([bold("Perbandingan periode "), plain("— empat kartu (Omzet, Laba Kotor, Biaya Operasional, Laba Bersih) dibanding periode setara sebelumnya: durasi sama persis tepat sebelum periode aktif.")]));
children.push(...code([
  "prevEnd   = startDate − 1 hari",
  "prevStart = prevEnd − (periodDays − 1)",
]));
children.push(num([bold("Peringatan “rugi semu” "), plain("— muncul bila rentang < 28 hari namun mengandung pengeluaran bertipe gaji, sewa, atau pajak (biaya yang lazimnya bulanan), agar rugi jangka pendek tidak salah ditafsirkan.")]));
children.push(num([bold("Kesimpulan otomatis "), plain("— fungsi buildInsight menyusun narasi: apakah untung/rugi, di titik mana laba bocor (HPP melebihi omzet, atau biaya operasional melebihi laba kotor — menyebut kategori biaya terbesar), serta perubahan omzet & biaya dibanding periode sebelumnya.")]));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 7. ROUTE ----------
children.push(h1("7. Daftar Route / Endpoint"));
children.push(h2("7.1 Publik & Umum"));
children.push(buildTable(
  ["Method", "URI", "Nama", "Keterangan"],
  [
    ["GET", "/", "home", "Etalase publik (produk & terlaris)."],
    ["GET", "/dashboard", "dashboard", "Pengalihan sesuai peran."],
  ],
  [1200, 2400, 2400, 3360],
));
children.push(spacer());
children.push(h2("7.2 Area Admin (middleware role:admin)"));
children.push(buildTable(
  ["Resource", "Route (GET/POST/PUT/DELETE)", "Keterangan"],
  [
    ["Dashboard", "GET admin/dashboard", "Analitik & laba-rugi."],
    ["Users", "admin/users [+ store/update/destroy]", "Manajemen pengguna."],
    ["Kategori", "admin/kategori [+ store/update/destroy]", "CRUD kategori."],
    ["Produk", "admin/products [+ store/update/destroy]", "CRUD produk."],
    ["Transaksi", "admin/transactions [+ store/update/destroy]", "Kelola transaksi."],
    ["Pengeluaran", "admin/pengeluarans [+ store/update/destroy]", "CRUD pengeluaran."],
    ["Produksi", "admin/produksi [+ store/destroy]", "Batch costing."],
    ["Promo", "admin/promos [+ store/update/destroy]", "CRUD promo."],
  ],
  [1700, 4360, 3300],
));
children.push(spacer());
children.push(h2("7.3 Area Kasir (middleware role:kasir)"));
children.push(buildTable(
  ["Method", "URI", "Nama", "Keterangan"],
  [
    ["GET", "kasir/dashboard", "kasir.dashboard", "Ringkasan penjualan."],
    ["GET", "kasir/transaksi", "kasir.transaksi", "Halaman kasir/POS."],
    ["POST", "kasir/transaksi", "kasir.transaksi.store", "Simpan transaksi."],
    ["GET", "kasir/riwayat", "kasir.riwayat", "Riwayat transaksi."],
  ],
  [1100, 2700, 2700, 2860],
));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 8. PENGUJIAN ----------
children.push(h1("8. Pengujian"));
children.push(p("Pengujian menggunakan Pest 4. Cakupan feature test yang tersedia:"));
children.push(buildTable(
  ["Berkas Test", "Cakupan"],
  [
    ["KasirTransaksiTest", "Alur transaksi kasir, validasi, penerapan promo, dan snapshot modal."],
    ["ProduksiTest", "Batch costing: perhitungan modal, penambahan stok, pembaruan harga_modal."],
    ["PromoTest", "Validasi & penerapan promo."],
    ["PengeluaranTest", "CRUD pengeluaran."],
    ["DashboardTest", "Metrik & tampilan dashboard."],
    ["UserTest / KategoriTest", "Manajemen pengguna dan kategori."],
    ["Auth/* & Settings/*", "Autentikasi, verifikasi email, reset password, profil, keamanan."],
  ],
  [2600, 6760],
));
children.push(spacer());
children.push(p("Menjalankan pengujian dan pemeriksaan kualitas kode:"));
children.push(...code([
  "php artisan test          # menjalankan seluruh test (Pest)",
  "composer ci:check         # lint + format + types + test",
  "vendor\\bin\\pint            # format kode PHP (Laravel Pint)",
]));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 9. INSTALASI ----------
children.push(h1("9. Instalasi & Menjalankan"));
children.push(h2("9.1 Prasyarat"));
children.push(bullet("PHP 8.3+, Composer, Node.js, dan MySQL (disarankan via Laragon)."));

children.push(h2("9.2 Langkah Instalasi"));
children.push(...code([
  "composer install",
  "copy .env.example .env",
  "php artisan key:generate",
  "php artisan migrate --seed",
  "npm install",
  "npm run build",
]));
children.push(p([
  plain("Atau gunakan skrip ringkas "),
  mono("composer setup"),
  plain(" yang menjalankan rangkaian perintah di atas."),
]));

children.push(h2("9.3 Mode Pengembangan"));
children.push(p([
  plain("Jalankan "),
  mono("composer dev"),
  plain(" untuk menjalankan server PHP, queue listener, dan Vite (hot-reload) secara bersamaan."),
]));

children.push(h2("9.4 Mode Produksi (Laragon)"));
children.push(callout(
  "❗ Catatan Penting",
  [
    [plain("Aplikasi disajikan melalui virtual host Laragon pada "), mono("sikasir.test"), plain(" dalam mode produksi.")],
    [plain("Setiap kali ada perubahan kode frontend, WAJIB menjalankan "), mono("npm run build"), plain(" agar perubahan tersedia di mode produksi. Tanpa build ulang, halaman bisa menampilkan versi lama atau gagal dimuat.")],
  ],
  "FBEFD9", ACCENT,
));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 10. PENUTUP ----------
children.push(h1("10. Penutup"));
children.push(h2("10.1 Kesimpulan"));
children.push(p("SiKasir adalah aplikasi kasir yang tidak hanya mencatat penjualan, tetapi juga memberikan visibilitas finansial yang akurat melalui batch costing, snapshot modal, dan analisis laba-rugi otomatis. Arsitektur monolith SPA berbasis Inertia membuat pengembangan tetap sederhana sambil memberikan pengalaman pengguna yang responsif."));
children.push(h2("10.2 Saran Pengembangan"));
children.push(bullet("Laporan ekspor (PDF/Excel) untuk transaksi dan laba-rugi."));
children.push(bullet("Manajemen stok lanjutan: stok minimum otomatis, notifikasi restock, dan kartu stok (stock card)."));
children.push(bullet("Integrasi pembayaran digital (QRIS dinamis) dan cetak struk termal."));
children.push(bullet("Audit log untuk perubahan data master dan transaksi."));
children.push(bullet("Multi-cabang / multi-outlet bila skala usaha bertambah."));

children.push(new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "— Akhir Dokumen —", italics: true, color: GREY })] }));

// =====================================================================
// DOC ASSEMBLY
// =====================================================================
const doc = new Document({
  creator: "SiKasir",
  title: "Dokumentasi Teknis SiKasir",
  description: "Dokumentasi teknis aplikasi kasir SiKasir",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22, color: "1F2937" } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 34, bold: true, font: "Calibri", color: BRAND },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND, space: 6 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 27, bold: true, font: "Calibri", color: BRAND_DARK },
        paragraph: { spacing: { before: 220, after: 100 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 23, bold: true, font: "Calibri", color: ACCENT },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 620, hanging: 300 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1100, hanging: 300 } } } },
        ] },
      { reference: "numbers",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 620, hanging: 300 } } } },
        ] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "D1D5DB", space: 4 } },
          children: [
            new TextRun({ text: "SiKasir", bold: true, color: BRAND, size: 18 }),
            new TextRun({ text: "\tDokumentasi Teknis", color: GREY, size: 18 }),
          ],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Halaman ", color: GREY, size: 18 }),
            new TextRun({ children: [PageNumber.CURRENT], color: GREY, size: 18 }),
          ],
        })],
      }),
    },
    children,
  }],
});

const out = path.join("C:/laragon/www/SiKasir", "Dokumentasi-Teknis-SiKasir.docx");
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(out, buffer);
  console.log("WROTE:", out, buffer.length, "bytes");
});
