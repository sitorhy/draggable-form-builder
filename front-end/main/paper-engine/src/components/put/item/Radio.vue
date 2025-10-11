<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import type { RendererItemDefinition } from 'engine-commons/types.ts';
import { useEmptyPropsInjection } from 'engine-commons/components/put/common/props.ts';

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
	<div class="radio">
    <span>{{ propsReduce.value }}. </span>
    <span>{{ propsReduce.label }}</span>
  </div>
</template>
