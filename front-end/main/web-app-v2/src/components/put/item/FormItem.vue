<script setup lang="ts">
import { type ComputedRef, inject, provide } from 'vue';
import { ErrorCircle20Regular } from '@vicons/fluent';
import type { RendererItemDefinition } from '../../../types.ts';
import JsonRenderer from '../JsonRenderer.vue';
import { useEmptyPropsInjection } from '../common/props.ts';

defineOptions({
	name: 'FormItem'
});

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({ type: '', id: '', children: undefined })
});

const bindingPath = inject<ComputedRef<string>>('bindingPath');

const { emptyPropsInjection } = useEmptyPropsInjection();
const bindingProps = inject<ComputedRef<Record<string, any>>>(
	'bindingProps',
	emptyPropsInjection
);

provide('formItemBindingPath', bindingPath);
</script>

<template>
	<n-form-item
		v-if="schema.props && schema.children"
		v-emphasize:schemaId="schema.id"
		v-bind="{ ...schema.props, ...bindingProps }"
	>
		<JsonRenderer
			v-for="(containerSchema, index) in schema.children"
			:key="containerSchema.id"
			v-model:schema="schema.children[index]"
		/>
	</n-form-item>
	<n-empty v-else description="FormItem">
		<template #icon>
			<n-icon>
				<ErrorCircle20Regular />
			</n-icon>
		</template>
	</n-empty>
</template>
