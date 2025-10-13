<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import { ErrorCircle20Regular } from '@vicons/fluent';
import {useEmptyPropsInjection} from "engine-commons/components/put/common/props.ts";
import type {RendererItemDefinition} from "engine-commons/types.ts";

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
</script>

<template>
	<a-image
		v-if="schema.props"
		v-bind="propsReduce"
	/>
  <a-empty v-else description="Image">
    <template #description>
      <ErrorCircle20Regular/>
    </template>
  </a-empty>
</template>
