<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import { ErrorCircle20Regular } from '@vicons/fluent';
import JsonRenderer from '../JsonRenderer.vue';
import type {RendererItemDefinition} from "engine-commons/types.ts";
import {useEmptyBindingPath} from "engine-commons/components/put/common/binding-path.ts";
import {useEmptyPropsInjection} from "engine-commons/components/put/common/props.ts";
import {message} from "ant-design-vue";
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
	<a-radio-group
		class="renderer-item-container"
		v-if="schema.props && schema.children"
		v-bind="propsReduce"
		v-model:value="modelValue"
		ref="componentRef"
	>
		<JsonRenderer
			v-for="(containerSchema, index) in schema.children"
			:key="containerSchema.id"
			v-model:schema="schema.children[index]"
		/>
	</a-radio-group>
  <a-empty v-else description="RadioGroup">
    <template #description>
      <ErrorCircle20Regular/>
    </template>
  </a-empty>
</template>
