<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import { useMessage } from 'naive-ui';
import { ErrorCircle20Regular } from '@vicons/fluent';
import { useBindingConnector } from '../../../store/binding.ts';
import type { RendererItemDefinition } from '../../../types.ts';
import { useEmptyBindingPath } from '../common/binding-path.ts';
import { useEmptyPropsInjection } from '../common/props.ts';

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
	<n-input
		v-emphasize:schemaId="schema.id"
		v-if="schema.props"
		v-bind="{ ...schema.props, ...bindingProps }"
		v-model:value="modelValue"
	/>
	<n-empty v-else description="TextInput">
		<template #icon>
			<n-icon>
				<ErrorCircle20Regular />
			</n-icon>
		</template>
	</n-empty>
</template>
