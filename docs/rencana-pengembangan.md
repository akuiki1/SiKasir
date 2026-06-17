# Rencana Pengembangan SiKasir — Hasil Briefing Klien 17 Jun 2026

Dokumen ini menerjemahkan hasil briefing dengan klien (Cemilan Mba Tutut) menjadi
rencana teknis bertahap. **Belum ada kode yang ditulis** — ini peta jalan untuk
disepakati dulu sebelum eksekusi.

---

## 1. Akar masalah & prinsip desain

Semua kebutuhan baru sebelumnya dipaksa masuk ke **satu model `Produk` dengan satu
cara jual**: per biji, `stok` integer, di-scan barcode, omzet = harga × jumlah.
Model ini pecah begitu ketemu bensin, bawang timbang, dan jasa transfer.

**Prinsip:** pisahkan **cara jual** menjadi 3 model. Sisanya (modal, kartu stok,
slow-mover, reseller) adalah fitur lintas-model di atasnya.

Pisahkan dua konsep yang sekarang menempel:
- `jenis` (sudah ada: `beli` / `produksi`) = **sumber modal/HPP**.
- `tipe_jual` (BARU: `satuan` / `curah` / `jasa`) = **cara jual**. Tegak lurus,
  jangan dicampur.

| Model | Contoh | Kunci | Stok | Yang dicatat sebagai omzet |
|---|---|---|---|---|
| `satuan` | cemilan, kue, frozen, permen | hitung per biji | integer (desimal aman) | harga × jumlah |
| `curah` | bensin (/liter), bawang (/kg) | qty **desimal**, bisa input **rupiah** | desimal | harga/satuan × qty |
| `jasa` | tarik tunai, transfer | **tanpa stok**, fee = pendapatan | — | **hanya fee**, nominal pass-through |

---

## 2. Fase pengembangan (urut berdasarkan ketergantungan)

### Fase 0 — Fondasi: pemisahan model jual + kartu stok ✅ SELESAI (17 Jun 2026)
Semua fase lain berdiri di atas ini.

> **Status:** terimplementasi & teruji (100+5 test hijau, migrasi terpasang di DB dev).
> - Migrasi: `2026_06_17_100001` (tipe_jual+satuan), `100002` (stok & jumlah → decimal(12,3)), `100003` (tabel `stok_mutasis`).
> - Model: `StokMutasi` baru; `Produk` punya `terapkanMutasiStok()` & `catatMutasiStok()`; cast `stok`/`jumlah` → float.
> - Kartu stok dicatat di SEMUA titik: penjualan kasir (`KasirController`), transaksi admin (`TransaksiController` create/update/delete), batch produksi (`ProduksiController` store/destroy), buat/edit produk (`ProdukController`).
> - Test baru: `tests/Feature/StokMutasiTest.php`.
> - ⏳ UI admin untuk memilih `tipe_jual`/`satuan` menyusul di Fase 1 (backend sudah menerima & default `satuan`/`pcs`).

**Migrasi:**
- `produks`: tambah `tipe_jual` enum(`satuan`,`curah`,`jasa`) default `satuan`;
  tambah `satuan` string default `pcs` (mis. `pcs`, `liter`, `kg`, `gram`, `bungkus`).
- `produks.stok`: `integer` → `decimal(12,3)` (data lama aman, ikut terkonversi).
- `detail_transaksis.jumlah`: `integer` → `decimal(12,3)`.
- Buat tabel **`stok_mutasi`** (kartu stok):
  `id, id_produk, tipe (masuk|keluar|penyesuaian|produksi|jual|retur),
  jumlah (decimal, signed), stok_sebelum, stok_sesudah, keterangan,
  id_user, id_referensi (nullable), ref_tipe (nullable), timestamps`.

**Model / logika:**
- `Produk`: update `$casts` (`stok` => `decimal:3`), tambah scope per `tipe_jual`.
- `StokMutasi` model + relasi `produk()`.
- **Sisipkan pencatatan mutasi** di SEMUA titik perubahan stok yang sudah ada:
  penjualan kasir, batch produksi, dan edit stok manual di admin. Idealnya lewat
  satu helper `Produk::ubahStok($delta, $tipe, $ref, $keterangan)` agar konsisten.

**Hasil:** update stok tercatat (kebutuhan klien #2) + fondasi data untuk
slow-mover & curah.

---

### Fase 1 — Produk curah (bensin & bawang) — kebutuhan #5 ✅ SELESAI (17 Jun 2026)
Bergantung pada desimal di Fase 0.

> **Status:** terimplementasi & teruji (build sukses, 109 test/106 hijau, lint bersih).
> - Form produk admin ([Products.vue](resources/js/pages/admin/Products.vue)): pilih `tipe_jual` (satuan/curah/jasa) + `satuan`; label harga & stok menyesuaikan; jasa menyembunyikan stok; badge tipe di tabel.
> - Halaman kasir ([Transaksi.vue](resources/js/pages/kasir/Transaksi.vue)): produk curah → kartu keranjang menampilkan input **Rp nominal**; qty = nominal ÷ harga/satuan (3 desimal) ditampilkan "≈ x satuan"; subtotal = nominal persis; peringatan bila melebihi stok; submit dikunci sampai nominal valid.
> - `KasirController::store` bercabang per `tipe_jual` (curah pakai `items.*.nominal`); produk `jasa` dikecualikan dari grid kasir (alur sendiri di Fase 2).
> - Test: `tests/Feature/CurahTest.php`.

- `harga_jual` untuk `curah` dimaknai **per satuan** (per liter / per kg).
  Bensin: `harga_modal`/liter + margin Rp1.000 → `harga_jual`/liter.
- UI kasir untuk item `curah`: **utamakan input by-rupiah** (keputusan klien 17 Jun).
  - by-rupiah ("isi 20rb"): kasir ketik nominal → `qty = nominal ÷ harga_jual`, dibulatkan 3 desimal. **subtotal = nominal persis** (qty disimpan sbg catatan).
  - input by-qty boleh ada sebagai opsi sekunder, tapi rupiah yang ditonjolkan.
- Tampilan menunjukkan qty + satuan (mis. `1.429 liter`).
- `modal` per baris = `qty × harga_modal/satuan` (snapshot, sama seperti sekarang).

**Hasil:** bensin & bawang bisa dijual sesuai kebiasaan pelanggan (beli per rupiah).

---

### Fase 2 — Jasa: transfer & tarik tunai — kebutuhan #7 (paling rawan laporan) ✅ SELESAI (17 Jun 2026)

> **Status:** terimplementasi & teruji (114 test/111 hijau, build sukses, lint bersih). Keputusan klien: **fee diketik manual** tiap transaksi (tanpa default/tiering).
> - Migrasi `2026_06_17_100004`: `detail_transaksis.nominal` (nullable) = pass-through; `subtotal` baris jasa = fee.
> - `KasirController::store` cabang jasa: TANPA stok/kartu stok, `modal=0`, `subtotal=fee`, simpan `nominal`. Validasi `items.*.fee` + `items.*.nominal` (dua-duanya wajib >0 untuk jasa).
> - `transaksi()` mengirim prop `layanan` (daftar produk jasa) terpisah dari grid; `riwayat()` mengirim `nominal`.
> - ⚠️ Omzet otomatis benar karena `total_harga = Σ subtotal` (= fee), `nominal` tak pernah masuk omzet. COGS jasa = 0.
> - Test: `tests/Feature/JasaTest.php`.
>
> **Revisi (17 Jun, feedback klien): jasa dipindah ke halaman kasir tersendiri.**
> Halaman Transaksi kini **produk-only** (curah/satuan). Jasa pindah ke `resources/js/pages/kasir/Layanan.vue` (route `kasir.layanan` GET → `KasirController::layanan()`, nav kasir "Layanan / Jasa"). Halaman Layanan punya keranjang jasa sendiri (input Nominal + Fee per baris) tapi tetap POST ke endpoint sama `kasir.transaksi.store` (backend store tetap mendukung item jasa). Semua logika jasa dihapus dari `Transaksi.vue`.
- Produk ber-`tipe_jual=jasa`: **tanpa stok, tanpa HPP normal**.
- `detail_transaksis`: tambah kolom `nominal` (nullable) = uang pokok yang
  ditransfer/ditarik (**pass-through, BUKAN omzet**). `subtotal` baris = **fee**.
- **Jebakan akunting (wajib benar):** pelanggan transfer Rp500.000 + fee Rp5.000.
  Uang masuk laci Rp505.000, tapi Rp500.000 keluar lagi (saldo agen berkurang).
  **Omzet toko = Rp5.000 saja.** `nominal` HANYA referensi.
- Penyesuaian laporan (lihat §3): dashboard & analisis laba HARUS menghitung omzet
  jasa = fee, mengecualikan `nominal`.
- Fee MVP: input manual. Lanjutan opsional: tabel aturan fee bertingkat
  (mis. <100rb=3rb, 100–500rb=5rb, dst) + tracking saldo float agen.
- Catatan: `metode_pembayaran` transaksi (cash/qris/transfer) ≠ jenis jasa.
  Pelanggan biasanya bayar jasa transfer pakai **cash**. Jangan tertukar.

---

### Fase 3 — Modal produksi disederhanakan — kebutuhan #1 ✅ SELESAI (17 Jun 2026)

> **Status:** terimplementasi & teruji (115 test/112 hijau, build sukses, lint bersih).
> - `ProduksiController::store` menerima `mode` (sederhana/rinci) + `total_biaya`; `biayas` kini opsional. Mode sederhana: `modal/unit = total_biaya ÷ jumlah` tanpa baris rincian. Validasi: harus ada sumber biaya (`total_biaya` > 0 atau rincian).
> - Form ([Produksi.vue](resources/js/pages/admin/Produksi.vue)): toggle **Sederhana (1 angka)** / **Rincian bahan**; `form.transform` mengirim hanya field relevan. Default = sederhana (sesuai mindset klien).
> - Aturan anti double-count tetap (biaya bahan lewat Produksi, bukan Pengeluaran).
> - Test: `ProduksiTest` (mode sederhana + validasi sumber biaya).
Rekonsiliasi: klien mau "keluar segini, jadi segini"; kita mau data akurat.
Keduanya bisa dipenuhi.

- Modul Produksi sekarang minta rincian bahan (`produksi_biayas`) → itu yang bikin
  klien malas. Tambah **mode sederhana**: klien cukup isi **1 angka** total biaya +
  jumlah hasil → `modal/unit = total ÷ hasil` otomatis.
- Rincian bahan jadi **opsional**, bukan wajib. Tetap akurat (uang riil ÷ unit riil).
- **Aturan anti double-count tetap berlaku**: biaya bahan masuk lewat Produksi,
  BUKAN lewat Pengeluaran (tipe `bahan_baku`/`kemasan` tetap dikecualikan dari
  biaya operasional dashboard).

---

### Fase 4 — Reseller & pelanggan — kebutuhan #4 ✅ SELESAI (17 Jun 2026)

> **Status:** terimplementasi & teruji (121 test/118 hijau, build sukses, lint bersih). Keputusan: **potongan rupiah per produk**; pemilihan pelanggan via dropdown di keranjang (default "Umum").
> - Migrasi `100005` (tabel `pelanggans`: nama/telp/tipe umum|reseller), `100006` (`produks.potongan_reseller`), `100007` (`transaksis.id_pelanggan` nullOnDelete).
> - Model `Pelanggan`; `PelangganController` CRUD; route `admin.pelanggan*`; nav sidebar "Pelanggan"; halaman `admin/Pelanggan.vue`.
> - Form produk: field **Potongan Reseller (Rp)** + peringatan bila harga reseller < modal (jual rugi).
> - `KasirController::store`: `id_pelanggan`; bila reseller, harga efektif = max(0, harga_jual − potongan_reseller), di-snapshot ke `detail.harga` (modal tetap → laba akurat). Berlaku ke satuan & curah; jasa tidak.
> - Kasir UI: dropdown **Pelanggan** di keranjang; memilih reseller otomatis menghitung ulang harga seluruh keranjang.
> - Test: `tests/Feature/ResellerTest.php`.
- Buat tabel **`pelanggan`**: `id, nama, telp (nullable), tipe (umum|reseller),
  timestamps`. Pendaftaran reseller jadi resmi (ganti "ka aku mau jadi reseller ya").
- **Potongan reseller = rupiah per produk** (keputusan klien): tambah kolom
  `produks.potongan_reseller` unsignedBigInteger default 0.
  - Saat checkout pelanggan `reseller`: `harga baris = harga_jual − potongan_reseller`.
  - **Beri peringatan** bila `harga setelah potong < harga_modal` (jual rugi).
- `transaksis`: tambah `id_pelanggan` (nullable, default = umum).
- Laba tetap akurat karena `harga` & `modal` sudah di-snapshot per baris.

---

### Fase 5 — Dashboard produk jarang laku + saran promo — kebutuhan #3 ✅ SELESAI (17 Jun 2026)

> **Status:** terimplementasi & teruji (123 test/120 hijau, build sukses, lint bersih). Ditaruh di **dashboard admin** (ranah manajemen).
> - `DashboardController`: `slow_movers` = produk `stok > 0` & bukan jasa, diurut paling sedikit terjual dalam **30 hari terakhir** (jendela tetap, termasuk yang **0 terjual** — beda dari `worst_selling_products` lama yang hanya yang sempat terjual). Sertakan flag `sudah_promo`.
> - Widget tabel "Produk Jarang Laku" di `admin/Dashboard.vue`: foto, terjual (merah bila 0), stok, tombol **Buat Promo** (atau badge "Sudah promo").
> - "Buat Promo" → `/admin/promos?produk=ID`; `Promos.vue` membaca query → buka modal tambah, pilih produk, prefill nama "Promo {produk}".
> - Test: `DashboardTest` (slow_movers urut, jasa dikecualikan).
- Query slow-mover dari `detail_transaksis` + tanggal: produk dengan qty terjual
  rendah/0 dalam N hari terakhir **padahal `stok > 0`**.
- Widget dashboard: daftar produk lambat + tombol **"Buat Promo"** yang prefilled
  ke form Promo yang sudah ada.
- Tidak butuh skema inti baru (opsional: kolom `tanggal_masuk` untuk hitung umur stok).

---

### Fase 6 — UX quick-pick untuk barang tanpa barcode (permen) — kebutuhan #6 ✅ SELESAI (17 Jun 2026)

> **Status:** terimplementasi & teruji (125 test/122 hijau, build sukses, lint bersih).
> - `KasirController::transaksi`: kirim `favorite_ids` = top seller 30 hari terakhir (stok > 0, bukan jasa).
> - `Transaksi.vue`: strip **"Sering dibeli"** (chip nama+harga, satu-tap `addToCart`, badge qty-di-keranjang) di header, tampil saat tidak sedang mencari. Barang kecil tanpa barcode cukup di-tap, tanpa scan.
> - Test: `tests/Feature/QuickPickTest.php`.
- Barcode sudah `nullable` (migrasi 16 Jun) → secara data sudah didukung.
- Tambah **grid favorit / pencarian cepat** di halaman Transaksi kasir agar barang
  kecil bisa ditambah tanpa scan. Mostly frontend, tanpa skema baru.

---

## 3. Dampak lintas-fase: LAPORAN (paling penting untuk akurasi)
Tiga titik agregasi yang WAJIB ditinjau ulang setiap menyentuh Fase 2 & 4:
- `KasirController::dashboard` (omzet hari ini, payment breakdown).
- Dashboard admin + section **Analisis Laba & Rugi** (waterfall, perbandingan periode).
- Aturan:
  - Jasa: omzet = fee, **kecualikan `nominal`** dari semua perhitungan omzet/laba.
  - Reseller: omzet = harga setelah potongan; HPP tetap dari `modal` snapshot.
  - Curah: pastikan qty desimal tidak merusak penjumlahan integer lama.

## 4. Keputusan teknis yang masih terbuka
1. **Pembulatan curah by-rupiah:** ✅ DIPUTUSKAN — input **utamakan rupiah**,
   subtotal = **nominal persis**, qty (= nominal ÷ harga) disimpan 3 desimal sbg catatan.
2. **Jasa — produk atau tabel sendiri?** Pakai `produks.tipe_jual=jasa` (cepat,
   reuse UI) ATAU tabel `layanan` terpisah (lebih bersih, tapi lebih banyak kerja)?
   → Rekomendasi: mulai dari `tipe_jual=jasa`, pisah nanti bila perlu.
3. **Saldo float agen** (Fase 2 lanjutan): dilacak sekarang atau ditunda? → tunda.
4. **Ambang slow-mover** (N hari & batas qty): default berapa? perlu UI setting?

## 5. Hal operasional (dari memori proyek)
- Setiap perubahan frontend → **wajib `npm run build`** (Laragon mode production).
- Update test: `KasirTransaksiTest`, `ProduksiTest` akan terdampak; tambah test baru
  per fase (kartu stok, curah by-rupiah, fee jasa, potongan reseller).
- Migrasi `decimal` pada tabel berisi data → uji di DB salinan dulu.

## 6. Urutan eksekusi yang disarankan
Fase 0 → 1 → 2 → 4 → 3 → 5 → 6.
(0 fondasi; 1 & 2 bagian paling "bikin bingung" & rawan; 4 paling sering dipakai
harian; 3/5/6 pelengkap.)
