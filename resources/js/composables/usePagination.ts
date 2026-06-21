import { ref, computed, watch } from 'vue';

export function usePagination<T>(source: () => T[], defaultPerPage = 10) {
    const currentPage = ref(1);
    const perPage = ref(defaultPerPage);

    watch([source, perPage], () => {
        currentPage.value = 1;
    });

    const totalItems = computed(() => source().length);
    const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / perPage.value)));

    const paginatedItems = computed(() => {
        const start = (currentPage.value - 1) * perPage.value;

        return source().slice(start, start + perPage.value);
    });

    const startIndex = computed(() => (totalItems.value === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1));
    const endIndex = computed(() => Math.min(currentPage.value * perPage.value, totalItems.value));

    function goToPage(page: number) {
        currentPage.value = Math.max(1, Math.min(page, totalPages.value));
    }

    const visiblePages = computed(() => {
        const pages: number[] = [];
        const total = totalPages.value;
        const current = currentPage.value;

        if (total <= 7) {
            for (let i = 1; i <= total; i++) {
pages.push(i);
}
        } else {
            pages.push(1);

            if (current > 3) {
pages.push(-1);
}

            for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
                pages.push(i);
            }

            if (current < total - 2) {
pages.push(-1);
}

            pages.push(total);
        }

        return pages;
    });

    return { currentPage, perPage, totalItems, totalPages, paginatedItems, startIndex, endIndex, goToPage, visiblePages };
}
