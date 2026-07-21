<script setup lang="ts">
import { computed } from "vue";
import { initials } from "../../helpers/string.ts";

type AvatarSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    name: string;
    size?: AvatarSize;
  }>(),
  {
    size: "md",
  },
);

const sizeClasses = computed<string>(() => {
  const map: Record<AvatarSize, string> = {
    sm: "size-8 text-sm font-semibold",
    md: "size-9 text-sm font-semibold",
    lg: "size-14 text-xl font-bold",
  };
  return map[props.size];
});
</script>

<template>
  <span
    class="flex shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
    :class="sizeClasses"
  >
    {{ initials(name) }}
  </span>
</template>
