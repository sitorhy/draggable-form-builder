<script setup lang="ts">
import type { RendererItemDefinition } from '../../../types.ts';
import JsonRenderer from '../JsonRenderer.vue';

const slots = defineModel<Record<string, RendererItemDefinition>>('slots', {
	default: () => ({})
});
</script>

<!-- 不支持多插槽，通过包装件传递其他插槽数据 -->
<template>
	<div style="display: flex; justify-content: space-between;">
		<slot name="prefix" v-if="slots.prefix">
			<JsonRenderer v-model:schema="slots.prefix" />
		</slot>
		<slot name="suffix" v-if="slots.suffix">
			<JsonRenderer v-model:schema="slots.suffix" />
		</slot>
		<slot></slot>
	</div>
</template>
