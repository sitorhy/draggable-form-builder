<script setup lang="ts">
import type { RendererItemDefinition } from '../../../types.ts';

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({ type: '', id: '', children: undefined })
});
</script>

<template>
	<div>
    <span style="color: red;">该引擎不支持{{schema.type}}</span>
  </div>
</template>
