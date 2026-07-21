<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <div
    v-bind="$attrs"
    class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
  >
    <slot />
  </div>
</template>
