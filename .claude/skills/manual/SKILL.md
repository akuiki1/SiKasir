---
name: manual
description: Bangun & sempurnakan buku panduan cetak SiKasir (Panduan-SiKasir-v3.docx) dari master markdown v3. Pakai saat user mengetik /manual, atau minta mengerjakan/merapikan/menambah gambar/cek akurasi manual book. Argumen opsional = nama section (mis. "/manual kasir", "/manual 1.4", "/manual promo"); "build" = rebuild docx saja; "status" = lapor progres; kosong = lapor status + kerjakan section berikutnya yang belum beres.
---

# Skill: Manual Book SiKasir (v3)

Tujuanmu: membawa buku panduan ke kondisi **perfect**, satu section per pemanggilan, **tanpa** user perlu menulis prompt detail. Hemat token: hanya muat file yang relevan untuk section yang dikerjakan.

## Sumber kebenaran & output (JANGAN diubah)
- **Master konten (SATU sumber)** = `docs/Panduan-SiKasir-v3-Draft.md`. Semua perubahan teks di sini.
- **Output cetak** = `docs/manual/Panduan-SiKasir-v3.docx` via **`node docs/manual/build-v3.cjs`** (renderer gaya-v2: badge ikut karena tertanam di PNG). Jangan edit .docx langsung.
- **Gambar** dirujuk dari markdown `![alt](/docs/manual/img/..)` atau `img-detail/`. Badge nomor = dibakar ke PNG saat capture, bukan di Word.
- **Progres** dilacak di `docs/manual/_v3-status.md` — baca di awal, update di akhir.
- Konteks lengkap (struktur, helper, capture, gotcha) ada di memori **project-manual-book.md** — sudah dimuat; jangan gali ulang repo.

## Definisi "PERFECT" (acceptance per section — self-check, jangan bebankan ke user)
1. **Akurat ke kode**: SETIAP langkah, nama tombol/menu, dan klaim perilaku diverifikasi ke source code nyata (lihat peta di bawah). Kalau v3.md salah → perbaiki v3.md. Jangan percaya ingatan/draft.
2. **Istilah persis UI**: tombol & label ditulis sama persis seperti yang tampil di layar (cek di .vue).
3. **Bergambar + badge**: tiap layar penting punya screenshot ber-badge + caption gaya "① … · ② …". Kalau gambar belum ada/masih polos → capture ulang ber-badge (lihat alur capture di memori) lalu rujuk di v3.md.
4. **Tak ada konten basi**: cek fitur yang berubah (mis. Promo = Nominal/Bundling, BUKAN Persentase; produk Buatan Sendiri = kolom Stok & Modal hilang).
5. **Build bersih**: `node build-v3.cjs` sukses, gambar tertanam, tak ada placeholder "[gambar belum tersedia]".
6. **Gaya konsisten**: heading, langkah bernomor, callout (⚠️ warn / 📝 note / 💡 tip), caption — seragam.

## Alur tiap pemanggilan (1 section)
1. Baca `_v3-status.md`. Tentukan section target (dari argumen; bila kosong, ambil yang paling atas belum ✅).
2. Baca section itu di `v3.md` + **file source code terkait** (peta di bawah). Verifikasi tiap klaim.
3. Perbaiki teks v3.md bila ada yang tak cocok dengan kode.
4. Lengkapi screenshot ber-badge bila kurang (capture → simpan ke `img/` → rujuk di v3.md). Server: `php artisan serve --host=127.0.0.1 --port=8000` (run_in_background, MySQL ON); login admin@gmail.com/admin123; Chrome sistem; light mode dipaksa.
5. `node docs/manual/build-v3.cjs` → rebuild. Verifikasi via `unzip -p ...v3.docx word/document.xml | sed 's/<[^>]*>//g' | grep ...`.
6. Update `_v3-status.md` (centang akurasi/gambar). Lapor SINGKAT: section apa, apa yang diperbaiki, hasil cek akurasi, sisa berikutnya.

Kerjakan **satu section saja per giliran** kecuali user minta lebih. Jangan tanya hal yang bisa diputuskan dari kode/standar ini — putuskan, kerjakan, lapor singkat.

## Peta section → source code (untuk verifikasi akurasi)
- **Kasir — Transaksi/POS, Satuan, Curah, Jasa**: `resources/js/pages/kasir/Transaksi.vue`, `app/Http/Controllers/KasirController.php` (curah=input Rp→qty=nominal÷harga; jasa: fee=omzet, nominal=titipan pass-through).
- **Kasir — Pesanan online & simpan pesanan**: `kasir/Pesanan*.vue`, `PesananController.php`, `PesananPublikController.php`, `app/Services/PesananService.php`.
- **Kasir — Riwayat & tutup laci**: `kasir/Riwayat.vue`, `KasirController@riwayat`.
- **Admin — Tambah Produk** (bercabang Beli Jadi/Buatan Sendiri/Jasa): `admin/Products.vue` (Stok & Harga Modal `v-if jenis==='beli'`; jasa→Tarif Fee), `ProdukController.php`.
- **Admin — Stok / Produksi**: `admin/Stok.vue`, `admin/Produksi.vue`, `StokController.php`, `ProduksiController.php`.
- **Admin — Pengeluaran**: `admin/Pengeluarans.vue`, `PengeluaranController.php` (tipe bahan_baku/kemasan dikunci).
- **Admin — Pelanggan/Reseller**: `admin/Pelanggan.vue`, `PelangganController.php`.
- **Admin — User**: `admin/Users.vue`, `app/Http/Controllers/Admin/UserController.php`.
- **Admin — Promo**: `admin/Promos.vue` (tipe = Nominal (Rp) / Bundling (beli X gratis Y); Persentase hanya promo lama, disabled), `PromoController.php`.
- **Admin — Laporan**: `admin/laporan/*.vue`, `app/Http/Controllers/Admin/LaporanController.php` + `app/Services/Laporan*Service.php`.
- **Toko Online (Pembeli)**: `resources/js/pages/Welcome.vue`, `PesananPublikController.php`.
- **Lampiran — Pengaturan akun**: `resources/js/pages/settings/*.vue` (halaman settings berbahasa Inggris; jelaskan padanannya).

## Catatan
- Folder `docs/manual/` di-GITIGNORE; `v3.md` (di `docs/`) dilacak git. PDF: Word COM (`ExportAsFixedFormat ...,17`) bila diminta.
- Jangan reintroduksi dual-source: build-manual.cjs (v2, Admin saja) = legacy; pakai v3.md + build-v3.cjs.
