<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import { ErrorCircle20Regular } from '@vicons/fluent';
import type { RendererItemDefinition } from '../../../types.ts';
import { useEmptyPropsInjection } from '../common/props.ts';
import JsonRenderer from '../JsonRenderer.vue';

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
	<n-button
		v-if="schema.props && schema.children"
		v-emphasize:schemaId="schema.id"
		v-bind="{ ...schema.props, ...bindingProps }"
	>
		<JsonRenderer
			v-for="(containerSchema, index) in schema.children"
			:key="containerSchema.id"
			v-model:schema="schema.children[index]"
		/>
	</n-button>
	<n-empty v-else description="Button">
		<template #icon>
			<n-icon>
				<ErrorCircle20Regular />
			</n-icon>
		</template>
	</n-empty>
</template>
