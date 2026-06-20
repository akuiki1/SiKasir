<script setup lang="ts">
import { Check, Monitor, Moon, Sun } from 'lucide-vue-next';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/composables/useAppearance';

const { appearance, updateAppearance } = useAppearance();

const options = [
    { value: 'light', Icon: Sun, label: 'Terang' },
    { value: 'dark', Icon: Moon, label: 'Gelap' },
    { value: 'system', Icon: Monitor, label: 'Sistem' },
] as const;

const CurrentIcon = computed(
    () => options.find((o) => o.value === appearance.value)?.Icon ?? Monitor,
);
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button
                variant="ghost"
                size="icon"
                class="size-9 rounded-full text-muted-foreground hover:text-foreground"
                aria-label="Ubah tampilan"
            >
                <component :is="CurrentIcon" class="size-[1.1rem]" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-40 rounded-lg">
            <DropdownMenuLabel class="text-xs text-muted-foreground">
                Tampilan
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                v-for="{ value, Icon, label } in options"
                :key="value"
                class="cursor-pointer"
                @click="updateAppearance(value)"
            >
                <component :is="Icon" class="mr-2 size-4" />
                <span>{{ label }}</span>
                <Check
                    v-if="appearance === value"
                    class="ml-auto size-4 text-primary"
                />
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
