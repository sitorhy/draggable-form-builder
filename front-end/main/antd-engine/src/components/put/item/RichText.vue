<script setup lang="ts">
import { computed } from 'vue';
import type { RendererItemDefinition } from 'engine-commons/types.ts';

const schema = defineModel<RendererItemDefinition>('schema', {
  type: Object,
  default: () => ({ type: '', id: '', children: undefined })
});

const content = computed(function () {
  return schema.value.props?.value || '';
});
</script>

<template>
  <div
      class="renderer-item-placeholder"
      v-html="content"
  />
</template>
