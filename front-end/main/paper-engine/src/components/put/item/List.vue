<script setup lang="ts">
import JsonRendererList from '../JsonRendererList.vue';
import type { RendererItemDefinition } from 'engine-commons/types.ts';

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({
		props: {
			slots: {}
		}
	})
});
</script>

<template>
	<div style="display: flex; flex-direction: column;">
		<JsonRendererList
			tag="list-item"
			v-model:schema="schema"
		/>
	</div>
</template>
