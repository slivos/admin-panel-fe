<script setup lang="ts">
interface Props {
  open: boolean;
  title?: string;
  description?: string;
  dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  dismissible: true,
});

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();
</script>

<template>
  <UModal
    :open="props.open"
    :title="props.title"
    :description="props.description"
    :dismissible="props.dismissible"
    :ui="{ footer: 'justify-end' }"
    @update:open="(val: boolean) => emit('update:open', val)"
  >
    <slot />

    <template v-if="$slots.body" #body>
      <slot name="body" />
    </template>

    <template v-if="$slots.footer" #footer="slotProps">
      <slot name="footer" v-bind="slotProps" />
    </template>
  </UModal>
</template>
