<script setup lang="ts">
import type { RendererItemDefinition } from '../../../types.ts';
import JsonRenderer from '../JsonRenderer.vue';

const slots = defineModel<Record<string, RendererItemDefinition>>('slots', {
	default: () => ({})
});
</script>

<template>
	<div style="display: flex; justify-content: space-between;">
		<slot name="prefix" v-if="slots.prefix">
			<div>
        <JsonRenderer v-model:schema="slots.prefix" />
      </div>
		</slot>
		<slot name="suffix" v-if="slots.suffix">
			<div>
        <JsonRenderer v-model:schema="slots.suffix" />
      </div>
		</slot>
		<div>
      <slot></slot>
    </div>
	</div>
</template>
