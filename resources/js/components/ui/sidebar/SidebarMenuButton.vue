<script setup lang="ts">
import type { Component } from "vue"
import type { SidebarMenuButtonProps } from "./SidebarMenuButtonChild.vue"
import { reactiveOmit } from "@vueuse/core"
import { onMounted, ref } from "vue"
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import SidebarMenuButtonChild from "./SidebarMenuButtonChild.vue"
import { useSidebar } from "./utils"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SidebarMenuButtonProps & {
  tooltip?: string | Component
}>(), {
  as: "button",
  variant: "default",
  size: "default",
})

const { isMobile, state } = useSidebar()

const delegatedProps = reactiveOmit(props, "tooltip")

// Tooltip (Reka UI) memakai Teleport yang menghasilkan node komentar placeholder di
// klien tapi tidak di SSR → memicu hydration mismatch di SETIAP item sidebar. Tunda
// pembungkus Tooltip hingga setelah mount: render pertama di server & klien sama-sama
// hanya tombol (cocok), tooltip menyusul di klien (hanya tampil saat hover).
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <SidebarMenuButtonChild v-if="!tooltip || !isMounted" v-bind="{ ...delegatedProps, ...$attrs }">
    <slot />
  </SidebarMenuButtonChild>

  <Tooltip v-else>
    <TooltipTrigger as-child>
      <SidebarMenuButtonChild v-bind="{ ...delegatedProps, ...$attrs }">
        <slot />
      </SidebarMenuButtonChild>
    </TooltipTrigger>
    <TooltipContent
      side="right"
      align="center"
      :hidden="state !== 'collapsed' || isMobile"
    >
      <template v-if="typeof tooltip === 'string'">
        {{ tooltip }}
      </template>
      <component :is="tooltip" v-else />
    </TooltipContent>
  </Tooltip>
</template>
