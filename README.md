# SiKasir

**Aplikasi kasir (POS) dan toko online untuk UMKM.** Satu aplikasi untuk dua sisi usaha: kasir di konter dan etalase online yang bisa dipesan pelanggan tanpa perlu membuat akun.

Dibangun untuk klien di Barabai, Kalimantan Selatan, dan berjalan di produksi pada [cemilanmbatututbarabai.com](https://cemilanmbatututbarabai.com).

---

## Daftar Isi

- [Fitur](#fitur)
- [Konsep yang Membedakan](#konsep-yang-membedakan)
- [Teknologi](#teknologi)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Database Seeder](#database-seeder)
- [Akun Contoh](#akun-contoh)
- [Struktur Database](#struktur-database)
- [Struktur Direktori](#struktur-direktori)
- [Ketahanan di Jaringan Lemah](#ketahanan-di-jaringan-lemah)
- [Dokumentasi Pengguna](#dokumentasi-pengguna)
- [Pengujian](#pengujian)
- [Perintah yang Sering Dipakai](#perintah-yang-sering-dipakai)

---

## Fitur

### Storefront Publik (tanpa login)

| Bagian | Rute | Isi |
| --- | --- | --- |
| Etalase | `/` | Lima produk terlaris — produk berfoto diprioritaskan agar kartu etalase tidak kosong |
| Katalog | `/` | Seluruh produk satuan beserta kategori, stok, dan harga |
| Promo | `/` | Label diskon (persen atau rupiah), harga coret, dan hitung mundur sampai promo berakhir |
| Pesan online | `POST /pesan` | Pemesanan tanpa login; dibatasi 15 permintaan per menit |
| Lacak pesanan | `POST /lacak-pesanan` | Pelanggan memeriksa status pesanannya sendiri lewat nomor WhatsApp; 30 permintaan per menit |

Hanya produk bertipe `satuan` yang tampil di storefront — produk curah dan jasa memang tidak masuk akal dipesan online.

### Kasir (role `kasir`)

- **Dashboard** — ringkasan penjualan hari berjalan.
- **Transaksi** — katalog, keranjang, pemilihan pelanggan (harga reseller ikut menyesuaikan), lalu pembayaran.
- **Riwayat** — daftar transaksi sendiri, lengkap dengan tampilan siap cetak.
- **Pesanan online** — pesanan masuk dari storefront ditandai `siap`, diedit, diproses menjadi transaksi saat pelanggan mengambil barang, atau dibatalkan.

### Admin (role `admin`)

- **Dashboard** — omzet, laba, transaksi, dan produk terlaris.
- **Produk** — CRUD, tiga tipe jual, harga modal, potongan reseller, foto, barcode (termasuk *generate* massal), *soft delete* dengan pemulihan dan hapus permanen.
- **Kategori** dan **Pelanggan** (umum & reseller) — CRUD.
- **Stok** — stok masuk, stok keluar, penyesuaian (opname), dan kartu stok yang mencatat setiap mutasi.
- **Produksi** — mencatat batch produksi beserta rincian biayanya untuk produk buatan sendiri.
- **Transaksi** dan **Pengeluaran** — CRUD lengkap dari sisi admin.
- **Promo** — diskon per produk maupun global, berjangka waktu, termasuk bundling.
- **Pesanan online** — layar dan aksi yang sama dengan sisi kasir.
- **Laporan** — keuangan (laba rugi), penjualan, inventaris, dan pelanggan.
- **Pengguna** — mengelola akun admin dan kasir.

---

## Konsep yang Membedakan

**Tiga tipe jual.** Kolom `tipe_jual` pada `produks` menentukan cara sebuah produk dihitung:

| Tipe | Contoh | Perilaku |
| --- | --- | --- |
| `satuan` | cemilan, permen | Dihitung per biji; satu-satunya tipe yang tampil di storefront |
| `curah` | bensin per liter, bawang per kg | Kuantitas desimal — kolom `stok` dan `jumlah` bertipe decimal, bukan integer |
| `jasa` | tarik tunai, transfer | Tanpa stok; omzet yang diakui adalah fee, bukan nominal yang dititipkan |

**Nominal jasa bukan omzet.** Pada baris transaksi jasa, `nominal` menyimpan uang titipan pelanggan (*pass-through*) sedangkan `subtotal` menyimpan fee. Laporan hanya membaca `subtotal`, sehingga uang titipan tidak pernah menggelembungkan omzet. Besaran fee sendiri diambil dari `tarif_jasas` — tarif bertingkat, tiap baris berlaku mulai dari `min_nominal`.

**Rupiah disimpan sebagai integer.** Hanya kuantitas yang boleh pecahan. Harga, modal, dan subtotal tetap integer agar tidak ada selisih pembulatan pada laporan.

**Laba, bukan sekadar omzet.** Setiap baris `detail_transaksis` menyimpan `modal` saat transaksi terjadi. Untuk produk buatan sendiri, modal per unit berasal dari batch produksi beserta rincian biayanya (`produksis` dan `produksi_biayas`). Laporan keuangan karenanya menampilkan laba bersih, bukan hanya total penjualan.

**Riwayat transaksi tidak ikut terhapus.** Menghapus produk tidak merusak transaksi lama: produk memakai *soft delete* dan relasi transaksi dirancang untuk mempertahankan riwayat (lihat migrasi `preserve_transaction_history_on_delete`).

---

## Teknologi

| Komponen | Versi |
| --- | --- |
| PHP | ^8.3 |
| Laravel | ^13.7 |
| Inertia.js (server) | ^3.0 |
| Inertia.js (client) | ^3.0 |
| Vue | ^3.5 |
| TypeScript | ^5.2 |
| Tailwind CSS | ^4.1 |
| Vite | ^8.0 |
| Laravel Fortify | ^1.37 |
| Laravel Wayfinder | ^0.1 |
| Pest | ^4.7 |
| MySQL | 8.x |

Frontend memakai komponen [reka-ui](https://reka-ui.com/), ikon `lucide-vue-next`, notifikasi `vue-sonner`, pembuatan barcode `jsbarcode`, dan konversi HEIC ke JPEG lewat `heic2any` (foto dari iPhone).

---

## Persyaratan

- PHP 8.3 atau lebih baru, beserta ekstensi bawaan Laravel (`pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `zip`, `gd`)
- Composer 2
- Node.js 20 atau lebih baru dan npm
- MySQL 8 (proyek ini dikembangkan di atas Laragon)

---

## Instalasi

```bash
git clone https://github.com/akuiki1/SiKasir.git sikasir
```

```bash
cd sikasir && composer install && npm install
```

Salin berkas konfigurasi lalu buat application key:

```bash
cp .env.example .env && php artisan key:generate
```

Buat database kosong, misalnya `sikasir`, kemudian sesuaikan `.env`:

```dotenv
APP_NAME=SiKasir
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sikasir
DB_USERNAME=root
DB_PASSWORD=
```

> `.env.example` masih memakai `DB_CONNECTION=sqlite` bawaan Laravel. Ubah menjadi `mysql` seperti di atas — beberapa migrasi memakai kolom `enum` dan `decimal` yang disiapkan untuk MySQL.

Buat symlink storage agar foto produk dapat diakses publik:

```bash
php artisan storage:link
```

Jalankan migrasi beserta data contoh:

```bash
php artisan migrate:fresh --seed
```

Atau pakai skrip siap pakai yang menjalankan seluruh langkah di atas sekaligus:

```bash
composer run setup
```

---

## Menjalankan Aplikasi

Satu perintah untuk server, queue worker, dan Vite sekaligus:

```bash
composer run dev
```

Atau jalankan terpisah — terminal pertama untuk server PHP:

```bash
php artisan serve
```

Terminal kedua untuk Vite:

```bash
npm run dev
```

Aplikasi dapat diakses di `http://localhost:8000`.

Untuk build produksi:

```bash
npm run build
```

---

## Database Seeder

Data contoh berada di `database/seeders/` dan dipanggil berurutan oleh `DatabaseSeeder`.

```bash
php artisan db:seed
```

| Seeder | Data yang dibuat |
| --- | --- |
| `UserSeeder` | 1 admin dan 3 kasir |
| `KategoriSeeder` | Kategori produk |
| `ProdukSeeder` | Produk beserta harga jual, harga modal, dan stok awal |
| `ProduksiSeeder` | Batch produksi beserta rincian biaya |
| `PromoSeeder` | Promo aktif dan kedaluwarsa |
| `TransaksiSeeder` | Transaksi beserta detailnya |
| `PengeluaranSeeder` | Pengeluaran operasional |

---

## Akun Contoh

| Email | Kata sandi | Role |
| --- | --- | --- |
| `admin@gmail.com` | `admin123` | admin |
| `siti@gmail.com` | `kasir123` | kasir |
| `agus@gmail.com` | `kasir123` | kasir |
| `dewi@gmail.com` | `kasir123` | kasir |

Ganti seluruh kredensial ini sebelum dipakai di lingkungan yang dapat diakses publik.

---

## Struktur Database

29 migrasi, dikelompokkan sebagai berikut:

**Katalog**
- `kategoris`, `produks` (`tipe_jual`, `satuan`, `harga_modal`, `potongan_reseller`, `barcode`, `deleted_at`)
- `tarif_jasas` — tarif fee bertingkat untuk produk jasa

**Penjualan**
- `transaksis` dan `detail_transaksis` (menyimpan `modal` dan `nominal` per baris)
- `pelanggans` — pelanggan umum dan reseller
- `promos` — diskon persen/rupiah, berjangka waktu, dengan dukungan bundling

**Persediaan**
- `stok_mutasis` — kartu stok: masuk, keluar, penyesuaian
- `produksis` dan `produksi_biayas` — batch costing produk buatan sendiri

**Pesanan Online**
- `pesanans` dan `pesanan_items`

**Keuangan**
- `pengeluarans`

Migrasi `add_performance_indexes` menambahkan indeks untuk kueri laporan yang menyapu banyak baris.

---

## Struktur Direktori

```
app/
  Http/Controllers/        Kasir, produk, stok, promo, pesanan, storefront publik
  Http/Controllers/Admin/  Dashboard, laporan, pengguna
  Http/Controllers/Settings/
  Models/
database/
  migrations/
  seeders/                 Data contoh (lihat bagian Database Seeder)
docs/
  manual/                  Buku panduan pengguna beserta skrip pembangunnya
  rencana-pengembangan.md
resources/
  js/pages/                Halaman Inertia (admin, kasir, storefront)
  js/components/
routes/
  web.php                  Storefront publik, area kasir, area admin
  settings.php             Profil, kata sandi, tampilan
tests/                     29 berkas pengujian Pest
```

---

## Ketahanan di Jaringan Lemah

Aplikasi ini dipakai di lapangan dengan koneksi seluler yang tidak selalu stabil dan di-*hosting* pada shared hosting. Dua penyesuaian utama:

- **Kompresi foto di sisi klien.** Foto produk diperkecil sebelum diunggah (sasaran ~0,8 MB, batas keras 1,5 MB) agar tidak ditolak batas unggah server dan tidak menggantung sampai *timeout* gateway. Foto HEIC dari iPhone dikonversi lebih dulu.
- **Kirim-ulang otomatis.** Kegagalan transient (jaringan putus, 502/503/504) dicoba ulang maksimal dua kali dengan jeda bertingkat, dan tombolnya menampilkan percobaan ke berapa. Bila tetap gagal, pengguna mendapat tombol "Kirim Ulang" manual, bukan pesan galat mentah.

Default driver `session`, `cache`, dan `queue` diarahkan ke `file`/`sync` agar berjalan apa adanya di shared hosting tanpa layanan tambahan.

> Antrean transaksi offline penuh (IndexedDB + sinkronisasi) tidak ada di repositori ini — fitur tersebut dikembangkan pada varian multi-toko, [SaaSKasir](https://github.com/akuiki1/SaaSKasir).

---

## Dokumentasi Pengguna

Buku panduan cetak untuk pengguna akhir berada di `docs/manual/`, beserta skrip Node yang membangunnya dari master markdown dan skrip Playwright yang mengambil tangkapan layar tiap halaman. Berkas hasil terbaru: `docs/manual/Panduan-SiKasir-v3.docx`.

---

## Pengujian

```bash
php artisan test
```

Atau lengkap dengan pemeriksaan gaya kode:

```bash
composer run test
```

---

## Perintah yang Sering Dipakai

Menyegarkan database beserta data contoh:

```bash
php artisan migrate:fresh --seed
```

Membuat symlink storage:

```bash
php artisan storage:link
```

Merapikan gaya kode PHP:

```bash
vendor/bin/pint
```

Memeriksa tipe TypeScript:

```bash
npm run types:check
```

Membersihkan cache konfigurasi, rute, dan view:

```bash
php artisan optimize:clear
```
