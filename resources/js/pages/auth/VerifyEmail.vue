<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

defineOptions({
    layout: {
        title: 'Verifikasi email',
        description:
            'Silakan verifikasi email Anda dengan mengeklik tautan yang baru kami kirim.',
    },
});

defineProps<{
    status?: string;
}>();
</script>

<template>
    <Head title="Email verification" />

    <div
        v-if="status === 'verification-link-sent'"
        class="mb-4 text-center text-sm font-medium text-emerald-600"
    >
        Tautan verifikasi baru telah dikirim ke alamat email Anda.
    </div>

    <Form
        v-bind="send.form()"
        class="space-y-6 text-center"
        v-slot="{ processing }"
    >
        <Button type="submit" :disabled="processing" variant="secondary">
            <Spinner v-if="processing" />
            Kirim ulang email verifikasi
        </Button>

        <TextLink
            :href="logout()"
            as="button"
            class="mx-auto block text-sm font-semibold text-[var(--kg-primary)]"
        >
            Keluar
        </TextLink>
    </Form>
</template>
