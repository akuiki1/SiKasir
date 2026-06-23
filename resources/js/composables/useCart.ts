import { computed, ref } from 'vue';
import type { AddableProduct, CartItem } from '@/types/storefront';

// Keranjang belanja storefront: state + operasi qty + total.
// `showToast` di-inject agar composable tak bergantung implementasi notifikasi.
export function useCart(showToast: (message: string) => void) {
    const cart = ref<CartItem[]>([]);
    const isCartOpen = ref(false);

    const cartItemCount = computed(() =>
        cart.value.reduce((sum, item) => sum + item.quantity, 0),
    );

    const cartTotal = computed(() =>
        cart.value.reduce(
            (sum, item) => sum + item.harga_jual * item.quantity,
            0,
        ),
    );

    const addToCart = (product: AddableProduct) => {
        if (product.stok <= 0) {
            showToast(`Stok ${product.nama} habis`);

            return;
        }

        const existing = cart.value.find(
            (item) => item.id_produk === product.id_produk,
        );

        if (existing) {
            if (existing.quantity >= existing.stok) {
                showToast(`Stok ${product.nama} cuma ${existing.stok}`);

                return;
            }

            existing.quantity += 1;
        } else {
            cart.value.push({
                id_produk: product.id_produk,
                nama: product.nama,
                harga_jual: product.harga_jual,
                foto_url: product.foto_url,
                stok: product.stok,
                quantity: 1,
            });
        }

        showToast(`${product.nama} ditambahkan ke keranjang`);
    };

    const increaseQty = (id: number) => {
        const item = cart.value.find((i) => i.id_produk === id);

        if (item) {
            if (item.quantity >= item.stok) {
                showToast(`Stok ${item.nama} cuma ${item.stok}`);

                return;
            }

            item.quantity += 1;
        }
    };

    const decreaseQty = (id: number) => {
        const item = cart.value.find((i) => i.id_produk === id);

        if (item) {
            item.quantity -= 1;

            if (item.quantity <= 0) {
                removeFromCart(id);
            }
        }
    };

    const setCartQuantity = (item: CartItem, event: Event) => {
        const el = event.target as HTMLInputElement;
        const digits = el.value.replace(/\D/g, '');

        if (digits === '') {
            el.value = '';

            return;
        }

        let next = parseInt(digits, 10);

        if (next < 1) {
            next = 1;
        }

        if (next > item.stok) {
            next = item.stok;

            if (item.quantity !== item.stok) {
                showToast(`Stok ${item.nama} cuma ${item.stok}`);
            }
        }

        item.quantity = next;
        el.value = String(next);
    };

    const normalizeCartQuantity = (item: CartItem, event: Event) => {
        const el = event.target as HTMLInputElement;
        let next = parseInt(el.value.replace(/\D/g, ''), 10);

        if (!Number.isFinite(next) || next < 1) {
            next = 1;
        }

        if (next > item.stok) {
            next = item.stok;
        }

        item.quantity = next;
        el.value = String(next);
    };

    const removeFromCart = (id: number) => {
        cart.value = cart.value.filter((i) => i.id_produk !== id);
    };

    const clearCart = () => {
        cart.value = [];
    };

    return {
        cart,
        isCartOpen,
        cartItemCount,
        cartTotal,
        addToCart,
        increaseQty,
        decreaseQty,
        setCartQuantity,
        normalizeCartQuantity,
        removeFromCart,
        clearCart,
    };
}
