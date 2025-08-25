<script setup lang="ts">
import type { RendererItemDefinition } from '../../../types.ts';
import JsonRenderer from '../JsonRenderer.vue';

const slots = defineModel<Record<string, RendererItemDefinition>>('slots', {
	default: () => ({})
});
</script>

<!-- 不支持多插槽，通过包装件传递其他插槽数据 -->
<template>
	<n-list-item>
		<template #prefix v-if="slots.prefix">
			<JsonRenderer v-model:schema="slots.prefix" />
		</template>
		<template #suffix v-if="slots.suffix">
			<JsonRenderer v-model:schema="slots.suffix" />
		</template>
		<template #default>
			<slot></slot>
		</template>
	</n-list-item>
</template>
