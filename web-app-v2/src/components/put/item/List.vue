<script setup lang="ts">
import JsonRendererList from '../JsonRendererList.vue';
import { computed } from 'vue';
import type { RendererItemDefinition } from '../../../types.ts';

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({
		props: {
			slots: {}
		}
	})
});

const componentData = computed(() => {
	console.log(schema.value?.props?.slots);
	return {
		slots: schema.value?.props?.slots,
		'onUpdate:slots': (slots: Record<string, any>) => {
			console.log(111);
			if (schema.value && schema.value.props) {
				schema.value.props.slots = slots;
			}
		}
	};
});
</script>

<template>
	<n-list>
		<JsonRendererList
			tag="list-item"
			v-model:schema="schema"
			:put="false"
			:pull="false"
			:component-data="componentData"
		/>
	</n-list>
</template>
