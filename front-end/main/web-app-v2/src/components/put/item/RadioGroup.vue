<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import { ErrorCircle20Regular } from '@vicons/fluent';
import type { RendererItemDefinition } from '../../../types.ts';
import { useEmptyPropsInjection } from '../common/props.ts';
import JsonRenderer from '../JsonRenderer.vue';
import { useBindingConnector } from '../../../store/binding.ts';
import { useEmptyBindingPath } from '../common/binding-path.ts';
import { useMessage } from 'naive-ui';

const message = useMessage();

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({ type: '', id: '', children: undefined })
});

const { emptyBindingPath } = useEmptyBindingPath();

const bindingPath = inject<ComputedRef<string>>(
	'bindingPath',
	emptyBindingPath
);
const formItemBindingPath = inject<ComputedRef<string>>(
	'formItemBindingPath',
	emptyBindingPath
);

const { emptyPropsInjection } = useEmptyPropsInjection();
const bindingProps = inject<ComputedRef<Record<string, any>>>(
	'bindingProps',
	emptyPropsInjection
);

const propsReduce = computed(() => ({
	...schema.value.props,
	...bindingProps.value
}));

const connectorOptions = computed(() => {
	return {
		path: formItemBindingPath?.value || bindingPath?.value || ''
	};
});

const { updateBinding, queryBinding } = useBindingConnector(connectorOptions, {
	onError: (e: Error) => message.error(e.message)
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
	<n-radio-group
		class="renderer-item-container"
		v-emphasize:schemaId="schema.id"
		v-if="schema.props && schema.children"
		v-bind="propsReduce"
		v-model:value="modelValue"
	>
		<JsonRenderer
			v-for="(containerSchema, index) in schema.children"
			:key="containerSchema.id"
			v-model:schema="schema.children[index]"
		/>
	</n-radio-group>
	<n-empty v-else description="RadioGroup">
		<template #icon>
			<n-icon>
				<ErrorCircle20Regular />
			</n-icon>
		</template>
	</n-empty>
</template>
