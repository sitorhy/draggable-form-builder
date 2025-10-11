<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import { ErrorCircle20Regular } from '@vicons/fluent';
import type { RendererItemDefinition } from '../../../types.ts';
import { useEmptyPropsInjection } from '../common/props.ts';

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({ type: '', id: '', children: undefined })
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

const katexText = computed(() => {
	return propsReduce.value.katex || '';
});

const style = computed(() => {
	return propsReduce.value.style || {};
});
</script>

<template>
	<div
		class="equation-container"
		:style="style"
		v-if="schema.props"
		v-emphasize:schemaId="schema.id"
	>
		<n-equation :value="katexText" />
	</div>
	<n-empty v-else description="Equation">
		<template #icon>
			<n-icon>
				<ErrorCircle20Regular />
			</n-icon>
		</template>
	</n-empty>
</template>

<style lang="scss" scoped>
.equation-container {
	display: inline-block;
	height: fit-content;
	--n-hegiht: 12px;
}
</style>
