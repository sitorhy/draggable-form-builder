<script setup lang="ts">
import {
	computed,
	type ComputedRef,
	inject,
	onBeforeMount,
	ref,
	watch
} from 'vue';
import { ErrorCircle20Regular } from '@vicons/fluent';
import type { RendererItemDefinition } from '../../../types.ts';
import JsonRenderer from '../JsonRenderer.vue';
import { useBindingConnector } from '../../../store/binding.ts';
import { useEmptyPropsInjection } from '../common/props.ts';
import { useReferenceRegister } from '../../../store/reference-context.ts';
import { useRulesResolver } from '../common/rules.ts';
import { useEmptyBindingPath } from '../common/binding-path.ts';

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({ type: '', id: '', children: undefined })
});

const { emptyBindingPath } = useEmptyBindingPath();
const bindingPath = inject<ComputedRef<string>>(
	'bindingPath',
	emptyBindingPath
);

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

const message = inject<
	ComputedRef<{
		info: (text: string) => void;
		success: (text: string) => void;
		error: (text: string) => void;
	}>
>('messageTool');

const { resolveRules } = useRulesResolver({
	getBindingPath: function () {
		return bindingPath.value;
	},
	getMessageTool: () => message?.value
});

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

const rulesResolved = ref({});

const rules = computed(() => {
	if (schema.value && schema.value.props && schema.value.props.rules) {
		return schema.value.props.rules;
	}
	return null;
});

watch(
	rules,
	async () => {
		if (rules.value) {
			rulesResolved.value = await resolveRules(rules.value);
		} else {
			rulesResolved.value = {};
		}
	},
	{
		immediate: true
	}
);

const { componentRef } = useReferenceRegister(bindingPath);
</script>

<template>
	<n-form
		v-if="schema.props && schema.children"
		v-emphasize:schemaId="schema.id"
		v-bind="{ ...schema.props, ...bindingProps }"
		:model="modelValue"
		:rules="rulesResolved"
		ref="componentRef"
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
