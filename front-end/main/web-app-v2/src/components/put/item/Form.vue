<script setup lang="ts">
import { computed, type ComputedRef, inject, onBeforeMount } from 'vue';
import { ErrorCircle20Regular } from '@vicons/fluent';
import type { RendererItemDefinition } from '../../../types.ts';
import JsonRenderer from '../JsonRenderer.vue';
import { useBindingConnector } from '../../../store/binding.ts';
import { useEmptyPropsInjection } from '../common/props.ts';

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

const connectorOptions = computed(() => {
	return {
		path: bindingPath ? bindingPath.value : ''
	};
});
const { updateBinding, queryBinding } = useBindingConnector(connectorOptions);

onBeforeMount(() => {
	const formValue = queryBinding();
	if (!formValue) {
		updateBinding({});
	}
});

const modelValue = computed({
	get() {
		return queryBinding();
	},
	set(value: any) {
		updateBinding(value);
	}
});
</script>

<template>
	<n-form
		v-if="schema.props && schema.children"
		v-emphasize:schemaId="schema.id"
		v-bind="{ ...schema.props, ...bindingProps }"
		v-model:value="modelValue"
	>
		<JsonRenderer
			v-for="(containerSchema, index) in schema.children"
			:key="containerSchema.id"
			v-model:schema="schema.children[index]"
		/>
	</n-form>
	<n-empty v-else description="Form">
		<template #icon>
			<n-icon>
				<ErrorCircle20Regular />
			</n-icon>
		</template>
	</n-empty>
</template>
