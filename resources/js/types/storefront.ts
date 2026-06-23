export interface Promo {
    nama: string;
    label: string;
    tipe: 'persen' | 'nominal';
    nilai: number;
    harga_promo: number | null;
    sisa_hari: number;
    tanggal_selesai: string;
    berakhir_pada: string;
}

export interface BestSeller {
    id_produk: number;
    nama: string;
    harga_jual: number;
    stok: number;
    foto_url: string | null;
    total_terjual: number;
    promo: Promo | null;
}

export interface Product {
    id_produk: number;
    nama: string;
    kategori: string | null;
    harga_jual: number;
    stok: number;
    foto_url: string | null;
    promo: Promo | null;
}

export interface CartItem {
    id_produk: number;
    nama: string;
    harga_jual: number;
    foto_url: string | null;
    stok: number;
    quantity: number;
}

// Menerima Product (katalog) maupun BestSeller (produk favorit) —
// keduanya berbagi field minimal yang dibutuhkan keranjang.
export type AddableProduct = Pick<
    CartItem,
    'id_produk' | 'nama' | 'harga_jual' | 'foto_url' | 'stok'
>;
