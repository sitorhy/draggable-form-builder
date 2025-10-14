<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import { useMessage } from 'naive-ui';
import { ErrorCircle20Regular } from '@vicons/fluent';
import { useBindingConnector } from '../../../store/binding.ts';
import type { RendererItemDefinition } from '../../../types.ts';
import { useEmptyBindingPath } from '../common/binding-path.ts';
import { useEmptyPropsInjection } from '../common/props.ts';
import { useReferenceRegister } from '../../../store/reference-context.ts';

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

const propsReduce = computed(() => {
	return { ...schema.value.props, ...bindingProps.value };
});

// 兼容Antd引擎写法
const propsReduceMod = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { ['onUpdate:value']: rm, ...oops } = propsReduce.value;
	return oops;
});

const modelValue = computed({
	get() {
		return queryBinding();
	},
	set(value: any) {
		updateBinding(value);
		if (typeof propsReduce.value['onUpdate:value'] === 'function') {
			propsReduce.value['onUpdate:value'](value);
		}
	}
});

const { componentRef } = useReferenceRegister(bindingPath);
</script>

<template>
	<n-date-picker
		v-if="schema.props"
		v-bind="propsReduceMod"
		v-model:value="modelValue"
		v-emphasize:schemaId="schema.id"
		ref="componentRef"
	/>
	<n-empty v-else description="DatePicker">
		<template #icon>
			<n-icon>
				<ErrorCircle20Regular />
			</n-icon>
		</template>
	</n-empty>
</template>
