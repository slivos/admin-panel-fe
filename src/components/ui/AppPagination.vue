<script setup lang="ts">
interface Props {
  page: number;
  total: number;
  itemsPerPage?: number;
  siblingCount?: number;
  showEdges?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 10,
  siblingCount: 1,
  showEdges: false,
});

const emit = defineEmits<{
  "update:page": [value: number];
}>();
</script>

<template>
  <UPagination
    :page="props.page"
    :total="props.total"
    :items-per-page="props.itemsPerPage"
    :sibling-count="props.siblingCount"
    :show-edges="props.showEdges"
    @update:page="(val: number) => emit('update:page', val)"
  />
</template>
