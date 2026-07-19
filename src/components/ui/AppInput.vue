<script setup lang="ts">
interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  error?: string;
  required?: boolean;
  autocomplete?: string;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  required: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<template>
  <UFormField :label="props.label" :error="props.error" :required="props.required">
    <UInput
      :model-value="props.modelValue"
      :type="props.type"
      :placeholder="props.placeholder"
      :name="props.name"
      :autocomplete="props.autocomplete"
      class="w-full"
      @update:model-value="(val: string) => emit('update:modelValue', val)"
    />
  </UFormField>
</template>
