import { computed, ref, watch } from 'vue';
import type { BestSeller, Product } from '@/types/storefront';

// Katalog storefront: pencarian, filter kategori, sorting, & "muat lebih banyak".
// `allProducts` getter agar reaktif terhadap sumber dari props.
export function useCatalog(allProducts: () => Product[]) {
    const searchQuery = ref('');
    const activeCategory = ref('Semua');
    const sortBy = ref<'rekomendasi' | 'termurah' | 'termahal' | 'nama'>(
        'rekomendasi',
    );

    const sortOptions = [
        { value: 'rekomendasi', label: 'Rekomendasi' },
        { value: 'termurah', label: 'Harga termurah' },
        { value: 'termahal', label: 'Harga termahal' },
        { value: 'nama', label: 'Nama A–Z' },
    ] as const;

    const categories = computed(() => {
        const unik = Array.from(
            new Set(
                allProducts()
                    .map((p) => p.kategori)
                    .filter((k): k is string => !!k),
            ),
        ).sort((a, b) => a.localeCompare(b, 'id-ID'));

        return ['Semua', ...unik];
    });

    const effectivePrice = (product: Product | BestSeller): number =>
        product.promo?.harga_promo ?? product.harga_jual;

    const filteredProducts = computed(() => {
        const query = searchQuery.value.trim().toLowerCase();

        let result = allProducts().filter((product) => {
            const cocokKategori =
                activeCategory.value === 'Semua' ||
                product.kategori === activeCategory.value;

            if (!cocokKategori) {
                return false;
            }

            if (!query) {
                return true;
            }

            const haystack =
                `${product.nama} ${product.kategori ?? ''}`.toLowerCase();

            return haystack.includes(query);
        });

        if (sortBy.value === 'termurah') {
            result = [...result].sort(
                (a, b) => effectivePrice(a) - effectivePrice(b),
            );
        } else if (sortBy.value === 'termahal') {
            result = [...result].sort(
                (a, b) => effectivePrice(b) - effectivePrice(a),
            );
        } else if (sortBy.value === 'nama') {
            result = [...result].sort((a, b) =>
                a.nama.localeCompare(b.nama, 'id-ID'),
            );
        }

        return result;
    });

    // "Muat lebih banyak" — tampilkan bertahap.
    const catalogLimit = ref(8);
    const visibleProducts = computed(() =>
        filteredProducts.value.slice(0, catalogLimit.value),
    );

    watch([searchQuery, activeCategory, sortBy], () => {
        catalogLimit.value = 8;
    });

    const resetKatalog = () => {
        searchQuery.value = '';
        activeCategory.value = 'Semua';
        sortBy.value = 'rekomendasi';
    };

    return {
        searchQuery,
        activeCategory,
        sortBy,
        sortOptions,
        categories,
        effectivePrice,
        filteredProducts,
        catalogLimit,
        visibleProducts,
        resetKatalog,
    };
}
