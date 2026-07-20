<script setup lang="ts">
interface SelectItem {
  label: string;
  value: string;
}

interface Props {
  modelValue: string;
  items: SelectItem[];
  placeholder?: string;
  icon?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const props = withDefaults(defineProps<Props>(), {
  size: "sm",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<template>
  <USelect
    :model-value="props.modelValue"
    :items="props.items"
    :placeholder="props.placeholder"
    :icon="props.icon"
    :size="props.size"
    color="neutral"
    variant="outline"
    @update:model-value="(val: string) => emit('update:modelValue', val)"
  />
</template>
