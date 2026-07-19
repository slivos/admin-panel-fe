<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

interface Props {
  to?: RouteLocationRaw;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  external?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <ULink
    :to="props.to"
    :href="props.href"
    :target="props.target"
    :external="props.external"
    class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm underline-offset-4 hover:underline transition-colors"
  >
    <slot />
  </ULink>
</template>
