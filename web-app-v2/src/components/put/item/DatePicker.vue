<script setup lang="ts">
import { computed, type ComputedRef, inject, ref } from 'vue';
import { useMessage } from 'naive-ui';
import { ErrorCircle20Regular } from '@vicons/fluent';
import { useBindingConnector } from '../../../store/binding.ts';
import type { RendererItemDefinition } from '../../../types.ts';

const message = useMessage();

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({ type: '', id: '', children: undefined })
});

const id = computed(function () {
	return schema.value.id;
});

const bindingPath = inject<ComputedRef<string>>('bindingPath');
const bindingProps = inject<Record<string, any> | null>('bindingProps', null);

const connectorOptions = computed(() => {
	return {
		path: bindingPath ? bindingPath.value : ''
	};
});
const { updateBinding, queryBinding } = useBindingConnector(connectorOptions, {
	onBindingChange: function (newVal: any) {
		if (newVal !== innerValue.value) {
			innerValue.value = newVal;
		}
	},
	onError: (e: Error) => message.error(e.message)
});
const innerValue = ref(queryBinding());

defineExpose({
	id: id.value
});
</script>

<template>
	<n-date-picker
		v-if="schema.props"
		v-bind="{ ...schema.props, ...bindingProps }"
		v-model:value="innerValue"
		@update-value="updateBinding"
	/>
	<n-empty v-else description="DatePicker">
		<template #icon>
			<n-icon>
				<ErrorCircle20Regular />
			</n-icon>
		</template>
	</n-empty>
</template>
