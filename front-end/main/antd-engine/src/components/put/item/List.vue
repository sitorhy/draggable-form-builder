<script setup lang="ts">
import JsonRendererList from '../JsonRendererList.vue';
import { computed } from 'vue';
import type {RendererItemDefinition} from "engine-commons/types.ts";

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({
		props: {
			slots: {}
		}
	})
});

const componentData = computed(() => {
	return {
		slots: schema.value?.props?.slots,
		'onUpdate:slots': (slots: Record<string, any>) => {
			if (schema.value && schema.value.props) {
				schema.value.props.slots = slots;
			}
		}
	};
});
</script>

<template>
	<a-list>
		<JsonRendererList
			tag="list-item"
			v-model:schema="schema"
			:put="false"
			:pull="false"
			:component-data="componentData"
		/>
	</a-list>
</template>
