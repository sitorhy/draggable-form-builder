<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import { ErrorCircle20Regular } from '@vicons/fluent';
import { message } from 'ant-design-vue';
import {useEmptyPropsInjection} from "engine-commons/components/put/common/props.ts";
import type {RendererItemDefinition} from "engine-commons/types.ts";
import {useEmptyBindingPath} from "engine-commons/components/put/common/binding-path.ts";
import {useBindingConnector} from "engine-commons/store/binding.ts";
import {useReferenceRegister} from "engine-commons/store/reference-context.ts";

const [messageApi] = message.useMessage();


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
	onError: (e: Error) => messageApi.error(e.message)
});

const modelValue = computed({
	get() {
		return queryBinding();
	},
	set(value: any) {
		updateBinding(value);
	}
});

const { componentRef } = useReferenceRegister(bindingPath);
</script>

<template>
	<a-date-picker
		v-if="schema.props"
		v-bind="{ ...schema.props, ...bindingProps }"
		v-model:value="modelValue"
		ref="componentRef"
	/>
  <a-empty v-else description="DatePicker">
    <template #description>
      <ErrorCircle20Regular/>
    </template>
  </a-empty>
</template>
