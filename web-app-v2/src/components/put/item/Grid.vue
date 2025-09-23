<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import { ErrorCircle20Regular } from '@vicons/fluent';
import type { RendererItemDefinition } from '../../../types.ts';
import JsonRenderer from '../JsonRenderer.vue';
import { useEmptyPropsInjection } from '../common/props.ts';

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({ type: '', id: '', children: undefined })
});

const id = computed(function () {
	return schema.value.id;
});

const { emptyPropsInjection } = useEmptyPropsInjection();
const bindingProps = inject<ComputedRef<Record<string, any>>>(
	'bindingProps',
	emptyPropsInjection
);

defineExpose({
	id: id.value
});
</script>

<template>
	<n-grid
		v-if="schema.props && schema.children"
		v-emphasize:schemaId="schema.id"
		v-bind="{ ...schema.props, ...bindingProps }"
	>
		<n-gi v-for="(cellSchema, index) in schema.children" :key="cellSchema.id">
			<JsonRenderer v-model:schema="schema.children[index]" />
		</n-gi>
	</n-grid>
	<n-empty v-else description="Grid">
		<template #icon>
			<n-icon>
				<ErrorCircle20Regular />
			</n-icon>
		</template>
	</n-empty>
</template>
