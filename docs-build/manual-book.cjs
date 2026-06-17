/* eslint-disable */
// Generator Buku Panduan Penggunaan (Manual Book) — SiKasir
const fs = require("fs");
const docx = require("C:/Users/User/AppData/Roaming/npm/node_modules/docx");

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, TabStopType, TabStopPosition,
  TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak,
} = docx;

// ---------- Palet warna ----------
const BRAND = "1F6F54";      // hijau utama
const BRAND_DARK = "14503C";
const ACCENT = "B45309";     // amber aksen
const HEADER_FILL = "1F6F54";
const ROW_ALT = "EEF5F1";
const NOTE_FILL = "FEF3C7";  // kuning muda (catatan)
const TIP_FILL = "DCFCE7";   // hijau muda (tips)
const WARN_FILL = "FEE2E2";  // merah muda (peringatan)
const STEP_FILL = "F3F4F6";
const GREY = "6B7280";
const WHITE = "FFFFFF";

const CONTENT_WIDTH = 9360;  // US Letter, margin 1"

// ---------- Helper ----------
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

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
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    children: [new TextRun({ text, ...opts })],
  });
}
// Paragraf dengan campuran teks tebal/biasa. runs = [{text, bold, italics, color}]
function rich(runs, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    children: runs.map((r) => new TextRun(r)),
    ...opts,
  });
}
function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 60, line: 264 },
    children: typeof text === "string" ? [new TextRun(text)] : text.map((r) => new TextRun(r)),
  });
}
function num(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "steps", level },
    spacing: { after: 80, line: 264 },
    children: typeof text === "string" ? [new TextRun(text)] : text.map((r) => new TextRun(r)),
  });
}
function spacer(size = 120) {
  return new Paragraph({ spacing: { after: size }, children: [new TextRun("")] });
}

// Kotak info berwarna (Catatan / Tips / Peringatan)
function callout(label, text, fill, labelColor) {
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: fill },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: fill },
              left: { style: BorderStyle.SINGLE, size: 24, color: labelColor },
              right: { style: BorderStyle.SINGLE, size: 1, color: fill },
            },
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            shading: { fill, type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 160, right: 140 },
            children: [
              new Paragraph({
                spacing: { after: 0, line: 270 },
                children: [
                  new TextRun({ text: label + "  ", bold: true, color: labelColor }),
                  new TextRun({ text, color: "1F2937" }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
const note = (t) => callout("CATATAN", t, NOTE_FILL, ACCENT);
const tip = (t) => callout("TIPS", t, TIP_FILL, BRAND_DARK);
const warn = (t) => callout("PENTING", t, WARN_FILL, "B91C1C");

// Tabel data umum: headers[], rows[][], widths[]
function dataTable(headers, rows, widths) {
  const headRow = new TableRow({
    tableHeader: true,
    children: headers.map((htext, i) =>
      new TableCell({
        borders,
        width: { size: widths[i], type: WidthType.DXA },
        shading: { fill: HEADER_FILL, type: ShadingType.CLEAR },
        margins: cellMargins,
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [new TextRun({ text: htext, bold: true, color: WHITE, size: 20 })] })],
      })
    ),
  });
  const bodyRows = rows.map((cells, ri) =>
    new TableRow({
      children: cells.map((c, ci) =>
        new TableCell({
          borders,
          width: { size: widths[ci], type: WidthType.DXA },
          shading: { fill: ri % 2 === 1 ? ROW_ALT : WHITE, type: ShadingType.CLEAR },
          margins: cellMargins,
          verticalAlign: VerticalAlign.CENTER,
          children: (Array.isArray(c) ? c : [c]).map((line, li) =>
            new Paragraph({
              spacing: { after: 0, line: 264 },
              children: [new TextRun({ text: String(line), size: 20, bold: ci === 0 && li === 0 && cells._boldFirst !== false })],
            })
          ),
        })
      ),
    })
  );
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headRow, ...bodyRows],
  });
}

// Tabel sederhana 2 kolom (Istilah | Penjelasan) tanpa bold kolom pertama otomatis
function defTable(headers, rows, widths, boldFirst = true) {
  const headRow = new TableRow({
    tableHeader: true,
    children: headers.map((htext, i) =>
      new TableCell({
        borders,
        width: { size: widths[i], type: WidthType.DXA },
        shading: { fill: HEADER_FILL, type: ShadingType.CLEAR },
        margins: cellMargins,
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [new TextRun({ text: htext, bold: true, color: WHITE, size: 20 })] })],
      })
    ),
  });
  const bodyRows = rows.map((cells, ri) =>
    new TableRow({
      children: cells.map((c, ci) =>
        new TableCell({
          borders,
          width: { size: widths[ci], type: WidthType.DXA },
          shading: { fill: ri % 2 === 1 ? ROW_ALT : WHITE, type: ShadingType.CLEAR },
          margins: cellMargins,
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({
            spacing: { after: 0, line: 264 },
            children: [new TextRun({ text: String(c), size: 20, bold: boldFirst && ci === 0 })],
          })],
        })
      ),
    })
  );
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headRow, ...bodyRows],
  });
}

// ============================================================
//  ISI DOKUMEN
// ============================================================
const children = [];

// ---------- HALAMAN SAMPUL ----------
children.push(
  new Paragraph({ spacing: { before: 1800, after: 0 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "SiKasir", bold: true, size: 96, color: BRAND })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 0 },
    children: [new TextRun({ text: "Sistem Kasir / Point of Sale", size: 28, color: GREY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 0 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 14, color: BRAND, space: 12 } },
    children: [new TextRun({ text: "", size: 8 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 700, after: 0 },
    children: [new TextRun({ text: "BUKU PANDUAN PENGGUNAAN", bold: true, size: 52, color: "1F2937" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 0 },
    children: [new TextRun({ text: "(Manual Book)", italics: true, size: 30, color: GREY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1600, after: 0 },
    children: [new TextRun({ text: "Panduan lengkap untuk Admin & Kasir", size: 26, color: "1F2937" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1600, after: 0 },
    children: [new TextRun({ text: "Versi 1.0", bold: true, size: 24, color: BRAND_DARK })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 0 },
    children: [new TextRun({ text: "Juni 2026", size: 22, color: GREY })] }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ---------- DAFTAR ISI ----------
children.push(
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Daftar Isi")] }),
  new TableOfContents("Daftar Isi", { hyperlink: true, headingStyleRange: "1-2" }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ============================================================
//  BAB 1 — PENDAHULUAN
// ============================================================
children.push(h1("BAB 1  Pendahuluan"));

children.push(h2("1.1  Tentang SiKasir"));
children.push(p("SiKasir adalah aplikasi kasir (Point of Sale/POS) berbasis web yang membantu Anda mengelola penjualan toko secara digital. Melalui SiKasir, kasir dapat melayani transaksi dengan cepat — termasuk memindai barcode produk — sementara pemilik atau admin dapat memantau kondisi keuangan, stok, dan kinerja penjualan secara menyeluruh dari satu tempat."));
children.push(p("Aplikasi ini dirancang untuk usaha yang menjual barang dagangan (barang jadi yang dibeli dari pemasok) sekaligus produk buatan sendiri, sehingga modal dan laba dapat dihitung secara akurat untuk kedua jenis produk tersebut."));

children.push(h2("1.2  Fitur Utama"));
children.push(bullet([{ text: "Etalase produk — ", bold: true }, { text: "halaman publik yang menampilkan produk terlaris, daftar produk, dan promo yang sedang berjalan." }]));
children.push(bullet([{ text: "Kasir (POS) — ", bold: true }, { text: "melayani transaksi penjualan dengan pencarian produk, pemindaian barcode, keranjang belanja, dan beberapa metode pembayaran." }]));
children.push(bullet([{ text: "Manajemen produk & kategori — ", bold: true }, { text: "menambah, mengubah, dan menghapus produk beserta foto, harga, stok, barcode, dan SKU." }]));
children.push(bullet([{ text: "Produksi (perhitungan modal) — ", bold: true }, { text: "mencatat biaya produksi produk buatan sendiri sehingga modal per unit dihitung otomatis." }]));
children.push(bullet([{ text: "Promo & diskon — ", bold: true }, { text: "membuat diskon per produk maupun diskon keseluruhan dengan batas periode dan minimal belanja." }]));
children.push(bullet([{ text: "Pengeluaran — ", bold: true }, { text: "mencatat biaya operasional toko berdasarkan kategori." }]));
children.push(bullet([{ text: "Dashboard & laporan — ", bold: true }, { text: "ringkasan omzet, laba kotor, laba bersih, produk terlaris, kinerja kasir, serta analisis laba & rugi otomatis." }]));
children.push(bullet([{ text: "Manajemen pengguna — ", bold: true }, { text: "mengelola akun admin dan kasir." }]));

children.push(h2("1.3  Peran Pengguna"));
children.push(p("SiKasir memiliki dua peran pengguna dengan hak akses yang berbeda. Saat masuk, sistem otomatis mengarahkan Anda ke halaman yang sesuai dengan peran akun."));
children.push(dataTable(
  ["Peran", "Hak Akses"],
  [
    ["Admin", "Akses penuh: dashboard analitik, kelola pengguna, kategori, produk, produksi, transaksi, pengeluaran, dan promo."],
    ["Kasir", "Melayani transaksi penjualan, melihat dashboard penjualan pribadi, dan melihat riwayat transaksinya sendiri."],
  ],
  [1800, 7560],
));

children.push(spacer(60));
children.push(h2("1.4  Kebutuhan Sistem"));
children.push(p("SiKasir berjalan di dalam peramban (browser), jadi Anda tidak perlu memasang aplikasi tambahan. Yang Anda butuhkan:"));
children.push(bullet("Peramban modern (Google Chrome, Microsoft Edge, atau Mozilla Firefox versi terbaru)."));
children.push(bullet("Koneksi ke jaringan tempat aplikasi dijalankan (server lokal toko atau internet)."));
children.push(bullet("Akun pengguna (admin atau kasir) yang sudah didaftarkan."));
children.push(bullet([{ text: "Opsional: ", bold: true }, { text: "alat pemindai barcode (barcode scanner) USB untuk mempercepat transaksi di halaman Kasir." }]));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ============================================================
//  BAB 2 — MEMULAI
// ============================================================
children.push(h1("BAB 2  Memulai"));

children.push(h2("2.1  Mengakses Aplikasi"));
children.push(p("Buka peramban Anda, lalu ketikkan alamat aplikasi SiKasir pada bilah alamat (misalnya alamat yang diberikan oleh administrator toko Anda). Halaman pertama yang muncul adalah Etalase Produk yang dapat dilihat oleh siapa saja tanpa perlu masuk."));
children.push(p("Untuk mulai bekerja sebagai admin atau kasir, Anda perlu masuk (login) terlebih dahulu melalui tombol Masuk."));

children.push(h2("2.2  Masuk (Login)"));
children.push(p("Ikuti langkah berikut untuk masuk ke akun Anda:"));
children.push(num("Klik tombol Masuk / Log in di pojok kanan atas halaman."));
children.push(num([{ text: "Masukkan ", }, { text: "Email", bold: true }, { text: " akun Anda." }]));
children.push(num([{ text: "Masukkan ", }, { text: "Kata Sandi", bold: true }, { text: " (password) Anda." }]));
children.push(num([{ text: "Centang ", }, { text: "Ingat saya", bold: true }, { text: " bila ingin tetap masuk pada perangkat ini (opsional)." }]));
children.push(num("Klik tombol Log in."));
children.push(p("Setelah berhasil, sistem otomatis mengarahkan Anda: admin menuju Dashboard Admin, dan kasir menuju Dashboard Kasir."));
children.push(note("Jika email atau kata sandi salah, akan muncul pesan kesalahan. Pastikan tombol Caps Lock tidak aktif dan email diketik dengan benar."));

children.push(spacer(60));
children.push(h2("2.3  Lupa Kata Sandi"));
children.push(p("Bila Anda lupa kata sandi:"));
children.push(num("Pada halaman Masuk, klik tautan Lupa kata sandi?."));
children.push(num("Masukkan alamat email akun Anda, lalu klik kirim."));
children.push(num("Buka email Anda dan klik tautan setel ulang yang dikirim sistem."));
children.push(num("Masukkan kata sandi baru, lalu simpan."));
children.push(note("Fitur ini membutuhkan layanan email yang aktif. Bila Anda tidak menerima email, hubungi administrator toko untuk meminta penyetelan ulang kata sandi secara manual melalui menu Data User."));

children.push(spacer(60));
children.push(h2("2.4  Mengenal Antarmuka"));
children.push(p("Setelah masuk, tampilan aplikasi terbagi menjadi beberapa bagian utama:"));
children.push(bullet([{ text: "Menu samping (sidebar) — ", bold: true }, { text: "daftar menu di sisi kiri layar untuk berpindah antar halaman. Isi menu menyesuaikan peran Anda (admin atau kasir)." }]));
children.push(bullet([{ text: "Area konten — ", bold: true }, { text: "bagian utama di tengah yang menampilkan halaman yang sedang dibuka." }]));
children.push(bullet([{ text: "Menu akun — ", bold: true }, { text: "di pojok atas, untuk membuka Pengaturan akun dan tombol Keluar (Log out)." }]));
children.push(p("Berikut struktur menu untuk masing-masing peran:"));
children.push(h3("Menu Admin"));
children.push(defTable(
  ["Menu", "Fungsi"],
  [
    ["Dashboard", "Ringkasan & analisis penjualan dan keuangan."],
    ["Data User", "Mengelola akun admin dan kasir."],
    ["Kategori", "Mengelola kategori produk."],
    ["Data Produk", "Mengelola produk, stok, barcode, dan foto."],
    ["Produksi", "Mencatat batch produksi & modal produk buatan sendiri."],
    ["Data Transaksi", "Melihat dan mengelola seluruh transaksi penjualan."],
    ["Pengeluaran", "Mencatat biaya operasional toko."],
    ["Promo", "Membuat dan mengelola diskon/promo."],
  ],
  [2600, 6760],
));
children.push(spacer(60));
children.push(h3("Menu Kasir"));
children.push(defTable(
  ["Menu", "Fungsi"],
  [
    ["Dashboard", "Ringkasan penjualan pribadi kasir."],
    ["Transaksi", "Layar kasir untuk melayani penjualan."],
    ["Riwayat Transaksi", "Daftar transaksi yang pernah dibuat kasir."],
  ],
  [2600, 6760],
));

children.push(spacer(60));
children.push(h2("2.5  Keluar (Logout)"));
children.push(p("Untuk keluar dari aplikasi, klik nama/akun Anda di pojok atas, lalu pilih Keluar (Log out). Selalu lakukan ini bila Anda meninggalkan perangkat agar akun tetap aman."));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ============================================================
//  BAB 3 — ETALASE PRODUK
// ============================================================
children.push(h1("BAB 3  Halaman Etalase Produk"));
children.push(p("Etalase Produk adalah halaman depan SiKasir yang dapat dilihat oleh siapa saja, termasuk pelanggan, tanpa perlu masuk. Halaman ini berguna untuk memperlihatkan produk dan promo yang sedang berjalan."));
children.push(h2("3.1  Bagian Halaman Etalase"));
children.push(bullet([{ text: "Produk Terlaris — ", bold: true }, { text: "lima produk dengan penjualan terbanyak ditampilkan di bagian atas, lengkap dengan foto dan harga." }]));
children.push(bullet([{ text: "Label Promo — ", bold: true }, { text: "produk yang sedang diskon menampilkan label promo (misalnya “Diskon 10%” atau “Diskon Rp2.000”) beserta sisa hari berlakunya." }]));
children.push(bullet([{ text: "Daftar Semua Produk — ", bold: true }, { text: "seluruh produk ditampilkan terurut menurut nama. Produk yang sedang promo ditampilkan paling atas agar mudah ditemukan." }]));
children.push(bullet([{ text: "Tombol Masuk — ", bold: true }, { text: "mengarahkan ke halaman login bagi admin atau kasir." }]));
children.push(tip("Karena promo dan produk terlaris di sini diambil langsung dari data, halaman etalase selalu menampilkan informasi terbaru tanpa perlu diperbarui manual."));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ============================================================
//  BAB 4 — PANDUAN ADMIN
// ============================================================
children.push(h1("BAB 4  Panduan untuk Admin"));
children.push(p("Bab ini menjelaskan seluruh menu yang tersedia bagi pengguna dengan peran Admin. Hanya admin yang dapat mengakses menu-menu pada bab ini."));

// 4.1 Dashboard Admin
children.push(h2("4.1  Dashboard Admin"));
children.push(p("Dashboard Admin adalah pusat pemantauan bisnis. Halaman ini menampilkan ringkasan keuangan, grafik, daftar produk terlaris, kinerja kasir, hingga analisis laba & rugi otomatis untuk rentang tanggal yang Anda pilih."));
children.push(h3("Memilih Rentang Tanggal"));
children.push(p("Di bagian atas dashboard terdapat pemilih tanggal Dari dan Sampai. Semua angka di halaman akan dihitung ulang sesuai rentang yang dipilih. Bila tidak diubah, dashboard menampilkan data hari ini."));
children.push(h3("Kartu Ringkasan"));
children.push(p("Sederet kartu menampilkan angka-angka kunci:"));
children.push(defTable(
  ["Kartu", "Arti"],
  [
    ["Omzet (Total Pendapatan)", "Total uang masuk dari penjualan pada periode."],
    ["Total Transaksi", "Jumlah struk/transaksi yang terjadi."],
    ["Rata-rata per Transaksi", "Omzet dibagi jumlah transaksi."],
    ["Item Terjual", "Total banyaknya unit produk yang terjual."],
    ["HPP (Modal Terjual)", "Total modal dari produk yang terjual (Harga Pokok Penjualan)."],
    ["Laba Kotor", "Omzet dikurangi HPP."],
    ["Biaya Operasional", "Total pengeluaran operasional pada periode."],
    ["Laba Bersih", "Laba kotor dikurangi biaya operasional."],
    ["Margin Penjualan", "Persentase laba bersih terhadap omzet."],
  ],
  [3200, 6160],
));
children.push(spacer(60));
children.push(h3("Grafik & Peringkat"));
children.push(bullet([{ text: "Grafik Omzet Harian — ", bold: true }, { text: "perkembangan pendapatan dari hari ke hari." }]));
children.push(bullet([{ text: "Tren Jumlah Transaksi — ", bold: true }, { text: "banyaknya transaksi per hari." }]));
children.push(bullet([{ text: "Produk Terlaris & Kurang Laris — ", bold: true }, { text: "lima produk dengan penjualan terbanyak dan tersedikit." }]));
children.push(bullet([{ text: "Produk Paling Menguntungkan — ", bold: true }, { text: "lima produk penyumbang laba terbesar." }]));
children.push(bullet([{ text: "Jam & Tanggal Ramai — ", bold: true }, { text: "waktu dengan transaksi terbanyak." }]));
children.push(bullet([{ text: "Kinerja Kasir — ", bold: true }, { text: "peringkat kasir berdasarkan jumlah transaksi dan omzet." }]));
children.push(spacer(40));
children.push(h3("Analisis Laba & Rugi"));
children.push(p("Bagian ini membantu Anda memahami dari mana laba berasal dan di mana keuntungan “bocor”. Isinya:"));
children.push(bullet([{ text: "Grafik Air Terjun (Waterfall) — ", bold: true }, { text: "memperlihatkan alur uang: Omzet dikurangi HPP menjadi Laba Kotor, lalu dikurangi tiap kategori biaya operasional hingga menjadi Laba Bersih." }]));
children.push(bullet([{ text: "Perbandingan dengan Periode Sebelumnya — ", bold: true }, { text: "empat kartu (Omzet, Laba Kotor, Biaya Operasional, Laba Bersih) dibandingkan dengan periode setara tepat sebelumnya, lengkap dengan persentase naik/turun." }]));
children.push(bullet([{ text: "Peringatan “Rugi Semu” — ", bold: true }, { text: "muncul bila rentang yang dipilih pendek (kurang dari sebulan) namun memuat biaya yang biasanya dibayar bulanan seperti gaji, sewa, atau pajak. Ini mengingatkan agar Anda tidak salah menilai kerugian." }]));
children.push(bullet([{ text: "Kesimpulan Otomatis — ", bold: true }, { text: "kalimat ringkas yang menjelaskan apakah bisnis untung atau rugi, di titik mana kebocoran terjadi, dan apa yang berubah dibanding periode sebelumnya." }]));
children.push(tip("Untuk menilai kondisi bisnis secara adil, gunakan rentang minimal satu bulan penuh agar biaya bulanan (gaji, sewa, pajak) sebanding dengan omzet yang masuk."));

// 4.2 Data User
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(h2("4.2  Data User (Pengguna)"));
children.push(p("Menu ini digunakan untuk mengelola akun yang dapat masuk ke SiKasir. Di bagian atas terdapat ringkasan jumlah total pengguna, jumlah admin, dan jumlah kasir."));
children.push(h3("Menambah Pengguna"));
children.push(num("Klik tombol Tambah User."));
children.push(num([{ text: "Isi ", }, { text: "Nama", bold: true }, { text: ", " }, { text: "Email", bold: true }, { text: ", dan pilih " }, { text: "Peran", bold: true }, { text: " (Admin atau Kasir)." }]));
children.push(num([{ text: "Isi ", }, { text: "Kata Sandi", bold: true }, { text: " dan ulangi pada kolom konfirmasi." }]));
children.push(num("Klik Simpan."));
children.push(h3("Mengubah & Menghapus Pengguna"));
children.push(bullet([{ text: "Ubah: ", bold: true }, { text: "klik ikon edit pada baris pengguna, ubah data yang diperlukan, lalu simpan. Kosongkan kolom kata sandi bila tidak ingin menggantinya." }]));
children.push(bullet([{ text: "Hapus: ", bold: true }, { text: "klik ikon hapus, lalu konfirmasi." }]));
children.push(warn("Anda tidak dapat menghapus akun yang sedang Anda gunakan sendiri. Pastikan selalu ada minimal satu akun admin yang aktif."));

// 4.3 Kategori
children.push(spacer(60));
children.push(h2("4.3  Kategori"));
children.push(p("Kategori digunakan untuk mengelompokkan produk (misalnya Makanan, Minuman, Snack). Menu ini menampilkan jumlah produk pada setiap kategori."));
children.push(num("Klik Tambah Kategori, masukkan Nama Kategori, lalu simpan."));
children.push(num("Untuk mengubah nama, klik ikon edit pada baris kategori."));
children.push(num("Untuk menghapus, klik ikon hapus."));
children.push(note("Setiap produk wajib memiliki satu kategori. Sebaiknya buat kategori terlebih dahulu sebelum menambah produk. Hindari menghapus kategori yang masih dipakai produk."));

// 4.4 Data Produk
children.push(spacer(60));
children.push(h2("4.4  Data Produk"));
children.push(p("Menu Data Produk adalah tempat mengelola seluruh barang yang dijual. Bagian atas menampilkan total produk, total kategori, dan jumlah produk dengan stok bermasalah."));
children.push(h3("Jenis Produk"));
children.push(p("Setiap produk memiliki jenis yang menentukan cara modalnya dihitung:"));
children.push(defTable(
  ["Jenis", "Penjelasan"],
  [
    ["Beli", "Barang jadi yang dibeli dari pemasok/agen. Modal (harga modal) diisi manual sesuai harga beli."],
    ["Produksi", "Barang buatan sendiri. Modal TIDAK diisi manual, melainkan dihitung otomatis dari menu Produksi."],
  ],
  [1900, 7460],
));
children.push(spacer(60));
children.push(h3("Kolom Data Produk"));
children.push(defTable(
  ["Kolom", "Keterangan"],
  [
    ["Nama", "Nama produk (wajib)."],
    ["Kategori", "Kelompok produk (wajib)."],
    ["Jenis", "Beli atau Produksi."],
    ["Harga Jual", "Harga yang dibayar pelanggan (wajib)."],
    ["Harga Modal", "Modal per unit. Hanya diisi untuk jenis Beli; untuk Produksi diisi otomatis."],
    ["Stok", "Jumlah barang tersedia."],
    ["Barcode", "Kode batang produk (opsional, harus unik). Dipakai untuk pemindaian di kasir."],
    ["SKU", "Kode internal produk (opsional, harus unik)."],
    ["Foto", "Gambar produk (unggah berkas gambar)."],
  ],
  [2000, 7360],
));
children.push(spacer(60));
children.push(h3("Menambah / Mengubah Produk"));
children.push(num("Klik Tambah Produk."));
children.push(num("Pilih Kategori dan Jenis produk."));
children.push(num("Isi Nama, Harga Jual, dan Stok."));
children.push(num([{ text: "Untuk jenis ", }, { text: "Beli", bold: true }, { text: ", isi juga " }, { text: "Harga Modal", bold: true }, { text: ". Untuk jenis " }, { text: "Produksi", bold: true }, { text: ", lewati kolom modal." }]));
children.push(num("Isi Barcode dan SKU bila ada, lalu unggah Foto bila perlu."));
children.push(num("Klik Simpan."));
children.push(h3("Status Stok"));
children.push(p("Sistem menandai kondisi stok secara otomatis:"));
children.push(defTable(
  ["Status", "Kondisi"],
  [
    ["Tersedia (in-stock)", "Stok lebih dari 5 unit."],
    ["Menipis (low-stock)", "Stok 1 sampai 5 unit."],
    ["Habis (out-of-stock)", "Stok 0 unit."],
  ],
  [2600, 6760],
));
children.push(spacer(60));
children.push(h3("Cetak Barcode"));
children.push(p("Untuk produk yang memiliki barcode, Anda dapat mencetak label barcode (format CODE128) langsung dari halaman produk untuk ditempel pada kemasan. Barcode inilah yang nantinya dipindai di halaman Kasir untuk mempercepat transaksi."));
children.push(note("Modal produk jenis Produksi selalu dimulai dari 0 dan baru terisi setelah Anda mencatat batch produksi pertamanya di menu Produksi (lihat sub-bab 4.5)."));

// 4.5 Produksi
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(h2("4.5  Produksi (Perhitungan Modal Produk Buatan Sendiri)"));
children.push(p("Menu Produksi dipakai untuk mencatat pembuatan produk berjenis Produksi. Saat Anda mencatat satu batch produksi, sistem akan: (1) menjumlahkan seluruh biaya bahan/proses, (2) menghitung modal per unit, (3) menambah stok produk, dan (4) memperbarui harga modal produk."));
children.push(h3("Rumus Modal per Unit"));
children.push(rich([
  { text: "Modal per Unit = Total Biaya Bahan ÷ Jumlah Hasil", bold: true, color: BRAND_DARK },
]));
children.push(p("Contoh: bila membuat 50 buah donat dengan total biaya bahan Rp150.000, maka modal per unit = Rp150.000 ÷ 50 = Rp3.000 per donat."));
children.push(h3("Mencatat Batch Produksi"));
children.push(num([{ text: "Klik ", }, { text: "Tambah Produksi", bold: true }, { text: "." }]));
children.push(num("Pilih Produk (hanya produk berjenis Produksi yang muncul)."));
children.push(num("Isi Jumlah hasil produksi (banyaknya unit yang dihasilkan)."));
children.push(num([{ text: "Tambahkan rincian biaya satu per satu (", }, { text: "Nama biaya", bold: true }, { text: " dan " }, { text: "Nominal", bold: true }, { text: "), misalnya “Tepung”, “Gula”, “Kemasan”, “Gas”." }]));
children.push(num("Isi Catatan bila perlu, lalu klik Simpan."));
children.push(p("Bagian atas menu menampilkan total batch, total unit yang diproduksi, dan total biaya produksi."));
children.push(warn("Menghapus sebuah batch produksi akan mengurangi kembali stok produk sebanyak jumlah batch tersebut. Lakukan dengan hati-hati agar stok tetap akurat."));
children.push(tip("Catat SEMUA biaya bahan dan kemasan produk buatan sendiri di menu Produksi ini, BUKAN di menu Pengeluaran. Hal ini mencegah biaya terhitung dua kali pada laporan laba/rugi."));

// 4.6 Data Transaksi
children.push(spacer(60));
children.push(h2("4.6  Data Transaksi"));
children.push(p("Menu ini menampilkan seluruh transaksi penjualan dari semua kasir. Anda dapat menyaring berdasarkan rentang tanggal dan melihat ringkasan total penjualan, jumlah transaksi, serta rata-rata nilai transaksi."));
children.push(h3("Melihat Detail"));
children.push(p("Klik sebuah transaksi untuk melihat rincian: kasir yang melayani, daftar produk beserta jumlah dan harga, metode pembayaran, jumlah bayar, dan kembalian."));
children.push(h3("Menambah, Mengubah, dan Menghapus Transaksi"));
children.push(bullet([{ text: "Tambah: ", bold: true }, { text: "admin dapat membuat transaksi atas nama kasir tertentu, memilih produk, jumlah, metode pembayaran, dan jumlah bayar." }]));
children.push(bullet([{ text: "Ubah: ", bold: true }, { text: "mengubah transaksi akan mengembalikan stok lama lalu menerapkan ulang stok sesuai data baru, sehingga stok tetap konsisten." }]));
children.push(bullet([{ text: "Hapus: ", bold: true }, { text: "menghapus transaksi akan mengembalikan stok produk yang ada di dalamnya." }]));
children.push(note("Saat membuat transaksi, jumlah bayar tidak boleh kurang dari total harga, dan stok produk harus mencukupi. Bila tidak, sistem akan menolak dan menampilkan pesan."));

// 4.7 Pengeluaran
children.push(spacer(60));
children.push(h2("4.7  Pengeluaran"));
children.push(p("Menu Pengeluaran mencatat biaya-biaya toko di luar modal produk. Data ini dipakai dashboard untuk menghitung laba bersih. Anda dapat menyaring pengeluaran berdasarkan rentang tanggal."));
children.push(h3("Mencatat Pengeluaran"));
children.push(num([{ text: "Klik ", }, { text: "Tambah Pengeluaran", bold: true }, { text: "." }]));
children.push(num("Pilih Tipe pengeluaran, isi Judul, Nominal, dan Keterangan (opsional)."));
children.push(num("Klik Simpan."));
children.push(h3("Tipe Pengeluaran"));
children.push(defTable(
  ["Tipe", "Contoh / Keterangan"],
  [
    ["Bahan Baku", "Bahan untuk produksi (lihat catatan penting di bawah)."],
    ["Kemasan", "Kemasan produk (lihat catatan penting di bawah)."],
    ["Operasional", "Biaya operasional umum."],
    ["Transportasi", "Ongkos kirim, bensin, transportasi."],
    ["Gaji", "Upah/gaji karyawan."],
    ["Peralatan", "Pembelian atau perawatan alat."],
    ["Sewa", "Sewa tempat/toko."],
    ["Listrik & Air", "Tagihan utilitas."],
    ["Promosi", "Biaya iklan dan pemasaran."],
    ["Pajak", "Pajak dan retribusi."],
    ["Lainnya", "Pengeluaran lain di luar kategori di atas."],
  ],
  [2400, 6960],
));
children.push(spacer(60));
children.push(warn("Biaya bahan baku dan kemasan untuk produk buatan sendiri sebaiknya dicatat di menu PRODUKSI, bukan di sini. Pengeluaran bertipe Bahan Baku dan Kemasan sengaja TIDAK dihitung sebagai biaya operasional di dashboard agar tidak terhitung dua kali (karena sudah masuk lewat batch produksi)."));

// 4.8 Promo
children.push(spacer(60));
children.push(h2("4.8  Promo"));
children.push(p("Menu Promo digunakan untuk membuat diskon. Bagian atas menampilkan jumlah promo total, yang aktif, dan yang non-aktif."));
children.push(h3("Jenis & Cakupan Promo"));
children.push(defTable(
  ["Pengaturan", "Pilihan & Arti"],
  [
    ["Tipe diskon", "Persen (mis. 10% dari harga) atau Nominal (potongan rupiah tetap)."],
    ["Produk", "Pilih satu produk untuk promo khusus produk, atau kosongkan (Semua Produk) untuk diskon keseluruhan belanja."],
    ["Minimal Belanja", "Khusus promo Semua Produk: diskon hanya berlaku bila total belanja mencapai batas ini."],
    ["Periode", "Tanggal Mulai dan Tanggal Selesai berlakunya promo."],
    ["Aktif", "Saklar untuk menyalakan/mematikan promo tanpa menghapusnya."],
  ],
  [2600, 6760],
));
children.push(spacer(60));
children.push(h3("Membuat Promo"));
children.push(num([{ text: "Klik ", }, { text: "Tambah Promo", bold: true }, { text: "." }]));
children.push(num("Isi Nama dan Deskripsi promo."));
children.push(num("Pilih Tipe (Persen/Nominal) dan isi Nilai diskon."));
children.push(num("Pilih satu Produk untuk promo per-produk, atau biarkan kosong untuk promo semua produk."));
children.push(num("Isi Minimal Belanja bila diperlukan (untuk promo semua produk)."));
children.push(num("Tentukan Tanggal Mulai dan Tanggal Selesai."));
children.push(num("Aktifkan promo, lalu klik Simpan."));
children.push(note("Promo per-produk otomatis muncul sebagai label di Etalase dan diterapkan di Kasir saat produk tersebut dibeli. Promo Semua Produk diterapkan oleh kasir pada keseluruhan transaksi (jika syarat minimal belanja terpenuhi)."));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ============================================================
//  BAB 5 — PANDUAN KASIR
// ============================================================
children.push(h1("BAB 5  Panduan untuk Kasir"));
children.push(p("Bab ini ditujukan untuk pengguna dengan peran Kasir. Kasir berfokus pada melayani transaksi penjualan dan melihat riwayatnya sendiri."));

children.push(h2("5.1  Dashboard Kasir"));
children.push(p("Setelah masuk, kasir melihat Dashboard yang menampilkan ringkasan penjualan pribadi:"));
children.push(bullet([{ text: "Penjualan Hari Ini — ", bold: true }, { text: "total pendapatan dan jumlah transaksi yang Anda layani hari ini." }]));
children.push(bullet([{ text: "Penjualan per Rentang Tanggal — ", bold: true }, { text: "total pendapatan dan transaksi untuk rentang tanggal yang dipilih (atau “Semua Waktu”)." }]));
children.push(bullet([{ text: "Transaksi Terbaru — ", bold: true }, { text: "lima transaksi terakhir Anda beserta waktu, jumlah item, dan total." }]));

children.push(spacer(60));
children.push(h2("5.2  Melayani Transaksi (Layar Kasir)"));
children.push(p("Menu Transaksi adalah layar utama kasir untuk melayani penjualan. Layar terbagi dua: daftar produk di sisi kiri dan Keranjang Belanja di sisi kanan."));
children.push(h3("Menambahkan Produk ke Keranjang"));
children.push(p("Ada dua cara memasukkan produk ke keranjang:"));
children.push(bullet([{ text: "Pindai barcode — ", bold: true }, { text: "arahkan alat pemindai ke barcode produk. Produk langsung masuk ke keranjang. Status pemindai (terdeteksi/tidak) ditampilkan di layar." }]));
children.push(bullet([{ text: "Cari & klik — ", bold: true }, { text: "ketik nama produk pada kolom “Cari produk…”, lalu klik produk yang diinginkan untuk menambahkannya." }]));
children.push(h3("Mengatur Keranjang"));
children.push(bullet("Ubah jumlah (qty) tiap produk di keranjang sesuai pembelian pelanggan."));
children.push(bullet("Hapus produk dari keranjang bila keliru."));
children.push(bullet("Sistem menghitung subtotal, diskon promo (otomatis), dan total yang harus dibayar."));
children.push(h3("Menyelesaikan Pembayaran"));
children.push(num("Pastikan isi keranjang sudah benar."));
children.push(num([{ text: "Pilih ", }, { text: "Metode Pembayaran", bold: true }, { text: ": Tunai (cash), QRIS, atau Transfer." }]));
children.push(num([{ text: "Masukkan ", }, { text: "Jumlah Bayar", bold: true }, { text: " dari pelanggan. Sistem menghitung " }, { text: "Kembalian", bold: true }, { text: " secara otomatis." }]));
children.push(num("Klik tombol Simpan/Bayar untuk menyelesaikan transaksi."));
children.push(p("Setelah tersimpan, stok produk otomatis berkurang dan Anda diarahkan ke halaman Riwayat Transaksi."));
children.push(warn("Transaksi akan ditolak bila: jumlah bayar kurang dari total harga, atau stok produk tidak mencukupi. Periksa kembali keranjang bila muncul pesan kesalahan."));
children.push(tip("Untuk transaksi cepat, gunakan alat pemindai barcode. Setiap kali barcode terbaca, produk langsung masuk ke keranjang tanpa perlu mengetik."));

children.push(spacer(60));
children.push(h2("5.3  Riwayat Transaksi"));
children.push(p("Menu Riwayat Transaksi menampilkan seluruh transaksi yang pernah Anda buat. Anda dapat:"));
children.push(bullet("Menyaring transaksi berdasarkan rentang tanggal."));
children.push(bullet("Melihat ringkasan total penjualan dan jumlah transaksi."));
children.push(bullet("Membuka detail setiap transaksi: daftar produk, jumlah, harga, metode pembayaran, bayar, dan kembalian."));
children.push(note("Kasir hanya melihat transaksi miliknya sendiri. Untuk melihat transaksi seluruh kasir, gunakan akun admin melalui menu Data Transaksi."));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ============================================================
//  BAB 6 — PENGATURAN AKUN
// ============================================================
children.push(h1("BAB 6  Pengaturan Akun"));
children.push(p("Setiap pengguna (admin maupun kasir) dapat mengatur akunnya sendiri melalui menu Pengaturan yang dapat dibuka dari menu akun di pojok atas."));
children.push(h2("6.1  Profil"));
children.push(p("Pada halaman Profil, Anda dapat mengubah Nama dan Email akun. Klik Simpan setelah selesai. Bila email diubah, ikuti instruksi verifikasi bila diminta."));
children.push(h2("6.2  Keamanan (Ganti Kata Sandi)"));
children.push(num("Buka Pengaturan, lalu pilih Keamanan."));
children.push(num("Masukkan Kata Sandi Saat Ini."));
children.push(num("Masukkan Kata Sandi Baru dan ulangi pada kolom konfirmasi."));
children.push(num("Klik Simpan."));
children.push(tip("Gunakan kata sandi yang kuat (kombinasi huruf besar-kecil, angka, dan simbol) serta gantilah secara berkala untuk menjaga keamanan akun."));
children.push(h2("6.3  Tampilan (Appearance)"));
children.push(p("Pada halaman Tampilan, Anda dapat memilih mode tampilan aplikasi: Terang (Light), Gelap (Dark), atau mengikuti pengaturan Sistem perangkat Anda. Pilihan ini hanya memengaruhi tampilan dan tidak mengubah data."));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ============================================================
//  BAB 7 — KONSEP PENTING KEUANGAN
// ============================================================
children.push(h1("BAB 7  Konsep Penting Keuangan"));
children.push(p("Agar laporan laba/rugi akurat, penting memahami beberapa konsep berikut tentang cara SiKasir menghitung modal dan keuntungan."));

children.push(h2("7.1  Dua Jenis Produk"));
children.push(p("Modal sebuah produk dihitung berbeda tergantung jenisnya:"));
children.push(bullet([{ text: "Beli — ", bold: true }, { text: "barang jadi dari pemasok. Modal = harga beli yang Anda isi manual." }]));
children.push(bullet([{ text: "Produksi — ", bold: true }, { text: "buatan sendiri. Modal dihitung otomatis dari batch produksi (lihat sub-bab 4.5)." }]));

children.push(h2("7.2  Snapshot Modal (Modal Tersimpan saat Penjualan)"));
children.push(p("Saat sebuah produk terjual, SiKasir menyimpan (snapshot) nilai modal produk pada saat itu ke dalam catatan transaksi. Artinya, jika Anda mengubah modal produk di kemudian hari, laba dari transaksi lama TIDAK ikut berubah. Ini menjaga keakuratan laporan historis."));

children.push(h2("7.3  Batch Costing (Perhitungan Biaya per Batch)"));
children.push(p("Untuk produk buatan sendiri, modal dihitung per batch produksi dengan rumus total biaya dibagi jumlah hasil. Setiap kali Anda mencatat batch baru, stok bertambah dan harga modal produk diperbarui mengikuti batch terbaru."));

children.push(h2("7.4  Aturan Anti Penghitungan Ganda"));
children.push(p("Karena biaya bahan produk buatan sendiri sudah dihitung lewat menu Produksi, maka pengeluaran bertipe Bahan Baku dan Kemasan dikecualikan dari biaya operasional di dashboard. Tujuannya agar satu biaya tidak terhitung dua kali."));
children.push(warn("Aturan praktis: catat biaya bahan & kemasan produk buatan sendiri HANYA di menu Produksi. Gunakan menu Pengeluaran untuk biaya operasional lain (gaji, sewa, listrik, transportasi, dan sebagainya)."));

children.push(h2("7.5  Rumus Laba"));
children.push(p("SiKasir menghitung laba dengan alur berikut:"));
children.push(rich([{ text: "Laba Kotor = Omzet − HPP", bold: true, color: BRAND_DARK }]));
children.push(p("HPP (Harga Pokok Penjualan) adalah total modal dari semua produk yang terjual.", { italics: true, color: GREY }));
children.push(rich([{ text: "Laba Bersih = Laba Kotor − Biaya Operasional", bold: true, color: BRAND_DARK }]));
children.push(p("Biaya Operasional adalah total pengeluaran (di luar bahan baku & kemasan) pada periode tersebut.", { italics: true, color: GREY }));
children.push(rich([{ text: "Margin Penjualan = (Laba Bersih ÷ Omzet) × 100%", bold: true, color: BRAND_DARK }]));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ============================================================
//  BAB 8 — FAQ & PEMECAHAN MASALAH
// ============================================================
children.push(h1("BAB 8  Tanya Jawab & Pemecahan Masalah"));
children.push(defTable(
  ["Pertanyaan / Masalah", "Solusi"],
  [
    ["Tidak bisa masuk (login).", "Pastikan email & kata sandi benar dan Caps Lock mati. Bila lupa, gunakan Lupa kata sandi atau minta admin menyetel ulang."],
    ["Setelah login langsung ke halaman yang salah.", "Itu normal: sistem mengarahkan sesuai peran. Admin ke Dashboard Admin, kasir ke Dashboard Kasir."],
    ["Pemindai barcode tidak berfungsi.", "Pastikan alat pemindai terhubung (status pemindai tampil di layar Kasir). Anda tetap bisa mencari produk secara manual."],
    ["Transaksi ditolak saat menyimpan.", "Periksa: jumlah bayar harus >= total, dan stok produk harus mencukupi."],
    ["Stok produk tidak sesuai.", "Cek apakah ada transaksi yang diubah/dihapus atau batch produksi yang dihapus. Keduanya menyesuaikan stok otomatis."],
    ["Modal produk Produksi nol (0).", "Modal baru terisi setelah batch produksi pertama dicatat di menu Produksi."],
    ["Dashboard menunjukkan rugi padahal ramai.", "Periksa peringatan “Rugi Semu”. Gunakan rentang minimal satu bulan agar biaya bulanan sebanding dengan omzet."],
    ["Laba terlihat lebih kecil dari perkiraan.", "Pastikan biaya bahan dicatat di Produksi (bukan ganda di Pengeluaran) dan harga modal produk Beli sudah benar."],
    ["Promo tidak muncul.", "Pastikan promo Aktif dan tanggal hari ini berada di antara Tanggal Mulai dan Tanggal Selesai."],
    ["Tidak menerima email reset kata sandi.", "Hubungi admin untuk menyetel ulang kata sandi melalui menu Data User."],
  ],
  [3400, 5960],
));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ============================================================
//  LAMPIRAN — GLOSARIUM
// ============================================================
children.push(h1("Lampiran  Daftar Istilah"));
children.push(defTable(
  ["Istilah", "Arti"],
  [
    ["POS", "Point of Sale, sistem kasir untuk mencatat penjualan."],
    ["Admin", "Pengguna dengan akses penuh ke seluruh menu pengelolaan."],
    ["Kasir", "Pengguna yang melayani transaksi penjualan."],
    ["Omzet", "Total pendapatan kotor dari penjualan."],
    ["HPP", "Harga Pokok Penjualan; total modal produk yang terjual."],
    ["Laba Kotor", "Omzet dikurangi HPP."],
    ["Laba Bersih", "Laba kotor dikurangi biaya operasional."],
    ["Margin", "Persentase laba bersih terhadap omzet."],
    ["Modal / Harga Modal", "Biaya pokok satu unit produk."],
    ["Batch Produksi", "Satu kali proses pembuatan sejumlah produk buatan sendiri."],
    ["Snapshot Modal", "Modal yang disimpan pada saat penjualan agar laba historis tetap."],
    ["Barcode", "Kode batang produk yang dapat dipindai."],
    ["SKU", "Stock Keeping Unit; kode internal unik produk."],
    ["Promo", "Potongan harga/diskon untuk produk atau keseluruhan belanja."],
    ["Stok", "Jumlah barang yang tersedia untuk dijual."],
  ],
  [2600, 6760],
));
children.push(spacer(120));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 240 },
  children: [new TextRun({ text: "— Akhir Buku Panduan —", italics: true, color: GREY })],
}));

// ============================================================
//  DOKUMEN
// ============================================================
const doc = new Document({
  creator: "SiKasir",
  title: "Buku Panduan Penggunaan SiKasir",
  description: "Manual Book SiKasir",
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: "1F2937" } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 34, bold: true, font: "Arial", color: BRAND },
        paragraph: { spacing: { before: 320, after: 200 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BRAND, space: 6 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 27, bold: true, font: "Arial", color: BRAND_DARK },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 23, bold: true, font: "Arial", color: "374151" },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 620, hanging: 280 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 280 } } } },
        ] },
      { reference: "steps",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 620, hanging: 320 } } } },
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
          spacing: { after: 0 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "D1D5DB", space: 4 } },
          tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
          children: [
            new TextRun({ text: "SiKasir", bold: true, color: BRAND, size: 18 }),
            new TextRun({ text: "\tBuku Panduan Penggunaan", color: GREY, size: 18 }),
          ],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: "D1D5DB", space: 4 } },
          children: [
            new TextRun({ text: "Halaman ", color: GREY, size: 18 }),
            new TextRun({ children: [PageNumber.CURRENT], color: GREY, size: 18 }),
            new TextRun({ text: " dari ", color: GREY, size: 18 }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], color: GREY, size: 18 }),
          ],
        })],
      }),
    },
    children,
  }],
});

const outPath = "C:/laragon/www/SiKasir/Manual-Book-SiKasir.docx";
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log("OK -> " + outPath + " (" + buffer.length + " bytes)");
}).catch((e) => { console.error(e); process.exit(1); });
