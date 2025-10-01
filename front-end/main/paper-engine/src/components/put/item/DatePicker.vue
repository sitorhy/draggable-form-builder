<script setup lang="ts">
import type { RendererItemDefinition } from '../../../types.ts';
import {computed} from "vue";

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({ type: '', id: '', children: undefined })
});

const style = computed(() => {
  return schema.value.props?.style;
});
</script>

<template>
  <div class="input" :style="style"></div>
</template>
