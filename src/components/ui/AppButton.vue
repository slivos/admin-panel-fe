<script setup lang="ts">
interface Props {
  label?: string;
  type?: "button" | "submit" | "reset";
  variant?: "solid" | "outline" | "ghost" | "soft" | "subtle" | "link";
  color?: "primary" | "secondary" | "neutral" | "error" | "warning" | "success" | "info";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "button",
  variant: "solid",
  color: "primary",
  size: "md",
  loading: false,
  disabled: false,
  block: false,
});
</script>

<template>
  <UButton
    :label="props.label"
    :type="props.type"
    :variant="props.variant"
    :color="props.color"
    :size="props.size"
    :loading="props.loading"
    :disabled="props.disabled"
    :block="props.block"
  >
    <slot />
  </UButton>
</template>
