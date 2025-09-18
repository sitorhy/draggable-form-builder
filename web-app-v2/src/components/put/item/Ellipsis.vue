<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import { ErrorCircle20Regular } from '@vicons/fluent';
import type { RendererItemDefinition } from '../../../types.ts';
import { useEmptyPropsInjection } from '../common/props.ts';

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

const propsReduce = computed(() => ({
	...schema.value.props,
	...bindingProps.value
}));

const text = computed(function () {
	return propsReduce.value.text || '';
});

defineExpose({
	id: id.value
});
</script>

<template>
	<n-ellipsis v-if="schema.props" v-bind="propsReduce">{{ text }}</n-ellipsis>
	<n-empty v-else description="Ellipsis">
		<template #icon>
			<n-icon>
				<ErrorCircle20Regular />
			</n-icon>
		</template>
	</n-empty>
</template>
