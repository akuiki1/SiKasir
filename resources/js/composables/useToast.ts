import { ref } from 'vue';

// Toast ringan satu-pesan untuk storefront (auto-hilang setelah durationMs).
export function useToast(durationMs = 2200) {
    const toastMessage = ref<string | null>(null);
    let toastTimer: ReturnType<typeof setTimeout> | null = null;

    const showToast = (message: string) => {
        toastMessage.value = message;

        if (toastTimer) {
            clearTimeout(toastTimer);
        }

        toastTimer = setTimeout(() => {
            toastMessage.value = null;
        }, durationMs);
    };

    return { toastMessage, showToast };
}
